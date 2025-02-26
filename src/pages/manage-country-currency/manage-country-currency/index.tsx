/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Form, Formik } from "formik";
import getSymbolFromCurrency from "currency-symbol-map";
import * as yup from "yup";
import {
  GridColumns,
  GridActionsCellItem,
  GridSortModel,
  getGridDateOperators,
  getGridStringOperators,
  getGridSingleSelectOperators,
} from "@mui/x-data-grid-pro";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  Breadcrumbs,
  Alert,
  Link as CLink,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { isArray, isEmpty } from "lodash";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import { AppConfirmDialog } from "@crema";
import IntlMessages from "@crema/utility/IntlMessages";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import { LoadingButton } from "@mui/lab";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import DialogSlide from "components/DialogSlide";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";

const { flag, code, name } = require("country-emoji");

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const SuggestionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.info.dark,
}));

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const validationSchema = yup.object({
  region: yup.string().required("Please select Region"),
  country: yup
    .string()
    .required("Country name is required")
    .min(2, "Name should be 2 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
  country_code: yup
    .string()
    .required("Enter Valid Country Code")
    .min(1, "Number should be 1 chars minimum."),
  status: yup.string().required("Please select Status"),
});

const style = { width: 500 };

const CountryCurrency = () => {
  const [countryCurrency, setCountryCurrency] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [open, setOpen] = React.useState(false);
  const [regionsData, setRegionsData] = React.useState([]);
  const [currencyData, setCurrencyData] = React.useState([]);
  const [list, setList] = useState<any>([]);

  let newArray = currencyData?.map((v: any) =>
    Object.assign(v, {
      symbol: getSymbolFromCurrency(v?.name || "USD"),
    })
  );

  const [listErr, setListErr] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [emojiName, setEmojiName] = useState<any>("❓");
  const [suggestionName, setSuggestionName] = useState<any>("");
  const [type, setType] = React.useState("");
  const [btnLoad, setBtnLoad] = useState(false);
  const [dltLoad, setDltLoad] = useState<boolean>(false);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const [keywords, setKeywords] = React.useState("");

  function NewBar() {
    return (
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
    );
  }

  //API For get Country Currency list
  async function getCountryCurrency(nData) {
    setCountryCurrency((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("currency/list", nData);
      if (res.success) {
        setCountryCurrency({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setCountryCurrency({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setCountryCurrency({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  //API For get Country Currency list
  async function getCurrency(nData?: any) {
    try {
      const res = await getApiData("currency/available", nData);
      if (res.success) {
        setCurrencyData(res.data);
      } else {
        setCurrencyData([]);
        toast.error(res.message);
      }
    } catch (error) {
      setCurrencyData([]);
      toast.error("Something went wrong");
    }
  }

  //API For get Country Currency list
  async function getRegionsList(nData?: any) {
    try {
      const res = await getApiData("region/list", nData);
      if (res.success) {
        getCurrency();
        getCountryCurrency({
          page: 1,
          search: keywords ? keywords : null,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
        setRegionsData(res.data);
      } else {
        setCountryCurrency((e) => ({ ...e, listsLoad: false }));
        setRegionsData([]);
        toast.error(res.message);
      }
    } catch (error) {
      setRegionsData([]);
      setCountryCurrency((e) => ({ ...e, listsLoad: false }));
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getRegionsList();
  }, []);

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.page = newPage + 1;
    flt.search = keywords ? keywords : null;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    flt.operator = "contains";
    getCountryCurrency(flt);
  }

  const strFilterOperators = getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value)
  );

  const dateFilterOperators = getGridDateOperators().filter(({ value }) =>
    ["is"].includes(value)
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
      field: "emoji",
      headerName: "Flag",
      width: 100,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: "country",
      headerName: "Country",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "region",
      headerName: "Region",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    // {
    //   field: "country_code",
    //   headerName: "ISO Code",
    //   minWidth: 100,
    //   flex: 1,
    //    filterOperators: strFilterOperators,
    // },
    {
      field: "currency",
      headerName: "Currency",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item) => {
        const name = item.value.map((f) => f.name);
        const symbol = item.value.map((f) => f.symbol);
        return (
          <Grid sx={{ width: "100%" }}>
            <Grid style={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ width: "50%" }}>Name:</Typography>
              <Typography>{name.join(", ") || ""}</Typography>
            </Grid>
            <Grid style={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ width: "50%" }}>Symbol:</Typography>
              <Typography>{symbol.join(", ") || ""}</Typography>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      filterOperators: singleSelectFilter,
      type: "singleSelect",
      valueOptions: ["Active", "Deactive"],
      renderCell: (item: any) => {
        return (
          <Chip
            style={{
              color: "#FFF",
              backgroundColor:
                item.value === "Active"
                  ? "#2e7d32" //success
                  : "#d32f2f", //default
            }}
            label={item?.value || "Deactive"}
            variant="outlined"
            size="small"
          />
        );
      },
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
              setList(item.row.currency);
              setType("edit");
              setEmojiName(
                item?.row?.emoji || flag(item?.row?.country) || "❓"
              );
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

  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(`currency/delete/${id}`, {}, "DELETE");
      if (res.success) {
        setOpen(false);
        getCountryCurrency({
          page: pagination?.page ? pagination?.page + 1 : 1 || 1,
          search: keywords ? keywords : null,
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

  async function submitData(data: any) {
    if (listErr) {
      return;
    } else {
      const cdata = {
        emoji: emojiName,
        country: data?.country,
        country_code: data?.country_code,
        status: data?.status,
        region: data.region,
        currency: list,
      };
      setBtnLoad(true);
      const id = selectedItem?.id;
      let url = "";
      if (type === "edit") {
        url = `currency/update/${id}`;
      } else {
        url = `currency/create`;
      }
      try {
        const resp = await getApiData(
          url,
          cdata,
          type === "edit" ? "PUT" : "POST"
        );
        if (resp.success) {
          toast.success(resp.message);
          setOpenModal(false);
          setType("");
          setList([]);
          setEmojiName("❓");
          setSuggestionName("");
          setSelectedItem({});
          getCountryCurrency({
            page: pagination?.page ? pagination?.page + 1 : 1 || 1,
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

  const handleClose = () => {
    setOpenModal(false);
    setType("");
    setEmojiName("❓");
    setSuggestionName("");
    setSelectedItem({});
    setList([]);
  };

  const MyChip = (props) => {
    return (
      <Chip
        avatar={<Avatar>{getSymbolFromCurrency(props?.label || "USD")}</Avatar>}
        {...props}
      />
    );
  };

  return (
    <AppsContainer
      title="Country Currency"
      fullView
      sxStyle={{
        margin: 0,
        padding: "10px 0px 10px 10px",
        "& .MuiDataGrid-menu": { zIndex: 1000002 },
      }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getCountryCurrency}
            setKeywords={setKeywords}
            keywords={keywords}
            sortModel={sortModel}
          />
        );
      }}
    >
      <AppsHeader>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <BreadWrapper>
            <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "20px 0px" }}>
              <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                Dashboards
              </Link>
              <Typography color="text.primary">Country Currency</Typography>
            </Breadcrumbs>
          </BreadWrapper>
          <Alert
            severity="info"
            sx={{
              alignItems: "center",
              p: "6px",
              "& .MuiAlert-icon": { p: 0, mr: "5px", fontSize: "18px" },
              "& .MuiAlert-message": { p: 0 },
            }}
          >
            Country currency code must be same as ADYEN Method. To learn more{" "}
            <CLink
              underline="hover"
              target="_blank"
              href="https://docs.adyen.com/development-resources/currency-codes"
            >
              Click here!
            </CLink>
          </Alert>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("clickk")}
        NewBar={NewBar}
        onChange={(event) => onChange(event)}
        row={countryCurrency?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={countryCurrency?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        keyword={keywords}
        sortModel={sortModel}
        getApiCall={getCountryCurrency}
        setSortModel={setSortModel}
      />

      <DialogSlide
        open={openModal}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle={
          type === "edit"
            ? "Update Country Currency"
            : "Create Country Currency"
        }
      >
        <Box sx={style}>
          <Formik
            validateOnChange={true}
            validationSchema={validationSchema}
            validate={(values) => {
              let errors: any = {};
              // eslint-disable-next-line eqeqeq
              if (code(flag(values.country)) == undefined) {
                errors.country = "Country is not valid";
              }
              return errors;
            }}
            initialValues={{
              country: selectedItem?.row?.country || "",
              country_code: code(selectedItem?.row?.country) || "",
              status: selectedItem?.row?.status || "",
              region: selectedItem?.row?.region || "",
            }}
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
                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-select-small">
                        Select Region
                      </InputLabel>
                      <Select
                        label="Select Region"
                        labelId="demo-select-small"
                        id="demo-select-small"
                        MenuProps={{ style: { zIndex: 1000002 } }}
                        size="small"
                        fullWidth
                        name="region"
                        value={values.region}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Select Region"
                      >
                        {regionsData &&
                          regionsData.length > 0 &&
                          regionsData.map((item: any) => (
                            <MenuItem key={item._id} value={item.region}>
                              {item.region}
                            </MenuItem>
                          ))}
                      </Select>
                      {errors.region && touched.region && (
                        <ErrorTextStyle>{errors.region}</ErrorTextStyle>
                      )}
                    </FormControl>
                  </Box>

                  <Box sx={{ mb: { xs: 3, xl: 4 }, position: "relative" }}>
                    {/* Autocomplete for select country name */}
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Country name"
                      name="country"
                      label="Country name"
                      variant="outlined"
                      onBlur={(event: any) => {
                        // eslint-disable-next-line eqeqeq
                        if (code(flag(event.target.value)) == undefined) {
                          setFieldError(
                            "country_code",
                            "Please enter valid country"
                          );
                        }
                        handleBlur(event);
                      }}
                      value={values.country}
                      onChange={(event) => {
                        setSuggestionName(name(flag(event.target.value)));
                        setEmojiName(flag(event.target.value) || "❓");
                        handleChange(event);
                        setFieldValue(
                          "country_code",
                          event.target.value
                            ? code(flag(event.target.value))
                            : ""
                        );
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {emojiName || "❓"}
                          </InputAdornment>
                        ),
                      }}
                    />
                    {suggestionName && (
                      <SuggestionStyle>
                        Related name: {suggestionName}
                      </SuggestionStyle>
                    )}
                    {errors.country && touched.country && (
                      <ErrorTextStyle>{errors.country}</ErrorTextStyle>
                    )}
                  </Box>

                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Country code"
                      name="country_code"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.country_code}
                      onChange={(event) => {
                        handleChange(event);
                        setFieldValue(
                          "country_code",
                          code(selectedItem?.row?.country)
                        );
                      }}
                    />
                    {errors.country_code && touched.country_code && (
                      <ErrorTextStyle>{errors.country_code}</ErrorTextStyle>
                    )}
                  </Box>

                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-select-small">
                        Select Status
                      </InputLabel>
                      <Select
                        label="Select Status"
                        labelId="demo-select-small"
                        id="demo-select-small"
                        MenuProps={{ style: { zIndex: 1000002 } }}
                        size="small"
                        fullWidth
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Status"
                      >
                        {[
                          { id: 0, name: "Deactive" },
                          { id: 1, name: "Active" },
                        ].map((item) => (
                          <MenuItem key={item.id} value={item.name}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.status && touched.status && (
                        <ErrorTextStyle>{errors.status}</ErrorTextStyle>
                      )}
                    </FormControl>
                  </Box>

                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <Autocomplete
                      multiple
                      limitTags={2}
                      id="multiple-limit-tags"
                      options={newArray}
                      filterSelectedOptions={true}
                      value={list}
                      onChange={(event: any, value: any) => {
                        if (isEmpty(value)) {
                          setListErr(true);
                        } else {
                          setListErr(false);
                        }
                        setList(value);
                      }}
                      renderTags={(tagValue, getTagProps) => {
                        return tagValue.map((option, index) => (
                          <MyChip
                            {...getTagProps({ index })}
                            label={option.name || ""}
                          />
                        ));
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.name === value.name
                      }
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Currency"
                          placeholder="Select Currency"
                        />
                      )}
                      size="small"
                      className="auto_complete"
                    />
                    {listErr && (
                      <ErrorTextStyle>
                        {"Please select currency"}
                      </ErrorTextStyle>
                    )}
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
                      disabled={btnLoad || emojiName === "❓"}
                      loading={btnLoad}
                      autoFocus
                      onClick={() => {
                        if (isEmpty(list)) {
                          setListErr(true);
                        } else {
                          setListErr(false);
                        }
                      }}
                    >
                      <IntlMessages id={type === "edit" ? "Update" : "Add"} />
                    </LoadingButton>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Box>
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
        title={`Are you sure you want to delete ${selectedItem?.row?.country} Country Currency?`}
        dialogTitle="Delete Currency"
      />
    </AppsContainer>
  );
};

export default CountryCurrency;
