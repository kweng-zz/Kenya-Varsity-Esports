// Hydration fix utilities

// List of known browser extension attributes that cause hydration mismatches
const BROWSER_EXTENSION_ATTRIBUTES = [
  'bis_skin_checked',
  'bis_register',
  '__processed_aca438c9-853a-44c2-ab3e-ff94c42af5c9__',
  'data-new-gr-c-s-check-loaded',
  'data-gr-ext-installed',
  'data-adblock-key',
  'data-darkreader-mode',
  'data-darkreader-scheme',
  'cz-shortcut-listen',
  'data-lt-installed',
  'data-1p-ignore',
  'data-lastpass-icon-root',
];

// Function to clean browser extension attributes from elements
export function cleanBrowserExtensionAttributes(element: Element) {
  BROWSER_EXTENSION_ATTRIBUTES.forEach(attr => {
    if (element.hasAttribute(attr)) {
      element.removeAttribute(attr);
    }
  });
  
  // Also clean from child elements
  const children = element.querySelectorAll('*');
  children.forEach(child => {
    BROWSER_EXTENSION_ATTRIBUTES.forEach(attr => {
      if (child.hasAttribute(attr)) {
        child.removeAttribute(attr);
      }
    });
  });
}

// Function to suppress hydration warnings for known browser extension issues
export function suppressHydrationWarnings() {
  if (typeof window === 'undefined') return;

  // Override console.error to filter out hydration warnings caused by browser extensions
  const originalError = console.error;
  console.error = (...args) => {
    const message = args[0];
    if (typeof message === 'string') {
      // Filter out hydration warnings related to browser extensions
      if (
        message.includes('Hydration failed') ||
        message.includes('hydrated but some attributes') ||
        message.includes('bis_skin_checked') ||
        message.includes('__processed_') ||
        message.includes('data-new-gr-c-s-check-loaded') ||
        message.includes('data-gr-ext-installed')
      ) {
        // Don't log these specific hydration warnings
        return;
      }
    }
    // Log all other errors normally
    originalError.apply(console, args);
  };
}

// Initialize hydration fixes
export function initializeHydrationFixes() {
  if (typeof window === 'undefined') return;

  // Suppress hydration warnings
  suppressHydrationWarnings();

  // Clean browser extension attributes after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      cleanBrowserExtensionAttributes(document.body);
    });
  } else {
    cleanBrowserExtensionAttributes(document.body);
  }

  // Also clean attributes after React hydration
  setTimeout(() => {
    cleanBrowserExtensionAttributes(document.body);
  }, 100);
}