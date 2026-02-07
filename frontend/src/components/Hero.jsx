import './Hero.css';

function Hero({ profile }) {
    if (!profile) return null;

    return (
        <section className="hero">
            <div className="container hero-content">
                <div className="hero-text">
                    <span className="hero-greeting">👋 Hello, I'm</span>
                    <h1 className="hero-title">{profile.name}</h1>
                    <p className="hero-bio">{profile.bio}</p>

                    <div className="hero-links">
                        {profile.portfolio_url && (
                            <a
                                href={profile.portfolio_url}
                                className="btn btn-primary"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View Portfolio
                            </a>
                        )}
                        {profile.resume_url && (
                            <a
                                href={profile.resume_url}
                                className="btn btn-secondary"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                📄 Resume
                            </a>
                        )}
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-avatar">
                        <div className="avatar-placeholder">
                            {profile.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="avatar-ring"></div>
                        <div className="avatar-ring ring-2"></div>
                    </div>
                </div>
            </div>

            <div className="hero-scroll-indicator">
                <span>Scroll to explore</span>
                <div className="scroll-arrow">↓</div>
            </div>
        </section>
    );
}

export default Hero;
