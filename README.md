# Black Swan ACP Service

[![Node.js](https://img.shields.io/badge/Node.js-18.0.0+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Author](https://img.shields.io/badge/Author-Muhammad%20Bilal%20Motiwala-orange.svg)](https://github.com/bilalmotiwala)

A production-ready, scalable service integrated within the Agent Commerce Protocol (ACP) by Virtuals Protocol providing real-time Black Swan Analysis and Market Peak Analysis to other agents within the Virtuals Protocol ecosystem. Built for high-throughput, with comprehensive monitoring, security, and error handling.

**Author:** Muhammad Bilal Motiwala  
**Project:** Black Swan  
**Version:** 1.0.0

## 🎯 Overview

The Black Swan ACP Service bridges market and financial analyses of Black Swan with the decentralized agent economy. Currently, it provides two specialized analysis services through the Agent Commerce Protocol, enabling autonomous agents to access real-time market intelligence for decision-making with a core focus on the sell-side.

### Key Features

- **🤖 Dual ACP Agent Implementation**: BlackSwan Analysis & Market Peak Analysis services
- **⚡ High-Performance Architecture**: Handles 100+ concurrent jobs with intelligent queuing
- **🔒 Enterprise Security**: Rate limiting, CORS, Helmet.js, and input validation
- **📊 Comprehensive Monitoring**: Real-time metrics, health checks, and structured logging
- **🔄 Intelligent Data Fetching**: Smart caching and API integration with Black Swan Platform
- **🛡️ Robust Error Handling**: Graceful degradation with detailed error reporting
- **🚀 Production Ready**: Docker support, PM2 configuration, and deployment scripts
- **📈 Service Analytics**: Performance tracking, job success rates, and usage metrics
- **🔧 Developer Experience**: Hot reload, comprehensive testing, and debug modes

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ACP Network   │    │   BlackSwan     │    │                 │
│   (Buyers)      │◄──►│   ACP Service   │◄──►│   Platform API  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Express       │
                       │   HTTP Server   │
                       │   (Monitoring)  │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Logging &     │
                       │   Metrics       │
                       │   System        │
                       └─────────────────┘
```

## 📋 Project Structure

```
blackswan-acp/
├── src/
│   └── index.js              # Main ACP service implementation
├── config/
│   ├── env.example          # Environment variables template
│   └── pm2.config.js        # PM2 process management
├── docker/
│   ├── Dockerfile           # Container configuration
│   └── docker-compose.yml   # Multi-service deployment
├── scripts/
│   ├── setup.sh            # Service setup script
│   ├── deploy.sh           # Deployment automation
│   └── health-check.sh     # Health monitoring script
├── logs/                   # Application logs directory
├── tests/
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── load/              # Load testing scripts
├── package.json           # Dependencies and scripts
├── .env.example          # Environment template
├── .gitignore           # Git ignore patterns
└── README.md            # This documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **ACP Agent Registration** on Virtuals Protocol
- **Black Swan Platform API** access

### Installation

1. **Clone and Setup**

   ```bash
   git clone <repository-url>
   cd blackswan-acp
   npm install
   ```

2. **Environment Configuration**

   ```bash
   # Copy the environment template
   cp .env.example .env

   # Edit with your actual values
   nano .env
   ```

   **Required Environment Variables:**

   ```env
   # ACP Agent Configuration
   WHITELISTED_WALLET_PRIVATE_KEY=0x1234567890abcdef...
   SELLER_AGENT_WALLET_ADDRESS=0xYourAgentWalletAddress
   SELLER_ENTITY_ID=123

   # API Integration
   BLACKSWAN_API_URL=http://localhost:3001

   # Service Configuration
   NODE_ENV=production
   PORT=3002
   SERVICE_NAME=blackswan-acp-service

   # Performance Tuning
   MAX_CONCURRENT_JOBS=100
   JOB_TIMEOUT=30000
   RATE_LIMIT_PER_MINUTE=60

   # Monitoring
   LOG_LEVEL=info
   ENABLE_METRICS=true
   ENABLE_HEALTH_CHECK=true
   ```

3. **Start the Service**

   ```bash
   # Production mode
   npm start

   # Development mode (with hot reload)
   npm run dev

   # Docker deployment
   npm run docker:build
   npm run docker:run
   ```

4. **Verify Installation**

   ```bash
   # Check service health
   curl http://localhost:3002/health

   # Get service information
   curl http://localhost:3002/info

   # View performance metrics
   curl http://localhost:3002/metrics
   ```

The service will start on **http://localhost:3002** and automatically register with the ACP network.

## 🔧 Configuration

### Environment Variables

| Variable                         | Required | Default                 | Description                           |
| -------------------------------- | -------- | ----------------------- | ------------------------------------- |
| **ACP Configuration**            |          |                         |                                       |
| `WHITELISTED_WALLET_PRIVATE_KEY` | **Yes**  | -                       | Private key for ACP agent wallet      |
| `SELLER_AGENT_WALLET_ADDRESS`    | **Yes**  | -                       | ACP agent wallet address              |
| `SELLER_ENTITY_ID`               | **Yes**  | -                       | ACP entity ID for agent registration  |
| **API Configuration**            |          |                         |                                       |
| `BLACKSWAN_API_URL`              | No       | `http://localhost:3001` | Black Swan Platform API base URL      |
| `API_TIMEOUT`                    | No       | `10000`                 | API request timeout (milliseconds)    |
| **Service Configuration**        |          |                         |                                       |
| `NODE_ENV`                       | No       | `development`           | Environment mode                      |
| `PORT`                           | No       | `3002`                  | Service HTTP port                     |
| `SERVICE_NAME`                   | No       | `blackswan-acp-service` | Service identifier                    |
| **Performance Tuning**           |          |                         |                                       |
| `MAX_CONCURRENT_JOBS`            | No       | `100`                   | Maximum concurrent ACP jobs           |
| `JOB_TIMEOUT`                    | No       | `30000`                 | Job execution timeout (milliseconds)  |
| `RATE_LIMIT_PER_MINUTE`          | No       | `60`                    | Rate limit per IP per minute          |
| **Monitoring & Logging**         |          |                         |                                       |
| `LOG_LEVEL`                      | No       | `info`                  | Logging level (debug/info/warn/error) |
| `ENABLE_METRICS`                 | No       | `true`                  | Enable Prometheus metrics collection  |
| `ENABLE_HEALTH_CHECK`            | No       | `true`                  | Enable health check endpoints         |

### Service Configuration

The service automatically detects which analysis type to provide based on:

1. **Service Name Matching**: Job offering service name
2. **Message Content Analysis**: Keywords like "black swan", "market peak"
3. **Default Fallback**: BlackSwan Analysis for ambiguous requests

## 📊 Service Offerings

### 1. BlackSwan Analysis Service

**Service Type**: `"Black Swan Analysis"`  
**Description**: Comprehensive black swan event probability analysis

#### Response Format

```json
{
  "service_type": "Black Swan Analysis",
  "score": 75,
  "analysis": "Current market conditions indicate elevated black swan probability due to...",
  "reasoning": [
    "Increased market volatility in crypto sectors",
    "Unusual correlation patterns between assets",
    "Elevated VIX levels suggesting market stress"
  ],
  "market_indicators": [
    "BTC dominance at 42.5%",
    "Fear & Greed Index: 25 (Extreme Fear)",
    "S&P 500 correlation: 0.85"
  ],
  "risk_factors": [
    "Regulatory uncertainty in major markets",
    "Macroeconomic policy shifts",
    "Geopolitical tensions affecting markets"
  ],
  "metadata": {
    "confidence": "high",
    "certainty": 0.87,
    "timestamp": 1703123456789,
    "last_run": "2024-01-15T10:30:00.000Z",
    "data_sources": ["market_data", "sentiment_analysis", "news_analysis"],
    "update_frequency": "5_minutes"
  }
}
```

### 2. Market Peak Analysis Service

**Service Type**: `"Market Peak Analysis"`  
**Description**: Market cycle peak detection and timing analysis

#### Response Format

```json
{
  "service_type": "Market Peak Analysis",
  "score": 42,
  "analysis": "Market momentum indicators suggest we are in mid-cycle phase with...",
  "reasoning": [
    "Bull market indicators showing moderate strength",
    "Trading volume patterns indicate sustained interest",
    "Technical indicators suggest continued upward potential"
  ],
  "key_factors": [
    "Bitcoin hash rate at all-time highs",
    "Institutional adoption increasing",
    "Regulatory clarity improving globally"
  ],
  "metadata": {
    "confidence": "medium",
    "certainty": 0.73,
    "timestamp": 1703123456789,
    "last_run": "2024-01-15T10:30:00.000Z",
    "data_sources": ["technical_analysis", "on_chain_data", "market_structure"],
    "update_frequency": "hourly"
  }
}
```

## 🔍 API Endpoints

### Health & Monitoring

#### `GET /health`

Comprehensive health check with detailed system status.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 86400,
  "service": {
    "name": "blackswan-acp-service",
    "version": "1.0.0",
    "environment": "production"
  },
  "acp": {
    "agent_registered": true,
    "entity_id": 123,
    "wallet_address": "0x1234...",
    "active_jobs": 5,
    "total_jobs_processed": 1247
  },
  "api": {
    "blackswan_api_responsive": true,
    "last_api_call": "2024-01-15T10:29:45.000Z",
    "api_response_time_ms": 245
  },
  "resources": {
    "memory_usage_mb": 156.7,
    "cpu_usage_percent": 12.3,
    "open_handles": 23
  },
  "errors": {
    "last_24h": 3,
    "last_hour": 0,
    "error_rate_percent": 0.24
  }
}
```

#### `GET /info`

Service information and capabilities.

**Response:**

```json
{
  "service": {
    "name": "BlackSwan ACP Service",
    "version": "1.0.0",
    "description": "Production-ready ACP service for BlackSwan and Market Peak analysis",
    "author": "OAIAO Labs Inc."
  },
  "capabilities": [
    {
      "service_type": "Black Swan Analysis",
      "endpoint": "/api/acp/1",
      "description": "Comprehensive black swan event probability analysis",
      "response_time_avg": "2.3s",
      "success_rate": "99.2%"
    },
    {
      "service_type": "Market Peak Analysis",
      "endpoint": "/api/acp/2",
      "description": "Market cycle peak detection and timing analysis",
      "response_time_avg": "1.8s",
      "success_rate": "99.5%"
    }
  ],
  "acp_config": {
    "entity_id": 123,
    "wallet_address": "0x1234...",
    "supported_networks": ["base"],
    "max_concurrent_jobs": 100
  },
  "api_integration": {
    "primary_api": "http://localhost:3001",
    "health_check_interval": "30s",
    "timeout_ms": 10000
  }
}
```

#### `GET /metrics`

Prometheus-compatible performance metrics.

**Response:**

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service_metrics": {
    "total_requests": 12470,
    "successful_requests": 12365,
    "failed_requests": 105,
    "average_response_time_ms": 2150,
    "requests_per_minute": 34.7
  },
  "acp_metrics": {
    "jobs_received": 1247,
    "jobs_completed": 1235,
    "jobs_failed": 12,
    "average_job_duration_ms": 2800,
    "active_jobs": 5,
    "job_success_rate": 99.04
  },
  "api_metrics": {
    "api_calls_total": 1250,
    "api_calls_successful": 1242,
    "api_calls_failed": 8,
    "average_api_response_time_ms": 245,
    "api_success_rate": 99.36
  },
  "resource_metrics": {
    "memory_usage_mb": 156.7,
    "memory_usage_percent": 15.2,
    "cpu_usage_percent": 12.3,
    "heap_used_mb": 98.4,
    "heap_total_mb": 134.2
  }
}
```

### Testing Endpoints

#### `GET /test/blackswan`

Test BlackSwan analysis endpoint with sample data.

#### `GET /test/marketpeak`

Test Market Peak analysis endpoint with sample data.

## 🛠️ Development

### Local Development

```bash
# Install dependencies
npm install

# Start with hot reload
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Install development tools
npm install -g nodemon pm2

# Setup development environment
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Testing

#### Unit Tests

```bash
# Run unit tests
npm run test:unit

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

#### Integration Tests

```bash
# Test ACP integration
npm run test:integration

# Test API endpoints
npm run test:api

# Test with real ACP network
npm run test:acp
```

#### Load Testing

```bash
# Basic load test
npm run test:load

# Stress test
npm run test:stress

# Concurrent jobs test
npm run test:concurrent
```

### Debugging

```bash
# Enable debug mode
export LOG_LEVEL=debug
npm run dev

# Debug ACP interactions
export DEBUG=acp:*
npm start

# Debug API calls
export DEBUG=api:*
npm start
```

## 🚀 Deployment

### Production Deployment

#### Option 1: Traditional Server

```bash
# Clone to production server
git clone <repository-url>
cd blackswan-acp
npm ci --production

# Configure environment
cp .env.example .env
# Edit .env with production values

# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

#### Option 2: Docker Deployment

```bash
# Build Docker image
docker build -t blackswan-acp:latest .

# Run with Docker Compose
docker-compose up -d

# Scale service
docker-compose up -d --scale blackswan-acp=3
```

#### Option 3: Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: blackswan-acp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: blackswan-acp
  template:
    metadata:
      labels:
        app: blackswan-acp
    spec:
      containers:
        - name: blackswan-acp
          image: blackswan-acp:latest
          ports:
            - containerPort: 3002
          env:
            - name: NODE_ENV
              value: "production"
            - name: WHITELISTED_WALLET_PRIVATE_KEY
              valueFrom:
                secretKeyRef:
                  name: acp-secrets
                  key: wallet-private-key
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy BlackSwan ACP Service

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          docker build -t blackswan-acp:${{ github.sha }} .
          docker push registry.example.com/blackswan-acp:${{ github.sha }}
```

## 📈 Monitoring & Observability

### Health Monitoring

```bash
# Automated health checks
*/5 * * * * curl -f http://localhost:3002/health || alert_team

# Monitor service metrics
watch -n 30 'curl -s http://localhost:3002/metrics | jq ".service_metrics"'

# Check ACP job queue
curl -s http://localhost:3002/metrics | jq ".acp_metrics.active_jobs"
```

### Log Monitoring

```bash
# View real-time logs
tail -f logs/blackswan-acp.log

# Filter error logs
grep "ERROR" logs/blackswan-acp.log | tail -20

# Monitor ACP activities
grep "ACP" logs/blackswan-acp.log | tail -50
```

### Performance Monitoring

#### Key Metrics to Monitor

| Metric                | Threshold | Alert Action           |
| --------------------- | --------- | ---------------------- |
| **Response Time**     | > 5s      | Scale up instances     |
| **Error Rate**        | > 5%      | Investigate errors     |
| **Memory Usage**      | > 80%     | Check for memory leaks |
| **CPU Usage**         | > 70%     | Scale up resources     |
| **Active ACP Jobs**   | > 90      | Increase job workers   |
| **API Response Time** | > 3s      | Check API health       |
| **Job Success Rate**  | < 95%     | Investigate failures   |

#### Prometheus Configuration

```yaml
# prometheus.yml
scrape_configs:
  - job_name: "blackswan-acp"
    static_configs:
      - targets: ["localhost:3002"]
    scrape_interval: 30s
    metrics_path: "/metrics"
```

#### Grafana Dashboard

Key panels to include:

- Request rate and response time
- ACP job processing metrics
- Error rate trends
- Resource utilization
- API dependency health

## 🔒 Security

### Security Features

1. **Input Validation**

   - Strict parameter validation for all endpoints
   - SQL injection prevention
   - XSS protection via Helmet.js

2. **Rate Limiting**

   - Configurable per-IP rate limits
   - ACP job queue limits
   - API request throttling

3. **Access Control**

   - CORS properly configured
   - Private key security
   - Environment variable validation

4. **Monitoring**
   - Security event logging
   - Failed request tracking
   - Anomaly detection

### Security Best Practices

```bash
# Regular security audits
npm audit

# Update dependencies
npm update

# Scan for vulnerabilities
npx audit-ci --high

# Monitor for suspicious activity
grep "SECURITY" logs/blackswan-acp.log
```

### Production Security Checklist

- [ ] Private keys stored securely (not in code)
- [ ] Environment variables properly configured
- [ ] HTTPS enabled for all external communications
- [ ] Rate limiting configured appropriately
- [ ] Security headers enabled via Helmet.js
- [ ] Input validation implemented for all endpoints
- [ ] Monitoring and alerting configured
- [ ] Regular security updates scheduled
- [ ] Access logs reviewed regularly

## 🐛 Troubleshooting

### Common Issues

#### 1. "Missing required environment variable"

```bash
# Check environment variables
env | grep -E "(WHITELISTED_WALLET|SELLER_AGENT|SELLER_ENTITY)"

# Verify .env file
cat .env | grep -v "^#" | grep -v "^$"
```

#### 2. "ACP Agent initialization failed"

```bash
# Verify agent registration
curl -s "https://api.virtuals.io/agent/123" | jq

# Check wallet balance
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0xYourWallet","latest"],"id":1}' \
  https://base-mainnet.g.alchemy.com/v2/your-key
```

#### 3. "Unable to fetch analysis data"

```bash
# Test Black Swan Platform API connectivity
curl -v http://localhost:3001/api/acp/1

# Check service logs
tail -f logs/blackswan-acp.log | grep "API"

# Verify API endpoint configuration
echo $BLACKSWAN_API_URL
```

#### 4. "High memory usage"

```bash
# Check memory leaks
node --inspect src/index.js

# Monitor memory over time
watch -n 10 'ps aux | grep "node.*index.js"'

# Enable heap profiling
node --max-old-space-size=4096 --inspect src/index.js
```

#### 5. "ACP jobs timing out"

```bash
# Check job queue status
curl -s http://localhost:3002/metrics | jq ".acp_metrics"

# Monitor job processing
tail -f logs/blackswan-acp.log | grep "JOB"

# Adjust job timeout
export JOB_TIMEOUT=60000
```

### Debug Commands

```bash
# Test individual components
node -e "
const AcpClient = require('./src/index.js');
console.log('ACP Client loaded successfully');
"

# Validate environment
node -e "
require('dotenv').config();
console.log('Environment variables:');
console.log('SELLER_ENTITY_ID:', process.env.SELLER_ENTITY_ID);
console.log('API URL:', process.env.BLACKSWAN_API_URL);
"

# Test API connectivity
curl -w "@curl-format.txt" -s -o /dev/null http://localhost:3002/health
```

### Performance Diagnostics

```bash
# Profile application performance
node --prof src/index.js

# Generate profile report
node --prof-process isolate-*.log > profile.txt

# Memory heap dump
node --inspect --inspect-brk src/index.js
# Connect Chrome DevTools to analyze memory

# CPU profiling
node --cpu-prof src/index.js
```

## 📚 API Reference

### ACP Integration

#### Job Processing Flow

1. **Job Received**: ACP network sends job request
2. **Service Detection**: Determine analysis type from request
3. **Data Fetching**: Retrieve latest analysis from Black Swan Platform API
4. **Response Generation**: Format response according to service type
5. **Job Completion**: Return structured analysis data

#### Response Schema

```typescript
interface AnalysisResponse {
  service_type: "Black Swan Analysis" | "Market Peak Analysis";
  score: number;
  analysis: string;
  reasoning: string[];
  metadata: {
    confidence: "low" | "medium" | "high" | "very high";
    certainty: number; // 0.0 - 1.0
    timestamp: number;
    last_run: string;
    data_sources?: string[];
    update_frequency?: string;
  };
  // Additional fields based on service type
  market_indicators?: string[]; // BlackSwan only
  risk_factors?: string[]; // BlackSwan only
  key_factors?: string[]; // MarketPeak only
}
```

### Error Handling

#### Standard Error Response

```json
{
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "Unable to fetch analysis data",
    "details": "API endpoint temporarily unavailable",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "retry_after": 30
  }
}
```

#### Error Codes

| Code                  | Description                  | Action                   |
| --------------------- | ---------------------------- | ------------------------ |
| `INVALID_REQUEST`     | Malformed job request        | Check request format     |
| `SERVICE_UNAVAILABLE` | Analysis service unavailable | Retry after delay        |
| `API_TIMEOUT`         | External API request timeout | Increase timeout/retry   |
| `RATE_LIMITED`        | Too many requests            | Reduce request frequency |
| `INTERNAL_ERROR`      | Unexpected server error      | Contact support          |

## 🤝 Contributing

### Development Workflow

1. **Fork Repository**: Create your own fork
2. **Create Branch**: `git checkout -b feature/your-feature`
3. **Development**: Make your changes with tests
4. **Test Suite**: `npm test && npm run lint`
5. **Documentation**: Update README and inline docs
6. **Pull Request**: Submit with detailed description

### Code Standards

#### Code Style

- **ESLint**: Follow project linting configuration
- **Comments**: JSDoc for all public functions
- **Error Handling**: Always handle errors gracefully
- **Logging**: Use structured logging with appropriate levels
- **Security**: Never expose sensitive data in logs

#### Testing Requirements

```bash
# Unit tests for new functions
npm run test:unit

# Integration tests for API endpoints
npm run test:integration

# Load testing for performance features
npm run test:load

# Security testing
npm run test:security
```

#### Documentation Standards

- Update README for new features
- Add inline code documentation
- Update API documentation
- Include troubleshooting steps
- Provide configuration examples

### Contribution Guidelines

- **Bug Reports**: Include reproduction steps and environment details
- **Feature Requests**: Describe use case and expected behavior
- **Code Contributions**: Follow code standards and include tests
- **Documentation**: Keep documentation current and comprehensive

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author & Organization

**OAIAO Labs Inc.**

- GitHub: [@oaiaolabs](https://github.com/oaiaolabs)
- Website: [oaiaolabs.com](https://oaiaolabs.com)
- Email: [contact@oaiaolabs.com](mailto:contact@oaiaolabs.com)

## 🆘 Support

### Getting Help

1. **Documentation**: Review this README and inline code comments
2. **Health Checks**: Use `/health` and `/metrics` endpoints for diagnostics
3. **Logs**: Check service logs for detailed error information
4. **Testing**: Use test endpoints to validate functionality
5. **GitHub Issues**: Create an issue for bugs or feature requests

### Community Resources

- **Virtuals Protocol Documentation**: [docs.virtuals.io](https://docs.virtuals.io)
- **ACP Builder's Guide**: [ACP Tech Playbook](https://whitepaper.virtuals.io/info-hub/builders-hub/agent-commerce-protocol-acp-builder-guide/acp-tech-playbook)
- **Discord Community**: [Discord](https://discord.gg/virtuals)
- **GitHub Discussions**: [Repository Discussions](https://github.com/your-org/blackswan-acp-service/discussions)

### Professional Support

For enterprise deployments and professional support:

- **Enterprise Support**: [enterprise@oaiaolabs.com](mailto:enterprise@oaiaolabs.com)
- **Custom Development**: [dev@oaiaolabs.com](mailto:dev@oaiaolabs.com)
- **Training & Consulting**: [consulting@oaiaolabs.com](mailto:consulting@oaiaolabs.com)

---

**⚠️ Important Production Notes:**

- **Security**: Keep private keys secure and never commit them to version control
- **Monitoring**: Set up comprehensive monitoring and alerting for production deployments
- **Scaling**: Configure appropriate resource limits and auto-scaling policies
- **Updates**: Keep dependencies updated and monitor security advisories
- **Backup**: Implement proper backup strategies for configuration and logs
- **Testing**: Always test in staging environment before production deployment

**🚀 Ready to serve the agent economy!**
