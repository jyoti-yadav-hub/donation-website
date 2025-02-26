/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  Breadcrumbs,
  Drawer,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import {
  getGridDateOperators,
  getGridStringOperators,
  GridActionsCellItem,
  GridColumns,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { styled } from "@mui/material/styles";
import IntlMessages from "@crema/utility/IntlMessages";
import { isArray, isEmpty } from "lodash";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { AppConfirmDialog } from "@crema";
import BankDynamicForm from "../BankDynamicForm";
import { LoadingButton } from "@mui/lab";
import moment from "moment";
import { getCountryLists } from "commonFunction";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";

const validationSchema = yup.object({
  country: yup.string().required("Please select country"),
});

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const BankList = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [btnLoad, setBtnLoad] = useState(false);
  const [bankList, setBankList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [countryData, setCountryData] = useState<any>([]);
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
  const [feilds, setFeilds] = useState<any>([]);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);

  const [keywords, setKeywords] = React.useState("");

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    style: { zIndex: 1000002 },
    PaperProps: {
      style: {
        zIndex: 1000002,
        maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
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

  //API For get added banks lists
  async function getBankList(nData) {
    setBankList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("bank/form-list", nData);
      if (res.success) {
        setBankList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setBankList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setBankList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  // function call for get All countries
  useEffect(() => {
    const getRaceReligionArray = async () => {
      await getCountryLists(setCountryData);
      await getBankList({
        page: 1,
        sort: sortModel[0].field,
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
      });
    };
    getRaceReligionArray();
  }, []);

  //API For delete banks from list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(`bank/form-delete/${id}`, "", "DELETE");
      if (res.success) {
        setOpen(false);
        getBankList({
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

  //API For create/update banks
  async function submitData(data: any) {
    if (isEmpty(feilds)) {
      console.log("feilds=====", feilds);
      toast.error("Please add form details");
    } else {
      const fData = {
        ...data,
        form_data: JSON.stringify(feilds),
      };
      setBtnLoad(true);
      const id = selectedItem?.id;
      let url = "";
      if (type === "edit") {
        url = `bank/form-update/${id}`;
      } else {
        url = `bank/form-create`;
      }
      try {
        const resp = await getApiData(
          url,
          fData,
          type === "edit" ? "PUT" : "POST"
        );
        if (resp.success) {
          toast.success(resp.message);
          setOpenModal(false);
          setType("");
          setSelectedItem({});
          getBankList({
            page: 1,
            sort: sortModel[0].field,
            sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
          });
          setFeilds([]);
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

  const columns: GridColumns = [
    { field: "_id", headerName: "ID", hide: true, filterable: false },
    {
      field: "country",
      headerName: "Country",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
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
      valueGetter: (params: any) =>
        params?.value ? params?.value : "-",
    },
    {
      field: "updatedBy",
      headerName: "Updated By",
      minWidth: 150,
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
              setFeilds(
                item && item.row && item.row.form_data
                  ? JSON.parse(item.row.form_data)
                  : []
              );
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
    getBankList(flt);
  }

  const handleClose = () => {
    setOpenModal(false);
    setType("");
    setSelectedItem({});
    setFeilds([]);
  };

  return (
    <AppsContainer
      title="Banks"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getBankList}
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
              <Typography color="text.primary">Manage Banks</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={NewBar}
        onChange={(event) => onChange(event)}
        row={bankList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={bankList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getBankList}
        setSortModel={setSortModel}
      />

      <Drawer
        sx={{
          zIndex: 1000002,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: { lg: "calc(100vw - 10%)", xl: "calc(100vw - 30%)" },
            boxSizing: "border-box",
          },
        }}
        anchor="right"
        open={openModal}
        onClose={handleClose}
      >
        <DialogTitle sx={{ fontSize: "18px" }}>
          <Typography variant="h4">
            {type === "edit" ? "Update Bank" : "Add New Bank"}
          </Typography>
        </DialogTitle>
        <Formik
          validateOnChange={true}
          initialValues={{
            country: selectedItem?.row?.country || "",
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
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
                style={{ height: "100%" }}
              >
                <DialogContent sx={{ pb: "10px" }}>
                  <Grid item xs={6} lg={3} sx={{ pb: 2 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-select-small">
                        Select country
                      </InputLabel>
                      <Select
                        MenuProps={MenuProps}
                        // MenuProps={{ style: { zIndex: 1000002 } }}
                        size="small"
                        name="country"
                        fullWidth
                        labelId="create-request"
                        label="Select country"
                        value={values.country}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {countryData &&
                          !isEmpty(countryData) &&
                          countryData?.map((val: any) => {
                            return (
                              <MenuItem value={val?.country} key={val?._id}>
                                {val?.country || ""}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                    {errors.country && touched.country && (
                      <ErrorTextStyle>{errors.country}</ErrorTextStyle>
                    )}
                  </Grid>
                  <BankDynamicForm
                    btnDisabled={btnDisabled}
                    setBtnDisabled={setBtnDisabled}
                    setFeilds={setFeilds}
                    feilds={feilds}
                  />
                </DialogContent>
                <DialogActions
                  sx={{
                    padding: "16px",
                    width: { lg: "calc(100vw - 10%)", xl: "calc(100vw - 30%)" },
                    position: "fixed",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "white",
                    zIndex: 10,
                  }}
                >
                  <LoadingButton
                    size="small"
                    variant="outlined"
                    color="success"
                    type="submit"
                    disabled={btnLoad || btnDisabled}
                    loading={btnLoad}
                  >
                    <IntlMessages
                      id={type === "edit" ? "common.update" : "Create"}
                    />
                  </LoadingButton>
                  <Button size="small" variant="outlined" onClick={handleClose}>
                    Cancel
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </Drawer>

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
        title="Are you sure you want to delete this Bank?"
        dialogTitle="Delete Bank"
      />
    </AppsContainer>
  );
};

export default BankList;
