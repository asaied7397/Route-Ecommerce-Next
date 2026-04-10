🛒 FreshCart – Full-Stack E-commerce Platform

📌 Overview

FreshCart is a modern, production-ready e-commerce web application built using Next.js (App Router) and TypeScript.
The platform provides a complete shopping experience including authentication, cart management, address handling, checkout, and order tracking.

This project focuses on real-world frontend architecture, API integration, and secure authentication handling.

⸻

🚀 Live Demo

https://route-ecommerce-next-gamma.vercel.app/
⸻

🧩 Features

🔐 Authentication
• User login using credentials
• JWT-based session handling via NextAuth
• Secure token storage and usage across API requests
• Protected routes and authenticated user flows

⸻

🛍️ Product & Cart Management
• Browse products dynamically from API
• Add/remove items from cart
• Update product quantities
• Real-time cart updates

⸻

📍 Address Management
• Add new addresses using validated forms (React Hook Form + Zod)
• Fetch and display user addresses
• Delete addresses
• UI updates after CRUD operations

⸻

💳 Checkout & Online Payment
• Integration with backend checkout session API
• Send shipping address during checkout
• Redirect user to payment gateway
• Handle success redirect flow

⸻

📦 Orders System
• Fetch user orders dynamically
• Display order summary (status, date, items, price)
• Expandable order details
• Payment & delivery status indicators

⸻

⚙️ Profile Settings
• Update user data (name, email, phone)
• Change password with validation
• Error & success handling from API responses

⸻

🎨 UI/UX
• Fully responsive design (mobile, tablet, desktop)
• Clean and modern UI using Tailwind CSS
• Reusable components and structured layout
• Empty states, loading states, and error handling

⸻

🛠 Tech Stack

Frontend
• Next.js (App Router)
• React
• TypeScript
• Tailwind CSS

State & Forms
• React Hook Form
• Zod (schema validation)

Authentication
• NextAuth (JWT strategy)

Utilities
• Fetch API
• Custom helpers (JWT parsing, API handling)

Deployment
• Vercel

⸻

🧠 Architecture Highlights

🔹 Authentication Flow
• Credentials login → API returns JWT
• Token stored inside NextAuth JWT session
• Token injected into protected API requests

⸻

🔹 Data Fetching Strategy
• Client-side fetching using useEffect
• cache: “no-store” for fresh data
• Controlled loading & error states

⸻

🔹 Component Structure
• Reusable UI components (Cards, Dialogs, Forms)
• Feature-based folder organization
• Separation of concerns between UI and logic

⸻

🔹 Form Handling
• Validation handled via Zod schemas
• Integrated with React Hook Form
• Controlled error display

⸻

📂 Project Structure

Route (app) Revalidate Expire
┌ ○ / 1d 1y
├ ○ /\_not-found
├ ○ /allorders
├ ƒ /api/auth/[...nextauth]
├ ○ /brands 1d 1y
├ ○ /cart
├ ƒ /categories
├ ƒ /categories/[catID]
├ ○ /checkout
├ ○ /contact
├ ○ /login
├ ○ /orders
├ ƒ /products
├ ƒ /products/[id]
├ ○ /profile/addresses
├ ○ /profile/settings
├ ○ /register
├ ƒ /search
└ ○ /wishlist

⸻

⚙️ Installation & Setup

Clone repo

git clone https://github.com/asaied7397/Route-Ecommerce-Next

Install dependencies

npm install

Run development server

npm run dev

⸻

🧪 Testing Checklist
• Login / Logout
• Add to cart
• Add / remove address
• Checkout & redirect
• Orders fetching
• Profile update
• Password change

⸻

🚧 Challenges & Solutions

Token Handling (NextAuth + API)

Handled JWT storage and ensured token is available in session and API requests.

Client Re-render Issues

Solved UI not updating after mutations using state triggers and re-fetch patterns.

TypeScript Strict Errors

Handled optional API responses safely using proper typing and guards.

Deployment Issues (Vercel)

Resolved environment variable issues and server configuration errors.

⸻

📈 Future Improvements
• Add real payment integration (Stripe)
• Admin dashboard (manage products & orders)
• Wishlist functionality
• Product search & filters
• Pagination & performance optimization
• Global state management (React Query / Zustand)

⸻

👤 Author

Abdulrahman Salah

GitHub: https://github.com/your-username
LinkedIn: https://linkedin.com/in/your-profile

⸻

⭐ Notes

This project demonstrates:
• Real-world API integration
• Authentication handling
• Clean UI implementation
• Production-ready frontend practices
