/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Breadcrumbs, styled, Typography } from "@mui/material";
import {
  getGridDateOperators,
  getGridNumericColumnOperators,
  getGridStringOperators,
  GridColumns,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import moment from "moment";
import { isArray } from "lodash";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link, useHistory, useParams } from "react-router-dom";
import CTable from "components/CTable";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";
import DonationDetails from "./donation-details";
import clsx from "clsx";

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

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const AdminDonationList = () => {
  const history = useHistory();
  const { id }: { id: string } = useParams();
  const [adminDonations, setAdminDonations] = useState<any>({
    lists: [],
    listsLoad: false,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "transaction_date", sort: "desc" },
  ]);
  const [keywords, setKeywords] = React.useState("");

  //API for get admin trnsactions lists
  async function getAdminDonations(nData) {
    setAdminDonations((e) => ({ ...e, listsLoad: true }));
    try {
      const res = await getApiData("donation/admin-transaction-list", nData);
      if (res.success) {
        setAdminDonations({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setAdminDonations({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setAdminDonations({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getAdminDonations({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  const strFilterOperators = getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value)
  );

  const dateFilterOperators = getGridDateOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const numberFiltOperator = getGridNumericColumnOperators().filter(
    ({ value }) => ["="].includes(value)
  );

  const columns: GridColumns = [
    {
      field: "transaction_date",
      headerName: "Transaction Date",
      minWidth: 220,
      flex: 1,
      valueGetter: (params) =>
        params?.row?.transaction_date
          ? moment(params?.row?.transaction_date).format(initialTimeFormat)
          : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "request_id",
      headerName: "Request ID",
      minWidth: 250,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "receipt_number",
      headerName: "Receipt Number",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => params?.row?.receipt_number || "-",
      filterOperators: strFilterOperators,
    },
    {
      field: "title_of_fundraiser",
      headerName: "Name Of Fundraiser",
      minWidth: 250,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "name_of_benificiary",
      headerName: "Beneficiary Name",
      minWidth: 200,
      flex: 1,
      valueGetter: (params: any) => params?.value || "-",
      type: "string",
      filterOperators: strFilterOperators,
    },
    {
      field: "transfer_amount",
      headerName: "Transfered Amount",
      minWidth: 220,
      flex: 1,
      valueGetter: (params) => Number(params?.row?.transfer_amount) || 0,
      type: "number",
      renderCell: (item) => {
        return (
          <Typography style={{ fontSize: "12px" }}>
            {`${item.row?.currency || ""}${item.value || 0}`}
          </Typography>
        );
      },
      filterOperators: numberFiltOperator,
    },
  ];

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    getAdminDonations(flt);
  }

  return (
    <AppsContainer
      title={id ? "Donations Detail" : "Admin Donations"}
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        if (id) {
          return null;
        } else {
          return (
            <SearchComponent
              onApiCall={getAdminDonations}
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
              <Typography color="text.primary">Admin Donation</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>

      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={(item: any) =>
          history.push(`/transactions/admin-donation-list/${item.id}`)
        }
        NewBar={null}
        onChange={(event) => onChange(event)}
        row={adminDonations?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={adminDonations?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getAdminDonations}
        setSortModel={setSortModel}
      />
      <MailDetailViewWrapper className={clsx({ show: id })}>
        <DonationDetails />
      </MailDetailViewWrapper>
    </AppsContainer>
  );
};

export default AdminDonationList;
