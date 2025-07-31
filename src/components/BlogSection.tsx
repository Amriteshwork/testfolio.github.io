'use client'

import { useState, useEffect } from 'react'
import { BlogCard } from './BlogCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Plus, FileText } from 'lucide-react'

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  imageUrl?: string
  published: boolean
  featured: boolean
  createdAt: string
  author: {
    id: string
    name?: string
    email: string
  }
  blogTags: Array<{
    tag: {
      id: string
      name: string
    }
  }>
  projectBlogs: Array<{
    project: {
      id: string
      title: string
      type: 'PROFESSIONAL' | 'PERSONAL'
      status: 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'
    }
  }>
}

interface BlogSectionProps {
  featured?: boolean
  limit?: number
  showExcerpt?: boolean
  showTags?: boolean
}

export function BlogSection({ featured = false, limit, showExcerpt = true, showTags = true }: BlogSectionProps) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBlogs()
  }, [featured])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      params.append('published', 'true')
      if (featured) {
        params.append('featured', 'true')
      }
      if (limit) {
        params.append('limit', limit.toString())
      }
      
      const response = await fetch(`/api/blogs?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch blogs')
      }
      
      const data = await response.json()
      setBlogs(data)
    } catch (err) {
      console.error('Error fetching blogs:', err)
      setError('Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  const getSectionTitle = () => {
    if (featured) {
      return {
        title: 'Featured Blog Posts',
        description: 'Hand-picked articles that showcase my best work and insights',
        icon: BookOpen,
        emptyMessage: 'No featured posts yet. Check back soon for exciting content!'
      }
    } else {
      return {
        title: 'Latest Blog Posts',
        description: 'Where I share my ML journey, complete with bugs, breakthroughs, and bad puns',
        icon: FileText,
        emptyMessage: 'No blog posts yet. I\'m probably busy debugging a model or something...'
      }
    }
  }

  const sectionInfo = getSectionTitle()
  const Icon = sectionInfo.icon

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Icon className="w-6 h-6" />
            <h2 className="text-3xl font-bold tracking-tighter">{sectionInfo.title}</h2>
          </div>
          <p className="text-muted-foreground max-w-[600px] mx-auto">
            {sectionInfo.description}
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Icon className="w-6 h-6" />
          <h2 className="text-3xl font-bold tracking-tighter">{sectionInfo.title}</h2>
        </div>
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchBlogs} variant="outline" className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Icon className="w-6 h-6" />
          <h2 className="text-3xl font-bold tracking-tighter">{sectionInfo.title}</h2>
        </div>
        <p className="text-muted-foreground max-w-[600px] mx-auto">
          {sectionInfo.description}
        </p>
        {blogs.length > 0 && (
          <Badge variant="secondary" className="text-sm">
            {blogs.length} post{blogs.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>
      
      {blogs.length === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">{sectionInfo.emptyMessage}</p>
            <div className="mt-4 space-y-2">
              <Badge variant="outline">🤖 ML Models in Training</Badge>
              <Badge variant="outline">✍️ Writing in Progress</Badge>
              <Badge variant="outline">☕ Coffee Required</Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              showExcerpt={showExcerpt}
              showTags={showTags}
            />
          ))}
        </div>
      )}
      
      {limit && blogs.length >= limit && (
        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <a href="/blog">
              View All Blog Posts
              <Plus className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}