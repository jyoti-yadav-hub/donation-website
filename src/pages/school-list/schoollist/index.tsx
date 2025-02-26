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
  OutlinedInput,
  Chip,
} from "@mui/material";
import { Form, Formik, Field } from "formik";
import * as yup from "yup";
import {
  getGridDateOperators,
  getGridNumericColumnOperators,
  getGridStringOperators,
  GridActionsCellItem,
  GridColumns,
  GridSortModel,
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
    .matches(WebURL, "Enter a valid url"),
  establishment_year: yup.string().required(`Please select establish year`),
  management: yup.string().required(`Please select management`),
  academic: yup.array().required(`Please select academic`),
  instruction_medium: yup.array().required(`Please select instruction medium`),
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

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const DialogWrapper = styled(Box)(({ theme }) => ({
  "& .datePicker": {
    "& input": {
      padding: "8px 14px !important",
    },
    // "& .MuiInputLabel-root": { top: "-8px" },
  },
  "& .MuiButtonBase-root": {
    fontSize: "12px !important",
  },
}));

const SchoolsLists = () => {
  const [type, setType] = useState<any>("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [schoolList, setSchoolList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [dltLoad, setDltLoad] = React.useState<boolean>(false);
  const [courseDiseaseList, setCourseDiseaseList] = React.useState<any>([]);
  const [btnLoad, setBtnLoad] = useState(false);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const [list, setList] = useState<any>([]);
  const [keywords, setKeywords] = React.useState("");
  const [admissionPhone, setAdmissionPhone] = useState<any>({});
  const [financePhone, setFinancePhone] = useState<any>({});
  const [escalationPhone, setEscalationPhone] = useState<any>({});
  const [aCountryCode, setACountryCode] = React.useState("");
  const [fCountryCode, setFCountryCode] = React.useState("");
  const [eCountryCode, setECountryCode] = React.useState("");
  const [modalClose, setModalClose] = useState<any>(false);
  const [admisionValid, setAdmisionValid] = useState<any>(false);
  const [financeValid, setFinanceValid] = useState<any>(false);
  const [escalationValid, setEscalationValid] = useState<any>(false);

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

  const handleClose = () => {
    setAdmissionPhone({ number: "" });
    setFinancePhone({ number: "" });
    setEscalationPhone({ number: "" });
    setAdmisionValid(false);
    setFinanceValid(false);
    setEscalationValid(false);
    setOpenModal(false);
    setType("");
    setFCountryCode("");
    setECountryCode("");
    setACountryCode("");
    setSelectedItem({});
    setAddValid(false);
    setLocationLatLng({ lat: 0, lng: 0 });
    setValue(null);
    setList([]);
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

  //API for get course lists
  async function onGetLists(nData) {
    try {
      const resp = await getApiData(`course-disease/admin-list`, nData);
      if (resp.success) {
        setCourseDiseaseList(isArray(resp.data) ? resp.data : []);
        getSchoolsList({
          page: 1,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
      } else {
        setSchoolList((e) => ({ ...e, listsLoad: false }));
        setCourseDiseaseList([]);
        toast.error(resp.message);
      }
    } catch (error) {
      console.log("error====", error);
      setSchoolList((e) => ({ ...e, listsLoad: false }));
      setCourseDiseaseList([]);
      toast.error("Something went wrong");
    }
  }

  // const { ref } = usePlacesWidget({
  //   apiKey: "AIzaSyDRZ9dub0xUqosNmQJIsFocRJ8WfOh8gSY",
  //   onPlaceSelected: (place) => console.log("place=====", place),
  // });

  //API For get schools list
  async function getSchoolsList(nData) {
    setSchoolList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("hospital-school/school-list", nData);
      if (res.success) {
        setSchoolList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setSchoolList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setSchoolList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  //API For create/update hospital
  async function submitData(data: any, btnType?: any) {
    if (isEmpty(value) && btnType !== "draft") {
      setAddValid(true);
    } else if (
      (admisionValid || escalationValid || financeValid) &&
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
          admission_contact_country_code: aCountryCode,
          escalation_contact_country_code: eCountryCode,
          finance_contact_country_code: fCountryCode,
          courses_or_diseases: list,
          admission_contact_number: admissionPhone?.number,
          finance_contact_number: financePhone?.number,
          escalation_contact_number: escalationPhone?.number,
          draft_id: selectedItem?.id || null,
          type: "School",
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
          admission_contact_country_code: aCountryCode,
          escalation_contact_country_code: eCountryCode,
          finance_contact_country_code: fCountryCode,
          courses_or_diseases: list,
          admission_contact_number: admissionPhone?.number,
          finance_contact_number: financePhone?.number,
          escalation_contact_number: escalationPhone?.number,
          type: "School",
          draft_id: selectedItem?.row?.is_draft
            ? selectedItem?.id
            : null || null,
          location: {
            city: value?.description || value,
            coordinates: [locationLatLng.lng || 0, locationLatLng.lat || 0],
          },
          country: country || "",
          latitude: locationLatLng.lat || 0,
          longitude: locationLatLng.lng || 0,
        };
      }
      setBtnLoad(true);
      const id = selectedItem?.id;
      let url = "";
      if (type === "edit") {
        url = `hospital-school/update-school/${id}`;
      } else if (btnType === "draft") {
        url = `hospital-school/save-draft`;
      } else {
        url = "hospital-school/create-school";
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
          getSchoolsList({
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
    onGetLists({ category: "education" });
  }, []);

  //API For delete school from list
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
        getSchoolsList({
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
      headerName: "School/College Name",
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
      field: "school_college_type",
      headerName: "School/College Type",
      minWidth: 250,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "location",
      headerName: "Address",
      minWidth: 500,
      flex: 1,
      valueGetter: (params) => params?.row?.location?.city || "-",
      type: "string",
      filterOperators: strFilterOperators,
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
      field: "board",
      headerName: "Board",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "no_of_teachers",
      headerName: "No. of Teachers",
      minWidth: 200,
      flex: 1,
      type: "number",
      filterOperators: numberFiltOperator,
    },
    {
      field: "no_of_students",
      headerName: "No. of Students",
      minWidth: 200,
      flex: 1,
      type: "number",
      filterOperators: numberFiltOperator,
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
      field: "admission_contact_name",
      headerName: "Admission Contact Name",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "admission_contact_email",
      headerName: "Admission Contact Email",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "admission_contact_number",
      headerName: "Admission Contact Number",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Typography sx={{ fontSize: "12px" }}>
            {flag(item?.row?.admission_contact_country_code) || ""}{" "}
            {item?.value || ""}
          </Typography>
        );
      },
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
      field: "management",
      headerName: "Management",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 200,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
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
              setSelectedItem(item);
              setACountryCode(item.row.admission_contact_country_code);
              setECountryCode(item.row.escalation_contact_country_code);
              setFCountryCode(item.row.finance_contact_country_code);
              setAdmissionPhone({
                ...admissionPhone,
                number: item.row.finance_contact_number || "",
              });
              setLocationLatLng({
                lat: !isEmpty(item?.row?.location)
                  ? item?.row?.location?.coordinates[1]
                  : 0 || 0,
                lng: !isEmpty(item?.row?.location)
                  ? item?.row?.location?.coordinates[0]
                  : 0 || 0,
              });
              setValue(item?.row?.location?.city || null);
              setFinancePhone({
                ...financePhone,
                number: item.row.finance_contact_number || "",
              });
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
    getSchoolsList(flt);
  }

  return (
    <AppsContainer
      title="Schools"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getSchoolsList}
            setKeywords={setKeywords}
            keywords={keywords}
            sortModel={sortModel}
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
              <Typography color="text.primary">Schools</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={NewBar}
        onChange={(event) => onChange(event)}
        row={schoolList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={schoolList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getSchoolsList}
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
        dialogTitle={
          type === "edit" ? "Update School/College" : "Add School/College"
        }
        dialogContentStyle={{
          "& .MuiDialog-paper": { maxWidth: "calc(100vh + 300px)" },
        }}
      >
        <DialogWrapper>
          <Formik
            validateOnChange={true}
            initialValues={{
              name: selectedItem?.row?.name || "",
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
              if (numberRegex.test(values.admission_contact_email)) {
                errors.admission_contact_email = "Email is invalid";
              }
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
                  !isEmpty(values.management) ||
                  !isEmpty(values.school_college_type) ||
                  !isEmpty(values.no_of_teachers) ||
                  !isEmpty(values.board) ||
                  !isEmpty(values.academic) ||
                  !isEmpty(values.instruction_medium) ||
                  !isEmpty(values.no_of_students)) &&
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
                        placeholder="Enter School/College Name"
                        name="name"
                        label={"Enter School/College Name"}
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.name}
                        onChange={(event: any) => handleChange(event)}
                        autoFocus
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
                        label="Year Established"
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
                          label="Year and Month"
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
                        }}
                      >
                        <IntlMessages id={type === "edit" ? "Update" : "Add"} />
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
          setOpen("");
        }}
        onConfirm={() => deleteList(selectedItem?.id)}
        title={"Are you sure you want to delete this School/College?"}
        dialogTitle={"Delete School/College"}
      />
    </AppsContainer>
  );
};

export default SchoolsLists;
