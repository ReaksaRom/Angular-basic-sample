import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { Order, User } from '../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  user: User | null = null;
  orders: Order[] = [];
  activeTab = 'profile';
  isLoading = false;
  isEditing = false;
  isChangingPassword = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      city: [''],
      country: [''],
      zipCode: ['']
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadOrders();
  }

  loadUserData(): void {
    this.user = this.dataService.getCurrentUser();
    if (this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone || '',
        address: this.user.address || '',
        city: this.user.city || '',
        country: this.user.country || '',
        zipCode: this.user.zipCode || ''
      });
    }
  }

  loadOrders(): void {
    this.orders = this.dataService.getOrders().slice(0, 5); // Last 5 orders
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  get f() { return this.profileForm.controls; }
  get p() { return this.passwordForm.controls; }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.successMessage = '';
    this.errorMessage = '';
  }

  enableEditing(): void {
    this.isEditing = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.loadUserData(); // Reset form
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      if (this.user) {
        // In a real app, you would call an API to update the user
        const updatedUser = { ...this.user, ...this.profileForm.value };

        // Update user in the service (in a real app, this would be an API call)
        this.successMessage = 'Profile updated successfully!';
        this.isEditing = false;
        this.isLoading = false;

        // Reload user data
        this.loadUserData();
      }
      this.isLoading = false;
    }, 1000);
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.markFormGroupTouched(this.passwordForm);
      return;
    }

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      const { currentPassword, newPassword } = this.passwordForm.value;

      // In a real app, you would verify current password and update it
      if (currentPassword === 'password123') { // Demo check
        this.successMessage = 'Password changed successfully!';
        this.passwordForm.reset();
        this.isChangingPassword = false;
      } else {
        this.errorMessage = 'Current password is incorrect.';
      }

      this.isLoading = false;
    }, 1000);
  }

  enablePasswordChange(): void {
    this.isChangingPassword = true;
    this.passwordForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelPasswordChange(): void {
    this.isChangingPassword = false;
    this.passwordForm.reset();
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

  getOrderTotal(items: any[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  viewOrder(orderId: number): void {
    this.router.navigate(['/orders']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  // Statistics for the dashboard
  get userStats() {
    return {
      totalOrders: this.orders.length,
      totalSpent: this.orders.reduce((total, order) => total + order.total, 0),
      pendingOrders: this.orders.filter(order => order.status === 'Processing').length,
      memberSince: '2024'
    };
  }
}
