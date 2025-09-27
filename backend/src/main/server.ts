import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { userRouter } from '../presentation/routes/userRouter';
import { noteRouter } from '../presentation/routes/noteRouter';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRouter);
app.use('/api/notes', noteRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
