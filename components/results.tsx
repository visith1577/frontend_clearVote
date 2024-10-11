"use client"

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell} from 'recharts';

interface Candidate {
  name: string;
  votes: number;
  color: string;
  party: string;
  acronym: string;
}

interface ElectionResultsChartProps {
  data: Candidate[];
}

const CustomBar: React.FC<any> = (props) => {
    const { x, y, width, height, fill } = props;
    const fontSize = height < 20 ? 'text-xs' : 'text-sm';

    return (
        <g>
            <rect x={x} y={y} width={width} height={height} fill={fill} />
            {height >= 10 && (
                <text
                    x={x + width - 5}
                    y={y + height / 2}
                    dx={-5}
                    dy={5}
                    textAnchor="end"
                    fill="#ffffff"
                    className={`${fontSize} font-medium`}
                >
                    {props.acronym}
                </text>
            )}
        </g>
    );
};

const ElectionResultsChart: React.FC<ElectionResultsChartProps> = ({ data }) => {
    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis 
                        type="number" 
                        tickFormatter={(value) => `${value.toLocaleString()}`}
                        className="text-sm"
                        stroke="#1D4ED8" // Blue 700
                    />
                    <YAxis 
                        dataKey="party" 
                        type="category" 
                        hide={false} // Set to true or false based on your need
                        stroke="#1D4ED8" // Blue 700
                    />
                    <Tooltip
                        formatter={(value: number, name: string, props: any) => [
                            `Votes: ${value.toLocaleString()}`
                        ]}
                        contentStyle={{ backgroundColor: '#f3f4f6', border: 'none' }}
                        itemStyle={{ color: '#1f2937' }}
                        labelFormatter={(label: string, payload: any) => {
                            const candidate = payload[0]?.payload;
                            return candidate ? `${candidate.name}` : label;
                        }}
                    />
                    <Bar
                        dataKey="votes"
                        shape={<CustomBar />}
                        label={false} // Disable built-in label rendering since we're using a custom label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ElectionResultsChart;