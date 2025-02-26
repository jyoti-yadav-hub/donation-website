/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Typography, Box, Breadcrumbs, TextField, Button } from "@mui/material";
import Chip from "@mui/material/Chip";
import {
  CheckCircleOutline,
  CancelOutlined,
  FlipCameraAndroid,
  DeleteOutline,
  PendingOutlined,
  Add,
  EditOutlined,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  getGridBooleanOperators,
  getGridDateOperators,
  getGridStringOperators,
  GridActionsCellItem,
  GridColumns,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import { isArray, isEmpty } from "lodash";
import { toast } from "react-toastify";
import { AppAnimate } from "@crema";
import {
  Link,
  RouteComponentProps,
  useHistory,
  useParams,
} from "react-router-dom";
import getApiData from "../../../shared/helpers/apiHelper";
import { useSelector } from "react-redux";
import { AppState } from "redux/store";
import CTable from "components/CTable";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import NGODetails from "../ngodetails";
import { Form, Formik } from "formik";
import * as yup from "yup";
import DialogSlide from "components/DialogSlide";
import { LoadingButton } from "@mui/lab";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";
import NGOCreateForm from "components/NGOCreateForm";
const { flag } = require("country-emoji");

const validationSchema = yup.object({
  delete_reason: yup
    .string()
    .required("Description is required")
    .min(10, "Description should be 10 chars minimum.")
    .max(250, "Maximum 250 characters allowed"),
});

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
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

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

interface NGOParamProps {
  id: string;
}

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings: readonly MainTextMatchedSubstrings[];
}

interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
}

interface NGOProps extends RouteComponentProps<NGOParamProps> {
  props: any;
}

const NGOList: React.FC<NGOProps> = (props) => {
  const history = useHistory();
  const { id }: { id: string } = useParams();
  const [ngoList, setNgoList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [openDltModal, setOpenDltModal] = React.useState<any>(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "createdAt", sort: "desc" },
  ]);
  const [keywords, setKeywords] = React.useState("");
  const [openModal, setOpenModal] = React.useState<any>(false);
  const [type, setType] = React.useState("");
  const [ngoData, setNgoData] = React.useState<any>({});

  const [uploadedLogo, setUploadedLogo] = useState<any>([]);
  const [uploadedDeed, setUploadedDeed] = useState<any>([]);
  const [uploadedRegiCerti, setUploadedRegiCerti] = useState<any>([]);
  const [uploaded12aCerti, setUploaded12aCerti] = useState<any>([]);
  const [uploaded80gCerti, setUploaded80gCerti] = useState<any>([]);
  const [uploadedFCRAcerti, setUploadedFCRAcerti] = useState<any>([]);

  const [logoImg, setLogoImg] = useState<any>("");
  const [deedImg, setDeedImage] = useState<any>("");
  const [regImg, setRegImage] = useState<any>("");
  const [twelveImg, setTwelveImage] = useState<any>("");
  const [eighteenImg, setEighteenImage] = useState<any>("");
  const [FCRAImg, setFCRAImage] = useState<any>("");

  const [locationVal, setLocationVal] = React.useState<PlaceType | any>(null);
  const [locationLatLng, setLocationLatLng] = React.useState<any>({
    lat: 0,
    lng: 0,
  });
  const [CountryCode, setCountryCode] = useState("IN");
  const [SecCountryCode, setSecCountryCode] = useState("IN");

  const [ngoPhoneNum, setNGOPhoneNum] = useState({
    number: selectedItem?.ngo_phone || "",
    dialCode: "+91",
    countryFullName: "India",
    onlyNumber: "",
  });

  const [ngoSecondaryNum, setNGOSecondaryNum] = useState({
    number: selectedItem?.secondary_phone || "",
    dialCode: "+91",
    countryFullName: "India",
    onlyNumber: "",
  });

  const { notiData } = useSelector<AppState, AppState["Notificationdata"]>(
    ({ Notificationdata }) => Notificationdata
  );

  //API For get NGO Lists
  async function getNGOList(nData) {
    setNgoList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("ngo/ngo-list", nData);
      if (res.success) {
        setNgoList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setNgoList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setNgoList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  //API For get NGO detail on edit
  async function getNGODetailOnEdit(id) {
    // setNgoList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData(`ngo/admin/edit-ngo/${id}`, {}, "GET");
      console.log("🚀 ~ file: index.tsx:188 ~ getNGODetailOnEdit ~ res:", res);
      if (res.success) {
        setNgoData(res?.data);
        setUploadedLogo([res?.data?.ngo_cover_image]);
        setUploadedDeed([res?.data?.ngo_deed]);
        setUploadedRegiCerti([res?.data?.ngo_certificate]);
        setUploaded12aCerti([res?.data?.ngo_12A_certificate]);
        setUploaded80gCerti([res?.data?.ngo_80G_certificate]);
        setUploadedFCRAcerti([res?.data?.ngo_FCRA_certificate]);

        let logo = res?.data?.ngo_cover_image?.substring(
          res?.data?.ngo_cover_image?.lastIndexOf("/") + 1
        );
        console.log(
          "🚀 ~ file: index.tsx:208 ~ getNGODetailOnEdit ~ logo:",
          logo
        );
        let deed = res?.data?.ngo_deed?.substring(
          res?.data?.ngo_deed?.lastIndexOf("/") + 1
        );
        let register = res?.data?.ngo_certificate?.substring(
          res?.data?.ngo_certificate?.lastIndexOf("/") + 1
        );
        let twelve = res?.data?.ngo_12A_certificate?.substring(
          res?.data?.ngo_12A_certificate?.lastIndexOf("/") + 1
        );
        let eighty = res?.data?.ngo_80G_certificate?.substring(
          res?.data?.ngo_80G_certificate?.lastIndexOf("/") + 1
        );
        let fcra = res?.data?.ngo_FCRA_certificate?.substring(
          res?.data?.ngo_FCRA_certificate?.lastIndexOf("/") + 1
        );

        setLogoImg(logo);
        setDeedImage(deed);
        setRegImage(register);
        setTwelveImage(twelve);
        setEighteenImage(eighty);
        setFCRAImage(fcra);

        setLocationVal(res?.data?.ngo_location?.city || null);
        setLocationLatLng({
          lat: res?.data?.location?.coordinates[1] || 0,
          lng: res?.data?.location?.coordinates[0] || 0,
        });
        setNGOPhoneNum({
          ...ngoPhoneNum,
          number: `${res?.data?.ngo_phone_code}${res?.data?.ngo_phone}`,
          dialCode: res?.data?.ngo_phone_code,
          onlyNumber: `${res?.data?.ngo_phone}` || "",
          countryFullName: res?.data?.phone_country_full_name,
        });
        setCountryCode(res?.data?.phone_country_short_name);
        setNGOSecondaryNum({
          ...ngoSecondaryNum,
          number: `${res?.data?.secondary_phone_code}${res?.data?.secondary_phone}`,
          dialCode: res?.data?.secondary_phone_code,
          onlyNumber: `${res?.data?.secondary_phone}` || "",
          countryFullName: res?.data?.secondary_country_full_name,
        });
        setSecCountryCode(res?.data?.secondary_country_short_name);
        setOpenModal(true);
      } else {
        setNgoList({});
        toast.error(res.message);
      }
    } catch (error) {
      setNgoList({});
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (!isEmpty(id)) {
      getNGOList({
        page: 1,
        sort: sortModel[0].field,
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
      });
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(notiData)) {
      getNGOList({
        page: 1,
        sort: sortModel[0].field,
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
      });
    }
  }, [notiData]);

  useEffect(() => {
    getNGOList({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  const strFilterOperators = getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value)
  );

  const dateFilterOperators = getGridDateOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const boolFilterOperators = getGridBooleanOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const columns: GridColumns = [
    {
      field: "ngo_name",
      headerName: "NGO Name",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "ngo_phone",
      headerName: "NGO Phone",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Typography sx={{ fontSize: "12px" }}>
            {flag(item?.row?.phone_country_short_name) || ""}{" "}
            {item?.value || ""}
          </Typography>
        );
      },
    },
    {
      field: "secondary_phone",
      headerName: "Secondary Phone",
      minWidth: 250,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Typography sx={{ fontSize: "12px" }}>
            {flag(item?.row?.secondary_country_short_name) || ""}{" "}
            {item?.value || ""}
          </Typography>
        );
      },
    },
    {
      field: "ngo_registration_number",
      headerName: "NGO Registration Number",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "ngo_causes",
      headerName: "Causes",
      minWidth: 400,
      flex: 1,
      renderCell: (item: any) => {
        return (
          <>
            {item?.value
              ? item?.value?.map((it: any, index: number) => {
                  return (
                    <Chip
                      sx={{
                        mt: 1,
                        mr: index !== item?.value?.length - 1 ? 1 : 0,
                      }}
                      label={it.charAt(0).toUpperCase() + it.slice(1) || "-"}
                      size="small"
                    />
                  );
                })
              : null}
          </>
        );
      },
      filterOperators: strFilterOperators,
    },
    {
      field: "ngo_location",
      headerName: "Location",
      minWidth: 400,
      flex: 1,
      valueGetter: (params) => params?.row?.ngo_location?.city || "-",
      type: "string",
      filterOperators: strFilterOperators,
    },
    {
      field: "is_enable",
      headerName: "Is NGO Enable?",
      type: "boolean",
      minWidth: 200,
      flex: 1,
      renderCell: (item: any) => {
        return (
          <Box sx={{ display: "flex" }}>
            {item.value ? (
              <CheckCircleOutline color="success" />
            ) : item.row.ngo_status === "reverify" ? (
              <FlipCameraAndroid color="warning" />
            ) : item.row.ngo_status === "waiting_for_verify" ? (
              <img
                src="/assets/images/hour-glass.png"
                alt="wait"
                style={{ width: 25, height: 25 }}
              />
            ) : item.row.ngo_status === "pending" ? (
              <PendingOutlined sx={{ color: "#9c27b0" }} />
            ) : (
              <CancelOutlined color="error" />
            )}
          </Box>
        );
      },
      filterOperators: boolFilterOperators,
    },
    {
      field: "ngo_status",
      headerName: "Status",
      width: 200,
      renderCell: (item: any) => {
        return (
          <Chip
            className="chip_class"
            style={{
              color: "#FFF",
              backgroundColor:
                item.value === "approve"
                  ? "#2e7d32" //success
                  : item.value === "reject" ||
                    item.value === "blocked" ||
                    item.value === "expired"
                  ? "#d32f2f" //error
                  : item.value === "waiting_for_verify"
                  ? "#1976d2"
                  : item.value === "pending"
                  ? "#9c27b0" //secondary
                  : item.value === "reverify"
                  ? "#ed6c02" //warning
                  : "#ebebeb", //default
            }}
            label={
              item.value === "approve"
                ? "Approved"
                : item.value === "reject"
                ? "Rejected"
                : item?.value.charAt(0).toUpperCase() + item?.value.slice(1) ||
                  "-"
            }
            size="small"
          />
        );
      },
      filterOperators: strFilterOperators,
    },
    {
      field: "createdAt",
      headerName: "Request On",
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
              // setTimeout(() => {
              //   setOpenModal(true);
              // }, 500);
              setType("edit");
              getNGODetailOnEdit(item?.id);
              setSelectedItem(item);
            }}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteOutline />}
            label="Delete"
            onClick={(event) => {
              setSelectedItem(item);
              setOpenDltModal(true);
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
    getNGOList(flt);
  }

  //API for delete NGO
  async function deleteNGO(data: any) {
    setDltLoad(true);
    try {
      const id = selectedItem?.id;
      const res = await getApiData(`ngo/delete-ngo/${id}`, data, "DELETE");
      if (res.success) {
        setOpenDltModal(false);
        getNGOList({
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

  const handleClose = () => {
    setOpenDltModal(false);
    setDltLoad(false);
    setSelectedItem({});
  };

  return (
    <>
      {id ? (
        <AppAnimate animation="transition.slideUpIn" delay={200}>
          <NGODetails
            getNGOList={() =>
              getNGOList({
                page: 1,
                sort: sortModel[0].field,
                sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
              })
            }
          />
        </AppAnimate>
      ) : (
        <AppsContainer
          title="NGO"
          fullView
          sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
          isSearch={true}
          searchChild={() => {
            return (
              <SearchComponent
                onApiCall={getNGOList}
                setKeywords={setKeywords}
                keywords={keywords}
                sortModel={sortModel}
              />
            );
          }}
        >
          <AppsHeader>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <BreadWrapper>
                <Breadcrumbs
                  aria-label="breadcrumb"
                  sx={{ margin: "20px 0px" }}
                >
                  <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                    Dashboards
                  </Link>
                  <Typography color="text.primary">Active NGO</Typography>
                </Breadcrumbs>
              </BreadWrapper>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<Add />}
                onClick={() => setOpenModal(true)}
              >
                Add New
              </Button>
            </div>
          </AppsHeader>
          <CTable
            sxStyle={{ "& .MuiDataGrid-row:hover": { cursor: "pointer" } }}
            initialState={{
              pinnedColumns: { right: ["ngo_status", "actions"] },
            }}
            onRowClick={(item: any) =>
              history.push({
                pathname: `/ngo/${item.id}`,
                state: { id: item.id, from: "ngo-list" },
              })
            }
            NewBar={null}
            onChange={(event) => onChange(event)}
            row={ngoList?.lists}
            column={columns}
            rowCount={pagination.total}
            page={pagination.page}
            listsLoad={ngoList?.listsLoad}
            checkboxSelection={false}
            onSelectionModelChange={() => console.log("row select")}
            sortModel={sortModel}
            getApiCall={getNGOList}
            setSortModel={setSortModel}
          />
          <DialogSlide
            open={openDltModal}
            onDeny={handleClose}
            onClose={handleClose}
            dialogTitle={"Deactivate NGO"}
          >
            <ModalWrapper>
              <Box className="modalStyle">
                <Formik
                  validateOnChange={true}
                  initialValues={{ delete_reason: "" }}
                  validationSchema={validationSchema}
                  onSubmit={(values) => deleteNGO(values)}
                >
                  {(props) => {
                    const {
                      values,
                      touched,
                      errors,
                      handleChange,
                      handleSubmit,
                      handleBlur,
                    } = props;
                    return (
                      <Form
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                      >
                        <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                          <TextField
                            name="delete_reason"
                            value={values.delete_reason}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="outlined"
                            fullWidth
                            inputProps={{ maxLength: 250 }}
                            helperText={`${values.delete_reason.length} / 250`}
                            minRows={3}
                            maxRows={5}
                            multiline={true}
                            label="Please enter the reason for Deactivate"
                            placeholder="Please enter the reason for Deactivate"
                          />
                          {errors.delete_reason && touched.delete_reason && (
                            <ErrorTextStyle>
                              {errors.delete_reason}
                            </ErrorTextStyle>
                          )}
                        </Box>
                        <div className="modalBtnDiv">
                          <LoadingButton
                            size="small"
                            type="submit"
                            variant="outlined"
                            color="primary"
                            loading={dltLoad}
                            disabled={dltLoad}
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
          <NGOCreateForm
            openModal={openModal}
            ngoData={ngoData}
            handleClose={() => {
              setNgoData({});
              setSelectedItem({});
              setOpenModal(false);
            }}
            type={type}
            uploadedLogo={uploadedLogo}
            setUploadedLogo={setUploadedLogo}
            uploadedDeed={uploadedDeed}
            setUploadedDeed={setUploadedDeed}
            uploadedRegiCerti={uploadedRegiCerti}
            setUploadedRegiCerti={setUploadedRegiCerti}
            uploaded12aCerti={uploaded12aCerti}
            setUploaded12aCerti={setUploaded12aCerti}
            uploaded80gCerti={uploaded80gCerti}
            setUploaded80gCerti={setUploaded80gCerti}
            uploadedFCRAcerti={uploadedFCRAcerti}
            setUploadedFCRAcerti={setUploadedFCRAcerti}
            // selectedItem={selectedItem}
            // setSelectedItem={setSelectedItem}
            locationVal={locationVal}
            setLocationVal={setLocationVal}
            locationLatLng={locationLatLng}
            setLocationLatLng={setLocationLatLng}
            CountryCode={CountryCode}
            setCountryCode={setCountryCode}
            SecCountryCode={SecCountryCode}
            setSecCountryCode={setSecCountryCode}
            ngoPhoneNum={ngoPhoneNum}
            setNGOPhoneNum={setNGOPhoneNum}
            ngoSecondaryNum={ngoSecondaryNum}
            setNGOSecondaryNum={setNGOSecondaryNum}
            logoImg={logoImg}
            setLogoImg={setLogoImg}
            deedImg={deedImg}
            setDeedImage={setDeedImage}
            regImg={regImg}
            setRegImage={setRegImage}
            twelveImg={twelveImg}
            setTwelveImage={setTwelveImage}
            eighteenImg={eighteenImg}
            setEighteenImage={setEighteenImage}
            FCRAImg={FCRAImg}
            setFCRAImage={setFCRAImage}
          />
        </AppsContainer>
      )}
    </>
  );
};

export default NGOList;
