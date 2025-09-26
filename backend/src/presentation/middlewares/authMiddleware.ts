import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // 1. Pega o cabeçalho de autorização da requisição
  const authHeader = req.headers.authorization;

  // 2. Verifica se o cabeçalho existe
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing.' });
  }

  // 3. O formato do token é "Bearer TOKEN". Vamos separar os dois.
  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Token error: malformatted token.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Token error: format must be "Bearer token".' });
  }

  // 4. Verifica se o token é válido
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not found in environment variables.');
    }

    // jwt.verify vai decodificar o token. Se for inválido, ele vai disparar um erro.
    const decodedPayload = jwt.verify(token, secret);

    // O Supabase coloca o ID do usuário na propriedade 'sub' do payload
    const userId = (decodedPayload as any).sub;

    if (!userId) {
      return res.status(401).json({ message: 'Invalid token: user ID not found.' });
    }

    // 5. Adiciona o ID do usuário ao objeto `req` para ser usado nas próximas rotas
    req.user = { id: userId };

    // 6. Se tudo deu certo, chama o próximo passo (o controller da rota)
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired.' });
  }
}
