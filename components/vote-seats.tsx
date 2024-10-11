"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Candidate {
  name: string;
  seats: number;
  color: string;
}

const candidates: Candidate[] = [
  { name: "Anura Kumara Dissanayake", seats: 108, color: "#DC2626" },
  { name: "Sajith Premadasa", seats: 90, color: "#10B981" },
  { name: "Ranil Wickremesinghe", seats: 46, color: "#FBBF24" },
  { name: "Namal Rajapaksa", seats: 3, color: "#7C3AED" },
  { name: "P. Ariyenethiran", seats: 3, color: "#F97316" },
];

const VoteToSeatScoreboard: React.FC = () => {
  const totalSeats = candidates.reduce((sum, candidate) => sum + candidate.seats, 0);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Vote-to-Seat Scoreboard - If it was a Race for Parliament</CardTitle>
        <p className="text-sm text-gray-500">If each candidate was a political party, how many seats in parliament have they collected so far?</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-center gap-1">
          {candidates.map((candidate, index) => (
            <React.Fragment key={index}>
              {Array.from({ length: candidate.seats }).map((_, seatIndex) => (
                <div
                  key={`${index}-${seatIndex}`}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: candidate.color }}
                  title={`${candidate.name}: ${candidate.seats} seats`}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          {candidates.map((candidate, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: candidate.color }}
              />
              <span className="flex-grow">{candidate.name}</span>
              <span className="font-semibold">{candidate.seats}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-500 text-right">
          Total seats: {totalSeats}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoteToSeatScoreboard;