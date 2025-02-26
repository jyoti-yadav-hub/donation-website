/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Form, Formik } from "formik";
import * as yup from "yup";
import {
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  Breadcrumbs,
  FormControl,
  InputLabel,
  Grid,
  FormControlLabel,
  Checkbox,
  FormLabel,
  RadioGroup,
  Radio,
  FormHelperText,
  CircularProgress,
  FormGroup,
  Switch,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  GridColumns,
  GridActionsCellItem,
  GridSortModel,
  getGridDateOperators,
  getGridStringOperators,
  getGridNumericColumnOperators,
  getGridSingleSelectOperators,
} from "@mui/x-data-grid-pro";
import { Add, EditOutlined, Remove } from "@mui/icons-material";
import { toast } from "react-toastify";
import { isArray, isEmpty } from "lodash";
import IntlMessages from "@crema/utility/IntlMessages";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import { LoadingButton } from "@mui/lab";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { AppConfirmDialog } from "@crema";
import DialogSlide from "components/DialogSlide";
import { CommonSettingForm } from "components/DefaultHealth";
import { v4 } from "uuid";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isValidPhoneNumber } from "libphonenumber-js/max";
import { getCountryLists } from "commonFunction";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
  fontSize: 11,
}));

const validationSchema = yup.object({
  country: yup.string().required("Please select country"),
  currency: yup.string().required("Please select currency"),
  unit: yup.string().required("Please select Unit"),
});

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const BodyStyle = styled(Box)(({ theme }) => ({
  "& .nameDiv": { display: "flex", alignItems: "center" },
  "& .categoy-card": {
    cursor: "pointer",
    // "&:hover": { transition: "all 0.2s ease" },
    "& .MuiCardContent-root": {
      padding: "10px !important",
      borderRadius: "5px !important",
      display: "flex !important",
      alignItems: "center",
    },
  },
}));

const style = {
  minWidth: "calc(100vh - 100px)",
  minHeight: "calc(20vh)",
};

const CommonSettings = () => {
  const [settingsList, setSettingsList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState("");
  const [openDltModal, setOpenDltModal] = useState<any>(false);
  const [confirmOnClose, setConfirmOnClose] = useState<any>(false);
  const [btnLoad, setBtnLoad] = useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [countryData, setCountryData] = useState<any>([]);
  const [paymentGatewayData, setPaymentGatewayData] = React.useState<any>([]);
  const [feilds, setFeilds] = useState<any>([]);
  const [feildError, setFeildError] = useState<any>(false);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const [keywords, setKeywords] = React.useState("");
  const [currency, setCurrency] = useState<any>("");
  const [categoryList, setCategoryList] = React.useState<any[]>([]);
  const [catLoad, setCatLoad] = useState<boolean>(false);
  const [modalClose, setModalClose] = useState<any>(false);

  const handleClose = () => {
    setOpen(false);
    setType("");
    setSelectedItem({});
    setFeilds([]);
    onClear();
    setConfirmOnClose(false);
    setModalClose(false);
  };

  //API For get country list
  async function getPaymentGateways() {
    try {
      const res = await getApiData(
        "payment-gateway/list",
        { allData: 1 },
        "GET"
      );
      if (res.success) {
        setPaymentGatewayData(isArray(res.data) ? res.data : []);
      } else {
        setPaymentGatewayData([]);
        toast.error(res.message);
      }
    } catch (error) {
      setPaymentGatewayData([]);
      toast.error("Something went wrong");
    }
  }

  //API for get categories
  async function onGetCategoryList() {
    try {
      const resp = await getApiData(`category/list`, { allData: 1 }, "GET");
      if (resp.success) {
        setCategoryList(isArray(resp.data) ? resp.data : []);
        getPaymentGateways();
      } else {
        setCategoryList([]);
        toast.error(resp.message);
      }
    } catch (error) {
      console.log("error====", error);
      setCategoryList([]);
      toast.error("Something went wrong");
    }
  }

  //API For get common settings list
  async function onGetSettingsList(nData?: any) {
    setSettingsList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData(`setting/common-setting-list`, nData);
      if (res.success) {
        setSettingsList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
        onGetCategoryList();
      } else {
        setSettingsList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
      await getCountryLists(setCountryData);
    } catch (error) {
      setSettingsList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  const onClear = () => {
    let ques = isArray(feilds) ? [...feilds] : [];
    let newArry = ques;
    ques?.map((qItem: any, index: any) => {
      newArry[index].inputs = ques[index].inputs.filter(
        (i) => i.is_category !== true
      );
      return newArry[index].inputs?.map((sQItem: any) =>
        sQItem?.input_type === "select"
          ? (sQItem.values = [])
          : sQItem.input_type === "number"
          ? (sQItem.values = 0)
          : (sQItem.values = "")
      );
    });
    setFeilds(newArry);
  };

  useEffect(() => {
    setFeilds(CommonSettingForm);
  }, []);

  const commonStyle = {
    borderRadius: 2,
    border: "1px solid #ccc",
    width: "100%",
    m: 0,
    mt: 6,
    pr: 4,
    pb: 4,
  };

  const textCommon = {
    top: -10,
    backgroundColor: "#fff",
    borderRadius: "5px",
    paddingRight: "6px",
    paddingLeft: "6px",
    fontSize: "11px",
    ml: 4,
  };

  const commonCheckBox = {
    top: -20,
    right: 5,
    pl: "6px",
    backgroundColor: "#fff",
    borderRadius: "5px",
  };

  function NewBar() {
    return (
      <Box>
        <Button
          size="small"
          onClick={() => {
            setFeilds(CommonSettingForm);
            setType("new");
            setOpen(true);
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

  useEffect(() => {
    onGetSettingsList({
      page: 1,
      search: keywords ? keywords : null,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.page = newPage + 1;
    flt.search = keywords ? keywords : null;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    flt.operator = "contains";
    onGetSettingsList(flt);
  }

  //API For delete setting from list
  async function deleteList(item: any) {
    setDltLoad(true);
    const id = item?.id;
    try {
      const res = await getApiData(
        `setting/delete-common-setting/${id}`,
        {},
        "DELETE"
      );
      if (res.success) {
        toast.success(res.message);
        setOpenDltModal(false);
        onGetSettingsList({
          page: 1,
          search: keywords ? keywords : null,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
        setSelectedItem({});
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

  const singleSelectFilter = getGridSingleSelectOperators().filter(
    ({ value }) => ["is"].includes(value)
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
      field: "country",
      headerName: "Country",
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
      field: "payment_gateway",
      headerName: "Payment-Gateway",
      minWidth: 250,
      flex: 1,
      type: "string",
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Typography sx={{ fontSize: 12 }}>
            {!isEmpty(item?.row?.form_data?.payment_gateway)
              ? item?.row?.form_data?.payment_gateway
                  ?.charAt(0)
                  ?.toUpperCase() +
                item?.row?.form_data?.payment_gateway?.slice(1)
              : "-" || "-"}
          </Typography>
        );
      },
    },
    {
      field: "service_fee",
      headerName: "Service Charge",
      minWidth: 200,
      flex: 1,
      filterOperators: numberFiltOperator,
      valueGetter: (params) =>
        `${parseFloat(params?.row?.form_data?.service_fee)}%` || 0,
      type: "number",
    },
    {
      field: "transaction_fee",
      headerName: "Transaction Charge",
      minWidth: 250,
      flex: 1,
      filterOperators: numberFiltOperator,
      valueGetter: (params) =>
        `${parseFloat(params?.row?.form_data?.transaction_fee)}%` || 0,
      type: "number",
    },
    {
      field: "service_declaration",
      headerName: "Service Declaration",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params) =>
        params?.row?.form_data?.service_declaration || "-",
      type: "string",
    },
    {
      field: "radius_in_kilometer",
      headerName: "Min radius in Kilometer",
      minWidth: 250,
      flex: 1,
      filterOperators: numberFiltOperator,
      valueGetter: (params) =>
        `${parseFloat(params?.row?.form_data?.radius_in_kilometer)}%` || 0,
      type: "number",
    },
    {
      field: "max_radius_in_kilometer",
      headerName: "Max radius in Kilometer",
      minWidth: 250,
      flex: 1,
      filterOperators: numberFiltOperator,
      valueGetter: (params) =>
        `${parseFloat(params?.row?.form_data?.max_radius_in_kilometer)}%` || 0,
      type: "number",
    },
    {
      field: "minimum_donation",
      headerName: "Min donation",
      minWidth: 200,
      flex: 1,
      filterOperators: numberFiltOperator,
      valueGetter: (params) =>
        Number(params?.row?.form_data?.minimum_donation) || 0,
      type: "number",
      renderCell: (item) => {
        return (
          <Typography style={{ fontSize: "12px" }}>
            {`${item.row?.currency || ""}${item.value || 0}`}
          </Typography>
        );
      },
    },
    {
      field: "maximum_donation",
      headerName: "Max donation",
      minWidth: 200,
      flex: 1,
      filterOperators: numberFiltOperator,
      valueGetter: (params) =>
        Number(params?.row?.form_data?.maximum_donation) || 0,
      type: "number",
      renderCell: (item) => {
        return (
          <Typography style={{ fontSize: "12px" }}>
            {`${item.row?.currency || ""}${item.value || 0}`}
          </Typography>
        );
      },
    },
    {
      field: "accept_time_out_in_minute",
      headerName: "Accept timeout in minute",
      minWidth: 300,
      flex: 1,
      filterOperators: numberFiltOperator,
      valueGetter: (params) =>
        Number(params?.row?.form_data?.accept_time_out_in_minute) || 0,
      type: "number",
    },
    {
      field: "saayam_contact_no",
      headerName: "Saayam contact no",
      minWidth: 250,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params) => params?.row?.form_data?.saayam_contact_no || "-",
      type: "string",
    },
    {
      field: "saayam_email",
      headerName: "Saayam email",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params) => params?.row?.form_data?.saayam_email || "-",
      type: "string",
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
      field: "status",
      headerName: "Status",
      minWidth: 200,
      flex: 1,
      filterOperators: singleSelectFilter,
      renderCell: (item: any) => {
        return (
          <>
            {catLoad === item.id ? (
              <CircularProgress size={20} />
            ) : (
              <FormGroup>
                <FormControlLabel
                  sx={{
                    "& .MuiTypography-root": { fontSize: "12px" },
                    "& .MuiSwitch-thumb": {
                      backgroundColor:
                        item.value === "active" ? "#65c466 !important" : "",
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor:
                        item.value === "active" ? "#65c466 !important" : "",
                    },
                  }}
                  control={
                    <Switch
                      color={item.value === "active" ? "success" : "default"}
                      checked={item.value === "active" ? true : false}
                      size="small"
                      onChange={(e) => setEnableSetting(e, item.id)}
                    />
                  }
                  label={item.value === "active" ? "Enabled" : "Disabled"}
                />
              </FormGroup>
            )}
          </>
        );
      },
      type: "singleSelect",
      valueOptions: ["active", "deactive"],
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
              setFeilds(JSON.parse(item?.row?.form_settings) || []);
              setOpen(true);
              setType(item?.row?.is_draft ? "draft" : "edit");
              setSelectedItem(item);
            }}
            color="inherit"
          />,
          // <GridActionsCellItem
          //   icon={<DeleteOutline />}
          //   label="Delete"
          //   onClick={(event) => {
          //     setSelectedItem(item);
          //     setOpenDltModal(true);
          //   }}
          //   color="inherit"
          // />,
        ];
      },
    },
  ];

  // set setting disable/enable
  async function setEnableSetting(e, id) {
    setCatLoad(id);
    try {
      const res = await getApiData(
        `setting/common-setting-status/${id}`,
        {},
        "PUT"
      );
      if (res.success) {
        toast.success(res.message);
        onGetSettingsList({
          page: 1,
          search: keywords ? keywords : null,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
      } else {
        toast.error(res.message || "Something went wrong");
      }
      setCatLoad(false);
    } catch (error) {
      setCatLoad(false);
      toast.error("Something went wrong");
    }
  }

  const emailRegex =
    /[a-z0-9]+@[a-z]+\.(com|org|edu|mil|net|gov|co|in|io|ai|ca|dev|me|co.in|co.uk)\b$/;

  let numberRegex = /^[0-9]/;

  const onChangeValue = (type, title, value: any, i1, i2, subItem?: any) => {
    let ques = isArray(feilds) ? [...feilds] : [];
    const isCat = ques[i1].inputs?.find(
      (fn: any) => fn?.category_name === value
    );
    let min = ques[i1].inputs?.find(
      (fn: any) => fn?.input_slug === "minimum_donation"
    );
    let minRadius = ques[i1].inputs?.find(
      (fn: any) => fn?.input_slug === "radius_in_kilometer"
    );

    if (type === "main") {
      ques[i1][title] = value;
      if (ques[i1][title] === true) {
        ques[i1].inputs.map((fn: any) => (fn.is_global = true));
      } else {
        ques[i1].inputs.map((fn: any) => (fn.is_global = false));
      }
    } else if (type === "sub") {
      if (ques[i1].inputs[i2].input_type === "number") {
        if (Number(value) > 1 && !ques[i1].inputs[i2].is_phone) {
          var arr = value?.split(".") || [];
          var lastVal = arr?.pop() || "";
          var arr2 = lastVal?.split("") || [];
          if (
            Number(value) > ques[i1].inputs[i2].max_length ||
            (arr.length > 0 && arr2.length > 2)
          ) {
            ques[i1].inputs[i2].error = true;
            return null;
          } else {
            ques[i1].inputs[i2].error = false;
            ques[i1].inputs[i2][title] = value?.replace(/^0+(\d)/, "$1");
          }
          if (ques[i1].inputs[i2].input_slug === "maximum_donation") {
            if (Number(value) < Number(min.values)) {
              ques[i1].inputs[i2].lessthanErr = true;
              ques[i1].inputs[i2].lessthamMsg =
                "Maximum value must be more than minimum value";
            } else {
              ques[i1].inputs[i2].lessthanErr = false;
              ques[i1].inputs[i2].lessthamMsg = "";
            }
          }
          if (ques[i1].inputs[i2].input_slug === "max_radius_in_kilometer") {
            if (Number(value) < Number(minRadius.values)) {
              ques[i1].inputs[i2].lessRadius = true;
              ques[i1].inputs[i2].lessRadiusMsg =
                "Maximum radius must be greater than min radius";
            } else {
              ques[i1].inputs[i2].lessRadius = false;
              ques[i1].inputs[i2].lessRadiusMsg = "";
            }
          }
        } else if (
          ques[i1].inputs[i2].is_phone === true &&
          typeof value !== "boolean"
        ) {
          if (!isValidPhoneNumber(value || "") || isEmpty(value)) {
            ques[i1].inputs[i2].phoneError = true;
            ques[i1].inputs[i2].phoneMsg = "Enter valid phone";
          } else {
            ques[i1].inputs[i2].phoneError = false;
            ques[i1].inputs[i2].phoneMsg = "";
            ques[i1].inputs[i2][title] = value;
          }
        } else {
          ques[i1].inputs[i2].error = false;
          ques[i1].inputs[i2][title] = value;
        }
        if (
          !isEmpty(value) &&
          Number(value) < 1 &&
          !ques[i1].inputs[i2].is_phone
        ) {
          ques[i1].inputs[i2].zeroErr = true;
          ques[i1].inputs[i2][title] = value;
        } else {
          ques[i1].inputs[i2].zeroErr = false;
        }
      } else if (isCat?.category_name) {
        if (isCat?.category_name) {
          ques[i1].inputs[i2].categoryErr = true;
          ques[i1].inputs[i2].categoryMsg = "Duplicate category not allowed";
        } else {
          ques[i1].inputs[i2][title] = value;
          ques[i1].inputs[i2].categoryErr = false;
          ques[i1].inputs[i2].categoryMsg = "";
        }
      } else if (title === "min") {
        if (value < subItem.min_value) {
          ques[i1].inputs[i2][title] = value;
          ques[i1].inputs[
            i2
          ].greaterVal = `Value must be greater than ${subItem.min_value}`;
        } else {
          ques[i1].inputs[i2][title] = value;
          ques[i1].inputs[i2].greaterVal = false;
        }
      } else if (title === "max") {
        if (value > subItem.max_value) {
          ques[i1].inputs[
            i2
          ].greater = `Value must be less than ${subItem.max_value}`;
          ques[i1].inputs[i2][title] = value;
        } else {
          ques[i1].inputs[i2][title] = value;
          ques[i1].inputs[i2].greater = false;
        }
      } else {
        ques[i1].inputs[i2][title] = value;
      }
      ques[i1].inputs[i2].haveError = false;

      if (ques[i1].inputs[i2].is_email === true) {
        if (!emailRegex.test(value) || numberRegex.test(value)) {
          ques[i1].inputs[i2].emailError = true;
          ques[i1].inputs[i2].emailMsg = "Enter valid email";
        } else {
          ques[i1].inputs[i2].emailError = false;
          ques[i1].inputs[i2].emailMsg = "";
        }
      }
    }
    setFeilds(ques);
  };

  const validation = () => {
    let haveError = false;
    let ques = isArray(feilds) ? [...feilds] : [];
    ques?.map((item: any, index: any) => {
      // eslint-disable-next-line array-callback-return
      return item?.inputs?.map((subItem: any, sIndex: any) => {
        let min = item?.inputs?.find(
          (fn: any) => fn?.input_slug === "minimum_donation"
        );
        let max = item?.inputs?.find(
          (fn: any) => fn?.input_slug === "maximum_donation"
        );
        let minRadius = item?.inputs?.find(
          (fn: any) => fn?.input_slug === "radius_in_kilometer"
        );
        let maxRadius = item?.inputs?.find(
          (fn: any) => fn?.input_slug === "max_radius_in_kilometer"
        );
        if (subItem?.input_type === "number" && !subItem?.is_phone) {
          if (Number(subItem?.value) < 1) {
            ques[index].inputs[sIndex].zeroErr = true;
            haveError = true;
          } else {
            ques[index].inputs[sIndex].zeroErr = false;
            subItem.values = subItem?.values?.replace(/^0+(\d)/, "$1");
          }
          if (subItem?.input_slug === "maximum_donation") {
            if (Number(max?.values) < Number(min?.values)) {
              haveError = true;
              ques[index].inputs[sIndex].lessthanErr = true;
              ques[index].inputs[sIndex].lessthamMsg =
                "Maximum value must be more than minimum value";
            } else {
              ques[index].inputs[sIndex].lessthanErr = false;
              ques[index].inputs[sIndex].lessthamMsg = "";
            }
          }
          if (subItem?.input_slug === "max_radius_in_kilometer") {
            if (Number(maxRadius?.values) < Number(minRadius?.values)) {
              haveError = true;
              ques[index].inputs[sIndex].lessRadius = true;
              ques[index].inputs[sIndex].lessRadiusMsg =
                "Maximum radius must be greater than min radius";
            } else {
              ques[index].inputs[sIndex].lessRadius = false;
              ques[index].inputs[sIndex].lessRadiusMsg = "";
            }
          }
        }
        if (
          subItem.is_category &&
          isEmpty(ques[index].inputs[sIndex].category_name)
        ) {
          ques[index].inputs[sIndex].catError = true;
          haveError = true;
        } else if (isEmpty(subItem?.values) && !subItem.is_category) {
          ques[index].inputs[sIndex].error = true;
          haveError = true;
        } else {
          ques[index].inputs[sIndex].catError = false;
          ques[index].inputs[sIndex].error = false;
        }

        if (ques[index].inputs[sIndex].is_email === true) {
          if (
            !emailRegex.test(subItem?.values) ||
            numberRegex.test(subItem?.values)
          ) {
            ques[index].inputs[sIndex].values = "";
            ques[index].inputs[sIndex].emailError = true;
            ques[index].inputs[sIndex].emailMsg = "Enter valid email";
            haveError = true;
          } else {
            ques[index].inputs[sIndex].emailError = false;
            ques[index].inputs[sIndex].emailMsg = "";
          }
        }
        if (ques[index].inputs[sIndex].is_phone === true) {
          if (
            !isValidPhoneNumber(subItem?.values) ||
            isEmpty(subItem?.values)
          ) {
            ques[index].inputs[sIndex].values = "";
            ques[index].inputs[sIndex].phoneError = true;
            ques[index].inputs[sIndex].phoneMsg = "Enter valid phone";
            haveError = true;
          } else {
            ques[index].inputs[sIndex].phoneError = false;
            ques[index].inputs[sIndex].phoneMsg = "";
          }
        }
        if (
          subItem.is_category &&
          !isEmpty(ques[index].inputs[sIndex].category_name)
        ) {
          if (
            ques[index].inputs[sIndex].min < 1 ||
            ques[index].inputs[sIndex].max >
              ques[index].inputs[sIndex].max_length ||
            ques[index].inputs[sIndex].min >
              ques[index].inputs[sIndex].max_length
          ) {
            ques[index].inputs[sIndex].minMaxError = true;
            haveError = true;
          } else {
            ques[index].inputs[sIndex].minMaxError = false;
          }
          if (ques[index].inputs[sIndex].max < ques[index].inputs[sIndex].min) {
            ques[index].inputs[sIndex].greaterVal = true;
            haveError = true;
          } else {
            ques[index].inputs[sIndex].greaterVal = false;
          }
        }
      });
    });
    return haveError;
  };

  async function submitData(data: any, btnType?: any) {
    let haveError;
    if (btnType !== "draft") {
      haveError = validation();
    }
    if (feildError && btnType !== "draft") {
      toast.error("Something is missing!");
      return;
    } else if (haveError && btnType !== "draft") {
      // toast.error("haveError");
      return null;
    } else {
      // toast.success("success");
      // return null;
      setBtnLoad(true);
      const id = selectedItem?.id;
      let cdata = {};
      if (btnType === "draft") {
        cdata = {
          ...data,
          create_type: "draft",
          form_data: JSON.stringify(feilds),
          id: selectedItem?.id || null,
        };
      } else {
        cdata = {
          ...data,
          create_type: "main",
          form_data: JSON.stringify(feilds),
          id: id ? id : null,
        };
      }
      try {
        const resp = await getApiData(
          "setting/create-common-setting",
          cdata,
          "POST"
        );
        if (resp.success) {
          toast.success(resp.message);
          handleClose();
          onGetSettingsList({
            page: 1,
            search: keywords ? keywords : null,
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

  const subSectionData = {
    category_name: "",
    min: 0,
    max: 0,
    id: v4(),
    is_category: true,
    checkbox_lable: "Add this selection as global use",
    is_global: false,
    max_range: 999999,
    max_length: 999999,
    min_value: 1,
    max_value: 999999,
  };

  // Add input in Form
  const addFormInput = (index: any) => {
    let ques = isArray(feilds) ? [...feilds] : [];
    if (isEmpty(ques) || isEmpty(ques[index])) {
      toast.error("Something is missing");
    } else {
      ques[index].inputs.unshift(subSectionData);

      // const isDisable = isEmpty(
      //   ques[index].inputs.filter(
      //     (it) => isEmpty(it.input_type) || isEmpty(it.title)
      //   )
      // );
      // setBtnDisabled(isDisable ? false : true);
      setFeilds(ques);
    }
  };

  // Remove input in Form
  const removeFormInput = (index, inputId) => {
    let ques = isArray(feilds) ? [...feilds] : [];
    let newArry = ques;
    if (
      isEmpty(ques) ||
      isEmpty(ques[index]) ||
      isEmpty(ques[index].inputs) ||
      // eslint-disable-next-line eqeqeq
      ques[index].inputs["id"] == inputId
    ) {
      toast.error("Something is missing");
    } else {
      newArry[index].inputs = ques[index].inputs.filter(
        (i) => i.id !== inputId
      );
      setFeilds(newArry);
    }
  };

  return (
    <AppsContainer
      title="Common Settings"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={onGetSettingsList}
            setKeywords={setKeywords}
            keywords={keywords}
            sortModel={sortModel}
          />
        );
      }}
    >
      <BodyStyle>
        <AppsHeader>
          <div style={{ display: "flex", alignItems: "center" }}>
            <BreadWrapper>
              <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "20px 0px" }}>
                <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                  Dashboards
                </Link>
                <Typography color="text.primary">Common Settings</Typography>
              </Breadcrumbs>
            </BreadWrapper>
          </div>
        </AppsHeader>

        <CTable
          initialState={{ pinnedColumns: { right: ["actions"] } }}
          onRowClick={() => console.log("click")}
          NewBar={NewBar}
          onChange={(event) => onChange(event)}
          row={settingsList?.lists || []}
          column={columns}
          rowCount={pagination.total}
          page={pagination.page}
          listsLoad={settingsList?.listsLoad}
          checkboxSelection={false}
          onSelectionModelChange={() => console.log("row select")}
          sortModel={sortModel}
          getApiCall={onGetSettingsList}
          keyword={keywords}
          setSortModel={setSortModel}
        />
      </BodyStyle>

      <DialogSlide
        open={open}
        onDeny={() => {
          if (modalClose) {
            setConfirmOnClose(true);
          } else {
            handleClose();
          }
        }}
        onClose={() => {
          if (modalClose) {
            setConfirmOnClose(true);
          } else {
            handleClose();
          }
        }}
        dialogContentStyle={{
          "& .MuiDialog-paper": { maxWidth: "calc(100vh + 300px)" },
        }}
        dialogTitle={type === "edit" ? "Update Setting" : "Add Setting"}
      >
        <Box sx={style}>
          <Formik
            validateOnChange={true}
            initialValues={{
              country: selectedItem?.row?.country || "",
              currency: selectedItem?.row?.currency || "",
              unit: selectedItem?.row?.unit || "",
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
              } = props;
              if (values.country) {
                let curFind = countryData.find(
                  (fn: any) => fn.country === values.country
                );
                setCurrency(curFind);
              }
              if (
                (!isEmpty(values.country) || !isEmpty(currency)) &&
                type !== "edit"
              ) {
                setModalClose(true);
              } else {
                setModalClose(false);
              }
              return (
                <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                  <Grid container spacing={2} sx={{ m: 0, width: "100%" }}>
                    <Grid item xs={6} sx={{ pl: "0px !important" }}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-select-small">
                          Select country
                        </InputLabel>
                        <Select
                          MenuProps={{
                            style: {
                              zIndex: 1000002,
                              maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
                            },
                          }}
                          size="small"
                          name="country"
                          fullWidth
                          labelId="create-request"
                          label="Select country"
                          value={values.country}
                          onChange={(event: any) => {
                            let ques = isArray(feilds) ? [...feilds] : [];
                            if (event.target.value === "global") {
                              // eslint-disable-next-line array-callback-return
                              ques?.map((it: any) => {
                                it.section_global = true;
                                // eslint-disable-next-line array-callback-return
                                it?.inputs?.map((subIt: any) => {
                                  subIt.is_global = true;
                                });
                              });
                            } else {
                              // eslint-disable-next-line array-callback-return
                              ques?.map((it: any) => {
                                it.section_global = false;
                                // eslint-disable-next-line array-callback-return
                                it?.inputs?.map((subIt: any) => {
                                  subIt.is_global = false;
                                });
                              });
                            }
                            setFeilds(ques);
                            handleChange(event);
                          }}
                          onBlur={handleBlur}
                        >
                          <MenuItem value={"global"} key={"global"}>
                            {"For Global" || ""}
                          </MenuItem>
                          {countryData &&
                            !isEmpty(countryData) &&
                            countryData?.map((val: any) => {
                              return (
                                <MenuItem value={val?.country} key={val?._id}>
                                  {val?.country || ""}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                      {errors.country && touched.country && (
                        <ErrorTextStyle>{errors.country}</ErrorTextStyle>
                      )}
                    </Grid>
                    {values.country ? (
                      <Grid item xs={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel id="demo-select-small">
                            Currency
                          </InputLabel>
                          <Select
                            sx={{ minWidth: 100 }}
                            MenuProps={{
                              style: {
                                zIndex: 1000002,
                                maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
                              },
                            }}
                            size="small"
                            name="currency"
                            fullWidth
                            labelId="create-request"
                            label="Currency"
                            value={
                              values.country === "global"
                                ? "$"
                                : values.currency
                            }
                            onChange={(event: any) => handleChange(event)}
                            onBlur={handleBlur}
                          >
                            {values.country === "global" ? (
                              <MenuItem value="$" key="$">
                                {"$" || ""}
                              </MenuItem>
                            ) : (
                              !isEmpty(currency) &&
                              currency?.currency?.map((val: any) => {
                                return (
                                  <MenuItem value={val?.symbol} key={val?._id}>
                                    {val?.symbol || ""}
                                  </MenuItem>
                                );
                              })
                            )}
                          </Select>
                        </FormControl>
                        {errors.currency && touched.currency && (
                          <ErrorTextStyle>{errors.currency}</ErrorTextStyle>
                        )}
                      </Grid>
                    ) : null}
                    {values.country ? (
                      <Grid item xs={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel id="demo-select-small">
                            Select Unit
                          </InputLabel>
                          <Select
                            sx={{ minWidth: 100 }}
                            MenuProps={{
                              style: {
                                zIndex: 1000002,
                                maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
                              },
                            }}
                            size="small"
                            name="unit"
                            fullWidth
                            labelId="create-request"
                            label="Select Unit"
                            value={values.unit}
                            onChange={(event: any) => handleChange(event)}
                            onBlur={handleBlur}
                          >
                            {["km", "mile"].map((val: any) => {
                              return (
                                <MenuItem value={val} key={val}>
                                  {val || ""}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                        {errors.unit && touched.unit && (
                          <ErrorTextStyle>{errors.unit}</ErrorTextStyle>
                        )}
                      </Grid>
                    ) : null}
                  </Grid>

                  {isEmpty(values.country) ? null : (
                    <>
                      {feilds?.map((item: any, index: any) => {
                        let isGlobal = values.country === "global";
                        return (
                          <Grid
                            container
                            sx={commonStyle}
                            spacing={4}
                            style={{ position: "relative" }}
                          >
                            <Typography
                              sx={textCommon}
                              style={{ position: "absolute" }}
                            >
                              {item?.title || ""}
                            </Typography>

                            <Grid
                              sx={commonCheckBox}
                              style={{ position: "absolute" }}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={(e) =>
                                      onChangeValue(
                                        "main",
                                        "section_global",
                                        e.target.checked,
                                        index,
                                        0
                                      )
                                    }
                                    value={
                                      isGlobal
                                        ? true
                                        : item?.section_global || false
                                    }
                                    checked={
                                      isGlobal ? true : item?.section_global
                                    }
                                    size="small"
                                  />
                                }
                                label="Mark this Section as global use"
                              />
                            </Grid>
                            {item.is_add_category && (
                              <Grid item xs={12}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => addFormInput(index)}
                                >
                                  Add Category
                                </Button>
                              </Grid>
                            )}
                            {item?.inputs?.map((subItem: any, i: any) => {
                              if (
                                isEmpty(subItem.values) ||
                                subItem.emailError === true ||
                                subItem.phoneError === true ||
                                subItem.values > subItem?.max_range ||
                                subItem.error ||
                                subItem?.zeroErr
                              ) {
                                setFeildError(true);
                              } else {
                                setFeildError(false);
                              }
                              return (
                                <>
                                  {subItem?.input_slug === "manage_fees" ||
                                  isEmpty(subItem?.title) ? null : (
                                    <Grid item xs={3}>
                                      <Box>{subItem?.title || ""}</Box>
                                    </Grid>
                                  )}

                                  {isEmpty(subItem?.title) ? (
                                    <Grid
                                      item
                                      xs={12}
                                      sx={{ pl: "15px !important" }}
                                    >
                                      <Grid
                                        container
                                        spacing={2}
                                        xs={12}
                                        sx={{ m: 0, width: "100%" }}
                                      >
                                        {/* remove button */}
                                        <Grid item>
                                          <Button
                                            color="error"
                                            size="small"
                                            variant="outlined"
                                            sx={{ minWidth: "30px", p: 0 }}
                                            onClick={() =>
                                              removeFormInput(index, subItem.id)
                                            }
                                          >
                                            <Remove />
                                          </Button>
                                        </Grid>
                                        <Grid item xs={2.5}>
                                          {subItem?.is_category && (
                                            <FormControl
                                              fullWidth
                                              size="small"
                                              error={
                                                isEmpty(
                                                  subItem.category_name
                                                ) && subItem.catError
                                                  ? true
                                                  : false
                                              }
                                            >
                                              <Select
                                                MenuProps={{
                                                  style: {
                                                    zIndex: 1000002,
                                                    maxHeight:
                                                      ITEM_HEIGHT * 7 +
                                                      ITEM_PADDING_TOP,
                                                  },
                                                }}
                                                size="small"
                                                fullWidth
                                                value={subItem?.category_name}
                                                onChange={(e) => {
                                                  onChangeValue(
                                                    "sub",
                                                    "category_name",
                                                    e.target.value,
                                                    index,
                                                    i
                                                  );
                                                }}
                                                onBlur={handleBlur}
                                              >
                                                {categoryList &&
                                                  !isEmpty(categoryList) &&
                                                  categoryList.map((fA) => {
                                                    return (
                                                      <MenuItem
                                                        // disabled={
                                                        //   isCat?.category_name ===
                                                        //   fA?.category_slug
                                                        // }
                                                        value={fA.category_slug}
                                                        key={fA._id}
                                                      >
                                                        {fA.name}
                                                      </MenuItem>
                                                    );
                                                  })}
                                              </Select>
                                              <FormHelperText>
                                                {isEmpty(
                                                  subItem.category_name
                                                ) && subItem.catError
                                                  ? subItem?.error_message ||
                                                    "Please select category"
                                                  : ""}
                                              </FormHelperText>
                                            </FormControl>
                                          )}
                                        </Grid>
                                        <Grid item xs={2}>
                                          {subItem?.category_name ? (
                                            <>
                                              <TextField
                                                error={
                                                  (subItem.min < 1 &&
                                                    subItem.minMaxError) ||
                                                  subItem.min >
                                                    subItem?.max_length ||
                                                  subItem.greaterVal
                                                    ? true
                                                    : false
                                                }
                                                helperText={
                                                  subItem.min < 1 &&
                                                  subItem.minMaxError
                                                    ? "Value must be greater than 0"
                                                    : subItem.greaterVal
                                                    ? subItem.greaterVal ||
                                                      "Minimum should be less than Maximum"
                                                    : subItem.min >
                                                      subItem?.max_length
                                                    ? `Value must be less than ${subItem?.max_length}`
                                                    : ""
                                                }
                                                label="Min donation"
                                                type="number"
                                                onWheel={(e: any) =>
                                                  e.target.blur()
                                                }
                                                onChange={(e) =>
                                                  onChangeValue(
                                                    "sub",
                                                    "min",
                                                    parseInt(e.target.value),
                                                    index,
                                                    i,
                                                    subItem
                                                  )
                                                }
                                                size="small"
                                                fullWidth
                                                defaultValue={subItem.min}
                                              />
                                            </>
                                          ) : null}
                                        </Grid>
                                        <Grid item xs={2}>
                                          {subItem?.category_name ? (
                                            <>
                                              <TextField
                                                error={
                                                  (subItem.max >
                                                    subItem?.max_length &&
                                                    subItem.minMaxError) ||
                                                  subItem.greater
                                                    ? true
                                                    : false
                                                }
                                                helperText={
                                                  subItem.max >
                                                    subItem?.max_length &&
                                                  subItem.minMaxError
                                                    ? `Value must be less than ${subItem?.max_length}`
                                                    : subItem.greater
                                                    ? subItem.greater
                                                    : ""
                                                }
                                                label="Max donation"
                                                type="number"
                                                onWheel={(e: any) =>
                                                  e.target.blur()
                                                }
                                                onChange={(e) =>
                                                  onChangeValue(
                                                    "sub",
                                                    "max",
                                                    parseInt(e.target.value),
                                                    index,
                                                    i,
                                                    subItem
                                                  )
                                                }
                                                size="small"
                                                fullWidth
                                                defaultValue={subItem.max}
                                              />
                                            </>
                                          ) : null}
                                        </Grid>
                                        <Grid item xs={4.5}>
                                          {subItem?.category_name ? (
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  onChange={(e) =>
                                                    onChangeValue(
                                                      "sub",
                                                      "is_global",
                                                      e.target.checked,
                                                      index,
                                                      i
                                                    )
                                                  }
                                                  value={
                                                    item?.is_global || false
                                                  }
                                                  checked={
                                                    item?.section_global ||
                                                    isGlobal
                                                      ? true
                                                      : subItem?.is_global
                                                  }
                                                  size="small"
                                                />
                                              }
                                              label={
                                                subItem.checkbox_lable || ""
                                              }
                                            />
                                          ) : null}
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  ) : null}
                                  {subItem?.input_type === "select" && (
                                    <Grid item xs={4}>
                                      <FormControl
                                        fullWidth
                                        size="small"
                                        error={
                                          isEmpty(subItem.values) &&
                                          subItem.error
                                            ? true
                                            : false
                                        }
                                      >
                                        <Select
                                          MenuProps={{
                                            style: {
                                              zIndex: 1000002,
                                              maxHeight:
                                                ITEM_HEIGHT * 7 +
                                                ITEM_PADDING_TOP,
                                            },
                                          }}
                                          size="small"
                                          fullWidth
                                          value={subItem?.values}
                                          onChange={(e) => {
                                            onChangeValue(
                                              "sub",
                                              "values",
                                              e.target.value,
                                              index,
                                              i
                                            );
                                          }}
                                          onBlur={handleBlur}
                                        >
                                          {!isEmpty(paymentGatewayData) &&
                                            paymentGatewayData?.map(
                                              (val: any) => {
                                                return (
                                                  <MenuItem
                                                    value={val?.name}
                                                    key={val?._id}
                                                  >
                                                    {val?.name || ""}
                                                  </MenuItem>
                                                );
                                              }
                                            )}
                                        </Select>
                                        <FormHelperText>
                                          {isEmpty(subItem.values) &&
                                          subItem.error
                                            ? subItem?.error_message
                                            : ""}
                                        </FormHelperText>
                                      </FormControl>
                                    </Grid>
                                  )}
                                  {subItem?.input_type === "radio" && (
                                    <Grid item xs={7}>
                                      <FormControl
                                        fullWidth
                                        size="small"
                                        error={
                                          isEmpty(subItem.values) &&
                                          subItem.error
                                            ? true
                                            : false
                                        }
                                      >
                                        <FormLabel id="demo-row-radio-buttons-group-label">
                                          {subItem?.title}
                                        </FormLabel>
                                        <RadioGroup
                                          row
                                          aria-labelledby="demo-row-radio-buttons-group-label"
                                          value={subItem.values}
                                          onChange={(e) => {
                                            onChangeValue(
                                              "sub",
                                              "values",
                                              e.target.value,
                                              index,
                                              i
                                            );
                                          }}
                                        >
                                          <FormControlLabel
                                            value="include"
                                            control={<Radio />}
                                            label={`Included`}
                                          />
                                          <FormControlLabel
                                            value="exclude"
                                            control={<Radio />}
                                            label={`Excluded`}
                                          />
                                        </RadioGroup>
                                      </FormControl>
                                    </Grid>
                                  )}
                                  {(subItem?.input_type === "number" ||
                                    subItem?.input_type === "string") && (
                                    <>
                                      {subItem?.is_phone ? (
                                        <Grid item xs={4}>
                                          <PhoneInput
                                            autoFormat={false}
                                            placeholder="Contact Number"
                                            countryCodeEditable={true}
                                            enableSearch={true}
                                            disableSearchIcon={true}
                                            value={subItem?.values || ""}
                                            onChange={(
                                              v: any,
                                              data: any,
                                              event: any
                                            ) => {
                                              onChangeValue(
                                                "sub",
                                                "values",
                                                event.target.value || "",
                                                index,
                                                i
                                              );
                                            }}
                                            inputStyle={{
                                              width: "100%",
                                              height: "37px",
                                            }}
                                            searchStyle={{ width: "90%" }}
                                          />
                                          <ErrorTextStyle>
                                            {isEmpty(subItem.values) &&
                                            subItem.error
                                              ? subItem?.error_message
                                              : subItem.phoneError &&
                                                subItem.is_phone
                                              ? subItem.phoneMsg
                                              : ""}
                                          </ErrorTextStyle>
                                        </Grid>
                                      ) : (
                                        <Grid item xs={4}>
                                          <TextField
                                            error={
                                              (isEmpty(subItem.values) &&
                                                subItem.error) ||
                                              subItem?.categoryErr
                                                ? true
                                                : (subItem.emailError &&
                                                    subItem.is_email) ||
                                                  subItem?.lessthanErr ||
                                                  subItem?.zeroErr ||
                                                  subItem?.lessRadius
                                                ? true
                                                : subItem.values >
                                                  subItem?.max_range
                                                ? true
                                                : false
                                            }
                                            helperText={
                                              isEmpty(subItem.values) &&
                                              subItem.error
                                                ? subItem?.error_message
                                                : subItem.emailError &&
                                                  subItem.is_email
                                                ? subItem.emailMsg
                                                : subItem.categoryErr
                                                ? subItem.categoryMsg
                                                : subItem?.zeroErr
                                                ? "Value must be greater than 0"
                                                : subItem?.lessthanErr
                                                ? subItem?.lessthamMsg
                                                : subItem?.lessRadius
                                                ? subItem?.lessRadiusMsg
                                                : subItem.values >
                                                  subItem?.max_range
                                                ? `Value must be less than ${subItem?.max_length}`
                                                : ""
                                            }
                                            sx={{ width: "100%" }}
                                            size="small"
                                            fullWidth
                                            type={subItem?.input_type}
                                            variant="outlined"
                                            onBlur={handleBlur}
                                            value={subItem?.values || ""}
                                            inputProps={{ minLength: 1 }}
                                            onChange={(e) =>
                                              onChangeValue(
                                                "sub",
                                                "values",
                                                e.target.value,
                                                index,
                                                i
                                              )
                                            }
                                          />
                                        </Grid>
                                      )}
                                    </>
                                  )}
                                  {!isEmpty(subItem?.title) ? (
                                    <Grid item xs={5}>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            onChange={(e) =>
                                              onChangeValue(
                                                "sub",
                                                "is_global",
                                                e.target.checked,
                                                index,
                                                i
                                              )
                                            }
                                            value={item?.is_global || false}
                                            checked={
                                              item?.section_global || isGlobal
                                                ? true
                                                : subItem?.is_global
                                            }
                                            size="small"
                                          />
                                        }
                                        label={subItem.checkbox_lable || ""}
                                      />
                                    </Grid>
                                  ) : null}
                                </>
                              );
                            })}
                          </Grid>
                        );
                      })}
                    </>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      width: "100%",
                      marginTop: 15,
                    }}
                  >
                    <LoadingButton
                      size="small"
                      variant="outlined"
                      color="success"
                      type="submit"
                      // disabled={btnLoad || feildError}
                      loading={btnLoad}
                    >
                      <IntlMessages id={type === "edit" ? "Update" : "Add"} />
                    </LoadingButton>
                  </div>
                  <AppConfirmDialog
                    open={confirmOnClose}
                    disabled={btnLoad}
                    loading={btnLoad}
                    from="draft"
                    onClose={() => {
                      setOpen(false);
                      setConfirmOnClose(false);
                      handleClose();
                    }}
                    Ytitle={"Save as Draft"}
                    Ntitle={"Discard"}
                    onDeny={() => setConfirmOnClose(false)}
                    onConfirm={() => submitData(values, "draft")}
                    title="Are you sure you want to leave?"
                    dialogTitle="Close Modal"
                  />
                </Form>
              );
            }}
          </Formik>
        </Box>
      </DialogSlide>

      <AppConfirmDialog
        open={openDltModal}
        disabled={dltLoad}
        loading={dltLoad}
        onDeny={() => {
          setDltLoad(false);
          setSelectedItem({});
          setModalClose(false);
          setOpenDltModal(false);
        }}
        onConfirm={() => deleteList(selectedItem)}
        title="Are you sure you want to delete this setting?"
        dialogTitle="Delete setting"
      />
    </AppsContainer>
  );
};

export default CommonSettings;
