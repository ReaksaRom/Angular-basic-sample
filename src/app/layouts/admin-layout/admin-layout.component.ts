import { Component } from '@angular/core';
import { AdminSidebarComponent } from "../../components/admin-sidebar/admin-sidebar.component";
import { NavigationEnd, Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { DataService } from '../../services/data.service';
import { User } from '../../models';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-layout',
  imports: [AdminSidebarComponent, RouterOutlet, RouterLinkWithHref, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  user: User | null = null;
  currentPageTitle = 'Dashboard';
  isSidebarCollapsed = false;
  showMobileSidebar = false;
  showUserDropdown = false; // ✅ added this state

  breadcrumbs: { label: string, url?: string }[] = [];
  private routerSubscription: Subscription;

  quickActions = [
    {
      icon: 'fas fa-plus',
      label: 'Add Product',
      action: 'addProduct',
      class: 'btn-primary'
    },
    {
      icon: 'fas fa-bell',
      label: 'Notifications',
      action: 'notifications',
      badge: '3',
      class: 'btn-warning'
    },
    {
      icon: 'fas fa-cog',
      label: 'Settings',
      action: 'settings',
      class: 'btn-info'
    }
  ];

  private pageTitles: { [key: string]: string } = {
    '/admin': 'Dashboard',
    '/admin/products': 'Product Management',
    '/admin/orders': 'Order Management',
    '/admin/users': 'User Management',
    '/admin/analytics': 'Analytics & Reports',
    '/admin/inventory': 'Inventory Management',
    '/admin/discounts': 'Discounts & Promotions',
    '/admin/settings': 'Settings',
    '/admin/help': 'Help & Support'
  };

  private breadcrumbMap: { [key: string]: { label: string, url?: string }[] } = {
    '/admin': [{ label: 'Dashboard' }],
    '/admin/products': [{ label: 'Dashboard', url: '/admin' }, { label: 'Product' }],
    '/admin/orders': [{ label: 'Dashboard', url: '/admin' }, { label: 'Order' }],
    '/admin/users': [{ label: 'Dashboard', url: '/admin' }, { label: 'User' }],
    '/admin/analytics': [{ label: 'Dashboard', url: '/admin' }, { label: 'Analytics & Reports' }],
    '/admin/inventory': [{ label: 'Dashboard', url: '/admin' }, { label: 'Inventory' }],
    '/admin/discounts': [{ label: 'Dashboard', url: '/admin' }, { label: 'Discounts & Promotions' }],
    '/admin/settings': [{ label: 'Dashboard', url: '/admin' }, { label: 'Settings' }],
    '/admin/help': [{ label: 'Dashboard', url: '/admin' }, { label: 'Help & Support' }]
  };

  constructor(
    private router: Router,
    private dataService: DataService
  ) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updatePageInfo();
        this.closeMobileSidebar();
        this.showUserDropdown = false; // ✅ close dropdown when navigating
      }
    });
  }

  ngOnInit(): void {
    this.user = this.dataService.getCurrentUser();
    this.updatePageInfo();

    const savedState = localStorage.getItem('admin-sidebar-collapsed');
    if (savedState) {
      this.isSidebarCollapsed = JSON.parse(savedState);
    }

    // ✅ close dropdown when clicking outside
    document.addEventListener('click', this.closeDropdownOnOutsideClick.bind(this));
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    document.removeEventListener('click', this.closeDropdownOnOutsideClick.bind(this));
  }

  updatePageInfo(): void {
    const currentUrl = this.router.url;
    this.currentPageTitle = this.pageTitles[currentUrl] || 'Admin Panel';
    this.breadcrumbs = this.breadcrumbMap[currentUrl] || [{ label: 'Admin Panel' }];
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(this.isSidebarCollapsed));
  }

  toggleMobileSidebar(): void {
    this.showMobileSidebar = !this.showMobileSidebar;
  }

  closeMobileSidebar(): void {
    this.showMobileSidebar = false;
  }

  onSidebarToggle(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

  onQuickAction(action: string): void {
    switch (action) {
      case 'addProduct': this.router.navigate(['/admin/products']); break;
      case 'notifications': this.showNotifications(); break;
      case 'settings': this.router.navigate(['/admin/settings']); break;
    }
  }

  private showNotifications(): void {
    alert('You have 3 new notifications!');
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.dataService.logout();
    this.router.navigate(['/']);
  }

  goToStore(): void {
    this.router.navigate(['/']);
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  // ✅ New Dropdown Logic
  toggleUserDropdown(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.showUserDropdown = !this.showUserDropdown;
  }

  private closeDropdownOnOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      this.showUserDropdown = false;
    }
  }
}
