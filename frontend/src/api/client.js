// api config
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// helper to make api calls
async function call(endpoint, opts = {}) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...opts.headers },
        ...opts,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'request failed' }));
        throw new Error(err.error || `HTTP ${res.status}`);
    }

    return res.json();
}

const api = {
    // health check
    getHealth: () => call('/health'),

    // profile
    getProfile: () => call('/profile'),
    updateProfile: (data) => call('/profile', { method: 'PUT', body: JSON.stringify(data) }),

    // skills
    getSkills: (category) => call(`/skills${category ? `?category=${category}` : ''}`),
    getTopSkills: (limit = 5) => call(`/skills/top?limit=${limit}`),
    getSkillCategories: () => call('/skills/categories'),
    addSkill: (data) => call('/skills', { method: 'POST', body: JSON.stringify(data) }),
    deleteSkill: (id) => call(`/skills/${id}`, { method: 'DELETE' }),

    // projects
    getProjects: (skill, featured) => {
        const params = new URLSearchParams();
        if (skill) params.set('skill', skill);
        if (featured) params.set('featured', 'true');
        const qs = params.toString();
        return call(`/projects${qs ? `?${qs}` : ''}`);
    },
    getProject: (id) => call(`/projects/${id}`),
    createProject: (data) => call('/projects', { method: 'POST', body: JSON.stringify(data) }),
    updateProject: (id, data) => call(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteProject: (id) => call(`/projects/${id}`, { method: 'DELETE' }),

    // education & work
    getEducation: () => call('/education'),
    getWork: () => call('/work'),

    // search
    search: (q) => call(`/search?q=${encodeURIComponent(q)}`),
};

export default api;
