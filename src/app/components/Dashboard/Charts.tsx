"use client";
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { COLORS } from '../../constants';

const attackData = [
  { time: '00:00', attacks: 12 },
  { time: '04:00', attacks: 45 },
  { time: '08:00', attacks: 120 },
  { time: '12:00', attacks: 85 },
  { time: '16:00', attacks: 210 },
  { time: '20:00', attacks: 65 },
  { time: '23:59', attacks: 95 },
];

const severityData = [
  { name: 'Critical', value: 8, color: COLORS.critical },
  { name: 'High', value: 15, color: COLORS.high },
  { name: 'Medium', value: 32, color: COLORS.medium },
  { name: 'Low', value: 45, color: COLORS.low },
];

export const AttackTimeline: React.FC = () => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={attackData}>
        <defs>
          <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.wine} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={COLORS.wine} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '8px', color: '#FFF' }}
          itemStyle={{ color: '#FFF' }}
        />
        <Area type="monotone" dataKey="attacks" stroke={COLORS.wine} fillOpacity={1} fill="url(#colorAttacks)" strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const SeverityDonut: React.FC = () => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={severityData}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {severityData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
