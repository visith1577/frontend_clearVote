"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProsConsHighlight({ topic, pros, cons }: { topic: string, pros: string[], cons: string[] }) {
  return (
    <Card className="w-full my-4">
      <CardHeader>
        <CardTitle>{topic}: Pros and Cons</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-green-600 mb-2">Pros</h3>
          <ul className="list-disc pl-5 space-y-1">
            {pros.map((pro, index) => (
              <li key={index} className="text-green-700">{pro}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-red-600 mb-2">Cons</h3>
          <ul className="list-disc pl-5 space-y-1">
            {cons.map((con, index) => (
              <li key={index} className="text-red-700">{con}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}