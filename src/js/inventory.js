// Sample inventory data with more items
const inventoryItems = [
    {
        code: 'IP001',
        name: 'High-Pressure Pump',
        category: 'Industrial Pumps',
        stockLevel: 15,
        reorderPoint: 10,
        unitPrice: 1200,
        totalValue: 18000,
        status: 'in-stock',
        location: 'Warehouse A',
        lastUpdated: '2024-02-28'
    },
    {
        code: 'WF002',
        name: 'Carbon Filter',
        category: 'Water Filters',
        stockLevel: 8,
        reorderPoint: 15,
        unitPrice: 450,
        totalValue: 3600,
        status: 'low-stock',
        location: 'Warehouse B',
        lastUpdated: '2024-02-27'
    },
    {
        code: 'TC003',
        name: 'Chlorine Solution',
        category: 'Treatment Chemicals',
        stockLevel: 0,
        reorderPoint: 20,
        unitPrice: 75,
        totalValue: 0,
        status: 'out-of-stock',
        location: 'Store Room',
        lastUpdated: '2024-02-26'
    },
    {
        code: 'MS004',
        name: 'pH Sensor',
        category: 'Monitoring Sensors',
        stockLevel: 25,
        reorderPoint: 10,
        unitPrice: 350,
        totalValue: 8750,
        status: 'in-stock',
        location: 'Warehouse A',
        lastUpdated: '2024-02-28'
    },
    {
        code: 'IP005',
        name: 'Centrifugal Pump',
        category: 'Industrial Pumps',
        stockLevel: 5,
        reorderPoint: 8,
        unitPrice: 890,
        totalValue: 4450,
        status: 'low-stock',
        location: 'Warehouse B',
        lastUpdated: '2024-02-25'
    }
];

// Initialize inventory table
function initializeInventoryTable() {
    const tableBody = document.getElementById('inventoryTableBody');
    if (!tableBody) {
        console.error('Inventory table body not found');
        return;
    }

    tableBody.innerHTML = inventoryItems.map(item => `
        <tr>
            <td><input type="checkbox" class="item-checkbox" data-code="${item.code}"></td>
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>
                <div class="stock-level">
                    <div class="stock-bar">
                        <div class="stock-bar-fill" style="width: ${(item.stockLevel / item.reorderPoint * 100)}%; 
                            background: ${getStockBarColor(item.stockLevel, item.reorderPoint)}"></div>
                    </div>
                    <span>${item.stockLevel}</span>
                </div>
            </td>
            <td>${item.reorderPoint}</td>
            <td>$${item.unitPrice.toLocaleString()}</td>
            <td>$${item.totalValue.toLocaleString()}</td>
            <td><span class="stock-status status-${item.status}">${formatStatus(item.status)}</span></td>
            <td>${item.location}</td>
            <td>${formatDate(item.lastUpdated)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" title="Edit Item" onclick="editItem('${item.code}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn reorder" title="Reorder" onclick="reorderItem('${item.code}')">
                        <i class="fas fa-sync"></i>
                    </button>
                    <button class="action-btn delete" title="Delete" onclick="deleteItem('${item.code}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    // Initialize select all checkbox
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.item-checkbox');
            checkboxes.forEach(checkbox => checkbox.checked = this.checked);
            updateBulkActionButtons();
        });
    }

    // Initialize individual checkboxes
    const checkboxes = document.querySelectorAll('.item-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateBulkActionButtons);
    });
}

// Update overview cards
function updateOverviewCards() {
    const totalItems = inventoryItems.length;
    const lowStockItems = inventoryItems.filter(item => item.stockLevel <= item.reorderPoint).length;
    const totalValue = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0);
    const reorderItems = inventoryItems.filter(item => item.stockLevel === 0).length;

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('lowStockCount').textContent = lowStockItems;
    document.getElementById('stockValue').textContent = `$${totalValue.toLocaleString()}`;
    document.getElementById('reorderCount').textContent = reorderItems;
}

// Initialize stock level chart with more detailed data
function initializeStockChart() {
    const ctx = document.getElementById('stockLevelChart');
    if (!ctx) {
        console.error('Stock level chart canvas not found');
        return;
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Stock Levels',
                    data: [150, 135, 180, 200, 175, 160],
                    borderColor: '#2563eb',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Reorder Points',
                    data: [100, 100, 100, 100, 100, 100],
                    borderColor: '#dc2626',
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Stock Level Trends'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Quantity'
                    }
                }
            }
        }
    });
}

// Initialize distribution chart with actual data
function initializeDistributionChart() {
    const ctx = document.getElementById('stockDistributionChart');
    if (!ctx) {
        console.error('Distribution chart canvas not found');
        return;
    }

    const inStock = inventoryItems.filter(item => item.status === 'in-stock').length;
    const lowStock = inventoryItems.filter(item => item.status === 'low-stock').length;
    const outOfStock = inventoryItems.filter(item => item.status === 'out-of-stock').length;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['In Stock', 'Low Stock', 'Out of Stock'],
            datasets: [{
                data: [inStock, lowStock, outOfStock],
                backgroundColor: ['#16a34a', '#f97316', '#dc2626']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            layout: {
                padding: {
                    top: 10,
                    bottom: 10
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Helper functions
function getStockBarColor(current, reorder) {
    if (current === 0) return '#dc2626';
    if (current <= reorder) return '#f97316';
    return '#16a34a';
}

function formatStatus(status) {
    return status.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// CRUD Operations
function editItem(code) {
    console.log('Editing item:', code);
    // Implement edit functionality
}

function reorderItem(code) {
    console.log('Reordering item:', code);
    // Implement reorder functionality
}

function deleteItem(code) {
    if (confirm('Are you sure you want to delete this item?')) {
        console.log('Deleting item:', code);
        // Implement delete functionality
    }
}

// Bulk actions
function updateBulkActionButtons() {
    const checkedBoxes = document.querySelectorAll('.item-checkbox:checked');
    const bulkExportBtn = document.getElementById('bulkExportBtn');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');

    if (bulkExportBtn && bulkDeleteBtn) {
        const hasChecked = checkedBoxes.length > 0;
        bulkExportBtn.disabled = !hasChecked;
        bulkDeleteBtn.disabled = !hasChecked;
    }
}

// Search and filter functionality
function initializeSearchAndFilters() {
    const searchInput = document.getElementById('inventorySearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const stockFilter = document.getElementById('stockFilter');
    const moreFiltersBtn = document.getElementById('moreFiltersBtn');
    const advancedFilters = document.getElementById('advancedFilters');

    if (searchInput) {
        searchInput.addEventListener('input', filterInventory);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterInventory);
    }
    if (stockFilter) {
        stockFilter.addEventListener('change', filterInventory);
    }
    
    // Toggle advanced filters
    if (moreFiltersBtn && advancedFilters) {
        moreFiltersBtn.addEventListener('click', () => {
            advancedFilters.classList.toggle('active');
            moreFiltersBtn.classList.toggle('active');
            
            // Update button text
            const icon = moreFiltersBtn.querySelector('i');
            if (advancedFilters.classList.contains('active')) {
                moreFiltersBtn.innerHTML = `<i class="fas fa-times"></i> Less Filters`;
            } else {
                moreFiltersBtn.innerHTML = `<i class="fas fa-filter"></i> More Filters`;
            }
        });
    }
}

function filterInventory() {
    // Implement filter logic
    console.log('Filtering inventory...');
}

// Modal handling
function initializeModal() {
    const addItemBtn = document.getElementById('addItemBtn');
    const modal = document.getElementById('addItemModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveItemBtn');
    const form = document.getElementById('addItemForm');

    addItemBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    const closeModal = () => {
        modal.classList.remove('active');
        form.reset();
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (form.checkValidity()) {
            // Handle form submission
            const formData = {
                name: document.getElementById('itemName').value,
                category: document.getElementById('itemCategory').value,
                stockLevel: parseInt(document.getElementById('initialStock').value),
                reorderPoint: parseInt(document.getElementById('reorderPoint').value),
                unitPrice: parseFloat(document.getElementById('unitPrice').value),
                location: document.getElementById('location').value,
                description: document.getElementById('description').value
            };
            
            console.log('New Item Data:', formData);
            closeModal();
        } else {
            form.reportValidity();
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initializeInventoryTable();
    updateOverviewCards();
    initializeStockChart();
    initializeDistributionChart();
    initializeSearchAndFilters();
    initializeModal();
}); 