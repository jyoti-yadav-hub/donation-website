import React, { useEffect, useState } from "react";
import { Avatar, Box, Grid, Grow, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { isEmpty, flattenDeep } from "lodash";
import moment from "moment";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { Cancel, CheckCircle } from "@mui/icons-material";
import SimpleBarReact from "simplebar-react";
import { initialTimeFormat } from "shared/constants/AppConst";
import { TimelineOppositeContent } from "@mui/lab";

const { flag } = require("country-emoji");

const BodyStyle = styled(SimpleBarReact)(({ theme }) => ({
  width: "100%",
  height: "100%",
  boxShadow: "rgba(0, 0, 0, 0.04) 0px 10px 10px 4px",
  backgroundColor: "rgb(255, 255, 255)",
  borderRadius: "10px !important",
  padding: 10,
  maxHeight: "calc(57vh)",
  overflowX: "hidden",
  overflowY: "auto",
  "& .top-userdata": { flexWrap: "wrap" },
  "& .commonTxtStyle": { margin: "auto 0", color: "rgb(107, 114, 128)" },
}));

interface TimeLineProps {
  foodDetails: any;
  donorsList: any;
}

const TimeLineData: React.FC<TimeLineProps> = ({ foodDetails, donorsList }) => {
  const [pageData, setPageData] = useState<any>({
    previousPage: null,
    nextPage: null,
    total: 0,
    totalPages: 0,
    items: [],
    nextEnable: false,
    page: 1,
  });

  const paginate = (page?: any, perPage: any = 10) => {
    const offset = perPage * (page - 1);
    const totalPages = Math.ceil(donorsList?.lists.length / perPage);
    const paginatedItems = donorsList?.lists.slice(offset, perPage * page);
    setPageData({
      previousPage: page - 1 ? page - 1 : null,
      nextPage: totalPages > page ? page + 1 : null,
      total: donorsList?.lists.length,
      totalPages: totalPages,
      items: flattenDeep([pageData.items, paginatedItems]),
      nextEnable: totalPages > page ? true : false,
      page: page,
    });
  };

  useEffect(() => {
    paginate(pageData.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donorsList?.lists]);

  function stringAvatar(name: string) {
    return {
      children: `${name.split(" ")[0][0]}`,
    };
  }

  return (
    <>
      <BodyStyle>
        <Grid item>
          <Typography
            variant="body2"
            sx={{ fontSize: { lg: "14px", xl: "15px" } }}
          >
            Timeline:
          </Typography>
        </Grid>
        <Grow in style={{ transformOrigin: "1 0 0" }} {...{ timeout: 2000 }}>
          <Box className="top-userdata">
            <Timeline position="alternate">
              {/* Request create by */}
              <TimelineItem>
                <TimelineOppositeContent
                  sx={{ m: "auto 0" }}
                  align="right"
                  variant="body2"
                  color="text.secondary"
                >
                  {foodDetails?.createdAt
                    ? moment(foodDetails?.createdAt).format(initialTimeFormat)
                    : "-" || "-"}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot variant="outlined">
                    {foodDetails?.userDtl?.image ? (
                      <Avatar
                        src={
                          foodDetails?.userDtl?.image ||
                          "/assets/images/placeholder.jpg"
                        }
                      />
                    ) : (
                      <Avatar
                        {...stringAvatar(
                          foodDetails?.userDtl?.display_name ||
                            foodDetails?.userDtl?.first_name ||
                            ""
                        )}
                      />
                    )}
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h6" component="span">
                    Request Created By
                  </Typography>
                  <Typography
                    noWrap={true}
                    sx={{ m: "auto 0", maxWidth: "160px" }}
                    className="commonTxtStyle"
                    variant="body2"
                  >
                    Name:{" "}
                    {foodDetails?.userDtl?.display_name ||
                      foodDetails?.uname ||
                      "-"}
                  </Typography>
                  <Typography className="commonTxtStyle" variant="body2">
                    City: {foodDetails?.userDtl?.location?.city || "-"}
                  </Typography>
                  <Typography className="commonTxtStyle" variant="body2">
                    Phone:{" "}
                    {flag(foodDetails?.userDtl?.phone_country_short_name) || ""}{" "}
                    {`${foodDetails?.userDtl?.phone_code}${foodDetails?.userDtl?.phone}` ||
                      "-"}
                  </Typography>
                  <Typography className="commonTxtStyle" variant="body2">
                    Email: {foodDetails?.userDtl?.email || "-"}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
              {/* Request status of fundraiser */}
              {(foodDetails?.category_slug === "fundraiser" ||
                foodDetails?.category_slug === "health" ||
                foodDetails?.category_slug === "education") &&
                (foodDetails?.status === "approve" ||
                  foodDetails?.approve_time) && (
                  <TimelineItem>
                    <TimelineOppositeContent
                      sx={{ m: "auto 0" }}
                      variant="body2"
                      color="text.secondary"
                    >
                      {foodDetails?.approve_time
                        ? moment(foodDetails?.approve_time).format(
                            initialTimeFormat
                          ) || "-"
                        : "-"}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineConnector />
                      <TimelineDot variant="outlined" color="info" />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="h6" component="span">
                        Request Status
                      </Typography>
                      <Typography className="commonTxtStyle" variant="body2">
                        {foodDetails?.status === "approve" ||
                        foodDetails?.approve_time ? (
                          <Typography
                            className="commonTxtStyle"
                            variant="body2"
                          >
                            Request is approved by Admin
                          </Typography>
                        ) : null}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                )}
              {/* total donations from */}
              {(foodDetails?.category_slug === "fundraiser" ||
                foodDetails?.category_slug === "health" ||
                foodDetails?.category_slug === "education") &&
              foodDetails?.total_donation > 0
                ? donorsList?.lists?.map((item: any, index: any) => {
                    return (
                      <TimelineItem>
                        <TimelineOppositeContent
                          sx={{ m: "auto 0" }}
                          align="right"
                          variant="body2"
                          color="text.secondary"
                        >
                          {item?.createdAt
                            ? moment(item?.createdAt).format(initialTimeFormat)
                            : "-" || "-"}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineConnector sx={{ height: 5 }} />
                          <TimelineDot variant="outlined">
                            {item?.userData?.image ? (
                              <Avatar
                                src={
                                  item?.userData?.image ||
                                  "/assets/images/placeholder.jpg"
                                }
                              />
                            ) : (
                              <Avatar
                                {...stringAvatar(
                                  item?.userData?.user_name || ""
                                )}
                              />
                            )}
                          </TimelineDot>
                          <TimelineConnector sx={{ height: 5 }} />
                        </TimelineSeparator>
                        <TimelineContent sx={{ py: 5 }}>
                          <Typography variant="h6" component="span">
                            Donation {index + 1}
                          </Typography>
                          <Typography
                            className="commonTxtStyle"
                            variant="body2"
                          >
                            {item?.donor_name} has donate{" "}
                            <b>
                              {item?.currency}
                              {item?.amount}
                            </b>
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                    );
                  })
                : null}
              {/* Total Donations */}
              {(foodDetails?.category_slug === "fundraiser" ||
                foodDetails?.category_slug === "health" ||
                foodDetails?.category_slug === "education") &&
                foodDetails?.total_donation > 0 && (
                  <TimelineItem>
                    <TimelineOppositeContent
                      sx={{ m: "auto 0" }}
                      align="right"
                      variant="body2"
                      color="text.secondary"
                    >
                      <Typography variant="h6" component="span">
                        Total Donations
                      </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineConnector />
                      <TimelineDot variant="outlined" color="info" />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography className="commonTxtStyle" variant="body2">
                        <b>{foodDetails?.form_data?.title_of_fundraiser}</b>{" "}
                        Request has collected{" "}
                        {foodDetails?.country_data?.currency}
                        {foodDetails?.total_donation} total donation from{" "}
                        <b>{foodDetails?.total_donors} Donor(s)</b>
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                )}
              {/* Request status */}
              {foodDetails?.status === "approve" ? null : (
                <TimelineItem>
                  {(foodDetails?.status === "expired" ||
                    foodDetails?.status === "reject") && (
                    <TimelineOppositeContent
                      sx={{ m: "auto 0" }}
                      variant="body2"
                      color="text.secondary"
                    >
                      {foodDetails?.form_data?.expiry_date
                        ? moment(foodDetails?.form_data?.expiry_date).format(
                            initialTimeFormat
                          ) || "-"
                        : foodDetails?.reject_time
                        ? moment(foodDetails?.reject_time).format(
                            initialTimeFormat
                          ) || "-"
                        : "-"}
                    </TimelineOppositeContent>
                  )}
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot
                      variant="outlined"
                      color={
                        foodDetails?.status === "reject"
                          ? "error"
                          : foodDetails?.status === "close"
                          ? "grey"
                          : "info"
                      }
                    >
                      {foodDetails?.status === "completed" ||
                      foodDetails?.status === "complete" ||
                      foodDetails?.status === "close" ? (
                        <CheckCircle color="success" />
                      ) : null}
                      {(foodDetails?.category_slug === "fundraiser" ||
                        foodDetails?.category_slug === "health") &&
                      (foodDetails?.status === "expired" ||
                        foodDetails?.status === "reject") ? (
                        <Cancel color="error" />
                      ) : null}
                    </TimelineDot>
                    {foodDetails?.status === "pending" ||
                    foodDetails?.status === "expired" ||
                    foodDetails?.status === "close" ||
                    foodDetails?.status === "complete" ? null : (
                      <TimelineConnector />
                    )}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span">
                      Request Status
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      {foodDetails?.status === "accepted" ||
                      foodDetails?.status === "donor_accept"
                        ? "Donor accepted request"
                        : foodDetails?.status === "volunteer_accept"
                        ? "Volunteer accepted request"
                        : foodDetails?.status === "delivered"
                        ? "Order delivered"
                        : foodDetails?.status === "cancelled"
                        ? "Request cancelled"
                        : (foodDetails?.category_slug === "fundraiser" ||
                            foodDetails?.category_slug === "health") &&
                          foodDetails?.status === "pending"
                        ? "Request is pending. Admin not approved yet"
                        : foodDetails?.status === "pending"
                        ? "Request is pending. Waiting for accept the request"
                        : foodDetails?.status === "pickup"
                        ? "Order is pickedup and going for delivery."
                        : foodDetails?.status === "waiting_for_volunteer"
                        ? `Request is accepted by Donor (${
                            foodDetails?.donor_accept?.user_name || "-"
                          }) and sent to Volunteer. Wait until Volunteer accept the request.`
                        : foodDetails?.status === "rejected"
                        ? "Request is Rejected"
                        : foodDetails?.status === "reject"
                        ? "Request rejected by Admin"
                        : foodDetails?.status === "completed" ||
                          foodDetails?.status === "complete"
                        ? "Request is completed. Goal Amount is acheived"
                        : foodDetails?.status === "expired"
                        ? `Request is expired because time limit of request is over. Expiry date of fundraiser is ${moment(
                            foodDetails?.form_data?.expiry_date
                          ).format(initialTimeFormat)}`
                        : foodDetails?.status === "close"
                        ? "Request is closed and amount was transferred to the requestor account"
                        : ""}
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      {foodDetails?.category_slug === "hunger" &&
                      foodDetails?.status === "pending"
                        ? "Request is sent to Donor. Wait until Donor accept the request"
                        : null}
                      {/* {(foodDetails?.category_slug !== "fundraiser" ||
                        foodDetails?.category_slug !== "health") &&
                      foodDetails?.status === "pending"
                        ? "Request is sent to Donor. Wait until Donor accept the request"
                        : ""} */}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              )}
              {/* Order is accepted by (Donor) */}
              {(foodDetails?.status === "donor_accept" ||
                !isEmpty(foodDetails?.donor_accept)) && (
                <TimelineItem>
                  <TimelineOppositeContent
                    sx={{ m: "auto 0" }}
                    variant="body2"
                    color="text.secondary"
                  >
                    {foodDetails?.donor_accept?.accept_time
                      ? moment(foodDetails?.donor_accept?.accept_time).format(
                          initialTimeFormat
                        ) || "-"
                      : "-"}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot variant="outlined">
                      {foodDetails?.donor_accept?.image ? (
                        <Avatar
                          src={
                            foodDetails?.donor_accept?.image ||
                            "/assets/images/placeholder.jpg"
                          }
                        />
                      ) : (
                        <Avatar
                          {...stringAvatar(
                            foodDetails?.donor_accept?.user_name || ""
                          )}
                        />
                      )}
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span">
                      Request is accepted by (Donor)
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      Name: {foodDetails?.donor_accept?.user_name || "-"}
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      City: {foodDetails?.donor_accept?.address || "-"}
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      Phone:
                      {/* {flag(foodDetails?.country_data?.country_code) || ""}{" "} */}
                      {foodDetails?.donor_accept?.phone || "-"}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              )}
              {/* Order is picked by (Donor) */}
              {foodDetails?.deliver_by_self && (
                <TimelineItem>
                  <TimelineOppositeContent
                    sx={{ m: "auto 0" }}
                    variant="body2"
                    color="text.secondary"
                  >
                    <Typography className="commonTxtStyle" variant="body2">
                      {foodDetails?.picked_up_time
                        ? moment(foodDetails?.picked_up_time).format(
                            initialTimeFormat
                          )
                        : ""}
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      Request accepted and Donor is going for delivery.
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot variant="outlined" color="warning" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span">
                      Order is picked by (Donor)
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      Name: {foodDetails?.donor_accept?.user_name || "-"}
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      City: {foodDetails?.donor_accept?.address || "-"}
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      Phone:
                      {/* {flag(foodDetails?.country_data?.country_code) || ""}{" "} */}
                      {foodDetails?.donor_accept?.phone || "-"}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              )}
              {/* Order is accepted by (Volunteer) */}
              {(foodDetails?.status === "volunteer_accept" ||
                !isEmpty(foodDetails?.volunteer_accept)) && (
                <TimelineItem>
                  <TimelineOppositeContent
                    sx={{ m: "auto 0" }}
                    variant="body2"
                    color="text.secondary"
                  >
                    {foodDetails?.volunteer_accept_time
                      ? moment(foodDetails?.volunteer_accept_time).format(
                          initialTimeFormat
                        ) || "-"
                      : foodDetails?.volunteer_accept?.accept_time
                      ? moment(
                          foodDetails?.volunteer_accept?.accept_time
                        ).format(initialTimeFormat) || "-"
                      : "-"}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot variant="outlined">
                      {foodDetails?.volunteer_accept?.image ? (
                        <Avatar
                          src={
                            foodDetails?.volunteer_accept?.image ||
                            "/assets/images/placeholder.jpg"
                          }
                        />
                      ) : (
                        <Avatar
                          {...stringAvatar(
                            foodDetails?.volunteer_accept?.user_name ||
                              foodDetails?.volunteer_name ||
                              ""
                          )}
                        />
                      )}
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span">
                      Request is accepted by (Volunteer)
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      Name: {foodDetails?.volunteer_accept?.user_name || "-"}
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      City: {foodDetails?.volunteer_accept?.address || "-"}
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      Phone:{" "}
                      {/* {flag(foodDetails?.country_data?.country_code) || ""}{" "} */}
                      {foodDetails?.volunteer_accept?.phone || "-"}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              )}
              {/* Order is picked by (Volunteer) */}
              {foodDetails?.deliver_by_self === false && (
                <TimelineItem>
                  <TimelineOppositeContent
                    sx={{ m: "auto 0" }}
                    variant="body2"
                    color="text.secondary"
                  >
                    <Typography className="commonTxtStyle" variant="body2">
                      {foodDetails?.picked_up_time
                        ? moment(foodDetails?.picked_up_time).format(
                            initialTimeFormat
                          )
                        : ""}
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      Request accepted and Volunteer is going for delivery.
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot variant="outlined" color="warning" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span">
                      Order is picked by (Volunteer)
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      Name: {foodDetails?.volunteer_accept?.user_name || "-"}
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      City: {foodDetails?.volunteer_accept?.address || "-"}
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      Phone:
                      {/* {flag(foodDetails?.country_data?.country_code) || ""}{" "} */}
                      {foodDetails?.volunteer_accept?.phone || "-"}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              )}
              {/* Delivered by */}
              {foodDetails?.status === "delivered" && (
                <TimelineItem>
                  <TimelineOppositeContent
                    sx={{ m: "auto 0" }}
                    variant="body2"
                    color="text.secondary"
                  >
                    <Typography className="commonTxtStyle" variant="body2">
                      {foodDetails?.deliver_time
                        ? moment(foodDetails?.deliver_time).format(
                            initialTimeFormat
                          )
                        : ""}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot variant="outlined" color="success">
                      <CheckCircle color="success" />
                    </TimelineDot>
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span">
                      Delivered by (
                      {foodDetails?.deliver_by_self ? "Donor" : "Volunteer"})
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      Name:{" "}
                      {foodDetails?.deliver_by_self
                        ? foodDetails?.donor_accept?.user_name
                        : foodDetails?.volunteer_accept?.user_name || "-"}
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      City:{" "}
                      {foodDetails?.deliver_by_self
                        ? foodDetails?.donor_accept?.address
                        : foodDetails?.volunteer_accept?.address || "-"}
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      Phone:{" "}
                      {/* {flag(foodDetails?.country_data?.country_code) || ""}{" "} */}
                      {foodDetails?.deliver_by_self
                        ? foodDetails?.donor_accept?.phone
                        : foodDetails?.volunteer_accept?.phone || "-"}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              )}

              {/* Cancelled by */}
              {foodDetails?.status === "cancelled" && (
                <TimelineItem>
                  <TimelineOppositeContent
                    sx={{ m: "auto 0" }}
                    variant="body2"
                    color="text.secondary"
                  >
                    <Typography className="commonTxtStyle" variant="body2">
                      {foodDetails?.cancelled_at
                        ? moment(foodDetails?.cancelled_at).format(
                            initialTimeFormat
                          )
                        : ""}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot variant="outlined" color="error">
                      <Cancel color="error" />
                    </TimelineDot>
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span">
                      Cancelled by
                    </Typography>
                    <Typography className="commonTxtStyle" variant="body2">
                      {foodDetails?.cancelled_by === "donor"
                        ? `Request was cancelled by Donor`
                        : foodDetails?.cancelled_by === "volunteer"
                        ? `Request was cancelled by Volunteer`
                        : foodDetails?.cancelled_by === "requestor"
                        ? `Request was cancelled by requestor`
                        : foodDetails?.cancelled_by === "auto"
                        ? `Request was cancelled because no ${
                            !isEmpty(foodDetails?.donor_accept)
                              ? "Volunteers"
                              : "Donors"
                          } were found.`
                        : "-"}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              )}
            </Timeline>
          </Box>
        </Grow>
      </BodyStyle>
    </>
  );
};

export default TimeLineData;
