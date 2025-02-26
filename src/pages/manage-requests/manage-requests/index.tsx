/* eslint-disable no-useless-computed-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  Link,
  List,
  styled,
  Typography,
} from "@mui/material";
import SidebarPlaceholder from "@crema/core/AppSkeleton/SidebarListSkeleton";
import { AppAnimate, AppList, AppLoader, AppScrollbar } from "@crema";
import { isEmpty } from "lodash";
import { toast } from "react-toastify";
import { Star, StarBorderOutlined } from "@mui/icons-material";
import {
  DataGridPro,
  GridColumns,
  GridRowsProp,
  GridSortModel,
  getGridBooleanOperators,
  getGridDateOperators,
  getGridStringOperators,
  getGridNumericColumnOperators,
} from "@mui/x-data-grid-pro";
import Nodata from "components/Nodata";
import moment from "moment";
import {
  useHistory,
  useLocation,
  Link as BLink,
  RouteComponentProps,
  useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "redux/store";
import { setActiveCategory } from "redux/actions/ActiveCategory";
import getApiData from "../../../shared/helpers/apiHelper";
import FoodDetail from "pages/foodrequests/request-detail";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { buttonsArr } from "components/DefaultHealth";
import AppsSideBarFolderItem from "@crema/core/AppsSideBarFolderItem";
import ListEmptyResult from "@crema/core/AppList/ListEmptyResult";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";
import CButtom from "@crema/core/AppRequestCustomButton";
import NoUserScreen from "pages/apps/Chat/ChatContent/NoUserScreen";

interface RequestParamProps {
  id: string;
}

interface RequestProps extends RouteComponentProps<RequestParamProps> {
  props: any;
}

const BodyStyle = styled(Box)(({ theme }) => ({
  "& .topDiv": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: "60px",
    backgroundColor: "#f4f7fe",
    zIndex: 10,
    paddingBottom: "10px",
  },
  "& .nameDiv": { display: "flex", alignItems: "center" },
  "& .top-userdata": {
    // boxShadow: "rgba(0, 0, 0, 0.04) 0px 10px 10px 4px",
    backgroundColor: "rgb(255, 255, 255)",
    flexWrap: "wrap",
    borderRadius: "10px !important",
    padding: "25px !important",
    textAlign: "center",
    "&:hover": { transform: "scale(1.01)", transition: "all 0.2s ease" },
  },
  "& .imageStyle": { borderRadius: 5 },
  "& .avatarClass": {
    padding: 5,
    backgroundColor: "rgb(255, 255, 255)",
    border: "1px solid #ccc",
  },
  "& .tableDiv": {
    // boxShadow: "rgba(0, 0, 0, 0.04) 0px 10px 10px 4px",
    // backgroundColor: "rgb(255, 255, 255)",
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 50,
    "& .MuiDataGrid-row:hover": {
      color: `#0d91cf !important`,
      transform: "translateY(-2px)",
      boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 10px 0px",
      backgroundColor: "rgba(10, 143, 220, 0.1)",
      transition: "all 0.2s ease 0s",
      cursor: "pointer",
    },
    "& .MuiDataGrid-menuIcon": {
      width: "auto !important",
      visibility: "visible !important",
    },
    "& .MuiDataGrid-virtualScrollerRenderZone, & .MuiDataGrid-virtualScrollerContent":
      { zIndex: 100001, backgroundColor: "#fff" },
    "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-overlay": {
      zIndex: 100002,
      backgroundColor: "#fff",
    },
    "& .MuiDataGrid-pinnedColumnHeaders, & .MuiDataGrid-pinnedColumns": {
      zIndex: 100002,
      backgroundColor: "#fff",
    },
    "& .MuiDataGrid-cell:focus": { outline: 0 },
  },
  "& .categoy-card": {
    cursor: "pointer",
    // "&:hover": { transition: "all 0.2s ease" },
    "& .MuiCardContent-root": {
      padding: "15px !important",
      borderRadius: "5px !important",
      display: "flex !important",
      alignItems: "center",
    },
  },
  "& .clickonTxt": {
    minHeight: "calc(50vh)",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    fontSize: "18px",
    // transform: "scale(1) !important",
  },
  "& .noCateDiv": {
    minHeight: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .slick-slider": {
    display: "grid",
    width: "100%",
    alignItems: "center",
    padding: "10px",
    // backgroundColor: "#f4f7fe",
    borderRadius: "10px",
  },
  "& .slick-dots": { marginBottom: "10px" },
  "& .slick-dots li.slick-active button:before": { color: "#14c0f3" },
  "& .slick-next": {
    boxShadow: "0 2px 5px 0 rgb(213 217 217 / 50%)",
    right: "17px",
    zIndex: 1000002,
    borderRadius: "100%",
    border: "1px solid #D5D9D9",
    background: "#fff",
  },
  "& .slick-next:before": { color: "black" },
  "& .slick-prev:before": { color: "black" },
  "& .slick-prev": {
    boxShadow: "0 2px 5px 0 rgb(213 217 217 / 50%)",
    left: "0px",
    zIndex: 1000002,
    borderRadius: "100%",
    border: "1px solid #D5D9D9",
    background: "#fff",
  },
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const ManageRequests: React.FC<RequestProps> = (props) => {
  const { selectedID } = useSelector<AppState, AppState["ActiveCategory"]>(
    ({ ActiveCategory }) => ActiveCategory
  );
  const { notiData } = useSelector<AppState, AppState["Notificationdata"]>(
    ({ Notificationdata }) => Notificationdata
  );
  const dispatch = useDispatch();
  const history = useHistory();
  const { id }: { id: string } = useParams();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isCheckedReport, setIsCheckedReport] = useState<boolean>(false);
  const [isBtnSelect, setIsBtnSelect] = useState<any>("all");
  const location: any = useLocation();
  const [requestCount, setRequestCount] = useState<any>({
    counts: [],
    countsLoad: true,
  });
  const [categoryList, setCategoryList] = useState<any>({
    lists: [],
    listsLoad: false,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [tableName, setTableName] = useState<string>(
    selectedID || location?.state?.selectedID || ""
  );
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);

  const [keywords, setKeywords] = React.useState("");

  // get category request counts
  async function getRequestCount(nData?: any) {
    if (nData.loading === false) {
      setRequestCount((e) => ({ ...e, countsLoad: false }));
    } else {
      setRequestCount((e) => ({ ...e, countsLoad: true }));
    }
    try {
      const res = await getApiData("category/category-request-count", nData);
      if (res.success) {
        setRequestCount({ counts: res.data || [], countsLoad: false });
      } else {
        // history.push("/error-pages/maintenance");
        setRequestCount({ counts: [], countsLoad: false });
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      setRequestCount({ counts: [], countsLoad: false });
      toast.error("Something went wrong");
    }
  }

  // get category list
  async function getCategoryList(nData) {
    if (nData.loading === false) {
      setCategoryList((e) => ({ ...e, listsLoad: false }));
    } else {
      setCategoryList((e) => ({ ...e, listsLoad: true }));
    }
    try {
      nData.category_slug = nData.category_slug || selectedID;
      const res = await getApiData(`request/admin/cause-request-list`, nData);
      if (res.success) {
        setCategoryList({ lists: res.data || [], listsLoad: false });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        // history.push("/error-pages/maintenance");
        setCategoryList({ lists: [], listsLoad: false });
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      setCategoryList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (!isEmpty(notiData) && selectedID) {
      getRequestCount({ loading: false });
      getCategoryList({
        ["reported"]: isCheckedReport ? 1 : "",
        page: 1,
        sort: isChecked ? "urgent_help" : sortModel[0]?.field,
        search: keywords ? keywords : null,
        status:
          isBtnSelect && isBtnSelect !== "all"
            ? JSON.stringify(isBtnSelect)
            : "",
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        loading: false,
      });
    }
  }, [notiData]);

  useEffect(() => {
    if (selectedID) {
      getCategoryList({
        ["reported"]: isCheckedReport ? 1 : "",
        page: 1,
        sort: isChecked ? "urgent_help" : sortModel[0]?.field,
        search: keywords ? keywords : null,
        status:
          isBtnSelect && isBtnSelect !== "all"
            ? JSON.stringify(isBtnSelect)
            : "",
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
      });
    }
  }, []);

  useEffect(() => {
    if (
      history?.location?.pathname === location?.pathname &&
      !isEmpty(selectedID)
    ) {
      getCategoryList({
        ["reported"]: isCheckedReport ? 1 : "",
        page: 1,
        sort: isChecked ? "urgent_help" : sortModel[0]?.field,
        search: keywords ? keywords : null,
        status:
          isBtnSelect && isBtnSelect !== "all"
            ? JSON.stringify(isBtnSelect)
            : "",
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
      });
    }
  }, [history, location]);

  const requestForName = (item) => {
    let name = "";
    if (item && item?.row?.form_data?.food_for_myself) {
      name = "Self";
    } else {
      name = "Other";
    }
    return name;
  };

  const rows: GridRowsProp = categoryList?.lists;
  const hunger = categoryList?.lists.find(
    (item) => item.category_slug === "hunger"
  );
  const health = categoryList?.lists.find(
    (item) => item.category_slug === "health"
  );
  const education = categoryList?.lists.find(
    (item) => item.category_slug === "education"
  );
  const fundRaiser = categoryList?.lists.find(
    (item) => item.category_slug === "fundraiser"
  );

  const is_hunger =
    hunger && hunger.category_slug && hunger.category_slug === "hunger"
      ? true
      : false;

  const is_health =
    health && health.category_slug && health.category_slug === "health"
      ? true
      : false;

  const is_education =
    education &&
    education.category_slug &&
    education.category_slug === "education"
      ? true
      : false;

  const isFundraiser =
    fundRaiser &&
    fundRaiser.category_slug &&
    fundRaiser.category_slug === "fundraiser"
      ? true
      : false;

  const strFilterOperators = getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value)
  );

  const dateFilterOperators = getGridDateOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const boolFilterOperators = getGridBooleanOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const numberFiltOperator = getGridNumericColumnOperators().filter(
    ({ value }) => ["="].includes(value)
  );

  const columns: GridColumns = [
    {
      field: "reference_id",
      headerName: "Request ID",
      width: 200,
      filterOperators: strFilterOperators,
    },
    {
      field: "_id",
      headerName: "Reference ID",
      width: 200,
      filterOperators: strFilterOperators,
    },
    {
      field: "uname",
      headerName: "Created By",
      width: 200,
      type: "string",
      filterOperators: strFilterOperators,
    },
    {
      field: "active_type",
      filterOperators: strFilterOperators,
      headerName: "User Active Type",
      width: 200,
      renderCell: (item: any) => {
        return (
          <Chip
            style={{
              color: "#FFF",
              backgroundColor:
                item?.value === "donor"
                  ? "#2e7d32"
                  : item?.value === "ngo"
                  ? "#ed6c02"
                  : item?.value === "user"
                  ? "#1976d2"
                  : item?.value === "volunteer"
                  ? "#9c27b0"
                  :item?.value === "corporate"
                  ? "#d32f2f"
                  : "",
            }}
            label={
              item?.value === "ngo"
                ? "NGO"
                : item?.value === "user"
                ? "Beneficiary"
                : item?.value.charAt(0).toUpperCase() + item?.value.slice(1) ||
                  ""
            }
            size="small"
          />
        );
      },
    },
    {
      field: "vegetarian",
      filterOperators: boolFilterOperators,
      headerName: "Is Veg?",
      minWidth: 150,
      flex: 1,
      hide: is_hunger ? false : true,
      filterable: is_hunger ? true : false,
      valueGetter: (params) => params?.row?.form_data?.vegetarian || false,
      type: "boolean",
      renderCell: (item: any) => {
        return (
          <Chip
            style={{
              color: "#FFF",
              backgroundColor:
                item?.row?.form_data?.vegetarian === true
                  ? "#2e7d32" //success
                  : "#d32f2f", //error
            }}
            label={item?.row?.form_data?.vegetarian === true ? "Yes" : "No"}
            variant="outlined"
            size="small"
          />
        );
      },
    },
    {
      field: "deliver_before",
      filterOperators: numberFiltOperator,
      headerName: "Deliver Before",
      minWidth: 150,
      flex: 1,
      hide: is_hunger ? false : true,
      filterable: is_hunger ? true : false,
      valueGetter: (params) =>
        Number(params?.row?.form_data?.deliver_before) || 0,
      type: "number",
    },
    {
      field: "food_for_myself",
      filterOperators: strFilterOperators,
      headerName: "Food For",
      minWidth: 150,
      flex: 1,
      hide: is_hunger ? false : true,
      filterable: is_hunger ? true : false,
      valueGetter: (params) => params?.row?.form_data?.food_for_myself || "-",
      renderCell: (item: any) => {
        return (
          <Typography style={{ width: "100%", fontSize: "12px" }}>
            {requestForName(item) || ""}
          </Typography>
        );
      },
    },
    {
      field: "how_many_persons",
      filterOperators: numberFiltOperator,
      headerName: "Number of Persons",
      minWidth: 200,
      flex: 1,
      hide: is_hunger ? false : true,
      filterable: is_hunger ? true : false,
      valueGetter: (params) =>
        Number(params?.row?.form_data?.how_many_persons) || 0,
      type: "number",
    },
    {
      field: "location",
      filterOperators: strFilterOperators,
      headerName: "Request Address",
      hide: is_hunger ? false : true,
      minWidth: 300,
      valueGetter: (params) => params?.row?.location?.city || "-",
      type: "string",
    },
    {
      field: "near_by",
      filterOperators: strFilterOperators,
      headerName: "Near By",
      hide: is_hunger ? false : true,
      minWidth: 300,
      flex: 1,
      valueGetter: (params) => params?.row?.form_data?.near_by || "-",
      type: "string",
    },
    {
      field: "title_of_fundraiser",
      filterOperators: strFilterOperators,
      headerName: "Fundraiser Title",
      minWidth: 200,
      flex: 1,
      hide: is_hunger ? true : false,
      filterable: is_hunger ? false : true,
      valueGetter: (params) =>
        params?.row?.form_data?.title_of_fundraiser || "-",
      type: "string",
    },
    {
      field: "is_featured",
      filterOperators: boolFilterOperators,
      headerName: "Featured",
      minWidth: 150,
      hide: is_hunger ? true : false,
      filterable: is_hunger ? false : true,
      flex: 1,
      renderCell: (item: any) => {
        return (
          <Typography style={{ width: "100%", fontSize: "12px" }}>
            <Box sx={{ display: "flex" }}>
              {item && item?.value ? (
                <Star style={{ color: "#FFD700" }} />
              ) : (
                <StarBorderOutlined />
              )}
            </Box>
          </Typography>
        );
      },
      type: "boolean",
    },
    {
      field: "name_of_beneficiary",
      filterOperators: strFilterOperators,
      headerName: "Beneficiary Name",
      minWidth: 200,
      flex: 1,
      hide: is_hunger ? true : false,
      filterable: is_hunger ? false : true,
      valueGetter: (params) =>
        params?.row?.form_data?.request_for_self
          ? params?.row?.uname
          : isFundraiser
          ? params?.row?.form_data?.name_of_beneficiary
          : `${params?.row?.form_data?.first_name || ""} ${
              params?.row?.form_data?.last_name || ""
            }` || "",
      type: "string",
    },
    {
      field: "choose_or_select_institute",
      filterOperators: strFilterOperators,
      headerName: "Medical Condition",
      width: 200,
      hide: is_health ? false : true,
      filterable: is_health ? true : false,
      valueGetter: (params) =>
        params?.row?.form_data?.choose_or_select_institute || "-",
      type: "string",
    },
    {
      field: "days_left",
      filterOperators: strFilterOperators,
      headerName: "Days Left",
      minWidth: 150,
      flex: 1,
      hide: is_hunger ? true : false,
      filterable: is_hunger ? false : true,
    },
    {
      field: "goal_amount",
      filterOperators: numberFiltOperator,
      headerName: "Goal Amount",
      minWidth: 200,
      flex: 1,
      hide: is_hunger ? true : false,
      filterable: is_hunger ? false : true,
      valueGetter: (params) =>
        `${params?.row?.country_data?.currency || ""}${
          Number(params?.row?.form_data?.goal_amount).toFixed(2) || 0
        }` || 0,
      type: "number",
    },
    {
      field: "remaining_amount",
      filterOperators: numberFiltOperator,
      headerName: "Remaining Amount",
      minWidth: 200,
      flex: 1,
      hide: is_hunger ? true : false,
      filterable: is_hunger ? false : true,
      valueGetter: (params) =>
        params?.row?.total_donation > 0
          ? `${params?.row?.country_data?.currency || ""}${
              Number(params?.row?.form_data?.remaining_amount).toFixed(2) || 0
            }` || 0
          : `${params?.row?.country_data?.currency || ""}${Number(
              params?.row?.form_data?.goal_amount
            ).toFixed(2)}` || 0,
      type: "number",
    },
    {
      field: "already_admission",
      filterOperators: boolFilterOperators,
      headerName: is_health ? "Already Admitted?" : "Already Admission?",
      minWidth: 200,
      flex: 1,
      hide: is_health || is_education ? false : true,
      filterable: is_health || is_education ? true : false,
      valueGetter: (params) =>
        params?.row?.form_data?.already_admission === "Yes"
          ? true
          : false || "",
      type: "boolean",
      renderCell: (item: any) => {
        return (
          <Chip
            label={
              item?.row?.form_data?.already_admission === "Yes" ? "Yes" : "No"
            }
            variant="outlined"
            size="small"
            style={{
              color: "#FFF",
              backgroundColor:
                item?.row?.form_data?.already_admission === "Yes"
                  ? "#2e7d32"
                  : "#d32f2f",
            }}
          />
        );
      },
    },
    {
      field: "saayam_supported_name",
      filterOperators: strFilterOperators,
      headerName: is_health ? "Hospital Name" : "Scool/College Name",
      width: 200,
      hide: is_health || is_education ? false : true,
      filterable: is_health || is_education ? true : false,
      valueGetter: (params) =>
        params?.row?.form_data?.saayam_supported_name || "-",
      type: "string",
    },
    {
      field: "report_benificiary",
      filterOperators: boolFilterOperators,
      headerName: "Request Is Reported?",
      minWidth: 200,
      flex: 1,
      hide: is_hunger ? true : false,
      filterable: is_hunger ? false : true,
      valueGetter: (params) =>
        params?.row?.report_benificiary?.length > 0 ? true : false,
      type: "boolean",
      renderCell: (item: any) => {
        return (
          <Chip
            label={item?.value ? "Yes" : "No"}
            variant="outlined"
            size="small"
            style={{
              color: "#FFF",
              backgroundColor: item?.value ? "#2e7d32" : "#d32f2f",
            }}
          />
        );
      },
    },
    // {
    //   field: "report_count",
    //   filterOperators: numberFiltOperator,
    //   headerName: "Report Count",
    //   minWidth: 200,
    //   flex: 1,
    //   hide: is_hunger ? true : false,
    //   valueGetter: (params) => params?.row?.report_benificiary?.length || 0,
    //   type: "number",
    // },
    {
      field: "urgent_help",
      filterOperators: boolFilterOperators,
      headerName: "Request Is Urgent?",
      minWidth: 200,
      flex: 1,
      hide: is_hunger ? true : false,
      filterable: is_hunger ? false : true,
      valueGetter: (params) => params?.row?.form_data?.urgent_help || false,
      type: "boolean",
      renderCell: (item: any) => {
        return (
          <Chip
            label={item?.row?.form_data?.urgent_help ? "Yes" : "No"}
            variant="outlined"
            size="small"
            style={{
              color: "#FFF",
              backgroundColor: item?.row?.form_data?.urgent_help
                ? "#2e7d32"
                : "#d32f2f",
            }}
          />
        );
      },
    },
    {
      field: "urgent_help_status",
      filterOperators: strFilterOperators,
      headerName: "Urgent Help Status",
      width: 200,
      hide: is_hunger ? true : false,
      filterable: is_hunger ? false : true,
      valueGetter: (params) =>
        params?.row?.form_data?.urgent_help_status || "-",
      type: "string",
      renderCell: (item: any) => {
        return (
          <>
            {item?.row?.form_data?.urgent_help_status ? (
              <Chip
                style={{
                  color: "#FFF",
                  backgroundColor:
                    item?.row?.form_data?.urgent_help_status === "approve"
                      ? "#2e7d32" //success
                      : item?.row?.form_data?.urgent_help_status === "pending"
                      ? "#9c27b0"
                      : item?.row?.form_data?.urgent_help_status === "reject"
                      ? "#d32f2f" //error
                      : "#ebebeb", //default
                }}
                label={
                  item?.row?.form_data?.urgent_help_status === "approve"
                    ? "Approved"
                    : item?.row?.form_data?.urgent_help_status === "reject"
                    ? "Rejected"
                    : item?.row?.form_data?.urgent_help_status
                        .charAt(0)
                        .toUpperCase() + item?.value.slice(1) || "-"
                }
                variant="outlined"
                size="small"
              />
            ) : null}
          </>
        );
      },
    },
    {
      field: "status",
      filterOperators: strFilterOperators,
      headerName: "Status",
      width: 180,
      cellClassName: "status",
      renderCell: (item: any) => {
        return (
          <Chip
            style={{
              color: "#FFF",
              backgroundColor:
                item.value === "accepted" ||
                item.value === "delivered" ||
                item.value === "approve"
                  ? "#2e7d32" //success
                  : item.value === "complete"
                  ? "#0BBCED"
                  : item.value === "waiting_for_verify"
                  ? "#ed6c02" //warning
                  : item.value === "cancelled" ||
                    item.value === "reject" ||
                    item.value === "rejected" ||
                    item.value === "expired"
                  ? "#d32f2f" //error
                  : item.value === "pending" ||
                    item.value === "pickup" ||
                    item.value === "donor_accept"
                  ? "#9c27b0" //secondary
                  : item.value === "waiting_for_volunteer" ||
                    item.value === "volunteer_accept" ||
                    item.value === "close"
                  ? "#1976d2" //primary
                  : "#0288d1", //default
            }}
            label={
              item.value === "approve"
                ? "Approved"
                : item.value === "close"
                ? "Closed"
                : item.value === "reject"
                ? "Rejected"
                : item.value === "complete"
                ? "Completed"
                : item.value === "donor_accept"
                ? "Donor Accepted"
                : item.value === "donor_accept"
                ? "Donor Accepted"
                : item.value === "waiting_for_volunteer"
                ? "Waiting for Volunteer"
                : item.value === "volunteer_accept"
                ? "Volunteer Accepted"
                : item?.value.charAt(0).toUpperCase() + item?.value.slice(1) ||
                  ""
            }
            variant="outlined"
            size="small"
          />
        );
      },
    },
    {
      field: "createdAt",
      filterOperators: dateFilterOperators,
      headerName: "Created At",
      minWidth: 200,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
    },
    {
      field: "approve_time",
      filterOperators: dateFilterOperators,
      headerName: "Approved At",
      minWidth: 200,
      flex: 1,
      hide: is_hunger ? true : false,
      valueGetter: (params) =>
        params?.row?.approve_time
          ? moment(params?.row?.approve_time).format(initialTimeFormat)
          : "",
      type: "date",
    },
    {
      field: "updatedAt",
      filterOperators: dateFilterOperators,
      headerName: "Update Time",
      minWidth: 200,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
    },
    {
      field: "updateBy",
      filterOperators: strFilterOperators,
      headerName: "Updated By",
      width: 200,
      valueGetter: (params) => params?.row?.uname || "",
      type: "string",
    },
    {
      field: "expiry_date",
      filterOperators: dateFilterOperators,
      headerName: "Expiry Date",
      minWidth: 200,
      flex: 1,
      hide: is_hunger ? true : false,
      filterable: is_hunger ? false : true,
      valueGetter: (params) =>
        params?.row?.form_data?.expiry_date
          ? moment(params?.row?.form_data?.expiry_date).format(
              initialTimeFormat
            )
          : "",
      type: "date",
    },
  ];

  useEffect(() => {
    getRequestCount({ loading: true });
  }, []);

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.reported = isCheckedReport ? 1 : "";
    flt.page = newPage + 1;
    flt.sort = isChecked ? "urgent_help" : sortModel[0].field;
    flt.search = keywords ? keywords : null;
    flt.status =
      isBtnSelect && isBtnSelect !== "all" ? JSON.stringify(isBtnSelect) : null;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    flt.operator = "contains";
    getCategoryList(flt);
  }

  const SideBarContent = () => {
    return (
      <>
        <AppScrollbar className="scroll-app-sidebar">
          <Box sx={{ pr: 4, pb: { xs: 4, md: 5, lg: 6.2 } }}>
            <List
              sx={{ mb: { xs: 2, xl: 5 } }}
              component="nav"
              aria-label="main task folders"
            >
              <AppList
                animation="transition.slideLeftIn"
                data={requestCount.counts}
                ListEmptyComponent={
                  requestCount?.countsLoad ? (
                    <ListEmptyResult
                      loading={true}
                      placeholder={
                        <Box sx={{ px: { xs: 4, md: 5, lg: 6.2 } }}>
                          <SidebarPlaceholder />
                        </Box>
                      }
                    />
                  ) : (
                    <ListEmptyResult
                      loading={true}
                      placeholder={
                        <Box
                          sx={{
                            px: { xs: 4, md: 5, lg: 6.2 },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "calc(30vh)",
                            width: "100%",
                          }}
                        >
                          <Typography sx={{ fontSize: "18px" }}>
                            No Requests Raised
                          </Typography>
                        </Box>
                      }
                    />
                  )
                }
                renderRow={(item) => (
                  <AppsSideBarFolderItem
                    key={item._id}
                    item={item}
                    isActive={item?.category_slug === selectedID}
                    onClick={() => {
                      if (
                        item.is_category_active === "deactive" ||
                        item.count === 0 ||
                        item?.category_slug === selectedID
                      ) {
                        return;
                      } else {
                        setIsBtnSelect(isBtnSelect);
                        setIsCheckedReport(false);
                        dispatch(setActiveCategory(item?.category_slug));
                        setTableName(item?.category_slug);
                        getCategoryList({
                          category_slug: item?.category_slug,
                          ["reported"]: isCheckedReport ? 1 : "",
                          page: 1,
                          sort: isChecked ? "urgent_help" : sortModel[0]?.field,
                          search: keywords ? keywords : null,
                          status:
                            isBtnSelect && isBtnSelect !== "all"
                              ? JSON.stringify(isBtnSelect)
                              : "",
                          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
                        });
                      }
                    }}
                  />
                )}
              />
            </List>
          </Box>
        </AppScrollbar>
      </>
    );
  };

  return (
    <>
      {id ? (
        <AppAnimate animation="transition.slideUpIn" delay={200}>
          <FoodDetail />
        </AppAnimate>
      ) : (
        <AppsContainer
          title="Manage Requests"
          sxStyle={{
            margin: 0,
            padding: "10px 0px 10px 10px",
          }}
          sidebarContent={<SideBarContent />}
          isSearch={true}
          searchChild={() => {
            if (isEmpty(selectedID)) {
              return;
            }
            return (
              <SearchComponent
                onApiCall={getCategoryList}
                isCheckedReport={isCheckedReport}
                isChecked={isChecked}
                isBtnSelect={isBtnSelect}
                setKeywords={setKeywords}
                keywords={keywords}
                sortModel={sortModel}
                from="requests"
              />
            );
          }}
        >
          <BodyStyle>
            <AppsHeader sxStyle={{ justifyContent: "space-between" }}>
              <Grid
                item
                xs={6}
                lg={5}
                xl={8}
                sx={{ paddingTop: "0px !important" }}
              >
                {selectedID ? (
                  <Breadcrumbs aria-label="breadcrumb">
                    <BLink
                      className="linkClass"
                      to={{ pathname: "/dashboard" }}
                    >
                      Dashboards
                    </BLink>
                    <Link
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setTableName("");
                        dispatch(setActiveCategory(""));
                      }}
                      underline="hover"
                      color="inherit"
                      // href="/manage-requests"
                    >
                      Manage Requests
                    </Link>
                    <Typography color="text.primary">
                      {tableName?.charAt(0).toUpperCase() +
                        tableName?.slice(1) || ""}
                    </Typography>
                  </Breadcrumbs>
                ) : (
                  <Breadcrumbs aria-label="breadcrumb">
                    <BLink
                      className="linkClass"
                      to={{ pathname: "/dashboard" }}
                    >
                      Dashboards
                    </BLink>
                    <Typography color="text.primary">
                      Manage Requests
                    </Typography>
                  </Breadcrumbs>
                )}
              </Grid>
              <Grid item>
                {tableName === "hunger" ? null : (
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{ color: "text.disabled" }}
                        checked={isChecked}
                        onChange={(event) => {
                          getCategoryList({
                            ["reported"]: isCheckedReport ? 1 : "",
                            page: 1,
                            sort: event.target.checked
                              ? "urgent_help"
                              : sortModel[0]?.field,
                            search: keywords ? keywords : null,
                            status:
                              isBtnSelect && isBtnSelect !== "all"
                                ? JSON.stringify(isBtnSelect)
                                : "",
                            sort_type: -1,
                          });
                          setSortModel([
                            {
                              field: event.target.checked
                                ? "urgent_help"
                                : "_id",
                              sort: "desc",
                            },
                          ]);
                          // setIsBtnSelect("");
                          setIsChecked(event.target.checked);
                        }}
                        color="primary"
                      />
                    }
                    label="Show Urgent"
                  />
                )}
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{ color: "text.disabled" }}
                      checked={isCheckedReport}
                      onChange={(event) => {
                        getCategoryList({
                          ["reported"]: event.target.checked ? 1 : "",
                          page: 1,
                          sort: isChecked ? "urgent_help" : sortModel[0]?.field,
                          search: keywords ? keywords : null,
                          status:
                            isBtnSelect && isBtnSelect !== "all"
                              ? JSON.stringify(isBtnSelect)
                              : "",
                          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
                        });
                        setSortModel([
                          {
                            field: isChecked ? "urgent_help" : "_id",
                            sort: "desc",
                          },
                        ]);
                        // setIsBtnSelect("");
                        setIsCheckedReport(event.target.checked);
                      }}
                      color="primary"
                    />
                  }
                  label="Reported"
                />
              </Grid>
            </AppsHeader>
            {/* List Of Particular Category */}
            {requestCount?.countsLoad ? (
              <Grid item xs={12}>
                <AppLoader />
              </Grid>
            ) : selectedID && categoryList ? (
              <Grid item xs={12} sx={{ padding: "10px" }}>
                <Box
                  className="tableDiv"
                  sx={{
                    "& .MuiDataGrid-main": {
                      height: {
                        // xs: `calc(50vh)`,
                        xs: `calc(100vh - 350px)`,
                        xl: `calc(100vh - 350px)`,
                      },
                    },
                  }}
                >
                  <Grid
                    container
                    spacing={3}
                    sx={{ m: 0, width: "100%", mb: 2, mt: -2 }}
                  >
                    <Grid item>
                      <Button
                        variant={
                          isBtnSelect === "all" ? "contained" : "outlined"
                        }
                        size="small"
                        color="primary"
                        onClick={() => {
                          getCategoryList({
                            ["reported"]: isCheckedReport ? 1 : "",
                            page: 1,
                            sort: isChecked ? "urgent_help" : null,
                            search: keywords ? keywords : null,
                            status: null,
                            sort_type: -1,
                          });
                          setIsBtnSelect("all");
                          setSortModel([
                            {
                              field: isChecked ? "urgent_help" : "_id",
                              sort: "desc",
                            },
                          ]);
                        }}
                        sx={{
                          backgroundColor:
                            isBtnSelect === "all" ? "#0263CC" : "white",
                        }}
                      >
                        All
                      </Button>
                    </Grid>
                    {buttonsArr.map((item: any) => {
                      if (selectedID === "hunger") {
                        if (!item.is_hunger) {
                          return null;
                        }
                      } else {
                        if (!item.show && item.is_hunger) {
                          return null;
                        }
                      }
                      return (
                        <Grid item>
                          <CButtom
                            onClick={() => {
                              setIsBtnSelect(
                                item?.key === isBtnSelect ? "all" : item.key
                              );
                              getCategoryList({
                                category_slug: selectedID,
                                ["reported"]: isCheckedReport ? 1 : "",
                                page: 1,
                                search: keywords ? keywords : null,
                                sort: isChecked
                                  ? "urgent_help"
                                  : sortModel[0]?.field,
                                status:
                                  item?.key === isBtnSelect
                                    ? null
                                    : JSON.stringify(item?.key),
                                sort_type: -1,
                              });
                              setSortModel([
                                {
                                  field: isChecked
                                    ? "urgent_help"
                                    : item?.key === isBtnSelect
                                    ? "status"
                                    : "_id",
                                  sort: "desc",
                                },
                              ]);
                            }}
                            item={item}
                            isBtnSelect={isBtnSelect}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                  <DataGridPro
                    initialState={{ pinnedColumns: { right: ["status"] } }}
                    pagination={true}
                    rows={rows}
                    onRowClick={(item: any) => {
                      // navigate to foodrequest > request-detail page
                      history.push({
                        pathname: `/manage-requests/${item.id}`,
                        state: item.row,
                      });
                    }}
                    paginationMode="server"
                    rowCount={pagination.total}
                    columns={columns}
                    pageSize={20}
                    page={pagination.page}
                    getRowId={(row) => row._id}
                    onPageChange={(event) => onChange(event)}
                    loading={categoryList?.listsLoad}
                    disableMultipleColumnsFiltering={true}
                    sortingOrder={["asc", "desc"]}
                    disableSelectionOnClick
                    filterMode={"client"}
                    sortModel={sortModel}
                    onSortModelChange={(newSortModel) => {
                      setSortModel(newSortModel);
                      setTimeout(() => {
                        getCategoryList({
                          ["reported"]: isCheckedReport ? 1 : "",
                          page: 1,
                          sort: isChecked ? "urgent_help" : sortModel[0]?.field,
                          search: keywords ? keywords : null,
                          status:
                            isBtnSelect && isBtnSelect !== "all"
                              ? JSON.stringify(isBtnSelect)
                              : "",
                          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
                        });
                      }, 500);
                    }}
                    onFilterModelChange={(item: any) => {
                      if (item?.items[0]?.value) {
                        getCategoryList({
                          ["reported"]: isCheckedReport ? 1 : "",
                          [item.items[0].columnField]: JSON.stringify(
                            item.items[0].value
                          ),
                          sort: isChecked ? "urgent_help" : null,
                          search: keywords ? keywords : null,
                          status:
                            isBtnSelect && isBtnSelect !== "all"
                              ? JSON.stringify(isBtnSelect)
                              : "",
                          operator: item.items[0].operator || "contains",
                        });
                      } else {
                        getCategoryList({
                          ["reported"]: isCheckedReport ? 1 : "",
                          page: 1,
                          sort: isChecked ? "urgent_help" : null,
                          search: keywords ? keywords : null,
                          status:
                            isBtnSelect && isBtnSelect !== "all"
                              ? JSON.stringify(isBtnSelect)
                              : null,
                        });
                      }
                    }}
                    components={{
                      NoRowsOverlay: () => <Nodata />,
                      LoadingOverlay: () => <AppLoader />,
                    }}
                    checkboxSelection={false}
                    sx={{ border: 0 }}
                  />
                </Box>
              </Grid>
            ) : (
              <NoUserScreen />
            )}
          </BodyStyle>
        </AppsContainer>
      )}
    </>
  );
};
export default ManageRequests;
