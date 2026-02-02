# Next.js 15 Performance Optimization Learnings

## Core Performance Optimization Strategies

### 1. Bundle Optimization

#### Package Import Optimization
**Evidence**: Next.js automatically includes several libraries in `optimizePackageImports` by default:
- lucide-react
- date-fns  
- lodash-es
- ramda
- antd

**Implementation** ([source](https://github.com/vercel/next.js/blob/canary/packages/next/src/server/config.ts#L1278)):
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      // Icon libraries (large, many icons)
      'lucide-react',
      // Chart libraries
      'recharts',
      // Component libraries
      '@chakra-ui/react'
    ],
  },
}
```

**Key Learning**: Only optimize truly essential packages. Too many packages can cause HMR module factory issues.

#### Bundle Analysis
**Evidence**: Use `npx next experimental-analyze` for Turbopack-powered bundle analysis:
- Interactive bundle exploration
- Import chain visualization
- No build artifacts generated (analysis only)

**Example Implementation** ([source](https://github.com/vercel/next.js/blob/canary/packages/next/src/build/analyze/index.ts)):
```bash
npx next experimental-analyze
```

### 2. Image Optimization

#### Remote Image Configuration
**Evidence**: Secure remote image optimization using `remotePatterns`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        pathname: '/my-bucket/**',
        search: '',
      },
    ],
  },
}
```

**Key Features** ([source](https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/12-images.mdx)):
- Automatic WebP conversion
- Proper sizing for device detection
- Native lazy loading with blur-up placeholders
- Layout shift prevention

#### Image Component Best Practices
**Evidence**: Always include explicit dimensions for remote images:
```tsx
import Image from 'next/image'

export default function HeroImage() {
  return (
    <Image
      src="https://s3.amazonaws.com/my-bucket/hero.png"
      alt="Hero section"
      width={1920}
      height={1080}
      quality={75} // Default, adjust as needed
    />
  )
}
```

### 3. Code Splitting and Lazy Loading

#### Dynamic Imports Pattern
**Evidence**: Three main patterns from real-world implementations:

**1. Immediate Loading (separate bundle)**:
```jsx
const ComponentA = dynamic(() => import('../components/A'))
```

**2. Conditional Loading**:
```jsx
const ComponentB = dynamic(() => import('../components/B'))
{showMore && <ComponentB />}
```

**3. Client-Only Loading**:
```jsx
const ComponentC = dynamic(() => import('../components/C'), { ssr: false })
```

**Evidence**: Loading with fallback ([source](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/lazy-loading.mdx)):
```jsx
const DynamicHeader = dynamic(() => import('../components/header'), {
  loading: () => <p>Loading...</p>,
})
```

**Key Learning**: Automatic route-based code splitting is enabled by default. Dynamic imports are for Client Components.

### 4. Core Web Vitals Monitoring

#### Implementation Pattern
**Evidence**: Use `useReportWebVitals` in App Router:
```jsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
    // Send to analytics service
  })
}
```

**Integration** ([source](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/analytics.mdx)):
```jsx
import { WebVitals } from './_components/web-vitals'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
```

**Supported Metrics**:
- TTFB (Time to First Byte)
- FCP (First Contentful Paint)  
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- INP (Interaction to Next Paint)

### 5. Real-World Configuration Examples

#### Production-Ready Config
**Evidence**: From production applications ([source](https://github.com/xun082/DocFlow/blob/main/next.config.ts)):
```typescript
export default {
  experimental: {
    // Carefully selected package optimizations
    optimizePackageImports: [
      'lucide-react',    // Icon library
      'recharts',       // Charts
      // Avoid listing too many packages
    ],
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
        search: '',
      },
    ],
  },
  
  // Memory optimization for ISR
  incrementalCacheHandlerPath: './cache-handler.js',
}
```

## Implementation Checklist

### Essential Optimizations
- [ ] Configure `optimizePackageImports` for icon/chart libraries
- [ ] Set up `remotePatterns` for external images
- [ ] Use `next/image` with explicit dimensions
- [ ] Implement `useReportWebVitals` for monitoring
- [ ] Use `dynamic()` for heavy client components

### Performance Monitoring
- [ ] Run `npx next experimental-analyze` regularly
- [ ] Monitor Core Web Vitals in production
- [ ] Test bundle size with each major change
- [ ] Use `loading` fallbacks for dynamic imports

### Landing Page Specific
- [ ] Hero images: WebP optimization + proper sizing
- [ ] Above-the-fold content: minimal JavaScript
- [ ] Below-the-fold: lazy loaded components
- [ ] Critical CSS: inline in layout
