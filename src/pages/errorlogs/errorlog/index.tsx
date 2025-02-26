/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import moment from "moment";
import {
  GridColumns,
  GridSortModel,
  getGridDateOperators,
  getGridStringOperators,
} from "@mui/x-data-grid-pro";
import { Box, IconButton, Typography, Breadcrumbs } from "@mui/material";
import { styled } from "@mui/material/styles";
import { isArray, isEmpty } from "lodash";
import { DeleteOutline } from "@mui/icons-material";
import { toast } from "react-toastify";
import AppTooltip from "@crema/core/AppTooltip";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { AppConfirmDialog } from "@crema";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const ErrorLog = () => {
  const [errorLogLists, setErrorLogLists] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [openDtl, setOpenDtl] = React.useState(false);
  const [deleteItemIds, setDeleteItemIds] = React.useState([]);
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const [keywords, setKeywords] = React.useState("");

  function DeleteBar() {
    return (
      <Box>
        <div>
          <AppTooltip
            title={
              isEmpty(deleteItemIds) ? "Select log first" : "Click to delete"
            }
          >
            <span>
              <IconButton
                aria-label="delete"
                onClick={(event) => setOpenDtl(true)}
                disabled={deleteItemIds.length > 0 ? false : true}
              >
                <DeleteOutline />
              </IconButton>
            </span>
          </AppTooltip>
        </div>
      </Box>
    );
  }

  //API for get error logs lists
  async function onGetErrorLogList(nData) {
    setErrorLogLists((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData(`errorlog/list`, nData);
      if (res.success) {
        setErrorLogLists({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setErrorLogLists({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setErrorLogLists({ lists: [], listsLoad: false });
      toast.error('"Something went wrong"');
    }
  }

  useEffect(() => {
    onGetErrorLogList({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    onGetErrorLogList(flt);
  }

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
      field: "error_name",
      headerName: "Error Name",
      width: 200,
      filterOperators: strFilterOperators,
    },
    {
      field: "error_message",
      headerName: "Error Message",
      minWidth: 400,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "api_log_id",
      headerName: "API Log ID",
      minWidth: 400,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "error_file",
      headerName: "Error File",
      minWidth: 400,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "createdAt",
      headerName: "Error At",
      width: 200,
      filterOperators: dateFilterOperators,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
    },
  ];

  //API for delete multiple error logs from list
  async function deleteMultipleItems(id) {
    setDltLoad(true);
    const data = { id };
    try {
      const res = await getApiData("errorlog/delete-multiple", data, "DELETE");
      if (res.success) {
        setOpenDtl(false);
        setDeleteItemIds([]);
        onGetErrorLogList({
          page: 1,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setDltLoad(false);
    } catch (error) {
      setDltLoad(false);
      console.log("multiple delete error", error);
      toast.error("Something went wrong");
    }
  }

  return (
    <AppsContainer
      title="Error Logs"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={onGetErrorLogList}
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
            <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "20px 0px" }}>
              <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                Dashboards
              </Link>
              <Typography color="text.primary">Error Logs</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={DeleteBar}
        onChange={(event) => onChange(event)}
        row={errorLogLists?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={errorLogLists?.listsLoad}
        checkboxSelection={true}
        onSelectionModelChange={(newSelectionModel: any) => {
          setDeleteItemIds(newSelectionModel);
        }}
        sortModel={sortModel}
        getApiCall={onGetErrorLogList}
        setSortModel={setSortModel}
      />

      <AppConfirmDialog
        open={openDtl}
        disabled={dltLoad}
        loading={dltLoad}
        onDeny={() => {
          setDltLoad(false);
          setOpenDtl(false);
          setDeleteItemIds([]);
        }}
        onConfirm={() => deleteMultipleItems(deleteItemIds)}
        title={`Are you sure you want to delete this ${
          deleteItemIds.length
        } errorlog${deleteItemIds.length > 1 ? "s" : ""}?`}
        dialogTitle="Delete Error"
      />
    </AppsContainer>
  );
};

export default ErrorLog;
