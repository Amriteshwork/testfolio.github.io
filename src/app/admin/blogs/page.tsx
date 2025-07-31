'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye,
  Calendar,
  Clock,
  Filter,
  FileText
} from 'lucide-react'
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
    }
  }>
}

export default function AdminBlogs() {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    checkAuth()
    fetchBlogs()
  }, [])

  useEffect(() => {
    filterBlogs()
  }, [blogs, searchTerm, statusFilter])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }
  }

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/blogs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBlogs(data)
      } else {
        localStorage.removeItem('adminToken')
        router.push('/admin')
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterBlogs = () => {
    let filtered = blogs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter === 'published') {
      filtered = filtered.filter(blog => blog.published)
    } else if (statusFilter === 'draft') {
      filtered = filtered.filter(blog => !blog.published)
    }

    setFilteredBlogs(filtered)
  }

  const handleDelete = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setBlogs(blogs.filter(b => b.id !== blogId))
      } else {
        alert('Failed to delete blog post')
      }
    } catch (error) {
      console.error('Error deleting blog post:', error)
      alert('Failed to delete blog post')
    }
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 animate-pulse" />
          <p>Loading blog posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <span className="font-bold">Admin Dashboard</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span>Blog Posts</span>
          </div>
          <Button asChild>
            <Link href="/admin/blogs/new">
              <Plus className="w-4 h-4 mr-2" />
              New Blog Post
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter">Manage Blog Posts</h1>
              <p className="text-muted-foreground">
                Your collection of technical wisdom and sarcasm ({filteredBlogs.length} total)
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search blog posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Drafts</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blogs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>
                All your technical content in one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredBlogs.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {blogs.length === 0 
                      ? "No blog posts yet. Write your first post!" 
                      : "No blog posts match your filters."
                    }
                  </p>
                  {blogs.length === 0 && (
                    <Button className="mt-4" asChild>
                      <Link href="/admin/blogs/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Write First Post
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Blog Post</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reading Time</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBlogs.map((blog) => (
                        <TableRow key={blog.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{blog.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                /{blog.slug}
                              </div>
                              <div className="flex gap-1">
                                {blog.featured && (
                                  <Badge variant="default" className="text-xs">
                                    Featured
                                  </Badge>
                                )}
                                {blog.published && (
                                  <Badge variant="secondary" className="text-xs">
                                    Published
                                  </Badge>
                                )}
                                {!blog.published && (
                                  <Badge variant="outline" className="text-xs border-yellow-200 text-yellow-700">
                                    Draft
                                  </Badge>
                                )}
                              </div>
                              {blog.blogTags.length > 0 && (
                                <div className="flex gap-1">
                                  {blog.blogTags.slice(0, 2).map(({ tag }) => (
                                    <Badge key={tag.id} variant="outline" className="text-xs">
                                      {tag.name}
                                    </Badge>
                                  ))}
                                  {blog.blogTags.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{blog.blogTags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {blog.published ? (
                                <Badge variant="secondary" className="text-xs">
                                  Published
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs border-yellow-200 text-yellow-700">
                                  Draft
                                </Badge>
                              )}
                              {blog.projectBlogs.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {blog.projectBlogs.length} project{blog.projectBlogs.length > 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {getReadingTime(blog.content)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {formatDate(blog.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/blog/${blog.slug}`} target="_blank">
                                  <Eye className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/blogs/${blog.id}/edit`}>
                                  <Edit className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDelete(blog.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}