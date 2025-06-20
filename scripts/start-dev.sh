#!/bin/bash

# Quick start script for Emergent.sh Local Clone
# This script helps you get started quickly with development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Emergent.sh Local Clone - Quick Start${NC}"
echo "============================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    echo -e "${YELLOW}   Download from: https://nodejs.org/${NC}"
    exit 1
fi

if ! command_exists yarn; then
    echo -e "${YELLOW}📦 Yarn not found. Installing yarn globally...${NC}"
    npm install -g yarn
fi

echo -e "${GREEN}✅ Prerequisites check complete${NC}"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
cd frontend

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}   Installing frontend dependencies...${NC}"
    yarn install
else
    echo -e "${GREEN}   Dependencies already installed${NC}"
fi

# Start development server
echo -e "${BLUE}🚀 Starting development server...${NC}"
echo -e "${GREEN}   Frontend will be available at: http://localhost:3000${NC}"
echo -e "${YELLOW}   Press Ctrl+C to stop the server${NC}"
echo ""

yarn start