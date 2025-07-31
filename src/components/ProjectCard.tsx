'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github, Calendar, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  type: 'PROFESSIONAL' | 'PERSONAL'
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'
  imageUrl?: string
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  published: boolean
  createdAt: string
  author: {
    id: string
    name?: string
    email: string
  }
  projectTags: Array<{
    tag: {
      id: string
      name: string
    }
  }>
  blogs: Array<{
    blog: {
      id: string
      title: string
      slug: string
      published: boolean
      createdAt: string
    }
  }>
}

interface ProjectCardProps {
  project: Project
  showBlogs?: boolean
}

export function ProjectCard({ project, showBlogs = false }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Completed'
      case 'IN_PROGRESS':
        return 'In Progress'
      case 'ON_HOLD':
        return 'On Hold'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{project.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getStatusColor(project.status)}>
                {getStatusText(project.status)}
              </Badge>
              <Badge variant="secondary">
                {project.type === 'PROFESSIONAL' ? 'Professional' : 'Personal'}
              </Badge>
              {project.featured && (
                <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500">
                  Featured
                </Badge>
              )}
            </div>
          </div>
          {project.imageUrl && (
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        <CardDescription className="text-sm line-clamp-3">
          {project.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          {/* Tags */}
          {project.projectTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.projectTags.map(({ tag }) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Blogs */}
          {showBlogs && project.blogs.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Related Blog Posts ({project.blogs.length})
              </h4>
              <div className="space-y-1">
                {project.blogs.slice(0, 3).map(({ blog }) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="block text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    • {blog.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            Created {formatDate(project.createdAt)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          {project.githubUrl && (
            <Button variant="outline" size="sm" asChild>
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-1" />
                Code
              </Link>
            </Button>
          )}
          {project.liveUrl && (
            <Button variant="outline" size="sm" asChild>
              <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                Live Demo
              </Link>
            </Button>
          )}
          {project.blogs.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/projects/${project.id}`}>
                View Details
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}