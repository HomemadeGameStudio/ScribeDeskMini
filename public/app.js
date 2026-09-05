/* Ultraviolet Games - Main Application Script */

// Complete list of games from lessons-moved- repository
const games = [
    { id: 'amanda-the-adventurer', name: 'Amanda The Adventurer' },
    { id: 'andys-apple-farm', name: "Andy's Apple Farm" },
    { id: 'baldi-plus', name: "Baldi's Basics Plus" },
    { id: 'baldi-remaster', name: "Baldi's Basics Classic Remastered" },
    { id: 'bendy', name: 'Bendy and The Ink Machine' },
    { id: 'bergentruck', name: 'BERGENTRUCK 201x' },
    { id: 'bloodmoney', name: 'BLOODMONEY!' },
    { id: 'buckshot-roulette', name: 'Buckshot Roulette' },
    { id: 'class-of-09', name: "Class of '09" },
    { id: 'cuphead', name: 'Cuphead' },
    { id: 'dead-plate', name: 'Dead Plate' },
    { id: 'deadseat', name: 'Deadseat' },
    { id: 'deltatraveler', name: 'Deltarune' },
    { id: 'donottakethiscathome', name: 'Do NOT Take This Cat Home' },
    { id: 'fears-to-fathom', name: 'Fears to Fathom: Home Alone' },
    { id: 'getting-over-it', name: 'Getting Over It' },
    { id: 'happy-sheepies', name: 'Happy Sheepies' },
    { id: 'hotline-miami', name: 'Hotline Miami' },
    { id: 'human-expenditure-program', name: 'Human Expenditure Program' },
    { id: 'jelly-drift', name: 'Jelly Drift' },
    { id: 'karlson', name: 'Karlson' },
    { id: 'kindergarten', name: 'Kindergarten 1 & 2' },
    { id: 'lacysflashgames', name: "Lacey's Flash Games" },
    { id: 'milkman-karlson', name: 'Milkman Karlson' },
    { id: 'minesweeperplus', name: 'Minesweeper+' },
    { id: 'omori-fixed', name: 'OMORI' },
    { id: 'people-playground', name: 'People Playground' },
    { id: 'pizza-tower', name: 'Pizza Tower' },
    { id: 'raft', name: 'RAFT' },
    { id: 'repo', name: 'R.E.P.O' },
    { id: 'schoolboy-runaway', name: 'Schoolboy Runaway' },
    { id: 'slender', name: 'Slender: The Eight Pages' },
    { id: 'sonic.exe', name: 'Sonic.exe' },
    { id: 'speed-stars', name: 'Speed Stars' },
    { id: 'tattletail', name: 'Tattletail' },
    { id: 'thats-not-my-neighbor', name: "That's Not My Neighbor" },
    { id: 'the-man-in-the-window', name: 'The Man From the Window' },
    { id: 'ultrakill', name: 'Ultrakill' },
    { id: 'undertale-yellow', name: 'Undertale Yellow' },
    { id: 'web-fishing', name: 'Web Fishing' },
    { id: 'witch-heart', name: 'Witch Heart' },
    { id: 'yandere-simulator', name: 'Yandere Simulator' },
    { id: 'yume-nikki', name: 'Yume Nikki' }
];

// Get UV config (will be available after uv.config.js loads)
function getUVConfig() {
    return self.__uv$config || {
        prefix: '/service/',
        encodeUrl: (url) => encodeURIComponent(url),
        decodeUrl: (url) => decodeURIComponent(url)
    };
}

// Render game cards
function renderGames() {
    const grid = document.getElementById('games-grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        
        const directUrl = `/games/${game.id}/`;
        const proxiedUrl = getProxyUrl(directUrl);
        
        card.innerHTML = `
            <h3>${escapeHtml(game.name)}</h3>
            <div class="game-actions">
                <a href="${directUrl}" class="btn btn-play" target="_blank">Play Direct</a>
                <a href="${proxiedUrl}" class="btn btn-proxy" target="_blank">Play via Proxy</a>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Get proxied URL using Ultraviolet encoding
function getProxyUrl(url) {
    const config = getUVConfig();
    const fullUrl = url.startsWith('/') ? window.location.origin + url : url;
    
    if (typeof config.encodeUrl === 'function') {
        return config.prefix + config.encodeUrl(fullUrl);
    }
    
    // Fallback: simple encoding
    return config.prefix + encodeURIComponent(fullUrl);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle proxy launch button
function setupProxyButton() {
    const btn = document.getElementById('launch-proxy-btn');
    if (!btn) return;
    
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const config = getUVConfig();
        // Launch a popular site through proxy as demo
        const demoUrl = 'https://www.google.com';
        const proxiedUrl = getProxyUrl(demoUrl);
        window.open(proxiedUrl, '_blank');
    });
}

// Register service worker for UV
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            console.log('Service Worker registered successfully');
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    renderGames();
    setupProxyButton();
    registerServiceWorker();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
