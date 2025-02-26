/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { isArray, isEmpty } from "lodash";
import DynamicForm from "../../categories/DynamicForm";
import {
  Box,
  Button,
  Typography,
  TextField,
  Breadcrumbs,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogTitle,
  Drawer,
  DialogContent,
  Grid,
  DialogContentText,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Avatar,
} from "@mui/material";
import {
  getGridBooleanOperators,
  getGridDateOperators,
  getGridNumericColumnOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
  GridActionsCellItem,
  GridColumns,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import { styled } from "@mui/material/styles";
import IntlMessages from "@crema/utility/IntlMessages";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import { LoadingButton } from "@mui/lab";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { AppConfirmDialog, AppGrid, AppLoader } from "@crema";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";
import { getSlug } from "components/getSlug";
import { useDropzone } from "react-dropzone";
import { apiCallWithFile } from "shared/helpers/utility";
import UploadModern from "pages/thirdParty/reactDropzone/components/UploadModern";
import PreviewThumb from "pages/thirdParty/reactDropzone/components/PreviewThumb";

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name should be 3 chars minimum.")
    .max(100, "Maximum 100 characters allowed"),
  status: yup.string().required("Please select status"),
  index: yup
    .number()
    .integer()
    .min(0, "Index should be greater than or equal to 0")
    .required("Please add index"),
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

const CorporateTypes = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState<any>("");
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [btnLoad, setBtnLoad] = useState(false);
  const [corporateType, setCorporateType] = React.useState<any>({
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
  const [nameValue, setNameValue] = React.useState("");
  const [feilds, setFeilds] = useState<any>([]);
  const [outerFeilds, setOuterFeilds] = useState<any>([]);
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const [fileName, setFileName] = useState<any>("");
  const [btnDisable, setBtnDisable] = useState<boolean>(false);

  const handleClose = () => {
    setSelectedItem({});
    setType("");
    setUploadedFiles([]);
    setFeilds([]);
    setOpen("");
    setOpenModal(false);
    setNameValue("");
    setSelectedItem({});
    setOuterFeilds([]);
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
      console.log("error====", error);
      toast.error("Something went wrong");
    }
  }

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

  //API For get corporate type list
  async function getCorporateTypes(nData) {
    setCorporateType((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData(`corporate-types/admin/list`, nData);
      if (res.success) {
        setCorporateType({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setCorporateType({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setCorporateType({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getCorporateTypes({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  //API For delete corporate-types from list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(
        `corporate-types/delete/${id}`,
        "",
        "DELETE"
      );
      if (res.success) {
        setOpen("");
        getCorporateTypes({
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

  const validationData = () => {
    let haveError = false;
    // eslint-disable-next-line array-callback-return
    feilds?.map((item: any, index) => {
      if (isEmpty(item?.title) || isEmpty(item?.help_title)) {
        feilds[index].haveError = true;
        haveError = true;
      } else {
        feilds[index].haveError = false;
      }
      if (item?.inputs) {
        // eslint-disable-next-line array-callback-return
        item?.inputs?.map((subItem: any, sIndex: any) => {
          if (isEmpty(subItem?.input_type) || isEmpty(subItem?.title)) {
            feilds[index].inputs[sIndex].haveError = true;
            return (haveError = true);
          } else {
            feilds[index].inputs[sIndex].haveError = false;
          }
        });
      }
    });
    return haveError;
  };

  //API For create/update corporate-types in list
  async function submitData(data: any, btnType?: any) {
    let haveError;
    if (btnType !== "draft") {
      haveError = validationData();
    }
    if (isEmpty(feilds) && btnType !== "draft" && data?.for_fundraiser) {
      toast.error("Please add form details");
    } else if (haveError && btnType !== "draft") {
      return null;
    } else {
      const cData = {
        ...data,
        form_settings: JSON.stringify(feilds),
        header_form: JSON.stringify(outerFeilds),
        icon: fileName,
      };
      setBtnLoad(true);
      const id = selectedItem?.id;
      let url = "";
      if (type === "edit") {
        url = `corporate-types/update/${id}`;
      } else {
        url = `corporate-types/create`;
      }
      try {
        const resp = await getApiData(
          url,
          cData,
          type === "edit" ? "PUT" : "POST"
        );
        if (resp.success) {
          toast.success(resp.message);
          handleClose();
          getCorporateTypes({
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

  const singleSelectFilter = getGridSingleSelectOperators().filter(
    ({ value }) => ["is"].includes(value)
  );

  const dateFilterOperators = getGridDateOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const numberFiltOperator = getGridNumericColumnOperators().filter(
    ({ value }) => ["="].includes(value)
  );

  const boolFilterOperators = getGridBooleanOperators().filter(({ value }) =>
    ["is"].includes(value)
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
      minWidth: 200,
      flex: 1,
      filterable: false,
      disableColumnMenu: true,
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
            <Avatar
              sx={{
                padding: 5,
                backgroundColor: "rgb(255, 255, 255)",
                border: "1px solid #ccc",
              }}
            >
              <img
                src={item.value || "/assets/images/defaultimage.png"}
                alt={"title"}
                style={{
                  borderRadius: 5,
                  width: item.value ? "30px" : "40px",
                  height: item.value ? "30px" : "40px",
                  objectFit: item.value ? "contain" : "cover",
                  maxWidth: "fit-content",
                }}
              />
            </Avatar>
          </Box>
        );
      },
    },
    {
      field: "name",
      headerName: "Corporate Type",
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
      field: "status",
      headerName: "Status",
      width: 200,
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
      field: "coming_soon",
      headerName: "Is Coming soon?",
      width: 200,
      filterOperators: boolFilterOperators,
      type: "boolean",
      renderCell: (item: any) => {
        return (
          <Chip
            label={item?.value ? "Yes" : "No"}
            variant="outlined"
            size="small"
            style={{
              color: "#FFF",
              backgroundColor: item?.value ? "#2e7d32" : "#d32f2f",
            }}
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
              setSelectedItem(item);
              setFeilds(
                item && item.row && item.row.form_settings
                  ? JSON.parse(item.row.form_settings)
                  : []
              );
              setOuterFeilds(
                item && item?.row && item?.row?.header_form
                  ? JSON.parse(item?.row?.header_form)
                  : []
              );
              const filename = item?.row?.icon?.substring(
                item?.row?.icon?.lastIndexOf("/") + 1
              );
              setFileName(filename);
              setUploadedFiles(item?.row?.icon ? [item?.row?.icon] : []);
            }}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteOutline />}
            label="Delete"
            onClick={(event) => {
              setSelectedItem(item);
              setOpen("delete");
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
    getCorporateTypes(flt);
  }

  return (
    <AppsContainer
      title="Corporate Types"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getCorporateTypes}
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
              <Typography color="text.primary">Corporate Types</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={NewBar}
        onChange={(event) => onChange(event)}
        row={corporateType?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={corporateType?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getCorporateTypes}
        setSortModel={setSortModel}
      />

      <Drawer
        sx={{
          zIndex: 1000002,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: { lg: "calc(100vw - 10%)", xl: "calc(100vw - 15%)" },
            boxSizing: "border-box",
          },
        }}
        anchor="right"
        open={openModal}
        onClose={() => {
          if (
            (feilds.length > 0 || !isEmpty(uploadedFiles)) &&
            type !== "edit"
          ) {
            setOpen("close");
          } else {
            handleClose();
          }
        }}
      >
        <DialogTitle sx={{ fontSize: "18px" }}>
          <Typography variant="h4" gutterBottom>
            {type === "edit" ? "Update Type" : "Add New Type"}
          </Typography>
        </DialogTitle>
        <Formik
          validateOnChange={true}
          initialValues={{
            name: selectedItem?.row?.name || "",
            slug: selectedItem?.row?.slug || "",
            status: selectedItem?.row?.status || "",
            index: selectedItem?.row?.index || "",
            coming_soon: selectedItem?.row?.coming_soon || false,
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
              <Form
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
                style={{ height: "100%" }}
              >
                <DialogContent sx={{ pb: "10px", p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid
                      item
                      xs={3}
                      sx={{ borderRight: "1px dashed #bdbdbd", pb: "75px" }}
                    >
                      <Grid
                        container
                        spacing={3}
                        sx={{ m: 0, width: "100%", pr: 4 }}
                      >
                        {/* Icon upload */}
                        <Grid item xs={6}>
                          <Box>Icon</Box>
                          {isEmpty(uploadedFiles) ? (
                            <UploadModern
                              sxStyle={{ marginBottom: "0px !important" }}
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
                        </Grid>
                        {/* name */}
                        <Grid item xs={12}>
                          <TextField
                            size="small"
                            fullWidth
                            placeholder="Enter Name"
                            name="name"
                            label={<IntlMessages id="Name" />}
                            variant="outlined"
                            onBlur={(event: any) => {
                              const str = event.target.value.replace(
                                /\s\s+/g,
                                " "
                              );
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
                          />
                          {errors.name && touched.name && (
                            <ErrorTextStyle>{errors.name}</ErrorTextStyle>
                          )}
                        </Grid>
                        {/* slug */}
                        <Grid item xs={12}>
                          <TextField
                            size="small"
                            fullWidth
                            disabled
                            placeholder="Enter slug"
                            label={<IntlMessages id="Slug" />}
                            name="slug"
                            variant="outlined"
                            onBlur={handleBlur}
                            value={type === "edit" ? values.slug : nameValue}
                          />
                        </Grid>
                        {/* Status */}
                        <Grid item xs={12}>
                          <FormControl fullWidth size="small">
                            <InputLabel id="demo-select-small">
                              Select status
                            </InputLabel>
                            <Select
                              label="Select status"
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
                        {/* coming soon */}
                        <Grid item xs={12}>
                          <FormControlLabel
                            name="coming_soon"
                            control={
                              <Checkbox
                                defaultChecked={values.coming_soon}
                                onChange={handleChange}
                                value={values.coming_soon}
                                size="small"
                                name="coming_soon"
                              />
                            }
                            label="Add this cause to coming soon"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={9}>
                      <DialogContentText>
                        Set form detail.
                      </DialogContentText>

                      <DynamicForm
                        setFeilds={setFeilds}
                        feilds={feilds}
                        setOuterFeilds={setOuterFeilds}
                        outerFeilds={outerFeilds}
                        btnDisabled={btnDisabled}
                        setBtnDisabled={setBtnDisabled}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions
                  sx={{
                    padding: "16px",
                    width: {
                      lg: "calc(100vw - 10%)",
                      xl: "calc(100vw - 15%)",
                    },
                    position: "fixed",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "white",
                    zIndex: 10,
                    borderTop: "1px solid #ccc",
                  }}
                >
                  <LoadingButton
                    sx={{ color: "#fff" }}
                    size="small"
                    variant="contained"
                    color="success"
                    type="submit"
                    disabled={btnDisable || btnLoad || btnDisabled}
                    loading={btnLoad}
                  >
                    {type === "edit" ? "Update" : "Create"}
                  </LoadingButton>
                  <Button
                    size="small"
                    variant="contained"
                    color="warning"
                    onClick={() => {
                      if (
                        feilds.length > 0 ||
                        !isEmpty(values.name) ||
                        !isEmpty(values.index) ||
                        !isEmpty(uploadedFiles)
                      ) {
                        setOpen("close");
                      } else {
                        handleClose();
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </DialogActions>
                <AppConfirmDialog
                  open={open === "close" ? true : false}
                  disabled={btnLoad}
                  loading={btnLoad}
                  from="draft"
                  onClose={() => {
                    setOpen("");
                    handleClose();
                  }}
                  onDeny={() => setOpen("")}
                  onConfirm={() => submitData(values, "draft")}
                  type={"submit"}
                  Ytitle={"Save as Draft"}
                  Ntitle={"Discard"}
                  title={"Are you sure you want to leave?"}
                  dialogTitle={"Close Dialog"}
                />
              </Form>
            );
          }}
        </Formik>
      </Drawer>

      <AppConfirmDialog
        open={open === "delete" ? true : false}
        disabled={dltLoad}
        loading={dltLoad}
        onClose={() => {
          setOpen("");
          handleClose();
        }}
        onDeny={() => {
          setDltLoad(false);
          setSelectedItem({});
          setOpen("");
        }}
        onConfirm={() => deleteList(selectedItem?.id)}
        Ytitle={"Yes"}
        Ntitle={"No"}
        title={"Are you sure you want to delete this category?"}
        dialogTitle={"Delete Category"}
      />
    </AppsContainer>
  );
};

export default CorporateTypes;
