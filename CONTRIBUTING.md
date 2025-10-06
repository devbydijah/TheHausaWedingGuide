# Contributing to The Hausa Wedding Guide

Thank you for your interest in contributing to The Hausa Wedding Guide! This document provides guidelines for contributors.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A Paystack account for testing payments
- A Resend account for email testing

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/devbydijah/TheHausaWedingGuide.git
   cd TheHausaWedingGuide
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   PAYSTACK_TEST_SECRET_KEY=your_test_secret_key
   PAYSTACK_SECRET_KEY=your_live_secret_key
   RESEND_API_KEY=your_resend_api_key
   FROM_EMAIL=noreply@hausaroom.com
   DOWNLOAD_TOKEN_SECRET=your_secret_for_hmac
   ```

4. **Initialize the database**
   The SQLite database (`downloads.db`) auto-creates on first run. No manual setup needed.

5. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

### Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Development Workflow

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

3. **Run tests and linting**

   ```bash
   npm test
   npm run lint
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a PR on GitHub.

## Code Style Guidelines

- Use ES6+ syntax
- Follow the existing naming conventions
- Add JSDoc comments for functions
- Keep functions small and focused
- Use async/await for asynchronous operations

## Testing Guidelines

- Write unit tests for utility functions
- Write integration tests for API endpoints
- Test error cases and edge conditions
- Aim for good test coverage

## API Documentation

### Endpoints

- `POST /api/paystack-webhook` - Handles payment confirmations
- `POST /api/issue-link` - Manually issues download links
- `GET /api/validate-token` - Validates download tokens
- `GET /api/download` - Serves the PDF file

### Environment Variables

See the setup section above for required environment variables.

## Deployment

The app is deployed on Vercel with automatic deployments from the main branch.

For production deployment:

1. Ensure all environment variables are set in Vercel dashboard
2. Test thoroughly in staging
3. Merge to main branch

## Reporting Issues

- Use GitHub Issues to report bugs
- Include steps to reproduce, expected vs actual behavior
- Add screenshots if applicable
- Use labels to categorize issues

## Questions?

If you have questions about contributing, feel free to open an issue or contact the maintainers.
