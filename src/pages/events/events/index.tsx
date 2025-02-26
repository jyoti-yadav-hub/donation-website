/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Typography,
  Box,
  Chip,
  Breadcrumbs,
  TextField,
  Stack,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  getGridBooleanOperators,
  getGridDateOperators,
  getGridStringOperators,
  GridActionsCellItem,
  GridColumns,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import { isArray, isEmpty } from "lodash";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import {
  Link,
  RouteComponentProps,
  useHistory,
  useParams,
} from "react-router-dom";
import { DeleteOutline } from "@mui/icons-material";
import CTable from "components/CTable";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import EventDetails from "../event-details";
import clsx from "clsx";
import { Form, Formik } from "formik";
import * as yup from "yup";
import DialogSlide from "components/DialogSlide";
import { LoadingButton } from "@mui/lab";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";
const { flag } = require("country-emoji");

const validationSchema = yup.object({
  reason: yup.string().required("Reason is required"),
});

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

const ModalWrapper = styled(Box)(({ theme }) => ({
  "& .modalStyle": { width: 500 },
  "& .modalBtnDiv": {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
}));

const MailDetailViewWrapper = styled(Box)(({ theme }) => {
  return {
    transition: "all 0.5s ease",
    transform: "translateX(100%)",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
    opacity: 0,
    visibility: "hidden",
    backgroundColor: theme.palette.background.paper,
    "&.show": {
      transform: "translateX(0)",
      opacity: 1,
      visibility: "visible",
      zIndex: 1000002,
    },
  };
});

interface EventParamProps {
  id: string;
}

interface EventProps extends RouteComponentProps<EventParamProps> {
  props: any;
}

const Events: React.FC<EventProps> = (props) => {
  const history = useHistory();
  const { id }: { id: string } = useParams();
  const [eventList, setEventList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [openDltModal, setOpenDltModal] = React.useState<any>(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const [keywords, setKeywords] = React.useState("");
  const [imgUrl, setImgUrl] = React.useState("");
  const [index, setIndex] = useState(-1);
  const [statusList, setStatusList] = React.useState<any>([
    { name: "All", type: "secondary" },
    { name: "Scheduled", type: "primary" },
    { name: "Live", type: "success" },
    { name: "Past", type: "warning" },
    // { name: "Draft", type: "warning" },
  ]);
  //API for get event lists
  async function getEvents(nData) {
    setEventList((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData(`event/list-events`, nData);
      if (res.success) {
        setEventList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setEventList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setEventList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (!isEmpty(id)) {
      getEvents({
        page: 1,
        sort: sortModel[0].field,
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
      });
    }
  }, []);

  useEffect(() => {
    getEvents({
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
    getEvents(flt);
  }

  const strFilterOperators = getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value)
  );

  const boolFilterOperators = getGridBooleanOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const dateFilterOperators = getGridDateOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const columns: GridColumns = [
    {
      field: "reference_id",
      headerName: "Event ID",
      hide: false,
      minWidth: 120,
      flex: 1,
      // filterable: false,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) => (params?.value ? params?.value : "-"),
    },
    {
      field: "_id",
      headerName: "Reference ID",
      hide: false,
      minWidth: 200,
      flex: 1,
      filterable: false,
    },
    {
      field: "user_name",
      headerName: "User Name",
      minWidth: 130,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) => (params?.value ? params?.value : "-"),
    },
    {
      field: "what_s_your_event",
      headerName: "Event title",
      minWidth: 160,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) => (params?.value ? params?.value : "-"),
    },
    {
      field: "event_starts",
      headerName: "Start Date",
      minWidth: 155,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) =>
        params?.value
          ? moment(new Date(params?.value)).format("DD/MMM/YYYY hh:mm A")
          : "-",
    },
    {
      field: "event_ends",
      headerName: "End Event",
      minWidth: 155,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) =>
        params?.value
          ? moment(new Date(params?.value)).format("DD/MMM/YYYY hh:mm A")
          : "-",
    },
    {
      field: "timezoneName",
      headerName: "Timezone",
      minWidth: 155,
      flex: 1,
      filterOperators: strFilterOperators,
      valueGetter: (params: any) => (params?.value ? params?.value : "-"),
    },
    {
      field: "category_name",
      headerName: "Event Type",
      minWidth: 150,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    // {
    //   field: "photo",
    //   headerName: "Image",
    //   width: 150,
    //   filterable: false,
    //   disableColumnMenu: true,
    //   renderCell: (item: any) => {
    //     return (
    //       <div
    //         onClick={() => {
    //           setImgUrl(item.value);
    //           setIndex(item.value ? 0 : -1);
    //         }}
    //       >
    //         <Avatar
    //           sx={{
    //             padding: 5,
    //             backgroundColor: "rgb(255, 255, 255)",
    //             border: "1px solid #ccc",
    //             cursor: "pointer",
    //           }}
    //         >
    //           <img
    //             src={
    //               item.value.length
    //                 ? item.value
    //                 : "/assets/images/defaultimage.png"
    //             }
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
      field: "status",
      headerName: "Status",
      minWidth: 110,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Chip
            style={{
              color: "#FFF",
              backgroundColor:
                item.value === "live"
                  ? "#11C15B" //success
                  : item.value === "scheduled"
                  ? "#2C9CE9" //success
                  : item.value === "past"
                  ? "#FF5252" //error
                  : "#ebebeb", //default
            }}
            label={
              item?.value?.charAt(0).toUpperCase() + item?.value?.slice(1) || ""
            }
            variant="outlined"
            size="small"
          />
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 150,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    // {
    //   field: "category_name",
    //   headerName: "Category",
    //   minWidth: 150,
    //   flex: 1,
    //   filterOperators: strFilterOperators,
    // },
    // {
    //   field: "updatedAt",
    //   headerName: "Updated At",
    //   minWidth: 150,
    //   flex: 1,
    //   valueGetter: (params: any) =>
    //     params?.value ? moment(params?.value).format(initialTimeFormat) : "",
    //   type: "date",
    //   filterOperators: dateFilterOperators,
    // },
    // {
    //   field: "updatedBy",
    //   headerName: "Updated By",
    //   minWidth: 150,
    //   flex: 1,
    //   filterOperators: strFilterOperators,
    //   valueGetter: (params: any) => (params?.value ? params?.value : "-"),
    // },
    // {
    //   field: "actions",
    //   type: "actions",
    //   headerName: "Actions",
    //   width: 100,
    //   cellClassName: "actions",
    //   getActions: (item: any) => {
    //     return [
    //       <GridActionsCellItem
    //         icon={<EditOutlined />}
    //         label="Edit"
    //         className="textPrimary"
    //         onClick={() => {
    //           setOpenModal(true);
    //           setType("edit");
    //           setSelectedItem(item);
    //         }}
    //         color="inherit"
    //       />,
    //       <GridActionsCellItem
    //         icon={<DeleteOutline />}
    //         label="Delete"
    //         onClick={(event) => {
    //           setSelectedItem(item);
    //           setOpen(true);
    //         }}
    //         color="inherit"
    //       />,
    //     ];
    //   },
    // },
  ];

  async function handleStatusFilter(value) {
    const flt = { ...pagination.page };
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = 0 + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    if (value.name.toLowerCase() === "all") {
      getEvents(flt);
    } else {
      getEvents({ ...flt, status: value.name.toString().toLowerCase() });
    }
  }
  //API for delete user
  async function deleteUser(data: any) {
    setDltLoad(true);
    try {
      const id = selectedItem?.id;
      const res = await getApiData(`user/delete-user/${id}`, data, "DELETE");
      if (res.success) {
        setOpenDltModal(false);
        getEvents({
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

  const handleClose = () => {
    setOpenDltModal(false);
    setDltLoad(false);
    setSelectedItem({});
  };

  return (
    <AppsContainer
      title={id ? "Event Detail" : "Events"}
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        if (id) {
          return null;
        } else {
          return (
            <SearchComponent
              onApiCall={getEvents}
              setKeywords={setKeywords}
              keywords={keywords}
              sortModel={sortModel}
            />
          );
        }
      }}
    >
      <AppsHeader sxStyle={{ overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            float: "left",
            width: "80%",
          }}
        >
          <BreadWrapper>
            <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "20px 0px" }}>
              <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                Dashboards
              </Link>
              <Typography color="text.primary">Events</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
        <div style={{ float: "right", width: "20%" }}>
          {statusList.map((value, ind) => (
            <Chip
              key={ind}
              label={value.name}
              color={value.type}
              onClick={() => {
                handleStatusFilter(value);
              }}
              style={{ marginRight: "5px" }}
            />
          ))}
        </div>
      </AppsHeader>
      <CTable
        sxStyle={{ "& .MuiDataGrid-row:hover": { cursor: "pointer" } }}
        initialState={{ pinnedColumns: { right: ["blocked", "actions"] } }}
        onRowClick={(item: any) => history.push(`/events/${item.id}`)}
        NewBar={null}
        onChange={(event) => onChange(event)}
        row={eventList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={eventList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getEvents}
        setSortModel={setSortModel}
      />
      <MailDetailViewWrapper className={clsx({ show: id })}>
        <EventDetails
          getEvents={() =>
            getEvents({
              page: 1,
              sort: sortModel[0].field,
              sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
            })
          }
        />
      </MailDetailViewWrapper>

      <DialogSlide
        open={openDltModal}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle={"Deactivate User"}
      >
        <ModalWrapper>
          <Box className="modalStyle">
            <Formik
              validateOnChange={true}
              initialValues={{ reason: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => deleteUser(values)}
            >
              {(props) => {
                const {
                  values,
                  touched,
                  errors,
                  handleChange,
                  handleSubmit,
                  handleBlur,
                } = props;
                return (
                  <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                      <TextField
                        name="reason"
                        value={values.reason}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        variant="outlined"
                        fullWidth
                        inputProps={{ maxLength: 250 }}
                        helperText={`${values.reason.length} / 250`}
                        minRows={3}
                        maxRows={5}
                        multiline={true}
                        label="Please enter the reason for Deactivate"
                        placeholder="Please enter the reason for Deactivate"
                      />
                      {errors.reason && touched.reason && (
                        <ErrorTextStyle>{errors.reason}</ErrorTextStyle>
                      )}
                    </Box>
                    <div className="modalBtnDiv">
                      <LoadingButton
                        size="small"
                        type="submit"
                        variant="outlined"
                        color="primary"
                        loading={dltLoad}
                        disabled={dltLoad}
                      >
                        Submit
                      </LoadingButton>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </ModalWrapper>
      </DialogSlide>
    </AppsContainer>
  );
};

export default Events;
