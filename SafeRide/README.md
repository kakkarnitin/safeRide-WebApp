# SafeRide

SafeRide is a community-driven web application designed to facilitate the sharing of pickup and drop-off rides for school children. The application is exclusively available to parents of participating schools, ensuring a trusted environment for users.

## Features

- **Parent Registration**: Only parents from participating schools can register.
- **Microsoft Authentication**: Secure sign-in using Microsoft Azure Active Directory (Azure AD) for enterprise-grade authentication.
- **Verification Workflow**: A robust verification process that requires parents to submit their driving license and Working with Children card before registration.
- **Credit System**: Each parent starts with 5 credit points. Points are earned by offering rides and are deducted when rides are availed.
- **Dashboard**: Each verified parent has access to a personalized dashboard to manage their rides, credits, and verification status.
- **Ride Management**: Verified parents can post available rides and specify the number of seats for pickup or drop-off.
- **Admin Panel**: School administrators can approve/reject enrollment requests and manage parent verifications.

## Technology Stack

- **Frontend**: React with TypeScript, utilizing Vite for build tooling and Tailwind CSS for styling.
- **Backend**: .NET 9 for the API, with a focus on clean architecture and separation of concerns.
- **Authentication**: Microsoft Authentication Library (MSAL) for Azure AD integration.
- **Deployment**: Azure App Service for backend, GitHub Pages for frontend.

## Setup Instructions

### Prerequisites

- .NET 9 SDK
- Node.js (version 14 or higher)
- Docker (optional, for containerized deployment)

### Backend Setup

1. Navigate to the `backend` directory.
2. Restore the NuGet packages:
   ```
   dotnet restore
   ```
3. Run the application:
   ```
   dotnet run
   ```

### Frontend Setup

1. Navigate to the `frontend` directory.
2. Install the dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Microsoft Authentication Setup

To enable Microsoft Azure AD authentication:

1. **For Development**: See [Microsoft Authentication Setup Guide](docs/microsoft-auth-setup.md) for detailed Azure AD configuration.
2. **Quick Development with Mock Auth**: Set `VITE_USE_MOCK_AUTH=true` in your `.env.local` file to use mock authentication during development.
3. **Production Setup**: Configure Azure AD app registration and set environment variables in GitHub repository secrets.

Environment variables needed:
```env
VITE_MICROSOFT_CLIENT_ID=your-azure-ad-client-id
VITE_MICROSOFT_TENANT_ID=your-azure-ad-tenant-id
VITE_USE_MOCK_AUTH=false  # Set to true for development without Azure AD
```

### Docker Setup

To run the application using Docker, navigate to the `infra/docker` directory and run:
```
docker-compose up --build
```

## Documentation

For detailed documentation, please refer to the following files in the `docs` directory:

- [Architecture](docs/architecture.md)
- [API Specification](docs/api-spec.md)
- [Verification Workflow](docs/verification-workflow.md)
- [Credit System](docs/credit-system.md)
- [User Stories](docs/user-stories.md)
- [Theme Guidelines](docs/theme-guidelines.md)
- [Microsoft Authentication Setup](docs/microsoft-auth-setup.md)

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.