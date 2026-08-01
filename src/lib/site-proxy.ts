/**
 * Proxy + rewrite layer for the upstream site.
 *
 * Everything is served through this app unchanged, except:
 *  - the logo image is swapped
 *  - "PW-MARCO"-style branding becomes "STUDYxANSHU"
 *  - the marco-magic-loader script's Login/Sign Up pages and popups are disabled
 */

export const UPSTREAM_ORIGIN = "https://pwmarco.pages.dev";

export const LOADER_ORIGIN = "https://marco-magic-loader.lovable.app";
export const LOADER_PATH = "/api/public/loader.js";
export const LAYOUT_URL =
  "https://cdn.jsdelivr.net/gh/raghu554tiwari-lang/batch-layout@main/layout.js";

const OLD_LOGO = "https://i.ibb.co/PZThbjmf/1000002876-removebg-preview-2.png";
const NEW_LOGO = "https://i.ibb.co/BKQM1dSs/71696247-c72a-491e-9b18-4d0e3d23c905.jpg";

const BRAND = "STUDYxANSHU";

/** Tokens that must survive the branding rewrite (hostnames, attribute names). */
const PROTECTED = ["pwmarco.pages.dev", "data-pw-marco", "pw-marco="];

function protect(input: string): { text: string; restore: (s: string) => string } {
  let text = input;
  PROTECTED.forEach((token, i) => {
    text = text.split(token).join(`__PWKEEP${i}__`);
  });
  return {
    text,
    restore: (s: string) => {
      let out = s;
      PROTECTED.forEach((token, i) => {
        out = out.split(`__PWKEEP${i}__`).join(token);
      });
      return out;
    },
  };
}

/** Logo + branding replacements, applied to any text body. */
export function rewriteBranding(input: string): string {
  const { text, restore } = protect(input);
  let out = text;

  // 1. Logo
  out = out.split(OLD_LOGO).join(NEW_LOGO);

  // 2. Branding
  out = out.replace(/PW[\s._-]?MARCO/gi, BRAND);
  out = out.replace(/Powered\s+by\s+Marco/gi, `Powered by ${BRAND}`);

  return restore(out);
}

/** Guard script injected into every HTML page as a safety net. */
const GUARD_SCRIPT = `<script>(function(){try{
  var NOOP=function(){return undefined;};
  var NAMES=['showLogin','showSignup','initAuth','showWelcomePopup'];
  NAMES.forEach(function(n){
    try{
      Object.defineProperty(window,n,{configurable:true,get:function(){return NOOP;},set:function(){}});
    }catch(e){try{window[n]=NOOP;}catch(e2){}}
  });
  var css='#marcoAuthDiv,#marcoWelcomeOv,#marcoBrainixPanel{display:none!important;visibility:hidden!important;}'
    +'[data-sx-popup-killed]{display:none!important;visibility:hidden!important;}';
  var st=document.createElement('style');st.setAttribute('data-sx-guard','1');st.textContent=css;
  (document.head||document.documentElement).appendChild(st);

  var NEEDLES=['telegram community','join the channel for latest'];
  function restoreScroll(){
    try{
      document.body.style.overflow='auto';
      document.body.style.pointerEvents='auto';
      document.documentElement.style.overflow='auto';
    }catch(e){}
  }
  function container(el){
    var node=el,best=el;
    for(var i=0;i<8&&node&&node.parentElement;i++){
      node=node.parentElement;
      var tag=node.tagName;
      if(tag==='BODY'||tag==='HTML'||tag==='MAIN')break;
      var cs=window.getComputedStyle(node);
      var cls=((node.className&&node.className.toString())||'').toLowerCase();
      var role=(node.getAttribute('role')||'').toLowerCase();
      if(cs.position==='fixed'||cs.position==='absolute'||role==='dialog'||
         cls.indexOf('modal')>-1||cls.indexOf('dialog')>-1||cls.indexOf('popup')>-1||
         cls.indexOf('overlay')>-1||cls.indexOf('backdrop')>-1){best=node;}
    }
    return best;
  }
  function kill(){
    try{
      ['marcoAuthDiv','marcoWelcomeOv'].forEach(function(id){
        var el=document.getElementById(id);
        if(el&&el.parentNode)el.parentNode.removeChild(el);
      });
      var all=document.querySelectorAll('div,section,aside,dialog');
      for(var i=0;i<all.length;i++){
        var el=all[i];
        if(el.getAttribute('data-sx-seen'))continue;
        var text=(el.textContent||'').toLowerCase();
        if(text.length>900)continue;
        var hit=false;
        for(var j=0;j<NEEDLES.length;j++){if(text.indexOf(NEEDLES[j])>-1){hit=true;break;}}
        if(!hit)continue;
        el.setAttribute('data-sx-seen','1');
        var target=container(el);
        var parent=target.parentElement;
        if(parent){
          var sibs=parent.children;
          for(var k=0;k<sibs.length;k++){
            var s=sibs[k];
            if(s===target)continue;
            var scs=window.getComputedStyle(s);
            if((scs.position==='fixed'||scs.position==='absolute')&&!s.textContent.trim()){
              s.setAttribute('data-sx-popup-killed','1');
            }
          }
        }
        if(target&&target.parentNode){target.parentNode.removeChild(target);}
        else{el.setAttribute('data-sx-popup-killed','1');}
        restoreScroll();
      }
    }catch(e){}
  }
  if(document.addEventListener)document.addEventListener('DOMContentLoaded',kill);
  try{
    var mo=new MutationObserver(function(){kill();});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  setInterval(kill,500);
  kill();
}catch(e){}})();</script>`;


/** Rewrites for upstream HTML documents. */
export function rewriteHtml(html: string): string {
  let out = html;

  // Route the loader through our own origin so it can be patched.
  out = out.replace(
    new RegExp(`https://marco-magic-loader\\.lovable\\.app${LOADER_PATH.replace(/\//g, "\\/")}`, "g"),
    "/__ext/loader.js",
  );

  out = rewriteBranding(out);

  // Inject the guard as early as possible.
  if (out.includes("</head>")) {
    out = out.replace("</head>", `${GUARD_SCRIPT}</head>`);
  } else {
    out = GUARD_SCRIPT + out;
  }

  return out;
}

/** Rewrites for the marco-magic-loader bootstrap script. */
export function rewriteLoaderJs(js: string): string {
  let out = js;

  // Pull layout.js and the block-status check through this origin.
  out = out.split(LAYOUT_URL).join("/__ext/layout.js");
  out = out.split(`${LOADER_ORIGIN}/api/public/block-status`).join("/__ext/block-status");

  // Bust the localStorage cache so a stale copy of layout.js can't be reused.
  out = out.split("marco_cached_js_v8").join("marco_cached_js_v8_sx1");

  return rewriteBranding(out);
}

/** Rewrites for the layout script that owns the auth screens and popups. */
export function rewriteLayoutJs(js: string): string {
  let out = js;

  // Disable Login / Sign Up screens.
  out = out.split("function showLogin(){").join("function showLogin(){ return; ");
  out = out.split("function showSignup(){").join("function showSignup(){ return; ");
  out = out.split("function initAuth(){").join("function initAuth(){ return; ");

  // Disable popups (auto-shown and button-triggered).
  out = out.split("function showWelcomePopup(){").join("function showWelcomePopup(){ return; ");
  // handleTelegram() auto-closes the upstream Telegram popup - keep it working.


  return rewriteBranding(out);
}

const TEXT_TYPES = ["text/html", "javascript", "application/json", "text/css", "text/plain"];

export function isTextual(contentType: string | null): boolean {
  if (!contentType) return false;
  const ct = contentType.toLowerCase();
  return TEXT_TYPES.some((t) => ct.includes(t));
}

const DROPPED_RESPONSE_HEADERS = [
  "content-encoding",
  "content-length",
  "transfer-encoding",
  "content-security-policy",
  "content-security-policy-report-only",
  "x-frame-options",
  "strict-transport-security",
];

/** Copies upstream response headers, dropping ones that break re-serving. */
export function buildResponseHeaders(upstream: Response): Headers {
  const headers = new Headers();
  upstream.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (DROPPED_RESPONSE_HEADERS.includes(k)) return;
    if (k === "set-cookie") return;
    headers.set(key, value);
  });

  // Forward cookies but untie them from the upstream domain.
  const setCookie = (upstream.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.();
  const cookies = setCookie?.length ? setCookie : upstream.headers.get("set-cookie") ? [upstream.headers.get("set-cookie")!] : [];
  cookies.forEach((cookie) => {
    headers.append("set-cookie", cookie.replace(/;\s*domain=[^;]*/gi, ""));
  });

  return headers;
}

const DROPPED_REQUEST_HEADERS = [
  "host",
  "accept-encoding",
  "cf-connecting-ip",
  "cf-ipcountry",
  "cf-ray",
  "cf-visitor",
  "x-forwarded-host",
  "x-forwarded-proto",
];

export function buildRequestHeaders(request: Request, targetOrigin: string): Headers {
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (DROPPED_REQUEST_HEADERS.includes(key.toLowerCase())) return;
    headers.set(key, value);
  });
  headers.set("accept-encoding", "identity");
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const url = new URL(referer);
      headers.set("referer", targetOrigin + url.pathname + url.search);
    } catch {
      headers.delete("referer");
    }
  }
  if (request.headers.get("origin")) headers.set("origin", targetOrigin);
  return headers;
}

async function upstreamFetch(request: Request, targetUrl: string, targetOrigin: string) {
  const method = request.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";
  const body: BodyInit | null = hasBody ? new Uint8Array(await request.arrayBuffer()) : null;
  return fetch(targetUrl, {
    method,
    headers: buildRequestHeaders(request, targetOrigin),
    body,
    redirect: "manual",
  });
}

/** Fetches an external script and applies the matching rewrite. */
async function proxyScript(
  request: Request,
  targetUrl: string,
  rewrite: (js: string) => string,
): Promise<Response> {
  const origin = new URL(targetUrl).origin;
  const upstream = await upstreamFetch(request, targetUrl, origin);
  const headers = buildResponseHeaders(upstream);
  if (!upstream.ok || !upstream.body) {
    return new Response(upstream.body, { status: upstream.status, headers });
  }
  const body = rewrite(await upstream.text());
  headers.set("content-type", "application/javascript; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(body, { status: upstream.status, headers });
}

/**
 * Main entry point: proxies a request to the upstream site (or to one of the
 * external loader scripts) and rewrites textual responses.
 */
export async function handleProxy(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Platform/telemetry endpoints must not be forwarded upstream (they 500 there).
  if (pathname.startsWith("/api/public/")) {
    return new Response(null, { status: 204 });
  }

  if (pathname === "/__ext/loader.js") {
    return proxyScript(request, `${LOADER_ORIGIN}${LOADER_PATH}${url.search}`, rewriteLoaderJs);
  }
  if (pathname === "/__ext/layout.js") {
    return proxyScript(request, LAYOUT_URL, rewriteLayoutJs);
  }
  if (pathname === "/__ext/block-status") {
    const upstream = await upstreamFetch(
      request,
      `${LOADER_ORIGIN}/api/public/block-status${url.search}`,
      LOADER_ORIGIN,
    );
    return new Response(upstream.body, {
      status: upstream.status,
      headers: buildResponseHeaders(upstream),
    });
  }

  const target = `${UPSTREAM_ORIGIN}${pathname}${url.search}`;
  const upstream = await upstreamFetch(request, target, UPSTREAM_ORIGIN);
  const headers = buildResponseHeaders(upstream);

  // Keep redirects on this origin.
  const location = upstream.headers.get("location");
  if (location) {
    headers.set("location", location.replace(UPSTREAM_ORIGIN, ""));
  }

  const contentType = upstream.headers.get("content-type");
  if (!upstream.body || !isTextual(contentType)) {
    return new Response(upstream.body, { status: upstream.status, headers });
  }

  const text = await upstream.text();
  const ct = (contentType ?? "").toLowerCase();
  let body: string;
  if (ct.includes("text/html")) {
    body = rewriteHtml(text);
  } else if (ct.includes("javascript") || ct.includes("application/json")) {
    body = rewriteBranding(text);
  } else {
    body = rewriteBranding(text);
  }

  return new Response(body, { status: upstream.status, headers });
}
