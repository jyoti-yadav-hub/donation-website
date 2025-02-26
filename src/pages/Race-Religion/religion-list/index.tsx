/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { AppConfirmDialog, AppSearchBar } from "@crema";
import { Form, Formik } from "formik";
import * as yup from "yup";
import IntlMessages from "@crema/utility/IntlMessages";
import {
  getGridStringOperators,
  GridActionsCellItem,
  GridColumns,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import { isArray } from "lodash";
import { toast } from "react-toastify";
import getApiData from "shared/helpers/apiHelper";
import CTable from "components/CTable";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { Link } from "react-router-dom";
import DialogSlide from "components/DialogSlide";
import { LoadingButton } from "@mui/lab";
import AppsContainer from "@crema/core/AppsContainer";

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  religion: yup
    .string()
    .trim()
    .required("Religion name is required")
    .min(3, "Name should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
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

const style = { width: 400 };

const ReligionList = () => {
  const [religionList, setReligionList] = useState<any>({
    lists: [],
    listsLoad: false,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });

  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [type, setType] = React.useState("");
  const [btnLoad, setBtnLoad] = useState(false);
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const [keywords, setKeywords] = React.useState("");

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

  //API for get religion lists
  async function getReligionList(nData: any) {
    setReligionList((e: any) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData(`religion/admin/list`, nData);
      if (res.success) {
        setReligionList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setReligionList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setReligionList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getReligionList({
      page: 1,
      religion: keywords ? keywords : null,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  const strFilterOperators = getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value)
  );

  const columns: GridColumns = [
    { field: "_id", headerName: "ID", hide: true, filterable: false },
    {
      field: "religion",
      headerName: "Religion",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
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
    flt.page = newPage + 1;
    flt.religion = keywords ? JSON.stringify(keywords) : null;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    flt.operator = "contains";
    getReligionList(flt);
  }

  // API For delete religion
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(`religion/delete/${id}`, "", "DELETE");
      if (res.success) {
        setOpen(false);
        getReligionList({
          page: 1,
          religion: keywords ? keywords : null,
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

  // API For Create/Update religion
  async function submitData(data: any) {
    setBtnLoad(true);
    const id = selectedItem?.id;
    let url = "";
    if (type === "edit") {
      url = `religion/update/${id}`;
    } else {
      url = `religion/create`;
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
        getReligionList({
          page: 1,
          religion: keywords ? keywords : null,
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

  const handleClose = () => {
    setOpenModal(false);
    setType("");
    setSelectedItem({});
  };

  return (
    <AppsContainer
      title="Religion List"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <Grid item>
            <AppSearchBar
              sx={{
                marginRight: 0,
                width: "100%",
                "& .searchRoot": { width: "100%" },
                "& .MuiInputBase-input": {
                  width: "100%",
                  "&:focus": { width: "100%" },
                },
              }}
              iconPosition="right"
              overlap={false}
              value={keywords}
              onChange={(e: any) => {
                setKeywords(e.target.value);
                getReligionList({
                  religion: JSON.stringify(e.target.value),
                  operator: "contains",
                });
              }}
              placeholder={"Search by religion"}
            />
          </Grid>
        );
      }}
    >
      <AppsHeader>
        <div style={{ display: "flex", alignItems: "center" }}>
          <BreadWrapper>
            <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "20px 0px " }}>
              <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                Dashboards
              </Link>
              <Typography color="text.primary">Religion List</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={NewBar}
        onChange={(event) => onChange(event)}
        row={religionList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={religionList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getReligionList}
        keyword={keywords}
        keywordName="religion"
        setSortModel={setSortModel}
      />

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
        title="Are you sure you want to delete this Religion?"
        dialogTitle="Delete Religion"
      />

      <DialogSlide
        open={openModal}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle={type === "edit" ? "Update Religion" : "Add Religion"}
      >
        <Box sx={style}>
          <Formik
            validateOnChange={true}
            initialValues={{ religion: selectedItem?.row?.religion || "" }}
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
                      placeholder="Enter Religion"
                      name="religion"
                      label={<IntlMessages id="Religion" />}
                      variant="outlined"
                      onChange={(event: any) => {
                        const str = event.target.value.replace(/\s\s+/g, " ");
                        setTimeout(() => {
                          setFieldValue("religion", str);
                        }, 150);
                        handleChange(event);
                      }}
                      onBlur={(event: any) => {
                        setFieldValue("religion", values.religion.trim());
                        handleBlur(event);
                      }}
                      value={values.religion}
                      autoFocus
                    />
                    {errors.religion && touched.religion && (
                      <ErrorTextStyle>{errors.religion}</ErrorTextStyle>
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
                      onClick={() => {
                        setFieldValue("religion", values.religion.trim());
                      }}
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
    </AppsContainer>
  );
};

export default ReligionList;
