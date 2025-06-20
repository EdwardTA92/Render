import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Components } from './Components';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [userConfig, setUserConfig] = useState({
    apiKeys: {},
    githubConnected: false,
    localDirectory: '',
    name: ''
  });

  useEffect(() => {
    // Check if setup is complete from localStorage
    const savedConfig = localStorage.getItem('emergent-config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setUserConfig(config);
      setIsSetupComplete(true);
    } else {
      setShowSetup(true);
    }
  }, []);

  const handleSetupComplete = (config) => {
    setUserConfig(config);
    setIsSetupComplete(true);
    setShowSetup(false);
    localStorage.setItem('emergent-config', JSON.stringify(config));
  };

  const resetSetup = () => {
    localStorage.removeItem('emergent-config');
    setIsSetupComplete(false);
    setShowSetup(true);
    setUserConfig({
      apiKeys: {},
      githubConnected: false,
      localDirectory: '',
      name: ''
    });
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Components.MainLayout 
              showSetup={showSetup}
              isSetupComplete={isSetupComplete}
              userConfig={userConfig}
              onSetupComplete={handleSetupComplete}
              onResetSetup={resetSetup}
            />
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;