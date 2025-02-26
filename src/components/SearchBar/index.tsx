import React from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  alpha,
  Grid,
} from "@mui/material";
import { AppSearchBar } from "@crema";
import { BiEraser } from "react-icons/bi";
import { DatePicker } from "@mui/lab";
import moment from "moment";
import { isEmpty } from "lodash";
import { initialFormat, initialInputFormat } from "shared/constants/AppConst";
import { Fonts } from "shared/constants/AppEnums";

interface SearchbarProps {
  selectType?: any;
  setSelectType?: any;
  onApiCall: any;
  setKeywords: any;
  selectArr?: any;
  keywords: any;
  sortModel: any;
  from?: any;
  isCheckedReport?: any;
  isChecked?: any;
  isBtnSelect?: any;
}

const SearchComponent: React.FC<SearchbarProps> = ({
  selectType,
  setSelectType,
  onApiCall,
  setKeywords,
  selectArr,
  keywords,
  sortModel,
  from,
  isCheckedReport,
  isChecked,
  isBtnSelect,
}) => {
  return (
    <>
      {selectArr && !isEmpty(selectArr) && (
        <Grid item xs={2} sx={{ mr: 2 }}>
          <FormControl
            fullWidth
            size="small"
            sx={{
              height: 30,
              "& .MuiInputLabel-root": { top: selectType ? 0 : -4 },
            }}
          >
            <InputLabel id="demo-select-small">Select type</InputLabel>
            <Select
              sx={{ height: 30 }}
              MenuProps={{ style: { zIndex: 1000002 } }}
              size="small"
              fullWidth
              labelId="create-request"
              label="Select type"
              value={selectType}
              onChange={(e) => {
                setSelectType(e.target.value);
                setKeywords("");
                onApiCall({ page: 1 });
              }}
            >
              {selectArr?.map((it: any) => {
                return (
                  <MenuItem value={it.id} key={it?.id}>
                    {it?.value}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
      )}
      {selectType === "createdAt" ||
      selectType === "establishment_year" ||
      selectType === "updatedAt" ||
      selectType === "approve_time" ||
      selectType === "expiry_date" ||
      selectType === "deletedAt" ||
      selectType === "transaction_date" ? (
        <Grid item xs={4}>
          <DatePicker
            label={"Select Date"}
            openTo={selectType === "establishment_year" ? "year" : "month"}
            views={selectType === "establishment_year" ? ["year"] : ["day"]}
            value={keywords}
            onChange={(value: any) => {
              // eslint-disable-next-line eqeqeq
              if (value == "Invalid Date") {
                return null;
              } else {
                onApiCall({
                  [selectType]: JSON.stringify(
                    moment(value).format(
                      selectType === "establishment_year"
                        ? "YYYY"
                        : initialFormat
                    )
                  ),
                  page: 1,
                  operator: "contains",
                });
              }
              setKeywords(value);
            }}
            inputFormat={
              selectType === "establishment_year" ? "yyyy" : initialInputFormat
            }
            renderInput={(params: any) => (
              <TextField
                size="small"
                {...params}
                fullWidth
                error={false}
                sx={{
                  height: 30,
                  "& .MuiOutlinedInput-root": { height: 30 },
                  "& .MuiInputLabel-root": { top: keywords ? 0 : -4 },
                }}
              />
            )}
          />
        </Grid>
      ) : selectType === "blocked" ||
        selectType === "is_category_active" ||
        selectType === "email_status" ||
        selectType === "emergency_department" ||
        selectType === "vegetarian" ||
        selectType === "is_featured" ||
        selectType === "already_admission" ||
        selectType === "urgent_help" ||
        selectType === "is_contribute_anonymously" ||
        selectType === "is_tax_benefit" ||
        selectType === "is_enable" ||
        (from === "plans" && selectType === "status") ||
        (from === "cms" && selectType === "status") ||
        (from === "emotionalMsg" && selectType === "status") ? (
        <Grid item xs={4}>
          <FormControl
            fullWidth
            size="small"
            sx={{
              mr: 2,
              minWidth: 120,
              height: 30,
              "& .MuiInputLabel-root": { top: keywords ? 0 : -4 },
            }}
          >
            <InputLabel id="demo-select-small">Select type</InputLabel>
            <Select
              sx={{ height: 30 }}
              MenuProps={{ style: { zIndex: 1000002 } }}
              size="small"
              fullWidth
              labelId="create-request"
              label="Select type"
              value={keywords}
              onChange={(e) => {
                setKeywords(e.target.value);
                onApiCall({
                  [selectType]:
                    e.target.value === "true"
                      ? JSON.stringify("true")
                      : e.target.value === "false"
                      ? JSON.stringify("false")
                      : JSON.stringify(e.target.value),
                  operator:
                    e.target.value === "true" || e.target.value === "false"
                      ? "boolean"
                      : e.target.value === "Active" ||
                        e.target.value === "active" ||
                        e.target.value === "Deactive" ||
                        e.target.value === "deactive"
                      ? "is"
                      : "contains",
                  page: 1,
                });
              }}
            >
              <MenuItem
                value={
                  from === "categories" || from === "plans"
                    ? "active"
                    : from === "cms" ||
                      from === "email_status" ||
                      from === "emotionalMsg"
                    ? "Active"
                    : "true"
                }
              >
                {from === "categories"
                  ? "Enabled"
                  : from === "cms" ||
                    from === "email_status" ||
                    from === "emotionalMsg" ||
                    from === "plans"
                  ? "Active"
                  : "Yes"}
              </MenuItem>
              <MenuItem
                value={
                  from === "categories" || from === "plans"
                    ? "deactive"
                    : from === "cms" ||
                      from === "email_status" ||
                      from === "emotionalMsg"
                    ? "Deactive"
                    : "false"
                }
              >
                {from === "categories"
                  ? "Disabled"
                  : from === "cms" ||
                    from === "email_status" ||
                    from === "emotionalMsg" ||
                    from === "plans"
                  ? "Deactive"
                  : "No"}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      ) : (
        <Grid item>
          <AppSearchBar
            sx={{
              marginRight: 0,
              width: "100%",
              "& .searchRoot": { width: "100%" },
              "& .MuiInputBase-input": {
                width: "100%",
                "&:focus": { width: "100%" },
              },
            }}
            iconPosition="right"
            overlap={false}
            value={keywords}
            onChange={(e: any) => {
              setKeywords(e.target.value);
              if (isEmpty(e.target.value) && from !== "requests") {
                onApiCall({ page: 1 });
              } else if (from === "requests") {
                onApiCall({
                  // eslint-disable-next-line no-useless-computed-key
                  ["reported"]: isCheckedReport ? 1 : "",
                  search: e.target.value,
                  page: 1,
                  sort: isChecked ? "urgent_help" : sortModel[0]?.field,
                  status:
                    isBtnSelect && isBtnSelect !== "all"
                      ? JSON.stringify(isBtnSelect)
                      : "",
                  sort_type: -1,
                });
              } else {
                onApiCall({
                  search: e.target.value,
                  page: 1,
                });
              }
            }}
            placeholder={"Search here"}
          />
        </Grid>
      )}
      <Grid item sx={{ ml: 2 }}>
        <Button
          size="small"
          startIcon={<BiEraser />}
          sx={{
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
            color: "primary.main",
            fontWeight: Fonts.MEDIUM,
            fontSize: 12,
            "&:hover, &:focus": {
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.15),
              color: "primary.main",
            },
            "& .MuiButton-startIcon": { mr: 1 },
            height: 30,
          }}
          disabled={keywords ? false : true}
          onClick={() => {
            if (from === "requests") {
              setKeywords("");
              onApiCall({
                // eslint-disable-next-line no-useless-computed-key
                ["reported"]: isCheckedReport ? 1 : "",
                page: 1,
                sort: isChecked ? "urgent_help" : sortModel[0]?.field,
                status:
                  isBtnSelect && isBtnSelect !== "all"
                    ? JSON.stringify(isBtnSelect)
                    : "",
                sort_type: -1,
              });
            } else if (keywords) {
              setKeywords("");
              onApiCall({ page: 1 });
            }
          }}
        >
          Clear
        </Button>
      </Grid>
    </>
  );
};

export default SearchComponent;
