import React from "react";
import { Box, Chip, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Remove, CheckCircle, FlipCameraAndroid } from "@mui/icons-material";
import moment from "moment";
import { isEmpty } from "lodash";
import { initialTimeFormat } from "shared/constants/AppConst";
import BoxCards from "components/Food/BoxCard";
const { flag } = require("country-emoji");

const BodyStyle = styled(Box)(({ theme }) => ({
  width: "100%",
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

interface UpdateBasicDetailNGOProps {
  ngoDetail: any;
  from?: any;
}

const UpdateBasicDetailNGO: React.FC<UpdateBasicDetailNGOProps> = ({
  ngoDetail,
  from,
}) => {
  const ngoName = ngoDetail?.ngo_name === ngoDetail?.updated_data?.ngo_name;
  const ngoPhoneCode =
    ngoDetail?.ngo_phone_code === ngoDetail?.updated_data?.ngo_phone_code;
  const ngoPhone = ngoDetail?.ngo_phone === ngoDetail?.updated_data?.ngo_phone;
  const ngoSecPhoneCode =
    ngoDetail?.secondary_phone_code ===
    ngoDetail?.updated_data?.secondary_phone_code;
  const ngoSecPhone =
    ngoDetail?.secondary_phone === ngoDetail?.updated_data?.secondary_phone;
  const ngoEmail = ngoDetail?.ngo_email === ngoDetail?.updated_data?.ngo_email;
  const ngoRegNo =
    ngoDetail?.ngo_registration_number ===
    ngoDetail?.updated_data?.ngo_registration_number;
  const ngoCauses =
    JSON.stringify(ngoDetail?.ngo_causes) ===
    JSON.stringify(ngoDetail?.updated_data?.ngo_causes);
  const ngoLocation =
    ngoDetail?.ngo_location?.city ===
    ngoDetail?.updated_data?.ngo_location?.city;
  const ngoDate =
    moment(ngoDetail?.expiry_date).format("DD/MMM/YYYY") ===
    moment(ngoDetail?.updated_data?.expiry_date).format("DD/MMM/YYYY");

  return (
    <BodyStyle>
      <Grid container spacing={4} xs={12} sx={{ m: 0, width: "100%" }}>
        <Grid item xs={12} sx={{ m: 0, pl: "0px !important" }}>
          <Typography
            gutterBottom
            variant="body2"
            sx={{ fontSize: { lg: "14px", xl: "15px" } }}
          >
            Updated Data
          </Typography>
          <div className="userDetails">
            {/* NGO Name */}
            <Grid item xs={12} md={6}>
              <div className="details-text-div">
                <Typography className="cardTitle">NGO Name</Typography>
                <Typography
                  variant="subtitle1"
                  className="txtStyle"
                  sx={{
                    backgroundColor: ngoName ? "rgb(244, 247, 254)" : "#91ED91",
                  }}
                >
                  {ngoDetail?.updated_data?.ngo_name || "-"}
                </Typography>
              </div>
            </Grid>
            {/* NGO Phone */}
            <Grid item xs={12} md={6}>
              <div className="details-text-div">
                <Typography className="cardTitle">NGO Phone</Typography>
                <Typography
                  variant="subtitle1"
                  className="txtStyle"
                  sx={{
                    backgroundColor:
                      ngoPhoneCode && ngoPhone
                        ? "rgb(244, 247, 254)"
                        : "#91ED91",
                  }}
                >
                  {flag(ngoDetail?.updated_data?.phone_country_short_name) ||
                    ""}{" "}
                  {`${ngoDetail?.updated_data?.ngo_phone_code}${ngoDetail?.updated_data?.ngo_phone}` ||
                    "-"}
                </Typography>
              </div>
            </Grid>
            {/* NGO secondary Phone */}
            {ngoDetail && ngoDetail?.updated_data?.secondary_phone ? (
              <Grid item xs={12} md={6}>
                <div className="details-text-div">
                  <Typography className="cardTitle">
                    NGO Secondary Phone
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className="txtStyle"
                    sx={{
                      backgroundColor:
                        ngoSecPhoneCode && ngoSecPhone
                          ? "rgb(244, 247, 254)"
                          : "#91ED91",
                    }}
                  >
                    {flag(
                      ngoDetail?.updated_data?.secondary_country_short_name
                    ) || ""}{" "}
                    {`${ngoDetail?.updated_data?.secondary_phone_code}${ngoDetail?.updated_data?.secondary_phone}` ||
                      "-"}
                  </Typography>
                </div>
              </Grid>
            ) : null}
            {/* NGO Email */}
            <Grid item xs={12} md={6}>
              <div className="details-text-div">
                <Typography className="cardTitle">NGO Email</Typography>
                <Typography
                  variant="subtitle1"
                  className="txtStyle"
                  sx={{
                    backgroundColor: ngoEmail
                      ? "rgb(244, 247, 254)"
                      : "#91ED91",
                  }}
                >
                  {ngoDetail?.updated_data?.ngo_email || "-"}
                </Typography>
              </div>
            </Grid>
            {/* NGO Registration Number */}
            <Grid item xs={12} md={6}>
              <div className="details-text-div">
                <Typography className="cardTitle">
                  NGO Registration Number
                </Typography>
                <Typography
                  variant="subtitle1"
                  className="txtStyle"
                  sx={{
                    backgroundColor: ngoRegNo
                      ? "rgb(244, 247, 254)"
                      : "#91ED91",
                  }}
                >
                  {ngoDetail?.updated_data?.ngo_registration_number || "-"}
                </Typography>
              </div>
            </Grid>
            {/* NGO Verified */}
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
              <div className="details-text-div">
                <Typography className="cardTitle">NGO Create Date</Typography>
                <Typography variant="subtitle1" className="txtStyle">
                  {moment(ngoDetail?.createdAt).format(initialTimeFormat) ||
                    "-"}
                </Typography>
              </div>
            </Grid>
            {/* NGO Expiry Date */}
            <Grid item xs={12} md={6}>
              <div className="details-text-div">
                <Typography className="cardTitle">NGO Expiry Date</Typography>
                <Typography
                  variant="subtitle1"
                  className="txtStyle"
                  sx={{
                    backgroundColor: ngoDate ? "rgb(244, 247, 254)" : "#91ED91",
                  }}
                >
                  {moment(ngoDetail?.updated_data?.expiry_date).format(
                    "DD/MMM/YYYY"
                  ) || "-"}
                </Typography>
              </div>
            </Grid>
            {/* Deactivated time */}
            {!isEmpty(ngoDetail?.deletedAt) && from === "deletedNGO" && (
              <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
                  <BoxCards
                    title="Deactivate Reason"
                    values={ngoDetail?.delete_account_reason || "-"}
                  />
                </Grid>
              )}
            {/* NGO Causes */}
            <Grid item xs={12} md={6}>
              <div className="details-text-div">
                <Typography className="cardTitle">Causes</Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {ngoDetail?.updated_data?.ngo_causes?.map(
                    (it: any, index: number) => {
                      return (
                        <Chip
                          sx={{
                            backgroundColor: ngoCauses ? "#E3E6EC" : "#91ED91",
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
                    }
                  )}
                </Box>
              </div>
            </Grid>
            {/* NGO Status */}
            <Grid item xs={12} md={6}>
              <div className="details-text-div">
                <Typography className="cardTitle">Status</Typography>
                <Chip
                  style={{
                    color: "#FFF",
                    backgroundColor:
                      ngoDetail?.ngo_status === "approve"
                        ? "#2e7d32" //success
                        : ngoDetail?.ngo_status === "reject" ||
                          ngoDetail?.ngo_status === "blocked"
                        ? "#d32f2f" //error
                        : ngoDetail?.ngo_status === "waiting_for_verify"
                        ? "#1976d2"
                        : ngoDetail?.ngo_status === "pending"
                        ? "#9c27b0" //secondary
                        : ngoDetail?.ngo_status === "reverify"
                        ? "#ed6c02" //warning
                        : "#ebebeb", //default
                  }}
                  label={
                    ngoDetail?.ngo_status === "approve"
                      ? "Approved"
                      : ngoDetail?.ngo_status === "reject"
                      ? "Rejected"
                      : ngoDetail?.ngo_status === "waiting_for_verify"
                      ? "Waiting for Verify"
                      : ngoDetail?.ngo_status?.charAt(0).toUpperCase() +
                          ngoDetail?.ngo_status?.slice(1) || "-"
                  }
                  size="small"
                />
              </div>
            </Grid>
            {/* Reject Reason */}
            {ngoDetail?.reject_reason && (
              <Grid item xs={12} md={6}>
                <BoxCards
                  title="Reject Reason"
                  values={ngoDetail?.reject_reason || "-"}
                />
              </Grid>
            )}
            {/* Total Donation */}
            <Grid item xs={12} md={6}>
              <div className="details-text-div">
                <Typography className="cardTitle">Total Donation</Typography>
                <Typography variant="subtitle1" className="txtStyle">
                  {ngoDetail?.totalDonation
                    ?.toFixed(2)
                    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0}
                </Typography>
              </div>
            </Grid>
            {/* Remaining Amount To Transfer */}
            <Grid item xs={12} md={6}>
              <div className="details-text-div">
                <Typography className="cardTitle">
                  Remaining Amount To Transfer
                </Typography>
                <Typography variant="subtitle1" className="txtStyle">
                  {ngoDetail?.newDonation
                    ?.toFixed(2)
                    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0}
                </Typography>
              </div>
            </Grid>
            {/* NGO Location */}
            <Grid item xs={12}>
              <div className="details-text-div">
                <Typography className="cardTitle">NGO Location</Typography>
                <Typography
                  variant="subtitle1"
                  className="txtStyle"
                  sx={{
                    backgroundColor: ngoLocation
                      ? "rgb(244, 247, 254)"
                      : "#91ED91",
                  }}
                >
                  {ngoDetail?.updated_data?.ngo_location?.city || "-"}
                </Typography>
              </div>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </BodyStyle>
  );
};

export default UpdateBasicDetailNGO;
