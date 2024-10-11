"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Event = {
  id: string
  title: string
  date: string
  description: string
}

type EventListProps = {
  message?: string
  events: Event[]
}

export default function EventList({ message, events }: EventListProps) {
  return (
    <div className="space-y-4">
      {message && (
        <Card className="bg-blue-100">
          <CardContent className="p-4">
            <p className="text-blue-800">{message}</p>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle className="text-md">{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">{event.date}</p>
              <p className="text-sm">{event.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}