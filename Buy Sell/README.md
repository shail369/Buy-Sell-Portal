# Buy-Sell Platform

A Buy-Sell website built using the MERN (MongoDB, Express, React, Node.js) stack. The platform allows users to buy and sell products, manage their cart, view order history, and more. Users can create their profiles, add products for sale, manage pending orders, and view the status of their purchases. It also features a chatbot to assist with queries and a secure CAS login for authentication.

## Features

### **1. User Authentication**
- **Login/Signup**: Users can log in or sign up using the CAS login system with a CAPTCHA on the login page.
- **Login with CAS**: If the user does does not have an account he can't login with CAS

### **2. Profile Management**
- Users can view and edit their personal details such as:
  - Name
  - Age
  - Email address
  - Phone number
- View reviews given by buyers about the user’s products.
- User can also change their password based on the old password

### **3. Products Page**
- **View Products**: Browse through all the products on the platform.
- **Search & Filter**: Use the search bar, price and category filters to find specific items.
- **Add Review**:Users can leave reviews for sellers after the order is approved

### **4. Your Orders**
- **View Product**: Browse through all the products on the platform being sold by you.
- **Add a Product**: Add a new item to be sold by you

### **5. Cart Management**
- **Manage Cart**: Users can add items to their cart.
- **Place Order**: Once items are added, users can proceed to place an order, generating an OTP for verification by the seller.
- **Remove Items**: Users can remove products from their cart by clicking the "X" button next to each item.

### **6. Order History**
- Users can view a list of all their orders.
  - **Items I Am Have Sold**: View products that the user is has sold.
  - **Pending Orders**: View orders that are still pending.
  - **Approved Orders**: View orders that have been confirmed.

### **7. Pending Orders (Seller View)**
- Sellers can view pending orders.
- When a buyer provides the OTP, sellers can input it to approve the order.

### **8. Chatbot**
- A chatbot is available to assist with any queries related to the platform's functionality.

### **9. Assumptions**
- **Unlimited Purchases**: Users can buy any product as many times as they want.
- **Custom Categories**: Sellers can create any category for their products.
- **Product Details**: Users can view product descriptions and seller details by clicking on a product.
  
### **10. Security**
- **CAPTCHA**: CAPTCHA validation on the login page to protect against bots.
- **CAS Authentication**: Secure login through CAS, which handles user authentication.


## Additional Notes:
- **OTP for Order Confirmation**: When placing an order, an OTP is generated and needs to be shared with the seller for order approval.
  
## Technologies Used
- **Frontend**: React, Axios, React Router
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: CAS Login, CAPTCHA

