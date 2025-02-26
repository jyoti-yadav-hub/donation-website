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
import { getSlug } from "components/getSlug";
import { useDropzone } from "react-dropzone";
import { apiCallWithFile } from "shared/helpers/utility";
import UploadModern from "pages/thirdParty/reactDropzone/components/UploadModern";
import PreviewThumb from "pages/thirdParty/reactDropzone/components/PreviewThumb";
import MediaViewer from "@crema/core/AppMedialViewer";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name should be 3 chars minimum.")
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
const styles = {
  tableDiv: {
    "& .MuiDataGrid-root": {
      height: "675px",
    },
  },
};
const SubCategory = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [btnLoad, setBtnLoad] = useState(false);
  const [subCategory, setSubCategory] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [nameValue, setNameValue] = React.useState("");
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const [keywords, setKeywords] = React.useState("");
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const [btnDisable, setBtnDisable] = useState<boolean>(false);
  const [fileName, setFileName] = useState<any>("");
  const [index, setIndex] = useState(-1);
  const [imgUrl, setImgUrl] = React.useState("");
  const [categoryList, setCategoryList] = React.useState<any[]>([]);
  const [tab, setTab] = React.useState("list");
  const [userSubCategories, setuserSubCategories] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });

  const onClose = () => {
    setIndex(-1);
    setImgUrl("");
  };

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

  //API for get categories lists
  async function onGetCategoryList() {
    try {
      const resp = await getApiData(`category/list`, { allData: 1 }, "GET");
      if (resp.success) {
        setCategoryList(isArray(resp.data) ? resp.data : []);
      } else {
        setCategoryList([]);
        toast.error(resp.message);
      }
    } catch (error) {
      setCategoryList([]);
      toast.error("Something went wrong");
    }
  }

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

  useEffect(() => {
    setUploadedFiles(dropzone.acceptedFiles);
  }, [dropzone.acceptedFiles]);

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

  //API For get Sub Category list
  async function getSubCategoryList(nData) {
    setSubCategory((e) => ({ ...e, listsLoad: true }));
    try {
      if (nData["sort"]) {
        nData["onSort"] = nData["sort"];
      }
      if (nData["sort_type"]) {
        nData["sortType"] = nData["sort_type"];
      }
      const res = await getApiData(`sub-category/list`, nData);
      if (res.success) {
        setSubCategory({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
        onGetCategoryList();
      } else {
        setSubCategory({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setSubCategory({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }
  async function getUsersSubCategory(nData) {
    setuserSubCategories((e) => ({ ...e, listsLoad: true }));
    try {
      if (nData["sort"]) {
        nData["onSort"] = nData["sort"];
      }
      if (nData["sort_type"]) {
        nData["sortType"] = nData["sort_type"];
      }
      let finalObj = {};
      Object.assign(finalObj, {
        userList: 1,
        ...nData,
      });
      const res = await getApiData(`sub-category/list`, finalObj, "GET");
      if (res.success) {
        setuserSubCategories({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setuserSubCategories({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setuserSubCategories({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  async function tabChnaged($e, newData) {
    try {
      setTab(newData);
      if (newData === "request") {
        getUsersSubCategory({
          page: 1,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
      } else {
        getSubCategoryList({
          page: 1,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (tab === "request") {
      getUsersSubCategory({
        page: 1,
        search: keywords ? keywords : null,
        sort: sortModel[0].field,
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
      });
    } else {
      getSubCategoryList({
        page: 1,
        search: keywords ? keywords : null,
        sort: sortModel[0].field,
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
      });
    }
  }, []);

  //API For delete sub category from list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(`sub-category/delete/${id}`, "", "DELETE");
      if (res.success) {
        setOpen(false);
        getSubCategoryList({
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
      toast.error("Something went wrong");
    }
  }

  //API For create/update sub category in list
  async function submitData(data: any) {
    setBtnLoad(true);
    const id = selectedItem?.id;
    let url = "";
    if (type === "edit") {
      url = `sub-category/update/${id}`;
    } else {
      url = `sub-category/create`;
    }
    const cData = { ...data, image: fileName };
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
        setNameValue("");
        setFileName("");
        setUploadedFiles([]);
        setSelectedItem({});
        getSubCategoryList({
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
      field: "image",
      headerName: "Icon",
      width: 150,
      filterable: false,
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
      headerName: "Category Name",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
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
              const filename = item?.row?.image?.substring(
                item?.row?.image?.lastIndexOf("/") + 1
              );
              if (!isEmpty(item?.row?.image) && !isNull(item?.row?.image)) {
                setUploadedFiles([
                  { name: filename, preview: item?.row?.image },
                ]);
              }
              setNameValue(item?.row?.slug);
              setOpenModal(true);
              setType("edit");
              setSelectedItem(item);
              setFileName(filename);
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
      filterable: false,
    },
    {
      field: "image",
      headerName: "Image",
      width: 150,
      filterable: false,
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
      headerName: "Category Name",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "User Name",
      headerName: "Created By",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) => (params?.value ? params?.value : "-"),
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
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
  ];

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.page = newPage + 1;
    flt.search = keywords ? keywords : null;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    flt.operator = "contains";
    if (tab === "list") {
      getSubCategoryList(flt);
    } else {
      getUsersSubCategory(flt);
    }
  }

  const handleClose = () => {
    setOpenModal(false);
    setType("");
    setNameValue("");
    setSelectedItem({});
    setUploadedFiles([]);
    setFileName("");
  };

  return (
    <AppsContainer
      title="Sub Category"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px", ...styles.tableDiv }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={
              tab === "list" ? getSubCategoryList : getUsersSubCategory
            }
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
              <Typography color="text.primary">Sub Category</Typography>
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
            <Tab label="List" value="list" />
            <Tab label="Received" value="request" />
          </TabList>
        </Box>
        <TabPanel value="list">
          <CTable
            initialState={{ pinnedColumns: { right: ["actions"] } }}
            onRowClick={() => console.log("click")}
            NewBar={NewBar}
            onChange={(event) => onChange(event)}
            row={subCategory?.lists}
            column={columns}
            rowCount={pagination.total}
            page={pagination.page}
            listsLoad={subCategory?.listsLoad}
            checkboxSelection={false}
            onSelectionModelChange={() => console.log("row select")}
            sortModel={sortModel}
            getApiCall={getSubCategoryList}
            setSortModel={setSortModel}
          />
        </TabPanel>
        <TabPanel value="request">
          <CTable
            initialState={{ pinnedColumns: { right: ["actions"] } }}
            onRowClick={() => console.log("click")}
            NewBar={""}
            onChange={(event) => onChange(event)}
            row={userSubCategories?.lists}
            column={columns2}
            rowCount={pagination.total}
            page={pagination.page}
            listsLoad={userSubCategories?.listsLoad}
            checkboxSelection={false}
            onSelectionModelChange={() => console.log("row select")}
            sortModel={sortModel}
            getApiCall={getUsersSubCategory}
            setSortModel={setSortModel}
          />
        </TabPanel>
      </TabContext>

      <DialogSlide
        open={openModal}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle={
          type === "edit" ? "Update Sub Category" : "Add New Sub Category"
        }
      >
        <Box sx={style}>
          <Formik
            validateOnChange={true}
            initialValues={{
              name: selectedItem?.row?.name || "",
              status: selectedItem?.row?.status || "",
              category_id: selectedItem?.row?.category_id || "",
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
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-select-small">
                        Select category
                      </InputLabel>
                      <Select
                        label="Select category"
                        labelId="demo-select-small"
                        id="demo-select-small"
                        MenuProps={{
                          style: {
                            zIndex: 1000002,
                            maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
                          },
                        }}
                        size="small"
                        fullWidth
                        name="category_id"
                        value={values.category_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {categoryList &&
                          !isEmpty(categoryList) &&
                          categoryList.map((fA) => {
                            return (
                              <MenuItem value={fA._id} key={fA.name}>
                                {fA.name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      {errors.category_id && touched.category_id && (
                        <ErrorTextStyle>{errors.category_id}</ErrorTextStyle>
                      )}
                    </FormControl>
                  </Box>

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
                            let temp = file.name ? file.name.split(".") : null;
                            let ext = temp != null ? temp[temp.length - 1] : "";
                            let editType =
                              type === "edit" ? false : true || false;
                            if (!isEmpty(file)) {
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
                                  onDeleteUploadFile={onDeleteUploadFile}
                                  key={index + file.path}
                                  // isEdit={editType}
                                  fileExt={ext}
                                />
                              );
                            }
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  {/* Sub Category Name */}
                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <TextField
                      disabled={type === "edit"}
                      size="small"
                      fullWidth
                      placeholder="Enter Sub Category Name"
                      name="name"
                      label={<IntlMessages id="Sub Category Name" />}
                      variant="outlined"
                      onBlur={(event: any) => {
                        const str = event.target.value.replace(/\s\s+/g, " ");
                        const trimStr = str.trim();
                        setFieldValue("name", trimStr);
                        handleBlur(event);
                      }}
                      value={values.name}
                      onChange={(event: any) => {
                        handleChange(event);
                        if (type !== "edit") {
                          const newVal = getSlug(event.target.value);
                          setNameValue(newVal);
                          setFieldValue("slug", newVal);
                        }
                      }}
                      autoFocus={type !== "edit"}
                    />
                    {errors.name && touched.name && (
                      <ErrorTextStyle>{errors.name}</ErrorTextStyle>
                    )}
                  </Box>

                  {/* Status */}
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
        title="Are you sure you want to delete this Sub Category?"
        dialogTitle="Delete Sub Category"
      />

      <MediaViewer
        index={index}
        medias={[imgUrl].map((data) => {
          return { url: data, mime_type: "image/*" };
        })}
        onClose={onClose}
      />
    </AppsContainer>
  );
};

export default SubCategory;
