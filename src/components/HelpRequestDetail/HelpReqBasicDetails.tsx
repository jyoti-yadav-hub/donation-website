import React from "react";
import { Box, Grid, Grow } from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment";
import { isEmpty } from "lodash";
import { initialTimeFormat } from "shared/constants/AppConst";
import BoxCards from "components/Food/BoxCard";
const { flag } = require("country-emoji");

const BodyStyle = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  borderRadius: "10px !important",
  padding: "10px 10px 10px 0px",
  "& .helpRequestDetail": {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  "& .details-text-div": {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 10,
    backgroundColor: "rgb(244, 247, 254)",
    borderRadius: 5,
    margin: 5,
    flexWrap: "wrap",
  },
  "& .txtStyle": {
    fontSize: "14px",
    fontWeight: "500",
    wordBreak: "break-word",
    [theme.breakpoints.down("xl")]: { fontSize: "13px" },
  },
  "& .chipsStyle": {
    fontSize: "13px",
    color: "#FFF",
    marginTop: "5px",
    [theme.breakpoints.down("xl")]: { fontSize: "12px" },
  },
  "& .cardTitle": {
    [theme.breakpoints.down("xl")]: { fontSize: "12px" },
  },
}));

interface BasicDetailsProps {
  helpRequestDetail: any;
}
const HelpReqBasicDetails: React.FC<BasicDetailsProps> = ({
  helpRequestDetail,
}) => {
  return (
    <BodyStyle>
      <Grow in style={{ transformOrigin: "1 0 0" }} {...{ timeout: 500 }}>
        <Grid item className="helpRequestDetail" style={{ marginTop: 0 }}>
          {/* Audio */}
          {helpRequestDetail?.audio ? (
            <Grid item xs={6} lg={4} xl={3}>
              <audio controls>
                <source src={helpRequestDetail?.audio} type="audio/ogg" />
                <source src={helpRequestDetail?.audio} type="audio/mpeg" />
              </audio>
            </Grid>
          ) : null}
          {/* description */}
          {helpRequestDetail?.description ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Description"
                values={helpRequestDetail?.description || "-"}
              />
            </Grid>
          ) : null}
          {/* language */}
          {helpRequestDetail?.help_language ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Language"
                values={helpRequestDetail?.help_language || "-"}
              />
            </Grid>
          ) : null}
          {/* country */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Country"
              values={helpRequestDetail?.country || "-"}
            />
          </Grid>
          {/* Phone */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Phone"
              values={`${flag(helpRequestDetail?.country_code || "")}
                ${helpRequestDetail?.phone_code || ""} ${
                helpRequestDetail?.phone || "-"
              }`}
            />
          </Grid>
          {/* Email */}
          {helpRequestDetail?.email ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Email"
                values={helpRequestDetail?.email || "-"}
              />
            </Grid>
          ) : null}
          {/* Created At */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Created At"
              values={
                moment(helpRequestDetail?.createdAt).format(
                  initialTimeFormat
                ) || "-"
              }
            />
          </Grid>
          {/* Approved At */}
          {!isEmpty(helpRequestDetail?.approve_time) ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Approved At"
                values={
                  moment(helpRequestDetail?.approve_time).format(
                    initialTimeFormat
                  ) || "-"
                }
              />
            </Grid>
          ) : null}
          {/* Completed At */}
          {!isEmpty(helpRequestDetail?.complete_time) ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Completed At"
                values={
                  moment(helpRequestDetail?.complete_time).format(
                    initialTimeFormat
                  ) || "-"
                }
              />
            </Grid>
          ) : null}
          {/* Rejected At */}
          {!isEmpty(helpRequestDetail?.reject_time) ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Rejected At"
                values={
                  moment(helpRequestDetail?.reject_time).format(
                    initialTimeFormat
                  ) || "-"
                }
              />
            </Grid>
          ) : null}
          {/* Status */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              isChip={true}
              title="Status"
              values={
                helpRequestDetail?.status === "approve"
                  ? "Approved"
                  : helpRequestDetail?.status === "close"
                  ? "Closed"
                  : helpRequestDetail?.status === "reject"
                  ? "Rejected"
                  : helpRequestDetail?.status === "complete"
                  ? "Completed"
                  : helpRequestDetail?.status === "block" ||
                    helpRequestDetail?.status === "blocked"
                  ? "Blocked"
                  : helpRequestDetail?.status === "waiting_for_volunteer"
                  ? "Waiting for Volunteer"
                  : helpRequestDetail?.status?.charAt(0).toUpperCase() +
                      helpRequestDetail?.status?.slice(1) || "-"
              }
              style={{
                color: "#FFF",
                backgroundColor:
                  helpRequestDetail?.status === "accepted" ||
                  helpRequestDetail?.status === "approve"
                    ? "#2e7d32" //success
                    : helpRequestDetail?.status === "complete" ||
                      helpRequestDetail?.status === "completed"
                    ? "#0ABCED"
                    : helpRequestDetail?.status === "cancelled" ||
                      helpRequestDetail?.status === "reject" ||
                      helpRequestDetail?.status === "rejected" ||
                      helpRequestDetail?.status === "block" ||
                      helpRequestDetail?.status === "blocked"
                    ? "#d32f2f" //error
                    : helpRequestDetail?.status === "pending"
                    ? "#9c27b0" //secondary
                    : helpRequestDetail?.status === "waiting_for_volunteer" ||
                      helpRequestDetail?.status === "close"
                    ? "#1976d2" //primary
                    : "#0288d1", //default
              }}
            />
          </Grid>
          {/* volunteer_email */}
          {helpRequestDetail?.volunteer_email ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Volunteer Email"
                values={helpRequestDetail?.volunteer_email || "-"}
              />
            </Grid>
          ) : null}
          {/* volunteer_name */}
          {helpRequestDetail?.volunteer_name ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Volunteer Name"
                values={helpRequestDetail?.volunteer_name || "-"}
              />
            </Grid>
          ) : null}
          {/* volunteer_phone */}
          {helpRequestDetail?.volunteer_phone ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Volunteer Phone"
                values={`${flag(helpRequestDetail?.country_code || "")} 
                ${helpRequestDetail?.volunteer_phone_code || ""} ${
                  helpRequestDetail?.volunteer_phone || "-"
                }`}
              />
            </Grid>
          ) : null}
          {/* Reported */}
          {!isEmpty(helpRequestDetail?.report_benificiary) && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                isChip={true}
                title="Reported"
                values={"Yes"}
                style={{ color: "#FFF", backgroundColor: "#2e7d32" }}
              />
            </Grid>
          )}
          {/* Report Description */}
          {!isEmpty(helpRequestDetail?.report_benificiary) ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Report Description"
                values={helpRequestDetail?.report_benificiary || "-"}
              />
            </Grid>
          ) : null}
          {/* Rejected By */}
          {/* {helpRequestDetail?.status === "reject" ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Rejected By"
                values={helpRequestDetail?.email || "-"}
              />
            </Grid>
          ) : null} */}
          {/* Rejected At */}
          {helpRequestDetail?.status === "reject" ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Rejected At"
                values={
                  helpRequestDetail?.rejectedAt
                    ? moment(helpRequestDetail?.rejectedAt).format(
                        initialTimeFormat
                      )
                    : "-" || "-"
                }
              />
            </Grid>
          ) : null}
          {/* User Location */}
          <Grid item xs={12}>
            <BoxCards
              title="User Location"
              values={helpRequestDetail?.location?.city || "-"}
            />
          </Grid>
        </Grid>
      </Grow>
    </BodyStyle>
  );
};

export default HelpReqBasicDetails;
