# Database Schema Documentation

## Overview

The Me-API Playground uses SQLite with FTS5 (Full-Text Search) for efficient querying. The schema follows a normalized structure with proper foreign key relationships.

## Entity Relationship Diagram

```
┌──────────────┐
│   profile    │
├──────────────┤
│ id (PK)      │
│ name         │
│ email        │
│ bio          │
│ github_url   │
│ linkedin_url │
│ portfolio_url│
│ resume_url   │
│ created_at   │
│ updated_at   │
└──────┬───────┘
       │
       │ 1:N
       ├──────────────────┬──────────────────┬──────────────────┐
       ▼                  ▼                  ▼                  ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  education   │   │work_experience│   │    skills    │   │   projects   │
├──────────────┤   ├──────────────┤   ├──────────────┤   ├──────────────┤
│ id (PK)      │   │ id (PK)      │   │ id (PK)      │   │ id (PK)      │
│ profile_id   │   │ profile_id   │   │ profile_id   │   │ profile_id   │
│ degree       │   │ title        │   │ name         │   │ title        │
│ institution  │   │ company      │   │ category     │   │ description  │
│ field_of_study│  │ location     │   │ proficiency  │   │ github_url   │
│ start_year   │   │ start_date   │   └──────┬───────┘   │ live_url     │
│ end_year     │   │ end_date     │          │           │ is_featured  │
│ gpa          │   │ is_current   │          │           └──────┬───────┘
│ description  │   │ description  │          │                  │
└──────────────┘   └──────────────┘          │                  │
                                             │     M:N          │
                                             └────────┬─────────┘
                                                      ▼
                                             ┌──────────────┐
                                             │project_skills│
                                             ├──────────────┤
                                             │ project_id   │
                                             │ skill_id     │
                                             └──────────────┘
```

## Tables

### profile
Main user information table. Currently supports single-user mode.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| name | TEXT | NOT NULL | Full name |
| email | TEXT | UNIQUE NOT NULL | Email address |
| bio | TEXT | | Short biography |
| github_url | TEXT | | GitHub profile URL |
| linkedin_url | TEXT | | LinkedIn profile URL |
| portfolio_url | TEXT | | Portfolio website URL |
| resume_url | TEXT | | Resume/CV download URL |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | |

### education
Education history linked to profile.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | |
| profile_id | INTEGER | NOT NULL, FK → profile(id) | |
| degree | TEXT | NOT NULL | Degree name |
| institution | TEXT | NOT NULL | School/University name |
| field_of_study | TEXT | | Major/Concentration |
| start_year | INTEGER | | Year started |
| end_year | INTEGER | | Year completed (NULL if current) |
| gpa | TEXT | | Grade point average |
| description | TEXT | | Additional details |

### work_experience
Employment history.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | |
| profile_id | INTEGER | NOT NULL, FK → profile(id) | |
| title | TEXT | NOT NULL | Job title |
| company | TEXT | NOT NULL | Company name |
| location | TEXT | | Work location |
| start_date | TEXT | | Start date (YYYY-MM) |
| end_date | TEXT | | End date (NULL if current) |
| is_current | BOOLEAN | DEFAULT FALSE | Currently employed |
| description | TEXT | | Job responsibilities |

### skills
Technical and soft skills.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | |
| profile_id | INTEGER | NOT NULL, FK → profile(id) | |
| name | TEXT | NOT NULL | Skill name |
| category | TEXT | | Category (e.g., "Backend", "Frontend") |
| proficiency_level | TEXT | CHECK(IN beginner/intermediate/advanced/expert) | Skill level |

### projects
Portfolio projects.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | |
| profile_id | INTEGER | NOT NULL, FK → profile(id) | |
| title | TEXT | NOT NULL | Project title |
| description | TEXT | | Project description |
| github_url | TEXT | | Source code URL |
| live_url | TEXT | | Live demo URL |
| image_url | TEXT | | Preview image URL |
| start_date | TEXT | | Project start date |
| end_date | TEXT | | Project end date |
| is_featured | BOOLEAN | DEFAULT FALSE | Show as featured |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | |

### project_skills
Junction table for project-skill many-to-many relationship.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| project_id | INTEGER | PK, FK → projects(id) | |
| skill_id | INTEGER | PK, FK → skills(id) | |

## Indexes

| Index Name | Table | Columns | Purpose |
|------------|-------|---------|---------|
| idx_skills_name | skills | name | Fast skill lookup |
| idx_skills_category | skills | category | Category filtering |
| idx_projects_title | projects | title | Project search |
| idx_education_institution | education | institution | Institution search |
| idx_work_company | work_experience | company | Company search |

## Full-Text Search Tables (FTS5)

For efficient full-text search, the schema includes FTS5 virtual tables:

- **profile_fts**: Indexes `name` and `bio` columns
- **projects_fts**: Indexes `title` and `description` columns  
- **skills_fts**: Indexes `name` and `category` columns

These tables are synchronized with their source tables on INSERT/UPDATE/DELETE operations.

## Cascade Behavior

All child tables use `ON DELETE CASCADE`, meaning:
- Deleting a profile removes all related education, work, skills, and projects
- Deleting a project removes its project_skills entries
- Deleting a skill removes its project_skills entries
