/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import {
  GridColumns,
  GridSortModel,
  getGridStringOperators,
} from "@mui/x-data-grid-pro";
import { isArray } from "lodash";
import { toast } from "react-toastify";
import getApiData from "../../shared/helpers/apiHelper";
import AppTooltip from "@crema/core/AppTooltip";
import CTable from "components/CTable";

interface FailedCSVProps {
  id?: any;
}

const FailedCSV: React.FC<FailedCSVProps> = ({ id }) => {
  const [csvLists, setCSVList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "row", sort: "asc" },
  ]);

  //API For get failed csvs rows lists
  async function getCSVLists(nData: any) {
    setCSVList((e) => ({ ...e, listsLoad: true }));
    try {
      //   nData._id = id;
      const res = await getApiData(`csv-upload/failed-rows/${id}`, nData);
      if (res.success) {
        setCSVList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setCSVList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setCSVList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getCSVLists({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  const strFilterOperators = getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value)
  );

  const columns: GridColumns = [
    {
      field: "_id",
      headerName: "ID",
      hide: true,
      filterable: false,
    },
    {
      field: "row",
      headerName: "Row No",
      width: 150,
      filterOperators: strFilterOperators,
    },
    {
      field: "message",
      headerName: "Reason",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <AppTooltip title={item?.value || ""} placement={"top-start"}>
            <Typography sx={{ fontSize: 12 }}>{item?.value || ""}</Typography>
          </AppTooltip>
        );
      },
    },
  ];

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    getCSVLists(flt);
  }

  return (
    <CTable
      tableStyle={{ height: "calc(60vh) !important" }}
      onRowClick={() => console.log("click")}
      onChange={(event) => onChange(event)}
      row={csvLists?.lists}
      column={columns}
      rowCount={pagination.total}
      page={pagination.page}
      listsLoad={csvLists?.listsLoad}
      checkboxSelection={false}
      onSelectionModelChange={() => console.log("row select")}
      sortModel={sortModel}
      getApiCall={getCSVLists}
      setSortModel={setSortModel}
      from="failed-rows"
    />
  );
};

export default FailedCSV;
