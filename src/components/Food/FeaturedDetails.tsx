import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { isEmpty } from "lodash";
import moment from "moment";
import { CancelOutlined, CheckCircleOutline } from "@mui/icons-material";
import { initialTimeFormat } from "shared/constants/AppConst";

const BodyStyle = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  boxShadow: "rgba(0, 0, 0, 0.04) 0px 10px 10px 4px",
  backgroundColor: "rgb(255, 255, 255)",
  borderRadius: "10px !important",
  padding: 10,
  "& .userDetails": {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  "& .details-text-div": {
    backgroundColor: "rgb(244, 247, 254)",
    padding: "15px 20px",
    margin: 5,
    borderRadius: "10px !important",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  "& .details-title": { fontWeight: "500", marginRight: 10 },
}));

interface FeaturedDetailsProps {
  foodDetails: any;
}

const FeaturedDetails: React.FC<FeaturedDetailsProps> = ({ foodDetails }) => {
  return (
    <BodyStyle>
      {foodDetails?.plan && !isEmpty(foodDetails?.plan) ? (
        <>
          <Grid item>
            <Typography
              variant="subtitle1"
              sx={{ fontSize: "18px", fontWeight: "500" }}
            >
              Featured Detail:
            </Typography>
          </Grid>
          <Grid item className="userDetails" style={{ marginTop: 0 }}>
            {foodDetails?.plan.map((item) => {
              return (
                <>
                  {/* is_active */}
                  <Grid item xs={6}>
                    <div className="details-text-div">
                      <Typography className="details-title">
                        Is Plan active?:
                      </Typography>
                      {item?.is_active ? (
                        <CheckCircleOutline color="success" />
                      ) : (
                        <CancelOutlined color="error" />
                      )}
                    </div>
                  </Grid>

                  {/* plan_active_date */}
                  <Grid item xs={6}>
                    <div className="details-text-div">
                      <Typography className="details-title">
                        Plan Activation Date:
                      </Typography>
                      <Typography sx={{ color: "text.secondary" }}>
                        {item?.plan_active_date
                          ? `${moment(item?.plan_active_date).format(
                              initialTimeFormat
                            )}` || "-"
                          : "-"}
                      </Typography>
                    </div>
                  </Grid>

                  {/* plan amount */}
                  <Grid item xs={6}>
                    <div className="details-text-div">
                      <Typography className="details-title">
                        Plan Amount:
                      </Typography>
                      <Typography sx={{ color: "text.secondary" }}>
                        {item?.plan_amount || "-"}
                      </Typography>
                    </div>
                  </Grid>

                  {/* plan Duration */}
                  <Grid item xs={6}>
                    <div className="details-text-div">
                      <Typography className="details-title">
                        Plan duration:
                      </Typography>
                      <Typography sx={{ color: "text.secondary" }}>
                        {item?.plan_duration || "-"}{" "}
                        {item?.plan_duration_type === "monthly"
                          ? "Months"
                          : item?.plan_duration === 1 &&
                            item?.plan_duration_type === "yearly"
                          ? "Year"
                          : item?.plan_duration_type === "yearly"
                          ? "Years"
                          : item?.plan_duration_type === "days"
                          ? "Days"
                          : null}
                      </Typography>
                    </div>
                  </Grid>

                  {/* plan_id */}
                  <Grid item xs={6}>
                    <div className="details-text-div">
                      <Typography className="details-title">
                        Plan Id:
                      </Typography>
                      <Typography sx={{ color: "text.secondary" }}>
                        {item?.plan_id || "-"}
                      </Typography>
                    </div>
                  </Grid>

                  {/* plan Title */}
                  <Grid item xs={6}>
                    <div className="details-text-div">
                      <Typography className="details-title">
                        Plan Title:
                      </Typography>
                      <Typography sx={{ color: "text.secondary" }}>
                        {item?.plan_title || "-"}
                      </Typography>
                    </div>
                  </Grid>

                  {/* plan_expired_date */}
                  <Grid item xs={6}>
                    <div className="details-text-div">
                      <Typography className="details-title">
                        Plan Expiry Date:
                      </Typography>
                      <Typography sx={{ color: "text.secondary" }}>
                        {foodDetails?.plan_expired_date
                          ? `${moment(foodDetails?.plan_expired_date).format(
                              initialTimeFormat
                            )}` || "-"
                          : "-"}
                      </Typography>
                    </div>
                  </Grid>
                </>
              );
            })}
          </Grid>
        </>
      ) : null}
    </BodyStyle>
  );
};

export default FeaturedDetails;
