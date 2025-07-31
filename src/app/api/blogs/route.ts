import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published') === 'true'
    const featured = searchParams.get('featured') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    
    const where: any = {}
    
    if (published) {
      where.published = true
    }
    
    if (featured) {
      where.featured = true
    }

    const blogs = await db.blog.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        blogTags: {
          include: {
            tag: true
          }
        },
        projectBlogs: {
          include: {
            project: {
              select: {
                id: true,
                title: true,
                type: true,
                status: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return NextResponse.json(blogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      content,
      excerpt,
      imageUrl,
      tags,
      featured,
      published,
      authorId
    } = body

    // Validate required fields
    if (!title || !slug || !content || !authorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug is unique
    const existingBlog = await db.blog.findUnique({
      where: { slug }
    })

    if (existingBlog) {
      return NextResponse.json(
        { error: 'Blog with this slug already exists' },
        { status: 400 }
      )
    }

    // Create blog
    const blog = await db.blog.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        imageUrl,
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

        await db.blogTag.create({
          data: {
            blogId: blog.id,
            tagId: tag.id
          }
        })
      }
    }

    const fullBlog = await db.blog.findUnique({
      where: { id: blog.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        blogTags: {
          include: {
            tag: true
          }
        }
      }
    })

    return NextResponse.json(fullBlog, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}