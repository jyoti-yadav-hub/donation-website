/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  alpha,
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { GridColumns, getGridDateOperators } from "@mui/x-data-grid-pro";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import CTable from "components/CTable";
import { AppConfirmDialog } from "@crema";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
import MediaViewer from "@crema/core/AppMedialViewer";
import DialogSlide from "components/DialogSlide";
import { LoadingButton } from "@mui/lab";
import { Fonts } from "shared/constants/AppEnums";

interface NGOCertificatesProps {
  ngoDetail?: any;
  getCertificates?: any;
  pagination?: any;
  sortModel?: any;
  setSortModel?: any;
  certificates?: any;
  isDisabled?: any;
}

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description should be 10 chars minimum.")
    .max(250, "Maximum 250 characters allowed"),
});

const ModalWrapper = styled(Box)(({ theme }) => ({
  "& .modalStyle": { width: 500 },
  "& .modalBtnDiv": {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
}));

const CertificatesTable: React.FC<NGOCertificatesProps> = ({
  ngoDetail,
  getCertificates,
  pagination,
  sortModel,
  setSortModel,
  certificates,
  isDisabled,
}) => {
  const [approveOpen, setApproveOpen] = useState<boolean>(false);
  const [rejectOpen, setRejectOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [btnLoad, setBtnLoad] = React.useState<any>(false);

  const [index, setIndex] = useState(-1);
  const [imgUrl, setImgUrl] = React.useState("");

  const onClose = () => {
    setIndex(-1);
    setImgUrl("");
  };

  const handleClose = () => {
    setApproveOpen(false);
    setRejectOpen(false);
    setSelectedItem({});
    setBtnLoad(false);
  };

  //API For delete images list
  async function submitData(data: any, type?: any) {
    setBtnLoad(approveOpen ? "approve" : "reject");
    try {
      const id = selectedItem?.id;
      let cData = {};
      if (type === "approve") {
        cData = { status: "approve" };
      } else {
        cData = {
          ...data,
          status: "reject",
        };
      }
      const res = await getApiData(
        `ngo/certificate-action/${id}`,
        cData,
        "POST"
      );
      if (res.success) {
        handleClose();
        getCertificates();
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

  const dateFilterOperators = getGridDateOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const columns: GridColumns = [
    {
      field: "_id",
      headerName: "ID",
      minWidth: 200,
      flex: 1,
      hide: true,
      filterable: false,
    },
    {
      field: "ngo_certificate_url",
      headerName: "Certificate",
      width: 150,
      filterable: false,
      disableColumnMenu: true,
      flex: 1,
      headerAlign: 'center',
      align:'center',
      renderCell: (item: any) => {
        return (
          item.value ? 
          <div
            onClick={() => {
              setImgUrl(item.value);
              setIndex(item.value ? 0 : -1);
            }}
          >
            <Avatar
              sx={{
                padding: 5,
                backgroundColor: "rgb(255, 255, 255)",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              <img
                src={item.value || "/assets/images/defaultimage.png"}
                alt={"title"}
                style={{
                  borderRadius: 5,
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  maxWidth: "fit-content",
                }}
              />
            </Avatar>
          </div>
           : "-"
        )
      },
    },
    {
      field: "ngo_deed_url",
      headerName: "Deed Image",
      width: 150,
      filterable: false,
      disableColumnMenu: true,
      flex: 1,
      headerAlign: 'center',
      align:'center',
      renderCell: (item: any) => {
        return (
          item.value ? 
          <div
            onClick={() => {
              setImgUrl(item.value);
              setIndex(item.value ? 0 : -1);
            }}
          >
            <Avatar
              sx={{
                padding: 5,
                backgroundColor: "rgb(255, 255, 255)",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              <img
                src={item.value || "/assets/images/defaultimage.png"}
                alt={"title"}
                style={{
                  borderRadius: 5,
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  maxWidth: "fit-content",
                }}
              />
            </Avatar>
          </div>
           : "-"
        );
      },
    },
    {
      field: "expiry_date",
      headerName: "Expiry Date",
      minWidth: 200,
      flex: 1,
      headerAlign: 'center',
      align:'center',
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "-",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 200,
      flex: 1,
      headerAlign: 'center',
      align:'center',
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 250,
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
                mr:
                  item.row.status === "approve" || item.row.status === "reject"
                    ? 0
                    : 1,
              }}
              onClick={() => {
                setSelectedItem(item);
                setApproveOpen(true);
              }}
              disabled={btnLoad || item.row.status === "approve" || isDisabled}
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
                ml:
                  item.row.status === "approve" || item.row.status === "reject"
                    ? 0
                    : 1,
              }}
              onClick={() => {
                setSelectedItem(item);
                setRejectOpen(true);
              }}
              disabled={btnLoad || item.row.status === "reject" || isDisabled}
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
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    getCertificates(flt);
  }

  return (
    <>
      <Typography variant="body2" sx={{ fontSize: { lg: "14px", xl: "15px" } }}>
        NGO Certificates:
      </Typography>
      <CTable
        tableStyle={{ height: "calc(50vh) !important" }}
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        onChange={(event) => onChange(event)}
        row={certificates?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={certificates?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getCertificates}
        setSortModel={setSortModel}
      />

      <DialogSlide
        open={rejectOpen}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle="Reject Certificate"
      >
        <ModalWrapper>
          <Box className="modalStyle">
            <Formik
              validateOnChange={true}
              initialValues={{ description: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => submitData(values)}
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
                        label={"Reason for Reject"}
                        placeholder={"Please enter the Reason for Rejection"}
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
        open={approveOpen}
        disabled={btnLoad}
        loading={btnLoad}
        onDeny={handleClose}
        onConfirm={() => submitData(selectedItem?.id, "approve")}
        title={"Are you sure you want to Approve this certificate?"}
        dialogTitle={"Approve Certificate"}
      />

      <MediaViewer
        index={index}
        medias={[imgUrl].map((data) => {
          return {
            url: data,
            mime_type: "image/*",
          };
        })}
        onClose={onClose}
      />
    </>
  );
};

export default CertificatesTable;
