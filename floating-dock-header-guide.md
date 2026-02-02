# Floating Dock Header Navigation - Implementation Guide

## Overview
Create a macOS-style dock navigation effect in your website header with proximity-based icon magnification and a translucent glass-morphism background.

---

## Core Concept

The effect relies on **mouse proximity detection** to dynamically scale navigation items. As the cursor moves near menu items, they magnify smoothly based on their distance from the cursor position, creating the signature dock effect.

---

## Technical Requirements

### Dependencies
```bash
npm install framer-motion
```

### Technologies
- **React** (or Next.js)
- **Framer Motion** - For smooth spring animations
- **Tailwind CSS** - For styling (including backdrop-blur for glass effect)

---

## Implementation Steps

### 1. Header Structure

Create a header with:
- Fixed positioning at the top
- Translucent background with backdrop blur (glass-morphism)
- Centered navigation items

```jsx
<header className="fixed top-0 left-0 right-0 z-50">
  <nav className="flex justify-center items-center h-16 px-8 
                  bg-white/70 dark:bg-black/70 
                  backdrop-blur-md 
                  border-b border-gray-200/20">
    {/* Navigation items will go here */}
  </nav>
</header>
```

---

### 2. Mouse Position Tracking

**Key Implementation:** Track the mouse position relative to the navigation container.

```jsx
const [mouseX, setMouseX] = useState(null);

// Track mouse position when hovering over the nav
const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  setMouseX(e.clientX - rect.left);
};

// Reset when mouse leaves
const handleMouseLeave = () => {
  setMouseX(null);
};
```

**Apply to nav container:**
```jsx
<nav 
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
>
```

---

### 3. Distance Calculation for Each Item

**Core Logic:** Calculate how far each navigation item is from the cursor.

For each menu item, you need:
- A ref to get its position
- Calculate distance from mouse to item center
- Convert distance to a scale value

```jsx
const NavItem = ({ children, mouseX }) => {
  const ref = useRef(null);
  
  // Calculate distance from mouse to this item's center
  const distance = useMemo(() => {
    if (mouseX === null || !ref.current) return Infinity;
    
    const rect = ref.current.getBoundingClientRect();
    const itemCenterX = rect.left + rect.width / 2 - ref.current.offsetParent.getBoundingClientRect().left;
    
    return Math.abs(mouseX - itemCenterX);
  }, [mouseX]);
  
  return <div ref={ref}>{children}</div>;
};
```

---

### 4. Distance to Scale Conversion

**The Magic Formula:** Convert distance into a scale value.

```jsx
const distanceToScale = (distance) => {
  const maxDistance = 150; // pixels - items within this range are affected
  const maxScale = 1.5;    // maximum magnification
  const minScale = 1.0;    // normal size
  
  if (distance > maxDistance) return minScale;
  
  // Linear interpolation
  const scale = maxScale - ((distance / maxDistance) * (maxScale - minScale));
  return scale;
};
```

**Advanced (Smoother curve):**
```jsx
const distanceToScale = (distance) => {
  const maxDistance = 150;
  const maxScale = 1.5;
  
  if (distance > maxDistance) return 1;
  
  // Exponential curve for smoother falloff
  const normalizedDistance = distance / maxDistance;
  const scale = 1 + (maxScale - 1) * Math.pow(1 - normalizedDistance, 2);
  
  return scale;
};
```

---

### 5. Animated Scale with Framer Motion

Apply the calculated scale with smooth spring animations:

```jsx
import { motion, useSpring, useTransform } from 'framer-motion';

const NavItem = ({ children, mouseX, href }) => {
  const ref = useRef(null);
  
  const distance = useMemo(() => {
    if (mouseX === null || !ref.current) return Infinity;
    const rect = ref.current.getBoundingClientRect();
    const parentRect = ref.current.offsetParent.getBoundingClientRect();
    const itemCenterX = rect.left + rect.width / 2 - parentRect.left;
    return Math.abs(mouseX - itemCenterX);
  }, [mouseX]);
  
  // Convert distance to scale
  const scale = useMemo(() => {
    const maxDistance = 150;
    const maxScale = 1.5;
    if (distance > maxDistance) return 1;
    const normalizedDistance = distance / maxDistance;
    return 1 + (maxScale - 1) * Math.pow(1 - normalizedDistance, 2);
  }, [distance]);
  
  // Smooth spring animation
  const animatedScale = useSpring(scale, {
    stiffness: 300,
    damping: 20
  });
  
  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ scale: animatedScale }}
      className="relative px-4 py-2 text-gray-700 dark:text-gray-300 
                 hover:text-gray-900 dark:hover:text-white
                 transition-colors duration-200"
    >
      {children}
    </motion.a>
  );
};
```

---

### 6. Complete Component Structure

```jsx
'use client'; // If using Next.js 13+

import { useState, useRef, useMemo } from 'react';
import { motion, useSpring } from 'framer-motion';

const FloatingDockHeader = ({ menuItems }) => {
  const [mouseX, setMouseX] = useState(null);
  const navRef = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  };
  
  const handleMouseLeave = () => {
    setMouseX(null);
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav 
        ref={navRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex justify-center items-center h-16 px-8 
                   bg-white/70 dark:bg-black/70 
                   backdrop-blur-md backdrop-saturate-150
                   border-b border-gray-200/20
                   shadow-sm"
      >
        <div className="flex items-center gap-2">
          {menuItems.map((item, idx) => (
            <NavItem 
              key={idx} 
              mouseX={mouseX}
              href={item.href}
            >
              {item.icon && <span className="text-xl">{item.icon}</span>}
              <span className="ml-2">{item.label}</span>
            </NavItem>
          ))}
        </div>
      </nav>
    </header>
  );
};

const NavItem = ({ children, mouseX, href }) => {
  const ref = useRef(null);
  
  const distance = useMemo(() => {
    if (mouseX === null || !ref.current) return Infinity;
    const rect = ref.current.getBoundingClientRect();
    const parentRect = ref.current.offsetParent.getBoundingClientRect();
    const itemCenterX = rect.left + rect.width / 2 - parentRect.left;
    return Math.abs(mouseX - itemCenterX);
  }, [mouseX]);
  
  const scale = useMemo(() => {
    const maxDistance = 150;
    const maxScale = 1.5;
    if (distance > maxDistance) return 1;
    const normalizedDistance = distance / maxDistance;
    return 1 + (maxScale - 1) * Math.pow(1 - normalizedDistance, 2);
  }, [distance]);
  
  const animatedScale = useSpring(scale, {
    stiffness: 300,
    damping: 20,
  });
  
  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ scale: animatedScale }}
      className="relative px-4 py-2 flex items-center
                 text-gray-700 dark:text-gray-300 
                 hover:text-gray-900 dark:hover:text-white
                 transition-colors duration-200
                 cursor-pointer"
    >
      {children}
    </motion.a>
  );
};

export default FloatingDockHeader;
```

---

### 7. Usage Example

```jsx
const App = () => {
  const menuItems = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'Products', href: '/products', icon: '📦' },
    { label: 'About', href: '/about', icon: 'ℹ️' },
    { label: 'Contact', href: '/contact', icon: '📧' },
  ];
  
  return (
    <div>
      <FloatingDockHeader menuItems={menuItems} />
      {/* Rest of your app */}
    </div>
  );
};
```

---

## Fine-Tuning Parameters

### Scale Behavior
```jsx
const maxDistance = 150;  // How far the effect reaches (pixels)
const maxScale = 1.5;     // Maximum size multiplier (1.5 = 150%)
const minScale = 1.0;     // Normal size
```

### Animation Spring
```jsx
useSpring(scale, {
  stiffness: 300,  // Higher = snappier (200-400 recommended)
  damping: 20,     // Higher = less bouncy (15-30 recommended)
});
```

### Glass Effect
```jsx
className="
  bg-white/70              /* 70% opacity white */
  dark:bg-black/70         /* 70% opacity black in dark mode */
  backdrop-blur-md         /* Medium blur */
  backdrop-saturate-150    /* Enhance colors behind */
"
```

---

## Advanced Enhancements

### 1. Add Vertical Scaling Too
```jsx
const animatedScaleY = useSpring(scale, { stiffness: 300, damping: 20 });

<motion.a
  style={{ 
    scaleX: animatedScale,
    scaleY: animatedScaleY 
  }}
>
```

### 2. Add Icon-Only Mode for More Space
```jsx
const [isHovered, setIsHovered] = useState(false);

<motion.a
  onHoverStart={() => setIsHovered(true)}
  onHoverEnd={() => setIsHovered(false)}
>
  <span className="text-xl">{item.icon}</span>
  <AnimatePresence>
    {isHovered && (
      <motion.span
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: 'auto' }}
        exit={{ opacity: 0, width: 0 }}
        className="ml-2 overflow-hidden"
      >
        {item.label}
      </motion.span>
    )}
  </AnimatePresence>
</motion.a>
```

### 3. Add Tooltip on Hover
```jsx
<motion.div
  style={{ scale: animatedScale }}
  className="relative group"
>
  <a href={href}>{children}</a>
  
  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                  px-2 py-1 bg-gray-900 text-white text-xs rounded">
    {tooltip}
  </div>
</motion.div>
```

### 4. Neighbor Scaling (Items next to hovered item also scale)
```jsx
const getScale = (index, hoveredIndex, mouseX) => {
  if (mouseX === null) return 1;
  
  // Calculate based on index distance from hovered item
  const indexDistance = Math.abs(index - hoveredIndex);
  
  if (indexDistance === 0) return 1.5;  // Hovered item
  if (indexDistance === 1) return 1.3;  // Adjacent items
  if (indexDistance === 2) return 1.15; // Items 2 away
  
  return 1; // Others stay normal
};
```

---

## Common Issues & Solutions

### Issue: Laggy animations
**Solution:** Use `will-change` CSS property
```jsx
className="will-change-transform"
```

### Issue: Items shift layout when scaling
**Solution:** Use `transform-origin` and ensure parent has enough space
```jsx
style={{ 
  transformOrigin: 'center',
  scale: animatedScale 
}}
```

### Issue: Glass effect not working
**Solution:** Ensure Tailwind config includes backdrop filters
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      }
    }
  }
}
```

---

## Performance Optimization

1. **Memoize distance calculations** - Already done with `useMemo`
2. **Debounce mouse move** (optional for very slow devices)
3. **Use `transform` instead of width/height** - Already done with `scale`
4. **Limit affected items** - Only calculate for items within range

```jsx
const shouldAnimate = distance < 200; // Only animate if within 200px

return shouldAnimate ? (
  <motion.a style={{ scale: animatedScale }}>
) : (
  <a> // Regular anchor, no animation
);
```

---

## Accessibility Considerations

```jsx
<motion.a
  ref={ref}
  href={href}
  style={{ scale: animatedScale }}
  aria-label={item.label}
  className="focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  {children}
</motion.a>
```

Add keyboard navigation support:
```jsx
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    // Handle navigation
  }
}}
```

---

## Complete Working Example with All Features

Save this as a reference for the fully-featured implementation with all the bells and whistles including mobile responsiveness, dark mode, and accessibility.

---

## Key Takeaways

1. **Mouse tracking** is done at the container level (nav element)
2. **Distance calculation** happens per item using refs
3. **Scale conversion** uses a mathematical formula (linear or exponential)
4. **Spring animation** from Framer Motion makes it smooth
5. **Glass-morphism** is achieved with backdrop-blur and semi-transparent backgrounds

The effect is surprisingly simple once you understand the core principle: **track mouse position → calculate distances → convert to scales → animate smoothly**.
