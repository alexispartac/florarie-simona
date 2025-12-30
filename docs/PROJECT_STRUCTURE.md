# Project Structure Documentation

## Overview
This document outlines the structure and key components of the Wear-You Next.js application.

## Root Directory
```
wear-you/
├── docs/                   # Project documentation
│   ├── PROJECT_STRUCTURE.md  # This file
│   └── RESPONSIVE_DESIGN.md  # Responsive design guidelines
├── public/                 # Static files (images, fonts, etc.)
├── src/                    # Source code
│   ├── app/                # App Router directory (Next.js 13+)
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout component
│   │   └── page.tsx        # Home page component
│   ├── components/         # Reusable UI components
│   │   └── ThemeSwitcher.tsx # Theme switching component
│   ├── context/            # React context providers
│   │   └── ThemeContext.tsx  # Theme management context
│   └── types/               # TypeScript type definitions
│       ├── api.ts          # API request/response types
│       ├── components.ts   # Component prop types
│       └── index.ts        # Re-export all types
├── .gitignore             # Git ignore file
├── package.json           # Project dependencies and scripts
└── README.md              # Project README

## Key Files

### `src/app/layout.tsx`
- Root layout component that wraps all pages
- Handles global layout and providers
- Includes theme context provider

### `src/context/ThemeContext.tsx`
- Manages application theme state (light/dark mode)
- Provides theme toggling functionality
- Persists theme preference in localStorage

### `src/components/ThemeSwitcher.tsx`
- UI component for toggling between light/dark themes
- Uses ThemeContext for state management

### `src/app/page.tsx`
- Main page component (homepage)
- Implements responsive design patterns
- Uses theme context for styling

## Development Setup
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Build for production: `npm run build`
4. Start production server: `npm start`

## Styling
- Uses CSS Modules for component-scoped styles
- Global styles defined in `globals.css`
- Supports light/dark theme switching
