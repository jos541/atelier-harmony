const CACHE='atelier-harmony-v20-offline';
const ASSETS=['./index.html','./manifest.webmanifest','./icon.png','./grafito-textura.jpg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('atelier-harmony-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
 const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith((async()=>{try{const network=await fetch(req,{cache:'no-store'});if(network.ok){const c=await caches.open(CACHE);await c.put('./index.html',network.clone());return network;}}catch(e){}return (await caches.match('./index.html'))||Response.error();})());return;
 }
 event.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;try{return await fetch(req);}catch(e){return Response.error();}})());
});
