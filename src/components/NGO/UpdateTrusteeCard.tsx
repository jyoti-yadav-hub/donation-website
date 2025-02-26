import React from "react";
import { Avatar, Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import UpdateRemoveTrustee from "./UpdateRemoveTruste";
import { CremaTheme } from "types/AppContextPropsType";
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

interface UpdateTrusteeNGOProps {
  ngoDetail: any;
}

const UpdateTrusteeNGO: React.FC<UpdateTrusteeNGOProps> = ({ ngoDetail }) => {
  const xlUp = useMediaQuery((theme: CremaTheme) => theme.breakpoints.up("xl"));

  return (
    <BodyStyle>
      <Grid container spacing={4} xs={12} sx={{ m: 0, width: "100%" }}>
        {ngoDetail &&
        ngoDetail?.updated_data?.trustees_name &&
        ngoDetail?.updated_data?.trustees_name.length > 0 ? (
          ngoDetail?.updated_data?.trustees_name.map(
            (item: any, index: any) => {
              const fName = ngoDetail?.trustees_name?.find(
                (fn: any) => fn?.first_name === item?.first_name
              );
              const lName = ngoDetail?.trustees_name?.find(
                (fn: any) => fn?.last_name === item?.last_name
              );
              const phoneCode = ngoDetail?.trustees_name?.find(
                (fn: any) => fn?.phone_code === item?.phone_code
              );
              const phone = ngoDetail?.trustees_name?.find(
                (fn: any) => fn?.phone === item?.phone
              );
              const email = ngoDetail?.trustees_name?.find(
                (fn: any) => fn?.email === item?.email
              );
              return (
                <Grid
                  item
                  xs={12}
                  xl={6}
                  sx={{
                    pl:
                      xlUp && index !== 0
                        ? "16px !important"
                        : "0px !important",
                  }}
                >
                  <div style={{ height: "100%" }} className="top-userdata">
                    <Box className="avatarBox">
                      <Typography
                        variant="body2"
                        sx={{ fontSize: { lg: "14px", xl: "15px" } }}
                      >
                        {ngoDetail?.updated_data?.transfer_account
                          ? item.is_owner
                            ? "Secondary Trustee:"
                            : "Primary Trustee:"
                          : item.is_owner
                          ? "Primary Trustee:"
                          : `Secondary Trustee: ${
                              item?.verified ||
                              ngoDetail?.ngo_status === "approve"
                                ? ""
                                : "Not Verified"
                            }`}
                        {/* {item.is_owner &&
                        ngoDetail?.updated_data?.transfer_account
                          ? `Primary Trustee:`
                          : item.is_owner
                          ? `Primary Trustee:`
                          : `Secondary Trustee: ${
                              item?.verified ||
                              ngoDetail?.ngo_status === "approve"
                                ? ""
                                : "Not Verified"
                            }`} */}
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
                          backgroundColor={
                            fName?.first_name === item?.first_name &&
                            lName?.last_name === item?.last_name
                              ? "rgb(244, 247, 254)"
                              : "#91ED91"
                          }
                        />
                      </Grid>
                      {/* Trustee Phone */}
                      <Grid item xs={12}>
                        <BoxCards
                          title="Trustee Phone"
                          values={`${flag(item?.flag || "")}
                      ${item?.phone_code || ""}${item?.phone || ""}`}
                          backgroundColor={
                            phoneCode?.phone_code === item?.phone_code &&
                            phone?.phone === item?.phone
                              ? "rgb(244, 247, 254)"
                              : "#91ED91"
                          }
                        />
                      </Grid>
                      {/* Trustee Email */}
                      <Grid item xs={12}>
                        <BoxCards
                          title="Trustee Email"
                          values={item?.email || "-"}
                          backgroundColor={
                            email?.email === item?.email
                              ? "rgb(244, 247, 254)"
                              : "#91ED91"
                          }
                        />
                      </Grid>
                      {/* Added At */}
                      <Grid item xs={12}>
                        <BoxCards
                          title="Added At"
                          values={
                            item?.added_time
                              ? moment(item?.added_time).format(
                                  initialTimeFormat
                                )
                              : "-" || "-"
                          }
                        />
                      </Grid>
                    </div>
                  </div>
                </Grid>
              );
            }
          )
        ) : (
          <Grid item xs={12}>
            <div
              style={{ padding: "25px !important", height: "100%" }}
              className="top-userdata noData"
            >
              <Typography>No Trustee Added</Typography>
            </div>
          </Grid>
        )}

        {/* RemovedTrustee Table */}
        <Grid item xs={12} sx={{ pl: "0px !important" }}>
          <UpdateRemoveTrustee ngoDetail={ngoDetail} />
        </Grid>
      </Grid>
    </BodyStyle>
  );
};

export default UpdateTrusteeNGO;
