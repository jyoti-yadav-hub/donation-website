import React, { useState } from "react";
import { Box, Grid, Grow, styled, Typography } from "@mui/material";
import { AppAnimate, AppGridContainer } from "@crema";
import IntlMessages from "@crema/utility/IntlMessages";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";

const BodyStyle = styled(Box)(({ theme }) => ({
  marginTop: -10,
  "& .userDetails": {
    boxShadow: "rgba(0, 0, 0, 0.04) 0px 10px 10px 4px",
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: "10px !important",
    padding: 10,
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  "& .details-text-div": {
    backgroundColor: "rgb(244, 247, 254)",
    padding: "15px 20px",
    margin: 5,
    borderRadius: "10px !important",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  "& .details-title": { fontWeight: "500", marginRight: 10 },
  "& .btnsDiv": { display: "flex", alignItems: "center" },
  "& .topDiv": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: "60px",
    backgroundColor: "#f4f7fe",
    zIndex: 10,
    padding: "10px",
  },
}));

const DetailViewWrapper = styled(Box)(({ theme }) => {
  return {
    transition: "all 0.5s ease",
    transform: "translateX(100%)",
    width: "100%",
    height: "100%",
    zIndex: 1,
    opacity: 0,
    visibility: "hidden",
  };
});

const CausesDetails = () => {
  const [causeDetail, setCauseDetail] = useState<any>({});

  return (
    <AppAnimate animation="transition.slideUpIn" delay={200}>
      <DetailViewWrapper>
        <BodyStyle>
          <Grid container className="topDiv">
            <Typography
              variant="button"
              sx={{ fontSize: { xs: "18px", sm: "18px", md: "22px" } }}
            >
              <IntlMessages id="Generic Cause Detail" />:
            </Typography>
          </Grid>
          {/* Top View */}
          <AppGridContainer
            spacing={4}
            sxStyle={{ margin: "-9px", width: "auto" }}
          >
            {/* Status And Other Deatils View */}
            <Grow in {...{ timeout: 1500 }}>
              <Grid item xs={12} sm={12}>
                <div className="userDetails">
                  <Grid item xs={3} className="gridBackgroundCard">
                    <div className="details-text-div">
                      <Typography className="details-title">ID:</Typography>
                      <Typography>{causeDetail?._id || "-"}</Typography>
                    </div>
                  </Grid>
                  <Grid item xs={3} className="gridBackgroundCard">
                    <div className="details-text-div">
                      <Typography className="details-title">Name:</Typography>
                      <Typography>{causeDetail?.name || "-"}</Typography>
                    </div>
                  </Grid>
                  <Grid item xs={3} className="gridBackgroundCard">
                    <div className="details-text-div">
                      <Typography className="details-title">Slug:</Typography>
                      <Typography>{causeDetail?.slug || "-"}</Typography>
                    </div>
                  </Grid>
                  <Grid item xs={3} className="gridBackgroundCard">
                    <div className="details-text-div">
                      <Typography className="details-title">
                        Description:
                      </Typography>
                      <Typography>{causeDetail?.description || "-"}</Typography>
                    </div>
                  </Grid>
                  <Grid item xs={3} className="gridBackgroundCard">
                    <div className="details-text-div">
                      <Typography className="details-title">
                        Create Date:
                      </Typography>
                      <Typography>
                        {moment(causeDetail?.createdAt).format(
                          initialTimeFormat
                        ) || "-"}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={3} className="gridBackgroundCard">
                    <div className="details-text-div">
                      <Typography className="details-title">
                        Who can access?:
                      </Typography>
                      {causeDetail &&
                        causeDetail?.who_can_access &&
                        causeDetail?.who_can_access.map((name: any) => {
                          return (
                            <Typography>
                              {name.who_can_access || "-"}
                            </Typography>
                          );
                        })}
                    </div>
                  </Grid>
                </div>
              </Grid>
            </Grow>
            <Grid item>
              <Typography
                variant="caption"
                sx={{ fontSize: { xs: "14px", sm: "16px", md: "18px" } }}
              >
                <IntlMessages id="Form Detail" />:
              </Typography>
            </Grid>
          </AppGridContainer>
        </BodyStyle>
      </DetailViewWrapper>
    </AppAnimate>
  );
};

export default CausesDetails;
