import { Component } from '@angular/core';
import { StockMovement } from '../../models/stock-movement';
import { InventoryItem } from '../../models/inventory-item';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Supplier } from '../../models/supplier';
import { CommonModule } from '@angular/common';
// import { NgChartsModule } from 'ng2-charts'; for v20+
@Component({
  selector: 'app-admin-inventory',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-inventory.component.html',
  styleUrl: './admin-inventory.component.css'
})
export class AdminInventoryComponent {
  // Data arrays
  inventoryItems: InventoryItem[] = [];
  stockMovements: StockMovement[] = [];
  suppliers: Supplier[] = [];
  filteredItems: InventoryItem[] = [];

  // Forms
  stockAdjustmentForm!: FormGroup;
  quickUpdateForm!: FormGroup;
  addSupplierForm!: FormGroup;

  // State variables
  isLoading = false;
  isSaving = false;
  activeTab = 'overview';
  selectedItem: InventoryItem | null = null;
  showStockModal = false;
  showSupplierModal = false;

  // Filters and search
  searchTerm = '';
  statusFilter = 'all';
  categoryFilter = 'all';
  supplierFilter = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Chart data
  stockLevelChartData: any;
  movementChartData: any;

  // Available options
  statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'in_stock', label: 'In Stock', class: 'badge bg-success' },
    { value: 'low_stock', label: 'Low Stock', class: 'badge bg-warning' },
    { value: 'out_of_stock', label: 'Out of Stock', class: 'badge bg-danger' },
    { value: 'discontinued', label: 'Discontinued', class: 'badge bg-secondary' }
  ];

  categories = [
    'all',
    'Smartphones',
    'Audio',
    'Laptops',
    'Tablets',
    'Wearables'
  ];

  adjustmentReasons = [
    'Stock Count',
    'Damaged Goods',
    'Returned Items',
    'Theft/Loss',
    'Expired Items',
    'Quality Control',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.initializeForms();
    this.loadInventoryData();
    this.initializeChartData();
  }

  initializeForms() {
    // Stock Adjustment Form
    this.stockAdjustmentForm = this.fb.group({
      productId: ['', Validators.required],
      adjustmentType: ['in', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required],
      notes: [''],
      costPrice: [0, [Validators.min(0)]]
    });

    // Quick Update Form
    this.quickUpdateForm = this.fb.group({
      lowStockThreshold: [5, [Validators.required, Validators.min(0)]],
      reorderPoint: [10, [Validators.required, Validators.min(0)]],
      costPrice: [0, [Validators.min(0)]],
      location: [''],
      supplier: ['']
    });

    // Add Supplier Form
    this.addSupplierForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      contactPerson: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  loadInventoryData() {
    this.isLoading = true;

    // Simulate API call - in real app, this would come from your backend
    setTimeout(() => {
      this.generateMockData();
      this.applyFilters();
      this.isLoading = false;
    }, 1500);
  }

  generateMockData() {
    // Generate mock inventory items
    this.inventoryItems = [
      {
        id: 1,
        productId: 1,
        productName: 'iPhone 15 Pro',
        sku: 'APP-IP15P-256',
        currentStock: 25,
        lowStockThreshold: 5,
        reorderPoint: 10,
        costPrice: 1000,
        sellingPrice: 1299,
        location: 'A1-01',
        supplier: 'Apple Inc.',
        lastRestocked: '2024-01-15',
        nextRestockDate: '2024-02-15',
        status: 'in_stock',
        category: 'Smartphones',
        imageUrl: 'https://www.channelnews.com.au/wp-content/uploads/2023/08/iPhone-14-Pro-Purple-Side-Perspective-Feature-Purple.jpg'
      },
      {
        id: 2,
        productId: 2,
        productName: 'Samsung Galaxy S24',
        sku: 'SAM-GS24-256',
        currentStock: 3,
        lowStockThreshold: 5,
        reorderPoint: 10,
        costPrice: 900,
        sellingPrice: 1199,
        location: 'A1-02',
        supplier: 'Samsung Electronics',
        lastRestocked: '2024-01-10',
        nextRestockDate: '2024-01-25',
        status: 'low_stock',
        category: 'Smartphones',
        imageUrl: 'https://stg-images.samsung.com/is/image/samsung/assets/za/smartphones/galaxy-s24-ultra/images/hotfix4/galaxy-s24-ultra-highlights-color-titanium-gray-back-mo.jpg?imbypass=true'
      },
      {
        id: 3,
        productId: 3,
        productName: 'Sony WH-1000XM5 Headphones',
        sku: 'SON-WH1000XM5',
        currentStock: 0,
        lowStockThreshold: 3,
        reorderPoint: 8,
        costPrice: 300,
        sellingPrice: 399,
        location: 'B2-01',
        supplier: 'Sony Corporation',
        lastRestocked: '2024-01-05',
        status: 'out_of_stock',
        category: 'Audio'
      },
      {
        id: 4,
        productId: 4,
        productName: 'MacBook Air M3',
        sku: 'APP-MBA-M3-512',
        currentStock: 12,
        lowStockThreshold: 2,
        reorderPoint: 5,
        costPrice: 1200,
        sellingPrice: 1599,
        location: 'C1-01',
        supplier: 'Apple Inc.',
        lastRestocked: '2024-01-12',
        nextRestockDate: '2024-02-12',
        status: 'in_stock',
        category: 'Laptops',
        imageUrl: 'https://www.loveitcoverit.com/wp-content/uploads/MacBook-Air-M3.webp'
      },
      {
        id: 5,
        productId: 5,
        productName: 'Google Pixel 8 Pro',
        sku: 'GOO-PX8P-128',
        currentStock: 15,
        lowStockThreshold: 4,
        reorderPoint: 8,
        costPrice: 750,
        sellingPrice: 999,
        location: 'A1-03',
        supplier: 'Google LLC',
        lastRestocked: '2024-01-08',
        nextRestockDate: '2024-02-08',
        status: 'in_stock',
        category: 'Smartphones',
        imageUrl: 'https://cdn.movertix.com/media/catalog/product/cache/image/1200x/g/o/google-pixel-8-pro-5g-mint-128gb.jpg'
      },
      {
        id: 6,
        productId: 6,
        productName: 'Bose QuietComfort 45',
        sku: 'BOS-QC45-BLK',
        currentStock: 30,
        lowStockThreshold: 5,
        reorderPoint: 12,
        costPrice: 250,
        sellingPrice: 329,
        location: 'B2-02',
        supplier: 'Bose Corporation',
        lastRestocked: '2024-01-18',
        nextRestockDate: '2024-02-18',
        status: 'in_stock',
        category: 'Audio',
        imageUrl: 'https://m.media-amazon.com/images/I/6111lUBzI3L.jpg'
      }
    ];

    // Generate mock stock movements
    this.stockMovements = [
      {
        id: 1,
        productId: 1,
        productName: 'iPhone 15 Pro',
        type: 'in',
        quantity: 50,
        previousStock: 0,
        newStock: 50,
        reason: 'Initial Stock',
        date: '2024-01-15',
        performedBy: 'Admin User',
        reference: 'PO-001'
      },
      {
        id: 2,
        productId: 1,
        productName: 'iPhone 15 Pro',
        type: 'out',
        quantity: 25,
        previousStock: 50,
        newStock: 25,
        reason: 'Sales',
        date: '2024-01-20',
        performedBy: 'System',
        reference: 'ORD-001'
      }
    ];

    // Generate mock suppliers
    this.suppliers = [
      {
        id: 1,
        name: 'Apple Inc.',
        contactPerson: 'Tim Cook',
        email: 'supplier@apple.com',
        phone: '+1-800-692-7753',
        address: 'One Apple Park Way, Cupertino, CA 95014',
        productsSupplied: 2,
        rating: 4.8,
        status: 'active'
      },
      {
        id: 2,
        name: 'Samsung Electronics',
        contactPerson: 'JH Han',
        email: 'supplies@samsung.com',
        phone: '+82-2-2255-0114',
        address: '129 Samsung-ro, Yeongtong-gu, Suwon-si, Gyeonggi-do',
        productsSupplied: 1,
        rating: 4.5,
        status: 'active'
      },
      {
        id: 3,
        name: 'Sony Corporation',
        contactPerson: 'Kenichiro Yoshida',
        email: 'supplier@sony.com',
        phone: '+81-3-6748-2111',
        address: '1-7-1 Konan, Minato-ku, Tokyo 108-0075',
        productsSupplied: 1,
        rating: 4.3,
        status: 'active'
      }
    ];
  }

  initializeChartData() {
    // Stock Level Chart
    this.stockLevelChartData = {
      labels: ['In Stock', 'Low Stock', 'Out of Stock', 'Discontinued'],
      datasets: [
        {
          data: [4, 1, 1, 0],
          backgroundColor: ['#28a745', '#ffc107', '#dc3545', '#6c757d'],
          hoverBackgroundColor: ['#218838', '#e0a800', '#c82333', '#545b62']
        }
      ]
    };

    // Movement Chart
    this.movementChartData = {
      labels: ['Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 20'],
      datasets: [
        {
          label: 'Stock In',
          data: [0, 50, 0, 30, 0],
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          fill: true
        },
        {
          label: 'Stock Out',
          data: [0, 0, 25, 0, 15],
          borderColor: '#dc3545',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          fill: true
        }
      ]
    };
  }

  // Tab Management
  onTabChange(tab: string) {
    this.activeTab = tab;
  }

  // Filtering and Search
  applyFilters() {
    let filtered = [...this.inventoryItems];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === this.statusFilter);
    }

    // Category filter
    if (this.categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === this.categoryFilter);
    }

    // Supplier filter
    if (this.supplierFilter !== 'all') {
      filtered = filtered.filter(item => item.supplier === this.supplierFilter);
    }

    this.filteredItems = filtered;
    this.updatePagination();
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  // Pagination
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
  }

  get paginatedItems(): InventoryItem[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredItems.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Stock Management
  openStockModal(item: InventoryItem) {
    this.selectedItem = item;
    this.stockAdjustmentForm.patchValue({
      productId: item.id,
      adjustmentType: 'in',
      quantity: 1,
      reason: '',
      notes: '',
      costPrice: item.costPrice
    });
    this.showStockModal = true;
  }

  closeStockModal() {
    this.showStockModal = false;
    this.selectedItem = null;
    this.stockAdjustmentForm.reset();
  }

  adjustStock() {
    if (this.stockAdjustmentForm.valid && this.selectedItem) {
      this.isSaving = true;
      const formValue = this.stockAdjustmentForm.value;

      // Simulate API call
      setTimeout(() => {
        // Update stock in the local array (in real app, this would be an API call)
        const itemIndex = this.inventoryItems.findIndex(item => item.id === this.selectedItem!.id);
        if (itemIndex !== -1) {
          const previousStock = this.inventoryItems[itemIndex].currentStock;
          let newStock = previousStock;

          if (formValue.adjustmentType === 'in') {
            newStock = previousStock + formValue.quantity;
          } else {
            newStock = Math.max(0, previousStock - formValue.quantity);
          }

          this.inventoryItems[itemIndex].currentStock = newStock;
          this.inventoryItems[itemIndex].status = this.getStockStatus(newStock, this.inventoryItems[itemIndex].lowStockThreshold);

          // Add to stock movements
          const movement: StockMovement = {
            id: this.stockMovements.length + 1,
            productId: this.selectedItem!.productId,
            productName: this.selectedItem!.productName,
            type: formValue.adjustmentType as 'in' | 'out',
            quantity: formValue.quantity,
            previousStock,
            newStock,
            reason: formValue.reason,
            date: new Date().toISOString().split('T')[0],
            performedBy: 'Admin User',
            reference: formValue.notes || 'Manual Adjustment'
          };

          this.stockMovements.unshift(movement);
        }

        this.applyFilters();
        this.isSaving = false;
        this.closeStockModal();
        this.showSuccessMessage('Stock updated successfully!');
      }, 1000);
    }
  }

  getStockStatus(currentStock: number, threshold: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
    if (currentStock === 0) return 'out_of_stock';
    if (currentStock <= threshold) return 'low_stock';
    return 'in_stock';
  }

  // Quick Actions
  quickUpdate(item: InventoryItem, field: string, value: any) {
    const itemIndex = this.inventoryItems.findIndex(i => i.id === item.id);
    if (itemIndex !== -1) {
      this.inventoryItems[itemIndex] = { ...this.inventoryItems[itemIndex], [field]: value };
      this.applyFilters();
      this.showSuccessMessage(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} updated successfully!`);
    }
  }

  // Supplier Management
  openSupplierModal() {
    this.showSupplierModal = true;
  }

  closeSupplierModal() {
    this.showSupplierModal = false;
    this.addSupplierForm.reset();
  }

  addSupplier() {
    if (this.addSupplierForm.valid) {
      this.isSaving = true;
      const formValue = this.addSupplierForm.value;

      setTimeout(() => {
        const newSupplier: Supplier = {
          id: this.suppliers.length + 1,
          ...formValue,
          productsSupplied: 0,
          rating: 0,
          status: 'active'
        };

        this.suppliers.push(newSupplier);
        this.isSaving = false;
        this.closeSupplierModal();
        this.showSuccessMessage('Supplier added successfully!');
      }, 1000);
    }
  }

  // Analytics and Reports
  getInventoryStats() {
    const totalItems = this.inventoryItems.length;
    const inStock = this.inventoryItems.filter(item => item.status === 'in_stock').length;
    const lowStock = this.inventoryItems.filter(item => item.status === 'low_stock').length;
    const outOfStock = this.inventoryItems.filter(item => item.status === 'out_of_stock').length;
    const totalValue = this.inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0);

    return { totalItems, inStock, lowStock, outOfStock, totalValue };
  }

  exportInventoryReport() {
    const data = {
      inventory: this.inventoryItems,
      movements: this.stockMovements,
      suppliers: this.suppliers,
      generated: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `inventory-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    this.showSuccessMessage('Inventory report exported successfully!');
  }

  // Utility Methods
  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'in_stock': 'badge bg-success',
      'low_stock': 'badge bg-warning',
      'out_of_stock': 'badge bg-danger',
      'discontinued': 'badge bg-secondary'
    };
    return statusMap[status] || 'badge bg-secondary';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'in_stock': 'In Stock',
      'low_stock': 'Low Stock',
      'out_of_stock': 'Out of Stock',
      'discontinued': 'Discontinued'
    };
    return statusMap[status] || 'Unknown';
  }

  private showSuccessMessage(message: string) {
    // Replace with your toast service
    alert(message);
  }

  private showErrorMessage(message: string) {
    alert(message);
  }
}
