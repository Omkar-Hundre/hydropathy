// Sample vendor data
const vendors = [
    {
        name: 'HydroTech Solutions',
        logo: 'https://ui-avatars.com/api/?name=HydroTech&background=6366f1&color=fff',
        category: 'Industrial Pumps',
        rating: 4.8,
        ordersCompleted: 156,
        onTimeDelivery: 98,
        activeOrders: 5
    },
    {
        name: 'Aqua Systems',
        logo: 'https://ui-avatars.com/api/?name=Aqua+Systems&background=06b6d4&color=fff',
        category: 'Water Filters',
        rating: 4.5,
        ordersCompleted: 89,
        onTimeDelivery: 95,
        activeOrders: 3
    },
    {
        name: 'Pure Flow Inc',
        logo: 'https://ui-avatars.com/api/?name=Pure+Flow&background=8b5cf6&color=fff',
        category: 'Treatment Chemicals',
        rating: 4.2,
        ordersCompleted: 67,
        onTimeDelivery: 92,
        activeOrders: 2
    }
];

// Initialize vendor grid
function initializeVendorGrid() {
    const vendorGrid = document.getElementById('vendor-grid');
    vendorGrid.innerHTML = vendors.map(vendor => `
        <div class="vendor-card">
            <div class="vendor-header">
                <img src="${vendor.logo}" alt="${vendor.name}" class="vendor-logo">
                <div class="vendor-info">
                    <h3>${vendor.name}</h3>
                    <span class="vendor-category">${vendor.category}</span>
                </div>
            </div>
            <div class="vendor-stats">
                <div class="stat-item">
                    <div class="stat-label">Orders Completed</div>
                    <div class="stat-value">${vendor.ordersCompleted}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">On-time Delivery</div>
                    <div class="stat-value">${vendor.onTimeDelivery}%</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Active Orders</div>
                    <div class="stat-value">${vendor.activeOrders}</div>
                </div>
            </div>
            <div class="vendor-actions">
                <div class="vendor-rating">
                    <i class="fas fa-star"></i>
                    <span>${vendor.rating}</span>
                </div>
                <div class="action-buttons">
                    <button class="vendor-btn secondary">View Profile</button>
                    <button class="vendor-btn primary">Contact</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize performance chart
function initializePerformanceChart() {
    const ctx = document.getElementById('vendorPerformanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'On-time Delivery',
                    data: [92, 95, 94, 98, 97, 95],
                    borderColor: '#2563eb',
                    tension: 0.4
                },
                {
                    label: 'Quality Score',
                    data: [88, 90, 92, 92, 94, 95],
                    borderColor: '#16a34a',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Vendor Performance Trends'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Initialize progress circles
function initializeProgressCircles() {
    const circles = document.querySelectorAll('.progress-circle');
    circles.forEach(circle => {
        const value = circle.dataset.value;
        circle.style.setProperty('--progress', `${value * 3.6}deg`);
    });
}

// Modal handling
function initializeVendorModal() {
    const addVendorBtn = document.getElementById('addVendorBtn');
    const vendorModal = document.getElementById('newVendorModal');
    const closeModalBtn = document.getElementById('closeVendorModal');
    const cancelBtn = document.getElementById('cancelVendorBtn');
    const saveBtn = document.getElementById('saveVendorBtn');
    const vendorForm = document.getElementById('newVendorForm');

    // Open modal
    addVendorBtn.addEventListener('click', () => {
        vendorModal.classList.add('active');
    });

    // Close modal functions
    const closeModal = () => {
        vendorModal.classList.remove('active');
        vendorForm.reset();
    };

    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Close on outside click
    vendorModal.addEventListener('click', (e) => {
        if (e.target === vendorModal) {
            closeModal();
        }
    });

    // Handle form submission
    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (vendorForm.checkValidity()) {
            const formData = {
                name: document.getElementById('vendorName').value,
                category: document.getElementById('vendorCategory').value,
                email: document.getElementById('vendorEmail').value,
                phone: document.getElementById('vendorPhone').value,
                website: document.getElementById('vendorWebsite').value,
                address: document.getElementById('vendorAddress').value,
                description: document.getElementById('vendorDescription').value
            };
            
            // Here you would typically send this data to your backend
            console.log('New Vendor Data:', formData);
            
            // For demo, add to vendors array
            vendors.push({
                name: formData.name,
                logo: `https://ui-avatars.com/api/?name=${formData.name.replace(' ', '+')}&background=6366f1&color=fff`,
                category: formData.category,
                rating: 0,
                ordersCompleted: 0,
                onTimeDelivery: 0,
                activeOrders: 0
            });
            
            // Refresh the grid
            initializeVendorGrid();
            
            // Close the modal
            closeModal();
        } else {
            vendorForm.reportValidity();
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initializeVendorGrid();
    initializePerformanceChart();
    initializeProgressCircles();
    initializeVendorModal();
}); 