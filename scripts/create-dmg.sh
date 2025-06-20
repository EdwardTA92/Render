#!/bin/bash

# Script to create a macOS DMG from the Emergent.sh clone
# This script should be run on macOS with Node.js installed

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Building Emergent.sh Clone DMG${NC}"

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}❌ This script must be run on macOS${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if Electron is available globally, if not install it
if ! command -v electron &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Electron globally...${NC}"
    npm install -g electron
fi

# Create build directory
BUILD_DIR="./build-dmg"
APP_NAME="Emergent.sh"
DMG_NAME="Emergent-sh-Local.dmg"

echo -e "${YELLOW}📁 Creating build directory...${NC}"
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

# Copy all source files
echo -e "${YELLOW}📋 Copying source files...${NC}"
cp -r ./frontend $BUILD_DIR/
cp -r ./backend $BUILD_DIR/
cp ./README.md $BUILD_DIR/
cp -r ./scripts $BUILD_DIR/

# Create Electron wrapper
echo -e "${YELLOW}⚡ Creating Electron wrapper...${NC}"
cat > $BUILD_DIR/main.js << 'EOF'
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');
const fs = require('fs');

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    titleBarStyle: 'hiddenInset',
    vibrancy: 'ultra-dark',
    transparent: true,
    backgroundColor: '#00000000'
  });

  // Start backend server
  startBackend();

  // Load the React app
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // Serve the built React app
    const express = require('express');
    const expressApp = express();
    expressApp.use(express.static(path.join(__dirname, 'frontend/build')));
    expressApp.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    });
    
    const server = expressApp.listen(3001, () => {
      mainWindow.loadURL('http://localhost:3001');
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (backendProcess) {
      backendProcess.kill();
    }
  });
}

function startBackend() {
  const backendPath = path.join(__dirname, 'backend');
  
  // Start Python backend
  backendProcess = spawn('python', ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8001'], {
    cwd: backendPath,
    stdio: 'pipe'
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });
}

// Handle file system operations
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (!result.canceled) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('write-file', async (event, filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    throw error;
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
EOF

# Create package.json for Electron app
cat > $BUILD_DIR/package.json << 'EOF'
{
  "name": "emergent-sh-local",
  "version": "1.0.0",
  "description": "Local Emergent.sh Clone - AI Development Platform",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "dist": "npm run build-frontend && electron-builder",
    "build-frontend": "cd frontend && npm run build"
  },
  "build": {
    "appId": "com.emergent.local",
    "productName": "Emergent.sh Local",
    "directories": {
      "output": "dist"
    },
    "files": [
      "main.js",
      "frontend/build/**/*",
      "backend/**/*",
      "node_modules/**/*"
    ],
    "mac": {
      "icon": "assets/icon.icns",
      "category": "public.app-category.developer-tools",
      "target": [
        {
          "target": "dmg",
          "arch": [
            "x64",
            "arm64"
          ]
        }
      ]
    },
    "dmg": {
      "title": "${productName} ${version}",
      "icon": "assets/icon.icns",
      "background": "assets/dmg-background.png",
      "contents": [
        {
          "x": 130,
          "y": 220,
          "type": "file"
        },
        {
          "x": 410,
          "y": 220,
          "type": "link",
          "path": "/Applications"
        }
      ],
      "window": {
        "width": 540,
        "height": 380
      }
    }
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.9.1"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF

# Install Electron dependencies
echo -e "${YELLOW}📦 Installing Electron dependencies...${NC}"
cd $BUILD_DIR
npm install

# Build frontend
echo -e "${YELLOW}🏗️  Building React frontend...${NC}"
cd frontend
npm install
npm run build
cd ..

# Create assets directory and icon
echo -e "${YELLOW}🎨 Creating app assets...${NC}"
mkdir -p assets

# Create a simple icon (you can replace this with a proper .icns file)
echo -e "${YELLOW}ℹ️  Note: Using default icon. Replace assets/icon.icns with your custom icon.${NC}"

# Build the DMG
echo -e "${YELLOW}📦 Building DMG...${NC}"
npm run dist

# Move DMG to parent directory
if [ -f "dist/$DMG_NAME" ]; then
    mv "dist/$DMG_NAME" "../$DMG_NAME"
    echo -e "${GREEN}✅ DMG created successfully: $DMG_NAME${NC}"
else
    echo -e "${YELLOW}⚠️  DMG not found, checking for other formats...${NC}"
    ls -la dist/
fi

# Clean up
cd ..
echo -e "${YELLOW}🧹 Cleaning up build directory...${NC}"
rm -rf $BUILD_DIR

echo -e "${GREEN}🎉 Build complete!${NC}"
echo -e "${GREEN}📱 Your Emergent.sh Local app is ready!${NC}"

if [ -f "$DMG_NAME" ]; then
    echo -e "${GREEN}💾 DMG Location: $(pwd)/$DMG_NAME${NC}"
    echo -e "${GREEN}📝 To install: Double-click the DMG and drag Emergent.sh Local to Applications${NC}"
else
    echo -e "${YELLOW}⚠️  DMG not created. Check the dist folder for other formats.${NC}"
fi