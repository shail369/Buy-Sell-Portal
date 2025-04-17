# IIIT Buy-Sell Portal

A full-stack web application built using the **MERN Stack** to facilitate secure and efficient buying and selling within the IIIT community. This project is designed to replace existing Whatscap-based Buy-Sell groups and avoid the newly imposed 10% tax on such transactions.

## Technology Stack

- **MongoDB** – Database for storing users, items, orders, and reviews
- **Express.js** – Backend framework for building RESTful APIs
- **React.js** – Frontend framework for building user interfaces
- **Node.js** – JavaScript runtime for backend development

## Key Features

### User Management

- Registration restricted to IIIT email addresses
- Fields: First Name, Last Name, Email, Age, Contact Number, Password (hashed)
- Dual-role: any user can act as both buyer and seller
- Persistent login using JWT tokens
- Passwords hashed using `bcrypt.js`
- Authentication and route protection implemented
- Optional:
  - Google reCAPTCHA support
  - CAS login system

### Item Listings

- Sellers can list items with:
  - Name
  - Price
  - Description
  - Category (e.g., clothing, grocery)
- Item pages display detailed information and allow addition to cart

### Search and Filtering

- Search bar to find items by name (case-insensitive)
- Category-based filtering (multi-select supported)
- Combined search and filter functionality

### Shopping Cart

- Users can add items from different sellers
- View cart with item names, prices, and total cost
- Remove items from cart
- Final Order button to confirm and place orders
- A buyer cannot purchase their own listings

### Order Processing

- Orders created with:
  - Unique Transaction ID
  - Buyer ID and Seller ID
  - Total amount
  - OTP (stored in hashed form)
- Upon order placement:
  - Seller sees the pending order on Deliver Items page
  - Buyer receives OTP in Orders History

### Order History

- Tracks:
  - Pending orders
  - Items bought
  - Items sold
- Separate tabs for each section for clarity

### Deliver Items Page

- Sellers see pending deliveries with item and buyer details
- Orders can be marked complete using OTP provided by buyer
- OTP verification required to complete the transaction
- Successful transactions are removed from Deliver Items and updated in order history

### Navigation and Dashboard

- Persistent navigation bar with links to all major pages
- Profile page with editable personal details

### URL Handling

- Each page must have its own route
- Pages should be directly accessible via URL

### Optional Feature: AI Support ChatBot

- Support page with AI chatbot (via APIs like Gemini, ChatGPT, etc.)
- Maintains chat session history
- UI modeled after support systems in apps like Flipkart or Swiggy

## Directory Structure

