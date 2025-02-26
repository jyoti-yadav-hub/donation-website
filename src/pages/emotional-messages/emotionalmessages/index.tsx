/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  Chip,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Breadcrumbs,
  TextField,
  Avatar,
} from "@mui/material";
import {
  GridActionsCellItem,
  GridColumns,
  GridSortModel,
  getGridDateOperators,
  getGridStringOperators,
  getGridSingleSelectOperators,
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
import { apiCallWithFile } from "shared/helpers/utility";
import moment from "moment";
import UploadModern from "pages/thirdParty/reactDropzone/components/UploadModern";
import PreviewThumb from "pages/thirdParty/reactDropzone/components/PreviewThumb";
import { useDropzone } from "react-dropzone";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";
import MediaViewer from "@crema/core/AppMedialViewer";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  category_slug: yup.string().required("Select category"),
  type: yup.string().required("Select type"),
  message: yup
    .string()
    .required("Enter message")
    .min(20, "Message should be 20 chars minimum.")
    .max(250, "Maximum 250 characters allowed"),
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

const EmotionalMessages = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [btnLoad, setBtnLoad] = useState(false);
  const [categoryList, setCategoryList] = React.useState<any[]>([]);
  const [messageList, setMessageList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [errObj, setErrObj] = useState({
    file: false,
    fileContent: "",
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const [btnDisable, setBtnDisable] = useState<boolean>(false);
  const [keywords, setKeywords] = React.useState("");
  const [fileName, setFileName] = useState<any>("");
  const [index, setIndex] = useState(-1);
  const [imgUrl, setImgUrl] = React.useState("");

  const onClose = () => {
    setIndex(-1);
    setImgUrl("");
  };

  //API For Upload image
  async function handleImageUpload(data: any) {
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
        setFileName(resp.data.file_name);
      } else {
        setBtnDisable(false);
        toast.error(resp.message);
      }
    } catch (error) {
      setBtnDisable(false);
      setBtnLoad(false);
      console.log("error====", error);
      toast.error("Something went wrong");
    }
  }

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

  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const dropzone = useDropzone({
    accept: "image/jpeg, image/png, image/jpg",
    multiple: false,
    onDrop: (acceptedFiles: any) => {
      setUploadedFiles(
        // eslint-disable-next-line array-callback-return
        acceptedFiles.map((file: any) => {
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        })
      );
      handleImageUpload(acceptedFiles[0]);
    },
  });

  useEffect(() => {
    setUploadedFiles(dropzone.acceptedFiles);
  }, [dropzone.acceptedFiles]);

  const onDeleteUploadFile = (file: any) => {
    dropzone.acceptedFiles.splice(dropzone.acceptedFiles.indexOf(file), 1);
    setUploadedFiles([...dropzone.acceptedFiles]);
  };

  //API for get categories
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
      console.log("error====", error);
      setCategoryList([]);
      toast.error("Something went wrong");
    }
  }

  //API For get message list
  async function getMessageList(nData) {
    setMessageList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("emotional-message/list", nData);
      if (res.success) {
        setMessageList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setMessageList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setMessageList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getMessageList({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
    onGetCategoryList();
  }, []);

  //API For delete messages from list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(
        `emotional-message/delete/${id}`,
        "",
        "DELETE"
      );
      if (res.success) {
        setOpen(false);
        getMessageList({
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

  //API For create/update message
  async function submitData(data: any) {
    if (isEmpty(uploadedFiles) && data?.type === "image") {
      setErrObj({
        ...errObj,
        file: true,
        fileContent: "Upload file",
      });
    } else {
      let cData = {};
      if (data?.type === "text") {
        cData = { ...data, removeFile: true };
      } else {
        cData = { ...data, image: fileName };
      }
      setErrObj({
        ...errObj,
        file: false,
        fileContent: "",
      });
      setBtnLoad(true);
      const id = selectedItem?.id;
      let url = "";
      if (type === "edit") {
        url = `emotional-message/update/${id}`;
      } else {
        url = `emotional-message/create`;
      }
      try {
        const resp = await getApiData(
          url,
          cData,
          type === "edit" ? "PUT" : "POST"
        );
        if (resp.success) {
          if (resp.message) {
            toast.success(resp.message);
          } else {
            toast.success(
              type === "edit"
                ? "Message update successfully!"
                : "Message created successfully!"
            );
          }
          setOpenModal(false);
          setType("");
          setUploadedFiles([]);
          setSelectedItem({});
          getMessageList({
            page: 1,
            sort: sortModel[0].field,
            sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
          });
          setBtnLoad(false);
        } else {
          toast.error(resp.message || "Something went wrong");
        }
        setBtnLoad(false);
      } catch (error) {
        setBtnLoad(false);
        console.log("error====", error);
        toast.error("Something went wrong");
      }
    }
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
      filterable: false,
    },
    {
      field: "type",
      headerName: "Type",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {item?.row?.image ? (
              <div
                onClick={() => {
                  setImgUrl(item?.row?.image);
                  setIndex(item?.row?.image ? 0 : -1);
                }}
              >
                <Avatar
                  sx={{
                    padding: 5,
                    backgroundColor: "rgb(255, 255, 255)",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    mr: 1,
                  }}
                >
                  <img
                    src={item?.row?.image || "/assets/images/defaultimage.png"}
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
            ) : null}
            <Typography sx={{ fontSize: 12 }}>
              {item?.value?.charAt(0).toUpperCase() + item?.value?.slice(1) ||
                "-"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "message",
      headerName: "Message",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "category_slug",
      headerName: "Category",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) =>
        params?.value?.charAt(0).toUpperCase() + params?.value?.slice(1) || "-",
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
      type: "singleSelect",
      valueOptions: ["Active", "Deactive"],
      filterOperators: singleSelectFilter,
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
            label={item.value}
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
      filterOperators: dateFilterOperators,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
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
              setUploadedFiles(
                !isEmpty(item?.row?.image) ? [item?.row?.image] : []
              );
              const filename = item?.row?.image?.substring(
                item?.row?.image?.lastIndexOf("/") + 1
              );
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

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    getMessageList(flt);
  }

  const handleClose = () => {
    setOpenModal(false);
    setBtnLoad(false);
    setType("");
    setUploadedFiles([]);
    setSelectedItem({});
    setErrObj({ file: false, fileContent: "" });
  };

  return (
    <AppsContainer
      title="Emotional Messages"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getMessageList}
            setKeywords={setKeywords}
            keywords={keywords}
            sortModel={sortModel}
            from="emotionalMsg"
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
              <Typography color="text.primary">Emotional Messages</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={NewBar}
        onChange={(event) => onChange(event)}
        row={messageList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={messageList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getMessageList}
        setSortModel={setSortModel}
      />

      <DialogSlide
        open={openModal}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle={
          type === "edit" ? "Update Message" : "Add Emotional Message"
        }
      >
        <Box sx={style}>
          <Formik
            validateOnChange={true}
            initialValues={{
              category_slug: selectedItem?.row?.category_slug || "",
              type: selectedItem?.row?.type || "",
              message: selectedItem?.row?.message || "",
              status: selectedItem?.row?.status || "",
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
                        name="category_slug"
                        value={values.category_slug}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {categoryList &&
                          !isEmpty(categoryList) &&
                          categoryList.map((fA) => {
                            return (
                              <MenuItem value={fA.category_slug} key={fA._id}>
                                {fA.name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      {errors.category_slug && touched.category_slug && (
                        <ErrorTextStyle>{errors.category_slug}</ErrorTextStyle>
                      )}
                    </FormControl>
                  </Box>
                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-select-small">
                        Select type
                      </InputLabel>
                      <Select
                        MenuProps={{ style: { zIndex: 1000002 } }}
                        size="small"
                        fullWidth
                        name="type"
                        labelId="create-request"
                        label="Select type"
                        value={values.type}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      >
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="image">Image</MenuItem>
                      </Select>
                    </FormControl>
                    {errors.type && touched.type && (
                      <ErrorTextStyle>{errors.type}</ErrorTextStyle>
                    )}
                  </Box>

                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <TextField
                      name="message"
                      value={values.message}
                      onChange={(event: any) => handleChange(event)}
                      onBlur={(event: any) => {
                        const str = event.target.value.replace(/\s\s+/g, " ");
                        setFieldValue("message", str.trim());
                        handleBlur(event);
                      }}
                      variant="outlined"
                      fullWidth
                      inputProps={{ maxLength: 250 }}
                      helperText={`${values.message.length} / 250`}
                      minRows={3}
                      maxRows={5}
                      multiline={true}
                      label="Enter message"
                      placeholder="Enter message"
                    />
                    {errors.message && touched.message && (
                      <ErrorTextStyle>{errors.message}</ErrorTextStyle>
                    )}
                  </Box>

                  {values?.type === "image" && (
                    <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                      {isEmpty(uploadedFiles) ? (
                        <UploadModern
                          infoMsg=""
                          uploadText="Click to select file"
                          dropzone={dropzone}
                        />
                      ) : (
                        <Box sx={{ position: "relative" }}>
                          {btnDisable ? <AppLoader /> : null}
                          <AppGrid
                            data={uploadedFiles}
                            column={0}
                            itemPadding={2}
                            renderRow={(file, index) => (
                              <PreviewThumb
                                btnStyle={{}}
                                sxStyle={{
                                  width: 350,
                                  maxWidth: 500,
                                  height: 200,
                                  opacity: btnDisable ? 0.5 : 1,
                                }}
                                file={
                                  type === "edit" ? { preview: file } : file
                                }
                                onDeleteUploadFile={onDeleteUploadFile}
                                key={index + file.path}
                              />
                            )}
                          />
                        </Box>
                      )}
                      {errObj.file && (
                        <ErrorTextStyle>{errObj.fileContent}</ErrorTextStyle>
                      )}
                    </Box>
                  )}

                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-select-small">
                        Select status
                      </InputLabel>
                      <Select
                        MenuProps={{ style: { zIndex: 1000002 } }}
                        size="small"
                        fullWidth
                        name="status"
                        labelId="create-request"
                        label="Select status"
                        value={values.status}
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                    </FormControl>
                    {errors.status && touched.status && (
                      <ErrorTextStyle>{errors.status}</ErrorTextStyle>
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
                      disabled={btnDisable || btnLoad}
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
        title="Are you sure you want to delete this message?"
        dialogTitle="Delete message"
      />

      <MediaViewer
        index={index}
        medias={[imgUrl].map((data) => {
          return {
            url: data,
            mime_type: "image/*",
          };
        })}
        onClose={onClose}
      />
    </AppsContainer>
  );
};

export default EmotionalMessages;
