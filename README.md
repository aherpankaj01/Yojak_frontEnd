# ✍️ Yojak — Blogging Platform Frontend

A modern and responsive blogging platform frontend built with **React.js**, designed to provide users with a smooth experience for creating, managing, discovering, and interacting with blog content.

The frontend communicates with a dedicated **Spring Boot REST API backend** for authentication, posts, comments, likes, user profiles, and image management.

## 🌐 Live Application

🚀 **Frontend:**
https://yojak-front-end.vercel.app/

🔗 **Backend Repository:**
Add your backend GitHub repository URL here.

## ✨ Features

* 🔐 User Registration and Login
* 🛡️ Protected Routes
* 📝 Create, Edit and Delete Blog Posts
* 📖 View and Read Blog Posts
* ❤️ Like Posts
* 💬 Comment on Posts
* 👤 User Profiles
* ✏️ Edit User Profile
* 🖼️ Image Upload and Preview
* 🔍 Post Filtering
* 📰 Most Recent Posts
* ❤️ Most Liked Posts
* 💬 Most Commented Posts
* 📝 Rich Text Blog Editor
* 📱 Responsive Design
* ⚡ Global State Management with Redux Toolkit
* 🔗 REST API Integration
* 🚪 Secure Logout

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* Redux Toolkit
* React Router
* React Hook Form
* Axios
* Tailwind CSS
* HTML5
* CSS3
* TinyMCE

### Backend Integration

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* REST APIs
* PostgreSQL
* JPA / Hibernate
* Flyway

### Tools

* Git
* GitHub
* Vite
* Postman
* Vercel

## 🏗️ Application Architecture

                ┌───────────────────────┐
                │         User          │
                └───────────┬───────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │    React Frontend     │
                │                       │
                │ React + Redux Toolkit │
                │ React Router          │
                │ Tailwind CSS          │
                └───────────┬───────────┘
                            │
                         REST API
                            │
                            ▼
                ┌───────────────────────┐
                │    Spring Boot API    │
                │                       │
                │ Spring Security       │
                │ JWT Authentication    │
                │ JPA / Hibernate       │
                └───────────┬───────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
       ┌────────────────┐       ┌────────────────┐
       │   PostgreSQL   │       │   Cloudinary    │
       │    Database    │       │ Image Storage   │
       └────────────────┘       └────────────────┘
```

## 📂 Project Structure

```text
src/
│
├── Component/
│   ├── AuthLayout.jsx
│   ├── Button.jsx
│   ├── CommentSection.jsx
│   ├── Input.jsx
│   ├── LikeButton.jsx
│   ├── Login.jsx
│   ├── Logo.jsx
│   ├── PostCard.jsx
│   ├── RTE.jsx
│   ├── Select.jsx
│   └── Signup.jsx
│
├── Component/pages/
│   ├── AddPost.jsx
│   ├── AllPost.jsx
│   ├── EditPost.jsx
│   ├── EditProfile.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Post.jsx
│   ├── Profile.jsx
│   └── Signup.jsx
│
├── Component/post-form/
│   └── PostForm.jsx
│
├── Component/Header/
│   ├── Header.jsx
│   └── LogOutBtn.jsx
│
├── Component/Footer/
│   └── Footer.jsx
│
├── services/
│   ├── apiClient.js
│   ├── authService.js
│   ├── commentService.js
│   ├── fileService.js
│   ├── likeService.js
│   ├── postService.js
│   └── userService.js
│
├── store/
│   ├── authSlice.js
│   └── store.js
│
├── App.jsx
├── App.css
├── main.jsx
└── router.jsx
```

## 🔄 Frontend Data Flow

```text
User Action
     │
     ▼
React Component
     │
     ▼
Service Layer
     │
     ▼
Axios API Request
     │
     ▼
Spring Boot REST API
     │
     ▼
PostgreSQL / Cloudinary
     │
     ▼
API Response
     │
     ▼
Redux / Component State
     │
     ▼
Updated UI
```

## 🔐 Authentication Flow

Yojak uses JWT-based authentication through the Spring Boot backend.

```text
User Login
    ↓
React Login Form
    ↓
POST /auth/login
    ↓
Spring Security
    ↓
Credentials Validation
    ↓
JWT Generated
    ↓
Frontend Stores Authentication State
    ↓
JWT Sent with Protected Requests
    ↓
JwtFilter Validates Token
    ↓
Authorized Request
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/aherpankaj01/Yojak_Frontend.git
```

```bash
cd Yojak_Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Backend URL

Configure the Spring Boot backend API URL in the frontend according to your environment.

Local backend:

```text
http://localhost:8082
```

Deployed backend:

```text
Your deployed Spring Boot backend URL
```

### 4. Start Development Server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

### 5. Build for Production

```bash
npm run build
```

### 6. Preview Production Build

```bash
npm run preview
```

## 🚀 Deployment

The frontend is deployed using **Vercel**.

```text
React + Vite
      ↓
GitHub
      ↓
Vercel
      ↓
Production Application
```

## 🎯 Key Highlights

* Component-based React architecture
* Centralized API service layer
* Redux Toolkit for authentication state
* Protected application routes
* REST API integration
* Responsive UI
* Rich text content creation
* Image upload functionality
* User interaction through likes and comments
* Separate frontend and backend architecture

## 👨‍💻 Author

**Pankaj Aher**

Computer Engineering Graduate
Java Full-Stack Developer

GitHub: https://github.com/aherpankaj01

Portfolio: https://aher-pankaj.vercel.app/
