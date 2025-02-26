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
  Badge,
  TextField,
  Avatar,
  Chip,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import { toast } from "react-toastify";
import nodata from "@crema/Lotties/nodata.json";
import Lottie from "lottie-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { isEmpty, isArray } from "lodash";
import getApiData from "../../../shared/helpers/apiHelper";
import { AppState } from "redux/store";
import { useSelector } from "react-redux";
import MediaViewer from "@crema/core/AppMedialViewer";
import {
  CheckCircleOutlineOutlined,
  ReportGmailerrorred,
  ThumbDownOffAltOutlined,
  Block,
  Star,
  StarBorder
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Fonts } from "shared/constants/AppEnums";
import DialogSlide from "components/DialogSlide";
import ReportsTable from "pages/foodrequests/request-detail/ReportsTable";
import AppDialog from "@crema/core/AppDialog";
import BasicDetails from "components/FundsDetails";
import {
  getGridBooleanOperators,
  getGridDateOperators,
  getGridNumericColumnOperators,
  getGridStringOperators,
  GridColumns,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import CTable from "components/CTable";
import ImageSlider from "components/Food/ImageSlider";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
const { flag } = require("country-emoji");

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

const FundsDetail = (props) => {
  const { id }: { id: string } = useParams();
  const location: any = useLocation();
  const [fundDetail, setFundDetail] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [approveLoad, setApproveLoad] = useState<boolean>(false);
  const [markLoad, setMarkLoad] = useState<boolean>(false);
  const [rejectLoad, setRejectLoad] = useState<boolean>(false);
  const [blockLoad, setBlockLoad] = useState<boolean>(false);
  const [btnType, setBtnType] = useState<any>("");
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [reportsVisible, setReportsVisible] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [defaultVisible, setDefaultVisible] = useState<boolean>(false);
  const [unblockVisible, setUnblockVisible] = useState<boolean>(false);
  const [adminLists, setAdminLists] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "user_id", sort: "desc" },
  ]);

  const [helpReqLists, setHelpReqLists] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [helpReqpagination, setHelpReqPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [helpReqsortModel, setHelpReqSortModel] = React.useState<GridSortModel>(
    [{ field: "_id", sort: "desc" }]
  );
  const [index, setIndex] = useState(-1);
  const [imgUrl, setImgUrl] = React.useState("");

  const onClose = () => {
    setIndex(-1);
    setImgUrl("");
  };

  const { notiData } = useSelector<AppState, AppState["Notificationdata"]>(
    ({ Notificationdata }) => Notificationdata
  );

  //API For get admin list in fund
  async function getAdminLists(nData) {
    setAdminLists((e) => ({ ...e, listsLoad: true }));
    try {
      let fundId = "";
      if (location?.state?.from === "notification") {
        fundId = location?.state?.id;
      } else {
        fundId = id;
      }
      const res = await getApiData(`fund/fund-admin-list/${fundId}`, nData);
      if (res.success) {
        setAdminLists({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
        getHelpReqList({
          page: 1,
          sort: helpReqsortModel[0].field,
          sort_type: helpReqsortModel[0]?.sort === "asc" ? 1 : -1,
        });
        // getHelpReqList();
      } else {
        setAdminLists({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setAdminLists({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  //API For get help req list in fund
  async function getHelpReqList(nData?: any) {
    setHelpReqLists((e) => ({ ...e, listsLoad: true }));
    try {
      let fundId = "";
      if (location?.state?.from === "notification") {
        fundId = location?.state?.id;
      } else {
        fundId = id;
      }
      nData.fund_id = fundId;
      const res = await getApiData(`fund-help-request/admin/list`, nData);
      if (res.success) {
        setHelpReqLists({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setHelpReqPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setHelpReqLists({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setHelpReqLists({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  const strFilterOperators = getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value)
  );

  const boolFilterOperators = getGridBooleanOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const dateFilterOperators = getGridDateOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const numberFiltOperator = getGridNumericColumnOperators().filter(
    ({ value }) => ["="].includes(value)
  );

  const helpReqcolumns: GridColumns = [
    {
      field: "_id",
      headerName: "ID",
      hide: true,
      filterable: false,
    },
    {
      field: "reference_id",
      headerName: "Request ID",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "first_name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Typography sx={{ fontSize: 12 }}>
            {item?.value} {item?.row?.last_name}
          </Typography>
        );
      },
    },
    {
      field: "category_name",
      headerName: "Category",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "title_of_fundraiser",
      headerName: "Fundraiser Title",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "goal_amount",
      headerName: "Goal Amount",
      minWidth: 300,
      flex: 1,
      filterOperators: numberFiltOperator,
      type: "number",
      renderCell: (item: any) => {
        return (
          <Typography sx={{ fontSize: 12 }}>
            {item?.row?.country_data?.currency || ""}
            {Number(item?.row?.form_data?.goal_amount).toFixed(2) || 0}
          </Typography>
        );
      },
    },
    {
      field: "remaining_amount",
      headerName: "Remaining Amount",
      minWidth: 300,
      flex: 1,
      filterOperators: numberFiltOperator,
      type: "number",
      renderCell: (item: any) => {
        return (
          <Typography sx={{ fontSize: 12 }}>
            {item?.row?.country_data?.currency || ""}
            {Number(item?.row?.form_data?.remaining_amount).toFixed(2) || 0}
          </Typography>
        );
      },
    },
    {
      field: "expiry_date",
      headerName: "Expired At",
      minWidth: 200,
      flex: 1,
      renderCell: (item: any) => {
        return (
          <Typography sx={{ fontSize: 12 }}>
            {item?.row?.form_data?.expiry_date
              ? moment(item?.row?.form_data?.expiry_date).format(
                  initialTimeFormat
                )
              : ""}
          </Typography>
        );
      },
      type: "date",
      filterOperators: dateFilterOperators,
    },
  ];

  const columns: GridColumns = [
    { field: "user_id", headerName: "User ID", hide: true, filterable: false },
    {
      field: "user_image",
      headerName: "Image",
      width: 150,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (item: any) => {
        return (
          <div
            onClick={() => {
              setImgUrl(item.value);
              setIndex(item.value ? 0 : -1);
            }}
          >
            <Avatar
              sx={{
                padding: 5,
                backgroundColor: "rgb(255, 255, 255)",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              <img
                src={item.value || "/assets/images/defaultimage.png"}
                alt={"title"}
                style={{
                  borderRadius: 5,
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  maxWidth: "fit-content",
                }}
              />
            </Avatar>
          </div>
        );
      },
    },
    {
      field: "user_name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "fund_organizer",
      headerName: "Fund Organizer",
      minWidth: 200,
      flex: 1,
      filterOperators: boolFilterOperators,
      valueGetter: (params) => params?.row?.fund_organizer || false,
      type: "boolean",
      renderCell: (item: any) => {
        return (
          <Chip
            style={{
              color: "#FFF",
              backgroundColor: item?.row?.fund_organizer
                ? "#2e7d32" //success
                : "#d32f2f", //error
            }}
            label={item?.row?.fund_organizer ? "Yes" : "No"}
            variant="outlined"
            size="small"
          />
        );
      },
    },
    {
      field: "phone",
      headerName: "Phone",
      minWidth: 170,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Typography sx={{ fontSize: "12px" }}>
            {flag(item?.row?.phone_country_short_name) || ""}{" "}
            {item?.value || ""}
          </Typography>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 250,
      flex: 1,
      valueGetter: (params: any) => params?.value?.toLowerCase() || "-",
      filterOperators: strFilterOperators,
    },
  ];

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    getAdminLists(flt);
  }

  function onHelpReqChange(newPage: any) {
    const flt = { ...helpReqpagination.page };
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = helpReqsortModel[0].field;
    flt.sort_type = helpReqsortModel[0]?.sort === "asc" ? 1 : -1;
    getHelpReqList(flt);
  }

  //API For get funds details
  async function getFundsDetail(type?: any) {
    if (type === "noload") {
      setLoader(false);
    } else {
      setLoader(true);
    }
    try {
      let fundsid = "";
      if (location?.state?.from === "notification") {
        fundsid = location?.state?.id;
      } else {
        fundsid = id;
      }

      const res = await getApiData(
        `fund/admin/fund-detail/${fundsid}`,
        {},
        "GET"
      );
      if (res.success) {
        setFundDetail(res && res.data ? res.data : {});
        setLoader(false);
        getAdminLists({
          page: 1,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
        if (type === "open") {
          setReportsVisible(true);
        }
      } else {
        setFundDetail({});
        toast.error(res.message);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      setFundDetail({});
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (!isEmpty(notiData)) {
      getFundsDetail("noload");
    }
  }, [notiData]);

  useEffect(() => {
    getFundsDetail(location?.state?.is_open ? "open" : "");
  }, [location?.state]);

  async function submitData(data: any) {
    if (btnType === "reject") {
      setRejectLoad(true);
    } else if (btnType === "block" || data === "unblock") {
      setBlockLoad(true);
    } else if(data === "mark_as_default" || data === "unmark_as_default"){
      setMarkLoad(true);
    } else {
      setApproveLoad(true);
    }
    const id = fundDetail?._id;
    let nData = {};
    if (btnType === "reject") {
      nData = {
        reject_reason: data.description,
        allow_edit_fund: data.allow_edit_fund,
        status: "reject",
      };
    } else if(data === "mark_as_default"){
      nData = { fund_id: id ,type:"mark" };
    }  else if(data === "unmark_as_default"){
      nData = { fund_id: id,type:"unmark" };
    } else if (btnType === "block") {
      nData = { reason: data.description, id: id };
    } else if (data === "unblock") {
      nData = { id: id };
    } else {
      nData = { status: "approve" };
    }
    let url = "";
    if (btnType === "block") {
      url = `admin/block-fund`;
    } else if(data === "mark_as_default" || data === "unmark_as_default"){
      url = `fund/admin/add-to-default`;
    } else if (data === "unblock") {
      url = `admin/unblock-fund`;
    } else {
      url = `fund/verify-fund/${id}`;
    }

    try {
      const res = await getApiData(url, nData, "POST");
      if (res.success) {
        getFundsDetail();
        setBtnType("");
        setVisible(false);
        setDefaultVisible(false);
        setUnblockVisible(false);
        props.getFundsLists();
        let resMessage = "";
        if (btnType === "reject") {
          resMessage = "Reject successfully";
        } else if(data === "mark_as_default"){
          resMessage = "Marked as default successfully";
        } else if(data === "unmark_as_default"){
          resMessage = "Unmarked as default successfully";
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
      setMarkLoad(false);
      setBlockLoad(false);
      setDltLoad(false);
    } catch (error) {
      setRejectLoad(false);
      setApproveLoad(false);
      setMarkLoad(false);
      setBlockLoad(false);
      setDltLoad(false);
    }
  }

  const handleClose = () => {
    setBtnType("");
    setRejectLoad(false);
    setBlockLoad(false);
    setApproveLoad(false);
    setMarkLoad(false);
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
                  Funds Detail:
                </Box>
              </Grid>
              {fundDetail && !isEmpty(fundDetail) ? (
                <Grid item xs={9} className="btnsDiv stickyClass">
                  {fundDetail?.status === "reject" ||
                  fundDetail?.status === "cancelled" ||
                  fundDetail?.status === "cancel" ? null : (
                    <LoadingButton
                      size="small"
                      variant="outlined"
                      color="success"
                      startIcon={<CheckCircleOutlineOutlined />}
                      onClick={() => setVisible(true)}
                      loading={approveLoad}
                      disabled={
                        approveLoad ||
                        fundDetail?.status === "approve" ||
                        fundDetail?.status === "reject" ||
                        fundDetail?.status === "reverify" ||
                        fundDetail?.status === "blocked"
                      }
                    >
                      {fundDetail?.status === "approve" ||
                      fundDetail?.status === "blocked"
                        ? "Approved"
                        : (fundDetail?.reject_time &&
                            fundDetail?.status === "pending") ||
                          fundDetail?.status === "waiting_for_verify"
                        ? "Reverify"
                        : "Approve"}
                    </LoadingButton>
                  )}
                  {fundDetail?.status === "blocked" ||
                  fundDetail?.status === "cancelled" ||
                  fundDetail?.status === "cancel" ? null : (
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<ThumbDownOffAltOutlined />}
                      sx={{ ml: 5 }}
                      onClick={() => setBtnType("reject")}
                      disabled={fundDetail?.status === "reject" || rejectLoad}
                    >
                      {fundDetail?.status === "reject" ? "Rejected" : "Reject"}
                    </Button>
                  )}

                  {fundDetail &&
                  fundDetail?.report_fund &&
                  fundDetail?.report_fund.length > 0 ? (
                    <>
                      <Badge
                        color="secondary"
                        badgeContent={fundDetail?.report_fund?.length || 0}
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
                    </>
                  ) : null}
                  <Button
                    size="small"
                    variant="outlined"
                    className="reportBtn"
                    onClick={() => {
                      if (fundDetail?.status === "blocked") {
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
                    {fundDetail?.status === "blocked" ? "Unblock" : "Block"}
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    className="reportBtn"
                    onClick={() => setDefaultVisible(true)}
                    startIcon={fundDetail?.is_default === true ? <Star /> : <StarBorder />}
                    color="error"
                    sx={{ marginLeft: 5 }}
                  >
                    {fundDetail?.is_default === true ? "Unmark as Default" : "Mark as Default"}
                  </Button>
                </Grid>
              ) : null}
              {/* Breadcrumbs */}
              <Grid item xs={12} sx={{ paddingTop: "0px !important" }}>
                <Breadcrumbs sx={{ margin: "0px 0px 0px" }}>
                  <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                    Dashboards
                  </Link>
                  {props.from === "cancelled-funds" ? (
                    <Link
                      className="linkClass"
                      to={{ pathname: "/cancelled-funds" }}
                    >
                      Cancelled Funds
                    </Link>
                  ) : (
                    <Link className="linkClass" to={{ pathname: "/funds" }}>
                      Active Funds
                    </Link>
                  )}
                  <Typography color="text.primary">
                    {fundDetail?.form_data?.title_of_fundraiser || "-"}
                  </Typography>
                </Breadcrumbs>
              </Grid>
              {fundDetail && !isEmpty(fundDetail) ? (
                <>
                  {/* BasicDetails  */}
                  <Grid item xs={12}>
                    <BasicDetails fundDetail={fundDetail} />
                  </Grid>
                  {/* User Image Slider */}
                  <Grid item xs={12} xl={12} sx={{ pl: "0px !important" }}>
                    <ImageSlider foodDetails={fundDetail} />
                  </Grid>
                  {/* Admin List Table */}
                  <Grid item xs={12} sx={{ mt: 4 }}>
                    <Typography
                      gutterBottom
                      variant="body2"
                      sx={{ fontSize: { lg: "14px", xl: "15px" } }}
                    >
                      Admin List:
                    </Typography>
                    <CTable
                      tableStyle={{ height: "calc(50vh) !important" }}
                      sxStyle={{
                        "& .MuiDataGrid-row:hover": { cursor: "pointer" },
                      }}
                      onRowClick={(item: any) => console.log("row====")}
                      NewBar={null}
                      isUserID={true}
                      onChange={(event) => onChange(event)}
                      row={adminLists?.lists}
                      column={columns}
                      rowCount={pagination.total}
                      page={pagination.page}
                      listsLoad={adminLists?.listsLoad}
                      checkboxSelection={false}
                      onSelectionModelChange={() => console.log("row select")}
                      sortModel={sortModel}
                      getApiCall={getAdminLists}
                      setSortModel={setSortModel}
                    />
                  </Grid>

                  {/* Help Requests List Table */}
                  <Grid item xs={12} sx={{ mt: 4 }}>
                    <Typography
                      gutterBottom
                      variant="body2"
                      sx={{ fontSize: { lg: "14px", xl: "15px" } }}
                    >
                      Help Requests List:
                    </Typography>
                    <CTable
                      tableStyle={{ height: "calc(50vh) !important" }}
                      sxStyle={{
                        "& .MuiDataGrid-row:hover": { cursor: "pointer" },
                      }}
                      onRowClick={(item: any) => console.log("row====")}
                      NewBar={null}
                      isUserID={true}
                      onChange={(event) => onHelpReqChange(event)}
                      row={helpReqLists?.lists}
                      column={helpReqcolumns}
                      rowCount={helpReqpagination.total}
                      page={helpReqpagination.page}
                      listsLoad={helpReqLists?.listsLoad}
                      checkboxSelection={false}
                      onSelectionModelChange={() => console.log("row select")}
                      sortModel={helpReqsortModel}
                      getApiCall={getHelpReqList}
                      setSortModel={setHelpReqSortModel}
                    />
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

        <MediaViewer
          index={index}
          medias={[imgUrl].map((data) => {
            return {
              url: data,
              mime_type: "image/*",
            };
          })}
          onClose={onClose}
        />
        <div className="bottomSpace" />

        <DialogSlide
          open={!isEmpty(btnType)}
          onDeny={handleClose}
          onClose={handleClose}
          dialogTitle={
            btnType === "reject" ? "Reject Fund Request" : "Block Fund"
          }
        >
          <ModalWrapper>
            <Box className="modalStyle">
              <Formik
                validateOnChange={true}
                initialValues={{ description: "", allow_edit_fund: true }}
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
                            name="allow_edit_fund"
                            control={
                              <Checkbox
                                defaultChecked={true}
                                onChange={(e) => handleChange(e)}
                                value={values.allow_edit_fund}
                                size="small"
                              />
                            }
                            label="Allow user to edit fund after rejection"
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
                            If you uncheck this, user can't able to edit fund
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
          open={defaultVisible}
          disabled={markLoad}
          loading={markLoad}
          onDeny={() => {
            setDefaultVisible(false);
            setMarkLoad(false);
          }}
          onConfirm={() => submitData(fundDetail?.is_default === true ? "unmark_as_default" : "mark_as_default")}
          title={`Are you sure you want to ${
            fundDetail?.is_default && fundDetail?.is_default === true
              ? "Unmark"
              : "Mark"
          } this Fund as default?`}
          dialogTitle={
            fundDetail?.is_default && fundDetail?.is_default === true
              ? "Unmark as Default"
              : "Mark as Default"
          }
        />

        <AppConfirmDialog
          open={visible}
          disabled={fundDetail?.status === "approve" || approveLoad}
          loading={approveLoad}
          onDeny={() => {
            setVisible(false);
            setApproveLoad(false);
          }}
          onConfirm={() => submitData("accept")}
          title={`Are you sure you want to ${
            fundDetail?.reject_time && fundDetail?.status === "pending"
              ? "Reverify"
              : "Approve"
          } this Fund?`}
          dialogTitle={
            fundDetail?.reject_time && fundDetail?.status === "pending"
              ? "Reverify Fund"
              : "Approve Fund"
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
          title={`Are you sure you want to Unblock this Fund?`}
          dialogTitle={"Unblock Fund"}
        />

        <AppDialog
          open={reportsVisible}
          maxWidth={"lg"}
          onClose={() => setReportsVisible(false)}
        >
          <ReportsTable categoryList={fundDetail?.report_fund} />
        </AppDialog>
      </BodyStyle>
    </DetailViewWrapper>
  );
};

export default FundsDetail;
