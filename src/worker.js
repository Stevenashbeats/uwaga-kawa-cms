/**
 * Cloudflare Worker - API dla systemu menu CMS
 */

import { Router } from 'itty-router';
import { nanoid } from 'nanoid';

const router = Router();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Helper: JSON response
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// Helper: Error response
function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}

// Helper: Verify JWT (simplified - w produkcji użyj prawdziwego JWT)
async function verifyAuth(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  // W produkcji: zweryfikuj JWT token
  // Na razie: prosty token = username
  
  const user = await env.DB.prepare(
    'SELECT u.*, v.theme FROM users u JOIN venues v ON u.venue_id = v.id WHERE u.username = ?'
  ).bind(token).first();
  
  return user;
}

// OPTIONS handler dla CORS
router.options('*', () => new Response(null, { headers: corsHeaders }));

// ===== AUTH ENDPOINTS =====

// POST /api/auth/login
router.post('/api/auth/login', async (request, env) => {
  try {
    const { username, password } = await request.json();
    
    const user = await env.DB.prepare(
      `SELECT u.*, v.theme, v.display_name as venue_display_name 
       FROM users u 
       JOIN venues v ON u.venue_id = v.id 
       WHERE u.username = ? AND u.password_hash = ?`
    ).bind(username, password).first();
    
    if (!user) {
      return errorResponse('Invalid credentials', 401);
    }
    
    // W produkcji: wygeneruj prawdziwy JWT token
    const token = user.username;
    
    return jsonResponse({
      token,
      user: {
        id: user.id,
        username: user.username,
        venueId: user.venue_id,
        venueName: user.venue_display_name,
        theme: user.theme,
        role: user.role,
      },
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// ===== TV ENDPOINTS =====

// GET /api/tvs - Get all TVs for authenticated user's venue
router.get('/api/tvs', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }
    
    const tvs = await env.DB.prepare(
      'SELECT * FROM tvs WHERE venue_id = ? ORDER BY display_order'
    ).bind(user.venue_id).all();
    
    return jsonResponse(tvs.results);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// GET /api/tvs/:id - Get single TV with all sections and items
router.get('/api/tvs/:id', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }
    
    const { id } = request.params;
    
    // Get TV
    const tv = await env.DB.prepare(
      'SELECT * FROM tvs WHERE id = ? AND venue_id = ?'
    ).bind(id, user.venue_id).first();
    
    if (!tv) {
      return errorResponse('TV not found', 404);
    }
    
    // Get sections
    const sections = await env.DB.prepare(
      'SELECT * FROM menu_sections WHERE tv_id = ? ORDER BY display_order'
    ).bind(id).all();
    
    // Get items for each section
    for (const section of sections.results) {
      const items = await env.DB.prepare(
        'SELECT * FROM menu_items WHERE section_id = ? ORDER BY display_order'
      ).bind(section.id).all();
      section.items = items.results;
    }
    
    tv.sections = sections.results;
    
    return jsonResponse(tv);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// GET /api/tvs/:id/public - Public endpoint for TV display (no auth required)
router.get('/api/tvs/:id/public', async (request, env) => {
  try {
    const { id } = request.params;
    
    // Get TV (no venue check - public)
    const tv = await env.DB.prepare(
      'SELECT * FROM tvs WHERE id = ?'
    ).bind(id).first();
    
    if (!tv) {
      return errorResponse('TV not found', 404);
    }
    
    // Get sections
    const sections = await env.DB.prepare(
      'SELECT * FROM menu_sections WHERE tv_id = ? ORDER BY display_order'
    ).bind(id).all();
    
    // Get items for each section
    for (const section of sections.results) {
      const items = await env.DB.prepare(
        'SELECT * FROM menu_items WHERE section_id = ? ORDER BY display_order'
      ).bind(section.id).all();
      section.items = items.results;
    }
    
    tv.sections = sections.results;
    
    return jsonResponse(tv);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// POST /api/tvs - Create new TV
router.post('/api/tvs', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }
    
    const { name, venueName, venueSubtitle } = await request.json();
    const id = `tv_${nanoid(10)}`;
    
    await env.DB.prepare(
      `INSERT INTO tvs (id, venue_id, name, venue_name, venue_subtitle, display_order)
       VALUES (?, ?, ?, ?, ?, (SELECT COALESCE(MAX(display_order), 0) + 1 FROM tvs WHERE venue_id = ?))`
    ).bind(id, user.venue_id, name, venueName, venueSubtitle || '', user.venue_id).run();
    
    const tv = await env.DB.prepare('SELECT * FROM tvs WHERE id = ?').bind(id).first();
    
    return jsonResponse(tv, 201);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// PUT /api/tvs/:id - Update TV
router.put('/api/tvs/:id', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }
    
    const { id } = request.params;
    const body = await request.json();
    const { name, venueName, venueSubtitle, fontScale, logoScale, lineHeight, fontSectionTitle, fontItemName, fontItemDescription, fontItemPrice, fontSectionNote } = body;
    
    console.log('📥 Received fontScale:', fontScale);
    console.log('📥 Received logoScale:', logoScale);
    console.log('📥 Full body:', body);
    
    await env.DB.prepare(
      `UPDATE tvs SET name = ?, venue_name = ?, venue_subtitle = ?, font_scale = ?, logo_scale = ?, line_height = ?,
       font_section_title = ?, font_item_name = ?, font_item_description = ?, font_item_price = ?, font_section_note = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND venue_id = ?`
    ).bind(
      name, venueName, venueSubtitle || '', fontScale || 100, logoScale || 100, lineHeight || 1.2,
      fontSectionTitle || 48, fontItemName || 32, fontItemDescription || 18, fontItemPrice || 36, fontSectionNote || 16,
      id, user.venue_id
    ).run();
    
    const tv = await env.DB.prepare('SELECT * FROM tvs WHERE id = ?').bind(id).first();
    console.log('📤 Returning font_scale:', tv.font_scale);
    console.log('📤 Returning logo_scale:', tv.logo_scale);
    
    return jsonResponse(tv);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// DELETE /api/tvs/:id - Delete TV
router.delete('/api/tvs/:id', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }
    
    const { id } = request.params;
    
    await env.DB.prepare(
      'DELETE FROM tvs WHERE id = ? AND venue_id = ?'
    ).bind(id, user.venue_id).run();
    
    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// ===== SECTION ENDPOINTS =====

// POST /api/tvs/:tvId/sections - Create section
router.post('/api/tvs/:tvId/sections', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }
    
    const { tvId } = request.params;
    const { title, note } = await request.json();
    const id = `section_${nanoid(10)}`;
    
    await env.DB.prepare(
      `INSERT INTO menu_sections (id, tv_id, title, note, display_order)
       VALUES (?, ?, ?, ?, (SELECT COALESCE(MAX(display_order), 0) + 1 FROM menu_sections WHERE tv_id = ?))`
    ).bind(id, tvId, title, note || '', tvId).run();
    
    const section = await env.DB.prepare('SELECT * FROM menu_sections WHERE id = ?').bind(id).first();
    
    return jsonResponse(section, 201);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// PUT /api/sections/:id - Update section
router.put('/api/sections/:id', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }
    
    const { id } = request.params;
    const { title, note } = await request.json();
    
    await env.DB.prepare(
      `UPDATE menu_sections SET title = ?, note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(title, note || '', id).run();
    
    const section = await env.DB.prepare('SELECT * FROM menu_sections WHERE id = ?').bind(id).first();
    
    return jsonResponse(section);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// DELETE /api/sections/:id - Delete section
router.delete('/api/sections/:id', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }
    
    const { id } = request.params;
    
    await env.DB.prepare('DELETE FROM menu_sections WHERE id = ?').bind(id).run();
    
    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// ===== ITEM ENDPOINTS =====

// POST /api/sections/:sectionId/items - Create item
router.post('/api/sections/:sectionId/items', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }
    
    const { sectionId } = request.params;
    const { name, description, price } = await request.json();
    const id = `item_${nanoid(10)}`;
    
    await env.DB.prepare(
      `INSERT INTO menu_items (id, section_id, name, description, price, display_order)
       VALUES (?, ?, ?, ?, ?, (SELECT COALESCE(MAX(display_order), 0) + 1 FROM menu_items WHERE section_id = ?))`
    ).bind(id, sectionId, name, description || '', price || '', sectionId).run();
    
    const item = await env.DB.prepare('SELECT * FROM menu_items WHERE id = ?').bind(id).first();
    
    return jsonResponse(item, 201);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// PUT /api/items/:id - Update item
router.put('/api/items/:id', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }
    
    const { id } = request.params;
    const { name, description, price } = await request.json();
    
    await env.DB.prepare(
      `UPDATE menu_items SET name = ?, description = ?, price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(name, description || '', price || '', id).run();
    
    const item = await env.DB.prepare('SELECT * FROM menu_items WHERE id = ?').bind(id).first();
    
    return jsonResponse(item);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// DELETE /api/items/:id - Delete item
router.delete('/api/items/:id', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }
    
    const { id } = request.params;
    
    await env.DB.prepare('DELETE FROM menu_items WHERE id = ?').bind(id).run();
    
    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// ===== TV LINK ENDPOINTS (dla TV mode) =====

// POST /api/tvs/:tvId/link - Generate shareable link
router.post('/api/tvs/:tvId/link', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }
    
    const { tvId } = request.params;
    const token = nanoid(32);
    const id = `link_${nanoid(10)}`;
    
    await env.DB.prepare(
      'INSERT INTO tv_links (id, tv_id, token) VALUES (?, ?, ?)'
    ).bind(id, tvId, token).run();
    
    return jsonResponse({ token, url: `/tv?token=${token}` });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// GET /api/tv/:token - Get TV by token (public endpoint)
router.get('/api/tv/:token', async (request, env) => {
  try {
    const { token } = request.params;
    
    const link = await env.DB.prepare(
      'SELECT tv_id FROM tv_links WHERE token = ?'
    ).bind(token).first();
    
    if (!link) {
      return errorResponse('Invalid token', 404);
    }
    
    // Get TV with sections and items
    const tv = await env.DB.prepare('SELECT * FROM tvs WHERE id = ?').bind(link.tv_id).first();
    
    if (!tv) {
      return errorResponse('TV not found', 404);
    }
    
    const sections = await env.DB.prepare(
      'SELECT * FROM menu_sections WHERE tv_id = ? ORDER BY display_order'
    ).bind(link.tv_id).all();
    
    for (const section of sections.results) {
      const items = await env.DB.prepare(
        'SELECT * FROM menu_items WHERE section_id = ? ORDER BY display_order'
      ).bind(section.id).all();
      section.items = items.results;
    }
    
    tv.sections = sections.results;
    
    return jsonResponse(tv);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// ===== IMAGE UPLOAD (R2) =====

// POST /api/upload - Upload image to R2
router.post('/api/upload', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }
    
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return errorResponse('No file provided', 400);
    }
    
    const filename = `${user.venue_id}/${nanoid(10)}_${file.name}`;
    await env.ASSETS.put(filename, file.stream());
    
    const url = `https://assets.uwaga-kawa.com/${filename}`; // Dostosuj do swojej domeny
    
    return jsonResponse({ url });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
});

// 404 handler
router.all('*', () => errorResponse('Not found', 404));

// Main worker handler
export default {
  async fetch(request, env, ctx) {
    return router.handle(request, env, ctx);
  },
};
