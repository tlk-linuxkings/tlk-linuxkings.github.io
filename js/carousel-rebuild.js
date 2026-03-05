// js/carousel-rebuild.js
// Prosty, niezawodny slider oparty na scroll-snap + dynamicznym dopasowaniu szerokości kart.
// Wymaga: window.SLIDER_ITEMS = [ { id, image, title, price }, ... ]

(function(){
  const track = document.getElementById('carouselTrack');
  if(!track) { console.warn('Carousel rebuild: brak elementu #carouselTrack'); return; }
  const items = (window.SLIDER_ITEMS && window.SLIDER_ITEMS.slice()) || [];
  if(!items.length) {
    console.warn('Carousel rebuild: brak window.SLIDER_ITEMS, brak produktów do wyrenderowania.');
    return;
  }

  // helper: create card element
  function createCard(p){
    const a = document.createElement('a');
    a.className = 'card';
    a.href = `product.html?id=${encodeURIComponent(p.id)}`; // link do produktu
    a.setAttribute('role', 'listitem');

    const img = document.createElement('img');
    img.src = p.image || '';
    img.alt = p.title || '';
    img.loading = 'lazy';
    // jeśli masz wersje obrazków w kilku rozmiarach - dodaj tu srcset/sizes

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = p.title || '';

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = (p.price ? `${p.price} PLN` : '');

    a.appendChild(img);
    a.appendChild(title);
    a.appendChild(price);

    return a;
  }

  // wypełnij track (czysty)
  track.innerHTML = '';
  items.forEach(i => track.appendChild(createCard(i)));

  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  // dynamiczne dopasowanie liczby widocznych kart:
  // breakpointy: <480 -> 1, <900 ->2, <1300 -> 4, >=1300 -> try fill (max 8)
  function computeVisible(containerWidth){
    if(containerWidth < 480) return 1;
    if(containerWidth < 900) return 2;
    if(containerWidth < 1300) return 4;
    const gapPx = parseFloat(getComputedStyle(track).gap || '16') || 16;
    const minCard = 180;
    const maxPossible = Math.max(1, Math.floor((containerWidth + gapPx) / (minCard + gapPx)));
    return Math.min(8, Math.max(4, maxPossible));
  }

  function layoutCards(){
    const containerWidth = track.clientWidth;
    const gapPx = parseFloat(getComputedStyle(track).gap || '16') || 16;
    const visible = computeVisible(containerWidth);
    // szerokość karty: (containerWidth - gap*(visible-1))/visible
    const cardW = Math.floor((containerWidth - gapPx * (visible - 1)) / visible);
    // ustaw szerokości
    Array.from(track.children).forEach(child=>{
      child.style.flex = `0 0 ${cardW}px`;
    });
    // optional: ensure track starts at left
    // track.scrollLeft = 0;
    return { cardW, visible, gapPx, containerWidth };
  }

  // initial layout and on resize
  let layout = layoutCards();
  window.addEventListener('resize', debounce(()=> { layout = layoutCards(); }, 120));

  // scroll helpers
  function scrollByPages(direction=1){
    // scroll by visible * cardW (one page)
    const step = (layout.cardW + layout.gapPx) * layout.visible;
    track.scrollBy({ left: step * direction, behavior: 'smooth' });
  }

  if(prevBtn) prevBtn.addEventListener('click', ()=> scrollByPages(-1));
  if(nextBtn) nextBtn.addEventListener('click', ()=> scrollByPages(1));

  // keyboard navigation
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight') { scrollByPages(1); }
    if(e.key === 'ArrowLeft')  { scrollByPages(-1); }
  });

  // optional autoplay (scroll to next every n sec)
  let autoplay = true;
  let autoplayInterval = 3500;
  let autoplayTimer = null;
  function startAuto(){ if(!autoplay) return; stopAuto(); autoplayTimer = setInterval(()=> scrollByPages(1), autoplayInterval); }
  function stopAuto(){ if(autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } }
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);
  startAuto();

  // simple debounce
  function debounce(fn, t){ let to; return (...a)=>{ clearTimeout(to); to = setTimeout(()=>fn(...a), t); }; }

  // expose method to re-render if you change window.SLIDER_ITEMS dynamically
  window.carouselRebuild = { layoutCards, scrollToStart: ()=> track.scrollLeft = 0 };
})();