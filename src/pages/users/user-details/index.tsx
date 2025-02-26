import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  IconButton,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { AppConfirmDialog, AppLoader } from "@crema";
import { isEmpty } from "lodash";
import nodata from "@crema/Lotties/nodata.json";
import Lottie from "lottie-react";
import getApiData from "../../../shared/helpers/apiHelper";
import IntlMessages from "@crema/utility/IntlMessages";
import UserData from "components/UserDetails/UserData";
import BasicDetails from "components/UserDetails/BasicDetails";
import { AccountBalanceOutlined, Block, Delete } from "@mui/icons-material";
import AppsContent from "@crema/core/AppsContainer/AppsContent";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import AppTooltip from "@crema/core/AppTooltip";
import BankDetails from "components/UserDetails/BankDetail";
import DialogSlide from "components/DialogSlide";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import BankDetailModal from "components/Food/BankDetailModal";

const ModalWrapper = styled(Box)(({ theme }) => ({
  "& .modalStyle": { width: 500 },
  "& .modalBtnDiv": {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
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

const validationSchema = yup.object({
  reason: yup
    .string()
    .required("Reason is required")
    .max(250, "Max 250 characters allowed"),
});

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const UserDetails = (props) => {
  const history = useHistory();
  const { id }: { id: string } = useParams();
  const location: any = useLocation();
  const isFrom = location?.state?.from === "ngo-detail";
  const uID = location?.state?.id;
  const [userDetail, setUserDetail] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [blockDelete, setBlockDelete] = React.useState<any>("");
  const [blockLoad, setBlockLoad] = React.useState<any>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [openUnblockDialog, setOpenUnblockDialog] = useState<boolean>(false);

  //API For get ngo details
  async function getUserDetail() {
    setLoader(true);
    try {
      let userId = "";
      if (isFrom) {
        userId = uID;
      } else {
        userId = id;
      }
      const res = await getApiData(`user/get-user-detail/${userId}`, {}, "GET");
      if (res.success) {
        setUserDetail(res && res.data ? res.data : {});
        setLoader(false);
      } else {
        setUserDetail({});
        toast.error(res.message);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      setUserDetail({});
      toast.error("Something went wrong");
    }
  }

  const handleBlockUnBlockModel = async (id: string, type: string) => {
    if (type === "Block user") {
      setOpenDltModal(true);
    } else {
      setOpenUnblockDialog(true);
    }
  };

  const handleUnblock = async (id) => {
    try {
      setLoader(false);
      let url = "user/block-unblock-account";
      let data = {
        id: id,
        actions: "unBlocked",
      };
      const res = await getApiData(url, data, "POST");

      if (res.success) {
        setUserDetail(res.data);
      }
      setLoader(false);
      setOpenUnblockDialog(false);
    } catch (error) {
      setLoader(false);
      toast.error("Something went wrong");
    }
  };
  const [openDltModal, setOpenDltModal] = React.useState<any>(false);
  useEffect(() => {
    if (id) {
      getUserDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  //API for delete user
  async function deleteUser() {
    setDltLoad(true);
    try {
      let userId = "";
      if (isFrom) {
        userId = uID;
      } else {
        userId = id;
      }
      let data = { ...blockItem, id: userId, actions: "blocked" };
      const res = await getApiData(`user/block-unblock-account`, data, "POST");
      if (res.success) {
        setOpenBlockDetail(false);
        toast.success(res.message);
        getUserDetail()
      } else {
        toast.error(res.message);
      }
      setDltLoad(false);
    } catch (error) {
      setDltLoad(false);
      toast.error("Something went wrong");
    }
  }
  const userBlockDetail = (events, userType) => {
    return (
      <Box>
        <Typography variant="h6">
          {userType === "organizer"
            ? `- Organizer for ${events.length} events.`
            : userType === "judge"
            ? `- Judge for ${events.length} events.`
            : `- Participant for ${events.length} events.`}
        </Typography>
      </Box>
    );
  };
  //API for block / deactivate user
  async function handleSubmit(data: any) {
    let userId = "";
    if (isFrom) {
      userId = uID;
    } else {
      userId = id;
    }
    if (blockDelete === "block" || blockDelete === "unblock") {
      setBlockLoad(true);
    } else {
      setDltLoad(true);
    }
    try {
      let cData = {};
      if (blockDelete === "block" || blockDelete === "unblock") {
        cData = { ...data, id: userId };
      } else {
        cData = { ...data };
      }
      let url = "";
      if (blockDelete === "block" || blockDelete === "unblock") {
        url = "user/block-unblock-account";
      } else {
        url = `user/delete-user/${userId}`;
      }
      const res = await getApiData(
        url,
        cData,
        blockDelete === "block" || blockDelete === "unblock" ? "POST" : "DELETE"
      );
      if (res.success) {
        setBlockDelete("");
        if (blockDelete === "delete") {
          props.onGetUsersLists();
          history.goBack();
        }
        props.onGetUsersLists();
        getUserDetail();
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setBlockLoad(false);
      setDltLoad(false);
    } catch (error) {
      setBlockLoad(false);
      setDltLoad(false);
      toast.error("Something went wrong");
    }
  }
  const [blockDetail, setblockDetail] = React.useState<any>({
    organizerAs: [],
    participantAs: [],
    judgeAs: [],
  });
  const [openBlockdetail, setOpenBlockDetail] = React.useState<any>(false);
  const closeBlockdetail = () => {
    setOpenBlockDetail(false);
  };
  const [blockItem, setBlockItem] = React.useState<any>({});
  //confirmation for block user
  async function openBlockConfirmation(data: any) {
    setDltLoad(true);
    try {
      let userId = "";
      if (isFrom) {
        userId = uID;
      } else {
        userId = id;
      }
      const res = await getApiData(
        `user/block-user-detail/${userId}`,
        {},
        "Get"
      );
      if (res.success) {
        setOpenDltModal(false);
        setblockDetail(res.data);
        setOpenBlockDetail(true);
        setBlockItem(data);
      } else {
        toast.error(res.message);
      }
      setDltLoad(false);
    } catch (error) {
      setOpenBlockDetail(false);
      toast.error("Something went wrong");
      setDltLoad(false);
    }
  }
  const handleClose = () => {
    setOpenDltModal(false);
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
              {props.from === "blockedUser" ? (
                <Link className="linkClass" to={{ pathname: "/blocked-users" }}>
                  Blocked Users
                </Link>
              ) : (
                <Link className="linkClass" to={{ pathname: "/user" }}>
                  Users
                </Link>
              )}
              {loader ? null : (
                <Typography color="text.primary">
                  {`${userDetail?.first_name || ""} ${
                    userDetail?.last_name || ""
                  }`}
                </Typography>
              )}
            </Breadcrumbs>
          </div>
          {isEmpty(userDetail) || props.from === "deletedUser" ? null : (
            <div>
              <Button
                sx={{ ml: 2 }}
                startIcon={<Block sx={{ mb: "3px" }} />}
                onClick={() =>
                  handleBlockUnBlockModel(
                    userDetail._id,
                    userDetail?.blocked ? "Unblock user" : "Block user"
                  )
                }
                size="small"
                variant="outlined"
                color={!userDetail?.blocked ? "warning" : "primary"}
                disabled={blockLoad}
              >
                {userDetail?.blocked ? "Unblock user" : "Block user"}
              </Button>
            </div>
          )}
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
                  {userDetail && !isEmpty(userDetail) ? (
                    <>
                      <Grid item xs={12} sm={12}>
                        <UserData userDetails={userDetail} from="active-user" />
                      </Grid>

                      {/* Status And Basic Deatils View */}
                      <Grid item xs={12} lg={12} xl={12}>
                        <BasicDetails userDetails={userDetail} />
                      </Grid>

                      {/* Bank Deatils View */}
                      {!isEmpty(userDetail?.bank_data) && (
                        <Grid item xs={12} lg={12} xl={12}>
                          <BankDetails bankDetail={userDetail?.bank_data} />
                        </Grid>
                      )}
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
            <AppConfirmDialog
              open={openUnblockDialog}
              disabled={dltLoad}
              loading={dltLoad}
              onDeny={() => {
                setDltLoad(false);
                setOpenUnblockDialog(false);
              }}
              onConfirm={() => handleUnblock(userDetail?._id)}
              title="Are you sure you want to unblock this user?"
              dialogTitle="Unblock User"
            />
            <DialogSlide
              open={!isEmpty(blockDelete)}
              onDeny={handleClose}
              onClose={handleClose}
              dialogTitle={
                blockDelete === "block" ? `Block user` : "Delete User"
              }
            >
              <ModalWrapper>
                <Box className="modalStyle">
                  <Formik
                    validateOnChange={true}
                    initialValues={{ reason: "" }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => handleSubmit(values)}
                  >
                    {(props) => {
                      const {
                        values,
                        touched,
                        errors,
                        handleChange,
                        handleSubmit,
                        handleBlur,
                      } = props;
                      return (
                        <Form
                          noValidate
                          autoComplete="off"
                          onSubmit={handleSubmit}
                        >
                          <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                            <TextField
                              name="reason"
                              value={values.reason}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              variant="outlined"
                              fullWidth
                              inputProps={{ maxLength: 250 }}
                              helperText={`${values.reason.length} / 250`}
                              minRows={3}
                              maxRows={5}
                              multiline={true}
                                                            label={`Please enter the reason for ${
                                blockDelete === "block"
                                  ? "Block"
                                  : blockDelete === "unblock"
                                  ? "Unblock"
                                  : "Deactivate"
                              }`}
                              placeholder={`Please enter the reason for ${
                                blockDelete === "block"
                                  ? "Block"
                                  : blockDelete === "unblock"
                                  ? "Unblock"
                                  : "Deactivate"
                              }`}
                            />
                            {errors.reason && touched.reason && (
                              <ErrorTextStyle>{errors.reason}</ErrorTextStyle>
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
            <DialogSlide
              open={openDltModal}
              onDeny={handleClose}
              onClose={handleClose}
              dialogTitle={"Block User"}
            >
              <ModalWrapper>
                <Box className="modalStyle">
                  <Formik
                    validateOnChange={true}
                    initialValues={{ reason: "" }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => openBlockConfirmation(values)}
                  >
                    {(props) => {
                      const {
                        values,
                        touched,
                        errors,
                        handleChange,
                        handleSubmit,
                        handleBlur,
                      } = props;
                      return (
                        <Form
                          noValidate
                          autoComplete="off"
                          onSubmit={handleSubmit}
                        >
                          <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                            <TextField
                              name="reason"
                              value={values.reason}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              variant="outlined"
                              fullWidth
                              inputProps={{ maxLength: 250 }}
                              helperText={`${values.reason.length} / 250`}
                              minRows={3}
                              maxRows={5}
                              autoFocus
                              multiline={true}
                              label="Please enter the reason for Block"
                              placeholder="Please enter the reason for Block"
                            />
                            {errors.reason && touched.reason && (
                              <ErrorTextStyle>{errors.reason}</ErrorTextStyle>
                            )}
                          </Box>
                          <div className="modalBtnDiv">
                            <LoadingButton
                              size="small"
                              type="submit"
                              variant="outlined"
                              color="primary"
                              loading={dltLoad}
                              disabled={dltLoad}
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
              open={openBlockdetail}
              disabled={dltLoad}
              loading={dltLoad}
              onDeny={closeBlockdetail}
              onConfirm={() => deleteUser()}
              title="Are you sure you want to block this account?"
              subTitle={
                <>
                  This user is currently associated with the following roles:
                  {blockDetail.organizerAs && blockDetail.organizerAs != null
                    ? userBlockDetail(blockDetail.organizerAs, "organizer")
                    : ""}
                  {blockDetail.participantAs &&
                  blockDetail.participantAs != null
                    ? userBlockDetail(blockDetail.participantAs, "participants")
                    : ""}
                  {blockDetail.judgeAs && blockDetail.judgeAs != null
                    ? userBlockDetail(blockDetail.judgeAs, "judge")
                    : ""}
                  Blocking this account will restrict the user's access and
                  actions.
                </>
              }
              dialogTitle="Block User Details"
            />
          </>
        )}
      </BodyStyle>
    </AppsContent>
  );
};
export default UserDetails;
