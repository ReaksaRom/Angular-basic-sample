import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from '../../models/product';
import { ProductCardComponent } from "../product-card/product-card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnChanges {
  @Input() products: Product[] = [];
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 12;
  @Input() showPagination: boolean = true;
  @Input() gridLayout: 'grid' | 'list' = 'grid'; // New input for layout type

  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();
  @Output() productCartAdd = new EventEmitter<Product>();
  @Output() productWishlistToggle = new EventEmitter<number>();

  // Pagination state
  itemsPerPageOptions = [12, 24, 36, 48];
  private _totalItems: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']) {
      this._totalItems = this.products.length;
      // Ensure current page is valid when products change
      if (this.currentPage > this.totalPages && this.totalPages > 0) {
        this.changePage(this.totalPages);
      }
    }
  }

  // Getters for computed properties
  get totalItems(): number {
    return this._totalItems;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.products.slice(start, end);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  get hasProducts(): boolean {
    return this.products.length > 0;
  }

  get isEmpty(): boolean {
    return this.products.length === 0;
  }

  // Pagination methods
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChange.emit(page);
      this.scrollToTop();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  firstPage(): void {
    if (this.currentPage !== 1) {
      this.changePage(1);
    }
  }

  lastPage(): void {
    if (this.currentPage !== this.totalPages) {
      this.changePage(this.totalPages);
    }
  }

  onItemsPerPageChange(event: any): void {
    const newItemsPerPage = parseInt(event.target.value, 10);
    if (newItemsPerPage !== this.itemsPerPage) {
      this.itemsPerPage = newItemsPerPage;
      this.itemsPerPageChange.emit(newItemsPerPage);
      this.changePage(1); // Reset to first page
    }
  }

  getVisiblePages(): number[] {
    if (this.totalPages <= 1) return [1];

    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  jumpToPage(pageInput: string): void {
    const page = parseInt(pageInput, 10);
    if (!isNaN(page) && page >= 1 && page <= this.totalPages) {
      this.changePage(page);
    }
  }

  // Product event handlers
  onAddToCart(product: Product): void {
    this.productCartAdd.emit(product);
  }

  onToggleWishlist(productId: number): void {
    this.productWishlistToggle.emit(productId);
  }

  // Utility methods
  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Performance optimization
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  // Layout methods
  toggleLayout(): void {
    this.gridLayout = this.gridLayout === 'grid' ? 'list' : 'grid';
  }

  getGridClass(): string {
    return this.gridLayout === 'list' ? 'list-layout' : 'grid-layout';
  }
}