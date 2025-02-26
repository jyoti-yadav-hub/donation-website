/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  Chip,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Breadcrumbs,
  Grid,
} from "@mui/material";
import {
  getGridDateOperators,
  getGridStringOperators,
  GridActionsCellItem,
  GridColumns,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import { styled } from "@mui/material/styles";
import IntlMessages from "@crema/utility/IntlMessages";
import { isArray } from "lodash";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import { LoadingButton } from "@mui/lab";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { AppConfirmDialog } from "@crema";
import DialogSlide from "components/DialogSlide";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";
import PhoneInput from "react-phone-input-2";
import { isValidPhoneNumber } from "libphonenumber-js/max";

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  web_otp: yup.string()
  .required("Otp is required")
  .matches(/^[0-9]+$/, "Must be only digits")
  .min(6, "Otp should be 6 chars minimum.")
  .max(6, "Maximum 6 characters allowed"),
  phone: yup.string().required('Phone number is required')
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

const style = { width: 500 };
const DialogWrapper = styled(Box)(({ theme }) => ({
  "& .datePicker": {
    "& input": { padding: "8px 14px !important" },
    // "& .MuiInputLabel-root": { top: "-8px" },
  },
  "& .MuiButtonBase-root": { fontSize: "12px !important" },
  width: 500,
  height: 250
}));
const DefaultOtpList = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [btnLoad, setBtnLoad] = useState(false);
  const [otpList, setOtpList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const [financePhone, setFinancePhone] = useState<any>({});
  const [deafultCountry, setdefCountry] = useState<any>('in');
  const [financeValid, setFinanceValid] = useState<any>(false);
  const [fCountryCode, setFCountryCode] = React.useState("");
  const [keywords, setKeywords] = React.useState("");

  function NewBar() {
    return (
      <Button
        size="small"
        onClick={() => {
          setType("new");
          setOpenModal(true);
          setFCountryCode('');
          setFinancePhone('');
        }}
        variant="outlined"
        startIcon={<Add />}
        style={{ margin: "10px" }}
      >
        <IntlMessages id="scrumboard.addNew" />
      </Button>
    );
  }

  //API For get regions list
  async function getOtpList(nData) {
    setOtpList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData(`default-otp/list`, nData);
      if (res.success) {
        let finalArray = isArray(res.data) ? res.data.map((x)=> {return {...x,'dispPhone':x.phone}}) : [];
        setOtpList({
          lists: isArray(finalArray) ? finalArray : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setOtpList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setOtpList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getOtpList({
      page: 1,      
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  //API For delete regions list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(`default-otp/delete/${id}`, "", "DELETE");
      if (res.success) {
        setOpen(false);
        getOtpList({
          page: 1,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
        setSelectedItem({});
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

  //API For create/update regions list
  async function submitData(data: any) {
    if(!financePhone.number || financePhone.number.toString().trim() === '') {
      setFinanceValid(true);
      return;
    }
    setBtnLoad(true);
    let finalObj = {
      app_otp:data.web_otp,
      web_otp:data.web_otp,
      phone_code:fCountryCode,
      phone:data.phone
    }
    const id = selectedItem?.id;
    let url = "";
    if (type === "edit") {
      url = `default-otp/update/${id}`;
    } else {
      url = `default-otp/create`;
    }
    try {
      const resp = await getApiData(
        url,
        finalObj,
        type === "edit" ? "PUT" : "POST"
      );
      if (resp.success) {
        toast.success(resp.message);
        setOpenModal(false);
        setType("");
        setSelectedItem({});
        getOtpList({
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
      toast.error("Something went wrong");
    }
  }

  const strFilterOperators = getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value)
  );

  const dateFilterOperators = getGridDateOperators().filter(({ value }) =>
    ["is"].includes(value)
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
      field: "dispPhone",
      headerName: "Phone",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "app_otp",
      headerName: "App OTP",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "web_otp",
      headerName: "Web OTP",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 150,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      minWidth: 150,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) =>
        params?.value ? params?.value : "-",
    },
    {
      field: "updatedBy",
      headerName: "Updated By",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) =>
        params?.value ? params?.value : "-",
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
              let tempNo = item.row.phone;
              setOpenModal(true);
              setFinancePhone({ 
                number: tempNo,
              })
              setFCountryCode(item.row.phone_code)
              item.row.phone = tempNo ? tempNo.slice(Number(item.row.phone_code.length + 1)) : '';         
              setType("edit");
              setSelectedItem(item);
            }}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteOutline />}
            label="Delete"
            onClick={(event) => {
              setSelectedItem(item);
              setOpen(true);
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
    getOtpList(flt);
  }

  const handleClose = () => {
    setOpenModal(false);
    setFinanceValid(false);
    setType("");
    setSelectedItem({});
    setdefCountry('in')
  };

  return (
    <AppsContainer
      title="Default Otp"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getOtpList}
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
              <Typography color="text.primary">Default Otp</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={NewBar}
        onChange={(event) => onChange(event)}
        row={otpList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={otpList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getOtpList}
        setSortModel={setSortModel}
      />

      <DialogSlide
        open={openModal}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle={type === "edit" ? "Update OTP" : "Add New OTP"}
        dialogContentStyle={{
          "& .MuiDialog-paper": { maxWidth: "calc(100vh + 300px)" },
        }}
      >
        <DialogWrapper>
          <Formik
            validateOnChange={true}
            initialValues={{
              web_otp: selectedItem?.row?.web_otp || "",
              phone: selectedItem?.row?.phone || ""
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
                handleSubmit
              } = props;
              return (
                <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                  {/* ======= Phone Number ======= */}
                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <FormControl fullWidth size="small">
                      <PhoneInput
                        autoFormat={false}
                        placeholder="Phone Number"
                        enableSearch={true}
                        countryCodeEditable={false}
                        disableSearchIcon={true}
                        value={financePhone.number|| ""}
                        onChange={(v: any, data: any, event: any) => {
                          if (isValidPhoneNumber(event.target.value || "")) { 
                            setFinanceValid(false);
                          } else {
                            setFinanceValid(true);
                          }
                          values.phone = event.target.value ? event.target.value.slice(Number(data?.dialCode.length + 1)) : '';
                          setFCountryCode('+'+data?.dialCode);
                          setFinancePhone({ number: event.target.value });
                          setdefCountry(data.countryCode)
                        }}
                        country={deafultCountry}
                        inputStyle={{ width: "100%", height: "37px" }}
                        searchStyle={{ width: "90%" }}
                        onBlur={handleBlur}
                      />
                      {financeValid ? (
                        <ErrorTextStyle>
                          Enter valid phone number
                        </ErrorTextStyle>
                      ): null}
                      {errors.phone && !financeValid && values.phone=='' && (
                          <ErrorTextStyle>{errors.phone}{values.phone}</ErrorTextStyle>
                        )}
                    </FormControl>
                  </Box>
                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                     <FormControl fullWidth size="small">
                      <TextField
                          size="small"
                          fullWidth
                          placeholder="Enter otp"
                          name="web_otp"
                          label={<IntlMessages id="Enter Otp" />}
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.web_otp}
                          onChange={(event: any) => handleChange(event)}
                        />
                        {errors.web_otp && (
                          <ErrorTextStyle>{errors.web_otp}</ErrorTextStyle>
                        )}
                     </FormControl>
                  </Box>
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
                      disabled={btnLoad}
                      loading={btnLoad}
                    >
                      <IntlMessages id={type === "edit" ? "Update" : "Add"} />
                    </LoadingButton>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </DialogWrapper>
      </DialogSlide>

      <AppConfirmDialog
        open={open}
        disabled={dltLoad}
        loading={dltLoad}
        onDeny={() => {
          setDltLoad(false);
          setSelectedItem({});
          setOpen(false);
        }}
        onConfirm={() => deleteList(selectedItem?.id)}
        title="Are you sure you want to delete this OTP?"
        dialogTitle="Delete OTP"
      />
    </AppsContainer>
  );
};

export default DefaultOtpList;
