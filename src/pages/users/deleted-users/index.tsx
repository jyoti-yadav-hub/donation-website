/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Chip,
  Stack,
  styled,
  Typography,
} from "@mui/material";
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
import UserDetails from "../user-details";
import clsx from "clsx";
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

interface UserParamProps {
  id: string;
}

interface UserProps extends RouteComponentProps<UserParamProps> {
  props: any;
}

const DeletedUsers: React.FC<UserProps> = () => {
  const history = useHistory();
  const { id }: { id: string } = useParams();
  const [list, setList] = useState<any>({
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
  const [keywords, setKeywords] = React.useState("");

  //API for get admin get deleted users lists
  async function onGetDeletedUsers(nData) {
    setList((e) => ({ ...e, listsLoad: true }));
    try {
      nData.deleted = 1;
      const res = await getApiData(`user/list`, nData);
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
        // history.push("/error-pages/maintenance");
        setList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    onGetDeletedUsers({
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
      field: "user_name",
      headerName: "First Name",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },

    {
      field: "phone",
      headerName: "Phone",
      minWidth: 170,
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
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
      valueGetter: (params: any) => params?.value?.toLowerCase() || "-",
      filterOperators: strFilterOperators,
    },
    {
      field: "delete_account_reason",
      headerName: "Reason for Delete",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    // {
    //   field: "user_type",
    //   headerName: "User Type",
    //   minWidth: 300,
    //   flex: 1,
    //   filterOperators: strFilterOperators,
    //   renderCell: (item: any) => {
    //     return (
    //       <Stack direction="row" spacing={1}>
    //         {item?.row?.is_donor ? (
    //           <Chip
    //             style={{ color: "#FFF", backgroundColor: "#2e7d32" }}
    //             label="Donor"
    //             size="small"
    //           />
    //         ) : null}

    //         {item?.row?.is_ngo ? (
    //           <Chip
    //             style={{ color: "#FFF", backgroundColor: "#ed6c02" }}
    //             label="NGO"
    //             size="small"
    //           />
    //         ) : null}

    //         {item?.row?.is_user ? (
    //           <Chip
    //             style={{ color: "#FFF", backgroundColor: "#1976d2" }}
    //             label="Beneficiary"
    //             size="small"
    //           />
    //         ) : null}

    //         {item?.row?.is_volunteer ? (
    //           <Chip
    //             style={{ color: "#FFF", backgroundColor: "#9c27b0" }}
    //             label="Volunteer"
    //             size="small"
    //           />
    //         ) : null}
    //       </Stack>
    //     );
    //   },
    // },

    {
      field: "role",
      headerName: "Role",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        let roles = item.row.role.map((rl) => {
          return (rl = rl.toLowerCase());
        });
        return (
          <Stack direction="row" spacing={1}>
            {roles?.includes("organizer") ? (
              <Chip
                style={{ color: "#FFF", backgroundColor: "#2e7d32" }}
                label="Organizer"
                size="small"
              />
            ) : null}
            {roles?.includes("judge") ? (
              <Chip
                className="chipsStyle"
                style={{ backgroundColor: "#1976d2" }}
                label="Judge"
                size="small"
              />
            ) : null}
            {roles?.includes("participant") ? (
              <Chip
                className="chipsStyle"
                style={{ backgroundColor: "#9c27b0" }}
                label="Participant"
                size="small"
              />
            ) : null}
            {roles?.includes("audience") ? (
              <Chip
                className="chipsStyle"
                style={{ backgroundColor: "#ed6c02" }}
                label="Audience"
                size="small"
              />
            ) : null}
          </Stack>
        );
      },
    },
    {
      field: "dob",
      headerName: "Date Of Birth",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => params?.row?.dob || "-",
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
      field: "deletedAt",
      headerName: "Deactivated At",
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
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    onGetDeletedUsers(flt);
  }

  return (
    <AppsContainer
      title={id ? "User Detail" : "Deactivated Users"}
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        if (id) {
          return null;
        } else {
          return (
            <SearchComponent
              onApiCall={onGetDeletedUsers}
              setKeywords={setKeywords}
              keywords={keywords}
              sortModel={sortModel}
            />
          );
        }
      }}
    >
      <AppsHeader>
        <div style={{ display: "flex", alignItems: "center" }}>
          <BreadWrapper>
            <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "20px 0px" }}>
              <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                Dashboards
              </Link>
              <Typography color="text.primary">Deactivated Users</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        sxStyle={{ "& .MuiDataGrid-row:hover": { cursor: "pointer" } }}
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={(item: any) => history.push(`/deleted-users/${item.id}`)}
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
        getApiCall={onGetDeletedUsers}
        setSortModel={setSortModel}
      />
      <MailDetailViewWrapper className={clsx({ show: id })}>
        <UserDetails from="deletedUser" />
      </MailDetailViewWrapper>
    </AppsContainer>
  );
};

export default DeletedUsers;
