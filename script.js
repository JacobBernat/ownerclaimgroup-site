(function(){
  "use strict";
  var d=document, root=d.documentElement; root.classList.remove("no-js");
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine=window.matchMedia&&window.matchMedia("(pointer: fine)").matches;

  /* nav: scrolled state + mobile sheet */
  var nav=d.getElementById("top-nav");
  var btn=nav&&nav.querySelector(".menu-btn"), sheet=d.getElementById("menu-sheet");
  function onScrollNav(){ if(nav) nav.classList.toggle("scrolled", window.scrollY>24); }
  if(btn&&sheet){
    btn.addEventListener("click",function(){
      var open=btn.getAttribute("aria-expanded")!=="true";
      btn.setAttribute("aria-expanded",String(open));
      btn.setAttribute("aria-label",open?"Close menu":"Open menu");
      sheet.hidden=!open; nav.classList.toggle("open",open);
      d.body.style.overflow=open?"hidden":"";
    });
    sheet.addEventListener("click",function(e){ if(e.target.closest("a")){ btn.setAttribute("aria-expanded","false"); sheet.hidden=true; nav.classList.remove("open"); d.body.style.overflow=""; } });
    d.addEventListener("keydown",function(e){ if(e.key==="Escape"&&!sheet.hidden){ btn.click(); btn.focus(); } });
  }

  /* split statement into words */
  var stmt=d.querySelector("[data-words]");
  if(stmt){
    var words=stmt.textContent.trim().split(/\s+/);
    stmt.setAttribute("aria-label",stmt.textContent.trim());
    stmt.innerHTML=words.map(function(w){return '<span class="w" aria-hidden="true">'+w+'</span>';}).join(" ");
  }
  var wordEls=stmt?stmt.querySelectorAll(".w"):[];

  /* count-up for real figures only */
  function fmt(v,el){
    var dec=+(el.dataset.decimals||0), s=v.toFixed(dec);
    if(el.dataset.sep){ s=Math.round(v).toLocaleString("en-US"); }
    return (el.dataset.prefix||"")+s+(el.dataset.suffix||"");
  }
  function count(el){
    var to=parseFloat(el.dataset.count); if(reduce||isNaN(to)) return;
    var t0=null, dur=1800;
    function step(t){ if(!t0)t0=t; var p=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-p,4);
      el.textContent=fmt(to*e,el); if(p<1) requestAnimationFrame(step); else el.textContent=fmt(to,el); }
    el.textContent=fmt(0,el); requestAnimationFrame(step);
  }

  /* reveal on scroll */
  var items=d.querySelectorAll(".reveal, .step, [data-count]");
  if("IntersectionObserver" in window && !reduce){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        var el=e.target; el.classList.add("in");
        if(el.dataset.count!==undefined) count(el);
        io.unobserve(el);
      });
    },{rootMargin:"0px 0px -8% 0px",threshold:.12});
    items.forEach(function(el){ io.observe(el); });
  } else {
    items.forEach(function(el){ el.classList.add("in"); });
  }
  /* stagger siblings in grids */
  d.querySelectorAll(".who-grid,.steps,.bento,.stats,.perks,.qa-list").forEach(function(g){
    Array.prototype.forEach.call(g.children,function(c,i){ if(!c.style.getPropertyValue("--i")) c.style.setProperty("--i",i); });
  });

  /* scroll-driven: parallax, word light-up, progress line */
  var hero=d.querySelector("[data-parallax]"), aur=d.querySelector(".hero .aurora");
  var line=d.querySelector(".how-line span"), how=d.getElementById("how");
  var ticking=false;
  function frame(){
    ticking=false;
    var y=window.scrollY, vh=window.innerHeight;
    onScrollNav();
    if(reduce) return;
    if(hero && y<vh*1.2){
      hero.style.transform="translate3d(0,"+(y*0.28)+"px,0)";
      hero.style.opacity=String(Math.max(0,1-y/(vh*0.85)));
      if(aur) aur.style.transform="translate3d(0,"+(y*0.12)+"px,0) scale("+(1+y/vh*0.08)+")";
    }
    if(wordEls.length){
      var r=stmt.getBoundingClientRect();
      var p=(vh*0.85-r.top)/(r.height+vh*0.35);
      var n=Math.round(Math.max(0,Math.min(1,p))*wordEls.length);
      for(var i=0;i<wordEls.length;i++) wordEls[i].classList.toggle("on",i<n);
    }
    if(line&&how){
      var hr=how.getBoundingClientRect();
      var pp=Math.max(0,Math.min(1,(vh-hr.top)/(hr.height+vh*0.2)));
      line.style.setProperty("--p",pp.toFixed(3));
    }
  }
  function req(){ if(!ticking){ ticking=true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll",req,{passive:true});
  window.addEventListener("resize",req);
  if(reduce){ wordEls.forEach&&wordEls.forEach(function(w){w.classList.add("on");}); if(line) line.style.setProperty("--p","1"); }
  frame();

  /* pointer glow on tiles (desktop only) */
  if(fine&&!reduce){
    d.querySelectorAll("[data-glow]").forEach(function(t){
      t.addEventListener("pointermove",function(e){
        var r=t.getBoundingClientRect();
        t.style.setProperty("--mx",(e.clientX-r.left)+"px");
        t.style.setProperty("--my",(e.clientY-r.top)+"px");
      });
    });
  }

  /* smooth FAQ open/close */
  d.querySelectorAll(".qa").forEach(function(q){
    var s=q.querySelector("summary"), b=q.querySelector(".qa-body");
    s.addEventListener("click",function(e){
      if(reduce||!b.animate) return;
      e.preventDefault();
      if(q.open){
        var h=b.offsetHeight;
        b.animate([{height:h+"px",opacity:1},{height:"0px",opacity:0}],{duration:320,easing:"cubic-bezier(.2,.7,.1,1)"}).onfinish=function(){ q.open=false; };
      } else {
        q.open=true; var h2=b.offsetHeight;
        b.animate([{height:"0px",opacity:0},{height:h2+"px",opacity:1}],{duration:420,easing:"cubic-bezier(.2,.7,.1,1)"});
      }
    });
  });
})();

// contact form -> Owner Claim Group back office (Oct 7 2026)
(function(){
  var f=document.getElementById('cform'); if(!f) return;
  var API='https://ocg-backoffice.sites.tab.bot/api/public/inquiry';
  var st=document.getElementById('cf-status'), btn=f.querySelector('.cf-send');
  function say(t,k){st.textContent=t;st.className='cf-status '+(k||'');}
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var g=function(n){var el=f.elements[n];return el?String(el.value||'').trim():'';};
    [].forEach.call(f.querySelectorAll('.cf-bad'),function(x){x.classList.remove('cf-bad');});
    var name=g('name'),phone=g('phone'),email=g('email');
    if(name.length<2){f.elements.name.classList.add('cf-bad');f.elements.name.focus();return say('Please type your name.','err');}
    if(!phone&&!email){f.elements.phone.classList.add('cf-bad');f.elements.phone.focus();return say('Please give us a phone number or an email so we can reply.','err');}
    if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){f.elements.email.classList.add('cf-bad');f.elements.email.focus();return say('That email address looks incomplete.','err');}
    if(phone&&phone.replace(/\D/g,'').length<10){f.elements.phone.classList.add('cf-bad');f.elements.phone.focus();return say('Please type a full phone number with area code.','err');}
    btn.disabled=true; say('Sending…');
    var data={name:name,phone:phone,email:email,state:g('state'),about:g('about'),message:g('message'),website:g('website'),consent:!!f.elements.consent.checked,page:location.pathname};
    fetch(API,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)})
      .then(function(r){return r.json().catch(function(){return {ok:false};});})
      .then(function(j){
        if(j&&j.ok){f.classList.add('sent');say('Thank you, '+name.split(' ')[0]+'. We got your request. A person from our team will get back to you soon.','ok');}
        else{btn.disabled=false;say((j&&j.error)||'That didn\'t go through. Please call (332) 230-6032 or email info@ownerclaimgroup.com.','err');}
      })
      .catch(function(){btn.disabled=false;say('That didn\'t go through. Please call (332) 230-6032 or email info@ownerclaimgroup.com.','err');});
  });
})();
