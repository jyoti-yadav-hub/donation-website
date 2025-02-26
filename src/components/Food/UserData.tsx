import React, { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { isEmpty } from "lodash";
import { styled } from "@mui/material/styles";
import IntlMessages from "@crema/utility/IntlMessages";
import UserDataModal from "./DataModal";
import getApiData from "../../shared/helpers/apiHelper";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { AppConfirmDialog } from "@crema";
import { Form, Formik } from "formik";
import * as yup from "yup";
import DialogSlide from "components/DialogSlide";
import AppTooltip from "@crema/core/AppTooltip";
import { useHistory } from "react-router-dom";
import MediaViewer from "@crema/core/AppMedialViewer";

const validationSchema = yup.object({
  description: yup.string().required("Description is required"),
});

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const BodyStyle = styled(Box)(({ theme }) => ({
  width: "100%",
  "& .userDataGrid": {
    boxShadow: "rgba(0, 0, 0, 0.04) 0px 10px 10px 4px",
    backgroundColor: "rgb(255, 255, 255)",
    padding: 15,
    borderRadius: "10px !important",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  "& .avtarClass": {
    height: 100,
    width: 100,
    fontSize: 20,
    backgroundColor: "#17a2da",
    marginBottom: 10,
    cursor: "pointer",
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

interface UserDataProps {
  foodDetails: any;
  getFoodDetails?: any;
}

const UserData: React.FC<UserDataProps> = ({ foodDetails, getFoodDetails }) => {
  const history = useHistory();
  const [dataModal, setDataModal] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [approveLoad, setApproveLoad] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [cancelModal, setCancelModal] = useState<boolean>(false);
  const [rejectLoad, setRejectLoad] = useState<boolean>(false);
  const [imgURL, setImgURL] = useState<any>([]);
  const [index, setIndex] = useState(-1);

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    event.stopPropagation();
    event.preventDefault();
  };

  const submitData = async (data: any, type: any) => {
    if (type === "reject") {
      setRejectLoad(true);
    } else {
      setApproveLoad(true);
    }
    const id = foodDetails?._id;
    let nData = {};
    if (type === "reject") {
      nData = { reason: data.description, type: "reject", request_id: id };
    } else {
      nData = { type: "approve", request_id: id };
    }
    try {
      const res = await getApiData(
        `request/verify-delete-request`,
        nData,
        "POST"
      );
      if (res.success) {
        setCancelModal(false);
        setVisible(false);
        history.goBack();
        // getFoodDetails();
        toast.success(res.message);
      } else {
        toast.error(res.message || "Something went wrong!");
      }
      setRejectLoad(false);
      setApproveLoad(false);
    } catch (error) {
      toast.error("Something went wrong!");
      setRejectLoad(false);
      setApproveLoad(false);
    }
  };

  const handleClose = () => {
    setCancelModal(false);
  };

  const onClose = () => {
    setIndex(-1);
    setImgURL([]);
  };

  return (
    <BodyStyle>
      {/* User Data View */}
      <Grid
        container
        spacing={4}
        xs={12}
        sx={{
          m: 0,
          justifyContent:
            foodDetails?.status === "complete" ||
            foodDetails?.status === "close" ||
            foodDetails?.status === "expired"
              ? "space-between"
              : "flex-start",
        }}
      >
        <Grid item xs={2}>
          <div className="userDataGrid">
            <div style={{ display: "flex", alignItems: "center" }}>
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
            </div>
            {/* User Name */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ fontSize: { lg: "13px", xl: "14px" } }}>
                User:
              </Typography>
              <Link
                sx={{
                  fontSize: { lg: "13px", xl: "14px" },
                  fontWeight: "500",
                  paddingLeft: 2,
                  maxHeight: "20px",
                  overflow: "hidden",
                }}
                component="button"
                variant="body2"
                underline="none"
                onClick={(event) => {
                  handleClick(event);
                  setDataModal(
                    foodDetails?.category_slug === "fundraiser" ||
                      foodDetails?.category_slug === "health" ||
                      foodDetails?.category_slug === "education"
                      ? true
                      : false
                  );
                }}
              >
                {foodDetails?.uname || "-"}
              </Link>
            </div>
          </div>
        </Grid>

        {/* Request reject request */}
        {/* eslint-disable-next-line eqeqeq */}
        {foodDetails?.delete_request && foodDetails?.status != "cancelled" && (
          <Grid item xs={4}>
            <div className="userDataGrid">
              <Alert color="error" sx={{ alignItems: "center" }}>
                {`${
                  foodDetails?.uname || "USER"
                } has requested to CANCEL this request`}
              </Alert>
              <Box
                sx={{ m: 2, display: "flex", alignItems: "flex-start", p: 1.5 }}
              >
                <Typography sx={{ pl: 2 }}>Reason:</Typography>
                <AppTooltip
                  title={
                    foodDetails?.send_request_for_delete_request_reason || ""
                  }
                  placement={"right"}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "text.secondary",
                      fontSize: { lg: "13px", xl: "14px" },
                      lineHeight: "1.43",
                      fontWeight: "500",
                      paddingLeft: 2,
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 4,
                    }}
                  >
                    {foodDetails?.send_request_for_delete_request_reason || ""}
                  </Typography>
                </AppTooltip>
              </Box>
              <Box sx={{ m: 2 }}>
                <LoadingButton
                  size="small"
                  variant="outlined"
                  color="success"
                  sx={{ m: 1 }}
                  loading={approveLoad}
                  onClick={() => setVisible(true)}
                  disabled={approveLoad}
                >
                  <IntlMessages
                    id={
                      foodDetails?.status === "cancel" ||
                      foodDetails?.status === "cancelled"
                        ? "Accepted"
                        : "Accept"
                    }
                  />
                </LoadingButton>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  sx={{ m: 1 }}
                  onClick={() => setCancelModal(true)}
                  disabled={rejectLoad}
                >
                  {foodDetails?.status === "reject" ? "Rejected" : "Reject"}
                </Button>
              </Box>
            </div>
          </Grid>
        )}

        {(foodDetails?.status === "complete" ||
          foodDetails?.status === "close" ||
          foodDetails?.status === "expired") && (
          <Grid item xs={6}>
            <Alert
              severity={
                foodDetails?.status === "expired" ? "warning" : "success"
              }
              sx={{
                backgroundColor:
                  foodDetails?.status === "expired" ? "#FFA73D" : "#edf7ed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: { lg: "13px", xl: "14px" },
                border:
                  foodDetails?.status === "expired"
                    ? "0px solid #FFA73D"
                    : "1px solid #368a36",
                color:
                  foodDetails?.status === "expired" ? "#FFF4E5" : "#368a36",
                padding: "0px 5px",
                "& .MuiAlert-icon": {
                  color:
                    foodDetails?.status === "expired" ? "#FFF4E5" : "#368a36",
                },
              }}
            >
              {foodDetails?.status === "close"
                ? `Request is closed. Transferred amount is ${
                    foodDetails?.country_data?.currency || ""
                  }${foodDetails?.total_transfer || ""}`
                : foodDetails?.status === "expired"
                ? `Request is expired. Now you can transfer the amount to ${
                    foodDetails?.uname || ""
                  }'s bank account`
                : `Request is completed. Now you can transfer the amount to ${
                    foodDetails?.uname || ""
                  }'s bank account`}
            </Alert>
          </Grid>
        )}

        {foodDetails?.status === "complete" ||
        foodDetails?.status === "close" ||
        foodDetails?.status === "expired"
          ? null
          : (foodDetails?.category_slug === "fundraiser" ||
              foodDetails?.category_slug === "health" ||
              foodDetails?.category_slug === "education") &&
            foodDetails?.need_urgent_help && (
              <Grid item>
                <div className="userDataGrid">
                  <Alert
                    severity="success"
                    sx={{
                      backgroundColor: "#edf7ed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: { lg: "13px", xl: "14px" },
                      border: "1px solid #368a36",
                      color: "#368a36",
                      padding: "0px 5px",
                      "& .MuiAlert-icon": { color: "#368a36" },
                    }}
                  >
                    Urgent Request
                  </Alert>
                  <div style={{ display: "flex", marginTop: 10 }}>
                    <Typography>
                      <IntlMessages id="Reason For Urgent" />:
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "text.secondary",
                        fontSize: { lg: "13px", xl: "14px" },
                        lineHeight: "1.43",
                        fontWeight: "500",
                        paddingLeft: "10px",
                        maxWidth: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 5,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {foodDetails?.description || "-"}
                    </Typography>
                  </div>
                </div>
              </Grid>
            )}

        {/* Donor Name */}
        {foodDetails?.status === "cancelled" ||
        foodDetails?.status === "reject" ||
        foodDetails?.status === "approve" ||
        foodDetails?.category_slug === "fundraiser" ||
        foodDetails?.category_slug === "health" ||
        foodDetails?.category_slug === "education" ? null : (
          <Grid item>
            <div className="userDataGrid">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  className="avtarClass"
                  onClick={() => {
                    setIndex(foodDetails?.donor_accept?.image ? 0 : -1);
                    setImgURL([foodDetails?.donor_accept?.image]);
                  }}
                  src={
                    foodDetails?.donor_accept?.image ||
                    "/assets/images/placeholder.jpg"
                  }
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontSize: { lg: "13px", xl: "14px" } }}>
                  Donor:
                </Typography>
                <Typography
                  variant="subtitle1"
                  noWrap={true}
                  sx={{
                    color: "text.secondary",
                    fontSize: { lg: "13px", xl: "14px" },
                    lineHeight: "1.43",
                    fontWeight: "500",
                    paddingLeft: 2,
                    maxWidth: "300px",
                  }}
                >
                  {foodDetails?.status === "pending"
                    ? "Request is pending"
                    : foodDetails?.donor_accept?.user_name || "-"}
                </Typography>
              </div>
            </div>
          </Grid>
        )}

        {/* Volunteer Name */}
        {foodDetails?.volunteer_accept &&
          !isEmpty(foodDetails?.volunteer_accept) && (
            <Grid item>
              <div className="userDataGrid">
                <div style={{ display: "flex", alignItems: "center" }}>
                  {foodDetails?.deliver_by_self &&
                  (foodDetails?.status === "delivered" ||
                    foodDetails?.status === "pickup" ||
                    foodDetails?.status === "donor_accept") ? (
                    <Avatar
                      className="avtarClass"
                      src={
                        foodDetails?.donor_accept?.image ||
                        "/assets/images/placeholder.jpg"
                      }
                    />
                  ) : (
                    <Avatar
                      className="avtarClass"
                      src={
                        foodDetails?.volunteer_accept?.image ||
                        "/assets/images/placeholder.jpg"
                      }
                      onClick={() => {
                        setIndex(
                          foodDetails?.deliver_by_self
                            ? foodDetails?.donor_accept?.image
                            : foodDetails?.volunteer_accept?.image
                            ? 0
                            : -1
                        );
                        setImgURL([
                          foodDetails?.deliver_by_self
                            ? foodDetails?.donor_accept?.image
                            : foodDetails?.volunteer_accept?.image,
                        ]);
                      }}
                    />
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ fontSize: { lg: "13px", xl: "14px" } }}>
                    Volunteer:
                  </Typography>
                  <Typography
                    noWrap={true}
                    variant="subtitle1"
                    sx={{
                      color: "text.secondary",
                      fontSize: { lg: "13px", xl: "14px" },
                      lineHeight: "1.43",
                      fontWeight: "500",
                      paddingLeft: 2,
                      maxWidth: "300px",
                    }}
                  >
                    {foodDetails?.status === "waiting_for_volunteer"
                      ? "Waiting for Volunteer"
                      : foodDetails?.volunteer_accept?.user_name || "-"}
                  </Typography>
                </div>
              </div>
            </Grid>
          )}
      </Grid>
      <UserDataModal
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        foodDetails={foodDetails}
        visible={dataModal}
        setVisible={setDataModal}
      />

      <AppConfirmDialog
        open={visible}
        disabled={approveLoad}
        loading={approveLoad}
        onDeny={() => setVisible(false)}
        onConfirm={() => submitData({}, "approve")}
        title={"Are you sure you want to delete this request?"}
        dialogTitle={"Delete Request"}
      />

      <MediaViewer
        index={index}
        medias={imgURL?.map((data) => {
          return {
            url: data,
            mime_type: "image/*",
          };
        })}
        onClose={onClose}
      />

      <DialogSlide
        open={cancelModal}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle={`Reject request`}
      >
        <ModalWrapper>
          <Box className="modalStyle">
            <Formik
              validateOnChange={true}
              initialValues={{ description: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => submitData(values, "reject")}
            >
              {(props) => {
                const { values, touched, errors, handleChange, handleSubmit } =
                  props;
                return (
                  <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                      <TextareaAutosize
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        maxRows={6}
                        aria-label="maximum height"
                        placeholder="Please enter the reason of rejection"
                        defaultValue=""
                        style={{
                          maxHeight: 300,
                          height: 300,
                          width: 500,
                          maxWidth: 500,
                          borderRadius: 5,
                          padding: 10,
                        }}
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
                        loading={rejectLoad}
                        disabled={rejectLoad}
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
  );
};

export default UserData;
