import { Component, Input } from '@angular/core';
import { Review } from '../../models/review';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-reviews',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.css'
})
export class ProductReviewsComponent {
  @Input() productId!: number;
  @Input() showHeader: boolean = true;
  @Input() maxReviews: number = 10;

  reviews: Review[] = [];
  currentUser: User | null = null;
  showReviewForm = false;
  isLoading = false;
  selectedRating = 0;
  hoverRating = 0;

  // Pagination
  currentPage = 1;
  reviewsPerPage = 5;
  totalPages = 1;

  // Filter and sort
  sortBy = 'newest';
  filterByRating = 0;

  reviewForm: FormGroup;

  sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' },
    { value: 'most_helpful', label: 'Most Helpful' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      title: ['', [Validators.required, Validators.minLength(5)]],
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      recommend: [true]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.dataService.getCurrentUser();
    this.loadReviews();

    // Subscribe to authentication state changes
    this.dataService.getAuthState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.currentUser = this.dataService.getCurrentUser();
        } else {
          this.currentUser = null;
          this.showReviewForm = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReviews(): void {
    this.isLoading = true;

    setTimeout(() => {
      const allReviews = this.dataService.getReviews(this.productId);
      this.reviews = this.applyFiltersAndSorting(allReviews);
      this.updatePagination();
      this.isLoading = false;
    }, 500);
  }

  applyFiltersAndSorting(reviews: Review[]): Review[] {
    let filtered = [...reviews];

    // Apply rating filter
    if (this.filterByRating > 0) {
      filtered = filtered.filter(review => review.rating === this.filterByRating);
    }

    // Apply sorting
    switch (this.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'most_helpful':
        // In a real app, you might have helpful votes
        filtered.sort((a, b) => (b.rating * 2) - (a.rating * 2)); // Simulated helpfulness
        break;
    }

    // Apply max reviews limit
    if (this.maxReviews > 0) {
      filtered = filtered.slice(0, this.maxReviews);
    }

    return filtered;
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.reviews.length / this.reviewsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  get paginatedReviews(): Review[] {
    const startIndex = (this.currentPage - 1) * this.reviewsPerPage;
    return this.reviews.slice(startIndex, startIndex + this.reviewsPerPage);
  }

  // Rating methods
  setRating(rating: number): void {
    this.selectedRating = rating;
    this.reviewForm.patchValue({ rating });
  }

  setHoverRating(rating: number): void {
    this.hoverRating = rating;
  }

  clearHoverRating(): void {
    this.hoverRating = 0;
  }

  getStarClass(starIndex: number): string {
    if (this.hoverRating > 0) {
      return starIndex <= this.hoverRating ? 'fas fa-star' : 'far fa-star';
    }
    return starIndex <= this.selectedRating ? 'fas fa-star' : 'far fa-star';
  }

  // Review submission
  openReviewForm(): void {
    if (!this.currentUser) {
      this.showToast('Please login to submit a review', 'warning');
      return;
    }
    this.showReviewForm = true;
    this.resetForm();
  }

  closeReviewForm(): void {
    this.showReviewForm = false;
    this.resetForm();
  }

  resetForm(): void {
    this.selectedRating = 0;
    this.hoverRating = 0;
    this.reviewForm.reset({
      rating: 0,
      title: '',
      comment: '',
      recommend: true
    });
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    if (!this.currentUser) {
      this.showToast('Please login to submit a review', 'error');
      return;
    }

    this.isLoading = true;

    const reviewData = {
      productId: this.productId,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment,
      title: this.reviewForm.value.title,
      recommend: this.reviewForm.value.recommend,
      date: new Date().toISOString()
    };

    setTimeout(() => {
      this.dataService.addReview(reviewData);
      this.showToast('Review submitted successfully!', 'success');
      this.closeReviewForm();
      this.loadReviews();
      this.isLoading = false;
    }, 1000);
  }

  // Utility methods
  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / this.reviews.length;
  }

  getRatingDistribution(): { rating: number, count: number, percentage: number }[] {
    const distribution = [0, 0, 0, 0, 0]; // 1-5 stars

    this.reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++;
      }
    });

    return distribution.map((count, index) => ({
      rating: index + 1,
      count,
      percentage: this.reviews.length > 0 ? (count / this.reviews.length) * 100 : 0
    }));
  }

  getTotalReviews(): number {
    return this.reviews.length;
  }

  getRecommendationPercentage(): number {
    const recommended = this.reviews.filter(review =>
      review.hasOwnProperty('recommend') ? (review as any).recommend : true
    ).length;
    return this.reviews.length > 0 ? (recommended / this.reviews.length) * 100 : 0;
  }

  hasUserReviewed(): boolean {
    if (!this.currentUser) return false;
    return this.reviews.some(review => review.userId === this.currentUser!.id);
  }

  getTimeAgo(date: string): string {
    const reviewDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - reviewDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return 'Today';
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

  // Form validation
  private markFormGroupTouched(): void {
    Object.keys(this.reviewForm.controls).forEach(key => {
      this.reviewForm.get(key)?.markAsTouched();
    });
  }

  // Toast notification
  private showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    toast.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 1060;
      min-width: 300px;
    `;
    toast.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-triangle' : type === 'warning' ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 4000);
  }

  // Getters for template
  get f() { return this.reviewForm.controls; }

  get showingFrom(): number {
    return (this.currentPage - 1) * this.reviewsPerPage + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.reviewsPerPage, this.reviews.length);
  }
  getUserAvatar(userId: number): string {
    // Try to find the user in DataService
    const user = this.dataService.getUserById?.(userId);

    if (user && user.avatar) {
      return user.avatar;
    }

    // Default avatar fallback (using UI Avatars or local asset)
    return `https://ui-avatars.com/api/?name=User+${userId}&background=random&color=fff`;
  }
  getRatingText(rating: number): string {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return '';
    }
  }


}
