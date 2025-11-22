const productData = [
  {
    id: 1,
    name: "Headset AchouTáAqui Studio",
    description: "Cancelamento ativo de ruído e até 35h de bateria.",
    price: 499.9,
    badge: "Novo",
    category: "audio",
    image: "styles/image copy 2.png",
    rating: 4.8,
    reviewsCount: 124,
  },
  {
    id: 2,
    name: "Teclado Minimal Cloud",
    description: "Switch silencioso, Bluetooth multiponto e retroiluminação.",
    price: 679.0,
    badge: "Setup",
    category: "home-office",
    image: "styles/image copy.png",
    rating: 4.6,
    reviewsCount: 89,
  },
  {
    id: 3,
    name: "Notebook Lume 14"",
    description: "Processador de última geração e corpo ultrafino.",
    price: 4399.0,
    badge: "Mais vendido",
    category: "hardware",
    image: "styles/image.png",
    rating: 4.9,
    reviewsCount: 256,
  },
  {
    id: 4,
    name: "Mouse Ergo Flow",
    description: "Design ergonômico e 70 dias de autonomia.",
    price: 379.9,
    badge: "Ergo",
    category: "home-office",
    image: "styles/image copy.png",
    rating: 4.7,
    reviewsCount: 142,
  },
  {
    id: 5,
    name: "Smart Speaker Halo",
    description: "Som 360º com assistente inteligente embarcada.",
    price: 899.0,
    badge: "Smart",
    category: "casa",
    image: "styles/image.png",
    rating: 4.5,
    reviewsCount: 78,
  },
  {
    id: 6,
    name: "Monitor Edge 27" 4K",
    description: "Painel IPS calibrado e 99% sRGB.",
    price: 2499.9,
    badge: "Pro",
    category: "hardware",
    image: "styles/image copy 2.png",
    rating: 4.8,
    reviewsCount: 203,
  },
];

const elements = {
  productGrid: document.getElementById("productGrid"),
  cartCount: document.getElementById("cartCount"),
  cartButton: document.getElementById("cartButton"),
  favoritesButton: document.getElementById("favoritesButton"),
  favoritesCount: document.getElementById("favoritesCount"),
  toast: document.getElementById("toast"),
  filterButton: document.getElementById("filterButton"),
  sortButton: document.getElementById("sortButton"),
  newsletterForm: document.getElementById("newsletterForm"),
  newsletterFeedback: document.getElementById("newsletterFeedback"),
  newsletterButton: document.getElementById("newsletterButton"),
  newsletterEmail: document.getElementById("newsletterEmail"),
  currentYear: document.getElementById("currentYear"),
  searchInput: document.getElementById("searchInput"),
  filterCategories: document.getElementById("filterCategories"),
};

let cart = [];
let favorites = [];
let productRatings = {};
let toastTimeout = null;
let showHomeOfficeOnly = false;
let sortAscending = true;
let searchQuery = '';
let selectedCategory = 'all';

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

// Carregar favoritos do localStorage
const loadFavorites = () => {
  try {
    const savedFavorites = localStorage.getItem('devstore_favorites');
    if (savedFavorites) {
      favorites = JSON.parse(savedFavorites);
      updateFavoritesUI();
    }
  } catch (error) {
    console.error('Erro ao carregar favoritos:', error);
    favorites = [];
  }
};

// Carregar avaliações do localStorage
const loadRatings = () => {
  try {
    const savedRatings = localStorage.getItem('devstore_ratings');
    if (savedRatings) {
      productRatings = JSON.parse(savedRatings);
    }
  } catch (error) {
    console.error('Erro ao carregar avaliações:', error);
    productRatings = {};
  }
};

// Salvar avaliações no localStorage
const saveRatings = () => {
  try {
    localStorage.setItem('devstore_ratings', JSON.stringify(productRatings));
  } catch (error) {
    console.error('Erro ao salvar avaliações:', error);
  }
};

// Obter rating de um produto
const getProductRating = (productId) => {
  if (productRatings[productId] && productRatings[productId].length > 0) {
    const sum = productRatings[productId].reduce((acc, r) => acc + r.rating, 0);
    return (sum / productRatings[productId].length).toFixed(1);
  }
  const product = productData.find(p => p.id === productId);
  return product ? product.rating : 0;
};

// Obter número de avaliações
const getProductReviewsCount = (productId) => {
  if (productRatings[productId]) {
    return productRatings[productId].length;
  }
  const product = productData.find(p => p.id === productId);
  return product ? product.reviewsCount : 0;
};

// Adicionar avaliação
const addRating = (productId, rating, comment) => {
  if (!productRatings[productId]) {
    productRatings[productId] = [];
  }
  productRatings[productId].push({
    rating: rating,
    comment: comment || '',
    date: new Date().toISOString(),
    user: 'Usuário'
  });
  saveRatings();
  showToast('Avaliação enviada com sucesso!');
  renderProducts(getVisibleProducts());
};

// Salvar favoritos no localStorage
const saveFavorites = () => {
  try {
    localStorage.setItem('devstore_favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Erro ao salvar favoritos:', error);
  }
};

// Verificar se produto está nos favoritos
const isFavorite = (productId) => {
  return favorites.some(item => item.id === productId);
};

// Adicionar/remover dos favoritos
const toggleFavorite = (product) => {
  const existingIndex = favorites.findIndex(item => item.id === product.id);
  
  if (existingIndex >= 0) {
    favorites.splice(existingIndex, 1);
    showToast(`${product.name} removido dos favoritos`);
  } else {
    favorites.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description
    });
    showToast(`${product.name} adicionado aos favoritos`);
  }
  
  saveFavorites();
  updateFavoritesUI();
  renderProducts(getVisibleProducts());
};

// Atualizar UI dos favoritos
const updateFavoritesUI = () => {
  const count = favorites.length;
  if (elements.favoritesCount) {
    elements.favoritesCount.textContent = count;
    elements.favoritesCount.style.display = count > 0 ? 'inline' : 'none';
  }
  renderFavoritesModal();
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
  let list = [...productData];
  
  // Filtro por categoria
  if (selectedCategory !== 'all') {
    list = list.filter((product) => product.category === selectedCategory);
  }
  
  // Filtro antigo (home-office only) - mantido para compatibilidade
  if (showHomeOfficeOnly) {
    list = list.filter((product) => product.category === "home-office");
  }
  
  // Filtro por busca
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    list = list.filter((product) => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.badge.toLowerCase().includes(query)
    );
  }

  return list.sort((a, b) => (sortAscending ? a.price - b.price : b.price - a.price));
};

const renderProducts = (list) => {
  if (!elements.productGrid) return;
  
  const loadingEl = document.getElementById('productsLoading');
  const emptyEl = document.getElementById('productsEmpty');
  
  // Mostrar loading
  if (loadingEl) loadingEl.style.display = 'flex';
  if (emptyEl) emptyEl.style.display = 'none';
  elements.productGrid.style.opacity = '0.5';
  
  setTimeout(() => {
    elements.productGrid.innerHTML = "";
    
    if (list.length === 0) {
      if (loadingEl) loadingEl.style.display = 'none';
      if (emptyEl) emptyEl.style.display = 'block';
      elements.productGrid.style.opacity = '1';
      return;
    }
    
    if (emptyEl) emptyEl.style.display = 'none';
    const fragment = document.createDocumentFragment();

    list.forEach((product, index) => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'article');
      card.setAttribute('aria-label', `Produto: ${product.name}`);
      const isFav = isFavorite(product.id);
      const rating = parseFloat(getProductRating(product.id));
      const reviewsCount = getProductReviewsCount(product.id);
      const stars = Math.round(rating);
      card.innerHTML = `
        <button class="favorite-btn ${isFav ? 'active' : ''}" data-id="${product.id}" aria-label="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}" tabindex="0">
          <span class="material-icon">${isFav ? 'favorite' : 'favorite_border'}</span>
        </button>
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <span class="badge">${product.badge}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-rating">
          <div class="stars">
            ${Array.from({length: 5}, (_, i) => 
              `<span class="star ${i < stars ? 'filled' : ''}">★</span>`
            ).join('')}
          </div>
          <span class="rating-text">${rating} (${reviewsCount})</span>
        </div>
        <p class="price" aria-label="Preço: ${formatCurrency(product.price)}">${formatCurrency(product.price)}</p>
        <div class="product-actions">
          <button class="primary-btn small" type="button" data-id="${product.id}" aria-label="Adicionar ${product.name} ao carrinho">
            Adicionar
          </button>
          <button class="ghost-btn small" onclick="openRatingModal(${product.id})" aria-label="Avaliar produto">
            <span class="material-icon">rate_review</span>
          </button>
        </div>
      `;
      const addButton = card.querySelector(".primary-btn");
      addButton.addEventListener("click", () => addToCart(product));
      addButton.addEventListener("keydown", (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          addToCart(product);
        }
      });
      const favButton = card.querySelector(".favorite-btn");
      favButton.addEventListener("click", () => toggleFavorite(product));
      favButton.addEventListener("keydown", (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFavorite(product);
        }
      });
      fragment.appendChild(card);
      
      // Animação de entrada
      setTimeout(() => {
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 50);
    });

    elements.productGrid.appendChild(fragment);
    if (loadingEl) loadingEl.style.display = 'none';
    elements.productGrid.style.opacity = '1';
  }, 300);
};

// Limpar filtros
const clearFilters = () => {
  searchQuery = '';
  selectedCategory = 'all';
  showHomeOfficeOnly = false;
  if (elements.searchInput) elements.searchInput.value = '';
  if (elements.filterCategories) {
    elements.filterCategories.querySelectorAll('.category-filter').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.category === 'all') btn.classList.add('active');
    });
  }
  applyProductView();
};
window.clearFilters = clearFilters;

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

const showToast = (message, type = 'success') => {
  if (!elements.toast) return;
  elements.toast.textContent = message;
  elements.toast.className = `toast ${type}`;
  elements.toast.classList.add("show");
  elements.toast.setAttribute('role', 'alert');
  elements.toast.setAttribute('aria-live', 'assertive');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 3000);
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
loadFavorites();
loadRatings();

// Abrir modal de favoritos
elements.favoritesButton?.addEventListener("click", () => {
  const favoritesModal = document.getElementById("favoritesModal");
  if (favoritesModal) {
    favoritesModal.classList.add("open");
  }
});

// Renderizar modal de favoritos
const renderFavoritesModal = () => {
  const favoritesModal = document.getElementById("favoritesModal");
  if (!favoritesModal) return;
  
  const favoritesContent = favoritesModal.querySelector('.favorites-content');
  if (!favoritesContent) return;
  
  if (favorites.length === 0) {
    favoritesContent.innerHTML = `
      <div class="favorites-empty">
        <span class="material-icon" style="font-size: 3rem; color: var(--muted);">favorite_border</span>
        <p>Você ainda não tem favoritos</p>
        <button class="ghost-btn" onclick="document.getElementById('favoritesModal').classList.remove('open')">Continuar comprando</button>
      </div>
    `;
    return;
  }
  
  favoritesContent.innerHTML = `
    <div class="favorites-items">
      ${favorites.map(item => `
        <div class="favorites-item">
          <img src="${item.image}" alt="${item.name}" />
          <div class="favorites-item-info">
            <h4>${item.name}</h4>
            <p>${item.description || ''}</p>
            <p class="favorites-item-price">${formatCurrency(item.price)}</p>
            <div class="favorites-item-actions">
              <button class="primary-btn small" onclick="addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">Adicionar ao carrinho</button>
              <button class="ghost-btn small" onclick="toggleFavorite(${JSON.stringify(item).replace(/"/g, '&quot;')})">Remover</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
};

// Fechar modal de favoritos
const favoritesModalEl = document.getElementById("favoritesModal");
if (favoritesModalEl) {
  favoritesModalEl.addEventListener("click", (e) => {
    if (e.target === favoritesModalEl) {
      favoritesModalEl.classList.remove("open");
    }
  });
  
  const closeFavoritesBtn = favoritesModalEl.querySelector('.close-favorites');
  if (closeFavoritesBtn) {
    closeFavoritesBtn.addEventListener("click", () => {
      favoritesModalEl.classList.remove("open");
    });
  }
}

// Abrir modal de avaliação
const openRatingModal = (productId) => {
  const product = productData.find(p => p.id === productId);
  if (!product) return;
  
  const modal = document.getElementById('ratingModal');
  if (!modal) return;
  
  modal.dataset.productId = productId;
  modal.querySelector('.rating-product-name').textContent = product.name;
  modal.querySelector('.rating-product-image').src = product.image;
  modal.classList.add('open');
  
  // Reset form
  const form = modal.querySelector('#ratingForm');
  if (form) form.reset();
  modal.querySelectorAll('.star-input').forEach(star => star.classList.remove('selected'));
};

// Fechar modal de avaliação
const closeRatingModal = () => {
  const modal = document.getElementById('ratingModal');
  if (modal) modal.classList.remove('open');
};

// Sistema de estrelas interativo
const setupStarRating = () => {
  const modal = document.getElementById('ratingModal');
  if (!modal) return;
  
  const stars = modal.querySelectorAll('.star-input');
  let selectedRating = 0;
  
  stars.forEach((star, index) => {
    star.addEventListener('click', () => {
      selectedRating = index + 1;
      stars.forEach((s, i) => {
        s.classList.toggle('selected', i < selectedRating);
      });
      document.getElementById('ratingValue').value = selectedRating;
    });
    
    star.addEventListener('mouseenter', () => {
      stars.forEach((s, i) => {
        s.classList.toggle('hover', i <= index);
      });
    });
  });
  
  modal.addEventListener('mouseleave', () => {
    stars.forEach((s, i) => {
      s.classList.remove('hover');
      s.classList.toggle('selected', i < selectedRating);
    });
  });
};

// Formulário de avaliação
document.addEventListener('DOMContentLoaded', () => {
  const ratingForm = document.getElementById('ratingForm');
  if (ratingForm) {
    ratingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const modal = document.getElementById('ratingModal');
      const productId = parseInt(modal.dataset.productId);
      const rating = parseInt(document.getElementById('ratingValue').value);
      const comment = document.getElementById('ratingComment').value;
      
      if (rating === 0) {
        showToast('Por favor, selecione uma avaliação', 'error');
        return;
      }
      
      addRating(productId, rating, comment);
      closeRatingModal();
    });
  }
  
  setupStarRating();
});

// Tornar funções globais
window.toggleFavorite = toggleFavorite;
window.openRatingModal = openRatingModal;
window.closeRatingModal = closeRatingModal;

// Sistema de busca
elements.searchInput?.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  applyProductView();
});

// Filtros por categoria
if (elements.filterCategories) {
  elements.filterCategories.addEventListener("click", (e) => {
    if (e.target.classList.contains("category-filter")) {
      // Remove active de todos
      elements.filterCategories.querySelectorAll(".category-filter").forEach(btn => {
        btn.classList.remove("active");
      });
      // Adiciona active no clicado
      e.target.classList.add("active");
      selectedCategory = e.target.dataset.category;
      applyProductView();
    }
  });
}

const authElements = {
  modal: document.getElementById("authModal"),
  loginBtn: document.getElementById("loginBtn"),
  closeBtn: document.getElementById("closeModal"),
  loginFormWrapper: document.getElementById("loginFormWrapper"),
  registerFormWrapper: document.getElementById("registerFormWrapper"),
  forgotPasswordWrapper: document.getElementById("forgotPasswordWrapper"),
  showRegisterBtn: document.getElementById("showRegister"),
  showLoginBtn: document.getElementById("showLogin"),
  forgotPasswordBtn: document.getElementById("forgotPassword"),
  backToLoginBtn: document.getElementById("backToLogin"),
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

// Validação de e-mail
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validação de senha
const validatePassword = (password) => {
  return password.length >= 8;
};

// Mostrar erro de input
const showInputError = (inputId, message) => {
  const errorElement = document.getElementById(inputId + 'Error');
  const input = document.getElementById(inputId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = message ? 'block' : 'none';
  }
  if (input) {
    input.classList.toggle('error', !!message);
  }
};

// Limpar erros
const clearErrors = (formId) => {
  const form = document.getElementById(formId);
  if (form) {
    form.querySelectorAll('.input-error').forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
    form.querySelectorAll('input').forEach(el => {
      el.classList.remove('error');
    });
  }
};

// Indicador de força da senha
const updatePasswordStrength = (password) => {
  const strengthElement = document.getElementById('passwordStrength');
  if (!strengthElement) return;
  
  let strength = 0;
  let text = '';
  let color = '';
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;
  
  if (strength <= 2) {
    text = 'Senha fraca';
    color = '#ef4444';
  } else if (strength <= 3) {
    text = 'Senha média';
    color = '#f59e0b';
  } else {
    text = 'Senha forte';
    color = '#16a34a';
  }
  
  strengthElement.textContent = password ? text : '';
  strengthElement.style.color = color;
};

// Formulário de login
document.getElementById("formLogin")?.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors('formLogin');
  
  const email = document.getElementById("emailLogin").value;
  const password = document.getElementById("senhaLogin").value;
  let isValid = true;
  
  if (!validateEmail(email)) {
    showInputError('emailLogin', 'E-mail inválido');
    isValid = false;
  }
  
  if (!password) {
    showInputError('senhaLogin', 'Senha é obrigatória');
    isValid = false;
  }
  
  if (!isValid) return;
  
  const submitBtn = document.getElementById('loginSubmitBtn');
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnLoader = submitBtn?.querySelector('.btn-loader');
  
  if (btnText) btnText.style.display = 'none';
  if (btnLoader) btnLoader.style.display = 'inline';
  if (submitBtn) submitBtn.disabled = true;
  
  // Simular requisição
  setTimeout(() => {
    closeModal();
    showToast("Login realizado com sucesso!");
    if (btnText) btnText.style.display = 'inline';
    if (btnLoader) btnLoader.style.display = 'none';
    if (submitBtn) submitBtn.disabled = false;
  }, 1500);
});

// Formulário de registro
document.getElementById("formRegister")?.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors('formRegister');
  
  const nome = document.getElementById("nomeRegister").value;
  const email = document.getElementById("emailRegister").value;
  const password = document.getElementById("senhaRegister").value;
  const passwordConfirm = document.getElementById("senhaConfirmRegister").value;
  let isValid = true;
  
  if (nome.length < 3) {
    showInputError('nomeRegister', 'Nome deve ter pelo menos 3 caracteres');
    isValid = false;
  }
  
  if (!validateEmail(email)) {
    showInputError('emailRegister', 'E-mail inválido');
    isValid = false;
  }
  
  if (!validatePassword(password)) {
    showInputError('senhaRegister', 'Senha deve ter pelo menos 8 caracteres');
    isValid = false;
  }
  
  if (password !== passwordConfirm) {
    showInputError('senhaConfirmRegister', 'As senhas não coincidem');
    isValid = false;
  }
  
  if (!isValid) return;
  
  const submitBtn = document.getElementById('registerSubmitBtn');
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnLoader = submitBtn?.querySelector('.btn-loader');
  
  if (btnText) btnText.style.display = 'none';
  if (btnLoader) btnLoader.style.display = 'inline';
  if (submitBtn) submitBtn.disabled = true;
  
  // Simular requisição
  setTimeout(() => {
    closeModal();
    showToast("Conta criada! Bem-vindo(a).");
    if (btnText) btnText.style.display = 'inline';
    if (btnLoader) btnLoader.style.display = 'none';
    if (submitBtn) submitBtn.disabled = false;
  }, 1500);
});

// Formulário de recuperação de senha
document.getElementById("formForgotPassword")?.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors('formForgotPassword');
  
  const email = document.getElementById("emailForgot").value;
  
  if (!validateEmail(email)) {
    showInputError('emailForgot', 'E-mail inválido');
    return;
  }
  
  showToast("Link de recuperação enviado para seu e-mail!");
  setTimeout(() => {
    authElements.forgotPasswordWrapper.classList.add("hidden");
    authElements.loginFormWrapper.classList.remove("hidden");
  }, 2000);
});

// Monitorar força da senha
document.getElementById("senhaRegister")?.addEventListener("input", (e) => {
  updatePasswordStrength(e.target.value);
});

// Navegação entre formulários
authElements.forgotPasswordBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  authElements.loginFormWrapper.classList.add("hidden");
  authElements.forgotPasswordWrapper.classList.remove("hidden");
});

authElements.backToLoginBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  authElements.forgotPasswordWrapper.classList.add("hidden");
  authElements.loginFormWrapper.classList.remove("hidden");
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