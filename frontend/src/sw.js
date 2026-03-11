import { precacheAndRoute } from 'workbox-precaching';

// Inject manifest and precache compiled assets
precacheAndRoute(self.__WB_MANIFEST || []);

// Activate new service worker instantly
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
