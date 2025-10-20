import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
interface HelpCategory {
  id: number;
  name: string;
  icon: string;
  description: string;
  articles: HelpArticle[];
}

interface HelpArticle {
  id: number;
  title: string;
  content: string;
  popular: boolean;
  lastUpdated: string;
  relatedArticles?: number[];
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  featured: boolean;
}
@Component({
  selector: 'app-admin-help',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-help.component.html',
  styleUrl: './admin-help.component.css'
})
export class AdminHelpComponent {
  // State variables
  activeCategory: string = 'getting-started';
  searchTerm: string = '';
  selectedArticle: HelpArticle | null = null;
  showArticleModal: boolean = false;

  // Help data
  categories: HelpCategory[] = [];
  faqs: FAQ[] = [];
  filteredArticles: HelpArticle[] = [];
  popularArticles: HelpArticle[] = [];

  constructor() { }

  ngOnInit() {
    this.loadHelpData();
    this.loadFAQs();
    this.updateFilteredArticles();
  }

  loadHelpData() {
    this.categories = [
      {
        id: 1,
        name: 'Getting Started',
        icon: 'fas fa-rocket',
        description: 'Learn the basics of managing your store',
        articles: [
          {
            id: 1,
            title: 'Setting Up Your Store',
            content: 'Complete guide to setting up your ecommerce store for the first time...',
            popular: true,
            lastUpdated: '2024-01-15'
          },
          {
            id: 2,
            title: 'Adding Your First Product',
            content: 'Step-by-step instructions for adding products to your inventory...',
            popular: true,
            lastUpdated: '2024-01-10'
          },
          {
            id: 3,
            title: 'Managing Store Settings',
            content: 'How to configure your store settings, payment methods, and shipping options...',
            popular: false,
            lastUpdated: '2024-01-12'
          }
        ]
      },
      {
        id: 2,
        name: 'Product Management',
        icon: 'fas fa-box',
        description: 'Manage products, inventory, and categories',
        articles: [
          {
            id: 4,
            title: 'Inventory Management',
            content: 'How to manage stock levels, track inventory, and set up low stock alerts...',
            popular: true,
            lastUpdated: '2024-01-08'
          },
          {
            id: 5,
            title: 'Product Categories',
            content: 'Creating and organizing product categories for better navigation...',
            popular: false,
            lastUpdated: '2024-01-05'
          },
          {
            id: 6,
            title: 'Bulk Product Operations',
            content: 'Import/export products and perform bulk updates...',
            popular: false,
            lastUpdated: '2024-01-03'
          }
        ]
      },
      {
        id: 3,
        name: 'Order Management',
        icon: 'fas fa-shopping-cart',
        description: 'Process and manage customer orders',
        articles: [
          {
            id: 7,
            title: 'Processing Orders',
            content: 'Step-by-step guide to processing and fulfilling customer orders...',
            popular: true,
            lastUpdated: '2024-01-14'
          },
          {
            id: 8,
            title: 'Order Status & Tracking',
            content: 'Understanding order statuses and setting up order tracking...',
            popular: false,
            lastUpdated: '2024-01-11'
          },
          {
            id: 9,
            title: 'Returns & Refunds',
            content: 'Managing customer returns and processing refunds...',
            popular: false,
            lastUpdated: '2024-01-09'
          }
        ]
      },
      {
        id: 4,
        name: 'Discounts & Promotions',
        icon: 'fas fa-tags',
        description: 'Create and manage discounts and promotions',
        articles: [
          {
            id: 10,
            title: 'Creating Discount Codes',
            content: 'How to create different types of discount codes and promotions...',
            popular: true,
            lastUpdated: '2024-01-13'
          },
          {
            id: 11,
            title: 'Promotion Strategies',
            content: 'Best practices for running successful promotions and sales...',
            popular: false,
            lastUpdated: '2024-01-07'
          },
          {
            id: 12,
            title: 'Bulk Discount Generation',
            content: 'Generating multiple discount codes for marketing campaigns...',
            popular: false,
            lastUpdated: '2024-01-04'
          }
        ]
      },
      {
        id: 5,
        name: 'Analytics & Reports',
        icon: 'fas fa-chart-bar',
        description: 'Understand your store performance',
        articles: [
          {
            id: 13,
            title: 'Sales Analytics',
            content: 'Understanding sales reports and key performance indicators...',
            popular: true,
            lastUpdated: '2024-01-06'
          },
          {
            id: 14,
            title: 'Customer Insights',
            content: 'Analyzing customer behavior and purchase patterns...',
            popular: false,
            lastUpdated: '2024-01-02'
          },
          {
            id: 15,
            title: 'Exporting Reports',
            content: 'How to export and analyze your store data...',
            popular: false,
            lastUpdated: '2024-01-01'
          }
        ]
      },
      {
        id: 6,
        name: 'Settings & Configuration',
        icon: 'fas fa-cog',
        description: 'Configure store settings and preferences',
        articles: [
          {
            id: 16,
            title: 'Payment Gateway Setup',
            content: 'Configuring payment methods and gateway integrations...',
            popular: true,
            lastUpdated: '2024-01-16'
          },
          {
            id: 17,
            title: 'Shipping Configuration',
            content: 'Setting up shipping zones, rates, and delivery options...',
            popular: false,
            lastUpdated: '2024-01-17'
          },
          {
            id: 18,
            title: 'Store Customization',
            content: 'Customizing your store appearance and functionality...',
            popular: false,
            lastUpdated: '2024-01-18'
          }
        ]
      }
    ];

    // Extract popular articles
    this.popularArticles = this.categories
      .flatMap(category => category.articles)
      .filter(article => article.popular)
      .slice(0, 6);
  }

  loadFAQs() {
    this.faqs = [
      {
        id: 1,
        question: 'How do I reset my admin password?',
        answer: 'You can reset your password by clicking on your profile in the top right corner, selecting "Settings", and then "Change Password". If you\'ve forgotten your password, use the "Forgot Password" link on the login page.',
        category: 'Account',
        featured: true
      },
      {
        id: 2,
        question: 'How can I add multiple products at once?',
        answer: 'Use the bulk import feature in the Products section. You can download our CSV template, fill in your product data, and upload it to add multiple products simultaneously.',
        category: 'Products',
        featured: true
      },
      {
        id: 3,
        question: 'What payment methods are supported?',
        answer: 'We support Stripe, PayPal, and manual payment methods. You can configure these in Settings > Payment Methods.',
        category: 'Payments',
        featured: true
      },
      {
        id: 4,
        question: 'How do I set up shipping rates?',
        answer: 'Go to Settings > Shipping to configure shipping zones, rates, and delivery options. You can set up flat rates, free shipping thresholds, and location-based pricing.',
        category: 'Shipping',
        featured: false
      },
      {
        id: 5,
        question: 'Can I customize the order confirmation email?',
        answer: 'Yes, you can customize all email templates in Settings > Email Templates. We provide a visual editor to modify the content and design.',
        category: 'Emails',
        featured: false
      },
      {
        id: 6,
        question: 'How do I process refunds?',
        answer: 'Navigate to the Orders section, select the order you want to refund, and click "Refund". You can choose partial or full refunds, and the system will handle the payment reversal automatically.',
        category: 'Orders',
        featured: false
      },
      {
        id: 7,
        question: 'What analytics are available?',
        answer: 'We provide comprehensive analytics including sales reports, customer insights, product performance, and traffic analysis. Access these from the Analytics dashboard.',
        category: 'Analytics',
        featured: false
      },
      {
        id: 8,
        question: 'How do I create a discount code?',
        answer: 'Go to Discounts > Create Discount. You can set percentage or fixed amount discounts, usage limits, expiration dates, and specific product/category restrictions.',
        category: 'Discounts',
        featured: false
      }
    ];
  }

  onCategoryChange(categoryName: string) {
    this.activeCategory = categoryName;
    this.updateFilteredArticles();
  }

  onSearch() {
    this.updateFilteredArticles();
  }

  updateFilteredArticles() {
    const activeCategory = this.categories.find(cat =>
      cat.name.toLowerCase().replace(' ', '-') === this.activeCategory
    );

    if (activeCategory) {
      if (this.searchTerm.trim()) {
        this.filteredArticles = activeCategory.articles.filter(article =>
          article.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          article.content.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      } else {
        this.filteredArticles = activeCategory.articles;
      }
    } else {
      this.filteredArticles = [];
    }
  }

  openArticle(article: HelpArticle) {
    this.selectedArticle = article;
    this.showArticleModal = true;
  }

  closeArticleModal() {
    this.showArticleModal = false;
    this.selectedArticle = null;
  }

  getFeaturedFAQs(): FAQ[] {
    return this.faqs.filter(faq => faq.featured);
  }

  getFAQsByCategory(category: string): FAQ[] {
    return this.faqs.filter(faq => faq.category === category);
  }

  contactSupport() {
    // In a real application, this would open a support ticket form or email client
    window.location.href = 'mailto:support@techstore.com?subject=Admin%20Support%20Request';
  }

  openDocumentation() {
    // In a real application, this would link to external documentation
    window.open('https://docs.techstore.com', '_blank');
  }

  requestFeature() {
    // In a real application, this would open a feature request form
    window.location.href = 'mailto:features@techstore.com?subject=Feature%20Request';
  }
  get activeCategoryObject(): HelpCategory | undefined {
    return this.categories.find(
      cat => cat.name.toLowerCase().replace(' ', '-') === this.activeCategory
    );
  }
}
