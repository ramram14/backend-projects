# 📄 Blog API Documentation

## 📚 Overview

The Blog API offers a comprehensive suite of endpoints designed for seamless management of blog posts and comments. Through this API, users are empowered to perform CRUD operations—Create, Retrieve, Update, and Delete—on both blog posts and comments, ensuring a robust and dynamic content management experience.

## 🌟 Features

- **CRUD Operations**: Comprehensive support for Create, Read, Update, and Delete operations on both posts and comments.
- **Authentication**: Secure user authentication using JSON Web Tokens (JWT) for enhanced security and user management.
- **Enhanced Security**: additional security features with access tokens and refresh tokens created using jwt
- **Image Upload**: Seamless integration of image uploads for posts, enhancing the visual appeal of post content using cloudinary

## 🛠️ Tech Stack

- **Node.js**: A powerful JavaScript runtime environment that enables server-side scripting and application development.
- **Express.js**: A minimalist and flexible web application framework for Node.js, providing a robust set of features for building web applications and APIs.
- **MongoDB**: A scalable and flexible NoSQL database, perfect for handling high volume data storage with ease.
- **Mongoose**: An elegant MongoDB object modeling tool, designed to simplify data manipulation and enforce application-level data validation.
- **JSON Web Tokens (JWT)**: A secure and compact means of representing claims between parties, commonly used for authentication and authorization in web applications.
- **Cloudinary**: A cloud-based service that enables efficient image and video management, storage, and delivery, ensuring optimal performance and scalability.

## 🔧 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ramram14/backend-projects/rest-api/express/blog-API
   ```

2. Navigate to the project directory:

   ```bash
   cd rest-api/express/blog-API
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   Create a `.env` file in the root directory and set the following environment variables:

   ```bash
   NODE_ENV=development
   PORT=3000
   DB_URI=your_mongodb_uri
   JWT_REFRESH_TOKEN_SECRET_KEY=your_refresh_token_secret_key
   JWT_REFRESH_TOKEN_EXPIRY=30d
   JWT_REFRESH_TOKEN_NAME=jwt_refresh_token
   JWT_ACCESS_TOKEN_SECRET_KEY=your_access_token_secret_key
   JWT_ACCESS_TOKEN_EXPIRY=15m
   JWT_ACCESS_TOKEN_NAME=jwt_access_token
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

5. Start the server:

   ```bash
   npm start
   // or using nodemon for development
   npm run dev
   ```

## 📝 Endpoints

### **Authentication Routes**

#### `GET /api/v1/auth/me`

- **Description**: Get information about the current authenticated user.

- **Response**:
  - 200 OK: Returns user information.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 404 Not Found: If the user is not found.

#### `GET /api/v1/auth/refresh-token`

- **Description**: Refresh the user's access token.
- **Response**:
  - 200 OK: Returns a new access token in cookies.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.

#### `POST /api/users/register`

- **Description**: Registers a new user.
- **Request Body**:

  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string", // min 6 characters
    "password_confirmation": "string"
  }
  ```

- **Response**:
  - 201 Created: Return user information and a new access token and refresh token is returned in cookies.
  - 400 Bad Request: If the request body is invalid or the email is already in use.

#### `POST /api/v1/auth/login`

- **Description**: Logins existing user.
- **Request Body**:

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

- **Response**:
  - 200 OK: Return user information and a new access token in cookies.
  - 400 Bad Request: If the request body is invalid or the email or password is incorrect.

#### `DELETE /api/v1/auth/logout`

- **Description**: Logouts the user.
- **Response**:
  - 200 OK: Returns a success message.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.

### **User Routes**

#### `GET /api/v1/users/:id`

- **Description**: Get information about a specific user.
- **Response**:
  - 200 OK: Returns user information.
  - 404 Not Found: If the user is not found.

#### `GET /api/v1/users/:id/posts`

- **Description**: Get all posts of a specific user.
- **Response**:
  - 200 OK: Returns an array of posts.
  - 404 Not Found: If the user is not found.

#### `PATCH /api/v1/users/:id/update-name`

- **Description**: Update the name of a specific user.
- **Request Body**:

  ```json
  {
    "name": "string",
    "password": "string"
  }
  ```

- **Response**:
  - 200 OK: Updated user information.
  - 400 Bad Request: If the request body is invalid or the password is incorrect.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 403 Forbidden: If the user is not authorized to update the name.
  - 404 Not Found: If the user is not found.

#### `PATCH /api/v1/users/:id/update-email`

- **Description**: Update the email of a specific user.
- **Request Body**:

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

- **Response**:
  - 200 OK: Updated user information.
  - 400 Bad Request: If the request body is invalid or the password is incorrect.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 403 Forbidden: If the user is not authorized to update the email.
  - 404 Not Found: If the user is not found.

#### `PATCH /api/v1/users/:id/update-password`

- **Description**: Update the password of a specific user.
- **Request Body**:

  ```json
  {
    "password": "string",
    "newPassword": "string"
  }
  ```

- **Response**:
  - 200 OK: Updated user information.
  - 400 Bad Request: If the request body is invalid or the password is incorrect.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 403 Forbidden: If the user is not authorized to update the password.
  - 404 Not Found: If the user is not found.

#### `PATCH /api/v1/users/:id/update-profile-picture`

- **Description**: Update the profile picture of a specific user.
- **Request Body**:

  ```json
  {
    "image": "string" // image url
  }
  ```

- **Response**:
  - 200 OK: Updated user information.
  - 400 Bad Request: If the request body is invalid or the password is incorrect.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 403 Forbidden: If the user is not authorized to update the password.
  - 404 Not Found: If the user is not found.

#### `PATCH /api/v1/users/:id/update-bio`

- **Description**: Update the bio of a specific user.
- **Request Body**:

  ```json
  {
    "bio": "string"
  }
  ```

- **Response**:
  - 200 OK: Updated user information.
  - 400 Bad Request: If the request body is invalid or the password is incorrect.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 403 Forbidden: If the user is not authorized to update the password.
  - 404 Not Found: If the user is not found.

#### `DELETE /api/v1/users/:id`

- **Description**: Delete a specific user.
- **Response**:
  - 200 OK: Returns a success message.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 403 Forbidden: If the user is not authorized to delete the user.
  - 404 Not Found: If the user is not found.

### **Post Routes**

#### `GET /api/v1/posts`

- **Description**: Get all posts with pagination.
- **Query Parameters**:
  - `page`: The page number to retrieve.
  - `limit`: The number of posts to retrieve per page.
  - `search`: The search query to filter the posts.
  - `category`: The category to filter the posts.
- **Response**:
  - 200 OK: Returns an array of posts with pagination information.

#### `GET /api/v1/posts/:slug`

- **Description**: Get a specific post by slug.
- **Response**:
  - 200 OK: Returns the post information.
  - 404 Not Found: If the post is not found.

#### `GET /api/v1/posts/:slug/comments`

- **Description**: Get all comments for a specific post.
- **Response**:
  - 200 OK: Returns an array of comments.
  - 404 Not Found: If the post is not found.

#### `POST /api/v1/posts`

- **Description**: Create a new post.
- **Request Body**:

  ```json
  {
    "title": "string",
    "subtitle": "string",
    "content": "any", // adjust according to the results of your text editor
    "category": "string", // only accept category from the database
    "image": "string"
  }
  ```

- **Response**:
  - 201 Created: Returns the created post information.
  - 400 Bad Request: If the request body is invalid.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 403 Forbidden: If the user is not authorized to create a post.
  - 404 Not Found: If the user or category is not found.

#### `PATCH /api/v1/posts/:id/update-title`

- **Description**: Update the title of a specific post, this action will cause the slug to be updated as well.
- **Request Body**:

  ```json
  {
    "title": "string"
  }
  ```

- **Response**:
  - 200 OK: Updated post information.
  - 400 Bad Request: If the request body is invalid.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 403 Forbidden: If the user is not authorized to update the post.
  - 404 Not Found: If the post is not found.

#### `PATCH /api/v1/posts/:id/update-content-and-subtitle`

- **Description**: Update the content and subtitle of a specific post.
- **Request Body**:

  ```json
  {
    // Choose one or both
    "subtitle": "string",
    "content": "any" // adjust according to the results of your text editor
  }
  ```

- **Response**:
  - 200 OK: Updated post information.
  - 400 Bad Request: If the request body is invalid.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 403 Forbidden: If the user is not authorized to update the post.
  - 404 Not Found: If the post is not found.

#### `PATCH /api/v1/posts/:id/update-image`

- **Description**: Update the image of a specific post.
- **Request Body**:

  ```json
  {
    "image": "string" // image url
  }
  ```

- **Response**:
  - 200 OK: Updated post information.
  - 400 Bad Request: If the request body is invalid.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 403 Forbidden: If the user is not authorized to update the post.
  - 404 Not Found: If the post is not found.

#### `PATCH /api/v1/posts/:id/update-category`

- **Description**: Update the category of a specific post. Api only accept category from the database.
- **Request Body**:

  ```json
  {
    "category": "string"
  }
  ```

- **Response**:
  - 200 OK: Updated post information.
  - 400 Bad Request: If the request body is invalid.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 403 Forbidden: If the user is not authorized to update the post.
  - 404 Not Found: If the post is not found.

#### `DELETE /api/v1/posts/:id`

- **Description**: Delete a specific post.
- **Response**:
  - 200 OK: Returns a success message.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 403 Forbidden: If the user is not authorized to delete the post.
  - 404 Not Found: If the post is not found.

### **Comment Routes**

#### `POST /api/v1/comments`

- **Description**: Create a new comment.
- **Request Body**:

  ```json
  {
    "text": "string",
    "postId": "string"
  }
  ```

- **Response**:
  - 201 Created: Returns the created comment information.
  - 400 Bad Request: If the request body is invalid.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 404 Not Found: If the post is not found.

#### `POST /api/v1/comments/reply`

- **Description**: Create a new reply to a comment.
- **Request Body**:

  ```json
  {
    "text": "string",
    "commentId": "string"
  }
  ```

- **Response**:
  - 201 Created: Returns the created reply information.
  - 400 Bad Request: If the request body is invalid.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 404 Not Found: If the comment is not found.

#### `PUT /api/v1/comments/:id`

- **Description**: Update a specific comment.
- **Request Body**:

  ```json
  {
    "text": "string"
  }
  ```

- **Response**:
  - 200 OK: Updated comment information.
  - 400 Bad Request: If the request body is invalid.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 403 Forbidden: If the user is not authorized to update the comment.
  - 404 Not Found: If the comment is not found.

#### `PUT /api/v1/comments/reply/:replyId`

- **Description**: Update a specific reply.
- **Request Body**:

  ```json
  {
    "text": "string"
  }
  ```

- **Response**:
  - 200 OK: Updated reply information.
  - 400 Bad Request: If the request body is invalid.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 403 Forbidden: If the user is not authorized to update the reply.
  - 404 Not Found: If the reply is not found.

#### `DELETE /api/v1/comments/:id`

- **Description**: Delete a specific comment.
- **Response**:
  - 200 OK: Returns a success message.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 403 Forbidden: If the user is not authorized to delete the comment.
  - 404 Not Found: If the comment is not found.

#### `DELETE /api/v1/comments/reply/:replyId`

- **Description**: Delete a specific reply.
- **Response**:
  - 200 OK: Returns a success message.
  - 401 Unauthorized: If the user is not authenticated or the token is invalid.
  - 403 Forbidden: If the user is not authorized to delete the reply.
  - 404 Not Found: If the reply is not found.
