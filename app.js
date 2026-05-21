// État de l'application
var currentTemplate = 1;
var currentPhotoBase64 = null;

// Éléments DOM
var elements = {
    fullname: document.getElementById('fullname'),
    jobtitle: document.getElementById('jobtitle'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    location: document.getElementById('location'),
    birthdate: document.getElementById('birthdate'),
    summary: document.getElementById('summary'),
    experience: document.getElementById('experience'),
    education: document.getElementById('education'),
    skills: document.getElementById('skills'),
    languages: document.getElementById('languages'),
    interests: document.getElementById('interests'),
    photoUpload: document.getElementById('photoUpload'),
    photoContainer: document.getElementById('photoContainer'),
    templateSelect: document.getElementById('templateSelect'),
    cvPreview: document.getElementById('cvPreview'),
    downloadBtn: document.getElementById('downloadPdfBtn'),
    resetBtn: document.getElementById('resetBtn')
};

// Données d'exemple pour les previews de la galerie
var previewData = {
    fullname: 'Sophie Moreau',
    jobtitle: 'Développeuse Full Stack',
    email: 'sophie@exemple.fr',
    phone: '06 12 34 56 78',
    location: 'Lyon, France',
    birthdate: '15/03/1995',
    summary: "Développeuse passionnée avec 5 ans d'expérience dans la création d'applications web modernes.",
    experience: "2023 - aujourd'hui : Dev Full Stack - TechCorp\n2021 - 2023 : Dev Front-end - WebAgence\n2020 - 2021 : Stagiaire - StartupHub",
    education: "2021 : Master Web - Université Lyon\n2018 : Licence Informatique - Université Lyon",
    skills: 'JavaScript, React, Node.js, Python, MongoDB',
    languages: 'Français (natif), Anglais (C1)',
    interests: 'Sport, Voyages, Lecture',
    photo: null
};

// Récupérer TOUS les styles CSS (incluant les styles inline et importés)
function getAllCSS() {
    var cssText = '';
    
    // 1. Récupérer les styles des feuilles de style
    for (var i = 0; i < document.styleSheets.length; i++) {
        try {
            var sheet = document.styleSheets[i];
            if (sheet.cssRules) {
                for (var j = 0; j < sheet.cssRules.length; j++) {
                    var rule = sheet.cssRules[j];
                    if (rule.cssText) {
                        cssText += rule.cssText + '\n';
                    }
                }
            }
        } catch(e) {
            // Ignorer les erreurs CORS
            console.log('StyleSheet non accessible:', e);
        }
    }
    
    return cssText;
}

// Galerie des templates
var templatesGrid = document.getElementById('templatesGrid');

function initTemplatesGallery() {
    templates.forEach(function(template, index) {
        var card = document.createElement('div');
        card.className = 'template-card';
        var renderedCV = template.render(previewData);
        card.innerHTML =
            '<div class="template-preview">' +
                '<div class="template-preview-scaler">' +
                    '<div class="cv-content template-' + (index + 1) + '">' + renderedCV + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="template-info">' +
                '<h3>' + template.name + '</h3>' +
                '<p>' + template.description + '</p>' +
                '<span class="template-badge">' + template.category + '</span>' +
            '</div>';
        card.addEventListener('click', function() {
            elements.templateSelect.value = index + 1;
            currentTemplate = index + 1;
            generateCV();
            showToast('Template "' + template.name + '" sélectionné');
            document.querySelector('#editor').scrollIntoView({ behavior: 'smooth' });
        });
        templatesGrid.appendChild(card);
    });
}

// Génération du CV
function generateCV() {
    var data = {
        fullname: elements.fullname.value || 'Nom Prénom',
        jobtitle: elements.jobtitle.value || 'Titre professionnel',
        email: elements.email.value || 'email@exemple.fr',
        phone: elements.phone.value || '06 00 00 00 00',
        location: elements.location.value || 'Ville, Pays',
        birthdate: elements.birthdate.value || '',
        summary: elements.summary.value || '',
        experience: elements.experience.value || '',
        education: elements.education.value || '',
        skills: elements.skills.value || '',
        languages: elements.languages.value || '',
        interests: elements.interests.value || '',
        photo: currentPhotoBase64
    };
    var template = templates[currentTemplate - 1];
    var cvHtml = template.render(data);
    elements.cvPreview.innerHTML = '<div class="cv-content template-' + currentTemplate + '">' + cvHtml + '</div>';
}

// Clic sur le conteneur photo
elements.photoContainer.addEventListener('click', function() {
    elements.photoUpload.click();
});

// Gestion de la photo
elements.photoUpload.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
        showToast("L'image est trop volumineuse (max 5 Mo)", 'error');
        return;
    }
    var reader = new FileReader();
    reader.onload = function(ev) {
        currentPhotoBase64 = ev.target.result;
        elements.photoContainer.innerHTML = '<img src="' + currentPhotoBase64 + '" style="width:100px;height:100px;border-radius:50%;object-fit:cover;">';
        generateCV();
    };
    reader.readAsDataURL(file);
});

// Sauvegarde automatique
function autoSave() {
    try {
        var formData = {};
        Object.keys(elements).forEach(function(key) {
            if (elements[key] && elements[key].value !== undefined) {
                formData[key] = elements[key].value;
            }
        });
        formData.currentTemplate = currentTemplate;
        formData.currentPhotoBase64 = currentPhotoBase64;
        localStorage.setItem('cvFormData', JSON.stringify(formData));
    } catch(e) {}
}

function autoLoad() {
    try {
        var saved = localStorage.getItem('cvFormData');
        if (!saved) return;
        var formData = JSON.parse(saved);
        Object.keys(formData).forEach(function(key) {
            if (elements[key] && elements[key].value !== undefined) {
                elements[key].value = formData[key];
            }
        });
        if (formData.currentTemplate) {
            currentTemplate = formData.currentTemplate;
            elements.templateSelect.value = currentTemplate;
        }
        if (formData.currentPhotoBase64) {
            currentPhotoBase64 = formData.currentPhotoBase64;
            elements.photoContainer.innerHTML = '<img src="' + currentPhotoBase64 + '" style="width:100px;height:100px;border-radius:50%;object-fit:cover;">';
        }
        generateCV();
    } catch(e) {
        console.error('Erreur chargement sauvegarde:', e);
    }
}

// Réinitialisation
function resetForm() {
    if (confirm('Voulez-vous vraiment réinitialiser tous les champs ?')) {
        Object.keys(elements).forEach(function(key) {
            if (elements[key] && elements[key].value !== undefined && key !== 'photoUpload') {
                elements[key].value = '';
            }
        });
        currentPhotoBase64 = null;
        elements.photoContainer.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Cliquez pour ajouter</span>';
        currentTemplate = 1;
        elements.templateSelect.value = '1';
        generateCV();
        showToast('Formulaire réinitialisé');
    }
}

// Génération du PDF - VERSION CORRIGÉE (pleine page)
function downloadPDF() {
    generateCV();
    
    var cvElement = document.querySelector('.cv-preview .cv-content');
    if (!cvElement) { 
        showToast('Contenu introuvable', 'error'); 
        return; 
    }

    showToast('Préparation du PDF...', 'info');
    
    // Récupérer le HTML complet du CV
    var cvHTML = cvElement.outerHTML;
    var templateNum = currentTemplate;
    
    // Styles pour une page A4 parfaitement remplie
    var printStyles = `
        /* Reset complet */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        
        html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            background: white;
        }
        
        body {
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Conteneur principal - OCCUPE TOUTE LA PAGE */
        .cv-content {
            width: 100%;
            height: 100%;
            padding: 12mm 15mm !important;
            background: white;
            font-size: 10pt;
            line-height: 1.4;
            color: #2c3e50;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        /* Header */
        .cv-header {
            display: flex;
            gap: 1.5rem;
            align-items: center;
            margin-bottom: 1rem;
            padding: 1rem 1.2rem;
            border-radius: 12px;
            flex-wrap: wrap;
            flex-shrink: 0;
        }
        
        .cv-photo {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
        }
        
        .cv-titles {
            flex: 1;
        }
        
        .cv-name {
            font-size: 24pt;
            font-weight: 700;
            margin-bottom: 0.3rem;
        }
        
        .cv-job {
            font-size: 12pt;
            opacity: 0.85;
            margin-bottom: 0.6rem;
        }
        
        .cv-contact {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            font-size: 9pt;
        }
        
        .contact-item {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
        }
        
        /* Contenu principal - PREND L'ESPACE RESTANT */
        .cv-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        /* Sections */
        .cv-section {
            margin: 0.5rem 0;
        }
        
        .cv-section h3 {
            font-size: 13pt;
            font-weight: 600;
            margin-bottom: 0.4rem;
            padding-bottom: 0.25rem;
            border-bottom: 2px solid currentColor;
        }
        
        .cv-text {
            line-height: 1.45;
            white-space: pre-line;
            font-size: 10pt;
        }
        
        /* Compétences */
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 0.4rem;
        }
        
        .skill-tag {
            padding: 0.25rem 0.8rem;
            background: rgba(0, 0, 0, 0.06);
            border-radius: 20px;
            font-size: 9pt;
        }
        
        /* Grille 2 colonnes */
        .flex-2cols {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            flex: 1;
        }
        
        .col {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        /* Icônes */
        .fas, .far {
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
        }
        
        /* Page A4 */
        @page {
            size: A4 portrait;
            margin: 0;
        }
        
        @media print {
            html, body {
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
            }
            .cv-content {
                page-break-after: avoid;
                page-break-inside: avoid;
                break-inside: avoid;
            }
        }
    `;
    
    // Styles spécifiques par template
    var templateStyles = '';
    
    if (templateNum == 1) {
        templateStyles = `
            .cv-header {
                background: #2c3e50 !important;
                color: white !important;
            }
            .cv-header .cv-name, .cv-header .cv-job, .cv-header .cv-contact {
                color: white !important;
            }
            .cv-section h3 {
                color: #3498db !important;
                border-bottom-color: #3498db !important;
            }
        `;
    } else if (templateNum == 2) {
        templateStyles = `
            .cv-header {
                border-bottom: 3px solid #2c3e50;
                padding-bottom: 0.8rem;
            }
            .cv-section h3 {
                color: #2c3e50;
            }
        `;
    } else if (templateNum == 3) {
        templateStyles = `
            .cv-header {
                text-align: center;
                flex-direction: column;
            }
        `;
    } else if (templateNum == 4) {
        templateStyles = `
            .cv-content {
                background: #0a0e27 !important;
                color: #e0e0e0 !important;
            }
            .cv-section h3 {
                color: #00ff88 !important;
                border-bottom-color: #00ff88 !important;
            }
            .skill-tag {
                background: rgba(0, 255, 136, 0.15) !important;
                color: #00ff88 !important;
            }
        `;
    } else if (templateNum == 5) {
        templateStyles = `
            .cv-header {
                background: #764ba2 !important;
                color: white !important;
                border-radius: 20px !important;
            }
        `;
    } else if (templateNum == 6) {
        templateStyles = `
            .cv-section h3 {
                color: #1a73e8 !important;
                border-left: 3px solid #1a73e8 !important;
                padding-left: 10px !important;
                border-bottom: none !important;
            }
        `;
    } else if (templateNum == 7) {
        templateStyles = `
            .cv-header {
                background: #f5f5f5 !important;
                text-align: center;
            }
        `;
    } else if (templateNum == 8) {
        templateStyles = `
            .cv-content {
                background: #1a1a2e !important;
                color: #eee !important;
            }
            .cv-header {
                background: #c0392b !important;
                color: white !important;
                margin: -12mm -15mm 1rem -15mm !important;
                padding: 1.2rem !important;
                border-radius: 0 !important;
            }
            .cv-section h3 {
                color: #e74c3c !important;
            }
        `;
    } else if (templateNum == 9) {
        templateStyles = `
            .cv-header {
                text-align: center;
                flex-direction: column;
            }
            .cv-name {
                color: #e91e63 !important;
            }
        `;
    } else if (templateNum == 10) {
        templateStyles = `
            .cv-header {
                background: #1e3c72 !important;
                color: white !important;
                border-radius: 12px !important;
            }
            .cv-section h3 {
                color: #1e3c72 !important;
                border-bottom-color: #c9a84c !important;
            }
        `;
    }
    
    // Améliorer la structure HTML du CV pour qu'elle utilise flexbox
    var enhancedCVHTML = cvHTML.replace(
        /(<div class="cv-content[\s\S]*?>)([\s\S]*?)(<\/div>)/,
        function(match, openTag, content, closeTag) {
            // Ajouter la structure flex si elle n'existe pas déjà
            if (!content.includes('cv-main')) {
                // Diviser le contenu entre header et le reste
                var headerMatch = content.match(/(<div class="cv-header">[\s\S]*?<\/div>)/);
                var header = headerMatch ? headerMatch[1] : '';
                var rest = headerMatch ? content.replace(header, '') : content;
                
                return openTag + header + '<div class="cv-main">' + rest + '</div>' + closeTag;
            }
            return match;
        }
    );
    
    // Construction de la page HTML pour l'impression
    var html = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>CV - ${escapeHtml(elements.fullname.value || 'Document')}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>${printStyles}</style>
        <style>${templateStyles}</style>
        <style>
            /* Ajustements supplémentaires */
            .cv-content .fas, .cv-content .far {
                display: inline-block;
                width: auto;
            }
            .cv-content br {
                display: block;
                content: "";
                margin: 0.2rem 0;
            }
        </style>
    </head>
    <body>
        ${enhancedCVHTML}
        <script>
            (function() {
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    }, 300);
                };
            })();
        <\/script>
    </body>
    </html>`;
    
    // Ouvrir la fenêtre d'impression
    var printWindow = window.open('', '_blank', 'width=900,height=700,toolbar=yes,menubar=yes');
    if (!printWindow) {
        showToast("Veuillez autoriser les popups pour générer le PDF", 'error');
        return;
    }
    
    printWindow.document.write(html);
    printWindow.document.close();
    showToast("Choisissez 'Enregistrer en PDF' dans la fenêtre d'impression", 'success');
}
    `;
    
    // Styles spécifiques par template (remplacement des dégradés par des couleurs unies)
    var templateSpecificCSS = '';
    
    if (templateNum == 1) {
        templateSpecificCSS = `
            .cv-header {
                background: #2c3e50 !important;
                color: white !important;
            }
            .cv-header .cv-name, .cv-header .cv-job, .cv-header .cv-contact {
                color: white !important;
            }
            .cv-section h3 {
                color: #3498db !important;
                border-bottom-color: #3498db !important;
            }
        `;
    } else if (templateNum == 2) {
        templateSpecificCSS = `
            .cv-header {
                border-bottom: 3px solid #2c3e50;
                padding-bottom: 0.8rem;
            }
            .cv-section h3 {
                color: #2c3e50;
            }
        `;
    } else if (templateNum == 3) {
        templateSpecificCSS = `
            .cv-header {
                text-align: center;
                flex-direction: column;
            }
        `;
    } else if (templateNum == 4) {
        templateSpecificCSS = `
            .cv-content {
                background: #0a0e27 !important;
                color: #e0e0e0 !important;
            }
            .cv-section h3 {
                color: #00ff88 !important;
                border-bottom-color: #00ff88 !important;
            }
            .skill-tag {
                background: rgba(0, 255, 136, 0.15) !important;
                color: #00ff88 !important;
            }
        `;
    } else if (templateNum == 5) {
        templateSpecificCSS = `
            .cv-header {
                background: #764ba2 !important;
                color: white !important;
                border-radius: 20px !important;
            }
        `;
    } else if (templateNum == 6) {
        templateSpecificCSS = `
            .cv-section h3 {
                color: #1a73e8 !important;
                border-left: 3px solid #1a73e8 !important;
                padding-left: 10px !important;
                border-bottom: none !important;
            }
        `;
    } else if (templateNum == 7) {
        templateSpecificCSS = `
            .cv-header {
                background: #f5f5f5 !important;
                text-align: center;
            }
        `;
    } else if (templateNum == 8) {
        templateSpecificCSS = `
            .cv-content {
                background: #1a1a2e !important;
                color: #eee !important;
            }
            .cv-header {
                background: #c0392b !important;
                color: white !important;
                margin: -15mm -12mm 1rem -12mm !important;
                padding: 1.2rem !important;
                border-radius: 0 !important;
            }
            .cv-section h3 {
                color: #e74c3c !important;
            }
        `;
    } else if (templateNum == 9) {
        templateSpecificCSS = `
            .cv-header {
                text-align: center;
                flex-direction: column;
            }
            .cv-name {
                color: #e91e63 !important;
            }
        `;
    } else if (templateNum == 10) {
        templateSpecificCSS = `
            .cv-header {
                background: #1e3c72 !important;
                color: white !important;
                border-radius: 12px !important;
            }
            .cv-section h3 {
                color: #1e3c72 !important;
                border-bottom-color: #c9a84c !important;
            }
        `;
    }
    
    // Construction de la page HTML pour l'impression
    var html = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>CV - ${escapeHtml(elements.fullname.value || 'Document')}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>${essentialStyles}</style>
        <style>${templateSpecificCSS}</style>
        <style>
            /* Styles supplémentaires pour garantir l'affichage */
            .cv-content .fas, .cv-content .far {
                display: inline-block;
                width: auto;
            }
            .cv-content br {
                display: block;
            }
        </style>
    </head>
    <body>
        ${cvHTML}
        <script>
            (function() {
                // Attendre que tout soit chargé
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    }, 300);
                };
            })();
        <\/script>
    </body>
    </html>`;
    
    // Ouvrir la fenêtre d'impression
    var printWindow = window.open('', '_blank', 'width=900,height=700,toolbar=yes,menubar=yes');
    if (!printWindow) {
        showToast("Veuillez autoriser les popups pour générer le PDF", 'error');
        return;
    }
    
    printWindow.document.write(html);
    printWindow.document.close();
    showToast("Choisissez 'Enregistrer en PDF' dans la fenêtre d'impression", 'success');
}

// Fonction d'échappement HTML
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Toast
function showToast(message, type) {
    var toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + (type || 'info');
    setTimeout(function() { toast.classList.remove('show'); }, 3000);
}

// Navigation smooth
document.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        var target = link.getAttribute('href');
        document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
        document.querySelectorAll('.nav-link').forEach(function(l) { l.classList.remove('active'); });
        link.classList.add('active');
    });
});

// Listeners inputs
var inputIds = ['fullname','jobtitle','email','phone','location','birthdate','summary','experience','education','skills','languages','interests'];
inputIds.forEach(function(id) {
    var input = document.getElementById(id);
    if (input) {
        input.addEventListener('input', function() { generateCV(); autoSave(); });
    }
});

elements.templateSelect.addEventListener('change', function(e) {
    currentTemplate = parseInt(e.target.value);
    generateCV();
    autoSave();
});

elements.downloadBtn.addEventListener('click', downloadPDF);
elements.resetBtn.addEventListener('click', resetForm);

// Init
window.addEventListener('DOMContentLoaded', function() {
    initTemplatesGallery();
    autoLoad();
    if (!localStorage.getItem('cvFormData')) { generateCV(); }

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.template-card, .stat').forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

setInterval(autoSave, 30000);
window.addEventListener('beforeunload', autoSave);
