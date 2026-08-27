import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello from Acquisitions!');
});

export default app;


// import express from 'express';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';

// import logger from '#config/logger.js';
// import securityMiddleware from '#middleware/security.middleware.js';
// import authRoutes from '#routes/auth.routes.js';
// import usersRoutes from '#routes/users.routes.js';

// const app = express();

// // Global Middlewares
// app.use(helmet());
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // Request Logging via Morgan & Winston
// app.use(
//   morgan('combined', {
//     stream: { write: message => logger.info(message.trim()) },
//   })
// );

// // Security Middleware (e.g., Arcjet / Rate Limiting)
// app.use(securityMiddleware);

// // Base Routes
// app.get('/', (req, res) => {
//   logger.info('Hello from Acquisitions!');
//   res.status(200).send('Hello from Acquisitions!');
// });

// app.get('/health', (req, res) => {
//   res.status(200).json({
//     status: 'OK',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//   });
// });

// app.get('/api', (req, res) => {
//   res.status(200).json({ message: 'Acquisitions API is running!' });
// });

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', usersRoutes);

// // 404 Catch-All Handler
// app.use((req, res) => {
//   res.status(404).json({ error: 'Route not found' });
// });

// export default app;