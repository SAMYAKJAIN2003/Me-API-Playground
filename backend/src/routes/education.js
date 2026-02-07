import { Router } from 'express';
import { getDb } from '../db/database.js';

const router = Router();

// get all education entries
router.get('/', (req, res) => {
    try {
        const db = getDb();
        const education = db.prepare(
            'SELECT * FROM education WHERE profile_id = 1 ORDER BY end_year DESC'
        ).all();
        res.json(education);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'failed to get education' });
    }
});

// add education
router.post('/', (req, res) => {
    try {
        const db = getDb();
        const { degree, institution, field_of_study, start_year, end_year, gpa, description } = req.body;

        if (!degree || !institution) {
            return res.status(400).json({ error: 'degree and institution required' });
        }

        const result = db.prepare(`
            INSERT INTO education (profile_id, degree, institution, field_of_study, start_year, end_year, gpa, description)
            VALUES (1, ?, ?, ?, ?, ?, ?, ?)
        `).run(degree, institution, field_of_study || null, start_year || null, end_year || null, gpa || null, description || null);

        const entry = db.prepare('SELECT * FROM education WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json(entry);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'failed to add' });
    }
});

// update education
router.put('/:id', (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;
        const fields = req.body;

        const existing = db.prepare('SELECT * FROM education WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'not found' });
        }

        const updates = [];
        const values = [];

        ['degree', 'institution', 'field_of_study', 'start_year', 'end_year', 'gpa', 'description'].forEach(f => {
            if (fields[f] !== undefined) {
                updates.push(`${f} = ?`);
                values.push(fields[f]);
            }
        });

        if (updates.length > 0) {
            values.push(id);
            db.prepare(`UPDATE education SET ${updates.join(', ')} WHERE id = ?`).run(...values);
        }

        const updated = db.prepare('SELECT * FROM education WHERE id = ?').get(id);
        res.json(updated);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'failed to update' });
    }
});

// delete education
router.delete('/:id', (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;

        const existing = db.prepare('SELECT * FROM education WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'not found' });
        }

        db.prepare('DELETE FROM education WHERE id = ?').run(id);
        res.json({ message: 'deleted' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'failed to delete' });
    }
});

export default router;
