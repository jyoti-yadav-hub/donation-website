import React from "react";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ResponsiveContainer,
} from "recharts";
import { Grid } from "@mui/material";
import { AppCard } from "@crema";

const data = [
  { name: "Page A", pv: 2558, amt: 2400 },
  { name: "Page B", pv: 7798, amt: 2210 },
  { name: "Page C", pv: 1800, amt: 2290 },
  { name: "Page D", pv: 8908, amt: 2000 },
  { name: "Page E", pv: 4800, amt: 2181 },
  { name: "Page F", pv: 9800, amt: 2500 },
  { name: "Page G", pv: 4300, amt: 2100 },
];

export default function FoodGraph() {
  return (
    <Grid spacing={{ xs: 6 }}>
      <AppCard className="card-hover">
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart
            margin={{ top: 50, right: 0, left: 0, bottom: 0 }}
            data={data}
          >
            <XAxis dataKey="name" padding={{ left: 20, right: 20 }} />
            <Tooltip labelStyle={{ color: "black" }} />
            <YAxis />
            <CartesianGrid
              strokeDasharray="2 10"
              stroke="#E53E3E"
              vertical={false}
            />
            <defs>
              <linearGradient id="color15" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FED7E2" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FFF5F7" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <Area
              dataKey="pv"
              strokeWidth={2}
              stackId="2"
              stroke="#E53E3E"
              fill="url(#color15)"
              fillOpacity={1}
              type="linear"
            />
          </AreaChart>
        </ResponsiveContainer>
      </AppCard>
    </Grid>
  );
}
