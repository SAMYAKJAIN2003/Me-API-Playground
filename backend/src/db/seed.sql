-- Seed data for Samyak Jain's profile

-- Insert profile
INSERT INTO profile (name, email, bio, github_url, linkedin_url, portfolio_url, resume_url)
VALUES (
    'Samyak Jain',
    'jainsamyak200369@gmail.com',
    'Developer and Data Science enthusiast with hands-on experience in software development and machine learning models. Proficient in Java, Python, and modern web technologies including Node.js and Express.js. Strong understanding of Data Structures and Algorithms, with an interest in building efficient and scalable real-world applications.',
    'https://github.com/samyakjain2003',
    'https://linkedin.com/in/samyakjain',
    NULL,
    NULL
);

-- Insert education
INSERT INTO education (profile_id, degree, institution, field_of_study, start_year, end_year, gpa, description)
VALUES 
(1, 'B.Tech CSE', 'JECRC University, Jaipur', 'Data Science', 2022, 2026, 'CGPA: 8.43', 'Specialization in Data Science'),
(1, 'Senior Secondary', 'Blue Heaven School', NULL, 2021, 2022, '82%', NULL),
(1, 'Secondary', 'Blue Heaven School', NULL, 2019, 2020, '84%', NULL);

-- Insert work experience
INSERT INTO work_experience (profile_id, title, company, location, start_date, end_date, is_current, description)
VALUES 
(1, 'Java Software Developer Intern', 'Infomagine', 'Offline', '2024-01', '2024-06', FALSE, 'Developed backend features for enterprise applications using Java, Servlets, JDBC, and MySQL. Optimized performance and resolved issues through debugging and collaboration in a team.'),
(1, 'Machine Learning Intern', 'Codesoft', 'Virtual', '2023-08', '2023-09', FALSE, 'Developed and optimized 5 machine learning models with data preprocessing and hyperparameter tuning. Worked on real-world ML projects to improve predictive accuracy.'),
(1, 'Web Development', 'Self-Learning', 'Remote', '2023-01', NULL, TRUE, 'Built full-stack apps with Node.js, Express, REST APIs, MongoDB, and MySQL. Created responsive front-ends using HTML, CSS, and JavaScript, focusing on performance.');

-- Insert skills
INSERT INTO skills (profile_id, name, category, proficiency_level) VALUES
-- Programming Languages
(1, 'Java', 'Programming Languages', 'advanced'),
(1, 'Python', 'Programming Languages', 'advanced'),
(1, 'JavaScript', 'Programming Languages', 'advanced'),
-- Frontend
(1, 'HTML', 'Frontend', 'advanced'),
(1, 'CSS', 'Frontend', 'advanced'),
(1, 'Bootstrap', 'Frontend', 'intermediate'),
-- Backend
(1, 'Node.js', 'Backend', 'advanced'),
(1, 'Express.js', 'Backend', 'advanced'),
(1, 'REST APIs', 'Backend', 'advanced'),
(1, 'Servlets', 'Backend', 'intermediate'),
(1, 'JDBC', 'Backend', 'intermediate'),
-- Databases
(1, 'MySQL', 'Databases', 'advanced'),
(1, 'MongoDB', 'Databases', 'intermediate'),
-- Tools
(1, 'Git', 'Tools', 'advanced'),
(1, 'GitHub', 'Tools', 'advanced'),
(1, 'VS Code', 'Tools', 'advanced'),
(1, 'IntelliJ', 'Tools', 'intermediate'),
(1, 'Jupyter Notebook', 'Tools', 'intermediate'),
(1, 'Anaconda', 'Tools', 'intermediate'),
-- Data Science / ML
(1, 'Machine Learning', 'Data Science', 'intermediate'),
(1, 'Deep Learning', 'Data Science', 'beginner'),
(1, 'Data Analysis', 'Data Science', 'intermediate'),
(1, 'TensorFlow', 'Data Science', 'beginner'),
(1, 'Scikit-learn', 'Data Science', 'intermediate'),
(1, 'Matplotlib', 'Data Science', 'intermediate'),
(1, 'R Programming', 'Data Science', 'beginner'),
-- Coursework/Concepts
(1, 'DSA', 'Core Concepts', 'advanced'),
(1, 'DBMS', 'Core Concepts', 'intermediate'),
(1, 'OOPS', 'Core Concepts', 'advanced'),
(1, 'Computer Networks', 'Core Concepts', 'intermediate'),
(1, 'Operating Systems', 'Core Concepts', 'intermediate'),
(1, 'Software Engineering', 'Core Concepts', 'intermediate');

-- Insert projects
INSERT INTO projects (profile_id, title, description, github_url, live_url, is_featured) VALUES
(1, 'FoodSite', 'Developed a monolithic food ordering application for ~3,000 users using APIs, Node.js, Express, MongoDB, and JavaScript. Managed real-time orders and mess menus, and built a multifunctional login page.', 'https://github.com/samyakjain2003/foodsite', NULL, TRUE),
(1, 'Credit Card Fraud Detection', 'Machine learning model to detect fraudulent transactions in unbalanced financial datasets using advanced data preprocessing and classification techniques.', 'https://github.com/samyakjain2003/ml-projects', NULL, TRUE),
(1, 'Sales Prediction Model', 'ML model to project future revenue trends based on advertising expenditure using regression analysis and feature engineering.', 'https://github.com/samyakjain2003/ml-projects', NULL, FALSE),
(1, 'Me-API Playground', 'Personal profile API that stores developer information and exposes queryable endpoints with a minimal frontend. Built with Node.js, Express, SQLite, and React.', 'https://github.com/samyakjain2003/me-api', NULL, TRUE);

-- Link projects to skills (project_skills junction table)
-- FoodSite (project_id: 1)
INSERT INTO project_skills (project_id, skill_id) VALUES
(1, 3),  -- JavaScript
(1, 7),  -- Node.js
(1, 8),  -- Express.js
(1, 9),  -- REST APIs
(1, 13); -- MongoDB

-- Credit Card Fraud Detection (project_id: 2)
INSERT INTO project_skills (project_id, skill_id) VALUES
(2, 2),  -- Python
(2, 21), -- Machine Learning
(2, 23), -- Data Analysis
(2, 25); -- Scikit-learn

-- Sales Prediction (project_id: 3)
INSERT INTO project_skills (project_id, skill_id) VALUES
(3, 2),  -- Python
(3, 21), -- Machine Learning
(3, 26); -- Matplotlib

-- Me-API Playground (project_id: 4)
INSERT INTO project_skills (project_id, skill_id) VALUES
(4, 3),  -- JavaScript
(4, 7),  -- Node.js
(4, 8),  -- Express.js
(4, 9),  -- REST APIs
(4, 12); -- MySQL

-- Populate FTS tables
INSERT INTO profile_fts(rowid, name, bio) SELECT id, name, bio FROM profile;
INSERT INTO projects_fts(rowid, title, description) SELECT id, title, description FROM projects;
INSERT INTO skills_fts(rowid, name, category) SELECT id, name, category FROM skills;
