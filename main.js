const productData = [
  {
    id: 1,
    name: "Headset AchouTáAqui Studio",
    description: "Cancelamento ativo de ruído e até 35h de bateria.",
    price: 499.9,
    badge: "Novo",
    category: "audio",
    image: "styles/image copy 2.png",
  },
  {
    id: 2,
    name: "Teclado Minimal Cloud",
    description: "Switch silencioso, Bluetooth multiponto e retroiluminação.",
    price: 679.0,
    badge: "Setup",
    category: "home-office",
    image: "styles/image copy.png",
  },
  {
    id: 3,
    name: "Notebook Lume 14”",
    description: "Processador de última geração e corpo ultrafino.",
    price: 4399.0,
    badge: "Mais vendido",
    category: "hardware",
    image: "styles/image.png",
  },
  {
    id: 4,
    name: "Mouse Ergo Flow",
    description: "Design ergonômico e 70 dias de autonomia.",
    price: 379.9,
    badge: "Ergo",
    category: "home-office",
    image: "styles/image copy.png",
  },
  {
    id: 5,
    name: "Smart Speaker Halo",
    description: "Som 360º com assistente inteligente embarcada.",
    price: 899.0,
    badge: "Smart",
    category: "casa",
    image: "styles/image.png",
  },
  {
    id: 6,
    name: "Monitor Edge 27” 4K",
    description: "Painel IPS calibrado e 99% sRGB.",
    price: 2499.9,
    badge: "Pro",
    category: "hardware",
    image: "styles/image copy 2.png",
  },
];

const productGrid = document.getElementById("productGrid");
const cartCountEl = document.getElementById("cartCount");
const cartButton = document.getElementById("cartButton");
const toast = document.getElementById("toast");
const filterButton = document.getElementById("filterButton");
const newsletterForm = document.getElementById("newsletterForm");
const newsletterFeedback = document.getElementById("newsletterFeedback");
const newsletterButton = document.getElementById("newsletterButton");
const newsletterEmail = document.getElementById("newsletterEmail");
const currentYearEl = document.getElementById("currentYear");

let cartCount = 0;
let toastTimeout = null;
let showHomeOfficeOnly = false;

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const renderProducts = (list) => {
  if (!productGrid) return;
  productGrid.innerHTML = "";

  list.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      <span class="badge">${product.badge}</span>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p class="price">${formatCurrency(product.price)}</p>
      <button class="primary-btn small" type="button" data-id="${product.id}">
        Adicionar
      </button>
    `;

    const button = card.querySelector("button");
    button.addEventListener("click", () => addToCart(product));
    productGrid.appendChild(card);
  });
};

const addToCart = (product) => {
  cartCount += 1;
  cartCountEl.textContent = cartCount;
  const message = `${product.name} adicionado ao carrinho`;
  showToast(message);
};

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
};

filterButton?.addEventListener("click", () => {
  showHomeOfficeOnly = !showHomeOfficeOnly;
  const filtered = showHomeOfficeOnly
    ? productData.filter((product) => product.category === "home-office")
    : productData;
  filterButton.textContent = showHomeOfficeOnly ? "Limpar filtro" : "Filtrar";
  renderProducts(filtered);
});

newsletterForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const email = formData.get("email");
  newsletterFeedback.textContent = `Valeu! Enviaremos novidades para ${email}.`;
  event.currentTarget.reset();
});

newsletterButton?.addEventListener("click", () => {
  newsletterEmail?.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => newsletterEmail?.focus(), 500);
});

cartButton?.addEventListener("click", () => {
  showToast("Você tem " + cartCount + " item(s) no carrinho.");
});

if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

renderProducts(productData);
