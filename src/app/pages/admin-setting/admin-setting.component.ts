import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-setting',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-setting.component.html',
  styleUrl: './admin-setting.component.css'
})
export class AdminSettingComponent {
  settingsForm!: FormGroup;
  storeSettingsForm!: FormGroup;
  notificationSettingsForm!: FormGroup;
  shippingSettingsForm!: FormGroup;

  isLoading = false;
  isSaving = false;
  activeTab = 'general';

  // Available themes and currencies
  themes = [
    { id: 'light', name: 'Light Theme', description: 'Clean light interface' },
    { id: 'dark', name: 'Dark Theme', description: 'Dark mode for reduced eye strain' },
    { id: 'auto', name: 'Auto', description: 'Follow system preference' }
  ];

  currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'KHR', symbol: '៛', name: 'Cambodian Riel' },
    { code: 'GBP', symbol: '£', name: 'British Pound' }
  ];

  timezones = [
    'UTC',
    'America/New_York',
    'Europe/London',
    'Asia/Phnom_Penh',
    'Asia/Bangkok',
    'Asia/Singapore'
  ];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.initializeForms();
    this.loadSettings();
  }

  initializeForms() {
    // General Settings Form
    this.settingsForm = this.fb.group({
      storeName: ['TechStore', [Validators.required, Validators.minLength(3)]],
      storeEmail: ['admin@techstore.com', [Validators.required, Validators.email]],
      storePhone: ['+855123456789', Validators.required],
      storeAddress: ['123 Tech Street, Phnom Penh', Validators.required],
      currency: ['USD', Validators.required],
      timezone: ['Asia/Phnom_Penh', Validators.required],
      language: ['en', Validators.required],
      theme: ['light', Validators.required]
    });

    // Store Settings Form
    this.storeSettingsForm = this.fb.group({
      maintenanceMode: [false],
      allowRegistration: [true],
      requireEmailVerification: [false],
      enableWishlist: [true],
      enableReviews: [true],
      enableRatings: [true],
      minOrderAmount: [0],
      freeShippingAmount: [50],
      taxRate: [10, [Validators.min(0), Validators.max(100)]]
    });

    // Notification Settings Form
    this.notificationSettingsForm = this.fb.group({
      emailNotifications: [true],
      orderNotifications: [true],
      lowStockNotifications: [true],
      newUserNotifications: [true],
      salesReports: [true],
      reportFrequency: ['daily'],
      adminEmail: ['admin@techstore.com', Validators.email]
    });

    // Shipping Settings Form
    this.shippingSettingsForm = this.fb.group({
      enableShipping: [true],
      shippingMethod: ['flat_rate'],
      flatRate: [5, [Validators.min(0)]],
      freeShippingEnabled: [true],
      localDelivery: [false],
      deliveryRadius: [10],
      deliveryFee: [2]
    });
  }

  loadSettings() {
    this.isLoading = true;

    // Simulate API call to load settings
    setTimeout(() => {
      // In a real app, you would load these from your backend
      const mockSettings = {
        storeName: 'TechStore',
        storeEmail: 'admin@techstore.com',
        storePhone: '+855123456789',
        storeAddress: '123 Tech Street, Phnom Penh',
        currency: 'USD',
        timezone: 'Asia/Phnom_Penh',
        language: 'en',
        theme: 'light'
      };

      this.settingsForm.patchValue(mockSettings);
      this.isLoading = false;
    }, 1000);
  }

  onTabChange(tab: string) {
    this.activeTab = tab;
  }

  saveGeneralSettings() {
    if (this.settingsForm.valid) {
      this.isSaving = true;
      console.log('Saving general settings:', this.settingsForm.value);

      // Simulate API call
      setTimeout(() => {
        this.isSaving = false;
        this.showSuccessMessage('General settings updated successfully!');
      }, 1500);
    }
  }

  saveStoreSettings() {
    if (this.storeSettingsForm.valid) {
      this.isSaving = true;
      console.log('Saving store settings:', this.storeSettingsForm.value);

      setTimeout(() => {
        this.isSaving = false;
        this.showSuccessMessage('Store settings updated successfully!');
      }, 1500);
    }
  }

  saveNotificationSettings() {
    if (this.notificationSettingsForm.valid) {
      this.isSaving = true;
      console.log('Saving notification settings:', this.notificationSettingsForm.value);

      setTimeout(() => {
        this.isSaving = false;
        this.showSuccessMessage('Notification settings updated successfully!');
      }, 1500);
    }
  }

  saveShippingSettings() {
    if (this.shippingSettingsForm.valid) {
      this.isSaving = true;
      console.log('Saving shipping settings:', this.shippingSettingsForm.value);

      setTimeout(() => {
        this.isSaving = false;
        this.showSuccessMessage('Shipping settings updated successfully!');
      }, 1500);
    }
  }

  resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      this.initializeForms();
      this.showSuccessMessage('Settings reset to default values!');
    }
  }

  exportSettings() {
    const settings = {
      general: this.settingsForm.value,
      store: this.storeSettingsForm.value,
      notifications: this.notificationSettingsForm.value,
      shipping: this.shippingSettingsForm.value
    };

    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'techstore-settings-backup.json';
    link.click();

    this.showSuccessMessage('Settings exported successfully!');
  }

  importSettings(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const settings = JSON.parse(e.target.result);
          // Validate and apply settings
          if (settings.general) this.settingsForm.patchValue(settings.general);
          if (settings.store) this.storeSettingsForm.patchValue(settings.store);
          if (settings.notifications) this.notificationSettingsForm.patchValue(settings.notifications);
          if (settings.shipping) this.shippingSettingsForm.patchValue(settings.shipping);

          this.showSuccessMessage('Settings imported successfully!');
        } catch (error) {
          this.showErrorMessage('Invalid settings file format!');
        }
      };
      reader.readAsText(file);
    }
  }

  private showSuccessMessage(message: string) {
    // You can integrate with your toast service
    alert(message); // Replace with toast service
  }

  private showErrorMessage(message: string) {
    alert(message); // Replace with toast service
  }
  get themeDisplay() {
    const selectedId = this.settingsForm.get('theme')?.value;
    return this.themes.find(t => t.id === selectedId)?.description ?? '';
  }

}
