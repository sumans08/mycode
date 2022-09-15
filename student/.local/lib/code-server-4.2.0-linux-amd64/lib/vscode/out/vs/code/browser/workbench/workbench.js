/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/(function(){var A=["vs/code/browser/workbench/workbench","require","exports","vs/base/browser/browser","vs/base/common/cancellation","vs/base/common/marshalling","vs/base/common/event","vs/base/common/lifecycle","vs/base/common/network","vs/base/common/resources","vs/base/common/uri","vs/base/parts/request/browser/request","vs/platform/product/common/product","vs/platform/windows/common/windows","vs/workbench/workbench.web.main","vs/base/common/path","vs/base/common/strings","vs/base/common/arrays"],k=function(y){for(var b=[],u=0,R=y.length;u<R;u++)b[u]=A[y[u]];return b};define(A[0],k([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]),function(y,b,u,R,C,T,I,f,U,a,P,E,c,D,m,O,$){"use strict";Object.defineProperty(b,"__esModule",{value:!0});class p{constructor(){let e;const t=document.getElementById("vscode-workbench-auth-session"),s=t?t.getAttribute("data-settings"):void 0;if(s)try{e=JSON.parse(s)}catch{}if(e){this.setPassword(`${E.default.urlProtocol}.login`,"account",JSON.stringify(e)),this.authService=`${E.default.urlProtocol}-${e.providerId}.login`,this.setPassword(this.authService,"account",JSON.stringify(e.scopes.map(l=>({id:e.id,scopes:l,accessToken:e.accessToken}))));const o=`vscode.${e.providerId}-authentication`,i=`${E.default.urlProtocol}${o}`,n=`${e.providerId}.auth`,w=e.scopes.map(l=>({id:e.id,scopes:l.sort(),accessToken:e.accessToken}));this.getPassword(i,n).then(l=>{let S;if(l)try{const d=JSON.parse(l);d.content=JSON.parse(d.content),S=d}catch(d){console.log(d)}return S?.content&&(S.content=S.content.filter(d=>{const L=d.scopes.sort();return!w.find(v=>(0,$.equals)(L,v.scopes)&&v.account?.label===d.account?.label)})),this.setPassword(i,n,JSON.stringify({extensionId:o,...S||{},content:JSON.stringify([...w,...S?.content||[]])}))})}}get credentials(){if(!this._credentials){try{const e=window.localStorage.getItem(p.CREDENTIALS_STORAGE_KEY);e&&(this._credentials=JSON.parse(e))}catch{}Array.isArray(this._credentials)||(this._credentials=[])}return this._credentials}save(){window.localStorage.setItem(p.CREDENTIALS_STORAGE_KEY,JSON.stringify(this.credentials))}async getPassword(e,t){return this.doGetPassword(e,t)}async doGetPassword(e,t){for(const s of this.credentials)if(s.service===e&&(typeof t!="string"||t===s.account))return s.password;return null}async setPassword(e,t,s){this.doDeletePassword(e,t),this.credentials.push({service:e,account:t,password:s}),this.save();try{if(s&&e===this.authService){const o=JSON.parse(s);Array.isArray(o)&&o.length===0&&await this.logout(e)}}catch(o){console.log(o)}}async deletePassword(e,t){const s=await this.doDeletePassword(e,t);if(s&&e===this.authService)try{await this.logout(e)}catch(o){console.log(o)}return s}async doDeletePassword(e,t){let s=!1;return this._credentials=this.credentials.filter(o=>o.service===e&&o.account===t?(s=!0,!1):!0),s&&this.save(),s}async findPassword(e){return this.doGetPassword(e)}async findCredentials(e){return this.credentials.filter(t=>t.service===e).map(({account:t,password:s})=>({account:t,password:s}))}async logout(e){const t=new Map;t.set("logout",String(!0)),t.set("service",e),await(0,P.request)({url:Y("/auth/logout",t).toString(!0)},R.CancellationToken.None)}async clear(){window.localStorage.removeItem(p.CREDENTIALS_STORAGE_KEY)}}p.CREDENTIALS_STORAGE_KEY="credentials.provider";class g extends I.Disposable{constructor(){super(...arguments);this._onCallback=this._register(new T.Emitter),this.onCallback=this._onCallback.event,this.pendingCallbacks=new Set,this.lastTimeChecked=Date.now(),this.checkCallbacksTimeout=void 0}create(e={}){const t=++g.REQUEST_ID,s=[`vscode-reqid=${t}`];for(const o of g.QUERY_KEYS){const i=e[o];i&&s.push(`vscode-${o}=${encodeURIComponent(i)}`)}if(!(e.authority==="vscode.github-authentication"&&e.path==="/dummy")){const o=`vscode-web.url-callbacks[${t}]`;window.localStorage.removeItem(o),this.pendingCallbacks.add(t),this.startListening()}return a.URI.parse(window.location.href).with({path:"/callback",query:s.join("&")})}startListening(){if(this.onDidChangeLocalStorageDisposable)return;const e=()=>this.onDidChangeLocalStorage();window.addEventListener("storage",e),this.onDidChangeLocalStorageDisposable={dispose:()=>window.removeEventListener("storage",e)}}stopListening(){this.onDidChangeLocalStorageDisposable?.dispose(),this.onDidChangeLocalStorageDisposable=void 0}async onDidChangeLocalStorage(){const e=Date.now()-this.lastTimeChecked;e>1e3?this.checkCallbacks():this.checkCallbacksTimeout===void 0&&(this.checkCallbacksTimeout=setTimeout(()=>{this.checkCallbacksTimeout=void 0,this.checkCallbacks()},1e3-e))}checkCallbacks(){let e;for(const t of this.pendingCallbacks){const s=`vscode-web.url-callbacks[${t}]`,o=window.localStorage.getItem(s);if(o!==null){try{this._onCallback.fire(a.URI.revive(JSON.parse(o)))}catch(i){console.error(i)}e=e??new Set(this.pendingCallbacks),e.delete(t),window.localStorage.removeItem(s)}}e&&(this.pendingCallbacks=e,this.pendingCallbacks.size===0&&this.stopListening()),this.lastTimeChecked=Date.now()}}g.REQUEST_ID=0,g.QUERY_KEYS=["scheme","authority","path","query","fragment"];class r{constructor(e,t,s){this.workspace=e,this.payload=t,this.config=s,this.trusted=!0}static create(e){let t=!1,s,o=Object.create(null);return new URL(document.location.href).searchParams.forEach((n,w)=>{switch(w){case r.QUERY_PARAM_FOLDER:e.remoteAuthority&&n.startsWith(m.posix.sep)?s={folderUri:a.URI.from({scheme:f.Schemas.vscodeRemote,path:n,authority:e.remoteAuthority})}:s={folderUri:a.URI.parse(n)},t=!0;break;case r.QUERY_PARAM_WORKSPACE:e.remoteAuthority&&n.startsWith(m.posix.sep)?s={workspaceUri:a.URI.from({scheme:f.Schemas.vscodeRemote,path:n,authority:e.remoteAuthority})}:s={workspaceUri:a.URI.parse(n)},t=!0;break;case r.QUERY_PARAM_EMPTY_WINDOW:s=void 0,t=!0;break;case r.QUERY_PARAM_PAYLOAD:try{o=(0,C.parse)(n)}catch(l){console.error(l)}break}}),t||(e.folderUri?s={folderUri:a.URI.revive(e.folderUri)}:e.workspaceUri&&(s={workspaceUri:a.URI.revive(e.workspaceUri)})),s?window.localStorage.setItem(r.LAST_WORKSPACE_STORAGE_KEY,JSON.stringify(s)):window.localStorage.removeItem(r.LAST_WORKSPACE_STORAGE_KEY),new r(s,o,e)}async open(e,t){if(t?.reuse&&!t.payload&&this.isSame(this.workspace,e))return!0;const s=this.createTargetUrl(e,t);if(s){if(t?.reuse)return window.location.href=s,!0;{let o;return u.isStandalone?o=window.open(s,"_blank","toolbar=no"):o=window.open(s),!!o}}return!1}createTargetUrl(e,t){let s;if(!e)s=`${document.location.origin}${document.location.pathname}?${r.QUERY_PARAM_EMPTY_WINDOW}=true`;else if((0,c.isFolderToOpen)(e)){let o;this.config.remoteAuthority&&e.folderUri.scheme===f.Schemas.vscodeRemote?o=`${m.posix.sep}${(0,O.ltrim)(e.folderUri.path,m.posix.sep)}`:o=encodeURIComponent(e.folderUri.toString(!0)),s=`${document.location.origin}${document.location.pathname}?${r.QUERY_PARAM_FOLDER}=${o}`}else if((0,c.isWorkspaceToOpen)(e)){let o;this.config.remoteAuthority&&e.workspaceUri.scheme===f.Schemas.vscodeRemote?o=`${m.posix.sep}${(0,O.ltrim)(e.workspaceUri.path,m.posix.sep)}`:o=encodeURIComponent(e.workspaceUri.toString(!0)),s=`${document.location.origin}${document.location.pathname}?${r.QUERY_PARAM_WORKSPACE}=${o}`}return t?.payload&&(s+=`&${r.QUERY_PARAM_PAYLOAD}=${encodeURIComponent(JSON.stringify(t.payload))}`),s}isSame(e,t){return!e||!t?e===t:(0,c.isFolderToOpen)(e)&&(0,c.isFolderToOpen)(t)?(0,U.isEqual)(e.folderUri,t.folderUri):(0,c.isWorkspaceToOpen)(e)&&(0,c.isWorkspaceToOpen)(t)?(0,U.isEqual)(e.workspaceUri,t.workspaceUri):!1}hasRemote(){if(this.workspace){if((0,c.isFolderToOpen)(this.workspace))return this.workspace.folderUri.scheme===f.Schemas.vscodeRemote;if((0,c.isWorkspaceToOpen)(this.workspace))return this.workspace.workspaceUri.scheme===f.Schemas.vscodeRemote}return!0}}r.LAST_WORKSPACE_STORAGE_KEY="workspaces.lastOpened",r.QUERY_PARAM_EMPTY_WINDOW="ew",r.QUERY_PARAM_FOLDER="folder",r.QUERY_PARAM_WORKSPACE="workspace",r.QUERY_PARAM_PAYLOAD="payload";function Y(h,e){let t;if(e){let s=0;e.forEach((o,i)=>{t||(t=""),t+=`${s++==0?"":"&"}${i}=${encodeURIComponent(o)}`})}return h=(window.location.pathname+"/"+h).replace(/\/\/+/g,"/"),a.URI.parse(window.location.href).with({path:h,query:t})}(function(){const h=document.getElementById("vscode-workbench-web-configuration"),e=h?h.getAttribute("data-settings"):void 0;if(!h||!e)throw new Error("Missing web configuration element");const t={...JSON.parse(e),remoteAuthority:location.host};(0,D.create)(document.body,{...t,settingsSyncOptions:t.settingsSyncOptions?{enabled:t.settingsSyncOptions.enabled}:void 0,workspaceProvider:r.create(t),urlCallbackProvider:new g,credentialsProvider:t.remoteAuthority?void 0:new p})})()})}).call(this);

//# sourceMappingURL=workbench.js.map