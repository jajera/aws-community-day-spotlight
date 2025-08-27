# Requirements Document

## Introduction

The Speaker Spotlight Website is a frontend-only web application designed to help event organizers create professional speaker spotlight cards for the AWS Community Day Aotearoa 2025. The application allows users to input speaker details through a form, generates a formatted preview card on canvas, and provides export functionality for both image (PNG) and text formats suitable for social media sharing, particularly LinkedIn.

## Requirements

### Requirement 1

**User Story:** As an event organizer, I want to input speaker information through a web form, so that I can quickly create professional spotlight cards without manual design work.

#### Acceptance Criteria

1. WHEN the user opens the application THEN the system SHALL display a form with the following fields:
   - Speaker Name (text input, max 60 characters)
   - Topic Title (text input, max 100 characters)
   - Speaker Bio (textarea, max 300 characters with optional override to 1000 characters)
   - Date (date input with default from configuration)
   - Time (time input with default "00:00")
   - Format (dropdown with options: Virtual, In-Person, Hybrid)

2. WHEN the user enters text exceeding character limits THEN the system SHALL prevent further input and display character count feedback

3. WHEN the user wants to exceed the speaker bio character limit THEN the system SHALL provide an override toggle button that increases the limit from 300 to 1000 characters

4. WHEN the override is enabled THEN the system SHALL allow longer bio text while maintaining validation and character counting

5. WHEN the user fills in form fields THEN the system SHALL validate input in real-time and show validation feedback

### Requirement 2

**User Story:** As an event organizer, I want to see a live preview of the spotlight card as I type, so that I can immediately see how the final output will look.

#### Acceptance Criteria

1. WHEN the user enters or modifies any form field THEN the system SHALL immediately update the canvas preview displayed on the right side of the screen

2. WHEN the application loads THEN the system SHALL display the form on the left side and the live preview canvas on the right side in a two-column layout

3. WHEN text content exceeds display space THEN the system SHALL wrap text neatly with proper line height (24px) and apply ellipsis for overflow

4. WHEN the preview is generated THEN the system SHALL display a 800x600 pixel canvas with the following layout:
   - Orange header bar with event title in white centered text
   - Speaker name with microphone emoji prefix
   - Topic title with pin emoji prefix and text wrapping
   - Bio section with person emoji prefix and multi-line text support
   - Date with calendar emoji prefix
   - Time with clock emoji prefix
   - Format with globe emoji prefix
   - Footer with hashtags in italic gray text

### Requirement 3

**User Story:** As an event organizer, I want to copy formatted text content for LinkedIn posts, so that I can easily share speaker information on social media.

#### Acceptance Criteria

1. WHEN the user clicks "Copy Text" THEN the system SHALL generate formatted text containing all speaker details and copy it to clipboard

2. WHEN text is copied THEN the system SHALL include relevant hashtags and formatting suitable for LinkedIn posts with proper line breaks and emoji formatting

3. WHEN the copy action is completed THEN the system SHALL provide user feedback confirming the text was copied to clipboard

4. WHEN the formatted text is generated THEN the system SHALL include all form fields in a readable format with appropriate emojis and structure

### Requirement 4

**User Story:** As an event administrator, I want event-wide constants centralized in one configuration file, so that I can easily update event details across the entire application.

#### Acceptance Criteria

1. WHEN the application loads THEN the system SHALL read event constants from a dedicated vars.js file

2. WHEN event details need updating THEN the system SHALL allow modification through the single vars.js file without touching other code

3. WHEN vars.js is loaded THEN the system SHALL populate default values for:
   - Event name ("3rd AWS Community Day Aotearoa 2025")
   - Default date
   - Hashtags ("#AWSCDOceanic2025 #AWSVirtualCDNZ2025 #awscommunity")
   - Event links and branding elements

### Requirement 5

**User Story:** As a user, I want the application to work entirely in the browser without server dependencies, so that it can be easily deployed and accessed from any web hosting platform.

#### Acceptance Criteria

1. WHEN the application is accessed THEN the system SHALL function entirely with static HTML, CSS, and JavaScript files

2. WHEN the application runs THEN the system SHALL NOT require any server-side processing or external API calls

3. WHEN deployed THEN the system SHALL work from any static web hosting service or local file system

### Requirement 6

**User Story:** As a user, I want the application interface to be responsive and visually appealing, so that I can use it effectively on different devices and screen sizes.

#### Acceptance Criteria

1. WHEN the application loads THEN the system SHALL display a clean, professional interface with proper spacing and typography in a two-column layout (form left, preview right)

2. WHEN accessed on different screen sizes THEN the system SHALL maintain usability and readability across desktop and tablet devices, with the two-column layout adapting appropriately

3. WHEN form elements are interacted with THEN the system SHALL provide clear visual feedback and intuitive user experience

4. WHEN the screen width is sufficient THEN the system SHALL display the form and preview side-by-side for optimal workflow efficiency

### Requirement 7

**User Story:** As a user, I want dark mode support with system preference detection, so that I can use the application comfortably in different lighting conditions.

#### Acceptance Criteria

1. WHEN the application loads THEN the system SHALL detect the user's system dark mode preference and apply the appropriate theme by default

2. WHEN the user clicks the dark mode toggle in the upper right corner THEN the system SHALL switch between light and dark themes

3. WHEN dark mode is active THEN the system SHALL apply appropriate dark colors to all interface elements while maintaining readability and contrast

4. WHEN the theme is changed THEN the system SHALL persist the user's preference in local storage for future visits

### Requirement 8

**User Story:** As a user, I want access to the source code, so that I can see what the code was made of.

#### Acceptance Criteria

1. WHEN the application loads THEN the system SHALL display a GitHub icon in the upper right corner (to the left of the dark mode toggle)

2. WHEN the user clicks the GitHub icon THEN the system SHALL open the project repository in a new tab

### Requirement 9

**User Story:** As an event organizer, I want the flexibility to write longer speaker bios when needed, so that I can provide more detailed information about speakers while maintaining a default character limit for most use cases.

#### Acceptance Criteria

1. WHEN the application loads THEN the system SHALL display a speaker bio field with a default 300 character limit

2. WHEN the user needs to exceed the 300 character limit THEN the system SHALL provide an "Override Limit" toggle button next to the bio field

3. WHEN the override is disabled (default state) THEN the system SHALL enforce the 300 character limit with validation and character counting

4. WHEN the override is enabled THEN the system SHALL increase the limit to 1000 characters and update the character counter accordingly

5. WHEN the override is toggled THEN the system SHALL provide clear visual feedback showing the current state and effective character limit

6. WHEN the override is active THEN the system SHALL maintain all validation and character counting functionality with the new limit

### Requirement 10

**User Story:** As an event organizer, I want to create LinkedIn posts with proper user tagging and enhanced content structure, so that I can effectively promote speakers and events on social media.

#### Acceptance Criteria

1. WHEN the application generates formatted text THEN the system SHALL include a title with the event name

2. WHEN the application generates formatted text THEN the system SHALL include a welcome message with the speaker's name

3. WHEN the application generates formatted text THEN the system SHALL include a description about celebrating cloud builders

4. WHEN the application generates formatted text THEN the system SHALL include a schedule link from configuration

5. WHEN the user enters LinkedIn usernames THEN the system SHALL automatically format them with @ symbols for proper tagging

6. WHEN the user enters multiple usernames separated by commas THEN the system SHALL process each username individually and format them correctly

7. WHEN the application generates the final text THEN the system SHALL maintain proper formatting with line breaks and emoji usage
