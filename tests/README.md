# Test Files

This folder contains all test and verification files for the Speaker Spotlight Website.

## HTML Test Files

- **test-accessibility.html** - Tests accessibility features including keyboard navigation, ARIA labels, and screen reader compatibility
- **test-complete.html** - Comprehensive end-to-end testing of all application functionality
- **test-copy-complete.html** - Tests the copy functionality with various form data scenarios
- **test-copy-functionality.html** - Basic copy functionality testing
- **test-cross-browser-compatibility.html** - Tests browser compatibility and feature detection
- **test-error-handling.html** - Tests error handling, fallbacks, and edge cases
- **test-form-validation-comprehensive.html** - Comprehensive form validation testing
- **test-header-functionality.html** - Tests header features including theme toggle and GitHub link
- **test-live-preview.html** - Tests the live preview canvas functionality
- **test-performance-final.html** - Performance testing and optimization verification
- **test-responsive-behavior.html** - Tests responsive design and mobile compatibility
- **test-bio-override.html** - Tests the new bio character limit override functionality
- **test-fix.html** - Tests character counter functionality and error handling fixes
- **test-new-format.html** - Tests the new LinkedIn post format with all new fields

### JavaScript Verification Files

- **verify-copy-functionality.js** - JavaScript verification for copy functionality
- **verify-live-preview.js** - JavaScript verification for live preview features
- **verify-performance-optimization.js** - JavaScript verification for performance optimizations

## Running Tests

1. **Local Testing**: Open any HTML test file in a web browser
2. **Server Testing**: Run `python3 -m http.server 8000` and navigate to `http://localhost:8000/tests/`
3. **Individual Testing**: Each test file can be run independently

## Test Coverage

The test files cover:

- ✅ Form validation and character limits
- ✅ Live preview canvas rendering
- ✅ Copy functionality and clipboard API
- ✅ Theme switching and dark mode
- ✅ Responsive design and mobile compatibility
- ✅ Accessibility features and keyboard navigation
- ✅ Error handling and fallbacks
- ✅ Performance optimization
- ✅ Cross-browser compatibility
- ✅ Bio character limit override functionality
- ✅ Enhanced LinkedIn post format with user tagging

## Bio Override Testing

The `test-bio-override.html` file specifically tests:

- Toggle button functionality
- Character limit switching (300 ↔ 1000)
- Dynamic character counter updates
- Form validation with override state
- Responsive design for override button
- Accessibility features

## LinkedIn User Tagging Testing

The `test-new-format.html` file specifically tests:

- Enhanced LinkedIn post format with title and welcome message
- Automatic @ symbol formatting for usernames
- Multiple user tagging with comma separation
- Schedule link integration from configuration
- Real username examples (John Ajera, ramstack)
- Complete post structure and formatting

## Notes

- All tests are designed to run in modern browsers
- Tests include both automated and manual verification steps
- Performance tests measure rendering speed and memory usage
- Accessibility tests verify WCAG compliance
- Responsive tests check mobile and tablet layouts
