const API_BASE = "https://dummyjson.com/products";

const productsContainer = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsCount = document.getElementById("resultsCount");
const filterButtons = document.querySelectorAll(".filter-button");

let allProducts = [];
let activeFilter = "All";
let cartCount = 0;


function detectProductType(product) {
  if (product.displayCategory) return product.displayCategory;

  const text = `${product.title || ""} ${product.description || ""} ${(product.tags || []).join(" ")}`.toLowerCase();

  const hairWords = [
    "shampoo", "conditioner", "hair", "haircare", "hair care",
    "hair oil", "hair mask", "hair serum", "dry shampoo", "scalp"
  ];
  const skinWords = [
    "skincare", "skin care", "face wash", "cleanser", "moisturizer",
    "moisturiser", "serum", "sunscreen", "spf", "toner", "face cream",
    "eye cream", "acne", "hydrating", "body lotion", "exfoliat"
  ];
  const makeupWords = [
    "mascara", "lipstick", "eyeshadow", "makeup", "foundation",
    "blush", "concealer", "eyeliner", "lip gloss", "nail polish",
    "palette", "powder", "lip liner", "highlighter"
  ];

  if (hairWords.some(word => text.includes(word))) return "Hair Care";
  if (skinWords.some(word => text.includes(word))) return "Skin Care";
  if (makeupWords.some(word => text.includes(word))) return "Makeup";
  return null;
}

function formatPrice(price) {
  return `$${Number(price || 0).toFixed(2)}`;
}

function createProductCard(product) {
  const image = product.thumbnail || (product.images && product.images[0]) || "";
  return `
    <div class="col">
      <article class="card product-card p-3 h-100">
        <div class="product-image-wrap">
          <img class="product-image" src="${image}" alt="${product.title || "Beauty product"}" loading="lazy"
               onerror="this.src='https://placehold.co/300x300/f9e8f3/6b287d?text=Blush+Beauty'">
          <button class="favorite-button" type="button" aria-label="Add to favorites" onclick="toggleFavorite(this)">♡</button>
        </div>
        <div class="card-body px-0 pb-0 d-flex flex-column">
          <h3 class="product-title">${product.title}</h3>
          <p class="product-type">${detectProductType(product)}</p>
          <p class="product-brand">Brand : <strong>${product.brand || "Beauty"}</strong></p>
          <p class="rating">★ ${Number(product.rating || 0).toFixed(2)}</p>
          <div class="d-flex align-items-baseline flex-wrap gap-2">
            <span class="product-price">${formatPrice(product.price)}</span>
            <span class="discount">${Number(product.discountPercentage || 0).toFixed(2)}% OFF</span>
          </div>
          <p class="stock mt-1">Stock : ${product.stock ?? 0}</p>
          <button class="btn details-button w-100 mt-auto" type="button" onclick="showDetails(${product.id})">View Details</button>
        </div>
      </article>
    </div>`;
}

function displayProducts(products) {
  if (!products.length) {
    productsContainer.innerHTML = `<div class="col-12"><p class="text-center text-secondary py-5">No products found. Try another search.</p></div>`;
    resultsCount.textContent = "0 products";
    return;
  }
  productsContainer.innerHTML = products.map(createProductCard).join("");
  resultsCount.textContent = `${products.length} products`;
}

function applyFilters() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = allProducts.filter(product => {
    const categoryMatch = activeFilter === "All" || detectProductType(product) === activeFilter;
    const text = `${product.title || ""} ${product.brand || ""} ${product.description || ""}`.toLowerCase();
    return categoryMatch && text.includes(term);
  });
  displayProducts(filtered);
}

const demoProducts = [
  {
    id: 900001, title: "Everyday Nude Makeup Palette", brand: "Blush Beauty",
    description: "A versatile nude eyeshadow palette for everyday makeup looks.",
    price: 24.99, rating: 4.7, stock: 20, discountPercentage: 10,
    displayCategory: "Makeup", thumbnail: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600"
  },
  {
    id: 900002, title: "Soft Matte Lipstick", brand: "Blush Beauty",
    description: "A creamy matte lipstick with comfortable color payoff.",
    price: 13.50, rating: 4.6, stock: 32, discountPercentage: 8,
    displayCategory: "Makeup", thumbnail: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600"
  },
  {
    id: 900003, title: "Volumizing Mascara", brand: "Lash Edit",
    description: "Buildable mascara for fuller-looking lashes.",
    price: 11.99, rating: 4.5, stock: 27, discountPercentage: 5,
    displayCategory: "Makeup", thumbnail: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600"
  },
  {
    id: 910001, title: "Hydrating Face Moisturizer", brand: "Glow Lab",
    description: "A lightweight daily moisturizer that helps keep skin soft and hydrated.",
    price: 18.99, rating: 4.7, stock: 24, discountPercentage: 10,
    displayCategory: "Skin Care", thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600"
  },
  {
    id: 910002, title: "Vitamin C Face Serum", brand: "Pure Skin",
    description: "Brightening face serum for a fresh, radiant-looking complexion.",
    price: 22.50, rating: 4.8, stock: 18, discountPercentage: 15,
    displayCategory: "Skin Care", thumbnail: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600"
  },
  {
    id: 910003, title: "Gentle Daily Face Cleanser", brand: "Dew Beauty",
    description: "A gentle facial cleanser for everyday skin care.",
    price: 12.99, rating: 4.5, stock: 31, discountPercentage: 5,
    displayCategory: "Skin Care", thumbnail: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600"
  },
  {
    id: 910004, title: "Daily Sunscreen SPF 50", brand: "Sun Veil",
    description: "Lightweight broad-spectrum sunscreen for daily use.",
    price: 16.00, rating: 4.6, stock: 20, discountPercentage: 8,
    displayCategory: "Skin Care", thumbnail: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600"
  },
  {
    id: 920001, title: "Nourishing Hair Shampoo", brand: "Silk Roots",
    description: "A gentle shampoo that cleanses hair and leaves it feeling soft.",
    price: 14.99, rating: 4.6, stock: 26, discountPercentage: 10,
    displayCategory: "Hair Care", thumbnail: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600"
  },
  {
    id: 920002, title: "Repairing Hair Conditioner", brand: "Silk Roots",
    description: "A moisturizing conditioner for dry and damaged hair.",
    price: 15.99, rating: 4.5, stock: 22, discountPercentage: 7,
    displayCategory: "Hair Care", thumbnail: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600"
  },
  {
    id: 920003, title: "Argan Hair Oil", brand: "Nature Shine",
    description: "Lightweight hair oil that adds shine and helps tame frizz.",
    price: 19.50, rating: 4.8, stock: 15, discountPercentage: 12,
    displayCategory: "Hair Care", thumbnail: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600"
  },
  {
    id: 920004, title: "Deep Repair Hair Mask", brand: "Hair Ritual",
    description: "A rich weekly hair mask for soft, manageable hair.",
    price: 17.25, rating: 4.7, stock: 13, discountPercentage: 9,
    displayCategory: "Hair Care", thumbnail: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600"
  }
];

async function fetchProducts(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API request failed: ${url}`);
  const data = await response.json();
  return data.products || [];
}

async function getProducts() {
  productsContainer.innerHTML = `<div class="col-12"><p class="text-center text-secondary py-5">Loading beauty products...</p></div>`;

  try {
    
    const queries = ["shampoo", "conditioner", "hair oil", "skin serum", "moisturizer", "cleanser", "sunscreen"];
    const requests = [
      fetchProducts(`${API_BASE}/category/beauty?limit=0`),
      ...queries.map(query => fetchProducts(`${API_BASE}/search?q=${encodeURIComponent(query)}&limit=0`))
    ];

    const results = await Promise.allSettled(requests);
    const productsById = new Map();

    results.forEach((result, index) => {
      if (result.status !== "fulfilled") return;
      result.value.forEach(product => {
        let type = detectProductType(product);

       
        if (index === 0 && !type) type = "Makeup";

        if (type) productsById.set(product.id, { ...product, displayCategory: type });
      });
    });

    allProducts = Array.from(productsById.values());

    
    ["Makeup", "Skin Care", "Hair Care"].forEach(category => {
      const hasCategory = allProducts.some(product => detectProductType(product) === category);
      if (!hasCategory) {
        allProducts.push(...demoProducts.filter(product => product.displayCategory === category));
      }
    });

    if (!allProducts.length) throw new Error("No products were returned");
    applyFilters();
  } catch (error) {
    console.error(error);
    
    allProducts = [...demoProducts];
    displayProducts(allProducts);
    resultsCount.textContent = `${allProducts.length} demo products (API unavailable)`;
  }
}

function toggleFavorite(button) {
  button.classList.toggle("liked");
  button.textContent = button.classList.contains("liked") ? "♥" : "♡";
}

function showDetails(id) {
  const product = allProducts.find(item => item.id === id);
  if (!product) return;

  document.getElementById("modalImage").src = product.thumbnail || "";
  document.getElementById("modalImage").alt = product.title;
  document.getElementById("modalCategory").textContent = detectProductType(product);
  document.getElementById("modalTitle").textContent = product.title;
  document.getElementById("modalBrand").textContent = `Brand: ${product.brand || "Beauty"}`;
  document.getElementById("modalRating").textContent = `★ ${Number(product.rating || 0).toFixed(2)} rating`;
  document.getElementById("modalDescription").textContent = product.description || "No description available.";
  document.getElementById("modalPrice").textContent = formatPrice(product.price);
  document.getElementById("modalStock").textContent = `Stock: ${product.stock ?? 0}`;

  document.getElementById("addToCartButton").onclick = () => {
    cartCount++;
    document.getElementById("cartCount").textContent = cartCount;
    bootstrap.Modal.getOrCreateInstance(document.getElementById("detailsModal")).hide();
  };
  bootstrap.Modal.getOrCreateInstance(document.getElementById("detailsModal")).show();
}

searchButton.addEventListener("click", applyFilters);
searchInput.addEventListener("input", applyFilters);

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    applyFilters();
  });
});

getProducts();
