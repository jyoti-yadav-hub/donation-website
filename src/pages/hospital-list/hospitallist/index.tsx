/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  Breadcrumbs,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { Form, Formik, Field } from "formik";
import * as yup from "yup";
import {
  GridActionsCellItem,
  GridColumns,
  GridSortModel,
  getGridBooleanOperators,
  getGridDateOperators,
  getGridStringOperators,
  getGridNumericColumnOperators,
} from "@mui/x-data-grid-pro";
import { styled } from "@mui/material/styles";
import IntlMessages from "@crema/utility/IntlMessages";
import { isArray, isEmpty } from "lodash";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { AppConfirmDialog } from "@crema";
import moment from "moment";
import { DatePicker, LoadingButton } from "@mui/lab";
import Autocomplete from "@mui/material/Autocomplete";
import { isValidPhoneNumber } from "libphonenumber-js/max";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";
import DialogSlide from "components/DialogSlide";
// import ReactGoogleAutocomplete from "react-google-autocomplete";
// import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import CGoogleAutoComplete from "components/CGoogleAutocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
const { flag } = require("country-emoji");

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings: readonly MainTextMatchedSubstrings[];
}

interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
}

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
  fontSize: 12,
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  style: {
    zIndex: 1000002,
    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
  },
};

const WebURL =
  // eslint-disable-next-line no-useless-escape
  /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

const emailRegex =
  /[a-z0-9]+@[a-z]+\.(com|org|edu|mil|net|gov|co|in|io|ai|ca|dev|me|co.in|co.uk)\b$/;

const numberRegex: any = /^[0-9]/;

const validationSchema = yup.object({
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
    .matches(WebURL, "Enter a valid url"),
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

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const DialogWrapper = styled(Box)(({ theme }) => ({
  "& .datePicker": {
    "& input": { padding: "8px 14px !important" },
    // "& .MuiInputLabel-root": { top: "-8px" },
  },
  "& .MuiButtonBase-root": { fontSize: "12px !important" },
}));

const HospitalsLists = () => {
  const [type, setType] = useState<any>("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [hospitalList, setHospitalList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [courseDiseaseList, setCourseDiseaseList] = React.useState<any>([]);
  const [btnLoad, setBtnLoad] = useState(false);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const [list, setList] = useState<any>([]);
  const [keywords, setKeywords] = React.useState("");
  const [financePhone, setFinancePhone] = useState<any>({});
  const [escalationPhone, setEscalationPhone] = useState<any>({});
  const [fCountryCode, setFCountryCode] = React.useState("");
  const [eCountryCode, setECountryCode] = React.useState("");
  const [modalClose, setModalClose] = useState<any>(false);
  const [isError, setisError] = React.useState<any>({ departments: false });
  const [financeValid, setFinanceValid] = useState<any>(false);
  const [escalationValid, setEscalationValid] = useState<any>(false);
  const [departmentList, setDepartmentList] = useState<any>([]);

  const [value, setValue] = React.useState<PlaceType | any>(null);
  const country = value && value?.description?.split(" ")?.pop();
  const [addValid, setAddValid] = useState<any>(false);
  const [locationLatLng, setLocationLatLng] = React.useState<any>({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    if (value) {
      geocodeByAddress(value?.description || value)
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          setLocationLatLng({ ...locationLatLng, lat: lat, lng: lng });
          console.log("Successfully got latitude and longitude", { lat, lng });
        });
    }
  }, [value]);

  const departmentArr = [
    "OPD",
    "Surgical",
    "Inpatient",
    "Nursing",
    "Physical medicine",
  ];

  const handleClose = () => {
    setFinancePhone({ number: "" });
    setEscalationPhone({ number: "" });
    setFinanceValid(false);
    setEscalationValid(false);
    setOpenModal(false);
    setType("");
    setSelectedItem({});
    setAddValid(false);
    setLocationLatLng({ lat: 0, lng: 0 });
    setValue(null);
    setFCountryCode("");
    setECountryCode("");
    setList([]);
    setDepartmentList([]);
    setisError({ ...isError, departments: false });
    setOpen("");
    setModalClose(false);
  };

  function NewBar() {
    return (
      <Box>
        <Button
          size="small"
          onClick={() => {
            setType("new");
            setOpenModal(true);
          }}
          variant="outlined"
          startIcon={<Add />}
          style={{ margin: "10px" }}
        >
          <IntlMessages id="scrumboard.addNew" />
        </Button>
      </Box>
    );
  }

  //API for get disease lists
  async function onGetLists(nData: any) {
    try {
      const resp = await getApiData(`course-disease/admin-list`, nData);
      if (resp.success) {
        setCourseDiseaseList(isArray(resp.data) ? resp.data : []);
        getHospitalList({
          page: 1,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
      } else {
        setHospitalList((e) => ({ ...e, listsLoad: false }));
        setCourseDiseaseList([]);
        toast.error(resp.message);
      }
    } catch (error) {
      setHospitalList((e) => ({ ...e, listsLoad: false }));
      console.log("error====", error);
      setCourseDiseaseList([]);
      toast.error("Something went wrong");
    }
  }

  //API For get hospital list
  async function getHospitalList(nData) {
    setHospitalList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("hospital-school/hospital-list", nData);
      if (res.success) {
        setHospitalList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setHospitalList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setHospitalList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  //API For create/update hospital
  async function submitData(data: any, btnType?: any) {
    if (isEmpty(value) && btnType !== "draft") {
      setAddValid(true);
    } else if (
      (isError?.departments || escalationValid || financeValid) &&
      btnType !== "draft"
    ) {
      setAddValid(false);
      return;
    } else {
      setAddValid(false);
      let fData = {};
      if (btnType === "draft") {
        fData = {
          ...data,
          escalation_contact_country_code: eCountryCode,
          finance_contact_country_code: fCountryCode,
          departments: departmentList,
          courses_or_diseases: list,
          finance_contact_number: financePhone?.number,
          escalation_contact_number: escalationPhone?.number,
          draft_id: selectedItem?.id || null,
          type: "Hospital",
          location: {
            city: value?.description || value,
            coordinates: [locationLatLng.lng || 0, locationLatLng.lat || 0],
          },
          latitude: locationLatLng.lat || 0,
          longitude: locationLatLng.lng || 0,
          country: country || "",
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
          draft_id: selectedItem?.row?.is_draft
            ? selectedItem?.id
            : null || null,
          type: "Hospital",
          location: {
            city: value?.description || value,
            coordinates: [locationLatLng.lng || 0, locationLatLng.lat || 0],
          },
          latitude: locationLatLng.lat || 0,
          longitude: locationLatLng.lng || 0,
          country: country || "",
        };
      }

      setBtnLoad(true);
      const id = selectedItem?.id;
      let url = "";
      if (type === "edit") {
        url = `hospital-school/update-hospital/${id}`;
      } else if (btnType === "draft") {
        url = `hospital-school/save-draft`;
      } else {
        url = "hospital-school/create-hospital";
      }

      try {
        const resp = await getApiData(
          url,
          fData,
          type === "edit" ? "PUT" : "POST"
        );
        if (resp.success) {
          toast.success(resp.message);
          handleClose();
          getHospitalList({
            page: 1,
            sort: sortModel[0].field,
            sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
          });
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

  useEffect(() => {
    onGetLists({ category: "health" });
  }, []);

  //API For delete hospital from list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(
        `hospital-school/delete/${id}`,
        "",
        "DELETE"
      );
      if (res.success) {
        setOpen("");
        getHospitalList({
          page: 1,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
        setSelectedItem({});
        setLocationLatLng({ lat: 0, lng: 0 });
        setValue(null);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setDltLoad(false);
    } catch (error) {
      setDltLoad(false);
      console.log("delete error", error);
      toast.error("Something went wrong");
    }
  }

  const strFilterOperators = getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value)
  );

  const dateFilterOperators = getGridDateOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const boolFilterOperators = getGridBooleanOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const numberFiltOperator = getGridNumericColumnOperators().filter(
    ({ value }) => ["="].includes(value)
  );

  const columns: GridColumns = [
    {
      field: "_id",
      headerName: "ID",
      hide: true,
      minWidth: 200,
      flex: 1,
      filterable: false,
    },
    {
      field: "name",
      headerName: "Hospital Name",
      minWidth: 250,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {item?.row?.is_draft ? (
              <Typography
                variant="body1"
                sx={{
                  color: "#9E49E6",
                  backgroundColor: "#F5EDFC",
                  pl: 2,
                  pr: 2,
                  pt: 0.5,
                  pb: 0.5,
                  borderRadius: 1,
                  fontSize: 12,
                  mr: 2,
                }}
              >
                Draft
              </Typography>
            ) : null}
            <Typography sx={{ fontSize: 12 }}>{item?.value || ""}</Typography>
          </Box>
        );
      },
    },
    {
      field: "types_of_hospital",
      headerName: "Hospital Type",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "departments",
      headerName: "Departments",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "emergency_department",
      headerName: "Emergency Department",
      type: "boolean",
      minWidth: 250,
      flex: 1,
      filterOperators: boolFilterOperators,
    },
    {
      field: "location",
      headerName: "Address",
      minWidth: 500,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params) => params?.row?.location?.city || "-",
      type: "string",
    },
    {
      field: "country",
      headerName: "Country",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => params?.row?.country || "-",
      type: "string",
      filterOperators: strFilterOperators,
    },
    {
      field: "areas_served",
      headerName: "Areas Served",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "establishment_year",
      headerName: "Establish Year",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "website",
      headerName: "Website",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "escalation_contact_name",
      headerName: "Escalation Contact Name",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "escalation_contact_email",
      headerName: "Escalation Contact Email",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "escalation_contact_number",
      headerName: "Escalation Contact Number",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Typography sx={{ fontSize: "12px" }}>
            {flag(item?.row?.escalation_contact_country_code) || ""}{" "}
            {item?.value || ""}
          </Typography>
        );
      },
    },
    {
      field: "finance_contact_name",
      headerName: "Finance Contact Name",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "finance_contact_email",
      headerName: "Finance Contact Email",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "finance_contact_number",
      headerName: "Finance Contact Number",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Typography sx={{ fontSize: "12px" }}>
            {flag(item?.row?.finance_contact_country_code) || ""}{" "}
            {item?.value || ""}
          </Typography>
        );
      },
    },
    {
      field: "hospital_area",
      headerName: "Area",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "no_of_beds",
      headerName: "No. of Beds",
      minWidth: 200,
      flex: 1,
      type: "number",
      filterOperators: numberFiltOperator,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 200,
      flex: 1,
      filterOperators: dateFilterOperators,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      minWidth: 200,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) => (params?.value ? params?.value : "-"),
    },
    {
      field: "updatedBy",
      headerName: "Updated By",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) => (params?.value ? params?.value : "-"),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: (item: any) => {
        return [
          <GridActionsCellItem
            icon={<EditOutlined />}
            label="Edit"
            className="textPrimary"
            onClick={() => {
              setOpenModal(true);
              setType(item?.row?.is_draft ? "draft" : "edit");
              setList(item.row.courses_or_diseases);
              setDepartmentList(item?.row?.departments || []);
              setSelectedItem(item);
              setLocationLatLng({
                lat: item?.row?.location?.coordinates[1] || 0,
                lng: item?.row?.location?.coordinates[0] || 0,
              });
              setValue(item?.row?.location?.city || null);
              setFinancePhone({
                ...financePhone,
                number: item.row.finance_contact_number || "",
              });
              setECountryCode(item.row.escalation_contact_country_code);
              setFCountryCode(item.row.finance_contact_country_code);
              setEscalationPhone({
                ...escalationPhone,
                number: item.row.escalation_contact_number || "",
              });
            }}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteOutline />}
            label="Delete"
            onClick={(event) => {
              setSelectedItem(item);
              setOpen("delete");
            }}
            color="inherit"
          />,
        ];
      },
    },
  ];

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    getHospitalList(flt);
  }

  return (
    <AppsContainer
      title="Hospitals"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getHospitalList}
            setKeywords={setKeywords}
            keywords={keywords}
            sortModel={sortModel}
            from="hospitals"
          />
        );
      }}
    >
      <AppsHeader>
        <div style={{ display: "flex", alignItems: "center" }}>
          <BreadWrapper>
            <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "20px 0px" }}>
              <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                Dashboards
              </Link>
              <Typography color="text.primary">Hospitals</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={NewBar}
        onChange={(event) => onChange(event)}
        row={hospitalList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={hospitalList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getHospitalList}
        setSortModel={setSortModel}
      />

      <DialogSlide
        open={openModal}
        onDeny={() => {
          if (modalClose) {
            setOpen("close");
          } else {
            handleClose();
          }
        }}
        onClose={() => {
          if (modalClose) {
            setOpen("close");
          } else {
            handleClose();
          }
        }}
        dialogTitle={type === "edit" ? "Update Hospital" : "Add Hospital"}
        dialogContentStyle={{
          "& .MuiDialog-paper": { maxWidth: "calc(100vh + 300px)" },
        }}
      >
        <DialogWrapper>
          <Formik
            validateOnChange={true}
            initialValues={{
              name: selectedItem?.row?.name || "",
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
                (!isEmpty(values.name) ||
                  !isEmpty(value) ||
                  !isEmpty(values.finance_contact_name) ||
                  !isEmpty(financePhone?.number) ||
                  !isEmpty(values.finance_contact_email) ||
                  !isEmpty(values.escalation_contact_name) ||
                  !isEmpty(escalationPhone?.number) ||
                  !isEmpty(values.escalation_contact_email) ||
                  !isEmpty(values.website) ||
                  !isEmpty(values.establishment_year) ||
                  !isEmpty(values.hospital_area) ||
                  !isEmpty(values.types_of_hospital) ||
                  !isEmpty(values.no_of_beds) ||
                  !isEmpty(values.areas_served)) &&
                type !== "edit"
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
                      {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          views={["year"]}
                          label="Year Established"
                          minDate={"1950-01-01"}
                          maxDate={currentYear}
                          value={dValue}
                          onChange={(newValue) => setValue(newValue)}
                          renderInput={(params) => (
                            <TextField {...params} helperText={null} />
                          )}
                          className="datePicker"
                        />
                      </LocalizationProvider> */}
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
                        <IntlMessages id={type === "edit" ? "Update" : "Add"} />
                      </LoadingButton>
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
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        </DialogWrapper>
      </DialogSlide>

      <AppConfirmDialog
        open={open === "delete" ? true : false}
        disabled={dltLoad}
        loading={dltLoad}
        onClose={() => {
          setOpen("");
          setModalClose(false);
          handleClose();
        }}
        onDeny={() => {
          setDltLoad(false);
          setSelectedItem({});
          setLocationLatLng({ lat: 0, lng: 0 });
          setValue(null);
          setOpen("");
        }}
        onConfirm={() => deleteList(selectedItem?.id)}
        title={"Are you sure you want to delete this School/College?"}
        dialogTitle={"Delete School/College"}
      />
    </AppsContainer>
  );
};

export default HospitalsLists;
