import React, { useEffect, useState } from "react";
import { AppConfirmDialog, AppLoader } from "@crema";
import { styled } from "@mui/material/styles";
import {
  Typography,
  Box,
  Grid,
  Button,
  Badge,
  Breadcrumbs,
  FormControlLabel,
  Checkbox,
  TextField,
  Alert,
} from "@mui/material";
import { isEmpty, isArray, upperFirst } from "lodash";
import nodata from "@crema/Lotties/nodata.json";
import Lottie from "lottie-react";
import {
  ReportGmailerrorred,
  CheckCircleOutlined,
  ThumbDownOffAlt,
  Block,
  AssignmentIndOutlined,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { Link, useLocation, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import * as yup from "yup";
import UserData from "components/Food/UserData";
import BasicDetails from "components/Food/BasicDetails";
import FeaturedDetails from "components/Food/FeaturedDetails";
import TimeLineData from "components/Food/TimeLine";
import ImageSlider from "components/Food/ImageSlider";
import getApiData from "../../../shared/helpers/apiHelper";
import Map from "./map";
import ReportsTable from "./ReportsTable";
import DonationListTable from "./DonationListTable";
import { useDispatch, useSelector } from "react-redux";
import { setActiveCategory } from "redux/actions/ActiveCategory";
import { AppState } from "redux/store";
import { LoadingButton } from "@mui/lab";
import { Fonts } from "shared/constants/AppEnums";
import DialogSlide from "components/DialogSlide";
import AppDialog from "@crema/core/AppDialog";
import { GridSortModel } from "@mui/x-data-grid-pro";

const validationSchema = yup.object({
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description should be 10 chars minimum.")
    .max(250, "Maximum 250 characters allowed"),
});

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const BodyStyle = styled(Box)(({ theme }) => ({
  "& .topDiv": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    top: "60px",
    backgroundColor: "#f4f7fe",
    zIndex: 1000001,
  },
  "& .stickyClass": {
    backgroundColor: "#f4f7fe",
    position: "sticky",
    top: "60px",
    zIndex: 10,
    paddingBottom: "10px",
    height: "64px",
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  "& .btnsDiv": { display: "flex", alignItems: "center" },
  "& .go": { "& .reportBtn": { color: "#FFF", backgroundColor: "#D32F2F" } },
  "& .bottomSpace": { marginBottom: 50 },
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
  "& .details-title": { fontWeight: "500", marginRight: 10 },
}));

const DetailViewWrapper = styled(Box)(({ theme }) => {
  return {
    transition: "all 0.5s ease",
    transform: "translateY(10%)",
    width: "100%",
    height: "100%",
    zIndex: 1,
    opacity: 0,
    visibility: "hidden",
  };
});

const ModalWrapper = styled(Box)(({ theme }) => ({
  "& .modalStyle": { width: 500 },
  "& .modalBtnDiv": {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
}));

const FoodDetail = (props) => {
  const { notiData } = useSelector<AppState, AppState["Notificationdata"]>(
    ({ Notificationdata }) => Notificationdata
  );
  const location: any = useLocation();
  const catSlug = location?.state?.category_slug;
  const { id }: { id: string } = useParams();

  const dispatch = useDispatch();
  const [foodDetails, setFoodDetails] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [approveLoad, setApproveLoad] = useState<boolean>(false);
  const [rejectLoad, setRejectLoad] = useState<boolean>(false);
  const [blockLoad, setBlockLoad] = useState<boolean>(false);
  const [btnType, setBtnType] = useState<any>("");
  const [cancelModal, setCancelModal] = useState<boolean>(false);
  const [reportsVisible, setReportsVisible] = useState<boolean>(false);
  const [donationListModal, setDonationListModal] = useState<boolean>(false);
  const [bankModal, setBankModal] = useState<boolean>(false);
  const [visible, setVisible] = useState<any>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [assignLoad, setAssignLoad] = React.useState<any>(false);
  const [urgentCheck, setUrgentCheck] = useState<boolean>(false);
  const [donorsList, setDonorsList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);

  // API For get food details
  async function getFoodDetails(loading?: any, isOpen?: any) {
    if (loading) {
      setLoader(true);
    } else {
      setLoader(false);
    }
    try {
      let requestId = "";
      if (
        props?.location?.state?.from &&
        props?.location?.state?.from === "notification"
      ) {
        requestId = props?.location?.state?.request_id;
      } else {
        requestId = id;
      }
      const res = await getApiData(
        `request/admin/cause-request-detail?id=${requestId}&category_slug=${catSlug}`,
        {},
        "GET"
      );
      if (res.success) {
        setFoodDetails(res && res.data ? res.data : {});
        // setUrgentCheck(res.data.form_data?.urgent_help ? true : false);
        setLoader(false);
        getDonorsList({ page: 1 });
        if (isOpen === "open") {
          setBankModal(true);
        }
      } else {
        setFoodDetails({});
        toast.error(res.message);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      setFoodDetails({});
      toast.error("Something went wrong");
    }
  }

  // API For Verify fundraiser request verification
  async function submitData(data: any) {
    if (btnType === "reject") {
      setRejectLoad(true);
    } else if (btnType === "block" || btnType === "unblock") {
      setBlockLoad(true);
    } else {
      setApproveLoad(true);
    }

    const id = foodDetails?._id;
    let nData = {};
    if (btnType === "reject") {
      nData = {
        reject_reason: data.description,
        allow_edit_request: data.allow_edit_request,
        status: "reject",
      };
    } else if (btnType === "block" || btnType === "unblock") {
      nData = { id: id, reason: data.description };
    } else {
      nData = { status: "approve", is_urgent: urgentCheck };
    }
    let url = "";
    if (btnType === "block") {
      url = `admin/block-request`;
    } else if (btnType === "unblock") {
      url = `admin/unblock-request`;
    } else {
      url = `request/fundraiser-verify/${id}`;
    }
    try {
      const res = await getApiData(
        url,
        nData,
        btnType === "block" || btnType === "unblock" ? "POST" : "PUT"
      );
      if (res.success) {
        getFoodDetails(true);
        setBtnType("");
        setCancelModal(false);
        setVisible("");
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setRejectLoad(false);
      setBlockLoad(false);
      setApproveLoad(false);
    } catch (error) {
      toast.error("Something went wrong!");
      setRejectLoad(false);
      setBlockLoad(false);
      setApproveLoad(false);
    }
  }

  //API for assign request to voluntter
  async function actionAssign() {
    setAssignLoad(true);
    try {
      let helpID = id;
      if (location?.state?.from === "notification") {
        helpID = location?.state?.request_id;
      } else {
        helpID = id;
      }
      const res = await getApiData(
        `request/admin/assign-volunteer`,
        { id: helpID },
        "POST"
      );
      if (res.success) {
        toast.success(res.message);
        setModalOpen(false);
        await getFoodDetails(true);
      } else {
        toast.error(res.message);
      }
      setAssignLoad(false);
    } catch (error) {
      setAssignLoad(false);
      console.log("delete error", error);
      toast.error("Something went wrong");
    }
  }

  //API For get donors list list
  async function getDonorsList(nData: any) {
    setDonorsList((e: any) => ({ ...e, listsLoad: true }));
    let dId = "";
    if (
      props?.location?.state?.from &&
      props?.location?.state?.from === "notification"
    ) {
      dId = props?.location?.state?.request_id;
    } else {
      dId = id;
    }
    try {
      const res = await getApiData(`request/admin/donors-list/${dId}`, nData);
      if (res.success) {
        setDonorsList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setDonorsList({ lists: [], listsLoad: false });
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      setDonorsList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!isEmpty(notiData)) {
      getFoodDetails(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notiData]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setUrgentCheck(foodDetails?.form_data?.urgent_help || false);
  }, [foodDetails]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (location.state.category_slug) {
      getFoodDetails(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const handleClose = () => {
    setBtnType("");
    setCancelModal(false);
    setRejectLoad(false);
    setBlockLoad(false);
    setApproveLoad(false);
  };

  return (
    <DetailViewWrapper>
      <BodyStyle>
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
            <>
              <Grid
                container
                spacing={2}
                xs={12}
                className="stickyClass"
                sx={{ backgroundColor: "#FFF", width: "100%", m: 0 }}
              >
                <Grid item>
                  <Box
                    component="h2"
                    sx={{
                      fontSize: 16,
                      color: "text.primary",
                      fontWeight: Fonts.SEMI_BOLD,
                    }}
                  >
                    Cause Detail:
                  </Box>
                </Grid>
                {foodDetails?.status === "cancelled" ||
                isEmpty(foodDetails) ||
                foodDetails?.category_slug === "hunger" ? null : (
                  <>
                    <Grid
                      item
                      sx={{
                        pr: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      {foodDetails?.status === "reject" ||
                      foodDetails?.status === "complete" ||
                      foodDetails?.status === "close" ||
                      foodDetails?.status === "expired" ||
                      foodDetails?.status === "blocked" ||
                      foodDetails?.status === "approve" ? null : (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Checkbox
                            defaultChecked={urgentCheck}
                            sx={{ ml: 0 }}
                            onChange={(e) => {
                              // if (isUrgent) {
                              //   return null;
                              // } else {
                              setUrgentCheck(e.target.checked);
                              // }
                            }}
                            color="success"
                            checked={urgentCheck}
                            size="small"
                          />
                          <Box component="span" sx={{ mr: 5, color: "grey" }}>
                            {foodDetails?.form_data?.urgent_help
                              ? "User requested this request as Urgent Help"
                              : "Add this request to Urgent Request"}
                          </Box>
                        </Box>
                      )}
                      {urgentCheck && foodDetails?.status === "approve" ? (
                        <Box sx={{ mr: 4 }}>
                          <Alert
                            severity="success"
                            color="success"
                            variant="outlined"
                            sx={{
                              borderColor: "green",
                              alignItems: "center",
                              p: "6px",
                              "& .MuiAlert-icon": {
                                p: 0,
                                mr: "5px",
                                color: "green",
                              },
                              "& .MuiAlert-message": { p: 0, mb: "1px" },
                            }}
                          >
                            Approved as Urgent
                          </Alert>
                        </Box>
                      ) : null}
                      {foodDetails?.status === "reject" ||
                      foodDetails?.status === "complete" ||
                      foodDetails?.status === "close" ||
                      foodDetails?.status === "blocked" ||
                      foodDetails?.status === "expired" ? null : (
                        <LoadingButton
                          size="small"
                          variant="contained"
                          color="success"
                          sx={{ color: "#fff" }}
                          startIcon={<CheckCircleOutlined />}
                          loading={approveLoad}
                          onClick={() => setVisible("approve")}
                          disabled={
                            foodDetails?.status === "approve" ||
                            approveLoad ||
                            foodDetails?.status === "expired"
                          }
                        >
                          {foodDetails?.status === "approve"
                            ? "Approved"
                            : foodDetails?.status === "reject"
                            ? "Rejected"
                            : foodDetails?.status === "waiting_for_verify"
                            ? "Reverify"
                            : "Approve"}
                        </LoadingButton>
                      )}
                      {/* {foodDetails?.form_data?.urgent_help &&
                    foodDetails?.status === "approve" ? (
                      <LoadingButton
                        size="small"
                        variant="contained"
                        color="success"
                        sx={{ color: "#fff", ml: 5 }}
                        startIcon={<CheckCircleOutlined />}
                        onClick={() => submitData("urgent")}
                        loading={urgentApproveLoad}
                        disabled={
                          foodDetails?.form_data?.urgent_help_status ===
                            "approve" || urgentApproveLoad
                        }
                      >
                        {foodDetails?.form_data?.urgent_help_status ===
                        "approve"
                          ? "Urgent Approved"
                          : "Urgent Approve"}
                      </LoadingButton>
                    ) : null} */}

                      {/* {foodDetails?.form_data?.urgent_help_status === "approve" ||
                    foodDetails?.form_data?.urgent_help
                      ? null
                      : foodDetails?.status === "approve" && (
                          <>
                            <LoadingButton
                              size="small"
                              variant="outlined"
                              color="success"
                              sx={{ ml: 5 }}
                              startIcon={<CheckCircleOutlined />}
                              onClick={(event) => {
                                handleClick(event);
                                setVisible("makeurgent");
                              }}
                              loading={makeUrgentLoad}
                              disabled={
                                foodDetails?.form_data?.urgent_help_status ===
                                  "approve" || makeUrgentLoad
                              }
                            >
                              <IntlMessages id="Make Urgent" />
                            </LoadingButton>
                          </>
                        )} */}

                      {foodDetails?.status === "complete" ||
                      foodDetails?.status === "close" ||
                      foodDetails?.status === "blocked" ||
                      foodDetails?.status === "expired" ? null : (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<ThumbDownOffAlt />}
                          sx={{
                            marginLeft:
                              foodDetails?.ngo_status === "reject" ? 0 : 5,
                          }}
                          onClick={() => {
                            setBtnType("reject");
                            setCancelModal(true);
                          }}
                          disabled={
                            foodDetails?.status === "reject" || rejectLoad
                          }
                        >
                          {foodDetails?.status === "reject"
                            ? "Rejected"
                            : "Reject"}
                        </Button>
                      )}
                      {foodDetails &&
                      foodDetails?.report_benificiary &&
                      foodDetails?.report_benificiary.length > 0 ? (
                        <>
                          <Badge
                            color="secondary"
                            badgeContent={
                              foodDetails?.report_benificiary?.length || 0
                            }
                            max={99}
                          >
                            <Button
                              size="small"
                              variant="outlined"
                              className="reportBtn"
                              onClick={() => setReportsVisible(!reportsVisible)}
                              id="go"
                              startIcon={<ReportGmailerrorred />}
                              color="warning"
                              sx={{ marginLeft: 5 }}
                            >
                              Reports
                            </Button>
                          </Badge>
                          <Button
                            size="small"
                            variant="outlined"
                            className="reportBtn"
                            onClick={() => {
                              setBtnType(
                                foodDetails?.status === "blocked"
                                  ? "unblock"
                                  : "block"
                              );
                              setCancelModal(true);
                            }}
                            disabled={blockLoad}
                            startIcon={<Block />}
                            color="error"
                            sx={{ marginLeft: 5 }}
                          >
                            {foodDetails?.status === "blocked"
                              ? "Unblock"
                              : "Block"}
                          </Button>
                        </>
                      ) : null}

                      {foodDetails &&
                      !isEmpty(foodDetails) &&
                      (foodDetails?.status === "pending" ||
                        foodDetails?.status === "reverify" ||
                        foodDetails?.status === "waiting_for_volunteer") ? (
                        <Button
                          size="small"
                          disabled={
                            assignLoad ||
                            foodDetails?.status === "waiting_for_volunteer" ||
                            foodDetails?.status === "approve"
                              ? true
                              : false
                          }
                          variant="outlined"
                          startIcon={<AssignmentIndOutlined />}
                          color="secondary"
                          onClick={() => setModalOpen(true)}
                          sx={{ marginLeft: 5 }}
                        >
                          {foodDetails?.status === "waiting_for_volunteer"
                            ? "Waiting For Volunteer"
                            : foodDetails?.status === "approve"
                            ? "Approved by Volunteer"
                            : "Assign Volunteer"}
                        </Button>
                      ) : null}
                    </Grid>
                  </>
                )}
              </Grid>

              <Grid item xs={12} sx={{ paddingTop: "0px !important" }}>
                <Breadcrumbs aria-label="breadcrumb">
                  <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                    Dashboards
                  </Link>
                  <Link
                    className="linkClass"
                    onClick={() => dispatch(setActiveCategory(""))}
                    to={{
                      pathname: "/manage-requests",
                      state: { from: "requests", selectedID: "" },
                    }}
                  >
                    Manage Requests
                  </Link>
                  {foodDetails?.category_slug ? (
                    <Link
                      className="linkClass"
                      to={{
                        pathname: "/manage-requests",
                        state: {
                          from: "request-detail",
                          selectedID: foodDetails?.category_slug,
                        },
                      }}
                    >
                      {foodDetails?.category_slug?.charAt(0).toUpperCase() +
                        foodDetails?.category_slug?.slice(1) || ""}
                    </Link>
                  ) : null}
                  <Typography color="text.primary">
                    {location?.state?.category_slug === "hunger" ||
                    location?.state?.category_slug === "health" ||
                    location?.state?.category_slug === "education"
                      ? foodDetails?.uname
                      : foodDetails?.form_data?.title_of_fundraiser}
                  </Typography>
                </Breadcrumbs>
              </Grid>

              {foodDetails && !isEmpty(foodDetails) ? (
                <>
                  {/* Map View */}
                  {foodDetails?.category_slug === "hunger" && (
                    <Grid item xs={12} sm={12}>
                      <Map
                        data={foodDetails}
                        containerElement={<div className="containerElemant" />}
                      />
                    </Grid>
                  )}

                  {/* UserData Details */}
                  {foodDetails?.category_slug === "hunger" && (
                    <Grid xs={12} sm={12}>
                      <UserData
                        foodDetails={foodDetails}
                        getFoodDetails={getFoodDetails}
                      />
                    </Grid>
                  )}

                  <Grid container spacing={4} xs={12} style={{ margin: 0 }}>
                    {/* Status And Basic Deatils View */}
                    <Grid item xs={12} lg={12} xl={12}>
                      <BasicDetails
                        setDonationListModal={setDonationListModal}
                        bankModal={bankModal}
                        foodDetails={foodDetails}
                        getFoodDetails={getFoodDetails}
                      />
                    </Grid>

                    {/* Timeline View */}
                    <Grid item xs={12} lg={12} xl={12}>
                      <TimeLineData
                        foodDetails={foodDetails}
                        donorsList={donorsList}
                      />
                    </Grid>
                  </Grid>

                  {/* Featured Deatils View */}
                  {foodDetails?.plan && !isEmpty(foodDetails?.plan) ? (
                    <Grid item xs={12} xl={12}>
                      <FeaturedDetails foodDetails={foodDetails} />
                    </Grid>
                  ) : null}

                  {/* User Image Slider */}
                  <Grid item xs={12} xl={12} sx={{ pl: "0px !important" }}>
                    <ImageSlider foodDetails={foodDetails} />
                  </Grid>
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Lottie
                    loop={true}
                    autoPlay={true}
                    animationData={nodata}
                    style={{ width: 300, height: 300 }}
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
        <div className="bottomSpace" />
      </BodyStyle>

      <DialogSlide
        open={cancelModal}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle={`${
          btnType === "block"
            ? "Block"
            : btnType === "unblock"
            ? "Unblock"
            : "Reject"
        } ${upperFirst(foodDetails?.category_slug) || ""} Request`}
      >
        <ModalWrapper>
          <Box className="modalStyle">
            <Formik
              validateOnChange={true}
              initialValues={{ description: "", allow_edit_request: true }}
              validationSchema={validationSchema}
              onSubmit={(values) => submitData(values)}
            >
              {(props) => {
                const {
                  values,
                  touched,
                  errors,
                  handleChange,
                  handleSubmit,
                  handleBlur,
                  setFieldValue,
                } = props;
                return (
                  <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                      <TextField
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={(event: any) => {
                          const str = event.target.value.replace(/\s\s+/g, " ");
                          const trimStr = str.trim();
                          setFieldValue("description", trimStr);
                          handleBlur(event);
                        }}
                        variant="outlined"
                        fullWidth
                        inputProps={{ maxLength: 250 }}
                        helperText={`${values.description.length} / 250`}
                        minRows={3}
                        maxRows={5}
                        multiline={true}
                        label={
                          btnType === "block"
                            ? "Reason for Block"
                            : btnType === "unblock"
                            ? "Reason for Unblock"
                            : "Reason of rejection"
                        }
                        placeholder={
                          btnType === "block"
                            ? "Please enter the Reason for Block"
                            : btnType === "unblock"
                            ? "Please enter the Reason for Unblock"
                            : "Please enter the Reason for Rejection"
                        }
                      />
                      {errors.description && touched.description && (
                        <ErrorTextStyle>{errors.description}</ErrorTextStyle>
                      )}
                    </Box>
                    {btnType === "block" || btnType === "unblock" ? null : (
                      <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                        <FormControlLabel
                          name="allow_edit_request"
                          control={
                            <Checkbox
                              defaultChecked={true}
                              onChange={(e) => handleChange(e)}
                              value={values.allow_edit_request}
                              size="small"
                            />
                          }
                          label="Allow user for edit request after rejection"
                        />
                      </Box>
                    )}
                    <div className="modalBtnDiv">
                      <LoadingButton
                        size="small"
                        type="submit"
                        variant="outlined"
                        color="primary"
                        loading={blockLoad || rejectLoad}
                        disabled={blockLoad || rejectLoad}
                      >
                        Submit
                      </LoadingButton>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </ModalWrapper>
      </DialogSlide>

      <AppConfirmDialog
        open={!isEmpty(visible)}
        disabled={approveLoad}
        loading={approveLoad}
        onDeny={() => setVisible("")}
        onConfirm={() => submitData("approve")}
        title={`Are you sure you want to Approve this request?`}
        dialogTitle={"Approve Request"}
      />

      <AppConfirmDialog
        open={modalOpen}
        disabled={assignLoad}
        loading={assignLoad}
        onDeny={() => {
          setAssignLoad(false);
          setModalOpen(false);
        }}
        title="Are you sure you want to assign this request to volunteer?"
        subTitle="(All the nearby volunteer will get the notification)"
        onConfirm={() => actionAssign()}
        dialogTitle="Assign To Volunteer"
      />

      {/* Modal for donors lists */}
      <AppDialog
        open={donationListModal}
        maxWidth={"lg"}
        onClose={() => setDonationListModal(false)}
        dividers
        title={"Donors List"}
      >
        <DonationListTable
          sortModel={sortModel}
          setSortModel={setSortModel}
          pagination={pagination}
          getDonorsList={getDonorsList}
          donorsList={donorsList}
        />
      </AppDialog>

      {/* Modal for reports lists */}
      <AppDialog
        open={reportsVisible}
        maxWidth={"lg"}
        onClose={() => setReportsVisible(false)}
      >
        <ReportsTable categoryList={foodDetails?.report_benificiary} />
      </AppDialog>
    </DetailViewWrapper>
  );
};
export default FoodDetail;
