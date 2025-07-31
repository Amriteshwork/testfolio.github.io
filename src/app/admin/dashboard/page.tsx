'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Settings,
  TrendingUp,
  Users,
  FileText
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalProjects: number
  totalBlogs: number
  publishedProjects: number
  publishedBlogs: number
  professionalProjects: number
  personalProjects: number
}

interface RecentActivity {
  id: string
  type: 'project' | 'blog'
  title: string
  action: 'created' | 'updated' | 'published'
  timestamp: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalBlogs: 0,
    publishedProjects: 0,
    publishedBlogs: 0,
    professionalProjects: 0,
    personalProjects: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchDashboardData()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }
  }

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentActivity(data.recentActivity)
      } else {
        // Token might be expired
        localStorage.removeItem('adminToken')
        router.push('/admin')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 animate-pulse" />
          <p>Loading dashboard...</p>
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
            <Brain className="h-6 w-6" />
            <span className="font-bold">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              <Settings className="w-3 h-3 mr-1" />
              Admin Mode
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">
              Welcome back, ML Overlord! 👑
            </h1>
            <p className="text-muted-foreground">
              Ready to conquer the world one blog post at a time?
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProjects}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.professionalProjects} professional, {stats.personalProjects} personal
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published Projects</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.publishedProjects}</div>
                <p className="text-xs text-muted-foreground">
                  Live and ready to impress
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Blog Posts</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBlogs}</div>
                <p className="text-xs text-muted-foreground">
                  Words of wisdom (and sarcasm)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.publishedBlogs}</div>
                <p className="text-xs text-muted-foreground">
                  Sharing knowledge with the world
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Projects
                </CardTitle>
                <CardDescription>
                  Manage your ML projects, both professional and personal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Button className="w-full justify-start" asChild>
                    <Link href="/admin/projects/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Project
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/admin/projects">
                      <Edit className="w-4 h-4 mr-2" />
                      Manage All Projects
                    </Link>
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>🤖 Professional Projects: {stats.professionalProjects}</p>
                  <p>🚀 Personal Projects: {stats.personalProjects}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Blog Posts
                </CardTitle>
                <CardDescription>
                  Write and manage your technical blog posts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Button className="w-full justify-start" asChild>
                    <Link href="/admin/blogs/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Write New Blog Post
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/admin/blogs">
                      <Edit className="w-4 h-4 mr-2" />
                      Manage All Posts
                    </Link>
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>📝 Total Posts: {stats.totalBlogs}</p>
                  <p>🌟 Published: {stats.publishedBlogs}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest content management actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent activity yet.</p>
                  <p className="text-sm">Time to create some amazing content! 🚀</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {activity.type === 'project' ? (
                            <Brain className="h-4 w-4" />
                          ) : (
                            <BookOpen className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.action} {activity.type}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}