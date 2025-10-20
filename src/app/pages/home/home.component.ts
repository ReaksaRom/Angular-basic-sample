import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { Review } from '../../models/review';
import { DataService } from '../../services/data.service';
import { ProductListComponent } from "../../components/product-list/product-list.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from '../../components/pipe/truncate.pipe';

@Component({
  selector: 'app-home',
  imports: [ProductListComponent, CommonModule, FormsModule, TruncatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  reviews: Review[] = [];
  selectedCategory: number | null = null;
  searchTerm: string = '';
  priceRange: number = 500;
  minPrice: number = 0;
  maxPrice: number = 1000;
  selectedBrands: string[] = [];
  selectedRatings: number[] = [];
  sortBy: string = 'name';
  showFilters: boolean = false;
  discountFilter: string = 'all';

  // Brands will be extracted dynamically from products
  brands: string[] = [];

  // Filter options
  availabilityOptions = [
    { id: 'in-stock', name: 'In Stock', checked: false },
    { id: 'out-of-stock', name: 'Out of Stock', checked: false }
  ];

  // Discount options
  discountOptions = [
    { id: 'all', name: 'All Discounts' },
    { id: 'none', name: 'No Discount' },
    { id: '10', name: '10% or more' },
    { id: '20', name: '20% or more' },
    { id: '30', name: '30% or more' },
    { id: '50', name: '50% or more' }
  ];

  // Carousel images
  topCarouselImages = [
    {
      url: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      title: 'Summer Collection',
      description: 'Discover the latest trends for this season'
    },
    {
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      title: 'Flash Sale',
      description: 'Up to 50% off on selected items'
    },
    {
      url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      title: 'New Arrivals',
      description: 'Fresh styles added daily'
    }
  ];

  sidebarCarouselImages = [
    {
      url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=80',
      title: 'Free Shipping'
    },
    {
      url: 'https://images.unsplash.com/photo-1563013541-5b0a4c58f6f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=80',
      title: 'Member Discounts'
    },
    {
      url: 'https://images.unsplash.com/photo-1560769624-6b9e66d5c85c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=80',
      title: 'Gift Cards'
    }
  ];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.categories = this.dataService.getCategories();
    this.reviews = this.getAllReviews();
    this.initializeBrands();
    this.initializePriceRange();
  }

  // Extract brands from products
  initializeBrands(): void {
    const brandSet = new Set<string>();
    this.products.forEach(product => {
      // Extract brand from product name (first word)
      const brand = product.name.split(' ')[0];
      brandSet.add(brand);
    });
    this.brands = Array.from(brandSet).sort();
  }

  initializePriceRange(): void {
    if (this.products.length > 0) {
      const prices = this.products.map(p => p.price);
      this.minPrice = Math.floor(Math.min(...prices));
      this.maxPrice = Math.ceil(Math.max(...prices));
      this.priceRange = this.maxPrice;
    }
  }

  loadProducts(): void {
    if (this.selectedCategory) {
      this.products = this.dataService.getProductsByCategory(this.selectedCategory);
    } else {
      this.products = this.dataService.getProducts();
    }
    this.initializeBrands();
    this.initializePriceRange();
  }

  // Get all reviews (since your service has getReviews(productId) but we need all)
  getAllReviews(): Review[] {
    // Since your service only has getReviews(productId), we'll get reviews for all products
    const allReviews: Review[] = [];
    this.products.forEach(product => {
      const productReviews = this.dataService.getReviews(product.id);
      allReviews.push(...productReviews);
    });
    return allReviews;
  }

  // Calculate average rating for a product from reviews using service method
  getProductRating(productId: number): number {
    return this.dataService.getAverageRating(productId);
  }

  // Get review count for a product
  getProductReviewCount(productId: number): number {
    return this.dataService.getReviews(productId).length;
  }

  // Get products with their calculated ratings
  getProductsWithRatings(): any[] {
    return this.products.map(product => ({
      ...product,
      rating: this.getProductRating(product.id),
      reviewCount: this.getProductReviewCount(product.id),
      discountPercentage: product.discount || 0,
      discountedPrice: this.dataService.getDiscountedPrice(product),
      brand: product.name.split(' ')[0] // Extract brand from name
    }));
  }

  filterByCategory(categoryId: number | null): void {
    this.selectedCategory = categoryId;
    this.loadProducts();
  }

  get filteredProducts(): any[] {
    let productsWithRatings = this.getProductsWithRatings();

    // Search filter
    if (this.searchTerm) {
      productsWithRatings = productsWithRatings.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Price filter
    productsWithRatings = productsWithRatings.filter(product => product.price <= this.priceRange);

    // Brand filter
    if (this.selectedBrands.length > 0) {
      productsWithRatings = productsWithRatings.filter(product =>
        this.selectedBrands.includes(product.brand)
      );
    }

    // Rating filter - Filter by average rating from reviews
    if (this.selectedRatings.length > 0) {
      productsWithRatings = productsWithRatings.filter(product =>
        this.selectedRatings.some(rating => product.rating >= rating)
      );
    }

    // Availability filter
    const inStockSelected = this.availabilityOptions.find(opt => opt.id === 'in-stock')?.checked;
    const outOfStockSelected = this.availabilityOptions.find(opt => opt.id === 'out-of-stock')?.checked;

    if (inStockSelected && !outOfStockSelected) {
      productsWithRatings = productsWithRatings.filter(product => product.stock > 0);
    } else if (!inStockSelected && outOfStockSelected) {
      productsWithRatings = productsWithRatings.filter(product => product.stock === 0);
    }

    // Discount filter
    if (this.discountFilter !== 'all') {
      switch (this.discountFilter) {
        case 'none':
          productsWithRatings = productsWithRatings.filter(product => !product.discountPercentage || product.discountPercentage === 0);
          break;
        case '10':
          productsWithRatings = productsWithRatings.filter(product => product.discountPercentage >= 10);
          break;
        case '20':
          productsWithRatings = productsWithRatings.filter(product => product.discountPercentage >= 20);
          break;
        case '30':
          productsWithRatings = productsWithRatings.filter(product => product.discountPercentage >= 30);
          break;
        case '50':
          productsWithRatings = productsWithRatings.filter(product => product.discountPercentage >= 50);
          break;
      }
    }

    // Sorting
    productsWithRatings = this.sortProducts(productsWithRatings);

    return productsWithRatings;
  }

  sortProducts(products: any[]): any[] {
    const sortedProducts = [...products];
    switch (this.sortBy) {
      case 'price-low':
        return sortedProducts.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sortedProducts.sort((a, b) => b.price - a.price);
      case 'rating':
        return sortedProducts.sort((a, b) => b.rating - a.rating);
      case 'review-count':
        return sortedProducts.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'discount':
        return sortedProducts.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
      case 'name':
      default:
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  onBrandChange(brand: string, event: any): void {
    if (event.target.checked) {
      this.selectedBrands.push(brand);
    } else {
      this.selectedBrands = this.selectedBrands.filter(b => b !== brand);
    }
  }

  onRatingChange(rating: number, event: any): void {
    if (event.target.checked) {
      this.selectedRatings.push(rating);
    } else {
      this.selectedRatings = this.selectedRatings.filter(r => r !== rating);
    }
  }

  onAvailabilityChange(optionId: string, event: any): void {
    const option = this.availabilityOptions.find(opt => opt.id === optionId);
    if (option) {
      option.checked = event.target.checked;
    }
  }

  clearAllFilters(): void {
    this.selectedCategory = null;
    this.searchTerm = '';
    this.priceRange = this.maxPrice;
    this.selectedBrands = [];
    this.selectedRatings = [];
    this.discountFilter = 'all';
    this.availabilityOptions.forEach(opt => opt.checked = false);
    this.sortBy = 'name';
    this.loadProducts();
  }

  get selectedCategoryName(): string | undefined {
    const category = this.categories?.find((c: any) => c.id === this.selectedCategory);
    return category ? category.name : undefined;
  }

  getCategoryProductCount(categoryId: number): number {
    return this.dataService.getProductsByCategory(categoryId).length;
  }

  getActiveFilterCount(): number {
    let count = 0;
    if (this.selectedCategory) count++;
    if (this.searchTerm) count++;
    if (this.priceRange < this.maxPrice) count++;
    if (this.selectedBrands.length > 0) count++;
    if (this.selectedRatings.length > 0) count++;
    if (this.discountFilter !== 'all') count++;
    if (this.availabilityOptions.some(opt => opt.checked)) count++;
    return count;
  }

  // Get top rated products for display
  getTopRatedProducts(limit: number = 3): any[] {
    const productsWithRatings = this.getProductsWithRatings();
    return productsWithRatings
      .filter(product => product.rating > 0 && product.reviewCount > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  // Get products with most reviews
  getMostReviewedProducts(limit: number = 3): any[] {
    const productsWithRatings = this.getProductsWithRatings();
    return productsWithRatings
      .filter(product => product.reviewCount > 0)
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, limit);
  }

  // Get count of products with specific minimum rating
  getProductsCountByRating(minRating: number): number {
    const productsWithRatings = this.getProductsWithRatings();
    return productsWithRatings.filter(product => product.rating >= minRating).length;
  }

  // Get featured products
  getFeaturedProducts(limit: number = 3): any[] {
    const productsWithRatings = this.getProductsWithRatings();
    return productsWithRatings
      .filter(product => product.featured)
      .slice(0, limit);
  }

  // Get discounted products
  getDiscountedProducts(limit: number = 3): any[] {
    const productsWithRatings = this.getProductsWithRatings();
    return productsWithRatings
      .filter(product => product.discountPercentage > 0)
      .sort((a, b) => b.discountPercentage - a.discountPercentage)
      .slice(0, limit);
  }
}