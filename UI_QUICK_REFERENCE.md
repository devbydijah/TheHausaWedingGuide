# 🎨 UI Quick Reference Guide

## Color System

### Current Palette
```css
/* Brand Colors */
--hausa-red: #990200;
--hausa-purple: #531946;
--hausa-bronze: #CE805C;
--hausa-dark-red: #740015;
--hausa-light-bronze: #b86a4a;

/* Accent Gradients */
--gradient-primary: linear-gradient(to bottom, #990200, #531946);
--gradient-reverse: linear-gradient(to bottom, #531946, #990200);
--gradient-bronze: linear-gradient(to right, #CE805C, #b86a4a);
--gradient-purple-pink: linear-gradient(to right, #9333ea, #ec4899);

/* Glassmorphism */
--glass-white-10: rgba(255, 255, 255, 0.1);
--glass-white-5: rgba(255, 255, 255, 0.05);
--glass-white-15: rgba(255, 255, 255, 0.15);

/* Dark Mode */
--dark-bg: #111827; /* gray-900 */
--dark-surface: #1f2937; /* gray-800 */
--dark-border: #374151; /* gray-700 */
```

### Typography
```css
/* Headings - Playfair Display */
.heading-hero: font-playfair text-7xl font-bold
.heading-1: font-playfair text-5xl font-bold
.heading-2: font-playfair text-3xl font-bold
.heading-3: font-playfair text-2xl font-bold

/* Body - Inter */
.body-large: font-inter text-xl
.body-base: font-inter text-base
.body-small: font-inter text-sm
```

## Component Patterns

### Card with Glassmorphism
```jsx
<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all">
  <div className="text-4xl mb-4">{emoji}</div>
  <h3 className="font-playfair text-xl font-bold text-white mb-2">{title}</h3>
  <p className="font-inter text-white/90 text-sm">{description}</p>
</div>
```

### CTA Button
```jsx
<button className="bg-[#CE805C] hover:bg-[#740015] text-white px-12 py-5 rounded-xl text-2xl font-semibold font-inter transition-all shadow-2xl hover:scale-105">
  {text}
</button>
```

### Section Container
```jsx
<section className="max-w-6xl mx-auto px-4 py-12">
  {/* Content */}
</section>
```

### Hero Section
```jsx
<div className="min-h-screen bg-gradient-to-b from-[#990200] to-[#531946] flex items-center justify-center p-8">
  <div className="max-w-6xl mx-auto">
    <div className="text-center text-white mb-12">
      <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-[#CE805C] bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="font-inter text-2xl mb-4">{subtitle}</p>
    </div>
  </div>
</div>
```

## Spacing System

```
Padding Scale:
p-2  = 0.5rem (8px)
p-4  = 1rem (16px)
p-6  = 1.5rem (24px)
p-8  = 2rem (32px)
p-12 = 3rem (48px)

Margin Scale (same as padding):
mb-4, mt-4, mx-4, my-4, etc.

Gap Scale (for grids/flex):
gap-2, gap-4, gap-6, gap-8, gap-12
```

## Responsive Breakpoints

```
sm:  640px  (tablet-small)
md:  768px  (tablet)
lg:  1024px (desktop)
xl:  1280px (desktop-large)
2xl: 1536px (desktop-xl)

Usage:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## Common Layouts

### 3-Column Feature Grid
```jsx
<div className="grid md:grid-cols-3 gap-6 mb-12">
  <FeatureCard />
  <FeatureCard />
  <FeatureCard />
</div>
```

### 2-Column Content
```jsx
<div className="grid md:grid-cols-2 gap-8">
  <div>Left content</div>
  <div>Right content</div>
</div>
```

### Centered Container
```jsx
<div className="max-w-4xl mx-auto px-4">
  {/* Centered content */}
</div>
```

## Interactive States

### Hover Effects
```css
.card-hover: hover:bg-white/15 transition-all
.button-hover: hover:bg-[#740015] hover:scale-105 transition-all
.link-hover: hover:opacity-75 transition-opacity
```

### Focus States (ADD THESE!)
```css
.focus-outline: focus:ring-4 focus:ring-[#CE805C]/50 focus:outline-none
.focus-visible: focus-visible:ring-4 focus-visible:ring-[#CE805C]/50
```

### Active States
```css
.active-state: active:scale-95 transition-transform
```

## Accessibility Checklist

### Color Contrast
- [ ] White text on #990200 background: **Check ratio**
- [ ] White text on #531946 background: **Check ratio**
- [ ] White text on #CE805C background: **Check ratio**
- [ ] Gradient text has solid fallback

### Interactive Elements
- [ ] All buttons have `min-height: 44px` (touch target)
- [ ] All links have `min-height: 44px`
- [ ] Focus states visible on keyboard navigation
- [ ] ARIA labels on icon-only buttons

### Semantic HTML
```jsx
<header>
  <nav aria-label="Main navigation">
    {/* Navigation items */}
  </nav>
</header>

<main>
  <section aria-labelledby="features-heading">
    <h2 id="features-heading">Features</h2>
    {/* Feature cards */}
  </section>
</main>

<footer>
  {/* Footer content */}
</footer>
```

### ARIA Patterns
```jsx
// Button with icon only
<button aria-label="Toggle dark mode">
  🌙
</button>

// Loading state
<button aria-busy="true" disabled>
  Loading...
</button>

// Success/error messages
<div role="alert" aria-live="polite">
  {message}
</div>
```

## Image Optimization

### Lazy Loading
```jsx
<img 
  src="/assets/bride1.png" 
  alt="Traditional Hausa bride in wedding attire"
  loading="lazy"
  className="rounded-xl shadow-lg"
/>
```

### Responsive Images
```jsx
<picture>
  <source media="(min-width: 768px)" srcSet="/assets/hero-large.webp" />
  <source media="(max-width: 767px)" srcSet="/assets/hero-small.webp" />
  <img src="/assets/hero-large.png" alt="Hero image" />
</picture>
```

### Background Images
```jsx
<div 
  className="h-64 bg-cover bg-center rounded-xl"
  style={{ backgroundImage: 'url(/assets/couple1.png)' }}
  role="img"
  aria-label="Happy Hausa wedding couple"
>
</div>
```

## Animation Patterns

### Entrance Animations (from index.css)
```jsx
<div className="fade-in-up">
  {/* Content fades in and slides up */}
</div>
```

### Loading States
```jsx
<div className="shimmer">
  {/* Shimmer effect for loading skeleton */}
</div>
```

### Custom Animations
```jsx
// Add to tailwind.config.js
theme: {
  extend: {
    animation: {
      'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    }
  }
}
```

## Mobile-First Examples

### Navigation
```jsx
{/* Mobile: Hamburger */}
<button className="md:hidden p-2">
  <svg>...</svg>
</button>

{/* Desktop: Full nav */}
<nav className="hidden md:flex gap-4">
  {links}
</nav>
```

### Typography
```jsx
{/* Responsive text sizing */}
<h1 className="text-3xl md:text-5xl lg:text-7xl">
  {title}
</h1>
```

### Layouts
```jsx
{/* Mobile: Stack, Desktop: Grid */}
<div className="flex flex-col md:grid md:grid-cols-2 gap-4">
  {items}
</div>
```

## Dark Mode Patterns

### Background
```jsx
<div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
```

### Text
```jsx
<p className={darkMode ? 'text-white' : 'text-gray-900'}>
```

### Cards
```jsx
<div className={`rounded-xl p-6 ${
  darkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200'
}`}>
```

## Quick Wins Checklist

- [ ] Add `logowhite.jpg` to header (both branches)
- [ ] Apply `font-playfair` to all headings
- [ ] Apply `font-inter` to all body text
- [ ] Add hero image to PDF landing page
- [ ] Add PDF sample previews
- [ ] Fix gradient direction consistency
- [ ] Add focus states to all buttons/links
- [ ] Add alt text to all images
- [ ] Add ARIA labels to icon buttons
- [ ] Test mobile navigation
- [ ] Compress all PNG images
- [ ] Add loading="lazy" to images
- [ ] Split InteractiveGuide.jsx into smaller components
- [ ] Test color contrast ratios
- [ ] Add skip-to-content link

## Resources

- **Tailwind Docs**: https://tailwindcss.com/docs
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **ARIA Patterns**: https://www.w3.org/WAI/ARIA/apg/patterns/
- **Font Pairing**: Playfair Display (headings) + Inter (body)
- **Image Optimization**: https://squoosh.app/
