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
    banner.style.cssText = 'background-color: #7F0000 !important; color: white !important; width: 100% !important; position: fixed !important; top: 0 !important; left: 0 !important; z-index: 9999 !important; display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; padding: 10px 0 !important; font-family: Arial, sans-serif !important; font-size: 16px !important; line-height: 1.5 !important; border-bottom: 1px solid black !important;';

    const logoImg = document.createElement('img');
    logoImg.src = 'https://i.ibb.co/NjZkWJB/logo.png';
    logoImg.alt = 'Logo';
    logoImg.style.cssText = 'height: 80px !important; margin: 10px 0 !important;';
    banner.appendChild(logoImg);

    const bannerText = document.createElement('p');
    bannerText.innerHTML = translations[currentLang].bannerText;
    bannerText.style.cssText = 'text-align: center !important; margin: 10px 20px !important;';
    banner.appendChild(bannerText);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex !important; gap: 10px !important; flex-wrap: wrap !important; justify-content: center !important; margin-top: 20px !important;';
    
    const okButton = document.createElement('button');
    okButton.textContent = translations[currentLang].okButton;
    okButton.style.cssText = 'background-color: #7F0000 !important; color: white !important; border: 1px solid white !important; border-radius: 20px !important; padding: 10px 20px !important; cursor: pointer !important; font-family: Arial, sans-serif !important; font-size: 14px !important;';
    okButton.onclick = function() { banner.style.display = 'none'; };
    okButton.onmouseenter = function() { this.style.backgroundColor = 'white'; this.style.color = '#7F0000'; };
    okButton.onmouseleave = function() { this.style.backgroundColor = '#7F0000'; this.style.color = 'white'; };

    const whitelistButton = document.createElement('button');
    whitelistButton.textContent = translations[currentLang].whitelistButton;
    whitelistButton.style.cssText = 'background-color: #7F0000 !important; color: white !important; border: 1px solid white !important; border-radius: 20px !important; padding: 10px 20px !important; cursor: pointer !important; font-family: Arial, sans-serif !important; font-size: 14px !important;';
    whitelistButton.onclick = function() { banner.style.display = 'none'; localStorage.setItem('bannerCooldown', Date.now()); };
    whitelistButton.onmouseenter = function() { this.style.backgroundColor = 'white'; this.style.color = '#7F0000'; };
    whitelistButton.onmouseleave = function() { this.style.backgroundColor = '#7F0000'; this.style.color = 'white'; };
    
    buttonContainer.appendChild(okButton);
    buttonContainer.appendChild(whitelistButton);
    banner.appendChild(buttonContainer);

    document.body.appendChild(banner);
}

function isPasswordFieldPresent() {
    return document.querySelectorAll('input[type="password"]').length > 0;
}

async function checkAndDisplayBanner() {
    const whiteList = await getWhiteList();
    if (!isInWhiteList(window.location.hostname, whiteList) && (/\/(?:login|signin|register|signup)/i.test(window.location.href) || isPasswordFieldPresent())) {
        const bannerCooldown = parseInt(localStorage.getItem('bannerCooldown'));
        const cooldownExpiration = bannerCooldown ? bannerCooldown + (24 * 60 * 60 * 1000) : 0;
        if (!bannerCooldown || Date.now() >= cooldownExpiration) {
            createBanner();
        }
    }
}

checkAndDisplayBanner();
