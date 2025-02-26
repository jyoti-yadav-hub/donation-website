/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { isEmpty } from "lodash";
import {
  GridColumns,
  GridActionsCellItem,
  GridSortModel,
  getGridDateOperators,
  getGridStringOperators,
  getGridSingleSelectOperators,
  getGridNumericColumnOperators,
} from "@mui/x-data-grid-pro";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  Typography,
  Chip,
  Breadcrumbs,
  Grid,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { isArray } from "lodash";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import IntlMessages from "@crema/utility/IntlMessages";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import { LoadingButton } from "@mui/lab";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { AppConfirmDialog, AppGrid, AppLoader } from "@crema";
import { Editor } from "@tinymce/tinymce-react";
import { apiCallWithFile } from "shared/helpers/utility";
import { useDropzone } from "react-dropzone";
import UploadModern from "pages/thirdParty/reactDropzone/components/UploadModern";
import PreviewThumb from "pages/thirdParty/reactDropzone/components/PreviewThumb";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "100%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: "16px 16px 0px 16px",
  borderRadius: 2,
  // overflow: "auto",
};

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
  index: yup
    .number()
    .required("Index is required")
    .min(1, "Index should be greater than 1"),
  type: yup.string().required("Please select type"),
  status: yup.string().required("Please select status"),
});

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const HomeCms = () => {
  const [cmsList, setCmsList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const editorRef = useRef<any>(null);
  const [text, setText] = useState("");
  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [type, setType] = React.useState("");
  const [btnLoad, setBtnLoad] = useState(false);
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [errObj, setErrObj] = useState({
    content: false,
    contentMsg: "",
    file: false,
    fileContent: "",
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const [keywords, setKeywords] = React.useState("");

  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const [fileName, setFileName] = useState<any>("");
  const [btnDisable, setBtnDisable] = useState<boolean>(false);

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

  //API For get CMS list
  async function onGetCmsList(nData) {
    setCmsList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("home-cms/list", nData);
      if (res.success) {
        setCmsList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setCmsList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setCmsList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    onGetCmsList({
      page: 1,
      search: keywords ? keywords : null,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.page = newPage + 1;
    flt.search = keywords ? keywords : null;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    flt.operator = "contains";
    onGetCmsList(flt);
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
      field: "index",
      headerName: "Index",
      minWidth: 150,
      flex: 1,
      type: "number",
      filterOperators: numberFiltOperator,
    },
    {
      field: "title",
      headerName: "Title",
      minWidth: 250,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "type",
      headerName: "Type",
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
      field: "createdAt",
      headerName: "Created At",
      width: 200,
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
              setOpenModal(true);
              setType("edit");
              setSelectedItem(item);
              setUploadedFiles(
                !isEmpty(item?.row?.image) ? [item?.row?.image] : []
              );
              const filename = item?.row?.image?.substring(
                item?.row?.image?.lastIndexOf("/") + 1
              );
              setFileName(filename);
              setText(item?.row?.description);
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
      const res = await getApiData(`home-cms/delete/${id}`, "", "DELETE");
      if (res.success) {
        setOpen(false);
        onGetCmsList({
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

  async function submitData(data: any) {
    if (isEmpty(text) && data?.type === "text") {
      setErrObj({
        ...errObj,
        content: true,
        contentMsg: "Description is required",
      });
    } else if (isEmpty(uploadedFiles) && data?.type === "file") {
      setErrObj({
        ...errObj,
        file: true,
        fileContent: "Upload file",
      });
    } else {
      let cData = {};
      if (data?.type === "text") {
        cData = { ...data, description: text, removeFile: true };
      } else {
        cData = { ...data, description: text, image: fileName };
      }
      setErrObj({
        ...errObj,
        content: false,
        contentMsg: "",
        file: false,
        fileContent: "",
      });
      setBtnLoad(true);
      const id = selectedItem?.id;
      let url = "";
      if (type === "edit") {
        url = `home-cms/update/${id}`;
      } else {
        url = `home-cms/create`;
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
                ? "CMS update successfully!"
                : "CMS created successfully!"
            );
          }
          setOpenModal(false);
          setType("");
          setText("");
          setUploadedFiles([]);
          setSelectedItem({});
          onGetCmsList({
            page: 1,
            search: keywords ? keywords : null,
            sort: sortModel[0].field,
            sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
          });
          setBtnLoad(false);
        } else {
          toast.error(resp.message);
        }
        setBtnLoad(false);
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
    setText("");
    setUploadedFiles([]);
    setSelectedItem({});
    setErrObj({ content: false, contentMsg: "", file: false, fileContent: "" });
  };

  return (
    <AppsContainer
      title={
        openModal && type === "edit"
          ? "Edit CMS"
          : openModal
          ? "Add CMS"
          : "CMS"
      }
      fullView
      isVisibleBack={openModal ? true : false}
      buttonAction={handleClose}
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={onGetCmsList}
            setKeywords={setKeywords}
            keywords={keywords}
            sortModel={sortModel}
            from={"cms"}
          />
        );
      }}
    >
      {openModal ? (
        <Box sx={style}>
          <Formik
            validateOnChange={true}
            initialValues={{
              title: selectedItem?.row?.title || "",
              index: selectedItem?.row?.index || "",
              type: selectedItem?.row?.type || "",
              description: text || "",
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
              } = props;
              return (
                <Form
                  style={{
                    minHeight: "calc(60vh)",
                    minWidth: 500,
                    overflow: "auto",
                    maxHeight: "100%",
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <Grid
                    container
                    spacing={2}
                    sx={{ m: 0, width: "100%", position: "relative" }}
                  >
                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Enter Title"
                        name="title"
                        label={<IntlMessages id="Title" />}
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.title}
                        onChange={handleChange}
                      />
                      {errors.title && touched.title && (
                        <ErrorTextStyle>{errors.title}</ErrorTextStyle>
                      )}
                    </Grid>
                    <Grid item xs={4}>
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
                          <MenuItem value="file">File</MenuItem>
                        </Select>
                      </FormControl>
                      {errors.type && touched.type && (
                        <ErrorTextStyle>{errors.type}</ErrorTextStyle>
                      )}
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        size="small"
                        fullWidth
                        type="number"
                        onWheel={(e: any) => e.target.blur()}
                        placeholder="Provide index"
                        name="index"
                        label={<IntlMessages id="Index" />}
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.index}
                        onChange={handleChange}
                      />
                      {errors.index && touched.index && (
                        <ErrorTextStyle>{errors.index}</ErrorTextStyle>
                      )}
                    </Grid>
                    <Grid item xs={4}>
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
                    {values?.type === "file" && (
                      <Grid item xs={2}>
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
                              renderRow={(file, index) => {
                                return (
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
                                );
                              }}
                            />
                          </Box>
                        )}
                        {errObj.file && (
                          <ErrorTextStyle>{errObj.fileContent}</ErrorTextStyle>
                        )}
                      </Grid>
                    )}
                    <Grid
                      item
                      xs={12}
                      sx={{
                        "& .tox > .tox-menu": {
                          backgroundColor: "black",
                          zIndex: 1000002,
                        },
                      }}
                    >
                      <Editor
                        apiKey={
                          "ib42g3ys2mlnxry0xn5zba0unc5fj39wnnh7h6927m53fr3q"
                        }
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        onEditorChange={(newText) => setText(newText)}
                        value={text}
                        init={{
                          branding: false,
                          // height: "calc(42vh)",
                          width: "100%",
                          "& .tox .tox-menu": {
                            backgroundColor: "black",
                            zIndex: 1000002,
                          },
                          setup: function (editor) {
                            editor.on("init", function (e) {
                              editor.setContent(text);
                            });
                          },
                          plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "help",
                            "wordcount",
                            "code",
                          ],
                          toolbar:
                            "undo redo | formatpainter casechange blocks | bold italic backcolor | " +
                            "alignleft aligncenter alignright alignjustify | " +
                            "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
                          mobile: {
                            plugins: [
                              "print preview searchreplace autolink visualblocks fullscreen",
                              "image link media template code codesample table charmap hr pagebreak nonbreaking anchor",
                              "toc insertdatetime advlist lists wordcount textpattern noneditable help paste charmap quickbars emoticon",
                            ],
                          },
                          menu: {
                            tc: {
                              title: "TinyComments",
                              items:
                                "addcomment showcomments deleteallconversations",
                            },
                          },
                        }}
                      />
                      {values?.type === "text" && errObj.content && (
                        <ErrorTextStyle>{errObj.contentMsg}</ErrorTextStyle>
                      )}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        position: "sticky",
                        bottom: "0px",
                        background: "#fff",
                        padding: "10px 0px",
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
                      <Button
                        sx={{ ml: 2 }}
                        size="small"
                        color="secondary"
                        variant="outlined"
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        </Box>
      ) : (
        <>
          <AppsHeader>
            <div style={{ display: "flex", alignItems: "center" }}>
              <BreadWrapper>
                <Breadcrumbs
                  aria-label="breadcrumb"
                  sx={{ margin: "20px 0px " }}
                >
                  <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                    Dashboards
                  </Link>
                  <Typography color="text.primary">Home Cms</Typography>
                </Breadcrumbs>
              </BreadWrapper>
            </div>
          </AppsHeader>
          <CTable
            initialState={{ pinnedColumns: { right: ["actions"] } }}
            onRowClick={() => console.log("click")}
            NewBar={NewBar}
            onChange={(event) => onChange(event)}
            row={cmsList?.lists}
            column={columns}
            rowCount={pagination.total}
            page={pagination.page}
            listsLoad={cmsList?.listsLoad}
            checkboxSelection={false}
            onSelectionModelChange={() => console.log("row select")}
            sortModel={sortModel}
            getApiCall={onGetCmsList}
            keyword={keywords}
            setSortModel={setSortModel}
          />
        </>
      )}

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
        title="Are you sure you want to delete this CMS?"
        dialogTitle="Delete CMS"
      />
    </AppsContainer>
  );
};

export default HomeCms;
