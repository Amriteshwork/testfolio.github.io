'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Save, 
  ArrowLeft, 
  Plus,
  X,
  Image as ImageIcon,
  Eye,
  Edit,
  FileText,
  Code,
  Calculator,
  Video
} from 'lucide-react'
import Link from 'next/link'

// Dynamic import to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

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

const markdownHelp = `
## Markdown Quick Reference

### Text Formatting
- **Bold**: \`**text**\`
- *Italic*: \`*text*\`
- ~~Strikethrough~~: \`~~text~~\`
- \`Code\`: \\\`code\\\`

### Headings
# H1, ## H2, ### H3, etc.

### Lists
- Unordered: \`- item\`
- Ordered: \`1. item\`

### Links
[Text](url)

### Images
![Alt text](url)

### Code Blocks
\\\`\`\`javascript
console.log('Hello World');
\\\`\`\`

### Blockquotes
> Quote text

### Tables
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |

### Mathematical Equations (LaTeX)
Inline: \`$E = mc^2$\`

Block:
\`\`\`math
\\frac{d}{dx}(x^n) = nx^{n-1}
\`\`\`
`

export default function NewBlog() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    featured: false,
    published: false,
    tags: [] as string[]
  })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    // Auto-generate slug from title
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title, formData.slug])

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
      const response = await fetch('/api/admin/blogs', {
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
        router.push('/admin/blogs')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create blog post')
      }
    } catch (error) {
      console.error('Error creating blog post:', error)
      alert('Failed to create blog post')
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

  const insertMarkdown = (template: string) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + template
    }))
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
            <Link href="/admin/blogs" className="hover:text-primary">
              Blog Posts
            </Link>
            <span className="text-muted-foreground">/</span>
            <span>New Blog Post</span>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin/blogs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Posts
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 max-w-6xl mx-auto">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">Write New Blog Post</h1>
            <p className="text-muted-foreground">
              Share your ML wisdom with the world 📝✨
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Column - Metadata */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Essential details about your post
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="My Amazing ML Discovery"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        placeholder="my-amazing-ml-discovery"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => handleInputChange('excerpt', e.target.value)}
                        placeholder="A brief summary of your post..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Featured Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                    <CardDescription>
                      Categorize your post
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
                      Control visibility and features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Published</Label>
                        <p className="text-sm text-muted-foreground">
                          Make this post public
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
                          Highlight on homepage
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
                    <CardTitle>Quick Insert</CardTitle>
                    <CardDescription>
                      Add common elements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => insertMarkdown('![Image description](url)')}
                      className="w-full justify-start"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Insert Image
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => insertMarkdown('```javascript\\n// Your code here\\n```')}
                      className="w-full justify-start"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Insert Code Block
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => insertMarkdown('$E = mc^2$')}
                      className="w-full justify-start"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Insert Math
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => insertMarkdown('[Video Title](url)')}
                      className="w-full justify-start"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Insert Video Link
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Editor */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>
                      Write your post in Markdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Tabs defaultValue="edit" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="edit" className="flex items-center gap-2">
                            <Edit className="w-4 h-4" />
                            Edit
                          </TabsTrigger>
                          <TabsTrigger value="preview" className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Preview
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="edit" className="mt-4">
                          <div data-color-mode="light">
                            <MDEditor
                              value={formData.content}
                              onChange={(value) => handleInputChange('content', value || '')}
                              height={600}
                              visibleDragBar={false}
                              textareaProps={{
                                placeholder: 'Write your blog post in Markdown...',
                                required: true
                              }}
                            />
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="preview" className="mt-4">
                          <Card>
                            <CardContent className="pt-6">
                              {formData.content ? (
                                <div data-color-mode="light">
                                  <MDEditor.Markdown source={formData.content} />
                                </div>
                              ) : (
                                <div className="text-center text-muted-foreground py-8">
                                  <FileText className="w-12 h-12 mx-auto mb-4" />
                                  <p>Start writing to see a preview...</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Markdown Help</CardTitle>
                    <CardDescription>
                      Quick reference for common Markdown syntax
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <pre className="whitespace-pre-wrap text-xs bg-muted p-3 rounded">
                        {markdownHelp}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading} size="lg">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Creating Post...' : 'Create Blog Post'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}