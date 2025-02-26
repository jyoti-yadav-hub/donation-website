/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Form, Formik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Grid,
  Switch,
  FormGroup,
  FormControlLabel,
  Breadcrumbs,
  Drawer,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  GridActionsCellItem,
  GridColumns,
  GridSortModel,
  getGridDateOperators,
  getGridStringOperators,
  getGridNumericColumnOperators,
  getGridSingleSelectOperators,
} from "@mui/x-data-grid-pro";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import { AppConfirmDialog } from "@crema";
import IntlMessages from "@crema/utility/IntlMessages";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { getSlug } from "shared/helpers/utility";
import { isArray, isEmpty } from "lodash";
import getApiData from "../../../shared/helpers/apiHelper";
import DynamicForm from "../DynamicForm";
import { Link as BLink } from "react-router-dom";
import CTable from "components/CTable";
import { LoadingButton } from "@mui/lab";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
});

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));
const adminData: any = localStorage.getItem("uData") || {};
const Events = () => {
  const [categoryList, setCategoryList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [open, setOpen] = React.useState<any>("");
  const [openModal, setOpenModal] = React.useState(false);
  const [feilds, setFeilds] = useState<any>([]);
  const [outerFeilds, setOuterFeilds] = useState<any>([]);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [type, setType] = React.useState("");
  const [btnLoad, setBtnLoad] = useState(false);
  const [revertBtnLoad, setRevertBtnLoad] = useState(false);
  const [updateBackupBtnLoad, setUpdateBackupBtnLoad] = useState(false);
  const [dltBtnLoad, setDltBtnLoad] = useState(false);
  const [slugValue, setSlugValue] = React.useState("");
  const [catLoad, setCatLoad] = useState<boolean>(false);
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
  const [commentEnable, setCommentEnable] = useState<any>(true);
  const [updateBackupConfirm, setUpdateBackupConfirm] = useState<any>(false);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "createdAt", sort: "asc" },
  ]);
  const [keywords, setKeywords] = React.useState("");
  const [openRevertConfirmation, setOpenRevertConfirmation] =
    React.useState<any>(false);

  const handleClose = () => {
    setOpenModal(false);
    setSelectedItem({});
    setSlugValue("");
    setType("");
    setCommentEnable(false);
    setFeilds([]);
    setOuterFeilds([]);
    setOpen("");
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

  async function onGetCtaegoryList(nData) {
    setCategoryList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("dynamic-form/list", nData);
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
  async function revertForm(id: String) {
    try {
      setOpenRevertConfirmation(false);
      setRevertBtnLoad(true);
      const res = await getApiData(
        `dynamic-form/revertFormSetting/${id}`,
        {},
        "PUT"
      );
      if (res.success) {
        toast.success(res.message);
        selectedItem.row.form_settings = selectedItem.row.form_settings_backup;
        setFeilds(
          selectedItem &&
            selectedItem.row &&
            selectedItem.row.form_settings_backup
            ? JSON.parse(selectedItem.row.form_settings_backup)
            : []
        );
      } else {
        toast.error(res.message);
      }
    } catch (error) {
            toast.error("Something went wrong");
      setOpenRevertConfirmation(false);
    } finally {
      setRevertBtnLoad(false);
    }
  }
  async function updateBackup(id: string) {
    try {
      setUpdateBackupConfirm(false);
      setUpdateBackupBtnLoad(true);
      const res = await getApiData(
        `dynamic-form/updateFormBackup/${id}`,
        { data: feilds },
        "PUT"
      );
      if (res.success) {
        selectedItem.row.form_settings_backup = JSON.stringify(feilds);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      setUpdateBackupConfirm(false);
    } finally {
      setUpdateBackupBtnLoad(false);
    }
  }
  useEffect(() => {
    onGetCtaegoryList({
      page: 1,
      search: keywords ? keywords : null,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
    setSlugValue(
      selectedItem && selectedItem.row ? selectedItem?.row?.slug : ""
    );
  }, [selectedItem]);

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.page = newPage + 1;
    flt.search = keywords ? keywords : null;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    flt.operator = "contains";
    onGetCtaegoryList(flt);
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

  const columns: GridColumns = [
    {
      field: "name",
      headerName: "Name",
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
      headerName: "status",
      minWidth: 200,
      flex: 1,
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
                        item.value === "Active" ? "#65c466 !important" : "",
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor:
                        item.value === "Active" ? "#65c466 !important" : "",
                    },
                  }}
                  control={
                    <Switch
                      color={item.value === "Active" ? "success" : "default"}
                      checked={item.value === "Active" ? true : false}
                      size="small"
                      onChange={($e) => setEnableCategory($e, item.id)}
                    />
                  }
                  label={item.value === "Active" ? "Enabled" : "Disabled"}
                />
              </FormGroup>
            )}
          </>
        );
      },
      type: "singleSelect",
      valueOptions: ["Active", "Deactive"],
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
              setType(item?.row?.is_draft ? "draft" : "edit");

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
              setSelectedItem(item);
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

  async function deleteList(item: any) {
    setDltBtnLoad(true);
    try {
      const id = item;
      const res = await getApiData(`dynamic-form/delete/${id}`, "", "DELETE");
      if (res.success) {
        setOpen("");
        setSelectedItem({});
        toast.success(res.message);
        onGetCtaegoryList({
          page: 1,
          search: keywords ? keywords : null,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
      } else {
        toast.error(res.message);
        setDltBtnLoad(false);
      }
      setDltBtnLoad(false);
    } catch (error) {
      toast.error("Something went wrong");
      setDltBtnLoad(false);
      console.log("delete error", error);
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

  /*
   * Form submit function
   * To handel Create and Update category form submit event
   */

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
      let cData = {};
      if (btnType === "draft") {
        cData = {
          ...data,
          is_draft: true,
          status: "Active",
          comment_enabled: commentEnable,
          form_settings: JSON.stringify(feilds),
          header_form: JSON.stringify(outerFeilds),
          draft_id: selectedItem?.id || null,
        };
      } else {
        cData = {
          ...data,
          is_draft: false,
          status: "Active",
          form_settings: JSON.stringify(feilds),
          header_form: JSON.stringify(outerFeilds),
          draft_id: selectedItem?.row?.is_draft
            ? selectedItem?.id
            : null || null,
        };
      }
      setBtnLoad(true);
      const id = selectedItem?.id;
      let url = "";
      if (type === "edit") {
        url = `dynamic-form/update/${id}`;
      } else {
        url = `dynamic-form/create`;
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
                ? "Category update successfully!"
                : "Category created successfully!"
            );
          }
          handleClose();
          onGetCtaegoryList({
            page: 1,
            search: keywords ? keywords : null,
            sort: sortModel[0].field,
            sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
          });
        } else {
          toast.error(resp.message ? resp.message : "Someting went wrong.");
        }
        setBtnLoad(false);
      } catch (error) {
        setBtnLoad(false);
        console.log("error====", error);
        toast.error("Something went wrong");
      }
    }
  }

  // set category disable/enable
  async function setEnableCategory($e, id) {
    setCatLoad(id);
    try {
      const res = await getApiData(
        `dynamic-form/updateStatus/${id}`,
        { status: $e.target.checked == true ? "Active" : "Deactive" },
        "PUT"
      );
      if (res.success) {
        toast.success(res.message);
        onGetCtaegoryList({
          page: 1,
          search: keywords ? keywords : null,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
        setCatLoad(false);
      } else {
        toast.error(res.message || "Something went wrong");
        setCatLoad(false);
      }
    } catch (error) {
      setCatLoad(false);
      toast.error("Something went wrong");
    }
  }

  return (
    <AppsContainer
      title="Event Form"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={onGetCtaegoryList}
            setKeywords={setKeywords}
            keywords={keywords}
            sortModel={sortModel}
            from={"categories"}
          />
        );
      }}
    >
      <AppsHeader>
        <div style={{ display: "flex", alignItems: "center" }}>
          <BreadWrapper>
            <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "20px 0px" }}>
              <BLink className="linkClass" to={{ pathname: "/dashboard" }}>
                Dashboards
              </BLink>
              <Typography color="text.primary">Event Form</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

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
        getApiCall={onGetCtaegoryList}
        keyword={keywords}
        setSortModel={setSortModel}
      />

      {/* New category Form */}
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
          if (feilds.length > 0 && type !== "edit") {
            setOpen("close");
          } else {
            handleClose();
          }
        }}
      >
        <DialogTitle sx={{ fontSize: "18px" }}>
          <Typography variant="h4" gutterBottom>
            {type === "edit" ? "Update Cause" : "Add New Cause"}
          </Typography>
        </DialogTitle>

        <Formik
          validateOnChange={true}
          initialValues={{
            name: selectedItem?.row?.name || "",
            slug: selectedItem?.row?.slug || "",
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
                        {/* name */}
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Enter Name"
                            name="name"
                            label={<IntlMessages id="common.name" />}
                            variant="outlined"
                            onBlur={handleBlur}
                            value={values.name}
                            onChange={(event: any) => {
                              handleChange(event);
                              if (type !== "edit") {
                                const newVal = getSlug(event.target.value);
                                setSlugValue(newVal);
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
                            fullWidth
                            disabled
                            size="small"
                            defaultValue={values.slug}
                            placeholder="Enter slug"
                            label={<IntlMessages id="slug" />}
                            name="slug"
                            variant="outlined"
                            onBlur={handleBlur}
                            value={slugValue}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={9}>
                      <DialogContentText>Set form detail.</DialogContentText>

                      <DynamicForm
                        isEdit={type === "edit"}
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
                    width: { lg: "calc(100vw - 10%)", xl: "calc(100vw - 15%)" },
                    position: "fixed",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "white",
                    zIndex: 10,
                    borderTop: "1px solid #ccc",
                  }}
                >
                  {type === "edit" ? (
                    <LoadingButton
                      size="small"
                      variant="contained"
                      // disabled={btnLoad}
                      loading={revertBtnLoad}
                      color="primary"
                      onClick={() => setOpenRevertConfirmation(true)}
                    >
                      Revert form settings
                    </LoadingButton>
                  ) : (
                    ""
                  )}

                  {type === "edit" &&
                  JSON.parse(adminData).role === "admin" &&
                  selectedItem != null &&
                  selectedItem.row &&
                  selectedItem.row.form_settings &&
                  JSON.stringify(feilds) === selectedItem.row.form_settings ? (
                    <LoadingButton
                      size="small"
                      variant="contained"
                      // disabled={btnLoad}
                      loading={updateBackupBtnLoad}
                      color="inherit"
                      onClick={() => setUpdateBackupConfirm(true)}
                    >
                      Update Backup form
                    </LoadingButton>
                  ) : (
                    ""
                  )}

                  <LoadingButton
                    sx={{ color: "#fff" }}
                    size="small"
                    variant="contained"
                    color="success"
                    type="submit"
                    // disabled={btnLoad || btnDisabled}
                    loading={btnLoad}
                  >
                    {type === "edit" ? "Update" : "Create"}
                  </LoadingButton>
                  <Button
                    size="small"
                    variant="contained"
                    color="warning"
                    onClick={() => {
                      if (feilds.length > 0 || !isEmpty(values.name)) {
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
        disabled={dltBtnLoad}
        loading={dltBtnLoad}
        onClose={() => {
          setOpen("");
          handleClose();
        }}
        onDeny={() => {
          setDltBtnLoad(false);
          setSelectedItem({});
          setOpen("");
        }}
        onConfirm={() => deleteList(selectedItem?.id)}
        Ytitle={"Yes"}
        Ntitle={"No"}
        title={"Are you sure you want to delete this category?"}
        dialogTitle={"Delete Category"}
      />
      <AppConfirmDialog
        open={openRevertConfirmation}
        disabled={dltBtnLoad}
        loading={dltBtnLoad}
        onClose={() => setOpenRevertConfirmation(false)}
        onDeny={() => setOpenRevertConfirmation(false)}
        onConfirm={() => revertForm(selectedItem?.id)}
        Ytitle={"Yes"}
        Ntitle={"No"}
        title={"Are you sure you want to restore form setting?"}
        dialogTitle={"Restore form setting"}
      />
      <AppConfirmDialog
        open={updateBackupConfirm}
        disabled={dltBtnLoad}
        loading={dltBtnLoad}
        onClose={() => setUpdateBackupConfirm(false)}
        onDeny={() => setUpdateBackupConfirm(false)}
        onConfirm={() => updateBackup(selectedItem?.id)}
        Ytitle={"Yes"}
        Ntitle={"No"}
        title={"Are you sure you want to update backup of form setting?"}
        dialogTitle={"Update Backup Form Setting"}
      />
    </AppsContainer>
  );
};

export default Events;
