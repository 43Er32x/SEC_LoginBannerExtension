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

// Fonction pour détecter la langue
function detectLanguage() {
    const userLanguage = navigator.language;
    if (userLanguage.startsWith('en')) {
        return 'en';
    }
    // Par défaut, retourne 'fr' pour le français
    return 'fr';
}

// Obtenir l'URL actuelle
const currentURL = window.location.href;

// Vérifier si le site est dans la liste blanche
const hostname = window.location.hostname;
const isWhiteListed = isInWhiteList(hostname);

// Vérifier si la page contient un champ de mot de passe ou si c'est une page de connexion ou d'inscription
if (!isWhiteListed && (document.querySelector('input[type="password"]') || /\/(?:login|signin|register|signup)/i.test(currentURL))) {
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

    // Texte par défaut en français
    let bannerText = "<br><strong>Attention :</strong> Vous êtes sur une page qui demande des identifiants. <br><strong>Merci de ne jamais saisir vos identifiants de l'entreprise sur des sites externes.</strong> <br>Vérifiez toujours l'URL du site et assurez-vous de sa légitimité avant de saisir des informations sensibles.<br><br>";

    // Détection de la langue
    const language = detectLanguage();
    if (language === 'en') {
        // Texte en anglais
        bannerText = "<br><strong>Attention:</strong> You are on a page requesting credentials. <br><strong>Please never enter your company credentials on external sites.</strong> <br>Always verify the site's URL and ensure its legitimacy before entering sensitive information.<br><br>";
    }

    // Créer le texte dans la bannière
    var bannerTextElement = document.createElement('div');
    bannerTextElement.innerHTML = bannerText;
    redBanner.appendChild(bannerTextElement); // Ajouter le texte à la bannière

    // Créer un conteneur pour les boutons
    var buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    redBanner.appendChild(buttonContainer);

    // Créer le bouton de saut
    var skipButton = document.createElement('button');
    skipButton.textContent = 'Ok';
    skipButton.style.backgroundColor = 'transparent';
    skipButton.style.color = 'white';
    skipButton.style.border = '1px solid white'; // Ajouter une bordure autour du bouton
    skipButton.style.cursor = 'pointer';
    skipButton.style.marginRight = '10px';
    skipButton.addEventListener('click', function() {
        redBanner.style.display = 'none';
    });

    // Créer le bouton OK
    var okButton = document.createElement('button');
    okButton.textContent = 'Whitelist 24h';
    okButton.style.backgroundColor = 'transparent';
    okButton.style.color = 'white';
    okButton.style.border = '1px solid white'; // Ajouter une bordure autour du bouton
    okButton.style.cursor = 'pointer';
    okButton.addEventListener('click', function() {
        redBanner.style.display = 'none';

        // Enregistrer l'heure de la fermeture de la bannière dans le stockage local
        const storageKey = 'bannerCooldown_' + hostname;
        localStorage.setItem(storageKey, Date.now());
    });

    // Ajouter les boutons au conteneur
    buttonContainer.appendChild(skipButton);
    buttonContainer.appendChild(okButton);

    // Vérifier si le cooldown est expiré pour le site actuel
    const storageKey = 'bannerCooldown_' + hostname;
    const lastCloseTime = localStorage.getItem(storageKey);
    const cooldownExpiration = lastCloseTime ? parseInt(lastCloseTime) + (24 * 60 * 60 * 1000) : 0; // Ajouter 24 heures

    if (!lastCloseTime || Date.now() >= cooldownExpiration) {
        // Ajouter la bannière à la page si le cooldown est expiré
        document.body.appendChild(redBanner);
    }
}

