// Menu data - could be fetched from an API in a real application
const menuItems = [
    {
        id: 1,
        name: "Classic Burger",
        description: "A timeless favorite with fresh lettuce, tomato, and our special sauce",
        price: 650,
        image: "https://foodie.sysco.com/wp-content/uploads/2019/07/Simply-Classic-Burger.jpg"
    },
    {
        id: 2,
        name: "Cheese Burger",
        description: "Our classic burger with a generous slice of melted cheddar cheese",
        price: 850,
        image: "https://www.sargento.com/assets/Uploads/Recipe/Image/burger_0__FillWzgwMCw4MDBd.jpg"
    },
    {
        id: 3,
        name: "Spicy Burger",
        description: "For those who like it hot, with jalapeños and our special spicy sauce",
        price: 750,
        image: "https://img.freepik.com/premium-photo/spicy-fiery-zinger-burger-with-fries-topped-with-vegetables-tomatoes-ketchup-delicious-ai_1038983-8296.jpg"
    },
    {
        id: 4,
        name: "Bacon Burger",
        description: "Juicy patty with crispy bacon strips and smoky BBQ sauce",
        price: 900,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6isLhEmC0563sFX3Y-9kJbzDf6PfhPCE7lg&s"
    },
    {
        id: 5,
        name: "Veggie Burger",
        description: "Delicious plant-based patty with all the fixings",
        price: 700,
        image: "https://www.thespruceeats.com/thmb/e-lll-PpJ5F-MF4C57LYag3IAB8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/easy-vegan-black-bean-veggie-burgers-3377008-hero-05-f7c0f0d9865e48b6be52a4c76ee22438.jpg"
    },
    {
        id: 6,
        name: "Double Cheese Burger",
        description: "Double the patties, double the cheese, double the deliciousness",
        price: 1100,
        image: "https://www.foodandwine.com/thmb/DI29Houjc_ccAtFKly0BbVsusHc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/crispy-comte-cheesburgers-FT-RECIPE0921-6166c6552b7148e8a8561f7765ddf20b.jpg"
    }
];

// Cart functionality
let cart = [];

// DOM elements
const menuContainer = document.getElementById('menu-items');
const cartItemsList = document.getElementById('cart-items');
const cartTotal = document.getElementById('total');
const cartEmpty = document.getElementById('cart-empty');
const cartContent = document.getElementById('cart-content');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const customerForm = document.getElementById('customer-form');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Load menu items
    loadMenuItems();
    
    // Load cart from localStorage if available
    loadCart();
    
    // Update cart display
    updateCart();
    
    // Setup event listeners
    setupEventListeners();
});

function loadMenuItems() {
    menuContainer.innerHTML = '';
    
    menuItems.forEach(item => {
        const menuItemElement = document.createElement('div');
        menuItemElement.className = 'menu-item';
        menuItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p class="price">Rs ${item.price.toFixed(2)}</p>
                <button onclick="addToCart(${item.id})">Add to Cart</button>
            </div>
        `;
        menuContainer.appendChild(menuItemElement);
    });
}

function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    // Check if item already exists in cart
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }
    
    // Save to localStorage
    saveCart();
    
    // Update cart display
    updateCart();
    
    // Show notification
    showNotification(`${item.name} added to cart!`);
}

function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;
    
    // Remove item from cart
    cart.splice(itemIndex, 1);
    
    // Save to localStorage
    saveCart();
    
    // Update cart display
    updateCart();
}

function updateCart() {
    // Update cart items list
    cartItemsList.innerHTML = '';
    
    let totalAmount = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name} (${item.quantity})</span>
            <span>Rs ${itemTotal.toFixed(2)}</span>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsList.appendChild(li);
    });
    
    // Update total
    cartTotal.textContent = totalAmount.toFixed(2);
    
    // Update cart count in header
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Show/hide empty cart message
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartContent.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        cartContent.style.display = 'block';
    }
}

function checkout() {
    const name = document.getElementById('customer-name').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    
    // Validate form
    if (!name || !email || !address) {
        showNotification('Please fill in all customer details before checking out.', 'error');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // In a real application, you would send this data to a server
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Show order confirmation
    showNotification(`Thank you, ${name}! Your order has been placed. Total: Rs ${totalAmount.toFixed(2)}`, 'success');
    
    // Clear cart
    cart = [];
    saveCart();
    updateCart();
    
    // Reset form
    customerForm.reset();
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

function saveCart() {
    localStorage.setItem('burgerShopCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('burgerShopCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function setupEventListeners() {
    checkoutBtn.addEventListener('click', checkout);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}