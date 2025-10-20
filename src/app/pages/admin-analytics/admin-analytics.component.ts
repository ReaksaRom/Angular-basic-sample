import { Component } from '@angular/core';
import { Order, Product, User } from '../../models';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-analytics',
  imports: [CommonModule],
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.css'
})
export class AdminAnalyticsComponent {
  // Data
  orders: Order[] = [];
  products: Product[] = [];
  users: User[] = [];

  // UI States
  isLoading = false;
  dateRange = 'month';
  selectedMetric = 'revenue';

  // Date Range Options
  dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' }
  ];

  // Metric Options
  metrics = [
    { value: 'revenue', label: 'Revenue', icon: 'fa-dollar-sign', color: 'success' },
    { value: 'orders', label: 'Orders', icon: 'fa-shopping-cart', color: 'primary' },
    { value: 'customers', label: 'Customers', icon: 'fa-users', color: 'info' },
    { value: 'products', label: 'Products', icon: 'fa-box', color: 'warning' }
  ];

  // Chart Data
  revenueChartData: any = {};
  salesChartData: any = {};
  customerChartData: any = {};
  productChartData: any = {};

  // Key Metrics
  keyMetrics = {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0
  };

  // Top Performers
  topProducts: any[] = [];
  topCustomers: any[] = [];
  recentActivity: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadAnalyticsData();
  }

  loadAnalyticsData(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.orders = this.dataService.getOrders();
      this.products = this.dataService.getProducts();
      this.users = this.dataService['API_DATA'].users.filter(user => user.role === 'customer');

      this.calculateKeyMetrics();
      this.generateChartData();
      this.calculateTopPerformers();
      this.generateRecentActivity();

      this.isLoading = false;
    }, 1000);
  }

  calculateKeyMetrics(): void {
    const filteredOrders = this.filterOrdersByDateRange();

    this.keyMetrics.totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    this.keyMetrics.totalOrders = filteredOrders.length;
    this.keyMetrics.totalCustomers = new Set(filteredOrders.map(order => order.userId)).size;
    this.keyMetrics.avgOrderValue = this.keyMetrics.totalOrders > 0 ? this.keyMetrics.totalRevenue / this.keyMetrics.totalOrders : 0;

    // Calculate growth rates (simulated)
    this.keyMetrics.revenueGrowth = 12.5;
    this.keyMetrics.orderGrowth = 8.3;
    this.keyMetrics.customerGrowth = 15.7;
    this.keyMetrics.conversionRate = 3.2;
  }

  filterOrdersByDateRange(): Order[] {
    const now = new Date();
    let startDate: Date;

    switch (this.dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        startDate = new Date(0); // All time
    }

    return this.orders.filter(order => new Date(order.date) >= startDate);
  }

  generateChartData(): void {
    this.generateRevenueChartData();
    this.generateSalesChartData();
    this.generateCustomerChartData();
    this.generateProductChartData();
  }

  generateRevenueChartData(): void {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentData = [12000, 19000, 15000, 25000, 22000, 30000, 28000, 32000, 35000, 40000, 38000, 42000];
    const previousData = [10000, 15000, 12000, 18000, 20000, 25000, 23000, 28000, 30000, 35000, 32000, 38000];

    this.revenueChartData = {
      labels: months,
      datasets: [
        {
          label: 'Current Year',
          data: currentData,
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Previous Year',
          data: previousData,
          borderColor: '#6c757d',
          backgroundColor: 'rgba(108, 117, 125, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  }

  generateSalesChartData(): void {
    const categories = ['Electronics', 'Audio', 'Laptops', 'Accessories', 'Wearables'];
    const salesData = [45, 25, 15, 10, 5];
    const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1'];

    this.salesChartData = {
      labels: categories,
      datasets: [{
        data: salesData,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  }

  generateCustomerChartData(): void {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const newCustomers = [45, 52, 38, 65, 72, 58];
    const returningCustomers = [120, 135, 110, 145, 160, 140];

    this.customerChartData = {
      labels: months,
      datasets: [
        {
          label: 'New Customers',
          data: newCustomers,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          fill: true
        },
        {
          label: 'Returning Customers',
          data: returningCustomers,
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          fill: true
        }
      ]
    };
  }

  generateProductChartData(): void {
    const products = this.products.slice(0, 5).map(p => p.name);
    const revenue = this.products.slice(0, 5).map(p => p.price * (p.stock > 0 ? 10 : 0)); // Simulated revenue

    this.productChartData = {
      labels: products,
      datasets: [{
        label: 'Revenue',
        data: revenue,
        backgroundColor: '#ffc107',
        borderColor: '#e0a800',
        borderWidth: 1
      }]
    };
  }

  calculateTopPerformers(): void {
    // Top Products by simulated revenue
    this.topProducts = this.products
      .map(product => ({
        ...product,
        revenue: product.price * (product.stock > 0 ? Math.floor(Math.random() * 50) + 10 : 0),
        unitsSold: Math.floor(Math.random() * 100) + 1
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Top Customers by spending
    const customerSpending = new Map<number, number>();
    this.orders.forEach(order => {
      const current = customerSpending.get(order.userId) || 0;
      customerSpending.set(order.userId, current + order.total);
    });

    this.topCustomers = Array.from(customerSpending.entries())
      .map(([userId, total]) => {
        const user = this.users.find(u => u.id === userId) || this.users[0];
        return {
          ...user,
          totalSpent: total,
          orderCount: this.orders.filter(o => o.userId === userId).length
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
  }

  generateRecentActivity(): void {
    this.recentActivity = this.orders
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8)
      .map(order => {
        const user = this.users.find(u => u.id === order.userId) || this.users[0];
        return {
          id: order.id,
          user: user.name,
          action: 'placed an order',
          amount: order.total,
          time: this.getTimeAgo(order.date),
          avatar: user.avatar,
          type: 'order'
        };
      });

    // Add some simulated activities
    this.recentActivity.unshift(
      {
        id: 999,
        user: 'New Customer',
        action: 'created an account',
        amount: 0,
        time: '2 hours ago',
        avatar: 'https://ui-avatars.com/api/?name=New+Customer&background=0D8ABC&color=fff',
        type: 'user'
      },
      {
        id: 998,
        user: 'Inventory System',
        action: 'low stock alert',
        amount: 0,
        time: '4 hours ago',
        avatar: 'https://ui-avatars.com/api/?name=System&background=DC3545&color=fff',
        type: 'alert'
      }
    );
  }

  getTimeAgo(date: string): string {
    const orderDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - orderDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return orderDate.toLocaleDateString();
  }

  getGrowthClass(growth: number): string {
    return growth >= 0 ? 'success' : 'danger';
  }

  getGrowthIcon(growth: number): string {
    return growth >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'order': return 'fa-shopping-cart';
      case 'user': return 'fa-user-plus';
      case 'alert': return 'fa-exclamation-triangle';
      default: return 'fa-circle';
    }
  }

  getActivityColor(type: string): string {
    switch (type) {
      case 'order': return 'primary';
      case 'user': return 'success';
      case 'alert': return 'warning';
      default: return 'secondary';
    }
  }

  exportReport(): void {
    this.showToast('Analytics report exported successfully!', 'success');
  }

  refreshData(): void {
    this.loadAnalyticsData();
    this.showToast('Analytics data refreshed!', 'info');
  }

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

  get getProductStock() {
    return this.products.filter(p => p.stock > 0).length;
  }
  get orderStatus() {
    return this.orders.filter(o => o.status === 'Processing').length;
  }
}
