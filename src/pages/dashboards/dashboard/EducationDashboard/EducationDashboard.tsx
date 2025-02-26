import React from "react";
import IntlMessages from "@crema/utility/IntlMessages";
import { Box, Grid, styled, Typography } from "@mui/material";
import { red, indigo, amber, green, deepOrange } from "@mui/material/colors";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface EducationProps {
  data: any;
  loading: boolean;
}

const BreadWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundColor: "#fff",
  boxShadow: "0px 10px 10px 4px rgb(0 0 0 / 4%)",
  padding: "20px",
  borderRadius: 10,
  "& .icons": { fontSize: 30 },
  "& text": { fontSize: "12px", width: 50 },
}));

const Education: React.FC<EducationProps> = ({ data, loading }) => {
  const cData = [
    {
      id: 1,
      name: "Total",
      count: data?.totalEducationCount,
      color: indigo[500],
    },
    {
      id: 2,
      name: "Pending",
      count: data?.totalPendingEducation,
      color: amber[500],
    },
    {
      id: 3,
      name: "Approved",
      count: data?.totalApproveEducation,
      color: green[500],
    },
    {
      id: 4,
      name: "Reverified",
      count: data?.totalReverifyEducation,
      color: deepOrange[500],
    },
    {
      id: 5,
      name: "Completed",
      count: data?.totalCompleteEducation,
      color: green[500],
    },
    {
      id: 6,
      name: "Rejected",
      count: data?.totalRejectEducation,
      color: red[500],
    },
    {
      id: 7,
      name: "Expired",
      count: data?.totalExpiredEducation,
      color: red["A700"],
    },
  ];

  return (
    <BreadWrapper>
      <Typography
        variant="body2"
        gutterBottom
        sx={{ fontSize: { xs: "15px", sm: "16px", md: "18px" } }}
      >
        <IntlMessages id="Education Requests" />
      </Typography>
      <Grid spacing={6}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={cData} barGap={5} barSize={5}>
            <XAxis
              dataKey="name"
              angle={-90}
              height={120}
              interval={0}
              tickMargin={60}
            />
            <YAxis />
            <Tooltip labelStyle={{ color: "black" }} />
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

export default Education;
