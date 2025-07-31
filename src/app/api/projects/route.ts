import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'professional' or 'personal'
    const published = searchParams.get('published') === 'true'
    
    const where: any = {}
    
    if (type) {
      where.type = type.toUpperCase()
    }
    
    if (published) {
      where.published = true
    }

    const projects = await db.project.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        projectTags: {
          include: {
            tag: true
          }
        },
        blogs: {
          include: {
            blog: {
              select: {
                id: true,
                title: true,
                slug: true,
                published: true,
                createdAt: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      type,
      status,
      imageUrl,
      githubUrl,
      liveUrl,
      tags,
      featured,
      published,
      authorId
    } = body

    // Validate required fields
    if (!title || !description || !type || !authorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create project
    const project = await db.project.create({
      data: {
        title,
        description,
        type: type.toUpperCase(),
        status: status?.toUpperCase() || 'IN_PROGRESS',
        imageUrl,
        githubUrl,
        liveUrl,
        featured: featured || false,
        published: published || false,
        authorId
      }
    })

    // Add tags if provided
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        let tag = await db.tag.findUnique({
          where: { name: tagName }
        })

        if (!tag) {
          tag = await db.tag.create({
            data: { name: tagName }
          })
        }

        await db.projectTag.create({
          data: {
            projectId: project.id,
            tagId: tag.id
          }
        })
      }
    }

    const fullProject = await db.project.findUnique({
      where: { id: project.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        projectTags: {
          include: {
            tag: true
          }
        }
      }
    })

    return NextResponse.json(fullProject, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}