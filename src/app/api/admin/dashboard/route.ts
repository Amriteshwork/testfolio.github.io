import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const decoded = verifyToken(request)
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch stats
    const [
      totalProjects,
      totalBlogs,
      publishedProjects,
      publishedBlogs,
      professionalProjects,
      personalProjects
    ] = await Promise.all([
      db.project.count(),
      db.blog.count(),
      db.project.count({ where: { published: true } }),
      db.blog.count({ where: { published: true } }),
      db.project.count({ where: { type: 'PROFESSIONAL' } }),
      db.project.count({ where: { type: 'PERSONAL' } })
    ])

    const stats = {
      totalProjects,
      totalBlogs,
      publishedProjects,
      publishedBlogs,
      professionalProjects,
      personalProjects
    }

    // Fetch recent activity (mock data for now)
    const recentActivity = [
      {
        id: '1',
        type: 'project' as const,
        title: 'ML Recommendation System',
        action: 'created' as const,
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        type: 'blog' as const,
        title: 'Understanding Neural Networks',
        action: 'published' as const,
        timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    ]

    return NextResponse.json({
      stats,
      recentActivity
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}