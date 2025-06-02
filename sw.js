// Service Worker Configuration
const CACHE_NAME = 'portfolio-cache-v2';
const CACHE_VERSION = 'v2';
const CACHE_EXPIRATION = 60 * 60 * 24 * 7; // 7 days

// Cacheable Resources
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/js/main.js',
    'https://res.cloudinary.com/dgqequjgk/image/upload/v1746396663/SAVE_%D9%A2%D9%A0%D9%A2%D9%A1%D9%A1%D9%A1%D9%A0%D9%A1_%D9%A2%D9%A0%D9%A4%D9%A1%D9%A1%D9%A7_dfvhad.jpg',
    'https://res.cloudinary.com/dgqequjgk/image/upload/v1746396680/pexels-harold-vasquez-853421-2653362_lxcjdp.jpg',
    'https://res.cloudinary.com/dgqequjgk/image/upload/v1746396632/screely-1738014881775_bnhlfq.png',
    'https://res.cloudinary.com/dgqequjgk/image/upload/v1746396680/screely-1738014901419_glcjxt.png',
    'https://res.cloudinary.com/dgqequjgk/image/upload/v1746396632/screely-1738862036751_f4ippz.png',
    'https://res.cloudinary.com/dgqequjgk/image/upload/v1746396631/screely-1740003123790_gk4tcz.png',
    'https://unpkg.com/aos@2.3.1/dist/aos.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/webfonts/fa-solid-900.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/webfonts/fa-regular-400.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/webfonts/fa-brands-400.woff2',
    'https://unpkg.com/aos@2.3.1/dist/aos.js',
    'https://cdn.tailwindcss.com'
];

// Cross-Origin Domains to Cache
const allowedOrigins = [
    'https://res.cloudinary.com',
    'https://unpkg.com',
    'https://cdnjs.cloudflare.com'
];

// Install Event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log(`[Service Worker] Cache ${CACHE_NAME} opened`);
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('[Service Worker] Cache installation failed:', error);
            })
    );
});

// Fetch Event
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Check if request is from allowed origins
    const isAllowedOrigin = allowedOrigins.some(origin => 
        event.request.url.startsWith(origin)
    );

    if (!event.request.url.startsWith(self.location.origin) && !isAllowedOrigin) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached response if found
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest)
                    .then(response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Cache the response
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            })
                            .catch(error => {
                                console.error('[Service Worker] Cache put failed:', error);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Return offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('/');
                        }
                        // Return offline image for image requests
                        if (event.request.destination === 'image') {
                            return caches.match('/offline-image.png');
                        }
                    });
            })
    );
});

// Activate Event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .catch(error => {
                console.error('[Service Worker] Cache cleanup failed:', error);
            })
    );
});

// Message Event
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
}); 