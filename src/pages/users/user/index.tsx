/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import moment from "moment";
import {
  Typography,
  Box,
  Chip,
  Breadcrumbs,
  TextField,
  Stack,
  Button,
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
import { isArray, isEmpty, isUndefined } from "lodash";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import {
  Link,
  RouteComponentProps,
  useHistory,
  useParams,
} from "react-router-dom";
import { AppBlocking } from "@mui/icons-material";
import { BlockOutlined, DeleteOutline } from "@mui/icons-material";
import CTable from "components/CTable";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import UserDetails from "../user-details";
import clsx from "clsx";
import { Form, Formik } from "formik";
import * as yup from "yup";
import DialogSlide from "components/DialogSlide";
import { LoadingButton } from "@mui/lab";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";
import AppConfirmDialog from "@crema/core/AppConfirmDialog";
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

interface UserParamProps {
  id: string;
}

interface UserProps extends RouteComponentProps<UserParamProps> {
  props: any;
}

const User: React.FC<UserProps> = (props) => {
  const history = useHistory();
  const { id }: { id: string } = useParams();
  const [usersList, setUsersList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [openBlockdetail, setOpenBlockDetail] = React.useState<any>(false);
  const closeBlockdetail = () => {
    setOpenBlockDetail(false);
  };
  const [blockDetail, setblockDetail] = React.useState<any>({
    organizerAs: [],
    participantAs: [],
    judgeAs: [],
  });
  const [blockItem, setBlockItem] = React.useState<any>({});
  const [openDltModal, setOpenDltModal] = React.useState<any>(false);
  const [openUnblockModal, setOpenUnblockModal] = React.useState<any>(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const [keywords, setKeywords] = React.useState("");

  //API for get users lists
  async function onGetUsersLists(nData: any) {
    setUsersList((e) => ({ ...e, listsLoad: true }));
    try {
      nData.blocked = 0;
      const res = await getApiData("user/list", nData);
      if (res.success) {
        setUsersList({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        // history.push("/error-pages/maintenance");
        setUsersList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setUsersList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (!isEmpty(id)) {
      onGetUsersLists({
        page: 1,
        sort: sortModel[0].field,
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
      });
    }
  }, []);

  useEffect(() => {
    onGetUsersLists({
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
    onGetUsersLists(flt);
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
      field: "_id",
      headerName: "ID",
      hide: true,
      minWidth: 200,
      flex: 1,
      filterable: false,
    },
    {
      field: "user_name",
      headerName: "User Name",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
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
            {item?.value || "-"}
          </Typography>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 250,
      flex: 1,
      valueGetter: (params: any) => params?.value?.toLowerCase() || "-",
      filterOperators: strFilterOperators,
    },

    {
      field: "role",
      headerName: "Role",
      minWidth: 300,
      flex: 1,
      type: "singleSelect",
      renderCell: (item: any) => {
        return (
          <>
            {!isEmpty(item?.row) && !isUndefined(item?.row?.role)
              ? item?.row.role.map((it: any) => {
                  let role = it.toLowerCase();

                  if (isEmpty(it)) {
                    return;
                  }
                  return (
                    <Chip
                      style={{
                        marginRight: 5,
                        color: "#FFF",
                        backgroundColor:
                          role === "organizer"
                            ? "#2e7d32"
                            : role === "judge"
                            ? "#1976d2"
                            : role === "participant"
                            ? "#9c27b0"
                            : "#ed6c02",
                      }}
                      label={
                        role === "judge"
                          ? "Judge"
                          : role === "organizer"
                          ? "Organizer"
                          : role === "participant"
                          ? "Participant"
                          : "Audience"
                      }
                      size="small"
                    />
                  );
                })
              : null}
          </>
        );
      },
      filterOperators: strFilterOperators,
    },

    {
      field: "dob",
      headerName: "Date Of Birth",
      minWidth: 200,
      flex: 1,
      type: "string",
      valueGetter: (params: any) =>
        params?.value
          ? moment(new Date(params?.value)).format("DD/MM/YYYY")
          : "-",
      filterOperators: strFilterOperators,
    },
    {
      field: "createdAt",
      headerName: "Created at",
      minWidth: 200,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    // {
    //   field: "blocked",
    //   headerName: "Is User Blocked?",
    //   minWidth: 200,
    //   flex: 1,
    //   valueGetter: (params: any) => (params?.value ? true : false || ""),
    //   type: "boolean",
    //   renderCell: (item: any) => {
    //     return (
    //       <Chip
    //         label={item?.value ? "Yes" : "No"}
    //         variant="outlined"
    //         size="small"
    //         style={{
    //           color: "#FFF",
    //           backgroundColor: item?.value ? "#2e7d32" : "#d32f2f",
    //         }}
    //       />
    //     );
    //   },
    //   filterOperators: boolFilterOperators,
    // },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: (item: any) => {
        return [
          <GridActionsCellItem
            label="Block"
            icon={<BlockOutlined />}
            onClick={(event) => {
              setSelectedItem(item);
              setOpenDltModal(true);
            }}
            color="warning"
          >
            Block
          </GridActionsCellItem>,
        ];
      },
    },
  ];
  //confirmation for block user
  async function openBlockConfirmation(data: any) {
    setDltLoad(true);
    try {
      const res = await getApiData(
        `user/block-user-detail/${selectedItem.id}`,
        {},
        "Get"
      );
      if (res.success) {
        setOpenDltModal(false);
        setblockDetail(res.data);
        setOpenBlockDetail(true);
        setBlockItem(data);
      } else {
        toast.error(res.message);
      }
      setDltLoad(false);
    } catch (error) {
      setOpenBlockDetail(false);
      toast.error("Something went wrong");
      setDltLoad(false);
    }
  }
  //API for delete user
  async function deleteUser() {
    setDltLoad(true);
    try {
      let data = { ...blockItem, ...selectedItem, actions: "blocked" };
      const res = await getApiData(`user/block-unblock-account`, data, "POST");
      if (res.success) {
        setOpenBlockDetail(false);
        onGetUsersLists({
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
      toast.error("Something went wrong");
    }
  }
  const userDetail = (events, userType) => {
    return (
      <Box>
        <Typography variant="h6">
          {userType === "organizer"
            ? `- Organizer for ${events.length} events.`
            : userType === "judge"
            ? `- Judge for ${events.length} events.`
            : `- Participant for ${events.length} events.`}
        </Typography>
      </Box>
    );
  };
  //API for unblock user
  async function unblockUser(data: any) {
    setDltLoad(true);
    try {
      const id = selectedItem?.id;
      const res = await getApiData(`user/unblock-user/${id}`, data, "POST");
      if (res.success) {
        setOpenUnblockModal(false);
        onGetUsersLists({
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
      title={id ? "User Detail" : "Active Users"}
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        if (id) {
          return null;
        } else {
          return (
            <SearchComponent
              onApiCall={onGetUsersLists}
              setKeywords={setKeywords}
              keywords={keywords}
              sortModel={sortModel}
            />
          );
        }
      }}
    >
      <AppsHeader>
        <div style={{ display: "flex", alignItems: "center" }}>
          <BreadWrapper>
            <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "20px 0px" }}>
              <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                Dashboards
              </Link>
              <Typography color="text.primary">Active Users</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>
      <CTable
        sxStyle={{ "& .MuiDataGrid-row:hover": { cursor: "pointer" } }}
        initialState={{ pinnedColumns: { right: ["blocked", "actions"] } }}
        onRowClick={(item: any) => history.push(`/user/${item.id}`)}
        NewBar={null}
        onChange={(event) => onChange(event)}
        row={usersList?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={usersList?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={onGetUsersLists}
        setSortModel={setSortModel}
      />
      <MailDetailViewWrapper className={clsx({ show: id })}>
        <UserDetails
          onGetUsersLists={() =>
            onGetUsersLists({
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
        dialogTitle={"Block User"}
      >
        <ModalWrapper>
          <Box className="modalStyle">
            <Formik
              validateOnChange={true}
              initialValues={{ reason: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => openBlockConfirmation(values)}
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
                        autoFocus
                        inputProps={{ maxLength: 250 }}
                        helperText={`${values.reason.length} / 250`}
                        minRows={3}
                        maxRows={5}
                        multiline={true}
                        label="Please enter the reason for Block"
                        placeholder="Please enter the reason for Block"
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

      <AppConfirmDialog
        open={openBlockdetail}
        disabled={dltLoad}
        loading={dltLoad}
        onDeny={closeBlockdetail}
        onConfirm={() => deleteUser()}
        title="Are you sure you want to block this account?"
        subTitle={
          <>
            This user is currently associated with the following roles:
            {blockDetail.organizerAs && blockDetail.organizerAs != null
              ? userDetail(blockDetail.organizerAs, "organizer")
              : ""}
            {blockDetail.participantAs && blockDetail.participantAs != null
              ? userDetail(blockDetail.participantAs, "participants")
              : ""}
            {blockDetail.judgeAs && blockDetail.judgeAs != null
              ? userDetail(blockDetail.judgeAs, "judge")
              : ""}
            Blocking this account will restrict the user's access and actions.
          </>
        }
        dialogTitle="Block User Details"
      />
      <DialogSlide
        open={openUnblockModal}
        onDeny={handleClose}
        onClose={handleClose}
        dialogTitle={"Blocked User"}
      >
        <ModalWrapper>
          <Box className="modalStyle">
            <Formik
              validateOnChange={true}
              initialValues={{ reason: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => unblockUser(values)}
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
                    {/* <Box sx={{ mb: { xs: 3, xl: 4 } }}>
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
                    </Box> */}
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

export default User;
