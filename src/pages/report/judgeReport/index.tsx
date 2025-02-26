import React, { useEffect, useState } from "react";
import { Badge, Box, Chip, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import AppsContainer from "@crema/core/AppsContainer";
import CTable from "components/CTable";
import { GridColumns, GridSortModel } from "@mui/x-data-grid-pro";
import SearchComponent from "components/SearchBar";
import { isArray } from "util";
import getApiData from "../../../shared/helpers/apiHelper";
import DialogSlide from "components/DialogSlide";
import { useParams } from "react-router-dom";

interface JudgeReportProps {
  eventDetails: Object;
  levelId: any;
}
const JudgeReport: React.FC<JudgeReportProps> = ({ eventDetails, levelId }) => {
  const [totalReports, setTotalReports] = useState<any>();
  const [formList, setFormList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const { id }: { id: string } = useParams();
  const [keywords, setKeywords] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  //API For get report form list$
  async function getFormList(nData) {
    setFormList((e) => ({ ...e, listsLoad: true }));
    try {
      const res: any = await getApiData(`reports/reported-judges/`, {
        ...nData,
        event_id: id,
        level_id: levelId,
      });

      if (res.success) {
        setTotalReports(res.total_count);
        setFormList({
          lists: isArray(res.data) ? res.data : [],
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
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const columns: GridColumns = [
    {
      field: "_id",
      headerName: "ID",
      hide: true,
      minWidth: 135,
      flex: 1,
      filterable: false,
    },
    {
      field: "judge_name",
      headerName: "Reported Judge",
      hide: false,
      minWidth: 135,
      flex: 1,
      filterable: false,
    },
    {
      field: "reported_by",
      headerName: "Reported By",
      hide: false,
      minWidth: 135,
      flex: 1,
      filterable: false,
    },

    {
      field: "description",
      headerName: "Description",
      hide: false,
      minWidth: 135,
      flex: 1,
      filterable: false,
    },
  ];
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  async function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    getFormList(flt);
  }
  const DialogWrapper = styled(Box)(({ theme }) => ({
    "& .datePicker": {
      "& input": { padding: "8px 14px !important" },
      // "& .MuiInputLabel-root": { top: "-8px" },
    },
    "& .MuiButtonBase-root": { fontSize: "12px !important" },
    width: 900,
    height: 650,
  }));

  const BodyStyle = styled(Box)(({ theme }) => ({
    margin: "0",
    padding: "0px 0px 0px 0px",
  }));

  return (
    <>
      <span
        onClick={() => {
          setOpen(true);
          getFormList({
            page: 1,
            sort: sortModel[0].field,
            sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
          });
        }}
        style={{ marginRight: "30px" }}
      >
        <Badge badgeContent={totalReports} color="primary">
          <Chip label="Reports" color="secondary" />
        </Badge>
      </span>
      {open && (
        <DialogSlide
          open={open}
          onDeny={handleClose}
          onClose={handleClose}
          dialogTitle={"Judge Report"}
          dialogContentStyle={{
            "& .MuiDialog-paper": {
              maxWidth: "calc(100vh + 300px)",
              width: "100%",
            },
          }}
        >
          <CTable
            initialState={{ pinnedColumns: { right: ["actions"] } }}
            onRowClick={() => console.log("click")}
            // onChange={(event) => onChange(event)}
            row={formList?.lists}
            column={columns}
            rowCount={pagination.total}
            page={pagination.page}
            listsLoad={formList?.listsLoad}
            checkboxSelection={false}
            onSelectionModelChange={() => console.log("row select")}
            sortModel={sortModel}
            getApiCall={() => {
              getFormList({
                page: 1,
                sort: sortModel[0].field,
                sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
              });
            }}
            setSortModel={setSortModel}
          />
        </DialogSlide>
      )}
    </>
  );
};

export default JudgeReport;
