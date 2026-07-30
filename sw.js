// ==========================================
// NOMBRE ÚNICO PARA LA CAJA FUERTE DE ESTA APP
// ==========================================
const CACHE_NAME = 'afinador-guitarra-v1'; 

// ==========================================
// ARCHIVOS QUE SE GUARDAN EN EL CELULAR
// ==========================================
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icono.png'
];

// 1. INSTALACIÓN: Descarga y guarda todo en la memoria interna
self.addEventListener('install', event => {
  self.skipWaiting(); // Obliga a instalarse de inmediato
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. INTERCEPCIÓN (MODO OFFLINE REAL): Corta la salida a internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el archivo ya está en el celular, lo devuelve al instante
        if (response) {
          return response;
        }
        // Si no está, intenta ir a buscarlo a internet
        return fetch(event.request);
      })
  );
});

// 3. ACTIVACIÓN: Limpieza de versiones viejas si llegás a actualizar la app
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Borra el caché viejo
          }
        })
      );
    })
  );
  return self.clients.claim(); // Toma el control de la pantalla al instante
});
