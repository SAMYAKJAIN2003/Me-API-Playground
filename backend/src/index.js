import express from 'express';
import cors from 'cors';
import { initializeDb, seedDb, closeDb } from './db/database.js';
import healthRouter from './routes/health.js';
import profileRouter from './routes/profile.js';
import skillsRouter from './routes/skills.js';
import projectsRouter from './routes/projects.js';
import searchRouter from './routes/search.js';
import educationRouter from './routes/education.js';
import workRouter from './routes/work.js';

const app = express();
const PORT = process.env.PORT || 3000;

// cors setup - allow frontend to call us
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// simple request logger so i can see what's happening
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
});

// setup db on startup
try {
    initializeDb();
    seedDb();
} catch (err) {
    console.error('Failed to setup database:', err);
}

// hook up all the routes
app.use('/health', healthRouter);
app.use('/profile', profileRouter);
app.use('/skills', skillsRouter);
app.use('/projects', projectsRouter);
app.use('/search', searchRouter);
app.use('/education', educationRouter);
app.use('/work', workRouter);

// landing page - just show whats available
app.get('/', (req, res) => {
    res.json({
        msg: 'Welcome to my profile API!',
        version: '1.0.0',
        routes: {
            health: '/health',
            profile: '/profile',
            skills: '/skills',
            projects: '/projects',
            education: '/education',
            work: '/work',
            search: '/search?q=...'
        }
    });
});

// catch 404s
app.use((req, res) => {
    res.status(404).json({
        error: 'not found',
        path: req.path
    });
});

// catch errors
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'something went wrong' });
});

// clean shutdown
process.on('SIGINT', () => {
    console.log('Shutting down...');
    closeDb();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

export default app;
