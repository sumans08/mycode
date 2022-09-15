const sw=self,VERSION=4,resourceCacheName=`vscode-resource-cache-${VERSION}`,rootPath=sw.location.pathname.replace(/\/service-worker.js$/,""),searchParams=new URL(location.toString()).searchParams,resourceBaseAuthority=searchParams.get("vscode-resource-base-authority"),resolveTimeout=3e4;class RequestStore{constructor(){this.map=new Map,this.requestPool=0}get(e){const s=this.map.get(e);return s&&s.promise}create(){const e=++this.requestPool;let s;const n=new Promise(a=>s=a),r={resolve:s,promise:n};this.map.set(e,r);const c=setTimeout(()=>{if(clearTimeout(c),this.map.get(e)===r)return this.map.delete(e)},resolveTimeout);return{requestId:e,promise:n}}resolve(e,s){const n=this.map.get(e);return n?(n.resolve(s),this.map.delete(e),!0):!1}}const resourceRequestStore=new RequestStore,localhostRequestStore=new RequestStore,unauthorized=()=>new Response("Unauthorized",{status:401}),notFound=()=>new Response("Not Found",{status:404}),methodNotAllowed=()=>new Response("Method Not Allowed",{status:405});sw.addEventListener("message",async t=>{switch(t.data.channel){case"version":{const e=t.source;sw.clients.get(e.id).then(s=>{s&&s.postMessage({channel:"version",version:VERSION})});return}case"did-load-resource":{const e=t.data.data;resourceRequestStore.resolve(e.id,e)||console.log("Could not resolve unknown resource",e.path);return}case"did-load-localhost":{const e=t.data.data;localhostRequestStore.resolve(e.id,e.location)||console.log("Could not resolve unknown localhost",e.origin);return}default:console.log("Unknown message");return}}),sw.addEventListener("fetch",t=>{const e=new URL(t.request.url);if(e.protocol==="https:"&&e.hostname.endsWith("."+resourceBaseAuthority))switch(t.request.method){case"GET":case"HEAD":return t.respondWith(processResourceRequest(t,e));default:return t.respondWith(methodNotAllowed())}if(e.origin!==sw.origin&&e.host.match(/^(localhost|127.0.0.1|0.0.0.0):(\d+)$/))return t.respondWith(processLocalhostRequest(t,e))}),sw.addEventListener("install",t=>{t.waitUntil(sw.skipWaiting())}),sw.addEventListener("activate",t=>{t.waitUntil(sw.clients.claim())});async function processResourceRequest(t,e){const s=await sw.clients.get(t.clientId);if(!s)return console.error("Could not find inner client for request"),notFound();const n=getWebviewIdForClient(s);if(!n)return console.error("Could not resolve webview id"),notFound();const r=t.request.method==="GET",l=(o,g)=>{if(o.status===304){if(g)return g.clone();throw new Error("No cache found")}if(o.status===401)return unauthorized();if(o.status!==200)return notFound();const h={"Content-Type":o.mime,"Content-Length":o.data.byteLength.toString(),"Access-Control-Allow-Origin":"*"};o.etag&&(h.ETag=o.etag,h["Cache-Control"]="no-cache"),o.mtime&&(h["Last-Modified"]=new Date(o.mtime).toUTCString());const f=new Response(o.data,{status:200,headers:h});return r&&o.etag&&caches.open(resourceCacheName).then(w=>w.put(t.request,f)),f.clone()},c=await getOuterIframeClient(n);if(!c.length)return console.log("Could not find parent client for request"),notFound();let a;r&&(a=await(await caches.open(resourceCacheName)).match(t.request));const{requestId:d,promise:i}=resourceRequestStore.create(),u=e.hostname.slice(0,e.hostname.length-(resourceBaseAuthority.length+1)),p=u.split("+",1)[0],m=u.slice(p.length+1);for(const o of c)o.postMessage({channel:"load-resource",id:d,path:e.pathname,scheme:p,authority:m,query:e.search.replace(/^\?/,""),ifNoneMatch:a?.headers.get("ETag")});return i.then(o=>l(o,a))}async function processLocalhostRequest(t,e){const s=await sw.clients.get(t.clientId);if(!s)return fetch(t.request);const n=getWebviewIdForClient(s);if(!n)return console.error("Could not resolve webview id"),fetch(t.request);const r=e.origin,l=async i=>{if(!i)return fetch(t.request);const u=t.request.url.replace(new RegExp(`^${e.origin}(/|$)`),`${i}$1`);return new Response(null,{status:302,headers:{Location:u}})},c=await getOuterIframeClient(n);if(!c.length)return console.log("Could not find parent client for request"),notFound();const{requestId:a,promise:d}=localhostRequestStore.create();for(const i of c)i.postMessage({channel:"load-localhost",origin:r,id:a});return d.then(l)}function getWebviewIdForClient(t){return new URL(t.url).searchParams.get("id")}async function getOuterIframeClient(t){return(await sw.clients.matchAll({includeUncontrolled:!0})).filter(s=>{const n=new URL(s.url);return(n.pathname===`${rootPath}/`||n.pathname===`${rootPath}/index.html`)&&n.searchParams.get("id")===t})}

//# sourceMappingURL=service-worker.js.map
