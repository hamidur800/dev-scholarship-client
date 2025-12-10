# ScholarStream - Scholarship Management Platform

## Project Overview

**ScholarStream** is a full-stack MERN application that connects students with scholarship opportunities. It provides a centralized platform where universities can post scholarships and students can search, apply, and track their applications.

### Purpose

To simplify the complex process of finding financial aid for education by providing:

- A centralized platform for scholarship discovery
- Streamlined application review process
- Real-time application status tracking
- Student feedback and rating system

## Live Links

- **Client Application**: [Your Deployed URL]
- **Server API**: [Your API Deployed URL]
- **Live Demo**: [Your Live Demo URL]

## Key Features

### For Students

- 🔐 Secure authentication with Google login
- 🔍 Advanced search and filter scholarships
- 📱 Browse scholarships with detailed information
- 💳 Secure payment integration with Stripe
- 📊 Track application status in real-time
- ⭐ Write and manage scholarship reviews
- 📋 Personal dashboard with application history

### For Moderators

- 📋 Review student applications
- ✏️ Provide feedback on applications
- 📊 Update application status
- 💬 Manage student reviews

### For Admins

- ➕ Add and manage scholarships
- 👥 Manage user roles and permissions
- 📈 View platform analytics and statistics
- 🗑️ Remove inappropriate content
- 📊 Monitor platform usage with charts

## Technology Stack

### Frontend

- **React** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - Component library (required as per challenge)
- **Framer Motion** - Animation library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Recharts** - Data visualization
- **React Icons** - Icon library

### Backend (To be implemented)

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Stripe** - Payment processing

### Authentication & Services

- **Firebase** - Authentication service (securely configured with env variables)
- **Stripe** - Payment processing

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Stripe account

### Client Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd dev-scholarship-client
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment variables**

```bash
cp .env.local.example .env.local
```

4. **Configure .env.local with your credentials**

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_API_BASE_URL=http://localhost:5000
```

5. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── Api/                    # API integration utilities
├── Components/             # Reusable components
├── Config/                 # Configuration files (Firebase)
├── Context/                # React Context providers
├── Layouts/                # Layout components
├── Pages/                  # Page components
│   ├── Dashboard/          # Dashboard pages
│   ├── Home/               # Home page
│   ├── Login/              # Login page
│   ├── Register/           # Registration page
│   ├── AllScholarships/    # Scholarships listing
│   ├── ScholarshipDetails/ # Scholarship details
│   └── NotFound/           # 404 page
├── Routes/                 # Route configuration
├── App.jsx                 # Root component
├── main.jsx                # Entry point
└── index.css               # Global styles
```

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  photoURL: String,
  role: String, // "Student", "Moderator", "Admin"
  uid: String,
  createdAt: Date
}
```

### Scholarships Collection

```javascript
{
  _id: ObjectId,
  scholarshipName: String,
  universityName: String,
  universityImage: String,
  universityCountry: String,
  universityCity: String,
  universityWorldRank: Number,
  subjectCategory: String,
  scholarshipCategory: String, // "Full fund", "Partial", "Self-fund"
  degree: String, // "Diploma", "Bachelor", "Masters"
  tuitionFees: Number,
  applicationFees: Number,
  serviceCharge: Number,
  applicationDeadline: Date,
  scholarshipPostDate: Date,
  postedUserEmail: String,
  description: String
}
```

### Applications Collection

```javascript
{
  _id: ObjectId,
  scholarshipId: ObjectId,
  userId: ObjectId,
  userName: String,
  userEmail: String,
  universityName: String,
  scholarshipCategory: String,
  degree: String,
  applicationFees: Number,
  serviceCharge: Number,
  applicationStatus: String, // "pending", "processing", "completed", "rejected"
  paymentStatus: String, // "unpaid", "paid"
  applicationDate: Date,
  feedback: String
}
```

### Reviews Collection

```javascript
{
  _id: ObjectId,
  scholarshipId: ObjectId,
  universityName: String,
  userName: String,
  userEmail: String,
  userImage: String,
  ratingPoint: Number, // 1-5
  reviewComment: String,
  reviewDate: Date
}
```

## Authentication

### Secure Configuration

- All sensitive keys stored in environment variables
- Firebase configuration exposed only through environment variables
- JWT tokens handled securely with HTTP-only cookies (to be implemented on backend)
- Protected routes using custom middleware

### Features

- Email/Password registration with validation
- Password requirements: min 6 chars, 1 uppercase, 1 special character
- Google OAuth integration
- JWT token-based API authentication
- Role-based access control

## API Endpoints (To be implemented)

### Scholarships

- `GET /api/scholarships` - Get all scholarships with pagination
- `GET /api/scholarships/:id` - Get scholarship details
- `POST /api/scholarships` - Create scholarship (Admin only)
- `PUT /api/scholarships/:id` - Update scholarship (Admin only)
- `DELETE /api/scholarships/:id` - Delete scholarship (Admin only)

### Applications

- `GET /api/applications` - Get all applications (Moderator/Admin)
- `GET /api/applications/my-applications` - Get user's applications
- `POST /api/applications` - Create application
- `PUT /api/applications/:id` - Update application status

### Reviews

- `GET /api/reviews/scholarship/:id` - Get reviews for scholarship
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Users

- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id/role` - Change user role (Admin only)

## Payment Integration

### Stripe

- Integration for secure payment processing
- Payment intent creation
- Success/Failure handling
- Application status update on payment completion

## Responsive Design

The application is fully responsive and optimized for:

- ✅ Mobile devices (320px and up)
- ✅ Tablets (768px and up)
- ✅ Desktops (1024px and up)
- ✅ Large screens (1280px and up)

## Performance & Best Practices

- 🔄 Lazy loading for scholarship images
- 🎨 CSS-in-JS with TailwindCSS for optimal bundle size
- 🚀 Code splitting with React Router
- 📦 Efficient state management with Context API
- 🔒 Security-first approach with environment variables
- 📱 Mobile-first design approach

## Git Commits

The project follows these commit conventions:

- Feature commits: `feat: Add [feature name]`
- Fix commits: `fix: Resolve [issue]`
- Refactor commits: `refactor: [description]`
- UI commits: `ui: [description]`
- Docs commits: `docs: [description]`

Total commits: 20+ meaningful commits on client side

## Deployment

### Client Deployment (Vercel/Netlify)

1. Update `.env.local` with production URLs
2. Add domain to Firebase authorized domains
3. Deploy using platform's CLI or GitHub integration

### Server Deployment (Heroku/Vercel)

1. Set environment variables in deployment platform
2. Deploy using platform's deployment mechanism

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check server CORS configuration
2. **Firebase Auth Errors**: Verify Firebase credentials in .env.local
3. **Stripe Errors**: Ensure public key is correct and test mode/live mode matches

## Contributing

Contributions are welcome! Please follow the code style and commit conventions.

## License

This project is part of Programming Hero Assignment 11.

## Support

For issues and questions, please contact:

- Email: support@scholarstream.com
- Phone: +1 (555) 123-4567
- Location: 123 Education St, Knowledge City

---

**Made with ❤️ by [Your Name]**

Last Updated: December 2024
