/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Breadcrumbs, Chip, styled, Typography } from "@mui/material";
import { AppAnimate } from "@crema";
import {
  getGridBooleanOperators,
  getGridDateOperators,
  getGridNumericColumnOperators,
  getGridStringOperators,
  GridColumns,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import moment from "moment";
import { Link, useHistory, useParams } from "react-router-dom";
import { isArray } from "lodash";
import { toast } from "react-toastify";
import getApiData from "shared/helpers/apiHelper";
import CTable from "components/CTable";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import NGODetails from "../ngodetails";
import { initialTimeFormat } from "shared/constants/AppConst";
import SearchComponent from "components/SearchBar";

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const NGODonationList = () => {
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const [ngoDonations, setNGODonations] = useState<any>({
    lists: [],
    listsLoad: false,
  });
  const [pagination, setPagination] = React.useState<any>({
    page: 0,
    total: 0,
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "_id", sort: "desc" },
  ]);
  const [keywords, setKeywords] = React.useState("");

  //API for get NGO donations lists
  async function getNGODonationList(nData: any) {
    setNGODonations((e) => ({ ...e, listsLoad: true }));
    try {
      nData.transaction_type = "ngo-donation";
      const res = await getApiData(`request/admin/transaction-list`, nData);
      if (res.success) {
        setNGODonations({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setNGODonations({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setNGODonations({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getNGODonationList({
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

  const boolFilterOperators = getGridBooleanOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const numberFiltOperator = getGridNumericColumnOperators().filter(
    ({ value }) => ["="].includes(value)
  );

  const columns: GridColumns = [
    {
      field: "createdAt",
      headerName: "Transaction Date",
      minWidth: 250,
      flex: 1,
      valueGetter: (params: any) =>
        params?.value ? moment(params?.value).format(initialTimeFormat) : "",
      type: "date",
      filterOperators: dateFilterOperators,
    },
    {
      field: "_id",
      headerName: "Transaction Id",
      minWidth: 250,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "receipt_number",
      headerName: "Receipt Number",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "user_name",
      headerName: "NGO Name",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "donor_name",
      headerName: "Donor Name",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "amount",
      headerName: "Gross Amount",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => Number(params?.row?.amount) || 0,
      type: "number",
      renderCell: (item) => {
        return (
          <Typography style={{ fontSize: "12px" }}>
            {`${item.row?.currency || ""}${item.value || ""}`}
          </Typography>
        );
      },
      filterOperators: numberFiltOperator,
    },
    {
      field: "tip_amount",
      headerName: "Transaction Charge",
      minWidth: 200,
      flex: 1,
      type: "number",
      renderCell: (item) => {
        return (
          <Typography style={{ fontSize: "12px" }}>
            {`${item.row?.currency || ""}${item.value || ""}`}
          </Typography>
        );
      },
      filterOperators: numberFiltOperator,
    },
    {
      field: "tip_charge",
      headerName: "Service Charge",
      minWidth: 200,
      flex: 1,
      type: "number",
      filterOperators: numberFiltOperator,
    },
    {
      field: "total_amount",
      headerName: "Net Amount",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => Number(params?.row?.total_amount) || 0,
      type: "number",
      renderCell: (item) => {
        return (
          <Typography style={{ fontSize: "12px" }}>
            {`${item.row?.currency || ""}${item.value || ""}`}
          </Typography>
        );
      },
      filterOperators: numberFiltOperator,
    },
    {
      field: "is_contribute_anonymously",
      headerName: "Is contribute anonymously?",
      minWidth: 300,
      flex: 1,
      valueGetter: (params) => params?.row?.is_contribute_anonymously || false,
      type: "boolean",
      renderCell: (item: any) => {
        return (
          <Chip
            className="chip_class"
            style={{
              color: "#FFF",
              backgroundColor:
                item.value === true
                  ? "#2e7d32" //success
                  : "#d32f2f", //error
            }}
            label={item.value === true ? "Yes" : "No" || "-"}
            size="small"
          />
        );
      },
      filterOperators: boolFilterOperators,
    },
    {
      field: "is_tax_benefit",
      headerName: "Is tax benefit?",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => params?.row?.is_tax_benefit || false,
      type: "boolean",
      renderCell: (item: any) => {
        return (
          <Chip
            className="chip_class"
            style={{
              color: "#FFF",
              backgroundColor:
                item.value === true
                  ? "#2e7d32" //success
                  : "#d32f2f", //error
            }}
            label={item.value === true ? "Yes" : "No" || "-"}
            size="small"
          />
        );
      },
      filterOperators: boolFilterOperators,
    },
    {
      field: "tax_number",
      headerName: "Tax Number",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      minWidth: 220,
      flex: 1,
      filterOperators: strFilterOperators,
      renderCell: (item: any) => {
        return (
          <Typography sx={{ fontSize: 12, textAlign: "center", width: "100%" }}>
            {item?.value?.charAt(0).toUpperCase() + item?.value?.slice(1) ||
              "-"}
          </Typography>
        );
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
    getNGODonationList(flt);
  }

  return (
    <>
      {id ? (
        <AppAnimate animation="transition.slideUpIn" delay={200}>
          <NGODetails />
        </AppAnimate>
      ) : (
        <AppsContainer
          title="NGO Donations"
          fullView
          sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
          isSearch={true}
          searchChild={() => {
            return (
              <SearchComponent
                onApiCall={getNGODonationList}
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
                <Breadcrumbs
                  aria-label="breadcrumb"
                  sx={{ margin: "20px 0px" }}
                >
                  <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                    Dashboards
                  </Link>
                  <Typography color="text.primary">NGO Donations</Typography>
                </Breadcrumbs>
              </BreadWrapper>
            </div>
          </AppsHeader>
          <CTable
            initialState={{ pinnedColumns: { right: ["actions"] } }}
            // onRowClick={() => console.log("click")}
            onRowClick={(item: any) =>
              history.push({
                pathname: `/ngo-donation-list/${item.row.user_id}`,
                state: { id: item.row.user_id, from: "ngo-donation-list" },
              })
            }
            NewBar={null}
            onChange={(event) => onChange(event)}
            row={ngoDonations?.lists}
            column={columns}
            rowCount={pagination.total}
            page={pagination.page}
            listsLoad={ngoDonations?.listsLoad}
            checkboxSelection={false}
            onSelectionModelChange={() => console.log("row select")}
            sortModel={sortModel}
            getApiCall={getNGODonationList}
            setSortModel={setSortModel}
          />
        </AppsContainer>
      )}
    </>
  );
};

export default NGODonationList;
