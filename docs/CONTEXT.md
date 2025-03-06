# Supply Chain Dashboard for Hydropathy Industries (WEB APPLICATION!!!)

## Overview

The supply chain dashboard for Hydropathy Industries is designed to streamline the procurement process, monitor price fluctuations from various vendors, and provide real-time insights for better decision-making. The application will integrate data collection, storage, and visualization functionalities to address the challenges faced by the company.

---

## Application Flow

### 1. **User Authentication and Role-Based Access**

- **Admin Login**: Owners and key personnel will have full access to the system.
- **Employee Login**: Restricted access to only necessary modules.
- **Vendor Login**: Vendors can submit quotations and update pricing.

### 2. **Dashboard Overview**

- **Real-time procurement insights**: Displays total purchases, vendor performance, and price trends.
- **Pending Requests**: Shows procurement requests that need approval.
- **Price Trend Analysis**: Historical data visualization of fluctuating vendor prices.
- **Recent Transactions**: List of recently purchased items and vendors.

### 3. **Procurement Process**

- **Requirement Generation**: Employees enter required materials or products.
- **Data Collection & Storage**:
  - Data is fetched from past records and live vendor inputs.
  - Pricing trends and past purchases are stored in a database.
- **Vendor Selection & Comparison**:
  - Vendors submit quotations.
  - Automated price comparison and ranking.
- **Approval Workflow**:
  - Admin reviews and approves purchase orders.
  - Automatic notifications to selected vendors.

### 4. **Automated Vendor Notification & Response System**

- **Existing Vendor Records**: The system maintains past records of all vendors along with their quality ratings and reviews.
- **Automated Notifications**:
  - Whenever an admin places a demand for a particular item or a list of items, an email and SMS notification is sent to all relevant vendors.
  - Vendors can reply directly to the email or SMS with their offer prices.
- **Automated Offer Processing**:
  - The system scans incoming vendor responses and extracts the offer prices.
  - The extracted prices are displayed on the owner's order dashboard, sorted by the best vendor based on ratings and reviews.
- **Reduction in Manual Work**: This eliminates the need for the admin to call multiple vendors manually, streamlining procurement.

### 5. **Marketplace for Vendors**

- **Localized Vendor Marketplace**:
  - A marketplace for local city vendors and other suppliers where they can list their products and pricing.
  - Similar to platforms like IndiaMART or other e-commerce marketplaces.
- **Real-time Price Updates**:
  - Vendors can update their prices dynamically.
  - Industry owners can view real-time price changes on the marketplace.
- **Direct Ordering & Contact**:
  - Buyers can place orders directly through the platform.
  - Option to contact the supplier for negotiations or queries.

### 6. **Vendor Management**

- **Vendor Registration**: Onboarding of new vendors with their details.
- **Quotation Submission**: Vendors update prices directly via the dashboard.
- **Price Monitoring**:
  - Historical data of each vendor’s pricing.
  - Alerts for significant price changes.
- **Performance Analysis**:
  - Metrics on delivery time, price consistency, and quality.

### 7. **Inventory Management**

- **Stock Level Monitoring**:
  - Updates on available materials and alert notifications.
- **Purchase Order Management**:
  - Track ongoing and completed purchase orders.
- **Usage Analysis**:
  - Reports on material consumption trends.

### 8. **Reports & Analytics**

- **Price Trends**: Insights into fluctuating vendor pricing.
- **Purchase History**: Breakdown of past procurements.
- **Cost Analysis**: Identifies areas for cost reduction.
- **Vendor Performance Reports**: Tracks reliability and pricing trends.

### 9. **Notifications & Alerts**

- **Real-time Alerts**: Notifications on price changes, pending approvals, and inventory restocks.
- **Automated Emails/SMS**: Alerts sent to vendors and employees for order updates.

### 10. **Data Storage & Security**

- **Database Architecture**:
  - Centralized storage for procurement data.
  - Secure access and encryption of sensitive information.
- **Backup & Recovery**:
  - Regular backups to prevent data loss.
  - Version control for price changes.

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Javascript, Node.js
- **Database**: Firebase
- **Hosting**: Vercel
- **Security**: firebase authentication

---

## Key Benefits

- **Automated price comparison**: Eliminates manual calls to vendors.
- **Centralized data storage**: Ensures organized procurement records.
- **Vendor transparency**: Monitors and analyzes vendor price consistency.
- **Improved decision-making**: Enables real-time procurement insights.
- **Cost reduction**: Identifies the best vendors with the most consistent pricing.
- **Marketplace for real-time price visibility**: Provides an open and transparent platform for vendors and buyers.

This structured approach ensures that the supply chain dashboard effectively resolves the pain points faced by Hydropathy Industries, making procurement more efficient and cost-effective.
