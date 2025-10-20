import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Order } from '../../models/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  orders: Order[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.orders = this.dataService.getOrders();
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-success';
      case 'processing':
        return 'bg-warning';
      case 'shipped':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  getProductName(productId: number): string {
    const product = this.dataService.getProductById(productId);
    return product ? product.name : 'Unknown Product';
  }
}
