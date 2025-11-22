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

const elements = {
  productGrid: document.getElementById("productGrid"),
  cartCount: document.getElementById("cartCount"),
  cartButton: document.getElementById("cartButton"),
  toast: document.getElementById("toast"),
  filterButton: document.getElementById("filterButton"),
  sortButton: document.getElementById("sortButton"),
  newsletterForm: document.getElementById("newsletterForm"),
  newsletterFeedback: document.getElementById("newsletterFeedback"),
  newsletterButton: document.getElementById("newsletterButton"),
  newsletterEmail: document.getElementById("newsletterEmail"),
  currentYear: document.getElementById("currentYear"),
};

let cartCount = 0;
let toastTimeout = null;
let showHomeOfficeOnly = false;
let sortAscending = true;

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const getVisibleProducts = () => {
  const list = showHomeOfficeOnly
    ? productData.filter((product) => product.category === "home-office")
    : [...productData];

  return list.sort((a, b) => (sortAscending ? a.price - b.price : b.price - a.price));
};

const renderProducts = (list) => {
  if (!elements.productGrid) return;
  elements.productGrid.innerHTML = "";

  const fragment = document.createDocumentFragment();

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
    fragment.appendChild(card);
  });

  elements.productGrid.appendChild(fragment);
};

const addToCart = (product) => {
  cartCount += 1;
  if (elements.cartCount) {
    elements.cartCount.textContent = cartCount;
  }
  const message = `${product.name} adicionado ao carrinho`;
  showToast(message);
};

const showToast = (message) => {
  if (!elements.toast) return;
  elements.toast.textContent = message;
  elements.toast.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2500);
};

const updateSortButtonText = () => {
  if (!elements.sortButton) return;
  elements.sortButton.textContent = sortAscending ? "Menor preço" : "Maior preço";
};

const applyProductView = () => {
  renderProducts(getVisibleProducts());
};

elements.filterButton?.addEventListener("click", () => {
  showHomeOfficeOnly = !showHomeOfficeOnly;
  elements.filterButton.textContent = showHomeOfficeOnly ? "Limpar filtro" : "Filtrar";
  applyProductView();
});

elements.sortButton?.addEventListener("click", () => {
  sortAscending = !sortAscending;
  updateSortButtonText();
  applyProductView();
});

elements.newsletterForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const email = formData.get("email");
  if (elements.newsletterFeedback) {
    elements.newsletterFeedback.textContent = `Valeu! Enviaremos novidades para ${email}.`;
  }
  event.currentTarget.reset();
});

elements.newsletterButton?.addEventListener("click", () => {
  elements.newsletterEmail?.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => elements.newsletterEmail?.focus(), 500);
});

elements.cartButton?.addEventListener("click", () => {
  showToast("Você tem " + cartCount + " item(s) no carrinho.");
});

if (elements.currentYear) {
  elements.currentYear.textContent = new Date().getFullYear();
}

updateSortButtonText();
renderProducts(getVisibleProducts());

const authElements = {
  modal: document.getElementById("authModal"),
  loginBtn: document.getElementById("loginBtn"),
  closeBtn: document.getElementById("closeModal"),
  loginFormWrapper: document.getElementById("loginFormWrapper"),
  registerFormWrapper: document.getElementById("registerFormWrapper"),
  showRegisterBtn: document.getElementById("showRegister"),
  showLoginBtn: document.getElementById("showLogin"),
};

authElements.loginBtn?.addEventListener("click", () => {
  authElements.modal.classList.add("open");
});

const closeModal = () => {
  authElements.modal.classList.remove("open");
};

authElements.closeBtn?.addEventListener("click", closeModal);

authElements.modal?.addEventListener("click", (e) => {
  if (e.target === authElements.modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && authElements.modal.classList.contains("open")) {
    closeModal();
  }
});