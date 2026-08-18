/**
 * Proxy + rewrite layer for the upstream site.
 *
 * Everything is served through this app unchanged, except:
 *  - the logo image is swapped
 *  - "PW-MARCO"-style branding becomes "STUDYxANSHU"
 *  - the marco-magic-loader script's Login/Sign Up pages and popups are disabled
 */

export const UPSTREAM_ORIGIN = "https://pwmarco-phi.vercel.app";

export const LOADER_ORIGIN = "https://marco-magic-loader.lovable.app";
export const LOADER_PATH = "/api/public/loader.js";
export const LAYOUT_URL =
  "https://cdn.jsdelivr.net/gh/raghu554tiwari-lang/batch-layout@main/layout.js";

const OLD_LOGO = "https://i.ibb.co/PZThbjmf/1000002876-removebg-preview-2.png";
const OLD_LOGO_2 = "https://i.ibb.co/BKQM1dSs/71696247-c72a-491e-9b18-4d0e3d23c905.jpg";
/** Single canonical branding asset. The version query busts client caches. */
const LOGO_ASSET =
  "/__l5e/assets-v1/0b229c46-b19c-4bbd-9cbf-de4ee445475d/anshu_logo_v2.jpg";
const NEW_LOGO = `${LOGO_ASSET}?v=logo_v2`;
const OLD_ASSET_LOGO = "/__l5e/assets-v1/177cb398-ccee-45ab-b175-857cbd8b6f24/ak-logo.png";
const OLD_ASSET_LOGO_2 =
  "/__l5e/assets-v1/f1a28b72-aaad-41c7-bc31-71c5dec7ebc0/anshu_keshawat_logo_v1_canonical.png";


const BRAND = "STUDYxANSHU";
const DEV_NAME = "ANSHU KESHAWAT";

const DEV_TELEGRAM = "https://t.me/Liee070";
const DEV_INSTAGRAM = "https://www.instagram.com/ansh_u_keshawat?igsh=dXF0NDQ5NGh5cWVs";
const JOIN_TELEGRAM = "https://t.me/+1YqS8Bxcj5M4OTk1";
const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029VbCvhNqGZNCp0sKLUk3G";

const DEAD_LINK = "https://m-store-chi.vercel.app";

/** Tokens that must survive the branding rewrite (hostnames, attribute names). */
const PROTECTED = [
  "pwmarco-phi.vercel.app",
  "data-pw-marco",
  "pw-marco=",
  "marco-magic-loader",
  "marco_cached",
  "marcoAuth",
  "marcoWelcome",
  "marcoBrainix",
];


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

/** Absolute/relative URLs and quoted asset paths - branding must never touch
 *  the inside of these, or stream/manifest URLs break and video goes black. */
const URL_LIKE =
  /(?:https?:)?\/\/[^\s"'`<>()\\]+|\/[A-Za-z0-9_\-./]*\.(?:m3u8|mpd|mp4|m4s|ts|key|webm|json|js|css|png|jpe?g|webp|gif|svg|ico|woff2?)(?:\?[^\s"'`<>]*)?/g;

function protectUrls(input: string): { text: string; restore: (s: string) => string } {
  const found: string[] = [];
  const text = input.replace(URL_LIKE, (m) => {
    found.push(m);
    return `__SXURL${found.length - 1}__`;
  });
  return {
    text,
    restore: (s: string) =>
      s.replace(/__SXURL(\d+)__/g, (_m, i: string) => found[Number(i)] ?? ""),
  };
}

/** Logo + branding replacements, applied to any text body. */
export function rewriteBranding(input: string): string {
  const { text, restore } = protect(input);
  let out = text;

  // 1. Logo - one canonical asset everywhere
  out = out.split(OLD_LOGO).join(NEW_LOGO);
  out = out.split(OLD_LOGO_2).join(NEW_LOGO);
  out = out.split(OLD_ASSET_LOGO).join(NEW_LOGO);
  out = out.split(OLD_ASSET_LOGO_2).join(LOGO_ASSET);

  // 2. Old developer handles -> new Telegram
  out = out.replace(
    /https?:\/\/(?:www\.)?instagram\.com\/official_marco_22\/?/gi,
    DEV_INSTAGRAM,
  );
  out = out.replace(/https?:\/\/(?:www\.)?t\.me\/officialmarco22\/?/gi, DEV_TELEGRAM);

  // 3. Dead store link -> developer telegram
  out = out.split(DEAD_LINK).join(DEV_TELEGRAM);
  out = out.replace(/(Download\s*Link\s*:?\s*)about:blank/gi, "$1t.me/Liee070");

  // 4. Branding - visible text only, never inside URLs/asset paths.
  const urls = protectUrls(out);
  let body = urls.text;
  body = body.replace(/@?official_?marco_?22/gi, "t.me/Liee070");
  body = body.replace(/PW[\s._-]*MARCO/gi, BRAND);
  body = body.replace(/Powered\s+by\s+Marco/gi, `Powered by ${DEV_NAME}`);
  // Bare "marco" in visible copy only - never inside identifiers.
  body = body.replace(/(?<![\w\/.\-])marco(?![\w\/.\-])/gi, DEV_NAME);
  out = urls.restore(body);

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
    +'[data-sx-popup-killed],[data-sx-menu-hidden],[data-sx-drawer-brand-original]{display:none!important;visibility:hidden!important;}'
    /* ---- global fit ---- */
    +'html,body{overflow-x:hidden!important;max-width:100vw!important;}'
    +'*{-webkit-tap-highlight-color:transparent;}'
    +'img,video,canvas,iframe,table{max-width:100%;}'
    /* ---- header ---- */
    +'[data-sx-header]{display:flex!important;flex-direction:row!important;align-items:center!important;'
    +'justify-content:space-between!important;gap:8px!important;padding:8px 16px!important;flex-wrap:nowrap!important;width:100%!important;box-sizing:border-box!important;}'
    +'[data-sx-header]>*{min-width:0!important;}'
    +'[data-sx-wordmark]{display:inline-flex!important;align-items:center!important;gap:8px!important;min-width:0!important;'
    +'font-size:clamp(13px,4.2vw,19px)!important;font-weight:800!important;letter-spacing:.4px!important;line-height:1.1!important;}'
    +'[data-sx-wordmark] img,[data-sx-header] img,[data-sx-brandimg]{display:none!important;visibility:hidden!important;width:0!important;height:0!important;}'
    +'[data-sx-drawer-brand="owned"] [data-sx-drawer-logo]{display:block!important;visibility:visible!important;opacity:1!important;width:34px!important;height:34px!important;'
    +'min-width:34px!important;border-radius:50%!important;object-fit:cover!important;flex:0 0 auto!important;}'
    +'[data-sx-drawer-brand="owned"]{display:flex!important;visibility:visible!important;opacity:1!important;align-items:center!important;gap:10px!important;'
    +'width:max-content!important;max-width:100%!important;min-height:38px!important;position:relative!important;z-index:2!important;}'
    +'[data-sx-drawer-brand="owned"] [data-sx-drawer-text]{display:inline!important;visibility:visible!important;opacity:1!important;white-space:nowrap!important;font-weight:800!important;}'
    +'[data-sx-xp]{display:none!important;visibility:hidden!important;}'
    /* ---- cards & spacing ---- */
    +'[data-sx-card]{border-radius:16px!important;overflow-wrap:anywhere!important;line-height:1.5!important;}'
    +'[data-sx-card] p,[data-sx-card] span,[data-sx-card] h1,[data-sx-card] h2,[data-sx-card] h3{overflow-wrap:anywhere!important;line-height:1.5!important;}'
    +'select{width:100%!important;border-radius:12px!important;border:1px solid rgba(255,255,255,.12)!important;'
    +'padding:10px 12px!important;font-size:14px!important;line-height:1.4!important;appearance:none!important;'
    +'-webkit-appearance:none!important;background-image:none!important;}'
    /* ---- floating right-edge toggle: removed, hide any upstream duplicate ---- */
    +'[data-sx-dock],[data-sx-dock-upstream]{display:none!important;}'
    /* ---- hero replacing the community card ---- */
    +'[data-sx-hero-hidden]{display:none!important;}'
    +'@keyframes sxUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}'
    +'@keyframes sxShift{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}'
    +'[data-sx-hero]{margin:16px 0 4px!important;padding:22px 16px!important;text-align:center!important;}'
    +'[data-sx-hero] .sxh1{margin:0!important;font-size:clamp(15px,4.6vw,20px)!important;font-weight:600!important;'
    +'letter-spacing:.6px!important;color:#0b1220;animation:sxUp .7s cubic-bezier(.22,1,.36,1) both;}'
    +'.dark [data-sx-hero] .sxh1,[data-sx-dark] [data-sx-hero] .sxh1{color:#fff;}'
    +'@media (prefers-color-scheme:dark){[data-sx-hero] .sxh1{color:#fff;}}'
    +'[data-sx-hero] .sxh2{margin:6px 0 0!important;font-size:clamp(26px,9vw,44px)!important;font-weight:900!important;'
    +'letter-spacing:2px!important;line-height:1.05!important;background:linear-gradient(90deg,#a855f7,#ec4899,#f97316,#ec4899,#a855f7);'
    +'background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;'
    +'animation:sxUp .8s .1s cubic-bezier(.22,1,.36,1) both,sxShift 7s 1s ease-in-out infinite;}'
    +'[data-sx-hero] .sxsub{margin:10px auto 0!important;max-width:520px!important;font-size:13px!important;'
    +'line-height:1.6!important;opacity:.72;animation:sxUp .9s .2s cubic-bezier(.22,1,.36,1) both;}'
    +'[data-sx-hero] .sxsearch{margin:16px auto 0!important;display:block!important;width:100%!important;max-width:420px!important;'
    +'padding:11px 14px!important;border-radius:9999px!important;font-size:14px!important;'
    +'border:1px solid rgba(148,163,184,.35)!important;background:rgba(148,163,184,.10)!important;color:inherit!important;'
    +'outline:none!important;animation:sxUp 1s .28s cubic-bezier(.22,1,.36,1) both;}'
    +'[data-sx-hero] .sxgrid{margin:16px auto 0!important;display:grid!important;gap:12px!important;'
    +'grid-template-columns:repeat(auto-fill,minmax(150px,1fr))!important;max-width:900px!important;text-align:left!important;}'
    +'[data-sx-hero] .sxcard{padding:12px 14px!important;border-radius:14px!important;font-size:13px!important;font-weight:700!important;'
    +'border:1px solid rgba(148,163,184,.28)!important;background:rgba(148,163,184,.08)!important;cursor:pointer!important;'
    +'transition:transform .25s ease,background .25s ease!important;animation:sxUp .5s both;}'
    +'[data-sx-hero] .sxcard:hover{transform:translateY(-3px)!important;background:rgba(168,85,247,.14)!important;}'
    +'[data-sx-hero] .sxmore{margin:14px auto 0!important;display:block!important;padding:10px 22px!important;'
    +'border-radius:9999px!important;font-size:13px!important;font-weight:800!important;color:#fff!important;cursor:pointer!important;'
    +'border:0!important;background:linear-gradient(90deg,#a855f7,#ec4899,#f97316)!important;}'

    +'@media (max-width:359px){[data-sx-header]{padding:6px 12px!important;gap:6px!important;}}'
    +'@media (min-width:768px){[data-sx-header]{padding:10px 24px!important;}}';

  var st=document.createElement('style');st.setAttribute('data-sx-guard','1');st.textContent=css;
  (document.head||document.documentElement).appendChild(st);

  var NEEDLES=['telegram community','join the channel for latest'];
  var SKIP={BODY:1,HTML:1,MAIN:1,HEADER:1,FOOTER:1,NAV:1};
  function restoreScroll(){
    try{
      document.body.style.overflow='auto';
      document.body.style.pointerEvents='auto';
      document.documentElement.style.overflow='auto';
    }catch(e){}
  }
  function isOverlay(node){
    if(!node||node.nodeType!==1)return false;
    if(SKIP[node.tagName])return false;
    if(node.id==='__next'||node.id==='root'||node.id==='app')return false;
    if(node.getAttribute('data-sx-dock')||node.getAttribute('data-sx-modal'))return false;
    var cs=window.getComputedStyle(node);
    if(cs.position!=='fixed'&&cs.position!=='absolute')return false;
    var role=(node.getAttribute('role')||'').toLowerCase();
    var cls=((node.className&&node.className.toString())||'').toLowerCase();
    var z=parseInt(cs.zIndex,10);
    return role==='dialog'||(z>=10)||cls.indexOf('modal')>-1||cls.indexOf('dialog')>-1||
      cls.indexOf('popup')>-1||cls.indexOf('overlay')>-1||cls.indexOf('backdrop')>-1;
  }
  /** Nearest overlay-like ancestor (max 3 hops); null when nothing qualifies. */
  function overlayFor(el){
    var node=el;
    for(var i=0;i<4&&node;i++){
      if(isOverlay(node))return node;
      node=node.parentElement;
      if(!node||SKIP[node.tagName])break;
    }
    return null;
  }
  function hide(el){
    if(!el||el.getAttribute('data-sx-popup-killed'))return;
    el.setAttribute('data-sx-popup-killed','1');
    restoreScroll();
  }
  /** Video frames must always play. Only true self-framing loops (this exact
   *  page embedded in itself) get unwrapped; everything else is left alone and
   *  falls back to a direct redirect when the embed refuses to load. */
  var VIDEOISH=/vid-stream|player|stream|embed|video|\\.m3u8|\\.mpd|\\.mp4|drm|watch/i;
  function fallbackTo(url){
    try{
      if(window.__sxRedirected)return;
      window.__sxRedirected=true;
      window.top.location.href=url;
    }catch(e){try{location.href=url;}catch(e2){}}
  }
  function armPlayer(f,abs){
    if(f.getAttribute('data-sx-player'))return;
    f.setAttribute('data-sx-player','1');
    // Give the embed every permission it may need.
    try{
      f.removeAttribute('sandbox');
      f.setAttribute('allow','autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write');
      f.setAttribute('allowfullscreen','true');
      f.setAttribute('referrerpolicy','no-referrer-when-downgrade');
      f.style.setProperty('background','#000');
    }catch(e){}
    var loaded=false;
    f.addEventListener('load',function(){loaded=true;});
    f.addEventListener('error',function(){fallbackTo(abs);});
    // Blocked embeds (X-Frame-Options / CSP) never fire load -> redirect instead.
    setTimeout(function(){
      if(loaded||!f.isConnected)return;
      fallbackTo(abs);
    },7000);
  }
  function frames(){
    try{
      var ifr=document.querySelectorAll('iframe');
      for(var i=0;i<ifr.length;i++){
        var f=ifr[i];
        var src=f.getAttribute('src')||f.src||'';
        if(!src||src==='about:blank')continue;
        var u;
        try{u=new URL(src,location.href);}catch(e){continue;}
        var abs=u.href;
        if(VIDEOISH.test(abs)){armPlayer(f,abs);continue;}
        var self=u.hostname===location.hostname||/pwmarco\\.pages\\.dev/i.test(u.hostname);
        if(!self)continue;
        // Only unwrap a frame that loads this very same page (infinite nesting).
        if(u.pathname===location.pathname){
          f.setAttribute('data-sx-popup-killed','1');
        }
      }
    }catch(e){}
  }

  function kill(){
    try{
      frames();

      ['marcoAuthDiv','marcoWelcomeOv','marcoBrainixPanel'].forEach(function(id){
        hide(document.getElementById(id));
      });
      var all=document.querySelectorAll('div,section,aside,dialog');
      for(var i=0;i<all.length;i++){
        var el=all[i];
        if(el.getAttribute('data-sx-seen'))continue;
        if(el.closest&&el.closest('[data-sx-modal],[data-sx-dock]'))continue;
        var text=(el.textContent||'').toLowerCase();
        if(text.length>900)continue;
        var hit=false;
        for(var j=0;j<NEEDLES.length;j++){if(text.indexOf(NEEDLES[j])>-1){hit=true;break;}}
        if(!hit)continue;
        el.setAttribute('data-sx-seen','1');
        var target=overlayFor(el);
        if(!target)continue;
        var parent=target.parentElement;
        if(parent){
          var sibs=parent.children;
          for(var k=0;k<sibs.length;k++){
            var s=sibs[k];
            if(s===target)continue;
            var scs=window.getComputedStyle(s);
            if((scs.position==='fixed'||scs.position==='absolute')&&!s.textContent.trim()){
              hide(s);
            }
          }
        }
        hide(target);
      }
    }catch(e){}
  }
  var LINKS={
    'Join telegram':'${JOIN_TELEGRAM}',
    'Whatsapp channel':'${WHATSAPP_CHANNEL}',
    'Telegram':'${DEV_TELEGRAM}',
    'Instagram':'${DEV_INSTAGRAM}'
  };
  var SVG='http://www.w3.org/2000/svg';
  var PATHS={
    'Join telegram':['M22 2 11 13','M22 2 15 22l-4-9-9-4z'],
    'Telegram':['M22 2 11 13','M22 2 15 22l-4-9-9-4z'],
    'Whatsapp channel':['M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.2-5.4A8.4 8.4 0 1 1 21 11.5z'],
    'Instagram':['M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z','M15.5 11.5a3.5 3.5 0 1 1-3.5-3.5 3.5 3.5 0 0 1 3.5 3.5z','M17.5 6.6h.01'],
    'About us':['M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z','M12 11v5','M12 8h.01']
  };
  function makeIcon(label){
    var ps=PATHS[label];if(!ps)return null;
    var s=document.createElementNS(SVG,'svg');
    s.setAttribute('viewBox','0 0 24 24');s.setAttribute('fill','none');
    s.setAttribute('stroke','currentColor');s.setAttribute('stroke-width','1.8');
    s.setAttribute('stroke-linecap','round');s.setAttribute('stroke-linejoin','round');
    s.setAttribute('width','22');s.setAttribute('height','22');
    s.setAttribute('data-sx-menu-icon','1');
    for(var i=0;i<ps.length;i++){
      var p=document.createElementNS(SVG,'path');
      p.setAttribute('d',ps[i]);s.appendChild(p);
    }
    return s;
  }
  function setIcon(row,label){
    try{
      var ic=makeIcon(label);if(!ic)return;
      var old=row.querySelector('svg,img');
      if(old&&old.parentNode){
        if(old.getAttribute&&old.getAttribute('width'))ic.setAttribute('width',old.getAttribute('width'));
        if(old.getAttribute&&old.getAttribute('height'))ic.setAttribute('height',old.getAttribute('height'));
        ic.setAttribute('class',old.getAttribute('class')||'');
        old.parentNode.replaceChild(ic,old);
      }else{
        ic.style.cssText='flex:0 0 auto;margin-right:10px;vertical-align:middle;';
        row.insertBefore(ic,row.firstChild);
      }
    }catch(e){}
  }
  function setLabel(node,label){
    var walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT,null);
    var first=true,n;
    while((n=walker.nextNode())){
      if(!n.nodeValue||!n.nodeValue.trim())continue;
      if(first){n.nodeValue=label;first=false;}else{n.nodeValue='';}
    }
    if(first)node.textContent=label;
  }
  function makeRow(tpl,label,href){
    var row=tpl.cloneNode(true);
    row.removeAttribute('data-sx-menu-hidden');
    row.setAttribute('data-sx-menu-item',label);
    setLabel(row,label);
    setIcon(row,label);
    if(row.tagName==='A'){row.setAttribute('href',href);row.setAttribute('target','_blank');row.setAttribute('rel','noopener');}
    row.style.cursor='pointer';
    row.addEventListener('click',function(ev){
      ev.preventDefault();ev.stopPropagation();
      window.open(href,'_blank','noopener');
    },true);
    return row;
  }

  function norm(el){return ((el&&el.textContent)||'').replace(/\\s+/g,' ').trim();}
  /** Deepest clickable-ish row whose whole text is the given label. */
  function findRows(re){
    var out=[];
    var cand=document.querySelectorAll('a,button,li,div,span,p');
    for(var i=0;i<cand.length;i++){
      var el=cand[i];
      if(el.getAttribute('data-sx-menu-item'))continue;
      var t=norm(el);
      if(!t||t.length>30||!re.test(t))continue;
      // skip wrappers that contain a deeper element with the exact same text
      var kids=el.querySelectorAll('a,button,li,div,span,p');
      var deeper=false;
      for(var k=0;k<kids.length;k++){if(re.test(norm(kids[k]))){deeper=true;break;}}
      if(deeper)continue;
      // climb to the clickable row (anchor/button) if there is one nearby
      var row=el;
      for(var j=0;j<4&&row.parentElement;j++){
        if(row.tagName==='A'||row.tagName==='BUTTON'||row.getAttribute('role')==='button')break;
        if(norm(row.parentElement)!==t)break;
        row=row.parentElement;
      }
      if(out.indexOf(row)<0)out.push(row);
    }
    return out;
  }
  function visible(el){
    try{
      var r=el.getBoundingClientRect();
      if(r.width<120||r.height<120)return false;
      var cs=getComputedStyle(el);
      return cs.display!=='none'&&cs.visibility!=='hidden'&&parseFloat(cs.opacity||'1')>0.05;
    }catch(e){return false;}
  }
  /** The open hamburger drawer/panel, if any. */
  function findDrawer(){
    var cand=document.querySelectorAll('[role="dialog"],aside,nav,div');
    var best=null,bestArea=Infinity;
    for(var i=0;i<cand.length;i++){
      var el=cand[i];
      if(el.id==='__next'||el.id==='root'||el.id==='app')continue;
      var t=(el.textContent||'');
      if(!/my\\s*batches|logout|log\\s*out|sign\\s*out|settings|my\\s*profile/i.test(t))continue;
      if(!visible(el))continue;
      var r=el.getBoundingClientRect();
      if(r.width>window.innerWidth*0.95)continue;
      var area=r.width*r.height;
      if(area<bestArea){bestArea=area;best=el;}
    }
    if(best)best.setAttribute('data-sx-drawer','1');
    return best;
  }
  /** A real menu row inside the drawer we can clone for styling. */
  function findTemplate(drawer){
    var cand=drawer.querySelectorAll('a,button,li');
    var fallback=null;
    for(var i=0;i<cand.length;i++){
      var el=cand[i];
      if(el.getAttribute('data-sx-menu-item'))continue;
      var t=norm(el);
      if(!t||t.length>28)continue;
      if(el.querySelector('a,button'))continue;
      if(/about\\s*us|my\\s*batches|settings|profile|nexa/i.test(t))return el;
      if(!fallback)fallback=el;
    }
    return fallback;
  }
  function scratchRow(label,href){
    var a=document.createElement('a');
    a.setAttribute('data-sx-menu-item',label);
    a.setAttribute('href',href);
    a.setAttribute('target','_blank');
    a.setAttribute('rel','noopener');
    a.style.cssText='display:flex;align-items:center;gap:10px;padding:12px 16px;font-size:14px;font-weight:600;'
      +'letter-spacing:.3px;text-decoration:none;color:inherit;cursor:pointer;';
    var ic=makeIcon(label);
    if(ic){ic.style.cssText='flex:0 0 auto;';a.appendChild(ic);}
    var sp=document.createElement('span');sp.textContent=label;a.appendChild(sp);
    return a;
  }
  function injectMenuRows(){
    var drawer=findDrawer();
    if(!drawer)return;
    if(drawer.querySelector('[data-sx-menu-item]'))return;
    var tpl=findTemplate(drawer);
    var host=(tpl&&tpl.parentElement)||drawer;
    var mk=function(label,href){
      return tpl?makeRow(tpl,label,href):scratchRow(label,href);
    };
    var frag=document.createDocumentFragment();
    frag.appendChild(mk('Join telegram',LINKS['Join telegram']));
    frag.appendChild(mk('Whatsapp channel',LINKS['Whatsapp channel']));

    var head=document.createElement('div');
    head.setAttribute('data-sx-menu-item','About developer');
    head.textContent='About developer';
    head.style.cssText='padding:14px 16px 6px;font-size:11px;font-weight:700;letter-spacing:1px;opacity:.6;';
    frag.appendChild(head);
    frag.appendChild(mk('Telegram',LINKS['Telegram']));
    frag.appendChild(mk('Instagram',LINKS['Instagram']));
    if(tpl&&tpl.parentElement===host&&tpl.nextSibling)host.insertBefore(frag,tpl.nextSibling);
    else host.appendChild(frag);
  }

  function oldBrandText(value){
    return /^(study\s*x\s*anshu|studyxanshu|pw[\s._-]*marco|pw|marco|ua[\s._-]?nexa|anshu\s*keshawat)$/i.test((value||'').trim());
  }

  /** Replace old branding in visible text added after the initial response rewrite. */
  function cleanVisibleBranding(){
    try{
      var root=document.body;if(!root)return;
      var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),node;
      while((node=walker.nextNode())){
        var parent=node.parentElement;
        if(!parent||/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|INPUT|OPTION)$/i.test(parent.tagName))continue;
        if(parent.closest&&parent.closest('[data-sx-drawer-brand="owned"]'))continue;
        var value=node.nodeValue||'';
        var next=value.replace(/PW[\s._-]*MARCO/gi,'${BRAND}')
          .replace(/(^|[^\w\/.\-])MARCO(?=$|[^\w\/.\-])/gi,'$1${DEV_NAME}');
        if(next!==value)node.nodeValue=next;
      }
    }catch(e){}
  }

  /** Keep the drawer title as our brand, with our logo next to it. */
  function drawerBrand(){
    try{
      var drawer=findDrawer();
      if(!drawer)return;
      var host=drawer.querySelector('[data-sx-drawer-brand="owned"]');
      if(!host){
        var cand=drawer.querySelectorAll('h1,h2,h3,p,span,div,a');
        var dr=drawer.getBoundingClientRect();
        var best=null,bestSize=0;
        for(var i=0;i<cand.length;i++){
          var el=cand[i];
          if(el.closest&&el.closest('[data-sx-drawer-brand="owned"],[data-sx-menu-item]'))continue;
          var t=norm(el);
          if(!t||t.length>26||el.querySelector('a,button'))continue;
          var r;try{r=el.getBoundingClientRect();}catch(e0){continue;}
          if(r.top-dr.top>160||!oldBrandText(t))continue;
          var fs=parseFloat(getComputedStyle(el).fontSize||'0');
          if(fs>bestSize){bestSize=fs;best=el;}
        }
        var originalRow=best;
        if(originalRow){
          for(var up=0;up<3&&originalRow.parentElement&&originalRow.parentElement!==drawer;up++){
            var par=originalRow.parentElement,pt=norm(par);
            var pr;try{pr=par.getBoundingClientRect();}catch(ep){break;}
            if(pr.top-dr.top>160||pt.length>40||!oldBrandText(pt))break;
            originalRow=par;
          }
          originalRow.setAttribute('data-sx-drawer-brand-original','1');
        }
        host=document.createElement('div');
        host.setAttribute('data-sx-drawer-brand','owned');
        host.setAttribute('aria-label','${BRAND}');
        if(originalRow&&originalRow.parentElement)originalRow.parentElement.insertBefore(host,originalRow);
        else drawer.insertBefore(host,drawer.firstChild);
      }
      var txt=host.querySelector('[data-sx-drawer-text]');
      if(!txt){
        host.textContent='';
        var img=document.createElement('img');
        img.setAttribute('data-sx-drawer-logo','1');
        img.setAttribute('alt','${BRAND}');
        img.setAttribute('src','${NEW_LOGO}');
        img.addEventListener('error',function(){
          if(this.getAttribute('src')!=='${NEW_LOGO}')this.setAttribute('src','${NEW_LOGO}');
        });
        host.appendChild(img);
        txt=document.createElement('span');
        txt.setAttribute('data-sx-drawer-text','1');
        txt.textContent='${BRAND}';
        host.appendChild(txt);
      }
      if(txt.textContent!=='${BRAND}')txt.textContent='${BRAND}';
      var lg=host.querySelector('[data-sx-drawer-logo]');
      if(lg){
        if((lg.getAttribute('src')||'')!=='${NEW_LOGO}')lg.setAttribute('src','${NEW_LOGO}');
        lg.removeAttribute('data-sx-brandimg');
        lg.removeAttribute('data-sx-logo');
        lg.style.setProperty('display','block','important');
        lg.style.setProperty('visibility','visible','important');
        lg.style.setProperty('opacity','1','important');
      }
    }catch(e){}
  }

  function menu(){
    try{
      // dead store links
      var dead=document.querySelectorAll('a[href*="m-store-chi"]');
      for(var d=0;d<dead.length;d++)dead[d].setAttribute('data-sx-menu-hidden','1');

      // instagram-labelled links must go to instagram, not telegram
      var as=document.querySelectorAll('a');
      for(var ia=0;ia<as.length;ia++){
        var an=as[ia];
        var lt=(an.textContent||'')+' '+(an.getAttribute('aria-label')||'')+' '+(an.getAttribute('title')||'');
        if(!/instagram/i.test(lt))continue;
        var hr=an.getAttribute('href')||'';
        if(/t\\.me|telegram/i.test(hr)){an.setAttribute('href','${DEV_INSTAGRAM}');an.setAttribute('target','_blank');}
      }

      // "Download Link: about:blank" -> developer telegram handle
      var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null);
      var tn;
      while((tn=walker.nextNode())){
        if(tn.nodeValue&&tn.nodeValue.indexOf('about:blank')>=0){
          tn.nodeValue=tn.nodeValue.replace(/about:blank/gi,'t.me/Liee070');
        }
      }


      // hide the legacy UA-NEXA row only; "About us" stays visible
      var rows=findRows(/^ua[\\s._-]?nexa$/i);
      for(var r=0;r<rows.length;r++)rows[r].setAttribute('data-sx-menu-hidden','1');

      // restore "About us" (was hidden earlier) and give it its own icon
      var pw=document.querySelectorAll('[data-pw-about]');
      for(var p=0;p<pw.length;p++){
        var ab=pw[p];
        if(/^ua[\\s._-]?nexa$/i.test(norm(ab)))continue;
        ab.removeAttribute('data-sx-menu-hidden');
        if(!ab.querySelector('[data-sx-menu-icon]'))setIcon(ab,'About us');
      }
      var abs=findRows(/^about\\s*us$/i);
      for(var q2=0;q2<abs.length;q2++){
        abs[q2].removeAttribute('data-sx-menu-hidden');
        if(!abs[q2].querySelector('[data-sx-menu-icon]'))setIcon(abs[q2],'About us');
      }


      // upstream "Join telegram" rows (e.g. inside About developer) stay hidden;
      // our own injected top-level row carries data-sx-menu-item and is skipped.
      var jt=findRows(/^join\\s*telegram$/i);
      for(var j2=0;j2<jt.length;j2++)jt[j2].setAttribute('data-sx-menu-hidden','1');

      // Contact us / About us / Developer rows point at the right chats
      var FIX=[[/^join\\s*official\\s*channel$/i,'${JOIN_TELEGRAM}'],
        [/^join\\s*channel$/i,'${JOIN_TELEGRAM}'],
        [/^contact\\s*owner$/i,'${DEV_TELEGRAM}'],
        [/^message\\s*on\\s*telegram$/i,'${DEV_TELEGRAM}'],
        [/^developer$/i,'${DEV_TELEGRAM}'],
        [/^telegram\\s*bot$/i,'${DEV_TELEGRAM}']];
      for(var f2=0;f2<FIX.length;f2++){
        var fr=findRows(FIX[f2][0]),fh=FIX[f2][1];
        for(var f3=0;f3<fr.length;f3++){
          var row=fr[f3];
          if(row.getAttribute('data-sx-fixed')===fh)continue;
          row.setAttribute('data-sx-fixed',fh);
          if(row.tagName==='A'){row.setAttribute('href',fh);row.setAttribute('target','_blank');row.setAttribute('rel','noopener');}
          else{var ia2=row.querySelector('a');if(ia2){ia2.setAttribute('href',fh);ia2.setAttribute('target','_blank');}}
          row.style.cursor='pointer';
          (function(h2){row.addEventListener('click',function(ev){
            ev.preventDefault();ev.stopPropagation();window.open(h2,'_blank','noopener');
          },true);})(fh);
        }
      }

      cleanVisibleBranding();
      drawerBrand();
      injectMenuRows();

      // brand logo images: hide the one sitting next to the name / in the top bar
      var imgs=document.querySelectorAll('img');
      for(var q=0;q<imgs.length;q++){
        var im=imgs[q];
        if(im.getAttribute('data-sx-logo')||im.getAttribute('data-sx-brandimg'))continue;
        if(im.getAttribute('data-sx-drawer-logo'))continue;
        if(im.closest&&im.closest('[data-sx-drawer],[data-sx-drawer-brand="owned"]'))continue;
        var src=im.getAttribute('src')||'';
        var alt=im.getAttribute('alt')||'';
        var looksBrand=/i\\.ibb\\.co|1000002876|71696247|anshu|ak-logo|logo|favicon|brand/i.test(src+' '+alt)
          ||src.indexOf('${NEW_LOGO}')>=0||src.indexOf('${LOGO_ASSET}')>=0;
        if(!looksBrand)continue;
        var rect=null;try{rect=im.getBoundingClientRect();}catch(e0){}
        var top=rect?(rect.top+(window.scrollY||0)):0;
        var nearName=!!(im.closest&&im.closest('[data-sx-wordmark],[data-sx-header]'));
        if(nearName||top<=120){
          im.setAttribute('data-sx-brandimg','1');
          im.style.setProperty('display','none','important');
          continue;
        }
        if(src.indexOf('${NEW_LOGO}')>=0){im.setAttribute('data-sx-logo','1');continue;}
        im.setAttribute('data-sx-logo','1');
        im.setAttribute('src','${NEW_LOGO}');
        im.style.setProperty('border-radius','50%');
        im.style.setProperty('object-fit','cover');
      }

      // "- back" control next to the hamburger becomes the text-only wordmark
      var bc=document.querySelectorAll('span,div,button,a,p,h1,h2');
      for(var b=0;b<bc.length;b++){
        var e2=bc[b];
        if(e2.getAttribute('data-sx-wordmark'))continue;
        var t2=norm(e2);
        if(!/^[<‹«←⟨\\-–—]{0,2}\\s*back$/i.test(t2))continue;
        if(e2.children.length>1)continue;
        e2.setAttribute('data-sx-wordmark','1');
        e2.textContent='STUDYxANSHU';
        e2.style.setProperty('white-space','nowrap','important');
      }

    }catch(e){}
  }

  /** Tag the header row, XP pill and content cards so the injected CSS applies. */
  function ui(){
    try{
      var wm=document.querySelector('[data-sx-wordmark]');
      if(wm&&!document.querySelector('[data-sx-header]')){
        var node=wm.parentElement,hdr=null;
        for(var i=0;i<6&&node&&node.tagName!=='BODY';i++){
          if(node.getBoundingClientRect().width>=window.innerWidth*0.85){hdr=node;break;}
          node=node.parentElement;
        }
        if(hdr)hdr.setAttribute('data-sx-header','1');
      }
      // header row, independent of the old "- back" control
      if(!document.querySelector('[data-sx-header]')){
        var all=document.querySelectorAll('header,div,nav');
        for(var h=0;h<all.length;h++){
          var el=all[h];
          if(el.id==='__next'||el.id==='root'||el.id==='app')continue;
          var rc;try{rc=el.getBoundingClientRect();}catch(eh){continue;}
          if(rc.top>12||rc.height<32||rc.height>96)continue;
          if(rc.width<window.innerWidth*0.85)continue;
          if(el.querySelector('[data-sx-header]'))continue;
          el.setAttribute('data-sx-header','1');
          break;
        }
      }
      // XP pill
      var cand=document.querySelectorAll('div,span,p,button');
      for(var x=0;x<cand.length;x++){
        var c=cand[x];
        if(c.getAttribute('data-sx-xp'))continue;
        var tx=norm(c);
        if(!tx||tx.length>12||!/^[0-9,.]+\\s*xp$/i.test(tx))continue;
        var deep=c.querySelector('div,span,p,button');
        if(deep&&/^[0-9,.]+\\s*xp$/i.test(norm(deep)))continue;
        c.setAttribute('data-sx-xp','1');
      }
      // content cards: rounded blocks wide enough to be a section card
      var blocks=document.querySelectorAll('div,section,article');
      for(var b2=0;b2<blocks.length;b2++){
        var bl=blocks[b2];
        if(bl.getAttribute('data-sx-card')||bl.getAttribute('data-sx-modal'))continue;
        if(bl.closest&&bl.closest('[data-sx-modal],[data-sx-header]'))continue;
        var r=bl.getBoundingClientRect();
        if(r.width<200||r.width>window.innerWidth||r.height<48)continue;
        var cs2=window.getComputedStyle(bl);
        if(parseFloat(cs2.borderTopLeftRadius)<4)continue;
        bl.setAttribute('data-sx-card','1');
      }
    }catch(e){}
  }

  /** Find the site's hamburger / menu button, if any. */
  function hamburger(){
    try{
      var q=document.querySelectorAll('button,[role="button"],a,div');
      var best=null;
      for(var i=0;i<q.length;i++){
        var el=q[i];
        if(el.getAttribute('data-sx-dock'))continue;
        var lab=((el.getAttribute('aria-label')||'')+' '+(el.getAttribute('title')||'')
          +' '+((el.className&&el.className.toString())||'')).toLowerCase();
        var isLabelled=lab.indexOf('menu')>-1||lab.indexOf('hamburger')>-1||lab.indexOf('drawer')>-1
          ||lab.indexOf('sidebar')>-1;
        var r;try{r=el.getBoundingClientRect();}catch(e1){continue;}
        if(r.width<20||r.width>72||r.height<20||r.height>72)continue;
        if(r.top>96)continue;
        if(isLabelled)return el;
        if(!best&&r.left<window.innerWidth*0.35&&el.querySelector&&el.querySelector('svg'))best=el;
      }
      return best;
    }catch(e){return null;}
  }

  /** Floating right-edge toggle removed: only hide an upstream duplicate. */
  function dock(){
    try{
      var els=document.querySelectorAll('button,div,a,span');
      for(var i=0;i<els.length;i++){
        var el=els[i];
        if(el.getAttribute('data-sx-dock-upstream'))continue;
        var cs=window.getComputedStyle(el);
        if(cs.position!=='fixed')continue;
        var r=el.getBoundingClientRect();
        if(r.width>90||r.height>110||r.width<10||r.height<10)continue;
        if(r.right<window.innerWidth-24)continue;
        var t=norm(el);
        if(t.length>2)continue;
        if(t&&!/[<>\u2039\u203a\u00ab\u00bb\u27e8\u27e9\u2190\u2192|]/.test(t))continue;
        el.setAttribute('data-sx-dock-upstream','1');
      }
    }catch(e){}
  }




  /** Replace the upstream "Join Our Community" card with our animated hero. */
  var PAGE=24;
  function hero(){
    try{
      if(document.querySelector('[data-sx-hero]'))return;
      var nodes=document.querySelectorAll('div,section,article');
      var target=null;
      for(var i=0;i<nodes.length;i++){
        var t=norm(nodes[i]).toLowerCase();
        if(t.indexOf('join our community')<0)continue;
        if(t.length>420)continue;
        target=nodes[i];
      }
      if(!target)return;
      // climb to the outermost card that still is mostly this section
      var host=target;
      for(var k=0;k<4;k++){
        var p=host.parentElement;
        if(!p||p.tagName==='BODY')break;
        if(norm(p).toLowerCase().indexOf('join our community')<0)break;
        if(norm(p).length>norm(target).length+160)break;
        host=p;
      }
      var wrap=document.createElement('section');
      wrap.setAttribute('data-sx-hero','1');
      wrap.innerHTML='<p class="sxh1">Love \u2764\ufe0f from</p>'
        +'<h2 class="sxh2">SUGANDHNAGAR</h2>'
        +'<p class="sxsub">Curated batches for JEE, NEET, GATE, CBSE, UPSC and more.</p>'
        +'<input class="sxsearch" type="search" placeholder="Search batch or teacher..." aria-label="Search batches">'
        +'<div class="sxgrid"></div>'
        +'<button class="sxmore" type="button">Load more</button>';
      host.setAttribute('data-sx-hero-hidden','1');
      if(host.parentElement)host.parentElement.insertBefore(wrap,host);
      else document.body.appendChild(wrap);

      // batch list comes from the page's batch <select>, if present
      var items=[];
      var sel=document.querySelector('select');
      if(sel){
        for(var o=0;o<sel.options.length;o++){
          var lb=(sel.options[o].textContent||'').trim();
          if(!lb||/^select/i.test(lb))continue;
          items.push({label:lb,value:sel.options[o].value});
        }
      }
      var grid=wrap.querySelector('.sxgrid');
      var more=wrap.querySelector('.sxmore');
      var input=wrap.querySelector('.sxsearch');
      var shown=PAGE;
      function render(){
        var q=(input.value||'').trim().toLowerCase();
        var list=items.filter(function(it){return !q||it.label.toLowerCase().indexOf(q)>=0;});
        var slice=list.slice(0,shown);
        grid.innerHTML='';
        slice.forEach(function(it,idx){
          var c=document.createElement('div');
          c.className='sxcard';
          c.textContent=it.label;
          c.style.animationDelay=Math.min(idx,12)*30+'ms';
          c.addEventListener('click',function(){
            if(!sel)return;
            sel.value=it.value;
            sel.dispatchEvent(new Event('change',{bubbles:true}));
            try{sel.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}
          });
          grid.appendChild(c);
        });
        more.style.display=list.length>shown?'block':'none';
        if(!items.length){grid.style.display='none';input.style.display='none';}
      }
      input.addEventListener('input',function(){shown=PAGE;render();});
      more.addEventListener('click',function(){shown+=PAGE;render();});
      render();
    }catch(e){}
  }

  /** Welcome announcement modal - injected, outside the React tree. */

  var FEATURES=['Live Classes, all batches','Recorded Lectures, full access',
    'DPP and Notes, download anytime','Quizzes and Test Series',
    'Regular, Infinity, Infinity Pro batches','Fastrack and all other batches',
    'Full Test Series, working','Instant updates, always latest'];
  function welcome(){
    if(window.__sxWelcome)return;
    window.__sxWelcome=true;
    try{try{if(sessionStorage.getItem('sx_welcome_seen'))return;
      sessionStorage.setItem('sx_welcome_seen','1');}catch(e){}
      var ov=document.createElement('div');
      ov.setAttribute('data-sx-modal','1');
      ov.style.cssText='position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;'
        +'justify-content:center;padding:12px;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);'
        +'opacity:0;transition:opacity .25s ease;overscroll-behavior:contain;';
      var card=document.createElement('div');
      card.style.cssText='position:relative;width:100%;max-width:300px;max-height:74vh;overflow-y:auto;'
        +'-webkit-overflow-scrolling:touch;border-radius:18px;background:#0d1b1e;'
        +'border:1px solid rgba(16,185,129,.18);box-shadow:0 16px 40px rgba(0,0,0,.45);'
        +'padding:14px 12px 0;color:#e6f4ef;font-family:inherit;transform:scale(.94);transition:transform .25s ease;';
      var html=''
        +'<button data-sx-x aria-label="Close" style="position:absolute;top:7px;right:7px;width:26px;height:26px;'
        +'border-radius:9999px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);'
        +'color:#e6f4ef;font-size:13px;line-height:1;cursor:pointer;">&#10005;</button>'
        +'<h2 style="margin:2px 0 6px;text-align:center;font-size:clamp(15px,4.4vw,19px);font-weight:800;'
        +'letter-spacing:.4px;color:#34d399;">&#127775;ANSHU KESHAWAT&#127775;</h2>'
        +'<p style="margin:0;text-align:center;font-size:10.5px;letter-spacing:1px;color:#cbd5e1;font-weight:500;">LOVE &#10084;&#65039; FROM</p>'
        +'<p style="margin:2px 0 0;text-align:center;font-size:13px;font-weight:800;letter-spacing:2px;'
        +'background:linear-gradient(90deg,#22d3ee,#fbbf24);-webkit-background-clip:text;background-clip:text;'
        +'color:transparent;">SUGANDHNAGAR</p>'
        +'<div style="margin:10px 0;padding:8px;border-radius:9px;background:rgba(69,10,10,.4);'
        +'border:1px solid rgba(239,68,68,.25);color:#fca5a5;text-align:center;font-size:10.5px;font-weight:500;line-height:1.4;">'
        +'Do NOT purchase this app from anyone. It is 100% FREE always.</div>'
        +'<h3 style="margin:0 0 6px;font-size:12.5px;font-weight:800;color:#34d399;">What is Available Free</h3>'
        +'<ul style="margin:0;padding:0 0 0 2px;list-style:none;display:grid;gap:4px;">'
        +FEATURES.map(function(f){return '<li style="display:flex;gap:6px;font-size:11px;line-height:1.35;color:#d1fae5;">'
          +'<span style="color:#34d399;flex:0 0 auto;">&#8211;</span><span>'+f+'</span></li>';}).join('')
        +'</ul>'
        +'<a data-sx-cta href="${DEV_INSTAGRAM}" target="_blank" rel="noopener" style="display:block;margin:10px 0 6px;'
        +'padding:9px 12px;border-radius:9999px;text-align:center;font-weight:800;font-size:12px;color:#fff;'
        +'text-decoration:none;background:linear-gradient(90deg,#ec4899,#f43f5e,#9333ea);">Follow Developer on Instagram</a>'
        +'<a data-sx-cta href="https://t.me/+JzpUpoFpWABlMzM9" target="_blank" rel="noopener" style="display:block;margin:0 0 6px;'
        +'padding:9px 12px;border-radius:9999px;text-align:center;font-weight:800;font-size:12px;color:#fff;'
        +'text-decoration:none;background:linear-gradient(90deg,#0ea5e9,#2563eb);">Follow on Telegram</a>'
        +'<a data-sx-cta href="https://whatsapp.com/channel/0029VbCvhNqGZNCp0sKLUk3G" target="_blank" rel="noopener" style="display:block;margin:0 0 10px;'
        +'padding:9px 12px;border-radius:9999px;text-align:center;font-weight:800;font-size:12px;color:#fff;'
        +'text-decoration:none;background:linear-gradient(90deg,#22c55e,#16a34a);">Follow on WhatsApp</a>'
        +'<p data-sx-count style="margin:0 0 7px;text-align:center;font-size:10.5px;color:#9ca3af;">Auto-closing in 12s</p>'
        +'<div style="position:sticky;bottom:0;height:3px;background:rgba(255,255,255,.07);border-radius:9999px;overflow:hidden;">'
        +'<div data-sx-bar style="height:100%;width:100%;border-radius:9999px;background:#34d399;'
        +'transition:width 12s linear;"></div></div>';

      card.innerHTML=html;
      ov.appendChild(card);
      document.body.appendChild(ov);
      requestAnimationFrame(function(){
        ov.style.opacity='1';card.style.transform='scale(1)';
        var bar=card.querySelector('[data-sx-bar]');
        if(bar)requestAnimationFrame(function(){bar.style.width='0%';});
      });
      var left=12,timer=null;
      var label=card.querySelector('[data-sx-count]');
      function close(){
        if(timer)clearInterval(timer);
        ov.style.opacity='0';card.style.transform='scale(.94)';
        setTimeout(function(){try{ov.remove();}catch(e){}},260);
      }
      timer=setInterval(function(){
        left--;
        if(label)label.textContent='Auto-closing in '+(left>0?left:0)+'s';
        if(left<=0)close();
      },1000);
      card.querySelector('[data-sx-x]').addEventListener('click',close);
      ov.addEventListener('click',function(ev){ev.stopPropagation();});

    }catch(e){}
  }

  var hydrated=false;
  function tick(){kill();if(hydrated){menu();ui();dock();}}
  function ready(){hydrated=true;tick();welcome();}
  if(document.addEventListener){
    document.addEventListener('DOMContentLoaded',tick);
    window.addEventListener('load',function(){setTimeout(ready,600);});
    setTimeout(ready,2500);
  }

  try{
    var scheduled=false;
    var mo=new MutationObserver(function(){
      if(scheduled)return;
      scheduled=true;
      setTimeout(function(){scheduled=false;tick();},60);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
}catch(e){}})();</script>`;


/** Rewrites for upstream HTML documents. */
export function rewriteHtml(html: string): string {
  let out = html;

  // Route the loader through our own origin so it can be patched.
  out = out.replace(
    new RegExp(`https://marco-magic-loader\\.lovable\\.app${LOADER_PATH.replace(/\//g, "\\/")}`, "g"),
    "/__ext/loader.js",
  );

  // Frames are left intact so lecture players always load; the runtime guard
  // only unwraps a frame that embeds this very same page.


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
  // Streaming manifests/segments must never be rewritten.
  const isMedia =
    /\.(m3u8|mpd|ts|m4s|mp4|key|webm|vtt|srt)(?:$|\?)/i.test(pathname) ||
    /mpegurl|dash\+xml|video\/|audio\/|octet-stream/i.test(contentType ?? "");
  if (!upstream.body || isMedia || !isTextual(contentType)) {
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
