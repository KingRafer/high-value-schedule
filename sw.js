const CACHE_NAME="hvos-static-v1";
const APP_FILES=["/","/index.html","/styles.css","/extra.css","/app.js","/cloud-bootstrap.js","/core.js","/modules.js","/modules2.js","/modules3.js","/modules4.js","/modules4-ui.js","/modules5.js","/modules5-ui.js","/workspace-enhancements.js","/manifest.webmanifest","/icon.svg"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_FILES)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",event=>{
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin||url.pathname.startsWith("/api/")||event.request.method!=="GET")return;
  event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match(event.request).then(cached=>cached||caches.match("/index.html"))));
});
