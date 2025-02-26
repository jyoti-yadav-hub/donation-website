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
  TextField,
  AvatarGroup,
  Avatar,
} from "@mui/material";
import {
  GridColumns,
  GridSortModel,
  getGridStringOperators,
  getGridDateOperators,
} from "@mui/x-data-grid-pro";
import AssignmentIcon from "@mui/icons-material/Assignment";
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

const UsersBanksList = () => {
  const [banksList, setBanksList] = useState<any>({
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
  const [fileType, setFileType] = useState<any>("");
  const [imageURL, setImageURL] = useState<any>("");
  const [filesData, setFilesData] = useState<any>([]);
  const [itemIndex, setIndex] = useState<any>(-1);
  let FileURLdata = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG", "svg", "SVG"];

  const onClose = () => {
    setFilesData([]);
    setImageURL("");
    setIndex(-1);
  };

  //API for get testimonial lists
  async function getUsersBankList(nData) {
    setBanksList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("bank/admin/list", nData);
      if (res.success) {
        setBanksList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setBanksList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setBanksList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getUsersBankList({
      page: 1,
      search: keywords ? keywords : null,
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
          status: "reject",
        };
      } else {
        cData = { status: open };
      }
      const res = await getApiData(`bank/verify-bank/${id}`, cData, "PUT");
      if (res.success) {
        setOpen("");
        setRejectModal(false);
        getUsersBankList({
          page: 1,
          search: keywords ? keywords : null,
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
      field: "documents",
      headerName: "Bank Documents",
      disableColumnMenu: true,
      minWidth: 200,
      flex: 1,
      renderCell: (item?: any) => {
        return (
          <AvatarGroup max={2}>
            {item?.row?.form_data?.files?.photos?.map(
              (slide?: any, index?: any) => {
                let extension = slide.split(".").pop();
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setImageURL(item?.row?.image_url);
                      setFilesData(item?.row?.form_data?.files?.photos);
                      setIndex(index);
                      setFileType(extension);
                    }}
                  >
                    <Avatar variant="circular" sx={{ cursor: "pointer" }}>
                      <AssignmentIcon />
                    </Avatar>
                  </div>
                );
              }
            )}
          </AvatarGroup>
        );
      },
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
      field: "country",
      headerName: "Country",
      minWidth: 200,
      flex: 1,
      type: "string",
      filterOperators: strFilterOperators,
    },
    {
      field: "bank_account_name",
      headerName: "Bank Account Name",
      minWidth: 300,
      flex: 1,
      type: "string",
      renderCell: (item?: any) => {
        return (
          <Typography sx={{ fontSize: 12 }}>
            {item?.row?.form_data?.bank_account_name || "-"}
          </Typography>
        );
      },
      filterOperators: strFilterOperators,
    },
    {
      field: "bank_account_number",
      headerName: "Bank Account Number",
      minWidth: 300,
      flex: 1,
      type: "string",
      renderCell: (item?: any) => {
        return (
          <Typography sx={{ fontSize: 12 }}>
            {item?.row?.form_data?.bank_account_number || "-"}
          </Typography>
        );
      },
      filterOperators: strFilterOperators,
    },
    {
      field: "bank_name",
      headerName: "Bank Name",
      minWidth: 300,
      flex: 1,
      type: "string",
      renderCell: (item?: any) => {
        return (
          <Typography sx={{ fontSize: 12 }}>
            {item?.row?.form_data?.bank_name || "-"}
          </Typography>
        );
      },
      filterOperators: strFilterOperators,
    },
    {
      field: "ifsc_code",
      headerName: "IFSC Code",
      minWidth: 300,
      flex: 1,
      type: "string",
      renderCell: (item?: any) => {
        return (
          <Typography sx={{ fontSize: 12 }}>
            {item?.row?.form_data?.ifsc_code || "-"}
          </Typography>
        );
      },
      filterOperators: strFilterOperators,
    },
    {
      field: "selected_for_ngo_donation",
      headerName: "Is selected for NGO donation?",
      minWidth: 300,
      flex: 1,
      renderCell: (item: any) => {
        return (
          <Chip
            label={item.value === true ? "Yes" : "No"}
            color={item.value === true ? "success" : "error"}
            variant="filled"
            size="small"
            sx={{ color: "white" }}
          />
        );
      },
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
              {item.row.status === "approve" ? "Approved" : "Approve"}
            </Button>
          ),
          item.row.status === "approve" ? null : (
            <Button
              fullWidth
              size="small"
              sx={{
                backgroundColor: (theme) =>
                  alpha(theme.palette.error.main, 0.1),
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
                setRejectModal(true);
              }}
              disabled={btnLoad || item.row.status === "reject"}
            >
              {item.row.status === "reject" ? "Rejected" : "Reject"}
            </Button>
          ),
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
    getUsersBankList(flt);
  }

  const handleClose = () => {
    setOpen("");
    setRejectModal(false);
    setSelectedItem({});
  };

  return (
    <AppsContainer
      title={"Users Bank Lists"}
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getUsersBankList}
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
              <Typography color="text.primary">Users Bank Lists</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        NewBar={null}
        onRowClick={() => console.log("click bugs===")}
        onChange={(event) => onChange(event)}
        row={banksList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={banksList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getUsersBankList}
        keyword={keywords}
        setSortModel={setSortModel}
      />

      <DialogSlide
        open={rejectModal}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle={"Reject Bank"}
      >
        <ModalWrapper>
          <Box className="modalStyle">
            <Formik
              validateOnChange={true}
              initialValues={{ description: "" }}
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
        title={"Are you sure you want to Approve this Bank?"}
        dialogTitle={"Approve Bank"}
      />

      <MediaViewer
        index={itemIndex}
        medias={filesData?.map((data: any) => {
          return {
            url: imageURL + data,
            mime_type: FileURLdata.includes(fileType)
              ? "image/*"
              : "docs" || "image/*",
          };
        })}
        onClose={onClose}
      />
    </AppsContainer>
  );
};

export default UsersBanksList;
