'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Save, 
  ArrowLeft, 
  Plus,
  X,
  Image as ImageIcon,
  Github,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

interface TagInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
}

function TagInput({ tags, onTagsChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const addTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onTagsChange([...tags, inputValue.trim()])
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Add a tag..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button type="button" onClick={addTag} size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <X 
              className="w-3 h-3 cursor-pointer hover:text-red-500" 
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
      </div>
    </div>
  )
}

export default function NewProject() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PERSONAL',
    status: 'IN_PROGRESS',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    featured: false,
    published: false,
    tags: [] as string[]
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          authorId: 'temp-author-id' // In a real app, you'd get this from the authenticated user
        })
      })

      if (response.ok) {
        router.push('/admin/projects')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              <span className="font-bold">Admin Dashboard</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/admin/projects" className="hover:text-primary">
              Projects
            </Link>
            <span className="text-muted-foreground">/</span>
            <span>New Project</span>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">Create New Project</h1>
            <p className="text-muted-foreground">
              Add another masterpiece to your portfolio 🚀
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      The essential details about your project
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="My Awesome ML Project"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe what this project does and why it's amazing..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PERSONAL">Personal</SelectItem>
                            <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="ON_HOLD">On Hold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Media & Links
                    </CardTitle>
                    <CardDescription>
                      Add images and external links
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Project Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="githubUrl" className="flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        GitHub Repository
                      </Label>
                      <Input
                        id="githubUrl"
                        value={formData.githubUrl}
                        onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                        placeholder="https://github.com/username/repo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="liveUrl" className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Live Demo URL
                      </Label>
                      <Input
                        id="liveUrl"
                        value={formData.liveUrl}
                        onChange={(e) => handleInputChange('liveUrl', e.target.value)}
                        placeholder="https://your-project-demo.com"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                    <CardDescription>
                      Add tags to categorize your project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TagInput
                      tags={formData.tags}
                      onTagsChange={(tags) => handleInputChange('tags', tags)}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Publication Settings</CardTitle>
                    <CardDescription>
                      Control how your project appears on the portfolio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Published</Label>
                        <p className="text-sm text-muted-foreground">
                          Show this project on your portfolio
                        </p>
                      </div>
                      <Switch
                        checked={formData.published}
                        onCheckedChange={(checked) => handleInputChange('published', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Featured</Label>
                        <p className="text-sm text-muted-foreground">
                          Highlight this project on the homepage
                        </p>
                      </div>
                      <Switch
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleInputChange('featured', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>
                      How your project will appear
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {formData.type === 'PROFESSIONAL' ? 'Professional' : 'Personal'}
                        </Badge>
                        <Badge variant="outline" className={
                          formData.status === 'COMPLETED' 
                            ? 'border-green-200 text-green-700' 
                            : formData.status === 'IN_PROGRESS'
                            ? 'border-blue-200 text-blue-700'
                            : 'border-yellow-200 text-yellow-700'
                        }>
                          {formData.status.replace('_', ' ')}
                        </Badge>
                        {formData.featured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold">
                        {formData.title || 'Project Title'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.description || 'Project description will appear here...'}
                      </p>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {formData.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading} size="lg">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Creating Project...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}