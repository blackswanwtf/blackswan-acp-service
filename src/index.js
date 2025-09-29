/*
 * BLACKSWAN ACP SERVICE
 * ====================
 *
 * Production-ready scalable service providing Black Swan and Market Peak analysis
 * via Agent Commerce Protocol (ACP). Handles multiple concurrent requests with
 * proper error handling, logging, and monitoring.
 *
 * Features:
 * - Scalable ACP agent implementation
 * - Multiple service offerings (Black Swan & Market Peak Analysis)
 * - Comprehensive logging and monitoring
 * - Health checks and metrics
 * - Rate limiting and security
 * - Graceful error handling
 * - Hot reload support for development
 *
 * Author: Muhammad Bilal Motiwala
 * Project: Black Swan
 * Version: 1.0.0
 * License: MIT
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const axios = require("axios");

// ACP SDK Import - using relative path to local package
const AcpClient = require("../../acp-node/dist/index.js").default;
const {
  AcpContractClient,
  AcpJobPhases,
} = require("../../acp-node/dist/index.js");

// =================================
// CONFIGURATION & ENVIRONMENT
// =================================

const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT) || 3002,
  SERVICE_NAME: process.env.SERVICE_NAME || "blackswan-acp-service",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  // ACP Configuration
  WHITELISTED_WALLET_PRIVATE_KEY: process.env.WHITELISTED_WALLET_PRIVATE_KEY,
  SELLER_AGENT_WALLET_ADDRESS: process.env.SELLER_AGENT_WALLET_ADDRESS,
  SELLER_ENTITY_ID: parseInt(process.env.SELLER_ENTITY_ID),

  // API Configuration
  BLACKSWAN_API_URL: process.env.BLACKSWAN_API_URL || "http://localhost:3001",
  API_TIMEOUT: parseInt(process.env.API_TIMEOUT) || 10000,

  // Service Settings
  MAX_CONCURRENT_JOBS: parseInt(process.env.MAX_CONCURRENT_JOBS) || 100,
  JOB_TIMEOUT: parseInt(process.env.JOB_TIMEOUT) || 30000,
  RATE_LIMIT_PER_MINUTE: parseInt(process.env.RATE_LIMIT_PER_MINUTE) || 60,

  // Monitoring
  ENABLE_METRICS: process.env.ENABLE_METRICS === "true",
  ENABLE_HEALTH_CHECK: process.env.ENABLE_HEALTH_CHECK !== "false",
};

// Validate required environment variables
const requiredEnvVars = [
  "WHITELISTED_WALLET_PRIVATE_KEY",
  "SELLER_AGENT_WALLET_ADDRESS",
  "SELLER_ENTITY_ID",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    console.error(
      "💡 Please check your .env file and ensure all required variables are set"
    );
    process.exit(1);
  }
}

// =================================
// SERVICE DEFINITIONS
// =================================

const SERVICES = {
  BLACK_SWAN: "Black Swan Analysis",
  MARKET_PEAK: "Market Peak Analysis",
};

const SERVICE_ENDPOINTS = {
  [SERVICES.BLACK_SWAN]: "/api/acp/1",
  [SERVICES.MARKET_PEAK]: "/api/acp/2",
};

// =================================
// LOGGING SYSTEM
// =================================

const Logger = {
  info: (message, ...args) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] ${message}`, ...args);
  },

  error: (message, ...args) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] ${message}`, ...args);
  },

  warn: (message, ...args) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] ${message}`, ...args);
  },

  debug: (message, ...args) => {
    if (CONFIG.LOG_LEVEL === "debug") {
      const timestamp = new Date().toISOString();
      console.debug(`[${timestamp}] [DEBUG] ${message}`, ...args);
    }
  },
};

// =================================
// METRICS & MONITORING
// =================================

const Metrics = {
  jobsProcessed: 0,
  jobsSuccessful: 0,
  jobsFailed: 0,
  activeJobs: 0,
  startTime: Date.now(),

  incrementJobsProcessed: () => Metrics.jobsProcessed++,
  incrementJobsSuccessful: () => Metrics.jobsSuccessful++,
  incrementJobsFailed: () => Metrics.jobsFailed++,
  incrementActiveJobs: () => Metrics.activeJobs++,
  decrementActiveJobs: () =>
    (Metrics.activeJobs = Math.max(0, Metrics.activeJobs - 1)),

  getStats: () => ({
    uptime: Date.now() - Metrics.startTime,
    jobs: {
      processed: Metrics.jobsProcessed,
      successful: Metrics.jobsSuccessful,
      failed: Metrics.jobsFailed,
      active: Metrics.activeJobs,
      successRate:
        Metrics.jobsProcessed > 0
          ? ((Metrics.jobsSuccessful / Metrics.jobsProcessed) * 100).toFixed(
              2
            ) + "%"
          : "0%",
    },
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  }),
};

// =================================
// ANALYSIS SERVICE FUNCTIONS
// =================================

/**
 * Detects which service is being requested based on the service requirement
 */
function detectRequestedService(serviceRequirement) {
  Logger.debug("Analyzing service requirement:", serviceRequirement);

  if (typeof serviceRequirement === "string") {
    const req = serviceRequirement.toLowerCase();
    if (req.includes("black") && req.includes("swan")) {
      return SERVICES.BLACK_SWAN;
    } else if (req.includes("market") && req.includes("peak")) {
      return SERVICES.MARKET_PEAK;
    } else if (req.includes("peak")) {
      return SERVICES.MARKET_PEAK;
    }
  } else if (serviceRequirement && typeof serviceRequirement === "object") {
    const serviceName = serviceRequirement.serviceName || "";
    if (serviceName === SERVICES.BLACK_SWAN) {
      return SERVICES.BLACK_SWAN;
    } else if (serviceName === SERVICES.MARKET_PEAK) {
      return SERVICES.MARKET_PEAK;
    }

    // Fallback to message analysis
    const message = serviceRequirement.message || "";
    if (
      message.toLowerCase().includes("black") &&
      message.toLowerCase().includes("swan")
    ) {
      return SERVICES.BLACK_SWAN;
    } else if (
      message.toLowerCase().includes("market") &&
      message.toLowerCase().includes("peak")
    ) {
      return SERVICES.MARKET_PEAK;
    }
  }

  // Default to Black Swan Analysis
  return SERVICES.BLACK_SWAN;
}

/**
 * Fetches analysis data from the Black Swan API
 */
async function fetchAnalysisData(serviceType) {
  const endpoint = SERVICE_ENDPOINTS[serviceType];
  if (!endpoint) {
    throw new Error(`Unknown service type: ${serviceType}`);
  }

  const url = `${CONFIG.BLACKSWAN_API_URL}${endpoint}`;
  Logger.info(`🔍 Fetching ${serviceType} from ${url}`);

  try {
    const response = await axios.get(url, {
      timeout: CONFIG.API_TIMEOUT,
      headers: {
        "User-Agent": `${CONFIG.SERVICE_NAME}/1.0.0`,
        Accept: "application/json",
      },
    });

    if (response.status === 200) {
      Logger.info(`✅ Successfully fetched ${serviceType} data`);
      return response.data;
    } else {
      throw new Error(`API returned status ${response.status}`);
    }
  } catch (error) {
    Logger.error(`❌ Error fetching ${serviceType}:`, error.message);
    throw error;
  }
}

/**
 * Formats Black Swan Analysis data as structured JSON
 */
function formatBlackSwanAnalysis(analysisData) {
  return {
    service_type: "Black Swan Analysis",
    score: analysisData.score || 0,
    analysis: analysisData.analysis || "No analysis available",
    reasoning: analysisData.reasoning || [],
    market_indicators: analysisData.currentMarketIndicators || [],
    risk_factors: analysisData.primaryRiskFactors || [],
    metadata: {
      confidence: analysisData.confidence || "unknown",
      certainty: analysisData.certainty || 0,
      timestamp: analysisData.timestamp || Date.now(),
      last_run: analysisData.lastRun || new Date().toISOString(),
      cache_last_update:
        analysisData.metadata?.cacheLastUpdate || new Date().toISOString(),
    },
  };
}

/**
 * Formats Market Peak Analysis data as structured JSON
 */
function formatMarketPeakAnalysis(analysisData) {
  return {
    service_type: "Market Peak Analysis",
    score: analysisData.score || 0,
    analysis: analysisData.analysis || "No analysis available",
    reasoning: analysisData.reasoning || [],
    key_factors: analysisData.keyFactors || [],
    metadata: {
      confidence: analysisData.confidence || "unknown",
      certainty: analysisData.certainty || 0,
      timestamp: analysisData.timestamp || Date.now(),
      last_run: analysisData.lastRun || new Date().toISOString(),
      cache_last_update:
        analysisData.metadata?.cacheLastUpdate || new Date().toISOString(),
    },
  };
}

/**
 * Formats analysis data for delivery based on service type
 */
function formatAnalysisDelivery(serviceType, analysisData) {
  let formattedData;

  if (serviceType === SERVICES.BLACK_SWAN) {
    formattedData = formatBlackSwanAnalysis(analysisData);
  } else if (serviceType === SERVICES.MARKET_PEAK) {
    formattedData = formatMarketPeakAnalysis(analysisData);
  } else {
    throw new Error(`Unknown service type for formatting: ${serviceType}`);
  }

  return JSON.stringify(formattedData, null, 2);
}

// =================================
// ACP AGENT IMPLEMENTATION
// =================================

let acpClient = null;
let isServiceReady = false;

/**
 * Initializes the ACP client and starts the agent
 */
async function initializeAcpAgent() {
  try {
    Logger.info("🚀 Initializing BlackSwan ACP Agent...");

    // Build ACP contract client
    const acpContractClient = await AcpContractClient.build(
      CONFIG.WHITELISTED_WALLET_PRIVATE_KEY,
      CONFIG.SELLER_ENTITY_ID,
      CONFIG.SELLER_AGENT_WALLET_ADDRESS
    );

    // Create ACP client with event handlers
    acpClient = new AcpClient({
      acpContractClient,

      // Handle new tasks (job requests)
      onNewTask: async (job) => {
        await handleJobRequest(job);
      },
    });

    isServiceReady = true;
    Logger.info("✅ BlackSwan ACP Agent initialized successfully");
    Logger.info(`📋 Agent Address: ${CONFIG.SELLER_AGENT_WALLET_ADDRESS}`);
    Logger.info(`🆔 Entity ID: ${CONFIG.SELLER_ENTITY_ID}`);
    Logger.info(`🎯 Services: ${Object.values(SERVICES).join(", ")}`);
  } catch (error) {
    Logger.error("❌ Failed to initialize ACP Agent:", error.message);
    throw error;
  }
}

/**
 * Handles incoming job requests from the ACP network
 */
async function handleJobRequest(job) {
  const jobId = job.id;
  Logger.info(`📨 Received job request: ${jobId} (Phase: ${job.phase})`);

  try {
    Metrics.incrementActiveJobs();

    // Handle negotiation phase
    if (
      job.phase === AcpJobPhases.REQUEST &&
      job.memos.find((m) => m.nextPhase === AcpJobPhases.NEGOTIATION)
    ) {
      Logger.info(`🤝 Responding to job ${jobId} in negotiation phase`);
      await job.respond(true);
      Logger.info(`✅ Job ${jobId} response sent`);
    }

    // Handle delivery phase
    else if (
      job.phase === AcpJobPhases.TRANSACTION &&
      job.memos.find((m) => m.nextPhase === AcpJobPhases.EVALUATION)
    ) {
      Logger.info(`📦 Processing job ${jobId} for delivery`);

      // Detect requested service
      const serviceReq = job.serviceRequirement;
      const requestedService = detectRequestedService(serviceReq);

      Logger.info(`🎯 Service requested: ${requestedService}`);
      Metrics.incrementJobsProcessed();

      // Set job timeout
      const jobTimeout = setTimeout(() => {
        Logger.error(`⏰ Job ${jobId} timed out after ${CONFIG.JOB_TIMEOUT}ms`);
        Metrics.incrementJobsFailed();
        Metrics.decrementActiveJobs();
      }, CONFIG.JOB_TIMEOUT);

      try {
        // Fetch analysis data
        const analysisData = await fetchAnalysisData(requestedService);

        // Format response as JSON
        const formattedAnalysis = formatAnalysisDelivery(
          requestedService,
          analysisData
        );

        // Deliver the analysis
        await job.deliver({
          type: "text",
          value: formattedAnalysis,
        });

        clearTimeout(jobTimeout);
        Metrics.incrementJobsSuccessful();
        Logger.info(
          `✅ Job ${jobId} delivered successfully: ${requestedService}`
        );
      } catch (error) {
        clearTimeout(jobTimeout);
        Metrics.incrementJobsFailed();

        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        Logger.error(`❌ Error processing job ${jobId}:`, errorMessage);

        // Deliver error response
        try {
          await job.deliver({
            type: "text",
            value: JSON.stringify(
              {
                service_type: requestedService,
                error: true,
                message: `Unable to fetch analysis data: ${errorMessage}. Please try again later.`,
                timestamp: new Date().toISOString(),
              },
              null,
              2
            ),
          });
        } catch (deliveryError) {
          Logger.error(
            `❌ Failed to deliver error response for job ${jobId}:`,
            deliveryError.message
          );
        }
      }
    }
  } catch (error) {
    Metrics.incrementJobsFailed();
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    Logger.error(`❌ Error handling job ${jobId}:`, errorMessage);
  } finally {
    Metrics.decrementActiveJobs();
  }
}

// =================================
// EXPRESS SERVER SETUP
// =================================

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// CORS configuration
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  })
);

// Compression and parsing
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: CONFIG.RATE_LIMIT_PER_MINUTE,
  message: {
    error: "Too many requests",
    message: "Rate limit exceeded. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
  Logger.debug(`${req.method} ${req.path} from ${req.ip}`);
  next();
});

// =================================
// API ROUTES
// =================================

// Health check endpoint
app.get("/health", (req, res) => {
  const health = {
    status: isServiceReady ? "healthy" : "initializing",
    timestamp: new Date().toISOString(),
    service: CONFIG.SERVICE_NAME,
    version: "1.0.0",
    acp: {
      agent_address: CONFIG.SELLER_AGENT_WALLET_ADDRESS,
      entity_id: CONFIG.SELLER_ENTITY_ID,
      ready: isServiceReady,
    },
    api: {
      platform_url: CONFIG.BLACKSWAN_API_URL,
      timeout: CONFIG.API_TIMEOUT,
    },
  };

  res.status(isServiceReady ? 200 : 503).json(health);
});

// Metrics endpoint (if enabled)
if (CONFIG.ENABLE_METRICS) {
  app.get("/metrics", (req, res) => {
    res.json(Metrics.getStats());
  });
}

// Service info endpoint
app.get("/info", (req, res) => {
  res.json({
    name: CONFIG.SERVICE_NAME,
    description: "BlackSwan Analysis ACP Agent Service",
    version: "1.0.0",
    services: Object.values(SERVICES),
    endpoints: SERVICE_ENDPOINTS,
    capabilities: [
      "Black Swan Analysis with score/100, analysis, reasoning, market indicators, and risk factors",
      "Market Peak Analysis with score/100, analysis, reasoning, and key factors",
      "Real-time ACP job processing",
      "Structured JSON responses",
      "Concurrent job handling",
      "Comprehensive error handling",
    ],
    documentation: "https://github.com/your-org/blackswan-acp-service",
  });
});

// Test endpoints for manual testing
app.get("/test/blackswan", async (req, res) => {
  try {
    const analysisData = await fetchAnalysisData(SERVICES.BLACK_SWAN);
    const formatted = formatAnalysisDelivery(SERVICES.BLACK_SWAN, analysisData);
    res.json(JSON.parse(formatted));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/test/marketpeak", async (req, res) => {
  try {
    const analysisData = await fetchAnalysisData(SERVICES.MARKET_PEAK);
    const formatted = formatAnalysisDelivery(
      SERVICES.MARKET_PEAK,
      analysisData
    );
    res.json(JSON.parse(formatted));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource was not found",
    availableEndpoints: [
      "/health",
      "/info",
      "/metrics",
      "/test/blackswan",
      "/test/marketpeak",
    ],
  });
});

// Global error handler
app.use((error, req, res, next) => {
  Logger.error("Unhandled error:", error);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      CONFIG.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// =================================
// STARTUP & SHUTDOWN HANDLING
// =================================

/**
 * Starts the BlackSwan ACP service
 */
async function startService() {
  try {
    Logger.info("🚀 Starting BlackSwan ACP Service...");
    Logger.info(`📍 Environment: ${CONFIG.NODE_ENV}`);
    Logger.info(`🌐 Port: ${CONFIG.PORT}`);

    // Initialize ACP agent
    await initializeAcpAgent();

    // Start HTTP server
    const server = app.listen(CONFIG.PORT, () => {
      Logger.info(`✅ BlackSwan ACP Service running on port ${CONFIG.PORT}`);
      Logger.info(`🔗 Health check: http://localhost:${CONFIG.PORT}/health`);
      Logger.info(`📊 Service info: http://localhost:${CONFIG.PORT}/info`);
      if (CONFIG.ENABLE_METRICS) {
        Logger.info(`📈 Metrics: http://localhost:${CONFIG.PORT}/metrics`);
      }
      Logger.info("🎯 Ready to handle ACP jobs!");
    });

    // Graceful shutdown handling
    process.on("SIGTERM", () => gracefulShutdown(server));
    process.on("SIGINT", () => gracefulShutdown(server));
    process.on("uncaughtException", (error) => {
      Logger.error("Uncaught Exception:", error);
      gracefulShutdown(server);
    });
    process.on("unhandledRejection", (reason, promise) => {
      Logger.error("Unhandled Rejection at:", promise, "reason:", reason);
      gracefulShutdown(server);
    });
  } catch (error) {
    Logger.error("❌ Failed to start service:", error.message);
    process.exit(1);
  }
}

/**
 * Gracefully shuts down the service
 */
function gracefulShutdown(server) {
  Logger.info("🛑 Received shutdown signal, gracefully closing...");

  server.close(() => {
    Logger.info("✅ HTTP server closed");

    // Add any cleanup logic here
    if (acpClient) {
      Logger.info("🔌 Disconnecting ACP client...");
      // Add ACP client cleanup if needed
    }

    Logger.info("👋 Service shutdown complete");
    process.exit(0);
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    Logger.error("❌ Forced shutdown after timeout");
    process.exit(1);
  }, 30000);
}

// =================================
// START THE SERVICE
// =================================

if (require.main === module) {
  startService().catch((error) => {
    Logger.error("❌ Service startup failed:", error);
    process.exit(1);
  });
}

module.exports = {
  app,
  startService,
  CONFIG,
  SERVICES,
  Logger,
  Metrics,
};
