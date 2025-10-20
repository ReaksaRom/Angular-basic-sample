import { Injectable } from '@angular/core';
import { Toast } from '../models/toast';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private readonly DEFAULT_DURATION = 5000; // 5 seconds

  showToast(toast: Omit<Toast, 'id' | 'timestamp' | 'progress'>): string {
    const newToast: Toast = {
      ...toast,
      id: this.generateId(),
      timestamp: Date.now(),
      progress: 100,
      autoDismiss: toast.autoDismiss ?? true,
      duration: toast.duration ?? this.DEFAULT_DURATION
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, newToast]);

    // Auto dismiss if enabled
    if (newToast.autoDismiss) {
      this.startAutoDismiss(newToast.id, newToast.duration!);
    }

    return newToast.id;
  }

  success(title: string, message: string, options?: Partial<Toast>): string {
    return this.showToast({
      type: 'success',
      title,
      message,
      ...options
    });
  }

  error(title: string, message: string, options?: Partial<Toast>): string {
    return this.showToast({
      type: 'error',
      title,
      message,
      ...options
    });
  }

  warning(title: string, message: string, options?: Partial<Toast>): string {
    return this.showToast({
      type: 'warning',
      title,
      message,
      ...options
    });
  }

  info(title: string, message: string, options?: Partial<Toast>): string {
    return this.showToast({
      type: 'info',
      title,
      message,
      ...options
    });
  }

  removeToast(toastId: string): void {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(toast => toast.id !== toastId));
  }

  clearAll(): void {
    this.toastsSubject.next([]);
  }

  private startAutoDismiss(toastId: string, duration: number): void {
    const startTime = Date.now();
    const interval = 50; // Update every 50ms for smooth progress

    const updateProgress = () => {
      const currentToasts = this.toastsSubject.value;
      const toast = currentToasts.find(t => t.id === toastId);

      if (!toast) return;

      const elapsed = Date.now() - toast.timestamp;
      const progress = Math.max(0, 100 - (elapsed / duration) * 100);

      if (progress <= 0) {
        this.removeToast(toastId);
        return;
      }

      // Update progress
      const updatedToasts = currentToasts.map(t =>
        t.id === toastId ? { ...t, progress } : t
      );
      this.toastsSubject.next(updatedToasts);

      if (progress > 0) {
        setTimeout(updateProgress, interval);
      }
    };

    setTimeout(updateProgress, interval);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
