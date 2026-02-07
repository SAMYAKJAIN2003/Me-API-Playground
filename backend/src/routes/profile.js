import { Router } from 'express';
import { getDb } from '../db/database.js';

const router = Router();

// get full profile with all the related stuff
router.get('/', (req, res) => {
    try {
        const db = getDb();

        const profile = db.prepare('SELECT * FROM profile LIMIT 1').get();

        if (!profile) {
            return res.status(404).json({ error: 'no profile found' });
        }

        // grab all the related data
        const education = db.prepare(
            'SELECT * FROM education WHERE profile_id = ? ORDER BY end_year DESC'
        ).all(profile.id);

        const work = db.prepare(
            'SELECT * FROM work_experience WHERE profile_id = ? ORDER BY start_date DESC'
        ).all(profile.id);

        const skills = db.prepare(
            'SELECT * FROM skills WHERE profile_id = ? ORDER BY category, name'
        ).all(profile.id);

        // get projects with their skills
        const projects = db.prepare(`
            SELECT p.*, GROUP_CONCAT(s.name) as skill_names
            FROM projects p
            LEFT JOIN project_skills ps ON p.id = ps.project_id
            LEFT JOIN skills s ON ps.skill_id = s.id
            WHERE p.profile_id = ?
            GROUP BY p.id
            ORDER BY p.is_featured DESC, p.created_at DESC
        `).all(profile.id);

        // format projects - turn skill string into array
        const formattedProjects = projects.map(p => ({
            ...p,
            skills: p.skill_names ? p.skill_names.split(',') : []
        }));

        res.json({
            ...profile,
            links: {
                github: profile.github_url,
                linkedin: profile.linkedin_url,
                portfolio: profile.portfolio_url,
                resume: profile.resume_url
            },
            education,
            work_experience: work,
            skills,
            projects: formattedProjects
        });

    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ error: 'failed to fetch profile' });
    }
});

// update profile
router.put('/', (req, res) => {
    try {
        const db = getDb();
        const { name, email, bio, github_url, linkedin_url, portfolio_url, resume_url } = req.body;

        const profile = db.prepare('SELECT id FROM profile LIMIT 1').get();

        if (!profile) {
            return res.status(404).json({ error: 'no profile to update' });
        }

        const updates = [];
        const values = [];

        if (name) { updates.push('name = ?'); values.push(name); }
        if (email) { updates.push('email = ?'); values.push(email); }
        if (bio !== undefined) { updates.push('bio = ?'); values.push(bio); }
        if (github_url !== undefined) { updates.push('github_url = ?'); values.push(github_url); }
        if (linkedin_url !== undefined) { updates.push('linkedin_url = ?'); values.push(linkedin_url); }
        if (portfolio_url !== undefined) { updates.push('portfolio_url = ?'); values.push(portfolio_url); }
        if (resume_url !== undefined) { updates.push('resume_url = ?'); values.push(resume_url); }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'nothing to update' });
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(profile.id);

        db.prepare(`UPDATE profile SET ${updates.join(', ')} WHERE id = ?`).run(...values);

        // return updated profile
        const updated = db.prepare('SELECT * FROM profile WHERE id = ?').get(profile.id);
        res.json(updated);

    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'failed to update' });
    }
});

export default router;
