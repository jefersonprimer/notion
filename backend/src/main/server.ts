import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { userRouter } from '../presentation/routes/userRouter';
import { noteRouter } from '../presentation/routes/noteRouter';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins - adjust for production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
}));
app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/notes', noteRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
