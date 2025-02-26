import React from "react";
import { Box, Grid, styled, useMediaQuery } from "@mui/material";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CremaTheme } from "types/AppContextPropsType";

interface ChartComponentProps {
  cData?: any;
  title?: any;
}

const BreadWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundColor: "#fff",
  boxShadow: "0px 10px 10px 4px rgb(0 0 0 / 4%)",
  padding: "20px",
  borderRadius: 10,
  "& .icons": { fontSize: 30 },
  "& text": { fontSize: "12px" },
}));

const ChartComponent: React.FC<ChartComponentProps> = ({ cData, title }) => {
  const isXLDown = useMediaQuery((theme: CremaTheme) =>
    theme.breakpoints.down("xl")
  );

  return (
    <BreadWrapper>
      <Grid spacing={6}>
        <ResponsiveContainer width="100%" height={isXLDown ? 300 : 300}>
          <BarChart data={cData} barGap={5} barSize={isXLDown ? 15 : 20}>
            <XAxis
              dataKey="name"
              // angle={isXLDown ? 0 : -90}
              height={20}
              interval={0}
              tickMargin={isXLDown ? 30 : 5}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" stackId="a" fill="#F44D50">
              {cData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Grid>
    </BreadWrapper>
  );
};

export default ChartComponent;
