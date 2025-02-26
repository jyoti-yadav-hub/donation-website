import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Grid,
  IconButton,
  styled,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { isEmpty } from "lodash";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { AppConfirmDialog, AppLoader } from "@crema";
import getApiData from "../../../shared/helpers/apiHelper";
import IntlMessages from "@crema/utility/IntlMessages";
import AppsContent from "@crema/core/AppsContainer/AppsContent";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import AppTooltip from "@crema/core/AppTooltip";
import { AssignmentIndOutlined, Block } from "@mui/icons-material";
import nodata from "@crema/Lotties/nodata.json";
import Lottie from "lottie-react";
import HelpReqBasicDetails from "components/HelpRequestDetail/HelpReqBasicDetails";
import { useSelector } from "react-redux";
import { AppState } from "redux/store";
import DialogSlide from "components/DialogSlide";
import { LoadingButton } from "@mui/lab";

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
  zIndex: 1000002,
  "& .topDiv": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    top: "60px",
    // backgroundColor: "#f4f7fe",
    zIndex: 1000002,
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

const ModalWrapper = styled(Box)(({ theme }) => ({
  "& .modalStyle": { width: 500 },
  "& .modalBtnDiv": {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
}));

const HelpDetails = (props) => {
  const { notiData } = useSelector<AppState, AppState["Notificationdata"]>(
    ({ Notificationdata }) => Notificationdata
  );
  const history = useHistory();
  const location: any = useLocation();
  const { id }: { id: string } = useParams();
  const [reqDetail, setReqDetail] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [assignLoad, setAssignLoad] = React.useState<any>(false);
  const [blockModal, setBlockModal] = useState<boolean>(false);
  const [blockLoad, setBlockLoad] = useState<boolean>(false);

  const isBlock =
    reqDetail?.status === "block" || reqDetail?.status === "blocked";

  //API For get help request details
  async function getHelpDetail(load?: any) {
    if (load) {
      setLoader(false);
    } else {
      setLoader(true);
    }
    try {
      let helpID = id;
      if (
        location?.state?.from === "notification" &&
        !isEmpty(location?.state?.request_id)
      ) {
        helpID = location?.state?.request_id;
      } else {
        helpID = id;
      }
      const res = await getApiData(
        `help-request/admin/detail/${helpID}`,
        {},
        "GET"
      );
      if (res.success) {
        setReqDetail(res && res.data ? res.data : {});
        setLoader(false);
      } else {
        setReqDetail({});
        toast.error(res.message);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      setReqDetail({});
      toast.error("Something went wrong");
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
        `help-request/admin/assign-volunteer/${helpID}`,
        "",
        "GET"
      );
      if (res.success) {
        toast.success(res.message);
        setModalOpen(false);
        await getHelpDetail();
        await props.getHelpRequests();
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

  // API For block/unblock help request
  async function submitData(data: any) {
    setBlockLoad(true);
    const id = reqDetail?._id;
    let nData = { id: id, reason: data.description };
    let url = "";
    if (isBlock) {
      url = `help-request/unblock-request`;
    } else {
      url = `help-request/block-request`;
    }
    try {
      const res = await getApiData(url, nData, "POST");
      if (res.success) {
        getHelpDetail(true);
        setBlockModal(false);
        toast.success(res.message);
        await getHelpDetail();
        await props.getHelpRequests();
      } else {
        toast.error(res.message);
      }
      setBlockLoad(false);
    } catch (error) {
      toast.error("Something went wrong!");
      setBlockLoad(false);
    }
  }

  useEffect(() => {
    if (!isEmpty(notiData) && !isEmpty(id)) {
      getHelpDetail(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notiData]);

  useEffect(() => {
    if (id) {
      getHelpDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleClose = () => {
    setBlockModal(false);
    setBlockLoad(false);
  };

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
              <Link className="linkClass" to={{ pathname: "/help-requests" }}>
                Help Requests
              </Link>
              {loader ? null : (
                <Typography color="text.primary">
                  {reqDetail?._id || ""}
                </Typography>
              )}
            </Breadcrumbs>
          </div>
          <div>
            {!loader &&
            reqDetail &&
            !isEmpty(reqDetail) &&
            (reqDetail?.status === "pending" ||
              reqDetail?.status === "waiting_for_volunteer") ? (
              <Button
                size="small"
                disabled={
                  assignLoad || reqDetail?.status === "waiting_for_volunteer"
                    ? true
                    : false
                }
                variant="outlined"
                startIcon={<AssignmentIndOutlined />}
                color="secondary"
                onClick={() => setModalOpen(true)}
              >
                {reqDetail?.status === "waiting_for_volunteer"
                  ? "Waiting For Volunteer"
                  : "Assign Volunteer"}
              </Button>
            ) : null}
            {!loader && !isEmpty(reqDetail?.report_benificiary) && (
              <Button
                size="small"
                variant="outlined"
                className="reportBtn"
                onClick={() => setBlockModal(true)}
                disabled={blockLoad}
                startIcon={<Block />}
                color="error"
                sx={{ marginLeft: 5 }}
              >
                {isBlock ? "Unblock" : "Block"}
              </Button>
            )}
          </div>
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
                <>
                  {/* Status And Basic Deatils View */}
                  {reqDetail && !isEmpty(reqDetail) ? (
                    <Grid item xs={12} lg={12} xl={12}>
                      <HelpReqBasicDetails helpRequestDetail={reqDetail} />
                    </Grid>
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
          </>
        )}

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

        <DialogSlide
          open={blockModal}
          onDeny={handleClose}
          onClose={handleClose}
          dialogTitle={`${
            isBlock ? "Un-Block Help Request" : "Block Help Request"
          }`}
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
                            isBlock ? "Reason For Un-Block" : "Reason for Block"
                          }
                          placeholder={
                            isBlock
                              ? "Please enter the Reason for Un-Block"
                              : "Please enter the Reason for Block"
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
                          loading={blockLoad}
                          disabled={blockLoad}
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
      </BodyStyle>
    </AppsContent>
  );
};
export default HelpDetails;
