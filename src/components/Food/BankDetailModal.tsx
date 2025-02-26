/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Grid,
  // IconButton,
  InputAdornment,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import Slider from "react-slick";
import { isEmpty, isArray } from "lodash";
import getApiData from "../../shared/helpers/apiHelper";
import { toast } from "react-toastify";
import { AppCard, AppConfirmDialog, AppGrid, AppLoader } from "@crema";
import moment from "moment";
import { DatePicker, LoadingButton } from "@mui/lab";
import Lottie from "lottie-react";
import AlertLottie from "@crema/Lotties/alert.json";
import TransferMoney from "@crema/Lotties/TransferMoney.json";
import { FileDownloadOutlined } from "@mui/icons-material";
import { initialTimeFormat } from "shared/constants/AppConst";
import MediaViewer from "@crema/core/AppMedialViewer";
import { Form, Formik } from "formik";
import * as yup from "yup";
import UploadModern from "pages/thirdParty/reactDropzone/components/UploadModern";
import { useDropzone } from "react-dropzone";
import { apiCallWithFile } from "shared/helpers/utility";
import PreviewThumb from "pages/thirdParty/reactDropzone/components/PreviewThumb";
import AppDialog from "@crema/core/AppDialog";
import { downloadReceipt } from "commonFunction";
import BoxCards from "./BoxCard";
import ImageCardSlideWrapper from "pages/dashboards/Widgets/CityInfo/ImageCardSlideWrapper";
import SlideContentWrapper from "pages/dashboards/Widgets/CityInfo/SlideContentWrapper";
import { Fonts } from "shared/constants/AppEnums";

const validationSchema = yup.object({
  receipt_number: yup
    .string()
    .required("Description is required")
    .min(5, "Description should be 5 chars minimum.")
    .max(30, "Maximum 30 characters allowed"),
  note: yup
    .string()
    .min(5, "Description should be 5 chars minimum.")
    .max(250, "Maximum 250 characters allowed"),
  date: yup.date().required("Please select valid Date"),
});

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const ModalWrapper = styled(Box)(({ theme }) => ({
  maxHeight: "calc(60vh)",
  overflow: "auto",
  marginBottom: "10px",
  "& .modalStyle": { minWidth: "400px", minHeight: "100px" },
  "& .centerDiv": {
    display: "flex !important",
    alignItems: "center !important",
    flexDirection: "column",
  },
  "& .MuiBackdrop-root": { right: "auto" },
  "& .modalDiv": {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 10,
    backgroundColor: "rgb(244, 247, 254)",
    borderRadius: 5,
    flexWrap: "wrap",
  },
  "& .alertClass": { marginTop: 20 },
  "& .slick-slider": {
    display: "grid",
    width: "100%",
    alignItems: "center",
    // backgroundColor: "#f4f7fe",
    borderRadius: "10px",
  },
  "& .imgBox": { maxWidth: "100px", borderRadius: "10px", cursor: "pointer" },
  "& .slideImage": {
    backgroundColor: "#f4f7fe",
    width: "auto !important",
    objectFit: "cover",
    borderRadius: "10px",
    overflow: "hidden",
    padding: 10,
  },
  "& .txtStyle": {
    fontSize: "15px",
    fontWeight: "500",
    wordBreak: "break-word",
  },
}));

interface BankDetailModalProps {
  foodDetails?: any;
  visible: boolean;
  setVisible: any;
  from?: string;
  banDetails: any;
  loader?: boolean;
  getFoodDetails?: any;
  requestID?: any;
}

const BankDetailModal: React.FC<BankDetailModalProps> = ({
  foodDetails,
  visible,
  setVisible,
  from,
  banDetails,
  loader,
  getFoodDetails,
  requestID,
}) => {
  const [notifyLoad, setNotifyLoad] = useState<boolean>(false);
  const [transferLoad, setTransferLoad] = useState<boolean>(false);
  const [manualTransferLoad, setManualTransferLoad] = useState<boolean>(false);
  const [manualConfirm, setManualConfirm] = useState<any>(false);
  const [autoConfirm, setAutoConfirm] = useState<any>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [remainingAmount, setRemainingAmount] = useState<any>("");
  const [amountErr, setAmountErr] = useState<any>(false);
  const [amountErrTxt, setAmountErrTxt] = useState<any>("");
  const [index, setIndex] = useState(-1);
  const [fileType, setFileType] = useState<any>("");
  const [filesData, setFilesData] = useState<any>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const [btnDisable, setBtnDisable] = useState<boolean>(false);
  const [downloadLoad, setDownloadLoad] = useState<any>(false);
  const [transactionId, setTransactionId] = useState("");
  let maxSize = 5242880; //190000 5242880;

  function nameLengthValidator(file?: any) {
    if (file.size > maxSize) {
      let units = ["MB"];
      let i = 0;
      for (i; maxSize > 1024; i++) {
        maxSize /= 1024;
      }
      toast.error(
        `File size is larger than ${maxSize?.toFixed(1) + " " + units[0]}`
      );
    }
    return null;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const sliderComponent = (title?: any, filesArr?: any) => {
    return filesArr && !isEmpty(filesArr) ? (
      <AppCard
        sxStyle={{ height: 1 }}
        contentStyle={{ p: 0, pb: "0px !important" }}
      >
        <ImageCardSlideWrapper>
          <Slider className="imageCardSlide" {...settings}>
            {filesArr?.map((slide: any, index: number) => {
              let extension = slide.split(".").pop();
              let fullUrl = slide;
              return (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    textAlign: "center",
                    fontSize: { xs: 20, xl: 24 },
                    height: { lg: "calc(40vh)", xl: "calc(30vh)" },
                  }}
                  onClick={() => {
                    if (title === "Video") {
                      return;
                    } else {
                      setFilesData(filesArr);
                      setIndex(index);
                      setFileType(extension);
                    }
                  }}
                >
                  <Box
                    sx={{
                      "& .imageSlideFull": {
                        position: "absolute",
                        left: 0,
                        top: 0,
                        zIndex: title === "Video" ? 10 : -1,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      },
                    }}
                  >
                    {title === "Video" ? (
                      <video
                        src={fullUrl}
                        className="imageSlideFull"
                        controls={true}
                      />
                    ) : (
                      <img
                        src={
                          FileURLdata.includes(extension)
                            ? fullUrl
                            : "/assets/images/doc_icon.png"
                        }
                        alt={"title"}
                        className={
                          FileURLdata.includes(extension)
                            ? "imageSlideFull"
                            : "extImage"
                        }
                      />
                    )}
                    {FileURLdata.includes(extension) ||
                    title === "Video" ? null : (
                      <Typography variant="body2" className="extTextStyle">
                        {extension.toUpperCase() || ""}
                      </Typography>
                    )}
                  </Box>
                  <SlideContentWrapper>
                    <Box
                      component="h3"
                      sx={{
                        mb: 4,
                        fontWeight: Fonts.BOLD,
                        fontSize: 16,
                        zIndex: 10,
                      }}
                    >
                      {title}
                    </Box>
                  </SlideContentWrapper>
                </Box>
              );
            })}
          </Slider>
        </ImageCardSlideWrapper>
      </AppCard>
    ) : null;
  };

  const dropzone = useDropzone({
    accept: "image/jpeg, image/png, image/jpg",
    multiple: false,
    maxSize: maxSize,
    onDrop: (acceptedFiles) => {
      setUploadedFiles(
        // eslint-disable-next-line array-callback-return
        acceptedFiles.map((file) => {
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        })
      );
    },
    validator: nameLengthValidator,
  });

  useEffect(() => {
    setUploadedFiles(dropzone.acceptedFiles);
  }, [dropzone.acceptedFiles]);

  const onDeleteUploadFile = (file: any) => {
    dropzone.acceptedFiles.splice(dropzone.acceptedFiles.indexOf(file), 1);
    setUploadedFiles([...dropzone.acceptedFiles]);
  };

  //API For Upload image
  async function handleImageUpload(data: any) {
    setManualTransferLoad(true);
    const formData = new FormData();
    formData.append(
      "type",
      from === "ngoDetail" ? "ngo-transfer" : "request-transfer"
    );
    formData.append("receipt_number", data?.receipt_number);
    formData.append("date", data?.date);
    formData.append("note", data?.note);
    formData.append("id", foodDetails?._id);
    formData.append("amount", remainingAmount);
    formData.append("currency", foodDetails?.country_data?.currency || "$");
    formData.append("file", uploadedFiles[0]);

    try {
      const res = await apiCallWithFile(
        `request/admin/manual-transfer`,
        formData,
        "post"
      );
      if (res.status) {
        setTransactionId(res?.data?.transaction_id);
        getFoodDetails();
        toast.success(res?.message);
        setIsSuccess(true);
        setManualConfirm(false);
        setUploadedFiles([]);
        setManualTransferLoad(false);
      } else {
        setManualTransferLoad(false);
        toast.error(res.message);
      }
    } catch (error) {
      setManualTransferLoad(false);
      console.log("error====", error);
      toast.error("Something went wrong");
    }
  }

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

  const totalDonationCap: any =
    Number(foodDetails?.totalDonation)
      ?.toFixed(2)
      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0;

  const newDonation: any =
    Number(foodDetails?.newDonation)
      ?.toFixed(2)
      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0;

  const remainAmt = (
    Number(foodDetails?.form_data?.goal_amount) -
    Number(foodDetails?.total_donation)
  )
    ?.toFixed(2)
    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const receiveAmt = (
    Number(foodDetails?.total_donation) -
    Number(foodDetails?.form_data?.goal_amount)
  )
    ?.toFixed(2)
    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const currency = foodDetails?.country_data?.currency;

  //API For send notification to ngo when bank account is not added
  const sendNotification = async () => {
    // let id = "";
    // if (from === "ngoDetail") {
    //   id = foodDetails?._id;
    // } else if (foodDetails?.user_ngo_id) {
    //   id = foodDetails?.user_ngo_id;
    // } else {
    //   id = foodDetails?.user_id;
    // }

    let data = {};
    if (from === "ngoDetail") {
      data = { ngo_id: foodDetails?._id };
    } else {
      data = { request_id: !isEmpty(requestID) ? requestID : foodDetails?._id };
    }

    let url = "";
    if (from === "ngoDetail") {
      url = "bank/ngo-bank-link-notification";
    } else {
      url = "bank/bank-link-notification";
    }
    setNotifyLoad(true);
    try {
      const res = await getApiData(url, data, "POST");
      if (res.success) {
        setVisible(false);
        toast.success(res?.message);
      } else {
        toast.error(res?.message || "Something went wrong");
      }
      setNotifyLoad(false);
    } catch (error) {
      setNotifyLoad(false);
      toast.error("Something went wrong");
    }
  };

  //API For auto transfer amount to beneficairy bank account by STRIPE
  const autoTransfer = async () => {
    setTransferLoad(true);
    let data = {};
    if (from === "ngoDetail") {
      data = {
        ngo_id: foodDetails?._id,
        amount: Number(remainingAmount),
      };
    } else {
      data = {
        request_id: foodDetails?._id,
        user_id: foodDetails?.user_ngo_id,
        amount: Number(remainingAmount),
      };
    }

    let url = "";
    if (from === "ngoDetail") {
      url = "ngo/transfer-ngo-amount";
    } else {
      url = "donation/transfer-request-amount";
    }
    try {
      const res = await getApiData(url, data, "POST");
      if (res.success) {
        setTransactionId(res?.transaction_id);
        getFoodDetails();
        toast.success(res?.message);
        setIsSuccess(true);
        setAutoConfirm(false);
      } else {
        toast.error(res?.message || "Something went wrong");
      }
      setTransferLoad(false);
    } catch (error) {
      setTransferLoad(false);
      toast.error("Something went wrong");
    }
  };

  let FileURLdata = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG", "svg", "SVG"];

  const handleClose = () => {
    setVisible(false);
    setAutoConfirm(false);
    setAmountErr(false);
    setAmountErrTxt("");
    setRemainingAmount("");
    setIsSuccess(false);
    setUploadedFiles([]);
    setManualTransferLoad(false);
    setTransactionId("");
  };

  const hadleManualClose = () => {
    setManualConfirm(false);
    setManualTransferLoad(false);
    setIsSuccess(false);
    setUploadedFiles([]);
    setBtnDisable(false);
  };

  const onClose = () => {
    setIndex(-1);
    setFilesData([]);
    setFileType("");
  };

  return (
    <>
      <AppDialog
        maxWidth={
          isSuccess || foodDetails?.status === "close" || isEmpty(banDetails)
            ? "sm"
            : "lg"
        }
        open={visible}
        onClose={handleClose}
        title={
          isSuccess || foodDetails?.status === "close"
            ? "Money Transferred"
            : "Bank Details"
        }
      >
        <ModalWrapper>
          {isSuccess || foodDetails?.status === "close" ? (
            <>
              {/* <Box>
                <IconButton onClick={() => setIsSuccess(false)}>
                  <ArrowBack />
                </IconButton>
              </Box> */}
              <Box className="centerDiv">
                <Lottie
                  loop={true}
                  autoPlay={true}
                  animationData={TransferMoney}
                  style={{ width: 250, height: 250 }}
                />
                <Typography
                  sx={{
                    padding: 2,
                    fontWeight: "400",
                    fontSize: "16px",
                  }}
                >
                  Amount Transfered Successfully
                </Typography>
              </Box>
            </>
          ) : (
            <Box className="modalStyle">
              {loader ? (
                <AppLoader />
              ) : banDetails && !isEmpty(banDetails) && isArray(banDetails) ? (
                banDetails?.map((bd: any, index: number) => {
                  return (
                    <Grid container spacing={2} sx={{ m: 0, width: "100%" }}>
                      {/* Bank Account Name */}
                      <Grid item xs={6} lg={4} xl={3}>
                        <BoxCards
                          title="Bank Account Name"
                          values={bd?.form_data?.bank_account_name || "-"}
                        />
                      </Grid>
                      {/* Bank Name: */}
                      <Grid item xs={6} lg={4} xl={3}>
                        <BoxCards
                          title="Bank Name"
                          values={bd?.form_data?.bank_name || "-"}
                        />
                      </Grid>
                      {/* Account Number: */}
                      <Grid item xs={6} lg={4} xl={3}>
                        <BoxCards
                          title="Account Number"
                          values={bd?.form_data?.bank_account_number || "-"}
                        />
                      </Grid>
                      {/* Code: */}
                      <Grid item xs={6} lg={4} xl={3}>
                        <BoxCards
                          title={
                            bd?.form_data?.ifsc_code
                              ? "IFSC Code"
                              : "SWIFT Code" || "-"
                          }
                          values={
                            bd?.form_data?.ifsc_code
                              ? bd?.form_data?.ifsc_code
                              : bd?.form_data?.swift_code || "-"
                          }
                        />
                      </Grid>
                      {/* Is this primary account */}
                      {/* <Grid item xs={6} lg={4} xl={3}>
                          <div className="modalDiv">
                            <Typography>Is this primary account?</Typography>
                            <Chip
                              style={{
                                color: "#FFF",
                                backgroundColor: bd?.form_data
                                  ?.mark_as_primary_bank_account
                                  ? "#2e7d32" //success
                                  : "#d32f2f", //error
                              }}
                              label={
                                bd?.form_data?.mark_as_primary_bank_account
                                  ? "Yes"
                                  : "No" || "-"
                              }
                              size="small"
                            />
                          </div>
                        </Grid> */}
                      {from === "ngoDetail" ? (
                        <>
                          {/* total_donation */}
                          <Grid item xs={6} lg={4} xl={3}>
                            <BoxCards
                              title="Total Donation"
                              values={`${
                                foodDetails?.country_data?.currency || ""
                              }
                                ${totalDonationCap}`}
                            />
                          </Grid>
                          {/* remaining_amount */}
                          <Grid item xs={6} lg={4} xl={3}>
                            <BoxCards
                              title="Remaining Amount"
                              values={`${
                                foodDetails?.country_data?.currency || ""
                              }
                                ${newDonation}`}
                            />
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <TextField
                              type="number"
                              onWheel={(e: any) => e.target.blur()}
                              fullWidth
                              label="Enter amount to transfer"
                              value={remainingAmount}
                              onChange={(e: any) => {
                                if (e.target.value < 1) {
                                  setAmountErr(true);
                                  setAmountErrTxt(
                                    "Amount must be greater than 1"
                                  );
                                  setRemainingAmount("");
                                } else if (
                                  e.target.value > foodDetails?.totalDonation
                                ) {
                                  setAmountErr(true);
                                  setAmountErrTxt(
                                    "Amount can not be greater than tootal donation"
                                  );
                                  setRemainingAmount(Number(e.target.value));
                                } else {
                                  setAmountErr(false);
                                  setAmountErrTxt("");
                                  setRemainingAmount(Number(e.target.value));
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {foodDetails?.country_data?.currency || "$"}
                                  </InputAdornment>
                                ),
                              }}
                              error={amountErr}
                              helperText={amountErrTxt}
                              size="small"
                            />
                          </Grid>
                        </>
                      ) : from === "userDetails" ? null : (
                        <>
                          {/* Gooal amount */}
                          <Grid item xs={6} lg={4} xl={3}>
                            <BoxCards
                              title="Goal Amount"
                              values={`${
                                foodDetails?.country_data?.currency || ""
                              }
                                ${
                                  goalAmount ||
                                  foodDetails?.form_data?.course_fees
                                    ?.toFixed(2)
                                    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") ||
                                  0
                                }`}
                            />
                          </Grid>
                          {/* total_donation */}
                          <Grid item xs={6} lg={4} xl={3}>
                            <BoxCards
                              title="Total Donation"
                              values={`${
                                foodDetails?.country_data?.currency || ""
                              }
                                ${totalDonation}`}
                            />
                          </Grid>
                          {/* remaining_amount */}
                          {totalDonation < goalAmount ? (
                            <Grid item xs={6} lg={4} xl={3}>
                              <BoxCards
                                title="Remaining Amount"
                                values={`${
                                  foodDetails?.country_data?.currency || ""
                                }
                                ${
                                  totalDonation > 0 ? remainAmount : goalAmount
                                }`}
                              />
                            </Grid>
                          ) : null}
                          {/* additional amount */}
                          {totalDonation > goalAmount ? (
                            <Grid item xs={6} lg={4} xl={3}>
                              <BoxCards
                                title="Additional Amount"
                                values={`${
                                  foodDetails?.country_data?.currency || ""
                                }
                                ${receiveAmt}`}
                              />
                            </Grid>
                          ) : null}
                          {/* Req. Expiry Date */}
                          <Grid item xs={6} lg={4} xl={3}>
                            <BoxCards
                              title="Req. Expiry Date"
                              values={
                                moment(
                                  foodDetails?.form_data?.expiry_date
                                ).format(initialTimeFormat) || "-"
                              }
                            />
                          </Grid>
                          {/* Total Donors */}
                          <Grid item xs={6} lg={4} xl={3}>
                            <BoxCards
                              title="Total Donors"
                              values={foodDetails?.total_donors || 0}
                            />
                          </Grid>
                          {/* Total Amount Transferred */}
                          {foodDetails?.total_transfer && (
                            <Grid item xs={6} lg={4} xl={3}>
                              <BoxCards
                                title="Total Amount Transferred"
                                values={`${
                                  foodDetails?.country_data?.currency || ""
                                }
                                  ${
                                    foodDetails?.total_transfer
                                      ?.toFixed(2)
                                      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") ||
                                    0
                                  }`}
                              />
                            </Grid>
                          )}
                          {/* Remaining Transfer Amount */}
                          {foodDetails?.remaining_transfer && (
                            <Grid item xs={6} lg={4} xl={3}>
                              <BoxCards
                                title="Remaining Transfer Amount"
                                values={`${
                                  foodDetails?.country_data?.currency || ""
                                }
                                  ${
                                    foodDetails?.remaining_transfer
                                      ?.toFixed(2)
                                      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") ||
                                    0
                                  }`}
                              />
                            </Grid>
                          )}
                          {/* Alert View */}
                          {(foodDetails?.status === "complete" ||
                            foodDetails?.status === "expired") && (
                            <Grid item xs={12}>
                              <div className="alertClass">
                                {totalDonation > goalAmount ? (
                                  <Alert
                                    severity="info"
                                    sx={{
                                      backgroundColor: "#edf7ed",
                                      lineHeight: "1.6",
                                    }}
                                  >{`Saayam Community has received ${currency}${receiveAmt} Additional amount. This additional amount will be added in SAAYAM account`}</Alert>
                                ) : totalDonation === goalAmount ? (
                                  <Alert
                                    severity="info"
                                    sx={{
                                      backgroundColor: "#edf7ed",
                                      lineHeight: "1.6",
                                    }}
                                  >{`Saayam Community has received ${currency}${totalDonation} amount. Now you can transfer this amount.`}</Alert>
                                ) : totalDonation < goalAmount ? (
                                  <Alert
                                    severity="error"
                                    sx={{
                                      backgroundColor: "#fdeded",
                                      lineHeight: "1.6",
                                    }}
                                  >{`Saayam Community has received ${currency}${totalDonation} amount. The remaining ${currency}${
                                    foodDetails?.remaining_amount
                                      ? foodDetails?.remaining_amount?.toFixed(
                                          2
                                        )
                                      : remainAmt || 0
                                  } amount will be add and transfer by SAAYAM account`}</Alert>
                                ) : (
                                  <Alert
                                    severity="error"
                                    sx={{
                                      backgroundColor: "#fdeded",
                                      lineHeight: "1.6",
                                    }}
                                  >{`Saayam Community has received ${currency}${totalDonation} amount. The remaining ${currency}${
                                    foodDetails?.remaining_amount?.toFixed(2) ||
                                    goalAmount?.toFixed(2)
                                  } amount will be add and transfer by SAAYAM account`}</Alert>
                                )}
                              </div>
                            </Grid>
                          )}
                          {/* TextField */}
                          {foodDetails?.status === "complete" ||
                          foodDetails?.status === "expired" ? (
                            <Grid item xs={6} md={6}>
                              <div style={{ marginTop: "20px" }}>
                                <TextField
                                  type="number"
                                  onWheel={(e: any) => e.target.blur()}
                                  fullWidth
                                  label="Enter amount to transfer"
                                  value={remainingAmount}
                                  onChange={(e: any) => {
                                    if (foodDetails?.remaining_transfer) {
                                      if (e.target.value < 1) {
                                        setAmountErr(true);
                                        setAmountErrTxt(
                                          "Amount must be greater than 1"
                                        );
                                        setRemainingAmount("");
                                      } else if (
                                        Number(e.target.value) >
                                        foodDetails?.remaining_transfer
                                      ) {
                                        setAmountErr(true);
                                        setAmountErrTxt(
                                          `Amount can not be greater than remaining amount ${
                                            foodDetails?.country_data
                                              ?.currency || ""
                                          }${
                                            foodDetails?.remaining_transfer
                                              ?.toFixed(2)
                                              ?.replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ","
                                              ) || 0
                                          }`
                                        );
                                        setRemainingAmount(
                                          Number(e.target.value)
                                        );
                                      } else {
                                        setAmountErr(false);
                                        setAmountErrTxt("");
                                        setRemainingAmount(
                                          Number(e.target.value)
                                        );
                                      }
                                    } else {
                                      if (e.target.value < 1) {
                                        setAmountErr(true);
                                        setAmountErrTxt(
                                          "Amount must be greater than 1"
                                        );
                                        setRemainingAmount("");
                                      } else if (
                                        Number(e.target.value) > goalAmount
                                      ) {
                                        setAmountErr(true);
                                        setAmountErrTxt(
                                          "Amount can not be greater than goal amount"
                                        );
                                        setRemainingAmount(
                                          Number(e.target.value)
                                        );
                                      } else {
                                        setAmountErr(false);
                                        setAmountErrTxt("");
                                        setRemainingAmount(
                                          Number(e.target.value)
                                        );
                                      }
                                    }
                                  }}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        {foodDetails?.country_data?.currency ||
                                          "$"}
                                      </InputAdornment>
                                    ),
                                  }}
                                  error={amountErr}
                                  helperText={amountErrTxt}
                                  size="small"
                                />
                              </div>
                            </Grid>
                          ) : null}
                        </>
                      )}
                      {/* Documents */}
                      {!isEmpty(bd?.form_data?.files?.photos) ? (
                        <Grid
                          container
                          spacing={2}
                          sx={{ m: 0, width: "100%" }}
                        >
                          <Grid item xs={12} md={4} lg={4} xl={3}>
                            {sliderComponent(
                              "Bank Documents",
                              bd?.form_data?.files?.photos
                            )}
                          </Grid>
                        </Grid>
                      ) : null}
                    </Grid>
                  );
                })
              ) : banDetails && !isEmpty(banDetails) ? (
                <Grid container spacing={2} sx={{ m: 0, width: "100%" }}>
                  {/* Bank Account Name: */}
                  <Grid item xs={6} lg={4} xl={3}>
                    <BoxCards
                      title="Bank Account Name"
                      values={banDetails?.form_data?.bank_account_name || "-"}
                    />
                  </Grid>
                  {/* Bank Name: */}
                  <Grid item xs={6} lg={4} xl={3}>
                    <BoxCards
                      title="Bank Name"
                      values={banDetails?.form_data?.bank_name || "-"}
                    />
                  </Grid>
                  {/* Account Number: */}
                  <Grid item xs={6} lg={4} xl={3}>
                    <BoxCards
                      title="Account Number"
                      values={banDetails?.form_data?.bank_account_number || "-"}
                    />
                  </Grid>
                  {/* Code: */}
                  <Grid item xs={6} lg={4} xl={3}>
                    <BoxCards
                      title="Code"
                      values={
                        banDetails?.form_data?.ifsc_code
                          ? banDetails?.form_data?.ifsc_code
                          : banDetails?.form_data?.swift_code || "-"
                      }
                    />
                  </Grid>
                  {from === "ngoDetail" ? (
                    <>
                      {/* total_donation */}
                      <Grid item xs={6} lg={4} xl={3}>
                        <BoxCards
                          title="Total Donation"
                          values={`${foodDetails?.country_data?.currency || ""}
                            ${totalDonationCap}`}
                        />
                      </Grid>
                      {/* remaining_amount */}
                      <Grid item xs={6} lg={4} xl={3}>
                        <BoxCards
                          title="Remaining Transfer Amount"
                          values={`${foodDetails?.country_data?.currency || ""}
                            ${newDonation}`}
                        />
                      </Grid>
                      <Grid item xs={6} md={6}></Grid>
                      <Grid item xs={6} md={6}>
                        <div style={{ margin: "10px 0px" }}>
                          <TextField
                            type="number"
                            onWheel={(e: any) => e.target.blur()}
                            fullWidth
                            label="Enter amount to transfer"
                            value={remainingAmount}
                            onChange={(e: any) => {
                              if (foodDetails?.newDonation) {
                                if (e.target.value < 1) {
                                  setAmountErr(true);
                                  setAmountErrTxt(
                                    "Amount must be greater than 1"
                                  );
                                  setRemainingAmount("");
                                } else if (
                                  Number(e.target.value) >
                                  foodDetails?.newDonation
                                ) {
                                  setAmountErr(true);
                                  setAmountErrTxt(
                                    `Amount can not be greater than remaining amount ${
                                      foodDetails?.country_data?.currency || ""
                                    }${newDonation}`
                                  );
                                  setRemainingAmount(Number(e.target.value));
                                } else {
                                  setAmountErr(false);
                                  setAmountErrTxt("");
                                  setRemainingAmount(Number(e.target.value));
                                }
                              } else if (e.target.value < 1) {
                                setAmountErr(true);
                                setAmountErrTxt(
                                  "Amount must be greater than 1"
                                );
                                setRemainingAmount("");
                              } else if (
                                e.target.value > foodDetails?.totalDonation
                              ) {
                                setAmountErr(true);
                                setAmountErrTxt(
                                  "Amount can not be greater than remaining amount"
                                );
                                setRemainingAmount(Number(e.target.value));
                              } else {
                                setAmountErr(false);
                                setAmountErrTxt("");
                                setRemainingAmount(Number(e.target.value));
                              }
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  {foodDetails?.country_data?.currency || "$"}
                                </InputAdornment>
                              ),
                            }}
                            error={amountErr}
                            helperText={amountErrTxt}
                            size="small"
                          />
                        </div>
                      </Grid>
                    </>
                  ) : null}
                  {/* Documents */}
                  {!isEmpty(banDetails?.form_data?.files?.photos) ? (
                    <Grid container spacing={2} sx={{ m: 0, width: "100%" }}>
                      <Grid item xs={12} md={4} lg={4} xl={3}>
                        {sliderComponent(
                          "Bank Documents",
                          banDetails?.form_data?.files?.photos
                        )}
                      </Grid>
                    </Grid>
                  ) : null}
                </Grid>
              ) : (
                <Box className="centerDiv">
                  <Lottie
                    loop={false}
                    autoPlay={true}
                    animationData={AlertLottie}
                    style={{ width: 80, height: 80 }}
                  />
                  <Typography
                    sx={{ padding: 2, fontWeight: "400", fontSize: "16px" }}
                  >
                    No Bank Account Added
                  </Typography>
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "400",
                        fontSize: "16px",
                        margin: "10px 0px 15px 0px",
                      }}
                    >
                      Click on below button to send notification for add Bank
                      Detail
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
          {loader ? null : (
            <Box sx={{ mt: 2 }}>
              {isSuccess ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <LoadingButton
                    loading={downloadLoad}
                    size="small"
                    variant="outlined"
                    startIcon={<FileDownloadOutlined />}
                    color="primary"
                    disabled={downloadLoad}
                    onClick={() =>
                      downloadReceipt(transactionId, setDownloadLoad)
                    }
                  >
                    Download Payment Details
                  </LoadingButton>
                </Box>
              ) : banDetails && !isEmpty(banDetails) ? (
                from === "ngoDetail" && foodDetails?.totalDonation > 1 ? (
                  <Box
                    sx={{
                      justifyContent: "space-between",
                      width: "100%",
                      display: "flex",
                      mb: 2,
                    }}
                  >
                    {isSuccess || foodDetails?.status === "close" ? null : (
                      <LoadingButton
                        variant="outlined"
                        color="secondary"
                        loading={manualTransferLoad}
                        disabled={
                          manualTransferLoad ||
                          foodDetails?.status === "close" ||
                          amountErr
                        }
                        size="small"
                        onClick={() => {
                          if (Number(remainingAmount) < 1 || amountErr) {
                            setAmountErr(true);
                            setAmountErrTxt(
                              amountErrTxt ||
                                `Please enter how much amount you want to transfer from total donation of ${
                                  foodDetails?.country_data?.currency || ""
                                }${
                                  from === "ngoDetail"
                                    ? foodDetails?.newDonation
                                      ? newDonation
                                      : totalDonationCap
                                    : totalDonation
                                }`
                            );
                          } else {
                            setAmountErr(false);
                            setAmountErrTxt("");
                            setManualConfirm(true);
                          }
                        }}
                      >
                        {foodDetails?.status === "close"
                          ? "Transferred"
                          : "Manual Transfer"}
                      </LoadingButton>
                    )}

                    <LoadingButton
                      variant="outlined"
                      color="success"
                      loading={transferLoad}
                      disabled={
                        transferLoad ||
                        foodDetails?.status === "close" ||
                        amountErr
                      }
                      size="small"
                      onClick={() => {
                        if (Number(remainingAmount) < 1 || amountErr) {
                          setAmountErr(true);
                          setAmountErrTxt(
                            amountErrTxt ||
                              `Please enter how much amount you want to transfer from total donation of ${
                                foodDetails?.country_data?.currency || ""
                              }${
                                from === "ngoDetail"
                                  ? totalDonationCap
                                  : totalDonation
                              }`
                          );
                        } else {
                          setAmountErr(false);
                          setAmountErrTxt("");
                          setAutoConfirm(true);
                        }
                      }}
                    >
                      {foodDetails?.status === "close"
                        ? "Transferred"
                        : "Auto Transfer"}
                    </LoadingButton>
                  </Box>
                ) : from === "featuredDetail" ? (
                  <Box
                    sx={{
                      justifyContent: "space-between",
                      width: "100%",
                      display: "flex",
                      mb: 2,
                    }}
                  >
                    {foodDetails?.status ===
                    "close" ? null : foodDetails?.status === "complete" ||
                      foodDetails?.status === "close" ||
                      foodDetails?.status === "expired" ? (
                      <LoadingButton
                        variant="outlined"
                        color="secondary"
                        loading={manualTransferLoad}
                        disabled={
                          manualTransferLoad ||
                          foodDetails?.status === "close" ||
                          amountErr
                        }
                        size="small"
                        onClick={() => {
                          if (Number(remainingAmount) < 1 || amountErr) {
                            setAmountErr(true);
                            setAmountErrTxt(
                              amountErrTxt ||
                                `Please enter how much amount you want to transfer from total donation of ${
                                  foodDetails?.country_data?.currency || ""
                                }${totalDonation}`
                            );
                          } else {
                            setAmountErr(false);
                            setAmountErrTxt("");
                            setManualConfirm(true);
                          }
                        }}
                      >
                        {foodDetails?.status === "close"
                          ? "Transferred"
                          : "Manual Transfer"}
                      </LoadingButton>
                    ) : null}
                    {from === "featuredDetail" &&
                    (foodDetails?.status === "complete" ||
                      foodDetails?.status === "close" ||
                      foodDetails?.status === "expired") ? (
                      <LoadingButton
                        variant="outlined"
                        color="success"
                        loading={transferLoad}
                        disabled={
                          transferLoad ||
                          foodDetails?.status === "close" ||
                          amountErr
                        }
                        size="small"
                        onClick={() => {
                          if (Number(remainingAmount) < 1 || amountErr) {
                            setAmountErr(true);
                            setAmountErrTxt(
                              amountErrTxt ||
                                `Please enter how much amount you want to transfer`
                            );
                          } else {
                            setAmountErr(false);
                            setAmountErrTxt("");
                            setAutoConfirm(true);
                          }
                        }}
                      >
                        {foodDetails?.status === "close"
                          ? "Transferred"
                          : "Auto Transfer"}
                      </LoadingButton>
                    ) : null}
                  </Box>
                ) : null
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <LoadingButton
                    variant="outlined"
                    color="success"
                    loading={notifyLoad}
                    disabled={notifyLoad}
                    size="small"
                    onClick={sendNotification}
                  >
                    Notify
                  </LoadingButton>
                </Box>
              )}
            </Box>
          )}
        </ModalWrapper>
      </AppDialog>
      {/* Dialog for manual transfer */}
      <AppDialog
        dividers
        maxWidth={"sm"}
        open={manualConfirm}
        onClose={() => hadleManualClose()}
        title={"Manual Transfer"}
        contentStyle={{ pt: 0 }}
      >
        <ModalWrapper>
          <Box className="modalStyle">
            <Formik
              validateOnChange={true}
              initialValues={{ receipt_number: "", date: "", note: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => handleImageUpload(values)}
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
                  setFieldError,
                } = props;
                return (
                  <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <Box sx={{ mb: { xs: 3, xl: 4 }, mt: 3 }}>
                      <TextField
                        name="receipt_number"
                        value={values.receipt_number}
                        onChange={handleChange}
                        onBlur={(event: any) => {
                          const str = event.target.value.replace(/\s\s+/g, " ");
                          const trimStr = str.trim();
                          setFieldValue("receipt_number", trimStr);
                          handleBlur(event);
                        }}
                        variant="outlined"
                        size="small"
                        fullWidth
                        label={"Please enter Transaction ID"}
                        placeholder={"Please enter Transaction ID"}
                      />
                      {errors.receipt_number && touched.receipt_number && (
                        <ErrorTextStyle>{errors.receipt_number}</ErrorTextStyle>
                      )}
                    </Box>
                    <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                      <DatePicker
                        label={"Select Transaction Date"}
                        value={values.date}
                        // onAccept={(value) => {
                        //   console.log("value=======", value);
                        // }}
                        onChange={(value: any) => {
                          console.log("value=======", value);
                          // eslint-disable-next-line eqeqeq
                          if (value == "Invalid Date") {
                            setFieldError("date", "Please select valid Date");
                          } else {
                            setFieldValue("date", value);
                          }
                        }}
                        maxDate={new Date()}
                        renderInput={(params: any) => (
                          <TextField
                            {...params}
                            name="date"
                            size="small"
                            fullWidth
                            error={false}
                          />
                        )}
                      />
                      {errors.date && touched.date && (
                        <ErrorTextStyle>{errors.date}</ErrorTextStyle>
                      )}
                    </Box>
                    <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                      <TextField
                        name="note"
                        value={values.note}
                        onChange={handleChange}
                        onBlur={(event: any) => {
                          const str = event.target.value.replace(/\s\s+/g, " ");
                          const trimStr = str.trim();
                          setFieldValue("note", trimStr);
                          handleBlur(event);
                        }}
                        inputProps={{ maxLength: 250 }}
                        helperText={`${values.note.length} / 250`}
                        multiline={true}
                        minRows={3}
                        maxRows={5}
                        variant="outlined"
                        size="small"
                        fullWidth
                        label={"Please enter remarks"}
                        placeholder={"Please enter remarks"}
                      />
                      {errors.note && touched.note && (
                        <ErrorTextStyle>{errors.note}</ErrorTextStyle>
                      )}
                    </Box>
                    {/* Receipt upload */}
                    <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                      <Box sx={{ mb: 1.5 }}>Upload Receipt (Optional)</Box>
                      {isEmpty(uploadedFiles) ? (
                        <UploadModern
                          sxStyle={{ marginBottom: "0px !important" }}
                          // infoMsg="Icon must be in square"
                          uploadText="Upload Receipt"
                          dropzone={dropzone}
                        />
                      ) : (
                        <Box sx={{ position: "relative" }}>
                          {btnDisable ? <AppLoader /> : null}
                          <AppGrid
                            sx={{ width: "100%" }}
                            data={uploadedFiles}
                            column={0}
                            itemPadding={2}
                            renderRow={(file, index) => {
                              if (!isEmpty(file)) {
                                return (
                                  <PreviewThumb
                                    sxStyle={{
                                      width: 100,
                                      height: 100,
                                      borderRadius: 10,
                                      opacity: btnDisable ? 0.5 : 1,
                                    }}
                                    file={file || ""}
                                    onDeleteUploadFile={onDeleteUploadFile}
                                    key={index + file.path}
                                  />
                                );
                              }
                            }}
                          />
                        </Box>
                      )}
                    </Box>

                    <div className="modalBtnDiv">
                      <LoadingButton
                        size="small"
                        type="submit"
                        variant="outlined"
                        color="primary"
                        loading={manualTransferLoad}
                        disabled={manualTransferLoad}
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
      </AppDialog>

      <AppConfirmDialog
        open={autoConfirm}
        disabled={transferLoad}
        loading={transferLoad}
        onDeny={() => setAutoConfirm(false)}
        onConfirm={autoTransfer}
        title={
          "Are you sure you want to transfer this amount?. This will be transfer directly from STRIPE payment gateway"
        }
        dialogTitle={"Transfer Amount"}
      />
      <MediaViewer
        index={index}
        medias={filesData?.map((data: any) => {
          return {
            url: data,
            mime_type: FileURLdata.includes(fileType)
              ? "image/*"
              : "docs" || "image/*",
          };
        })}
        onClose={onClose}
      />
    </>
  );
};

export default BankDetailModal;
