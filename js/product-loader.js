
(async function(){
  async function tryFetch(path){
    try {
      const r = await fetch(path, {cache: "no-store"});
      if(!r.ok) throw new Error('not ok ' + r.status);
      const data = await r.json();
      return data;
    } catch(e){
      return null;
    }
  }

  let products = await tryFetch('./products.json');
  if(!products) {
    
    try {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      if(pathParts.length > 0) {
        const repo = pathParts[0];
        products = await tryFetch(`/${repo}/products.json`);
      }
    } catch(e){}
  }

  if(products) {
    window.PRODUCTS = products;
    console.log('Products loaded from products.json, count=', products.length);
  } else {
    if(!window.PRODUCTS) window.PRODUCTS = [];
    console.log('No products.json found — using built-in window.PRODUCTS (fallback).');
  }

  
  if(typeof window.renderProducts === 'function') {
    try { window.renderProducts(window.PRODUCTS); } catch(e){ console.error(e); }
  }
})();