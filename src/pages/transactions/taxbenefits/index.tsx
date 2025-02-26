/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Breadcrumbs, Chip, styled, Typography } from "@mui/material";
import {
  getGridBooleanOperators,
  getGridNumericColumnOperators,
  getGridStringOperators,
  GridColumns,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import { isArray, isEmpty } from "lodash";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import { useSelector } from "react-redux";
import { AppState } from "redux/store";
import { Link } from "react-router-dom";
import CTable from "components/CTable";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import SearchComponent from "components/SearchBar";

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const TaxBenefitLists = () => {
  const { notiData } = useSelector<AppState, AppState["Notificationdata"]>(
    ({ Notificationdata }) => Notificationdata
  );
  const [taxBenefits, setTaxBenefits] = useState<any>({
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

  //API for get tax benefits lists
  async function getTaxBenefitsLists(nData) {
    setTaxBenefits((e) => ({ ...e, listsLoad: true }));
    try {
      // nData.transaction_type = "donation";
      nData.is_tax_benefit = true;
      const res = await getApiData(`request/admin/transaction-list`, nData);
      if (res.success) {
        setTaxBenefits({
          lists: isArray(res.data) ? res.data : [],
          listsLoad: false,
        });
        setPagination({
          total: res.total_count || 0,
          page: res.page > 0 ? res.page - 1 : 0,
        });
      } else {
        setTaxBenefits({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setTaxBenefits({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (!isEmpty(notiData)) {
      getTaxBenefitsLists({
        page: 1,
        sort: sortModel[0].field,
        sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
      });
    }
  }, [notiData]);

  useEffect(() => {
    getTaxBenefitsLists({
      page: 1,
      sort: sortModel[0].field,
      sort_type: sortModel[0]?.sort === "asc" ? 1 : -1,
    });
  }, []);

  const strFilterOperators = getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value)
  );

  const boolFilterOperators = getGridBooleanOperators().filter(({ value }) =>
    ["is"].includes(value)
  );

  const numberFiltOperator = getGridNumericColumnOperators().filter(
    ({ value }) => ["="].includes(value)
  );

  const columns: GridColumns = [
    {
      field: "_id",
      headerName: "Transaction Id",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "transaction_type",
      filterOperators: strFilterOperators,
      headerName: "Donation Type",
      cellClassName: "transaction_type",
      minWidth: 180,
      renderCell: (item: any) => {
        return (
          <Chip
            className="chip_class"
            style={{
              color: "#FFF",
              backgroundColor:
                item.value === "donation"
                  ? "#2e7d32" //success
                  : "#1976d2", //primary
            }}
            label={
              item.value === "donation" ? "Donation" : "NGO-Donation" || "-"
            }
            variant="outlined"
            size="small"
          />
        );
      },
    },
    {
      field: "total_amount",
      headerName: "Total Amount Paid",
      minWidth: 250,
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
      field: "donor_name",
      headerName: "Donor Name",
      minWidth: 200,
      flex: 1,
      filterOperators: strFilterOperators,
    },
    {
      field: "country_data",
      headerName: "Country",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => params?.row?.country_data?.country || "",
      filterOperators: strFilterOperators,
    },
    {
      field: "transaction_charge",
      headerName: "Transaction Charge",
      minWidth: 200,
      flex: 1,
      type: "number",
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
      field: "user_name",
      headerName: "Name of Beneficiary",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => params?.row?.userData?.user_name || "",
      filterOperators: strFilterOperators,
    },
  ];

  function onChange(newPage: any) {
    const flt = { ...pagination.page };
    flt.search = keywords ? keywords : null;
    flt.operator = "contains";
    flt.page = newPage + 1;
    flt.sort = sortModel[0].field;
    flt.sort_type = sortModel[0]?.sort === "asc" ? 1 : -1;
    getTaxBenefitsLists(flt);
  }

  return (
    <AppsContainer
      title="Tax Benefits"
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
      isSearch={true}
      searchChild={() => {
        return (
          <SearchComponent
            onApiCall={getTaxBenefitsLists}
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
              <Typography color="text.primary">Tax Benefits</Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>
      <CTable
        initialState={{ pinnedColumns: { right: ["actions"] } }}
        onRowClick={() => console.log("click")}
        NewBar={null}
        onChange={(event) => onChange(event)}
        row={taxBenefits?.lists}
        column={columns}
        rowCount={pagination.total}
        page={pagination.page}
        listsLoad={taxBenefits?.listsLoad}
        checkboxSelection={false}
        onSelectionModelChange={() => console.log("row select")}
        sortModel={sortModel}
        getApiCall={getTaxBenefitsLists}
        setSortModel={setSortModel}
      />
    </AppsContainer>
  );
};

export default TaxBenefitLists;
