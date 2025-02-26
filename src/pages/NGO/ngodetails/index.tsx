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
  Alert,
  Breadcrumbs,
  Badge,
  TextField,
  Divider,
  Hidden,
  IconButton,
  MenuItem,
  Menu,
} from "@mui/material";
import nodata from "@crema/Lotties/nodata.json";
import Lottie from "lottie-react";
import { toast } from "react-toastify";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import BasicDetailNGO from "components/NGO/BasicDetail";
import TrusteeNGO from "components/NGO/TrusteeCards";
import NGOImageSlider from "components/NGO/NGOImagesSlider";
import { isEmpty, isArray } from "lodash";
import UpdateBasicDetailNGO from "components/NGO/UpdatedNGOBasicDetail";
import getApiData from "../../../shared/helpers/apiHelper";
import UpdateTrusteeNGO from "components/NGO/UpdateTrusteeCard";
import UpdateNGOImageSlider from "components/NGO/UpdateNGOImgSlider";
import BankDetailModal from "components/Food/BankDetailModal";
import { AppState } from "redux/store";
import { useSelector } from "react-redux";
import {
  AccountBalanceOutlined,
  CheckCircleOutlineOutlined,
  Delete,
  ReportGmailerrorred,
  ThumbDownOffAltOutlined,
  Block,
  MoreVert,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Fonts } from "shared/constants/AppEnums";
import DialogSlide from "components/DialogSlide";
import ReportsTable from "pages/foodrequests/request-detail/ReportsTable";
import DonationListTable from "pages/foodrequests/request-detail/DonationListTable";
import AppDialog from "@crema/core/AppDialog";
import CertificatesTable from "pages/foodrequests/request-detail/NGOCertificates";
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
  "& .PopmodalStyle": {
    borderRadius: "5px",
    backgroundColor: "#FFFF",
    padding: "20px",
  },
  "& .dltmodalBtnDiv": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
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

const NGODetails = (props) => {
  const history = useHistory();
  const { id }: { id: string } = useParams();
  const location: any = useLocation();
  const [ngoDetail, setNgoDetail] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [approveLoad, setApproveLoad] = useState<boolean>(false);
  const [rejectLoad, setRejectLoad] = useState<boolean>(false);
  const [currentRejectLoad, setCurrentRejectLoad] = useState<boolean>(false);
  const [blockLoad, setBlockLoad] = useState<boolean>(false);
  const [btnType, setBtnType] = useState<any>("");
  const [bankDetailModal, setBankDetailModal] = useState<boolean>(false);
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [reportsVisible, setReportsVisible] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = React.useState<any>(false);
  const [donorsList, setDonorsList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });

  const { notiData } = useSelector<AppState, AppState["Notificationdata"]>(
    ({ Notificationdata }) => Notificationdata
  );

  const [certificates, setCertificates] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [certiPagination, setCertiPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    event.stopPropagation();
    event.preventDefault();
  };

  const onPopClose = () => {
    setAnchorEl(null);
    setOpenMenu(false);
  };

  //API For get ngo details
  async function getNGODetails(type?: any) {
    if (type === "noload") {
      setLoader(false);
    } else {
      setLoader(true);
    }
    try {
      let ngoid = "";
      if (location?.state?.from === "notification") {
        ngoid = location?.state?.ngo_id;
      } else {
        ngoid = id;
      }

      const res = await getApiData(
        `ngo/admin/get-ngo-detail/${ngoid}`,
        {},
        "GET"
      );
      if (res.success) {
        setNgoDetail(res && res.data ? res.data : {});
        setLoader(false);
        getDonorsList({ page: 1 });
        getCertificates({
          page: 1,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
      } else {
        setNgoDetail({});
        toast.error(res.message);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      setNgoDetail({});
      toast.error("Something went wrong");
    }
  }

  const ngoVerified = ngoDetail?.trustees_name?.find(
    (fn: any) => fn.verified === false
  );

  const updatedVerified = ngoDetail?.updated_data?.trustees_name?.find(
    (fn: any) => fn.verified === false
  );

  //API For get images list
  async function getCertificates(nData) {
    setCertificates((e) => ({ ...e, listsLoad: true }));
    try {
      let ngoid = "";
      if (location?.state?.from === "notification") {
        ngoid = location?.state?.ngo_id;
      } else {
        ngoid = id;
      }
      const res = await getApiData(`ngo/certificate-list/${ngoid}`, nData);
      if (res.success) {
        setCertificates({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setCertiPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setCertificates({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setCertificates({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  //API For get donors list list
  async function getDonorsList(nData: any) {
    setDonorsList((e: any) => ({ ...e, listsLoad: true }));
    try {
      let url = "";
      if (location?.state?.from === "ngo-donation-list") {
        url = `request/admin/ngo-donors-list/${id}`;
      } else {
        url = `request/admin/donors-list/${id}`;
      }
      const res = await getApiData(url, nData);
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

  useEffect(() => {
    if (!isEmpty(notiData)) {
      getNGODetails("noload");
    }
  }, [notiData]);

  useEffect(() => {
    getNGODetails();
  }, [location?.state]);

  const uData = location && location?.state?.userData;

  async function submitData(data: any) {
    if (btnType === "reject") {
      setRejectLoad(true);
    } else if (btnType === "current_reject") {
      setCurrentRejectLoad(true);
    } else if (btnType === "delete") {
      setDltLoad(true);
    } else if (btnType === "block") {
      setBlockLoad(true);
    } else {
      setApproveLoad(true);
    }
    const id = ngoDetail?._id;
    let nData = {};
    if (btnType === "reject") {
      nData = { reject_reason: data.description, ngo_status: "reject" };
    } else if (btnType === "current_reject") {
      nData = { reason: data.description };
    } else if (btnType === "delete") {
      nData = { delete_reason: data.description };
    } else if (btnType === "block") {
      nData = { id: id, reason: data.description };
    } else if (ngoDetail?.is_enable && ngoDetail?.ngo_status === "approve") {
      nData = { ngo_status: "reverify" };
    } else {
      nData = { ngo_status: "approve" };
    }
    let url = "";
    if (btnType === "delete") {
      url = `ngo/delete-ngo/${id}`;
    } else if (btnType === "current_reject") {
      url = `ngo/reject-current-change/${id}`;
    } else if (btnType === "block") {
      url = `admin/block-ngo`;
    } else {
      url = `ngo/ngo-verify/${id}`;
    }
    try {
      const res = await getApiData(
        url,
        nData,
        btnType === "delete" ? "DELETE" : btnType === "block" ? "POST" : "PUT"
      );
      if (res.success) {
        if (btnType === "delete") {
          history.goBack();
          setBtnType("");
        } else {
          setNgoDetail(res?.data);
          getNGODetails();
          setBtnType("");
        }
        props.getNGOList();
        setVisible(false);
        let resMessage = "";
        if (btnType === "reject") {
          resMessage = "Reject successfully";
        } else {
          if (ngoDetail?.is_enable && ngoDetail?.ngo_status === "approve") {
            resMessage = "Reverified successfully";
          } else if (
            ngoDetail?.ngo_status === "reverify" ||
            ngoDetail?.ngo_status === "pending" ||
            ngoDetail?.ngo_status === "reject"
          ) {
            resMessage = "Approved successfully";
          } else if (ngoDetail?.ngo_status === "waiting_for_verify") {
            resMessage = "Verified successfully";
          }
        }
        toast.success(res.message || resMessage);
      } else {
        toast.error(res.message);
      }
      setRejectLoad(false);
      setApproveLoad(false);
      setBlockLoad(false);
      setDltLoad(false);
      setCurrentRejectLoad(false);
    } catch (error) {
      setRejectLoad(false);
      setApproveLoad(false);
      setBlockLoad(false);
      setDltLoad(false);
      setCurrentRejectLoad(false);
    }
  }

  const handleClose = () => {
    setBtnType("");
    setRejectLoad(false);
    setBlockLoad(false);
    setApproveLoad(false);
    setCurrentRejectLoad(false);
  };

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
            <AppLoader />
          ) : (
            <>
              {/* Alert View */}
              {ngoVerified?.verified === false ||
              updatedVerified?.verified === false ? (
                <Grid item xs={12}>
                  <Alert severity="error" sx={{ alignItems: "center" }}>
                    You cannot verify this NGO as the Secondary Trustee has not
                    accepted the Request
                  </Alert>
                </Grid>
              ) : null}

              <Grid
                item
                xs={props.from === "deletedNGO" ? 12 : 3}
                className="stickyClass"
              >
                <Box
                  component="h2"
                  sx={{
                    fontSize: 16,
                    color: "text.primary",
                    fontWeight: Fonts.SEMI_BOLD,
                  }}
                >
                  NGO Detail:
                </Box>
              </Grid>
              {props.from === "deletedNGO" || isEmpty(ngoDetail) ? null : (
                <>
                  <Grid item xs={9} className="btnsDiv stickyClass">
                    <Hidden xlDown>
                      {ngoDetail?.ngo_status === "reject" ? null : (
                        <LoadingButton
                          size="small"
                          variant="outlined"
                          color="success"
                          startIcon={<CheckCircleOutlineOutlined />}
                          onClick={() => setVisible(true)}
                          loading={approveLoad}
                          disabled={
                            approveLoad ||
                            ngoDetail?.ngo_status === "approve" ||
                            ngoDetail?.ngo_status === "reject" ||
                            ngoDetail?.ngo_status === "reverify" ||
                            ngoVerified?.verified === false ||
                            updatedVerified?.verified === false
                          }
                        >
                          {ngoDetail?.is_enable &&
                          ngoDetail?.ngo_status === "approve"
                            ? "Approved"
                            : ngoDetail?.ngo_status === "reverify"
                            ? "Verified"
                            : ngoDetail?.ngo_status === "waiting_for_verify"
                            ? "Reverify"
                            : ngoDetail?.ngo_status === "pending"
                            ? "Approve"
                            : "Approve"}
                        </LoadingButton>
                      )}
                      {ngoDetail?.ngo_status === "blocked" ? null : (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<ThumbDownOffAltOutlined />}
                          sx={{ ml: 5 }}
                          onClick={() => setBtnType("reject")}
                          disabled={
                            ngoDetail?.ngo_status === "reject" || rejectLoad
                          }
                        >
                          {ngoDetail?.ngo_status === "reject"
                            ? "Rejected"
                            : "Reject"}
                        </Button>
                      )}

                      {ngoDetail?.updated_data && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<ThumbDownOffAltOutlined />}
                          sx={{ ml: 5 }}
                          onClick={() => setBtnType("current_reject")}
                          disabled={currentRejectLoad}
                        >
                          Reject Current Changes
                        </Button>
                      )}

                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ ml: 5 }}
                        startIcon={<AccountBalanceOutlined />}
                        onClick={() => setBankDetailModal(true)}
                      >
                        Bank Details
                      </Button>

                      {ngoDetail?.ngo_status === "blocked" ? null : (
                        <Button
                          size="small"
                          variant="outlined"
                          color="warning"
                          startIcon={<Delete />}
                          sx={{ ml: 5 }}
                          onClick={() => setBtnType("delete")}
                          disabled={dltLoad}
                        >
                          Deactivate NGO
                        </Button>
                      )}

                      {ngoDetail &&
                      ngoDetail?.report_ngo &&
                      ngoDetail?.report_ngo.length > 0 ? (
                        <>
                          <Badge
                            color="secondary"
                            badgeContent={ngoDetail?.report_ngo?.length || 0}
                            max={99}
                          >
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => setReportsVisible(!reportsVisible)}
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
                            onClick={() => setBtnType("block")}
                            disabled={
                              ngoDetail?.ngo_status === "blocked" || blockLoad
                            }
                            startIcon={<Block />}
                            color="error"
                            sx={{ marginLeft: 5 }}
                          >
                            {ngoDetail?.ngo_status === "blocked"
                              ? "Blocked"
                              : "Block"}
                          </Button>
                        </>
                      ) : null}
                    </Hidden>
                    <Hidden xlUp>
                      <Box>
                        {ngoDetail?.ngo_status === "reject" ? null : (
                          <LoadingButton
                            size="small"
                            variant="outlined"
                            color="success"
                            startIcon={<CheckCircleOutlineOutlined />}
                            onClick={() => setVisible(true)}
                            loading={approveLoad}
                            disabled={
                              approveLoad ||
                              ngoDetail?.ngo_status === "approve" ||
                              ngoDetail?.ngo_status === "reject" ||
                              ngoDetail?.ngo_status === "reverify" ||
                              ngoVerified?.verified === false ||
                              updatedVerified?.verified === false
                            }
                          >
                            {ngoDetail?.is_enable &&
                            ngoDetail?.ngo_status === "approve"
                              ? "Approved"
                              : ngoDetail?.ngo_status === "reverify"
                              ? "Verified"
                              : ngoDetail?.ngo_status === "waiting_for_verify"
                              ? "Reverify"
                              : ngoDetail?.ngo_status === "pending"
                              ? "Approve"
                              : "Approve"}
                          </LoadingButton>
                        )}
                        <IconButton
                          sx={{ cursor: "pointer", ml: 1 }}
                          aria-label="delete"
                          size="small"
                          onClick={(event) => {
                            handleClick(event);
                            setOpenMenu(true);
                          }}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Box>
                    </Hidden>
                  </Grid>
                </>
              )}

              <Grid item xs={12} sx={{ paddingTop: "0px !important" }}>
                {location?.state?.from === "user-detail" ? (
                  <Breadcrumbs sx={{ margin: "0px 0px 0px" }}>
                    <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                      Dashboards
                    </Link>
                    <Link className="linkClass" to={{ pathname: "/user" }}>
                      Users
                    </Link>
                    {ngoDetail?.first_name ? (
                      <Link
                        className="linkClass"
                        to={{
                          pathname: `/user/${location.state?.userId}`,
                          state: {
                            id: location.state?.userId,
                            from: "ngo-detail",
                          },
                        }}
                      >
                        {`${uData?.first_name} ${uData?.last_name}`}
                      </Link>
                    ) : null}
                    <Typography color="text.primary">
                      {ngoDetail?.ngo_name || "-"}
                    </Typography>
                  </Breadcrumbs>
                ) : location?.state?.from === "ngo-donation-list" ? (
                  <Breadcrumbs sx={{ margin: "0px 0px 0px" }}>
                    <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                      Dashboards
                    </Link>
                    <Link
                      className="linkClass"
                      to={{ pathname: "/ngo-donation-list" }}
                    >
                      NGO Donation List
                    </Link>
                    <Typography color="text.primary">
                      {ngoDetail?.ngo_name || "-"}
                    </Typography>
                  </Breadcrumbs>
                ) : (
                  <Breadcrumbs sx={{ margin: "0px 0px 0px" }}>
                    <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                      Dashboards
                    </Link>
                    {props.from === "deletedNGO" ? (
                      <Link
                        className="linkClass"
                        to={{ pathname: "/deleted-ngos" }}
                      >
                        Deactivated NGO
                      </Link>
                    ) : (
                      <Link className="linkClass" to={{ pathname: "/ngo" }}>
                        Active NGO
                      </Link>
                    )}
                    <Typography color="text.primary">
                      {ngoDetail?.ngo_name || "-"}
                    </Typography>
                  </Breadcrumbs>
                )}
              </Grid>

              <Grid container spacing={4} xs={12} sx={{ m: 0, width: "100%" }}>
                {ngoDetail && !isEmpty(ngoDetail) ? (
                  <>
                    {/* Old Data */}
                    <Grid
                      xs={12}
                      md={ngoDetail?.updated_data ? 5.9 : 12}
                      sx={{ paddingTop: "0px !important", pl: 0 }}
                    >
                      {/* BasicDetailNGO  */}
                      <Grid item xs={12}>
                        <BasicDetailNGO
                          ngoDetail={ngoDetail}
                          from={props.from === "deletedNGO" ? "deletedNGO" : ""}
                        />
                      </Grid>

                      {(ngoDetail?.transfer_account &&
                        (ngoDetail?.status === "pending" ||
                          ngoDetail?.ngo_status === "pending")) ||
                      ngoDetail?.updated_data?.transfer_account ? (
                        <Grid item xs={12}>
                          <Typography
                            variant="h5"
                            sx={{
                              boxShadow:
                                "rgba(0, 0, 0, 0.04) 0px 10px 10px 4px",
                              backgroundColor: "#91ED91",
                              padding: "15px",
                              borderRadius: "5px",
                              textAlign: "center",
                              mt: "15px",
                              ml: "15px",
                            }}
                          >
                            Trustee Ownership Transfer Request
                          </Typography>
                        </Grid>
                      ) : null}

                      {/* Trustees Cards */}
                      <Grid item xs={ngoDetail?.updated_data ? 12 : 12}>
                        <TrusteeNGO ngoDetail={ngoDetail} />
                      </Grid>

                      {/* Images View */}
                      <Grid item xs={ngoDetail?.updated_data ? 12 : 12}>
                        <NGOImageSlider ngoDetail={ngoDetail} />
                      </Grid>
                    </Grid>

                    {/* DividerLine */}
                    {ngoDetail?.updated_data ? (
                      <Grid item>
                        <Divider
                          orientation="vertical"
                          sx={{ height: "100%", borderRightWidth: "1px" }}
                        />
                      </Grid>
                    ) : null}

                    {/* Updated Data */}
                    {ngoDetail?.updated_data ? (
                      <Grid
                        item
                        xs={12}
                        md={5.9}
                        sx={{ paddingTop: "0px !important" }}
                      >
                        {/* UpdateBasicDetailNGO  */}
                        <Grid item xs={12}>
                          <UpdateBasicDetailNGO
                            ngoDetail={ngoDetail}
                            from={
                              props.from === "deletedNGO" ? "deletedNGO" : ""
                            }
                          />
                        </Grid>
                        {ngoDetail?.updated_data?.transfer_account ? (
                          <Grid item xs={12}>
                            <Typography
                              variant="h5"
                              sx={{
                                boxShadow:
                                  "rgba(0, 0, 0, 0.04) 0px 10px 10px 4px",
                                backgroundColor: "#91ED91",
                                padding: "15px",
                                borderRadius: "5px",
                                textAlign: "center",
                                mt: "15px",
                                ml: "15px",
                              }}
                            >
                              Trustee Ownership transferred
                            </Typography>
                          </Grid>
                        ) : null}

                        {/* Trustees Cards */}
                        <Grid item xs={12}>
                          <UpdateTrusteeNGO ngoDetail={ngoDetail} />
                        </Grid>

                        {/* Updated Images View */}
                        <Grid item xs={12}>
                          <UpdateNGOImageSlider ngoDetail={ngoDetail} />
                        </Grid>
                      </Grid>
                    ) : null}
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
              </Grid>
              {location?.state?.from === "ngo-donation-list" && (
                <Grid item xs={12} xl={12}>
                  <DonationListTable
                    pagination={pagination}
                    getDonorsList={getDonorsList}
                    donorsList={donorsList}
                  />
                </Grid>
              )}
              {/* NGO Certificates List */}
              {certificates.lists.length > 0 && (
                <Grid item xs={12} xl={12} sx={{ mt: 5 }}>
                  <CertificatesTable
                    isDisabled={props.from === "deletedNGO" ? true : false}
                    ngoDetail={ngoDetail}
                    getCertificates={getCertificates}
                    pagination={certiPagination}
                    sortModel={sortModel}
                    setSortModel={setSortModel}
                    certificates={certificates}
                  />
                </Grid>
              )}
            </>
          )}
        </Grid>

        <div className="bottomSpace" />

        <DialogSlide
          open={!isEmpty(btnType)}
          onDeny={handleClose}
          onClose={handleClose}
          dialogTitle={
            btnType === "reject"
              ? "Reject NGO Request"
              : btnType === "current_reject"
              ? "Reject Current Changes"
              : btnType === "block"
              ? "Block NGO"
              : "Deactivate NGO"
          }
        >
          <ModalWrapper>
            <Box className="modalStyle">
              <Formik
                validateOnChange={true}
                initialValues={{ description: "" }}
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
                            btnType === "reject" || btnType === "current_reject"
                              ? "Please enter the reason for rejection"
                              : btnType === "block"
                              ? "Reason for Block"
                              : "Please enter reason for deactivate"
                          }
                          placeholder={
                            btnType === "reject"
                              ? "Please enter the reason for rejection"
                              : btnType === "block"
                              ? "Please enter the Reason for Block"
                              : "Please enter reason for deactivate"
                          }
                        />
                        {errors.description && touched.description && (
                          <ErrorTextStyle>{errors.description}</ErrorTextStyle>
                        )}
                      </Box>
                      <div className="modalBtnDiv">
                        <LoadingButton
                          size="small"
                          type="submit"
                          variant="outlined"
                          color="primary"
                          loading={
                            rejectLoad ||
                            blockLoad ||
                            dltLoad ||
                            currentRejectLoad
                          }
                          disabled={
                            rejectLoad ||
                            blockLoad ||
                            dltLoad ||
                            currentRejectLoad
                          }
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

        <BankDetailModal
          getFoodDetails={() => getNGODetails("noload")}
          visible={bankDetailModal}
          setVisible={setBankDetailModal}
          foodDetails={ngoDetail}
          from={"ngoDetail"}
          banDetails={ngoDetail?.bank_detail}
          loader={false}
        />

        <AppConfirmDialog
          open={visible}
          disabled={
            ngoDetail?.status === "approve" ||
            ngoDetail?.ngo_status === "approve" ||
            approveLoad
          }
          loading={approveLoad}
          onDeny={() => {
            setVisible(false);
            setApproveLoad(false);
          }}
          onConfirm={() => submitData("accept")}
          title={`Are you sure you want to ${
            ngoDetail?.ngo_status === "waiting_for_verify"
              ? "Reverify"
              : "Approve"
          } this NGO?`}
          dialogTitle={
            ngoDetail?.ngo_status === "waiting_for_verify"
              ? "Reverify NGO"
              : "Approve NGO"
          }
        />

        <AppDialog
          open={reportsVisible}
          maxWidth={"lg"}
          onClose={() => setReportsVisible(false)}
        >
          <ReportsTable categoryList={ngoDetail?.report_ngo} />
        </AppDialog>

        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={openMenu}
          onClose={onPopClose}
          sx={{ zIndex: 1000002 }}
        >
          {ngoDetail?.ngo_status === "blocked" ? null : (
            <MenuItem
              color="error"
              onClick={() => {
                onPopClose();
                setBtnType("reject");
              }}
              disabled={ngoDetail?.ngo_status === "reject" || rejectLoad}
            >
              <ThumbDownOffAltOutlined sx={{ mr: 1, fontSize: 18 }} />
              {ngoDetail?.ngo_status === "reject" ? "Rejected" : "Reject"}
            </MenuItem>
          )}

          {ngoDetail?.updated_data && (
            <MenuItem
              color="error"
              onClick={() => {
                onPopClose();
                setBtnType("current_reject");
              }}
              disabled={
                ngoDetail?.ngo_status === "current_reject" || currentRejectLoad
              }
            >
              <ThumbDownOffAltOutlined sx={{ mr: 1, fontSize: 18 }} />
              {ngoDetail?.ngo_status === "current_reject"
                ? "Rejected Current Changes"
                : "Reject Current Changes"}
            </MenuItem>
          )}

          <MenuItem
            onClick={() => {
              onPopClose();
              setBankDetailModal(true);
            }}
          >
            <AccountBalanceOutlined sx={{ mr: 1, fontSize: 18 }} />
            Bank Details
          </MenuItem>

          {ngoDetail?.ngo_status === "blocked" ? null : (
            <MenuItem
              onClick={() => {
                onPopClose();
                setBtnType("delete");
              }}
              disabled={dltLoad}
            >
              <Delete sx={{ mr: 1, fontSize: 18 }} />
              Deactivate NGO
            </MenuItem>
          )}

          {ngoDetail &&
          ngoDetail?.report_ngo &&
          ngoDetail?.report_ngo.length > 0 ? (
            <>
              <MenuItem
                onClick={() => {
                  onPopClose();
                  setReportsVisible(!reportsVisible);
                }}
              >
                <Badge
                  color="secondary"
                  badgeContent={ngoDetail?.report_ngo?.length || 0}
                  max={99}
                >
                  <ReportGmailerrorred sx={{ mr: 1, fontSize: 18 }} />
                  Reports
                </Badge>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onPopClose();
                  setBtnType("block");
                }}
                disabled={ngoDetail?.ngo_status === "blocked" || blockLoad}
              >
                <Block sx={{ mr: 1, fontSize: 18 }} />
                {ngoDetail?.ngo_status === "blocked" ? "Blocked" : "Block"}
              </MenuItem>
            </>
          ) : null}
        </Menu>
      </BodyStyle>
    </DetailViewWrapper>
  );
};

export default NGODetails;
