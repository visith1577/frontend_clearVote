"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function SideBySideComparison({
  items,
  comparisonPoints,
  comparisonData
}: {
  items: string[];
  comparisonPoints: string[];
  comparisonData: Array<{ [key: string]: string }>;
}) {
  return (
    <Card className="w-full my-4">
      <CardHeader>
        <CardTitle>Candidate Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Comparison Points</TableHead>
              {items.map((item, index) => (
                <TableHead key={index}>{item}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisonPoints.map((point, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{point}</TableCell>
                {items.map((_, itemIndex) => (
                  <TableCell key={itemIndex}>
                    {comparisonData[itemIndex][point] || 'N/A'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
