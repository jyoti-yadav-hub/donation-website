import React, { useEffect, useState } from "react";
import { Badge, Box, Chip } from "@mui/material";
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

interface JudgeParticipantReportProps {
  eventDetails: Object;
}
const JudgeParticipantReport: React.FC<JudgeParticipantReportProps> = ({
  eventDetails,
}) => {
  const [totalReports, setTotalReports] = useState<any>();
  const [formList, setFormList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const { id }: { id: string } = useParams();
  const [keywords, setKeywords] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    getFormList({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  };
  const handleClose = () => {
    setOpen(false);
  };
  //API For get report form list
  async function getFormList(nData) {
    setFormList((e) => ({ ...e, listsLoad: true }));
    try {
      const res: any = await getApiData(`judge/reported-users`, {
        ...nData,
        event_id: id,
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
      field: "user_name",
      headerName: "Reported By",
      hide: false,
      minWidth: 135,
      flex: 1,
      filterable: false,
    },
    {
      field: "user_id",
      headerName: "Judge Id",
      hide: false,
      minWidth: 135,
      flex: 1,
      filterable: false,
    },
    // {
    //   field: "judge_name",
    //   headerName: "Judge Name",
    //   hide: false,
    //   minWidth: 135,
    //   flex: 1,
    //   filterable: false,
    // },
    // {
    //   field: "participant_id",
    //   headerName: "Participant Id",
    //   hide: false,
    //   minWidth: 135,
    //   flex: 1,
    //   filterable: false,
    // },
    // {
    //   field: "participant_name",
    //   headerName: "Participant Name",
    //   hide: false,
    //   minWidth: 135,
    //   flex: 1,
    //   filterable: false,
    // },
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
  // useEffect(() => {
  //   getFormList({
  //     page: 1,
  //     sort: sortModel[0].field,
  //     sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
  //   });
  // }, [id]);

  return (
    <BodyStyle>
      <span onClick={handleOpen} style={{ marginRight: "30px" }}>
        <Badge badgeContent={totalReports} color="primary">
          <Chip label="Reports" color="secondary" />
        </Badge>
      </span>
      <DialogSlide
        open={open}
        onDeny={handleOpen}
        onClose={handleClose}
        dialogTitle={"Judge Report"}
        dialogContentStyle={{
          "& .MuiDialog-paper": { maxWidth: "calc(100vh + 300px)" },
        }}
      >
        <DialogWrapper>
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
            // getApiCall={getFormList}
            setSortModel={setSortModel}
          />
        </DialogWrapper>
      </DialogSlide>
    </BodyStyle>
  );
};

export default JudgeParticipantReport;
