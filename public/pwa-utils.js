// PWA Utility Functions

// Function to register the service worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(
        function(registration) {
          console.log('Service Worker registration successful with scope: ', registration.scope);
          
          // Check for updates on page load
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, notify the user
                  const channel = new BroadcastChannel('sw-updates');
                  channel.postMessage({ 
                    type: 'UPDATE_AVAILABLE',
                    sw: newWorker
                  });
                  channel.close();
                }
              });
            }
          });
        },
        function(err) {
          console.log('Service Worker registration failed: ', err);
        }
      );
      
      // Check for updates every hour
      setInterval(() => {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration) {
            registration.update();
          }
        });
      }, 60 * 60 * 1000);
    });
  }
}

// Function to check if the app is installed
function isPWAInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator.standalone === true) || 
         document.referrer.includes('android-app://');
}

// Function to detect if the device is offline
function isOffline() {
  return !navigator.onLine;
}

// Function to add offline event listeners
function setupOfflineDetection(onOffline, onOnline) {
  window.addEventListener('offline', () => {
    if (typeof onOffline === 'function') {
      onOffline();
    }
  });
  
  window.addEventListener('online', () => {
    if (typeof onOnline === 'function') {
      onOnline();
    }
  });
  
  // Initial check
  if (isOffline() && typeof onOffline === 'function') {
    onOffline();
  }
}