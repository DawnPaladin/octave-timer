var cacheName = 'v1:static';
self.addEventListener('install', function(e) {
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			return cache.addAll([
				'./index.html',
				'./css/style.min.css',
				'./css/bootstrap.css',
        './audio/half.mp3',
        './audio/octave.mp3',
        './audio/scale.mp3',
        './audio/third.mp3',
        './js/jquery.js',
        './js/bootstrap.js',
        './js/project.js',
				'https://fonts.googleapis.com/css?family=Orbitron'
			]).then(function() {
				self.skipWaiting();
			});
		})
	);
});
self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			if (response) {
				return response;
			}
			return fetch(event.request);
		})
	);
});
