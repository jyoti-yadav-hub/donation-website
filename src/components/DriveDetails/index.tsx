import React, { useState } from "react";
import { Alert, Avatar, Box, Grid, Grow } from "@mui/material";
import { styled } from "@mui/material/styles";
import { isEmpty } from "lodash";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
import BoxCards from "components/Food/BoxCard";
import MediaViewer from "@crema/core/AppMedialViewer";
import AppDialog from "@crema/core/AppDialog";
import DriveContacts from "./DriveContacts";

const BodyStyle = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  borderRadius: "10px !important",
  padding: "10px 10px 10px 10px",
  backgroundColor: "#FFF",
  "& .driveDetails": {
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
  "& .chipsStyle": {
    fontSize: "13px",
    marginTop: "5px",
    [theme.breakpoints.down("xl")]: { fontSize: "12px" },
  },
  "& .cardTitle": {
    [theme.breakpoints.down("xl")]: { fontSize: "12px" },
  },
}));

interface BasicDetailsProps {
  driveDetails: any;
}
const BasicDetails: React.FC<BasicDetailsProps> = ({ driveDetails }) => {
  const [contactModal, setContactModal] = useState<boolean>(false);
  const [imgURL, setImgURL] = useState<any>([]);
  const [index, setIndex] = useState(-1);

  const onClose = () => {
    setIndex(-1);
    setImgURL([]);
  };

  function OpenInNewTabWinBrowser(url) {
    var win: any = window.open(url, "_blank");
    win.focus();
  }

  return (
    <BodyStyle>
      <Grow in style={{ transformOrigin: "1 0 0" }} {...{ timeout: 500 }}>
        <Grid item className="driveDetails" style={{ marginTop: 0 }}>
          {driveDetails?.is_deleted && (
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Alert
                variant="filled"
                severity="error"
                color="error"
                sx={{ alignItems: "center", py: 0, fontSize: "14px", mb: 1 }}
              >
                This Drive was Deleted
              </Alert>
            </Grid>
          )}
          {/* Created By */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              isAvatr={true}
              renderAvatr={() => {
                return (
                  <Avatar
                    className="avtarClass"
                    onClick={() => {
                      setIndex(driveDetails?.user_data?.image ? 0 : -1);
                      setImgURL([driveDetails?.user_data?.image]);
                    }}
                    src={
                      driveDetails?.user_data?.image ||
                      "/assets/images/placeholder.jpg"
                    }
                  />
                );
              }}
              title="Created By"
              values={`${driveDetails?.user_data?.first_name || "-"} ${
                driveDetails?.user_data?.last_name || "-"
              }`}
            />
          </Grid>
          {/* Request ID */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Request ID"
              values={driveDetails?.reference_id || "-"}
            />
          </Grid>
          {/* Title of Drive */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Title of Drive"
              values={driveDetails?.form_data?.title_of_fundraiser || "-"}
            />
          </Grid>
          {/* drive_description */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Drive Description"
              values={driveDetails?.form_data?.drive_description || "-"}
            />
          </Grid>
          {/* drive_type */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Drive Type"
              values={driveDetails?.form_data?.drive_type?.name || "-"}
            />
          </Grid>
          {/* add_link */}
          {driveDetails?.form_data?.add_link ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                isLink
                title="Drive Link"
                onClick={() =>
                  OpenInNewTabWinBrowser(driveDetails?.form_data?.add_link)
                }
                values={driveDetails?.form_data?.add_link || "-"}
              />
            </Grid>
          ) : null}
          {driveDetails?.form_data?.criteria_for_volunteer && (
            <>
              {/* gender */}
              <Grid item xs={6} lg={4} xl={3}>
                <BoxCards
                  title="Gender"
                  values={driveDetails?.form_data?.gender || "-"}
                />
              </Grid>
              {/* age_restriction */}
              <Grid item xs={6} lg={4} xl={3}>
                <BoxCards
                  title="Age Restriction"
                  values={driveDetails?.form_data?.age_restriction || "-"}
                />
              </Grid>
            </>
          )}
          {/* max_participants */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Max Participants"
              values={driveDetails?.form_data?.max_participants || "-"}
            />
          </Grid>
          {/* suitable_for */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Suitable For"
              values={driveDetails?.form_data?.suitable_for || "-"}
            />
          </Grid>
          {/* Meeting Start Time */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Meeting Start Time"
              values={
                driveDetails?.form_data?.start_date_time
                  ? moment(driveDetails?.form_data?.start_date_time).format(
                      initialTimeFormat
                    )
                  : "-" || "-"
              }
            />
          </Grid>
          {/* Meeting End Time */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Meeting End Time"
              values={
                driveDetails?.form_data?.end_date_time
                  ? moment(driveDetails?.form_data?.end_date_time).format(
                      initialTimeFormat
                    )
                  : "-" || "-"
              }
            />
          </Grid>
          {/* Active Type */}
          {driveDetails?.active_type && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                isChip={true}
                title="Active Type"
                style={{
                  color: "#FFF",
                  backgroundColor:
                    driveDetails?.active_type === "donor"
                      ? "#2e7d32"
                      : driveDetails?.active_type === "ngo"
                      ? "#ed6c02"
                      : driveDetails?.active_type === "user"
                      ? "#1976d2"
                      : "#9c27b0",
                }}
                values={
                  driveDetails?.active_type === "ngo"
                    ? "NGO"
                    : driveDetails?.active_type === "user"
                    ? "Beneficiary"
                    : driveDetails?.active_type?.charAt(0).toUpperCase() +
                        driveDetails?.active_type?.slice(1) || "-"
                }
              />
            </Grid>
          )}
          {/* Status */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              isChip={true}
              title="Status"
              style={{
                color: "#FFF",
                backgroundColor:
                  driveDetails?.status === "approve"
                    ? "#2e7d32" //success
                    : driveDetails?.status === "complete"
                    ? "#0BBCED"
                    : driveDetails?.status === "reject" ||
                      driveDetails?.status === "rejected"
                    ? "#d32f2f" //error
                    : driveDetails.status === "cancelled" ||
                      driveDetails?.status === "cancel"
                    ? "#d32f2f"
                    : driveDetails?.status === "pending"
                    ? "#9c27b0" //secondary
                    : driveDetails?.status === "close"
                    ? "#1976d2" //primary
                    : driveDetails?.status === "ongoing"
                    ? "#E1BA00"
                    : "#0288d1", //default
              }}
              values={
                driveDetails?.status === "approve"
                  ? "Approved"
                  : driveDetails?.status === "reject"
                  ? "Rejected"
                  : driveDetails?.status === "cancel"
                  ? "Cancelled"
                  : driveDetails?.status === "complete"
                  ? "Completed"
                  : driveDetails?.status?.charAt(0).toUpperCase() +
                      driveDetails?.status?.slice(1) || "-"
              }
            />
          </Grid>
          {/* reject_reason */}
          {driveDetails?.status === "reject" && driveDetails?.reject_reason && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Reason for Rejection"
                values={driveDetails?.reject_reason || "-"}
              />
            </Grid>
          )}
          {/* reject_time */}
          {driveDetails?.status === "reject" && driveDetails?.reject_time && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                isChip={true}
                title="Rejected At"
                style={{ color: "#FFF", backgroundColor: "#d32f2f" }}
                values={
                  driveDetails?.reject_time
                    ? moment(driveDetails?.reject_time).format(
                        initialTimeFormat
                      )
                    : "-"
                }
              />
            </Grid>
          )}
          {/* Created At */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Created At"
              values={
                driveDetails?.createdAt
                  ? moment(driveDetails?.createdAt).format(initialTimeFormat)
                  : "-" || "-"
              }
            />
          </Grid>
          {/* Approved At */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Approved At"
              values={
                driveDetails?.approve_time
                  ? moment(driveDetails?.approve_time).format(initialTimeFormat)
                  : "-" || "-"
              }
            />
          </Grid>
          {driveDetails?.contacts && !isEmpty(driveDetails?.contacts) && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                isLink={true}
                title="Contacts"
                values={driveDetails?.contacts?.length || 0}
                onClick={() => {
                  if (driveDetails?.contacts?.length > 0) {
                    setContactModal(true);
                  }
                }}
              />
            </Grid>
          )}
          <Grid item xs={12} />
          {/* drive_location */}
          {driveDetails?.form_data?.drive_location?.city ? (
            <Grid item xs={12} lg={6}>
              <BoxCards
                title="Drive Location"
                values={driveDetails?.form_data?.drive_location?.city || "-"}
              />
            </Grid>
          ) : null}
          {/* location */}
          {driveDetails?.location?.city ? (
            <Grid item xs={12} lg={6}>
              <BoxCards
                title="Location"
                values={driveDetails?.location?.city || "-"}
              />
            </Grid>
          ) : null}
        </Grid>
      </Grow>
      {/* Modal for donors lists */}
      <AppDialog
        open={contactModal}
        maxWidth={"lg"}
        onClose={() => setContactModal(false)}
        dividers
        title={"Contacts"}
      >
        <DriveContacts rows={driveDetails?.contacts} />
      </AppDialog>
      <MediaViewer
        index={index}
        medias={imgURL?.map((data) => {
          return { url: data, mime_type: "image/*" };
        })}
        onClose={onClose}
      />
    </BodyStyle>
  );
};

export default BasicDetails;
