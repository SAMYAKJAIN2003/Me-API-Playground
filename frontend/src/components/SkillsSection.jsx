import './SkillsSection.css';

function SkillsSection({ skills, topSkills, onSkillClick, activeSkill }) {
    // Group skills by category
    const skillsByCategory = skills.reduce((acc, skill) => {
        const category = skill.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(skill);
        return acc;
    }, {});

    return (
        <section id="skills" className="skills-section">
            <div className="section-title">
                <h2>Skills & Technologies</h2>
            </div>

            {topSkills.length > 0 && (
                <div className="top-skills">
                    <h3>Top Skills</h3>
                    <div className="top-skills-grid">
                        {topSkills.map(skill => (
                            <button
                                key={skill.id}
                                className={`skill-chip ${activeSkill === skill.name ? 'active' : ''}`}
                                onClick={() => onSkillClick(skill.name)}
                            >
                                <span className="skill-name">{skill.name}</span>
                                <span className="skill-count">{skill.project_count} projects</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="skills-categories">
                {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                    <div key={category} className="skill-category">
                        <h4 className="category-title">{category}</h4>
                        <div className="category-skills flex flex-wrap gap-sm">
                            {categorySkills.map(skill => (
                                <span
                                    key={skill.id}
                                    className={`tag clickable ${activeSkill === skill.name ? 'active' : ''}`}
                                    onClick={() => onSkillClick(skill.name)}
                                >
                                    {skill.name}
                                    {skill.proficiency_level && (
                                        <span className="proficiency-dot" data-level={skill.proficiency_level}></span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default SkillsSection;
