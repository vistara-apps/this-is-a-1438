# Gavel Guard - Your Pocket Guide to Rights During Police Interactions

A mobile-first web application providing instant, jargon-free guidance and documentation tools for individuals interacting with law enforcement.

## 🚀 Features

### Core Features
- **On-Demand Rights Guide**: Situation-specific guidance and scripts for common police interaction scenarios
- **State Law Quick Reference**: Clear, digestible summaries of state-specific rights and laws
- **One-Tap Incident Recorder**: Discreet audio/video recording with automatic timestamp and GPS logging
- **Shareable Incident Summary**: Generate and share incident details with trusted contacts or legal aid

### Premium Features (Subscription-based)
- AI-generated dynamic scripts using OpenAI
- Advanced incident summaries with AI analysis
- Secure cloud storage via Pinata IPFS
- Unlimited incident recordings
- Multi-language support
- Offline access to all content

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Services & APIs
- **OpenAI API** - AI-generated content and translations
- **Pinata API** - Decentralized file storage on IPFS
- **Stripe API** - Subscription management and payments

### Storage & State Management
- **React Context** - Global state management
- **Enhanced LocalStorage** - Persistent data with versioning and expiration
- **Custom Hooks** - Reusable logic for subscriptions and API services

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Accordion.jsx   # Collapsible content component
│   ├── Alert.jsx       # Alert/notification component
│   ├── AppShell.jsx    # Main app layout with navigation
│   ├── Button.jsx      # Button component with variants
│   ├── Card.jsx        # Card container component
│   ├── Input.jsx       # Form input component
│   └── Select.jsx      # Select dropdown component
├── contexts/           # React Context providers
│   └── AppContext.jsx  # Global app state management
├── hooks/              # Custom React hooks
│   ├── useApiServices.js    # API services integration
│   └── useSubscription.js   # Subscription management
├── pages/              # Page components
│   ├── Dashboard.jsx        # Main dashboard
│   ├── IncidentRecorder.jsx # Recording functionality
│   ├── Landing.jsx          # Landing/onboarding page
│   ├── Profile.jsx          # User profile and settings
│   ├── RightsGuide.jsx      # Rights guidance by scenario
│   ├── SharedIncident.jsx   # Public incident viewing
│   └── StateLaws.jsx        # State-specific law reference
├── services/           # External service integrations
│   ├── openaiService.js     # OpenAI API integration
│   ├── pinataService.js     # Pinata IPFS integration
│   └── stripeService.js     # Stripe payment integration
├── utils/              # Utility functions
│   ├── helpers.js           # General utility functions
│   └── storage.js           # Enhanced storage management
├── App.jsx             # Main app component with routing
├── index.css           # Global styles and Tailwind imports
└── main.jsx            # App entry point
```

## 🎨 Design System

The application follows a consistent design system implemented through Tailwind CSS:

### Colors
- **Primary**: Blue (`hsl(210, 80%, 50%)`)
- **Accent**: Green (`hsl(130, 60%, 50%)`)
- **Danger**: Red (`hsl(0, 70%, 50%)`)
- **Warning**: Orange (`hsl(30, 90%, 50%)`)
- **Surface**: White (`hsl(0, 0%, 100%)`)
- **Background**: Light gray (`hsl(210, 30%, 96%)`)

### Typography
- **Display**: `text-4xl font-bold`
- **Heading 1**: `text-3xl font-semibold`
- **Heading 2**: `text-2xl font-semibold`
- **Body**: `text-base leading-7`
- **Small**: `text-sm leading-5`

### Spacing & Layout
- **Grid**: 12-column fluid grid with 24px gutters
- **Container**: `max-w-7xl px-6`
- **Spacing**: Small (8px), Medium (12px), Large (20px)
- **Border Radius**: Small (6px), Medium (10px), Large (16px)

## 🔧 Setup & Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- API keys for services (optional for basic functionality):
  - OpenAI API key
  - Pinata API credentials
  - Stripe publishable key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gavel-guard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Environment Configuration

The app works without API keys but with limited functionality. To enable premium features:

1. **OpenAI Integration**: Configure API key in the app settings
2. **Pinata Integration**: Configure API key and secret in settings
3. **Stripe Integration**: Configure publishable key in settings

## 📱 Usage

### Basic Usage (No API Keys Required)
- Browse rights guides with static content
- Record incidents locally
- View state law summaries
- Generate basic incident summaries

### Premium Usage (With API Keys)
- AI-generated dynamic scripts
- Advanced incident analysis
- Secure cloud storage
- Multi-language support
- Unlimited recordings

### User Flows

#### 1. Onboarding
1. User lands on homepage
2. Selects language (English/Spanish)
3. Chooses their state for localized content
4. Accesses dashboard with quick actions

#### 2. During an Interaction
1. User taps "Record Incident" button
2. App starts recording with GPS/timestamp
3. User can add notes during recording
4. Recording stops and incident is logged

#### 3. After an Interaction
1. User reviews incident details
2. Generates shareable summary
3. Shares with trusted contacts
4. Accesses relevant state law information

## 🔒 Privacy & Security

### Data Protection
- **Local-First**: Data stored locally by default
- **Encrypted Storage**: Sensitive data encrypted in browser
- **IPFS Integration**: Decentralized storage for incident data
- **No Tracking**: No user tracking or analytics

### Security Features
- **Secure Recording**: Discreet recording capabilities
- **Immutable Storage**: IPFS ensures data integrity
- **Access Control**: Shareable links with controlled access
- **Data Portability**: Export/import functionality

## 💳 Business Model

### Freemium Model
- **Free Tier**: Basic rights guide, limited recordings (3/month), basic summaries
- **Premium Tier**: $4.99/month for unlimited features

### Premium Features
- AI-generated content and scripts
- Unlimited incident recordings
- Advanced incident summaries
- Secure cloud storage
- Multi-language support
- Offline access
- Priority support

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Docker Deployment
```bash
docker build -t gavel-guard .
docker run -p 3000:3000 gavel-guard
```

### Environment Variables
- `VITE_OPENAI_API_KEY` (optional)
- `VITE_PINATA_API_KEY` (optional)
- `VITE_PINATA_SECRET_KEY` (optional)
- `VITE_STRIPE_PUBLISHABLE_KEY` (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please contact [support@gavelguard.com] or create an issue in the repository.

## 🔮 Future Enhancements

- **Mobile App**: Native iOS/Android applications
- **Web3 Integration**: Blockchain-based identity verification
- **Community Features**: User-generated content and reviews
- **Legal Network**: Integration with legal aid organizations
- **Advanced Analytics**: Incident pattern analysis
- **Voice Commands**: Hands-free operation during interactions

---

**Gavel Guard** - Empowering citizens with knowledge and tools to navigate police interactions safely and confidently.
