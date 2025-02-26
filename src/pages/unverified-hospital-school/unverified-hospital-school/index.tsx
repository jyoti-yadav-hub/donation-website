/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Typography, Breadcrumbs, Button, alpha } from "@mui/material";
import {
  getGridDateOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
  GridColumns,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import { styled } from "@mui/material/styles";
import { isArray } from "lodash";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { AppConfirmDialog } from "@crema";
import moment from "moment";
import "react-phone-input-2/lib/style.css";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";
import SchoolHospitals from "components/SchoolHospitalLists";
import { Fonts } from "shared/constants/AppEnums";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings: readonly MainTextMatchedSubstrings[];
}

interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
}

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const UnverifiedHospitalsSchools = () => {
  const [type, setType] = useState<any>("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [hospitalList, setHospitalList] = React.useState<any>({
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
  const [list, setList] = useState<any>([]);
  const [keywords, setKeywords] = React.useState("");
  const [departmentList, setDepartmentList] = useState<any>([]);
  const [value, setValue] = React.useState<PlaceType | any>(null);
  const [addValid, setAddValid] = useState<any>(false);
  const [locationLatLng, setLocationLatLng] = React.useState<any>({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    if (value) {
      geocodeByAddress(value?.description || value)
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          setLocationLatLng({ ...locationLatLng, lat: lat, lng: lng });
          console.log("Successfully got latitude and longitude", { lat, lng });
        });
    }
  }, [value]);

  const handleClose = () => {
    setOpenModal(false);
    setType("");
    setSelectedItem({});
    setList([]);
    setDepartmentList([]);
    setOpen("");
    setAddValid(false);
    setLocationLatLng({ lat: 0, lng: 0 });
    setValue(null);
  };

  //API For get hospital/schools/colleges list
  async function getHospitalList(nData) {
    setHospitalList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("hospital-school-data/list", nData);
      if (res.success) {
        setHospitalList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setHospitalList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setHospitalList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  const strFilterOperators = getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value)
  );

  const singleSelectFilter = getGridSingleSelectOperators().filter(
    ({ value }) => ["is"].includes(value)
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
      field: "type",
      headerName: "Type",
      minWidth: 200,
      flex: 1,
      filterOperators: singleSelectFilter,
      type: "singleSelect",
      valueOptions: ["health", "education"],
      renderCell: (item: any) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {item?.row?.is_draft ? (
              <Typography
                variant="body1"
                sx={{
                  color: "#9E49E6",
                  backgroundColor: "#F5EDFC",
                  pl: 2,
                  pr: 2,
                  pt: 0.5,
                  pb: 0.5,
                  borderRadius: 1,
                  fontSize: 12,
                  mr: 2,
                }}
              >
                Draft
              </Typography>
            ) : null}
            <Typography sx={{ fontSize: 12 }}>
              {item?.value === "education" || item?.value === "School"
                ? "School/College"
                : "Hospital"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "saayam_supported_name",
      headerName: "School/College/Hospital Name",
      minWidth: 300,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "specify_name",
      headerName: "Departments",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "location",
      headerName: "Address",
      minWidth: 500,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params) => params?.row?.location?.city || "-",
      type: "string",
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 200,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      minWidth: 200,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) =>
        params?.value ? params?.value : "-",
    },
    {
      field: "updatedBy",
      headerName: "Updated By",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) =>
        params?.value ? params?.value : "-",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 160,
      cellClassName: "actions",
      renderCell: (item: any) => {
        return [
          <Button
            size="small"
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
              mr: 1,
            }}
            onClick={() => {
              setOpenModal(true);
              setType(item?.row?.type);
              setList(item.row.courses_or_diseases);
              setDepartmentList(item?.row?.departments || []);
              setSelectedItem(item);
              setLocationLatLng({
                lat: item?.row?.location?.coordinates
                  ? item?.row?.location?.coordinates[1]
                  : 0 || 0,
                lng: item?.row?.location?.coordinates
                  ? item?.row?.location?.coordinates[0]
                  : 0 || 0,
              });
              setValue(item?.row?.location?.city || null);
            }}
          >
            Accept
          </Button>,
          <Button
            size="small"
            sx={{
              backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1),
              color: "error.main",
              fontWeight: Fonts.LIGHT,
              "&:hover, &:focus": {
                backgroundColor: (theme) =>
                  alpha(theme.palette.error.main, 0.15),
                color: "error.main",
              },
              ml: 1,
            }}
            onClick={() => {
              setSelectedItem(item);
              setOpen("delete");
            }}
          >
            Reject
          </Button>,
        ];
      },
    },
  ];

  //API For delete hospital from list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(
        `hospital-school-data/delete/${id}`,
        "",
        "DELETE"
      );
      if (res.success) {
        setOpen("");
        getHospitalList({
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

  useEffect(() => {
    getHospitalList({
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
    getHospitalList(flt);
  }

  return (
    <AppsContainer
      title="Unverified Hospitals/Schools"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getHospitalList}
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
              <Typography color="text.primary">Hospitals</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        onChange={(event) => onChange(event)}
        row={hospitalList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={hospitalList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getHospitalList}
        setSortModel={setSortModel}
      />

      <SchoolHospitals
        openModal={openModal}
        handleClose={handleClose}
        selectedItem={selectedItem}
        getHospitalList={() => {
          getHospitalList({
            page: 1,
            sort: sortModel[0].field,
            sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
          });
        }}
        from={type}
        isDraft={selectedItem?.row?.is_draft}
        list={list}
        setList={setList}
        open={open}
        setOpen={setOpen}
        departmentList={departmentList}
        setDepartmentList={setDepartmentList}
        value={value}
        setValue={setValue}
        addValid={addValid}
        setAddValid={setAddValid}
        locationLatLng={locationLatLng}
        setLocationLatLng={setLocationLatLng}
      />

      <AppConfirmDialog
        open={open === "delete"}
        disabled={dltLoad}
        loading={dltLoad}
        onDeny={() => {
          setDltLoad(false);
          setSelectedItem({});
          setOpen("");
        }}
        onConfirm={() => deleteList(selectedItem?.id)}
        title={`Are you sure you want to delete this ${
          selectedItem?.row?.type === "education"
            ? "School/College"
            : "Hospital"
        }?`}
        dialogTitle={`${
          selectedItem?.row?.type === "education"
            ? "Reject School/College"
            : "Reject Hospital"
        }`}
      />
    </AppsContainer>
  );
};

export default UnverifiedHospitalsSchools;
