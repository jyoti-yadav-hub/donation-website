/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  styled,
  Typography,
  Chip,
  Grid,
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
import clsx from "clsx";
import getApiData from "../../../shared/helpers/apiHelper";
import {
  Link,
  RouteComponentProps,
  useHistory,
  useParams,
} from "react-router-dom";
import { initialTimeFormat } from "shared/constants/AppConst";
import CTable from "components/CTable";
import HelpRequestDetal from "../help-request-details";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import SearchComponent from "components/SearchBar";
import { useSelector } from "react-redux";
import { AppState } from "redux/store";
import { helpReqArr } from "components/DefaultHealth";
import CButtom from "@crema/core/AppRequestCustomButton";
const { flag } = require("country-emoji");

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const MailDetailViewWrapper = styled(Box)(({ theme }) => {
  return {
    transition: "all 0.5s ease",
    transform: "translateX(100%)",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
    opacity: 0,
    visibility: "hidden",
    backgroundColor: theme.palette.background.paper,
    "&.show": {
      transform: "translateX(0)",
      opacity: 1,
      visibility: "visible",
      zIndex: 1000002,
    },
  };
});

interface HelpParamProps {
  id: string;
}

interface HelpProps extends RouteComponentProps<HelpParamProps> {
  props: any;
}

const HelpRequestsLists: React.FC<HelpProps> = (props) => {
  const history = useHistory();
  const { id }: { id: string } = useParams();

  const { notiData } = useSelector<AppState, AppState["Notificationdata"]>(
    ({ Notificationdata }) => Notificationdata
  );

  const [helpRequests, setHelpRequests] = useState<any>({
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
  const [isBtnSelect, setIsBtnSelect] = useState<any>("");
  const [keywords, setKeywords] = React.useState("");

  //API for get help-request lists
  async function getHelpRequests(nData) {
    if (nData?.noload) {
      setHelpRequests((e) => ({ ...e, listsLoad: false }));
    } else {
      setHelpRequests((e) => ({ ...e, listsLoad: true }));
    }
    try {
      const res = await getApiData("help-request/admin/list", nData);
      if (res.success) {
        setHelpRequests({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setHelpRequests({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setHelpRequests({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (!isEmpty(id)) {
      getHelpRequests({
        page: 1,
        status: JSON.stringify(isBtnSelect),
        search: keywords ? keywords : null,
        sort: sortModel[0].field,
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
      });
    }
  }, []);

  useEffect(() => {
    getHelpRequests({
      page: 1,
      status: JSON.stringify(isBtnSelect),
      search: keywords ? keywords : null,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  useEffect(() => {
    if (!isEmpty(notiData)) {
      getHelpRequests({
        page: 1,
        status: JSON.stringify(isBtnSelect),
        search: keywords ? keywords : null,
        sort: sortModel[0].field,
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        noload: true,
      });
    }
  }, [notiData]);

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
      field: "audio",
      headerName: "Audio",
      minWidth: 300,
      flex: 1,
      renderCell: (item?: any) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {item?.value ? (
              <audio controls style={{ width: "250px", padding: "7px 0px" }}>
                <source src={item?.value} type="audio/ogg" />
                <source src={item?.value} type="audio/mpeg" />
              </audio>
            ) : (
              "-"
            )}
          </div>
        );
      },
    },
    {
      field: "help_language",
      headerName: "Language",
      minWidth: 200,
      flex: 1,
      type: "string",
      filterOperators: strFilterOperators,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 200,
      flex: 1,
      type: "string",
      filterOperators: strFilterOperators,
    },
    {
      field: "phone",
      headerName: "Phone",
      minWidth: 300,
      flex: 1,
      type: "string",
      filterOperators: strFilterOperators,
      renderCell: (item?: any) => {
        return (
          <Typography sx={{ fontSize: 12 }}>
            {flag(item?.row?.country_code) || ""}{" "}
            {`${item?.row?.phone_code || ""} ${item?.value || "-"}` || "-"}
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 200,
      flex: 1,
      filterOperators: singleSelectFilter,
      type: "singleSelect",
      valueOptions: [
        "Pending",
        "Approved",
        "Rejected",
        "Deactivated",
        "Completed",
        "Waiting for Volunteer",
        "Blocked",
      ],
      renderCell: (item: any) => {
        return (
          <Chip
            style={{
              color: "#FFF",
              backgroundColor:
                item?.value === "approve"
                  ? "#2e7d32" //success
                  : item?.value === "complete" || item?.value === "completed"
                  ? "#0ABCED"
                  : item?.value === "reject" ||
                    item?.value === "rejected" ||
                    item?.value === "block" ||
                    item?.value === "blocked"
                  ? "#d32f2f" //error
                  : item?.value === "deactive"
                  ? "#ED6C04" //error
                  : item?.value === "pending"
                  ? "#9c27b0"
                  : item.value === "waiting_for_volunteer" ||
                    item.value === "close"
                  ? "#1976d2" //primary
                  : "#ebebeb", //default
            }}
            label={
              item?.value === "approve"
                ? "Approved"
                : item?.value === "complete"
                ? "Completed"
                : item?.value === "reject"
                ? "Rejected"
                : item?.value === "block"
                ? "Blocked"
                : item?.value === "deactive"
                ? "Deactivated"
                : item.value === "waiting_for_volunteer"
                ? "Waiting for Volunteer"
                : item?.value?.charAt(0).toUpperCase() + item?.value?.slice(1)
            }
            variant="outlined"
            size="small"
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
  ];

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.page = newPage + 1;
    flt.status = JSON.stringify(isBtnSelect);
    flt.search = keywords ? keywords : null;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    flt.operator = "contains";
    getHelpRequests(flt);
  }

  return (
    <AppsContainer
      title={id ? "Help Request Detail" : "Help Requests"}
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        if (id) {
          return null;
        } else {
          return (
            <SearchComponent
              onApiCall={getHelpRequests}
              setKeywords={setKeywords}
              keywords={keywords}
              sortModel={sortModel}
            />
          );
        }
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
          <Grid item xs={2}>
            <BreadWrapper>
              <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "20px 0px" }}>
                <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                  Dashboards
                </Link>
                <Typography color="text.primary">Help Requests</Typography>
              </Breadcrumbs>
            </BreadWrapper>
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{
              m: 0,
              width: "100%",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {helpReqArr.map((item: any) => {
              return (
                <Grid item sx={{ pt: "0px !important" }}>
                  <CButtom
                    onClick={() => {
                      setIsBtnSelect(item?.key === isBtnSelect ? "" : item.key);
                      getHelpRequests({
                        page: 1,
                        search: keywords ? keywords : null,
                        status:
                          item?.key === "cancel" || item?.key === isBtnSelect
                            ? null
                            : JSON.stringify(item?.key),
                        sort: sortModel[0]?.field,
                        sort_type: -1,
                      });
                      setSortModel([
                        {
                          field: item?.key === isBtnSelect ? "status" : "_id",
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
        </div>
      </AppsHeader>

      <CTable
        sxStyle={{ "& .MuiDataGrid-row:hover": { cursor: "pointer" } }}
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        NewBar={null}
        onRowClick={(item: any) => history.push(`/help-requests/${item.id}`)}
        onChange={(event) => onChange(event)}
        row={helpRequests?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={helpRequests?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getHelpRequests}
        keyword={keywords}
        setSortModel={setSortModel}
      />

      <MailDetailViewWrapper className={clsx({ show: id })}>
        <HelpRequestDetal
          getHelpRequests={() => {
            getHelpRequests({
              page: 1,
              status: JSON.stringify(isBtnSelect),
              search: keywords ? keywords : null,
              sort: sortModel[0].field,
              sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
            });
          }}
        />
      </MailDetailViewWrapper>
    </AppsContainer>
  );
};

export default HelpRequestsLists;
