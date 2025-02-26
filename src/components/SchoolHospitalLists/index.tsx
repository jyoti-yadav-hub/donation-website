import React, { useEffect, useState } from "react";
import DialogSlide from "components/DialogSlide";
import { Field, Form, Formik } from "formik";
import { isArray, isEmpty } from "lodash";
import * as yup from "yup";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import {
  Autocomplete,
  Box,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import getApiData from "../../shared/helpers/apiHelper";
import IntlMessages from "@crema/utility/IntlMessages";
import { DatePicker, LoadingButton } from "@mui/lab";
import { isValidPhoneNumber } from "libphonenumber-js/min";
import PhoneInput from "react-phone-input-2";
import { AppConfirmDialog } from "@crema";
import CGoogleAutoComplete from "components/CGoogleAutocomplete";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  style: {
    zIndex: 1000002,
    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
  },
};

const style = { width: `100%` };
const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
  fontSize: 12,
}));

interface BasicDetailsProps {
  openModal: any;
  handleClose: any;
  selectedItem: any;
  getHospitalList: any;
  from: any;
  list: any;
  setList: any;
  open?: any;
  setOpen: any;
  departmentList: any;
  setDepartmentList: any;
  isDraft?: boolean;
  value?: any;
  setValue?: any;
  addValid?: any;
  setAddValid?: any;
  locationLatLng?: any;
  setLocationLatLng?: any;
}

const URL =
  // eslint-disable-next-line no-useless-escape
  /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

const emailRegex =
  /[a-z0-9]+@[a-z]+\.(com|org|edu|mil|net|gov|co|in|io|ai|ca|dev|me|co.in|co.uk)\b$/;

const numberRegex: any = /^[0-9]/;

const SchoolHospitals: React.FC<BasicDetailsProps> = ({
  openModal,
  handleClose,
  selectedItem,
  getHospitalList,
  from,
  list,
  setList,
  open,
  setOpen,
  departmentList,
  setDepartmentList,
  isDraft,
  value,
  setValue,
  addValid,
  setAddValid,
  locationLatLng,
  setLocationLatLng,
}) => {
  const [btnLoad, setBtnLoad] = useState(false);
  const [courseDiseaseList, setCourseDiseaseList] = React.useState<any[]>([]);
  const [admissionPhone, setAdmissionPhone] = useState<any>({});
  const [financePhone, setFinancePhone] = useState<any>({});
  const [escalationPhone, setEscalationPhone] = useState<any>({});
  const [admisionValid, setAdmisionValid] = useState<any>(false);
  const [financeValid, setFinanceValid] = useState<any>(false);
  const [escalationValid, setEscalationValid] = useState<any>(false);
  const [aCountryCode, setACountryCode] = React.useState("");
  const [fCountryCode, setFCountryCode] = React.useState("");
  const [eCountryCode, setECountryCode] = React.useState("");
  const [modalClose, setModalClose] = useState<any>(false);
  const [isError, setisError] = React.useState<any>({ departments: false });

  const departmentArr = [
    "OPD",
    "Surgical",
    "Inpatient",
    "Nursing",
    "Physical medicine",
  ];

  let validationSchema: any;

  if (from === "education") {
    validationSchema = yup.object({
      name: yup
        .string()
        .required("Name is required")
        .min(3, "Name should be 3 chars minimum.")
        .max(50, "Maximum 50 characters allowed"),
      admission_contact_name: yup
        .string()
        .required("Person name is required")
        .min(3, "Name should be 3 chars minimum.")
        .max(50, "Maximum 50 characters allowed"),
      admission_contact_email: yup
        .string()
        .required("Email is required")
        .min(5, "email should be 5 chars minimum.")
        .max(50, "Maximum 50 characters allowed")
        .matches(emailRegex, "Enter correct email"),
      finance_contact_name: yup
        .string()
        .required("Person name is required")
        .min(3, "Name should be 3 chars minimum.")
        .max(50, "Maximum 50 characters allowed"),
      finance_contact_email: yup
        .string()
        .required("Email is required")
        .min(5, "email should be 5 chars minimum.")
        .max(50, "Maximum 50 characters allowed")
        .matches(emailRegex, "Enter correct email"),
      escalation_contact_name: yup
        .string()
        .required("Person name is required")
        .min(3, "Name should be 3 chars minimum.")
        .max(50, "Maximum 50 characters allowed"),
      escalation_contact_email: yup
        .string()
        .required("Email is required")
        .min(5, "email should be 5 chars minimum.")
        .matches(emailRegex, "Enter correct email"),
      website: yup
        .string()
        .min(5, "website should be 5 chars minimum.")
        .max(100, "Maximum 100 characters allowed")
        .matches(URL, "Enter a valid url"),
      establishment_year: yup.string().required(`Please select establish year`),
      management: yup.string().required(`Please select management`),
      academic: yup.array().required(`Please select academic`),
      instruction_medium: yup
        .array()
        .required(`Please select instruction medium`),
      no_of_teachers: yup
        .number()
        .required(`Please enter no of teachers`)
        .test(
          "Is positive?",
          "Number must be greater than 0!",
          (value: any) => value > 0
        )
        .min(1, "Minimum 1 required")
        .max(1000, "Maximum 1000 allowed"),
      no_of_students: yup
        .number()
        .required(`Enter no of students`)
        .test(
          "Is positive?",
          "Number must be greater than 0!",
          (value: any) => value > 0
        )
        .min(1, "Minimum 1 required")
        .max(10000, "Maximum 10000 allowed"),
      board: yup.string().required(`Please select board`),
      school_college_type: yup
        .string()
        .required(`Please select school/college type`),
    });
  } else {
    validationSchema = yup.object({
      name: yup
        .string()
        .required("Name is required")
        .min(3, "Name should be 3 chars minimum.")
        .max(50, "Maximum 50 characters allowed"),
      finance_contact_name: yup
        .string()
        .required("Person name is required")
        .min(3, "Name should be 3 chars minimum.")
        .max(50, "Maximum 50 characters allowed"),
      finance_contact_email: yup
        .string()
        .required("Email is required")
        .min(5, "email should be 5 chars minimum.")
        .max(50, "Maximum 50 characters allowed")
        .matches(emailRegex, "Enter correct email"),
      escalation_contact_name: yup
        .string()
        .required("Person name is required")
        .min(3, "Name should be 3 chars minimum.")
        .max(50, "Maximum 50 characters allowed"),
      escalation_contact_email: yup
        .string()
        .required("Email is required")
        .min(5, "email should be 5 chars minimum.")
        .max(50, "Maximum 50 characters allowed")
        .matches(emailRegex, "Enter correct email"),
      website: yup
        .string()
        .min(5, "website should be 5 chars minimum.")
        .max(100, "Maximum 100 characters allowed")
        .matches(URL, "Enter a valid url"),
      establishment_year: yup.string().required(`Please select establish year`),
      hospital_area: yup.string().required(`Please select hospital area`),
      types_of_hospital: yup.string().required(`Please select hospital`),
      areas_served: yup.array().required(`Please select areas that served`),
      no_of_beds: yup
        .number()
        .required(`Enter no of beds`)
        .test(
          "Is positive?",
          "Number must be greater than 0!",
          (value: any) => value > 0
        )
        .min(1, "Minimum 1 required")
        .max(500, "Maximum 500 allowed"),
    });
  }

  //API For create/update hospital
  async function submitData(data: any, btnType?: any) {
    if (isEmpty(value) && btnType !== "draft") {
      setAddValid(true);
    } else {
      setAddValid(false);
      let fData = {};
      if (from === "education") {
        fData = {
          ...data,
          admission_contact_country_code: aCountryCode,
          escalation_contact_country_code: eCountryCode,
          finance_contact_country_code: fCountryCode,
          courses_or_diseases: list,
          admission_contact_number: admissionPhone?.number,
          finance_contact_number: financePhone?.number,
          escalation_contact_number: escalationPhone?.number,
          // draft_id: selectedItem?.id || null,
          type: "School",
          unverified_id: selectedItem?.row?._id,
          location: {
            city: value?.description || value,
            coordinates: [locationLatLng.lng || 0, locationLatLng.lat || 0],
          },
          latitude: locationLatLng.lat || 0,
          longitude: locationLatLng.lng || 0,
        };
      } else {
        fData = {
          ...data,
          escalation_contact_country_code: eCountryCode,
          finance_contact_country_code: fCountryCode,
          departments: departmentList,
          courses_or_diseases: list,
          finance_contact_number: financePhone?.number,
          escalation_contact_number: escalationPhone?.number,
          // draft_id: selectedItem?.id || null,
          type: "Hospital",
          unverified_id: selectedItem?.row?._id,
          location: {
            city: value?.description || value,
            coordinates: [locationLatLng.lng || 0, locationLatLng.lat || 0],
          },
          latitude: locationLatLng.lat || 0,
          longitude: locationLatLng.lng || 0,
        };
      }
      setBtnLoad(true);
      let url = "";
      if (from === "education") {
        if (btnType === "draft") {
          url = `hospital-school/save-draft`;
        } else {
          url = `hospital-school/create-school`;
        }
      } else {
        if (btnType === "draft") {
          url = `hospital-school/save-draft`;
        } else {
          url = "hospital-school/create-hospital";
        }
      }

      try {
        const resp = await getApiData(url, fData, "POST");
        if (resp.success) {
          toast.success(resp.message);
          handleClose();
          setAddValid(false);
          setLocationLatLng({ lat: 0, lng: 0 });
          setValue(null);
          getHospitalList();
          setBtnLoad(false);
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

  //API for get disease/course lists
  async function onGetLists() {
    let category = "";
    if (from === "education") {
      category = "education";
    } else {
      category = "health";
    }
    try {
      const resp = await getApiData(
        `course-disease/admin-list?category=${category}`,
        {},
        "GET"
      );
      if (resp.success) {
        setCourseDiseaseList(isArray(resp.data) ? resp.data : []);
      } else {
        setCourseDiseaseList([]);
        toast.error(resp.message);
      }
    } catch (error) {
      console.log("error====", error);
      setCourseDiseaseList([]);
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (openModal) {
      onGetLists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

  return (
    <DialogSlide
      open={openModal}
      onDeny={() => {
        if (modalClose) {
          setOpen("close");
        } else {
          handleClose();
          setAddValid(false);
          setLocationLatLng({ lat: 0, lng: 0 });
          setValue(null);
        }
      }}
      onClose={() => {
        if (modalClose) {
          setOpen("close");
        } else {
          handleClose();
          setAddValid(false);
          setLocationLatLng({ lat: 0, lng: 0 });
          setValue(null);
        }
      }}
      dialogTitle={from === "education" ? "Add School" : "Add Hospital"}
      dialogContentStyle={{
        "& .MuiDialog-paper": { maxWidth: "calc(100vh + 300px)" },
      }}
    >
      <Box sx={style}>
        {from === "education" ? (
          <Formik
            validateOnChange={true}
            initialValues={{
              name: selectedItem?.row?.saayam_supported_name || "",
              admission_contact_name:
                selectedItem?.row?.admission_contact_name || "",
              admission_contact_email:
                selectedItem?.row?.admission_contact_email || "",
              finance_contact_name:
                selectedItem?.row?.finance_contact_name || "",
              finance_contact_email:
                selectedItem?.row?.finance_contact_email || "",
              escalation_contact_name:
                selectedItem?.row?.escalation_contact_name || "",
              escalation_contact_email:
                selectedItem?.row?.escalation_contact_email || "",
              website: selectedItem?.row?.website || "",
              establishment_year:
                selectedItem?.row?.establishment_year?.toString() || "",
              management: selectedItem?.row?.management || "",
              academic: !isEmpty(selectedItem?.row?.academic)
                ? selectedItem?.row?.academic
                : [] || "",
              instruction_medium: !isEmpty(
                selectedItem?.row?.instruction_medium
              )
                ? selectedItem?.row?.instruction_medium
                : [] || "",
              no_of_teachers: selectedItem?.row?.no_of_teachers || 0,
              no_of_students: selectedItem?.row?.no_of_students || 0,
              board: selectedItem?.row?.board || "",
              school_college_type: selectedItem?.row?.school_college_type || "",
            }}
            validate={(values) => {
              let errors: any = {};
              if (numberRegex.test(values?.admission_contact_email)) {
                errors.admission_contact_email = "Email is invalid";
              }
              if (numberRegex.test(values?.finance_contact_email)) {
                errors.finance_contact_email = "Email is invalid";
              }
              if (numberRegex.test(values?.escalation_contact_email)) {
                errors.escalation_contact_email = "Email is invalid";
              }
              return errors;
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
              if (
                !isEmpty(values?.name) ||
                !isEmpty(value) ||
                !isEmpty(values?.finance_contact_name) ||
                !isEmpty(financePhone?.number) ||
                !isEmpty(values?.finance_contact_email) ||
                !isEmpty(values?.escalation_contact_name) ||
                !isEmpty(escalationPhone?.number) ||
                !isEmpty(values?.escalation_contact_email) ||
                !isEmpty(values?.website) ||
                !isEmpty(values?.establishment_year) ||
                !isEmpty(values?.management) ||
                !isEmpty(values?.school_college_type) ||
                !isEmpty(values?.no_of_teachers) ||
                !isEmpty(values?.board) ||
                !isEmpty(values?.academic) ||
                !isEmpty(values?.instruction_medium) ||
                !isEmpty(values?.no_of_students)
              ) {
                setModalClose(true);
              } else {
                setModalClose(false);
              }
              return (
                <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                  <Grid container spacing={3} sx={{ m: 0 }}>
                    {/* ======= name ======= */}
                    <Grid item xs={4}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Enter School/College Name"
                        name="name"
                        label={"Enter School/College Name"}
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.name}
                        onChange={(event: any) => handleChange(event)}
                      />
                      {errors.name && touched.name && (
                        <ErrorTextStyle>{errors.name}</ErrorTextStyle>
                      )}
                    </Grid>
                    {/* ======= location ======= */}
                    <Grid item xs={8}>
                      <CGoogleAutoComplete
                        value={value}
                        setValue={setValue}
                        setAddValid={setAddValid}
                      />
                      {addValid ? (
                        <ErrorTextStyle>Please select Address</ErrorTextStyle>
                      ) : null}
                    </Grid>

                    {/* Contact(Admission) */}
                    <>
                      <Grid item xs={12} sx={{ mr: 2, mt: 3 }}>
                        <Divider sx={{ width: "100%" }}>
                          Contact(Admissions)
                        </Divider>
                      </Grid>
                      {/* ======= admission_contact_name ======= */}
                      <Grid item xs={4}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Enter contact person name"
                          name="admission_contact_name"
                          label="Enter contact person name"
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.admission_contact_name}
                          onChange={(event: any) => handleChange(event)}
                        />
                        {errors.admission_contact_name &&
                          touched.admission_contact_name && (
                            <ErrorTextStyle>
                              {errors.admission_contact_name}
                            </ErrorTextStyle>
                          )}
                      </Grid>
                      {/* ======= admission_contact_number ======= */}
                      <Grid item xs={4}>
                        <PhoneInput
                          autoFormat={false}
                          placeholder="Admission Contact Number"
                          countryCodeEditable={false}
                          enableSearch={true}
                          disableSearchIcon={true}
                          value={admissionPhone?.number || ""}
                          onChange={(v: any, data: any, event: any) => {
                            if (isValidPhoneNumber(event.target.value || "")) {
                              setAdmisionValid(false);
                            } else {
                              setAdmisionValid(true);
                            }
                            setACountryCode(data?.countryCode);
                            setAdmissionPhone({ number: event.target.value });
                          }}
                          inputStyle={{ width: "100%", height: "37px" }}
                          searchStyle={{ width: "90%" }}
                        />
                        {admisionValid ? (
                          <ErrorTextStyle>
                            Enter valid phone number
                          </ErrorTextStyle>
                        ) : null}
                      </Grid>
                      {/* ======= admission_contact_email ======= */}
                      <Grid item xs={4}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Enter email"
                          name="admission_contact_email"
                          label={<IntlMessages id="Enter email" />}
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.admission_contact_email}
                          onChange={handleChange}
                        />
                        {errors.admission_contact_email &&
                          touched.admission_contact_email && (
                            <ErrorTextStyle>
                              {errors.admission_contact_email}
                            </ErrorTextStyle>
                          )}
                      </Grid>
                    </>
                    {/* Contact(Finance) */}
                    <>
                      <Grid item xs={12} sx={{ mr: 2, mt: 3 }}>
                        <Divider sx={{ width: "100%" }}>
                          Contact(Finance)
                        </Divider>
                      </Grid>
                      {/* ======= finance_contact_name ======= */}
                      <Grid item xs={4}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Enter finance person name"
                          name="finance_contact_name"
                          label="Enter finance person name"
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.finance_contact_name}
                          onChange={(event: any) => handleChange(event)}
                        />
                        {errors.finance_contact_name &&
                          touched.finance_contact_name && (
                            <ErrorTextStyle>
                              {errors.finance_contact_name}
                            </ErrorTextStyle>
                          )}
                      </Grid>
                      {/* ======= finance_contact_number ======= */}
                      <Grid item xs={4}>
                        <PhoneInput
                          autoFormat={false}
                          placeholder="Finance Contact Number"
                          countryCodeEditable={false}
                          enableSearch={true}
                          disableSearchIcon={true}
                          value={financePhone?.number || ""}
                          onChange={(v: any, data: any, event: any) => {
                            if (isValidPhoneNumber(event.target.value || "")) {
                              setFinanceValid(false);
                            } else {
                              setFinanceValid(true);
                            }
                            setFCountryCode(data?.countryCode);
                            setFinancePhone({ number: event.target.value });
                          }}
                          inputStyle={{ width: "100%", height: "37px" }}
                          searchStyle={{ width: "90%" }}
                        />
                        {financeValid ? (
                          <ErrorTextStyle>
                            Enter valid phone number
                          </ErrorTextStyle>
                        ) : null}
                      </Grid>
                      {/* ======= finance_contact_email ======= */}
                      <Grid item xs={4}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Enter email"
                          name="finance_contact_email"
                          label={<IntlMessages id="Enter email" />}
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.finance_contact_email}
                          onChange={handleChange}
                        />
                        {errors.finance_contact_email &&
                          touched.finance_contact_email && (
                            <ErrorTextStyle>
                              {errors.finance_contact_email}
                            </ErrorTextStyle>
                          )}
                      </Grid>
                    </>

                    {/* Contact(Escalation) */}
                    <>
                      <Grid item xs={12} sx={{ mr: 2, mt: 3 }}>
                        <Divider sx={{ width: "100%" }}>
                          Contact(Escalation)
                        </Divider>
                      </Grid>
                      {/* ======= escalation_contact_name ======= */}
                      <Grid item xs={4}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Enter escalation person name"
                          name="escalation_contact_name"
                          label="Enter escalation person name"
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.escalation_contact_name}
                          onChange={(event: any) => handleChange(event)}
                        />
                        {errors.escalation_contact_name &&
                          touched.escalation_contact_name && (
                            <ErrorTextStyle>
                              {errors.escalation_contact_name}
                            </ErrorTextStyle>
                          )}
                      </Grid>
                      {/* ======= escalation_contact_number ======= */}
                      <Grid item xs={4}>
                        <PhoneInput
                          autoFormat={false}
                          placeholder="Escalation Contact Number"
                          countryCodeEditable={false}
                          enableSearch={true}
                          disableSearchIcon={true}
                          value={escalationPhone?.number || ""}
                          onChange={(v: any, data: any, event: any) => {
                            if (isValidPhoneNumber(event.target.value || "")) {
                              setEscalationValid(false);
                            } else {
                              setEscalationValid(true);
                            }
                            setECountryCode(data?.countryCode);
                            setEscalationPhone({ number: event.target.value });
                          }}
                          inputStyle={{ width: "100%", height: "37px" }}
                          searchStyle={{ width: "90%" }}
                        />
                        {escalationValid ? (
                          <ErrorTextStyle>
                            Enter valid phone number
                          </ErrorTextStyle>
                        ) : null}
                      </Grid>
                      {/* ======= escalation_contact_email ======= */}
                      <Grid item xs={4}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Enter email"
                          name="escalation_contact_email"
                          label={<IntlMessages id="Enter email" />}
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.escalation_contact_email}
                          onChange={handleChange}
                        />
                        {errors.escalation_contact_email &&
                          touched.escalation_contact_email && (
                            <ErrorTextStyle>
                              {errors.escalation_contact_email}
                            </ErrorTextStyle>
                          )}
                      </Grid>
                    </>

                    <Grid item xs={12} sx={{ mr: 2, mt: 3 }}>
                      <Divider sx={{ width: "100%" }}>
                        Other Information
                      </Divider>
                    </Grid>
                    {/* website */}
                    <Grid item xs={4}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Enter website"
                        name="website"
                        label={<IntlMessages id="Enter website" />}
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.website}
                        onChange={(event: any) => handleChange(event)}
                      />
                      {errors.website && touched.website && (
                        <ErrorTextStyle>{errors.website}</ErrorTextStyle>
                      )}
                    </Grid>
                    {/* establishment_year */}
                    <Grid item xs={4}>
                      <Field
                        component={DatePicker}
                        disableFuture
                        sx={{ width: "100%" }}
                        openTo="year"
                        views={["year"]}
                        autoOk
                        variant="outlined"
                        inputVariant="outlined"
                        label={<IntlMessages id="Year Established" />}
                        name="establishment_year"
                        value={values.establishment_year}
                        onChange={(value: any) =>
                          setFieldValue("establishment_year", value)
                        }
                        renderInput={(params: any) => (
                          <TextField
                            size="small"
                            {...params}
                            fullWidth
                            error={false}
                          />
                        )}
                      />
                      {errors.establishment_year &&
                        touched.establishment_year && (
                          <ErrorTextStyle>
                            {errors.establishment_year}
                          </ErrorTextStyle>
                        )}
                    </Grid>
                    {/* ======= management ======= */}
                    <Grid item xs={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-select-small">
                          Select management
                        </InputLabel>
                        <Select
                          MenuProps={{
                            style: {
                              zIndex: 1000002,
                              maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
                            },
                          }}
                          size="small"
                          name="management"
                          fullWidth
                          labelId="create-request"
                          label="Select management"
                          value={values.management}
                          onChange={(event: any) => handleChange(event)}
                          onBlur={handleBlur}
                        >
                          <MenuItem value="" key="none">
                            None
                          </MenuItem>
                          <MenuItem value="Government" key="government">
                            Government
                          </MenuItem>
                          <MenuItem value="Private" key="private">
                            Private
                          </MenuItem>
                        </Select>
                      </FormControl>
                      {errors.management && touched.management && (
                        <ErrorTextStyle>{errors.management}</ErrorTextStyle>
                      )}
                    </Grid>
                    {/* ======= school_college_type ======= */}
                    <Grid item xs={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-select-small">
                          Type of school/college
                        </InputLabel>
                        <Select
                          MenuProps={{
                            style: {
                              zIndex: 1000002,
                              maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
                            },
                          }}
                          size="small"
                          name="school_college_type"
                          fullWidth
                          labelId="create-request"
                          label="Type of school/college"
                          value={values.school_college_type}
                          onChange={(event: any) => handleChange(event)}
                          onBlur={handleBlur}
                        >
                          <MenuItem value="" key="none">
                            None
                          </MenuItem>
                          <MenuItem value="Government school" key="government">
                            Government school
                          </MenuItem>
                          <MenuItem
                            value="Government aided Private school"
                            key="government_aid_private"
                          >
                            Government aided Private school
                          </MenuItem>
                          <MenuItem value="Private school" key="private">
                            Private school
                          </MenuItem>
                          <MenuItem
                            value="International school"
                            key="international"
                          >
                            International school
                          </MenuItem>
                          <MenuItem
                            value=" Home-Schooling"
                            key="home_schooling"
                          >
                            Home-Schooling
                          </MenuItem>
                        </Select>
                      </FormControl>
                      {errors.school_college_type &&
                        touched.school_college_type && (
                          <ErrorTextStyle>
                            {errors.school_college_type}
                          </ErrorTextStyle>
                        )}
                    </Grid>

                    {/* ======= no_of_teachers ======= */}
                    <Grid item xs={2}>
                      <TextField
                        size="small"
                        fullWidth
                        type="number"
                        onWheel={(e: any) => e.target.blur()}
                        placeholder={`Enter no of teachers`}
                        name="no_of_teachers"
                        label={`Enter no of teachers`}
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.no_of_teachers}
                        onChange={(event) => {
                          if (event.target.value.indexOf(".") !== -1) {
                            setFieldError(
                              "no_of_teachers",
                              "Decimal value not allowed"
                            );
                          } else {
                            handleChange(event);
                          }
                        }}
                      />
                      {errors.no_of_teachers && touched.no_of_teachers && (
                        <ErrorTextStyle>{errors.no_of_teachers}</ErrorTextStyle>
                      )}
                    </Grid>
                    {/* ======= no_of_students ======= */}
                    <Grid item xs={2}>
                      <TextField
                        size="small"
                        fullWidth
                        type="number"
                        onWheel={(e: any) => e.target.blur()}
                        placeholder="Enter no of students"
                        name="no_of_students"
                        label={<IntlMessages id="Enter no of students" />}
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.no_of_students}
                        onChange={(event) => {
                          if (event.target.value.indexOf(".") !== -1) {
                            setFieldError(
                              "no_of_students",
                              "Decimal value not allowed"
                            );
                          } else {
                            handleChange(event);
                          }
                        }}
                      />
                      {errors.no_of_students && touched.no_of_students && (
                        <ErrorTextStyle>{errors.no_of_students}</ErrorTextStyle>
                      )}
                    </Grid>
                    {/* board */}
                    <Grid item xs={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-select-small">
                          Select board
                        </InputLabel>
                        <Select
                          MenuProps={{
                            style: {
                              zIndex: 1000002,
                              maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
                            },
                          }}
                          size="small"
                          name="board"
                          fullWidth
                          labelId="create-request"
                          label="Select board"
                          value={values?.board}
                          onChange={(event: any) => handleChange(event)}
                          onBlur={handleBlur}
                        >
                          <MenuItem value="" key="none">
                            None
                          </MenuItem>
                          <MenuItem value="CBSE" key="cbse">
                            Central Board of Secondary Education (CBSE)
                          </MenuItem>
                          <MenuItem value="CISCE" key="cisce">
                            Council for the Indian School Certificate
                            Examinations (CISCE)
                          </MenuItem>
                          <MenuItem value="NIOS" key="nios">
                            National Institute of Open Schooling (NIOS)
                          </MenuItem>
                          <MenuItem value="IB" key="ib">
                            International Baccalaureate (IB)
                          </MenuItem>
                          <MenuItem value="CIE" key="cie">
                            Cambridge International Education (CIE)
                          </MenuItem>
                        </Select>
                      </FormControl>
                      {errors.board && touched.board && (
                        <ErrorTextStyle>{errors.board}</ErrorTextStyle>
                      )}
                    </Grid>
                    {/* ======= academic ======= */}
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-select-small">
                          Select academic
                        </InputLabel>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          multiple
                          value={
                            isArray(values.academic)
                              ? values?.academic
                              : [values?.academic] || []
                          }
                          onChange={(event: any) => {
                            if (event.target.value.includes("none")) {
                              setFieldValue("academic", []);
                            } else {
                              handleChange(event);
                            }
                          }}
                          onBlur={handleBlur}
                          input={
                            <OutlinedInput
                              id="select-multiple-chip"
                              label="Select academic"
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
                          name="academic"
                          fullWidth
                        >
                          <MenuItem value="none" key="none">
                            None
                          </MenuItem>
                          <MenuItem
                            value="Pre Primary (Pre-Nursery, Nursery, KG, LKG, UKG)"
                            key="preprimary"
                          >
                            Pre Primary (Pre-Nursery, Nursery, KG, LKG, UKG)
                          </MenuItem>
                          <MenuItem value="Secondary" key="secondary">
                            Secondary
                          </MenuItem>
                          <MenuItem
                            value="Higher Secondary"
                            key="higher_secondary"
                          >
                            Higher Secondary
                          </MenuItem>
                        </Select>
                      </FormControl>
                      {errors.academic && touched.academic && (
                        <ErrorTextStyle>{errors.academic}</ErrorTextStyle>
                      )}
                    </Grid>
                    {/* ======= instruction_medium ======= */}
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-select-small">
                          Select instruction medium
                        </InputLabel>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          multiple
                          value={
                            isArray(values.instruction_medium)
                              ? values?.instruction_medium
                              : [values?.instruction_medium] || []
                          }
                          onChange={(event: any) => {
                            if (event.target.value.includes("none")) {
                              setFieldValue("instruction_medium", []);
                            } else {
                              handleChange(event);
                            }
                          }}
                          onBlur={handleBlur}
                          input={
                            <OutlinedInput
                              id="select-multiple-chip"
                              label="Select instruction medium"
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
                          name="instruction_medium"
                          fullWidth
                        >
                          <MenuItem value="none" key="none">
                            None
                          </MenuItem>
                          <MenuItem value="English" key="english">
                            English
                          </MenuItem>
                          <MenuItem value="Hindi" key="hindi">
                            Hindi
                          </MenuItem>
                          <MenuItem value="Gujarati" key="gujarati">
                            Gujarati
                          </MenuItem>
                          <MenuItem value="Marathi" key="marathi">
                            Marathi
                          </MenuItem>
                        </Select>
                      </FormControl>
                      {errors.instruction_medium &&
                        touched.instruction_medium && (
                          <ErrorTextStyle>
                            {errors.instruction_medium}
                          </ErrorTextStyle>
                        )}
                    </Grid>

                    <Grid item xs={12} sx={{ mr: 2, mt: 3 }}>
                      <Divider sx={{ width: "100%" }} />
                    </Grid>
                    {/* courses_or_diseases */}
                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={courseDiseaseList}
                        getOptionLabel={(option) => option}
                        filterSelectedOptions
                        value={list}
                        onChange={(event: any, value: any) => setList(value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select course"
                            placeholder="Select course"
                          />
                        )}
                        size="small"
                        className="auto_complete"
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sx={{
                        mr: 2,
                        mt: 3,
                        justifyContent: "flex-end",
                        display: "flex",
                      }}
                    >
                      <LoadingButton
                        size="small"
                        variant="outlined"
                        color="success"
                        type="submit"
                        disabled={btnLoad}
                        loading={btnLoad}
                        onClick={() => {
                          if (
                            isEmpty(admissionPhone?.number) ||
                            !isValidPhoneNumber(admissionPhone?.number || "")
                          ) {
                            setAdmisionValid(true);
                          }
                          if (
                            isEmpty(financePhone?.number) ||
                            !isValidPhoneNumber(financePhone?.number || "")
                          ) {
                            setFinanceValid(true);
                          }
                          if (
                            isEmpty(escalationPhone?.number) ||
                            !isValidPhoneNumber(escalationPhone?.number || "")
                          ) {
                            setEscalationValid(true);
                          }
                          if (isEmpty(value)) {
                            setAddValid(true);
                          } else {
                            setAddValid(false);
                          }
                        }}
                      >
                        Add
                      </LoadingButton>
                    </Grid>
                  </Grid>
                  <AppConfirmDialog
                    open={open === "close" ? true : false}
                    disabled={btnLoad}
                    loading={btnLoad}
                    from="draft"
                    onClose={() => {
                      setOpen("");
                      setModalClose(false);
                      handleClose();
                      setAddValid(false);
                      setLocationLatLng({ lat: 0, lng: 0 });
                      setValue(null);
                    }}
                    onDeny={() => {
                      setOpen("");
                      setModalClose(false);
                    }}
                    onConfirm={() => submitData(values, "draft")}
                    type={"submit"}
                    Ytitle={"Save as Draft"}
                    Ntitle={"Discard"}
                    title={"Are you sure you want to leave?"}
                    dialogTitle={"Close Dialog"}
                  />
                </Form>
              );
            }}
          </Formik>
        ) : (
          <Formik
            validateOnChange={true}
            initialValues={{
              name: selectedItem?.row?.saayam_supported_name || "",
              finance_contact_name:
                selectedItem?.row?.finance_contact_name || "",
              finance_contact_email:
                selectedItem?.row?.finance_contact_email || "",
              escalation_contact_name:
                selectedItem?.row?.escalation_contact_name || "",
              escalation_contact_email:
                selectedItem?.row?.escalation_contact_email || "",
              website: selectedItem?.row?.website || "",
              hospital_area: selectedItem?.row?.hospital_area || "",
              types_of_hospital: selectedItem?.row?.types_of_hospital || "",
              establishment_year:
                selectedItem?.row?.establishment_year?.toString() || "",
              areas_served: !isEmpty(selectedItem?.row?.areas_served)
                ? selectedItem?.row?.areas_served
                : [] || [],
              no_of_beds: selectedItem?.row?.no_of_beds || 0,
              emergency_department:
                selectedItem?.row?.emergency_department === true
                  ? "true"
                  : selectedItem?.row?.emergency_department === false
                  ? "false"
                  : "",
            }}
            validate={(values) => {
              let errors: any = {};
              if (numberRegex.test(values.finance_contact_email)) {
                errors.finance_contact_email = "Email is invalid";
              }
              if (numberRegex.test(values.escalation_contact_email)) {
                errors.escalation_contact_email = "Email is invalid";
              }
              return errors;
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
              if (
                !isEmpty(values?.name) ||
                !isEmpty(value) ||
                !isEmpty(values?.finance_contact_name) ||
                !isEmpty(financePhone?.number) ||
                !isEmpty(values?.finance_contact_email) ||
                !isEmpty(values?.escalation_contact_name) ||
                !isEmpty(escalationPhone?.number) ||
                !isEmpty(values?.escalation_contact_email) ||
                !isEmpty(values?.website) ||
                !isEmpty(values?.establishment_year) ||
                !isEmpty(values?.hospital_area) ||
                !isEmpty(values?.types_of_hospital) ||
                !isEmpty(values?.no_of_beds) ||
                !isEmpty(values?.areas_served)
              ) {
                setModalClose(true);
              } else {
                setModalClose(false);
              }
              return (
                <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                  <Grid container spacing={3} sx={{ m: 0 }}>
                    {/* ======= name ======= */}
                    <Grid item xs={4}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Enter Name"
                        name="name"
                        label={<IntlMessages id="Enter Name" />}
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.name}
                        onChange={(event: any) => handleChange(event)}
                      />
                      {errors.name && touched.name && (
                        <ErrorTextStyle>{errors.name}</ErrorTextStyle>
                      )}
                    </Grid>
                    {/* ======= location ======= */}
                    <Grid item xs={8}>
                      <CGoogleAutoComplete
                        value={value}
                        setValue={setValue}
                        setAddValid={setAddValid}
                      />
                      {addValid ? (
                        <ErrorTextStyle>Please select Address</ErrorTextStyle>
                      ) : null}
                    </Grid>
                    {/* Contact(Finance) */}
                    <>
                      <Grid item xs={12} sx={{ mr: 2, mt: 3 }}>
                        <Divider sx={{ width: "100%" }}>
                          Contact(Finance)
                        </Divider>
                      </Grid>
                      {/* ======= finance_contact_name ======= */}
                      <Grid item xs={4}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Enter finance person name"
                          name="finance_contact_name"
                          label="Enter finance person name"
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.finance_contact_name}
                          onChange={(event: any) => handleChange(event)}
                        />
                        {errors.finance_contact_name &&
                          touched.finance_contact_name && (
                            <ErrorTextStyle>
                              {errors.finance_contact_name}
                            </ErrorTextStyle>
                          )}
                      </Grid>
                      {/* ======= finance_contact_number ======= */}
                      <Grid item xs={4}>
                        <PhoneInput
                          autoFormat={false}
                          placeholder="Finance Contact Number"
                          countryCodeEditable={false}
                          enableSearch={true}
                          disableSearchIcon={true}
                          value={financePhone?.number || ""}
                          onChange={(v: any, data: any, event: any) => {
                            if (isValidPhoneNumber(event.target.value || "")) {
                              setFinanceValid(false);
                            } else {
                              setFinanceValid(true);
                            }
                            setFCountryCode(data?.countryCode);
                            setFinancePhone({ number: event.target.value });
                          }}
                          inputStyle={{ width: "100%", height: "37px" }}
                          searchStyle={{ width: "90%" }}
                        />
                        {financeValid ? (
                          <ErrorTextStyle>
                            Enter valid phone number
                          </ErrorTextStyle>
                        ) : null}
                      </Grid>
                      {/* ======= finance_contact_email ======= */}
                      <Grid item xs={4}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Enter email"
                          name="finance_contact_email"
                          label={<IntlMessages id="Enter email" />}
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.finance_contact_email}
                          onChange={handleChange}
                        />
                        {errors.finance_contact_email &&
                          touched.finance_contact_email && (
                            <ErrorTextStyle>
                              {errors.finance_contact_email}
                            </ErrorTextStyle>
                          )}
                      </Grid>
                    </>

                    {/* Contact(Escalation) */}
                    <>
                      <Grid item xs={12} sx={{ mr: 2, mt: 3 }}>
                        <Divider sx={{ width: "100%" }}>
                          Contact(Escalation)
                        </Divider>
                      </Grid>
                      {/* ======= escalation_contact_name ======= */}
                      <Grid item xs={4}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Enter escalation person name"
                          name="escalation_contact_name"
                          label="Enter escalation person name"
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.escalation_contact_name}
                          onChange={(event: any) => handleChange(event)}
                        />
                        {errors.escalation_contact_name &&
                          touched.escalation_contact_name && (
                            <ErrorTextStyle>
                              {errors.escalation_contact_name}
                            </ErrorTextStyle>
                          )}
                      </Grid>
                      {/* ======= escalation_contact_number ======= */}
                      <Grid item xs={4}>
                        <PhoneInput
                          autoFormat={false}
                          placeholder="Escalation Contact Number"
                          countryCodeEditable={false}
                          enableSearch={true}
                          disableSearchIcon={true}
                          value={escalationPhone?.number || ""}
                          onChange={(v: any, data: any, event: any) => {
                            if (isValidPhoneNumber(event.target.value || "")) {
                              setEscalationValid(false);
                            } else {
                              setEscalationValid(true);
                            }
                            setECountryCode(data?.countryCode);
                            setEscalationPhone({ number: event.target.value });
                          }}
                          inputStyle={{ width: "100%", height: "37px" }}
                          searchStyle={{ width: "90%" }}
                        />
                        {escalationValid ? (
                          <ErrorTextStyle>
                            Enter valid phone number
                          </ErrorTextStyle>
                        ) : null}
                      </Grid>
                      {/* ======= escalation_contact_email ======= */}
                      <Grid item xs={4}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Enter email"
                          name="escalation_contact_email"
                          label={<IntlMessages id="Enter email" />}
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.escalation_contact_email}
                          onChange={handleChange}
                        />
                        {errors.escalation_contact_email &&
                          touched.escalation_contact_email && (
                            <ErrorTextStyle>
                              {errors.escalation_contact_email}
                            </ErrorTextStyle>
                          )}
                      </Grid>
                    </>

                    <Grid item xs={12} sx={{ mr: 2, mt: 3 }}>
                      <Divider sx={{ width: "100%" }}>
                        Other Information
                      </Divider>
                    </Grid>
                    {/* website */}
                    <Grid item xs={4}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Enter website"
                        name="website"
                        label={<IntlMessages id="Enter website" />}
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.website}
                        onChange={(event: any) => handleChange(event)}
                      />
                      {errors.website && touched.website && (
                        <ErrorTextStyle>{errors.website}</ErrorTextStyle>
                      )}
                    </Grid>
                    {/* establishment_year */}
                    <Grid item xs={4}>
                      <Field
                        component={DatePicker}
                        disableFuture
                        sx={{ width: "100%" }}
                        openTo="year"
                        views={["year"]}
                        autoOk
                        variant="outlined"
                        inputVariant="outlined"
                        label={<IntlMessages id="Year Established" />}
                        name="establishment_year"
                        value={values.establishment_year}
                        onChange={(value: any) =>
                          setFieldValue("establishment_year", value)
                        }
                        renderInput={(params: any) => (
                          <TextField
                            size="small"
                            {...params}
                            fullWidth
                            error={false}
                          />
                        )}
                      />
                      {errors.establishment_year &&
                        touched.establishment_year && (
                          <ErrorTextStyle>
                            {errors.establishment_year}
                          </ErrorTextStyle>
                        )}
                    </Grid>
                    {/* ======= hospital_area ======= */}
                    <Grid item xs={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-select-small">
                          {"Select hospital area"}
                        </InputLabel>
                        <Select
                          MenuProps={{
                            style: {
                              zIndex: 1000002,
                              maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
                            },
                          }}
                          size="small"
                          name={"hospital_area"}
                          fullWidth
                          labelId="create-request"
                          label={"Select hospital area"}
                          value={values.hospital_area}
                          onChange={(event: any) => handleChange(event)}
                          onBlur={handleBlur}
                        >
                          <MenuItem value="" key="none">
                            None
                          </MenuItem>
                          <MenuItem value="Urban" key="urban">
                            Urban
                          </MenuItem>
                          <MenuItem value="Rural" key="rural">
                            Rural
                          </MenuItem>
                        </Select>
                      </FormControl>
                      {errors.hospital_area && touched.hospital_area && (
                        <ErrorTextStyle>{errors.hospital_area}</ErrorTextStyle>
                      )}
                    </Grid>
                    {/* ======= types_of_hospital ======= */}
                    <Grid item xs={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-select-small">
                          Type of hospital
                        </InputLabel>
                        <Select
                          MenuProps={{
                            style: {
                              zIndex: 1000002,
                              maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
                            },
                          }}
                          size="small"
                          name="types_of_hospital"
                          fullWidth
                          labelId="create-request"
                          label="Type of hospital"
                          value={values.types_of_hospital}
                          onChange={(event: any) => handleChange(event)}
                          onBlur={handleBlur}
                        >
                          <MenuItem value="" key="none">
                            None
                          </MenuItem>
                          <MenuItem
                            value="Government hospital"
                            key="government"
                          >
                            Government hospital
                          </MenuItem>
                          <MenuItem
                            value="Government aided Private hospital"
                            key="government_aid_private"
                          >
                            Government aided Private hospital
                          </MenuItem>
                          <MenuItem value="Private hospital" key="private">
                            Private hospital
                          </MenuItem>
                          <MenuItem
                            value="International hospital"
                            key="international"
                          >
                            International hospital
                          </MenuItem>
                        </Select>
                      </FormControl>
                      {errors.types_of_hospital &&
                        touched.types_of_hospital && (
                          <ErrorTextStyle>
                            {errors.types_of_hospital}
                          </ErrorTextStyle>
                        )}
                    </Grid>

                    {/* ======= no_of_beds ======= */}
                    <Grid item xs={2}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder={`Enter no of beds`}
                        name="no_of_beds"
                        type="number"
                        onWheel={(e: any) => e.target.blur()}
                        label={`Enter no of beds`}
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.no_of_beds}
                        onChange={(event) => {
                          if (isEmpty(event.target.value)) {
                            setFieldError("no_of_beds", "Required");
                            setFieldValue("no_of_beds", 0);
                          } else if (event.target.value.indexOf(".") !== -1) {
                            setFieldError(
                              "no_of_beds",
                              "Decimal value not allowed"
                            );
                          } else {
                            setFieldValue(
                              "no_of_beds",
                              event.target.value.replace(/^0+/, "")
                            );
                            // handleChange(event);
                          }
                        }}
                      />
                      {errors.no_of_beds && touched.no_of_beds && (
                        <ErrorTextStyle>{errors.no_of_beds}</ErrorTextStyle>
                      )}
                    </Grid>
                    {/* ======= emergency_department ======= */}
                    <Grid item xs={6}>
                      <FormControl
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "flex-end",
                        }}
                      >
                        <FormLabel sx={{ mr: 2.5 }}>
                          Emergency department available?
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="emergency_department"
                          value={values.emergency_department}
                          onChange={handleChange}
                        >
                          <FormControlLabel
                            value={"true"}
                            control={<Radio />}
                            label={`Yes`}
                          />
                          <FormControlLabel
                            value={"false"}
                            control={<Radio />}
                            label={`No`}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    {/* ======= departments ======= */}
                    <Grid item xs={6}>
                      <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={departmentArr}
                        getOptionLabel={(option) => option}
                        filterSelectedOptions
                        value={departmentList}
                        onChange={(event: any, value: any) => {
                          if (departmentList) {
                            setisError({ ...isError, departments: false });
                          } else {
                            setisError({ ...isError, departments: true });
                          }
                          setDepartmentList(value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Departments"
                            placeholder="Departments"
                          />
                        )}
                        size="small"
                        className="auto_complete"
                      />
                      {isError.departments && (
                        <ErrorTextStyle>
                          {"Please select department"}
                        </ErrorTextStyle>
                      )}
                    </Grid>
                    {/* ======= areas_served ======= */}
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-select-small">
                          Select areas served
                        </InputLabel>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          multiple
                          value={
                            isArray(values.areas_served)
                              ? values?.areas_served
                              : [values?.areas_served] || []
                          }
                          onChange={(event: any) => {
                            if (event.target.value.includes("none")) {
                              setFieldValue("areas_served", []);
                            } else {
                              handleChange(event);
                            }
                          }}
                          onBlur={handleBlur}
                          input={
                            <OutlinedInput
                              id="select-multiple-chip"
                              label="Select areas served"
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
                          name="areas_served"
                          fullWidth
                        >
                          <MenuItem value="none" key="none">
                            None
                          </MenuItem>
                          <MenuItem value="Gujarat" key="gujarat">
                            Gujarat
                          </MenuItem>
                          <MenuItem value="Mumbai" key="mumbai">
                            Mumbai
                          </MenuItem>
                          <MenuItem value="Kolkata" key="kolkata">
                            Kolkata
                          </MenuItem>
                        </Select>
                      </FormControl>
                      {errors.areas_served && touched.areas_served && (
                        <ErrorTextStyle>{errors.areas_served}</ErrorTextStyle>
                      )}
                    </Grid>

                    <Grid item xs={12} sx={{ mr: 2, mt: 3 }}>
                      <Divider sx={{ width: "100%" }} />
                    </Grid>
                    {/* courses_or_diseases */}
                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={courseDiseaseList}
                        getOptionLabel={(option) => option}
                        filterSelectedOptions
                        value={list}
                        onChange={(event: any, value: any) => setList(value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select disease"
                            placeholder="Select disease"
                          />
                        )}
                        size="small"
                        className="auto_complete"
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sx={{
                        mr: 2,
                        mt: 3,
                        justifyContent: "flex-end",
                        display: "flex",
                      }}
                    >
                      <LoadingButton
                        size="small"
                        variant="outlined"
                        color="success"
                        type="submit"
                        disabled={btnLoad}
                        loading={btnLoad}
                        onClick={() => {
                          if (isEmpty(departmentList)) {
                            setisError({ ...isError, departments: true });
                          } else {
                            setisError({ ...isError, departments: false });
                          }
                          if (isEmpty(value)) {
                            setAddValid(true);
                          } else {
                            setAddValid(false);
                          }
                          if (
                            isEmpty(financePhone?.number) ||
                            !isValidPhoneNumber(financePhone?.number || "")
                          ) {
                            setFinanceValid(true);
                          }
                          if (
                            isEmpty(escalationPhone?.number) ||
                            !isValidPhoneNumber(escalationPhone?.number || "")
                          ) {
                            setEscalationValid(true);
                          }
                        }}
                      >
                        Add
                      </LoadingButton>
                    </Grid>
                  </Grid>
                  <AppConfirmDialog
                    open={open === "close" ? true : false}
                    disabled={btnLoad}
                    loading={btnLoad}
                    from="draft"
                    onClose={() => {
                      setOpen("");
                      setModalClose(false);
                      handleClose();
                      setAddValid(false);
                      setLocationLatLng({ lat: 0, lng: 0 });
                      setValue(null);
                    }}
                    onDeny={() => {
                      setOpen("");
                      setModalClose(false);
                    }}
                    onConfirm={() => submitData(values, "draft")}
                    type={"submit"}
                    Ytitle={"Save as Draft"}
                    Ntitle={"Discard"}
                    title={"Are you sure you want to leave?"}
                    dialogTitle={"Close Dialog"}
                  />
                </Form>
              );
            }}
          </Formik>
        )}
      </Box>
    </DialogSlide>
  );
};

export default SchoolHospitals;
