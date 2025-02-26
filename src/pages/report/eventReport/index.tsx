import React, { useEffect, useState } from "react";
import { Avatar, Badge, Box, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import CTable from "components/CTable";
import {
  DataGridPro,
  getGridStringOperators,
  GridColumns,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import { isArray } from "util";
import getApiData from "../../../shared/helpers/apiHelper";
import DialogSlide from "components/DialogSlide";
import { useParams } from "react-router-dom";
import AppsContainer from "@crema/core/AppsContainer";
import SearchComponent from "components/SearchBar";
import AppDialog from "@crema/core/AppDialog";
interface EventReportProps {
  eventDetails: Object;
  reports: any;
}
const EventReport: React.FC<EventReportProps> = ({ eventDetails, reports }) => {
  const [totalReports, setTotalReports] = useState<any>();
  const [formList, setFormList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const { id }: { id: string } = useParams();
  const [open, setOpen] = React.useState(false);
  const [tempList, setTempList] = React.useState({ event: "", data: [] });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const strFilterOperators = getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value)
  );
  const DialogWrapper = styled(Box)(({ theme }) => ({
    "& .datePicker": {
      "& input": { padding: "8px 14px !important" },
    },
    "& .MuiButtonBase-root": { fontSize: "12px !important" },
    width: 900,
    height: 650,
  }));
  const BodyStyle = styled(Box)(({ theme }) => ({
    marginTop: 0,
    "& .tableDiv": {
      backgroundColor: "rgb(255, 255, 255)",
      width: "100%",
      padding: 10,
      borderRadius: 10,
      marginBottom: "20px",
      "& .MuiDataGrid-main": { minHeight: "calc(35vh)", height: "100%" },
      "& .MuiDataGrid-row:hover": {
        color: `#0d91cf !important`,
        transform: "translateY(-2px)",
        backgroundColor: "rgba(10, 143, 220, 0.1)",
        transition: "all 0.2s ease 0s",
        cursor: "pointer",
      },
      "& .MuiDataGrid-virtualScrollerRenderZone, & .MuiDataGrid-virtualScrollerContent":
        { zIndex: 100001, backgroundColor: "#fff" },
      "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-overlay": {
        zIndex: 100002,
        backgroundColor: "#fff",
      },
      "& .MuiDataGrid-cell:focus": { outline: 0 },
    },
  }));
  const handleOpen = () => {
    setOpen(true);
    if (tempList.event === id) {
      return;
    }
    getFormList({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [keywords, setKeywords] = React.useState("");
  //API For get report form list
  async function getFormList(nData) {
    setFormList((e) => ({ ...e, listsLoad: true }));
    try {
      const res: any = await getApiData(`reports/report-event-list`, {
        ...nData,
        event_id: id,
      });
      if (res.success) {
        let temp = isArray(res.data)
          ? res.data.map((x, i) => {
              return { ...x, description: x.reportDesc, id: i, _id: i }; // Assign unique key using index
            })
          : [];

        setTempList({ event: id, data: temp });
        setTotalReports(res.total_count);
        setFormList({
          lists: temp,
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setFormList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setFormList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  const columns: GridColumns = [
    {
      field: "_id",
      headerName: "ID",
      width: 50,
      minWidth: 50,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    // {
    //   field: "image",
    //   headerName: "Image",
    //   width: 120,
    //   filterable: false,
    //   disableColumnMenu: true,
    //   renderCell: (item: any) => {
    //     return (
    //       <div>
    //         <Avatar
    //           sx={{
    //             padding: 5,
    //             backgroundColor: "rgb(255, 255, 255)",
    //             border: "1px solid #ccc",
    //             cursor: "pointer",
    //           }}
    //         >
    //           <img
    //             src={item.value || "/assets/images/defaultimage.png"}
    //             alt={"title"}
    //             style={{
    //               borderRadius: 5,
    //               width: "40px",
    //               height: "40px",
    //               objectFit: "cover",
    //               maxWidth: "fit-content",
    //             }}
    //           />
    //         </Avatar>
    //       </div>
    //     );
    //   },
    // },
    {
      field: "userName",
      headerName: "User Name",
      minWidth: 80,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) => (params?.value ? params?.value : "-"),
    },
    {
      field: "reportDesc",
      headerName: "Report",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) => (params?.value ? params?.value : "-"),
    },
  ];

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    flt.operator = "contains";
    getFormList(flt);
  }

  function searchData() {
    console.log("calllesdd");
  }

  useEffect(() => {
    getFormList({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  return (
    <BodyStyle>
      <span onClick={handleOpen} style={{ marginRight: "30px" }}>
        <Badge badgeContent={reports ? reports?.length : " "} color="primary">
          <Chip label="Reports" color="secondary" />
        </Badge>
      </span>
      <AppDialog open={open} maxWidth={"lg"} onClose={handleClose}>
        <BodyStyle>
          <div className="tableDiv">
            <DataGridPro
              pagination={true}
              rows={formList?.lists}
              paginationMode="server"
              rowCount={pagination.total}
              columns={columns}
              pageSize={20}
              page={pagination.page}
              getRowId={(row) => row._id || row}
              disableSelectionOnClick
              checkboxSelection={false}
            />
          </div>
        </BodyStyle>
      </AppDialog>
    </BodyStyle>
  );
};

export default EventReport;
