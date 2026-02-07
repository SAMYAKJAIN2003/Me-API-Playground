import { Router } from 'express';
import { getDb } from '../db/database.js';

const router = Router();

// list all skills, optionally filter by category
router.get('/', (req, res) => {
    try {
        const db = getDb();
        const { category } = req.query;

        let query = 'SELECT * FROM skills WHERE profile_id = 1';
        const params = [];

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        query += ' ORDER BY category, name';

        const skills = db.prepare(query).all(...params);
        res.json(skills);

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'failed to get skills' });
    }
});

// get top skills ranked by how many projects use them
router.get('/top', (req, res) => {
    try {
        const db = getDb();
        const limit = parseInt(req.query.limit) || 5;

        const skills = db.prepare(`
            SELECT s.*, COUNT(ps.project_id) as project_count
            FROM skills s
            LEFT JOIN project_skills ps ON s.id = ps.skill_id
            WHERE s.profile_id = 1
            GROUP BY s.id
            ORDER BY project_count DESC
            LIMIT ?
        `).all(limit);

        res.json(skills);

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'failed to get top skills' });
    }
});

// skills grouped by category
router.get('/categories', (req, res) => {
    try {
        const db = getDb();

        const skills = db.prepare(
            'SELECT * FROM skills WHERE profile_id = 1 ORDER BY category, name'
        ).all();

        // group them up
        const grouped = {};
        skills.forEach(s => {
            const cat = s.category || 'Other';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(s);
        });

        res.json(grouped);

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'failed to get categories' });
    }
});

// add a skill
router.post('/', (req, res) => {
    try {
        const db = getDb();
        const { name, category, proficiency_level } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'name is required' });
        }

        const result = db.prepare(`
            INSERT INTO skills (profile_id, name, category, proficiency_level)
            VALUES (1, ?, ?, ?)
        `).run(name, category || null, proficiency_level || 'intermediate');

        const skill = db.prepare('SELECT * FROM skills WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json(skill);

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'failed to add skill' });
    }
});

// remove a skill
router.delete('/:id', (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;

        const skill = db.prepare('SELECT * FROM skills WHERE id = ?').get(id);
        if (!skill) {
            return res.status(404).json({ error: 'skill not found' });
        }

        db.prepare('DELETE FROM skills WHERE id = ?').run(id);
        res.json({ message: 'deleted', skill });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'failed to delete' });
    }
});

export default router;
