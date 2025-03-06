// DOM Elements
const userName = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');
const totalRevenue = document.getElementById('total-revenue');
const activeOrders = document.getElementById('active-orders');
const totalVendors = document.getElementById('total-vendors');
const growthRate = document.getElementById('growth-rate');
const activityList = document.getElementById('activity-list');
const pendingOrders = document.getElementById('pending-orders');
const refreshBtn = document.querySelector('.refresh-btn');

// Add this near the top with other data constants
const dashboardStats = {
    procurement: {
        value: 245000,
        change: 15,
        trend: 'positive'
    },
    requests: {
        value: 12,
        pending: 5,
        trend: 'warning'
    },
    vendors: {
        value: 28,
        change: 3,
        trend: 'positive'
    },
    stock: {
        value: 8,
        critical: 3,
        trend: 'negative'
    }
};

// Check if user is authenticated
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('User authenticated:', user.email);
        // Update username
        userName.textContent = `Welcome, ${user.email}`;
    }
});

// Logout Handler
logoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
        window.location.replace('./index.html');
    } catch (error) {
        console.error('Error logging out:', error);
        alert('Error logging out. Please try again.');
    }
});

// Initialize Dashboard Data
async function initializeDashboard() {
    try {
        await Promise.all([
            updateStats(),
            loadRecentActivity(),
            loadPendingOrders(),
            populateProcurementList(),
            populateVendorList(),
            populateInventoryAlerts()
        ]);
        
        // Initialize charts
        initializePriceChart();
        initializeVendorChart();
        initializeInventoryChart();
        
        console.log('Dashboard initialized successfully');
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
}

// Update Statistics
async function updateStats() {
    try {
        // Update procurement value with animation
        const procurementElement = document.getElementById('total-procurement');
        animateValue(procurementElement, 0, dashboardStats.procurement.value, 2000, true);
        
        // Update pending requests
        const requestsElement = document.getElementById('pending-requests-count');
        animateValue(requestsElement, 0, dashboardStats.requests.value, 1500);
        
        // Update active vendors
        const vendorsElement = document.getElementById('active-vendors');
        animateValue(vendorsElement, 0, dashboardStats.vendors.value, 1500);
        
        // Update low stock items
        const stockElement = document.getElementById('low-stock');
        animateValue(stockElement, 0, dashboardStats.stock.value, 1500);

    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Load Recent Activity
async function loadRecentActivity() {
    const activityList = document.getElementById('activity-list');
    
    // Show loading state
    activityList.innerHTML = `
        <div class="loading-activity">
            <i class="fas fa-spinner rotating"></i>
            <span>Loading activities...</span>
        </div>
    `;

    // Simulate API call delay
    setTimeout(() => {
        const recentActivities = [
            {
                type: 'order',
                description: 'New order placed for Industrial Pumps',
                timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
                user: 'John Doe',
                details: '5 units at $12,500'
            },
            {
                type: 'payment',
                description: 'Payment processed for Water Filters',
                timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
                user: 'Sarah Smith',
                details: 'Invoice #INV-2024-001'
            },
            {
                type: 'system',
                description: 'Low stock alert: UV Lamps',
                timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
                user: 'System',
                details: 'Stock level: 5 units'
            },
            {
                type: 'user',
                description: 'New vendor registered: HydroTech Solutions',
                timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
                user: 'Admin',
                details: 'Vendor ID: VEN-2024-089'
            },
            {
                type: 'order',
                description: 'Purchase order approved',
                timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
                user: 'Mike Johnson',
                details: 'PO-2024-0125'
            }
        ];

        if (recentActivities.length === 0) {
            activityList.innerHTML = `
                <div class="empty-state">
                    <i class="far fa-clock"></i>
                    <p>No recent activities</p>
                </div>
            `;
            return;
        }

        activityList.innerHTML = recentActivities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas ${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <p class="activity-text">
                        ${activity.description}
                        <span class="activity-details">${activity.details}</span>
                    </p>
                    <div class="activity-meta">
                        <span class="activity-time">
                            <i class="far fa-clock"></i>
                            ${formatTimeAgo(activity.timestamp)}
                        </span>
                        <span class="activity-user">
                            <i class="far fa-user"></i>
                            ${activity.user}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }, 1000);
}

// Load Pending Orders
async function loadPendingOrders() {
    try {
        const orders = await db.collection('orders')
            .where('status', '==', 'pending')
            .limit(5)
            .get();

        pendingOrders.innerHTML = '';
        
        orders.forEach(doc => {
            const order = doc.data();
            const orderElement = createOrderElement(order);
            pendingOrders.appendChild(orderElement);
        });
    } catch (error) {
        console.error('Error loading orders:', error);
        pendingOrders.innerHTML = '<p class="error-message">Error loading orders</p>';
    }
}

// Helper Functions
function createActivityElement(activity) {
    const div = document.createElement('div');
    div.className = 'activity-item';
    div.innerHTML = `
        <div class="activity-icon">
            <i class="fas ${getActivityIcon(activity.type)}"></i>
        </div>
        <div class="activity-details">
            <p class="activity-text">${activity.description}</p>
            <span class="activity-time">${formatTimestamp(activity.timestamp)}</span>
        </div>
    `;
    return div;
}

function createOrderElement(order) {
    const div = document.createElement('div');
    div.className = 'order-item';
    div.innerHTML = `
        <div class="order-info">
            <h4>Order #${order.id}</h4>
            <p>${order.description}</p>
        </div>
        <div class="order-status ${order.status}">
            ${order.status}
        </div>
    `;
    return div;
}

function getActivityIcon(type) {
    const icons = {
        order: 'fa-shopping-cart',
        payment: 'fa-credit-card',
        user: 'fa-user-circle',
        system: 'fa-exclamation-triangle'
    };
    return icons[type] || 'fa-info-circle';
}

function formatTimestamp(timestamp) {
    const date = timestamp.toDate();
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
        .format(Math.round((date - new Date()) / (1000 * 60 * 60 * 24)), 'day');
}

// Event Listeners
refreshBtn.addEventListener('click', () => {
    const refreshBtn = document.querySelector('.refresh-btn i');
    refreshBtn.classList.add('rotating');
    loadRecentActivity();
    setTimeout(() => refreshBtn.classList.remove('rotating'), 1000);
});

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing dashboard...');
    try {
        await populateProcurementList();
        await initializeDashboard();
        initializeInventoryChart();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Sample data population functions
function populateProcurementList() {
    return new Promise((resolve) => {
        console.log('Populating procurement list...');
        const procurementList = document.getElementById('procurement-list');
        
        if (!procurementList) {
            console.error('Procurement list element not found!');
            return;
        }

        const sampleProcurements = [
            {
                id: 'PRQ001',
                item: 'Industrial Pumps',
                description: 'High-pressure water pumps for industrial use',
                quantity: '5 units',
                requestedBy: {
                    name: 'John Doe',
                    avatar: 'assets/default-avatar.png'
                },
                date: '2024-02-15',
                status: 'pending',
                amount: '$12,500'
            },
            {
                id: 'PRQ002',
                item: 'Water Filters',
                description: 'Reverse osmosis filters - Industrial grade',
                quantity: '100 units',
                requestedBy: {
                    name: 'Sarah Smith',
                    avatar: 'assets/default-avatar.png'
                },
                date: '2024-02-14',
                status: 'approved',
                amount: '$5,000'
            },
            {
                id: 'PRQ003',
                item: 'Chemical Sensors',
                description: 'pH and TDS monitoring sensors',
                quantity: '20 units',
                requestedBy: {
                    name: 'Mike Johnson',
                    avatar: 'assets/default-avatar.png'
                },
                date: '2024-02-13',
                status: 'processing',
                amount: '$8,750'
            },
            {
                id: 'PRQ004',
                item: 'Storage Tanks',
                description: '5000L capacity with monitoring system',
                quantity: '2 units',
                requestedBy: {
                    name: 'Emily Chen',
                    avatar: 'assets/default-avatar.png'
                },
                date: '2024-02-12',
                status: 'rejected',
                amount: '$15,000'
            }
        ];

        // Simulate loading delay
        setTimeout(() => {
            procurementList.innerHTML = sampleProcurements.map(proc => `
                <div class="procurement-item">
                    <div class="col">${proc.id}</div>
                    <div class="col item-details">
                        <div class="item-name">${proc.item}</div>
                        <div class="item-info">${proc.description} • ${proc.quantity}</div>
                    </div>
                    <div class="col requester">
                        <img src="${proc.requestedBy.avatar}" alt="${proc.requestedBy.name}" class="requester-avatar">
                        <span>${proc.requestedBy.name}</span>
                    </div>
                    <div class="col">${proc.date}</div>
                    <div class="col">${proc.amount}</div>
                    <div class="col">
                        <span class="status-badge ${proc.status}">${proc.status}</span>
                    </div>
                    <div class="col action-buttons">
                        ${proc.status === 'pending' ? `
                            <button class="action-btn approve" title="Approve">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="action-btn reject" title="Reject">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : `
                            <button class="action-btn view" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                        `}
                    </div>
                </div>
            `).join('');
            
            console.log('Procurement list populated with', sampleProcurements.length, 'items');
            resolve();
        }, 1000); // 1 second delay to show loading state
    });
}

function populateVendorList() {
    const vendorList = document.getElementById('vendor-list');
    const vendors = [
        {
            name: 'AquaTech Solutions',
            rating: 4.8,
            reliability: 98,
            onTimeDelivery: 96,
            qualityScore: 99,
            responseTime: '2h',
            totalOrders: 150,
            trend: 'up',
            priceCompetitiveness: 92
        },
        {
            name: 'PureFlow Systems',
            rating: 4.6,
            reliability: 95,
            onTimeDelivery: 94,
            qualityScore: 96,
            responseTime: '4h avg',
            totalOrders: 120,
            trend: 'up',
            priceCompetitiveness: 88
        },
        {
            name: 'HydroTech Industries',
            rating: 4.5,
            reliability: 92,
            onTimeDelivery: 90,
            qualityScore: 95,
            responseTime: '3h avg',
            totalOrders: 85,
            trend: 'stable',
            priceCompetitiveness: 94
        },
        {
            name: 'WaterPro Equipment',
            rating: 4.3,
            reliability: 88,
            onTimeDelivery: 87,
            qualityScore: 92,
            responseTime: '5h avg',
            totalOrders: 95,
            trend: 'down',
            priceCompetitiveness: 90
        }
    ];

    vendorList.innerHTML = vendors.map(vendor => `
        <div class="vendor-card">
            <div class="vendor-header">
                <div class="vendor-info">
                    <h3>${vendor.name}</h3>
                    <div class="rating">
                        ${generateStars(vendor.rating)}
                        <span>${vendor.rating.toFixed(1)}</span>
                    </div>
                </div>
                <span class="trend-indicator ${vendor.trend}">
                    <i class="fas fa-arrow-${vendor.trend}"></i>
                </span>
            </div>
            <div class="vendor-metrics">
                <div class="metric">
                    <div class="value">${vendor.reliability}%</div>
                    <div class="label">Reliability</div>
                </div>
                <div class="metric">
                    <div class="value">${vendor.onTimeDelivery}%</div>
                    <div class="label">On-Time</div>
                </div>
                <div class="metric">
                    <div class="value">${vendor.qualityScore}%</div>
                    <div class="label">Quality</div>
                </div>
                <div class="metric">
                    <div class="value">${vendor.responseTime}</div>
                    <div class="label">Response</div>
                </div>
            </div>
        </div>
    `).join('');

    updateVendorChart(vendors);
}

// Inventory data and functions
const inventoryData = {
    stockLevels: {
        'Industrial Pumps': { current: 45, min: 20, max: 100, reorderPoint: 30 },
        'Water Filters': { current: 180, min: 100, max: 500, reorderPoint: 150 },
        'Treatment Chemicals': { current: 15, min: 20, max: 100, reorderPoint: 25 },
        'Monitoring Sensors': { current: 68, min: 50, max: 200, reorderPoint: 75 },
        'UV Sterilizers': { current: 28, min: 25, max: 100, reorderPoint: 35 },
        'Pressure Gauges': { current: 95, min: 50, max: 200, reorderPoint: 75 }
    },
    alerts: [
        {
            type: 'critical',
            item: 'Treatment Chemicals',
            message: 'Stock below minimum level',
            level: '15 units remaining',
            action: 'Reorder required'
        },
        {
            type: 'warning',
            item: 'UV Sterilizers',
            message: 'Approaching reorder point',
            level: '28 units remaining',
            action: 'Monitor closely'
        },
        {
            type: 'info',
            item: 'Water Filters',
            message: 'Stock optimization recommended',
            level: '180 units in stock',
            action: 'Review order size'
        }
    ]
};

function initializeInventoryChart() {
    const ctx = document.getElementById('inventoryChart').getContext('2d');
    
    // Destroy existing chart if it exists
    const existingChart = Chart.getChart(ctx.canvas);
    if (existingChart) {
        existingChart.destroy();
    }

    const items = Object.keys(inventoryData.stockLevels);
    const currentLevels = items.map(item => inventoryData.stockLevels[item].current);
    const reorderPoints = items.map(item => inventoryData.stockLevels[item].reorderPoint);
    const maxLevels = items.map(item => inventoryData.stockLevels[item].max);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: items,
            datasets: [
                {
                    label: 'Current Stock',
                    data: currentLevels,
                    backgroundColor: currentLevels.map((level, index) => 
                        level <= inventoryData.stockLevels[items[index]].reorderPoint 
                            ? '#ef4444' 
                            : '#2563eb'),
                    borderWidth: 0,
                    borderRadius: 4
                },
                {
                    label: 'Reorder Point',
                    data: reorderPoints,
                    type: 'line',
                    borderColor: '#f59e0b',
                    borderDash: [5, 5],
                    fill: false,
                    pointStyle: 'line'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            const maxValue = maxLevels[context.dataIndex];
                            return `${label}: ${value} units (Max: ${maxValue})`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Units in Stock'
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

function populateInventoryAlerts() {
    const alertsContainer = document.getElementById('inventory-alerts');
    
    alertsContainer.innerHTML = inventoryData.alerts.map(alert => `
        <div class="alert-card ${alert.type}">
            <div class="alert-header">
                <div class="alert-title">
                    <i class="fas ${getAlertIcon(alert.type)}"></i>
                    <h4>${alert.item}</h4>
                </div>
                <span class="alert-badge ${alert.type}">${alert.type}</span>
            </div>
            <div class="alert-content">
                <p class="alert-message">${alert.message}</p>
                <p class="alert-level">${alert.level}</p>
                <div class="alert-actions">
                    <button class="action-btn">
                        <i class="fas fa-plus"></i> ${alert.action}
                    </button>
                    <button class="dismiss-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners for alert actions
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', handleAlertAction);
    });

    document.querySelectorAll('.dismiss-btn').forEach(btn => {
        btn.addEventListener('click', dismissAlert);
    });
}

function getAlertIcon(type) {
    const icons = {
        critical: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

function handleAlertAction(e) {
    const alertCard = e.target.closest('.alert-card');
    const itemName = alertCard.querySelector('h4').textContent;
    // Simulate action handling
    console.log(`Handling action for ${itemName}`);
    // You can add modal or form handling here
}

function dismissAlert(e) {
    const alertCard = e.target.closest('.alert-card');
    alertCard.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => alertCard.remove(), 300);
}

// Helper function for star ratings
function generateStars(rating) {
    return Array.from({ length: 5 }, (_, i) => {
        if (i < Math.floor(rating)) {
            return '<i class="fas fa-star"></i>';
        } else if (i === Math.floor(rating) && rating % 1 > 0) {
            return '<i class="fas fa-star-half-alt"></i>';
        } else {
            return '<i class="far fa-star"></i>';
        }
    }).join('');
}

function getProgressClass(value) {
    if (value >= 95) return 'high';
    if (value >= 85) return 'medium';
    return 'low';
}

// Add these new functions for charts

function initializePriceChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Industrial Pumps',
            data: [12500, 12800, 12400, 13000, 12900, 13200],
            borderColor: '#2563eb',
            tension: 0.4
        }, {
            label: 'Water Filters',
            data: [5000, 5200, 5100, 5400, 5300, 5600],
            borderColor: '#10b981',
            tension: 0.4
        }]
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function initializeVendorChart() {
    const ctx = document.getElementById('vendorChart').getContext('2d');
    const data = {
        labels: ['AquaTech', 'PureFlow', 'HydroSys', 'WaterPro', 'FlowTech'],
        datasets: [{
            label: 'Performance Score',
            data: [98, 95, 88, 85, 82],
            backgroundColor: [
                '#2563eb',
                '#3b82f6',
                '#60a5fa',
                '#93c5fd',
                '#bfdbfe'
            ]
        }]
    };

    new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    });
}

// Helper function to format time ago
function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}

// Add event listeners for trend filter buttons
document.querySelectorAll('.trend-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.trend-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        updatePriceChart(button.dataset.period);
    });
});

// Function to update price chart based on selected period
function updatePriceChart(period) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    let labels, data1, data2;

    switch(period) {
        case 'weekly':
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            data1 = [12500, 12800, 12400, 13000, 12900, 13200, 13100];
            data2 = [5000, 5200, 5100, 5400, 5300, 5600, 5500];
            break;
        case 'monthly':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            data1 = [12600, 12900, 13100, 13300];
            data2 = [5100, 5300, 5500, 5700];
            break;
        case 'yearly':
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            data1 = [12000, 12300, 12500, 12800, 13000, 13200, 13400, 13600, 13800, 14000, 14200, 14400];
            data2 = [4800, 5000, 5200, 5400, 5600, 5800, 6000, 6200, 6400, 6600, 6800, 7000];
            break;
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Industrial Pumps',
                data: data1,
                borderColor: '#2563eb',
                tension: 0.4
            }, {
                label: 'Water Filters',
                data: data2,
                borderColor: '#10b981',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Price trend data structure
const priceData = {
    pumps: {
        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [12500, 12800, 12750, 13000, 12900, 13200, 13100]
        },
        monthly: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [12600, 12900, 13100, 13300]
        },
        yearly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [12000, 12300, 12500, 12800, 13000, 13200, 13400, 13600, 13800, 14000, 14200, 14400]
        }
    },
    filters: {
        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [5000, 4800, 5200, 5100, 5300, 5150, 5250]
        },
        monthly: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [4900, 5100, 5000, 5200]
        },
        yearly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [4800, 4900, 5100, 5000, 5200, 5150, 5300, 5250, 5400, 5350, 5500, 5450]
        }
    },
    chemicals: {
        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [3500, 3450, 3400, 3300, 3250, 3400, 3350]
        },
        monthly: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [3500, 3300, 3200, 3400]
        },
        yearly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [3200, 3400, 3300, 3500, 3400, 3200, 3300, 3400, 3300, 3200, 3400, 3300]
        }
    },
    sensors: {
        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [2200, 2250, 2300, 2280, 2320, 2350, 2400]
        },
        monthly: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [2200, 2300, 2350, 2400]
        },
        yearly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [2000, 2100, 2200, 2300, 2350, 2400, 2450, 2500, 2550, 2600, 2650, 2700]
        }
    }
};

function updatePriceChart(period = 'weekly', product = 'all') {
    const ctx = document.getElementById('priceChart').getContext('2d');
    let datasets = [];

    if (product === 'all') {
        const colors = {
            pumps: '#2563eb',    // Blue
            filters: '#10b981',   // Green
            chemicals: '#f59e0b', // Orange
            sensors: '#ef4444'    // Red
        };

        datasets = Object.entries(priceData).map(([key, data]) => ({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            data: data[period].data,
            borderColor: colors[key],
            backgroundColor: colors[key] + '20', // Add slight transparency
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
        }));
    } else {
        const colors = {
            pumps: '#2563eb',
            filters: '#10b981',
            chemicals: '#f59e0b',
            sensors: '#ef4444'
        };

        datasets = [{
            label: product.charAt(0).toUpperCase() + product.slice(1),
            data: priceData[product][period].data,
            borderColor: colors[product],
            backgroundColor: colors[product] + '20',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
        }];
    }

    const labels = priceData.pumps[period].labels;

    // Destroy existing chart if it exists
    const existingChart = Chart.getChart(ctx.canvas);
    if (existingChart) {
        existingChart.destroy();
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    padding: 12,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        },
                        padding: 10
                    }
                },
                x: {
                    grid: {
                        drawBorder: false
                    },
                    ticks: {
                        padding: 10
                    }
                }
            }
        }
    });
}

// Call updatePriceChart on page load
document.addEventListener('DOMContentLoaded', () => {
    updatePriceChart('weekly', 'all');
});

// Event listeners
document.getElementById('productSelect').addEventListener('change', (e) => {
    updatePriceChart(
        document.querySelector('.trend-btn.active').dataset.period,
        e.target.value
    );
});

document.querySelectorAll('.trend-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.trend-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        updatePriceChart(
            button.dataset.period,
            document.getElementById('productSelect').value
        );
    });
});

function updateVendorChart(vendors) {
    const ctx = document.getElementById('vendorChart').getContext('2d');
    const metric = document.getElementById('vendorMetricSelect').value;
    
    const metricData = {
        performance: vendors.map(v => v.reliability),
        delivery: vendors.map(v => v.onTimeDelivery),
        quality: vendors.map(v => v.qualityScore),
        pricing: vendors.map(v => v.priceCompetitiveness)
    };

    const chartData = {
        labels: vendors.map(v => v.name),
        datasets: [{
            label: 'Score',
            data: metricData[metric],
            backgroundColor: [
                'rgba(37, 99, 235, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)'
            ],
            borderWidth: 0
        }]
    };

    const existingChart = Chart.getChart(ctx.canvas);
    if (existingChart) {
        existingChart.destroy();
    }

    new Chart(ctx, {
        type: 'radar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Event listener for metric selector
document.getElementById('vendorMetricSelect').addEventListener('change', () => {
    const vendors = [/* ... vendor data ... */]; // Add your vendor data here
    updateVendorChart(vendors);
});

// Add this to your existing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    // Toggle sidebar
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    // Close sidebar when clicking overlay
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Close sidebar when clicking a link (for mobile)
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    });
});

// Helper function for number animation
function animateValue(element, start, end, duration, isCurrency = false) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const animate = () => {
        current += increment;
        if (current >= end) {
            if (isCurrency) {
                element.textContent = `$${end.toLocaleString()}`;
            } else {
                element.textContent = Math.round(end);
            }
            return;
        }
        
        if (isCurrency) {
            element.textContent = `$${Math.round(current).toLocaleString()}`;
        } else {
            element.textContent = Math.round(current);
        }
        
        requestAnimationFrame(animate);
    };
    
    animate();
}