import { Component } from '@angular/core';

@Component({
  selector: 'app-newsletter',
  imports: [],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css'
})
export class NewsletterComponent {
  email = '';
  isSubscribed = false;

  subscribe(): void {
    if (this.email) {
      this.isSubscribed = true;
      this.email = '';
      setTimeout(() => this.isSubscribed = false, 3000);
    }
  }
}
