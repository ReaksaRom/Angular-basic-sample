import { Component } from '@angular/core';
import { Order, User } from '../../models';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-orders',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  users: User[] = [];

  // UI States
  isLoading = false;
  selectedOrder: Order | null = null;
  showOrderModal = false;
  showStatusModal = false;

  // Search and Filter
  searchTerm = '';
  statusFilter = 'all';
  dateFilter = 'all';
  customerFilter = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Status Options
  statusOptions = [
    { value: 'pending', label: 'Pending', class: 'warning' },
    { value: 'confirmed', label: 'Confirmed', class: 'info' },
    { value: 'processing', label: 'Processing', class: 'primary' },
    { value: 'shipped', label: 'Shipped', class: 'info' },
    { value: 'delivered', label: 'Delivered', class: 'success' },
    { value: 'cancelled', label: 'Cancelled', class: 'danger' },
    { value: 'refunded', label: 'Refunded', class: 'secondary' }
  ];

  // Date filter options
  dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  // Sort options
  sortOptions = [
    { value: 'date-desc', label: 'Date (Newest)' },
    { value: 'date-asc', label: 'Date (Oldest)' },
    { value: 'total-desc', label: 'Total (High to Low)' },
    { value: 'total-asc', label: 'Total (Low to High)' },
    { value: 'status', label: 'Status' }
  ];
  selectedSort = 'date-desc';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadOrders();
    this.users = this.dataService['API_DATA'].users.filter(user => user.role === 'customer');
  }

  loadOrders(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.orders = this.dataService.getOrders();
      this.applyFilters();
      this.isLoading = false;
    }, 500);
  }

  applyFilters(): void {
    let filtered = [...this.orders];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toString().includes(this.searchTerm) ||
        this.getUserName(order.userId).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.items.some(item =>
          this.getProductName(item.productId).toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    }

    // Status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status.toLowerCase() === this.statusFilter);
    }

    // Customer filter
    if (this.customerFilter !== 'all') {
      filtered = filtered.filter(order => order.userId === parseInt(this.customerFilter));
    }

    // Date filter
    if (this.dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date);
        switch (this.dateFilter) {
          case 'today':
            return orderDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            return orderDate >= monthAgo;
          case 'year':
            const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            return orderDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    this.applySorting(filtered);
  }

  applySorting(orders: Order[]): void {
    switch (this.selectedSort) {
      case 'date-desc':
        orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'date-asc':
        orders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'total-desc':
        orders.sort((a, b) => b.total - a.total);
        break;
      case 'total-asc':
        orders.sort((a, b) => a.total - b.total);
        break;
      case 'status':
        orders.sort((a, b) => a.status.localeCompare(b.status));
        break;
    }

    this.filteredOrders = orders;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  get paginatedOrders(): Order[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Order Management
  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.showOrderModal = true;
  }

  updateOrderStatus(order: Order, newStatus: string): void {
    this.selectedOrder = order;
    this.showStatusModal = true;
  }

  confirmStatusUpdate(): void {
    if (this.selectedOrder) {
      const previousStatus = this.selectedOrder.status;
      this.dataService.updateOrderStatus(this.selectedOrder.id, this.selectedOrder.status);
      this.showToast(`Order #${this.selectedOrder.id} status updated from ${previousStatus} to ${this.selectedOrder.status}`, 'success');
      this.closeStatusModal();
      this.loadOrders();
    }
  }

  closeOrderModal(): void {
    this.showOrderModal = false;
    this.selectedOrder = null;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.selectedOrder = null;
  }

  // Utility Methods
  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : 'Unknown Customer';
  }

  getUserAvatar(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.avatar : 'https://ui-avatars.com/api/?name=Customer&background=ccc&color=fff';
  }

  getUserEmail(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.email : 'N/A';
  }

  getProductName(productId: number): string {
    const product = this.dataService.getProductById(productId);
    return product ? product.name : 'Unknown Product';
  }

  getProductImage(productId: number): string {
    const product = this.dataService.getProductById(productId);
    return product ? product.imageUrl : 'https://via.placeholder.com/60?text=Product';
  }

  getOrderStatusBadgeClass(status: string): string {
    const statusOption = this.statusOptions.find(s => s.value === status.toLowerCase());
    return statusOption ? `bg-${statusOption.class}` : 'bg-secondary';
  }

  getOrderItemsTotal(items: any[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getStatusProgress(order: Order): number {
    const statusWeights: { [key: string]: number } = {
      'pending': 10,
      'confirmed': 25,
      'processing': 50,
      'shipped': 75,
      'delivered': 100,
      'cancelled': 0,
      'refunded': 0
    };
    return statusWeights[order.status.toLowerCase()] || 0;
  }

  getDaysAgo(date: string): string {
    const orderDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - orderDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  }

  // Pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Stats
  get ordersStats() {
    const total = this.filteredOrders.length;
    const revenue = this.filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const pending = this.filteredOrders.filter(o => o.status === 'Processing').length;
    const delivered = this.filteredOrders.filter(o => o.status === 'Delivered').length;
    const cancelled = this.filteredOrders.filter(o => o.status === 'Cancelled').length;

    return { total, revenue, pending, delivered, cancelled };
  }

  // Export functionality
  exportOrders(): void {
    this.showToast('Export feature would download order data as CSV', 'info');
  }

  // Toast Notification
  private showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
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
  get totalOrders(): number {
    return this.filteredOrders.length;
  }

  get showingFrom(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredOrders.length);
  }
}
