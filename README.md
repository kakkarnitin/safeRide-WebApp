# SafeRide Web Application

A comprehensive web application for safe school ride-sharing, connecting parents and facilitating secure transportation for children.

## 🚗 Project Overview

SafeRide is a full-stack web application that enables parents to offer and request rides for their children's school commute. The platform includes comprehensive verification systems, credit-based transactions, and school enrollment management.

## 🏗️ Architecture

- **Backend**: .NET 9 Web API with Entity Framework Core
- **Frontend**: React 18 with TypeScript and Tailwind CSS
- **Database**: SQLite (development) / SQL Server (production)
- **Authentication**: JWT-based authentication system
- **Infrastructure**: Docker containerization with Kubernetes deployment configs

## 📁 Project Structure

```
SafeRide/
├── backend/                 # .NET Web API Backend
│   ├── src/
│   │   ├── SafeRide.Api/           # API Controllers & Configuration
│   │   ├── SafeRide.Core/          # Business Logic & Entities
│   │   ├── SafeRide.Infrastructure/ # Data Access & Repositories
│   │   └── SafeRide.Tests/         # Unit Tests
│   └── Directory.Build.props
├── frontend/                # React Frontend Application
│   ├── src/
│   │   ├── components/      # Reusable UI Components
│   │   ├── pages/          # Page Components
│   │   ├── contexts/       # React Contexts
│   │   ├── hooks/          # Custom Hooks
│   │   ├── services/       # API Services
│   │   ├── types/          # TypeScript Type Definitions
│   │   └── utils/          # Utility Functions
│   ├── package.json
│   └── vite.config.ts
├── docs/                   # Project Documentation
├── infra/                  # Infrastructure Configuration
│   ├── docker/            # Docker configurations
│   └── k8s/               # Kubernetes manifests
└── scripts/               # Build and deployment scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- .NET 9 SDK
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/kakkarnitin/safeRide-WebApp.git
   cd safeRide-WebApp
   ```

2. **Backend Setup**
   ```bash
   cd SafeRide/backend/src/SafeRide.Api
   dotnet restore
   dotnet run
   ```
   Backend will run on `http://localhost:5001`

3. **Frontend Setup**
   ```bash
   cd SafeRide/frontend
   npm install
   npm run dev
   ```
   Frontend will run on `http://localhost:3001`

## 🔑 Key Features

### Core Functionality
- **User Authentication & Registration**: Secure JWT-based authentication system
- **School Enrollment Management**: Multi-step enrollment and approval workflow
- **Ride Offering & Booking**: Parents can offer rides with detailed pickup/dropoff locations
- **Credit System**: Points-based transaction system for ride payments
- **Verification System**: Document upload and verification for safety compliance
- **Admin Panel**: Administrative interface for managing schools and approvals

### Technical Features
- **Responsive Design**: Mobile-first UI using Tailwind CSS
- **Real-time Updates**: Dynamic data fetching and state management
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error handling and user feedback
- **API Documentation**: Swagger/OpenAPI documentation
- **Clean Architecture**: Domain-driven design with clear separation of concerns

## 🎯 User Flows

### Parent Registration Flow
1. Register with email and personal details
2. Upload verification documents (Driving License, Working with Children Card)
3. Await admin verification approval
4. Enroll in desired schools
5. Start offering or booking rides

### School Enrollment Flow
1. Browse available schools
2. Submit enrollment request with notes
3. Admin reviews and approves/rejects enrollment
4. Access ride offerings for approved schools

### Ride Management Flow
1. Offer rides with pickup/dropoff locations and landmarks
2. Set available seats and timing
3. Other parents can view and book available rides
4. Credit-based payment system handles transactions

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Schools
- `GET /api/schools` - List all schools
- `POST /api/schools` - Create new school (Admin)
- `POST /api/schools/enroll` - Submit enrollment request
- `GET /api/schools/approved-schools` - Get approved schools for parent
- `GET /api/schools/pending-enrollments` - Get pending enrollments (Admin)
- `POST /api/schools/approve-enrollment` - Approve/reject enrollment (Admin)

### Rides
- `GET /api/rides` - List available rides
- `POST /api/rides/offer` - Create ride offer
- `POST /api/rides/reserve` - Reserve ride seats

### Verification
- `POST /api/verification/documents` - Upload verification documents
- `GET /api/verification/status` - Check verification status

## 🎨 UI/UX Design

- **Modern Material Design**: Clean, intuitive interface
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Accessibility**: WCAG 2.1 compliant design principles
- **Color Scheme**: Professional blue and gray palette with green accents
- **Typography**: Clean, readable font hierarchy

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive server and client-side validation
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Document Verification**: Multi-step verification process for safety
- **SQL Injection Protection**: Entity Framework parameterized queries

## 🗄️ Database Schema

### Core Entities
- **Parents**: User profiles with verification status
- **Schools**: Educational institutions with contact information
- **ParentSchoolEnrollments**: Many-to-many relationship with approval workflow
- **RideOffers**: Available rides with location and timing details
- **RideReservations**: Booking records with seat allocations
- **CreditTransactions**: Financial transaction history
- **VerificationDocuments**: Uploaded verification files

## 🐳 Deployment

### Docker Deployment
```bash
cd infra/docker
docker-compose up -d
```

### Kubernetes Deployment
```bash
kubectl apply -f infra/k8s/
```

## 📝 Development Guidelines

### Backend
- Follow Clean Architecture principles
- Use Entity Framework for data access
- Implement proper error handling and logging
- Write unit tests for business logic
- Use AutoMapper for DTO mappings

### Frontend
- Use functional components with hooks
- Implement proper TypeScript typing
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error boundaries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Nitin Kakkar** - Lead Developer

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

## 🚀 Recent Updates

- ✅ Complete backend API implementation
- ✅ React frontend with TypeScript
- ✅ School enrollment and approval system
- ✅ Admin panel for management
- ✅ Credit system implementation
- ✅ Verification workflow
- ✅ Responsive design implementation
- ✅ Docker containerization
- ✅ Kubernetes deployment configuration

## 🎯 Roadmap

- [ ] Mobile app development (React Native)
- [ ] Real-time notifications
- [ ] Payment gateway integration
- [ ] Advanced mapping and GPS tracking
- [ ] Machine learning for ride recommendations
- [ ] Multi-language support

---

**Built with ❤️ using .NET 9, React 18, and modern web technologies**
# Trigger deployment pipeline - Sat Aug 30 16:05:34 AEST 2025
