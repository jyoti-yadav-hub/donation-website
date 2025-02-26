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
  Avatar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  GridActionsCellItem,
  GridColumns,
  GridSortModel,
  getGridDateOperators,
  getGridStringOperators,
  getGridNumericColumnOperators,
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
import { useDropzone } from "react-dropzone";
import { apiCallWithFile } from "shared/helpers/utility";
import PreviewThumb from "pages/thirdParty/reactDropzone/components/PreviewThumb";
import UploadModern from "pages/thirdParty/reactDropzone/components/UploadModern";
import MediaViewer from "@crema/core/AppMedialViewer";

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  view_type: yup.string().required("Select view type"),
  index: yup.number().integer().required("Please add index"),
});

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const style = { width: 500 };

const ImagesList = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [btnLoad, setBtnLoad] = useState(false);
  const [imagesLists, setImagesList] = React.useState<any>({
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
  const [btnDisable, setBtnDisable] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const [fileName, setFileName] = useState<any>("");
  const [imageErr, setImageErr] = useState<boolean>(false);
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

  useEffect(() => {
    setUploadedFiles(dropzone.acceptedFiles);
  }, [dropzone.acceptedFiles]);

  const onDeleteUploadFile = (file: any) => {
    dropzone.acceptedFiles.splice(dropzone.acceptedFiles.indexOf(file), 1);
    setUploadedFiles([...dropzone.acceptedFiles]);
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

  //API For get images list
  async function getImagesLists(nData) {
    setImagesList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData(`images/list`, nData);
      if (res.success) {
        setImagesList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setImagesList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setImagesList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getImagesLists({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  //API For delete images list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(`images/delete/${id}`, "", "DELETE");
      if (res.success) {
        setOpen(false);
        getImagesLists({
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

  //API For create/update images list
  async function submitData(data: any) {
    if (isEmpty(uploadedFiles)) {
      setImageErr(true);
    } else {
      setImageErr(false);
      setBtnLoad(true);
      const id = selectedItem?.id;
      let url = "";
      if (type === "edit") {
        url = `images/update/${id}`;
      } else {
        url = `images/create`;
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
          setSelectedItem({});
          setUploadedFiles([]);
          setFileName("");
          getImagesLists({
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
      field: "_id",
      headerName: "ID",
      minWidth: 200,
      hide: true,
      flex: 1,
      filterable: false,
    },
    {
      field: "view_type",
      headerName: "View Type",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "index",
      headerName: "Index",
      minWidth: 100,
      flex: 1,
      type: "number",
      filterOperators: numberFiltOperator,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 100,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      minWidth: 100,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      minWidth: 100,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) => (params?.value ? params?.value : "-"),
    },
    {
      field: "updatedBy",
      headerName: "Updated By",
      minWidth: 100,
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
              setUploadedFiles([item?.row?.image]);
              const filename = item?.row?.image?.substring(
                item?.row?.image?.lastIndexOf("/") + 1
              );
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

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    getImagesLists(flt);
  }

  const handleClose = () => {
    setOpenModal(false);
    setType("");
    setSelectedItem({});
    setUploadedFiles([]);
    setFileName("");
  };

  return (
    <AppsContainer
      title="Images"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getImagesLists}
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
              <Typography color="text.primary">Manage Images</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={NewBar}
        onChange={(event) => onChange(event)}
        row={imagesLists?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={imagesLists?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getImagesLists}
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
        dialogTitle={type === "edit" ? "Update Image" : "Add New Image"}
      >
        <Box sx={style}>
          <Formik
            validateOnChange={true}
            initialValues={{
              view_type: selectedItem?.row?.view_type || "",
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
              } = props;
              return (
                <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                  <Grid
                    container
                    spacing={4}
                    sx={{ m: 0, width: "100%", pr: 4 }}
                  >
                    {/* image */}
                    <Grid item xs={12}>
                      {isEmpty(uploadedFiles) ? (
                        <UploadModern
                          uploadText="Click to upload image"
                          dropzone={dropzone}
                        />
                      ) : (
                        <Box sx={{ position: "relative" }}>
                          {btnDisable ? <AppLoader /> : null}
                          <AppGrid
                            sx={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            data={uploadedFiles}
                            column={0}
                            itemPadding={2}
                            renderRow={(file, index) => {
                              if (!isEmpty(file)) {
                                return (
                                  <PreviewThumb
                                    sxStyle={{
                                      width: "100%",
                                      height: 300,
                                      borderRadius: 100,
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
                      {isEmpty(uploadedFiles) && imageErr && (
                        <ErrorTextStyle>Please upload image</ErrorTextStyle>
                      )}
                    </Grid>
                    {/* View Type */}
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-select-small">
                          View Type
                        </InputLabel>
                        <Select
                          MenuProps={{ style: { zIndex: 1000002 } }}
                          fullWidth
                          name="view_type"
                          value={values.view_type}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="View Type"
                          label="View Type"
                        >
                          {[
                            { id: "phone", name: "Phone" },
                            { id: "tablet", name: "Tablet" },
                          ].map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.view_type && touched.view_type && (
                          <ErrorTextStyle>{errors.view_type}</ErrorTextStyle>
                        )}
                      </FormControl>
                    </Grid>
                    {/* index */}
                    <Grid item xs={12}>
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
                        disabled={btnDisable || btnLoad}
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
        title="Are you sure you want to delete this image?"
        dialogTitle="Delete Image"
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

export default ImagesList;
