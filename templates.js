// Définition des 10 templates
const templates = [
    {
        id: 1,
        name: 'Moderne - Élégant',
        description: 'Design épuré avec accents de couleur',
        category: 'Professionnel',
        color: '#3498db',
        render: (data) => `
            <div class="cv-header">
                ${data.photo ? `<img src="${data.photo}" class="cv-photo" alt="photo">` : '<div class="cv-photo" style="background:#e0e0e0;"></div>'}
                <div class="cv-titles">
                    <div class="cv-name">${escapeHtml(data.fullname)}</div>
                    <div class="cv-job">${escapeHtml(data.jobtitle)}</div>
                    <div class="cv-contact">
                        <span class="contact-item"><i class="fas fa-envelope"></i> ${escapeHtml(data.email)}</span>
                        <span class="contact-item"><i class="fas fa-phone"></i> ${escapeHtml(data.phone)}</span>
                        <span class="contact-item"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(data.location)}</span>
                    </div>
                </div>
            </div>
            ${data.summary ? `<div class="cv-section"><h3>Profil</h3><div class="cv-text">${escapeHtml(data.summary)}</div></div>` : ''}
            <div class="flex-2cols">
                <div class="col">
                    <div class="cv-section"><h3>Expériences</h3><div class="cv-text">${escapeHtml(data.experience).replace(/\n/g, '<br>')}</div></div>
                    <div class="cv-section"><h3>Formation</h3><div class="cv-text">${escapeHtml(data.education).replace(/\n/g, '<br>')}</div></div>
                </div>
                <div class="col">
                    <div class="cv-section"><h3>Compétences</h3><div class="skills-list">${escapeHtml(data.skills).split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}</div></div>
                    <div class="cv-section"><h3>Langues</h3><div class="cv-text">${escapeHtml(data.languages)}</div></div>
                    <div class="cv-section"><h3>Centres d'intérêt</h3><div class="cv-text">${escapeHtml(data.interests)}</div></div>
                </div>
            </div>
        `
    },
    {
        id: 2,
        name: 'Classique - Professionnel',
        description: 'Traditionnel et élégant',
        category: 'Classique',
        color: '#2c3e50',
        render: (data) => `
            <div class="cv-header">
                <div class="cv-titles">
                    <div class="cv-name">${escapeHtml(data.fullname)}</div>
                    <div class="cv-job">${escapeHtml(data.jobtitle)}</div>
                    <div class="cv-contact">
                        <span>📧 ${escapeHtml(data.email)}</span>
                        <span>📞 ${escapeHtml(data.phone)}</span>
                        <span>📍 ${escapeHtml(data.location)}</span>
                    </div>
                </div>
                ${data.photo ? `<img src="${data.photo}" class="cv-photo" alt="photo">` : ''}
            </div>
            <div class="cv-section"><h3>Expérience professionnelle</h3><div class="cv-text">${escapeHtml(data.experience).replace(/\n/g, '<br>')}</div></div>
            <div class="cv-section"><h3>Formation</h3><div class="cv-text">${escapeHtml(data.education).replace(/\n/g, '<br>')}</div></div>
            <div class="cv-section"><h3>Compétences</h3><div class="skills-list">${escapeHtml(data.skills).split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}</div></div>
            <div class="cv-section"><h3>Langues & Centres d'intérêt</h3><div class="cv-text">${escapeHtml(data.languages)} | ${escapeHtml(data.interests)}</div></div>
        `
    },
    {
        id: 3,
        name: 'Minimaliste - Clair',
        description: 'Design aéré et moderne',
        category: 'Design',
        color: '#95a5a6',
        render: (data) => `
            <div style="text-align: center; margin-bottom: 2rem;">
                ${data.photo ? `<img src="${data.photo}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem;">` : ''}
                <div style="font-size: 2rem; font-weight: 300;">${escapeHtml(data.fullname)}</div>
                <div style="color: #7f8c8d;">${escapeHtml(data.jobtitle)}</div>
                <div style="font-size: 0.85rem; margin-top: 0.5rem;">${escapeHtml(data.email)} | ${escapeHtml(data.phone)} | ${escapeHtml(data.location)}</div>
            </div>
            <div class="cv-section"><h3>Expériences</h3><div class="cv-text">${escapeHtml(data.experience).replace(/\n/g, '<br>')}</div></div>
            <div class="cv-section"><h3>Formation</h3><div class="cv-text">${escapeHtml(data.education).replace(/\n/g, '<br>')}</div></div>
            <div class="cv-section"><h3>Compétences</h3><div class="cv-text">${escapeHtml(data.skills)}</div></div>
        `
    },
    // Templates 4 à 10 (structure similaire avec variations de design)
    {
        id: 4,
        name: 'Tech - Innovant',
        description: 'Design moderne pour les profils tech',
        category: 'Technologie',
        color: '#00ff88',
        render: (data) => `
            <div style="background: #0a0e27; padding: 2rem; border-radius: 12px; margin-bottom: 2rem;">
                <div style="display: flex; gap: 2rem; align-items: center;">
                    ${data.photo ? `<img src="${data.photo}" style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid #00ff88;">` : ''}
                    <div>
                        <div style="font-size: 2rem; font-weight: 700; color: #00ff88;">${escapeHtml(data.fullname)}</div>
                        <div style="color: #fff;">${escapeHtml(data.jobtitle)}</div>
                        <div style="font-size: 0.85rem; color: #888;">${escapeHtml(data.email)} • ${escapeHtml(data.phone)} • ${escapeHtml(data.location)}</div>
                    </div>
                </div>
            </div>
            <div class="cv-section"><h3 style="color: #00ff88;">╺━ EXPÉRIENCES</h3><div class="cv-text" style="color: #ccc;">${escapeHtml(data.experience).replace(/\n/g, '<br>')}</div></div>
            <div class="cv-section"><h3 style="color: #00ff88;">╺━ COMPÉTENCES TECHNIQUES</h3><div class="skills-list">${escapeHtml(data.skills).split(',').map(s => `<span style="background: #00ff8820; padding: 0.3rem 0.8rem; border-radius: 20px;">${s.trim()}</span>`).join('')}</div></div>
        `
    },
    {
        id: 5,
        name: 'Créatif - Artistique',
        description: 'Design original pour les métiers créatifs',
        category: 'Créatif',
        color: '#9b59b6',
        render: (data) => `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; color: white; margin-bottom: 2rem; border-radius: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 2rem; font-weight: bold;">${escapeHtml(data.fullname)}</div>
                        <div style="font-size: 1.1rem; margin-top: 0.5rem;">${escapeHtml(data.jobtitle)}</div>
                    </div>
                    ${data.photo ? `<img src="${data.photo}" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid white;">` : ''}
                </div>
            </div>
            <div class="cv-section"><h3>✨ Expériences</h3><div class="cv-text">${escapeHtml(data.experience).replace(/\n/g, '<br>')}</div></div>
            <div class="cv-section"><h3>🎓 Formation</h3><div class="cv-text">${escapeHtml(data.education).replace(/\n/g, '<br>')}</div></div>
            <div class="cv-section"><h3>🎨 Compétences artistiques</h3><div class="cv-text">${escapeHtml(data.skills)}</div></div>
        `
    },
    {
        id: 6,
        name: 'Corporate - Sobre',
        description: 'Professionnel et élégant',
        category: 'Corporate',
        color: '#1a73e8',
        render: (data) => `
            <div style="border-left: 4px solid #1a73e8; padding-left: 2rem;">
                <div style="font-size: 2rem; font-weight: 600;">${escapeHtml(data.fullname)}</div>
                <div style="color: #1a73e8; margin-bottom: 1rem;">${escapeHtml(data.jobtitle)}</div>
                <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">${escapeHtml(data.email)} | ${escapeHtml(data.phone)} | ${escapeHtml(data.location)}</div>
            </div>
            ${data.summary ? `<div class="cv-section"><h3>Profil</h3><div class="cv-text">${escapeHtml(data.summary)}</div></div>` : ''}
            <div class="cv-section"><h3>Expérience</h3><div class="cv-text">${escapeHtml(data.experience).replace(/\n/g, '<br>')}</div></div>
            <div class="cv-section"><h3>Formation</h3><div class="cv-text">${escapeHtml(data.education).replace(/\n/g, '<br>')}</div></div>
            <div class="cv-section"><h3>Compétences clés</h3><div class="skills-list">${escapeHtml(data.skills).split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}</div></div>
        `
    },
    {
        id: 7,
        name: 'Nordic - Scandi',
        description: 'Design scandinave épuré',
        category: 'Minimaliste',
        color: '#e8f0f2',
        render: (data) => `
            <div style="background: #f5f5f5; padding: 2rem; margin-bottom: 2rem; text-align: center;">
                ${data.photo ? `<img src="${data.photo}" style="width: 100px; height: 100px; border-radius: 50%; margin-bottom: 1rem;">` : ''}
                <div style="font-size: 2rem; font-weight: 300;">${escapeHtml(data.fullname)}</div>
                <div style="color: #666;">${escapeHtml(data.jobtitle)}</div>
            </div>
            <div class="flex-2cols">
                <div class="col">
                    <div class="cv-section"><h3>Contact</h3><div class="cv-text">${escapeHtml(data.email)}<br>${escapeHtml(data.phone)}<br>${escapeHtml(data.location)}</div></div>
                    <div class="cv-section"><h3>Compétences</h3><div class="cv-text">${escapeHtml(data.skills)}</div></div>
                </div>
                <div class="col">
                    <div class="cv-section"><h3>Expériences</h3><div class="cv-text">${escapeHtml(data.experience).replace(/\n/g, '<br>')}</div></div>
                    <div class="cv-section"><h3>Formation</h3><div class="cv-text">${escapeHtml(data.education).replace(/\n/g, '<br>')}</div></div>
                </div>
            </div>
        `
    },
    {
        id: 8,
        name: 'Bold - Audacieux',
        description: 'Design qui fait la différence',
        category: 'Moderne',
        color: '#e74c3c',
        render: (data) => `
            <div style="background: #c0392b; color: white; padding: 2rem; margin: -2rem -2rem 2rem -2rem;">
                <div style="font-size: 2.5rem; font-weight: 800;">${escapeHtml(data.fullname)}</div>
                <div style="font-size: 1.2rem; opacity: 0.9;">${escapeHtml(data.jobtitle)}</div>
                <div style="margin-top: 1rem; font-size: 0.9rem;">${escapeHtml(data.email)} | ${escapeHtml(data.phone)} | ${escapeHtml(data.location)}</div>
            </div>
            <div class="cv-section"><h3>EXPÉRIENCES</h3><div class="cv-text">${escapeHtml(data.experience).replace(/\n/g, '<br>')}</div></div>
            <div class="cv-section"><h3>FORMATION</h3><div class="cv-text">${escapeHtml(data.education).replace(/\n/g, '<br>')}</div></div>
            <div class="cv-section"><h3>COMPÉTENCES</h3><div class="skills-list">${escapeHtml(data.skills).split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}</div></div>
        `
    },
    {
        id: 9,
        name: 'Soft - Doux',
        description: 'Design doux et apaisant',
        category: 'Élégant',
        color: '#fdeff2',
        render: (data) => `
            <div style="text-align: center; margin-bottom: 2rem;">
                ${data.photo ? `<img src="${data.photo}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem;">` : ''}
                <div style="font-size: 2rem; font-weight: 600; color: #e91e63;">${escapeHtml(data.fullname)}</div>
                <div style="color: #999;">${escapeHtml(data.jobtitle)}</div>
                <div style="margin-top: 0.5rem;">${escapeHtml(data.email)} | ${escapeHtml(data.phone)} | ${escapeHtml(data.location)}</div>
            </div>
            ${data.summary ? `<div class="cv-section"><h3>À propos</h3><div class="cv-text">${escapeHtml(data.summary)}</div></div>` : ''}
            <div class="flex-2cols">
                <div class="col">
                    <div class="cv-section"><h3>Expériences</h3><div class="cv-text">${escapeHtml(data.experience).replace(/\n/g, '<br>')}</div></div>
                </div>
                <div class="col">
                    <div class="cv-section"><h3>Formation</h3><div class="cv-text">${escapeHtml(data.education).replace(/\n/g, '<br>')}</div></div>
                    <div class="cv-section"><h3>Compétences</h3><div class="cv-text">${escapeHtml(data.skills)}</div></div>
                </div>
            </div>
        `
    },
    {
        id: 10,
        name: 'Premium - Luxe',
        description: 'Design haut de gamme',
        category: 'Premium',
        color: '#1e3c72',
        render: (data) => `
            <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 2rem; color: white; border-radius: 12px; margin-bottom: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 2rem; font-weight: 700; letter-spacing: 2px;">${escapeHtml(data.fullname)}</div>
                        <div style="font-size: 1rem; opacity: 0.9; margin-top: 0.5rem;">${escapeHtml(data.jobtitle)}</div>
                    </div>
                    ${data.photo ? `<img src="${data.photo}" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid gold;">` : ''}
                </div>
            </div>
            <div class="cv-section"><h3>Profil professionnel</h3><div class="cv-text">${escapeHtml(data.summary || 'Professionnel dynamique avec une solide expérience dans le domaine.')}</div></div>
            <div class="flex-2cols">
                <div class="col">
                    <div class="cv-section"><h3>Expériences</h3><div class="cv-text">${escapeHtml(data.experience).replace(/\n/g, '<br>')}</div></div>
                </div>
                <div class="col">
                    <div class="cv-section"><h3>Formation</h3><div class="cv-text">${escapeHtml(data.education).replace(/\n/g, '<br>')}</div></div>
                    <div class="cv-section"><h3>Expertises</h3><div class="skills-list">${escapeHtml(data.skills).split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}</div></div>
                </div>
            </div>
            <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #ddd; text-align: center; font-size: 0.85rem;">
                ${escapeHtml(data.email)} | ${escapeHtml(data.phone)} | ${escapeHtml(data.location)}
            </div>
        `
    }
];

// Utilitaire d'échappement HTML
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}