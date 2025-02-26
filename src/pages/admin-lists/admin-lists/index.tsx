/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  Breadcrumbs,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  circularProgressClasses,
} from "@mui/material";
import {
  GridActionsCellItem,
  GridColumns,
  GridSortModel,
  getGridDateOperators,
  getGridStringOperators,
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
import DialogSlide from "components/DialogSlide";
import { Form, Formik } from "formik";
import * as yup from "yup";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";
import { AppState } from "redux/store";

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

const emailRegex =
  /[a-z0-9]+@[a-z]+\.(com|org|edu|mil|net|gov|co|in|io|ai|ca|dev|me|co.in|co.uk)\b$/;

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
  email: yup
    .string()
    .required("Email is required")
    .min(5, "email should be 5 chars minimum.")
    .max(50, "Maximum 50 characters allowed")
    .matches(emailRegex, "Enter correct email"),
  role: yup.string().required("Role is required"),
});

const AdminLists = () => {
  const { userData } = useSelector<AppState, AppState["AuthData"]>(
    ({ AuthData }) => AuthData
  );
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [adminsList, setAdminLists] = React.useState<any>({
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
  const [btnLoad, setBtnLoad] = useState(false);
  const [btnDisable, setBtnDsiable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function NewBar() {
    return (
      <Box>
        <Button
          size="small"
          onClick={() => {
            console.log("click---");
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

  //API For check email exist or not
  async function checkEmailAction(email: any) {
    setBtnDsiable(true);
    setIsLoading(true);
    try {
      let data = {};
      if (type === "edit") {
        data = { email: email, id: userData?._id };
      } else {
        data = { email: email };
      }
      const res = await getApiData(`admin/check-email`, data, "POST");
      if (res.success) {
        setBtnDsiable(false);
      } else {
        setBtnDsiable(true);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setBtnDsiable(false);
      console.log("delete error", error);
      toast.error("Something went wrong");
    }
  }

  //API For get admins list
  async function getAdmins(nData: any) {
    setAdminLists((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("admin/list", nData);
      if (res.success) {
        setAdminLists({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setAdminLists({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setAdminLists({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getAdmins({
      page: 1,
      search: keywords ? keywords : null,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  //API For create/update Course / Disease
  async function submitData(data: any) {
    setBtnLoad(true);
    const id = selectedItem?.id;
    let url = "";
    if (type === "edit") {
      url = `admin/update-profile/${id}`;
    } else {
      url = `admin/create`;
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
        setBtnDsiable(false);
        getAdmins({
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

  //API For delete admin from list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(`admin/delete/${id}`, "", "DELETE");
      if (res.success) {
        setOpen(false);
        getAdmins({
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
      filterable: false,
    },
    {
      field: "name",
      headerName: "Admin Name",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "email",
      headerName: "Admin Email",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
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
    getAdmins(flt);
  }

  const handleClose = () => {
    setOpenModal(false);
    setType("");
    setSelectedItem({});
    setBtnDsiable(false);
  };

  return (
    <AppsContainer
      title="Admins"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getAdmins}
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
              <Typography color="text.primary">Admins</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={NewBar}
        onChange={(event) => onChange(event)}
        row={adminsList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={adminsList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getAdmins}
        keyword={keywords}
        setSortModel={setSortModel}
      />

      <DialogSlide
        open={openModal}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle={type === "edit" ? "Update Admin" : "Add Admin"}
      >
        <Box sx={style}>
          <Formik
            validateOnChange={true}
            initialValues={{
              name: selectedItem?.row?.name || "",
              email: selectedItem?.row?.email || "",
              password: selectedItem?.row?.password || "",
              role: selectedItem?.row?.role || "",
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
                  {/* Admin Name */}
                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <TextField
                      size="small"
                      autoFocus
                      fullWidth
                      placeholder="Enter Name"
                      name="name"
                      label="Enter Name"
                      variant="outlined"
                      onBlur={(event: any) => {
                        setFieldValue("name", values.name.trim());
                        handleBlur(event);
                      }}
                      value={values.name}
                      onChange={(event) => {
                        handleChange(event);
                        setFieldValue(
                          "name",
                          event.target.value.replace(/  +/g, " ")
                        );
                      }}
                    />
                    {errors.name && touched.name && (
                      <ErrorTextStyle>{errors.name}</ErrorTextStyle>
                    )}
                  </Box>
                  {/* Admin Email */}
                  <Box sx={{ mb: { xs: 3, xl: 4 }, position: "relative" }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Enter Email"
                      name="email"
                      label="Enter Email"
                      variant="outlined"
                      onBlur={(event: any) => {
                        setFieldValue("email", values.email.trim());
                        handleBlur(event);
                      }}
                      value={values.email}
                      onChange={(event) => {
                        if (isEmpty(errors.email)) {
                          checkEmailAction(event.target.value);
                        }
                        handleChange(event);
                        setFieldValue(
                          "email",
                          event.target.value.replace(/  +/g, " ")
                        );
                      }}
                    />
                    {errors.email && touched.email ? (
                      <ErrorTextStyle>{errors.email}</ErrorTextStyle>
                    ) : btnDisable ? (
                      <ErrorTextStyle>Email already exist!</ErrorTextStyle>
                    ) : null}
                    {isLoading && (
                      <Box sx={{ position: "absolute", right: 10, top: 10 }}>
                        <Box sx={{ position: "relative" }}>
                          <CircularProgress
                            variant="determinate"
                            sx={{
                              color: (theme) =>
                                theme.palette.grey[
                                  theme.palette.mode === "light" ? 200 : 800
                                ],
                            }}
                            size={15}
                            thickness={3}
                            {...props}
                            value={100}
                          />
                          <CircularProgress
                            variant="indeterminate"
                            disableShrink
                            sx={{
                              color: (theme) =>
                                theme.palette.mode === "light"
                                  ? "#1a90ff"
                                  : "#308fe8",
                              animationDuration: "550ms",
                              position: "absolute",
                              left: 0,
                              [`& .${circularProgressClasses.circle}`]: {
                                strokeLinecap: "round",
                              },
                            }}
                            size={15}
                            thickness={3}
                            {...props}
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                  {/* Admin Password */}
                  {type === "edit" ? null : (
                    <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Enter Password"
                        name="password"
                        label="Enter Password"
                        variant="outlined"
                        onBlur={(event: any) => {
                          setFieldValue("password", values.password.trim());
                          handleBlur(event);
                        }}
                        value={values.password}
                        onChange={(event) => {
                          handleChange(event);
                          setFieldValue(
                            "password",
                            event.target.value.replace(/  +/g, " ")
                          );
                        }}
                      />
                    </Box>
                  )}
                  {/* Admin Role */}
                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-select-small">
                        Select Role
                      </InputLabel>
                      <Select
                        MenuProps={{ style: { zIndex: 1000002 } }}
                        size="small"
                        fullWidth
                        name="role"
                        labelId="create-request"
                        label="Select Role"
                        value={values.role}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      >
                        {[
                          { id: "admin", name: "Admin" },
                          { id: "subadmin", name: "Sub Admin" },
                          { id: "manager", name: "Manager" },
                        ].map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>

                      {errors.role && touched.role && (
                        <ErrorTextStyle>{errors.role}</ErrorTextStyle>
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
                      disabled={btnLoad || btnDisable || isLoading}
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
        title="Are you sure you want to delete this course?"
        dialogTitle="Delete course"
      />
    </AppsContainer>
  );
};

export default AdminLists;
