/* ==== komponenty i optymalizacja ładowania ==== */
const componentCache = {};

async function includeComponents() {
  const slots = document.querySelectorAll('[data-include]');
  const uniqueUrls = [...new Set([...slots].map(el => el.dataset.include))];

  await Promise.all(uniqueUrls.map(async url => {
    if (!componentCache[url]) {
      try {
        const res = await fetch(url);
        componentCache[url] = await res.text();
      } catch (e) { console.error('Błąd ładowania:', url); }
    }
  }));

  slots.forEach(el => {
    if (componentCache[el.dataset.include]) {
      el.outerHTML = componentCache[el.dataset.include];
    }
  });
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

  const elements = document.querySelectorAll('h1, .h2, .lead, .svc, .hero .photo, .about-photo, .comparison-slider');
  elements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

/* ==== Comparison Slider (POPRAWIONY) ==== */
function initComparisonSliders() {
  const sliders = document.querySelectorAll('.comparison-slider');
  
  const updateSliders = () => {
    sliders.forEach(slider => {
      const width = slider.offsetWidth;
      const beforeImg = slider.querySelector('.img-wrapper-before img');
      if(beforeImg) {
        // Kluczowa zmiana: zdjęcie "przed" ma zawsze szerokość kontenera
        beforeImg.style.width = width + 'px';
      }
    });
  };

  sliders.forEach(slider => {
    const range = slider.querySelector('.slider-range');
    const wrapper = slider.querySelector('.img-wrapper-before');
    const handle = slider.querySelector('.handle');
    
    if(!range || !wrapper || !handle) return;
    
    range.addEventListener('input', (e) => {
      const val = e.target.value + '%';
      wrapper.style.width = val;
      handle.style.left = val;
    });
  });

  // Aktualizuj szerokość obrazu przy ładowaniu i zmianie rozmiaru okna
  window.addEventListener('resize', updateSliders);
  // Poczekaj chwilę aż style się załadują
  setTimeout(updateSliders, 100);
}

/* ==== Lazy background ==== */
function lazyBg(el, mode='hero'){
  const url = el?.dataset?.bg;
  if(!el || !url) return;
  const load = () => {
    if(mode==='hero'){
      el.style.backgroundImage =
        `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(246,240,232,.2) 70%), url('${url}')`;
    }else{
      el.style.background = `url('${url}') center/cover no-repeat`;
      const ph = el.querySelector('.ph'); if(ph) ph.remove();
    }
  };
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ load(); io.disconnect(); } });
  }, {rootMargin: '200px'});
  io.observe(el);
}

/* ==== Utils ==== */
async function fetchJSON(path){ 
  try {
    const r = await fetch(path); 
    return r.json(); 
  } catch(e) { 
    console.error("Błąd JSON:", path); 
    return []; 
  }
}

/* ==== OFERTA ==== */
function priceRange(variants){
  const nums = variants.map(v=>v.price).filter(n=>typeof n==='number' && n > 0);
  if(nums.length === 0) return "Indywidualnie";
  const min = Math.min(...nums), max = Math.max(...nums);
  return min===max ? `${min} zł` : `${min}–${max} zł`;
}

function buildOferta(services){
  const wrap = document.getElementById('ofertaGrid');
  if(!wrap) return;
  wrap.innerHTML = services.map(s=>{
    const range = priceRange(s.variants);
    return `
      <article class="svc">
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        <div class="tag">${range}</div>
      </article>`;
  }).join('');
  setTimeout(initScrollReveal, 100);
}

/* ==== CENNIK ACCORDION ==== */
function buildCennik(services){
  const container = document.getElementById('cennikTable');
  if(!container) return;

  const groups = {};
  services.forEach(s => {
    const cat = s.category || "Inne";
    if(!groups[cat]) groups[cat] = [];
    groups[cat].push(s);
  });

  const order = [
    "Pielęgnacja Twarzy", 
    "Terapie Laserowe (IPL)", 
    "Laserowe Usuwanie", 
    "Depilacja Laserowa", 
    "Modelowanie Sylwetki"
  ];
  const sortedKeys = Object.keys(groups).sort((a,b) => {
    const ixA = order.indexOf(a);
    const ixB = order.indexOf(b);
    return (ixA===-1?99:ixA) - (ixB===-1?99:ixB);
  });

  let html = '';

  sortedKeys.forEach(cat => {
    let allPrices = [];
    groups[cat].forEach(s => {
      s.variants.forEach(v => { if(v.price > 0) allPrices.push(v.price); });
    });
    const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
    const priceLabel = minPrice > 0 ? `Cena od: ${minPrice} zł` : 'Sprawdź ceny';

    let rows = '';
    groups[cat].forEach(s => {
      rows += `<tr><td class="acc-sub-head" colspan="2">${s.title}</td></tr>`;
      s.variants.forEach(v => {
        rows += `<tr><td>${v.name}</td><td class="p-right">${v.price > 0 ? v.price + ' zł' : 'Bezpłatnie'}</td></tr>`;
      });
    });

    html += `
      <div class="accordion-item">
        <button class="accordion-header" aria-expanded="false">
          <span class="acc-title">${cat}</span>
          <div class="acc-meta">
            <span>${priceLabel}</span>
            <span class="acc-icon">+</span>
          </div>
        </button>
        <div class="accordion-content">
          <table class="acc-table">
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  const headers = container.querySelectorAll('.accordion-header');
  headers.forEach(h => {
    h.addEventListener('click', () => {
      const item = h.parentElement;
      const isActive = item.classList.contains('active');
      if(!isActive) {
        item.classList.add('active');
        h.setAttribute('aria-expanded', 'true');
        h.querySelector('.acc-icon').textContent = '−';
      } else {
        item.classList.remove('active');
        h.setAttribute('aria-expanded', 'false');
        h.querySelector('.acc-icon').textContent = '+';
      }
    });
  });
}

/* ==== Booksy badge ==== */
function applyBooksyBadge(data){
  const b = document.getElementById('booksyBadge');
  if(!b || !data) return;
  if(data.booksyUrl) b.href = data.booksyUrl;
  const score = Number(data.rating).toFixed(1);
  b.querySelector('.b-score').textContent = score;
  b.querySelector('.b-count').textContent = data.reviewsCount;
}

/* ==== KARUZELA OPINII ==== */
function buildReviews(reviews){
  const track = document.getElementById('track');
  if(!track || !reviews.length) return;
  track.innerHTML = reviews.map(r=>`
    <div class="slide">
      <div class="stars">★★★★★</div>
      <b style="color:var(--gold-strong); font-size:14px; display:block; margin-top:6px">${r.service}</b>
      <p style="font-size:15px; font-style:italic; color:var(--muted); margin:10px 0">„${r.text}”</p>
      <div style="font-size:13px; font-weight:600">— ${r.author}</div>
    </div>
  `).join('');
  initCarouselInfinite();
}

function initCarouselInfinite(){
  const track = document.getElementById('track');
  const prev = document.querySelector('.nav-prev');
  const next = document.querySelector('.nav-next');
  const dotsWrap = document.getElementById('dots');
  if(!track) return;

  let slides = [...track.children];
  if(slides.length===0) return;
  
  const clonesBefore = slides.slice(-2).map(s=>s.cloneNode(true));
  const clonesAfter  = slides.slice(0,2).map(s=>s.cloneNode(true));
  clonesBefore.forEach(c=>track.insertBefore(c, track.firstChild));
  clonesAfter.forEach(c=>track.appendChild(c));

  slides = [...track.children];
  const REAL = slides.length - 4;
  let idx = 2;
  const GAP = 16;
  const cardWidth = () => (slides[0]?.getBoundingClientRect().width || 0) + GAP;

  track.style.transition = 'none';
  track.style.transform = `translateX(${-idx * cardWidth()}px)`;
  requestAnimationFrame(()=> track.style.transition = 'transform .45s ease');

  function render(){ track.style.transform = `translateX(${-idx * cardWidth()}px)`; updateDots(); }
  function updateDots(){
    if(!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for(let i=0;i<REAL;i++){
      const d = document.createElement('span');
      d.className = 'dot';
      if((idx-2+REAL)%REAL===i) d.setAttribute('aria-current','true');
      d.addEventListener('click', ()=>{ idx = i + 2; render(); restart(); });
      dotsWrap.appendChild(d);
    }
  }
  track.addEventListener('transitionend', ()=>{
    if(idx >= REAL + 2){ track.style.transition = 'none'; idx = 2; render(); void track.offsetWidth; track.style.transition = 'transform .45s ease'; }
    if(idx <= 1){ track.style.transition = 'none'; idx = REAL + 1; render(); void track.offsetWidth; track.style.transition = 'transform .45s ease'; }
  });
  function nextSlide(){ idx++; render(); }
  function prevSlide(){ idx--; render(); }

  next?.addEventListener('click', () => { nextSlide(); restart(); });
  prev?.addEventListener('click', () => { prevSlide(); restart(); });
  window.addEventListener('resize', ()=>render());

  let dragging=false, startX=0, startIdx=idx;
  const onDown = e=>{ dragging=true; startX=(e.clientX||e.touches?.[0].clientX); startIdx=idx; track.style.transition='none'; };
  const onMove = e=>{ if(!dragging)return; const dx=(e.clientX||e.touches?.[0].clientX)-startX; track.style.transform=`translateX(${-(startIdx*cardWidth())+dx}px)`; };
  const onUp = e=>{ if(!dragging)return; dragging=false; track.style.transition='transform .45s ease'; const dx=(e.clientX||e.changedTouches?.[0].clientX)-startX; if(Math.abs(dx)>60){dx<0?nextSlide():prevSlide()}else{render()} restart(); };
  
  track.addEventListener('pointerdown', onDown); track.addEventListener('pointermove', onMove); track.addEventListener('pointerup', onUp);
  track.addEventListener('touchstart', onDown,{passive:true}); track.addEventListener('touchmove', onMove,{passive:true}); track.addEventListener('touchend', onUp);

  let autoId;
  function start(){ autoId = setInterval(nextSlide, 3600); }
  function stop(){ clearInterval(autoId); }
  function restart(){ stop(); start(); }
  track.addEventListener('mouseenter', stop); track.addEventListener('mouseleave', start);
  updateDots(); start();
}

/* ==== LIGHTBOX ==== */
function initLightbox(){
  const lb = document.getElementById('lightbox');
  if(!lb) return;
  const imgEl = lb.querySelector('img');
  const thumbs = [...document.querySelectorAll('#social .feed img')];
  if(!thumbs.length) return;
  
  let cur = 0;
  const show = i => { cur=(i+thumbs.length)%thumbs.length; imgEl.src=thumbs[cur].src; };
  const open = i => { show(i); lb.classList.add('is-open'); document.body.classList.add('lb-open'); };
  const close = () => { lb.classList.remove('is-open'); document.body.classList.remove('lb-open'); };
  
  thumbs.forEach((t,i)=> t.addEventListener('click', ()=>open(i)));
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-next').addEventListener('click', (e)=>{e.stopPropagation();show(cur+1)});
  lb.querySelector('.lb-prev').addEventListener('click', (e)=>{e.stopPropagation();show(cur-1)});
  lb.addEventListener('click', e=>{if(e.target===lb)close()});
  document.addEventListener('keydown', e=>{ if(lb.classList.contains('is-open')){ if(e.key==='Escape')close(); if(e.key==='ArrowRight')show(cur+1); if(e.key==='ArrowLeft')show(cur-1); }});
}

/* ==== START ==== */
(async function(){
  await includeComponents();
  initScrollReveal();
  initComparisonSliders();
  lazyBg(document.getElementById('heroPhoto'), 'hero');
  lazyBg(document.getElementById('aboutPhoto'), 'cover');

  const [booksy, services, reviews] = await Promise.all([
    fetchJSON('assets/data/booksy.json'),
    fetchJSON('assets/data/services.json'),
    fetchJSON('assets/data/reviews.json')
  ]);

  applyBooksyBadge(booksy);
  if(services) buildOferta(services);
  if(reviews) buildReviews(reviews);
  if(services) buildCennik(services);
  
  initLightbox();
})();