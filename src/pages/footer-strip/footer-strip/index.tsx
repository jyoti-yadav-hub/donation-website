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
  Grid,
  TextField,
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
import { isArray } from "lodash";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import { LoadingButton } from "@mui/lab";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { AppConfirmDialog } from "@crema";
import DialogSlide from "components/DialogSlide";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";
import { getSlug } from "components/getSlug";

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  outer_title: yup
    .string()
    .required("Outer Title is required")
    .min(3, "Outer Title should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
  outer_description: yup
    .string()
    .required("Outer Description is required")
    .min(3, "Outer Description should be 3 chars minimum.")
    .max(400, "Maximum 400 characters allowed"),
  inner_title: yup
    .string()
    .min(3, "Inner Title should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
  inner_description: yup
    .string()
    .min(3, "Inner Description should be 3 chars minimum.")
    .max(400, "Maximum 400 characters allowed"),
  slug: yup
    .string()
    .required("Slug is required")
    .min(3, "Slug should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
  url: yup
    .string()
    .min(3, "URL should be 3 chars minimum.")
    .max(300, "Maximum 300 characters allowed"),
});

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const style = { width: 500 };

const FooterStripList = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [btnLoad, setBtnLoad] = useState(false);
  const [stripLists, setStripLists] = React.useState<any>({
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

  //API For get footer-strips list
  async function getStripsList(nData) {
    setStripLists((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData(`footer-strip/list`, nData);
      if (res.success) {
        setStripLists({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setStripLists({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setStripLists({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getStripsList({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  //API For delete footer-strips list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(`footer-strip/delete/${id}`, "", "DELETE");
      if (res.success) {
        setOpen(false);
        getStripsList({
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

  //API For create/update footer-strips list
  async function submitData(data: any) {
    setBtnLoad(true);
    const id = selectedItem?.id;
    let url = "";
    if (type === "edit") {
      url = `footer-strip/update/${id}`;
    } else {
      url = `footer-strip/create`;
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
        getStripsList({
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
      minWidth: 200,
      hide: true,
      flex: 1,
      filterable: false,
    },
    {
      field: "outer_title",
      headerName: "Outer Title",
      minWidth: 250,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "outer_description",
      headerName: "Outer Description",
      minWidth: 400,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "inner_title",
      headerName: "Inner Title",
      minWidth: 250,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "inner_description",
      headerName: "Inner Description",
      minWidth: 400,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "slug",
      headerName: "Slug",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "url",
      headerName: "URL",
      minWidth: 300,
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
      filterOperators: dateFilterOperators,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
    },
    {
      field: "createdBy",
      headerName: "Created By",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) =>
        params?.value ? params?.value : "-",
      },
    {
      field: "updatedBy",
      headerName: "Updated By",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) =>
        params?.value ? params?.value : "-",
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
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    getStripsList(flt);
  }

  const handleClose = () => {
    setOpenModal(false);
    setType("");
    setSelectedItem({});
  };

  return (
    <AppsContainer
      title="Footer Strips"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getStripsList}
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
              <Typography color="text.primary">Manage Footer Strip</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={NewBar}
        onChange={(event) => onChange(event)}
        row={stripLists?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={stripLists?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getStripsList}
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
        dialogTitle={
          type === "edit" ? "Update Footer Strip" : "Add New Footer Strip"
        }
      >
        <Box sx={style}>
          <Formik
            validateOnChange={true}
            initialValues={{
              outer_title: selectedItem?.row?.outer_title || "",
              outer_description: selectedItem?.row?.outer_description || "",
              inner_title: selectedItem?.row?.inner_title || "",
              inner_description: selectedItem?.row?.inner_description || "",
              slug: selectedItem?.row?.slug || "",
              url: selectedItem?.row?.url || "",
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
                  <Grid
                    container
                    spacing={4}
                    sx={{ m: 0, width: "100%", pr: 4 }}
                  >
                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Enter Outer Title"
                        name="outer_title"
                        label={"Outer Title"}
                        variant="outlined"
                        onBlur={(event: any) => {
                          const str = event.target.value.replace(/\s\s+/g, " ");
                          const trimStr = str.trim();
                          setFieldValue("outer_title", trimStr);
                          handleBlur(event);
                        }}
                        value={values.outer_title}
                        onChange={(event: any) => {
                          handleChange(event);
                          const newVal = getSlug(event.target.value);
                          setFieldValue("slug", newVal);
                        }}
                      />
                      {errors.outer_title && touched.outer_title && (
                        <ErrorTextStyle>{errors.outer_title}</ErrorTextStyle>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        fullWidth
                        inputProps={{ maxLength: 400 }}
                        helperText={`${values.outer_description.length} / 400`}
                        minRows={3}
                        maxRows={5}
                        multiline={true}
                        placeholder="Enter Outer Description"
                        name="outer_description"
                        label={"Outer Description"}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={(event: any) => {
                          // const str = event.target.value.replace(/\s\s+/g, " ");
                          const trimStr = event.target.value.trim();
                          setFieldValue("outer_description", trimStr);
                          handleBlur(event);
                        }}
                        value={values.outer_description}
                      />
                      {errors.outer_description &&
                        touched.outer_description && (
                          <ErrorTextStyle>
                            {errors.outer_description}
                          </ErrorTextStyle>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Enter Inner Title"
                        name="inner_title"
                        label={"Inner Title"}
                        variant="outlined"
                        onBlur={(event: any) => {
                          const str = event.target.value.replace(/\s\s+/g, " ");
                          const trimStr = str.trim();
                          setFieldValue("inner_title", trimStr);
                          handleBlur(event);
                        }}
                        value={values.inner_title}
                        onChange={(event: any) => handleChange(event)}
                      />
                      {errors.inner_title && touched.inner_title && (
                        <ErrorTextStyle>{errors.inner_title}</ErrorTextStyle>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        fullWidth
                        inputProps={{ maxLength: 400 }}
                        helperText={`${values.inner_description.length} / 400`}
                        minRows={3}
                        maxRows={5}
                        multiline={true}
                        placeholder="Enter Inner Description"
                        name="inner_description"
                        label={"Inner Description"}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={(event: any) => {
                          const str = event.target.value.replace(/\s\s+/g, " ");
                          const trimStr = str.trim();
                          setFieldValue("inner_description", trimStr);
                          handleBlur(event);
                        }}
                        value={values.inner_description}
                      />
                      {errors.inner_description &&
                        touched.inner_description && (
                          <ErrorTextStyle>
                            {errors.inner_description}
                          </ErrorTextStyle>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Enter Slug"
                        name="slug"
                        disabled
                        label={"Slug"}
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.slug}
                        onChange={(event: any) => handleChange(event)}
                      />
                      {errors.slug && touched.slug && (
                        <ErrorTextStyle>{errors.slug}</ErrorTextStyle>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Enter URL Title"
                        name="url"
                        label={"URL Title"}
                        variant="outlined"
                        onBlur={(event: any) => {
                          const str = event.target.value.replace(/\s\s+/g, " ");
                          const trimStr = str.trim();
                          setFieldValue("url", trimStr);
                          handleBlur(event);
                        }}
                        value={values.url}
                        onChange={(event: any) => handleChange(event)}
                      />
                      {errors.url && touched.url && (
                        <ErrorTextStyle>{errors.url}</ErrorTextStyle>
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
                        disabled={btnLoad}
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
    </AppsContainer>
  );
};

export default FooterStripList;
