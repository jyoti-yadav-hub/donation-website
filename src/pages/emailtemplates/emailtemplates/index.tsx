/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { Form, Formik } from "formik";
import * as yup from "yup";
import {
  GridColumns,
  GridActionsCellItem,
  GridSortModel,
  getGridDateOperators,
  getGridStringOperators,
  getGridSingleSelectOperators,
} from "@mui/x-data-grid-pro";
import {
  Box,
  CircularProgress,
  Button,
  TextField,
  MenuItem,
  Select,
  Typography,
  Grid,
  FormGroup,
  FormControlLabel,
  Switch,
  Breadcrumbs,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { styled } from "@mui/material/styles";
import { isArray } from "lodash";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import IntlMessages from "@crema/utility/IntlMessages";
import { getSlug } from "components/getSlug";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import { LoadingButton } from "@mui/lab";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { AppConfirmDialog } from "@crema";
import DonationSlugs from "components/DonationReceiptSlugs";
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
  email_template_name: yup
    .string()
    .required("Template name is required")
    .min(3, "Name should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
  email_slug: yup.string().required("Slug is required"),
  email_subject: yup
    .string()
    .required("Template Subject is required")
    .max(50, "Maximum 50 characters allowed"),
  email_status: yup.string().required("Please select status"),
});

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const EmailContentWrapper = styled(Box)(({ theme }) => ({
  "& .buttonBox": {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
    position: "sticky",
    bottom: "0px",
    right: "10px",
    background: "#fff",
    padding: "10px 0px",
    borderRadius: "5px",
  },
  "& .titlesFlex": {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
}));

const errorObj = { content: false, contentMsg: "" };

const EmailTemplates = () => {
  const [emailsList, setEmailsList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const editorRef = useRef<any>(null);
  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [nameValue, setNameValue] = React.useState("");
  const [type, setType] = React.useState("");
  const [btnLoad, setBtnLoad] = useState(false);
  const initialText = "Create your template";
  const [text, setText] = useState(initialText);
  const [errObj, setErrObj] = useState(errorObj);
  const [catLoad, setCatLoad] = useState<boolean>(false);
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [infoDialog, setInfoDialog] = useState<boolean>(false);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const [keywords, setKeywords] = React.useState("");

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

  //API For get CMS list
  async function getEmailTempLists(nData) {
    setEmailsList((e) => ({ ...e, listsLoad: true }));
    try {
      if (nData["sort"]) {
        nData["onSort"] = nData["sort"];
      }
      if (nData["sort_type"]) {
        nData["sortType"] = nData["sort_type"];
      }
      const res = await getApiData("email-template/list", nData);
      if (res.success) {
        setEmailsList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setEmailsList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setEmailsList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getEmailTempLists({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  // set template disable/enable
  async function setEnableCategory(e, id) {
    setCatLoad(id);
    try {
      const res = await getApiData(
        `email-template/set-email-template/${id}`,
        {},
        "PUT"
      );
      if (res.success) {
        toast.success(res.message);
        getEmailTempLists({
          page: 1,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
      } else {
        toast.error(res.message || "Something went wrong");
      }
      setCatLoad(false);
    } catch (error) {
      setCatLoad(false);
      toast.error("Something went wrong");
    }
  }

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    getEmailTempLists(flt);
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
      minWidth: 200,
      flex: 1,
      filterable: false,
    },
    {
      field: "email_template_name",
      headerName: "Template Name",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "email_slug",
      headerName: "Slug",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "email_subject",
      headerName: "Email Subject",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 200,
      flex: 1,
      type: "singleSelect",
      valueOptions: ["Active", "Deactive"],
      filterOperators: singleSelectFilter,
      renderCell: (item: any) => {
        return (
          <>
            {catLoad === item.id ? (
              <CircularProgress size={20} />
            ) : (
              <FormGroup>
                <FormControlLabel
                  sx={{
                    "& .MuiTypography-root": { fontSize: "12px" },
                    "& .MuiSwitch-thumb": {
                      backgroundColor:
                        item.row.email_status === "Active"
                          ? "#65c466 !important"
                          : "",
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor:
                        item.row.email_status === "Active"
                          ? "#65c466 !important"
                          : "",
                    },
                  }}
                  control={
                    <Switch
                      color={
                        item.row.email_status === "Active"
                          ? "warning"
                          : "default"
                      }
                      checked={
                        item.row.email_status === "Active" ? true : false
                      }
                      size="small"
                      onChange={(e) => setEnableCategory(e, item.id)}
                    />
                  }
                  label={
                    item.row.email_status === "Active" ? "Active" : "Deactive"
                  }
                />
              </FormGroup>
            )}
          </>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
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
              setText(item?.row?.email_content);
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
      const res = await getApiData(`email-template/delete/${id}`, "", "DELETE");
      if (res.success) {
        setOpen(false);
        getEmailTempLists({
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
      toast.error("Something went wrong");
    }
  }

  async function submitData(data: any) {
    const eData = { ...data, email_content: text };
    setBtnLoad(true);
    const id = selectedItem?.id;
    let url = "";
    if (type === "edit") {
      url = `email-template/update/${id}`;
    } else {
      url = `email-template/create`;
    }
    try {
      const resp = await getApiData(
        url,
        eData,
        type === "edit" ? "PUT" : "POST"
      );
      if (resp.success) {
        toast.success(resp.message);
        setOpenModal(false);
        setType("");
        setText(initialText);
        setNameValue("");
        setSelectedItem({});
        getEmailTempLists({
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
      toast.error("Something went wrong");
    }
  }

  const onClose = () => {
    setNameValue("");
    setOpenModal(false);
    setSelectedItem({});
    setText(initialText);
    setType("");
  };

  return (
    <AppsContainer
      title={
        openModal && type === "edit"
          ? "Edit Template"
          : openModal
          ? "Add New Template"
          : "Templates"
      }
      fullView
      isVisibleBack={openModal ? true : false}
      buttonAction={onClose}
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getEmailTempLists}
            setKeywords={setKeywords}
            keywords={keywords}
            sortModel={sortModel}
            from="email_status"
          />
        );
      }}
    >
      {openModal ? (
        <EmailContentWrapper>
          <Box sx={style}>
            <Formik
              validateOnChange={true}
              initialValues={{
                email_template_name:
                  selectedItem?.row?.email_template_name || "",
                email_subject: selectedItem?.row?.email_subject || "",
                email_slug: selectedItem?.row?.email_slug || "",
                email_status: selectedItem?.row?.email_status || "",
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
                      <Grid item xs={6}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Template Name"
                          name="email_template_name"
                          label={<IntlMessages id="Template Name" />}
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.email_template_name}
                          onChange={(event: any) => {
                            handleChange(event);
                            if (type !== "edit") {
                              const newVal = getSlug(event.target.value);
                              setNameValue(newVal);
                              setFieldValue("email_slug", newVal);
                            }
                          }}
                        />
                        {errors.email_template_name &&
                          touched.email_template_name && (
                            <ErrorTextStyle>
                              {errors.email_template_name}
                            </ErrorTextStyle>
                          )}
                      </Grid>

                      <Grid item xs={6}>
                        <TextField
                          size="small"
                          fullWidth
                          disabled
                          placeholder="Enter email slug"
                          label={<IntlMessages id="Email slug" />}
                          name="email_slug"
                          variant="outlined"
                          onBlur={handleBlur}
                          value={
                            type === "edit" ? values.email_slug : nameValue
                          }
                        />
                      </Grid>

                      <Grid item xs={type === "edit" ? 5 : 6}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Template Subject"
                          name="email_subject"
                          label={<IntlMessages id="Template Subject" />}
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.email_subject}
                          onChange={handleChange}
                        />
                        {errors.email_subject && touched.email_subject && (
                          <ErrorTextStyle>
                            {errors.email_subject}
                          </ErrorTextStyle>
                        )}
                      </Grid>

                      <Grid item xs={type === "edit" ? 5 : 6}>
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
                            name="email_status"
                            value={values.email_status}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="email status"
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
                          {errors.email_status && touched.email_status && (
                            <ErrorTextStyle>
                              {errors.email_status}
                            </ErrorTextStyle>
                          )}
                        </FormControl>
                      </Grid>
                      {type === "edit" && (
                        <Grid item xs={2}>
                          <Button
                            variant="outlined"
                            fullWidth
                            color="info"
                            size="small"
                            onClick={() => setInfoDialog(true)}
                          >
                            All Slug Info
                          </Button>
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <Editor
                          apiKey={
                            "ib42g3ys2mlnxry0xn5zba0unc5fj39wnnh7h6927m53fr3q"
                          }
                          onInit={(evt, editor) => (editorRef.current = editor)}
                          onEditorChange={(newText) => {
                            setText(newText);
                            setErrObj({
                              ...errObj,
                              contentMsg: "",
                              content: false,
                            });
                          }}
                          value={text}
                          init={{
                            branding: false,
                            // height: "calc(50vh)",
                            width: "100%",
                            // menubar: false,
                            setup: function (editor) {
                              editor.on("init", function (e) {
                                editor.setContent(text);
                              });
                            },
                            plugins: [
                              // "a11ychecker",
                              "advlist",
                              // "advcode",
                              // "advtable",
                              "autolink",
                              // "checklist",
                              // "export",
                              "lists",
                              "link",
                              "image",
                              "charmap",
                              "preview",
                              "anchor",
                              "searchreplace",
                              "visualblocks",
                              // "powerpaste",
                              "fullscreen",
                              // "formatpainter",
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
                        {errObj.content && (
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
                          disabled={btnLoad}
                          loading={btnLoad}
                        >
                          {type === "edit" ? "Update" : "Add"}
                        </LoadingButton>
                        <Button
                          sx={{ ml: 2 }}
                          size="small"
                          color="secondary"
                          variant="outlined"
                          onClick={onClose}
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
          <DonationSlugs
            infoDialog={infoDialog}
            setInfoDialog={setInfoDialog}
            type={selectedItem?.row?.email_slug}
          />
        </EmailContentWrapper>
      ) : (
        <>
          <AppsHeader>
            <div style={{ display: "flex", alignItems: "center" }}>
              <BreadWrapper>
                <Breadcrumbs
                  aria-label="breadcrumb"
                  sx={{ margin: "20px 0px" }}
                >
                  <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                    Dashboards
                  </Link>
                  <Typography color="text.primary">Templates</Typography>
                </Breadcrumbs>
              </BreadWrapper>
            </div>
          </AppsHeader>
          <CTable
            initialState={{ pinnedColumns: { right: ["actions"] } }}
            onRowClick={() => console.log("click")}
            NewBar={NewBar}
            onChange={(event) => onChange(event)}
            row={emailsList?.lists}
            column={columns}
            rowCount={pagination.total}
            page={pagination.page}
            listsLoad={emailsList?.listsLoad}
            checkboxSelection={false}
            onSelectionModelChange={() => console.log("row select")}
            sortModel={sortModel}
            getApiCall={getEmailTempLists}
            setSortModel={setSortModel}
          />
        </>
      )}
      <AppConfirmDialog
        open={open}
        disabled={dltLoad}
        loading={dltLoad}
        onDeny={() => {
          setSelectedItem({});
          setOpen(false);
          setDltLoad(false);
        }}
        onConfirm={() => deleteList(selectedItem?.id)}
        title="Are you sure you want to delete this Template?"
        dialogTitle="Delete Template"
      />
    </AppsContainer>
  );
};

export default EmailTemplates;
