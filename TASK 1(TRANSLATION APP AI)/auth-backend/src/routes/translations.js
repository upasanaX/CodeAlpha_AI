// src/routes/translations.js
const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Enforce authentication on all translation management endpoints
router.use(authenticateToken);

// -------------------------------------------------------------
// POST /translations
// Save translation for the authenticated user
// -------------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const { source_text, translated_text, source_language, target_language } = req.body;

    if (!source_text || !translated_text || !target_language) {
      return res.status(400).json({
        error: 'Missing required fields: source_text, translated_text, and target_language are mandatory.',
      });
    }

    const result = await pool.query(
      `INSERT INTO translations (user_id, source_text, translated_text, source_language, target_language)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, source_text, translated_text, source_language, target_language, created_at`,
      [
        req.user.userId,
        source_text.trim(),
        translated_text.trim(),
        source_language ? source_language.trim() : 'auto',
        target_language.trim(),
      ]
    );

    return res.status(201).json({
      message: 'Translation saved to your account.',
      translation: result.rows[0],
    });
  } catch (error) {
    console.error('Save translation error:', error);
    return res.status(500).json({ error: 'Failed to save translation.' });
  }
});

// -------------------------------------------------------------
// GET /translations
// List saved translations for the user (newest first, paginated)
// -------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

    const [itemsResult, countResult] = await Promise.all([
      pool.query(
        `SELECT id, source_text, translated_text, source_language, target_language, created_at
         FROM translations
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [req.user.userId, limit, offset]
      ),
      pool.query('SELECT COUNT(*) FROM translations WHERE user_id = $1', [req.user.userId]),
    ]);

    const total = parseInt(countResult.rows[0].count, 10);

    return res.status(200).json({
      translations: itemsResult.rows,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + itemsResult.rows.length < total,
      },
    });
  } catch (error) {
    console.error('Fetch translations error:', error);
    return res.status(500).json({ error: 'Failed to fetch translations.' });
  }
});

// -------------------------------------------------------------
// DELETE /translations/:id
// Delete translation belonging to the user
// -------------------------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const translationId = parseInt(req.params.id, 10);
    if (isNaN(translationId)) {
      return res.status(400).json({ error: 'Invalid translation ID format.' });
    }

    const result = await pool.query(
      'DELETE FROM translations WHERE id = $1 AND user_id = $2 RETURNING id',
      [translationId, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Translation not found or unauthorized to delete.' });
    }

    return res.status(200).json({ message: 'Translation deleted successfully.', id: translationId });
  } catch (error) {
    console.error('Delete translation error:', error);
    return res.status(500).json({ error: 'Failed to delete translation.' });
  }
});

module.exports = router;
