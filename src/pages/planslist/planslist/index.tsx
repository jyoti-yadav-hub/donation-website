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
  InputAdornment,
} from "@mui/material";
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
import { LoadingButton } from "@mui/lab";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { AppConfirmDialog } from "@crema";
import DialogSlide from "components/DialogSlide";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
  description: yup
    .string()
    .required("Description is required")
    .min(3, "Description should be 3 chars minimum.")
    .max(250, "Maximum 250 characters allowed"),
  duration: yup
    .number()
    .required("Duration is required")
    .test(
      "Is positive?",
      "Value must be greater than 0!",
      (value: any) => value > 0
    )
    .min(1, "Duration should greater than 1."),
  duration_type: yup.string().required("Duration Type is required"),
  amount: yup
    .number()
    .required("Amount is required")
    .test(
      "Is positive?",
      "Value must be greater than 0!",
      (value: any) => value > 0
    )
    .min(1, "Value must be greater than 0!")
    .max(
      1000000,
      `Maximum ${new Intl.NumberFormat("en-IN", {
        maximumSignificantDigits: 3,
      }).format(1000000)} allowed`
    ),
  status: yup.string().required("Please select status"),
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

const PlansList = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [btnLoad, setBtnLoad] = useState(false);
  const [plansList, setPlansList] = React.useState<any>({
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

  //API For get plans list
  async function getPlansList(nData) {
    setPlansList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData(`plan/list`, nData);
      if (res.success) {
        setPlansList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setPlansList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setPlansList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getPlansList({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  //API For delete plans list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(`plan/delete/${id}`, "", "DELETE");
      if (res.success) {
        setOpen(false);
        getPlansList({
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

  //API For create/update plans list
  async function submitData(data: any) {
    setBtnLoad(true);
    const id = selectedItem?.id;
    let url = "";
    if (type === "edit") {
      url = `plan/update/${id}`;
    } else {
      url = `plan/create`;
    }
    try {
      const resp = await getApiData(
        url,
        data,
        type === "edit" ? "PUT" : "POST"
      );
      if (resp.success) {
        toast.success(resp.message);
        setOpenModal(false);
        setType("");
        setSelectedItem({});
        getPlansList({
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
      field: "title",
      headerName: "Title",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 400,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 200,
      flex: 1,
      type: "number",
      filterOperators: numberFiltOperator,
      valueGetter: (params: any) => `$${params?.value || 0}`,
    },
    {
      field: "duration",
      headerName: "Duration",
      minWidth: 200,
      flex: 1,
      type: "number",
      filterOperators: numberFiltOperator,
    },
    {
      field: "duration_type",
      headerName: "Duration Type",
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
      field: "status",
      headerName: "Status",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Chip
            style={{
              color: "#FFF",
              backgroundColor:
                item.value === "active"
                  ? "#2e7d32" //success
                  : item.value === "deactive"
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
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    getPlansList(flt);
  }

  const handleClose = () => {
    setOpenModal(false);
    setType("");
    setSelectedItem({});
  };

  return (
    <AppsContainer
      title="Plans"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getPlansList}
            setKeywords={setKeywords}
            keywords={keywords}
            sortModel={sortModel}
            from="plans"
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
              <Typography color="text.primary">Manage Plans</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={NewBar}
        onChange={(event) => onChange(event)}
        row={plansList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={plansList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getPlansList}
        setSortModel={setSortModel}
      />

      <DialogSlide
        open={openModal}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle={type === "edit" ? "Update Plan" : "Add New Plan"}
      >
        <Box sx={style}>
          <Formik
            validateOnChange={true}
            initialValues={{
              title: selectedItem?.row?.title || "",
              description: selectedItem?.row?.description || "",
              duration_type: selectedItem?.row?.duration_type || "",
              duration: selectedItem?.row?.duration || 0,
              amount: selectedItem?.row?.amount || 0,
              status: selectedItem?.row?.status || "",
            }}
            validate={(values) => {
              let errors: any = {};
              if (values.duration_type === "Yearly" && values.duration > 10) {
                errors.duration = "Duration must be less than 10";
              } else if (
                values.duration_type === "Monthly" &&
                values.duration > 12
              ) {
                errors.duration = "Duration must be less than 12";
              } else if (
                values.duration_type === "Days" &&
                values.duration > 31
              ) {
                errors.duration = "Duration must be less than 31";
              }
              return errors;
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              submitData(values);
            }}
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
                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Enter Title"
                      name="title"
                      label={<IntlMessages id="Title" />}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.title}
                      onChange={(event: any) => handleChange(event)}
                    />
                    {errors.title && touched.title && (
                      <ErrorTextStyle>{errors.title}</ErrorTextStyle>
                    )}
                  </Box>

                  <Box
                    sx={{
                      mb: { xs: 3, xl: 4 },
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <FormControl fullWidth size="small" sx={{ width: "48%" }}>
                      <InputLabel id="demo-select-small">
                        Duration Type
                      </InputLabel>
                      <Select
                        MenuProps={{ style: { zIndex: 1000002 } }}
                        name="duration_type"
                        value={values.duration_type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Duration Type"
                        placeholder="Duration Type"
                      >
                        {[
                          { id: "Days", name: "Days" },
                          { id: "Monthly", name: "Monthly" },
                          { id: "Yearly", name: "Yearly" },
                        ].map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.duration_type && touched.duration_type && (
                        <ErrorTextStyle>{errors.duration_type}</ErrorTextStyle>
                      )}
                    </FormControl>
                    <Box sx={{ width: "48%" }}>
                      <TextField
                        size="small"
                        type="number"
                        onWheel={(e: any) => e.target.blur()}
                        fullWidth
                        placeholder="Enter duration"
                        label={
                          <IntlMessages
                            id={`Duration ${
                              values.duration_type
                                ? `in ${
                                    values.duration_type === "Monthly"
                                      ? "months"
                                      : values.duration_type === "Yearly"
                                      ? "years"
                                      : "days"
                                  }`
                                : ""
                            }`}
                          />
                        }
                        name="duration"
                        variant="outlined"
                        onBlur={(e) => {
                          if (isEmpty(e.target.value)) {
                            setFieldValue("duration", 0);
                          }
                          handleBlur(e);
                        }}
                        onChange={handleChange}
                        value={values.duration}
                      />
                      {errors.duration && touched.duration && (
                        <ErrorTextStyle>{errors.duration}</ErrorTextStyle>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <TextField
                      name="description"
                      value={values.description}
                      onChange={(event: any) => {
                        const str = event.target.value.replace(/\s\s+/g, " ");
                        setTimeout(() => {
                          setFieldValue("description", str);
                        }, 150);
                        handleChange(event);
                      }}
                      onBlur={(event: any) => {
                        setFieldValue("description", values.description.trim());
                        handleBlur(event);
                      }}
                      variant="outlined"
                      fullWidth
                      inputProps={{ maxLength: 250 }}
                      helperText={`${values.description.length} / 250`}
                      minRows={3}
                      maxRows={5}
                      multiline={true}
                      label="Enter Description"
                      placeholder="Enter Description"
                    />
                    {errors.description && touched.description && (
                      <ErrorTextStyle>{errors.description}</ErrorTextStyle>
                    )}
                  </Box>

                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <TextField
                      size="small"
                      type="number"
                      onWheel={(e: any) => e.target.blur()}
                      fullWidth
                      placeholder="Enter amount"
                      label="Amount"
                      name="amount"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      onBlur={(event: any) => {
                        handleBlur(event);
                        setFieldValue(
                          "amount",
                          Number(event.target.value.replace(/^0+/, ""))
                        );
                      }}
                      onChange={handleChange}
                      value={values.amount}
                    />
                    {errors.amount && touched.amount && (
                      <ErrorTextStyle>{errors.amount}</ErrorTextStyle>
                    )}
                  </Box>

                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-select-small">Status</InputLabel>
                      <Select
                        MenuProps={{ style: { zIndex: 1000002 } }}
                        fullWidth
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Status"
                        label="Status"
                      >
                        {[
                          { id: "active", name: "Active" },
                          { id: "deactive", name: "Deactive" },
                        ].map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.status && touched.status && (
                        <ErrorTextStyle>{errors.status}</ErrorTextStyle>
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
        title="Are you sure you want to delete this Plan?"
        dialogTitle="Delete Plan"
      />
    </AppsContainer>
  );
};

export default PlansList;
