import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CartItem } from '../../models/product';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent {
  cartItems: CartItem[] = [];

  constructor(
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartItems = this.dataService.getCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    this.dataService.updateCartItemQuantity(productId, quantity);
    this.cartItems = this.dataService.getCart();
  }

  removeItem(productId: number): void {
    this.dataService.removeFromCart(productId);
    this.cartItems = this.dataService.getCart();
  }

  getSubtotal(): number {
    return this.dataService.getCartTotal();
  }

  getShipping(): number {
    return this.cartItems.length > 0 ? 9.99 : 0;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShipping();
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }
}
