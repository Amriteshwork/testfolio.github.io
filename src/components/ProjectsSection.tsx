'use client'

import { useState, useEffect } from 'react'
import { ProjectCard } from './ProjectCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Brain, Zap, Plus } from 'lucide-react'

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

interface ProjectsSectionProps {
  type?: 'professional' | 'personal'
  showBlogs?: boolean
  limit?: number
}

export function ProjectsSection({ type, showBlogs = false, limit }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [type])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (type) {
        params.append('type', type)
      }
      params.append('published', 'true')
      
      const response = await fetch(`/api/projects?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      
      const data = await response.json()
      const limitedData = limit ? data.slice(0, limit) : data
      setProjects(limitedData)
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const getSectionTitle = () => {
    if (type === 'professional') {
      return {
        title: 'Professional Projects',
        description: 'Work that paid the bills (and taught me valuable lessons)',
        icon: Brain,
        emptyMessage: 'No professional projects yet. Check back soon!'
      }
    } else if (type === 'personal') {
      return {
        title: 'Personal Projects',
        description: 'Labor of love (and late nights)',
        icon: Zap,
        emptyMessage: 'Personal projects coming soon! Currently brewing something exciting...'
      }
    } else {
      return {
        title: 'All Projects',
        description: 'A collection of my work, complete with bugs and features',
        icon: Brain,
        emptyMessage: 'No projects yet. Stay tuned!'
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
            <Button onClick={fetchProjects} variant="outline" className="mt-4">
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
        {projects.length > 0 && (
          <Badge variant="secondary" className="text-sm">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>
      
      {projects.length === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">{sectionInfo.emptyMessage}</p>
            {type === 'personal' && (
              <div className="mt-4 space-y-2">
                <Badge variant="outline">🚧 Work in Progress</Badge>
                <Badge variant="outline">🔮 Coming Soon</Badge>
                <Badge variant="outline">☕ Fueled by Coffee</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              showBlogs={showBlogs}
            />
          ))}
        </div>
      )}
      
      {limit && projects.length >= limit && (
        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <a href={`/projects?type=${type}`}>
              View All {type === 'professional' ? 'Professional' : 'Personal'} Projects
              <Plus className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}