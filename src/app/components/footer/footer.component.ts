import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  categories: any[] = [];
  socialLinks = [
    { name: 'Facebook', icon: 'fab fa-facebook-f', url: 'https://facebook.com', color: '#3b5998' },
    { name: 'Twitter', icon: 'fab fa-twitter', url: 'https://twitter.com', color: '#1da1f2' },
    { name: 'Instagram', icon: 'fab fa-instagram', url: 'https://instagram.com', color: '#e4405f' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin-in', url: 'https://linkedin.com', color: '#0077b5' },
    { name: 'YouTube', icon: 'fab fa-youtube', url: 'https://youtube.com', color: '#ff0000' }
  ];

  quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Shipping Info', path: '/shipping' },
    { name: 'Returns', path: '/returns' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Sitemap', path: '/sitemap' }
  ];

  customerService = [
    { name: 'My Account', path: '/profile' },
    { name: 'Order History', path: '/orders' },
    { name: 'Wishlist', path: '/wishlist' },
    { name: 'Newsletter', path: '/newsletter' },
    { name: 'Track Order', path: '/track-order' },
    { name: 'Size Guide', path: '/size-guide' },
    { name: 'Gift Cards', path: '/gift-cards' },
    { name: 'Rewards', path: '/rewards' }
  ];

  paymentMethods = [
    { name: 'Visa', icon: 'fab fa-cc-visa', color: '#1a1f71' },
    { name: 'Mastercard', icon: 'fab fa-cc-mastercard', color: '#eb001b' },
    { name: 'PayPal', icon: 'fab fa-cc-paypal', color: '#003087' },
    { name: 'Apple Pay', icon: 'fab fa-cc-apple-pay', color: '#000000' },
    { name: 'Google Pay', icon: 'fab fa-google-wallet', color: '#4285f4' },
    { name: 'Amazon Pay', icon: 'fab fa-cc-amazon-pay', color: '#ff9900' }
  ];

  storeInfo = {
    name: 'TechStore',
    description: 'Your one-stop destination for the latest technology products and gadgets.',
    address: '123 Tech Street, Digital District, Phnom Penh 12000, Cambodia',
    phone: '+855 12 345 678',
    email: 'support@techstore.com',
    hours: 'Mon-Sun: 8:00 AM - 10:00 PM'
  };

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.categories = this.dataService.getCategories();
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  subscribeNewsletter(email: string): void {
    if (email) {
      // In a real application, you would send this to your backend
      console.log('Newsletter subscription:', email);
      alert('Thank you for subscribing to our newsletter!');
    }
  }
}
