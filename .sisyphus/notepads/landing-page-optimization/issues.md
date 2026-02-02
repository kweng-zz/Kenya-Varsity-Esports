# Issues and Blockers - Landing Page Optimization

## [2025-02-02] Critical Performance Issues

### High-Impact Blockers
1. **28MB Hero Video**: IMG_7172.MOV causes massive initial load
   - Impact: +25MB to initial page load
   - User Experience: Extremely slow on mobile and slow connections
   - Status: URGENT - needs immediate compression/format conversion

2. **Large PNG Files**: Multiple 6-8MB uncompressed images
   - Files: September-Season.png (8.3MB), January-Season.png (7.3MB), etc.
   - Impact: +35MB total image load
   - Issue: No WebP/AVIF conversion implemented
   - Status: HIGH - batch conversion needed

3. **Bundle Size**: No code splitting strategy
   - Impact: All components load upfront, large JavaScript bundle
   - Issue: Heavy dependencies (Appwrite, Contentful) loaded synchronously
   - Status: MEDIUM - implement dynamic imports

4. **Missing Performance Monitoring**
   - Issue: No bundle analysis configured
   - Impact: Cannot measure optimization effectiveness
   - Status: MEDIUM - need webpack-bundle-analyzer setup

### Technical Debt
1. **Video Implementation**: Fixed attachment in hero banner (performance intensive)
   - Current: `object-fit: cover` with full video load
   - Needed: Lazy loading with poster fallback

2. **Asset Pipeline**: No automated optimization
   - Issue: Manual image handling, no CDN optimization
   - Status: LOW - improve over time

### Resource Constraints
- Video compression tools need to be available in build pipeline
- Bundle analysis requires build process modifications
- Image conversion may need additional tooling

## [2025-02-02] Implementation Challenges

### Tooling Requirements
- Video compression utilities (FFmpeg or similar)
- Image batch processing tools
- Bundle analyzer configuration
- Performance monitoring setup

### Potential Conflicts
- Video format conversion may affect visual quality
- Image compression might impact sharpness
- Code splitting could affect component hydration

### Testing Requirements
- Performance regression testing needed
- Cross-browser compatibility for WebP/WebM
- Mobile device testing for optimization effects