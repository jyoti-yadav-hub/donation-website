/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Form, Formik } from "formik";
import * as yup from "yup";
import {
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  Breadcrumbs,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  GridColumns,
  GridActionsCellItem,
  GridSortModel,
  getGridStringOperators,
  getGridDateOperators,
} from "@mui/x-data-grid-pro";
import { Add, EditOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import { isArray, isEmpty } from "lodash";
import { getSlug } from "components/getSlug";
import IntlMessages from "@crema/utility/IntlMessages";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import { LoadingButton } from "@mui/lab";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { AppCard, AppConfirmDialog } from "@crema";
import DialogSlide from "components/DialogSlide";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name should be 3 chars minimum.")
    .max(80, "Maximum 80 characters allowed"),
  slug: yup.string().required("Slug is required"),
  value: yup
    .string()
    .required("Value is required")
    .min(1, "Value should be 1 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
  group_name: yup
    .string()
    .required("Group Name is required")
    .min(3, "Group name should be 3 chars minimum.")
    .max(20, "Maximum 20 characters allowed"),
});

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const BodyStyle = styled(Box)(({ theme }) => ({
  "& .nameDiv": { display: "flex", alignItems: "center" },
  "& .categoy-card": {
    cursor: "pointer",
    // "&:hover": { transition: "all 0.2s ease" },
    "& .MuiCardContent-root": {
      padding: "10px !important",
      borderRadius: "5px !important",
      display: "flex !important",
      alignItems: "center",
    },
  },
}));

const style = { width: 400 };

const Setting = () => {
  const [groupsList, setGroupsList] = React.useState<any>([]);
  const [settingsList, setSettingsList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [categoryList, setCategoryList] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState("");
  const [openDltModal, setOpenDltModal] = useState<any>(false);
  const [btnLoad, setBtnLoad] = useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [nameValue, setNameValue] = React.useState("");
  const [selectedID, setSelectedID] = React.useState("common" || "");
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
            setOpen(true);
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

  //API for get categories lists
  async function onGetCategoryList() {
    try {
      const resp = await getApiData(`category/list`, { allData: 1 }, "GET");
      if (resp.success) {
        setCategoryList(isArray(resp.data) ? resp.data : []);
      } else {
        setCategoryList([]);
        toast.error(resp.message);
      }
    } catch (error) {
      console.log("error====", error);
      setCategoryList([]);
      toast.error("Something went wrong");
    }
  }

  //API for get seetings groups lists
  async function onGetSettingsList(nData?: any, groupName?: any) {
    setSettingsList((e) => ({ ...e, listsLoad: true }));
    try {
      const grpName = groupName || selectedID;
      const res = await getApiData(`setting/group-data/${grpName}`, nData);
      if (res.success) {
        setSettingsList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
        onGetCategoryList();
      } else {
        setSettingsList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setSettingsList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  //API for get seetings groups lists
  async function onGetSettingGroups(nData?: any) {
    try {
      const res = await getApiData("setting/group-list", nData);
      if (res.success) {
        setGroupsList(res.data ? res.data : []);
        onGetSettingsList({
          page: 1,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
      } else {
        setGroupsList([]);
        toast.error(res.message);
      }
    } catch (error) {
      setGroupsList([]);
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    onGetSettingGroups();
  }, []);

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    onGetSettingsList(flt);
  }

  async function deleteList(item: any) {
    setDltLoad(true);
    const id = item?.id;
    try {
      const res = await getApiData(`setting/delete/${id}`, {}, "DELETE");
      if (res.success) {
        toast.success(res.message);
        setOpenDltModal(false);
        onGetSettingsList({
          page: 1,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
        setSelectedItem({});
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
      field: "value",
      headerName: "Value",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "group_name",
      headerName: "Group Name",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "createdAt",
      headerName: "Create At",
      minWidth: 200,
      flex: 1,
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
              setOpen(true);
              setType("edit");
              setSelectedItem(item);
            }}
            color="inherit"
          />,
          // <GridActionsCellItem
          //   icon={<DeleteOutline />}
          //   label="Delete"
          //   onClick={(event) => {
          //     setSelectedItem(item);
          //     setOpenDltModal(true);
          //   }}
          //   color="inherit"
          // />,
        ];
      },
    },
  ];

  async function submitData(data: any) {
    setBtnLoad(true);
    const id = selectedItem?.id;
    let url = "";
    if (type === "edit") {
      url = `setting/update/${id}`;
    } else {
      url = `setting/create`;
    }
    try {
      const resp = await getApiData(
        url,
        data,
        type === "edit" ? "PUT" : "POST"
      );
      if (resp.success) {
        toast.success(resp.message);
        setOpen(false);
        setType("");
        setNameValue("");
        setSelectedItem({});
        onGetSettingsList({
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

  const handleClose = () => {
    setNameValue("");
    setOpen(false);
    setType("");
    setSelectedItem({});
  };

  return (
    <AppsContainer
      title="Settings"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={onGetSettingsList}
            setKeywords={setKeywords}
            keywords={keywords}
            sortModel={sortModel}
          />
        );
      }}
    >
      <BodyStyle>
        <AppsHeader>
          <div style={{ display: "flex", alignItems: "center" }}>
            <BreadWrapper>
              <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "20px 0px" }}>
                <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                  Dashboards
                </Link>
                <Typography color="text.primary">Settings</Typography>
              </Breadcrumbs>
            </BreadWrapper>
          </div>
        </AppsHeader>

        <Grid container spacing={4} sx={{ margin: 0, marginRight: "10px" }}>
          {!isEmpty(groupsList) && (
            <Grid item xs={1} lg={1} xl={0.8}>
              <Box sx={{ mt: 2 }}>Groups:</Box>
            </Grid>
          )}
          <Grid
            item
            lg={11}
            xl={11.2}
            sx={{ display: "flex", alignItems: "center" }}
          >
            {groupsList?.map((item: any) => {
              return (
                <Grid item sx={{ mr: 4, mb: 2 }}>
                  <AppCard
                    onClick={() => {
                      setSelectedID(item?._id);
                      onGetSettingsList(
                        {
                          page: 1,
                          sort: sortModel[0].field,
                          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
                        },
                        item?._id
                      );
                    }}
                    className="categoy-card"
                    sxStyle={{
                      width: "100%",
                      borderRadius: 4,
                      boxShadow: "none",
                      backgroundColor:
                        selectedID === item?._id
                          ? "#0baae0 !important"
                          : "#f4f7fe",
                    }}
                  >
                    <div style={{ width: "100%" }}>
                      <div
                        className="nameDiv"
                        style={{ justifyContent: "space-between" }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            // fontSize: "16px",
                            fontWeight: 500,
                            color: selectedID === item?._id ? "#FFF" : "",
                          }}
                        >
                          {item && item?._id
                            ? item?._id.charAt(0).toUpperCase() +
                              item?._id.slice(1)
                            : "-"}
                        </Typography>
                      </div>
                    </div>
                  </AppCard>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <CTable
          tableStyle={{ height: "calc(100vh - 270px) !important" }}
          initialState={{ pinnedColumns: { right: ["actions"] } }}
          onRowClick={() => console.log("click")}
          NewBar={NewBar}
          onChange={(event) => onChange(event)}
          row={settingsList?.lists || []}
          column={columns}
          rowCount={pagination.total}
          page={pagination.page}
          listsLoad={settingsList?.listsLoad}
          checkboxSelection={false}
          onSelectionModelChange={() => console.log("row select")}
          groupData={
            isEmpty(selectedID) && !isEmpty(settingsList?.lists) ? true : false
          }
          sortModel={sortModel}
          getApiCall={onGetSettingsList}
          setSortModel={setSortModel}
        />
      </BodyStyle>

      <DialogSlide
        open={open}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle={type === "edit" ? "Update Setting" : "Add Setting"}
      >
        <Box sx={style}>
          <Formik
            validateOnChange={true}
            initialValues={{
              name: selectedItem?.row?.name || "",
              slug: selectedItem?.row?.slug || "",
              value: selectedItem?.row?.value || "",
              group_name: selectedItem?.row?.group_name || "",
              category_slug: selectedItem?.row?.category_slug || "",
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
                <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Enter your name"
                      name="name"
                      label={<IntlMessages id="Name" />}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.name}
                      onChange={(event: any) => {
                        handleChange(event);
                        if (type !== "edit") {
                          const newVal = getSlug(event.target.value);
                          setNameValue(newVal);
                          setFieldValue("slug", newVal);
                        }
                      }}
                      autoFocus
                    />
                    {errors.name && touched.name && (
                      <ErrorTextStyle>{errors.name}</ErrorTextStyle>
                    )}
                  </Box>

                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
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
                  </Box>

                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Enter value"
                      name="value"
                      label={<IntlMessages id="Value" />}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.value}
                      onChange={handleChange}
                    />
                    {errors.value && touched.value && (
                      <ErrorTextStyle>{errors.value}</ErrorTextStyle>
                    )}
                  </Box>

                  <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Enter group name"
                      name="group_name"
                      label={<IntlMessages id="Group Name" />}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.group_name}
                      onChange={handleChange}
                    />
                    {errors.group_name && touched.group_name && (
                      <ErrorTextStyle>{errors.group_name}</ErrorTextStyle>
                    )}
                  </Box>

                  {/* <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-select-small">
                        Select category
                      </InputLabel>
                      <Select
                        label="Select category"
                        labelId="demo-select-small"
                        id="demo-select-small"
                        MenuProps={{
                          style: {
                            zIndex: 1000002,
                            maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
                          },
                        }}
                        size="small"
                        fullWidth
                        name="category_slug"
                        value={values.category_slug}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {categoryList &&
                          !isEmpty(categoryList) &&
                          categoryList.map((fA) => {
                            return (
                              <MenuItem
                                value={fA.category_slug}
                                key={fA.category_slug}
                              >
                                {fA.name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      {errors.category_slug && touched.category_slug && (
                        <ErrorTextStyle>{errors.category_slug}</ErrorTextStyle>
                      )}
                    </FormControl>
                  </Box> */}

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
        open={openDltModal}
        disabled={dltLoad}
        loading={dltLoad}
        onDeny={() => {
          setDltLoad(false);
          setSelectedItem({});
          setOpenDltModal(false);
        }}
        onConfirm={() => deleteList(selectedItem)}
        title="Are you sure you want to delete this setting?"
        dialogTitle="Delete setting"
      />
    </AppsContainer>
  );
};

export default Setting;
