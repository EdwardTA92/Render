import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  User, 
  Settings, 
  Github, 
  Upload, 
  Mic, 
  MicOff, 
  Send, 
  FolderOpen, 
  Key, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  Play,
  BarChart3,
  PenTool,
  Search,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Globe,
  Palette,
  Code,
  Wand2
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

// Main Layout Component
const MainLayout = ({ showSetup, isSetupComplete, userConfig, onSetupComplete, onResetSetup }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Setup Modal */}
      <AnimatePresence>
        {showSetup && (
          <SetupModal onComplete={onSetupComplete} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      {isSetupComplete && (
        <>
          <Header userConfig={userConfig} onResetSetup={onResetSetup} />
          
          <div className="flex h-screen pt-16">
            <Sidebar 
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage}
              tasks={tasks}
            />
            
            <main className="flex-1 overflow-hidden">
              {currentPage === 'home' && (
                <HomePage 
                  messages={messages}
                  setMessages={setMessages}
                  inputMessage={inputMessage}
                  setInputMessage={setInputMessage}
                  isRecording={isRecording}
                  setIsRecording={setIsRecording}
                  selectedSuggestion={selectedSuggestion}
                  setSelectedSuggestion={setSelectedSuggestion}
                  tasks={tasks}
                  setTasks={setTasks}
                  userConfig={userConfig}
                />
              )}
              {currentPage === 'chat' && (
                <ChatInterface 
                  messages={messages}
                  setMessages={setMessages}
                  inputMessage={inputMessage}
                  setInputMessage={setInputMessage}
                  isRecording={isRecording}
                  setIsRecording={setIsRecording}
                />
              )}
              {currentPage === 'settings' && (
                <SettingsPage userConfig={userConfig} onResetSetup={onResetSetup} />
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
};

// Setup Modal Component
const SetupModal = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    name: '',
    apiKeys: {
      openai: '',
      anthropic: '',
      perplexity: ''
    },
    githubConnected: false,
    localDirectory: ''
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(config);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="glass-panel w-full max-w-2xl mx-4 p-8 rounded-3xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to <span className="text-green-400 glitch-text">EMERGENT</span>
          </h1>
          <p className="text-gray-300">Let's set up your AI development environment</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= num ? 'bg-green-400 text-black' : 'bg-gray-600 text-gray-300'
                }`}>
                  {step > num ? <CheckCircle size={16} /> : num}
                </div>
                {num < 4 && <div className={`w-16 h-1 mx-2 ${
                  step > num ? 'bg-green-400' : 'bg-gray-600'
                }`}></div>}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <SetupStep1 config={config} setConfig={setConfig} />
        )}
        {step === 2 && (
          <SetupStep2 config={config} setConfig={setConfig} />
        )}
        {step === 3 && (
          <SetupStep3 config={config} setConfig={setConfig} />
        )}
        {step === 4 && (
          <SetupStep4 config={config} setConfig={setConfig} />
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="glass-button px-6 py-3 rounded-xl disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="glass-button-primary px-6 py-3 rounded-xl"
          >
            {step === 4 ? 'Complete Setup' : 'Next'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Setup Steps
const SetupStep1 = ({ config, setConfig }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold text-white">Welcome! What's your name?</h2>
    <input
      type="text"
      placeholder="Enter your name"
      value={config.name}
      onChange={(e) => setConfig({...config, name: e.target.value})}
      className="glass-input w-full px-4 py-3 rounded-xl text-white placeholder-gray-400"
    />
  </div>
);

const SetupStep2 = ({ config, setConfig }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold text-white">API Keys</h2>
    <p className="text-gray-300">Add your AI model API keys to enable full functionality</p>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">OpenAI API Key</label>
        <input
          type="password"
          placeholder="sk-..."
          value={config.apiKeys.openai}
          onChange={(e) => setConfig({
            ...config, 
            apiKeys: {...config.apiKeys, openai: e.target.value}
          })}
          className="glass-input w-full px-4 py-3 rounded-xl text-white placeholder-gray-400"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Anthropic API Key</label>
        <input
          type="password"
          placeholder="sk-ant-..."
          value={config.apiKeys.anthropic}
          onChange={(e) => setConfig({
            ...config, 
            apiKeys: {...config.apiKeys, anthropic: e.target.value}
          })}
          className="glass-input w-full px-4 py-3 rounded-xl text-white placeholder-gray-400"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Perplexity API Key</label>
        <input
          type="password"
          placeholder="pplx-..."
          value={config.apiKeys.perplexity}
          onChange={(e) => setConfig({
            ...config, 
            apiKeys: {...config.apiKeys, perplexity: e.target.value}
          })}
          className="glass-input w-full px-4 py-3 rounded-xl text-white placeholder-gray-400"
        />
      </div>
    </div>
  </div>
);

const SetupStep3 = ({ config, setConfig }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold text-white">GitHub Integration</h2>
    <p className="text-gray-300">Connect your GitHub account for seamless repository management</p>
    
    <button
      onClick={() => setConfig({...config, githubConnected: !config.githubConnected})}
      className={`glass-button w-full p-4 rounded-xl flex items-center justify-center space-x-3 ${
        config.githubConnected ? 'bg-green-500/20 border-green-400' : ''
      }`}
    >
      <Github size={24} />
      <span>{config.githubConnected ? 'Connected to GitHub' : 'Connect GitHub'}</span>
      {config.githubConnected && <CheckCircle size={20} className="text-green-400" />}
    </button>
  </div>
);

const SetupStep4 = ({ config, setConfig }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold text-white">Local Directory</h2>
    <p className="text-gray-300">Choose your local development directory</p>
    
    <div className="glass-panel p-4 rounded-xl">
      <button
        onClick={() => setConfig({...config, localDirectory: '/Users/dev/projects'})}
        className="glass-button w-full p-4 rounded-xl flex items-center justify-center space-x-3"
      >
        <FolderOpen size={24} />
        <span>Choose Directory</span>
      </button>
      {config.localDirectory && (
        <p className="text-green-400 mt-2 text-center">{config.localDirectory}</p>
      )}
    </div>
  </div>
);

// Header Component
const Header = ({ userConfig, onResetSetup }) => (
  <motion.header 
    className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-white/10"
    initial={{ y: -100 }}
    animate={{ y: 0 }}
  >
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Home size={24} className="text-green-400" />
          <span className="text-xl font-bold text-white">EMERGENT</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-gray-300">Welcome, {userConfig.name}</span>
        <button
          onClick={onResetSetup}
          className="glass-button p-2 rounded-lg"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  </motion.header>
);

// Sidebar Component
const Sidebar = ({ currentPage, setCurrentPage, tasks }) => (
  <motion.aside 
    className="w-80 glass-panel border-r border-white/10 p-6"
    initial={{ x: -300 }}
    animate={{ x: 0 }}
  >
    <nav className="space-y-2 mb-8">
      {[
        { id: 'home', label: 'Home', icon: Home },
        { id: 'chat', label: 'Chat', icon: MessageSquare },
        { id: 'settings', label: 'Settings', icon: Settings }
      ].map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setCurrentPage(id)}
          className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
            currentPage === id 
              ? 'bg-green-400/20 text-green-400 border border-green-400/30' 
              : 'text-gray-300 hover:bg-white/5'
          }`}
        >
          <Icon size={20} />
          <span>{label}</span>
        </button>
      ))}
    </nav>

    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Recent Tasks</h3>
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-gray-400 text-sm">No tasks yet</p>
        ) : (
          tasks.slice(0, 5).map((task, index) => (
            <div key={index} className="glass-panel p-3 rounded-lg">
              <p className="text-sm text-white truncate">{task.title}</p>
              <p className="text-xs text-gray-400">{task.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  </motion.aside>
);

// Home Page Component
const HomePage = ({ 
  messages, setMessages, inputMessage, setInputMessage, 
  isRecording, setIsRecording, selectedSuggestion, setSelectedSuggestion,
  tasks, setTasks, userConfig 
}) => {
  const suggestions = [
    { text: 'Clone Airbnb', icon: Globe, color: 'red' },
    { text: 'Idea Logger', icon: PenTool, color: 'yellow' },
    { text: 'Smart Course', icon: BarChart3, color: 'orange' },
    { text: 'Surprise Me', icon: Sparkles, color: 'green' }
  ];

  const communityProjects = [
    {
      title: 'AI Goal Coach',
      description: 'AI coach that analyzes your objectives, creates personalized step-by-step plans',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      category: 'AI Apps'
    },
    {
      title: 'Solo Pro',
      description: 'SoloPro—an AI-powered platform that helps you transform your expertise into',
      image: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9',
      category: 'AI Apps'
    },
    {
      title: 'Children Storyboard',
      description: 'Interactive web app that immerses personalized children stories with multiplayer',
      image: 'https://images.pexels.com/photos/32617085/pexels-photo-32617085.jpeg',
      category: 'AI Apps'
    },
    {
      title: 'Research Explorer',
      description: 'An intelligent app that conducts comprehensive research on any topic using',
      image: 'https://images.pexels.com/photos/17484901/pexels-photo-17484901.png',
      category: 'AI Apps'
    }
  ];

  return (
    <div className="h-full overflow-y-auto p-8">
      <motion.div 
        className="max-w-6xl mx-auto space-y-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Hero Section */}
        <div className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="space-y-4"
          >
            <h1 className="text-6xl font-bold text-white">
              Welcome,
            </h1>
            <h2 className="text-5xl font-bold text-white">
              What will you build today?
            </h2>
          </motion.div>

          {/* Main Input */}
          <div className="max-w-4xl mx-auto">
            <ChatInput
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              onSend={() => {
                if (inputMessage.trim()) {
                  setMessages([...messages, { type: 'user', content: inputMessage }]);
                  setTasks([...tasks, { title: inputMessage, status: 'processing' }]);
                  setInputMessage('');
                }
              }}
              placeholder="Build me a dashboard for..."
              size="large"
            />
          </div>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap justify-center gap-4">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedSuggestion(suggestion.text)}
                className={`suggestion-pill px-4 py-2 rounded-full flex items-center space-x-2 border-2 transition-all ${
                  selectedSuggestion === suggestion.text
                    ? `border-${suggestion.color}-400 bg-${suggestion.color}-400/20`
                    : 'border-gray-600 hover:border-gray-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <suggestion.icon size={16} />
                <span className="text-white">{suggestion.text}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Community Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">From the Community</h3>
            <div className="flex justify-center space-x-8">
              {['AI Apps', 'Digital Sidekicks', 'Landing', 'Hack & Play'].map((tab, index) => (
                <button
                  key={tab}
                  className={`px-6 py-2 rounded-full transition-all ${
                    index === 0 
                      ? 'bg-white text-black' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>

          <div className="text-center">
            <button className="glass-button px-8 py-3 rounded-xl">
              Visit Our Showcase →
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-8 py-16">
          <h2 className="text-6xl font-bold text-white">
            Start building with
          </h2>
          <h3 className="text-6xl font-bold glitch-text text-green-400">
            EMERGENT TODAY
          </h3>
          <button className="glass-button-primary px-12 py-4 rounded-2xl text-xl font-semibold">
            Get Started
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project }) => (
  <motion.div 
    className="glass-panel rounded-2xl overflow-hidden group cursor-pointer"
    whileHover={{ scale: 1.02, y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <div className="aspect-video relative overflow-hidden">
      <img 
        src={project.image} 
        alt={project.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
    </div>
    <div className="p-6">
      <h4 className="text-lg font-semibold text-white mb-2">{project.title}</h4>
      <p className="text-gray-300 text-sm line-clamp-3">{project.description}</p>
    </div>
  </motion.div>
);

// Chat Interface Component
const ChatInterface = ({ 
  messages, setMessages, inputMessage, setInputMessage, 
  isRecording, setIsRecording 
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare size={64} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">Start a conversation</h3>
              <p className="text-gray-400">Ask me to build anything, analyze code, or help with development</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))
          )}
        </div>
      </div>
      
      <div className="border-t border-white/10 p-6">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            onSend={() => {
              if (inputMessage.trim()) {
                setMessages([...messages, { type: 'user', content: inputMessage }]);
                // Simulate AI response
                setTimeout(() => {
                  setMessages(prev => [...prev, { 
                    type: 'assistant', 
                    content: `I'll help you with: ${inputMessage}. Let me start working on that...` 
                  }]);
                }, 1000);
                setInputMessage('');
              }
            }}
            placeholder="Ask me anything..."
          />
        </div>
      </div>
    </div>
  );
};

// Chat Message Component
const ChatMessage = ({ message }) => (
  <motion.div
    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className={`max-w-3xl p-4 rounded-2xl ${
      message.type === 'user' 
        ? 'bg-green-400/20 text-white ml-12' 
        : 'glass-panel text-white mr-12'
    }`}>
      <p>{message.content}</p>
    </div>
  </motion.div>
);

// Chat Input Component
const ChatInput = ({ 
  inputMessage, setInputMessage, isRecording, setIsRecording, 
  onSend, placeholder = "Type your message...", size = "normal" 
}) => {
  const fileInputRef = useRef(null);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      console.log('Files dropped:', files);
    },
    noClick: true
  });

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Simulate voice recording
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputMessage("Voice input: " + inputMessage);
      }, 2000);
    }
  };

  return (
    <div {...getRootProps()} className={`relative ${isDragActive ? 'ring-2 ring-green-400 rounded-2xl' : ''}`}>
      <input {...getInputProps()} />
      
      <div className={`glass-panel rounded-2xl border border-white/20 ${
        size === 'large' ? 'p-6' : 'p-4'
      }`}>
        <div className="flex items-end space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="glass-button p-3 rounded-xl hover:bg-white/10"
            >
              <Upload size={20} />
            </button>
            
            <button
              onClick={toggleRecording}
              className={`glass-button p-3 rounded-xl transition-colors ${
                isRecording ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10'
              }`}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          </div>
          
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className={`w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none ${
                size === 'large' ? 'text-lg' : 'text-base'
              }`}
              rows={size === 'large' ? 3 : 1}
            />
          </div>
          
          <button
            onClick={onSend}
            disabled={!inputMessage.trim()}
            className="glass-button-primary p-3 rounded-xl disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
        
        {isDragActive && (
          <div className="absolute inset-0 bg-green-400/10 border-2 border-dashed border-green-400 rounded-2xl flex items-center justify-center">
            <p className="text-green-400 font-semibold">Drop files here...</p>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => console.log('Files selected:', e.target.files)}
      />
    </div>
  );
};

// Settings Page Component
const SettingsPage = ({ userConfig, onResetSetup }) => (
  <div className="h-full overflow-y-auto p-8">
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-white">Settings</h1>
      
      <div className="glass-panel p-6 rounded-2xl">
        <h2 className="text-2xl font-semibold text-white mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={userConfig.name}
              readOnly
              className="glass-input w-full px-4 py-3 rounded-xl text-white"
            />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        <h2 className="text-2xl font-semibold text-white mb-4">API Keys</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">OpenAI</label>
            <input
              type="password"
              value={userConfig.apiKeys.openai}
              readOnly
              className="glass-input w-full px-4 py-3 rounded-xl text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Anthropic</label>
            <input
              type="password"
              value={userConfig.apiKeys.anthropic}
              readOnly
              className="glass-input w-full px-4 py-3 rounded-xl text-white"
            />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        <h2 className="text-2xl font-semibold text-white mb-4">GitHub</h2>
        <div className="flex items-center space-x-3">
          <Github size={24} />
          <span className="text-white">
            {userConfig.githubConnected ? 'Connected' : 'Not connected'}
          </span>
          {userConfig.githubConnected && <CheckCircle size={20} className="text-green-400" />}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        <h2 className="text-2xl font-semibold text-white mb-4">Local Directory</h2>
        <p className="text-gray-300">{userConfig.localDirectory || 'Not set'}</p>
      </div>

      <button
        onClick={onResetSetup}
        className="glass-button-primary px-8 py-4 rounded-xl"
      >
        Reset Setup
      </button>
    </div>
  </div>
);

export const Components = {
  MainLayout,
  SetupModal,
  Header,
  Sidebar,
  HomePage,
  ChatInterface,
  SettingsPage,
  ProjectCard,
  ChatMessage,
  ChatInput
};