// Event Configuration Constants
const CONFIG = {
          event: {
          name: "𝟑𝐫𝐝 𝐀𝐖𝐒 𝐂𝐨𝐦𝐦𝐮𝐧𝐢𝐭𝐲 𝐃𝐚𝐲 𝐀𝐨𝐭𝐞𝐚𝐫𝐨𝐚 𝟐𝟎𝟐𝟓",
          defaultDate: "2025-09-18",
          hashtags: ["#AWS", "#awscdnz25", "#awscommunity", "#awscommunitybuilders", "#techcommunity", "#networking", "#Wellington", "#NewZealand", "#KeynoteSpeaker", "#AgenticAI", "#NZTechCommunity", "#DontMissOut", "#announcement"],
          githubUrl: "https://github.com/jajera/aws-community-day-spotlight",
          scheduleUrl: "https://aws-community-day.nz/inperson.html#schedules",
          registrationUrl: "https://konfhub.com/awscdnz25",
          welcomeMessage: "🚀 Exciting news! We're thrilled to welcome {speakerName} to our stellar speaker lineup for the 𝐀𝐖𝐒 𝐂𝐨𝐦𝐦𝐮𝐧𝐢𝐭𝐲 𝐃𝐚𝐲 𝐀𝐨𝐭𝐞𝐚𝐫𝐨𝐚 𝟐𝟎𝟐𝟓! 🌟",
          description: "This in-person edition brings together cloud builders, innovators, and AWS enthusiasts. Join us for inspiring talks, hands-on learning, and networking opportunities — all live and face-to-face! 🤝✨"
        },
  
  canvas: {
    width: 800,
    height: 600,
    
    colors: {
      light: {
        background: '#ffffff',
        headerBg: '#ff9900',
        headerText: '#ffffff',
        primaryText: '#333333',
        secondaryText: '#666666',
        footerText: '#666666'
      },
      dark: {
        background: '#2d2d2d',
        headerBg: '#ff9900',
        headerText: '#ffffff',
        primaryText: '#ffffff',
        secondaryText: '#cccccc',
        footerText: '#aaaaaa'
      }
    },
    
    layout: {
      header: {
        height: 80,
        fontSize: 24,
        fontWeight: 'bold'
      },
      content: {
        padding: 20,
        lineHeight: 24,
        sections: [
          { emoji: '🎙️', label: 'Speaker', fontSize: 20, fontWeight: 'bold' },
          { emoji: '📌', label: 'Topic', fontSize: 18, fontWeight: 'normal' },
          { emoji: '👤', label: 'Bio', fontSize: 16, fontWeight: 'normal' },
          { emoji: '🗓', label: 'Date', fontSize: 16, fontWeight: 'normal' },
          { emoji: '⏰', label: 'Time', fontSize: 16, fontWeight: 'normal' },
          { emoji: '🌐', label: 'Format', fontSize: 16, fontWeight: 'normal' }
        ]
      },
      footer: {
        height: 40,
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 20
      }
    },
    
    fonts: {
      primary: 'Arial, sans-serif',
      fallback: 'system-ui, -apple-system, sans-serif'
    }
  },
  
  errorHandling: {
    canvas: {
      retryAttempts: 3,
      fallbackMessage: 'Preview temporarily unavailable. Your form data is still being processed.'
    },
    clipboard: {
      timeoutMs: 5000,
      fallbackEnabled: true
    },
    fonts: {
      loadTimeoutMs: 3000,
      fallbackEnabled: true
    },
    validation: {
      debounceMs: 300,
      showWarnings: true
    }
  },
  
  form: {
    limits: {
      speakerName: 60,
      topicTitle: 100,
      speakerBio: 300,
      speakerBioOverride: 1000
    },
    
    defaults: {
      time: "00:00",
      format: "",
      linkedinUsers: "John Ajera, Ramaswamy Arunachalam, Natalia Nam, Arshad Zackeriya, Chamila de Alwis, Darshit Pandya, Dipin Thomas, Geethika Guruge, Hrishikesh Hiremath, Isuri Shashipraba, Zhiwei(Kobe) Xu, Lilupa Karu, Mark Goatley, Paul Dunlop, Sebastian Krueger, Sergio Luiz Pereira Filho, Terence White"
    }
  },
  
  text: {
    template: {
      title: "📢 𝑺𝒑𝒆𝒂𝒌𝒆𝒓 𝑺𝒑𝒐𝒕𝒍𝒊𝒈𝒉𝒕 – {eventName}",
      welcome: "{welcomeMessage}",
      speaker: "🎙️ Speaker: {name}",
      topic: "📌 Topic: {topic}",
      bio: "👤 Bio: {bio}",
      description: "{description}",
      date: "🗓 Date: {date}",
      time: "⏰ Time: {time}",
      schedule: "📅 𝑭𝒖𝒍𝒍 𝒔𝒄𝒉𝒆𝒅𝒖𝒍𝒆 & 𝒅𝒆𝒕𝒂𝒊𝒍𝒔: {scheduleUrl}",
      registration: "🎫 Registration: {registrationUrl}",
      format: "🌐 Format: {format}",
      hashtags: "{hashtags}",
      linkedinUsers: "@{linkedinUsers}",
      callToAction: "💡 Don't miss out on this incredible opportunity to learn from industry experts and connect with the AWS community! 🚀"
    }
  }
};

// Make CONFIG available globally
window.CONFIG = CONFIG;