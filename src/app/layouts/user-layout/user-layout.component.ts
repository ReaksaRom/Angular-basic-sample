import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { HeaderComponent } from "../../components/header/header.component";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { Toast } from '../../models/toast';

@Component({
  selector: 'app-user-layout',
  imports: [FooterComponent, RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})
export class UserLayoutComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private notificationSubscription!: Subscription;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    // Subscribe to notification service
    this.notificationSubscription = this.notificationService.toasts$.subscribe(
      (toasts) => {
        this.toasts = toasts;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  getToastIcon(type: string): string {
    const icons: { [key: string]: string } = {
      success: 'fas fa-check-circle text-success',
      error: 'fas fa-exclamation-circle text-danger',
      warning: 'fas fa-exclamation-triangle text-warning',
      info: 'fas fa-info-circle text-info',
      primary: 'fas fa-bell text-primary'
    };
    return icons[type] || 'fas fa-bell text-primary';
  }

  removeToast(toastId: string): void {
    this.notificationService.removeToast(toastId);
  }

  getToastClass(toast: Toast): string {
    const baseClass = 'notification-toast';
    const typeClass = `toast-${toast.type}`;
    const positionClass = `toast-${toast.position || 'top-right'}`;

    return `${baseClass} ${typeClass} ${positionClass}`;
  }
}