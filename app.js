// Speaker Spotlight Application
class SpeakerSpotlightApp {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.currentTheme = 'light';
    this.renderTimeout = null; // For debounced rendering
    
    // Error handling state
    this.fontsLoaded = false;
    this.fontLoadingError = false;
    this.canvasSupported = false;
    this.clipboardCapabilities = null;
    this.renderAttempts = 0;
    
    this.init();
  }
  
  init() {
    // Set up global error handling
    this.setupGlobalErrorHandling();
    
    // Wait for CONFIG to be available before proceeding
    this.waitForConfig();
  }
  
  waitForConfig() {
    // Check if CONFIG is already loaded
    if (window.CONFIG && window.CONFIG.form && window.CONFIG.form.limits) {
      this.initializeApp();
      return;
    }
    
    // Wait a bit and check again
    setTimeout(() => {
      if (window.CONFIG && window.CONFIG.form && window.CONFIG.form.limits) {
        this.initializeApp();
      } else {
        console.error('CONFIG not loaded after timeout. Please refresh the page.');
        this.showUserError('Configuration failed to load. Please refresh the page.');
      }
    }, 100);
  }
  
  initializeApp() {
    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  setupGlobalErrorHandling() {
    // Catch unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('Global error caught:', event.error);
      this.handleGlobalError(event.error, 'JavaScript Error');
    });
    
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleGlobalError(event.reason, 'Promise Rejection');
    });
    
    // Detect browser compatibility issues
    this.detectBrowserCompatibility();
  }
  
  detectBrowserCompatibility() {
    const issues = [];
    
    // Check for essential APIs
    if (!window.localStorage) {
      issues.push('Local Storage not supported');
    }
    
    if (!window.addEventListener) {
      issues.push('Event listeners not supported');
    }
    
    if (!document.querySelector) {
      issues.push('Modern DOM methods not supported');
    }
    
    if (!Array.prototype.forEach) {
      issues.push('Modern JavaScript features not supported');
    }
    
    // Check for Canvas support
    const canvas = document.createElement('canvas');
    if (!canvas.getContext) {
      issues.push('HTML5 Canvas not supported');
    }
    
    // Show compatibility warnings if issues found
    if (issues.length > 0) {
      this.showCompatibilityWarning(issues);
    }
  }
  
  showCompatibilityWarning(issues) {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'compatibility-warning';
    warningDiv.innerHTML = `
      <strong>Browser Compatibility Warning:</strong><br>
      Your browser may not fully support this application. Issues detected:<br>
      <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
        ${issues.map(issue => `<li>${issue}</li>`).join('')}
      </ul>
      Please consider updating your browser for the best experience.
    `;
    
    // Insert at the top of the main container
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
      mainContainer.insertBefore(warningDiv, mainContainer.firstChild);
    }
  }
  
  handleGlobalError(error, type) {
    // Don't show too many error messages
    if (this.errorCount && this.errorCount > 3) {
      return;
    }
    
    this.errorCount = (this.errorCount || 0) + 1;
    
    // Show user-friendly error message
    const errorMessage = this.getErrorMessage(error, type);
    this.showUserError(errorMessage);
    
    // Reset error count after some time
    setTimeout(() => {
      this.errorCount = Math.max(0, (this.errorCount || 1) - 1);
    }, 30000);
  }
  
  getErrorMessage(error, type) {
    if (type === 'JavaScript Error') {
      if (error.message && error.message.includes('canvas')) {
        return 'There was an issue with the preview display. Please refresh the page.';
      } else if (error.message && error.message.includes('clipboard')) {
        return 'There was an issue with copying text. Please try the manual copy option.';
      }
    }
    
    return 'An unexpected error occurred. Please refresh the page if problems persist.';
  }
  
  showUserError(message) {
    // Create or update error notification
    let errorNotification = document.getElementById('global-error-notification');
    if (!errorNotification) {
      errorNotification = document.createElement('div');
      errorNotification.id = 'global-error-notification';
      errorNotification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--error-color);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        max-width: 300px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      `;
      document.body.appendChild(errorNotification);
    }
    
    errorNotification.textContent = message;
    errorNotification.style.display = 'block';
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (errorNotification) {
        errorNotification.style.display = 'none';
      }
    }, 10000);
  }
  
  checkCanvasSupport() {
    // Check if canvas is supported
    const testCanvas = document.createElement('canvas');
    if (!testCanvas.getContext) {
      this.showCanvasError('HTML5 Canvas is not supported in your browser. Please upgrade to a modern browser that supports Canvas.');
      return false;
    }
    
    // Check if 2D context is supported
    const testCtx = testCanvas.getContext('2d');
    if (!testCtx) {
      this.showCanvasError('Canvas 2D rendering is not supported in your browser. Please upgrade to a modern browser.');
      return false;
    }
    
    // Check if required canvas methods are available
    const requiredMethods = ['fillRect', 'fillText', 'measureText', 'clearRect'];
    for (const method of requiredMethods) {
      if (typeof testCtx[method] !== 'function') {
        this.showCanvasError(`Canvas method '${method}' is not supported. Please upgrade to a modern browser.`);
        return false;
      }
    }
    
    return true;
  }
  
  setup() {
    // Check for canvas support first
    if (!this.checkCanvasSupport()) {
      return;
    }
    
    // Initialize canvas
    this.canvas = document.getElementById('preview-canvas');
    if (!this.canvas) {
      console.error('Canvas element not found');
      this.showCanvasError('Canvas element not found. Please refresh the page.');
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.error('Canvas 2D context not supported');
      this.showCanvasError('Canvas is not supported in your browser. Please upgrade to a modern browser.');
      return;
    }
    
    // Initialize theme
    this.initializeTheme();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Set default values
    this.setDefaultValues();
    
    // Initialize font loading
    this.initializeFontLoading();
    
    // Initial render
    this.renderPreview();
  }
  
  initializeTheme() {
    // Detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    this.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    this.updateThemeIcon();
    this.updateThemeButtonState();
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.currentTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
        this.updateThemeButtonState();
        this.renderPreview();
      }
    });
  }
  
  setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => this.toggleTheme());
    
    // Keyboard support for theme toggle
    themeToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
    
    // GitHub link
    const githubLink = document.getElementById('github-link');
    githubLink.addEventListener('click', () => {
      window.open(CONFIG.event.githubUrl, '_blank');
    });
    
    // Keyboard support for GitHub link
    githubLink.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.open(CONFIG.event.githubUrl, '_blank');
      }
    });
    
    // Form inputs with validation and real-time feedback
    this.setupFormValidation();
    
    // Copy text button
    const copyTextBtn = document.getElementById('copy-text-btn');
    if (copyTextBtn) {
      copyTextBtn.addEventListener('click', () => this.copyFormattedText());
      
      // Keyboard support for copy button
      copyTextBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.copyFormattedText();
        }
      });
    }
    
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Alt + T for theme toggle
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        this.toggleTheme();
      }
      
      // Alt + C for copy text
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        this.copyFormattedText();
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        const modal = document.querySelector('.copy-modal');
        if (modal) {
          modal.remove();
        }
      }
    });
  }
  
  setDefaultValues() {
    // Set default date from config
    const dateInput = document.getElementById('event-date');
    dateInput.value = CONFIG.event.defaultDate;
    
    // Set default time
    const timeInput = document.getElementById('event-time');
    timeInput.value = CONFIG.form.defaults.time;
  }
  
  initializeFontLoading() {
    // Initialize font loading state
    this.fontsLoaded = false;
    this.fontLoadingError = false;
    
    // Check if Font Loading API is supported
    if ('fonts' in document) {
      // Use Font Loading API if available
      document.fonts.ready.then(() => {
        this.fontsLoaded = true;
        this.renderPreview(); // Re-render with loaded fonts
      }).catch((error) => {
        console.warn('Font loading failed:', error);
        this.fontLoadingError = true;
        this.fontsLoaded = true; // Continue with fallback fonts
        this.renderPreview();
      });
      
      // Set a timeout as fallback
      setTimeout(() => {
        if (!this.fontsLoaded) {
          console.warn('Font loading timeout, using fallback fonts');
          this.fontLoadingError = true;
          this.fontsLoaded = true;
          this.renderPreview();
        }
      }, 3000); // 3 second timeout
    } else {
      // Fallback for browsers without Font Loading API
      console.warn('Font Loading API not supported, using fallback method');
      this.setupFontLoadingFallback();
    }
  }
  
  setupFontLoadingFallback() {
    // Create a test element to detect font loading
    const testElement = document.createElement('div');
    testElement.style.fontFamily = CONFIG.canvas.fonts.primary;
    testElement.style.fontSize = '16px';
    testElement.style.position = 'absolute';
    testElement.style.left = '-9999px';
    testElement.style.top = '-9999px';
    testElement.textContent = 'Test';
    document.body.appendChild(testElement);
    
    // Measure initial width with fallback font
    const initialWidth = testElement.offsetWidth;
    
    // Check periodically if font has loaded
    let attempts = 0;
    const maxAttempts = 30; // 3 seconds with 100ms intervals
    
    const checkFont = () => {
      attempts++;
      const currentWidth = testElement.offsetWidth;
      
      if (currentWidth !== initialWidth || attempts >= maxAttempts) {
        // Font loaded or timeout reached
        document.body.removeChild(testElement);
        
        if (attempts >= maxAttempts) {
          console.warn('Font loading fallback timeout');
          this.fontLoadingError = true;
        }
        
        this.fontsLoaded = true;
        this.renderPreview();
      } else {
        setTimeout(checkFont, 100);
      }
    };
    
    setTimeout(checkFont, 100);
  }
  
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
    this.updateThemeIcon();
    this.updateThemeButtonState();
    this.renderPreview(); // Re-render canvas with new theme colors
  }
  
  updateThemeButtonState() {
    const themeToggle = document.getElementById('theme-toggle');
    const isDark = this.currentTheme === 'dark';
    themeToggle.setAttribute('aria-pressed', isDark.toString());
    themeToggle.setAttribute('aria-label', 
      isDark ? 'Switch to light theme' : 'Switch to dark theme'
    );
  }
  
  updateThemeIcon() {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (this.currentTheme === 'dark') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }
  
  setupFormValidation() {
    // Check if CONFIG is loaded first
    if (!window.CONFIG || !window.CONFIG.form || !window.CONFIG.form.limits) {
      console.error('Configuration not loaded. Please refresh the page.');
      return;
    }
    
    // Get form elements
    const speakerName = document.getElementById('speaker-name');
    const topicTitle = document.getElementById('topic-title');
    const speakerBio = document.getElementById('speaker-bio');
    const eventDate = document.getElementById('event-date');
    const eventTime = document.getElementById('event-time');
    const eventFormat = document.getElementById('event-format');

    
    // Character counters
    const nameCounter = document.getElementById('name-counter');
    const topicCounter = document.getElementById('topic-counter');
    const bioCounter = document.getElementById('bio-counter');
    
    // Verify all elements exist
    if (!speakerName || !topicTitle || !speakerBio || !eventDate || !eventTime || !eventFormat) {
      console.error('Some form elements not found');
      return;
    }
    
    if (!nameCounter || !topicCounter || !bioCounter) {
      console.error('Some counter elements not found');
      return;
    }
    
    // Set up character counting and validation for text inputs
    this.setupCharacterCounter(speakerName, nameCounter, CONFIG.form.limits.speakerName);
    this.setupCharacterCounter(topicTitle, topicCounter, CONFIG.form.limits.topicTitle);
    this.setupCharacterCounter(speakerBio, bioCounter, CONFIG.form.limits.speakerBio);
    
    // Initialize bio counter display
    this.updateBioCounter();
    
    // Set up bio override toggle
    this.setupBioOverrideToggle();
    
    // Set up real-time validation and canvas rendering for all form fields
    const formFields = [speakerName, topicTitle, speakerBio, eventDate, eventTime, eventFormat];
    formFields.forEach(field => {
      // Real-time updates on input
      field.addEventListener('input', () => {
        this.validateField(field);
        this.renderPreview(); // Re-render canvas on input change
      });
      
      // Additional events for comprehensive real-time updates
      field.addEventListener('change', () => {
        this.validateField(field);
        this.renderPreview(); // Re-render canvas on change (for select/date inputs)
      });
      
      field.addEventListener('keyup', () => {
        this.renderPreview(); // Ensure updates on all key events
      });
      
      field.addEventListener('paste', () => {
        // Delay to allow paste content to be processed
        setTimeout(() => {
          this.validateField(field);
          this.renderPreview();
        }, 10);
      });
      
      field.addEventListener('blur', () => this.validateField(field));
    });
    
    // Form submission prevention (since this is a preview-only app)
    const form = document.getElementById('speaker-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validateAllFields();
    });
  }
  
  setupCharacterCounter(input, counter, maxLength) {
    const updateCounter = () => {
      const currentLength = input.value.length;
      const counterSpan = counter.querySelector('span');
      const isOverrideEnabled = this.isBioOverrideEnabled();
      
      // Safety check for CONFIG
      if (!window.CONFIG || !window.CONFIG.form || !window.CONFIG.form.limits) {
        console.error('Configuration not available in setupCharacterCounter');
        return;
      }
      
      // Use override limit if enabled for bio, otherwise use original limit
      const effectiveLimit = (input.id === 'speaker-bio' && isOverrideEnabled) ? 
        CONFIG.form.limits.speakerBioOverride : maxLength;
      
      // Update the span with current length
      if (counterSpan) {
        counterSpan.textContent = currentLength;
      }
      
      // Update the counter div with the full text (current/max)
      counter.innerHTML = `<span>${currentLength}</span>/${effectiveLimit}`;
      
      // Update counter color and ARIA attributes based on character limit
      const counterContainer = counter.parentElement || counter;
      counterContainer.classList.remove('warning', 'error');
      
      let status = '';
      if (currentLength >= effectiveLimit) {
        counterContainer.classList.add('error');
        status = 'Character limit reached';
        counter.setAttribute('aria-label', `${currentLength} of ${effectiveLimit} characters used. ${status}`);
      } else if (currentLength >= effectiveLimit * 0.9) {
        counterContainer.classList.add('warning');
        status = 'Approaching character limit';
        counter.setAttribute('aria-label', `${currentLength} of ${effectiveLimit} characters used. ${status}`);
      } else {
        counter.setAttribute('aria-label', `${currentLength} of ${effectiveLimit} characters used`);
      }
      
      // Update the input's aria-describedby to include status
      if (status) {
        input.setAttribute('aria-describedby', 
          input.getAttribute('aria-describedby') + ' counter-status'
        );
        
        // Create or update status element
        let statusElement = document.getElementById('counter-status');
        if (!statusElement) {
          statusElement = document.createElement('div');
          statusElement.id = 'counter-status';
          statusElement.className = 'sr-only';
          statusElement.setAttribute('aria-live', 'polite');
          document.body.appendChild(statusElement);
        }
        statusElement.textContent = status;
      }
    };
    
    // Update counter on input and paste events
    input.addEventListener('input', updateCounter);
    input.addEventListener('paste', () => {
      // Delay to allow paste content to be processed
      setTimeout(updateCounter, 10);
    });
    
    // Initialize counter
    updateCounter();
  }
  
  setupBioOverrideToggle() {
    const overrideToggle = document.getElementById('bio-override-toggle');
    const speakerBio = document.getElementById('speaker-bio');
    
    if (!overrideToggle || !speakerBio) {
      console.error('Bio override toggle elements not found');
      return;
    }
    
    // Set initial state - override is disabled by default
    overrideToggle.setAttribute('aria-pressed', 'false');
    speakerBio.setAttribute('maxlength', CONFIG.form.limits.speakerBio);
    
    overrideToggle.addEventListener('click', () => {
      const isPressed = overrideToggle.getAttribute('aria-pressed') === 'true';
      const newState = !isPressed;
      
      // Update button state
      overrideToggle.setAttribute('aria-pressed', newState.toString());
      
      // Update textarea maxlength
      if (newState) {
        speakerBio.removeAttribute('maxlength');
        overrideToggle.querySelector('.override-text').textContent = 'Limit Overridden';
        overrideToggle.setAttribute('aria-label', 'Character limit override is enabled');
        overrideToggle.setAttribute('title', 'Click to disable character limit override');
      } else {
        speakerBio.setAttribute('maxlength', CONFIG.form.limits.speakerBio);
        overrideToggle.querySelector('.override-text').textContent = 'Override Limit';
        overrideToggle.setAttribute('aria-label', 'Toggle character limit override');
        overrideToggle.setAttribute('title', 'Click to override 300 character limit');
      }
      
      // Update character counter
      const bioCounter = document.getElementById('bio-counter');
      if (bioCounter) {
        this.updateBioCounter();
      }
      
      // Update textarea maxlength attribute
      if (newState) {
        speakerBio.removeAttribute('maxlength');
      } else {
        speakerBio.setAttribute('maxlength', CONFIG.form.limits.speakerBio);
      }
      
      // Re-validate the field
      this.validateField(speakerBio);
    });
    
    // Keyboard support for override toggle
    overrideToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        overrideToggle.click();
      }
    });
  }
  
  isBioOverrideEnabled() {
    const overrideToggle = document.getElementById('bio-override-toggle');
    return overrideToggle && overrideToggle.getAttribute('aria-pressed') === 'true';
  }
  
  updateBioCounter() {
    const speakerBio = document.getElementById('speaker-bio');
    const bioCounter = document.getElementById('bio-counter');
    
    if (!speakerBio || !bioCounter) return;
    
    // Safety check for CONFIG
    if (!window.CONFIG || !window.CONFIG.form || !window.CONFIG.form.limits) {
      console.error('Configuration not available in updateBioCounter');
      return;
    }
    
    const currentLength = speakerBio.value.length;
    const isOverrideEnabled = this.isBioOverrideEnabled();
    const effectiveLimit = isOverrideEnabled ? CONFIG.form.limits.speakerBioOverride : CONFIG.form.limits.speakerBio;
    
    // Update the counter div with the full text (current/max)
    bioCounter.innerHTML = `<span>${currentLength}</span>/${effectiveLimit}`;
    
    // Update counter styling
    const counterContainer = bioCounter.parentElement || bioCounter;
    counterContainer.classList.remove('warning', 'error');
    
    if (currentLength >= effectiveLimit) {
      counterContainer.classList.add('error');
    } else if (currentLength >= effectiveLimit * 0.9) {
      counterContainer.classList.add('warning');
    }
  }
  
  validateField(field) {
    try {
      const value = field.value.trim();
      const fieldContainer = field.closest('.form-group');
      
      if (!fieldContainer) {
        console.error('Field container not found for field:', field.id);
        return false;
      }
      
      // Remove existing validation classes
      fieldContainer.classList.remove('error', 'valid', 'warning');
      
      // Check if required field is empty
      if (field.hasAttribute('required') && !value) {
        this.setFieldErrorState(field, fieldContainer, 'This field is required');
        return false;
      }
      
      // Validate specific field types
      let validation = { isValid: true, message: '', isWarning: false };
      
      try {
        switch (field.type || field.tagName.toLowerCase()) {
          case 'text':
          case 'textarea':
            validation = this.validateTextInput(field, value);
            break;
          case 'date':
            validation = this.validateDateInput(field, value);
            break;
          case 'time':
            validation = this.validateTimeInput(field, value);
            break;
          case 'select-one':
            validation = this.validateSelectInput(field, value);
            break;
          default:
            console.warn('Unknown field type for validation:', field.type || field.tagName);
        }
      } catch (validationError) {
        console.error('Validation error for field:', field.id, validationError);
        validation = { isValid: false, message: 'Validation error occurred', isWarning: false };
      }
      
      // Apply validation results
      if (validation.isValid && value) {
        this.setFieldValidState(field, fieldContainer);
      } else if (!validation.isValid) {
        if (validation.isWarning) {
          this.setFieldWarningState(field, fieldContainer, validation.message);
        } else {
          this.setFieldErrorState(field, fieldContainer, validation.message);
        }
      } else {
        this.clearFieldState(field, fieldContainer);
      }
      
      return validation.isValid;
      
    } catch (error) {
      console.error('Error validating field:', field.id, error);
      return false;
    }
  }
  
  setFieldErrorState(field, fieldContainer, message) {
    fieldContainer.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    this.showFieldError(field, message);
    
    // Announce error to screen readers
    this.announceFieldError(field, message);
  }
  
  setFieldWarningState(field, fieldContainer, message) {
    fieldContainer.classList.add('warning');
    field.setAttribute('aria-invalid', 'false');
    this.showFieldWarning(field, message);
  }
  
  setFieldValidState(field, fieldContainer) {
    fieldContainer.classList.add('valid');
    field.setAttribute('aria-invalid', 'false');
    this.clearFieldError(field);
  }
  
  clearFieldState(field, fieldContainer) {
    field.setAttribute('aria-invalid', 'false');
    this.clearFieldError(field);
  }
  
  announceFieldError(field, message) {
    // Create or update live region for error announcements
    let liveRegion = document.getElementById('validation-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'validation-live-region';
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('aria-live', 'assertive');
      liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(liveRegion);
    }
    
    // Announce the error
    const fieldLabel = this.getFieldLabel(field);
    liveRegion.textContent = `${fieldLabel}: ${message}`;
    
    // Clear the announcement after a delay
    setTimeout(() => {
      if (liveRegion.textContent === `${fieldLabel}: ${message}`) {
        liveRegion.textContent = '';
      }
    }, 3000);
  }
  
  getFieldLabel(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace('*', '').trim() : field.name || field.id;
  }
  
  validateTextInput(field, value) {
    try {
      // Sanitize input (remove potentially harmful characters)
      const sanitizedValue = this.sanitizeInput(value);
      if (sanitizedValue !== value) {
        field.value = sanitizedValue;
        return { isValid: false, message: 'Some characters were removed for security', isWarning: false };
      }
      
      // Check character limits
      const maxLength = parseInt(field.getAttribute('maxlength'));
      if (maxLength) {
        if (value.length > maxLength) {
          return { isValid: false, message: `Maximum ${maxLength} characters allowed`, isWarning: false };
        }
        
        // Warning when approaching limit (90% of max)
        if (value.length >= maxLength * 0.9) {
          return { isValid: true, message: `Approaching character limit (${value.length}/${maxLength})`, isWarning: true };
        }
      }
      
      // Field-specific validation
      const fieldId = field.id;
      if (fieldId === 'speaker-name') {
        return this.validateSpeakerName(value);
      } else if (fieldId === 'topic-title') {
        return this.validateTopicTitle(value);
      } else if (fieldId === 'speaker-bio') {
        return this.validateSpeakerBio(value);
      }
      
      return { isValid: true, message: '', isWarning: false };
      
    } catch (error) {
      console.error('Error in text validation:', error);
      return { isValid: false, message: 'Validation error occurred', isWarning: false };
    }
  }
  
  validateSpeakerName(value) {
    if (!value) return { isValid: true, message: '', isWarning: false };
    
    // Check for minimum length
    if (value.length < 2) {
      return { isValid: false, message: 'Speaker name must be at least 2 characters', isWarning: false };
    }
    
    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
    if (!nameRegex.test(value)) {
      return { isValid: false, message: 'Speaker name contains invalid characters', isWarning: false };
    }
    
    return { isValid: true, message: '', isWarning: false };
  }
  
  validateTopicTitle(value) {
    if (!value) return { isValid: true, message: '', isWarning: false };
    
    // Check for minimum length
    if (value.length < 5) {
      return { isValid: false, message: 'Topic title must be at least 5 characters', isWarning: false };
    }
    
    return { isValid: true, message: '', isWarning: false };
  }
  
  validateSpeakerBio(value) {
    if (!value) return { isValid: true, message: '', isWarning: false };
    
    // Check for minimum length
    if (value.length < 20) {
      return { isValid: false, message: 'Speaker bio must be at least 20 characters', isWarning: false };
    }
    
    // Check for maximum length only if override is not enabled
    if (!this.isBioOverrideEnabled() && value.length > CONFIG.form.limits.speakerBio) {
      return { isValid: false, message: `Speaker bio cannot exceed ${CONFIG.form.limits.speakerBio} characters`, isWarning: false };
    }
    
    // If override is enabled, show warning for very long bios
    if (this.isBioOverrideEnabled() && value.length > CONFIG.form.limits.speakerBio) {
      return { isValid: true, message: `Character limit override is enabled. Bio is ${value.length} characters.`, isWarning: true };
    }
    
    return { isValid: true, message: '', isWarning: false };
  }
  
  validateDateInput(field, value) {
    if (!value) return { isValid: true, message: '', isWarning: false }; // Empty is handled by required check
    
    try {
      const selectedDate = new Date(value);
      
      // Check if date is valid
      if (isNaN(selectedDate.getTime())) {
        return { isValid: false, message: 'Please enter a valid date', isWarning: false };
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      // Check if date is in the past
      if (selectedDate < today) {
        return { isValid: false, message: 'Date cannot be in the past', isWarning: false };
      }
      
      // Warning if date is more than 1 year in the future
      const oneYearFromNow = new Date(today);
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      
      if (selectedDate > oneYearFromNow) {
        return { isValid: true, message: 'Date is more than 1 year in the future', isWarning: true };
      }
      
      return { isValid: true, message: '', isWarning: false };
      
    } catch (error) {
      console.error('Error validating date:', error);
      return { isValid: false, message: 'Date validation error', isWarning: false };
    }
  }
  
  validateTimeInput(field, value) {
    if (!value) return { isValid: true, message: '', isWarning: false }; // Empty is handled by required check
    
    try {
      // Basic time format validation (HH:MM)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(value)) {
        return { isValid: false, message: 'Please enter a valid time (HH:MM format)', isWarning: false };
      }
      
      // Parse time components
      const [hours, minutes] = value.split(':').map(num => parseInt(num, 10));
      
      // Additional validation
      if (hours < 0 || hours > 23) {
        return { isValid: false, message: 'Hours must be between 00 and 23', isWarning: false };
      }
      
      if (minutes < 0 || minutes > 59) {
        return { isValid: false, message: 'Minutes must be between 00 and 59', isWarning: false };
      }
      
      // Warning for unusual times (very early or very late)
      if (hours < 6 || hours > 22) {
        return { isValid: true, message: 'Unusual event time - please verify', isWarning: true };
      }
      
      return { isValid: true, message: '', isWarning: false };
      
    } catch (error) {
      console.error('Error validating time:', error);
      return { isValid: false, message: 'Time validation error', isWarning: false };
    }
  }
  
  validateSelectInput(field, value) {
    if (!value) return { isValid: true, message: '', isWarning: false }; // Empty is handled by required check
    
    try {
      // Check if field has options
      if (!field.options || field.options.length === 0) {
        return { isValid: false, message: 'No options available for selection', isWarning: false };
      }
      
      // Check if selected value is one of the valid options
      const validOptions = Array.from(field.options)
        .map(option => option.value)
        .filter(optionValue => optionValue !== '');
      
      if (!validOptions.includes(value)) {
        return { isValid: false, message: 'Please select a valid option', isWarning: false };
      }
      
      return { isValid: true, message: '', isWarning: false };
      
    } catch (error) {
      console.error('Error validating select input:', error);
      return { isValid: false, message: 'Selection validation error', isWarning: false };
    }
  }
  
  sanitizeInput(input) {
    // Remove potentially harmful characters and excessive whitespace
    return input
      .replace(/[<>\"'&]/g, '') // Remove HTML/script injection characters
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  }
  
  showFieldError(field, message) {
    const fieldContainer = field.closest('.form-group');
    let errorElement = fieldContainer.querySelector('.field-error');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.setAttribute('role', 'alert');
      fieldContainer.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    errorElement.className = 'field-error'; // Reset class in case it was a warning
  }
  
  showFieldWarning(field, message) {
    const fieldContainer = field.closest('.form-group');
    let errorElement = fieldContainer.querySelector('.field-error');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'field-warning';
      errorElement.setAttribute('role', 'status');
      fieldContainer.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    errorElement.className = 'field-warning'; // Use warning class
  }
  
  clearFieldError(field) {
    const fieldContainer = field.closest('.form-group');
    const errorElement = fieldContainer.querySelector('.field-error');
    
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }
  
  validateAllFields() {
    const formFields = [
      document.getElementById('speaker-name'),
      document.getElementById('topic-title'),
      document.getElementById('speaker-bio'),
      document.getElementById('event-date'),
      document.getElementById('event-time'),
      document.getElementById('event-format'),
      document.getElementById('speaker-linkedin')
    ];
    
    let allValid = true;
    formFields.forEach(field => {
      if (!this.validateField(field)) {
        allValid = false;
      }
    });
    
    return allValid;
  }
  
  renderPreview() {
    // Debounce rendering for better performance during rapid typing
    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout);
    }
    
    // Use requestAnimationFrame for optimal performance
    this.renderTimeout = setTimeout(() => {
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(() => this.performRender());
      } else {
        // Fallback for older browsers
        this.performRender();
      }
    }, 16); // ~60fps debounce
  }
  
  performRender() {
    if (!this.ctx) {
      console.error('Canvas context not available');
      this.showCanvasError('Canvas rendering is not available. Please refresh the page.');
      return;
    }
    
    // Increment render attempts
    this.renderAttempts++;
    
    try {
      // Check if configuration is available
      if (!CONFIG || !CONFIG.canvas || !CONFIG.canvas.colors) {
        throw new Error('Canvas configuration not available');
      }
      
      const colors = CONFIG.canvas.colors[this.currentTheme];
      const layout = CONFIG.canvas.layout;
      
      if (!colors || !layout) {
        throw new Error(`Theme configuration not found for: ${this.currentTheme}`);
      }
      
      // Clear canvas with error handling
      try {
        this.ctx.fillStyle = colors.background;
        this.ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
      } catch (clearError) {
        console.error('Error clearing canvas:', clearError);
        throw new Error('Failed to clear canvas');
      }
      
      // Set up font with fallback handling
      this.setupCanvasFont();
      
      // Draw header section
      this.drawHeader(colors, layout);
      
      // Get form data
      const formData = this.getFormData();
      
      // Draw content sections
      this.drawContentSections(formData, colors, layout);
      
      // Draw footer
      this.drawFooter(colors, layout);
      
      // Reset render attempts on success
      this.renderAttempts = 0;
      
    } catch (error) {
      console.error('Error rendering canvas:', error);
      this.handleRenderingError(error);
    }
  }
  
  setupCanvasFont() {
    try {
      // Use fallback fonts if primary font failed to load
      let fontFamily = CONFIG.canvas.fonts.primary;
      
      if (this.fontLoadingError) {
        fontFamily = CONFIG.canvas.fonts.fallback || 'Arial, sans-serif';
        console.warn('Using fallback font due to loading error:', fontFamily);
      }
      
      // Test if the font can be set
      const testFont = `16px ${fontFamily}`;
      this.ctx.font = testFont;
      
      // Verify the font was set correctly
      if (this.ctx.font !== testFont) {
        console.warn('Font setting failed, using browser default');
        this.ctx.font = '16px Arial, sans-serif';
      }
      
    } catch (fontError) {
      console.error('Error setting up canvas font:', fontError);
      // Use absolute fallback
      this.ctx.font = '16px Arial, sans-serif';
    }
  }
  
  handleRenderingError(error) {
    const maxRetries = CONFIG.errorHandling?.canvas?.retryAttempts || 3;
    
    // Try to retry rendering if we haven't exceeded max attempts
    if (this.renderAttempts < maxRetries) {
      console.warn(`Render attempt ${this.renderAttempts} failed, retrying...`);
      setTimeout(() => {
        this.performRender();
      }, 1000 * this.renderAttempts); // Exponential backoff
      return;
    }
    
    // Show user-friendly error message based on error type
    let userMessage = 'An error occurred while rendering the preview.';
    let details = null;
    
    if (error.message.includes('configuration')) {
      userMessage = 'Configuration error. Please refresh the page.';
      details = 'The application configuration could not be loaded properly.';
    } else if (error.message.includes('font')) {
      userMessage = 'Font loading error. The preview may not display correctly.';
      details = 'Some fonts failed to load, but the application should still function.';
    } else if (error.message.includes('canvas')) {
      userMessage = 'Canvas rendering error. Please try refreshing the page.';
      details = 'There was a problem with the graphics rendering system.';
    } else {
      details = `Technical details: ${error.message}`;
    }
    
    // Show error in canvas area
    this.showCanvasError(userMessage, details);
    
    // Try to render a basic fallback if possible
    this.renderFallbackPreview();
  }
  
  renderFallbackPreview() {
    try {
      if (!this.ctx) return;
      
      // Clear canvas
      this.ctx.fillStyle = '#f8f9fa';
      this.ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
      
      // Draw simple error message
      this.ctx.fillStyle = '#666666';
      this.ctx.font = '16px Arial, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(
        'Preview temporarily unavailable',
        CONFIG.canvas.width / 2,
        CONFIG.canvas.height / 2 - 20
      );
      
      this.ctx.font = '14px Arial, sans-serif';
      this.ctx.fillText(
        'Your form data is still being processed',
        CONFIG.canvas.width / 2,
        CONFIG.canvas.height / 2 + 10
      );
      
    } catch (fallbackError) {
      console.error('Even fallback rendering failed:', fallbackError);
    }
  }
  
  drawHeader(colors, layout) {
    // Draw header background
    this.ctx.fillStyle = colors.headerBg;
    this.ctx.fillRect(0, 0, CONFIG.canvas.width, layout.header.height);
    
    // Draw event title
    this.ctx.fillStyle = colors.headerText;
    this.ctx.font = `${layout.header.fontWeight} ${layout.header.fontSize}px ${CONFIG.canvas.fonts.primary}`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(
      CONFIG.event.name,
      CONFIG.canvas.width / 2,
      layout.header.height / 2
    );
  }
  
  drawContentSections(formData, colors, layout) {
    const padding = layout.content.padding;
    const lineHeight = layout.content.lineHeight;
    let currentY = layout.header.height + padding + 20;
    
    // Set text alignment for content
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    
    // Draw each section
    layout.content.sections.forEach((section) => {
      const value = this.getFieldValue(formData, section.label);
      const displayValue = value || this.getPlaceholderText(section.label);
      
      currentY = this.drawSection(
        section,
        displayValue,
        currentY,
        colors,
        padding,
        lineHeight,
        !value // isPlaceholder
      );
      currentY += 15; // Add spacing between sections
    });
  }
  
  getPlaceholderText(label) {
    const placeholders = {
      'Speaker': 'Enter speaker name...',
      'Topic': 'Enter topic title...',
      'Bio': 'Enter speaker bio...',
      'Date': 'Select date...',
      'Time': 'Select time...',
      'Format': 'Select format...'
    };
    return placeholders[label] || '';
  }
  
  drawSection(section, value, startY, colors, padding, lineHeight, isPlaceholder = false) {
    const maxWidth = CONFIG.canvas.width - (padding * 2) - 40; // Leave space for emoji
    
    // Set font for this section
    const fontWeight = section.fontWeight || 'normal';
    this.ctx.font = `${fontWeight} ${section.fontSize}px ${CONFIG.canvas.fonts.primary}`;
    
    // Draw emoji
    this.ctx.fillStyle = colors.primaryText;
    this.ctx.fillText(section.emoji, padding, startY);
    
    // Draw section content with text wrapping and overflow handling
    const textX = padding + 40; // Space after emoji
    const textColor = isPlaceholder ? colors.secondaryText : colors.primaryText;
    this.ctx.fillStyle = textColor;
    
    // Determine max lines based on section type and available space
    let maxLines = null;
    if (section.label === 'Bio') {
      maxLines = 4; // Limit bio to 4 lines with ellipsis
    } else if (section.label === 'Topic') {
      maxLines = 2; // Limit topic to 2 lines with ellipsis
    } else if (section.label === 'Speaker') {
      maxLines = 1; // Speaker name should be single line with ellipsis
    }
    
    const lines = this.wrapText(value, maxWidth - 40, maxLines);
    let currentY = startY;
    
    lines.forEach((line) => {
      this.ctx.fillText(line, textX, currentY);
      currentY += lineHeight;
    });
    
    return currentY;
  }
  
  drawFooter(colors, layout) {
    const footerY = CONFIG.canvas.height - layout.footer.height;
    
    // Draw hashtags
    this.ctx.fillStyle = colors.footerText;
    this.ctx.font = `${layout.footer.fontStyle} ${layout.footer.fontSize}px ${CONFIG.canvas.fonts.primary}`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    const hashtags = CONFIG.event.hashtags.join(' ');
    this.ctx.fillText(hashtags, CONFIG.canvas.width / 2, footerY + (layout.footer.height / 2));
  }
  
  wrapText(text, maxWidth, maxLines = null) {
    if (!text || text.trim() === '') return [''];
    
    const words = text.trim().split(' ');
    const lines = [];
    let currentLine = '';
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = this.ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine !== '') {
        // Current line is too long, push it and start new line with current word
        lines.push(currentLine.trim());
        currentLine = word;
        
        // Check if we've reached the maximum number of lines
        if (maxLines && lines.length >= maxLines) {
          // Apply ellipsis to the last line if there are more words
          if (i < words.length - 1 || currentLine.trim()) {
            const lastLine = lines[lines.length - 1];
            const ellipsisText = lastLine + '...';
            const ellipsisMetrics = this.ctx.measureText(ellipsisText);
            
            if (ellipsisMetrics.width <= maxWidth) {
              lines[lines.length - 1] = ellipsisText;
            } else {
              // Truncate the last line to fit with ellipsis
              let truncatedLine = lastLine;
              while (truncatedLine.length > 0) {
                truncatedLine = truncatedLine.slice(0, -1);
                const testEllipsis = truncatedLine + '...';
                const testMetrics = this.ctx.measureText(testEllipsis);
                if (testMetrics.width <= maxWidth) {
                  lines[lines.length - 1] = testEllipsis;
                  break;
                }
              }
            }
          }
          break;
        }
      } else {
        // Word fits on current line
        currentLine = testLine;
      }
    }
    
    // Add the last line if it has content and we haven't exceeded max lines
    if (currentLine.trim() && (!maxLines || lines.length < maxLines)) {
      lines.push(currentLine.trim());
    }
    
    // Return at least one empty line if no content
    return lines.length > 0 ? lines : [''];
  }
  
  getFormData() {
    const formData = {
      speakerName: document.getElementById('speaker-name')?.value || '',
      topicTitle: document.getElementById('topic-title')?.value || '',
      speakerBio: document.getElementById('speaker-bio')?.value || '',
      eventDate: document.getElementById('event-date')?.value || '',
      eventTime: document.getElementById('event-time')?.value || '',
      eventFormat: document.getElementById('event-format')?.value || '',
      speakerLinkedin: document.getElementById('speaker-linkedin')?.value || '',
      linkedinUsers: CONFIG.form.defaults.linkedinUsers || ''
    };
    
    // Validate that form elements exist
    const requiredElements = ['speaker-name', 'topic-title', 'speaker-bio', 'event-date', 'event-time', 'event-format'];
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
      console.warn('Missing form elements:', missingElements);
    }
    
    return formData;
  }
  
  getFieldValue(formData, label) {
    switch (label) {
      case 'Speaker':
        return formData.speakerName;
      case 'Topic':
        return formData.topicTitle;
      case 'Bio':
        return formData.speakerBio;
      case 'Date':
        return formData.eventDate ? this.formatDate(formData.eventDate) : '';
      case 'Time':
        return formData.eventTime ? this.formatTime(formData.eventTime) : '';
      case 'Format':
        return formData.eventFormat;
      default:
        return '';
    }
  }
  
  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour12 = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  }
  
  showCanvasError(message, details = null) {
    const canvasContainer = document.querySelector('.canvas-container');
    if (canvasContainer) {
      let errorHtml = `
        <div class="canvas-error">
          <h3>Canvas Not Available</h3>
          <p>${message}</p>
      `;
      
      if (details) {
        errorHtml += `<div class="error-details">${details}</div>`;
      }
      
      errorHtml += `
          <div class="error-details">
            The preview feature requires a modern browser with HTML5 Canvas support.
            <br>Please try updating your browser or using a different one.
          </div>
        </div>
      `;
      
      canvasContainer.innerHTML = errorHtml;
    }
    
    // Also log to console for debugging
    console.error('Canvas Error:', message, details || '');
  }
  
  // Text Export and Clipboard Functionality
  
  generateFormattedText() {
    const formData = this.getFormData();
    
    // Validate that required fields have values
    if (!formData.speakerName.trim()) {
      throw new Error('Speaker name is required');
    }
    if (!formData.topicTitle.trim()) {
      throw new Error('Topic title is required');
    }
    if (!formData.speakerBio.trim()) {
      throw new Error('Speaker bio is required');
    }
    
    // Validate speaker bio with override support
    const bioValidation = this.validateSpeakerBio(formData.speakerBio);
    if (!bioValidation.isValid) {
      throw new Error(bioValidation.message);
    }
    
    // Show warning if override is enabled and bio is long
    if (bioValidation.isWarning) {
      console.warn('Bio validation warning:', bioValidation.message);
    }
    if (!formData.eventDate) {
      throw new Error('Event date is required');
    }
    if (!formData.eventTime) {
      throw new Error('Event time is required');
    }
    if (!formData.eventFormat) {
      throw new Error('Event format is required');
    }
    
    // Format the data for text export
    const formattedDate = this.formatDate(formData.eventDate);
    const formattedTime = this.formatTime(formData.eventTime);
    const hashtags = CONFIG.event.hashtags.join(' ');
    
    // Generate formatted text using new template format
    const template = CONFIG.text.template;
    
    let formattedText = template.title
      .replace('{eventName}', CONFIG.event.name) + '\n\n';
    
    formattedText += template.welcome
      .replace('{welcomeMessage}', CONFIG.event.welcomeMessage.replace('{speakerName}', formData.speakerName.trim())) + '\n\n';
    
    formattedText += template.speaker
      .replace('{name}', formData.speakerName.trim()) + '\n\n';
    
    formattedText += template.topic
      .replace('{topic}', formData.topicTitle.trim()) + '\n\n';
    
    formattedText += template.bio
      .replace('{bio}', formData.speakerBio.trim()) + '\n\n';
    
    formattedText += template.description.replace('{description}', CONFIG.event.description) + '\n\n';
    
    formattedText += template.date
      .replace('{date}', formattedDate) + '\n';
    
    formattedText += template.time
      .replace('{time}', formattedTime) + '\n';
    
    formattedText += template.schedule.replace('{scheduleUrl}', CONFIG.event.scheduleUrl) + '\n';
    
    formattedText += template.registration.replace('{registrationUrl}', CONFIG.event.registrationUrl) + '\n';
    
    formattedText += template.format
      .replace('{format}', formData.eventFormat) + '\n\n';
    
    formattedText += template.hashtags
      .replace('{hashtags}', hashtags) + '\n\n';
    
    // Add call-to-action
    formattedText += template.callToAction + '\n\n';
    
    // Add LinkedIn users (speaker + configured users)
    let allLinkedInUsers = [];
    
    // Add speaker's LinkedIn handle if provided
    if (formData.speakerLinkedin.trim()) {
      const cleanSpeakerUsername = formData.speakerLinkedin.trim().replace(/^@+/, '');
      allLinkedInUsers.push(cleanSpeakerUsername);
    }
    
    // Add configured LinkedIn users
    if (formData.linkedinUsers.trim()) {
      const configuredUsers = formData.linkedinUsers.trim()
        .split(',')
        .map(username => username.trim())
        .filter(username => username.length > 0)
        .map(username => username.replace(/^@+/, ''));
      allLinkedInUsers = allLinkedInUsers.concat(configuredUsers);
    }
    
    // Format all users with @ symbols
    if (allLinkedInUsers.length > 0) {
      const formattedUsers = allLinkedInUsers
        .filter(username => username.length > 0)
        .map(username => `@${username}`)
        .join(' ');
      
      formattedText += formattedUsers + '\n\n';
    }
    
    return formattedText;
  }
  
  async copyFormattedText() {
    try {
      // Validate all fields first
      if (!this.validateAllFields()) {
        this.showCopyFeedback('Please fill in all required fields correctly', 'error');
        return;
      }
      
      // Generate formatted text
      const formattedText = this.generateFormattedText();
      
      // Detect clipboard capabilities
      const clipboardCapabilities = this.detectClipboardCapabilities();
      
      // Try modern Clipboard API first if available
      if (clipboardCapabilities.hasClipboardAPI) {
        try {
          await navigator.clipboard.writeText(formattedText);
          this.showCopyFeedback('Text copied to clipboard successfully!', 'success');
          return;
        } catch (clipboardError) {
          console.warn('Clipboard API failed:', clipboardError);
          
          // Handle specific clipboard errors
          if (clipboardError.name === 'NotAllowedError') {
            this.showCopyFeedback('Clipboard access denied. Please allow clipboard permissions or try the manual copy option.', 'error');
            this.showManualCopyInstructions(formattedText);
            return;
          } else if (clipboardError.name === 'NotSupportedError') {
            console.warn('Clipboard API not supported, falling back to legacy method');
          } else {
            console.warn('Clipboard API error, falling back to legacy method:', clipboardError);
          }
          
          // Fall through to legacy method
        }
      }
      
      // Try legacy execCommand method
      if (clipboardCapabilities.hasExecCommand) {
        this.copyTextFallback(formattedText);
      } else {
        // No clipboard support available
        this.showCopyFeedback('Automatic copying is not supported in your browser.', 'error');
        this.showManualCopyInstructions(formattedText);
      }
      
    } catch (error) {
      console.error('Error copying text:', error);
      this.showCopyFeedback(error.message || 'Failed to copy text', 'error');
      
      // Always provide manual copy as last resort
      try {
        const formattedText = this.generateFormattedText();
        this.showManualCopyInstructions(formattedText);
      } catch (textError) {
        console.error('Failed to generate text for manual copy:', textError);
      }
    }
  }
  
  detectClipboardCapabilities() {
    const capabilities = {
      hasClipboardAPI: false,
      hasExecCommand: false,
      isSecureContext: false,
      supportsWriteText: false
    };
    
    // Check for secure context
    capabilities.isSecureContext = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
    
    // Check for Clipboard API
    if (navigator.clipboard) {
      capabilities.hasClipboardAPI = true;
      
      // Check if writeText is available
      if (typeof navigator.clipboard.writeText === 'function') {
        capabilities.supportsWriteText = true;
      }
    }
    
    // Check for execCommand support
    if (document.execCommand) {
      try {
        // Test if execCommand is actually functional
        capabilities.hasExecCommand = document.queryCommandSupported('copy');
      } catch (error) {
        console.warn('execCommand test failed:', error);
        capabilities.hasExecCommand = false;
      }
    }
    
    // Log capabilities for debugging
    console.log('Clipboard capabilities detected:', capabilities);
    
    return capabilities;
  }
  
  copyTextFallback(text) {
    try {
      // Create a temporary textarea element
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      
      // Select and copy the text
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        this.showCopyFeedback('Text copied to clipboard successfully!', 'success');
      } else {
        // If execCommand fails, show manual copy instructions
        this.showManualCopyInstructions(text);
      }
    } catch (error) {
      console.error('Fallback copy method failed:', error);
      this.showManualCopyInstructions(text);
    }
  }
  
  showManualCopyInstructions(text) {
    // Create a modal or popup with the text for manual copying
    const modal = document.createElement('div');
    modal.className = 'copy-modal';
    modal.innerHTML = `
      <div class="copy-modal-content">
        <div class="copy-modal-header">
          <h3>Copy Text Manually</h3>
          <button class="copy-modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="copy-modal-body">
          <p>Your browser doesn't support automatic copying. Please select and copy the text below:</p>
          <textarea readonly class="copy-text-area">${text}</textarea>
          <p class="copy-instructions">
            <strong>Instructions:</strong> Select all text above (Ctrl+A or Cmd+A), then copy (Ctrl+C or Cmd+C)
          </p>
        </div>
      </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;
    
    const modalContent = modal.querySelector('.copy-modal-content');
    modalContent.style.cssText = `
      background: var(--bg-color);
      color: var(--text-color);
      padding: 2rem;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    const textArea = modal.querySelector('.copy-text-area');
    textArea.style.cssText = `
      width: 100%;
      height: 200px;
      margin: 1rem 0;
      padding: 1rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--secondary-bg);
      color: var(--text-color);
      font-family: monospace;
      font-size: 14px;
      resize: vertical;
    `;
    
    const closeBtn = modal.querySelector('.copy-modal-close');
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: var(--text-color);
      float: right;
      line-height: 1;
    `;
    
    // Close modal functionality
    const closeModal = () => {
      document.body.removeChild(modal);
    };
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    // Add escape key handler
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
    
    document.body.appendChild(modal);
    
    // Auto-select the text
    setTimeout(() => {
      textArea.select();
      textArea.focus();
    }, 100);
  }
  
  showCopyFeedback(message, type = 'success') {
    // Remove any existing feedback
    const existingFeedback = document.querySelector('.copy-feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `copy-feedback copy-feedback-${type}`;
    feedback.textContent = message;
    
    // Style the feedback
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 4px;
      color: white;
      font-weight: 500;
      z-index: 1000;
      animation: slideInRight 0.3s ease-out;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;
    
    // Set background color based on type
    if (type === 'success') {
      feedback.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
      feedback.style.backgroundColor = '#dc3545';
    } else {
      feedback.style.backgroundColor = '#6c757d';
    }
    
    // Add animation styles if not already present
    if (!document.querySelector('#copy-feedback-styles')) {
      const styles = document.createElement('style');
      styles.id = 'copy-feedback-styles';
      styles.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(styles);
    }
    
    document.body.appendChild(feedback);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
          if (feedback.parentNode) {
            feedback.remove();
          }
        }, 300);
      }
    }, 4000);
  }
}

// Initialize the application
window.app = new SpeakerSpotlightApp();