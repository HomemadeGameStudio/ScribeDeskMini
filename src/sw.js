/*global UVServiceWorker,__uv$config*/
/*
 * Stock service worker script.
 * Users can provide their own sw.js if they need to extend the functionality of the service worker.
 * Ideally, this will be registered under the scope in uv.config.js so it will not need to be modified.
 * However, if a user changes the location of uv.bundle.js/uv.config.js or sw.js is not relative to them, they will need to modify this script locally.
 */
importScripts("uv.bundle.js");
importScripts("uv.config.js");
importScripts(__uv$config.sw || "uv.sw.js");

const uv = new UVServiceWorker();

async function handleRequest(event) {
    const requestUrl = new URL(event.request.url);
    
    // Serve game files directly (not through proxy) - allows games to load without UV interference
    if (requestUrl.pathname.startsWith('/games/')) {
        return await fetch(event.request);
    }
    
    // Use UV proxy for /service/ prefixed requests
    if (uv.route(event)) {
        return await uv.fetch(event);
    }
    
    // Default: fetch normally
    return await fetch(event.request);
}

self.addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event));
});
