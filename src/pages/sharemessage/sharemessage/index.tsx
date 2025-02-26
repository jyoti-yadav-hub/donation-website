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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import { isArray, isEmpty } from "lodash";
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
import AppTooltip from "@crema/core/AppTooltip";

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  message: yup
    .string()
    .required("Message is required")
    .min(3, "Message should be 3 chars minimum.")
    .max(1000, "Maximum 1000 characters allowed"),
  causes: yup.string().required("Cause is required"),
});

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const style = { width: 600 };

const ShareMessageList = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [btnLoad, setBtnLoad] = useState(false);
  const [messageList, setMessageList] = React.useState<any>({
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
  const [causesList, setCausesList] = useState<any>([]);

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

  //API For get message list
  async function getMessageList(nData) {
    setMessageList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData(`share-message/admin/list`, nData);
      if (res.success) {
        setMessageList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setMessageList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setMessageList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  //API for get causes lists
  async function getCausesList() {
    try {
      const resp = await getApiData(
        `share-message/category-list`,
        { allData: 1 },
        "GET"
      );
      if (resp.success) {
        setCausesList(isArray(resp.data) ? resp.data : []);
        getMessageList({
          page: 1,
          search: keywords ? keywords : null,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
      } else {
        setCausesList([]);
        toast.error(resp.message);
      }
    } catch (error) {
      console.log("error====", error);
      setCausesList([]);
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getCausesList();
  }, []);

  //API For delete message list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(`share-message/delete/${id}`, "", "DELETE");
      if (res.success) {
        setOpen(false);
        getMessageList({
          page: 1,
          search: keywords ? keywords : null,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
        getCausesList();
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

  //API For create/update share message
  async function submitData(data: any) {
    setBtnLoad(true);
    const id = selectedItem?.id;
    let url = "";
    if (type === "edit") {
      url = `share-message/update/${id}`;
    } else {
      url = `share-message/create`;
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
        getMessageList({
          page: 1,
          search: keywords ? keywords : null,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
        getCausesList();
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
      field: "message",
      headerName: "Message",
      minWidth: 500,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <AppTooltip title={item?.value || ""} placement={"top-start"}>
            <Typography sx={{ fontSize: 12 }}>{item?.value || ""}</Typography>
          </AppTooltip>
        );
      },
    },
    {
      field: "causes",
      headerName: "Causes",
      minWidth: 200,
      flex: 1,
      renderCell: (item: any) => {
        return (
          <>
            {item?.value?.charAt(0).toUpperCase() + item?.value?.slice(1) ||
              "-"}
          </>
        );
      },
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
      field: "createdBy",
      headerName: "Created By",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) => (params?.value ? params?.value : "-"),
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
    flt.search = keywords ? keywords : null;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    flt.operator = "contains";
    getMessageList(flt);
  }

  const handleClose = () => {
    setOpenModal(false);
    setType("");
    setSelectedItem({});
  };

  return (
    <AppsContainer
      title="Share Messages"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getMessageList}
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
              <Typography color="text.primary">Share Messages</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={NewBar}
        onChange={(event) => onChange(event)}
        row={messageList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={messageList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getMessageList}
        keyword={keywords}
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
        dialogTitle={type === "edit" ? "Update Message" : "Add New Message"}
      >
        <Box sx={style}>
          <Formik
            validateOnChange={true}
            initialValues={{
              message: selectedItem?.row?.message || "",
              causes: selectedItem?.row?.causes || "",
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
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-select-small">
                          Select Cause
                        </InputLabel>
                        <Select
                          disabled={type === "edit" ? true : false}
                          MenuProps={MenuProps}
                          size="small"
                          name="causes"
                          fullWidth
                          labelId="create-request"
                          label="Select Cause"
                          value={values.causes}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          {causesList &&
                            !isEmpty(causesList) &&
                            causesList?.map((val: any) => {
                              return (
                                <MenuItem
                                  disabled={val?.disabled ? true : false}
                                  value={val?.category_slug}
                                  key={val?._id}
                                >
                                  {val?.name || ""}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                      {errors.causes && touched.causes && (
                        <ErrorTextStyle>{errors.causes}</ErrorTextStyle>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Enter Message"
                        name="message"
                        label={"Enter Message"}
                        variant="outlined"
                        onBlur={(event: any) => {
                          const str = event.target.value.replace(/\s\s+/g, " ");
                          const trimStr = str.trim();
                          setFieldValue("message", trimStr);
                          handleBlur(event);
                        }}
                        inputProps={{ maxLength: 1000 }}
                        helperText={`${values.message.length} / 1000`}
                        minRows={3}
                        maxRows={5}
                        multiline={true}
                        value={values.message}
                        onChange={handleChange}
                      />
                      {errors.message && touched.message && (
                        <ErrorTextStyle>{errors.message}</ErrorTextStyle>
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
        title="Are you sure you want to delete this message?"
        dialogTitle="Delete Message"
      />
    </AppsContainer>
  );
};

export default ShareMessageList;
