// Verification script for copy functionality
// This script tests the text formatting without browser dependencies

// Mock CONFIG for testing
const TEST_CONFIG = {
  event: {
    name: "3rd AWS Community Day Aotearoa 2025",
    hashtags: ["#AWSCDOceanic2025", "#AWSVirtualCDNZ2025", "#awscommunity"]
  },
  text: {
    template: {
      prefix: "🎙️ Speaker: {name}\n\n📌 Topic: {topic}\n\n👤 Bio: {bio}\n\n🗓 Date: {date}\n⏰ Time: {time}\n🌐 Format: {format}\n\n",
      suffix: "{hashtags}"
    }
  }
};

// Mock form data
const testFormData = {
  speakerName: "John Doe",
  topicTitle: "Building Serverless Applications with AWS Lambda",
  speakerBio: "John is a senior cloud architect with 10 years of experience in AWS. He specializes in serverless architectures and has helped numerous companies migrate to the cloud.",
  eventDate: "2025-03-15",
  eventTime: "14:30",
  eventFormat: "Virtual"
};

// Mock date/time formatting functions
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatTime(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour12 = parseInt(hours) % 12 || 12;
  const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes} ${ampm}`;
}

// Test the text generation
function testTextGeneration() {
  console.log('Testing text generation...\n');
  
  // Format the data for text export
  const formattedDate = formatDate(testFormData.eventDate);
  const formattedTime = formatTime(testFormData.eventTime);
  const hashtags = TEST_CONFIG.event.hashtags.join(' ');
  
  // Generate formatted text using template
  let formattedText = TEST_CONFIG.text.template.prefix
    .replace('{name}', testFormData.speakerName.trim())
    .replace('{topic}', testFormData.topicTitle.trim())
    .replace('{bio}', testFormData.speakerBio.trim())
    .replace('{date}', formattedDate)
    .replace('{time}', formattedTime)
    .replace('{format}', testFormData.eventFormat);
  
  // Add hashtags
  formattedText += TEST_CONFIG.text.template.suffix.replace('{hashtags}', hashtags);
  
  console.log('Generated formatted text:');
  console.log('=' .repeat(50));
  console.log(formattedText);
  console.log('=' .repeat(50));
  
  // Verify the content
  const expectedElements = [
    '🎙️ Speaker: John Doe',
    '📌 Topic: Building Serverless Applications with AWS Lambda',
    '👤 Bio: John is a senior cloud architect',
    '🗓 Date: Saturday, 15 March 2025',
    '⏰ Time: 2:30 PM',
    '🌐 Format: Virtual',
    '#AWSCDOceanic2025 #AWSVirtualCDNZ2025 #awscommunity'
  ];
  
  let allElementsFound = true;
  expectedElements.forEach(element => {
    if (!formattedText.includes(element)) {
      console.error(`❌ Missing expected element: ${element}`);
      allElementsFound = false;
    } else {
      console.log(`✅ Found: ${element}`);
    }
  });
  
  if (allElementsFound) {
    console.log('\n✅ All tests passed! Text generation is working correctly.');
  } else {
    console.log('\n❌ Some tests failed. Please check the implementation.');
  }
  
  return formattedText;
}

// Run the test
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = { testTextGeneration, formatDate, formatTime };
} else {
  // Browser environment
  testTextGeneration();
}