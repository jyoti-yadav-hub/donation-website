/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { AppConfirmDialog, AppLoader } from "@crema";
import {
  Box,
  Button,
  Grid,
  Typography,
  Breadcrumbs,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import { toast } from "react-toastify";
import nodata from "@crema/Lotties/nodata.json";
import Lottie from "lottie-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { isEmpty, flattenDeep, isArray } from "lodash";
import getApiData from "../../../shared/helpers/apiHelper";
import { AppState } from "redux/store";
import { useSelector } from "react-redux";
import MediaViewer from "@crema/core/AppMedialViewer";
import {
  // CheckCircleOutlineOutlined,
  ReportGmailerrorred,
  // ThumbDownOffAltOutlined,
  Block,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Fonts } from "shared/constants/AppEnums";
import DialogSlide from "components/DialogSlide";
import AppDialog from "@crema/core/AppDialog";
import BasicDetails from "components/DriveDetails";
import ImageSlider from "components/Food/ImageSlider";
import DriveFeed from "components/DriveDetails/DriveFeed";
import VolunteersList from "components/DriveDetails/VolunteerTable";
import ReportedUsers from "components/DriveDetails/ReportedUserTable";
import { GridSortModel } from "@mui/x-data-grid-pro";

const BodyStyle = styled(Box)(({ theme }) => ({
  "& .btnsDiv": {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  "& .topDiv": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    top: "60px",
    backgroundColor: "#f4f7fe",
    zIndex: 10,
  },
  "& .stickyClass": {
    position: "sticky",
    top: "60px",
    backgroundColor: "#f4f7fe",
    zIndex: 10,
    paddingBottom: "10px",
    minHeight: 64,
  },
  "& .bottomSpace": { marginBottom: 50 },
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
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

const DriveDetail = (props) => {
  const { id }: { id: string } = useParams();
  const location: any = useLocation();
  const [driveDetails, setDriveDetail] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [approveLoad, setApproveLoad] = useState<boolean>(false);
  const [rejectLoad, setRejectLoad] = useState<boolean>(false);
  const [blockLoad, setBlockLoad] = useState<boolean>(false);
  const [btnType, setBtnType] = useState<any>("");
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [reportsVisible, setReportsVisible] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [unblockVisible, setUnblockVisible] = useState<boolean>(false);
  const [index, setIndex] = useState(-1);
  const [imgUrl, setImgUrl] = React.useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [nextPage, setNextPage] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);
  const [feedData, setFeedData] = useState<any>({
    lists: [],
    listsLoad: false,
    total: 0,
  });
  const [reportedUserList, setReportedUserList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "asc" },
  ]);

  const onClose = () => {
    setIndex(-1);
    setImgUrl("");
  };

  const { notiData } = useSelector<AppState, AppState["Notificationdata"]>(
    ({ Notificationdata }) => Notificationdata
  );

  //API For get reorted users list lists
  async function getUsersList(nData: any) {
    if (nData.noLoad) {
      setReportedUserList((e) => ({ ...e, listsLoad: false }));
    } else {
      setReportedUserList((e) => ({ ...e, listsLoad: true }));
    }
    let driveId = "";
    if (location?.state?.from === "notification") {
      driveId = location?.state?.id;
    } else {
      driveId = id;
    }
    try {
      const res = await getApiData(
        `drive/reported-user-list/${driveId}`,
        nData
      );
      if (res.success) {
        setReportedUserList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setReportedUserList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setReportedUserList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    flt.operator = "contains";
    getUsersList(flt);
  }

  //API for get feed lists
  async function getFeedList(currentPage = page) {
    let data = { page: currentPage };
    setFeedData((e) => ({ ...e, listsLoad: true }));
    setLoading(true);
    try {
      let driveId = "";
      if (location?.state?.from === "notification") {
        driveId = location?.state?.id;
      } else {
        driveId = id;
      }
      const res = await getApiData(
        `drive/admin/feed-list/${driveId}?page=${data.page}`,
        {},
        "GET"
      );
      if (res.success) {
        let tempPArr = res.data;
        if (data.page > 1) {
          tempPArr = flattenDeep([feedData.lists, res?.data]);
        }
        if (res?.next_enable === 1) {
          setNextPage(true);
        } else {
          setNextPage(false);
        }
        setNextLoading(false);
        getUsersList({
          page: 1,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
        setFeedData({
          lists: tempPArr || [],
          listsLoad: false,
          total: res.total_count,
        });
      } else {
        setFeedData({ lists: [], listsLoad: false, total: 0 });
        toast.error(res.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setFeedData({ lists: [], listsLoad: false, total: 0 });
      toast.error("Something went wrong");
    }
  }

  //API For get drive details
  async function getDriveDetails(type?: any) {
    if (type === "noload") {
      setLoader(false);
    } else {
      setLoader(true);
    }
    try {
      let driveId = "";
      if (location?.state?.from === "notification") {
        driveId = location?.state?.id;
      } else {
        driveId = id;
      }

      const res = await getApiData(`drive/admin/detail/${driveId}`, {}, "GET");
      if (res.success) {
        setDriveDetail(res && res.data ? res.data : {});
        setLoader(false);
        getFeedList();

        if (type === "open") {
          setReportsVisible(true);
        }
      } else {
        setDriveDetail({});
        toast.error(res.message);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      setDriveDetail({});
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (!isEmpty(notiData)) {
      getDriveDetails("noload");
    }
  }, [notiData]);

  const onEndReached = () => {
    const tempPage = page + 1;
    setNextLoading(true);
    setPage(tempPage);
    getFeedList(tempPage);
  };

  useEffect(() => {
    getDriveDetails();
  }, [location?.state]);

  async function submitData(data: any) {
    if (btnType === "reject") {
      setRejectLoad(true);
    } else if (btnType === "block" || data === "unblock") {
      setBlockLoad(true);
    } else {
      setApproveLoad(true);
    }
    const id = driveDetails?._id;
    let nData = {};
    if (btnType === "reject") {
      nData = {
        reject_reason: data.description,
        allow_edit_drive: data.allow_edit_drive,
        status: "reject",
      };
    } else if (btnType === "block" || data === "unblock") {
      nData = { reason: data.description, id: id };
    } else if (data === "unblock") {
      nData = { id: id };
    } else {
      nData = { status: "approve" };
    }
    let url = "";
    if (btnType === "block") {
      url = `drive/block`;
    } else if (data === "unblock") {
      url = `drive/unblock`;
    } else {
      url = `drive/verify-drive/${id}`;
    }

    try {
      const res = await getApiData(url, nData, "POST");
      if (res.success) {
        getDriveDetails();
        setBtnType("");
        setVisible(false);
        setUnblockVisible(false);
        props.getDrivesList();
        let resMessage = "";
        if (btnType === "reject") {
          resMessage = "Reject successfully";
        } else if (btnType === "block") {
          resMessage = "Blocked successfully";
        } else {
          resMessage = "Approved successfully";
        }
        toast.success(res.message || resMessage);
      } else {
        toast.error(res.message);
      }
      setRejectLoad(false);
      setApproveLoad(false);
      setBlockLoad(false);
      setDltLoad(false);
    } catch (error) {
      setRejectLoad(false);
      setApproveLoad(false);
      setBlockLoad(false);
      setDltLoad(false);
    }
  }

  const handleClose = () => {
    setBtnType("");
    setRejectLoad(false);
    setBlockLoad(false);
    setApproveLoad(false);
  };

  const current_date_time = new Date().toISOString();
  const start_date_time = driveDetails?.form_data?.start_date_time;

  return (
    <DetailViewWrapper>
      <BodyStyle>
        <Grid
          container
          spacing={4}
          xs={12}
          style={{ margin: 0, width: "100%" }}
          className="topDiv"
        >
          {loader ? (
            <Grid item xs={3} sx={{ height: "100vh - 70px" }}>
              <AppLoader />
            </Grid>
          ) : (
            <>
              <Grid item xs={3} className="stickyClass">
                <Box
                  component="h2"
                  sx={{
                    fontSize: 16,
                    color: "text.primary",
                    fontWeight: Fonts.SEMI_BOLD,
                  }}
                >
                  Drive Details:
                </Box>
              </Grid>
              {driveDetails && !isEmpty(driveDetails) ? (
                <Grid item xs={9} className="btnsDiv stickyClass">
                  {/* {driveDetails?.status === "reject" ||
                  driveDetails?.status === "cancelled" ||
                  driveDetails?.status === "cancel" ? null : (
                    <LoadingButton
                      size="small"
                      variant="outlined"
                      color="success"
                      startIcon={<CheckCircleOutlineOutlined />}
                      onClick={() => setVisible(true)}
                      loading={approveLoad}
                      disabled={
                        approveLoad ||
                        driveDetails?.status === "approve" ||
                        driveDetails?.status === "reject" ||
                        driveDetails?.status === "reverify" ||
                        driveDetails?.status === "blocked"
                      }
                    >
                      {driveDetails?.status === "approve" ||
                      driveDetails?.status === "blocked"
                        ? "Approved"
                        : (driveDetails?.reject_time &&
                            driveDetails?.status === "pending") ||
                          driveDetails?.status === "waiting_for_verify"
                        ? "Reverify"
                        : "Approve"}
                    </LoadingButton>
                  )} */}
                  {/* {driveDetails?.status === "blocked" ||
                  driveDetails?.status === "cancelled" ||
                  driveDetails?.status === "cancel" ||
                  start_date_time < current_date_time ? null : (
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<ThumbDownOffAltOutlined />}
                      sx={{ ml: 5 }}
                      onClick={() => setBtnType("reject")}
                      disabled={driveDetails?.status === "reject" || rejectLoad}
                    >
                      {driveDetails?.status === "reject"
                        ? "Rejected"
                        : "Reject"}
                    </Button>
                  )} */}
                  {reportedUserList?.lists &&
                    !isEmpty(reportedUserList?.lists) && (
                      <>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setReportsVisible(!reportsVisible)}
                          startIcon={<ReportGmailerrorred />}
                          color="warning"
                          sx={{ marginLeft: 5 }}
                        >
                          Reported Users
                        </Button>
                      </>
                    )}
                  {(driveDetails?.status === "complete" ||
                  driveDetails?.status === "cancel" ||
                  driveDetails?.status === "ongoing" ||
                  driveDetails?.status === "complete"
                    ? null
                    : driveDetails?.status === "approve" ||
                      driveDetails?.status === "blocked" ||
                      start_date_time < current_date_time) && (
                    <Button
                      size="small"
                      variant="outlined"
                      className="reportBtn"
                      onClick={() => {
                        if (driveDetails?.status === "blocked") {
                          setUnblockVisible(true);
                        } else {
                          setBtnType("block");
                        }
                      }}
                      disabled={blockLoad}
                      startIcon={<Block />}
                      color="error"
                      sx={{ marginLeft: 5 }}
                    >
                      {driveDetails?.status === "blocked" ? "Unblock" : "Block"}
                    </Button>
                  )}
                </Grid>
              ) : null}
              {/* Breadcrumbs */}
              <Grid item xs={12} sx={{ paddingTop: "0px !important" }}>
                <Breadcrumbs sx={{ margin: "0px 0px 0px" }}>
                  <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                    Dashboards
                  </Link>
                  {props.from === "cancelled-Drive" ? (
                    <Link
                      className="linkClass"
                      to={{ pathname: "/cancelled-Drive" }}
                    >
                      Cancelled Drive
                    </Link>
                  ) : (
                    <Link
                      className="linkClass"
                      to={{ pathname: "/drive-lists" }}
                    >
                      Drives List
                    </Link>
                  )}
                  <Typography color="text.primary">
                    {driveDetails?.form_data?.title_of_fundraiser || "-"}
                  </Typography>
                </Breadcrumbs>
              </Grid>
              {driveDetails && !isEmpty(driveDetails) ? (
                <Grid container spacing={3} sx={{ width: "100%", m: 0 }}>
                  {/* Details side */}
                  <Grid
                    item
                    lg={!isEmpty(feedData?.lists) ? 8 : 12}
                    xl={!isEmpty(feedData?.lists) ? 9 : 12}
                  >
                    {/* BasicDetails  */}
                    <Grid item xs={12}>
                      <BasicDetails driveDetails={driveDetails} />
                    </Grid>
                    {/* User Image Slider */}
                    <Grid item xs={12}>
                      <ImageSlider foodDetails={driveDetails} />
                    </Grid>
                  </Grid>
                  {/* DriveFeed */}
                  {!isEmpty(feedData?.lists) && (
                    <Grid item lg={4} xl={3}>
                      <DriveFeed
                        feedData={feedData}
                        nextLoading={nextLoading}
                        nextPage={nextPage}
                        loading={loading}
                        onEndReached={() => onEndReached()}
                      />
                    </Grid>
                  )}
                  {/* Volunteer List Table */}
                  <Grid item xs={12} sx={{ mt: 4 }}>
                    <VolunteersList id={driveDetails?._id} />
                  </Grid>
                </Grid>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    backgroundColor: "#FCFCF9",
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

        <MediaViewer
          index={index}
          medias={[imgUrl].map((data) => {
            return { url: data, mime_type: "image/*" };
          })}
          onClose={onClose}
        />
        <div className="bottomSpace" />

        <DialogSlide
          open={!isEmpty(btnType)}
          onDeny={handleClose}
          onClose={handleClose}
          dialogTitle={
            btnType === "reject" ? "Reject Drive Request" : "Block Drive"
          }
        >
          <ModalWrapper>
            <Box className="modalStyle">
              <Formik
                validateOnChange={true}
                initialValues={{ description: "", allow_edit_drive: true }}
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
                            const str = event.target.value.replace(
                              /\s\s+/g,
                              " "
                            );
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
                            btnType === "reject"
                              ? "Please enter the reason of rejection"
                              : "Please enter the reason for Block"
                          }
                          placeholder={
                            btnType === "reject"
                              ? "Please enter the reason of rejection"
                              : "Please enter the reason for Block"
                          }
                        />
                        {errors.description && touched.description && (
                          <ErrorTextStyle>{errors.description}</ErrorTextStyle>
                        )}
                      </Box>
                      {btnType === "reject" && (
                        <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                          <FormControlLabel
                            name="allow_edit_drive"
                            control={
                              <Checkbox
                                defaultChecked={true}
                                onChange={(e) => handleChange(e)}
                                value={values.allow_edit_drive}
                                size="small"
                              />
                            }
                            label="Allow user to edit drive after rejection"
                          />
                          <Alert
                            severity="info"
                            sx={{
                              alignItems: "center",
                              p: "6px",
                              "& .MuiAlert-icon": { p: 0, mr: "5px" },
                              "& .MuiAlert-message": { p: 0, mb: "1px" },
                            }}
                          >
                            If you uncheck this, user can't able to edit Drive
                          </Alert>
                        </Box>
                      )}
                      <div className="modalBtnDiv">
                        <LoadingButton
                          size="small"
                          type="submit"
                          variant="outlined"
                          color="primary"
                          loading={rejectLoad || blockLoad || dltLoad}
                          disabled={rejectLoad || blockLoad || dltLoad}
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
          open={visible}
          disabled={driveDetails?.status === "approve" || approveLoad}
          loading={approveLoad}
          onDeny={() => {
            setVisible(false);
            setApproveLoad(false);
          }}
          onConfirm={() => submitData("accept")}
          title={`Are you sure you want to ${
            driveDetails?.reject_time && driveDetails?.status === "pending"
              ? "Reverify"
              : "Approve"
          } this Drive?`}
          dialogTitle={
            driveDetails?.reject_time && driveDetails?.status === "pending"
              ? "Reverify Drive"
              : "Approve Drive"
          }
        />

        <AppConfirmDialog
          open={unblockVisible}
          disabled={blockLoad}
          loading={blockLoad}
          onDeny={() => {
            setUnblockVisible(false);
            setBlockLoad(false);
          }}
          onConfirm={() => submitData("unblock")}
          title={`Are you sure you want to Unblock this Drive?`}
          dialogTitle={"Unblock Drive"}
        />

        <AppDialog
          open={reportsVisible}
          maxWidth={"lg"}
          onClose={() => setReportsVisible(false)}
        >
          <ReportedUsers
            id={driveDetails?._id}
            onChange={(event) => onChange(event)}
            getUsersList={getUsersList}
            reportedUserList={reportedUserList}
            pagination={pagination}
            sortModel={sortModel}
            setSortModel={setSortModel}
          />
        </AppDialog>
      </BodyStyle>
    </DetailViewWrapper>
  );
};

export default DriveDetail;
