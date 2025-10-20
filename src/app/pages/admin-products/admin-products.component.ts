import { Component } from '@angular/core';
import { Category, Product } from '../../models';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-products',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent {
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];

  // UI States
  isEditing = false;
  isAdding = false;
  isLoading = false;
  currentProduct: Product | null = null;
  showDeleteModal = false;
  productToDelete: Product | null = null;

  // Search and Filter
  searchTerm = '';
  selectedCategory = 'all';
  stockFilter = 'all';
  statusFilter = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Form
  productForm: FormGroup;
  imagePreview: string | null = null;

  // Sort options
  sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'stock-asc', label: 'Stock (Low to High)' },
    { value: 'stock-desc', label: 'Stock (High to Low)' },
    { value: 'date-new', label: 'Date (Newest)' },
    { value: 'date-old', label: 'Date (Oldest)' }
  ];
  selectedSort = 'date-new';

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      categoryId: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: ['', [Validators.required]],
      stock: ['', [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      featured: [false]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.products = this.dataService.getProducts();
    this.categories = this.dataService.getCategories();
  }

  loadProducts(): void {
    this.isLoading = true;

    // Simulate API delay
    setTimeout(() => {
      this.products = this.dataService.getProducts();
      this.applyFilters();
      this.isLoading = false;
    }, 500);
  }

  applyFilters(): void {
    let filtered = [...this.products];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(
        product => product.categoryId === parseInt(this.selectedCategory)
      );
    }

    // Stock filter
    if (this.stockFilter !== 'all') {
      switch (this.stockFilter) {
        case 'in-stock':
          filtered = filtered.filter(p => p.stock > 0);
          break;
        case 'out-of-stock':
          filtered = filtered.filter(p => p.stock === 0);
          break;
        case 'low-stock':
          filtered = filtered.filter(p => p.stock > 0 && p.stock < 10);
          break;
      }
    }

    // Status filter
    if (this.statusFilter !== 'all') {
      switch (this.statusFilter) {
        case 'featured':
          filtered = filtered.filter(p => p.featured);
          break;
        case 'discounted':
          filtered = filtered.filter(p => (p.discount || 0) > 0);
          break;
      }
    }

    // Apply sorting
    this.applySorting(filtered);
  }

  applySorting(products: Product[]): void {
    switch (this.selectedSort) {
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        products.sort((a, b) => this.getDiscountedPrice(a) - this.getDiscountedPrice(b));
        break;
      case 'price-desc':
        products.sort((a, b) => this.getDiscountedPrice(b) - this.getDiscountedPrice(a));
        break;
      case 'stock-asc':
        products.sort((a, b) => a.stock - b.stock);
        break;
      case 'stock-desc':
        products.sort((a, b) => b.stock - a.stock);
        break;
      case 'date-new':
        products.sort((a, b) => b.id - a.id); // Using ID as proxy for date
        break;
      case 'date-old':
        products.sort((a, b) => a.id - b.id);
        break;
    }

    this.filteredProducts = products;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }



  // Product CRUD Operations
  addProduct(): void {
    this.isAdding = true;
    this.isEditing = false;
    this.currentProduct = null;
    this.imagePreview = null;
    this.productForm.reset({
      discount: 0,
      featured: false,
      stock: 0,
      categoryId: ''
    });
  }

  editProduct(product: Product): void {
    this.isEditing = true;
    this.isAdding = false;
    this.currentProduct = product;
    this.imagePreview = product.imageUrl;

    this.productForm.patchValue({
      name: product.name,
      categoryId: product.categoryId.toString(),
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      stock: product.stock,
      discount: product.discount || 0,
      featured: product.featured || false
    });
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.productForm.value;

    setTimeout(() => {
      if (this.isAdding) {
        const newProduct: Omit<Product, 'id'> = {
          name: formValue.name,
          categoryId: parseInt(formValue.categoryId),
          price: parseFloat(formValue.price),
          description: formValue.description,
          imageUrl: formValue.imageUrl,
          stock: parseInt(formValue.stock),
          discount: parseInt(formValue.discount),
          featured: formValue.featured
        };

        this.dataService.addProduct(newProduct);
        this.showToast('Product added successfully!', 'success');
      } else if (this.isEditing && this.currentProduct) {
        const updatedProduct: Product = {
          ...this.currentProduct,
          name: formValue.name,
          categoryId: parseInt(formValue.categoryId),
          price: parseFloat(formValue.price),
          description: formValue.description,
          imageUrl: formValue.imageUrl,
          stock: parseInt(formValue.stock),
          discount: parseInt(formValue.discount),
          featured: formValue.featured
        };

        this.dataService.updateProduct(this.currentProduct.id, updatedProduct);
        this.showToast('Product updated successfully!', 'success');
      }

      this.cancelEdit();
      this.loadProducts();
      this.isLoading = false;
    }, 1000);
  }

  confirmDelete(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  deleteProduct(): void {
    if (this.productToDelete) {
      this.dataService.deleteProduct(this.productToDelete.id);
      this.showToast('Product deleted successfully!', 'success');
      this.closeDeleteModal();
      this.loadProducts();
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.isAdding = false;
    this.currentProduct = null;
    this.imagePreview = null;
    this.productForm.reset();
  }

  // Utility Methods
  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  getDiscountedPrice(product: Product): number {
    return this.dataService.getDiscountedPrice(product);
  }

  getStockStatus(stock: number): { class: string, text: string } {
    if (stock === 0) return { class: 'danger', text: 'Out of Stock' };
    if (stock < 10) return { class: 'warning', text: 'Low Stock' };
    return { class: 'success', text: 'In Stock' };
  }

  updateImagePreview(): void {
    this.imagePreview = this.productForm.get('imageUrl')?.value;
  }

  // Pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Form Validation
  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      this.productForm.get(key)?.markAsTouched();
    });
  }

  // Toast Notification
  private showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    // Implementation similar to previous components
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    toast.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 1060;
      min-width: 300px;
    `;
    toast.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'} me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }

  // Getters for template
  get f() { return this.productForm.controls; }

  get totalProducts(): number {
    return this.filteredProducts.length;
  }

  get showingFrom(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredProducts.length);
  }
  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }
  get inStock(): number {
    return this.products.filter(p => p.stock).length;
  }
  get lowStock(): number {
    return this.products.filter(p => p.stock < 10 && p.stock > 0).length;
  }
  get outOfStock(): number {
    return this.products.filter(p => p.stock === 0).length;
  }
  get featured(): number {
    return this.products.filter(p => p.featured).length;
  }
  get onSale(): number {
    return this.products.filter(p => (p.discount || 0) > 0).length;
  }
}
