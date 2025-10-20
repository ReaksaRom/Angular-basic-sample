import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { User } from '../../models';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {
  user: User | null = null;
  // isCollapsed = false;
  isMobileMenuOpen = false;

  @Input() isCollapsed = false;
  @Input() isMobileOpen = false;
  @Output() toggle = new EventEmitter<boolean>();
  @Output() closeMobile = new EventEmitter<void>();
  menuItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: 'fas fa-tachometer-alt',
      badge: null,
      isActive: false
    },
    {
      title: 'Products',
      path: '/admin/products',
      icon: 'fas fa-box',
      badge: null,
      isActive: false
    },
    {
      title: 'Orders',
      path: '/admin/orders',
      icon: 'fas fa-shopping-cart',
      badge: '5',
      badgeClass: 'bg-warning',
      isActive: false
    },
    {
      title: 'Customers',
      path: '/admin/users',
      icon: 'fas fa-users',
      badge: null,
      isActive: false
    },
    {
      title: 'Analytics',
      path: '/admin/analytics',
      icon: 'fas fa-chart-bar',
      badge: 'New',
      badgeClass: 'bg-success',
      isActive: false
    },
    {
      title: 'Inventory',
      path: '/admin/inventory',
      icon: 'fas fa-warehouse',
      badge: null,
      isActive: false
    },
    {
      title: 'Discounts',
      path: '/admin/discounts',
      icon: 'fas fa-tag',
      badge: null,
      isActive: false
    }
  ];

  secondaryMenuItems = [
    {
      title: 'Settings',
      path: '/admin/settings',
      icon: 'fas fa-cog',
      badge: null,
      isActive: false
    },
    {
      title: 'Help & Support',
      path: '/admin/help',
      icon: 'fas fa-question-circle',
      badge: null,
      isActive: false
    }
  ];

  quickStats = {
    pendingOrders: 5,
    lowStock: 3,
    newCustomers: 12
  };

  constructor(
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.user = this.dataService.getCurrentUser();
    this.updateActiveState();

    // Listen for route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveState();
      }
    });

    // Load quick stats
    this.loadQuickStats();
  }

  updateActiveState(): void {
    const currentPath = this.router.url;

    // Update main menu items
    this.menuItems.forEach(item => {
      item.isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
    });

    // Update secondary menu items
    this.secondaryMenuItems.forEach(item => {
      item.isActive = currentPath === item.path;
    });
  }

  loadQuickStats(): void {
    // In a real app, you would fetch these from your data service
    const orders = this.dataService.getOrders();
    const products = this.dataService.getProducts();
    const users = this.dataService['API_DATA'].users.filter(user => user.role === 'customer');

    this.quickStats = {
      pendingOrders: orders.filter(order => order.status === 'Processing').length,
      lowStock: products.filter(product => product.stock < 10 && product.stock > 0).length,
      newCustomers: users.filter(user => {

        const joinDate = new Date(user.createdAt || '2024-01-01');
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return joinDate > weekAgo;
      }).length
    };

    // Update badges
    this.menuItems.find(item => item.path === '/admin/orders')!.badge =
      this.quickStats.pendingOrders > 0 ? this.quickStats.pendingOrders.toString() : null;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
    this.closeMobileMenu();
  }



  logout(): void {
    this.dataService.logout();
    this.router.navigate(['/']);
  }

  goToStore(): void {
    this.router.navigate(['/']);
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getStatusClass(): string {
    return this.user?.role === 'admin' ? 'status-online' : 'status-away';
  }

  getStatusText(): string {
    return this.user?.role === 'admin' ? 'Online' : 'Admin';
  }
  // toggleSidebar(): void {
  //   this.isCollapsed = !this.isCollapsed;
  //   this.toggle.emit(this.isCollapsed);
  // }

  toggleMobileMenu(): void {
    this.isMobileOpen = !this.isMobileOpen;
    if (!this.isMobileOpen) {
      this.closeMobile.emit();
    }
  }

  closeMobileMenu(): void {
    this.isMobileOpen = false;
    this.closeMobile.emit();
  }

}
