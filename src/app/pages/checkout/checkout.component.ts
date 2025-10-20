import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  cartItems: any[] = [];
  user: any;

  // Form fields
  shippingInfo = {
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  };

  paymentInfo = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  };

  constructor(
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartItems = this.dataService.getCart();
    this.user = this.dataService.getCurrentUser();

    // Pre-fill user data
    this.shippingInfo.fullName = this.user.name;

    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  getSubtotal(): number {
    return this.dataService.getCartTotal();
  }

  getShipping(): number {
    return 9.99;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShipping();
  }

  placeOrder(): void {
    if (!this.user) {
      alert('Please log in before placing an order.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.isFormValid()) {
      alert('Please fill in all required fields.');
      return;
    }

    const orderData = {
      shippingAddress: {
        fullName: this.shippingInfo.fullName,
        address: this.shippingInfo.address,
        city: this.shippingInfo.city,
        zipCode: this.shippingInfo.zipCode,
        country: this.shippingInfo.country
      },
      paymentInfo: {
        cardNumber: this.paymentInfo.cardNumber,
        expiryDate: this.paymentInfo.expiryDate,
        cvv: this.paymentInfo.cvv,
        nameOnCard: this.paymentInfo.nameOnCard
      }
    };

    const orderId = this.dataService.createOrder(orderData);
    if (orderId) {
      this.router.navigate(['/order-confirmation', orderId]);
    } else {
      alert('Something went wrong while placing your order.');
    }
  }

  isFormValid(): boolean {
    return !!(
      this.shippingInfo.fullName &&
      this.shippingInfo.address &&
      this.shippingInfo.city &&
      this.shippingInfo.zipCode &&
      this.shippingInfo.country &&
      this.paymentInfo.cardNumber &&
      this.paymentInfo.expiryDate &&
      this.paymentInfo.cvv &&
      this.paymentInfo.nameOnCard
    );
  }
}
