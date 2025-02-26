import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Grid,
  Grow,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { AppLoader } from "@crema";
import getApiData from "../../../shared/helpers/apiHelper";
import IntlMessages from "@crema/utility/IntlMessages";
import AppsContent from "@crema/core/AppsContainer/AppsContent";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import AppTooltip from "@crema/core/AppTooltip";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
import { FileDownloadOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { downloadReceipt } from "commonFunction";
import BoxCards from "components/Food/BoxCard";

const BodyStyle = styled(Box)(({ theme }) => ({
  zIndex: 1000002,
  "& .topDiv": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1000002,
  },
  "& .stickyClass": {
    // backgroundColor: "#f4f7fe",
    zIndex: 10,
    paddingBottom: "10px",
  },
  "& .apps-header": {
    position: "sticky",
    padding: "0px 10px",
    top: "0px",
    backgroundColor: "#fff",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  "& .bottomSpace": { marginBottom: 50 },
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const DetailStyle = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  borderRadius: "10px !important",
  padding: "10px 10px 10px 0px",
  "& .donationDetail": {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 10,
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
    fontSize: "15px",
    fontWeight: "500",
    wordBreak: "break-word",
  },
}));

const DonationDetails = (props) => {
  const history = useHistory();
  const { id }: { id: string } = useParams();
  const location: any = useLocation();
  const isFrom = location?.state?.from === "ngo-detail";
  const uID = location?.state?.id;
  const [donationDetail, setDonationDetail] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [downloadLoad, setDownloadLoad] = useState<any>(false);

  //API For get ngo details
  async function getDonationDetail() {
    setLoader(true);
    try {
      let tID = "";
      if (isFrom) {
        tID = uID;
      } else {
        tID = id;
      }
      const res = await getApiData(
        `donation/admin-transaction/${tID}`,
        {},
        "GET"
      );
      if (res.success) {
        setDonationDetail(res && res.data ? res.data : []);
        setLoader(false);
      } else {
        setDonationDetail([]);
        toast.error(res.message);
        history.goBack();
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      setDonationDetail([]);
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (id) {
      getDonationDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <AppsContent isDetailView>
      <BodyStyle>
        <AppsHeader>
          <div style={{ display: "flex", alignItems: "center" }}>
            <AppTooltip title={<IntlMessages id="common.back" />}>
              <IconButton
                sx={{
                  color: (theme) => theme.palette.text.disabled,
                }}
                onClick={() => history.goBack()}
              >
                <KeyboardBackspaceIcon />
              </IconButton>
            </AppTooltip>
            <Breadcrumbs aria-label="breadcrumb" sx={{ ml: 2 }}>
              <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                Dashboards
              </Link>
              <Link
                className="linkClass"
                to={{ pathname: "/transactions/admin-donation-list" }}
              >
                Admin Donation
              </Link>
              {loader ? null : (
                <Typography color="text.primary">{id}</Typography>
              )}
            </Breadcrumbs>
          </div>
          <Box>
            <LoadingButton
              size="small"
              variant="contained"
              color="primary"
              onClick={() => downloadReceipt(id, setDownloadLoad)}
              startIcon={<FileDownloadOutlined />}
              disabled={downloadLoad}
              loading={downloadLoad}
            >
              Download Receipt
            </LoadingButton>
          </Box>
        </AppsHeader>
        {loader ? (
          <AppLoader />
        ) : (
          <>
            <Grid
              container
              spacing={4}
              xs={12}
              style={{ margin: 0 }}
              className="topDiv"
            >
              {loader ? (
                <AppLoader />
              ) : (
                <DetailStyle>
                  <Grow
                    in
                    style={{ transformOrigin: "1 0 0" }}
                    {...{ timeout: 500 }}
                  >
                    <Grid
                      item
                      className="donationDetail"
                      style={{ marginTop: 0 }}
                    >
                      {/* category_name */}
                      {donationDetail?.document?.causeData?.category_name ? (
                        <Grid item xs={6} lg={4} xl={3}>
                          <BoxCards
                            title="Cause"
                            values={
                              donationDetail?.document?.causeData
                                ?.category_name || "-"
                            }
                          />
                        </Grid>
                      ) : null}
                      {/* Transaction Date */}
                      <Grid item xs={6} lg={4} xl={3}>
                        <BoxCards
                          title="Transaction Date"
                          values={
                            donationDetail?.document?.createdAt
                              ? moment(
                                  donationDetail?.document?.createdAt
                                ).format(initialTimeFormat)
                              : "-" || "-"
                          }
                        />
                      </Grid>
                      {/* reference_id */}
                      {donationDetail?.document?.causeData?.reference_id ? (
                        <Grid item xs={6} lg={4} xl={3}>
                          <BoxCards
                            title="Reference ID"
                            values={
                              donationDetail?.document?.causeData
                                ?.reference_id || "-"
                            }
                          />
                        </Grid>
                      ) : null}
                      {/* User Id */}
                      {donationDetail?.document?.user_id ? (
                        <Grid item xs={6} lg={4} xl={3}>
                          <BoxCards
                            title="User ID"
                            values={donationDetail?.document?.user_id || "-"}
                          />
                        </Grid>
                      ) : null}
                      {/* receipt_number */}
                      {donationDetail?.document?.receipt_number ? (
                        <Grid item xs={6} lg={4} xl={3}>
                          <BoxCards
                            title="Receipt Number"
                            values={
                              donationDetail?.document?.receipt_number || "-"
                            }
                          />
                        </Grid>
                      ) : null}
                      {/* title_of_fundraiser */}
                      <Grid item xs={6} lg={4} xl={3}>
                        <BoxCards
                          title="Name Of Fundraiser"
                          values={
                            donationDetail?.document?.causeData?.form_data
                              ?.title_of_fundraiser || "-"
                          }
                        />
                      </Grid>
                      {/* name_of_benificiary */}
                      <Grid item xs={6} lg={4} xl={3}>
                        <BoxCards
                          title="Beneficiary Name"
                          values={donationDetail?.name_of_benificiary || "-"}
                        />
                      </Grid>
                      {/* goal_amount */}
                      <Grid item xs={6} lg={4} xl={3}>
                        <BoxCards
                          title="Goal Amount"
                          values={`${donationDetail?.document?.currency || ""}
                            ${
                              donationDetail?.document?.goal_amount
                                ?.toFixed(2)
                                ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0
                            }`}
                        />
                      </Grid>
                      {/* transfer_amount */}
                      <Grid item xs={6} lg={4} xl={3}>
                        <BoxCards
                          title="Transferred Amount"
                          values={`${donationDetail?.document?.currency || ""}
                            ${
                              donationDetail?.document?.transfer_amount
                                ?.toFixed(2)
                                ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0
                            }`}
                        />
                      </Grid>
                      {/* total_donation */}
                      <Grid item xs={6} lg={4} xl={3}>
                        <BoxCards
                          title="Total Donation"
                          values={`${donationDetail?.document?.currency || ""}
                            ${
                              donationDetail?.document?.total_donation
                                ?.toFixed(2)
                                ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0
                            }`}
                        />
                      </Grid>
                      {/* remaining_amount */}
                      {/* <Grid item xs={6} lg={4} xl={3}>
                        <div className="details-text-div">
                          <Typography >
                            Remaining Amount
                          </Typography>
                          <Typography variant="subtitle1" className="txtStyle">
                            {donationDetail?.document?.currency || ""}
                            {
                              donationDetail?.document?.remaining_amount?.toFixed(2)
                              ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0
                            }
                          </Typography>
                        </div>
                      </Grid> */}
                      {/* Status */}
                      {donationDetail?.document?.status && (
                        <Grid item xs={6} lg={4} xl={3}>
                          <BoxCards
                            isChip={true}
                            title="Status"
                            style={{
                              color: "#FFF",
                              backgroundColor:
                                donationDetail?.document?.status ===
                                  "complete" ||
                                donationDetail?.document?.status === "completed"
                                  ? "#2e7d32"
                                  : "#1976d2",
                            }}
                            values={
                              donationDetail?.document?.status === "complete" ||
                              donationDetail?.document?.status === "completed"
                                ? "Completed"
                                : donationDetail?.document?.status
                                    ?.charAt(0)
                                    .toUpperCase() +
                                    donationDetail?.document?.status?.slice(
                                      1
                                    ) || "-"
                            }
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Grow>
                </DetailStyle>
              )}
            </Grid>
          </>
        )}
      </BodyStyle>
    </AppsContent>
  );
};
export default DonationDetails;
