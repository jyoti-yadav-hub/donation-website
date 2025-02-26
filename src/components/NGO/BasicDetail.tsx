import React from "react";
import { Box, Chip, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { isEmpty } from "lodash";
import { Remove, CheckCircle, FlipCameraAndroid } from "@mui/icons-material";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
import BoxCards from "components/Food/BoxCard";
const { flag } = require("country-emoji");

const BodyStyle = styled(Box)(({ theme }) => ({
  width: "100%",
  paddingLeft: 16,
  "& .userDetails": {
    boxShadow: "rgba(0, 0, 0, 0.04) 0px 10px 10px 4px",
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: "10px !important",
    padding: 10,
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  "& .details-text-div": {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 10,
    backgroundColor: "rgb(244, 247, 254)",
    borderRadius: 5,
    margin: 5,
  },
  "& .txtStyle": {
    fontSize: "13px",
    fontWeight: "500",
    wordBreak: "break-word",
    [theme.breakpoints.down("xl")]: { fontSize: "12px" },
  },
  "& .cardTitle": {
    [theme.breakpoints.down("xl")]: { fontSize: "12px" },
  },
}));

interface BasicDetailNGOProps {
  ngoDetail: any;
  from?: any;
}

const BasicDetailNGO: React.FC<BasicDetailNGOProps> = ({ ngoDetail, from }) => {
  return (
    <BodyStyle>
      {/* User Data View */}
      <Grid container spacing={4} xs={12} style={{ margin: 0 }}>
        <Grid item xs={12} sm={12} sx={{ pl: "0px !important" }}>
          {ngoDetail?.updated_data ? (
            <Typography
              gutterBottom
              variant="body2"
              sx={{ fontSize: { lg: "14px", xl: "15px" } }}
            >
              Old Data
            </Typography>
          ) : null}
          <div className="userDetails">
            {/* NGO Name */}
            <Grid
              item
              xs={ngoDetail?.updated_data ? 12 : 6}
              lg={ngoDetail?.updated_data ? 6 : 4}
              xl={ngoDetail?.updated_data ? 6 : 3}
            >
              <BoxCards title="NGO Name" values={ngoDetail?.ngo_name || "-"} />
            </Grid>
            {/* NGO Phone */}
            <Grid
              item
              xs={ngoDetail?.updated_data ? 12 : 6}
              lg={ngoDetail?.updated_data ? 6 : 4}
              xl={ngoDetail?.updated_data ? 6 : 3}
            >
              <BoxCards
                title="NGO Phone"
                values={`${flag(ngoDetail?.phone_country_short_name || "")}
                  ${ngoDetail?.ngo_phone_code || ""} ${
                  ngoDetail?.ngo_phone || ""
                }`}
              />
            </Grid>
            {/* NGO secondary Phone */}
            {ngoDetail && ngoDetail?.secondary_phone ? (
              <Grid
                item
                xs={ngoDetail?.updated_data ? 12 : 6}
                lg={ngoDetail?.updated_data ? 6 : 4}
                xl={ngoDetail?.updated_data ? 6 : 3}
              >
                <BoxCards
                  title="NGO Secondary Phone"
                  values={`${flag(
                    ngoDetail?.secondary_country_short_name || ""
                  )}
                  ${ngoDetail?.secondary_phone_code || ""} ${
                    ngoDetail?.secondary_phone || ""
                  }`}
                />
              </Grid>
            ) : null}
            {/* NGO Email */}
            {ngoDetail && ngoDetail?.ngo_email ? (
              <Grid
                item
                xs={ngoDetail?.updated_data ? 12 : 6}
                lg={ngoDetail?.updated_data ? 6 : 4}
                xl={ngoDetail?.updated_data ? 6 : 3}
              >
                <BoxCards
                  title="NGO Email"
                  values={ngoDetail?.ngo_email || "-"}
                />
              </Grid>
            ) : null}
            {/* NGO Registration Number */}
            <Grid
              item
              xs={ngoDetail?.updated_data ? 12 : 6}
              lg={ngoDetail?.updated_data ? 6 : 4}
              xl={ngoDetail?.updated_data ? 6 : 3}
            >
              <BoxCards
                title="NGO Registration Number"
                values={ngoDetail?.ngo_registration_number || "-"}
              />
            </Grid>
            {/* NGO Verified */}
            <Grid
              item
              xs={ngoDetail?.updated_data ? 12 : 6}
              lg={ngoDetail?.updated_data ? 6 : 4}
              xl={ngoDetail?.updated_data ? 6 : 3}
            >
              <div className="details-text-div">
                <Typography className="cardTitle">NGO Verified</Typography>
                {ngoDetail?.ngo_status === "approve" ? (
                  <CheckCircle color="success" />
                ) : ngoDetail?.ngo_status === "reverify" ? (
                  <FlipCameraAndroid color="warning" />
                ) : (
                  <Remove color="error" />
                )}
              </div>
            </Grid>
            {/* NGO Create Date */}
            <Grid
              item
              xs={ngoDetail?.updated_data ? 12 : 6}
              lg={ngoDetail?.updated_data ? 6 : 4}
              xl={ngoDetail?.updated_data ? 6 : 3}
            >
              <BoxCards
                title="NGO Create Date"
                values={
                  moment(ngoDetail?.createdAt).format(initialTimeFormat) || "-"
                }
              />
            </Grid>
            {/* NGO Expiry Date */}
            <Grid
              item
              xs={ngoDetail?.updated_data ? 12 : 6}
              lg={ngoDetail?.updated_data ? 6 : 4}
              xl={ngoDetail?.updated_data ? 6 : 3}
            >
              <BoxCards
                title="NGO Expiry Date"
                values={
                  moment(ngoDetail?.expiry_date).format(initialTimeFormat) ||
                  "-"
                }
              />
            </Grid>
            {/* Deactivated time */}
            {!isEmpty(ngoDetail?.deletedAt) && from === "deletedNGO" && (
              <Grid
                item
                xs={ngoDetail?.updated_data ? 12 : 6}
                lg={ngoDetail?.updated_data ? 6 : 4}
                xl={ngoDetail?.updated_data ? 6 : 3}
              >
                <BoxCards
                  title="Deactivated Time"
                  values={
                    moment(ngoDetail?.deletedAt).format(initialTimeFormat) ||
                    "-"
                  }
                />
              </Grid>
            )}
            {/* Deactivated reason */}
            {!isEmpty(ngoDetail?.delete_account_reason) &&
              from === "deletedNGO" && (
                <Grid
                  item
                  xs={ngoDetail?.updated_data ? 12 : 6}
                  lg={ngoDetail?.updated_data ? 6 : 4}
                  xl={ngoDetail?.updated_data ? 6 : 3}
                >
                  <BoxCards
                    title="Deactivate Reason"
                    values={ngoDetail?.delete_account_reason || "-"}
                  />
                </Grid>
              )}
            {/* NGO Causes */}
            <Grid
              item
              xs={ngoDetail?.updated_data ? 12 : 6}
              lg={ngoDetail?.updated_data ? 6 : 4}
              xl={ngoDetail?.updated_data ? 6 : 3}
            >
              <BoxCards
                title="Causes"
                values={ngoDetail?.delete_account_reason || "-"}
                isStack={true}
                renderStack={() => {
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {ngoDetail?.ngo_causes?.map((it: any, index: number) => {
                        return (
                          <Chip
                            className="txtStyle"
                            sx={{
                              mt: 1,
                              mr:
                                index !== ngoDetail?.ngo_causes?.length - 1
                                  ? 1
                                  : 0,
                            }}
                            label={
                              it.charAt(0).toUpperCase() + it.slice(1) || "-"
                            }
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  );
                }}
              />
            </Grid>
            {/* NGO Status */}
            {from === "deletedNGO" ? null : (
              <>
                <Grid
                  item
                  xs={ngoDetail?.updated_data ? 12 : 6}
                  lg={ngoDetail?.updated_data ? 6 : 4}
                  xl={ngoDetail?.updated_data ? 6 : 3}
                >
                  <BoxCards
                    isChip={true}
                    title="Status"
                    style={{
                      color: "#FFF",
                      backgroundColor:
                        ngoDetail?.ngo_status === "approve"
                          ? "#2e7d32" //success
                          : ngoDetail?.ngo_status === "reject" ||
                            ngoDetail?.ngo_status === "blocked" ||
                            ngoDetail?.ngo_status === "expired"
                          ? "#d32f2f" //error
                          : ngoDetail?.ngo_status === "waiting_for_verify"
                          ? "#1976d2"
                          : ngoDetail?.ngo_status === "pending"
                          ? "#9c27b0" //secondary
                          : ngoDetail?.ngo_status === "reverify"
                          ? "#ed6c02" //warning
                          : "#ebebeb", //default
                    }}
                    values={
                      ngoDetail?.ngo_status === "approve"
                        ? "Approved"
                        : ngoDetail?.ngo_status === "reject"
                        ? "Rejected"
                        : ngoDetail?.ngo_status === "waiting_for_verify"
                        ? "Waiting for Verify"
                        : ngoDetail?.ngo_status?.charAt(0).toUpperCase() +
                            ngoDetail?.ngo_status?.slice(1) || "-"
                    }
                  />
                </Grid>
                {/* Reject Reason */}
                {ngoDetail?.reject_reason && (
                  <Grid
                    item
                    xs={ngoDetail?.updated_data ? 12 : 6}
                    lg={ngoDetail?.updated_data ? 6 : 4}
                    xl={ngoDetail?.updated_data ? 6 : 3}
                  >
                    <BoxCards
                      title="Reject Reason"
                      values={ngoDetail?.reject_reason || "-"}
                    />
                  </Grid>
                )}
              </>
            )}
            {/* Total Donation */}
            <Grid
              item
              xs={ngoDetail?.updated_data ? 12 : 6}
              lg={ngoDetail?.updated_data ? 6 : 4}
              xl={ngoDetail?.updated_data ? 6 : 3}
            >
              <BoxCards
                title="Total Donation"
                values={
                  ngoDetail?.totalDonation
                    ?.toFixed(2)
                    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0
                }
              />
            </Grid>
            {/* Remaining Amount To Transfer */}
            <Grid
              item
              xs={ngoDetail?.updated_data ? 12 : 6}
              lg={ngoDetail?.updated_data ? 6 : 4}
              xl={ngoDetail?.updated_data ? 6 : 3}
            >
              <BoxCards
                title="Remaining Amount To Transfer"
                values={
                  ngoDetail?.newDonation
                    ?.toFixed(2)
                    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0
                }
              />
            </Grid>
            {/* NGO Location */}
            <Grid item xs={12}>
              <BoxCards
                title="NGO Location"
                values={ngoDetail?.ngo_location?.city || "-"}
              />
            </Grid>
          </div>
        </Grid>
      </Grid>
    </BodyStyle>
  );
};

export default BasicDetailNGO;
