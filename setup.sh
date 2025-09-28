#!/bin/bash

# BlackSwan ACP Service Setup Script
# ==================================

set -e

echo "🚀 BlackSwan ACP Service Setup"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo -e "${YELLOW}💡 Please install Node.js 18+ from https://nodejs.org${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version $NODE_VERSION is too old${NC}"
    echo -e "${YELLOW}💡 Please upgrade to Node.js 18+ from https://nodejs.org${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm -v) detected${NC}"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo -e "${BLUE}📝 Creating .env file from template...${NC}"
    
    if [ -f "env.example" ]; then
        cp env.example .env
        echo -e "${GREEN}✅ .env file created from template${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env file with your actual values:${NC}"
        echo -e "${YELLOW}   - WHITELISTED_WALLET_PRIVATE_KEY${NC}"
        echo -e "${YELLOW}   - SELLER_AGENT_WALLET_ADDRESS${NC}"
        echo -e "${YELLOW}   - SELLER_ENTITY_ID${NC}"
    else
        echo -e "${RED}❌ env.example template not found${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi

# Check if required ACP package exists
if [ ! -d "../acp-node/dist" ]; then
    echo -e "${YELLOW}⚠️  ACP Node package not built${NC}"
    echo -e "${BLUE}🔨 Building ACP Node package...${NC}"
    
    cd ../acp-node
    if [ -f "package.json" ]; then
        npm install
        npm run tsup
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ ACP Node package built successfully${NC}"
        else
            echo -e "${RED}❌ Failed to build ACP Node package${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ ACP Node package not found${NC}"
        exit 1
    fi
    cd ../blackswan-acp
else
    echo -e "${GREEN}✅ ACP Node package found${NC}"
fi

# Create logs directory
mkdir -p logs
echo -e "${GREEN}✅ Logs directory created${NC}"

# Display next steps
echo ""
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "${YELLOW}1. Edit .env file with your actual values:${NC}"
echo "   nano .env"
echo ""
echo -e "${YELLOW}2. Start the service:${NC}"
echo "   npm start         # Production mode"
echo "   npm run dev       # Development mode"
echo ""
echo -e "${YELLOW}3. Test the service:${NC}"
echo "   curl http://localhost:3002/health"
echo "   curl http://localhost:3002/info"
echo ""
echo -e "${YELLOW}4. Test with ACP buyer:${NC}"
echo "   cd ../acp-node/examples/acp-base/self-evaluation"
echo "   npx tsx buyer.ts"
echo ""
echo -e "${GREEN}📖 For more information, see README.md${NC}"
