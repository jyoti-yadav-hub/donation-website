/* eslint-disable no-restricted-globals */
import React from "react";
import { DataGridPro, GridColumns, GridRowsProp } from "@mui/x-data-grid-pro";
import { Box, Zoom } from "@mui/material";
import { styled } from "@mui/material/styles";
import Nodata from "components/Nodata";
import { AppLoader } from "@crema";
import { SxProps } from "@mui/system";

const BodyStyle = styled(Box)(({ theme }) => ({
  width: "100%",
  "& ::-webkit-scrollbar": { width: "7px", height: "7px" },
  "& ::-webkit-scrollbar-track": {
    // boxShadow: "inset 0 0 5px #ccc",
    borderRadius: "10px",
  },
  "& ::-webkit-scrollbar-thumb": {
    background: "rgba(0, 0, 0, 0.5)",
    borderRadius: "10px",
  },
  "& ::-webkit-scrollbar-thumb:hover": { background: "#b30000" },
  "& .tableDiv": {
    height: "calc(100vh - 210px)",
    width: "100%",
    backgroundColor: "#FFF",
    boxShadow: "rgba(0, 0, 0, 0.04) 0px 10px 10px 4px",
    borderRadius: 10,
    overflow: "hidden",
    "& .MuiDataGrid-root": {
      border: "none",
    },
    "& .MuiDataGrid-menuIcon": {
      width: "auto !important",
      visibility: "visible !important",
    },
    "& .MuiDataGrid-iconButtonContainer": {
      width: "auto !important",
      visibility: "visible !important",
    },

    "& .MuiDataGrid-row:hover": {
      color: `#0d91cf !important`,
      transform: "translateY(-2px)",
      boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 10px 0px",
      backgroundColor: "rgba(10, 143, 220, 0.1)",
      transition: "all 0.2s ease 0s",
    },
    "& .MuiDataGrid-virtualScrollerRenderZone, & .MuiDataGrid-virtualScrollerContent":
      { zIndex: 1000000, backgroundColor: "#fff" },
    "& .MuiDataGrid-pinnedColumnHeaders, & .MuiDataGrid-pinnedColumns": {
      zIndex: 1000001,
      backgroundColor: "#fff",
    },
    "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-overlay": {
      zIndex: 1000001,
      backgroundColor: "#fff",
    },
    "& .MuiDataGrid-cell:focus": { outline: 0 },
  },
}));

interface CTableProps {
  initialState?: any;
  NewBar?: any;
  onChange?: any;
  row: any;
  column: any;
  rowCount?: any;
  page?: any;
  listsLoad: any;
  onRowClick: any;
  checkboxSelection: boolean;
  onSelectionModelChange: any;
  groupData?: any;
  getApiCall?: any;
  sortModel?: any;
  setSortModel?: any;
  onSortModelChange?: any;
  onFilterModelChange?: any;
  sxStyle?: SxProps;
  tableStyle?: SxProps;
  isUserID?: boolean;
  from?: any;
  keyword?: any;
  keywordName?: any;
}

const CTable: React.FC<CTableProps> = ({
  NewBar,
  onChange,
  row,
  column,
  rowCount,
  page,
  listsLoad,
  initialState,
  onRowClick,
  checkboxSelection,
  onSelectionModelChange,
  groupData,
  getApiCall,
  sortModel,
  setSortModel,
  onSortModelChange,
  onFilterModelChange,
  sxStyle,
  tableStyle,
  isUserID,
  from,
  keyword,
  keywordName,
}) => {
  const rows: GridRowsProp = row;
  const columns: GridColumns = column;
  const isCategoryPath =
    location.pathname.includes("/category") ||
    location.pathname.includes("/sub-category");
     return (
    <Zoom in style={{ transitionDelay: "500ms" }}>
      <BodyStyle>
        <Box className="tableDiv" sx={{ ...tableStyle }}>
          <DataGridPro
            sx={{ ...sxStyle }}
            initialState={initialState}
            pagination={true}
                        rows={rows}
            onRowClick={(item) => onRowClick(item)}
            paginationMode="server"
            rowCount={rowCount}
            columns={columns}
            pageSize={20}
            page={page}
            getRowId={(row) =>
              from === "failed-rows"
                ? row?.row
                : isUserID
                ? row?.user_id
                : row._id
            }
            onPageChange={(event) => onChange(event)}
            loading={listsLoad}
            disableMultipleColumnsFiltering={true}
            sortingOrder={["asc", "desc"]}
            sortingMode={"server"}
            disableSelectionOnClick
            filterMode={"client"}
            sortModel={sortModel}
            onSortModelChange={(newSortModel) => {
              setSortModel(newSortModel);
              setTimeout(() => {
                if (keywordName === "race") {
                  getApiCall({
                    race: keyword ? keyword : null,
                    sort: newSortModel[0].field,
                    sort_type: newSortModel[0]?.sort === "asc" ? 1 : -1,
                  });
                } else if (keywordName === "religion") {
                  getApiCall({
                    religion: keyword ? keyword : null,
                    sort: newSortModel[0].field,
                    sort_type: newSortModel[0]?.sort === "asc" ? 1 : -1,
                  });
                } else {
                  getApiCall({
                    search: keyword ? keyword : null,
                    sort: newSortModel[0].field,
                    sort_type: newSortModel[0]?.sort === "asc" ? 1 : -1,
                  });
                }
              }, 500);
            }}
            onFilterModelChange={(item: any) => {
              if (item?.items[0]?.value) {
                getApiCall({
                  [item.items[0].columnField]: JSON.stringify(
                    item.items[0].value
                  ),
                  // sort: item.items[0].columnField,
                  // sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
                  operator: "contains",
                  page: 1,
                });
              } else {
                getApiCall({ page: 1 });
              }
            }}
            components={{
              NoRowsOverlay: () => (
                <Nodata
                  message={
                    groupData
                      ? "Please select group to get settings data"
                      : "No Data"
                  }
                />
              ),
              Toolbar: NewBar,
              LoadingOverlay: () => <AppLoader />,
            }}
            checkboxSelection={checkboxSelection}
            onSelectionModelChange={(newSelectionModel: any) => {
              onSelectionModelChange(newSelectionModel);
            }}
          />
          {isCategoryPath && (<style>
            {`
            @media screen and (min-height: 220px) and (max-height: 951px) {
              .MuiDataGrid-main {
                max-height: 40%;
              }
            },           
          `}
          </style>)}
        </Box>
      </BodyStyle>
    </Zoom>
  );
};

export default CTable;
