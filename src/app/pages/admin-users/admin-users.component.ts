import { Component } from '@angular/core';
import { Order, User } from '../../models';
import { DataService } from '../../services/data.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent {
  users: User[] = [];
  filteredUsers: User[] = [];
  orders: Order[] = [];

  // UI States
  isLoading = false;
  selectedUser: User | null = null;
  showUserModal = false;
  showEditModal = false;
  showDeleteModal = false;
  showCreateModal = false;

  // Search and Filter
  searchTerm = '';
  roleFilter = 'all';
  statusFilter = 'all';
  dateFilter = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Forms
  userForm: FormGroup;
  createUserForm: FormGroup;

  // Filter options
  roleOptions = [
    { value: 'customer', label: 'Customer', class: 'primary' },
    { value: 'admin', label: 'Admin', class: 'danger' }
  ];

  statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'date-new', label: 'Newest' },
    { value: 'date-old', label: 'Oldest' },
    { value: 'orders-desc', label: 'Most Orders' },
    { value: 'orders-asc', label: 'Fewest Orders' },
    { value: 'spent-desc', label: 'Highest Spending' },
    { value: 'spent-asc', label: 'Lowest Spending' }
  ];
  selectedSort = 'date-new';

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['customer', [Validators.required]],
      phone: [''],
      address: [''],
      city: [''],
      country: [''],
      zipCode: ['']
    });

    this.createUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['customer', [Validators.required]],
      phone: [''],
      address: [''],
      city: [''],
      country: [''],
      zipCode: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.orders = this.dataService.getOrders();
  }

  loadUsers(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.users = this.dataService['API_DATA'].users;
      this.applyFilters();
      this.isLoading = false;
    }, 500);
  }

  applyFilters(): void {
    let filtered = [...this.users];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(this.searchTerm))
      );
    }

    // Role filter
    if (this.roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === this.roleFilter);
    }

    // Status filter (placeholder - in real app would have active/inactive status)
    if (this.statusFilter !== 'all') {
      // For demo, consider users with recent orders as active
      if (this.statusFilter === 'active') {
        filtered = filtered.filter(user => this.getUserOrderCount(user.id) > 0);
      } else {
        filtered = filtered.filter(user => this.getUserOrderCount(user.id) === 0);
      }
    }

    // Date filter (based on user creation)
    if (this.dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(user => {
        const userDate = new Date(user.createdAt || '2024-01-01');
        switch (this.dateFilter) {
          case 'today':
            return userDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return userDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            return userDate >= monthAgo;
          case 'year':
            const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            return userDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    this.applySorting(filtered);
  }

  applySorting(users: User[]): void {
    switch (this.selectedSort) {
      case 'name-asc':
        users.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        users.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'date-new':
        users.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        break;
      case 'date-old':
        users.sort((a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime());
        break;
      case 'orders-desc':
        users.sort((a, b) => this.getUserOrderCount(b.id) - this.getUserOrderCount(a.id));
        break;
      case 'orders-asc':
        users.sort((a, b) => this.getUserOrderCount(a.id) - this.getUserOrderCount(b.id));
        break;
      case 'spent-desc':
        users.sort((a, b) => this.getUserTotalSpent(b.id) - this.getUserTotalSpent(a.id));
        break;
      case 'spent-asc':
        users.sort((a, b) => this.getUserTotalSpent(a.id) - this.getUserTotalSpent(b.id));
        break;
    }

    this.filteredUsers = users;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // User Management
  viewUserDetails(user: User): void {
    this.selectedUser = user;
    this.showUserModal = true;
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      country: user.country || '',
      zipCode: user.zipCode || ''
    });
    this.showEditModal = true;
  }

  createUser(): void {
    this.createUserForm.reset({
      role: 'customer'
    });
    this.showCreateModal = true;
  }

  confirmDelete(user: User): void {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  // Form Submissions
  updateUser(): void {
    if (this.userForm.invalid || !this.selectedUser) return;

    const formValue = this.userForm.value;
    const updatedUser: User = {
      ...this.selectedUser,
      ...formValue
    };

    // Update user in the data service
    const userIndex = this.users.findIndex(u => u.id === this.selectedUser!.id);
    if (userIndex !== -1) {
      this.users[userIndex] = updatedUser;
      this.showToast('User updated successfully!', 'success');
      this.closeEditModal();
      this.loadUsers();
    }
  }

  saveNewUser(): void {
    if (this.createUserForm.invalid) return;

    const formValue = this.createUserForm.value;
    const newUser: Omit<User, 'id'> = {
      name: formValue.name,
      email: formValue.email,
      password: formValue.password,
      role: formValue.role,
      phone: formValue.phone,
      address: formValue.address,
      city: formValue.city,
      country: formValue.country,
      zipCode: formValue.zipCode,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formValue.name)}&background=random&color=fff`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Add user to data service
    this.dataService['API_DATA'].users.push({
      ...newUser,
      id: Math.max(...this.users.map(u => u.id)) + 1
    });

    this.showToast('User created successfully!', 'success');
    this.closeCreateModal();
    this.loadUsers();
  }

  deleteUser(): void {
    if (this.selectedUser) {
      // Prevent deleting yourself
      if (this.selectedUser.id === this.dataService.getCurrentUser()?.id) {
        this.showToast('You cannot delete your own account!', 'error');
        return;
      }

      this.dataService['API_DATA'].users = this.users.filter(u => u.id !== this.selectedUser!.id);
      this.showToast('User deleted successfully!', 'success');
      this.closeDeleteModal();
      this.loadUsers();
    }
  }

  // Modal Management
  closeUserModal(): void {
    this.showUserModal = false;
    this.selectedUser = null;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
    this.userForm.reset();
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.createUserForm.reset();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedUser = null;
  }

  // Utility Methods
  getUserOrderCount(userId: number): number {
    return this.orders.filter(order => order.userId === userId).length;
  }

  getUserTotalSpent(userId: number): number {
    return this.orders
      .filter(order => order.userId === userId)
      .reduce((total, order) => total + order.total, 0);
  }

  getUserRecentOrder(userId: number): Order | null {
    const userOrders = this.orders
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return userOrders.length > 0 ? userOrders[0] : null;
  }

  getUserStatus(userId: number): { class: string, text: string } {
    const orderCount = this.getUserOrderCount(userId);
    if (orderCount === 0) {
      return { class: 'warning', text: 'New Customer' };
    } else if (orderCount > 5) {
      return { class: 'success', text: 'Loyal Customer' };
    } else {
      return { class: 'info', text: 'Active Customer' };
    }
  }

  getRoleBadgeClass(role: string): string {
    const roleOption = this.roleOptions.find(r => r.value === role);
    return roleOption ? `bg-${roleOption.class}` : 'bg-secondary';
  }

  getDaysSinceJoined(createdAt: string): string {
    const joinDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
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
  get usersStats() {
    const total = this.filteredUsers.length;
    const customers = this.filteredUsers.filter(u => u.role === 'customer').length;
    const admins = this.filteredUsers.filter(u => u.role === 'admin').length;
    const totalRevenue = this.filteredUsers.reduce((sum, user) => sum + this.getUserTotalSpent(user.id), 0);

    return { total, customers, admins, totalRevenue };
  }

  // Export functionality
  exportUsers(): void {
    this.showToast('Export feature would download user data as CSV', 'info');
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
  get f() { return this.userForm.controls; }
  get cf() { return this.createUserForm.controls; }

  get totalUsers(): number {
    return this.filteredUsers.length;
  }

  get showingFrom(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredUsers.length);
  }

  // Check if current user is viewing their own profile
  isCurrentUser(user: User): boolean {
    return user.id === this.dataService.getCurrentUser()?.id;
  }

  get orderFilter() {
    if (!this.selectedUser) {
      return [];
    }

    return (this.orders || [])
      .filter(o => o.userId === this.selectedUser!.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // latest first
      .slice(0, 3); // show 3 most recent orders
  }
}
