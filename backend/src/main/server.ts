import 'dotenv/config';
import express from 'express';
import { userRouter } from '../presentation/routes/userRoutes'; // Ajuste o import aqui
import { noteRouter } from '../presentation/routes/noteRoutes'; // Importe a nova rota

const app = express();
const PORT = process.env.PORT || 3333;

// Routes
app.use('/api', userRouter);

// Adicione as rotas de notas, também sob o prefixo /api
app.use('/api', noteRouter);

// Middlewares
app.use(express.json());

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
