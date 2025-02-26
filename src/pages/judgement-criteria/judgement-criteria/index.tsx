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
import { getCategoryList } from "commonFunction";

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  description: yup
    .string()
    .required("Judgement Criteria description is required")
    .min(3, "Judgement Criteria description should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
  status: yup.string().required("Please select status"),
  category_id: yup.string().required("Please select category"),
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

const JudgementCriteriaList = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [btnLoad, setBtnLoad] = useState(false);
  const [categoryList, setCategoryList] = React.useState<any[]>([]);
  const [judgementCriteriaList, setJudgementCriteriaList] = React.useState<any>(
    {
      lists: [],
      listsLoad: true,
    }
  );
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

  //API For get Judgement Criteria list
  async function getJudgementCriteria(nData) {
    setJudgementCriteriaList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData(`judgement-criteria/list`, nData);
      if (res.success) {
        setJudgementCriteriaList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setJudgementCriteriaList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setJudgementCriteriaList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  // Get all categories
  async function getMyCategories() {
    const data = await getCategoryList();
    setCategoryList(data);
  }

  useEffect(() => {
    getJudgementCriteria({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
    getMyCategories();
  }, []);

  //API For delete Judgement Criteria list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(
        `judgement-criteria/delete/${id}`,
        "",
        "DELETE"
      );
      if (res.success) {
        setOpen(false);
        getJudgementCriteria({
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

  //API For create/update Judgement Criteria list
  async function submitData(data: any) {
    setBtnLoad(true);
    const id = selectedItem?.id;
    let url = "";
    if (type === "edit") {
      url = `judgement-criteria/update/${id}`;
    } else {
      url = `judgement-criteria/create`;
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
        getJudgementCriteria({
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
      filterable: false,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
    },

    {
      field: "category_name",
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
    getJudgementCriteria(flt);
  }

  const handleClose = () => {
    setOpenModal(false);
    setType("");
    setSelectedItem({});
  };

  return (
    <AppsContainer
      title="Judgement Criteria"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getJudgementCriteria}
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
              <Typography color="text.primary">Judgement Criteria</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={NewBar}
        onChange={(event) => onChange(event)}
        row={judgementCriteriaList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={judgementCriteriaList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getJudgementCriteria}
        setSortModel={setSortModel}
      />

      <DialogSlide
        open={openModal}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle={
          type === "edit"
            ? "Update Judgement Criteria"
            : "Add New Judgement Criteria"
        }
      >
        <Box sx={style}>
          <Formik
            validateOnChange={true}
            initialValues={{
              description: selectedItem?.row?.description || "",
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
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Enter Description"
                      name="description"
                      label={<IntlMessages id="Description" />}
                      variant="outlined"
                      autoFocus
                      onBlur={(event: any) => {
                        const str = event.target.value.replace(/\s\s+/g, " ");
                        const trimStr = str.trim();
                        setFieldValue("description", trimStr);
                        handleBlur(event);
                      }}
                      value={values.description}
                      onChange={(event: any) => handleChange(event)}
                    />
                    {errors.description && touched.description && (
                      <ErrorTextStyle>{errors.description}</ErrorTextStyle>
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

                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-select-small">Category</InputLabel>
                      <Select
                        MenuProps={{ style: { zIndex: 1000002 } }}
                        label="Select default form"
                        value={values.category_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Category"
                        name="category_id"
                      >
                        {categoryList.map((item) => (
                          <MenuItem value={item._id} key={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
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
        title="Are you sure you want to delete this Judgement Criteria?"
        dialogTitle="Delete Judgement Criteria"
      />
    </AppsContainer>
  );
};

export default JudgementCriteriaList;
