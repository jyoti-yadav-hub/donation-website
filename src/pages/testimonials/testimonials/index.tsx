/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  styled,
  Typography,
  alpha,
  Chip,
  FormControlLabel,
  Checkbox,
  Alert,
  TextField,
} from "@mui/material";
import {
  GridColumns,
  GridSortModel,
  getGridStringOperators,
  getGridDateOperators,
  getGridSingleSelectOperators,
} from "@mui/x-data-grid-pro";
import { isArray, isEmpty } from "lodash";
import { toast } from "react-toastify";
import moment from "moment";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import { initialTimeFormat } from "shared/constants/AppConst";
import CTable from "components/CTable";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import SearchComponent from "components/SearchBar";
import { Fonts } from "shared/constants/AppEnums";
import { AppConfirmDialog } from "@crema";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import MediaViewer from "@crema/core/AppMedialViewer";
import DialogSlide from "components/DialogSlide";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const ModalWrapper = styled(Box)(({ theme }) => ({
  "& .modalStyle": { width: 500 },
  "& .modalBtnDiv": {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
}));

const validationSchema = yup.object({
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description should be 10 chars minimum.")
    .max(250, "Maximum 250 characters allowed"),
});

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const VideoWrapper = styled("div")(({ theme }) => {
  return {
    cursor: "pointer",
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: theme.palette.common.black,
    "&:before": {
      content: "''",
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      paddingTop: "100%",
    },
    "& video, & iframe, & embed, & object": {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      border: "0 none",
      objectFit: "cover",
    },
  };
});

const TestimonialList = () => {
  const [testimonialList, setTestimonialList] = useState<any>({
    lists: [],
    listsLoad: false,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const [open, setOpen] = React.useState("");
  const [rejectModal, setRejectModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [btnLoad, setBtnLoad] = React.useState<any>(false);
  const [keywords, setKeywords] = React.useState("");
  const [index, setIndex] = useState(-1);
  const [imgUrl, setImgUrl] = React.useState("");
  const onClose = () => {
    setIndex(-1);
    setImgUrl("");
  };

  //API for get testimonial lists
  async function getTestimonialLists(nData) {
    setTestimonialList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("request/admin/testimonial-list", nData);
      if (res.success) {
        setTestimonialList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setTestimonialList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setTestimonialList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getTestimonialLists({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  //API For approve/reject testimonial
  async function updateAction(data?: any) {
    setBtnLoad(true);
    try {
      const id = selectedItem?.id;
      let cData = {};
      if (rejectModal) {
        cData = {
          reject_reason: data.description,
          allow_testimonial: data.allow_testimonial,
          status: "reject",
          id: selectedItem?.id,
        };
      } else {
        cData = { status: open, id: id };
      }
      const res = await getApiData(`request/verify-testimonial`, cData, "POST");
      if (res.success) {
        setOpen("");
        setRejectModal(false);
        getTestimonialLists({
          page: 1,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
        setSelectedItem({});
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setBtnLoad(false);
    } catch (error) {
      setBtnLoad(false);
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
  const singleSelectFilter = getGridSingleSelectOperators().filter(
    ({ value }) => ["is"].includes(value)
  );

  const columns: GridColumns = [
    {
      field: "_id",
      headerName: "ID",
      minWidth: 200,
      hide: true,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "video",
      headerName: "Video",
      width: 110,
      disableColumnMenu: true,
      filterable: false,
      renderCell: (item: any) => {
        return (
          <VideoWrapper>
            <video src={item.value} />
            <div
              onClick={() => {
                setImgUrl(item.value);
                setIndex(item.value ? 0 : -1);
              }}
            >
              <PlayCircleOutlineIcon
                sx={{
                  fontSize: 20,
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: (theme) => theme.palette.common.white,
                }}
              />
            </div>
          </VideoWrapper>
        );
      },
    },
    {
      field: "category_name",
      headerName: "Category",
      minWidth: 200,
      flex: 1,
      type: "string",
      filterOperators: strFilterOperators,
    },
    {
      field: "user_name",
      headerName: "User Name",
      minWidth: 200,
      flex: 1,
      type: "string",
      filterOperators: strFilterOperators,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 200,
      flex: 1,
      filterOperators: singleSelectFilter,
      type: "singleSelect",
      valueOptions: ["Pending", "Approved", "Rejected", "Deactivated"],
      renderCell: (item: any) => {
        return (
          <Chip
            style={{
              color: "#FFF",
              backgroundColor:
                item?.value === "approve"
                  ? "#2e7d32" //success
                  : item?.value === "reject"
                  ? "#d32f2f" //error
                  : item?.value === "deactive"
                  ? "#ED6C04" //error
                  : item?.value === "pending"
                  ? "#9c27b0"
                  : "#ebebeb", //default
            }}
            label={
              item?.value === "approve"
                ? "Approved"
                : item?.value === "reject"
                ? "Rejected"
                : item?.value === "deactive"
                ? "Deactivated"
                : item?.value?.charAt(0).toUpperCase() + item?.value?.slice(1)
            }
            variant="outlined"
            size="small"
          />
        );
      },
    },
    {
      field: "title_of_fundraiser",
      headerName: "Fundraiser Title",
      minWidth: 300,
      flex: 1,
      type: "string",
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
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 210,
      cellClassName: "actions",
      renderCell: (item: any) => {
        return [
          item.row.status === "reject" ? null : (
            <Button
              size="small"
              fullWidth
              sx={{
                backgroundColor: (theme) =>
                  alpha(theme.palette.success.main, 0.1),
                color: "success.main",
                fontWeight: Fonts.LIGHT,
                "&:hover, &:focus": {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.success.main, 0.15),
                  color: "success.main",
                },
                mr: item.row.status === "reject" ? 0 : 1,
              }}
              onClick={() => {
                setSelectedItem(item);
                setOpen("approve");
              }}
              disabled={btnLoad || item.row.status === "approve"}
            >
              {item.row.status === "approve"
                ? "Approved"
                : item.row.status === "deactive"
                ? "Activate"
                : "Approve"}
            </Button>
          ),
          <Button
            fullWidth
            size="small"
            sx={{
              backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1),
              color: "error.main",
              fontWeight: Fonts.LIGHT,
              "&:hover, &:focus": {
                backgroundColor: (theme) =>
                  alpha(theme.palette.error.main, 0.15),
                color: "error.main",
              },
              ml: item.row.status === "reject" ? 0 : 1,
            }}
            onClick={() => {
              setSelectedItem(item);
              if (item.row.status === "approve") {
                setOpen("deactive");
              } else {
                setRejectModal(true);
              }
            }}
            disabled={
              btnLoad ||
              item.row.status === "reject" ||
              item.row.status === "deactive"
            }
          >
            {item.row.status === "reject"
              ? "Rejected"
              : item.row.status === "approve"
              ? "Deactivate"
              : item.row.status === "deactive"
              ? "Deactivated"
              : "Reject"}
          </Button>,
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
    getTestimonialLists(flt);
  }

  const handleClose = () => {
    setOpen("");
    setRejectModal(false);
    setSelectedItem({});
  };

  // let approveDeactiveTitle =
  //   open === "approve"
  //     ? "Are you sure you want to Approve this Testimonial?"
  //     : "Are you sure you want to Deactivate this Testimonial?" +
  //       "\n" +
  //       "You can Activate it at anytime";

  return (
    <AppsContainer
      title={"Testimonials"}
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getTestimonialLists}
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
              <Typography color="text.primary">Testimonials</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        NewBar={null}
        onRowClick={() => console.log("click bugs===")}
        onChange={(event) => onChange(event)}
        row={testimonialList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={testimonialList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getTestimonialLists}
        setSortModel={setSortModel}
      />

      <DialogSlide
        open={rejectModal}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle={"Reject Testimonial"}
      >
        <ModalWrapper>
          <Box className="modalStyle">
            <Formik
              validateOnChange={true}
              initialValues={{ description: "", allow_testimonial: true }}
              validationSchema={validationSchema}
              onSubmit={(values) => updateAction(values)}
            >
              {(props) => {
                const {
                  values,
                  touched,
                  errors,
                  handleChange,
                  handleSubmit,
                  handleBlur,
                  setFieldValue,
                } = props;
                return (
                  <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                      <TextField
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={(event: any) => {
                          const str = event.target.value.replace(/\s\s+/g, " ");
                          const trimStr = str.trim();
                          setFieldValue("description", trimStr);
                          handleBlur(event);
                        }}
                        variant="outlined"
                        fullWidth
                        inputProps={{ maxLength: 250 }}
                        helperText={`${values.description.length} / 250`}
                        minRows={3}
                        maxRows={5}
                        multiline={true}
                        label={"Please enter the reason of rejection"}
                        placeholder={"Please enter the reason of rejection"}
                      />
                      {errors.description && touched.description && (
                        <ErrorTextStyle>{errors.description}</ErrorTextStyle>
                      )}
                    </Box>
                    <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                      <FormControlLabel
                        name="allow_testimonial"
                        control={
                          <Checkbox
                            defaultChecked={true}
                            value={values.allow_testimonial}
                            onChange={handleChange}
                            size="small"
                          />
                        }
                        label="Allow user to upload video in this request after rejection"
                      />
                      <Alert
                        severity="info"
                        sx={{
                          alignItems: "center",
                          p: "6px",
                          "& .MuiAlert-icon": { p: 0, mr: "5px" },
                          "& .MuiAlert-message": { p: 0, mb: "1px" },
                        }}
                      >
                        If you uncheck this, user can't able to upload video
                        anymore
                      </Alert>
                    </Box>
                    <div className="modalBtnDiv">
                      <LoadingButton
                        size="small"
                        type="submit"
                        variant="outlined"
                        color="primary"
                        loading={btnLoad}
                        disabled={btnLoad}
                      >
                        Submit
                      </LoadingButton>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </ModalWrapper>
      </DialogSlide>

      <AppConfirmDialog
        open={!isEmpty(open)}
        disabled={btnLoad}
        loading={btnLoad}
        onDeny={handleClose}
        onConfirm={() => updateAction(null)}
        title={
          open === "approve"
            ? "Are you sure you want to Approve this Testimonial?"
            : "Are you sure you want to Deactivate this Testimonial?"
        }
        dialogTitle={
          open === "approve" ? "Approve Testimonial" : "Deactivate Testimonial"
        }
      />

      <MediaViewer
        index={index}
        medias={[imgUrl].map((data) => {
          return {
            url: data,
            mime_type: "video",
          };
        })}
        onClose={onClose}
      />
    </AppsContainer>
  );
};

export default TestimonialList;
