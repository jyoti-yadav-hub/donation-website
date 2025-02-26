/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  GridColumns,
  GridSortModel,
  getGridDateOperators,
  getGridStringOperators,
} from "@mui/x-data-grid-pro";
import { isArray, isEmpty } from "lodash";
import { toast } from "react-toastify";
import getApiData from "../../shared/helpers/apiHelper";
import CTable from "components/CTable";
import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  Typography,
} from "@mui/material";
import MediaViewer from "@crema/core/AppMedialViewer";
import { useSelector } from "react-redux";
import { AppState } from "redux/store";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
const { flag } = require("country-emoji");

interface VolunteersListProps {
  id?: any;
}

const VolunteersList: React.FC<VolunteersListProps> = ({ id }) => {
  const { notiData } = useSelector<AppState, AppState["Notificationdata"]>(
    ({ Notificationdata }) => Notificationdata
  );
  const [volunteerList, setVolunteerList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "asc" },
  ]);
  const [isBlock, setIsBlock] = useState<any>(0);
  const [index, setIndex] = useState(-1);
  const [imgUrl, setImgUrl] = React.useState("");

  const onClose = () => {
    setIndex(-1);
    setImgUrl("");
  };

  //API For get volunteers lists
  async function getVolunteersList(nData: any) {
    if (nData.noLoad) {
      setVolunteerList((e) => ({ ...e, listsLoad: false }));
    } else {
      setVolunteerList((e) => ({ ...e, listsLoad: true }));
    }
    try {
      //   nData._id = id;
      const res = await getApiData(`drive/admin/volunteer-list/${id}`, nData);
      if (res.success) {
        setVolunteerList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setVolunteerList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setVolunteerList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getVolunteersList({
      page: 1,
      blocked: isBlock || null,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  useEffect(() => {
    if (!isEmpty(notiData)) {
      getVolunteersList({
        page: 1,
        blocked: isBlock || null,
        sort: sortModel[0].field,
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        noLoad: true,
      });
      // getFeedList();
    }
  }, [notiData]);

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
      filterable: false,
    },
    {
      field: "user_image",
      headerName: "Image",
      width: 150,
      filterable: false,
      disableColumnMenu: true,
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
      field: "user_name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "display_name",
      headerName: "Display Name",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "join_time",
      filterOperators: dateFilterOperators,
      headerName: "Joined At",
      minWidth: 200,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
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
            {item?.row?.phone_code || ""} {item?.value || ""}
          </Typography>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Chip
            style={{
              color: "#FFF",
              backgroundColor:
                item?.value === "organizer"
                  ? "#2e7d32"
                  : item?.value === "volunteer"
                  ? "#9c27b0"
                  : "#1976d2",
            }}
            label={
              !isEmpty(item?.value)
                ? item?.value?.charAt(0)?.toUpperCase() + item?.value?.slice(1)
                : "-" || "-"
            }
            variant="outlined"
            size="small"
          />
        );
      },
    },
  ];

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.page = newPage + 1;
    flt.blocked = isBlock || null;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    flt.operator = "contains";
    getVolunteersList(flt);
  }

  return (
    <>
      <CTable
        NewBar={() => {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontSize: { lg: "14px", xl: "15px" }, ml: "16px" }}
              >
                Volunteers
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{ color: "text.disabled" }}
                    checked={isBlock}
                    onChange={(event) => {
                      getVolunteersList({
                        page: 1,
                        blocked: event.target.checked ? 1 : null,
                        sort: sortModel[0]?.field,
                        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
                      });
                      setIsBlock(event.target.checked ? 1 : 0);
                    }}
                    color="primary"
                  />
                }
                label="Blocked"
              />
            </Box>
          );
        }}
        tableStyle={{ height: "calc(45vh) !important" }}
        onRowClick={() => console.log("click")}
        onChange={(event) => onChange(event)}
        row={volunteerList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={volunteerList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getVolunteersList}
        setSortModel={setSortModel}
        isUserID
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
    </>
  );
};

export default VolunteersList;
