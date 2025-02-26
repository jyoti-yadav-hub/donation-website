import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import DialogSlide from "components/DialogSlide";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { DatePicker, LoadingButton } from "@mui/lab";
import { isEmpty, isArray } from "lodash";
import { apiCallWithFile } from "shared/helpers/utility";
import { useDropzone } from "react-dropzone";
import UploadModern from "pages/thirdParty/reactDropzone/components/UploadModern";
import { AppGrid, AppLoader } from "@crema";
import getApiData from "../../shared/helpers/apiHelper";
import PreviewThumb from "pages/thirdParty/reactDropzone/components/PreviewThumb";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import CGoogleAutoComplete from "components/CGoogleAutocomplete";
import { isValidPhoneNumber } from "libphonenumber-js/min";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";

const style = { width: 500 };

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  style: {
    zIndex: 1000002,
    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
  },
};

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

interface NGOCreateFormProps {
  openModal?: any;
  title?: any;
  handleClose?: any;
  ngoData?: any;
  type?: any;
  uploadedLogo?: any;
  setUploadedLogo?: any;
  uploadedDeed?: any;
  setUploadedDeed?: any;
  uploadedRegiCerti?: any;
  setUploadedRegiCerti?: any;
  uploaded12aCerti?: any;
  setUploaded12aCerti?: any;
  uploaded80gCerti?: any;
  setUploaded80gCerti?: any;
  uploadedFCRAcerti?: any;
  setUploadedFCRAcerti?: any;
  locationVal?: any;
  setLocationVal?: any;
  locationLatLng?: any;
  setLocationLatLng?: any;
  CountryCode?: any;
  setCountryCode?: any;
  SecCountryCode?: any;
  setSecCountryCode?: any;
  ngoPhoneNum?: any;
  setNGOPhoneNum?: any;
  ngoSecondaryNum?: any;
  setNGOSecondaryNum?: any;
  logoImg?: any;
  setLogoImg?: any;
  deedImg?: any;
  setDeedImage?: any;
  regImg?: any;
  setRegImage?: any;
  twelveImg?: any;
  setTwelveImage?: any;
  eighteenImg?: any;
  setEighteenImage?: any;
  FCRAImg?: any;
  setFCRAImage?: any;
  // selectedItem?: any;
  // setSelectedItem?: any;
}

const emailRegex =
  /[a-z0-9]+@[a-z]+\.(com|org|edu|mil|net|gov|co|in|io|ai|ca|dev|me|co.in|co.uk)\b$/;

const validationSchema = yup.object({
  ngo_name: yup
    .string()
    .required("Name is required")
    .min(3, "Name should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
  ngo_registration_number: yup
    .string()
    .required("NGO Registration number is required")
    .min(3, "NGO Registration number should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
  first_name: yup
    .string()
    .required("First name is required")
    .min(3, "First name should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
  last_name: yup
    .string()
    .required("Last name is required")
    .min(3, "Last name should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
  ngo_email: yup
    .string()
    .required("Email is required")
    .min(5, "email should be 5 chars minimum.")
    .max(50, "Maximum 50 characters allowed")
    .matches(emailRegex, "Enter correct email"),
  expiry_date: yup.string().required(`Please select NGO expiry date`),
  about_us: yup.string().max(250, "Maximum 250 characters allowed"),
  ngo_causes: yup.array().required(`Please select ngo causes`),
});

const NGOCreateForm: React.FC<NGOCreateFormProps> = ({
  openModal,
  handleClose,
  title,
  ngoData,
  type,
  uploadedLogo,
  setUploadedLogo,
  uploadedDeed,
  setUploadedDeed,
  uploadedRegiCerti,
  setUploadedRegiCerti,
  uploaded12aCerti,
  setUploaded12aCerti,
  uploaded80gCerti,
  setUploaded80gCerti,
  uploadedFCRAcerti,
  setUploadedFCRAcerti,
  locationVal,
  setLocationVal,
  locationLatLng,
  setLocationLatLng,
  CountryCode,
  setCountryCode,
  SecCountryCode,
  setSecCountryCode,
  ngoPhoneNum,
  setNGOPhoneNum,
  ngoSecondaryNum,
  setNGOSecondaryNum,
  logoImg,
  setLogoImg,
  deedImg,
  setDeedImage,
  regImg,
  setRegImage,
  twelveImg,
  setTwelveImage,
  eighteenImg,
  setEighteenImage,
  FCRAImg,
  setFCRAImage,
  // selectedItem,
  // setSelectedItem,
}) => {
  const [btnLoad, setBtnLoad] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [secPhoneValid, setSecPhoneValid] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
  const [city, setCity] = useState(false);

  const [logoErr, setLogoErr] = useState<boolean>(false);
  const [regCertiErr, setRegCertiErr] = useState<boolean>(false);
  const [a12CertiErr, setA12CertiErr] = useState<boolean>(false);
  const [g80CertiErr, setG80CertiErr] = useState<boolean>(false);
  const [FCRAErr, setFCRAErr] = useState<boolean>(false);

  const [causeItem, setCauseItem] = useState<any>({
    causeItem: [],
    listsLoad: false,
  });

  const [logoImgLoad, setLogoImgLoad] = useState<any>("");

  const [deedImgLoad, setDeedImgLoad] = useState<any>("");

  const [regImgLoad, setRegImgLoad] = useState<any>("");

  const [twelveImgLoad, setTwelveImgLoad] = useState<any>("");

  const [eighteenImgLoad, setEighteenImgLoad] = useState<any>("");

  const [FCRAImgLoad, setFCRAImgLoad] = useState<any>("");

  async function getCauseList() {
    setCauseItem((e: any) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData(
        `category/category-list`,
        { country: "India" },
        "GET"
      );
      if (res.success) {
        setCauseItem({ listsLoad: false, causeItem: res?.data });
      } else {
        setCauseItem({ listsLoad: false, causeItem: [] });
        toast.error(res?.message);
      }
    } catch (error) {
      setCauseItem((e: any) => ({ ...e, listsLoad: true }));
      toast.error("Something went wrong!");
      console.log(
        "🚀 ~ file: CommonFunctions.tsx:391 ~ getCauseList ~ error:",
        error
      );
    }
  }

  useEffect(() => {
    getCauseList();
  }, []);

  useEffect(() => {
    if (locationVal) {
      geocodeByAddress(locationVal?.description || locationVal)
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          setLocationLatLng({ ...locationLatLng, lat: lat, lng: lng });
          console.log("Successfully got latitude and longitude", { lat, lng });
        });
    }
  }, [locationVal]);

  const modalClose = () => {
    setCity(false);
    setLocationVal(null);
    setUploadedLogo([]);
    setUploadedDeed([]);
    setUploadedRegiCerti([]);
    setUploaded12aCerti([]);
    setUploaded80gCerti([]);
    setUploadedFCRAcerti([]);
    setCountryCode("IN");
    setSecCountryCode("IN");
    setNGOPhoneNum({
      number: "",
      dialCode: "+91",
      countryFullName: "India",
      onlyNumber: "",
    });
    setNGOSecondaryNum({
      number: "",
      dialCode: "+91",
      countryFullName: "India",
      onlyNumber: "",
    });
    setLocationLatLng({ lat: 0, lng: 0 });
    handleClose();
  };

  const dropzone = useDropzone({
    accept: "image/jpeg, image/png, image/jpg",
    multiple: false,
    onDrop: (acceptedFiles) => {
      setUploadedLogo(
        // eslint-disable-next-line array-callback-return
        acceptedFiles.map((file) => {
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        })
      );
      handleLogoUpload(acceptedFiles[0]);
    },
  });

  //API For Upload ngo logo image
  async function handleLogoUpload(data: any) {
    setLogoImgLoad(true);
    const formData = new FormData();
    formData.append("file", data);
    try {
      const resp = await apiCallWithFile(
        `request/upload-file`,
        formData,
        "post"
      );
      if (resp.status) {
        setLogoImgLoad(false);
        setLogoImg(resp?.data?.file_name);
      } else {
        setLogoImgLoad(false);
        toast.error(resp.message);
      }
    } catch (error) {
      setLogoImgLoad(false);
      console.log("error====", error);
      toast.error("Something went wrong");
    }
  }

  const onDeleteLogoFile = (file: any) => {
    dropzone.acceptedFiles.splice(dropzone.acceptedFiles.indexOf(file), 1);
    setUploadedLogo([...dropzone.acceptedFiles]);
  };

  useEffect(() => {
    setUploadedLogo(dropzone.acceptedFiles);
  }, [dropzone.acceptedFiles]);

  const DeedDropzone = useDropzone({
    accept: "image/jpeg, image/png, image/jpg, .pdf",
    multiple: false,
    onDrop: (acceptedFiles) => {
      setUploadedDeed(
        // eslint-disable-next-line array-callback-return
        acceptedFiles.map((file) => {
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        })
      );
      handleDeedUpload(acceptedFiles[0]);
    },
  });

  //API For Upload deed image
  async function handleDeedUpload(data: any) {
    setDeedImgLoad(true);
    const formData = new FormData();
    formData.append("file", data);
    try {
      const resp = await apiCallWithFile(
        `request/upload-file`,
        formData,
        "post"
      );
      if (resp.status) {
        setDeedImgLoad(false);
        setDeedImage(resp?.data.file_name);
      } else {
        setDeedImgLoad(false);
        toast.error(resp.message);
      }
    } catch (error) {
      setDeedImgLoad(false);
      console.log("error====", error);
      toast.error("Something went wrong");
    }
  }

  const onDeleteDeedFile = (file: any) => {
    DeedDropzone.acceptedFiles.splice(
      DeedDropzone.acceptedFiles.indexOf(file),
      1
    );
    setUploadedDeed([...DeedDropzone.acceptedFiles]);
  };

  useEffect(() => {
    setUploadedDeed(DeedDropzone.acceptedFiles);
  }, [DeedDropzone.acceptedFiles]);

  const RegistrationDropzone = useDropzone({
    accept: "image/jpeg, image/png, image/jpg, .pdf",
    multiple: false,
    onDrop: (acceptedFiles) => {
      setUploadedRegiCerti(
        // eslint-disable-next-line array-callback-return
        acceptedFiles.map((file) => {
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        })
      );
      handleRegCertiUpload(acceptedFiles[0]);
    },
  });

  //API For Upload  registration certi image
  async function handleRegCertiUpload(data: any) {
    setRegImgLoad(true);
    const formData = new FormData();
    formData.append("file", data);
    try {
      const resp = await apiCallWithFile(
        `request/upload-file`,
        formData,
        "post"
      );
      if (resp.status) {
        setRegImgLoad(false);
        setRegImage(resp?.data?.file_name);
      } else {
        setRegImgLoad(false);
        toast.error(resp.message);
      }
    } catch (error) {
      setRegImgLoad(false);
      console.log("error====", error);
      toast.error("Something went wrong");
    }
  }

  const onDeleteRegCertiFile = (file: any) => {
    RegistrationDropzone.acceptedFiles.splice(
      RegistrationDropzone.acceptedFiles.indexOf(file),
      1
    );
    setUploadedRegiCerti([...RegistrationDropzone.acceptedFiles]);
  };

  useEffect(() => {
    setUploadedRegiCerti(RegistrationDropzone.acceptedFiles);
  }, [RegistrationDropzone.acceptedFiles]);

  const TwelveADropzone = useDropzone({
    accept: "image/jpeg, image/png, image/jpg, .pdf",
    multiple: false,
    onDrop: (acceptedFiles) => {
      setUploaded12aCerti(
        // eslint-disable-next-line array-callback-return
        acceptedFiles.map((file) => {
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        })
      );
      handleTwelveUpload(acceptedFiles[0]);
    },
  });

  //API For Upload twelve certi image
  async function handleTwelveUpload(data: any) {
    setTwelveImgLoad(true);
    const formData = new FormData();
    formData.append("file", data);
    try {
      const resp = await apiCallWithFile(
        `request/upload-file`,
        formData,
        "post"
      );
      if (resp.status) {
        setTwelveImgLoad(false);
        setTwelveImage(resp?.data?.file_name);
      } else {
        setTwelveImgLoad(false);
        toast.error(resp.message);
      }
    } catch (error) {
      setTwelveImgLoad(false);
      console.log("error====", error);
      toast.error("Something went wrong");
    }
  }

  const onDeleteYwelveFile = (file: any) => {
    TwelveADropzone.acceptedFiles.splice(
      TwelveADropzone.acceptedFiles.indexOf(file),
      1
    );
    setUploaded12aCerti([...TwelveADropzone.acceptedFiles]);
  };

  useEffect(() => {
    setUploaded12aCerti(TwelveADropzone.acceptedFiles);
  }, [TwelveADropzone.acceptedFiles]);

  const EighteenGDropzone = useDropzone({
    accept: "image/jpeg, image/png, image/jpg, .pdf",
    multiple: false,
    onDrop: (acceptedFiles) => {
      setUploaded80gCerti(
        // eslint-disable-next-line array-callback-return
        acceptedFiles.map((file) => {
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        })
      );
      handle18Upload(acceptedFiles[0]);
    },
  });

  //API For Upload 18 image
  async function handle18Upload(data: any) {
    setEighteenImgLoad(true);
    const formData = new FormData();
    formData.append("file", data);
    try {
      const resp = await apiCallWithFile(
        `request/upload-file`,
        formData,
        "post"
      );
      if (resp.status) {
        setEighteenImgLoad(false);
        setEighteenImage(resp?.data?.file_name);
      } else {
        setEighteenImgLoad(false);
        toast.error(resp.message);
      }
    } catch (error) {
      setEighteenImgLoad(false);
      console.log("error====", error);
      toast.error("Something went wrong");
    }
  }

  const onDelete80gFile = (file: any) => {
    EighteenGDropzone.acceptedFiles.splice(
      EighteenGDropzone.acceptedFiles.indexOf(file),
      1
    );
    setUploaded80gCerti([...EighteenGDropzone.acceptedFiles]);
  };

  useEffect(() => {
    setUploaded80gCerti(EighteenGDropzone.acceptedFiles);
  }, [EighteenGDropzone.acceptedFiles]);

  const FCRADropzone = useDropzone({
    accept: "image/jpeg, image/png, image/jpg, .pdf",
    multiple: false,
    onDrop: (acceptedFiles) => {
      setUploadedFCRAcerti(
        // eslint-disable-next-line array-callback-return
        acceptedFiles.map((file) => {
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        })
      );
      handleFCRAUpload(acceptedFiles[0]);
    },
  });

  const onDeleteFCRAFile = (file: any) => {
    FCRADropzone.acceptedFiles.splice(
      FCRADropzone.acceptedFiles.indexOf(file),
      1
    );
    setUploadedFCRAcerti([...FCRADropzone.acceptedFiles]);
  };

  //API For Upload FCRA image
  async function handleFCRAUpload(data: any) {
    setFCRAImgLoad(true);
    const formData = new FormData();
    formData.append("file", data);
    try {
      const resp = await apiCallWithFile(
        `request/upload-file`,
        formData,
        "post"
      );
      if (resp.status) {
        setFCRAImgLoad(false);
        setFCRAImage(resp?.data?.file_name);
      } else {
        setFCRAImgLoad(false);
        toast.error(resp.message);
      }
    } catch (error) {
      setFCRAImgLoad(false);
      console.log("error====", error);
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    setUploadedFCRAcerti(FCRADropzone.acceptedFiles);
  }, [FCRADropzone.acceptedFiles]);

  // check if user already exists or not
  const checkUser = async (
    typeU: any = "",
    phone: any = "",
    phoneCode: any = "",
    mail: any = "",
    type2: any = "",
    signFormData: any = {}
  ) => {
    let data: any = {
      phone: ngoPhoneNum?.onlyNumber,
      phone_code: `+${ngoPhoneNum?.dialCode}`,
      type: "login",
      country_name: ngoPhoneNum?.countryFullName,
    };
    if (typeU === "ngo_signup") {
      data = { type: "ngo_signup" };
      if (!isEmpty(phone)) {
        data.phone = phone;
        data.phone_code = phoneCode;
      }
      if (!isEmpty(mail)) {
        data.email = mail;
      }
    }
    try {
      const res = await getApiData(`user/check-user`, data, "POST");
      if (res.success) {
        setBtnDisabled(false);
      } else {
        if (res?.message === "User not found!" || res?.blockedUser) {
          toast.error(res?.message);
          setBtnDisabled(true);
        } else {
          setBtnDisabled(true);
          toast.error(res?.message || "Something went wrong");
        }
      }
    } catch (error) {
      //   setBtnDisabled(false);
      //   setLoader(false);
      //   dispatch(setRoleList([]) as any);
      toast.error("Something went wrong");
    }
  };

  const handleValid = (values) => {
    let valid = true;
    if (isEmpty(uploadedLogo)) {
      valid = false;
      setLogoErr(true);
    } else {
      valid = true;
      setLogoErr(false);
    }
    if (isEmpty(ngoPhoneNum?.number)) {
      valid = false;
      setPhoneValid(true);
    } else {
      valid = true;
      setPhoneValid(false);
    }
    if (isEmpty(ngoSecondaryNum?.number)) {
      valid = false;
      setSecPhoneValid(true);
    } else {
      valid = true;
      setSecPhoneValid(false);
    }
    if (isEmpty(uploadedRegiCerti)) {
      valid = false;
      setRegCertiErr(true);
    } else {
      valid = true;
      setRegCertiErr(false);
    }
    if (
      values.upload_12A_80G_certificate &&
      isEmpty(uploaded12aCerti) &&
      isEmpty(uploaded80gCerti)
    ) {
      valid = false;
      setA12CertiErr(true);
    } else {
      valid = true;
      setA12CertiErr(false);
    }
    // if (values.upload_12A_80G_certificate && isEmpty(uploaded80gCerti)) {
    //   valid = false;
    //   setG80CertiErr(true);
    // } else {
    //   valid = true;
    //   setG80CertiErr(false);
    // }
    if (values.upload_FCRA_certificate && isEmpty(uploadedFCRAcerti)) {
      valid = false;
      setFCRAErr(true);
    } else {
      valid = true;
      setFCRAErr(false);
    }
  };

  //API For create NGO
  async function submitData(data: any) {
    if (isEmpty(locationVal)) {
      setCity(true);
    } else if (
      logoErr ||
      phoneValid ||
      secPhoneValid ||
      regCertiErr ||
      a12CertiErr ||
      FCRAErr
    ) {
      toast.error("Fill required fields");
      return;
    } else {
      const fData = {
        ...data,
        ngo_phone: ngoPhoneNum?.onlyNumber,
        ngo_phone_code: ngoPhoneNum?.dialCode?.includes("+")
          ? ngoPhoneNum?.dialCode
          : `+${ngoPhoneNum?.dialCode}`,
        phone_country_full_name: ngoPhoneNum?.countryFullName,
        phone_country_short_name: CountryCode.toUpperCase(),
        secondary_phone: ngoSecondaryNum?.onlyNumber,
        secondary_phone_code: ngoSecondaryNum?.dialCode?.includes("+")
          ? ngoSecondaryNum?.dialCode
          : `+${ngoSecondaryNum?.dialCode}`,
        secondary_country_full_name: ngoSecondaryNum?.countryFullName,
        secondary_country_short_name: SecCountryCode.toUpperCase(),
        latitude: locationLatLng?.lat.toString() || 0,
        longitude: locationLatLng?.lng.toString() || 0,
        city: locationVal?.description ? locationVal?.description : locationVal,
        country_name: ngoPhoneNum?.countryFullName,
        is_ngo: true,
        ngo_cover_image: logoImg || "",
        ngo_deed: deedImg || "",
        ngo_certificate: regImg || "",
      };
      if (data?.upload_12A_80G_certificate) {
        fData.ngo_12A_certificate = twelveImg || "";
        fData.ngo_80G_certificate = eighteenImg || "";
      }
      if (data?.upload_FCRA_certificate) {
        fData.ngo_FCRA_certificate = FCRAImg || "";
      }
      console.log("fData====", fData);
      setBtnLoad(true);
      let url = `ngo/admin/create-ngo`;
      if (type === "edit") {
        url = `ngo/admin/update-ngo/${ngoData?._id}`;
      } else {
        url = `ngo/admin/create-ngo`;
      }
      try {
        const resp = await getApiData(
          url,
          fData,
          type === "edit" ? "PUT" : "POST"
        );
        if (resp.success) {
          setBtnLoad(false);
          setPhoneValid(false);
          setSecPhoneValid(false);
          modalClose();
          toast.success(resp.message);
        } else {
          toast.error(resp.message);
          setBtnLoad(false);
        }
      } catch (error) {
        setBtnLoad(false);
        console.log("error====", error);
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <DialogSlide
      open={openModal}
      onDeny={() => modalClose()}
      onClose={() => modalClose()}
      dialogTitle={title}
    >
      <Box sx={style}>
        <Formik
          validateOnChange={true}
          initialValues={{
            ngo_name: ngoData?.ngo_name || "",
            ngo_registration_number: ngoData?.ngo_registration_number || "",
            first_name: ngoData?.first_name || "",
            last_name: ngoData?.last_name || "",
            ngo_email: ngoData?.ngo_email || "",
            expiry_date: ngoData?.expiry_date || "",
            about_us: ngoData?.about_us || "",
            upload_12A_80G_certificate:
              ngoData?.upload_12A_80G_certificate || false,
            upload_FCRA_certificate: ngoData?.upload_FCRA_certificate || false,
            ngo_causes: ngoData?.ngo_causes || [],
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => submitData(values)}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              setFieldError,
            } = props;
            return (
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid
                  container
                  xs={12}
                  spacing={2}
                  sx={{ m: 0, width: "100%", pr: "16px" }}
                >
                  <Grid
                    item
                    xs={12}
                    sx={{
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                      mt: "-15px",
                      flexDirection: "column",
                    }}
                  >
                    {isEmpty(uploadedLogo) ? (
                      <UploadModern
                        uploadText=""
                        dropzone={dropzone}
                        sxStyle={{
                          width: 100,
                          height: 100,
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center",
                          p: 0,
                          display: "flex",
                          alignSelf: "center",
                        }}
                      />
                    ) : (
                      <Box sx={{ position: "relative" }}>
                        {logoImgLoad ? <AppLoader /> : null}
                        <AppGrid
                          sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          data={uploadedLogo}
                          column={0}
                          itemPadding={2}
                          renderRow={(file, index) => {
                            const fileExt = file?.path
                              ? file?.path?.split(".").pop()
                              : file?.split(".").pop();
                            if (!isEmpty(file)) {
                              return (
                                <PreviewThumb
                                  sxStyle={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 50,
                                    opacity: logoImgLoad ? 0.5 : 1,
                                    mb: 2,
                                  }}
                                  fileExt={fileExt}
                                  file={file || ""}
                                  onDeleteUploadFile={onDeleteLogoFile}
                                  key={index + file.path}
                                />
                              );
                            }
                          }}
                        />
                      </Box>
                    )}
                    {isEmpty(uploadedLogo) && logoErr && (
                      <ErrorTextStyle>Please upload NGO Logo</ErrorTextStyle>
                    )}
                  </Grid>
                  {/* ngo_name */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="NGO Name"
                      name="ngo_name"
                      value={values.ngo_name}
                      variant="outlined"
                      size="small"
                      onChange={(event: any) => handleChange(event)}
                      fullWidth
                    />
                    {errors.ngo_name && touched.ngo_name && (
                      <ErrorTextStyle>{errors.ngo_name}</ErrorTextStyle>
                    )}
                  </Grid>
                  {/* ngo_registration_number */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Registration Certificate Number"
                      name="ngo_registration_number"
                      value={values.ngo_registration_number}
                      variant="outlined"
                      size="small"
                      onChange={(event: any) => handleChange(event)}
                      fullWidth
                    />
                    {errors.ngo_registration_number &&
                      touched.ngo_registration_number && (
                        <ErrorTextStyle>
                          {errors.ngo_registration_number}
                        </ErrorTextStyle>
                      )}
                  </Grid>
                  {/* first_name */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="First Name(Trustee 1)"
                      name="first_name"
                      value={values.first_name}
                      variant="outlined"
                      size="small"
                      onChange={(event: any) => handleChange(event)}
                      fullWidth
                    />
                    {errors.first_name && touched.first_name && (
                      <ErrorTextStyle>{errors.first_name}</ErrorTextStyle>
                    )}
                  </Grid>
                  {/* last_name */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Last Name(Trustee 1)"
                      variant="outlined"
                      size="small"
                      onChange={(event: any) => handleChange(event)}
                      value={values.last_name}
                      name="last_name"
                      fullWidth
                    />
                    {errors.last_name && touched.last_name && (
                      <ErrorTextStyle>{errors.last_name}</ErrorTextStyle>
                    )}
                  </Grid>
                  {/* ngo_email */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="NGO Email"
                      variant="outlined"
                      size="small"
                      value={values.ngo_email}
                      fullWidth
                      onChange={(event: any) => {
                        handleChange(event);
                      }}
                      name="ngo_email"
                    />
                    {errors.ngo_email && touched.ngo_email && (
                      <ErrorTextStyle>{errors.ngo_email}</ErrorTextStyle>
                    )}
                  </Grid>
                  {/* primary number */}
                  <Grid item xs={12} md={6}>
                    <PhoneInput
                      autoFormat={false}
                      placeholder="NGO Primary Number"
                      countryCodeEditable={false}
                      enableSearch={true}
                      disableSearchIcon={true}
                      value={ngoPhoneNum?.number || ""}
                      onChange={(v: any, data: any, event: any) => {
                        var str = event?.target?.value || "";
                        str = str.replace(`+${data?.dialCode}`, "");

                        if (isValidPhoneNumber(event.target.value || "")) {
                          checkUser(
                            "ngo_signup",
                            str,
                            `+${data?.dialCode}`,
                            values.ngo_email,
                            ""
                          );
                          setPhoneValid(false);
                        } else {
                          setPhoneValid(true);
                        }
                        setCountryCode(data?.countryCode);
                        setNGOPhoneNum({
                          number: event.target.value,
                          dialCode: `${data?.dialCode}`,
                          countryFullName: data?.name,
                          onlyNumber: str,
                        });
                      }}
                      //   country={CountryCode}
                      inputStyle={{
                        width: "100%",
                        height: "40px",
                        borderRadius: 7,
                        border: "1px solid #ccc",
                      }}
                      searchStyle={{ width: "90%" }}
                    />
                    {phoneValid ? (
                      <ErrorTextStyle>Enter valid phone number</ErrorTextStyle>
                    ) : btnDisabled ? (
                      <ErrorTextStyle>
                        Phone number is already registered in Saayam
                      </ErrorTextStyle>
                    ) : null}
                  </Grid>
                  {/* secondary number */}
                  <Grid item xs={12} md={6}>
                    <PhoneInput
                      autoFormat={false}
                      placeholder="NGO Secondary Number"
                      countryCodeEditable={false}
                      enableSearch={true}
                      disableSearchIcon={true}
                      value={ngoSecondaryNum?.number || ""}
                      onChange={(v: any, data: any, event: any) => {
                        var str = event?.target?.value || "";
                        str = str.replace(`+${data?.dialCode}`, "");

                        if (isValidPhoneNumber(event.target.value || "")) {
                          setSecPhoneValid(false);
                        } else {
                          setSecPhoneValid(true);
                        }
                        setSecCountryCode(data?.countryCode);
                        setNGOSecondaryNum({
                          number: event.target.value,
                          dialCode: `${data?.dialCode}`,
                          countryFullName: data?.name,
                          onlyNumber: str,
                        });
                      }}
                      inputStyle={{
                        width: "100%",
                        height: "40px",
                        borderRadius: 7,
                        border: "1px solid #ccc",
                      }}
                      searchStyle={{ width: "90%" }}
                      //   specialLabel=""
                      //   country={SecCountryCode}
                    />
                    {secPhoneValid ? (
                      <ErrorTextStyle>Enter valid phone number</ErrorTextStyle>
                    ) : null}
                  </Grid>
                  {/* expiry date */}
                  <Grid item xs={12} md={6}>
                    {/* <DatePicker
                      label={"Select NGO Expiry Date"}
                      value={values.expiry_date}
                      // onAccept={(value) => {
                      //   console.log("value=======", value);
                      // }}
                      onChange={(value: any) => {
                        console.log("value=======", value);
                        // eslint-disable-next-line eqeqeq
                        if (value == "Invalid Date") {
                          setFieldError(
                            "expiry_date",
                            "Please select valid Date"
                          );
                        } else {
                          setFieldValue("expiry_date", value);
                        }
                      }}
                      minDate={new Date()}
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          name="expiry_date"
                          size="small"
                          fullWidth
                          error={false}
                        />
                      )}
                    /> */}
                    <Field
                      component={DatePicker}
                      sx={{ width: "100%" }}
                      openTo="day"
                      views={["day"]}
                      autoOk
                      minDate={new Date()}
                      variant="outlined"
                      inputVariant="outlined"
                      label="NGO Expiry Date"
                      name="expiry_date"
                      value={values.expiry_date}
                      onChange={(value: any) =>
                        setFieldValue("expiry_date", value)
                      }
                      renderInput={(params: any) => (
                        <TextField
                          onKeyDown={(e) => e.preventDefault()}
                          size="small"
                          {...params}
                          fullWidth
                          error={false}
                        />
                      )}
                    />
                    {errors.expiry_date && touched.expiry_date && (
                      <ErrorTextStyle>{errors.expiry_date}</ErrorTextStyle>
                    )}
                  </Grid>
                  {/* ======= ngo_causes ======= */}
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-select-small">
                        Select Causes
                      </InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        multiple
                        value={
                          isArray(values.ngo_causes)
                            ? values?.ngo_causes
                            : [values?.ngo_causes] || []
                        }
                        onChange={(event: any) => {
                          if (event.target.value.includes("none")) {
                            setFieldValue("ngo_causes", []);
                          } else {
                            handleChange(event);
                          }
                        }}
                        onBlur={handleBlur}
                        input={
                          <OutlinedInput
                            id="select-multiple-chip"
                            label="Select ngo_causes"
                            size="small"
                          />
                        }
                        renderValue={(selected) => (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                            }}
                          >
                            {selected && !isEmpty(selected)
                              ? selected.map((value) => (
                                  <Chip
                                    size="small"
                                    key={value}
                                    label={value}
                                  />
                                ))
                              : null}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                        name="ngo_causes"
                        fullWidth
                      >
                        <MenuItem value="none" key="none">
                          None
                        </MenuItem>
                        {causeItem?.causeItem?.map((item: any, index: any) => {
                          return (
                            <MenuItem value={item?.category_slug} key={index}>
                              {item?.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    {errors.ngo_causes && touched.ngo_causes && (
                      <ErrorTextStyle>{errors.ngo_causes}</ErrorTextStyle>
                    )}
                  </Grid>
                  {/* location */}
                  <Grid item xs={12} md={12}>
                    <CGoogleAutoComplete
                      value={
                        !isEmpty(locationVal?.description)
                          ? locationVal?.description
                          : locationVal
                          ? locationVal
                          : ""
                      }
                      setValue={setLocationVal}
                      setAddValid={setCity}
                      //   label="City"
                    />
                    {city ? (
                      <ErrorTextStyle>Please select city</ErrorTextStyle>
                    ) : null}
                  </Grid>
                  {/* about_us */}
                  <Grid item xs={12} md={12}>
                    <TextField
                      minRows={2}
                      maxRows={3}
                      multiline={true}
                      label="About US"
                      fullWidth
                      onChange={(event: any) => handleChange(event)}
                      value={values.about_us}
                      name="about_us"
                      placeholder="About US"
                      inputProps={{ maxLength: 250 }}
                      helperText={`${values.about_us.length} / 250`}
                    />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Typography style={{ fontWeight: "bold" }}>
                      Document
                    </Typography>
                  </Grid>
                  {/* ngo_deed */}
                  <Grid item xs={12} md={6} style={{ paddingTop: "7px" }}>
                    <Typography style={{ fontSize: "15px" }}>
                      Upload Copy of Deed
                    </Typography>

                    {isEmpty(uploadedDeed) ? (
                      <UploadModern
                        uploadText=""
                        dropzone={DeedDropzone}
                        sxStyle={{
                          marginTop: "5px",
                          width: 100,
                          height: 100,
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center",
                          p: 0,
                          display: "flex",
                          alignSelf: "center",
                        }}
                      />
                    ) : (
                      <Box sx={{ position: "relative" }}>
                        {deedImgLoad ? <AppLoader /> : null}
                        <AppGrid
                          sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          data={uploadedDeed}
                          column={0}
                          itemPadding={2}
                          renderRow={(file, index) => {
                            const fileExt = file?.path
                              ? file?.path?.split(".").pop()
                              : file?.split(".").pop();
                            if (!isEmpty(file)) {
                              return (
                                <PreviewThumb
                                  sxStyle={{
                                    marginTop: "10px",
                                    width: 100,
                                    height: 100,
                                    borderRadius: 50,
                                    opacity: deedImgLoad ? 0.5 : 1,
                                    mb: 2,
                                  }}
                                  fileExt={fileExt}
                                  file={file || ""}
                                  onDeleteUploadFile={onDeleteDeedFile}
                                  key={index + file.path}
                                />
                              );
                            }
                          }}
                        />
                      </Box>
                    )}
                  </Grid>
                  {/* ngo_certificate */}
                  <Grid item xs={12} md={6} style={{ paddingTop: "7px" }}>
                    <Typography style={{ fontSize: "15px" }}>
                      Upload Registration Certificate
                    </Typography>

                    {isEmpty(uploadedRegiCerti) ? (
                      <UploadModern
                        uploadText=""
                        dropzone={RegistrationDropzone}
                        sxStyle={{
                          marginTop: "5px",
                          width: 100,
                          height: 100,
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center",
                          p: 0,
                          display: "flex",
                          alignSelf: "center",
                        }}
                      />
                    ) : (
                      <Box sx={{ position: "relative" }}>
                        {regImgLoad ? <AppLoader /> : null}
                        <AppGrid
                          sx={{
                            marginTop: "10px",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          data={uploadedRegiCerti}
                          column={0}
                          itemPadding={2}
                          renderRow={(file, index) => {
                            const fileExt = file?.path
                              ? file?.path?.split(".").pop()
                              : file?.split(".").pop();
                            if (!isEmpty(file)) {
                              return (
                                <PreviewThumb
                                  sxStyle={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 50,
                                    opacity: regImgLoad ? 0.5 : 1,
                                    mb: 2,
                                  }}
                                  fileExt={fileExt}
                                  file={file || ""}
                                  onDeleteUploadFile={onDeleteRegCertiFile}
                                  key={index + file.path}
                                />
                              );
                            }
                          }}
                        />
                      </Box>
                    )}
                    {isEmpty(uploadedRegiCerti) && regCertiErr && (
                      <ErrorTextStyle>
                        Please upload Registration Certificate
                      </ErrorTextStyle>
                    )}
                  </Grid>
                  {/* 12A and 80G */}
                  <Grid item xs={12} md={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          defaultChecked={
                            values.upload_12A_80G_certificate || false
                          }
                          value={values.upload_12A_80G_certificate || false}
                          size="small"
                        />
                      }
                      value={values.upload_12A_80G_certificate || false}
                      onChange={handleChange}
                      name="upload_12A_80G_certificate"
                      label="Do you have 12A and 80G certificate"
                    />
                    {/* <Box
                      sx={{
                        mb: 1,
                        mt: -5,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="upload_12A_80G_certificate"
                            typeof="checkbox"
                            checked={checked}
                            onChange={handleChangeCheckbox}
                            color="primary"
                          />
                        }
                        label="Do you have 12A and 80G certificate"
                      />
                    </Box> */}
                  </Grid>

                  {values.upload_12A_80G_certificate && (
                    <Grid item xs={12} md={6} style={{ paddingTop: "0px" }}>
                      <Typography style={{ fontSize: "15px" }}>
                        Upload 12A Certificate
                      </Typography>

                      {isEmpty(uploaded12aCerti) ? (
                        <UploadModern
                          uploadText=""
                          dropzone={TwelveADropzone}
                          sxStyle={{
                            marginTop: "5px",
                            width: 100,
                            height: 100,
                            borderRadius: 5,
                            alignItems: "center",
                            justifyContent: "center",
                            p: 0,
                            display: "flex",
                            alignSelf: "center",
                          }}
                        />
                      ) : (
                        <Box sx={{ position: "relative" }}>
                          {twelveImgLoad ? <AppLoader /> : null}
                          <AppGrid
                            sx={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            data={uploaded12aCerti}
                            column={0}
                            itemPadding={2}
                            renderRow={(file, index) => {
                              const fileExt = file?.path
                                ? file?.path?.split(".").pop()
                                : file?.split(".").pop();
                              if (!isEmpty(file)) {
                                return (
                                  <PreviewThumb
                                    sxStyle={{
                                      width: 100,
                                      height: 100,
                                      borderRadius: 50,
                                      opacity: twelveImgLoad ? 0.5 : 1,
                                      mb: 2,
                                    }}
                                    fileExt={fileExt}
                                    file={file || ""}
                                    onDeleteUploadFile={onDeleteYwelveFile}
                                    key={index + file.path}
                                  />
                                );
                              }
                            }}
                          />
                        </Box>
                      )}
                      {a12CertiErr && (
                        <ErrorTextStyle>
                          Please upload 12A Certificate or 80G Certificate
                        </ErrorTextStyle>
                      )}
                    </Grid>
                  )}

                  {values.upload_12A_80G_certificate && (
                    <Grid item xs={12} md={6} style={{ paddingTop: "0px" }}>
                      <Typography style={{ fontSize: "15px" }}>
                        Upload 80G Certificate
                      </Typography>

                      {isEmpty(uploaded80gCerti) ? (
                        <UploadModern
                          uploadText=""
                          dropzone={EighteenGDropzone}
                          sxStyle={{
                            marginTop: "5px",
                            width: 100,
                            height: 100,
                            borderRadius: 5,
                            alignItems: "center",
                            justifyContent: "center",
                            p: 0,
                            display: "flex",
                            alignSelf: "center",
                          }}
                        />
                      ) : (
                        <Box sx={{ position: "relative" }}>
                          {eighteenImgLoad ? <AppLoader /> : null}
                          <AppGrid
                            sx={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            data={uploaded80gCerti}
                            column={0}
                            itemPadding={2}
                            renderRow={(file, index) => {
                              const fileExt = file?.path
                                ? file?.path?.split(".").pop()
                                : file?.split(".").pop();
                              if (!isEmpty(file)) {
                                return (
                                  <PreviewThumb
                                    sxStyle={{
                                      width: 100,
                                      height: 100,
                                      borderRadius: 50,
                                      opacity: eighteenImgLoad ? 0.5 : 1,
                                      mb: 2,
                                    }}
                                    fileExt={fileExt}
                                    file={file || ""}
                                    onDeleteUploadFile={onDelete80gFile}
                                    key={index + file.path}
                                  />
                                );
                              }
                            }}
                          />
                        </Box>
                      )}
                    </Grid>
                  )}

                  <Grid item xs={12} md={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          defaultChecked={
                            values.upload_FCRA_certificate || false
                          }
                          value={values.upload_FCRA_certificate || false}
                          size="small"
                        />
                      }
                      value={values.upload_FCRA_certificate || false}
                      onChange={handleChange}
                      name="upload_FCRA_certificate"
                      label="Do you have FCRA certificate"
                    />
                  </Grid>

                  {values.upload_FCRA_certificate && (
                    <Grid item xs={12} md={6} style={{ paddingTop: "0px" }}>
                      <Typography style={{ fontSize: "15px" }}>
                        Upload FCRA Certificate
                      </Typography>

                      {isEmpty(uploadedFCRAcerti) ? (
                        <UploadModern
                          uploadText=""
                          dropzone={FCRADropzone}
                          sxStyle={{
                            marginTop: "5px",
                            width: 100,
                            height: 100,
                            borderRadius: 5,
                            alignItems: "center",
                            justifyContent: "center",
                            p: 0,
                            display: "flex",
                            alignSelf: "center",
                          }}
                        />
                      ) : (
                        <Box sx={{ position: "relative" }}>
                          {FCRAImgLoad ? <AppLoader /> : null}
                          <AppGrid
                            sx={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            data={uploadedFCRAcerti}
                            column={0}
                            itemPadding={2}
                            renderRow={(file, index) => {
                              const fileExt = file?.path
                                ? file?.path?.split(".").pop()
                                : file?.split(".").pop();
                              if (!isEmpty(file)) {
                                return (
                                  <PreviewThumb
                                    sxStyle={{
                                      width: 100,
                                      height: 100,
                                      borderRadius: 50,
                                      opacity: FCRAImgLoad ? 0.5 : 1,
                                      mb: 2,
                                    }}
                                    fileExt={fileExt}
                                    file={file || ""}
                                    onDeleteUploadFile={onDeleteFCRAFile}
                                    key={index + file.path}
                                  />
                                );
                              }
                            }}
                          />
                        </Box>
                      )}
                      {isEmpty(uploadedFCRAcerti) && FCRAErr && (
                        <ErrorTextStyle>
                          Please upload FCRA Certificate
                        </ErrorTextStyle>
                      )}
                    </Grid>
                  )}
                </Grid>
                <Box sx={{ mb: { xs: 3, xl: 4 } }}></Box>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <LoadingButton
                    size="small"
                    variant="outlined"
                    color="success"
                    type="submit"
                    disabled={
                      logoImgLoad ||
                      deedImgLoad ||
                      regImgLoad ||
                      twelveImgLoad ||
                      eighteenImgLoad ||
                      FCRAImgLoad
                    }
                    loading={btnLoad}
                    onClick={() => {
                      if (isEmpty(locationVal)) {
                        setCity(true);
                      } else {
                        setCity(false);
                      }
                      if (
                        isEmpty(ngoPhoneNum?.number) ||
                        !isValidPhoneNumber(ngoPhoneNum?.number || "")
                      ) {
                        setPhoneValid(true);
                      }
                      if (
                        isEmpty(ngoSecondaryNum?.number) ||
                        !isValidPhoneNumber(ngoSecondaryNum?.number || "")
                      ) {
                        setSecPhoneValid(true);
                      }
                      handleValid(values);
                    }}
                  >
                    {type === "edit" ? "Update" : "Create"}
                  </LoadingButton>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </DialogSlide>
  );
};

export default NGOCreateForm;
