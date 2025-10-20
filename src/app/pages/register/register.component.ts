import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router
  ) {
    // ✅ Define form structure and validation
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      agreeToTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // ✅ Getter for easy access to form controls
  get f() { return this.registerForm.controls; }

  // ✅ Check if password and confirmPassword match
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  // ✅ Submit handler
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { name, email, password } = this.registerForm.value;

    // Simulate API call delay
    setTimeout(() => {
      const registered = this.dataService.register({
        name,
        email,
        password,
        // avatar and role are now set inside DataService
        phone: '',
        address: '',
        city: '',
        country: '',
        zipCode: ''
      });

      if (registered) {
        this.router.navigate(['/']);
      } else {
        this.errorMessage = 'Registration failed. This email might already be registered.';
      }

      this.isLoading = false;
    }, 1500);
  }

  // ✅ Toggle show/hide password and confirmPassword
  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // ✅ Mark all form fields as touched
  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  // ✅ Password strength indicator logic
  getPasswordStrength(): { strength: string, width: string, color: string } {
    const password = this.f['password'].value;
    if (!password) return { strength: '', width: '0%', color: '#dc3545' };

    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/\d/)) strength += 25;
    if (password.match(/[^a-zA-Z\d]/)) strength += 25;

    let color = '#dc3545';
    if (strength >= 50) color = '#ffc107';
    if (strength >= 75) color = '#28a745';

    const strengthText = strength < 50 ? 'Weak' : strength < 75 ? 'Fair' : 'Strong';

    return {
      strength: strengthText,
      width: `${strength}%`,
      color: color
    };
  }
}
