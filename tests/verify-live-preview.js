// Verification script for live preview functionality
// This script can be run in the browser console to test the implementation

function verifyLivePreview() {
  console.log('🔍 Verifying Live Preview Functionality...');
  
  // Check if main app is initialized
  const canvas = document.getElementById('preview-canvas');
  if (!canvas) {
    console.error('❌ Canvas element not found');
    return false;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('❌ Canvas context not available');
    return false;
  }
  
  console.log('✅ Canvas initialized successfully');
  
  // Check form elements
  const formElements = [
    'speaker-name',
    'topic-title', 
    'speaker-bio',
    'event-date',
    'event-time',
    'event-format'
  ];
  
  const missingElements = formElements.filter(id => !document.getElementById(id));
  if (missingElements.length > 0) {
    console.error('❌ Missing form elements:', missingElements);
    return false;
  }
  
  console.log('✅ All form elements found');
  
  // Test event listeners
  let renderCount = 0;
  const originalRender = window.app?.renderPreview;
  
  if (typeof originalRender === 'function') {
    // Temporarily override render function to count calls
    window.app.renderPreview = function() {
      renderCount++;
      originalRender.call(this);
    };
    
    // Test input events
    const nameInput = document.getElementById('speaker-name');
    nameInput.value = 'Test Speaker';
    nameInput.dispatchEvent(new Event('input'));
    
    setTimeout(() => {
      if (renderCount > 0) {
        console.log('✅ Live preview updates working - render called', renderCount, 'times');
      } else {
        console.error('❌ Live preview not updating on input');
      }
      
      // Restore original function
      window.app.renderPreview = originalRender;
    }, 100);
  } else {
    console.error('❌ App render function not found');
    return false;
  }
  
  // Test text wrapping with ellipsis
  const testText = 'This is a very long text that should be wrapped and truncated with ellipsis when it exceeds the maximum width allowed for the canvas rendering area';
  
  if (window.app && typeof window.app.wrapText === 'function') {
    const wrappedLines = window.app.wrapText(testText, 200, 2);
    if (wrappedLines.length <= 2 && wrappedLines[wrappedLines.length - 1].includes('...')) {
      console.log('✅ Text wrapping with ellipsis working');
    } else {
      console.log('⚠️ Text wrapping may not be applying ellipsis correctly');
    }
  }
  
  console.log('🎉 Live preview verification complete');
  return true;
}

// Auto-run verification when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', verifyLivePreview);
} else {
  verifyLivePreview();
}