const products = [
  { id: "aura-440", name: "Aura 440", kind: "All-in-one inkjet", category: "All-in-one", price: 189, rating: 4.8, reviews: 126, tag: "Best seller", image: "inkjet-printer.png", accent: "#d9efea" },
  { id: "mono-27", name: "Mono 27", kind: "Compact laser", category: "Laser", price: 249, rating: 4.7, reviews: 84, tag: "Quiet pick", image: "laser-printer.png", accent: "#f5e2d0" },
  { id: "workroom-pro", name: "Workroom Pro", kind: "Color office printer", category: "Office", price: 429, rating: 4.9, reviews: 52, tag: "New", image: "office-printer.png", accent: "#d5e3e1" },
  { id: "folio-mini", name: "Folio Mini", kind: "Photo inkjet", category: "Inkjet", price: 139, rating: 4.6, reviews: 211, tag: "Good value", image: "hero-printer.png", accent: "#f4ded4" }
];

const categories = [
  { name: "All-in-one", detail: "One tidy home base", color: "#d9efea", icon: "printer", image: "inkjet-printer.png" },
  { name: "Inkjet", detail: "Colour that feels alive", color: "#f6e0d2", icon: "sparkles", image: "hero-printer.png" },
  { name: "Laser", detail: "Fast, crisp, focused", color: "#e5e4dc", icon: "bar", image: "laser-printer.png" },
  { name: "Office", detail: "Ready for the rush", color: "#d7e2ee", icon: "package", image: "office-printer.png" }
];

const icons = {
  printer: '<rect x="5" y="9" width="14" height="8" rx="2"></rect><path d="M7 9V4h10v5M8 17v3h8v-3M8 13h1"></path>',
  search: '<circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path>',
  heart: '<path d="M20.8 8.7c0 5.1-8.8 10.5-8.8 10.5S3.2 13.8 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"></path>',
  bag: '<path d="M5 8h14l-1 12H6L5 8Z"></path><path d="M9 8a3 3 0 0 1 6 0"></path>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"></path>',
  x: '<path d="m6 6 12 12M18 6 6 18"></path>',
  arrow: '<path d="M4 12h15M13 6l6 6-6 6"></path>',
  chevron: '<path d="m9 6 6 6-6 6"></path>',
  shield: '<path d="M12 3 19 6v5c0 4.5-3 8.1-7 10-4-1.9-7-5.5-7-10V6l7-3Z"></path><path d="m9 12 2 2 4-4"></path>',
  headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"></path><path d="M4 14h3v5H5a1 1 0 0 1-1-1v-4ZM20 14h-3v5h2a1 1 0 0 0 1-1v-4Z"></path>',
  sparkles: '<path d="m12 3 1.3 4.7L18 9l-4.7 1.3L12 15l-1.3-4.7L6 9l4.7-1.3L12 3ZM19 15l.6 2.4L22 18l-2.4.6L19 21l-.6-2.4L16 18l2.4-.6L19 15ZM5 15l.6 1.4L7 17l-1.4.6L5 19l-.6-1.4L3 17l1.4-.6L5 15Z"></path>',
  bar: '<path d="M5 20V10M12 20V4M19 20v-7"></path>',
  package: '<path d="m4 7 8-4 8 4-8 4-8-4Z"></path><path d="M4 7v10l8 4 8-4V7M12 11v10"></path>',
  badge: '<path d="m12 3 2 2 2.8-.2.8 2.7 2.4 1.4-1.4 2.4.8 2.7-2.7.8-1.4 2.4-2.4-1.4-2.4 1.4-1.4-2.4-2.7-.8.8-2.7L3.8 9l2.4-1.4.8-2.7L9.8 5 12 3Z"></path><path d="m9 12 2 2 4-4"></path>',
  truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"></path><circle cx="7" cy="18" r="2"></circle><circle cx="18" cy="18" r="2"></circle>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"></path>',
  plus: '<path d="M12 5v14M5 12h14"></path>'
};

const state = { activeCategory: "All", search: "", cart: 0, wishlist: new Set(), toastTimer: null };
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function icon(name, size = 18, filled = false) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${filled ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ""}</svg>`;
}

function hydrateIcons() {
  $$("[data-icon]").forEach((node) => {
    const name = node.dataset.icon;
    node.innerHTML = icon(name, name === "star" ? 12 : 18);
  });
}

function money(value) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value); }

function showToast(message) {
  const toast = $("#toast");
  $("#toast-message").textContent = message;
  toast.hidden = false;
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => { toast.hidden = true; }, 2800);
}

function renderCategories() {
  $("#category-grid").innerHTML = categories.map((category) => `
    <button class="category-card" type="button" data-category="${category.name}" style="background:${category.color}">
      <span class="category-icon">${icon(category.icon, 17)}</span>
      <span class="category-content"><strong>${category.name}</strong><span>${category.detail}</span></span>
      <img class="category-art" src="./${category.image}" alt="" />
      <span class="category-arrow">${icon("arrow", 15)}</span>
    </button>
  `).join("");
  $$(".category-card").forEach((button) => button.addEventListener("click", () => {
    state.activeCategory = button.dataset.category;
    renderShop();
    $("#shop").scrollIntoView({ behavior: "smooth" });
  }));
}

function renderFilters() {
  const filters = ["All", "All-in-one", "Inkjet", "Laser", "Office"];
  $("#filter-tabs").innerHTML = filters.map((filter) => `
    <button class="filter-tab ${filter === state.activeCategory ? "active" : ""}" role="tab" aria-selected="${filter === state.activeCategory}" type="button" data-filter="${filter}">${filter}</button>
  `).join("");
  $$(".filter-tab").forEach((button) => button.addEventListener("click", () => {
    state.activeCategory = button.dataset.filter;
    renderShop();
  }));
}

function renderProducts() {
  const term = state.search.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const categoryMatch = state.activeCategory === "All" || product.category === state.activeCategory;
    const searchMatch = !term || `${product.name} ${product.kind} ${product.category}`.toLowerCase().includes(term);
    return categoryMatch && searchMatch;
  });
  $("#product-grid").innerHTML = filtered.map((product) => `
    <article class="product-card">
      <div class="product-art" style="background:${product.accent}">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
        <button class="wishlist-product ${state.wishlist.has(product.id) ? "is-saved" : ""}" type="button" aria-label="Save ${product.name}" data-wishlist="${product.id}">
          ${icon("heart", 16, state.wishlist.has(product.id))}
        </button>
        <img class="product-image" src="./${product.image}" alt="${product.name} printer" />
      </div>
      <div class="product-content">
        <div class="product-rating">${icon("star", 12, true)}<small>${product.rating} (${product.reviews})</small></div>
        <h3>${product.name}</h3>
        <p class="product-kind">${product.kind}</p>
        <div class="product-footer"><span class="product-price">${money(product.price)}</span><button class="add-button" type="button" aria-label="Add ${product.name} to bag" data-add="${product.id}">${icon("plus", 17)}</button></div>
      </div>
    </article>
  `).join("");
  $("#empty-state").hidden = filtered.length !== 0;
  $$(".wishlist-product").forEach((button) => button.addEventListener("click", () => toggleWishlist(button.dataset.wishlist)));
  $$(".add-button").forEach((button) => button.addEventListener("click", () => addToCart(button.dataset.add)));
}

function renderShop() { renderFilters(); renderProducts(); }

function toggleWishlist(id) {
  const product = products.find((item) => item.id === id);
  if (state.wishlist.has(id)) {
    state.wishlist.delete(id);
    showToast(`${product.name} removed from your wishlist`);
  } else {
    state.wishlist.add(id);
    showToast(`${product.name} saved to your wishlist`);
  }
  $(".wishlist-count").textContent = state.wishlist.size;
  $(".wishlist-count").hidden = state.wishlist.size === 0;
  renderProducts();
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  state.cart += 1;
  $(".cart-count").textContent = state.cart;
  $(".cart-count").hidden = false;
  showToast(`${product.name} added to your bag`);
}

function bindHeader() {
  $("#search-button").addEventListener("click", () => {
    const bar = $("#search-bar");
    bar.hidden = !bar.hidden;
    if (!bar.hidden) $("#search-input").focus();
  });
  $("#search-input").addEventListener("input", (event) => {
    state.search = event.target.value;
    $("#clear-search").hidden = !state.search;
    renderShop();
  });
  $("#clear-search").addEventListener("click", () => {
    $("#search-input").value = "";
    state.search = "";
    $("#clear-search").hidden = true;
    renderShop();
  });
  $("#menu-button").addEventListener("click", () => {
    const nav = $("#mobile-nav");
    nav.hidden = !nav.hidden;
    $("#menu-button").setAttribute("aria-expanded", String(!nav.hidden));
    $("#menu-button").innerHTML = icon(nav.hidden ? "menu" : "x", 19);
  });
  $$(".mobile-nav a").forEach((link) => link.addEventListener("click", () => {
    $("#mobile-nav").hidden = true;
    $("#menu-button").setAttribute("aria-expanded", "false");
    $("#menu-button").innerHTML = icon("menu", 19);
  }));
  $("#wishlist-button").addEventListener("click", () => showToast(state.wishlist.size ? `${state.wishlist.size} item${state.wishlist.size > 1 ? "s" : ""} in your wishlist` : "Your wishlist is waiting for a favourite"));
  $("#cart-button").addEventListener("click", () => showToast(state.cart ? `${state.cart} item${state.cart > 1 ? "s" : ""} in your bag` : "Your bag is ready when you are"));
}

function bindActions() {
  $("#reset-filters").addEventListener("click", () => {
    state.search = "";
    state.activeCategory = "All";
    $("#search-input").value = "";
    $("#clear-search").hidden = true;
    renderShop();
  });
  $("#view-all").addEventListener("click", () => showToast("You are already seeing our complete current edit"));
  $("#guide-button").addEventListener("click", () => showToast("The buying guide is coming to your inbox soon"));
  $("#recommendation-button").addEventListener("click", () => showToast("A Prinmart guide is ready to help"));
  $("#subscribe-button").addEventListener("click", () => showToast("You are on the list"));
  $$("[data-message]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.message)));
}

function setupRevealAnimations() {
  const targets = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }), { threshold: .12 });
  targets.forEach((target) => observer.observe(target));
}

document.addEventListener("DOMContentLoaded", () => {
  hydrateIcons();
  renderCategories();
  renderShop();
  bindHeader();
  bindActions();
  setupRevealAnimations();
});