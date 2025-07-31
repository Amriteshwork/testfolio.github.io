'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExternalLink, Github, BookOpen, Brain, Coffee, Zap } from 'lucide-react'
import Link from 'next/link'
import { ProjectsSection } from '@/components/ProjectsSection'
import { BlogSection } from '@/components/BlogSection'

export default function Home() {
  const [activeTab, setActiveTab] = useState('home')
  const [quote, setQuote] = useState('')

  const mlQuotes = [
    "I asked my neural network for a joke about overfitting. It told the same joke 1000 times and claimed 99.9% accuracy.",
    "Machine learning is like teaching a child to fish, but the child is a computer and the fish is data. And sometimes the child thinks a cat is a fish.",
    "My model's performance is like my coffee: dark, bold, and sometimes it crashes unexpectedly.",
    "I don't always test my code, but when I do, I do it in production.",
    "Data scientist: someone who knows more statistics than a computer scientist and more computer science than a statistician.",
    "I have 99 problems, but a batch norm ain't one.",
    "Why did the data scientist get kicked out of school? Too many degrees of freedom."
  ]

  useEffect(() => {
    setQuote(mlQuotes[Math.floor(Math.random() * mlQuotes.length)])
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Brain className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">ML Portfolio</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="#projects" className="transition-colors hover:text-foreground/80">
                Projects
              </Link>
              <Link href="#blog" className="transition-colors hover:text-foreground/80">
                Blog
              </Link>
              <Link href="#about" className="transition-colors hover:text-foreground/80">
                About
              </Link>
            </nav>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="space-y-4">
            <Badge variant="outline" className="px-3 py-1 text-sm">
              <Brain className="w-3 h-3 mr-2" />
              Machine Learning Engineer
            </Badge>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Turning Data into
              <span className="text-primary"> Intelligence</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              I build machine learning models that actually work (most of the time). 
              Specializing in making computers smarter than me, one dataset at a time.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="#projects">
                <Zap className="w-4 h-4 mr-2" />
                View Projects
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#blog">
                <BookOpen className="w-4 h-4 mr-2" />
                Read Blog
              </Link>
            </Button>
          </div>

          <Card className="mt-8 max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="w-5 h-5" />
                Quote of the Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground italic">"{quote}"</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <section className="container px-4 py-12">
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
          </TabsList>
          
          <TabsContent value="home" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Professional Projects
                  </CardTitle>
                  <CardDescription>
                    5+ projects that actually shipped to production (and didn't break)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    From recommendation systems to predictive models, I've built solutions that companies actually use. 
                    No academic projects here, just real-world ML applications.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Personal Projects
                  </CardTitle>
                  <CardDescription>
                    Side projects fueled by curiosity and caffeine
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Currently working on some exciting personal ML projects. 
                    Coming soon to a GitHub repository near you!
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Technical Blog
                  </CardTitle>
                  <CardDescription>
                    Where I document my failures... I mean learnings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Deep dives into ML concepts, tutorials, and war stories from the trenches. 
                    More honest than a model's accuracy report.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">Projects</h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                A collection of my work, both professional and personal. 
                Each project comes with its own set of bugs... I mean features.
              </p>
            </div>
            
            <div className="grid gap-12 md:grid-cols-2">
              {/* Professional Projects */}
              <div>
                <ProjectsSection type="professional" showBlogs={true} limit={2} />
              </div>

              {/* Personal Projects */}
              <div>
                <ProjectsSection type="personal" showBlogs={true} limit={2} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="blog" className="space-y-8">
            <BlogSection featured={true} limit={6} />
          </TabsContent>
        </Tabs>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Brain className="h-6 w-6" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with Next.js, Prisma, and too much coffee.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Github className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Link href="/admin" className="text-xs text-muted-foreground hover:text-primary">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}