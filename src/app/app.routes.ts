import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { AdminProductsComponent } from './pages/admin-products/admin-products.component';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { WishlistPageComponent } from './pages/wishlist-page/wishlist-page.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminAnalyticsComponent } from './pages/admin-analytics/admin-analytics.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminSettingComponent } from './pages/admin-setting/admin-setting.component';
import { AdminHelpComponent } from './pages/admin-help/admin-help.component';
import { AdminDiscountsComponent } from './pages/admin-discounts/admin-discounts.component';
import { AdminInventoryComponent } from './pages/admin-inventory/admin-inventory.component';

// Import new footer pages (you'll need to create these components)
// import { AboutComponent } from './pages/about/about.component';
// import { ContactComponent } from './pages/contact/contact.component';
// import { FaqComponent } from './pages/faq/faq.component';
// import { ShippingComponent } from './pages/shipping/shipping.component';
// import { ReturnsComponent } from './pages/returns/returns.component';
// import { PrivacyComponent } from './pages/privacy/privacy.component';
// import { TermsComponent } from './pages/terms/terms.component';
// import { SitemapComponent } from './pages/sitemap/sitemap.component';
// import { SearchResultsComponent } from './pages/search-results/search-results.component';
// import { CategoryComponent } from './pages/category/category.component';

export const routes: Routes = [
    // Public routes with User Layout
    {
        path: '',
        component: UserLayoutComponent,
        children: [
            { path: '', component: HomeComponent, data: { title: 'Home - TechStore' } },
            { path: 'login', component: LoginComponent, data: { title: 'Login - TechStore', hideHeader: false } },
            { path: 'register', component: RegisterComponent, data: { title: 'Register - TechStore', hideHeader: false } },
            { path: 'product/:id', component: ProductDetailComponent, data: { title: 'Product Details - TechStore' } },
            { path: 'cart', component: CartPageComponent, data: { title: 'Shopping Cart - TechStore' } },
            //   { path: 'search', component: SearchResultsComponent, data: { title: 'Search Results - TechStore' } },
            //   { path: 'category/:id', component: CategoryComponent, data: { title: 'Category - TechStore' } },

            // Footer pages
            //   { path: 'about', component: AboutComponent, data: { title: 'About Us - TechStore' } },
            //   { path: 'contact', component: ContactComponent, data: { title: 'Contact Us - TechStore' } },
            //   { path: 'faq', component: FaqComponent, data: { title: 'FAQ - TechStore' } },
            //   { path: 'shipping', component: ShippingComponent, data: { title: 'Shipping Info - TechStore' } },
            //   { path: 'returns', component: ReturnsComponent, data: { title: 'Returns Policy - TechStore' } },
            //   { path: 'privacy', component: PrivacyComponent, data: { title: 'Privacy Policy - TechStore' } },
            //   { path: 'terms', component: TermsComponent, data: { title: 'Terms of Service - TechStore' } },
            //   { path: 'sitemap', component: SitemapComponent, data: { title: 'Sitemap - TechStore' } },
        ]
    },

    // Authenticated user routes with User Layout
    {
        path: '',
        component: UserLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'profile', component: ProfileComponent, data: { title: 'My Profile - TechStore' } },
            { path: 'wishlist', component: WishlistPageComponent, data: { title: 'My Wishlist - TechStore' } },
            { path: 'checkout', component: CheckoutComponent, data: { title: 'Checkout - TechStore' } },
            { path: 'orders', component: OrdersComponent, data: { title: 'My Orders - TechStore' } },
            { path: 'order-confirmation/:id', component: OrderConfirmationComponent, data: { title: 'Order Confirmation - TechStore' } },
        ]
    },

    // Admin routes with Admin Layout
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [authGuard, adminGuard],
        data: { title: 'Admin Dashboard' },
        children: [
            { path: '', component: AdminDashboardComponent, data: { title: 'Dashboard', breadcrumb: 'Dashboard' } },
            { path: 'products', component: AdminProductsComponent, data: { title: 'Product Management', breadcrumb: 'Products' } },
            { path: 'orders', component: AdminOrdersComponent, data: { title: 'Order Management', breadcrumb: 'Orders' } },
            { path: 'users', component: AdminUsersComponent, data: { title: 'User Management', breadcrumb: 'Users' } },
            { path: 'analytics', component: AdminAnalyticsComponent, data: { title: 'Analytics', breadcrumb: 'Analytics' } },
            { path: 'inventory', component: AdminInventoryComponent, data: { title: 'Inventory Management', breadcrumb: 'Inventory' } }, // Placeholder
            { path: 'discounts', component: AdminDiscountsComponent, data: { title: 'Discount Management', breadcrumb: 'Discounts' } }, // Placeholder
            { path: 'settings', component: AdminSettingComponent, data: { title: 'Settings', breadcrumb: 'Settings' } }, // Placeholder
            { path: 'help', component: AdminHelpComponent, data: { title: 'Help & Support', breadcrumb: 'Help' } } // Placeholder
        ]
    },

    // Fallback route
    { path: '**', redirectTo: '', pathMatch: 'full' }
];