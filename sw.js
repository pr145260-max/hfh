const CACHE_NAME = 'hfh-cache-v1';

// আপনার প্রজেক্টের মূল ফাইলগুলো এখানে দিন
const PRECACHE_ASSETS = [
    './',
    './index.html',
    './manifest.json'
];

// Listener for the install event - precaches our assets list on service worker install.
self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(PRECACHE_ASSETS); // 'await' যোগ করা হয়েছে
    })());
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        (async () => { // ব্র্যাকেটের সিনট্যাক্স ঠিক করা হয়েছে
            const cache = await caches.open(CACHE_NAME);

            // Only cache GET requests
            if (event.request.method !== 'GET') {
                return fetch(event.request);
            }

            // match the request to our cache
            const cachedResponse = await cache.match(event.request);

            // check if we got a valid response
            if (cachedResponse) {
                return cachedResponse; // Cache hit, return the resource
            } else {
                // Otherwise, go to the network
                return fetch(event.request);
            }
        })() // ফাংশনটি এখানে কল করা হয়েছে
    );
});