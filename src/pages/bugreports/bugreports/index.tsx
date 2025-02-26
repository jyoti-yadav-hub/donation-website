/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  styled,
  Typography,
  alpha,
} from "@mui/material";
import {
  GridColumns,
  GridSortModel,
  getGridDateOperators,
  getGridStringOperators,
} from "@mui/x-data-grid-pro";
import { isArray, isEmpty } from "lodash";
import moment from "moment";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";
import { Fonts } from "shared/constants/AppEnums";
import { AppConfirmDialog } from "@crema";
import MediaViewer from "@crema/core/AppMedialViewer";
import AppTooltip from "@crema/core/AppTooltip";

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const BugReportsList = () => {
  const [reportsLists, setReportLists] = useState<any>({
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
  const [open, setOpen] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [btnLoad, setBtnLoad] = React.useState<any>(false);
  const [keywords, setKeywords] = React.useState("");
  const [index, setIndex] = useState(-1);
  const [imgUrl, setImgUrl] = React.useState("");
  const onClose = () => {
    setIndex(-1);
    setImgUrl("");
  };

  //API for get bug reports lists
  async function getBugReports(nData) {
    setReportLists((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("user-bug-report/list", nData);
      if (res.success) {
        setReportLists({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setReportLists({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setReportLists({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getBugReports({
      page: 1,
      search: keywords ? keywords : null,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  //API For update bug report
  async function updateBugReport(item: any) {
    setBtnLoad(true);
    try {
      const id = item;
      const data = { status: open };
      const res = await getApiData(
        `user-bug-report/update-status/${id}`,
        data,
        "PUT"
      );
      if (res.success) {
        setOpen("");
        getBugReports({
          page: 1,
          search: keywords ? keywords : null,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
        setSelectedItem({});
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setBtnLoad(false);
    } catch (error) {
      setBtnLoad(false);
      console.log("delete error", error);
      toast.error("Something went wrong");
    }
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
      minWidth: 200,
      hide: true,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "image",
      headerName: "Image",
      width: 150,
      disableColumnMenu: true,
      filterable: false,
      renderCell: (item: any) => {
        return (
          <div
            onClick={() => {
              setImgUrl(item.value);
              setIndex(item.value ? 0 : -1);
            }}
          >
            <Avatar
              sx={{
                padding: 5,
                backgroundColor: "rgb(255, 255, 255)",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              <img
                src={item.value || "/assets/images/defaultimage.png"}
                alt={"title"}
                style={{
                  borderRadius: 5,
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  maxWidth: "fit-content",
                }}
              />
            </Avatar>
          </div>
        );
      },
    },
    {
      field: "screen_name",
      headerName: "Screen Name",
      minWidth: 200,
      flex: 1,
      type: "string",
      filterOperators: strFilterOperators,
    },
    {
      field: "user_name",
      headerName: "Reported By",
      minWidth: 200,
      flex: 1,
      type: "string",
      filterOperators: strFilterOperators,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 400,
      flex: 1,
      type: "string",
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <AppTooltip title={item.value} placement="top-start">
            <Typography sx={{ fontSize: 12 }}>{item?.value || ""}</Typography>
          </AppTooltip>
        );
      },
      // renderCell: (item: any) => {
      //   return (
      //     <TextField
      //       fullWidth
      //       multiline
      //       maxRows={3}
      //       minRows={1}
      //       variant="outlined"
      //       value={item.value}
      //       disabled
      //       sx={{
      //         "& .MuiOutlinedInput-root": {
      //           fontSize: "12px",
      //           border: "none !important",
      //         },
      //         "& .MuiOutlinedInput-input ": {
      //           WebkitTextFillColor: "black !important",
      //         },
      //         "& textarea": { WebkitTextFillColor: "black !important" },
      //       }}
      //     />
      //   );
      // },
    },
    {
      field: "user_id",
      headerName: "User ID",
      minWidth: 250,
      flex: 1,
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
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 200,
      cellClassName: "actions",
      renderCell: (item: any) => {
        return [
          item.row.status === "cancel" ? null : (
            <Button
              size="small"
              fullWidth
              sx={{
                backgroundColor: (theme) =>
                  alpha(theme.palette.success.main, 0.1),
                color: "success.main",
                fontWeight: Fonts.LIGHT,
                "&:hover, &:focus": {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.success.main, 0.15),
                  color: "success.main",
                },
                mr:
                  item.row.status === "resolve" || item.row.status === "cancel"
                    ? 0
                    : 1,
              }}
              onClick={() => {
                setSelectedItem(item);
                setOpen("resolve");
              }}
              disabled={btnLoad || item.row.status === "resolve"}
            >
              {item.row.status === "resolve" ? "Resolved" : "Resolve"}
            </Button>
          ),
          item.row.status === "resolve" ? null : (
            <Button
              fullWidth
              size="small"
              sx={{
                backgroundColor: (theme) =>
                  alpha(theme.palette.error.main, 0.1),
                color: "error.main",
                fontWeight: Fonts.LIGHT,
                "&:hover, &:focus": {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.error.main, 0.15),
                  color: "error.main",
                },
                ml:
                  item.row.status === "resolve" || item.row.status === "cancel"
                    ? 0
                    : 1,
              }}
              onClick={() => {
                setSelectedItem(item);
                setOpen("cancel");
              }}
              disabled={btnLoad || item.row.status === "cancel"}
            >
              {item.row.status === "cancel" ? "Cancelled" : "Cancel"}
            </Button>
          ),
        ];
      },
    },
  ];

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.page = newPage + 1;
    flt.search = keywords ? keywords : null;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    flt.operator = "contains";
    getBugReports(flt);
  }

  const handleClose = () => {
    setOpen("");
    setSelectedItem({});
  };

  return (
    <AppsContainer
      title={"Bug Reports"}
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getBugReports}
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
              <Typography color="text.primary">Bug Reports</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        NewBar={null}
        onRowClick={() => console.log("click bugs===")}
        onChange={(event) => onChange(event)}
        row={reportsLists?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={reportsLists?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        keyword={keywords}
        getApiCall={getBugReports}
        setSortModel={setSortModel}
      />

      <AppConfirmDialog
        open={!isEmpty(open)}
        disabled={btnLoad}
        loading={btnLoad}
        onDeny={handleClose}
        onConfirm={() => updateBugReport(selectedItem?.id)}
        title={
          open === "resolve"
            ? "Are you sure you want to update this bug as Resolve?"
            : `Are you sure you want to cancel this report?`
        }
        dialogTitle={
          open === "resolve" ? "Resolve Bug Report" : `Cancel Bug Report`
        }
      />

      <MediaViewer
        index={index}
        medias={[imgUrl].map((data) => {
          return {
            url: data,
            mime_type: "image/*",
          };
        })}
        onClose={onClose}
      />
    </AppsContainer>
  );
};

export default BugReportsList;
