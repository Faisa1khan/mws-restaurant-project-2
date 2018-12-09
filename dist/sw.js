importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

/**
 * Workbox 3.2.0
 * Workbox - https://developers.google.com/web/tools/workbox/
 * Codelab - https://codelabs.developers.google.com/codelabs/workbox-lab/
 *
 * Workbox creates a configuration file (in this case workbox-config.js) that
 * workbox-cli uses to generate service workers. The config file specifies where
 * to look for files (globDirectory), which files to precache (globPatterns),
 * and the file names for our source and production service workers (swSrc and
 * swDest, respectively). We can also modify this config file directly to change
 * what files are precached.
 * The importScripts call imports the workbox-sw.js library so the workbox
 * object gives our service worker access to all the Workbox modules.
 */

if (workbox) {
  console.log(`[DEBUG] Workbox is loaded.`);

  // Debugging Workbox
  // Force development builds
  // workbox.setConfig({ debug: true });
  // Force production builds
  workbox.setConfig({ debug: false });

  // Custom Cache Names
  // https://developers.google.com/web/tools/workbox/guides/configure-workbox
  workbox.core.setCacheNameDetails({
    prefix: 'pwa',
    suffix: 'v1'
  });
  // The precacheAndRoute method of the precaching module takes a precache
  // "manifest" (a list of file URLs with "revision hashes") to cache on service
  // worker installation. It also sets up a cache-first strategy for the
  // specified resources, serving them from the cache by default.
  // In addition to precaching, the precacheAndRoute method sets up an implicit
  // cache-first handler.
  workbox.precaching.precacheAndRoute([
  {
    "url": "css/styles.min.css",
    "revision": "cc774edeab66b3bc189536a23e7ec52f"
  },
  {
    "url": "index.html",
    "revision": "6480d689122e88aa2da46baa3f964753"
  },
  {
    "url": "js/dbhelper.js",
    "revision": "e9b70fc05532078adfa037255f1f7842"
  },
  {
    "url": "js/idb.js",
    "revision": "ba7837a5246faa8d30d3d8c8cc38d978"
  },
  {
    "url": "js/lazysizes.min.js",
    "revision": "189955cddf8849b19c611252bee2ad5c"
  },
  {
    "url": "js/main.js",
    "revision": "22836ec8c387b1e2552e121dd012a3f4"
  },
  {
    "url": "js/register.js",
    "revision": "1b93111fbcb792df5064bcf947483066"
  },
  {
    "url": "js/restaurant_info.js",
    "revision": "a107935eac8938eba29c8cd727d704c7"
  },
  {
    "url": "restaurant.html",
    "revision": "6f04929e287e103f3666e770aee95cf8"
  },
  {
    "url": "manifest.json",
    "revision": "a77d65cf526c708188225a22958ac28a"
  }
]);

  
  // Google Maps APIs
  // https://developers.google.com/web/tools/workbox/modules/workbox-strategies#stale-while-revalidate
  // Use cache but update in the background ASAP.
  // workbox.routing.registerRoute(
  //   new RegExp('https://maps.(?:googleapis|gstatic).com/(.*)'),
  //   workbox.strategies.staleWhileRevalidate({
  //     cacheName: 'pwa-maps-cache',
  //     cacheExpiration: {
  //       maxEntries: 20
  //     },
  //     // Status 0 is the response you would get if you request a cross-origin
  //     // resource and the server that you're requesting it from is not
  //     // configured to serve cross-origin resources.
  //     cacheableResponse: {statuses: [0, 200]}
  //   })
  // );

  // Images
  // https://developers.google.com/web/tools/workbox/modules/workbox-strategies#cache_first_cache_falling_back_to_network
  // https://developers.google.com/web/tools/workbox/modules/workbox-cache-expiration
  workbox.routing.registerRoute(
    /\.(?:jpeg|webp|png|gif|jpg|svg)$/,
    // Whenever the app requests images, the service worker checks the
    // cache first for the resource before going to the network.
    workbox.strategies.cacheFirst({
      cacheName: 'pwa-images-cache',
      // A maximum of 60 entries will be kept (automatically removing older
      // images) and these files will expire in 30 days.
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        })
      ]
    })
  );

  // Restaurants
  // https://developers.google.com/web/tools/workbox/modules/workbox-strategies#network_first_network_falling_back_to_cache
  // http://localhost:8887/restaurant.html?id=1
  workbox.routing.registerRoute(
    new RegExp('restaurant.html(.*)'),
    workbox.strategies.networkFirst({
      cacheName: 'pwa-restaurants-cache',
      // Status 0 is the response you would get if you request a cross-origin
      // resource and the server that you're requesting it from is not
      // configured to serve cross-origin resources.
      cacheableResponse: {statuses: [0, 200]}
    })
  );

} else {
  console.log(`[DEBUG] Workbox didn't load.`);
}
