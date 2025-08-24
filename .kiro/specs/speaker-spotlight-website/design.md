# Design Document

## Overview

The Speaker Spotlight Website is a client-side web application built with vanilla HTML, CSS, and JavaScript. It features a two-column layout with a form on the left for input and a live canvas preview on the right. The application uses HTML5 Canvas for rendering the spotlight card preview and the Clipboard API for text copying functionality. All event-specific constants are centralized in a configuration file for easy maintenance.

## Architecture

### Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Rendering**: HTML5 Canvas API for preview generation
- **Clipboard**: Navigator Clipboard API for text copying
- **Storage**: LocalStorage for theme preferences
- **Deployment**: Static files (no server required)

### File Structure

```plaintext
/
├── index.html          # Main application page
├── style.css           # Styling and theme definitions
├── app.js             # Main application logic
├── vars.js            # Event configuration constants
└── tests/             # Test files and verification scripts
    ├── test-*.html    # HTML test files
    └── verify-*.js    # JavaScript verification scripts
```

### Core Components

1. **Form Handler**: Manages user input and validation
2. **Canvas Renderer**: Generates live preview of spotlight card
3. **Text Formatter**: Creates formatted text for clipboard export
4. **Theme Manager**: Handles dark/light mode switching
5. **Configuration Manager**: Loads and applies event constants

## Components and Interfaces

### 1. Configuration Module (vars.js)

```javascript
const CONFIG = {
  event: {
    name: "3rd AWS Community Day Aotearoa 2025",
    defaultDate: "2025-09-18",
    hashtags: ["#AWSCDOceanic2025", "#AWSVirtualCDNZ2025", "#awscommunity"],
    githubUrl: "https://github.com/username/speaker-spotlight-website"
  },
  form: {
    limits: {
      speakerName: 60,
      topicTitle: 100,
      speakerBio: 300,
      speakerBioOverride: 1000
    }
  },
  canvas: {
    width: 800,
    height: 600,
    colors: {
      light: { /* light theme colors */ },
      dark: { /* dark theme colors */ }
    }
  }
};
```

### 2. Form Component

**HTML Structure:**

- Speaker Name: `<input type="text" maxlength="60">`
- Topic Title: `<input type="text" maxlength="100">`
- Speaker Bio: `<textarea>` with dynamic maxlength and override toggle button
- Date: `<input type="date">`
- Time: `<input type="time">`
- Format: `<select>` with Virtual/In-Person/Hybrid options

**Bio Override Toggle:**

- Button with lock/unlock icon (🔓)
- Toggles between 300 and 1000 character limits
- Visual feedback for current state
- Accessible with proper ARIA labels

**Validation:**

- Real-time character counting
- Input length enforcement
- Required field validation

### 3. Canvas Renderer

**Rendering Pipeline:**

1. Clear canvas
2. Draw background
3. Render header with event name
4. Draw speaker information sections with emojis
5. Apply text wrapping for long content
6. Render footer with hashtags

**Text Wrapping Algorithm:**

```javascript
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  
  for (let word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && line !== '') {
      ctx.fillText(line, x, currentY);
      line = word + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}
```

### 4. Theme System

**CSS Custom Properties:**

```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --border-color: #e0e0e0;
  --accent-color: #ff9900;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --border-color: #404040;
  --accent-color: #ff9900;
}
```

**Theme Detection:**

```javascript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
```

### 5. Text Export Format

```plaintext
🎙️ Speaker: [Name]

📌 Topic: [Topic Title]

👤 Bio: [Speaker Bio]

🗓 Date: [Date]
⏰ Time: [Time]
🌐 Format: [Format]

#AWSCDOceanic2025 #AWSVirtualCDNZ2025 #awscommunity
```

### 6. Bio Override System

**Toggle Button Implementation:**

```javascript
const overrideToggle = {
  state: 'disabled',           // 'disabled' | 'enabled'
  defaultLimit: 300,           // Default character limit
  overrideLimit: 1000,         // Override character limit
  visualFeedback: {
    icon: '🔓',                // Lock/unlock icon
    text: 'Override Limit',    // Button text
    ariaLabel: 'Toggle character limit override'
  }
};
```

**Character Limit Management:**

- Dynamic `maxlength` attribute on textarea
- Real-time character counter updates
- Validation logic adapts to current limit
- Form submission respects override state

## Data Models

### Speaker Data Structure

```javascript
const speakerData = {
  name: String,           // max 60 chars
  topic: String,          // max 100 chars
  bio: String,            // max 300 chars (or 1000 with override)
  date: String,           // ISO date format
  time: String,           // HH:MM format
  format: String,         // "Virtual" | "In-Person" | "Hybrid"
  linkedinUsers: String   // comma-separated usernames for tagging
};

const bioOverrideState = {
  enabled: Boolean,        // true if override is active
  currentLimit: Number,    // 300 or 1000 based on override state
  effectiveLimit: Number   // dynamically calculated limit
};

const linkedinUserState = {
  usernames: Array,        // array of processed usernames
  formattedOutput: String, // final formatted string with @ symbols
  examples: {
    single: 'John Ajera',
    multiple: 'John Ajera',
    output: '@John Ajera'
  }
};
```

### Canvas Layout Specifications

```javascript
const layout = {
  header: {
    height: 80,
    backgroundColor: '#ff9900',
    textColor: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  content: {
    padding: 20,
    lineHeight: 24,
    sections: [
      { emoji: '🎙️', label: 'Speaker', fontSize: 20 },
      { emoji: '📌', label: 'Topic', fontSize: 18 },
      { emoji: '👤', label: 'Bio', fontSize: 16 },
      { emoji: '🗓', label: 'Date', fontSize: 16 },
      { emoji: '⏰', label: 'Time', fontSize: 16 },
      { emoji: '🌐', label: 'Format', fontSize: 16 }
    ]
  },
  footer: {
    height: 40,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666666'
  }
};
```

## LinkedIn User Tagging System

### Username Processing Algorithm
```javascript
const linkedinUserProcessor = {
  inputFormat: 'comma-separated usernames',
  outputFormat: '@username format',
  processing: {
    splitBy: ',',
    trimWhitespace: true,
    removeExistingAtSymbols: true,
    addAtSymbols: true,
    joinWith: ' '
  },
  examples: {
    input: 'John Ajera, ramstack',
    output: '@John Ajera @ramstack'
  }
};
```

### User Experience Features
- **Placeholder Examples**: Real usernames (John Ajera, ramstack)
- **Automatic Formatting**: @ symbols added automatically
- **Flexible Input**: Supports existing @ symbols in input
- **Multiple Users**: Comma-separated multiple user support
- **Field Notes**: Helpful instructions below the input field
- **Real-time Processing**: Immediate feedback on input changes

### Enhanced Content Structure
The new LinkedIn post format includes:
- **Title**: Event name with speaker spotlight branding
- **Welcome Message**: Personalized greeting with speaker name
- **Speaker Details**: Name, topic, and bio information
- **Event Description**: Celebration message about cloud builders
- **Schedule Link**: Direct link to event schedule (from configuration)
- **User Tagging**: Properly formatted LinkedIn user mentions
- **Hashtags**: Event-specific hashtags for discoverability

## Error Handling

### Input Validation Errors

- **Character Limit Exceeded**: Visual feedback with character counter turning red
- **Required Field Empty**: Border highlight and error message
- **Invalid Date/Time**: Browser native validation with custom styling

### Canvas Rendering Errors

- **Canvas Not Supported**: Fallback message with browser upgrade suggestion
- **Font Loading Failure**: Graceful degradation to system fonts
- **Text Overflow**: Automatic ellipsis application

### Clipboard API Errors

- **API Not Available**: Fallback to manual text selection
- **Permission Denied**: User notification with manual copy instructions
- **Copy Failure**: Retry mechanism with user feedback

### Theme System Errors

- **LocalStorage Unavailable**: Default to system preference without persistence
- **Invalid Theme Value**: Reset to default light theme

## Testing Strategy

### Unit Testing Approach

1. **Form Validation**: Test character limits, required fields, input sanitization
2. **Canvas Rendering**: Test text wrapping, layout positioning, color application
3. **Text Formatting**: Verify output format matches specification
4. **Theme Switching**: Validate CSS custom property updates
5. **Configuration Loading**: Test default value application

### Integration Testing

1. **Form to Canvas**: Verify real-time preview updates
2. **Theme to Canvas**: Test canvas color updates on theme change
3. **Copy Functionality**: End-to-end clipboard operation testing

### Browser Compatibility Testing

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Canvas Support**: Fallback messaging for unsupported browsers
- **Clipboard API**: Feature detection with graceful degradation

### Responsive Design Testing

- **Desktop**: 1920x1080, 1366x768
- **Tablet**: 1024x768, 768x1024
- **Mobile**: Graceful degradation (form stacking)

### Accessibility Testing

- **Keyboard Navigation**: Tab order and focus management
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliance for both themes
- **Font Scaling**: Support for browser zoom up to 200%

## Performance Considerations

### Canvas Optimization

- **Debounced Rendering**: Limit canvas updates to 60fps
- **Efficient Text Measurement**: Cache font metrics where possible
- **Memory Management**: Clear canvas properly between renders

### Asset Loading

- **Font Loading**: Use font-display: swap for better perceived performance
- **CSS Optimization**: Minimize reflows with efficient selectors
- **JavaScript**: Use event delegation for form handling

### Storage Efficiency

- **LocalStorage**: Minimal theme preference storage only
- **Memory Usage**: Clean up event listeners on page unload
