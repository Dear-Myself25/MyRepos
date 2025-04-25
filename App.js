// Menu data - would typically come from a database in a real app
const menuItems = [
    {
        id: 1,
        name: "Classic Lager",
        category: "beer",
        price: 5.99,
        image: "https://source.unsplash.com/random/300x200/?beer"
    },
    {
        id: 2,
        name: "IPA",
        category: "beer",
        price: 6.99,
        image: "https://source.unsplash.com/random/300x200/?ipa,beer"
    },
    {
        id: 3,
        name: "Stout",
        category: "beer",
        price: 7.49,
        image: "https://source.unsplash.com/random/300x200/?stout,beer"
    },
    {
        id: 4,
        name: "Margarita",
        category: "cocktail",
        price: 9.99,
        image: "https://source.unsplash.com/random/300x200/?margarita"
    },
    {
        id: 5,
        name: "Mojito",
        category: "cocktail",
        price: 10.49,
        image: "https://source.unsplash.com/random/300x200/?mojito"
    },
    {
        id: 6,
        name: "Old Fashioned",
        category: "cocktail",
        price: 12.99,
        image: "https://source.unsplash.com/random/300x200/?old,fashioned"
    },
    {
        id: 7,
        name: "Cabernet Sauvignon",
        category: "wine",
        price: 8.99,
        image: "https://source.unsplash.com/random/300x200/?cabernet,wine"
    },
    {
        id: 8,
        name: "Chardonnay",
        category: "wine",
        price: 7.99,
        image: "https://source.unsplash.com/random/300x200/?chardonnay,wine"
    },
    {
        id: 9,
        name: "Whiskey",
        category: "spirits",
        price: 9.99,
        image: "https://source.unsplash.com/random/300x200/?whiskey"
    },
    {
        id: 10,
        name: "Vodka",
        category: "spirits",
        price: 8.49,
        image: "https://source.unsplash.com/random/300x200/?vodka"
    },
    {
        id: 11,
        name: "Nachos",
        category: "snacks",
        price: 6.99,
        image: "https://source.unsplash.com/random/300x200/?nachos"
    },
    {
        id: 12,
        name: "Wings",
        category: "snacks",
        price: 8.99,
        image: "https://source.unsplash.com/random/300x200/?chicken,wings"
    }
];

// DOM elements
const menuItemsContainer = document.getElementById('menuItems');
const cartItemsContainer = document.getElementById('cartItems');
const cartOverlay = document.getElementById('cartOverlay');
const cartIcon = document.getElementById('cartIcon');
const closeCartBtn = document.getElementById('closeCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const cartCount = document.querySelector('.cart-count');
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.category-btn');
const orderConfirmation = document.getElementById('orderConfirmation');
const closeConfirmationBtn = document.getElementById('closeConfirmationBtn');
const orderNumberElement = document.getElementById('orderNumber');

// State
let cart = [];
let currentCategory = 'all';
let searchQuery = '';

// Initialize the app
function init() {
    renderMenuItems();
    setupEventListeners();
}

// Render menu items based on current category and search query
function renderMenuItems() {
    menuItemsContainer.innerHTML = '';
    
    const filteredItems = menuItems.filter(item => {
        const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    
    if (filteredItems.length === 0) {
        menuItemsContainer.innerHTML = '<p class="no-items">No items found matching your criteria.</p>';
        return;
    }
    
    filteredItems.forEach(item => {
        const cartItem = cart.find(cartItem => cartItem.id === item.id);
        const quantity = cartItem ? cartItem.quantity : 0;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'menu-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <span class="item-category">${item.category}</span>
                <p class="item-price">$${item.price.toFixed(2)}</p>
                <div class="item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity">${quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="add-to-cart-btn" data-id="${item.id}">Add to Cart</button>
                </div>
            </div>
        `;
        
        menuItemsContainer.appendChild(itemElement);
    });
}

// Render cart items
function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const menuItem = menuItems.find(menuItem => menuItem.id === item.id);
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <img src="${menuItem.image}" alt="${menuItem.name}" class="cart-item-image">
                <div>
                    <p class="cart-item-name">${menuItem.name}</p>
                    <p class="cart-item-price">$${menuItem.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
                <span class="cart-item-remove" data-id="${item.id}">&times;</span>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    updateCartSummary();
}

// Update cart summary (subtotal, tax, total)
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => {
        const menuItem = menuItems.find(menuItem => menuItem.id === item.id);
        return sum + (menuItem.price * item.quantity);
    }, 0);
    
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + tax;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Add item to cart
function addToCart(itemId, quantity = 1) {
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id: itemId, quantity });
    }
    
    renderMenuItems();
    renderCartItems();
    saveCartToLocalStorage();
}

// Remove item from cart
function removeFromCart(itemId, quantity = 1) {
    const existingItemIndex = cart.findIndex(item => item.id === itemId);
    
    if (existingItemIndex !== -1) {
        const existingItem = cart[existingItemIndex];
        
        if (existingItem.quantity > quantity) {
            existingItem.quantity -= quantity;
        } else {
            cart.splice(existingItemIndex, 1);
        }
    }
    
    renderMenuItems();
    renderCartItems();
    saveCartToLocalStorage();
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        renderCartItems();
        renderMenuItems();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Cart icon click
    cartIcon.addEventListener('click', () => {
        cartOverlay.style.display = 'flex';
    });
    
    // Close cart button
    closeCartBtn.addEventListener('click', () => {
        cartOverlay.style.display = 'none';
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        
        // Generate random order number
        const orderNumber = Math.floor(Math.random() * 90000) + 10000;
        orderNumberElement.textContent = orderNumber;
        
        // Show confirmation
        orderConfirmation.style.display = 'flex';
        cartOverlay.style.display = 'none';
        
        // Clear cart
        cart = [];
        saveCartToLocalStorage();
        renderCartItems();
        renderMenuItems();
    });
    
    // Close confirmation button
    closeConfirmationBtn.addEventListener('click', () => {
        orderConfirmation.style.display = 'none';
    });
    
    // Search input
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderMenuItems();
    });
    
    // Category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.dataset.category;
            renderMenuItems();
        });
    });
    
    // Delegated event listeners for dynamic elements
    document.addEventListener('click', (e) => {
        // Plus button in menu
        if (e.target.classList.contains('plus') && e.target.closest('.quantity-controls')) {
            const itemId = parseInt(e.target.dataset.id);
            addToCart(itemId);
        }
        
        // Minus button in menu
        if (e.target.classList.contains('minus') && e.target.closest('.quantity-controls')) {
            const itemId = parseInt(e.target.dataset.id);
            removeFromCart(itemId);
        }
        
        // Add to cart button
        if (e.target.classList.contains('add-to-cart-btn')) {
            const itemId = parseInt(e.target.dataset.id);
            addToCart(itemId);
        }
        
        // Plus button in cart
        if (e.target.classList.contains('plus') && e.target.closest('.cart-item-quantity')) {
            const itemId = parseInt(e.target.dataset.id);
            addToCart(itemId);
        }
        
        // Minus button in cart
        if (e.target.classList.contains('minus') && e.target.closest('.cart-item-quantity')) {
            const itemId = parseInt(e.target.dataset.id);
            removeFromCart(itemId);
        }
        
        // Remove item from cart
        if (e.target.classList.contains('cart-item-remove')) {
            const itemId = parseInt(e.target.dataset.id);
            const existingItemIndex = cart.findIndex(item => item.id === itemId);
            if (existingItemIndex !== -1) {
                cart.splice(existingItemIndex, 1);
                renderMenuItems();
                renderCartItems();
                saveCartToLocalStorage();
            }
        }
    });
}

// Initialize the app
loadCartFromLocalStorage();
init();