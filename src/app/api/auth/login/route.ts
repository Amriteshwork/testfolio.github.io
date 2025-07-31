import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // For demo purposes, using a simple password check
    // In production, you should use proper authentication
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        role: 'ADMIN',
        timestamp: Date.now()
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    return NextResponse.json({
      message: 'Login successful',
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}