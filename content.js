// Fonction pour vérifier si la page contient un champ de mot de passe
function containsPasswordInput() {
    var passwordInputs = document.querySelectorAll('input[type="password"]');
    return passwordInputs.length > 0;
}

// Fonction pour vérifier si l'URL contient des mots clés de pages de connexion ou d'inscription
function isLoginPageURL(url) {
    return url.includes('/login') || url.includes('/signin') || url.includes('/register') || url.includes('/signup');
}

// Liste blanche de domaines autorisés avec sous-domaines
const whiteList = [
    'spotify.com',
    'facebook.com',
    'google.fr'
];

// Fonction pour vérifier si le site est dans la liste blanche, y compris les sous-domaines
function isInWhiteList(hostname) {
    // Obtenir le domaine et les sous-domaines de l'URL actuelle
    const parts = hostname.split('.');
    for (let i = 0; i < parts.length; i++) {
        const domain = parts.slice(i).join('.');
        if (whiteList.includes(domain)) {
            return true;
        }
    }
    return false;
}

// Obtenir l'URL actuelle
const currentURL = window.location.href;

// Vérifier si le site est dans la liste blanche
const hostname = window.location.hostname;
const isWhiteListed = isInWhiteList(hostname);

// Obtenir la langue du navigateur
const userLanguage = navigator.language;

// Texte par défaut en français
let bannerText = "<br><strong>Attention :</strong> Vous êtes sur une page qui demande des identifiants. <br><strong>Merci de ne jamais saisir vos identifiants de l'entreprise sur des sites externes.</strong> <br>Vérifiez toujours l'URL du site et assurez-vous de sa légitimité avant de saisir des informations sensibles.<br><br>";

// Vérifier si la langue est l'anglais et traduire le texte
if (userLanguage.startsWith('en')) {
    bannerText = "<br><strong>Attention:</strong> You are on a page requesting credentials. <br><strong>Please never enter your company credentials on external sites.</strong> <br>Always verify the site's URL and ensure its legitimacy before entering sensitive information.<br><br>";
}

// Vérifier si la page contient un champ de mot de passe ou si c'est une page de connexion ou d'inscription
if (!isWhiteListed && (containsPasswordInput() || isLoginPageURL(currentURL))) {
    // Créer une bannière rouge
    var redBanner = document.createElement('div');
    redBanner.style.backgroundColor = 'red';
    redBanner.style.color = 'white';
    redBanner.style.width = '100%';
    redBanner.style.padding = '10px';
    redBanner.style.textAlign = 'center';
    redBanner.style.position = 'fixed';
    redBanner.style.top = '0';
    redBanner.style.left = '0';
    redBanner.style.zIndex = '9999';

    // Créer l'image du logo
    var logoImg = document.createElement('img');
    logoImg.src = 'https://i.ibb.co/NjZkWJB/logo.png'; // Spécifiez l'URL directe de votre image
    logoImg.style.width = '223px'; // Définir la largeur du logo
    logoImg.style.height = '78px'; // Définir la hauteur du logo
    redBanner.appendChild(logoImg); // Ajouter le logo à la bannière

    // Créer le texte dans la bannière
    var bannerTextElement = document.createElement('div');
    bannerTextElement.innerHTML = bannerText;
    redBanner.appendChild(bannerTextElement); // Ajouter le texte à la bannière

    // Créer un bouton de fermeture
    var closeButton = document.createElement('button');
    closeButton.textContent = 'Ok';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.color = 'white';
    closeButton.style.border = '1px solid white'; // Ajouter une bordure autour du bouton
    closeButton.style.cursor = 'pointer';
    closeButton.style.float = 'center';
    closeButton.addEventListener('click', function() {
    redBanner.style.display = 'none';
});

// Ajouter le bouton de fermeture à la bannière
redBanner.appendChild(closeButton);


    // Ajouter la bannière à la page
    document.body.appendChild(redBanner);
}
