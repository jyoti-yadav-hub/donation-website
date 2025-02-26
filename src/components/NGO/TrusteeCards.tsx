import React from "react";
import { Avatar, Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import RemovedTrustee from "./RemovedTrusteeTable";
import BoxCards from "components/Food/BoxCard";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
const { flag } = require("country-emoji");

const BodyStyle = styled(Box)(({ theme }) => ({
  width: "100%",
  "& .top-userdata": {
    boxShadow: "rgba(0, 0, 0, 0.04) 0px 10px 10px 4px",
    backgroundColor: "rgb(255, 255, 255)",
    padding: 15,
    borderRadius: "10px !important",
    minHeight: "235px",
  },
  "& .noData": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  "& .details-title": { fontWeight: "500", marginRight: 10 },
  "& .avtarClass": {
    height: 50,
    width: 50,
    fontSize: 20,
    backgroundColor: "#17a2da",
  },
  "& .avatarBox": {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
  },
}));

interface TrusteeNGOProps {
  ngoDetail: any;
}

const TrusteeNGO: React.FC<TrusteeNGOProps> = ({ ngoDetail }) => {
  return (
    <BodyStyle>
      <Grid container spacing={4} xs={12} style={{ margin: 0 }}>
        {ngoDetail &&
        ngoDetail?.trustees_name &&
        ngoDetail?.trustees_name.length > 0 ? (
          ngoDetail?.trustees_name.map((item: any, index: any) => {
            return (
              <Grid
                item
                xs={ngoDetail?.updated_data ? 12 : 6}
                xl={ngoDetail?.updated_data ? 6 : 3}
              >
                <div style={{ height: "100%" }} className="top-userdata">
                  <Box className="avatarBox">
                    <Typography
                      variant="body2"
                      sx={{ fontSize: { lg: "14px", xl: "15px" } }}
                    >
                      {item.is_owner
                        ? "Primary Trustee:"
                        : `Secondary Trustee: ${
                            item?.verified ? "" : "Not Verified"
                          }`}
                    </Typography>
                    <Avatar
                      className="avtarClass"
                      src={item?.image || "/assets/images/placeholder.jpg"}
                    />
                  </Box>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Trustee Name */}
                    <Grid item xs={12}>
                      <BoxCards
                        title="Trustee Name"
                        values={
                          item?.name ||
                          `${item?.first_name} ${item?.last_name}` ||
                          "-"
                        }
                      />
                    </Grid>
                    {/* Trustee Phone */}
                    <Grid item xs={12}>
                      <BoxCards
                        title="Trustee Phone"
                        values={`${flag(item?.flag || "")}
                      ${item?.phone_code || ""}${item?.phone || ""}`}
                      />
                    </Grid>
                    {/* Trustee Email */}
                    <Grid item xs={12}>
                      <BoxCards
                        title="Trustee Email"
                        values={item?.email || "-"}
                      />
                    </Grid>
                    {/* Added At */}
                    <Grid item xs={12}>
                      <BoxCards
                        title="Added At"
                        values={
                          item?.added_time
                            ? moment(item?.added_time).format(initialTimeFormat)
                            : "-" || "-"
                        }
                      />
                    </Grid>
                  </div>
                </div>
              </Grid>
            );
          })
        ) : (
          <Grid
            item
            xs={ngoDetail?.updated_data ? 12 : 3}
            xl={ngoDetail?.updated_data ? 6 : 3}
          >
            <div
              style={{ padding: "25px !important", height: "100%" }}
              className="top-userdata noData"
            >
              <Typography>No Trustee Added</Typography>
            </div>
          </Grid>
        )}

        {/* RemovedTrustee Table */}
        <Grid item xs={ngoDetail?.updated_data ? 12 : 6}>
          <RemovedTrustee ngoDetail={ngoDetail} />
        </Grid>
      </Grid>
    </BodyStyle>
  );
};
export default TrusteeNGO;
