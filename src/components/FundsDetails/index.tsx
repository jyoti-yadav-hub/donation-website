import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  Grow,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { isEmpty } from "lodash";
import { styled } from "@mui/material/styles";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
import AppDialog from "@crema/core/AppDialog";
import { Fonts } from "shared/constants/AppEnums";
import { RemoveRedEyeOutlined } from "@mui/icons-material";
import BoxCards from "components/Food/BoxCard";
const { name } = require("country-emoji");

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const BodyStyle = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  borderRadius: "10px !important",
  padding: "10px 10px 10px 10px",
  backgroundColor: "#FFF",
  "& .userDetails": {
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
  fundDetail: any;
}
const BasicDetails: React.FC<BasicDetailsProps> = ({ fundDetail }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalName, setModalName] = useState<any>("");
  return (
    <BodyStyle>
      <Grow in style={{ transformOrigin: "1 0 0" }} {...{ timeout: 500 }}>
        <Grid item className="userDetails" style={{ marginTop: 0 }}>
          {fundDetail?.is_deleted && (
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
                This fund was Deleted
              </Alert>
            </Grid>
          )}
          {/* Fund ID */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards title="Fund ID" values={fundDetail?._id || "-"} />
          </Grid>
          {/* Title of Fund */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Title of Fund"
              values={fundDetail?.form_data?.title_of_fundraiser || "-"}
            />
          </Grid>
          {/* Amount Raised */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              isNumber
              title="Amount Raised"
              values={`${fundDetail?.country_data?.currency || ""}${
                fundDetail?.raised
                  ?.toFixed(2)
                  ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0
              }`}
            />
          </Grid>
          {/* donated */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              isNumber
              title="Donated From Fund"
              values={`${fundDetail?.country_data?.currency || ""}${
                fundDetail?.donated
                  ?.toFixed(2)
                  ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0
              }`}
            />
          </Grid>
          {/* donors */}
          {fundDetail?.raised > 0 ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                isNumber
                title="Number Of Donors"
                values={fundDetail?.donors || 0}
              />
            </Grid>
          ) : null}
          {/* funded_in_days */}
          {fundDetail?.raised > 0 ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                isNumber
                title="Amount Raised in Days"
                values={fundDetail?.funded_in_days || 0}
              />
            </Grid>
          ) : null}
          {/* Causes */}
          {!isEmpty(fundDetail?.causes) ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Causes"
                isStack={true}
                renderStack={() => {
                  let firstArr = fundDetail?.causes || [];
                  if (fundDetail?.causes?.length > 4) {
                    firstArr = fundDetail?.causes.slice(0, 3);
                  } else {
                    firstArr = fundDetail?.causes;
                  }
                  return (
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ flexWrap: "wrap" }}
                    >
                      {firstArr?.map((it: any, index: number) => {
                        return (
                          <Chip
                            sx={{
                              mt: 1,
                              mr: index !== firstArr.length - 1 ? 1 : 0,
                            }}
                            className="chipsStyle"
                            label={it?.name || "-"}
                            size="small"
                          />
                        );
                      })}
                      {fundDetail?.causes?.length > 4 && (
                        <Chip
                          sx={{ mt: 1, ml: 2 }}
                          className="chipsStyle"
                          color="primary"
                          variant="outlined"
                          size="small"
                          label="View All"
                          onClick={() => {
                            setModalOpen(true);
                            setModalName("causes");
                          }}
                        />
                      )}
                    </Stack>
                  );
                }}
              />
            </Grid>
          ) : null}
          {/* Status */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              isChip={true}
              title="Status"
              style={{
                color: "#FFF",
                backgroundColor:
                  fundDetail?.status === "approve" ||
                  fundDetail?.status === "complete"
                    ? "#2e7d32" //success
                    : fundDetail?.status === "reject" ||
                      fundDetail?.status === "rejected" ||
                      fundDetail?.status === "block" ||
                      fundDetail?.status === "blocked"
                    ? "#d32f2f" //error
                    : fundDetail.status === "cancelled" ||
                      fundDetail?.status === "cancel"
                    ? "#d32f2f"
                    : fundDetail?.status === "pending"
                    ? "#9c27b0" //secondary
                    : fundDetail?.status === "close"
                    ? "#1976d2" //primary
                    : "#0288d1", //default
              }}
              values={
                fundDetail?.status === "approve"
                  ? "Approved"
                  : fundDetail?.status === "reject"
                  ? "Rejected"
                  : fundDetail?.status === "cancel"
                  ? "Cancelled"
                  : fundDetail?.status?.charAt(0).toUpperCase() +
                      fundDetail?.status?.slice(1) || "-"
              }
            />
          </Grid>
          {/* reject_reason */}
          {fundDetail?.status === "reject" && fundDetail?.reject_reason && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Reason for Rejection"
                values={fundDetail?.reject_reason || "-"}
              />
            </Grid>
          )}
          {/* reject_time */}
          {fundDetail?.status === "reject" && fundDetail?.reject_time && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                isChip={true}
                title="Rejected At"
                style={{ color: "#FFF", backgroundColor: "#d32f2f" }}
                values={
                  fundDetail?.reject_time
                    ? moment(fundDetail?.reject_time).format(initialTimeFormat)
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
                fundDetail?.createdAt
                  ? moment(fundDetail?.createdAt).format(initialTimeFormat)
                  : "-" || "-"
              }
            />
          </Grid>
          {/* Approved At */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Approved At"
              values={
                fundDetail?.approve_time
                  ? moment(fundDetail?.approve_time).format(initialTimeFormat)
                  : "-" || "-"
              }
            />
          </Grid>
          {/* Regions & Countries */}
          <Grid item xs={6} lg={4} xl={3}>
            <div className="details-text-div">
              <Typography className="cardTitle" sx={{ mb: 0.5 }}>
                Regions & Countries
              </Typography>
              <Button
                sx={{ p: "0px 10px !important" }}
                size="small"
                variant="outlined"
                onClick={() => {
                  setModalOpen(true);
                  setModalName("regions");
                }}
                startIcon={<RemoveRedEyeOutlined />}
              >
                View
              </Button>
            </div>
          </Grid>
          {/* Description */}
          <Grid item xs={12}>
            <BoxCards
              title="Description"
              values={fundDetail?.form_data?.describe_your_fund || "-"}
            />
          </Grid>
          {/* how_the_funds_will_be_used */}
          <Grid item xs={12}>
            <BoxCards
              title="How the funds will be used?"
              values={fundDetail?.form_data?.how_the_funds_will_be_used || "-"}
            />
          </Grid>
        </Grid>
      </Grow>
      <AppDialog
        open={modalOpen}
        maxWidth={modalName === "regions" ? "sm" : "md"}
        onClose={() => {
          setModalOpen(false);
          setModalName("");
        }}
      >
        <Grid container spacing={2} sx={{ m: 0, width: "100%", mb: "50px" }}>
          {modalName === "regions" ? (
            <>
              <Grid item xs={6}>
                <Typography
                  gutterBottom
                  sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}
                >
                  Regions
                </Typography>
                {!isEmpty(fundDetail?.regions) ? (
                  fundDetail?.regions?.map((it: any, index: number) => {
                    return (
                      <Grid item xs={12} sx={{ py: 1.5 }}>
                        {it || ""}
                      </Grid>
                    );
                  })
                ) : (
                  <Typography gutterBottom sx={{ fontSize: 14 }}>
                    For All Regions
                  </Typography>
                )}
              </Grid>
              <Grid item xs={6}>
                <Typography
                  gutterBottom
                  sx={{ fontSize: 14, fontWeight: Fonts.SEMI_BOLD }}
                >
                  Countries
                </Typography>
                {!isEmpty(fundDetail?.countries) ? (
                  fundDetail?.countries?.map((it: any, index: number) => {
                    return (
                      <Grid item xs={12} sx={{ py: 1.5 }}>
                        {name(it) || ""}
                      </Grid>
                    );
                  })
                ) : (
                  <Typography gutterBottom sx={{ fontSize: 14 }}>
                    For All Countries
                  </Typography>
                )}
              </Grid>
            </>
          ) : (
            <Paper
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                flexWrap: "wrap",
                listStyle: "none",
                p: 0.5,
                m: 0,
                boxShadow: "none",
              }}
              component="ul"
            >
              {fundDetail?.causes?.map((it: any, index: number) => {
                return (
                  <ListItem key={index}>
                    <Chip label={it?.name || "-"} size="small" />
                  </ListItem>
                );
              })}
            </Paper>
          )}
        </Grid>
      </AppDialog>
    </BodyStyle>
  );
};

export default BasicDetails;
