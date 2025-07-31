'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, BookOpen, ExternalLink } from 'lucide-react'
import Link from 'next/link'

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

interface BlogCardProps {
  blog: Blog
  showExcerpt?: boolean
  showTags?: boolean
}

export function BlogCard({ blog, showExcerpt = true, showTags = true }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  const getExcerpt = (content: string, maxLength = 150) => {
    // Remove markdown syntax for excerpt
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .trim()
    
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength).trim() + '...'
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                {blog.featured && (
                  <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500">
                    Featured
                  </Badge>
                )}
                {!blog.published && (
                  <Badge variant="outline" className="border-yellow-200 text-yellow-700">
                    Draft
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl leading-tight">
                <Link 
                  href={`/blog/${blog.slug}`} 
                  className="hover:text-primary transition-colors"
                >
                  {blog.title}
                </Link>
              </CardTitle>
            </div>
            {blog.imageUrl && (
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ml-4">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(blog.createdAt)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getReadingTime(blog.content)}
            </div>
            {blog.author.name && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {blog.author.name}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          {/* Excerpt */}
          {showExcerpt && (
            <CardDescription className="text-sm leading-relaxed line-clamp-3">
              {blog.excerpt || getExcerpt(blog.content)}
            </CardDescription>
          )}

          {/* Tags */}
          {showTags && blog.blogTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {blog.blogTags.slice(0, 4).map(({ tag }) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
              {blog.blogTags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{blog.blogTags.length - 4} more
                </Badge>
              )}
            </div>
          )}

          {/* Related Projects */}
          {blog.projectBlogs.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Related Projects ({blog.projectBlogs.length})
              </h4>
              <div className="space-y-1">
                {blog.projectBlogs.slice(0, 2).map(({ project }) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    • {project.title} ({project.type.toLowerCase()})
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Read More Button */}
        <div className="mt-4 pt-4 border-t">
          <Button variant="ghost" size="sm" asChild className="w-full justify-start">
            <Link href={`/blog/${blog.slug}`}>
              Read More
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}