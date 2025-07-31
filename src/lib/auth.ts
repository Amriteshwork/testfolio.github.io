import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface DecodedToken {
  role: string
  timestamp: number
  iat: number
  exp: number
}

export function verifyToken(request: NextRequest): DecodedToken | null {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken
    
    return decoded
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

export function createToken(): string {
  return jwt.sign(
    { 
      role: 'ADMIN',
      timestamp: Date.now()
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}