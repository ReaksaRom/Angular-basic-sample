import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { Order, Product, User } from '../../models';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  [x: string]: any;
  stats = {
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  };

  recentOrders: Order[] = [];
  recentProducts: Product[] = [];
  recentUsers: User[] = [];

  // Chart data
  revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [12000, 19000, 15000, 25000, 22000, 30000],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      fill: true
    }]
  };

  salesData = {
    labels: ['Electronics', 'Audio', 'Laptops', 'Accessories'],
    datasets: [{
      data: [40, 25, 20, 15],
      backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545']
    }]
  };

  constructor(
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const products = this.dataService.getProducts();
    const orders = this.dataService.getOrders();
    const users = this.dataService['API_DATA'].users;

    this.stats = {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalRevenue: orders.reduce((total, order) => total + order.total, 0),
      pendingOrders: orders.filter(order => order.status === 'Processing').length,
      lowStockProducts: products.filter(product => product.stock < 10).length
    };

    this.recentOrders = orders
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    this.recentProducts = products
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);

    this.recentUsers = users
      .filter(user => user.role === 'customer')
      .slice(0, 5);
  }

  getOrderStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-success';
      case 'processing': return 'bg-warning';
      case 'shipped': return 'bg-info';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([`/admin/${route}`]);
  }

  getStockStatus(stock: number): { class: string, text: string } {
    if (stock === 0) return { class: 'text-danger', text: 'Out of Stock' };
    if (stock < 10) return { class: 'text-warning', text: 'Low Stock' };
    return { class: 'text-success', text: 'In Stock' };
  }
  getUserAvatar(userId: number): string {
    const user = this.dataService.getUserById(userId);
    return user ? user.avatar : 'assets/default-avatar.png';
  }

  getUserName(userId: number): string {
    const user = this.dataService.getUserById(userId);
    return user ? user.name : 'Unknown User';
  }
}
