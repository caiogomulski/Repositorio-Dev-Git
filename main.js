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

let cart = [];
let toastTimeout = null;
let showHomeOfficeOnly = false;
let sortAscending = true;

// Carregar carrinho do localStorage
const loadCart = () => {
  try {
    const savedCart = localStorage.getItem('devstore_cart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCartUI();
    }
  } catch (error) {
    console.error('Erro ao carregar carrinho:', error);
    cart = [];
  }
};

// Salvar carrinho no localStorage
const saveCart = () => {
  try {
    localStorage.setItem('devstore_cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Erro ao salvar carrinho:', error);
  }
};

// Calcular total de itens no carrinho
const getCartCount = () => {
  return cart.reduce((total, item) => total + item.quantity, 0);
};

// Calcular total do carrinho
const getCartTotal = () => {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

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
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  
  saveCart();
  updateCartUI();
  showToast(`${product.name} adicionado ao carrinho`);
};

const removeFromCart = (productId) => {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
  showToast('Item removido do carrinho');
};

const updateCartItemQuantity = (productId, newQuantity) => {
  if (newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }
  
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = newQuantity;
    saveCart();
    updateCartUI();
  }
};

// Tornar funções globais para uso no HTML
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;

const updateCartUI = () => {
  const count = getCartCount();
  if (elements.cartCount) {
    elements.cartCount.textContent = count;
    elements.cartCount.style.display = count > 0 ? 'inline' : 'none';
  }
  renderCartModal();
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
  const cartModal = document.getElementById("cartModal");
  if (cartModal) {
    cartModal.classList.add("open");
  }
});

if (elements.currentYear) {
  elements.currentYear.textContent = new Date().getFullYear();
}

updateSortButtonText();
renderProducts(getVisibleProducts());
loadCart();

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

authElements.showRegisterBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  authElements.loginFormWrapper.classList.add("hidden");
  authElements.registerFormWrapper.classList.remove("hidden");
});

authElements.showLoginBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  authElements.registerFormWrapper.classList.add("hidden");
  authElements.loginFormWrapper.classList.remove("hidden");
});

document.getElementById("formLogin")?.addEventListener("submit", (e) => {
  e.preventDefault();
  closeModal();
  showToast("Login realizado com sucesso!");
});

document.getElementById("formRegister")?.addEventListener("submit", (e) => {
  e.preventDefault();
  closeModal();
  showToast("Conta criada! Bem-vindo(a).");
});

// Renderizar modal do carrinho
const renderCartModal = () => {
  const cartModal = document.getElementById("cartModal");
  if (!cartModal) return;
  
  const cartContent = cartModal.querySelector('.cart-content');
  if (!cartContent) return;
  
  if (cart.length === 0) {
    cartContent.innerHTML = `
      <div class="cart-empty">
        <p>Seu carrinho está vazio</p>
        <button class="ghost-btn" onclick="document.getElementById('cartModal').classList.remove('open')">Continuar comprando</button>
      </div>
    `;
    return;
  }
  
  const total = getCartTotal();
  cartContent.innerHTML = `
    <div class="cart-items">
      ${cart.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p class="cart-item-price">${formatCurrency(item.price)}</p>
            <div class="cart-item-controls">
              <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
              <button class="remove-btn" onclick="removeFromCart(${item.id})">Remover</button>
            </div>
          </div>
          <div class="cart-item-total">
            ${formatCurrency(item.price * item.quantity)}
          </div>
        </div>
      `).join('')}
    </div>
    <div class="cart-footer">
      <div class="cart-total">
        <strong>Total: ${formatCurrency(total)}</strong>
      </div>
      <button class="primary-btn full-width">Finalizar compra</button>
      <button class="ghost-btn full-width" onclick="document.getElementById('cartModal').classList.remove('open')">Continuar comprando</button>
    </div>
  `;
};

// Fechar modal do carrinho ao clicar fora
const cartModal = document.getElementById("cartModal");
if (cartModal) {
  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      cartModal.classList.remove("open");
    }
  });
  
  const closeCartBtn = cartModal.querySelector('.close-cart');
  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", () => {
      cartModal.classList.remove("open");
    });
  }
}