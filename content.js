// Objets de traduction pour les textes affichés dans la bannière
const translations = {
    'fr': {
        bannerText: "<strong>Attention :</strong> Vous êtes sur une page qui demande des identifiants. <br><strong>Merci de ne jamais saisir vos identifiants de l'entreprise sur des sites externes.</strong> <br>Vérifiez toujours l'URL du site et assurez-vous de sa légitimité avant de saisir des informations sensibles.",
        okButton: 'OK',
        whitelistButton: 'Whitelist 24h'
    },
    'en': {
        bannerText: "<strong>Attention:</strong> You are on a page that is asking for credentials. <br><strong>Please never enter your company credentials on external sites.</strong> <br>Always check the site's URL and ensure its legitimacy before entering sensitive information.",
        okButton: 'OK',
        whitelistButton: 'Whitelist 24h'
    },
};

// Détection de la langue du navigateur pour choisir les traductions appropriées
const browserLang = navigator.language.slice(0, 2);
const currentLang = translations[browserLang] ? browserLang : 'en';

// Fonction pour vérifier si l'URL actuelle est dans la liste blanche
function isInWhiteList(hostname, whiteList) {
    return whiteList.some(domain => hostname.endsWith(domain));
}

// Fonction pour récupérer la liste blanche, avec mise en cache
async function getWhiteList() {
    const cache = localStorage.getItem('whiteList');
    const cacheTimestamp = parseInt(localStorage.getItem('whiteListTimestamp'), 10);
    const isCacheValid = cache && (Date.now() - cacheTimestamp < 24 * 60 * 60 * 1000);

    if (isCacheValid) {
        return JSON.parse(cache);
    } else {
        const response = await fetch('https://raw.githubusercontent.com/43Er32x/SEC_LoginBannerExtension/main/whitelist.txt');
        const whiteListText = await response.text();
        const whiteList = whiteListText.split('\n').map(domain => domain.trim());
        localStorage.setItem('whiteList', JSON.stringify(whiteList));
        localStorage.setItem('whiteListTimestamp', Date.now().toString());
        return whiteList;
    }
}

// Fonction pour créer et afficher la bannière
async function createBanner() {
    const banner = document.createElement('div');
    // Styles de la bannière

    const logoImg = document.createElement('img');
    logoImg.alt = 'Logo';
    // Styles de l'image du logo

    // Mise en cache de l'image du logo
    const logoCache = localStorage.getItem('logoCache');
    if (logoCache) {
        logoImg.src = logoCache;
    } else {
        // Remplacer par l'URL de votre image
        const logoUrl = 'https://i.ibb.co/NjZkWJB/logo.png';
        fetch(logoUrl)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    localStorage.setItem('logoCache', reader.result);
                    logoImg.src = reader.result;
                };
                reader.readAsDataURL(blob);
            });
    }

    banner.appendChild(logoImg);
    // Ajout du reste du contenu de la bannière

    document.body.prepend(banner); // Utiliser prepend pour s'assurer que la bannière est au début du body
}

// Fonction principale pour vérifier les conditions et afficher la bannière si nécessaire
async function checkAndDisplayBanner() {
    const whiteList = await getWhiteList();
    if (!isInWhiteList(window.location.hostname, whiteList) && isPasswordFieldPresent()) {
        createBanner();
    }
}

// Fonction pour vérifier la présence d'un champ mot de passe
function isPasswordFieldPresent() {
    return document.querySelectorAll('input[type=password]').length > 0;
}

// Exécution de la vérification au chargement de la page
window.addEventListener('DOMContentLoaded', checkAndDisplayBanner);


