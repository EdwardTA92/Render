# Emergent.sh Local Clone

A comprehensive local replica of Emergent.sh with modern macOS liquid glass aesthetics, featuring AI-powered development tools, GitHub integration, and local file management.

## 🌟 Features

### Frontend
- **Modern macOS Liquid Glass UI** - Dynamic, contextual interface with liquid glass effects
- **Voice Input Support** - Dictation and voice commands
- **File Upload & Management** - Drag-and-drop file handling
- **Real-time Chat Interface** - AI-powered conversation
- **Task Management** - Progress tracking and task organization
- **GitHub Integration UI** - Repository management interface
- **Responsive Design** - Optimized for all screen sizes

### Setup & Configuration
- **Quick Onboarding** - Guided setup for API keys, GitHub, and local directories
- **API Key Management** - Support for OpenAI, Anthropic, Perplexity, and more
- **Local Directory Integration** - Work with your local codebase
- **GitHub Authentication** - Connect your repositories

## 🚀 Quick Start

### Option 1: Create macOS DMG (Recommended)

1. **Prerequisites:**
   - macOS (Intel or Apple Silicon)
   - Node.js 18+ installed
   - Python 3.8+ (for backend)

2. **Create DMG:**
   ```bash
   cd /path/to/this/project
   ./scripts/create-dmg.sh
   ```

3. **Install:**
   - Double-click the generated `Emergent-sh-Local.dmg`
   - Drag "Emergent.sh Local" to Applications
   - Launch from Applications folder

### Option 2: Development Mode

1. **Install Dependencies:**
   ```bash
   # Frontend
   cd frontend
   yarn install
   
   # Backend (if implementing)
   cd ../backend
   pip install -r requirements.txt
   ```

2. **Start Development Server:**
   ```bash
   # Frontend only
   cd frontend
   yarn start
   ```

3. **Access:** Open http://localhost:3000

## 🏗️ Architecture Overview

### Frontend Architecture
```
src/
├── App.js              # Main application component
├── Components.js       # All UI components in one file
├── App.css            # Modern macOS liquid glass styles
└── index.js           # React entry point
```

### Component Structure
- **MainLayout** - Overall app structure and state management
- **SetupModal** - Onboarding experience with 4-step setup
- **Header** - Navigation and user info
- **Sidebar** - Task management and navigation
- **HomePage** - Main interface with project showcase
- **ChatInterface** - AI conversation interface
- **SettingsPage** - Configuration management

### Key Technologies
- **React 19** - Latest React with concurrent features
- **Framer Motion** - Smooth animations and transitions
- **TailwindCSS** - Utility-first styling
- **Lucide React** - Modern icon library
- **React Dropzone** - File upload handling

## 🎨 Design System

### Liquid Glass Effects
- **Dynamic Backdrop Blur** - Contextual blur based on content
- **Adaptive Transparency** - Changes based on system preferences
- **Smooth Transitions** - Cubic-bezier easing for natural movement
- **Contextual Colors** - Interface adapts to content and state

### Accessibility
- **High Contrast Support** - Adapts to system preferences
- **Reduced Motion** - Respects user motion preferences
- **Keyboard Navigation** - Full keyboard accessibility
- **Screen Reader Support** - Semantic HTML and ARIA labels

## 🛠️ Backend Architecture Research

*Note: This section documents the inferred architecture based on emergent.sh analysis*

### Core Components Identified:

1. **Agent Orchestration System**
   - Multi-agent coordination for complex tasks
   - Tool calling and integration management
   - Context management across agent interactions

2. **AI Model Integration Layer**
   - Support for multiple AI providers (OpenAI, Anthropic, etc.)
   - Model routing and load balancing
   - API key management and rate limiting

3. **Code Generation Pipeline**
   - Template-based code generation
   - File system integration
   - Version control integration

4. **GitHub Integration Service**
   - Repository management
   - Branch operations
   - Pull request automation

5. **File System Manager**
   - Local file operations
   - Project structure management
   - File watching and synchronization

### Implementation Notes:
- **API Gateway** - Central routing for all AI model requests
- **Task Queue** - Background processing for long-running operations
- **WebSocket Server** - Real-time communication with frontend
- **Database Layer** - Task storage and user session management

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_OPENAI_API_KEY=your_openai_key
REACT_APP_ANTHROPIC_API_KEY=your_anthropic_key
REACT_APP_GITHUB_TOKEN=your_github_token
```

### API Keys Setup
The app supports multiple AI providers:
- **OpenAI** - GPT models and embeddings
- **Anthropic** - Claude models
- **Perplexity** - Search-augmented AI
- **GitHub** - Repository integration

## 📁 Project Structure

```
.
├── frontend/                 # React application
│   ├── src/
│   │   ├── App.js           # Main app component
│   │   ├── Components.js    # All UI components
│   │   ├── App.css          # Liquid glass styles
│   │   └── index.js         # Entry point
│   ├── public/              # Static assets
│   └── package.json         # Dependencies
├── backend/                 # Python backend (extensible)
├── scripts/
│   └── create-dmg.sh       # DMG creation script
└── README.md               # This file
```

## 🎯 Key Features Implemented

### ✅ Completed
- Modern macOS liquid glass UI
- Setup onboarding flow
- Chat interface with voice input
- File upload and drag-drop
- Task management sidebar
- GitHub integration UI
- Settings management
- Responsive design
- Accessibility features

### 🔄 Extensible Backend Components
- Agent orchestration framework
- AI model integration
- Code generation pipeline
- File system operations
- GitHub API integration

## 🚀 Deployment Options

### 1. Desktop App (DMG)
- Full native macOS experience
- Offline capability
- System integration
- Auto-updates support

### 2. Web Application
- Cross-platform compatibility
- Easy deployment
- No installation required
- Cloud-based storage

### 3. Docker Container
- Consistent environment
- Easy scaling
- Development isolation
- Production deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created as an educational clone of Emergent.sh for learning purposes.

## 🔗 Links

- [Original Emergent.sh](https://emergent.sh)
- [React Documentation](https://react.dev)
- [Framer Motion](https://www.framer.com/motion/)
- [TailwindCSS](https://tailwindcss.com)

---

**Note:** This is a frontend-focused clone with extensible backend architecture. The backend components are designed to be implemented based on your specific AI model integrations and requirements.