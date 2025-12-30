# Responsive Design Guidelines

This document outlines the responsive design rules and patterns to be used throughout the project to ensure consistency across different screen sizes.

## Breakpoints

We use the following breakpoints based on standard device sizes:

```css
/* Small devices (phones, 640px and down) */
@media (max-width: 640px) { /* sm */ }

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) { /* md */ }

/* Large devices (desktops, 1024px and up) */
@media (min-width: 1024px) { /* lg */ }

/* Extra large devices (large desktops, 1280px and up) */
@media (min-width: 1280px) { /* xl */ }

/* 2XL screens (1536px and up) */
@media (min-width: 1536px) { /* 2xl */ }
```

## Layout Patterns

### 1. Mobile-First Approach
- Start with mobile styles as the default
- Use min-width media queries to progressively enhance the layout for larger screens
- Keep the most important content at the top

### 2. Grid Systems
- Use CSS Grid for two-dimensional layouts
- Use Flexbox for one-dimensional layouts
- Implement responsive grid columns that stack on mobile

### 3. Typography
- Use relative units (rem, em) for font sizes
- Adjust line height and letter spacing for better readability on different screens
- Example:
  ```css
  html {
    font-size: 16px; /* Base font size */
  }
  
  h1 {
    font-size: 2rem; /* 32px on desktop */
    line-height: 1.2;
    
    @media (max-width: 640px) {
      font-size: 1.75rem; /* 28px on mobile */
    }
  }
  ```

## Component-Specific Guidelines

### Navigation
- Mobile: Hamburger menu that expands/collapses
- Desktop: Horizontal navigation bar
- Active states should be clearly visible

### Cards
- Stack vertically on mobile
- Display in a grid on larger screens
- Maintain consistent spacing and padding

### Images
- Use `max-width: 100%` to ensure images are responsive
- Implement `srcset` for different screen resolutions
- Use `object-fit: cover` for consistent aspect ratios

### Forms
- Stack form elements vertically on mobile
- Use full width inputs on mobile
- Consider multi-column layouts on desktop when appropriate

## Spacing System

Use a consistent spacing scale (based on 4px or 8px grid system):

```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.5rem;   /* 24px */
  --space-6: 2rem;     /* 32px */
  --space-8: 2.5rem;   /* 40px */
  --space-10: 3rem;    /* 48px */
  --space-12: 4rem;    /* 64px */
}
```

## Performance Considerations
- Optimize images for different screen sizes
- Use `loading="lazy"` for below-the-fold images
- Consider using `picture` element with different sources for art direction
- Minimize layout shifts by setting explicit dimensions for media

## Testing
- Test on real devices when possible
- Use Chrome DevTools device toolbar for initial testing
- Check touch targets (minimum 44x44px for touch elements)
- Verify text readability on all screen sizes

## Accessibility
- Ensure proper color contrast
- Maintain logical tab order
- Test with screen readers
- Ensure all interactive elements are keyboard accessible

## Common Utilities

### Hide/Show Based on Screen Size
```css
/* Hide on mobile, show on desktop */
.hide-mobile {
  display: none;
}

@media (min-width: 768px) {
  .hide-mobile {
    display: block;
  }
}

/* Show on mobile, hide on desktop */
.hide-desktop {
  display: block;
}

@media (min-width: 768px) {
  .hide-desktop {
    display: none;
  }
}
```

### Container
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  max-width: 1280px; /* Adjust based on design */
}

/* Responsive container padding */
@media (min-width: 768px) {
  .container {
    padding: 0 2rem;
  }
}
```

## Best Practices
1. Always design mobile-first
2. Use relative units (%, vh, vw, rem, em) instead of fixed pixels
3. Test on multiple devices and orientations
4. Consider touch targets for mobile users
5. Optimize images and assets for different screen densities
6. Implement responsive typography that scales appropriately
7. Use CSS custom properties for theming and consistent values
8. Consider using CSS Grid and Flexbox for modern layouts
9. Implement proper meta viewport tag in HTML
10. Test performance impact of responsive images and media queries

## Common Pitfalls to Avoid
- Fixed widths that cause horizontal scrolling
- Overly complex media queries that are hard to maintain
- Not testing on actual devices
- Forgetting about landscape orientation
- Neglecting touch targets on mobile
- Overlooking performance on slower connections
- Using too many different breakpoints inconsistently

## Useful Tools
- Chrome DevTools Device Mode
- BrowserStack for cross-browser testing
- WebPageTest for performance testing
- Google's Mobile-Friendly Test
- Lighthouse for performance and accessibility audits
