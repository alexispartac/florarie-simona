# Buchetul Simonei - Documentation

Welcome to the documentation for Buchetul Simonei, your online flower shop. This guide provides comprehensive information about the website's features, functionality, and development setup.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Development Setup](#development-setup)
5. [API Documentation](#api-documentation)
6. [Deployment](#deployment)
7. [Contributing](#contributing)
8. [License](#license)

## Project Overview

Buchetul Simonei is an e-commerce platform specializing in fresh flowers and beautiful floral arrangements. The website allows customers to browse our collection, select bouquets for any occasion, and schedule deliveries in a seamless, user-friendly interface.

## Features

- **Product Catalog**: Browse through our collection of fresh flowers and bouquets
- **Occasion-Based Shopping**: Find the perfect flowers for birthdays, weddings, anniversaries, and more
- **Flower Care Instructions**: Detailed care guides for each bouquet
- **Same-Day Delivery**: Quick delivery options for urgent orders
- **Responsive Design**: Optimized for all device sizes
- **Theme Support**: Light and dark mode for better user experience
- **Shopping Cart**: Easy-to-use cart with custom message option
- **Delivery Date Scheduling**: Choose when you want your flowers delivered
- **Multi-language Support**: Available in English and Romanian
- **Session-based Storage**: All user data is stored in the browser's sessionStorage

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm (v8 or later)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/buchetul-simonei.git
   cd buchetul-simonei
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Setup

### Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # Reusable UI components
├── context/          # React context providers
├── styles/           # Global styles and themes
├── lib/              # Utility functions and helpers
└── types/            # TypeScript type definitions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## API Documentation

For detailed API documentation, please see the [API Reference](./API.md).

## Deployment

### Production Build

To create a production build:

```bash
npm run build
```

### Deployment to Vercel

1. Push your code to a GitHub/GitLab repository
2. Import the repository to Vercel
3. Configure environment variables
4. Deploy!

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
