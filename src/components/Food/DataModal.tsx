import React, { useEffect, useState } from "react";
import { Box, Chip, Divider, Grid, styled, Typography } from "@mui/material";
import getApiData from "../../shared/helpers/apiHelper";
import { toast } from "react-toastify";
import { AppState } from "redux/store";
import {
  GridColumns,
  GridSortModel,
  getGridDateOperators,
  getGridStringOperators,
  getGridNumericColumnOperators,
} from "@mui/x-data-grid-pro";
import { isArray, isEmpty } from "lodash";
import { useSelector } from "react-redux";
import CTable from "components/CTable";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
import AppDialog from "@crema/core/AppDialog";
import BoxCards from "./BoxCard";
const { flag } = require("country-emoji");

const ModalWrapper = styled(Box)(({ theme }) => ({
  "& .modalDiv": {
    display: "flex !important",
    alignItems: "center !important",
    padding: "7px 0px",
  },
  "& .nameDetails": {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 10,
    backgroundColor: "rgb(244, 247, 254)",
    borderRadius: 5,
  },
  "& .txtStyle": {
    fontSize: "15px",
    fontWeight: "500",
    wordBreak: "break-word",
  },
}));

interface DataModalProps {
  foodDetails: any;
  visible: boolean;
  setVisible: any;
  anchorEl: any;
  setAnchorEl: any;
}

const UserDataModal: React.FC<DataModalProps> = ({
  foodDetails,
  visible,
  setVisible,
  anchorEl,
  setAnchorEl,
}) => {
  const { notiData } = useSelector<AppState, AppState["Notificationdata"]>(
    ({ Notificationdata }) => Notificationdata
  );

  const [requests, setTaxBenefits] = useState<any>({
    lists: [],
    listsLoad: false,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "reference_id", sort: "desc" },
  ]);

  const hunger = requests?.lists.find(
    (item) => item.category_slug === "hunger"
  );
  const fundRaiser = requests?.lists.find(
    (item) => item.category_slug === "fundraiser"
  );

  const is_hunger =
    hunger && hunger.category_slug && hunger.category_slug === "hunger"
      ? true
      : false;

  const isFundraiser =
    fundRaiser &&
    fundRaiser.category_slug &&
    fundRaiser.category_slug === "fundraiser"
      ? true
      : false;

  //API for get previously requests
  async function getPreviousRequests(nData) {
    setTaxBenefits((e) => ({ ...e, listsLoad: true }));
    try {
      nData.user_id = foodDetails?.user_id;
      const res = await getApiData(`request/admin/cause-request-list`, nData);
      if (res.success) {
        setTaxBenefits({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setTaxBenefits({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setTaxBenefits({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (!isEmpty(notiData)) {
      getPreviousRequests({
        page: 1,
        sort: sortModel[0].field,
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notiData]);

  useEffect(() => {
    getPreviousRequests({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const strFilterOperators = getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value)
  );

  const dateFilterOperators = getGridDateOperators().filter(({ value }) =>
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
      field: "category_name",
      headerName: "Category",
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
      field: "title_of_fundraiser",
      filterOperators: strFilterOperators,
      headerName: "Fundraiser Title",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) =>
        params?.row?.form_data?.title_of_fundraiser || "-",
      type: "string",
    },
    {
      field: "name_of_beneficiary",
      filterOperators: strFilterOperators,
      headerName: "Beneficiary Name",
      minWidth: 200,
      flex: 1,
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
      field: "days_left",
      filterOperators: strFilterOperators,
      headerName: "Days Left",
      minWidth: 150,
      flex: 1,
      valueGetter: (params: any) => params?.value || "-",
    },
    {
      field: "goal_amount",
      filterOperators: numberFiltOperator,
      headerName: "Goal Amount",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) =>
        params?.row?.category_slug === "hunger"
          ? "-"
          : `${params?.row?.country_data?.currency || ""}${
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
      valueGetter: (params) =>
        params?.row?.category_slug === "hunger"
          ? "-"
          : params?.row?.remaining_amount
          ? `${params?.row?.country_data?.currency || ""}${
              Number(params?.row?.remaining_amount).toFixed(2) || 0
            }` || 0
          : `${params?.row?.country_data?.currency || ""}${Number(
              params?.row?.form_data?.goal_amount
            ).toFixed(2)}` || 0,
      type: "number",
    },
    {
      field: "report_count",
      filterOperators: numberFiltOperator,
      headerName: "Report Count",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => params?.row?.report_benificiary?.length || 0,
      type: "number",
    },
    {
      field: "urgent_help",
      filterOperators: strFilterOperators,
      headerName: "Request Is Urgent?",
      minWidth: 200,
      flex: 1,
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
                item.value === "approve" ||
                item.value === "complete"
                  ? "#2e7d32" //success
                  : item.value === "completed" ||
                    item.value === "waiting_for_verify"
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
                    item.value === "close"
                  ? "#1976d2" //primary
                  : "#0288d1", //default
            }}
            label={
              item.value === "approve"
                ? "Approved"
                : item.value === "reject"
                ? "Rejected"
                : item.value === "waiting_for_verify"
                ? "Waiting for Verify"
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
      field: "expiry_date",
      filterOperators: dateFilterOperators,
      headerName: "Expiry Date",
      minWidth: 200,
      flex: 1,
      hide: is_hunger ? true : false,
      valueGetter: (params) =>
        params?.row?.form_data?.expiry_date
          ? moment(params?.row?.form_data?.expiry_date).format(
              initialTimeFormat
            )
          : "",
      type: "date",
    },
  ];

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    getPreviousRequests(flt);
  }

  return (
    <AppDialog
      maxWidth="xl"
      open={visible}
      onClose={() => setVisible(false)}
      title="User Detail"
    >
      <ModalWrapper>
        <Grid container xs={12} sx={{ m: 0, width: "100%" }}>
          {/* User Name */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards title="Name" values={foodDetails?.uname || "-"} />
          </Grid>
          {/* User Email */}
          {foodDetails?.userDtl?.email && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Email"
                values={foodDetails?.userDtl?.email || "-"}
              />
            </Grid>
          )}
          {/* User Phone */}
          {foodDetails?.userDtl?.phone && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Phone"
                values={`${flag(foodDetails?.country_data?.country_code || "")}
                  ${foodDetails?.userDtl?.phone_code || ""} ${
                  foodDetails?.userDtl?.phone || "-"
                }`}
              />
            </Grid>
          )}
          {/* User Have Restaurant */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              isChip={true}
              title="Is User have restaurant?"
              style={{
                color: "#FFF",
                backgroundColor: foodDetails?.userDtl?.is_restaurant
                  ? "#2e7d32" //success
                  : "#d32f2f", //error
              }}
              values={
                `${foodDetails?.userDtl?.is_restaurant ? "Yes" : "No"}` || "-"
              }
            />
          </Grid>
          {/* user_location */}
          {foodDetails?.userDtl?.location?.city && (
            <Grid item xs={12} md={12}>
              <BoxCards
                title="User Location"
                values={foodDetails?.userDtl?.location?.city || "-"}
              />
            </Grid>
          )}
          {foodDetails?.userDtl?.is_restaurant ? (
            <>
              {/* restaurant_name */}
              <Grid item xs={6} lg={4} xl={3}>
                <BoxCards
                  title="Restaurant Name"
                  values={foodDetails?.userDtl?.restaurant_name || "-"}
                />
              </Grid>

              {/* restaurant_location */}
              <Grid item xs={6} lg={8} xl={9}>
                <BoxCards
                  title="Restaurant Location"
                  values={
                    foodDetails?.userDtl?.restaurant_location?.city || "-"
                  }
                />
              </Grid>
            </>
          ) : null}
          <Divider sx={{ margin: "5px 0px 10px" }} />
          {requests?.lists && requests?.lists?.length > 0 && (
            <>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography
                  gutterBottom
                  variant="body2"
                  sx={{ fontSize: { lg: "14px", xl: "15px" } }}
                >
                  Previous Requests:
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CTable
                  tableStyle={{ height: "calc(80vh - 250px) !important" }}
                  initialState={{ pinnedColumns: { right: ["status"] } }}
                  onRowClick={() => console.log("click")}
                  NewBar={null}
                  onChange={(event) => onChange(event)}
                  row={requests?.lists}
                  column={columns}
                  rowCount={pagination.total}
                  page={pagination.page}
                  listsLoad={requests?.listsLoad}
                  checkboxSelection={false}
                  onSelectionModelChange={() => console.log("row select")}
                  sortModel={sortModel}
                  getApiCall={getPreviousRequests}
                  setSortModel={setSortModel}
                />
              </Grid>
            </>
          )}
        </Grid>
      </ModalWrapper>
    </AppDialog>
  );
};

export default UserDataModal;
