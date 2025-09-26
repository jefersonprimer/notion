## Tipagens

## user type
export type User = {
  id: string
  email: string
  password: string
}

---
## note type
import { user } from './user.ts'

export type Note = {
  id: string
  title: string
  description: string
  user_id: string
  created_at: string
}


