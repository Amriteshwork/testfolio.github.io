'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, Clock, User, ArrowLeft, Share2, Github, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

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

export default function BlogPost() {
  const params = useParams()
  const slug = params.slug as string
  
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      fetchBlog()
    }
  }, [slug])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // First, try to fetch by slug from the API
      const response = await fetch(`/api/blogs?published=true`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog')
      }
      
      const blogs = await response.json()
      const foundBlog = blogs.find((b: Blog) => b.slug === slug)
      
      if (!foundBlog) {
        setError('Blog post not found')
        return
      }
      
      setBlog(foundBlog)
    } catch (err) {
      console.error('Error fetching blog:', err)
      setError('Failed to load blog post')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  const copyToClipboard = () => {
    if (blog) {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          <Button variant="ghost" asChild>
            <Link href="/#blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
          
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        <div className="text-center space-y-6">
          <Button variant="ghost" asChild>
            <Link href="/#blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
          
          <Card>
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                {error || 'Blog Post Not Found'}
              </h1>
              <p className="text-muted-foreground">
                The blog post you're looking for might have been deleted or never existed. 
                Kind of like my will to debug this code at 2 AM.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/#blog">
                  Browse Other Posts
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" asChild>
          <Link href="/#blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </Button>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Blog Header */}
      <article className="space-y-6">
        <header className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {blog.featured && (
                <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500">
                  Featured
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold tracking-tighter lg:text-5xl">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(blog.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {getReadingTime(blog.content)}
              </div>
              {blog.author.name && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {blog.author.name}
                </div>
              )}
            </div>
            
            {blog.blogTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.blogTags.map(({ tag }) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          {blog.imageUrl && (
            <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {blog.excerpt && (
            <div className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary pl-4">
              {blog.excerpt}
            </div>
          )}
        </header>

        {/* Blog Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <code className={className} {...props}>
                    {children}
                  </code>
                ) : (
                  <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props}>
                    {children}
                  </code>
                )
              },
              blockquote({ children }) {
                return (
                  <blockquote className="border-l-4 border-primary pl-4 italic my-4">
                    {children}
                  </blockquote>
                )
              },
              table({ children }) {
                return (
                  <div className="overflow-x-auto my-4">
                    <table className="min-w-full border-collapse border border-border">
                      {children}
                    </table>
                  </div>
                )
              }
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>

        {/* Related Projects */}
        {blog.projectBlogs.length > 0 && (
          <div className="space-y-4 pt-8 border-t">
            <h2 className="text-2xl font-bold">Related Projects</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {blog.projectBlogs.map(({ project }) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{project.title}</span>
                      <Badge variant="outline">
                        {project.type.toLowerCase()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className={
                          project.status === 'COMPLETED' 
                            ? 'border-green-200 text-green-700' 
                            : project.status === 'IN_PROGRESS'
                            ? 'border-blue-200 text-blue-700'
                            : 'border-yellow-200 text-yellow-700'
                        }
                      >
                        {project.status.toLowerCase().replace('_', ' ')}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/projects/${project.id}`}>
                          View Project
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}