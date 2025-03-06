// Firebase initialization (same as admin.js)
const firebaseConfig = {
    apiKey: "AIzaSyDtOgfObFOJl3E7Yr322RfjUqaSG99E3dQ",
    authDomain: "sample-dashboard-cb785.firebaseapp.com",
    projectId: "sample-dashboard-cb785",
    storageBucket: "sample-dashboard-cb785.firebasestorage.app",
    messagingSenderId: "840149826725",
    appId: "1:840149826725:web:2bd4de3d7b1ad4c4b5a14c"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const newRequestBtn = document.querySelector('.new-request-btn');
const modal = document.getElementById('newRequestModal');
const closeModal = document.querySelector('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const procurementForm = document.getElementById('procurementForm');
const procurementTbody = document.getElementById('procurement-tbody');

// Sample procurement data
const procurementData = [
    {
        id: 'PRQ001',
        item: 'Industrial Pumps',
        description: 'High-pressure water pumps for industrial use',
        quantity: '5 units',
        requester: 'John Doe',
        date: '2024-02-15',
        status: 'pending',
        amount: '$12,500'
    },
    // Add more sample data...
];

// Add these sample data constants
const vendorQuotations = [
    {
        requestId: 'PRQ001',
        item: 'Industrial Pumps',
        quantity: '5 units',
        deadline: '2024-03-15',
        quotes: [
            {
                vendorName: 'HydroTech Solutions',
                rating: 4.8,
                amount: 12500,
                deliveryDays: 7,
                status: 'received'
            },
            {
                vendorName: 'Aqua Systems',
                rating: 4.5,
                amount: 13200,
                deliveryDays: 5,
                status: 'received'
            },
            {
                vendorName: 'Pure Flow Inc',
                rating: 4.2,
                status: 'pending'
            }
        ]
    }
];

const orderTracking = [
    {
        orderId: 'ORD-2024-001',
        requestId: 'PRQ001',
        placedDate: '2024-02-28',
        status: 'processing',
        timeline: [
            {
                step: 'Order Placed',
                date: '2024-02-28 10:30:00',
                status: 'completed'
            },
            {
                step: 'Payment Confirmed',
                date: '2024-02-28 14:15:00',
                status: 'completed'
            },
            {
                step: 'Processing',
                date: '2024-03-02',
                status: 'active'
            },
            {
                step: 'Shipping',
                date: '2024-03-04',
                status: 'pending'
            },
            {
                step: 'Delivery',
                date: '2024-03-07',
                status: 'pending'
            }
        ]
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadProcurementData();
    loadVendorQuotations();
    loadOrderTracking();
    initializeEventListeners();
});

// Load procurement data
function loadProcurementData() {
    procurementTbody.innerHTML = procurementData.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>
                <div class="item-details">
                    <span class="item-name">${item.item}</span>
                    <span class="item-description">${item.description}</span>
                </div>
            </td>
            <td>${item.requester}</td>
            <td>${formatDate(item.date)}</td>
            <td>${item.amount}</td>
            <td><span class="status-badge ${item.status}">${item.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Add these functions
function loadVendorQuotations() {
    // Load and display vendor quotations
}

function loadOrderTracking() {
    // Load and display order tracking
}

function acceptQuote(requestId, vendorName) {
    // Handle quote acceptance
}

function sendQuoteReminder(requestId, vendorName) {
    // Send reminder to vendor
}

function compareQuotes(quotes) {
    // Compare vendor quotes and return analysis
}

// Event Listeners
function initializeEventListeners() {
    // Modal controls
    newRequestBtn.addEventListener('click', () => modal.style.display = 'block');
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    cancelBtn.addEventListener('click', () => modal.style.display = 'none');
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Mobile sidebar toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
}

// Helper Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
} 