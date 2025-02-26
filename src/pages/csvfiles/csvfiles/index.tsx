/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { DeleteOutline, FileDownloadOutlined } from "@mui/icons-material";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as DLink,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
} from "@mui/material";
import {
  GridActionsCellItem,
  GridColumns,
  GridSortModel,
  getGridDateOperators,
  getGridStringOperators,
} from "@mui/x-data-grid-pro";
import { styled } from "@mui/material/styles";
import { isArray, isEmpty } from "lodash";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { AppConfirmDialog, AppLoader } from "@crema";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";
import { useDropzone } from "react-dropzone";
import { apiCallWithFile } from "shared/helpers/utility";
import UploadModern from "pages/thirdParty/reactDropzone/components/UploadModern";
import AppDialog from "@crema/core/AppDialog";
import FailedCSV from "components/FailedCSV";

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const CSVLists = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [csvLists, setCSVList] = React.useState<any>({
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
  const [btnDisable, setBtnDisable] = React.useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<any>([]);
  const [selectType, setSelectType] = React.useState("school");
  const [failedRowModal, setFailedRowModal] = React.useState<boolean>(false);
  const [failedRowID, setFailedRowID] = useState<any>("");

  //API For Upload image
  async function handleImageUpload(data: any) {
    setBtnDisable(true);
    const formData = new FormData();
    formData.append("type", selectType);
    formData.append("file", data);
    try {
      const resp = await apiCallWithFile(`csv-upload/upload`, formData, "post");
      if (resp.status) {
        toast.success(resp.message);
        setBtnDisable(false);
        getCSVLists({ page: 1, search: keywords ? keywords : null });
      } else {
        setUploadedFiles([]);
        setBtnDisable(false);
        toast.error(resp.message);
      }
    } catch (error) {
      setBtnDisable(false);
      console.log("error====", error);
      toast.error("Something went wrong");
    }
  }

  const dropzone = useDropzone({
    accept: "text/csv",
    multiple: false,
    onDrop: (acceptedFiles: any) => {
      setUploadedFiles(
        // eslint-disable-next-line array-callback-return
        acceptedFiles.map((file: any) => {
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        })
      );
      handleImageUpload(acceptedFiles[0]);
    },
  });

  useEffect(() => {
    setUploadedFiles(dropzone.acceptedFiles);
  }, [dropzone.acceptedFiles]);

  //API For get csv list
  async function getCSVLists(nData: any) {
    setCSVList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("csv-upload/list", nData);
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
      search: keywords ? keywords : null,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  //API For delete CSV from list
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(`csv-upload/delete/${id}`, "", "DELETE");
      if (res.success) {
        setOpen(false);
        getCSVLists({
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
      field: "csv_file_url",
      headerName: "File",
      width: 150,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (item: any) => {
        return (
          // <Button variant="text" size="small">
          <DLink
            href={item.value || "#"}
            variant="body2"
            download
            target="_blank"
          >
            Download
          </DLink>
          // </Button>
        );
      },
    },
    {
      field: "file_name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Chip
            style={{
              color: "#FFF",
              backgroundColor:
                item?.value === "Success"
                  ? "#2e7d32" //success
                  : item?.value === "Pending"
                  ? "#9c27b0" //secondary
                  : "#ebebeb", //default
            }}
            label={item?.value || "-"}
            size="small"
          />
        );
      },
    },
    {
      field: "failed_rows",
      headerName: "Failed Rows",
      minWidth: 200,
      flex: 1,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (item: any) => {
        return (
          <Button
            size="small"
            variant="text"
            color={item?.value > 0 ? "error" : "success"}
            onClick={() => {
              if (item?.value > 0) {
                setFailedRowModal(true);
                setFailedRowID(item?.id);
              }
            }}
          >
            {item?.value || 0}
          </Button>
        );
      },
    },
    {
      field: "type",
      headerName: "Type",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Typography sx={{ fontSize: 12 }}>
            {item?.value?.charAt(0).toUpperCase() + item?.value?.slice(1) ||
              "-"}
          </Typography>
        );
      },
    },
    {
      field: "uploadedBy",
      headerName: "Uploaded By",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 150,
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
      width: 100,
      cellClassName: "actions",
      getActions: (item: any) => {
        return [
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
    flt.page = newPage + 1;
    flt.search = keywords ? keywords : null;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    flt.operator = "contains";
    getCSVLists(flt);
  }

  return (
    <AppsContainer
      title="CSV Files"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getCSVLists}
            setKeywords={setKeywords}
            keywords={keywords}
            sortModel={sortModel}
          />
        );
      }}
    >
      <AppsHeader>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <BreadWrapper>
            <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "20px 0px" }}>
              <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                Dashboards
              </Link>
              <Typography color="text.primary">CSV Files</Typography>
            </Breadcrumbs>
          </BreadWrapper>
          <Grid
            item
            xs={8}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Grid item xs={3} sx={{ mr: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-select-small">Select Type</InputLabel>
                <Select
                  label="Select Type"
                  labelId="demo-select-small"
                  id="demo-select-small"
                  MenuProps={{ style: { zIndex: 1000002 } }}
                  size="small"
                  fullWidth
                  name="type"
                  value={selectType}
                  onChange={(event: any) => setSelectType(event.target.value)}
                  placeholder="Select Type"
                >
                  {[
                    { id: "school", name: "School/College" },
                    { id: "hospital", name: "Hospital" },
                  ].map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                {selectType && isEmpty(selectType) && (
                  <ErrorTextStyle>{selectType}</ErrorTextStyle>
                )}
              </FormControl>
            </Grid>
            {isEmpty(uploadedFiles) ? (
              <UploadModern
                uploadText="Click to upload CSV"
                dropzone={dropzone}
                iconHide={true}
              />
            ) : (
              <Box sx={{ position: "relative" }}>
                {btnDisable ? <AppLoader /> : null}
                <UploadModern
                  uploadText="Click to upload CSV"
                  dropzone={dropzone}
                  iconHide={true}
                />
              </Box>
            )}
            <Button
              variant="outlined"
              size="small"
              sx={{ ml: 2 }}
              startIcon={<FileDownloadOutlined />}
              onClick={() => {
                if (selectType === "school") {
                  window.open(
                    `https://saayam.s3.ap-south-1.amazonaws.com/saayamfiles/csv-format/school.csv`,
                    "_blank"
                  );
                } else {
                  window.open(
                    `https://saayam.s3.ap-south-1.amazonaws.com/saayamfiles/csv-format/hospital.csv`,
                    "_blank"
                  );
                }
              }}
            >
              {`Sample CSV (${
                selectType === "school" ? "School/College" : "Hospital"
              })`}
            </Button>
          </Grid>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
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
        keyword={keywords}
        setSortModel={setSortModel}
      />

      <AppDialog
        open={failedRowModal}
        maxWidth={"lg"}
        onClose={() => {
          setFailedRowID("");
          setFailedRowModal(false);
        }}
      >
        <FailedCSV id={failedRowID} />
      </AppDialog>

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
        title="Are you sure you want to delete this CSV?"
        dialogTitle="Delete CSV"
      />
    </AppsContainer>
  );
};

export default CSVLists;
