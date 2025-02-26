/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Add,
  DeleteOutline,
  EditOutlined,
  RemoveCircleOutlineOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  Typography,
  Breadcrumbs,
  TextField,
  IconButton,
  Grid,
} from "@mui/material";
import {
  getGridStringOperators,
  GridActionsCellItem,
  GridColumns,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import { styled } from "@mui/material/styles";
import { isEmpty, size, isArray } from "lodash";
import IntlMessages from "@crema/utility/IntlMessages";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import { LoadingButton } from "@mui/lab";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { AppConfirmDialog, AppSearchBar } from "@crema";
import DialogSlide from "components/DialogSlide";
import { v4 } from "uuid";

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Title is required")
    .trim()
    .min(3, "Name should be 3 chars minimum.")
    .max(20, "Maximum 20 characters allowed"),
});

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const style = { width: 500 };

const PaymentGatewayList = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [feilds, setFeilds] = useState<any>([]);
  const [error, setError] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [btnLoad, setBtnLoad] = useState(false);
  const [paymentList, setPaymentList] = React.useState<any>({
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

  const mainSectionData = { label: "", value: "", id: v4() };

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

  //API For get paymentgateway list
  async function getPaymentGatewayLists(nData) {
    setPaymentList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("payment-gateway/list", nData);
      if (res.success) {
        setPaymentList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setPaymentList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setPaymentList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getPaymentGatewayLists({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  //API For delete paymentgateway list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(
        `payment-gateway/delete/${id}`,
        "",
        "DELETE"
      );
      if (res.success) {
        setOpen(false);
        getPaymentGatewayLists({
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

  // Validatins for inputs
  const validation = () => {
    let haveError = false;
    let ques = isArray(feilds) ? [...feilds] : [];
    // eslint-disable-next-line array-callback-return
    ques?.map((item: any, index) => {
      if (isEmpty(item?.label) || isEmpty(item?.value)) {
        ques[index].haveError = true;
        haveError = true;
      } else {
        ques[index].haveError = false;
      }
    });
    return haveError;
  };

  //API For create/update payment-gateway list
  async function submitData(data: any) {
    const haveError = validation();
    if (isEmpty(feilds)) {
      toast.error("Inputs are required");
    } else if (haveError) {
      return null;
    } else {
      setBtnLoad(true);
      const id = selectedItem?.id;
      let url = "";
      if (type === "edit") {
        url = `payment-gateway/update/${id}`;
      } else {
        url = `payment-gateway/create`;
      }
      const cData = { ...data, form_data: JSON.stringify(feilds) };
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
          setFeilds([]);
          setSelectedItem({});
          getPaymentGatewayLists({
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

  const columns: GridColumns = [
    { field: "_id", headerName: "ID", hide: true, filterable: false },
    {
      field: "name",
      headerName: "Payment-Gateway",
      minWidth: 100,
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
              setFeilds(
                item && item.row && item.row.form_settings
                  ? JSON.parse(item.row.form_settings)
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
    getPaymentGatewayLists(flt);
  }

  const handleClose = () => {
    setOpenModal(false);
    setType("");
    setFeilds([]);
    setSelectedItem({});
  };

  // Add section in Form
  const add = () => {
    let ques = isArray(feilds) ? [...feilds] : [];
    if (!isEmpty(ques)) {
      ques.push(mainSectionData);
    } else {
      ques = [mainSectionData];
    }
    setFeilds(ques);
  };

  // Remove inputs
  const remove = (quesKey: any) => {
    let ques: any = isArray(feilds) ? [...feilds] : [];
    let newArry = ques.filter((i: any) => i.id !== quesKey);
    setFeilds(newArry);
  };

  // On data change
  const onChangeValue = (type, name, value, i1, i2 = 0, i3 = 0) => {
    let ques = isArray(feilds) ? [...feilds] : [];
    if (type === "main") {
      const str = value.replace(/\s\s+/g, " ");
      ques[i1][name] = str;
      ques[i1].labelErr = "";
      ques[i1].valueErr = "";
    }
    setFeilds(ques);
  };

  return (
    <AppsContainer
      title="Payment-Gateway"
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
                getPaymentGatewayLists({
                  name: JSON.stringify(e.target.value),
                  operator: "contains",
                });
              }}
              placeholder={"Search by name"}
            />
          </Grid>
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
              <Typography color="text.primary">Payment-Gateway</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={NewBar}
        onChange={(event) => onChange(event)}
        row={paymentList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={paymentList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getPaymentGatewayLists}
        setSortModel={setSortModel}
      />

      <DialogSlide
        open={openModal}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle={
          type === "edit" ? "Update Payment-Gateway" : "Add New Payment-Gateway"
        }
      >
        <Box sx={style}>
          <Formik
            validateOnChange={true}
            validationSchema={validationSchema}
            initialValues={{ name: selectedItem?.row?.name || "" }}
            onSubmit={(values: any) => submitData(values)}
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
                      placeholder="Title Of Payment-Gateway"
                      name="name"
                      label="Title Of Payment-Gateway"
                      variant="outlined"
                      onChange={(event: any) => {
                        const str = event.target.value.replace(/\s\s+/g, " ");
                        setTimeout(() => {
                          setFieldValue("name", str);
                        }, 150);
                        handleChange(event);
                      }}
                      onBlur={(event: any) => {
                        setFieldValue("name", values.name.trim());
                        handleBlur(event);
                      }}
                      value={values.name}
                    />
                    {errors.name && touched.name && (
                      <ErrorTextStyle>{errors.name}</ErrorTextStyle>
                    )}
                  </Box>

                  {!isEmpty(feilds) && size(feilds) >= 10 ? null : (
                    <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                      <Button
                        variant="outlined"
                        onClick={add}
                        size="small"
                        color="success"
                      >
                        <Add /> Add Inputs
                      </Button>
                    </Box>
                  )}

                  {feilds &&
                    feilds.map((ques: any, i: any) => {
                      if (
                        isEmpty(ques?.label) ||
                        isEmpty(ques?.value) ||
                        ques.haveError
                      ) {
                        setError(true);
                      } else {
                        setError(false);
                      }
                      return (
                        <Grid
                          container
                          spacing={2}
                          sx={{
                            display: "flex",
                            alignItems:
                              isEmpty(ques.label) || isEmpty(ques.value)
                                ? "flex-start"
                                : "center",
                            mb: { xs: 3, xl: 4 },
                          }}
                        >
                          <Grid item xs={5.5}>
                            <TextField
                              error={
                                (isEmpty(ques.label) && ques?.haveError) ||
                                ques?.labelErr
                                  ? true
                                  : false
                              }
                              helperText={
                                isEmpty(ques.label) && ques?.haveError
                                  ? "Label is required"
                                  : ques?.labelErr
                                  ? ques?.labelErr
                                  : ""
                              }
                              label="Input label"
                              fullWidth
                              name="label"
                              onChange={(e: any) => {
                                onChangeValue(
                                  "main",
                                  "label",
                                  e.target.value,
                                  i,
                                  0,
                                  0
                                );
                              }}
                              onBlur={(e: any) => {
                                let ques = isArray(feilds) ? [...feilds] : [];
                                ques[i]["label"] = e.target.value.trim();
                                setFeilds(ques);
                              }}
                              defaultValue={ques.label}
                              value={ques.label || ""}
                              size="small"
                              placeholder="Input label"
                            />
                          </Grid>
                          <Grid item xs={5.5}>
                            <TextField
                              error={
                                (isEmpty(ques.value) && ques?.haveError) ||
                                ques?.valueErr
                                  ? true
                                  : false
                              }
                              helperText={
                                (isEmpty(ques.value) && ques?.haveError) ||
                                ques?.valueErr
                                  ? "Value is required"
                                  : ques?.valueErr
                                  ? ques?.valueErr
                                  : ""
                              }
                              label="Input value"
                              fullWidth
                              name="value"
                              onChange={(e) =>
                                onChangeValue(
                                  "main",
                                  "value",
                                  e.target.value,
                                  i,
                                  0,
                                  0
                                )
                              }
                              onBlur={(e: any) => {
                                let ques = isArray(feilds) ? [...feilds] : [];
                                ques[i]["value"] = e.target.value.trim();
                                setFeilds(ques);
                              }}
                              defaultValue={ques.value}
                              value={ques.value || ""}
                              size="small"
                              placeholder="Input value"
                            />
                          </Grid>
                          <Grid item xs={0.5}>
                            <IconButton
                              color="warning"
                              size="small"
                              sx={{ padding: 0, ml: 1 }}
                              aria-label="delete"
                              onClick={() => remove(ques.id)}
                            >
                              <RemoveCircleOutlineOutlined />
                            </IconButton>
                          </Grid>
                        </Grid>
                      );
                    })}

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
                      disabled={btnLoad || error}
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
        title="Are you sure you want to delete this payment-gateway?"
        dialogTitle="Delete payment-gateway"
      />
    </AppsContainer>
  );
};

export default PaymentGatewayList;
