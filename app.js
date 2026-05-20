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

// Téléchargement PDF — fetch les CSS puis ouvre la fenêtre d'impression
function downloadPDF() {
    generateCV();
    var cvElement = document.querySelector('.cv-content');
    if (!cvElement) { showToast('Contenu introuvable', 'error'); return; }

    showToast('Préparation du PDF...', 'info');

    // Récupérer les URLs des feuilles de style locales
    var cssUrls = [];
    Array.from(document.styleSheets).forEach(function(sheet) {
        if (sheet.href) { cssUrls.push(sheet.href); }
    });

    // Fetch toutes les CSS en parallèle
    var promises = cssUrls.map(function(url) {
        return fetch(url)
            .then(function(r) { return r.text(); })
            .catch(function() { return ''; });
    });

    var cvHTML = cvElement.outerHTML;
    var nom = elements.fullname.value || 'CV';
    var templateNum = currentTemplate;

    Promise.all(promises).then(function(cssTexts) {
        var allCSS = cssTexts.join('\n');

        // CSS spécifique impression une page A4
        var printCSS = ''
            + '* { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }'
            + 'html, body { margin: 0; padding: 0; background: white; }'
            + '.cv-content {'
            + '  width: 190mm; max-width: 190mm;'
            + '  padding: 8mm 10mm !important;'
            + '  margin: 0 auto !important;'
            + '  font-size: 0.78rem !important;'
            + '  line-height: 1.3 !important;'
            + '  background: white;'
            + '}'
            + '.cv-content .cv-name { font-size: 1.4rem !important; }'
            + '.cv-content .cv-job { font-size: 0.88rem !important; }'
            + '.cv-content .cv-header { padding: 0.8rem !important; margin-bottom: 0.8rem !important; border-radius: 10px !important; }'
            + '.cv-content .cv-section { margin: 0.45rem 0 !important; }'
            + '.cv-content .cv-section h3 { font-size: 0.80rem !important; margin-bottom: 0.2rem !important; padding-bottom: 0.15rem !important; }'
            + '.cv-content .cv-text { font-size: 0.75rem !important; line-height: 1.25 !important; }'
            + '.cv-content .skill-tag { font-size: 0.68rem !important; padding: 0.1rem 0.4rem !important; }'
            + '.cv-content .flex-2cols { gap: 0.6rem !important; }'
            + '.cv-content .skills-list { gap: 0.25rem !important; }'
            + '.cv-content .cv-photo { width: 80px !important; height: 80px !important; }'
            + '.cv-content .cv-contact { gap: 0.5rem !important; font-size: 0.72rem !important; }'
            + '@page { size: A4 portrait; margin: 0; }'
            + '@media print {'
            + '  html, body { width: 210mm; height: 297mm; overflow: hidden; }'
            + '  .cv-content { page-break-inside: avoid; break-inside: avoid; }'
            + '}';

        var html = '<!DOCTYPE html>'
            + '<html lang="fr"><head>'
            + '<meta charset="UTF-8">'
            + '<title>CV - ' + nom + '</title>'
            + '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">'
            + '<style>' + allCSS + '</style>'
            + '<style>' + printCSS + '</style>'
            + '</head><body>'
            + cvHTML
            + '<scr' + 'ipt>'
            + 'window.onload = function() {'
            + '  setTimeout(function() {'
            + '    window.print();'
            + '    window.onafterprint = function() { window.close(); };'
            + '  }, 800);'
            + '};'
            + '</scr' + 'ipt>'
            + '</body></html>';

        var printWindow = window.open('', '_blank', 'width=900,height=700');
        if (!printWindow) {
            showToast('Autorisez les popups pour télécharger le PDF', 'error');
            return;
        }
        printWindow.document.write(html);
        printWindow.document.close();
        showToast('Choisissez "Enregistrer en PDF" dans la fenêtre d\'impression', 'success');
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
