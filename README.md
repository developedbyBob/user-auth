User Authentication Service
===========================

This project implements a user authentication service using Node.js, Express, and MongoDB, following the MVC (Model-View-Controller) pattern.

Table of Contents
-----------------

-   [Overview](#overview)
-   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Project Structure](#project-structure)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Controllers](#controllers)
-   [API Documentation](#api-documentation)
-   [Environment Variables](#environment-variables)
-   [License](#license)

Overview
--------

This application provides basic user authentication functionalities, including user registration and login, secured with JSON Web Tokens (JWT). The project follows the MVC pattern to organize the code efficiently and promote scalability.

Features
--------

-   User registration with password hashing
-   User login with JWT token generation
-   Secure password storage using bcrypt
-   Environment-based configuration

Technologies Used
-----------------

-   Node.js
-   Express
-   MongoDB
-   Mongoose
-   bcryptjs
-   jsonwebtoken
-   dotenv
-   swagger-jsdoc
-   swagger-ui-express

Project Structure
-----------------

`user-auth/
│
├── controllers/
│   └── authController.js
├── models/
│   └── User.js
├── routes/
│   └── authRoutes.js
├── config/
│   └── db.js
│   └── swagger.js
├── .env
├── app.js
└── server.js`

Installation
------------

1.  **Clone the repository:**


    `git clone https://github.com/your-username/user-auth.git
    cd user-auth`

2.  **Install dependencies:**

    `npm install`

3.  **Set up environment variables:**

    Create a `.env` file in the root directory and add your MongoDB URI and JWT secret:

    `MONGO_URI=mongodb://localhost:27017/userauth
    JWT_SECRET=your_generated_secret`

4.  **Start the server:**

    `node server.js`

Usage
-----

### Registration

-   **Endpoint:** `/api/auth/register`
-   **Method:** `POST`
-   **Request Body:**

    json

    Copiar código

    `{
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }`

### Login

-   **Endpoint:** `/api/auth/login`
-   **Method:** `POST`
-   **Request Body:**

    json

    Copiar código

    `{
      "email": "john@example.com",
      "password": "password123"
    }`

Controllers
-----------

The controllers handle the core logic of the application. The main controllers used are:

### authController.js

-   **register:** Handles user registration. It checks if the user already exists, hashes the password, saves the new user to the database, and generates a JWT token.

    js

    Copiar código

    `exports.register = async (req, res) => {
      const { name, email, password } = req.body;
      try {
        let user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ message: 'User already exists' });
        }
        user = new User({ name, email, password });
        await user.save();
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    };`

-   **login:** Handles user login. It checks if the user exists, verifies the password, and generates a JWT token.

    js

    Copiar código

    `exports.login = async (req, res) => {
      const { email, password } = req.body;
      try {
        let user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    };`

API Documentation
-----------------

The API documentation is available and interactive through Swagger. After starting the server, you can access it at:

-   **Swagger UI:** `http://localhost:5000/api-docs`
-   **Swagger JSON:** `http://localhost:5000/api-docs.json`

Environment Variables
---------------------

The application uses environment variables to manage sensitive data. Create a `.env` file in the root of the project with the following variables:

-   `MONGO_URI`: The MongoDB connection string.
-   `JWT_SECRET`: The secret key used to sign JWT tokens.

Example `.env` file:

bash

Copiar código

`MONGO_URI=mongodb://localhost:27017/userauth
JWT_SECRET=your_generated_secret`

License
-------

This project is licensed under the MIT License. See the LICENSE file for details.