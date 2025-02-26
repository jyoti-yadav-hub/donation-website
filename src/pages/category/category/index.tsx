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
  Avatar,
  Tab,
  alpha,
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
import { isArray, isEmpty, isNull } from "lodash";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { AppConfirmDialog, AppGrid, AppLoader } from "@crema";
import DialogSlide from "components/DialogSlide";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";
import { useDropzone } from "react-dropzone";
import { apiCallWithFile } from "shared/helpers/utility";
import UploadModern from "pages/thirdParty/reactDropzone/components/UploadModern";
import PreviewThumb from "pages/thirdParty/reactDropzone/components/PreviewThumb";
import MediaViewer from "@crema/core/AppMedialViewer";
import { Fonts } from "shared/constants/AppEnums";
const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Category is required")
    .min(3, "Category should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
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

const CategoryList = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [btnLoad, setBtnLoad] = useState(false);
  const [btnDisable, setBtnDisable] = useState<boolean>(false);
  const [fileName, setFileName] = useState<any>("");
  const [actionOpen, setActionOpen] = React.useState("");
  const [categoryList, setCategoryList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [requestedCat, setRequestedCat] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [imgUrl, setImgUrl] = React.useState("");
  const [index, setIndex] = useState(-1);
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const [keywords, setKeywords] = React.useState("");
  const [subCategory, setSubCategory] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const [tab, setTab] = React.useState("list");
  // Add your style here
  const styles = {
    tableDiv: {
      "& .MuiDataGrid-root": {
        height: "675px",
      },
    },
  };
  //API For Upload icon
  async function handleImageUpload(data: any) {
    setBtnDisable(true);
    const formData = new FormData();
    formData.append("file", data);
    try {
      const resp = await apiCallWithFile(`user/upload-file`, formData, "post");
      if (resp.status) {
        setBtnDisable(false);
        setFileName(resp.data.file_name);
      } else {
        setBtnDisable(false);
        toast.error(resp.message);
      }
    } catch (error) {
      setBtnDisable(false);
      setBtnLoad(false);
      toast.error("Something went wrong");
    }
  }

  const dropzone = useDropzone({
    accept: "image/jpeg, image/png, image/jpg",
    multiple: false,
    onDrop: (acceptedFiles) => {
      setUploadedFiles(
        // eslint-disable-next-line array-callback-return
        acceptedFiles.map((file) => {
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        })
      );
      handleImageUpload(acceptedFiles[0]);
    },
  });
  function NewBar() {
    return (
      <Button
        size="small"
        onClick={() => {
          setType("new");
          setUploadedFiles([]);
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
  const onDeleteUploadFile = async (file: any) => {
    dropzone.acceptedFiles.splice(dropzone.acceptedFiles.indexOf(file), 1);
    setUploadedFiles([...dropzone.acceptedFiles]);
    const resp = await getApiData(
      `user/remove-file?file=${fileName}`,
      {},
      "delete"
    );
    if (resp.success) {
      setFileName("");
    } else {
      toast.error(resp.message);
    }
  };
  //API For get Category list
  async function getCategory(nData) {
    setCategoryList((e) => ({ ...e, listsLoad: true }));
    try {
      if (nData["sort"]) {
        nData["onSort"] = nData["sort"];
      }
      if (nData["sort_type"]) {
        nData["sortType"] = nData["sort_type"];
      }
      const res = await getApiData(`category/list`, nData);
      if (res.success) {
        setCategoryList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setCategoryList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setCategoryList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  async function getUsersCategory(nData) {
    setCategoryList((e) => ({ ...e, listsLoad: true }));
    try {
      if (nData["sort"]) {
        nData["onSort"] = nData["sort"];
      }
      if (nData["sort_type"]) {
        nData["sortType"] = nData["sort_type"];
      }
      const res = await getApiData(`category/userCategories`, nData);
      if (res.success) {
        setRequestedCat({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setRequestedCat({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setCategoryList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  async function tabChnaged($e, newData) {
    try {
      setTab(newData);
      if (newData === "request") {
        getUsersCategory({
          page: 1,
          onSort: sortModel[0].field,
          sortType: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
      } else {
        getCategory({
          page: 1,
          onSort: sortModel[0].field,
          sortType: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    let finalFilter = {
      page: 1,
      onSort: sortModel[0].field,
      sortType: sortModel[0]?.sort === "asc" ? 1 : -1,
    };
    if (tab === "request") {
      getUsersCategory(finalFilter);
    } else {
      getCategory(finalFilter);
    }
    setUploadedFiles(dropzone.acceptedFiles);
  }, [dropzone.acceptedFiles]);

  //API For delete Category list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(`category/delete/${id}`, "", "DELETE");
      if (res.success) {
        setOpen(false);
        getCategory({
          page: 1,
          onSort: sortModel[0].field,
          sortType: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
        setSelectedItem({});
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setDltLoad(false);
    } catch (error) {
      setDltLoad(false);
      toast.error("Something went wrong");
    }
  }

  //API For create/update Category list
  async function submitData(data: any) {
    setBtnLoad(true);
    const id = selectedItem?.id;
    let url = "";
    if (type === "edit") {
      url = `category/update/${id}`;
    } else {
      url = `category/create`;
    }
    try {
      const resp = await getApiData(
        url,
        { ...data, image: fileName },
        type === "edit" ? "PUT" : "POST"
      );
      if (resp.success) {
        toast.success(resp.message);
        setOpenModal(false);
        setType("");
        setFileName("");
        setUploadedFiles([]);
        setSelectedItem({});
        getCategory({
          page: 1,
          search: keywords ? keywords : null,
          onSort: sortModel[0].field,
          sortType: sortModel[0]?.sort === "asc" ? 1 : -1,
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
      filterOperators: strFilterOperators,
    },
    {
      field: "image",
      headerName: "Image",
      width: 150,
      filterOperators: strFilterOperators,
      disableColumnMenu: true,
      renderCell: (item: any) => {
        return (
          <div
            onClick={() => {
              setImgUrl(item.value);
              setIndex(item.value ? 0 : -1);
            }}
          >
            <Avatar
              sx={{
                padding: 5,
                backgroundColor: "rgb(255, 255, 255)",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              <img
                src={item.value || "/assets/images/defaultimage.png"}
                alt={"title"}
                style={{
                  borderRadius: 5,
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  maxWidth: "fit-content",
                }}
              />
            </Avatar>
          </div>
        );
      },
    },
    {
      field: "name",
      headerName: "Category",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
    },
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
      field: "createdBy",
      headerName: "Created By",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) => (params?.value ? params?.value : "-"),
    },
    {
      field: "updatedBy",
      headerName: "Updated By",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) => (params?.value ? params?.value : "-"),
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
              const filename = item?.row?.image?.substring(
                item?.row?.image?.lastIndexOf("/") + 1
              );
              if (!isEmpty(item?.row?.image) && !isNull(item?.row?.image)) {
                setUploadedFiles([
                  { name: filename, preview: item?.row?.image },
                ]);
              }
              setOpenModal(true);
              setType("edit");
              setFileName(filename);
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

  const columns2: GridColumns = [
    {
      field: "_id",
      headerName: "ID",
      hide: true,
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "image",
      headerName: "Image",
      width: 150,
      filterOperators: strFilterOperators,
      disableColumnMenu: true,
      renderCell: (item: any) => {
        return (
          <div
            onClick={() => {
              setImgUrl(item.value);
              setIndex(item.value ? 0 : -1);
            }}
          >
            <Avatar
              sx={{
                padding: 5,
                backgroundColor: "rgb(255, 255, 255)",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              <img
                src={item.value || "/assets/images/defaultimage.png"}
                alt={"title"}
                style={{
                  borderRadius: 5,
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  maxWidth: "fit-content",
                }}
              />
            </Avatar>
          </div>
        );
      },
    },
    {
      field: "name",
      headerName: "Category",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "user_name",
      headerName: "User Name",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) => (params?.value ? params?.value : "-"),
    },
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
                  : item.value === "Pending"
                  ? "red" //error
                  : item.value === "Draft"
                  ? "yellow" //error
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
      minWidth: 150,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    // {
    //   field: "actions",
    //   type: "actions",
    //   headerName: "Actions",
    //   width: 210,
    //   cellClassName: "actions",
    //   renderCell: (item: any) => {
    //     return [
    //       item.row.status === "reject" ? null : (
    //         <Button
    //           size="small"
    //           fullWidth
    //           sx={{
    //             backgroundColor: (theme) =>
    //               alpha(theme.palette.success.main, 0.1),
    //             color: "success.main",
    //             fontWeight: Fonts.LIGHT,
    //             "&:hover, &:focus": {
    //               backgroundColor: (theme) =>
    //                 alpha(theme.palette.success.main, 0.15),
    //               color: "success.main",
    //             },
    //             mr: item.row.status === "reject" ? 0 : 1,
    //           }}
    //           onClick={() => {
    //             console.log("called2")
    //             setActionOpen("approve");
    //           }}
    //           disabled={btnLoad || item.row.status === "approve"}
    //         >
    //           {item.row.status === "approve"
    //             ? "Approved"
    //             : item.row.status === "deactive"
    //             ? "Activate"
    //             : "Approve"}
    //         </Button>
    //       ),
    //       <Button
    //         fullWidth
    //         size="small"
    //         sx={{
    //           backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1),
    //           color: "error.main",
    //           fontWeight: Fonts.LIGHT,
    //           "&:hover, &:focus": {
    //             backgroundColor: (theme) =>
    //               alpha(theme.palette.error.main, 0.15),
    //             color: "error.main",
    //           },
    //           ml: item.row.status === "reject" ? 0 : 1,
    //         }}
    //         onClick={() => {
    //           console.log("called")
    //           if (item.row.status === "approve") {
    //             setActionOpen("deactive");
    //           } else {
    //             console.log("done")
    //           }
    //         }}
    //         disabled={
    //           btnLoad ||
    //           item.row.status === "reject" ||
    //           item.row.status === "deactive"
    //         }
    //       >
    //         {item.row.status === "reject"
    //           ? "Rejected"
    //           : item.row.status === "approve"
    //           ? "Deactivate"
    //           : item.row.status === "deactive"
    //           ? "Deactivated"
    //           : "Reject"}
    //       </Button>,
    //     ];
    //   },
    // },
  ];

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.onSort = sortModel[0].field;
    flt.sortType = sortModel[0]?.sort === "asc" ? 1 : -1;
    if (tab === "list") {
      getCategory(flt);
    } else {
      getUsersCategory(flt);
    }
  }

  const handleClose = () => {
    setOpenModal(false);
    setType("");
    setSelectedItem({});
  };

  return (
    <AppsContainer
      title="Category"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px", ...styles.tableDiv }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={tab === "list" ? getCategory : getUsersCategory}
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
              <Typography color="text.primary">Category</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={($event, newEve) => tabChnaged($event, newEve)}
            aria-label="lab API tabs example"
          >
            <Tab label="Events" value="list" />
            <Tab label="Received" value="request" />
          </TabList>
        </Box>
        <TabPanel value="list">
          <CTable
            initialState={{ pinnedColumns: { right: ["actions"] } }}
            onRowClick={() => console.log("click")}
            NewBar={NewBar}
            onChange={(event) => onChange(event)}
            row={categoryList?.lists}
            column={columns}
            rowCount={pagination.total}
            page={pagination.page}
            listsLoad={categoryList?.listsLoad}
            checkboxSelection={false}
            onSelectionModelChange={() => console.log("row select")}
            sortModel={sortModel}
            getApiCall={getCategory}
            setSortModel={setSortModel}
          />
        </TabPanel>
        <TabPanel value="request">
          <CTable
            initialState={{ pinnedColumns: { right: ["actions"] } }}
            onRowClick={() => console.log("click")}
            NewBar={""}
            onChange={(event) => onChange(event)}
            row={requestedCat?.lists}
            column={columns2}
            rowCount={pagination.total}
            page={pagination.page}
            listsLoad={requestedCat?.listsLoad}
            checkboxSelection={false}
            onSelectionModelChange={() => console.log("row select")}
            sortModel={sortModel}
            getApiCall={getUsersCategory}
            setSortModel={setSortModel}
          />
        </TabPanel>
      </TabContext>

      <DialogSlide
        open={openModal}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle={type === "edit" ? "Update Category" : "Add New Category"}
      >
        <Box sx={style}>
          <Formik
            validateOnChange={true}
            initialValues={{
              name: selectedItem?.row?.name || "",
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
                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    {isEmpty(uploadedFiles) ? (
                      <UploadModern
                        sxStyle={{ marginBottom: "0px !important" }}
                        // infoMsg="Icon must be in square"
                        uploadText="Upload Icon"
                        dropzone={dropzone}
                      />
                    ) : (
                      <Box sx={{ position: "relative" }}>
                        {btnDisable ? <AppLoader /> : null}
                        <AppGrid
                          sx={{ width: "100%" }}
                          data={uploadedFiles}
                          column={0}
                          itemPadding={2}
                          renderRow={(file, index) => {
                            if (!isEmpty(file)) {
                              let temp = file.name
                                ? file.name.split(".")
                                : null;
                              let ext =
                                temp != null ? temp[temp.length - 1] : "";
                              let editType =
                                type === "edit" ? false : true || false;
                              return (
                                <PreviewThumb
                                  sxStyle={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 10,
                                    opacity: btnDisable ? 0.5 : 1,
                                  }}
                                  file={
                                    type === "edit"
                                      ? { preview: file }
                                      : file || ""
                                  }
                                  // isEdit={editType}
                                  fileExt={ext}
                                  onDeleteUploadFile={onDeleteUploadFile}
                                  key={index + file.path}
                                />
                              );
                            }
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Enter Name"
                      name="name"
                      autoFocus
                      label={<IntlMessages id="Name" />}
                      variant="outlined"
                      onBlur={(event: any) => {
                        const str = event.target.value.replace(/\s\s+/g, " ");
                        const trimStr = str.trim();
                        setFieldValue("name", trimStr);
                        handleBlur(event);
                      }}
                      value={values.name}
                      onChange={(event: any) => handleChange(event)}
                    />
                    {errors.name && touched.name && (
                      <ErrorTextStyle>{errors.name}</ErrorTextStyle>
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
                          { id: "Active", name: "Active" },
                          { id: "Deactive", name: "Deactive" },
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
        title="Are you sure you want to delete this Category?"
        dialogTitle="Delete Category"
      />
    </AppsContainer>
  );
};

export default CategoryList;
