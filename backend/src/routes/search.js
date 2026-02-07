import { Router } from 'express';
import { getDb } from '../db/database.js';

const router = Router();

// search across profile, projects, and skills
router.get('/', (req, res) => {
    try {
        const db = getDb();
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.status(400).json({ error: 'search query required' });
        }

        const term = `%${q.toLowerCase()}%`;

        // search profile
        const profile = db.prepare(`
            SELECT * FROM profile 
            WHERE LOWER(name) LIKE ? OR LOWER(bio) LIKE ?
        `).all(term, term);

        // search skills
        const skills = db.prepare(`
            SELECT * FROM skills 
            WHERE profile_id = 1 AND (LOWER(name) LIKE ? OR LOWER(category) LIKE ?)
        `).all(term, term);

        // search projects by title/description
        const projectsByText = db.prepare(`
            SELECT p.*, GROUP_CONCAT(s.name) as skill_names, 'text' as matched_via
            FROM projects p
            LEFT JOIN project_skills ps ON p.id = ps.project_id
            LEFT JOIN skills s ON ps.skill_id = s.id
            WHERE p.profile_id = 1 AND (LOWER(p.title) LIKE ? OR LOWER(p.description) LIKE ?)
            GROUP BY p.id
        `).all(term, term);

        // search projects by skill name
        const projectsBySkill = db.prepare(`
            SELECT DISTINCT p.*, GROUP_CONCAT(DISTINCT s2.name) as skill_names, 'skill' as matched_via
            FROM projects p
            JOIN project_skills ps ON p.id = ps.project_id
            JOIN skills s ON ps.skill_id = s.id
            LEFT JOIN project_skills ps2 ON p.id = ps2.project_id
            LEFT JOIN skills s2 ON ps2.skill_id = s2.id
            WHERE p.profile_id = 1 AND LOWER(s.name) LIKE ?
            GROUP BY p.id
        `).all(term);

        // combine and dedupe projects
        const projectMap = new Map();
        [...projectsByText, ...projectsBySkill].forEach(p => {
            if (!projectMap.has(p.id)) {
                projectMap.set(p.id, {
                    ...p,
                    skills: p.skill_names ? p.skill_names.split(',') : []
                });
            }
        });

        const projects = Array.from(projectMap.values());

        res.json({
            query: q,
            profile,
            projects,
            skills,
            total_results: profile.length + projects.length + skills.length
        });

    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ error: 'search failed' });
    }
});

export default router;
