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
  "pwmarco.pages.dev",
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
  body = body.replace(/PW[\s._-]?MARCO/gi, BRAND);
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
    +'[data-sx-popup-killed],[data-sx-menu-hidden]{display:none!important;visibility:hidden!important;}'
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
    +'[data-sx-xp]{display:none!important;visibility:hidden!important;}'
    /* ---- cards & spacing ---- */
    +'[data-sx-card]{border-radius:16px!important;overflow-wrap:anywhere!important;line-height:1.5!important;}'
    +'[data-sx-card] p,[data-sx-card] span,[data-sx-card] h1,[data-sx-card] h2,[data-sx-card] h3{overflow-wrap:anywhere!important;line-height:1.5!important;}'
    +'select{width:100%!important;border-radius:12px!important;border:1px solid rgba(255,255,255,.12)!important;'
    +'padding:10px 12px!important;font-size:14px!important;line-height:1.4!important;appearance:none!important;'
    +'-webkit-appearance:none!important;background-image:none!important;}'
    /* ---- floating right-edge dock toggle ---- */
    +'[data-sx-dock]{position:fixed!important;right:0!important;top:50%!important;transform:translateY(-50%)!important;'
    +'z-index:2147482000!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;'
    +'display:flex!important;align-items:center!important;justify-content:center!important;'
    +'min-width:44px!important;min-height:56px!important;width:44px!important;height:56px!important;'
    +'padding:10px 12px!important;transition:none!important;margin:0!important;'
    +'background:#000!important;color:#fff!important;border:1px solid rgba(255,255,255,.18)!important;'
    +'border-right:0!important;border-radius:14px 0 0 14px!important;box-shadow:0 8px 24px rgba(0,0,0,.5)!important;'
    +'font-size:20px!important;line-height:1!important;font-weight:700!important;cursor:pointer!important;'
    +'clip:auto!important;clip-path:none!important;}'
    +'[data-sx-dock-upstream]{display:none!important;}'
    +'[data-sx-float-action][data-sx-action-hidden="1"]{display:none!important;visibility:hidden!important;pointer-events:none!important;}'

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


      injectMenuRows();

      // brand logo images: hide the one sitting next to the name / in the top bar
      var imgs=document.querySelectorAll('img');
      for(var q=0;q<imgs.length;q++){
        var im=imgs[q];
        if(im.getAttribute('data-sx-logo')||im.getAttribute('data-sx-brandimg'))continue;
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

  /** Find the floating Info / Brainix / Live / Batch controls owned by the
   *  loader. The right-edge toggle controls these buttons, not the drawer. */
  function floatingActions(){
    var found=[];
    try{
      var q=document.querySelectorAll('button,[role="button"],a,div,span');
      for(var i=0;i<q.length;i++){
        var el=q[i];
        if(el.getAttribute('data-sx-dock')||el.getAttribute('data-sx-float-action'))continue;
        var label=norm(el);
        if(!/^(info|brainix|live|batch)$/i.test(label))continue;
        if(el.querySelector&&el.querySelector('button,a,[role="button"]'))continue;
        var row=el;
        for(var j=0;j<3&&row.parentElement;j++){
          if(row.tagName==='BUTTON'||row.tagName==='A'||row.getAttribute('role')==='button')break;
          if(norm(row.parentElement)!==label)break;
          row=row.parentElement;
        }
        if(found.indexOf(row)<0){row.setAttribute('data-sx-float-action','1');found.push(row);}
      }
    }catch(e){}
    return found;
  }
  function setFloatingActions(open,items){
    for(var i=0;i<items.length;i++){
      var el=items[i];
      el.setAttribute('data-sx-action-hidden',open?'0':'1');
      if(open){
        el.style.removeProperty('display');el.style.removeProperty('visibility');el.style.removeProperty('pointer-events');
      }else{
        el.style.setProperty('display','none','important');
        el.style.setProperty('visibility','hidden','important');
        el.style.setProperty('pointer-events','none','important');
      }
    }
  }

  /** Our own right-edge toggle: always present, never clipped by upstream layout. */
  function dock(){
    try{
      // hide any upstream duplicate so there is never a second pill
      var els=document.querySelectorAll('button,div,a,span');
      for(var i=0;i<els.length;i++){
        var el=els[i];
        if(el.getAttribute('data-sx-dock')||el.getAttribute('data-sx-dock-upstream'))continue;
        var cs=window.getComputedStyle(el);
        if(cs.position!=='fixed')continue;
        var r=el.getBoundingClientRect();
        if(r.width>90||r.height>110||r.width<10||r.height<10)continue;
        if(r.right<window.innerWidth-24)continue;
        var t=norm(el);
        if(t.length>2&&t.length>0)continue;
        if(t&&!/[<>\u2039\u203a\u00ab\u00bb\u27e8\u27e9\u2190\u2192|]/.test(t))continue;
        el.setAttribute('data-sx-dock-upstream','1');
      }

      var actions=floatingActions();
      var btn=document.querySelector('[data-sx-dock]');
      if(btn&&btn.isConnected){
        var open=btn.getAttribute('data-open')!=='0';
        setFloatingActions(open,actions);
        return;
      }
      btn=document.createElement('button');
      btn.setAttribute('data-sx-dock','1');
      btn.setAttribute('data-open','1');
      btn.setAttribute('type','button');
      btn.setAttribute('aria-label','Hide floating tools');
      btn.textContent='\u2039';
      btn.addEventListener('click',function(ev){
        ev.preventDefault();ev.stopPropagation();
        var open=btn.getAttribute('data-open')!=='0';
        btn.setAttribute('data-open',open?'0':'1');
        btn.setAttribute('aria-label',open?'Show floating tools':'Hide floating tools');
        btn.textContent=open?'\u203a':'\u2039';
        var items=floatingActions();
        setFloatingActions(!open,items);
      });
      document.body.appendChild(btn);
    }catch(e){}
  }

  /** Replace branding that is rendered later by React or the loader. Runs only
   *  after hydration so upstream server markup is not mutated mid-hydration. */
  function visibleBranding(){
    try{
      var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{
        acceptNode:function(n){
          var p=n.parentElement;
          if(!p||/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/i.test(p.tagName))return NodeFilter.FILTER_REJECT;
          return /marco/i.test(n.nodeValue||'')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
        }
      });
      var nodes=[],n;
      while((n=walker.nextNode()))nodes.push(n);
      for(var i=0;i<nodes.length;i++){
        nodes[i].nodeValue=(nodes[i].nodeValue||'')
          .replace(/PW[\s._-]*MARCO/gi,'STUDYxANSHU')
          .replace(/\bMARCO\b/gi,'ANSHU KESHAWAT');
      }
      var attrs=document.querySelectorAll('[title],[aria-label],[placeholder],[alt]');
      for(var j=0;j<attrs.length;j++){
        var el=attrs[j],names=['title','aria-label','placeholder','alt'];
        for(var k=0;k<names.length;k++){
          var val=el.getAttribute(names[k]);
          if(!val||!/marco/i.test(val))continue;
          el.setAttribute(names[k],val.replace(/PW[\s._-]*MARCO/gi,'STUDYxANSHU').replace(/\bMARCO\b/gi,'ANSHU KESHAWAT'));
        }
      }
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
    try{try{sessionStorage.removeItem('sx_welcome_seen');}catch(e){}
      var ov=document.createElement('div');
      ov.setAttribute('data-sx-modal','1');
      ov.style.cssText='position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;'
        +'justify-content:center;padding:14px;background:rgba(0,0,0,.8);backdrop-filter:blur(12px);'
        +'opacity:0;transition:opacity .25s ease;overscroll-behavior:contain;';
      var card=document.createElement('div');
      card.style.cssText='position:relative;width:100%;max-width:340px;max-height:82vh;overflow-y:auto;'
        +'-webkit-overflow-scrolling:touch;border-radius:20px;background:#0d1b1e;'
        +'border:1px solid rgba(16,185,129,.25);box-shadow:0 25px 60px rgba(0,0,0,.6),0 0 40px rgba(16,185,129,.12);'
        +'padding:18px 14px 0;color:#e6f4ef;font-family:inherit;transform:scale(.94);transition:transform .25s ease;';
      var html=''
        +'<button data-sx-x aria-label="Close" style="position:absolute;top:8px;right:8px;width:28px;height:28px;'
        +'border-radius:9999px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);'
        +'color:#e6f4ef;font-size:14px;line-height:1;cursor:pointer;">&#10005;</button>'
        +'<h2 style="margin:4px 0 8px;text-align:center;font-size:clamp(17px,5vw,22px);font-weight:800;'
        +'letter-spacing:.5px;color:#34d399;">&#127775;ANSHU KESHAWAT&#127775;</h2>'
        +'<p style="margin:0;text-align:center;font-size:11.5px;letter-spacing:1px;color:#cbd5e1;font-weight:500;">LOVE &#10084;&#65039; FROM</p>'
        +'<p style="margin:3px 0 0;text-align:center;font-size:15px;font-weight:800;letter-spacing:2.5px;'
        +'background:linear-gradient(90deg,#22d3ee,#fbbf24);-webkit-background-clip:text;background-clip:text;'
        +'color:transparent;">SUGANDHNAGAR</p>'
        +'<div style="margin:12px 0;padding:10px;border-radius:10px;background:rgba(69,10,10,.45);'
        +'border:1px solid rgba(239,68,68,.3);color:#fca5a5;text-align:center;font-size:11.5px;font-weight:500;line-height:1.45;">'
        +'Do NOT purchase this app from anyone. It is 100% FREE always.</div>'
        +'<h3 style="margin:0 0 8px;font-size:13.5px;font-weight:800;color:#34d399;">What is Available Free</h3>'
        +'<ul style="margin:0;padding:0 0 0 2px;list-style:none;display:grid;gap:5px;">'
        +FEATURES.map(function(f){return '<li style="display:flex;gap:7px;font-size:12px;line-height:1.4;color:#d1fae5;">'
          +'<span style="color:#34d399;flex:0 0 auto;">&#8211;</span><span>'+f+'</span></li>';}).join('')
        +'</ul>'
        +'<a data-sx-cta href="${DEV_INSTAGRAM}" target="_blank" rel="noopener" style="display:block;margin:12px 0 8px;'
        +'padding:11px 14px;border-radius:9999px;text-align:center;font-weight:800;font-size:13px;color:#fff;'
        +'text-decoration:none;background:linear-gradient(90deg,#ec4899,#f43f5e,#9333ea);'
        +'box-shadow:0 8px 20px rgba(236,72,153,.3);">Follow Developer on Instagram</a>'
        +'<a data-sx-cta href="https://t.me/+JzpUpoFpWABlMzM9" target="_blank" rel="noopener" style="display:block;margin:0 0 8px;'
        +'padding:11px 14px;border-radius:9999px;text-align:center;font-weight:800;font-size:13px;color:#fff;'
        +'text-decoration:none;background:linear-gradient(90deg,#0ea5e9,#2563eb);'
        +'box-shadow:0 8px 20px rgba(37,99,235,.3);">Follow on Telegram</a>'
        +'<a data-sx-cta href="https://whatsapp.com/channel/0029VbCvhNqGZNCp0sKLUk3G" target="_blank" rel="noopener" style="display:block;margin:0 0 12px;'
        +'padding:11px 14px;border-radius:9999px;text-align:center;font-weight:800;font-size:13px;color:#fff;'
        +'text-decoration:none;background:linear-gradient(90deg,#22c55e,#16a34a);'
        +'box-shadow:0 8px 20px rgba(34,197,94,.3);">Follow on WhatsApp</a>'
        +'<p data-sx-count style="margin:0 0 8px;text-align:center;font-size:11px;color:#9ca3af;">Auto-closing in 20s</p>'
        +'<div style="position:sticky;bottom:0;height:4px;background:rgba(255,255,255,.07);border-radius:9999px;overflow:hidden;">'
        +'<div data-sx-bar style="height:100%;width:100%;border-radius:9999px;background:#34d399;'
        +'transition:width 20s linear;"></div></div>';

      card.innerHTML=html;
      ov.appendChild(card);
      document.body.appendChild(ov);
      requestAnimationFrame(function(){
        ov.style.opacity='1';card.style.transform='scale(1)';
        var bar=card.querySelector('[data-sx-bar]');
        if(bar)requestAnimationFrame(function(){bar.style.width='0%';});
      });
      var left=20,timer=null;
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
  function tick(){if(hydrated){kill();menu();ui();visibleBranding();dock();}}
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
