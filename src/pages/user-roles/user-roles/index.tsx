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

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
  description: yup
    .string()
    .required("Description is required")
    .min(3, "Description should be 3 chars minimum.")
    .max(500, "Maximum 500 characters allowed"),
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

const UserRoles = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [btnLoad, setBtnLoad] = useState(false);
  const [userRoles, setUserRoles] = React.useState<any>({
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
  const [uploadedWebFiles, setUploadedWebFiles] = useState<any>([]);
  const [btnDisable, setBtnDisable] = useState<boolean>(false);
  const [fileName, setFileName] = useState<any>("");
  const [webfileName, setWebFileName] = useState<any>("");
  const [index, setIndex] = useState(-1);
  const [imgUrl, setImgUrl] = React.useState("");

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
      handleImageUpload(acceptedFiles[0],'app');
    },
  });

  const dropzoneWeb = useDropzone({
    accept: "image/jpeg, image/png, image/jpg",
    multiple: false,
    onDrop: (acceptedFiles) => {
      setUploadedWebFiles(
        // eslint-disable-next-line array-callback-return
        acceptedFiles.map((file) => {
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        })
      );
      handleImageUpload(acceptedFiles[0],'web');
    },
  });

  //API For Upload icon
  async function handleImageUpload(data: any,type:any) {
    setBtnDisable(true);
    const formData = new FormData();
    formData.append("file", data);
    try {
      const resp = await apiCallWithFile(
        `request/upload-file`,
        formData,
        "post"
      );
      if (resp.status) {
        setBtnDisable(false);
        if(type === "app"){
          setFileName(resp.data.file_name);
        } else {
          setWebFileName(resp.data.file_name);
        }
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
    setUploadedWebFiles(dropzoneWeb.acceptedFiles);
  }, [dropzone.acceptedFiles,dropzoneWeb.acceptedFiles]);

  const onDeleteUploadFile = (file: any) => {
    dropzone.acceptedFiles.splice(dropzone.acceptedFiles.indexOf(file), 1);
    setUploadedFiles([...dropzone.acceptedFiles]);
  };

  const onDeleteUploadWebFile = (file: any) => {
    dropzoneWeb.acceptedFiles.splice(dropzoneWeb.acceptedFiles.indexOf(file), 1);
    setUploadedWebFiles([...dropzoneWeb.acceptedFiles]);
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

  //API For get user roles list
  async function getUserRolesList(nData) {
    setUserRoles((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData(`role/admin/list`, nData);
      if (res.success) {
        setUserRoles({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setUserRoles({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setUserRoles({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getUserRolesList({
      page: 1,
      search: keywords ? keywords : null,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  //API For delete user role from list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(`role/delete/${id}`, "", "DELETE");
      if (res.success) {
        setOpen(false);
        getUserRolesList({
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

  //API For create/update user role in list
  async function submitData(data: any) {
    setBtnLoad(true);
    const id = selectedItem?.id;
    let url = "";
    if (type === "edit") {
      url = `role/update/${id}`;
    } else {
      url = `role/create`;
    }
    const cData = { ...data, icon: fileName,web_icon: webfileName };
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
        setWebFileName("");
        setUploadedFiles([]);
        setUploadedWebFiles([]);
        setSelectedItem({});
        getUserRolesList({
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
      field: "icon",
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
      field: "web_icon",
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
      headerName: "Role Name",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "slug",
      headerName: "Slug",
      minWidth: 200,
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
      field: "index",
      headerName: "Index",
      minWidth: 150,
      flex: 1,
      type: "number",
      filterOperators: numberFiltOperator,
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
              const filename = item?.row?.icon?.substring(
                item?.row?.icon?.lastIndexOf("/") + 1
              );
              const webfilename = item?.row?.web_icon?.substring(
                item?.row?.web_icon?.lastIndexOf("/") + 1
              );
              setNameValue(item?.row?.slug);
              setOpenModal(true);
              setType("edit");
              setSelectedItem(item);
              setFileName(filename);
              setWebFileName(webfilename);
              setUploadedFiles(item?.row?.icon ? [item?.row?.icon] : []);
              setUploadedWebFiles(item?.row?.web_icon ? [item?.row?.web_icon] : []);
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
    getUserRolesList(flt);
  }

  const handleClose = () => {
    setOpenModal(false);
    setType("");
    setNameValue("");
    setSelectedItem({});
    setUploadedFiles([]);
    setUploadedWebFiles([]);
    setFileName("");
    setWebFileName("");
  };

  return (
    <AppsContainer
      title="User Roles"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getUserRolesList}
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
              <Typography color="text.primary">User Roles</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={NewBar}
        onChange={(event) => onChange(event)}
        row={userRoles?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={userRoles?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getUserRolesList}
        setSortModel={setSortModel}
      />

      <DialogSlide
        open={openModal}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle={type === "edit" ? "Update Role" : "Add New Role"}
      >
        <Box sx={style}>
          <Formik
            validateOnChange={true}
            initialValues={{
              name: selectedItem?.row?.name || "",
              slug: nameValue || "",
              status: selectedItem?.row?.status || "",
              description: selectedItem?.row?.description || "",
              index: selectedItem?.row?.index || "",
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
                              return (
                                <PreviewThumb
                                  isEdit={type === "edit"}
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
                                />
                              );
                            }
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    {isEmpty(uploadedWebFiles) ? (
                      <UploadModern
                        sxStyle={{ marginBottom: "0px !important" }}
                        // infoMsg="Icon must be in square"
                        uploadText="Upload Website Icon"
                        dropzone={dropzoneWeb}
                      />
                    ) : (
                      <Box sx={{ position: "relative" }}>
                        {btnDisable ? <AppLoader /> : null}
                        <AppGrid
                          sx={{ width: "100%" }}
                          data={uploadedWebFiles}
                          column={0}
                          itemPadding={2}
                          renderRow={(file, index) => {
                            if (!isEmpty(file)) {
                              return (
                                <PreviewThumb
                                  isEdit={type === "edit"}
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
                                  onDeleteUploadFile={onDeleteUploadWebFile}
                                  key={index + file.path}
                                />
                              );
                            }
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  {/* Role Name */}
                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <TextField
                      disabled={type === "edit"}
                      size="small"
                      fullWidth
                      placeholder="Enter Role Name"
                      name="name"
                      label={<IntlMessages id="Role Name" />}
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
                      autoFocus
                    />
                    {errors.name && touched.name && (
                      <ErrorTextStyle>{errors.name}</ErrorTextStyle>
                    )}
                  </Box>

                  {/* slug */}
                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <TextField
                      size="small"
                      fullWidth
                      disabled
                      placeholder="Enter slug"
                      label={<IntlMessages id="Slug" />}
                      name="slug"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={nameValue}
                    />
                  </Box>

                  {/* Description */}
                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <TextField
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={(event: any) => {
                        const str = event.target.value.replace(/\s\s+/g, " ");
                        const trimStr = str.trim();
                        setFieldValue("description", trimStr);
                        handleBlur(event);
                      }}
                      variant="outlined"
                      fullWidth
                      inputProps={{ maxLength: 500 }}
                      helperText={`${values.description.length} / 500`}
                      minRows={3}
                      maxRows={5}
                      multiline={true}
                      label="Role Description"
                      placeholder="Description"
                    />
                    {errors.description && touched.description && (
                      <ErrorTextStyle>{errors.description}</ErrorTextStyle>
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

                  {/* index */}
                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      onWheel={(e: any) => e.target.blur()}
                      placeholder="Provide index"
                      name="index"
                      label={"Provide index"}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.index}
                      onChange={handleChange}
                    />
                    {errors.index && touched.index && (
                      <ErrorTextStyle>{errors.index}</ErrorTextStyle>
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
        title="Are you sure you want to delete this Role?"
        dialogTitle="Delete Role"
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

export default UserRoles;
