import { Router } from 'express';
import { getDb } from '../db/database.js';

const router = Router();

// get all work experience
router.get('/', (req, res) => {
    try {
        const db = getDb();
        const work = db.prepare(
            'SELECT * FROM work_experience WHERE profile_id = 1 ORDER BY start_date DESC'
        ).all();
        res.json(work);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'failed to get work experience' });
    }
});

// add work experience
router.post('/', (req, res) => {
    try {
        const db = getDb();
        const { title, company, location, start_date, end_date, is_current, description } = req.body;

        if (!title || !company) {
            return res.status(400).json({ error: 'title and company required' });
        }

        const result = db.prepare(`
            INSERT INTO work_experience (profile_id, title, company, location, start_date, end_date, is_current, description)
            VALUES (1, ?, ?, ?, ?, ?, ?, ?)
        `).run(title, company, location || null, start_date || null, end_date || null, is_current ? 1 : 0, description || null);

        const entry = db.prepare('SELECT * FROM work_experience WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json(entry);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'failed to add' });
    }
});

// update work experience
router.put('/:id', (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;
        const fields = req.body;

        const existing = db.prepare('SELECT * FROM work_experience WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'not found' });
        }

        const updates = [];
        const values = [];

        ['title', 'company', 'location', 'start_date', 'end_date', 'description'].forEach(f => {
            if (fields[f] !== undefined) {
                updates.push(`${f} = ?`);
                values.push(fields[f]);
            }
        });
        if (fields.is_current !== undefined) {
            updates.push('is_current = ?');
            values.push(fields.is_current ? 1 : 0);
        }

        if (updates.length > 0) {
            values.push(id);
            db.prepare(`UPDATE work_experience SET ${updates.join(', ')} WHERE id = ?`).run(...values);
        }

        const updated = db.prepare('SELECT * FROM work_experience WHERE id = ?').get(id);
        res.json(updated);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'failed to update' });
    }
});

// delete work experience
router.delete('/:id', (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;

        const existing = db.prepare('SELECT * FROM work_experience WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'not found' });
        }

        db.prepare('DELETE FROM work_experience WHERE id = ?').run(id);
        res.json({ message: 'deleted' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'failed to delete' });
    }
});

export default router;
