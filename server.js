// API Documentation 
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from 'swagger-jsdoc';

// Import statements
import express from "express";
import 'express-async-errors';
import dotenv from "dotenv";
import colors from 'colors';
import cors from 'cors';
import morgan from "morgan";
import connectDB from "./config/db.js";

// Security
import helmet from "helmet";
import xss from 'xss-clean';
import mongoSanitize from "express-mongo-sanitize";

// Routers import
import authRouters from './routers/authRouters.js';
import testRouters from './routers/testRoutes.js';
import errorMiddleware from "./middlewares/errorMiddleware.js";
import userRoutes from './routers/userRoutes.js';
import jobsRoutes from './routers/jobsRoutes.js';

// dotenv config
dotenv.config();

// MongoDB connection
connectDB();

// Swagger API config
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Job Portal",
            description: "Node Express.js job portal",
        },
        servers: [{
            url: "http://localhost:8080",
        }],
    },
    apis: ["./routers/*.js"],
};

const spec = swaggerDoc(options);

// Create an express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// Routes
app.use('/api/v1/test', testRouters);
app.use('/api/v1/auth', authRouters);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobsRoutes);

// Swagger documentation route
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

// Error handling middleware
app.use(errorMiddleware);

// Port
const PORT = process.env.PORT || 8080;

// Listen
app.listen(PORT, () => {
    console.log(`Node server running in ${process.env.DEV_MODE} Mode on port ${PORT}`.bgCyan.white);
});
