import { Component } from '@angular/core';
import { Discount, DiscountStats, DiscountUsage } from '../../models/discount';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Category, Product } from '../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-discounts',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-discounts.component.html',
  styleUrl: './admin-discounts.component.css'
})
export class AdminDiscountsComponent {
  Math = Math;
  // Data arrays
  discounts: Discount[] = [];
  discountUsages: DiscountUsage[] = [];
  products: Product[] = [];
  categories: Category[] = [];
  filteredDiscounts: Discount[] = [];

  // Forms
  discountForm!: FormGroup;
  bulkGenerateForm!: FormGroup;

  // State variables
  isLoading = false;
  isSaving = false;
  activeTab = 'overview';
  selectedDiscount: Discount | null = null;
  showDiscountModal = false;
  showBulkModal = false;
  isEditing = false;

  // Filters and search
  searchTerm = '';
  statusFilter = 'all';
  typeFilter = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Chart data
  discountUsageChartData: any;
  savingsChartData: any;

  // Available options
  statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active', class: 'badge bg-success' },
    { value: 'upcoming', label: 'Upcoming', class: 'badge bg-info' },
    { value: 'expired', label: 'Expired', class: 'badge bg-secondary' },
    { value: 'inactive', label: 'Inactive', class: 'badge bg-warning' }
  ];

  discountTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'percentage', label: 'Percentage', icon: 'fas fa-percentage' },
    { value: 'fixed_amount', label: 'Fixed Amount', icon: 'fas fa-dollar-sign' },
    { value: 'free_shipping', label: 'Free Shipping', icon: 'fas fa-shipping-fast' }
  ];

  applyToOptions = [
    { value: 'all_products', label: 'All Products' },
    { value: 'specific_products', label: 'Specific Products' },
    { value: 'specific_categories', label: 'Specific Categories' }
  ];

  customerEligibilityOptions = [
    { value: 'all_customers', label: 'All Customers' },
    { value: 'specific_customers', label: 'Specific Customers' },
    { value: 'new_customers', label: 'New Customers Only' }
  ];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.initializeForms();
    this.loadDiscountData();
    this.loadProductsAndCategories();
    this.initializeChartData();
  }

  initializeForms() {
    // Discount Form
    this.discountForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      type: ['percentage', Validators.required],
      value: [0, [Validators.required, Validators.min(0)]],
      minimumAmount: [0],
      maximumDiscount: [0],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      usageLimit: [''],
      isActive: [true],
      applyTo: ['all_products', Validators.required],
      products: [[]],
      categories: [[]],
      customerEligibility: ['all_customers', Validators.required],
      customers: [[]],
      oncePerCustomer: [false],
      freeShipping: [false]
    });

    // Bulk Generate Form
    this.bulkGenerateForm = this.fb.group({
      prefix: ['DISCOUNT'],
      quantity: [10, [Validators.required, Validators.min(1), Validators.max(100)]],
      type: ['percentage', Validators.required],
      value: [10, [Validators.required, Validators.min(0)]],
      usageLimit: [1],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    // Add custom validators
    this.discountForm.get('endDate')?.setValidators([
      Validators.required,
      this.endDateValidator.bind(this)
    ]);
  }

  endDateValidator(control: any) {
    const startDate = this.discountForm?.get('startDate')?.value;
    const endDate = control.value;

    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      return { endDateInvalid: true };
    }
    return null;
  }

  loadDiscountData() {
    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      this.generateMockData();
      this.applyFilters();
      this.isLoading = false;
    }, 1500);
  }

  loadProductsAndCategories() {
    this.products = this.dataService.getProducts();
    this.categories = this.dataService.getCategories();
  }

  generateMockData() {
    // Generate mock discounts
    this.discounts = [
      {
        id: 1,
        code: 'WELCOME10',
        name: 'Welcome Discount',
        description: '10% off for new customers',
        type: 'percentage',
        value: 10,
        minimumAmount: 50,
        maximumDiscount: 100,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        usageLimit: 1000,
        usedCount: 245,
        isActive: true,
        applyTo: 'all_products',
        customerEligibility: 'new_customers',
        oncePerCustomer: true,
        freeShipping: false,
        createdAt: '2024-01-01',
        createdBy: 'Admin'
      },
      {
        id: 2,
        code: 'SUMMER25',
        name: 'Summer Sale',
        description: '25% off on all summer products',
        type: 'percentage',
        value: 25,
        minimumAmount: 100,
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        usageLimit: 500,
        usedCount: 189,
        isActive: true,
        applyTo: 'specific_categories',
        categories: [1, 2], // Smartphones and Audio
        customerEligibility: 'all_customers',
        oncePerCustomer: false,
        freeShipping: false,
        createdAt: '2024-05-15',
        createdBy: 'Admin'
      },
      {
        id: 3,
        code: 'FREESHIP',
        name: 'Free Shipping',
        description: 'Free shipping on orders over $50',
        type: 'free_shipping',
        value: 0,
        minimumAmount: 50,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        usedCount: 567,
        isActive: true,
        applyTo: 'all_products',
        customerEligibility: 'all_customers',
        oncePerCustomer: false,
        freeShipping: true,
        createdAt: '2024-01-01',
        createdBy: 'Admin'
      },
      {
        id: 4,
        code: 'SAVE20',
        name: 'Fixed Amount Discount',
        description: '$20 off your order',
        type: 'fixed_amount',
        value: 20,
        minimumAmount: 100,
        startDate: '2024-03-01',
        endDate: '2024-03-31',
        usageLimit: 200,
        usedCount: 45,
        isActive: false,
        applyTo: 'all_products',
        customerEligibility: 'all_customers',
        oncePerCustomer: true,
        freeShipping: false,
        createdAt: '2024-02-20',
        createdBy: 'Admin'
      },
      {
        id: 5,
        code: 'VIP15',
        name: 'VIP Customer Discount',
        description: '15% off for VIP customers',
        type: 'percentage',
        value: 15,
        startDate: '2024-02-01',
        endDate: '2024-02-29',
        usageLimit: 100,
        usedCount: 78,
        isActive: false,
        applyTo: 'all_products',
        customerEligibility: 'specific_customers',
        customers: [1, 2],
        oncePerCustomer: true,
        freeShipping: false,
        createdAt: '2024-01-25',
        createdBy: 'Admin'
      }
    ];

    // Generate mock usage data
    this.discountUsages = [
      {
        id: 1,
        discountId: 1,
        discountCode: 'WELCOME10',
        orderId: 1001,
        customerId: 101,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        discountAmount: 15.99,
        orderTotal: 159.99,
        usedAt: '2024-01-15 10:30:00'
      },
      {
        id: 2,
        discountId: 2,
        discountCode: 'SUMMER25',
        orderId: 1002,
        customerId: 102,
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        discountAmount: 74.75,
        orderTotal: 299.00,
        usedAt: '2024-06-05 14:20:00'
      }
    ];
  }

  initializeChartData() {
    // Discount Usage Chart
    this.discountUsageChartData = {
      labels: ['WELCOME10', 'SUMMER25', 'FREESHIP', 'SAVE20', 'VIP15'],
      datasets: [
        {
          label: 'Usage Count',
          data: [245, 189, 567, 45, 78],
          backgroundColor: [
            '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1'
          ]
        }
      ]
    };

    // Savings Chart
    this.savingsChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Total Savings ($)',
          data: [1250, 1890, 2340, 1780, 2670, 3450],
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
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
    let filtered = [...this.discounts];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(discount =>
        discount.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        discount.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        discount.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(discount => {
        const now = new Date();
        const startDate = new Date(discount.startDate);
        const endDate = new Date(discount.endDate);

        switch (this.statusFilter) {
          case 'active':
            return discount.isActive && now >= startDate && now <= endDate;
          case 'upcoming':
            return discount.isActive && now < startDate;
          case 'expired':
            return now > endDate;
          case 'inactive':
            return !discount.isActive;
          default:
            return true;
        }
      });
    }

    // Type filter
    if (this.typeFilter !== 'all') {
      filtered = filtered.filter(discount => discount.type === this.typeFilter);
    }

    this.filteredDiscounts = filtered;
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
    this.totalPages = Math.ceil(this.filteredDiscounts.length / this.itemsPerPage);
  }

  get paginatedDiscounts(): Discount[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredDiscounts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Discount Management
  openDiscountModal(discount?: Discount) {
    this.isEditing = !!discount;
    this.selectedDiscount = discount || null;

    if (discount) {
      // Edit mode
      this.discountForm.patchValue({
        ...discount,
        startDate: discount.startDate,
        endDate: discount.endDate
      });
    } else {
      // Create mode - generate a random code
      this.discountForm.reset({
        code: this.generateDiscountCode(),
        name: '',
        description: '',
        type: 'percentage',
        value: 10,
        minimumAmount: 0,
        maximumDiscount: 0,
        startDate: '',
        endDate: '',
        usageLimit: '',
        isActive: true,
        applyTo: 'all_products',
        products: [],
        categories: [],
        customerEligibility: 'all_customers',
        customers: [],
        oncePerCustomer: false,
        freeShipping: false
      });
    }

    this.showDiscountModal = true;
  }

  closeDiscountModal() {
    this.showDiscountModal = false;
    this.selectedDiscount = null;
    this.isEditing = false;
    this.discountForm.reset();
  }

  saveDiscount() {
    if (this.discountForm.valid) {
      this.isSaving = true;
      const formValue = this.discountForm.value;

      // Simulate API call
      setTimeout(() => {
        if (this.isEditing && this.selectedDiscount) {
          // Update existing discount
          const index = this.discounts.findIndex(d => d.id === this.selectedDiscount!.id);
          if (index !== -1) {
            this.discounts[index] = {
              ...this.selectedDiscount,
              ...formValue,
              usedCount: this.selectedDiscount.usedCount
            };
          }
        } else {
          // Create new discount
          const newDiscount: Discount = {
            id: Math.max(...this.discounts.map(d => d.id)) + 1,
            code: formValue.code,
            name: formValue.name,
            description: formValue.description,
            type: formValue.type,
            value: formValue.value,
            minimumAmount: formValue.minimumAmount || undefined,
            maximumDiscount: formValue.maximumDiscount || undefined,
            startDate: formValue.startDate,
            endDate: formValue.endDate,
            usageLimit: formValue.usageLimit || undefined,
            usedCount: 0,
            isActive: formValue.isActive,
            applyTo: formValue.applyTo,
            products: formValue.products || [],
            categories: formValue.categories || [],
            customerEligibility: formValue.customerEligibility,
            customers: formValue.customers || [],
            oncePerCustomer: formValue.oncePerCustomer,
            freeShipping: formValue.freeShipping,
            createdAt: new Date().toISOString().split('T')[0],
            createdBy: 'Admin'
          };

          this.discounts.unshift(newDiscount);
        }

        this.applyFilters();
        this.isSaving = false;
        this.closeDiscountModal();
        this.showSuccessMessage(
          `Discount ${this.isEditing ? 'updated' : 'created'} successfully!`
        );
      }, 1000);
    }
  }

  toggleDiscountStatus(discount: Discount) {
    discount.isActive = !discount.isActive;
    this.showSuccessMessage(
      `Discount ${discount.isActive ? 'activated' : 'deactivated'} successfully!`
    );
  }

  duplicateDiscount(discount: Discount) {
    const duplicated: Discount = {
      ...discount,
      id: Math.max(...this.discounts.map(d => d.id)) + 1,
      code: this.generateDiscountCode(),
      name: `${discount.name} (Copy)`,
      usedCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.discounts.unshift(duplicated);
    this.applyFilters();
    this.showSuccessMessage('Discount duplicated successfully!');
  }

  deleteDiscount(discount: Discount) {
    if (confirm(`Are you sure you want to delete discount "${discount.code}"? This action cannot be undone.`)) {
      this.discounts = this.discounts.filter(d => d.id !== discount.id);
      this.applyFilters();
      this.showSuccessMessage('Discount deleted successfully!');
    }
  }

  // Bulk Operations
  openBulkModal() {
    this.bulkGenerateForm.patchValue({
      prefix: 'DISCOUNT',
      quantity: 10,
      type: 'percentage',
      value: 10,
      usageLimit: 1,
      startDate: '',
      endDate: ''
    });
    this.showBulkModal = true;
  }

  closeBulkModal() {
    this.showBulkModal = false;
    this.bulkGenerateForm.reset();
  }

  generateBulkDiscounts() {
    if (this.bulkGenerateForm.valid) {
      this.isSaving = true;
      const formValue = this.bulkGenerateForm.value;

      setTimeout(() => {
        const newDiscounts: Discount[] = [];

        for (let i = 0; i < formValue.quantity; i++) {
          const code = `${formValue.prefix}${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

          const discount: Discount = {
            id: Math.max(...this.discounts.map(d => d.id)) + i + 1,
            code: code,
            name: `Bulk Discount ${i + 1}`,
            description: 'Automatically generated discount code',
            type: formValue.type,
            value: formValue.value,
            startDate: formValue.startDate,
            endDate: formValue.endDate,
            usageLimit: formValue.usageLimit,
            usedCount: 0,
            isActive: true,
            applyTo: 'all_products',
            customerEligibility: 'all_customers',
            oncePerCustomer: true,
            freeShipping: false,
            createdAt: new Date().toISOString().split('T')[0],
            createdBy: 'Admin'
          };

          newDiscounts.push(discount);
        }

        this.discounts.unshift(...newDiscounts);
        this.applyFilters();
        this.isSaving = false;
        this.closeBulkModal();
        this.showSuccessMessage(`${formValue.quantity} discount codes generated successfully!`);
      }, 1500);
    }
  }

  // Analytics and Reports
  getDiscountStats(): DiscountStats {
    const now = new Date();
    const totalDiscounts = this.discounts.length;
    const activeDiscounts = this.discounts.filter(d =>
      d.isActive && new Date(d.startDate) <= now && new Date(d.endDate) >= now
    ).length;
    const expiredDiscounts = this.discounts.filter(d => new Date(d.endDate) < now).length;
    const totalSavings = this.discountUsages.reduce((sum, usage) => sum + usage.discountAmount, 0);
    const usageCount = this.discounts.reduce((sum, discount) => sum + discount.usedCount, 0);

    const popularDiscounts = [...this.discounts]
      .sort((a, b) => b.usedCount - a.usedCount)
      .slice(0, 5)
      .map(d => ({ code: d.code, usage: d.usedCount }));

    return {
      totalDiscounts,
      activeDiscounts,
      expiredDiscounts,
      totalSavings,
      usageCount,
      popularDiscounts
    };
  }

  getDiscountStatus(discount: Discount): string {
    const now = new Date();
    const startDate = new Date(discount.startDate);
    const endDate = new Date(discount.endDate);

    if (!discount.isActive) return 'inactive';
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'expired';
    return 'active';
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'badge bg-success',
      'upcoming': 'badge bg-info',
      'expired': 'badge bg-secondary',
      'inactive': 'badge bg-warning'
    };
    return statusMap[status] || 'badge bg-secondary';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'Active',
      'upcoming': 'Upcoming',
      'expired': 'Expired',
      'inactive': 'Inactive'
    };
    return statusMap[status] || 'Unknown';
  }

  getTypeIcon(type: string): string {
    const typeMap: { [key: string]: string } = {
      'percentage': 'fas fa-percentage',
      'fixed_amount': 'fas fa-dollar-sign',
      'free_shipping': 'fas fa-shipping-fast'
    };
    return typeMap[type] || 'fas fa-tag';
  }

  getTypeText(type: string): string {
    const typeMap: { [key: string]: string } = {
      'percentage': 'Percentage',
      'fixed_amount': 'Fixed Amount',
      'free_shipping': 'Free Shipping'
    };
    return typeMap[type] || 'Unknown';
  }

  formatDiscountValue(discount: Discount): string {
    switch (discount.type) {
      case 'percentage':
        return `${discount.value}%`;
      case 'fixed_amount':
        return `$${discount.value}`;
      case 'free_shipping':
        return 'Free Shipping';
      default:
        return 'Unknown';
    }
  }

  // Utility Methods
  generateDiscountCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  exportDiscounts() {
    const data = {
      discounts: this.discounts,
      usages: this.discountUsages,
      generated: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `discounts-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    this.showSuccessMessage('Discounts report exported successfully!');
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.showSuccessMessage('Discount code copied to clipboard!');
    });
  }

  private showSuccessMessage(message: string) {
    // Replace with your toast service
    alert(message);
  }

  private showErrorMessage(message: string) {
    alert(message);
  }
}
