import { useState, useEffect } from 'react';
import api from './api/client';
import Header from './components/Header';
import Hero from './components/Hero';
import SearchBar from './components/SearchBar';
import ProjectList from './components/ProjectList';
import SkillsSection from './components/SkillsSection';
import ProfileSection from './components/ProfileSection';
import './App.css';

function App() {
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [topSkills, setTopSkills] = useState([]);
    const [searchResults, setSearchResults] = useState(null);
    const [skillFilter, setSkillFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiStatus, setApiStatus] = useState(null);

    // load everything on mount
    useEffect(() => {
        loadData();
    }, []);

    // reload projects when skill filter changes
    useEffect(() => {
        loadProjects(skillFilter);
    }, [skillFilter]);

    async function loadData() {
        try {
            setLoading(true);

            const health = await api.getHealth();
            setApiStatus(health);

            const [profileData, projectsData, skillsData, topSkillsData] = await Promise.all([
                api.getProfile(),
                api.getProjects(),
                api.getSkills(),
                api.getTopSkills(6)
            ]);

            setProfile(profileData);
            setProjects(projectsData);
            setSkills(skillsData);
            setTopSkills(topSkillsData);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Load failed:', err);
        } finally {
            setLoading(false);
        }
    }

    async function loadProjects(skill = '') {
        try {
            const data = await api.getProjects(skill);
            setProjects(data);
        } catch (err) {
            console.error('Failed to load projects:', err);
        }
    }

    async function handleSearch(query) {
        if (!query.trim()) {
            setSearchResults(null);
            return;
        }
        try {
            const results = await api.search(query);
            setSearchResults(results);
        } catch (err) {
            console.error('Search failed:', err);
        }
    }

    function clearSearch() {
        setSearchResults(null);
        setSkillFilter('');
    }

    function handleSkillClick(skillName) {
        setSearchResults(null);
        setSkillFilter(skillName);
    }

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-screen">
                <div className="error-content">
                    <h2>⚠️ Connection Error</h2>
                    <p>{error}</p>
                    <p className="hint">Make sure the backend is running on port 3000</p>
                    <button className="btn btn-primary" onClick={loadData}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <Header profile={profile} apiStatus={apiStatus} />

            <main>
                <Hero profile={profile} />

                <section className="section container">
                    <SearchBar
                        onSearch={handleSearch}
                        onClear={clearSearch}
                        skillFilter={skillFilter}
                        onClearSkillFilter={() => setSkillFilter('')}
                    />

                    {searchResults ? (
                        <div className="search-results fade-in">
                            <div className="search-header">
                                <h2>Results for "{searchResults.query}"</h2>
                                <span className="result-count">{searchResults.total_results} found</span>
                            </div>

                            {searchResults.projects.length > 0 && (
                                <div className="result-section">
                                    <h3>Projects</h3>
                                    <ProjectList
                                        projects={searchResults.projects}
                                        onSkillClick={handleSkillClick}
                                    />
                                </div>
                            )}

                            {searchResults.skills.length > 0 && (
                                <div className="result-section">
                                    <h3>Skills</h3>
                                    <div className="flex flex-wrap gap-sm">
                                        {searchResults.skills.map(skill => (
                                            <span
                                                key={skill.id}
                                                className="tag clickable"
                                                onClick={() => handleSkillClick(skill.name)}
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {searchResults.total_results === 0 && (
                                <p className="no-results">Nothing found. Try something else.</p>
                            )}
                        </div>
                    ) : (
                        <>
                            <SkillsSection
                                skills={skills}
                                topSkills={topSkills}
                                onSkillClick={handleSkillClick}
                                activeSkill={skillFilter}
                            />

                            <div className="projects-section">
                                <div className="section-title">
                                    <h2>
                                        {skillFilter ? `Projects using ${skillFilter}` : 'Projects'}
                                    </h2>
                                </div>
                                <ProjectList
                                    projects={projects}
                                    onSkillClick={handleSkillClick}
                                />
                            </div>
                        </>
                    )}
                </section>

                <ProfileSection profile={profile} />
            </main>

            <footer className="footer">
                <div className="container">
                    <p>
                        Built by {profile?.name} •
                        <a href={profile?.github_url} target="_blank" rel="noopener noreferrer"> GitHub</a> •
                        <a href={profile?.linkedin_url} target="_blank" rel="noopener noreferrer"> LinkedIn</a>
                    </p>
                    <p className="footer-api">
                        Me-API Playground •
                        <span className="status-online">API Online</span>
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;
