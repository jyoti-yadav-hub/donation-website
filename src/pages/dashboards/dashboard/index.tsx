import React, { CSSProperties, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Box, Grid, Typography } from "@mui/material";
import AppInfoView from "@crema/core/AppInfoView";
import {
  ManageAccounts,
  Person,
  GroupAdd,
  VolunteerActivism,
} from "@mui/icons-material";
import Groups3OutlinedIcon from "@mui/icons-material/GroupsOutlined";
import {
  red,
  indigo,
  amber,
  green,
  deepOrange,
  orange,
  lime,
} from "@mui/material/colors";
import { AppAnimate, AppGridContainer, AppLoader } from "@crema";
import { isEmpty } from "lodash";
import UserDashboard from "./UsersDashboard/userDashboard";
import ChartComponent from "./HungerDashboard/hungerDashboard";
import getApiData from "../../../shared/helpers/apiHelper";
import { useSelector } from "react-redux";
import { AppState } from "redux/store";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Fonts } from "shared/constants/AppEnums";
// import ContentLoader from "react-content-loader";

const Dashboard = () => {
  const [pie, setPie] = useState<any>([
    { name: "Draft", value: 1 },
    { name: "Scheduled", value: 1 },
    { name: "Deleted", value: 1 },
    { name: "Live", value: 1 },
    { name: "Past", value: 1 },
  ]);
  let aautiChart: CSSProperties = {
    width: "100%",
    backgroundColor: "#fff",
    boxShadow: "0px 10px 10px 4px rgb(0 0 0 / 4%)",
    padding: "20px",
    borderRadius: "10px",
  };
  let lineTitle = {
    display: "block",
    margin: "10px 1px 8px 15px",
    lineHeight: "normal",
  };
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  // const theme = useTheme();
  const { notiData } = useSelector<AppState, AppState["Notificationdata"]>(
    ({ Notificationdata }) => Notificationdata
  );
  const [dashboardData, setDashboardData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  //API For get dashboard /orders/users/data
  async function getDashboardData(noload?: any) {
    if (noload === "noload") {
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const resp = await getApiData("admin/admin-dashboard", {}, "GET");
      if (resp.success) {
        setDashboardData(resp.data);
        let final =
          resp.data?.events && Object.keys(resp.data?.events)
            ? Object.keys(resp.data?.events).map((x) => {
                return {
                  value: resp.data?.events[x],
                  name: x,
                };
              })
            : [];
        setPie(final);
        setLoading(false);
      } else {
        toast.error(resp.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    // if (!isEmpty(notiData)) {
    getDashboardData();
    // }
  }, []);

  useEffect(() => {
    // getDashboardData();
  }, []);

  const eventTypes = [
    {
      id: 1,
      name: "Draft",
      count: dashboardData?.events?.draft || 0,
      color: indigo[500],
    },
    {
      id: 2,
      name: "Scheduled",
      count: dashboardData?.events?.scheduled || 0,
      color: green[500],
    },
    {
      id: 3,
      name: "Live",
      count: dashboardData?.events?.live || 0,
      color: amber[500],
    },
    {
      id: 4,
      name: "Deleted",
      count: dashboardData?.events?.deleted || 0,
      color: red["A700"],
    },
    {
      id: 5,
      name: "Past",
      count: dashboardData?.events?.past || 0,
      color: red["A700"],
    },
  ];

  const EducationData = [
    {
      id: 1,
      name: "Total",
      count: dashboardData?.education?.totalEducationCount || 0,
      color: indigo[500],
    },
    {
      id: 2,
      name: "Pending",
      count: dashboardData?.education?.totalPendingEducation || 0,
      color: amber[500],
    },
    {
      id: 3,
      name: "Approved",
      count: dashboardData?.education?.totalApproveEducation || 0,
      color: green[500],
    },
    {
      id: 4,
      name: "Reverified",
      count: dashboardData?.education?.totalReverifyEducation || 0,
      color: deepOrange[500],
    },
    {
      id: 5,
      name: "Completed",
      count: dashboardData?.education?.totalCompleteEducation || 0,
      color: green[500],
    },
    {
      id: 6,
      name: "Rejected",
      count: dashboardData?.education?.totalRejectEducation || 0,
      color: red[500],
    },
    {
      id: 7,
      name: "Expired",
      count: dashboardData?.education?.totalExpiredEducation || 0,
      color: red["A700"],
    },
  ];

  const FundraiserData = [
    {
      id: 1,
      name: "Total",
      count: dashboardData?.fundraiser?.totalFundraiserCount || 0,
      color: indigo[500],
    },
    {
      id: 2,
      name: "Pending",
      count: dashboardData?.fundraiser?.totalPendingFundraiser || 0,
      color: amber[500],
    },
    {
      id: 3,
      name: "Approved",
      count: dashboardData?.fundraiser?.totalApproveFundraiser || 0,
      color: green[500],
    },
    {
      id: 4,
      name: "Reverified",
      count: dashboardData?.fundraiser?.totalReverifyFundraiser || 0,
      color: deepOrange[500],
    },
    {
      id: 5,
      name: "Completed",
      count: dashboardData?.fundraiser?.totalCompleteFundraiser || 0,
      color: green[500],
    },
    {
      id: 6,
      name: "Rejected",
      count: dashboardData?.fundraiser?.totalRejectFundraiser || 0,
      color: red[500],
    },
    {
      id: 7,
      name: "Expired",
      count: dashboardData?.fundraiser?.totalExpiredFundraiser || 0,
      color: red["A700"],
    },
  ];

  const HealthData = [
    {
      id: 1,
      name: "Total",
      count: dashboardData?.health?.totalHealthCount || 0,
      color: indigo[500],
    },
    {
      id: 2,
      name: "Pending",
      count: dashboardData?.health?.totalPendingHealth || 0,
      color: amber[500],
    },
    {
      id: 3,
      name: "Approved",
      count: dashboardData?.health?.totalApproveHealth || 0,
      color: green[500],
    },
    {
      id: 4,
      name: "Reverified",
      count: dashboardData?.health?.totalReverifyHealth || 0,
      color: deepOrange[500],
    },
    {
      id: 5,
      name: "Completed",
      count: dashboardData?.health?.totalCompleteHealth || 0,
      color: green[500],
    },
    {
      id: 6,
      name: "Rejected",
      count: dashboardData?.health?.totalRejectHealth || 0,
      color: red[500],
    },
    {
      id: 7,
      name: "Expired",
      count: dashboardData?.health?.totalExpiredHealth || 0,
      color: red["A700"],
    },
  ];

  const HungerData = [
    {
      id: 1,
      name: "Total",
      count: dashboardData?.hunger?.totalHungerCount || 0,
      color: indigo[500],
    },
    {
      id: 2,
      name: "Pending",
      count: dashboardData?.hunger?.totalPendingHunger || 0,
      color: amber[500],
    },
    {
      id: 3,
      name: "Donor accept",
      count: dashboardData?.hunger?.totalDonorAcceptHunger || 0,
      color: green[500],
    },
    {
      id: 4,
      name: "Volunteer accept",
      count: dashboardData?.hunger?.totalVolunteerAcceptHunger || 0,
      color: deepOrange[500],
    },
    {
      id: 5,
      name: "Pickup",
      count: dashboardData?.hunger?.totalPickupHunger || 0,
      color: orange[300],
    },
    {
      id: 6,
      name: "In waiting",
      count: dashboardData?.hunger?.totalWaitingForVolunteerHunger || 0,
      color: lime[500],
    },
    {
      id: 7,
      name: "Cancelled",
      count: dashboardData?.hunger?.totalCancelledHunger || 0,
      color: red["A700"],
    },
    {
      id: 8,
      name: "Delivered",
      count: dashboardData?.hunger?.totalDeliveredHunger || 0,
      color: green[500],
    },
  ];

  return (
    <>
      <AppAnimate animation="transition.slideUpIn" delay={200}>
        <AppGridContainer sxStyle={{ m: 0, width: "100%" }}>
          {loading ? (
            <>
              <Grid item xs={12} sx={{ height: "calc(100vh - 80px)" }}>
                <AppLoader />
              </Grid>
            </>
          ) : (
            dashboardData &&
            !isEmpty(dashboardData) && (
              <>
                <AppGridContainer sxStyle={{ m: 0, width: "100%" }}>
                  <Grid item xs={3} md={3} lg={2.3} xl={2}>
                    <UserDashboard
                      data={dashboardData.totalUserCount}
                      bgColor={"rgba(13, 95, 154, 0.1)"}
                      title={"Total Users"}
                      loading={loading}
                      icon={
                        <Groups3OutlinedIcon
                          sx={{ color: "#0D5F9A", fontSize: 50 }}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={3} md={3} lg={2.3} xl={2}>
                    <UserDashboard
                      data={dashboardData.totalParticipantCount}
                      bgColor={"rgba(129, 201, 149, 0.1)"}
                      loading={loading}
                      title={"Participants"}
                      icon={
                        <VolunteerActivism
                          sx={{ color: "#81c995", fontSize: 50 }}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={3} md={3} lg={2.3} xl={2}>
                    <UserDashboard
                      data={dashboardData.totalJudgesCount}
                      bgColor={"rgba(0, 181, 156, 0.1)"}
                      loading={loading}
                      title={"Judges"}
                      icon={
                        <GroupAdd sx={{ color: "#00B59C", fontSize: 50 }} />
                      }
                    />
                  </Grid>
                  <Grid item xs={3} md={3} lg={2.3} xl={2}>
                    <UserDashboard
                      data={dashboardData.totalOrganizersCount}
                      bgColor={"rgba(195, 210, 70, 0.1)"}
                      loading={loading}
                      title={"Organizers"}
                      icon={
                        <ManageAccounts
                          sx={{ color: "#C3D246", fontSize: 50 }}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={3} md={3} lg={2.3} xl={2}>
                    <UserDashboard
                      data={dashboardData.totalVisitorsCount}
                      bgColor={"rgba(212, 170, 113, 0.1)"}
                      loading={loading}
                      title={"Visitors"}
                      icon={<Person sx={{ color: "#D4AA71", fontSize: 50 }} />}
                    />
                  </Grid>
                </AppGridContainer>
                <Grid item xs={6} lg={8}>
                  <Box style={aautiChart}>
                    <span style={lineTitle}>
                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: Fonts.MEDIUM,
                        }}
                      >
                        Category Report
                      </Typography>
                      {/* Up Comming Events : */}
                    </span>
                    <ul style={{ marginLeft: "80px" }}>
                      <span style={{ color: "rgb(148 144 231)" }}>
                        - Scheduled&nbsp;&nbsp;
                      </span>
                      <span style={{ color: "rgb(14,136,55)" }}>
                        - Draft&nbsp;&nbsp;
                      </span>
                      <span style={{ color: "rgb(248,195,21)" }}>
                        - Past&nbsp;&nbsp;
                      </span>
                      <span style={{ color: "rgb(236,81,81)" }}>- Live</span>
                    </ul>
                    <br /> <br />
                    {dashboardData.categoryEvent &&
                      !isEmpty(dashboardData.categoryEvent) && (
                        <div
                        // style={
                        //   dashboardData.categoryEvent.length > 6
                        //     ? overWriteGraph
                        //     : handleGraph
                        // }
                        >
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                              height={300}
                              data={dashboardData.categoryEvent}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="category" />
                              <YAxis />
                              <Tooltip />
                              {/* <Legend /> */}
                              <Line
                                type="monotone"
                                dataKey="scheduled"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="draft"
                                stroke="#82ca9d"
                                activeDot={{ r: 8 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="past"
                                stroke="#ffc658"
                                activeDot={{ r: 8 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="live"
                                stroke="#ff7300"
                                activeDot={{ r: 8 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                  </Box>
                </Grid>
                <Grid item xs={6} lg={4}>
                  <Box style={aautiChart}>
                    <span style={lineTitle}>
                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: Fonts.MEDIUM,
                        }}
                      >
                        Events Summary Pie Chart
                      </Typography>
                    </span>
                    <PieChart width={360} height={360}>
                      <Pie
                        data={pie}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        style={{ display: "inline-block" }}
                      >
                        {pie.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </Box>
                </Grid>
                <AppGridContainer sxStyle={{ m: 0, width: "100%" }}>
                  {dashboardData?.events && (
                    <Grid item xs={12} lg={12}>
                      <Typography
                        variant="body2"
                        gutterBottom
                        sx={{ fontSize: { lg: "14px", xl: "15px" } }}
                      >
                        Events Summary
                      </Typography>
                      <ChartComponent cData={eventTypes} />
                    </Grid>
                  )}
                  {dashboardData?.fundraiser && (
                    <Grid item xs={12} lg={12} sx={{ mt: 3 }}>
                      <Typography
                        variant="body2"
                        gutterBottom
                        sx={{ fontSize: { lg: "14px", xl: "15px" } }}
                      >
                        Fundraiser Requests
                      </Typography>
                      <ChartComponent cData={FundraiserData} />
                    </Grid>
                  )}

                  {dashboardData?.education && (
                    <Grid item xs={12} lg={12} sx={{ mt: 3 }}>
                      <Typography
                        variant="body2"
                        gutterBottom
                        sx={{ fontSize: { lg: "14px", xl: "15px" } }}
                      >
                        Education Requests
                      </Typography>
                      <ChartComponent cData={EducationData} />
                    </Grid>
                  )}

                  {dashboardData?.health && (
                    <Grid item xs={12} lg={12} sx={{ mt: 3 }}>
                      <Typography
                        variant="body2"
                        gutterBottom
                        sx={{ fontSize: { lg: "14px", xl: "15px" } }}
                      >
                        Health Requests
                      </Typography>
                      <ChartComponent cData={HealthData} />
                    </Grid>
                  )}

                  {dashboardData?.hunger && (
                    <Grid item xs={12} lg={12} sx={{ mt: 3 }}>
                      <Typography
                        variant="body2"
                        gutterBottom
                        sx={{ fontSize: { lg: "14px", xl: "15px" } }}
                      >
                        Hunger Requests
                      </Typography>
                      <ChartComponent cData={HungerData} />
                    </Grid>
                  )}
                  <Grid item xs={12} sx={{ mb: { lg: 2, xl: 5 } }} />
                </AppGridContainer>
              </>
            )
          )}
        </AppGridContainer>
      </AppAnimate>

      <AppInfoView />
    </>
  );
};

export default Dashboard;
