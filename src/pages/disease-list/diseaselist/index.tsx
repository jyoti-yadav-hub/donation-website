/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Box, Button, Typography, Breadcrumbs } from "@mui/material";
import {
  GridActionsCellItem,
  GridColumns,
  GridSortModel,
  getGridDateOperators,
  getGridStringOperators,
} from "@mui/x-data-grid-pro";
import { styled } from "@mui/material/styles";
import IntlMessages from "@crema/utility/IntlMessages";
import { isArray } from "lodash";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { AppConfirmDialog } from "@crema";
import moment from "moment";
import CourseDisease from "components/CourseDiseaseLists";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const DiseaseLists = () => {
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [diseaseLists, setDiseaseLists] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const [keywords, setKeywords] = React.useState("");

  function NewBar() {
    return (
      <Box>
        <Button
          size="small"
          onClick={() => {
            setType("new");
            setOpenModal(true);
          }}
          variant="outlined"
          startIcon={<Add />}
          style={{ margin: "10px" }}
        >
          <IntlMessages id="scrumboard.addNew" />
        </Button>
      </Box>
    );
  }

  //API For get disease list
  async function getDiseaseLists(nData) {
    setDiseaseLists((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("course-disease/disease-list", nData);
      if (res.success) {
        setDiseaseLists({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setDiseaseLists({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setDiseaseLists({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getDiseaseLists({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  //API For delete disease from list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(`course-disease/delete/${id}`, "", "DELETE");
      if (res.success) {
        setOpen(false);
        getDiseaseLists({
          page: 1,
          sort: sortModel[0].field,
          sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
        });
        setSelectedItem({});
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setDltLoad(false);
    } catch (error) {
      setDltLoad(false);
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
      hide: true,
      filterable: false,
    },
    {
      field: "name",
      headerName: "Disease Name",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 100,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      minWidth: 100,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      minWidth: 100,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) =>
        params?.value ? params?.value : "-",
    },
    {
      field: "updatedBy",
      headerName: "Updated By",
      minWidth: 100,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) =>
        params?.value ? params?.value : "-",
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
            icon={<EditOutlined />}
            label="Edit"
            className="textPrimary"
            onClick={() => {
              setOpenModal(true);
              setType("edit");
              setSelectedItem(item);
            }}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteOutline />}
            label="Delete"
            onClick={(event) => {
              setSelectedItem(item);
              setOpen(true);
            }}
            color="inherit"
          />,
        ];
      },
    },
  ];

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    getDiseaseLists(flt);
  }

  const handleClose = () => {
    setOpenModal(false);
    setType("");
    setSelectedItem({});
  };

  return (
    <AppsContainer
      title="Disease"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getDiseaseLists}
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
              <Typography color="text.primary">Disease</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={NewBar}
        onChange={(event) => onChange(event)}
        row={diseaseLists?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={diseaseLists?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getDiseaseLists}
        setSortModel={setSortModel}
      />

      <CourseDisease
        from="disease"
        openModal={openModal}
        handleClose={handleClose}
        type={type}
        selectedItem={selectedItem}
        setOpenModal={setOpenModal}
        setType={setType}
        getLists={() =>
          getDiseaseLists({
            page: 1,
            sort: sortModel[0].field,
            sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
          })
        }
        setSelectedItem={setSelectedItem}
      />

      <AppConfirmDialog
        open={open}
        disabled={dltLoad}
        loading={dltLoad}
        onDeny={() => {
          setDltLoad(false);
          setSelectedItem({});
          setOpen(false);
        }}
        onConfirm={() => deleteList(selectedItem?.id)}
        title="Are you sure you want to delete this disease?"
        dialogTitle="Delete disease"
      />
    </AppsContainer>
  );
};

export default DiseaseLists;
