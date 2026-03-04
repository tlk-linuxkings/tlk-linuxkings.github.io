// js/menu.js
window.SITE_MENU_LABELS = {
  "index.html": "Linux kings",
  "jerseys.html": "Sklep",
  "matches.html": "Chcesz zagrać?",
  "team.html": "O Nas",
  "contact.html": "Kontakt", 
  "konto.html": "Konto",
  "koszyk.html": "Koszyk",
  //"ustawienia.html": "Ustawienia",
  "about.html": "O nas",
  "product.html": "Szczegóły"
};

function applyMenuLabels() {
  document.querySelectorAll('a[href]').forEach(a=>{
    let href = a.getAttribute('href');
    if(!href) return;
    href = href.split('/').pop();
    if(window.SITE_MENU_LABELS[href]) a.textContent = window.SITE_MENU_LABELS[href];
    // opcjonalnie: obsługa data-menu-key
    const key = a.getAttribute('data-menu-key');
    if(key && window.SITE_MENU_LABELS[key]) a.textContent = window.SITE_MENU_LABELS[key];
  });
}
document.addEventListener('DOMContentLoaded', applyMenuLabels);