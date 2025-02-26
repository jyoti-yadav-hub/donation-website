import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  Grow,
  IconButton,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { isEmpty, isArray } from "lodash";
import moment from "moment";
import getApiData from "../../shared/helpers/apiHelper";
import BankDetailModal from "./BankDetailModal";
import { toast } from "react-toastify";
import MediaViewer from "@crema/core/AppMedialViewer";
import {
  AccountBalanceOutlined,
  // CheckCircleOutline,
  EventNoteOutlined,
  FileDownloadOutlined,
  TaskAltOutlined,
} from "@mui/icons-material";
import SimpleBarReact from "simplebar-react";
import { initialTimeFormat } from "shared/constants/AppConst";
import AppDialog from "@crema/core/AppDialog";
import { AppLoader } from "@crema";
import CTable from "components/CTable";
import { GridColumns } from "@mui/x-data-grid-pro";
import { downloadReceipt } from "commonFunction";
import BoxCards from "./BoxCard";
import StatusModal from "./StatusModal";
import UserDataModal from "./DataModal";
import { LoadingButton } from "@mui/lab";
// import { useHistory } from "react-router-dom";
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
  position: "relative",
  "& .btnsDiv": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  "& .userDetails": {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
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
  "& .cardTitle": {
    [theme.breakpoints.down("xl")]: { fontSize: "12px" },
  },
  "& .details-title": { fontWeight: "500", marginRight: 10 },
}));

interface BasicDetailsProps {
  foodDetails: any;
  getFoodDetails: any;
  bankModal?: any;
  setDonationListModal?: any;
}
const BasicDetails: React.FC<BasicDetailsProps> = ({
  foodDetails,
  getFoodDetails,
  bankModal,
  setDonationListModal,
}) => {
  // const history = useHistory();
  const [dataModal, setDataModal] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [imgURL, setImgURL] = useState<any>([]);
  const [index, setIndex] = useState(-1);
  const [bankDetailModal, setBankDetailModal] = useState<boolean>(false);
  const [statusModal, setStatusModal] = useState<boolean>(false);
  const [receiptModal, setReceiptModal] = useState<boolean>(false);
  const [banDetails, setBankDetails] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [adminDonations, setAdminDonations] = useState<any>({
    lists: [],
    listsLoad: false,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [downloadLoad, setDownloadLoad] = useState<any>(false);

  const goalAmount: any =
    Number(foodDetails?.form_data?.goal_amount)
      ?.toFixed(2)
      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0;

  const remainAmount: any =
    Number(foodDetails?.form_data?.remaining_amount)
      ?.toFixed(2)
      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0;

  const totalDonation: any =
    Number(foodDetails?.total_donation)
      ?.toFixed(2)
      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0;

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    event.stopPropagation();
    event.preventDefault();
  };

  const onClose = () => {
    setIndex(-1);
    setImgURL([]);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (bankModal) {
      setBankDetailModal(true);
      getBankDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankModal]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (foodDetails?._id) {
      getBankDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //API for get admin trnsactions lists for receipt download
  async function getAdminDonations(nData) {
    setAdminDonations((e) => ({ ...e, listsLoad: true }));
    try {
      nData.request_id = foodDetails?._id;
      const res = await getApiData("donation/admin-transaction-list", nData);
      if (res.success) {
        setAdminDonations({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setAdminDonations({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setAdminDonations({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  const columns: GridColumns = [
    {
      field: "_id",
      headerName: "ID",
      minWidth: 200,
      hide: true,
      disableColumnMenu: true,
    },
    {
      field: "receipt_number",
      headerName: "Receipt Number",
      minWidth: 200,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "transfer_amount",
      headerName: "Transferred Amount",
      minWidth: 200,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (item: any) => {
        return (
          <Typography sx={{ fontSize: 12 }}>
            {item?.row?.currency || ""}
            {item?.value || 0}
          </Typography>
        );
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      renderCell: (item: any) => {
        return [
          <IconButton
            aria-label="view code"
            edge="start"
            onClick={() => downloadReceipt(item?.id, setDownloadLoad, true)}
            size="small"
            disabled={downloadLoad}
          >
            {downloadLoad === item?.id ? (
              <CircularProgress size={19} />
            ) : (
              <FileDownloadOutlined />
            )}
          </IconButton>,
        ];
      },
    },
  ];

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.operator = "contains";
    flt.page = newPage + 1;
    getAdminDonations(flt);
  }

  const requestForName = () => {
    let name = foodDetails?.form_data?.food_for_myself || "-";
    if (foodDetails?.form_data?.food_for_myself) {
      name = "Self";
    } else {
      name = "Other";
    }
    return name;
  };

  const cancelledByName = () => {
    let name = foodDetails?.cancelled_by || "-";
    if (foodDetails?.status === "cancelled") {
      if (foodDetails?.cancelled_by === "auto") {
        name = `Request was cancelled because no ${
          !isEmpty(foodDetails?.donor_accept) ? "volunteers" : "donors"
        } were found.`;
      } else {
        name = foodDetails?.cancelled_by;
      }
    } else if (foodDetails?.status === "reject") {
      name = "Request rejected by Admin";
    }
    return name;
  };

  const deliverByName = () => {
    let name = "";
    if (foodDetails?.category_slug === "fundraiser") {
      if (foodDetails?.status === "approve") {
        name = "Wait Till Donor Accept Request";
      }
    } else {
      if (foodDetails?.status === "delivered") {
        name = `${
          foodDetails?.deliver_by_self
            ? `${foodDetails?.donor_accept?.user_name} (Donor)`
            : `${foodDetails?.volunteer_accept?.user_name} (Volunteer)`
        }`;
      } else if (
        foodDetails?.status === "accepted" ||
        foodDetails?.status === "approve" ||
        foodDetails?.status === "donor_accept"
      ) {
        name = `${foodDetails?.donor_accept?.user_name} (Donor)`;
      } else if (foodDetails?.status === "volunteer_accept") {
        name = `${foodDetails?.volunteer_accept?.user_name} (Volunteer)`;
      } else if (foodDetails?.status === "waiting_for_volunteer") {
        name = `Waiting for Volunteer`;
      } else if (foodDetails?.status === "pending") {
        name = "Request is pending";
      } else if (foodDetails?.status === "pickup") {
        if (foodDetails?.deliver_by_self) {
          name = `${foodDetails?.donor_accept?.user_name} (Donor)`;
        } else {
          name = `${foodDetails?.volunteer_accept?.user_name} (Volunteer)`;
        }
      }
    }

    return name;
  };

  // API For get bank  details
  async function getBankDetail() {
    setLoader(true);
    let id = foodDetails?._id;
    try {
      const res = await getApiData(
        `bank/admin/ngo-bank-detail/${id}`,
        {},
        "GET"
      );
      if (res && res.success) {
        setBankDetails(res && res.data ? res.data : {});
        setLoader(false);
      } else {
        setBankDetails({});
        toast.error(res.message);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      setBankDetails({});
      toast.error("Something went wrong");
    }
  }

  return (
    <BodyStyle>
      <Grid item className="btnsDiv">
        <Typography
          variant="body2"
          sx={{ fontSize: { lg: "14px", xl: "15px" } }}
        >
          Request Details:
        </Typography>
        <Box>
          {!isEmpty(foodDetails?.fundraiser_status) ? (
            <Button
              size="small"
              variant="outlined"
              startIcon={<EventNoteOutlined />}
              color="secondary"
              onClick={() => setStatusModal(true)}
              sx={{ mr: 3 }}
            >
              Status
            </Button>
          ) : null}
          {/* <Button
            size="small"
            variant="outlined"
            startIcon={<CheckCircleOutline />}
            color="info"
            onClick={() => history.push("/users-bank-list")}
            sx={{ mr: 3 }}
          >
            Verify Bank
          </Button> */}
          {foodDetails && foodDetails?.status === "close" ? (
            <Button
              size="small"
              variant="outlined"
              startIcon={<FileDownloadOutlined />}
              color="primary"
              onClick={(event) => {
                getAdminDonations({ page: 1 });
                setReceiptModal(true);
              }}
            >
              Download Receipt
            </Button>
          ) : foodDetails &&
            (foodDetails?.category_slug === "fundraiser" ||
              foodDetails?.category_slug === "health" ||
              foodDetails?.category_slug === "education") ? (
            <LoadingButton
              loading={loader}
              disabled={loader}
              size="small"
              loadingPosition="start"
              variant="outlined"
              startIcon={
                isEmpty(banDetails) ? (
                  <AccountBalanceOutlined />
                ) : (
                  <TaskAltOutlined />
                )
              }
              color="primary"
              onClick={(event) => setBankDetailModal(true)}
            >
              Bank Details
            </LoadingButton>
          ) : null}
        </Box>
      </Grid>

      <Grow in style={{ transformOrigin: "1 0 0" }} {...{ timeout: 2000 }}>
        <Grid item className="userDetails" style={{ marginTop: 0 }}>
          {/* Request ID */}
          {foodDetails?.reference_id ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Request ID"
                values={foodDetails?.reference_id || "-"}
              />
            </Grid>
          ) : null}
          {/* Fundraiser Title */}
          {(foodDetails?.category_slug === "fundraiser" ||
            foodDetails?.category_slug === "health" ||
            foodDetails?.category_slug === "education") && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Fundraiser Title"
                values={foodDetails?.form_data?.title_of_fundraiser || "-"}
              />
            </Grid>
          )}
          {/* Beneficiary name / patient_s_name */}
          {(foodDetails?.category_slug === "fundraiser" ||
            foodDetails?.category_slug === "health" ||
            foodDetails?.category_slug === "education") && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title={
                  foodDetails?.category_slug === "health"
                    ? "Patient's Name"
                    : "Beneficiary Name"
                }
                values={
                  foodDetails?.category_slug === "fundraiser"
                    ? foodDetails?.form_data?.name_of_beneficiary
                    : foodDetails?.form_data?.request_for_self
                    ? foodDetails?.uname
                    : `${foodDetails?.form_data?.first_name || ""} ${
                        foodDetails?.form_data?.last_name || ""
                      }` || "-"
                }
              />
            </Grid>
          )}
          {foodDetails?.category_slug !== "hunger" && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                isAvatr={true}
                renderAvatr={() => {
                  return (
                    <Avatar
                      className="avtarClass"
                      onClick={() => {
                        setIndex(foodDetails?.userDtl?.image ? 0 : -1);
                        setImgURL([foodDetails?.userDtl?.image]);
                      }}
                      src={
                        foodDetails?.userDtl?.image ||
                        "/assets/images/placeholder.jpg"
                      }
                    />
                  );
                }}
                isLink={true}
                onClick={(event) => {
                  handleClick(event);
                  setDataModal(true);
                }}
                title="Created By"
                values={foodDetails?.uname || "-"}
              />
            </Grid>
          )}
          {/* Active Type */}
          {foodDetails?.active_type && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                isChip={true}
                title="Active Type"
                style={{
                  color: "#FFF",
                  backgroundColor:
                    foodDetails?.active_type === "donor"
                      ? "#2e7d32"
                      : foodDetails?.active_type === "ngo"
                      ? "#ed6c02"
                      : foodDetails?.active_type === "user"
                      ? "#1976d2"
                      : "#9c27b0",
                }}
                values={
                  foodDetails?.active_type === "ngo"
                    ? "NGO"
                    : foodDetails?.active_type === "user"
                    ? "Beneficiary"
                    : foodDetails?.active_type?.charAt(0).toUpperCase() +
                        foodDetails?.active_type?.slice(1) || "-"
                }
              />
            </Grid>
          )}
          {/* Status */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              isChip={true}
              title="Status"
              values={
                foodDetails?.status === "approve"
                  ? "Approved"
                  : foodDetails?.status === "close"
                  ? "Closed"
                  : foodDetails?.status === "reject"
                  ? "Rejected"
                  : foodDetails?.status === "donor_accept"
                  ? "Donor Accepted"
                  : foodDetails?.status === "waiting_for_volunteer"
                  ? "Waiting for Volunteer"
                  : foodDetails?.status === "volunteer_accept"
                  ? "Volunteer Accepted"
                  : foodDetails?.status?.charAt(0).toUpperCase() +
                      foodDetails?.status?.slice(1) || "-"
              }
              style={{
                color: "#FFF",
                backgroundColor:
                  foodDetails?.status === "accepted" ||
                  foodDetails?.status === "delivered" ||
                  foodDetails?.status === "approve" ||
                  foodDetails?.status === "complete"
                    ? "#2e7d32" //success
                    : foodDetails?.status === "completed" ||
                      foodDetails?.status === "waiting_for_verify"
                    ? "#ed6c02" //warning
                    : foodDetails?.status === "cancelled" ||
                      foodDetails?.status === "reject" ||
                      foodDetails?.status === "rejected" ||
                      foodDetails?.status === "expired"
                    ? "#d32f2f" //error
                    : foodDetails?.status === "pending" ||
                      foodDetails?.status === "pickup" ||
                      foodDetails?.status === "donor_accept"
                    ? "#9c27b0" //secondary
                    : foodDetails?.status === "waiting_for_volunteer" ||
                      foodDetails?.status === "volunteer_accept" ||
                      foodDetails?.status === "close"
                    ? "#1976d2" //primary
                    : "#0288d1", //default
              }}
            />
          </Grid>
          {/* Volunteer Name */}
          {foodDetails?.volunteer_name ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Volunteer Name"
                values={foodDetails?.volunteer_name || "-"}
              />
            </Grid>
          ) : null}
          {/* Volunteer Email */}
          {foodDetails?.volunteer_email ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Volunteer Email"
                values={foodDetails?.volunteer_email || "-"}
              />
            </Grid>
          ) : null}
          {/* Volunteer Phone */}
          {foodDetails?.volunteer_phone ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Volunteer Phone"
                values={foodDetails?.volunteer_phone || "-"}
              />
            </Grid>
          ) : null}
          {/* Volunteer Accept Time */}
          {foodDetails?.volunteer_accept_time ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Volunteer Accepted At"
                values={
                  moment(foodDetails?.volunteer_accept_time).format(
                    initialTimeFormat
                  ) || "-"
                }
              />
            </Grid>
          ) : null}
          {/* country + country_code +  emoji */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Country"
              values={
                `${foodDetails?.country_data?.country || ""} (${
                  foodDetails?.country_data?.country_code || ""
                })` || "-"
              }
            />
          </Grid>
          {/* Posted On */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Posted On"
              values={
                moment(foodDetails?.createdAt).format(initialTimeFormat) || "-"
              }
            />
          </Grid>
          {/* Approved Time */}
          {foodDetails?.approve_time && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Approved At"
                values={
                  moment(foodDetails?.approve_time).format(initialTimeFormat) ||
                  "-"
                }
              />
            </Grid>
          )}
          {/* expiry_date */}
          {foodDetails?.category_slug === "hunger" ? null : foodDetails
              ?.form_data?.expiry_date ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Expiry Date"
                values={
                  moment(foodDetails?.form_data?.expiry_date).format(
                    initialTimeFormat
                  ) || "-"
                }
              />
            </Grid>
          ) : null}
          {/* race */}
          {!isEmpty(foodDetails?.form_data?.race) && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Race"
                values={foodDetails?.form_data?.race || "-"}
              />
            </Grid>
          )}
          {/* religion */}
          {!isEmpty(foodDetails?.form_data?.religion) && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Religion"
                values={foodDetails?.form_data?.religion || "-"}
              />
            </Grid>
          )}
          {/* cancellation_reason */}
          {foodDetails?.status === "cancelled" &&
          foodDetails?.cancellation_reason ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Cancellation Reason"
                values={foodDetails?.cancellation_reason}
              />
            </Grid>
          ) : null}

          {/* Gooal amount */}
          {foodDetails?.category_slug === "hunger" ? null : (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Goal Amount"
                values={`${foodDetails?.country_data?.currency || ""}
                  ${goalAmount}`}
              />
            </Grid>
          )}
          {/* remaining_amount */}
          {foodDetails?.category_slug === "hunger" ? null : (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Remaining Amount"
                values={`${foodDetails?.country_data?.currency || ""}
                  ${totalDonation > 0 ? remainAmount : goalAmount}`}
              />
            </Grid>
          )}
          {/* total_donation */}
          {foodDetails?.category_slug === "hunger" ? null : (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Total Donation"
                values={`${foodDetails?.country_data?.currency || ""}
                  ${totalDonation}`}
              />
            </Grid>
          )}
          {/* total_donors */}
          {foodDetails?.category_slug === "hunger" ? null : (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                isLink={true}
                title="Total Donors"
                values={foodDetails?.total_donors || 0}
                onClick={() => {
                  if (foodDetails?.total_donors > 0) {
                    setDonationListModal(true);
                  }
                }}
              />
            </Grid>
          )}

          {foodDetails?.category_slug === "hunger" && (
            <>
              {/* Request For */}
              <Grid item xs={6} lg={4} xl={3}>
                <BoxCards title="Request For" values={requestForName()} />
              </Grid>
              {/* Person */}
              <Grid item xs={6} lg={4} xl={3}>
                <BoxCards
                  title="Food For"
                  values={
                    `${
                      foodDetails?.form_data?.how_many_persons || ""
                    } person` || "-"
                  }
                />
              </Grid>
              {/* Deliver Before */}
              <Grid item xs={6} lg={4} xl={3}>
                <BoxCards
                  title="Deliver Before"
                  values={foodDetails?.form_data?.deliver_before || ""}
                />
              </Grid>
              {/* Food Type */}
              <Grid item xs={6} lg={4} xl={3}>
                <BoxCards
                  isChip={true}
                  title="Food Type"
                  values={
                    `${
                      foodDetails?.form_data?.vegeterian ||
                      foodDetails?.form_data?.vegetarian ||
                      foodDetails?.form_data?.veg_only
                        ? "Veg"
                        : "Veg/Non-Veg"
                    }` || "-"
                  }
                  style={{
                    color: "#FFF",
                    backgroundColor:
                      foodDetails?.form_data?.vegeterian ||
                      foodDetails?.form_data?.vegetarian
                        ? "#2e7d32" //success
                        : "#d32f2f", //error
                  }}
                />
              </Grid>
              {/* Pickup Time */}
              {foodDetails && foodDetails?.status === "pickup" && (
                <Grid item xs={6} lg={4} xl={3}>
                  <BoxCards
                    title="Pickup Time"
                    values={
                      moment(foodDetails?.picked_up_time).format(
                        initialTimeFormat
                      ) || "-"
                    }
                  />
                </Grid>
              )}
              {/* Delivered Time */}
              {foodDetails && foodDetails?.status === "delivered" && (
                <Grid item xs={6} lg={4} xl={3}>
                  <BoxCards
                    title="Delivered Time"
                    values={
                      moment(foodDetails?.deliver_time).format(
                        initialTimeFormat
                      ) || "-"
                    }
                  />
                </Grid>
              )}
              {/* Cancelled At */}
              {foodDetails && foodDetails?.status === "cancelled" && (
                <Grid item xs={6} lg={4} xl={3}>
                  <BoxCards
                    title="Cancelled At"
                    values={
                      moment(foodDetails?.cancelled_at).format(
                        initialTimeFormat
                      ) || "-"
                    }
                  />
                </Grid>
              )}
              {/* Cancelled/Deliver By */}
              <Grid item xs={6} lg={4} xl={3}>
                <BoxCards
                  title={
                    foodDetails?.status === "cancelled"
                      ? `Cancelled ${
                          foodDetails?.cancelled_by === "auto" ? "" : "By"
                        }:`
                      : foodDetails?.status === "reject"
                      ? "Rejected By"
                      : "Deliver By"
                  }
                  values={
                    foodDetails?.status === "cancelled" ||
                    foodDetails?.status === "reject"
                      ? cancelledByName()
                      : deliverByName()
                  }
                />
              </Grid>
              {/* is_restaurant */}
              <Grid item xs={6} lg={4} xl={3}>
                <BoxCards
                  isChip={true}
                  title="Is Restaurant?"
                  style={{
                    color: "#FFF",
                    backgroundColor: foodDetails?.userDtl?.is_restaurant
                      ? "#2e7d32" //success
                      : "#d32f2f", //error
                  }}
                  values={
                    `${foodDetails?.userDtl?.is_restaurant ? "Yes" : "No"}` ||
                    "-"
                  }
                />
              </Grid>
              {/* restaurant_name */}
              {foodDetails?.userDtl?.is_restaurant && (
                <Grid item xs={6} lg={4} xl={3}>
                  <BoxCards
                    title="Restaurant Name"
                    values={foodDetails?.userDtl?.restaurant_name || "-"}
                  />
                </Grid>
              )}
              {/* restaurant_location */}
              {foodDetails?.userDtl?.is_restaurant && (
                <Grid item xs={12}>
                  <BoxCards
                    title="Restaurant Location"
                    values={
                      foodDetails?.userDtl?.restaurant_location?.city || "-"
                    }
                  />
                </Grid>
              )}
            </>
          )}

          {/* Request for self */}
          {foodDetails?.category_slug === "hunger" ? null : (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                isChip={true}
                title="Request for Self?"
                style={{
                  color: "#FFF",
                  backgroundColor: foodDetails?.form_data?.request_for_self
                    ? "#2e7d32" //success
                    : "#d32f2f", //error
                }}
                values={
                  foodDetails?.form_data?.request_for_self ? "Yes" : "No" || "-"
                }
              />
            </Grid>
          )}

          {/* Is Featured */}
          {/* {foodDetails?.category_slug === "hunger" ? null : (
            <Grid item xs={6}>
              <div className="details-text-div">
                <Typography>Featured?</Typography>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {foodDetails?.is_featured ? (
                    <Star style={{ color: "#FFD700" }} />
                  ) : (
                    <StarBorderOutlined />
                  )}
                  <Chip
                    style={{
                      color: "#FFF",
                      backgroundColor: foodDetails?.is_featured
                        ? "#2e7d32" //success
                        : "#d32f2f", //error
                    }}
                    label={foodDetails?.is_featured ? "Yes" : "No" || "-"}
                    size="small"
                  />
                </div>
              </div>
            </Grid>
          )} */}

          {(foodDetails?.category_slug === "health" ||
            foodDetails?.category_slug === "education") && (
            <>
              {/* reference_phone_number */}
              {foodDetails?.category_slug === "health" && (
                <Grid item xs={6} lg={4} xl={3}>
                  <BoxCards
                    title="Reference Phone Number"
                    values={
                      foodDetails?.form_data?.reference_phone_number
                        ?.phoneNumber
                        ? `${flag(
                            foodDetails?.form_data?.reference_phone_number
                              ?.short_name || ""
                          )} ${
                            foodDetails?.form_data?.reference_phone_number
                              ?.countryCodeD || ""
                          }${
                            foodDetails?.form_data?.reference_phone_number
                              ?.phoneNumber || ""
                          }`
                        : foodDetails?.form_data?.reference_phone_number || ""
                    }
                  />
                </Grid>
              )}
              {/* uhid_number */}
              {foodDetails?.category_slug === "health" && (
                <Grid item xs={6} lg={4} xl={3}>
                  <BoxCards
                    title="UHID Number"
                    values={foodDetails?.form_data?.uhid_number || "-"}
                  />
                </Grid>
              )}
              {/* patient_s_age / age */}
              {foodDetails?.form_data?.request_for_self ? null : (
                <Grid item xs={6} lg={4} xl={3}>
                  <BoxCards
                    title={
                      foodDetails?.category_slug === "health"
                        ? "Patient's Age"
                        : "Age"
                    }
                    values={foodDetails?.form_data?.age || "-"}
                  />
                </Grid>
              )}
              {/* already_admission */}
              <Grid item xs={6} lg={4} xl={3}>
                <BoxCards
                  isChip={true}
                  title={`Already
                    ${
                      foodDetails?.category_slug === "health"
                        ? "Admitted?"
                        : "Pursuing?"
                    }`}
                  style={{
                    color: "#FFF",
                    backgroundColor:
                      foodDetails?.form_data?.already_admission === "Yes"
                        ? "#2e7d32" //success
                        : "#d32f2f", //error
                  }}
                  values={
                    foodDetails?.form_data?.already_admission === "Yes"
                      ? "Yes"
                      : "No" || "-"
                  }
                />
              </Grid>
              {/* relation_with_patient / relation_with_beneficiary */}
              {foodDetails?.form_data?.request_for_self ? null : (
                <Grid item xs={6} lg={4} xl={3}>
                  <BoxCards
                    title={
                      foodDetails?.category_slug === "health"
                        ? "Relation with Patient"
                        : "Relation with Beneficiary"
                    }
                    values={
                      foodDetails?.form_data?.relation_with_beneficiary || "-"
                    }
                  />
                </Grid>
              )}
              {/* select_hospital / College Name */}
              <Grid item xs={6} lg={4} xl={3}>
                <BoxCards
                  title={
                    foodDetails?.category_slug === "health"
                      ? "Hospital Name"
                      : "College Name"
                  }
                  values={foodDetails?.form_data?.saayam_supported_name || "-"}
                />
              </Grid>
              {/* Medical condition / Qualification */}
              <Grid item xs={6} lg={4} xl={3}>
                <BoxCards
                  title={
                    foodDetails?.category_slug === "health"
                      ? "Medical Condition"
                      : "Applying For"
                  }
                  values={
                    foodDetails?.form_data?.choose_or_select_institute || "-"
                  }
                />
              </Grid>
              {/* specify_name Course */}
              {foodDetails?.category_slug === "education" && (
                <Grid item xs={6} lg={4} xl={3}>
                  <BoxCards
                    title="Course"
                    values={foodDetails?.form_data?.specify_name || "-"}
                  />
                </Grid>
              )}
              {/* beneficiary_address */}
              <Grid item xs={12}>
                <BoxCards
                  title="Beneficiary Location"
                  values={
                    foodDetails?.form_data?.request_for_self
                      ? foodDetails?.userDtl?.location?.city
                      : foodDetails?.location?.city || "-"
                  }
                />
              </Grid>
              {/* location Hospital/College */}
              <Grid item xs={12}>
                <BoxCards
                  title={
                    foodDetails?.category_slug === "health"
                      ? "Hospital Location"
                      : "College/School Location"
                  }
                  values={foodDetails?.form_data?.location?.city || "-"}
                />
              </Grid>
            </>
          )}
          {/* near by */}
          {foodDetails?.form_data?.near_by && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Near By"
                values={foodDetails?.form_data?.near_by || "-"}
              />
            </Grid>
          )}

          {/* currency */}
          {/* {foodDetails?.category_slug !== "hunger" && (
            <Grid item xs={4} xl={3}>
              <div className="details-text-div">
                <Typography>Currency</Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "50%",
                  }}
                >
                  <Typography variant="button" style={{ width: "100%" }}>
                    Name:
                    {foodDetails && (
                      <Typography
                        variant="inherit"
                        sx={{
                          color: "text.secondary",
                          wordBreak: "break-word",
                        }}
                      >
                        {foodDetails?.country_data?.currency_code || "-"}
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="button" style={{ width: "100%" }}>
                    Symbol:
                    {foodDetails && (
                      <Typography
                        variant="inherit"
                        sx={{
                          color: "text.secondary",
                          wordBreak: "break-word",
                        }}
                      >
                        {foodDetails?.country_data?.currency || "-"}
                      </Typography>
                    )}
                  </Typography>
                </Box>
              </div>
            </Grid>
          )} */}

          {/* Volunteer Address */}
          {foodDetails?.volunteer_address && (
            <Grid item xs={12}>
              <BoxCards
                title="Volunteer Address"
                values={foodDetails?.volunteer_address || ""}
              />
            </Grid>
          )}

          {/* write_your_story */}
          {(foodDetails?.category_slug === "fundraiser" ||
            foodDetails?.category_slug === "health" ||
            foodDetails?.category_slug === "education") && (
            <Grid item xs={12}>
              <BoxCards
                title="Story"
                values={foodDetails?.form_data?.write_your_story || ""}
              />
            </Grid>
          )}
        </Grid>
      </Grow>

      <AppDialog
        dividers
        // fullHeight
        maxWidth="sm"
        open={receiptModal}
        onClose={() => setReceiptModal(false)}
        title={"Receipt List"}
      >
        <BodyStyle>
          {adminDonations?.listsLoad ? (
            <Box
              sx={{
                height: "calc(30vh)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppLoader />
            </Box>
          ) : (
            <Grid container spacing={2} xs={12} style={{ margin: 0 }}>
              <CTable
                tableStyle={{
                  height: "calc(50vh) !important",
                  boxShadow: "none !important",
                }}
                initialState={{ pinnedColumns: { right: ["actions"] } }}
                NewBar={null}
                onRowClick={() => console.log("click bugs===")}
                onChange={(event) => onChange(event)}
                row={adminDonations?.lists}
                column={columns}
                rowCount={pagination.total}
                page={pagination.page}
                listsLoad={adminDonations?.listsLoad}
                checkboxSelection={false}
                onSelectionModelChange={() => console.log("row select")}
                getApiCall={getAdminDonations}
              />
            </Grid>
          )}
        </BodyStyle>
      </AppDialog>

      <BankDetailModal
        getFoodDetails={getFoodDetails}
        visible={bankDetailModal}
        setVisible={setBankDetailModal}
        banDetails={banDetails}
        foodDetails={foodDetails}
        from={"featuredDetail"}
        loader={loader}
      />

      <StatusModal
        status={foodDetails?.fundraiser_status}
        statusModal={statusModal}
        setStatusModal={setStatusModal}
      />

      <UserDataModal
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        foodDetails={foodDetails}
        visible={dataModal}
        setVisible={setDataModal}
      />

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
