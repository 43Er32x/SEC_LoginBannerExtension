// Fonction pour vérifier si le site est dans la liste blanche, y compris les sous-domaines
function isInWhiteList(hostname, whiteList) {
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

// Fonction pour récupérer la liste blanche en ligne et la mettre en cache
async function fetchWhiteListAndCache() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/43Er32x/SEC_LoginBannerExtension/main/whitelist.txt'); // Remplacez 'https://example.com/whitelist.txt' par l'URL réelle de votre liste blanche au format txt
        if (response.ok) {
            const whiteListText = await response.text();
            const whiteList = whiteListText.split('\n').map(domain => domain.trim());
            localStorage.setItem('whiteList', JSON.stringify(whiteList)); // Mettre en cache la liste blanche
            localStorage.setItem('whiteListTimestamp', Date.now()); // Mettre à jour le timestamp de la mise en cache
            return whiteList;
        } else {
            console.error('Failed to fetch whitelist:', response.status);
            return [];
        }
    } catch (error) {
        console.error('Failed to fetch whitelist:', error);
        return [];
    }
}

// Fonction pour récupérer la liste blanche depuis le cache ou en ligne
async function getWhiteList() {
    const whiteListTimestamp = parseInt(localStorage.getItem('whiteListTimestamp'));
    if (!whiteListTimestamp || Date.now() - whiteListTimestamp > 5 * 60 * 1000) { // Vérifier si la liste est absente ou si l'ancienne liste a expiré (30 minutes)
        return fetchWhiteListAndCache();
    } else {
        return JSON.parse(localStorage.getItem('whiteList'));
    }
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

// Fonction pour créer la bannière
function createBanner() {
    const banner = document.createElement('div');
    banner.style.backgroundColor = '#7F0000';
    banner.style.color = 'white'; // Changement de la couleur du texte en blanc
    banner.style.width = '100%'; // La bannière occupe toute la largeur de la page
    banner.style.height = 'flex'; // La bannière occupe 10% de la hauteur de la page
    banner.style.position = 'fixed';
    banner.style.top = '0';
    banner.style.left = '0';
    banner.style.zIndex = '9999';
    banner.style.display = 'flex';
    banner.style.flexDirection = 'column'; // Affichage en colonne
    banner.style.alignItems = 'center'; // Centrer horizontalement
    banner.style.borderBottom = '1px solid black'; // Ajout de la bordure noire en bas


    // Création du logo
    const logoImg = document.createElement('img');
    logoImg.src = 'https://i.ibb.co/NjZkWJB/logo.png'; // Remplacez par l'URL de votre logo
    logoImg.alt = 'Logo'; // Texte alternatif pour l'accessibilité
    logoImg.style.height = '80px'; // Hauteur du logo
    logoImg.style.marginTop = '10px'; // Ajout de la marge au logo
    banner.appendChild(logoImg); // Ajouter le logo à la bannière

    // Espace entre le logo et le texte de la bannière
    const spaceLogoToText = document.createElement('div');
    spaceLogoToText.style.height = '20px'; // Espace entre le logo et le texte
    banner.appendChild(spaceLogoToText);

    // Texte de la bannière
    const bannerText = document.createElement('p');
    bannerText.innerHTML = "<strong>Attention :</strong> Vous êtes sur une page qui demande des identifiants. <br><strong>Merci de ne jamais saisir vos identifiants de l'entreprise sur des sites externes.</strong> <br>Vérifiez toujours l'URL du site et assurez-vous de sa légitimité avant de saisir des informations sensibles.";
    bannerText.style.textAlign = 'center'; // Centrer le texte
    banner.appendChild(bannerText);

    // Conteneur pour les boutons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'flex'; // Affichage des boutons en colonne
    buttonContainer.style.gap = '10px'; // Espacement entre les boutons
    banner.appendChild(buttonContainer);

    // Espace entre le texte et les boutons
    const spaceTextToButtons = document.createElement('div');
    spaceTextToButtons.style.height = '20px'; // Ajustez la hauteur de l'espace ici
    buttonContainer.appendChild(spaceTextToButtons);

    // Bouton Ok
    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.backgroundColor = 'transparent';
    okButton.style.color = 'white';
    okButton.style.border = '1px solid white';
    okButton.style.borderRadius = '20px';
    okButton.style.padding = '10px 20px';
    okButton.style.cursor = 'pointer';
    // Ajout de l'effet de surbrillance sur le bouton Ok
    okButton.addEventListener('mouseenter', function() {
        okButton.style.backgroundColor = 'white';
        okButton.style.color = '#7F0000';
    });
    okButton.addEventListener('mouseleave', function() {
        okButton.style.backgroundColor = 'transparent';
        okButton.style.color = 'white';
    });
    okButton.addEventListener('click', function() {
        banner.style.display = 'none';
    });
    buttonContainer.appendChild(okButton);

    // Bouton Whitelist 24h
    const whitelistButton = document.createElement('button');
    whitelistButton.textContent = 'Whitelist 24h';
    whitelistButton.style.backgroundColor = 'transparent';
    whitelistButton.style.color = 'white';
    whitelistButton.style.border = '1px solid white';
    whitelistButton.style.borderRadius = '20px';
    whitelistButton.style.padding = '10px 20px';
    whitelistButton.style.cursor = 'pointer';
    // Ajout de l'effet de surbrillance sur le bouton Whitelist 24h
    whitelistButton.addEventListener('mouseenter', function() {
        whitelistButton.style.backgroundColor = 'white';
        whitelistButton.style.color = '#7F0000';
    });
    whitelistButton.addEventListener('mouseleave', function() {
        whitelistButton.style.backgroundColor = 'transparent';
        whitelistButton.style.color = 'white';
    });
    whitelistButton.addEventListener('click', function() {
        banner.style.display = 'none';
        // Enregistrer l'heure de la fermeture de la bannière dans le stockage local
        const storageKey = 'bannerCooldown';
        localStorage.setItem(storageKey, Date.now());
    });
    buttonContainer.appendChild(whitelistButton);

    // Espace entre les boutons et la bordure inférieure
    const spaceButtonsToBottom = document.createElement('div');
    spaceButtonsToBottom.style.height = '20px'; // Ajustez la hauteur de l'espace ici
    banner.appendChild(spaceButtonsToBottom);

    // Ajouter la bannière à la page
    document.body.appendChild(banner);
}

// Fonction pour vérifier si un champ de mot de passe est présent sur la page
function isPasswordFieldPresent() {
    const passwordFields = document.querySelectorAll('input[type="password"]');
    return passwordFields.length > 0;
}

// Vérifier si la bannière doit être affichée
const currentURL = window.location.href;
const whitelistCheck = async () => {
    const whiteList = await getWhiteList();
    if (!isInWhiteList(window.location.hostname, whiteList) && (/\/(?:login|signin|register|signup)/i.test(currentURL) || isPasswordFieldPresent())) {
        const bannerCooldown = parseInt(localStorage.getItem('bannerCooldown'));
        const cooldownExpiration = bannerCooldown ? bannerCooldown + (24 * 60 * 60 * 1000) : 0; // Ajouter 24 heures
        if (!bannerCooldown || Date.now() >= cooldownExpiration) {
            createBanner();
        }
    }
};

whitelistCheck();
