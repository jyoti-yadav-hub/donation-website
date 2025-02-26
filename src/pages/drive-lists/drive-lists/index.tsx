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
import DriveDetails from "../drive-detail";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";
import { driveBtnArr } from "components/DefaultHealth";
import CButtom from "@crema/core/AppRequestCustomButton";

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

interface DriveParamProps {
  id: string;
}

interface DriveProps extends RouteComponentProps<DriveParamProps> {
  props: any;
}

const DriveLists: React.FC<DriveProps> = (props) => {
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const { notiData } = useSelector<AppState, AppState["Notificationdata"]>(
    ({ Notificationdata }) => Notificationdata
  );
  const [drivesList, setDrivesList] = React.useState<any>({
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

  //API For get drive Lists
  async function getDrivesList(nData) {
    setDrivesList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("drive/admin/list", nData);
      if (res.success) {
        setDrivesList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setDrivesList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setDrivesList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (id) {
      getDrivesList({
        page: 1,
        status: isBtnSelect ? JSON.stringify(isBtnSelect) : null,
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
      getDrivesList({
        page: 1,
        status: isBtnSelect ? JSON.stringify(isBtnSelect) : null,
        // eslint-disable-next-line no-useless-computed-key
        ["reported"]: isCheckedReport ? 1 : "",
        sort: sortModel[0].field,
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
      });
    }
  }, [notiData]);

  useEffect(() => {
    getDrivesList({
      page: 1,
      status: isBtnSelect ? JSON.stringify(isBtnSelect) : null,
      // eslint-disable-next-line no-useless-computed-key
      ["reported"]: isCheckedReport ? 1 : "",
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

  const columns: GridColumns = [
    {
      field: "reference_id",
      headerName: "Request ID",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "title_of_fundraiser",
      filterOperators: strFilterOperators,
      headerName: "Drive Title",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) =>
        params?.row?.form_data?.title_of_fundraiser || "-",
      type: "string",
    },
    {
      field: "user_name",
      headerName: "Created By",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
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
                ) : null
            ) : null}
          </Typography>
        );
      },
    },
    {
      field: "country",
      headerName: "Country",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item?: any) => {
        return (
          <Typography sx={{ fontSize: 12 }}>
            {item?.row?.country_data?.country || "-"}
          </Typography>
        );
      },
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
                  : item.value === "complete"
                  ? "#0BBCED"
                  : item.value === "reject" ||
                    item.value === "blocked" ||
                    item.value === "block"
                  ? "#d32f2f" //error
                  : item.value === "cancel" || item.value === "cancelled"
                  ? "#d32f2f"
                  : item.value === "waiting_for_verify"
                  ? "#1976d2"
                  : item.value === "pending"
                  ? "#9c27b0" //secondary
                  : item.value === "ongoing"
                  ? "#E1BA00"
                  : item.value === "reverify"
                  ? "#ed6c02" //warning
                  : "#ebebeb", //default
            }}
            label={
              item.value === "approve"
                ? "Approved"
                : item.value === "complete"
                ? "Completed"
                : item.value === "reject"
                ? "Rejected"
                : item.value === "cancel"
                ? "Cancelled"
                : item.value === "block"
                ? "Blocked"
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
    flt.page = newPage + 1;
    flt.search = keywords ? keywords : null;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    flt.operator = "contains";
    flt.status = isBtnSelect ? JSON.stringify(isBtnSelect) : null;
    flt.reported = isCheckedReport ? 1 : null;
    getDrivesList(flt);
  }

  return (
    <>
      {id ? (
        <AppAnimate animation="transition.slideUpIn" delay={200}>
          <DriveDetails
            getDrivesList={() => {
              getDrivesList({
                page: 1,
                status: isBtnSelect ? JSON.stringify(isBtnSelect) : null,
                // eslint-disable-next-line no-useless-computed-key
                ["reported"]: isCheckedReport ? 1 : "",
                sort: sortModel[0].field,
                sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
              });
            }}
          />
        </AppAnimate>
      ) : (
        <AppsContainer
          title="Drives List"
          fullView
          sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
          isSearch={true}
          searchChild={() => {
            return (
              <SearchComponent
                onApiCall={getDrivesList}
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
              <Grid item xs={3}>
                <BreadWrapper>
                  <Breadcrumbs
                    aria-label="breadcrumb"
                    sx={{ margin: "20px 0px" }}
                  >
                    <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                      Dashboards
                    </Link>
                    <Typography color="text.primary">Drives List</Typography>
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
                {driveBtnArr.map((item: any) => {
                  return (
                    <Grid item sx={{ pt: "0px !important" }}>
                      <CButtom
                        onClick={() => {
                          setIsBtnSelect(
                            item?.key === isBtnSelect ? "" : item.key
                          );
                          getDrivesList({
                            page: 1,
                            sort: sortModel[0]?.field,
                            status:
                              item?.key === isBtnSelect
                                ? null
                                : JSON.stringify(item?.key),
                            // eslint-disable-next-line no-useless-computed-key
                            ["reported"]: isCheckedReport ? 1 : "",
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
                          getDrivesList({
                            page: 1,
                            status: isBtnSelect
                              ? JSON.stringify(isBtnSelect)
                              : null,
                            // eslint-disable-next-line no-useless-computed-key
                            ["reported"]: event.target.checked ? 1 : "",
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
                pathname: `/drive-lists/${item.id}`,
                state: { id: item.id, from: "drive-lists" },
              })
            }
            NewBar={null}
            onChange={(event) => onChange(event)}
            row={drivesList?.lists}
            column={columns}
            rowCount={pagination.total}
            page={pagination.page}
            listsLoad={drivesList?.listsLoad}
            checkboxSelection={false}
            onSelectionModelChange={() => console.log("row select")}
            sortModel={sortModel}
            getApiCall={getDrivesList}
            setSortModel={setSortModel}
          />
        </AppsContainer>
      )}
    </>
  );
};

export default DriveLists;
