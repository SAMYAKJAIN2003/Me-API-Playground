import { Router } from 'express';
import { getDb } from '../db/database.js';

const router = Router();

// get all projects, can filter by skill
router.get('/', (req, res) => {
    try {
        const db = getDb();
        const { skill, featured } = req.query;

        let query = `
            SELECT p.*, GROUP_CONCAT(s.name) as skill_names
            FROM projects p
            LEFT JOIN project_skills ps ON p.id = ps.project_id
            LEFT JOIN skills s ON ps.skill_id = s.id
            WHERE p.profile_id = 1
        `;

        if (featured === 'true') {
            query += ' AND p.is_featured = 1';
        }

        query += ' GROUP BY p.id';

        // filter by skill if provided
        if (skill) {
            query = `
                SELECT DISTINCT p.*, GROUP_CONCAT(s2.name) as skill_names
                FROM projects p
                JOIN project_skills ps ON p.id = ps.project_id
                JOIN skills s ON ps.skill_id = s.id
                LEFT JOIN project_skills ps2 ON p.id = ps2.project_id
                LEFT JOIN skills s2 ON ps2.skill_id = s2.id
                WHERE p.profile_id = 1 AND LOWER(s.name) LIKE ?
                GROUP BY p.id
            `;
        }

        query += ' ORDER BY p.is_featured DESC, p.created_at DESC';

        const projects = skill
            ? db.prepare(query).all(`%${skill.toLowerCase()}%`)
            : db.prepare(query).all();

        // convert skill_names to array
        const formatted = projects.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            github_url: p.github_url,
            live_url: p.live_url,
            image_url: p.image_url,
            start_date: p.start_date,
            end_date: p.end_date,
            is_featured: p.is_featured === 1,
            skills: p.skill_names ? p.skill_names.split(',') : []
        }));

        res.json(formatted);

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'failed to get projects' });
    }
});

// get single project
router.get('/:id', (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;

        const project = db.prepare(`
            SELECT p.*, GROUP_CONCAT(s.name) as skill_names
            FROM projects p
            LEFT JOIN project_skills ps ON p.id = ps.project_id
            LEFT JOIN skills s ON ps.skill_id = s.id
            WHERE p.id = ?
            GROUP BY p.id
        `).get(id);

        if (!project) {
            return res.status(404).json({ error: 'project not found' });
        }

        res.json({
            ...project,
            is_featured: project.is_featured === 1,
            skills: project.skill_names ? project.skill_names.split(',') : []
        });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'failed to get project' });
    }
});

// add new project
router.post('/', (req, res) => {
    try {
        const db = getDb();
        const { title, description, github_url, live_url, image_url, is_featured, skills } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'title is required' });
        }

        const result = db.prepare(`
            INSERT INTO projects (profile_id, title, description, github_url, live_url, image_url, is_featured)
            VALUES (1, ?, ?, ?, ?, ?, ?)
        `).run(title, description || null, github_url || null, live_url || null, image_url || null, is_featured ? 1 : 0);

        const projectId = result.lastInsertRowid;

        // link skills if provided
        if (skills && skills.length > 0) {
            const linkSkill = db.prepare(`
                INSERT INTO project_skills (project_id, skill_id)
                SELECT ?, id FROM skills WHERE LOWER(name) = LOWER(?) AND profile_id = 1
            `);

            skills.forEach(s => linkSkill.run(projectId, s));
        }

        const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
        res.status(201).json(project);

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'failed to add project' });
    }
});

// update project
router.put('/:id', (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;
        const { title, description, github_url, live_url, image_url, is_featured } = req.body;

        const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'project not found' });
        }

        const updates = [];
        const values = [];

        if (title) { updates.push('title = ?'); values.push(title); }
        if (description !== undefined) { updates.push('description = ?'); values.push(description); }
        if (github_url !== undefined) { updates.push('github_url = ?'); values.push(github_url); }
        if (live_url !== undefined) { updates.push('live_url = ?'); values.push(live_url); }
        if (image_url !== undefined) { updates.push('image_url = ?'); values.push(image_url); }
        if (is_featured !== undefined) { updates.push('is_featured = ?'); values.push(is_featured ? 1 : 0); }

        if (updates.length > 0) {
            values.push(id);
            db.prepare(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`).run(...values);
        }

        const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
        res.json(updated);

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'failed to update' });
    }
});

// delete project
router.delete('/:id', (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;

        const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
        if (!project) {
            return res.status(404).json({ error: 'project not found' });
        }

        db.prepare('DELETE FROM project_skills WHERE project_id = ?').run(id);
        db.prepare('DELETE FROM projects WHERE id = ?').run(id);

        res.json({ message: 'deleted' });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'failed to delete' });
    }
});

export default router;
