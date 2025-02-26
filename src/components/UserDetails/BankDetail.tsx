import React from "react";
import { Box, Grid, Grow, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const BodyStyle = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  borderRadius: "10px !important",
  padding: "10px 22px 10px 0px",
  "& .btnsDiv": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  "& .userDetails": {
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: "#F4F7FE",
    paddingBottom: 5,
  },
  "& .details-text-div": {
    backgroundColor: "rgb(244, 247, 254)",
    padding: "15px 20px",
    margin: 5,
    borderRadius: "10px !important",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  "& .centerItem": {
    display: "flex",
    alignItems: "center",
  },
  "& .details-title": { fontWeight: "500" },
}));

interface BankDetailsProps {
  bankDetail: any;
}

const BankDetails: React.FC<BankDetailsProps> = ({ bankDetail }) => {
  return (
    <BodyStyle>
      <Grid item xs={12}>
        <Typography
          variant="body2"
          align="left"
          sx={{ fontSize: { lg: "14px", xl: "15px" } }}
        >
          Bank Details:
        </Typography>
      </Grid>
      <Grow in style={{ transformOrigin: "1 0 0" }} {...{ timeout: 500 }}>
        <Grid
          container
          spacing={2}
          className="userDetails"
          style={{ margin: 0 }}
        >
          <Grid xs={0.5} item>
            <Typography className="details-title">No.</Typography>
          </Grid>
          <Grid xs={2.87} item>
            <Typography className="details-title">Account Name</Typography>
          </Grid>
          <Grid xs={2.87} item>
            <Typography className="details-title">Account Number</Typography>
          </Grid>
          <Grid xs={2.87} item>
            <Typography className="details-title">Bank name</Typography>
          </Grid>
          <Grid xs={2.87} item>
            <Typography className="details-title">IFSC Code</Typography>
          </Grid>
          {bankDetail?.map((itm: any, index: number) => {
            return (
              <>
                <Grid xs={0.5} item>
                  <Typography
                    sx={{ wordBreak: "break-word", color: "text.secondary" }}
                  >
                    {index + 1 || "-"}
                  </Typography>
                </Grid>
                <Grid xs={2.87} item>
                  <Typography
                    sx={{ wordBreak: "break-word", color: "text.secondary" }}
                  >
                    {itm?.form_data?.bank_account_name || "-"}
                  </Typography>
                </Grid>
                <Grid xs={2.87} item>
                  <Typography
                    sx={{ wordBreak: "break-word", color: "text.secondary" }}
                  >
                    {itm?.form_data?.bank_account_number || "-"}
                  </Typography>
                </Grid>
                <Grid xs={2.87} item>
                  <Typography
                    sx={{ wordBreak: "break-word", color: "text.secondary" }}
                  >
                    {itm?.form_data?.bank_name || "-"}
                  </Typography>
                </Grid>
                <Grid xs={2.87} item>
                  <Typography
                    sx={{ wordBreak: "break-word", color: "text.secondary" }}
                  >
                    {itm?.form_data?.ifsc_code || "-"}
                  </Typography>
                </Grid>
              </>
            );
          })}
        </Grid>
      </Grow>
    </BodyStyle>
  );
};

export default BankDetails;
