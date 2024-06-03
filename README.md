# Navkar Artistry Hub - Back-End

Welcome to the back-end repository of Navkar Artistry Hub, an e-commerce platform built with Node.js, Express.js, and MongoDB as part of the MEAN stack.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [License](#license)
- [Contact](#contact)

## Introduction
Navkar Artistry Hub's back-end handles all server-side logic, including API endpoints for user management, product handling, order processing, and payment integration.

## Features
- User authentication and authorization
- Product management (CRUD operations)
- Add to cart
- Add to wishlist
- Checkout and place orders
- Razorpay payment integration
- Order processing and management
- Secure API endpoints

## Technologies
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Bcrypt (for password hashing)

## Installation
To set up the back-end locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/nakshjain/navkar-artistry-hub-backend.git
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables by creating a `.env` file:
    ```plaintext
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    ```

4. Start the server:
    ```bash
    npm start
    ```

5. The server will run on `http://localhost:3000`.

## Usage
The back-end provides API endpoints to manage users, products, cart, wishlist, orders, and payments. These endpoints can be accessed by the front-end or any HTTP client.

## Deployment
The Navkar Artistry Hub back-end is deployed and accessible at [backend.navkarartistryhub.com](https://backend.navkarartistryhub.com).

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
For any inquiries or feedback, please contact us at [nakshatrajain246@gmail.com].
