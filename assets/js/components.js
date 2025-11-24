const ComponentTemplates = {
  header: `
  <header class="subhead">
    <div class="container subhead-inner">
      <a class="brand" href="index.html">
        <img class="logo" src="assets/img/logo-removebg-preview (1).png" alt="Zabiegi Katarzyna" width="36" height="36" loading="lazy" decoding="async">
        <span class="dot">●</span> <b>Zabiegi Katarzyna</b>
      </a>
      <nav class="nav" aria-label="Główna nawigacja">
        <a class="pill" href="index.html">Strona główna</a>
        <a class="pill" href="index.html#oferta">Oferta</a>
        <a class="pill" href="cennik.html">Cennik</a>
        <a class="pill" href="index.html#opinie">Opinie</a>
        <a class="pill" href="index.html#omnie">O mnie</a>
        <a class="pill" href="gdzie-mnie-znajdziesz.html">Kontakt</a>
      </nav>
    </div>
  </header>`,

  footer: `
  <footer class="section foot">
    <div class="container foot-inner">
      <div class="muted">© Zabiegi Katarzyna • Szczecin • tel. <a href="tel:+48601827531">+48 601 827 531</a></div>
      <div class="foot-links">
        <a class="pill" href="mailto:zabiegi.katarzyna@op.pl">Napisz e-mail</a>
        <a class="pill" href="regulamin.html">Regulamin</a>
        <a class="pill" href="https://booksy.com/pl-pl/165360_mik-beauty_salon-kosmetyczny_18078_szczecin#ba_s=sr_1" target="_blank" rel="noopener">Zarezerwuj online</a>
      </div>
    </div>
  </footer>`
};

// Funkcja montująca komponenty przy ładowaniu strony
document.addEventListener("DOMContentLoaded", () => {
  const headerSlot = document.getElementById("site-header");
  const footerSlot = document.getElementById("site-footer");
  if (headerSlot) headerSlot.innerHTML = ComponentTemplates.header;
  if (footerSlot) footerSlot.innerHTML = ComponentTemplates.footer;
});