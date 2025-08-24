# AWS Community Day Spotlight Generator

A static web application for creating professional speaker spotlight cards for AWS Community Day events. Features include live preview, character limit management with override functionality, and export capabilities for social media sharing.

## Features

- 🎯 **Form-based input** for speaker details with real-time validation
- 🎨 **Live canvas preview** of the spotlight card
- 📝 **Character limit management** with optional override (300 ↔ 1000 characters for bio)
- 🌓 **Dark/Light theme** with system preference detection
- 📱 **Responsive design** for desktop and mobile devices
- 📋 **Copy functionality** for formatted text export
- 🏷️ **LinkedIn user tagging** with automatic @ symbol formatting
- 📢 **Enhanced post format** with title, welcome message, and description
- 🔗 **Schedule integration** with configurable event links
- ♿ **Accessibility features** including keyboard navigation and screen reader support

## Quick Start

1. Clone the repository
2. Open `index.html` in a web browser
3. Fill in the speaker information form
4. Use the override button to exceed the 300 character bio limit if needed
5. Copy the formatted text for social media sharing

## Project Structure

```plaintext
/
├── index.html              # Main application
├── style.css               # Styling and themes
├── app.js                  # Application logic
├── vars.js                 # Configuration constants
└── tests/                  # Test files and verification scripts
    ├── README.md           # Test documentation
    ├── test-*.html         # HTML test files
    └── verify-*.js         # JavaScript verification
```

## Configuration

Edit `vars.js` to customize:

- Event name and details
- Default date and hashtags
- Character limits and validation rules
- Canvas dimensions and styling

## Testing

Run tests by opening files in the `tests/` folder:

- Individual feature tests
- Comprehensive validation tests
- Performance and accessibility tests
- Bio override functionality tests

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

See LICENSE file for details.
