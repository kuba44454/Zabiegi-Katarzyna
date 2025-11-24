/* ==== Utils Globalne ==== */
window.fetchJSON = async function(path){ 
  try {
    const r = await fetch(path); 
    return r.json(); 
  } catch(e) { 
    console.error("Błąd JSON:", path); 
    return []; 
  }
}

/* ==== Scroll Reveal ==== */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Dodajemy reveal do elementów, które są na każdej stronie
  const elements = document.querySelectorAll('.h2, .section:not(.hero), .p-card'); 
  elements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

/* ==== Lazy background ==== */
window.lazyBg = function(el, mode='hero'){
  const url = el?.dataset?.bg;
  if(!el || !url) return;
  const load = () => {
    if(mode==='hero'){
      el.style.backgroundImage = `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(246,240,232,.2) 70%), url('${url}')`;
    }else{
      el.style.background = `url('${url}') center/cover no-repeat`;
    }
  };
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ load(); io.disconnect(); } });
  }, {rootMargin: '200px'});
  io.observe(el);
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
});