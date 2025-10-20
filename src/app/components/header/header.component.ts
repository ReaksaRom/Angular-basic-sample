import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn = false;
  isAdmin = false;
  user: any = null;
  searchQuery = '';
  wishlistCount = 0;

  constructor(
    public dataService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dataService.getAuthState().subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
      this.user = this.dataService.getCurrentUser();
      this.isAdmin = this.dataService.isAdmin();
      if (isAuthenticated) {
        this.dataService.getWishlistItems().subscribe(wishlist => {
          this.wishlistCount = wishlist.length;
        });
      }
    });
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  navigateToOrders(): void {
    this.router.navigate(['/orders']);
  }

  navigateToWishlist(): void {
    this.router.navigate(['/wishlist']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  navigateToAdmin(): void {
    this.router.navigate(['/admin']);
  }
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.dataService.logout();
    this.router.navigate(['/login']);
  }

  searchProducts(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }
}
