# Me-API Playground

My personal profile as an API! This project stores my information in a database and exposes it through REST endpoints. It's a simple way to query my skills, projects, and experience programmatically.

**Resume:** [View My Resume](https://drive.google.com/file/d/1oGKH4G0XePz2CERGzqMaIfCbKP8vqZFK/view?usp=sharing)

## What's This?

A self-hosted API that serves my portfolio data. Think of it as a developer-friendly way to explore my background - you can filter projects by skill, search through my work, or just grab my full profile as JSON.

```
Frontend (React)  -->  Backend (Express)  -->  SQLite Database
    :5173                  :3000                   profile.db
```

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: SQLite (using better-sqlite3)
- **Frontend**: React with Vite
- **Styling**: Plain CSS

## Getting Started

### Prerequisites

You'll need Node.js 18 or higher.

### Running Locally

**Backend:**
```bash
cd backend
npm install
npm run db:init    # sets up the database
npm run dev        # starts on port 3000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev        # starts on port 5173
```

Then open http://localhost:5173 to see the UI.

## API Reference

### Health Check
```
GET /health
```
Quick way to check if the API is alive.

### Profile
```
GET /profile              # my complete profile
PUT /profile              # update profile info
```

### Skills
```
GET /skills               # all my skills
GET /skills?category=Backend   # filter by category
GET /skills/top           # skills I use the most in projects
```

### Projects
```
GET /projects             # all projects
GET /projects?skill=java  # projects using a specific skill
GET /projects/:id         # specific project details
```

### Search
```
GET /search?q=machine+learning   # search across everything
```

### Education & Work
```
GET /education            # education history
GET /work                 # work experience
```

## Sample Requests

```bash
# check if api is running
curl http://localhost:3000/health

# get my profile
curl http://localhost:3000/profile

# find projects where I used Python
curl "http://localhost:3000/projects?skill=python"

# search for anything related to "data"
curl "http://localhost:3000/search?q=data"

# get my top 5 skills
curl "http://localhost:3000/skills/top?limit=5"
```

## Database Schema

Using SQLite. Main tables:

- `profile` - basic info (name, email, bio, links)
- `education` - degrees, schools, years
- `work_experience` - jobs and internships
- `skills` - tech skills with categories
- `projects` - portfolio projects
- `project_skills` - links projects to their tech stack

Check out `backend/schema.md` for the full breakdown.

## Project Structure

```
me-api/
├── backend/
│   ├── src/
│   │   ├── index.js           # express server
│   │   ├── db/                # database stuff
│   │   │   ├── database.js
│   │   │   ├── schema.sql
│   │   │   └── seed.sql       # my actual data
│   │   └── routes/            # api endpoints
│   │       ├── health.js
│   │       ├── profile.js
│   │       ├── projects.js
│   │       ├── skills.js
│   │       ├── search.js
│   │       ├── education.js
│   │       └── work.js
│   └── schema.md
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api/client.js
│   │   └── components/
│   └── vite.config.js
├── api-samples.http           # for testing in VS Code
└── README.md
```

## Deployment

**Backend** - works well on Railway or Render:
- Build: `npm install`
- Start: `npm run db:init && npm start`
- Port: `3000`

**Frontend** - deploy to Vercel or Netlify:
- Build: `npm run build`
- Output: `dist` folder
- Set `VITE_API_URL` to your backend URL

## Limitations

- Single user mode (it's MY profile API after all)
- No auth on write endpoints (would add for production)
- SQLite means it's file-based, not ideal for heavy traffic
- No pagination yet on list endpoints

## Questions?

Feel free to hit me up:
- Email: jainsamyak200369@gmail.com
- LinkedIn: [samyakjain](https://linkedin.com/in/samyakjain)
- GitHub: [samyakjain2003](https://github.com/samyakjain2003)
