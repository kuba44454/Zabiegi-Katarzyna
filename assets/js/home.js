/* ==== Utils ==== */
function priceRange(variants){
  const nums = variants.map(v=>v.price).filter(n=>typeof n==='number' && n > 0);
  if(nums.length === 0) return "Indywidualnie";
  const min = Math.min(...nums), max = Math.max(...nums);
  return min===max ? `${min} zł` : `${min}–${max} zł`;
}

/* ==== Comparison Slider ==== */
function initComparisonSliders() {
  const sliders = document.querySelectorAll('.comparison-slider');
  const updateSliders = () => {
    sliders.forEach(slider => {
      const width = slider.offsetWidth;
      const beforeImg = slider.querySelector('.img-wrapper-before img');
      if(beforeImg) beforeImg.style.width = width + 'px';
    });
  };
  sliders.forEach(slider => {
    const range = slider.querySelector('.slider-range');
    const wrapper = slider.querySelector('.img-wrapper-before');
    const handle = slider.querySelector('.handle');
    if(!range || !wrapper || !handle) return;
    range.addEventListener('input', (e) => {
      const val = e.target.value + '%';
      wrapper.style.width = val; handle.style.left = val;
    });
  });
  window.addEventListener('resize', updateSliders);
  setTimeout(updateSliders, 100);
}

/* ==== Oferta Grid (Home) ==== */
function buildOferta(services){
  const wrap = document.getElementById('ofertaGrid');
  if(!wrap) return;
  wrap.innerHTML = services.map(s=>{
    return `
      <article class="svc">
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        <div class="tag">${priceRange(s.variants)}</div>
      </article>`;
  }).join('');
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
    </div>`).join('');
  initCarouselInfinite();
}

function initCarouselInfinite(){
  const track = document.getElementById('track');
  const next = document.querySelector('.nav-next');
  const prev = document.querySelector('.nav-prev');
  if(!track) return;
  // (Uproszczona logika karuzeli z Twojego kodu)
  let slides = [...track.children];
  if(slides.length===0) return;
  const clonesBefore = slides.slice(-2).map(s=>s.cloneNode(true));
  const clonesAfter  = slides.slice(0,2).map(s=>s.cloneNode(true));
  clonesBefore.forEach(c=>track.insertBefore(c, track.firstChild));
  clonesAfter.forEach(c=>track.appendChild(c));
  let idx = 2;
  const cardWidth = () => (slides[0]?.getBoundingClientRect().width || 0) + 16;
  function render(){ track.style.transform = `translateX(${-idx * cardWidth()}px)`; }
  function nextSlide(){ idx++; render(); }
  function prevSlide(){ idx--; render(); }
  track.addEventListener('transitionend', ()=>{
    if(idx >= slides.length + 2){ track.style.transition = 'none'; idx = 2; render(); void track.offsetWidth; track.style.transition = 'transform .45s ease'; }
    if(idx <= 1){ track.style.transition = 'none'; idx = slides.length + 1; render(); void track.offsetWidth; track.style.transition = 'transform .45s ease'; }
  });
  next?.addEventListener('click', nextSlide);
  prev?.addEventListener('click', prevSlide);
  setInterval(nextSlide, 3600);
  render();
}

/* ==== Init Home ==== */
(async function(){
  window.lazyBg(document.getElementById('heroPhoto'), 'hero');
  window.lazyBg(document.getElementById('aboutPhoto'), 'cover');
  initComparisonSliders();
  
  const [booksy, services, reviews] = await Promise.all([
    window.fetchJSON('assets/data/booksy.json'),
    window.fetchJSON('assets/data/services.json'),
    window.fetchJSON('assets/data/reviews.json')
  ]);
  
  applyBooksyBadge(booksy);
  if(services) buildOferta(services);
  if(reviews) buildReviews(reviews);
})();