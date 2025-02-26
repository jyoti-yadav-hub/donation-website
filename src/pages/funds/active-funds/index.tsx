/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Typography,
  Box,
  Breadcrumbs,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import {
  getGridDateOperators,
  getGridNumericColumnOperators,
  getGridStringOperators,
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
import FundsDetails from "../funds-detail";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";
import { fundsBtnArr } from "components/DefaultHealth";
import CButtom from "@crema/core/AppRequestCustomButton";

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

interface FundParamProps {
  id: string;
}

interface FundProps extends RouteComponentProps<FundParamProps> {
  props: any;
}

const ActiveFunds: React.FC<FundProps> = (props) => {
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const { notiData } = useSelector<AppState, AppState["Notificationdata"]>(
    ({ Notificationdata }) => Notificationdata
  );
  const [fundList, setFundList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "createdAt", sort: "desc" },
  ]);
  const [isBtnSelect, setIsBtnSelect] = useState<any>("");
  const [keywords, setKeywords] = React.useState("");
  const [isCheckedReport, setIsCheckedReport] = useState<boolean>(false);

  //API For get Fund Lists
  async function getFundsLists(nData) {
    setFundList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("fund/admin/fund-list", nData);
      if (res.success) {
        setFundList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setFundList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setFundList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (id) {
      getFundsLists({
        page: 1,
        status: isBtnSelect === "cancel" ? null : JSON.stringify(isBtnSelect),
        // eslint-disable-next-line no-useless-computed-key
        ["reported"]: isCheckedReport ? 1 : "",
        // eslint-disable-next-line no-useless-computed-key
        ["cancel"]: isBtnSelect === "cancel" ? 1 : null,
        sort: sortModel[0].field,
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
      });
    }
  }, [id]);

  useEffect(() => {
    if (!isEmpty(notiData)) {
      getFundsLists({
        page: 1,
        status: isBtnSelect === "cancel" ? null : JSON.stringify(isBtnSelect),
        // eslint-disable-next-line no-useless-computed-key
        ["reported"]: isCheckedReport ? 1 : "",
        // eslint-disable-next-line no-useless-computed-key
        ["cancel"]: isBtnSelect === "cancel" ? 1 : null,
        sort: sortModel[0].field,
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
      });
    }
  }, [notiData]);

  useEffect(() => {
    getFundsLists({
      page: 1,
      status: isBtnSelect === "cancel" ? null : JSON.stringify(isBtnSelect),
      // eslint-disable-next-line no-useless-computed-key
      ["reported"]: isCheckedReport ? 1 : "",
      // eslint-disable-next-line no-useless-computed-key
      ["cancel"]: isBtnSelect === "cancel" ? 1 : null,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  const strFilterOperators = getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value)
  );

  const numberFiltOperator = getGridNumericColumnOperators().filter(
    ({ value }) => ["="].includes(value)
  );

  const dateFilterOperators = getGridDateOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const columns: GridColumns = [
    {
      field: "reference_id",
      headerName: "Request ID",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "fund_title",
      headerName: "Fund Title",
      minWidth: 250,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Typography sx={{ fontSize: 12 }}>
            {item?.row?.form_data?.title_of_fundraiser || "-"}
          </Typography>
        );
      },
    },
    {
      field: "active_type",
      headerName: "Active Type",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Typography sx={{ fontSize: 12 }}>
            {item?.value ? (
              item?.value === "donor" ? (
                <Chip
                  style={{ color: "#FFF", backgroundColor: "#2e7d32" }}
                  label="Donor"
                  size="small"
                />
              ) : item?.value === "ngo" ? (
                <Chip
                  style={{ color: "#FFF", backgroundColor: "#ed6c02" }}
                  label="NGO"
                  size="small"
                />
              ) : item?.value === "user" || item?.value === "beneficiary" ? (
                <Chip
                  style={{ color: "#FFF", backgroundColor: "#1976d2" }}
                  label="Beneficiary"
                  size="small"
                />
              ) : item?.value === "volunteer" ? (
                <Chip
                  style={{ color: "#FFF", backgroundColor: "#9c27b0" }}
                  label="Volunteer"
                  size="small"
                />
                ) : item?.value === "corporate" ? (
                  <Chip
                    style={{ color: "#FFF", backgroundColor: "#d32f2f" }}
                    label="Corporate"
                    size="small"
                  />
                ) :  null
            ) : null}
          </Typography>
        );
      },
    },
    {
      field: "fund_causes",
      headerName: "Fund Causes",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
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
                      label={it?.charAt(0)?.toUpperCase() + it?.slice(1) || "-"}
                      size="small"
                    />
                  );
                })
              : null}
          </>
        );
      },
    },
    {
      field: "regions",
      headerName: "Regions",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <>
            {item?.value
              ? item?.value?.map((it: any, index: number) => {
                  return (
                    <Typography sx={{ fontSize: 12 }}>
                      {it.charAt(0).toUpperCase() +
                        it.slice(1) +
                        `${index !== item?.value?.length - 1 ? ", " : ""}` ||
                        "-"}
                    </Typography>
                  );
                })
              : null}
          </>
        );
      },
    },
    {
      field: "report_fund",
      headerName: "Report Count",
      minWidth: 300,
      flex: 1,
      type: "number",
      filterOperators: numberFiltOperator,
      renderCell: (item: any) => {
        return (
          <Typography sx={{ fontSize: 12 }}>
            {item?.value ? item?.value?.length : 0}
          </Typography>
        );
      },
    },
    {
      field: "approve_time",
      headerName: "Approved On",
      minWidth: 200,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 200,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      minWidth: 200,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "status",
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
                  : item.value === "reject" || item.value === "blocked"
                  ? "#d32f2f" //error
                  : item.value === "cancel" || item.value === "cancelled"
                  ? "#d32f2f"
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
                : item.value === "cancel"
                ? "Cancelled"
                : item?.value.charAt(0).toUpperCase() + item?.value.slice(1) ||
                  "-"
            }
            size="small"
          />
        );
      },
      filterOperators: strFilterOperators,
    },
  ];

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.status = isBtnSelect === "cancel" ? null : JSON.stringify(isBtnSelect);
    flt.reported = isCheckedReport ? 1 : null;
    flt.cancel = isBtnSelect === "cancel" ? 1 : null;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    getFundsLists(flt);
  }

  return (
    <>
      {id ? (
        <AppAnimate animation="transition.slideUpIn" delay={200}>
          <FundsDetails
            getFundsLists={() => {
              getFundsLists({
                page: 1,
                status:
                  isBtnSelect === "cancel" ? null : JSON.stringify(isBtnSelect),
                // eslint-disable-next-line no-useless-computed-key
                ["reported"]: isCheckedReport ? 1 : "",
                // eslint-disable-next-line no-useless-computed-key
                ["cancel"]: isBtnSelect === "cancel" ? 1 : null,
                sort: sortModel[0].field,
                sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
              });
            }}
          />
        </AppAnimate>
      ) : (
        <AppsContainer
          title="Funds"
          fullView
          sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
          isSearch={true}
          searchChild={() => {
            return (
              <SearchComponent
                onApiCall={getFundsLists}
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
              <Grid item xs={2}>
                <BreadWrapper>
                  <Breadcrumbs
                    aria-label="breadcrumb"
                    sx={{ margin: "20px 0px" }}
                  >
                    <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                      Dashboards
                    </Link>
                    <Typography color="text.primary">Funds</Typography>
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
                {fundsBtnArr.map((item: any) => {
                  return (
                    <Grid item sx={{ pt: "0px !important" }}>
                      <CButtom
                        onClick={() => {
                          setIsBtnSelect(
                            item?.key === isBtnSelect ? "" : item.key
                          );
                          getFundsLists({
                            page: 1,
                            sort: sortModel[0]?.field,
                            status:
                              item?.key === "cancel" ||
                              item?.key === isBtnSelect
                                ? null
                                : JSON.stringify(item?.key),
                            // eslint-disable-next-line no-useless-computed-key
                            ["reported"]: isCheckedReport ? 1 : "",
                            // eslint-disable-next-line no-useless-computed-key
                            ["cancel"]: item?.key === "cancel" ? 1 : null,
                            sort_type: -1,
                          });
                          setSortModel([
                            {
                              field:
                                item?.key === isBtnSelect
                                  ? "status"
                                  : "reference_id",
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
                <Grid item sx={{ pt: "0px !important" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{ color: "text.disabled" }}
                        checked={isCheckedReport}
                        onChange={(event) => {
                          getFundsLists({
                            page: 1,
                            status:
                              isBtnSelect === "cancel"
                                ? null
                                : JSON.stringify(isBtnSelect),
                            // eslint-disable-next-line no-useless-computed-key
                            ["reported"]: event.target.checked ? 1 : "",
                            // eslint-disable-next-line no-useless-computed-key
                            ["cancel"]: isBtnSelect === "cancel" ? 1 : null,
                            sort: sortModel[0]?.field,
                            sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
                          });
                          // setIsBtnSelect("");
                          setIsCheckedReport(event.target.checked);
                        }}
                        color="primary"
                      />
                    }
                    label="Reported"
                  />
                </Grid>
              </Grid>
            </div>
          </AppsHeader>
          <CTable
            sxStyle={{ "& .MuiDataGrid-row:hover": { cursor: "pointer" } }}
            initialState={{
              pinnedColumns: { right: ["status"] },
            }}
            onRowClick={(item: any) =>
              history.push({
                pathname: `/funds/${item.id}`,
                state: { id: item.id, from: "funds" },
              })
            }
            NewBar={null}
            onChange={(event) => onChange(event)}
            row={fundList?.lists}
            column={columns}
            rowCount={pagination.total}
            page={pagination.page}
            listsLoad={fundList?.listsLoad}
            checkboxSelection={false}
            onSelectionModelChange={() => console.log("row select")}
            sortModel={sortModel}
            getApiCall={getFundsLists}
            setSortModel={setSortModel}
          />
        </AppsContainer>
      )}
    </>
  );
};

export default ActiveFunds;
