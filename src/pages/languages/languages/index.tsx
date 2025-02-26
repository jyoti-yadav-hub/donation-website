/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  Typography,
  Breadcrumbs,
  Grid,
  TextField,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import {
  getGridDateOperators,
  getGridStringOperators,
  GridActionsCellItem,
  GridColumns,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import { getCountryLists } from "commonFunction";
import { styled } from "@mui/material/styles";
import IntlMessages from "@crema/utility/IntlMessages";
import { isArray, isEmpty } from "lodash";
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
const { flag, code } = require("country-emoji");

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  language: yup
    .string()
    .required("Language name is required")
    .min(3, "Language name should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
  language_specific_name: yup
    .string()
    .required("Enter language specific name")
    .min(3, "Name should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
  status: yup.string().required("Please select Status"),
});

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const style = { width: 600 };

const LanguagesList = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [btnLoad, setBtnLoad] = useState(false);
  const [languageList, setLanguageList] = React.useState<any>({
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
  const [keywords, setKeywords] = React.useState("");
  const [countryData, setCountryData] = useState<any>([]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    style: { zIndex: 1000002 },
    PaperProps: {
      style: {
        zIndex: 1000002,
        maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

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

  //API For get language list
  async function getLanguageList(nData) {
    setLanguageList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData(`language/admin/list`, nData);
      if (res.success) {
        setLanguageList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
        // await getCountryLists(setCountryData);
      } else {
        setLanguageList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setLanguageList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getLanguageList({
      page: 1,
      search: keywords ? keywords : null,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  //API For delete language list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(`language/delete/${id}`, "", "DELETE");
      if (res.success) {
        setOpen(false);
        getLanguageList({
          page: 1,
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

  //API For create/update language list
  async function submitData(data: any) {
    const cData = {
      ...data,
      // country_code: data?.country?.map((it: any) => code(flag(it))),
    };
    setBtnLoad(true);
    const id = selectedItem?.id;
    let url = "";
    if (type === "edit") {
      url = `language/update/${id}`;
    } else {
      url = `language/create`;
    }
    try {
      const resp = await getApiData(
        url,
        cData,
        type === "edit" ? "PUT" : "POST"
      );
      if (resp.success) {
        toast.success(resp.message);
        setOpenModal(false);
        setType("");
        setSelectedItem({});
        getLanguageList({
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
      minWidth: 200,
      hide: true,
      flex: 1,
      filterable: false,
    },
    {
      field: "language",
      headerName: "Language",
      minWidth: 250,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "language_specific_name",
      headerName: "Language Specific Name",
      minWidth: 400,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    // {
    //   field: "country",
    //   headerName: "Country",
    //   minWidth: 300,
    //   flex: 1,
    //   renderCell: (item: any) => {
    //     return (
    //       <>
    //         {item?.value
    //           ? item?.value?.map((it: any, index: number) => {
    //               return (
    //                 <Chip
    //                   sx={{
    //                     mt: 1,
    //                     mr: index !== item?.value?.length - 1 ? 1 : 0,
    //                   }}
    //                   label={it.charAt(0).toUpperCase() + it.slice(1) || "-"}
    //                   size="small"
    //                 />
    //               );
    //             })
    //           : null}
    //       </>
    //     );
    //   },
    //   filterOperators: strFilterOperators,
    // },
    // {
    //   field: "country_code",
    //   headerName: "Country Codes",
    //   minWidth: 300,
    //   flex: 1,
    //   renderCell: (item: any) => {
    //     return (
    //       <>
    //         {item?.value
    //           ? item?.value?.map((it: any, index: number) => {
    //               return (
    //                 <Chip
    //                   sx={{
    //                     mt: 1,
    //                     mr: index !== item?.value?.length - 1 ? 1 : 0,
    //                   }}
    //                   label={it.charAt(0).toUpperCase() + it.slice(1) || "-"}
    //                   size="small"
    //                 />
    //               );
    //             })
    //           : null}
    //       </>
    //     );
    //   },
    //   filterOperators: strFilterOperators,
    // },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Chip
            style={{
              color: "#FFF",
              backgroundColor:
                item.value === "Active"
                  ? "#2e7d32" //success
                  : item.value === "Deactive"
                  ? "#d32f2f" //error
                  : "#ebebeb", //default
            }}
            label={
              item?.value.charAt(0).toUpperCase() + item?.value.slice(1) || ""
            }
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
      field: "createdBy",
      headerName: "Created By",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) => (params?.value ? params?.value : "-"),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      minWidth: 200,
      flex: 1,
      filterOperators: dateFilterOperators,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
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
    flt.page = newPage + 1;
    flt.search = keywords ? keywords : null;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    flt.operator = "contains";
    getLanguageList(flt);
  }

  const handleClose = () => {
    setOpenModal(false);
    setType("");
    setSelectedItem({});
  };

  return (
    <AppsContainer
      title="Languages"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getLanguageList}
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
              <Typography color="text.primary">Languages</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={NewBar}
        onChange={(event) => onChange(event)}
        row={languageList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={languageList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getLanguageList}
        keyword={keywords}
        setSortModel={setSortModel}
      />

      <DialogSlide
        open={openModal}
        onDeny={handleClose}
        onClose={handleClose}
        dialogContentStyle={{
          "& .MuiDialogContent-root": {
            padding: "0px 0px 20px 0px !important",
          },
        }}
        dialogTitle={type === "edit" ? "Update Language" : "Add New Language"}
      >
        <Box sx={style}>
          <Formik
            validateOnChange={true}
            initialValues={{
              language: selectedItem?.row?.language || "",
              language_specific_name:
                selectedItem?.row?.language_specific_name || "",
              // country: selectedItem?.row?.country || [],
              status: selectedItem?.row?.status || "",
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
              } = props;
              return (
                <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                  <Grid
                    container
                    spacing={4}
                    sx={{ m: 0, width: "100%", pr: 4 }}
                  >
                    {/* <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-select-small">
                          Select country
                        </InputLabel>
                        <Select
                          MenuProps={MenuProps}
                          multiple
                          size="small"
                          name="country"
                          fullWidth
                          labelId="create-request"
                          label="Select country"
                          value={values.country}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
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
                    </Grid> */}
                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Enter Language"
                        name="language"
                        label={"Enter Language"}
                        variant="outlined"
                        onBlur={(event: any) => {
                          const str = event.target.value.replace(/\s\s+/g, " ");
                          const trimStr = str.trim();
                          setFieldValue("language", trimStr);
                          handleBlur(event);
                        }}
                        value={values.language}
                        onChange={handleChange}
                        autoFocus
                      />
                      {errors.language && touched.language && (
                        <ErrorTextStyle>{errors.language}</ErrorTextStyle>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Enter language specific name"
                        name="language_specific_name"
                        label={"Enter language specific name"}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={(event: any) => {
                          const str = event.target.value.replace(/\s\s+/g, " ");
                          const trimStr = str.trim();
                          setFieldValue("language_specific_name", trimStr);
                          handleBlur(event);
                        }}
                        value={values.language_specific_name}
                      />
                      {errors.language_specific_name &&
                        touched.language_specific_name && (
                          <ErrorTextStyle>
                            {errors.language_specific_name}
                          </ErrorTextStyle>
                        )}
                    </Grid>
                    <Grid item xs={12}>
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
                    </Grid>
                    <Grid item xs={12}>
                      <Alert
                        severity="info"
                        sx={{
                          backgroundColor: "#E5F6FD",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: { lg: "10px", xl: "12px" },
                          border: "1px solid #0288d1",
                          color: "#0288d1",
                          padding: "0px 5px",
                          "& .MuiAlert-icon": {
                            color: "#0288d1",
                            mr: "5px",
                          },
                        }}
                      >
                        If you don't select any country, then this language will
                        be visible to all countries
                      </Alert>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "flex-end" }}
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
                    </Grid>
                  </Grid>
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
        title="Are you sure you want to delete this Language?"
        dialogTitle="Delete Language"
      />
    </AppsContainer>
  );
};

export default LanguagesList;
