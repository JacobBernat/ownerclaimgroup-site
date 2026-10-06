(function(){
  var d=document.documentElement; d.classList.add('js');
  document.addEventListener('DOMContentLoaded',function(){
    var hdr=document.querySelector('.site-header'), btn=document.querySelector('.menu-btn');
    if(btn&&hdr){btn.addEventListener('click',function(){var open=hdr.classList.toggle('menu-open');btn.setAttribute('aria-expanded',open?'true':'false');});}
    var els=document.querySelectorAll('.reveal');
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -40px 0px',threshold:0.05});
      els.forEach(function(el){io.observe(el);});
    } else { els.forEach(function(el){el.classList.add('in');}); }
    var f=document.getElementById('contact-form');
    if(f){f.addEventListener('submit',function(ev){
      ev.preventDefault();
      var v=function(n){var el=f.elements[n];return el?el.value.trim():'';};
      var body='Name: '+v('name')+'\nBusiness (and former names): '+v('business')+'\nState(s): '+v('state')+'\n\n'+v('message');
      var subj='Please check for unclaimed money'+(v('business')?' - '+v('business'):(v('name')?' - '+v('name'):''));
      window.location.href='mailto:info@ownerclaimgroup.com?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(body);
    });}
  });
})();
