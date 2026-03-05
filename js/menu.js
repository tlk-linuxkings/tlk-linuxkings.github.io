// js/menu.js (bezpieczna wersja)
window.SITE_MENU_LABELS = {
  "index.html": "Linux kings",
  "jerseys.html": "Sklep",
  "matches.html": "Chcesz zagrać?",
  "team.html": "O Nas",
  "contact.html": "Kontakt",
  "konto.html": "Konto",
  "koszyk.html": "Koszyk",
  "about.html": "O nas",
  "product.html": "Szczegóły"
};

function applyMenuLabels() {
  // jeśli chcesz ograniczyć do konkretnego menu, zmień selektor np. 'nav.site-menu a'
  document.querySelectorAll('a[href]').forEach(a=>{
    // pomiń linky które zawierają obrazki / ikony (zachowaj je)
    if (a.querySelector('img, svg')) return;

    let href = a.getAttribute('href');
    if(!href) return;
    href = href.split('/').pop();

    // jeśli używasz data-menu-key - pozwól na nadpisanie nazwy przez ten atrybut
    const key = a.getAttribute('data-menu-key') || href;
    const label = window.SITE_MENU_LABELS[key];
    if(!label) return;

    // zamień tylko text-node (nie usuwaj elementów potomnych)
    let replaced = false;
    for (let node of Array.from(a.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        node.nodeValue = label;
        replaced = true;
        break;
      }
    }
    if (!replaced) {
      // brak węzła tekstowego — wstaw go na końcu (bez usuwania elementów dzieci)
      a.appendChild(document.createTextNode(label));
    }
  });
}
document.addEventListener('DOMContentLoaded', applyMenuLabels);