# BlackSwan ACP Service

🚀 **Production-ready scalable service providing Black Swan and Market Peak analysis via Agent Commerce Protocol (ACP)**

## Features

- ✅ **Scalable ACP Agent Implementation** - Handles multiple concurrent requests
- ✅ **Dual Service Offerings** - Black Swan Analysis & Market Peak Analysis
- ✅ **Structured JSON Responses** - Properly formatted analysis data
- ✅ **Comprehensive Monitoring** - Health checks, metrics, and logging
- ✅ **Security & Rate Limiting** - Production-ready security measures
- ✅ **Graceful Error Handling** - Robust error recovery and reporting
- ✅ **Hot Reload Development** - Fast development iteration

## Quick Start

### 1. Installation

```bash
cd blackswan-acp
npm install
```

### 2. Environment Setup

```bash
# Copy the environment template
cp env.example .env

# Edit .env with your actual values
nano .env
```

**Required Environment Variables:**

```env
WHITELISTED_WALLET_PRIVATE_KEY=0x...
SELLER_AGENT_WALLET_ADDRESS=0x...
SELLER_ENTITY_ID=123
```

### 3. Start the Service

```bash
# Production mode
npm start

# Development mode (with hot reload)
npm run dev
```

The service will start on **http://localhost:3002**

## API Endpoints

| Endpoint               | Description                          |
| ---------------------- | ------------------------------------ |
| `GET /health`          | Service health check                 |
| `GET /info`            | Service information and capabilities |
| `GET /metrics`         | Performance metrics and statistics   |
| `GET /test/blackswan`  | Test Black Swan analysis endpoint    |
| `GET /test/marketpeak` | Test Market Peak analysis endpoint   |

## Service Offerings

### 1. Black Swan Analysis

- **Score**: 0-100 scale
- **Analysis**: Detailed text analysis
- **Reasoning**: Array of reasoning factors
- **Market Indicators**: Current market indicators
- **Risk Factors**: Primary risk factors
- **Metadata**: Confidence, certainty, timestamps

### 2. Market Peak Analysis

- **Score**: 0-100 scale
- **Analysis**: Detailed text analysis
- **Reasoning**: Array of reasoning factors
- **Key Factors**: Market peak factors
- **Metadata**: Confidence, certainty, timestamps

## JSON Response Format

### Black Swan Analysis

```json
{
  "service_type": "Black Swan Analysis",
  "score": 75,
  "analysis": "Current market conditions show...",
  "reasoning": ["Factor 1", "Factor 2"],
  "market_indicators": ["Indicator 1", "Indicator 2"],
  "risk_factors": ["Risk 1", "Risk 2"],
  "metadata": {
    "confidence": "high",
    "certainty": 0.85,
    "timestamp": 1703123456789,
    "last_run": "2024-01-01T12:00:00.000Z"
  }
}
```

### Market Peak Analysis

```json
{
  "service_type": "Market Peak Analysis",
  "score": 42,
  "analysis": "Market momentum indicators suggest...",
  "reasoning": ["Factor 1", "Factor 2"],
  "key_factors": ["Factor 1", "Factor 2"],
  "metadata": {
    "confidence": "medium",
    "certainty": 0.72,
    "timestamp": 1703123456789,
    "last_run": "2024-01-01T12:00:00.000Z"
  }
}
```

## Configuration

### Environment Variables

| Variable                         | Required | Default                 | Description                         |
| -------------------------------- | -------- | ----------------------- | ----------------------------------- |
| `NODE_ENV`                       | No       | `development`           | Environment mode                    |
| `PORT`                           | No       | `3002`                  | Service port                        |
| `WHITELISTED_WALLET_PRIVATE_KEY` | **Yes**  | -                       | Your whitelisted wallet private key |
| `SELLER_AGENT_WALLET_ADDRESS`    | **Yes**  | -                       | Your seller agent wallet address    |
| `SELLER_ENTITY_ID`               | **Yes**  | -                       | Your seller entity ID               |
| `VOUAI_API_URL`                  | No       | `http://localhost:3001` | VouAI Platform API URL              |
| `MAX_CONCURRENT_JOBS`            | No       | `100`                   | Maximum concurrent jobs             |
| `RATE_LIMIT_PER_MINUTE`          | No       | `60`                    | Rate limit per IP per minute        |

### Service Configuration

The service automatically detects which analysis type is requested based on:

- Service name in job offering
- Message content keywords ("black swan", "market peak")
- Default fallback to Black Swan Analysis

## Monitoring & Health Checks

### Health Check

```bash
curl http://localhost:3002/health
```

### Service Metrics

```bash
curl http://localhost:3002/metrics
```

### Service Information

```bash
curl http://localhost:3002/info
```

## Testing

### Test Black Swan Analysis

```bash
curl http://localhost:3002/test/blackswan
```

### Test Market Peak Analysis

```bash
curl http://localhost:3002/test/marketpeak
```

### Test with ACP Buyer

Use the existing buyer client from `../acp-node/examples/acp-base/self-evaluation/`:

```bash
# In another terminal
cd ../acp-node/examples/acp-base/self-evaluation
npx tsx buyer.ts
```

## Development

### Scripts

```bash
npm start          # Start production service
npm run dev        # Start with hot reload
npm run health     # Check service health
npm run info       # Get service info
npm run metrics    # Get service metrics
npm run lint       # Run linting
npm run lint:fix   # Fix linting issues
```

### Logs

The service provides comprehensive logging:

- Request/response logging
- Job processing logs
- Error tracking
- Performance metrics

## Deployment

### Local Deployment

```bash
npm start
```

### Docker Deployment

```bash
npm run docker:build
npm run docker:run
```

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   ACP Network   │◄──►│  BlackSwan ACP   │◄──►│   VouAI API     │
│   (Buyers)      │    │    Service       │    │  (Analysis)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  Express Server  │
                       │ (Health/Metrics) │
                       └──────────────────┘
```

## Troubleshooting

### Common Issues

1. **"Missing required environment variable"**

   - Check your `.env` file has all required variables
   - Ensure private key is in hex format (starts with 0x)

2. **"ACP Agent initialization failed"**

   - Verify your agent is registered in the Service Registry
   - Check entity ID and wallet address are correct

3. **"Unable to fetch analysis data"**
   - Ensure VouAI Platform API is running
   - Check `VOUAI_API_URL` configuration

### Debug Mode

Set `LOG_LEVEL=debug` in your `.env` file for detailed logging.

## Support

- 📧 **Issues**: [GitHub Issues](https://github.com/your-org/blackswan-acp-service/issues)
- 📖 **Documentation**: [ACP Builder's Guide](https://whitepaper.virtuals.io/info-hub/builders-hub/agent-commerce-protocol-acp-builder-guide/acp-tech-playbook)
- 💬 **Community**: [Discord](https://discord.gg/virtuals)

## License

MIT License - see [LICENSE](LICENSE) file for details.
