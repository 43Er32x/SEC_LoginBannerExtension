// MODIF HERE: Élargissement de l'objet de traductions pour inclure l'anglais
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
    // Vous pouvez ajouter d'autres langues ici
};

// MODIF HERE: Détection de la langue du navigateur et choix de la traduction appropriée ou anglais par défaut
const browserLang = navigator.language.slice(0, 2); // Récupère les deux premiers caractères de la langue du navigateur
const currentLang = translations[browserLang] ? browserLang : 'en'; // Utilise l'anglais si aucune traduction n'est disponible pour la langue du navigateur

function isInWhiteList(hostname, whiteList) {
    const parts = hostname.split('.');
    for (let i = 0; i < parts.length; i++) {
        const domain = parts.slice(i).join('.');
        if (whiteList.includes(domain)) {
            return true;
        }
    }
    return false;
}

async function fetchWhiteListAndCache() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/43Er32x/SEC_LoginBannerExtension/main/whitelist.txt');
        if (response.ok) {
            const whiteListText = await response.text();
            const whiteList = whiteListText.split('\n').map(domain => domain.trim());
            localStorage.setItem('whiteList', JSON.stringify(whiteList));
            localStorage.setItem('whiteListTimestamp', Date.now());
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

async function getWhiteList() {
    const whiteListTimestamp = parseInt(localStorage.getItem('whiteListTimestamp'));
    if (!whiteListTimestamp || Date.now() - whiteListTimestamp > 5 * 60 * 1000) {
        return fetchWhiteListAndCache();
    } else {
        return JSON.parse(localStorage.getItem('whiteList'));
    }
}

function createBanner() {
    const banner = document.createElement('div');
    banner.style.backgroundColor = '#7F0000';
    banner.style.color = 'white';
    banner.style.width = '100%';
    banner.style.height = 'flex';
    banner.style.position = 'fixed';
    banner.style.top = '0';
    banner.style.left = '0';
    banner.style.zIndex = '9999';
    banner.style.display = 'flex';
    banner.style.flexDirection = 'column';
    banner.style.alignItems = 'center';
    banner.style.borderBottom = '1px solid black';

    const logoImg = document.createElement('img');
    logoImg.src = 'https://i.ibb.co/NjZkWJB/logo.png';
    logoImg.alt = 'Logo';
    logoImg.style.height = '80px';
    logoImg.style.marginTop = '10px';
    banner.appendChild(logoImg);

    const spaceLogoToText = document.createElement('div');
    spaceLogoToText.style.height = '20px';
    banner.appendChild(spaceLogoToText);

    const bannerText = document.createElement('p');
    bannerText.innerHTML = translations[currentLang].bannerText;
    bannerText.style.textAlign = 'center';
    banner.appendChild(bannerText);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'flex';
    buttonContainer.style.gap = '10px';
    banner.appendChild(buttonContainer);

    const spaceTextToButtons = document.createElement('div');
    spaceTextToButtons.style.height = '20px';
    buttonContainer.appendChild(spaceTextToButtons);

    const okButton = document.createElement('button');
    okButton.textContent = translations[currentLang].okButton;
    okButton.style.backgroundColor = 'transparent';
    okButton.style.color = 'white';
    okButton.style.border = '1px solid white';
    okButton.style.borderRadius = '20px';
    okButton.style.padding = '10px 20px';
    okButton.style.cursor = 'pointer';
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

    const whitelistButton = document.createElement('button');
    whitelistButton.textContent = translations[currentLang].whitelistButton;
    whitelistButton.style.backgroundColor = 'transparent';
    whitelistButton.style.color = 'white';
    whitelistButton.style.border = '1px solid white';
    whitelistButton.style.borderRadius = '20px';
    whitelistButton.style.padding = '10px 20px';
    whitelistButton.style.cursor = 'pointer';
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
        localStorage.setItem('bannerCooldown', Date.now());
    });
    buttonContainer.appendChild(whitelistButton);

    const spaceButtonsToBottom = document.createElement('div');
    spaceButtonsToBottom.style.height = '20px';
    banner.appendChild(spaceButtonsToBottom);

    document.body.appendChild(banner);
}

function isPasswordFieldPresent() {
    const passwordFields = document.querySelectorAll('input[type="password"]');
    return passwordFields.length > 0;
}

const currentURL = window.location.href;
const whitelistCheck = async () => {
    const whiteList = await getWhiteList();
    if (!isInWhiteList(window.location.hostname, whiteList) && (/\/(?:login|signin|register|signup)/i.test(currentURL) || isPasswordFieldPresent())) {
        const bannerCooldown = parseInt(localStorage.getItem('bannerCooldown'));
        const cooldownExpiration = bannerCooldown ? bannerCooldown + (24 * 60 * 60 * 1000) : 0;
        if (!bannerCooldown || Date.now() >= cooldownExpiration) {
            createBanner();
        }
    }
};

whitelistCheck();

