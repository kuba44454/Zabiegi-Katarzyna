function getCategoryIcon(cat) {
  // Proste ikony SVG pasujące do stylu Glamour (wstaw tu swoje ikony)
  const icons = {
    "Pielęgnacja Twarzy": `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="p-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>`,
    "Terapie Laserowe (IPL)": `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="p-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>`,
    "Laserowe Usuwanie": `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="p-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>`,
    "Depilacja Laserowa": `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="p-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zM5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>`,
    "Modelowanie Sylwetki": `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="p-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>`
  };
  return icons[cat] || `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="p-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>`;
}

function buildCennik(services){
  const container = document.getElementById('pricingCatalog');
  if(!container) return;

  const groups = {};
  services.forEach(s => {
    const cat = s.category || "Inne";
    if(!groups[cat]) groups[cat] = [];
    groups[cat].push(s);
  });

  const order = ["Pielęgnacja Twarzy", "Terapie Laserowe (IPL)", "Laserowe Usuwanie", "Depilacja Laserowa", "Modelowanie Sylwetki"];
  const sortedKeys = Object.keys(groups).sort((a,b) => order.indexOf(a) - order.indexOf(b));

  let html = '';
  sortedKeys.forEach(cat => {
    let rows = '';
    groups[cat].forEach(s => {
      s.variants.forEach(v => {
        rows += `
          <div class="p-row">
            <div class="p-name">${v.name} ${s.variants.length>1 && s.title!==v.name ? `<small>(${s.title})</small>` : ''}</div>
            <div class="p-price">${v.price > 0 ? v.price + ' zł' : 'Bezpłatnie'}</div>
          </div>`;
      });
    });

    const count = groups[cat].length;
    const noun = count === 1 ? 'zabieg' : (count > 1 && count < 5 ? 'zabiegi' : 'zabiegów');

    html += `
      <div class="p-card">
        <div class="p-header">
          ${getCategoryIcon(cat)}
          <h3 class="p-title">${cat}</h3>
          <div class="p-subtitle">${count} ${noun}</div>
          <div class="p-toggle-icon">↓</div>
        </div>
        <div class="p-content"><div>${rows}</div></div>
      </div>`;
  });

  container.innerHTML = html;

  // Akordeon logika
  container.querySelectorAll('.p-header').forEach(h => {
    h.addEventListener('click', () => {
      const card = h.parentElement;
      const content = card.querySelector('.p-content');
      const isActive = card.classList.contains('active');
      
      if(!isActive){
        card.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        card.classList.remove('active');
        content.style.maxHeight = null;
      }
    });
  });
}

(async function(){
  const services = await window.fetchJSON('assets/data/services.json');
  if(services) buildCennik(services);
})();