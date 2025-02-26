/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Breadcrumbs, Chip, styled, Typography } from "@mui/material";
import {
  GridColumns,
  GridSortModel,
  getGridDateOperators,
  getGridStringOperators,
} from "@mui/x-data-grid-pro";
import moment from "moment";
import { isArray } from "lodash";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import {
  Link,
  RouteComponentProps,
  useHistory,
  useParams,
} from "react-router-dom";
import CTable from "components/CTable";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { AppAnimate } from "@crema";
import NGODetails from "../ngodetails";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";
const { flag } = require("country-emoji");

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

interface NGOParamProps {
  id: string;
}

interface NGOProps extends RouteComponentProps<NGOParamProps> {
  props: any;
}

const DeletedNGOs: React.FC<NGOProps> = () => {
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const [list, setList] = useState<any>({
    lists: [],
    listsLoad: false,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "deletedAt", sort: "desc" },
  ]);
  const [keywords, setKeywords] = React.useState("");

  //API for get admin deleted ngos lists
  async function onGetDeletedNGOs(nData) {
    setList((e) => ({ ...e, listsLoad: true }));
    try {
      nData.deleted = 1;
      const res = await getApiData(`ngo/ngo-list`, nData);
      if (res.success) {
        setList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    onGetDeletedNGOs({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, [sortModel]);

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
      type: "string",
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
      valueGetter: (params) =>
        Number(params?.row?.ngo_registration_number) || 0,
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
      field: "deletedAt",
      headerName: "Deactivated At",
      minWidth: 200,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
  ];

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    onGetDeletedNGOs(flt);
  }

  return (
    <>
      {id ? (
        <AppAnimate animation="transition.slideUpIn" delay={200}>
          <NGODetails from="deletedNGO" />
        </AppAnimate>
      ) : (
        <AppsContainer
          title="Deactivated NGOs"
          fullView
          sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
          isSearch={true}
          searchChild={() => {
            return (
              <SearchComponent
                onApiCall={onGetDeletedNGOs}
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
                <Breadcrumbs
                  aria-label="breadcrumb"
                  sx={{ margin: "20px 0px" }}
                >
                  <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                    Dashboards
                  </Link>
                  <Typography color="text.primary">Deactivated NGO</Typography>
                </Breadcrumbs>
              </BreadWrapper>
            </div>
          </AppsHeader>

          <CTable
            sxStyle={{ "& .MuiDataGrid-row:hover": { cursor: "pointer" } }}
            initialState={{ pinnedColumns: { right: ["actions"] } }}
            onRowClick={(item: any) =>
              history.push({
                pathname: `/deleted-ngos/${item.id}`,
                state: { id: item.id, from: "ngo-list" },
              })
            }
            NewBar={null}
            onChange={(event) => onChange(event)}
            row={list?.lists}
            column={columns}
            rowCount={pagination.total}
            page={pagination.page}
            listsLoad={list?.listsLoad}
            checkboxSelection={false}
            onSelectionModelChange={() => console.log("row select")}
            sortModel={sortModel}
            getApiCall={onGetDeletedNGOs}
            setSortModel={setSortModel}
          />
        </AppsContainer>
      )}
    </>
  );
};

export default DeletedNGOs;
