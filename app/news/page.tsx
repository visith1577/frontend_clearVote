"use client"

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/nav-bar"

export default function NewsletterPage() {
  const [newsletter, setNewsletter] = useState(`
# Welcome to Our Newsletter!

## Latest Updates

1. **New Feature Launch**: We're excited to announce our latest feature...
2. **Community Spotlight**: This month, we're highlighting...
3. **Upcoming Events**: Don't miss out on these exciting events...

## Article of the Month

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, 
nisi vel consectetur interdum, nisl nunc egestas nunc, vitae tincidunt 
nisl nunc euismod nunc.

## Quick Tips

- Remember to stay hydrated!
- Take regular breaks from your screen.
- Practice mindfulness for 5 minutes each day.

Thank you for being a valued subscriber!
  `)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <ReactMarkdown className="prose prose-sm sm:prose lg:prose-lg mx-auto">
            {newsletter}
          </ReactMarkdown>
        </div>
        <div className="mt-8 text-center">
          <Button variant="outline">Subscribe</Button>
        </div>
      </main>
    </div>
  )
}