/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import {
  GridActionsCellItem,
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
import { BlockOutlined } from "@mui/icons-material";
import DialogSlide from "components/DialogSlide";
import { Form, Formik } from "formik";
import { LoadingButton } from "@mui/lab";
import { AppConfirmDialog } from "@crema";
const { flag } = require("country-emoji");
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

const BlockedUsers: React.FC<UserProps> = () => {
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
  // const [openUnblockModal, setOpenUnblockModal] = React.useState<any>(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [openDltModal, setOpenDltModal] = React.useState<any>(false);
  const [blockItem, setBlockItem] = React.useState<any>({});
  const [openBlockdetail, setOpenBlockDetail] = React.useState<any>(false);
  const [usersList, setUsersList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const closeBlockdetail = () => {
    setOpenBlockDetail(false);
  };

  //API for get admin get deleted users lists
  async function onGetDeletedUsers(nData) {
    setList((e) => ({ ...e, listsLoad: true }));
    try {
      nData.blocked = 1;
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
  //API for delete user
  async function unblockUser() {
    setDltLoad(true);
    try {
      let data = { ...blockItem, ...selectedItem, actions: "unblocked" };
      const res = await getApiData(`user/block-unblock-account`, data, "POST");
      if (res.success) {
        await onGetDeletedUsers({
          page: 1,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });

        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setDltLoad(false);
      setOpenDltModal(false);
    } catch (error) {
      setDltLoad(false);
      toast.error("Something went wrong");
    }
  }

  const handleClose = () => {
    setOpenDltModal(false);
    setDltLoad(false);
    setSelectedItem({});
  };

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
            {flag(item?.row?.phone_country_short_name) || "-"}
            {""}
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
      field: "block_account_reason",
      headerName: "Reason To Block",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
    },

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
      type: "string",
      valueGetter: (params: any) =>
        params?.value
          ? moment(new Date(params?.value)).format("DD/MM/YYYY")
          : "-",
      filterOperators: strFilterOperators,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 200,
      flex: 1,
      filterOperators: dateFilterOperators,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "-",
      type: "date",
    },
    {
      field: "blockedAt",
      headerName: "Blocked At",
      minWidth: 200,
      flex: 1,
      filterOperators: dateFilterOperators,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "-",
      type: "date",
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
            label="Block"
            icon={<BlockOutlined color="primary" />}
            onClick={(event) => {
              setSelectedItem(item);
              setOpenDltModal(true);
            }}
            color="warning"
          >
            Block
          </GridActionsCellItem>,
        ];
      },
    },
  ];
  //confirmation for block user
  async function openBlockConfirmation(data: any) {
    setDltLoad(true);
    try {
      const res = await getApiData(
        `user/block-user-detail/${selectedItem.id}`,
        {},
        "Get"
      );
      if (res.success) {
        setOpenDltModal(false);

        setBlockItem(data);
      } else {
        toast.error(res.message);
      }
      setDltLoad(false);
    } catch (error) {
      // setOpenBlockDetail(false);
      toast.error("Something went wrong");
      setDltLoad(false);
    }
  }

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
      title={id ? "User Detail" : "Blocked Users"}
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
              <Typography color="text.primary">Blocked Users</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        sxStyle={{ "& .MuiDataGrid-row:hover": { cursor: "pointer" } }}
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={(item: any) => history.push(`/blocked-users/${item.id}`)}
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
        <UserDetails from="blockedUser" />
      </MailDetailViewWrapper>

      <AppConfirmDialog
        open={openDltModal}
        disabled={dltLoad}
        loading={dltLoad}
        onDeny={handleClose}
        onConfirm={() => unblockUser()}
        title="Are you sure you want to Unblock the user?"
        dialogTitle="Unblock User"
      />
      {/* </DialogSlide> */}
    </AppsContainer>
  );
};

export default BlockedUsers;
