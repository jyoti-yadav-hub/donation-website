import React from "react";
import { Box, Chip, Grid, Grow, Stack, Typography } from "@mui/material";
import { isEmpty, isArray } from "lodash";
import { styled } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
import BoxCards from "components/Food/BoxCard";
const { flag } = require("country-emoji");

const BodyStyle = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  borderRadius: "10px !important",
  padding: "10px 10px 10px 0px",
  "& .userDetails": {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  "& .details-text-div": {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 10,
    backgroundColor: "rgb(244, 247, 254)",
    borderRadius: 5,
    margin: 5,
    flexWrap: "wrap",
  },
  "& .txtStyle": {
    fontSize: "14px",
    fontWeight: "500",
    wordBreak: "break-word",
    [theme.breakpoints.down("xl")]: { fontSize: "13px" },
  },
  "& .chipsStyle": {
    fontSize: "13px",
    color: "#FFF",
    marginTop: "5px",
    [theme.breakpoints.down("xl")]: { fontSize: "12px" },
  },
  "& .cardTitle": {
    [theme.breakpoints.down("xl")]: { fontSize: "12px" },
  },
}));

interface BasicDetailsProps {
  userDetails: any;
}
const BasicDetails: React.FC<BasicDetailsProps> = ({ userDetails }) => {
  const history = useHistory();

  let roles = userDetails.role.map((item) => {
    return (item = item.toLowerCase());
  });

  return (
    <BodyStyle>
      <Grow in style={{ transformOrigin: "1 0 0" }} {...{ timeout: 500 }}>
        <Grid item className="userDetails" style={{ marginTop: 0 }}>
          {/* Display Name */}
          {userDetails?.user_name && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="User Name"
                values={userDetails?.user_name || "-"}
              />
            </Grid>
          )}

          {/* User Type */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Role"
              isStack={true}
              renderStack={() => {
                return (
                  // <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  //   {userDetails?.is_donor ? (
                  //     <Chip
                  //       className="chipsStyle"
                  //       style={{ backgroundColor: "#2e7d32" }}
                  //       label="Donor"
                  //       size="small"
                  //     />
                  //   ) : null}

                  //   {userDetails?.is_ngo ? (
                  //     <Chip
                  //       className="chipsStyle"
                  //       style={{ backgroundColor: "#ed6c02" }}
                  //       label="NGO"
                  //       size="small"
                  //     />
                  //   ) : null}

                  //   {userDetails?.is_user ? (
                  //     <Chip
                  //       className="chipsStyle"
                  //       style={{ backgroundColor: "#1976d2" }}
                  //       label="Beneficiary"
                  //       size="small"
                  //     />
                  //   ) : null}

                  //   {userDetails?.is_volunteer ? (
                  //     <Chip
                  //       className="chipsStyle"
                  //       style={{ backgroundColor: "#9c27b0" }}
                  //       label="Volunteer"
                  //       size="small"
                  //     />
                  //   ) : null}
                  // </Stack>

                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    {roles?.includes("organizer") ? (
                      <Chip
                        className="chipsStyle"
                        style={{ backgroundColor: "#2e7d32" }}
                        label="Organizer"
                        size="small"
                      />
                    ) : null}
                    {roles?.includes("judge") ? (
                      <Chip
                        className="chipsStyle"
                        style={{ backgroundColor: "#1976d2" }}
                        label="Judge"
                        size="small"
                      />
                    ) : null}
                  </Stack>
                );
              }}
            />
          </Grid>
          {/* Created At */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Created At"
              values={
                moment(userDetails?.createdAt).format(initialTimeFormat) || "-"
              }
            />
          </Grid>
          {/* Deactivated Time */}
          {!isEmpty(userDetails?.deletedAt) && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Blocked At"
                values={
                  moment(userDetails?.deletedAt).format("DD/MM/YYYY") || "-"
                }
              />
            </Grid>
          )}

          {/* Deactivate reason */}
          {!isEmpty(userDetails?.block_account_reason) && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Blocked Reason"
                values={userDetails?.block_account_reason || "-"}
              />
            </Grid>
          )}
          {/* Login Type */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              loginType={true}
              title="Login Type"
              values={
                userDetails?.platform === "Ios" ? "iOS" : "Android" || "-"
              }
              renderLoginType={() => {
                return (
                  <>
                    {userDetails?.platform === "Ios" ? (
                      <img
                        alt="apple"
                        src="/assets/images/Apple_logo.svg.png"
                        width={20}
                        style={{ paddingRight: 5, marginBottom: "3px" }}
                      />
                    ) : (
                      <img
                        alt="android"
                        src="/assets/images/Android_logo.svg.png"
                        width={20}
                        style={{ paddingRight: 5 }}
                      />
                    )}
                  </>
                );
              }}
            />
          </Grid>
          {/* country + country_code +  emoji */}

          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Country"
              // values={
              //   `${userDetails?.phone_country_full_name || ""}
              //   (${userDetails?.phone_code || ""})` || ""
              // }
              values={
                userDetails?.phone_country_full_name
                  ? userDetails?.phone_country_full_name +
                    `(${userDetails?.phone_code || ""})`
                  : "-"
              }
            />
          </Grid>
          {/* default_country */}
          {userDetails?.default_country && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Default Country"
                values={userDetails?.default_country || "-"}
              />
            </Grid>
          )}
          {/* Phone */}
          {userDetails?.phone && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Phone"
                values={`
      ${userDetails?.phone_code || ""} ${userDetails?.phone || "-"}`}
                // values={`${flag(userDetails?.phone || "-")}
                //   ${userDetails?.phone_code || ""} ${userDetails?.phone || "-"}`}
              />
            </Grid>
          )}

          {/* Email */}
          {userDetails?.email ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards title="Email" values={userDetails?.email || "-"} />
            </Grid>
          ) : null}
          {/* Date of birth */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Birth Date"
              values={
                userDetails?.dob
                  ? moment(new Date(userDetails?.dob)).format("DD/MM/YYYY")
                  : "-"
              }
            />
          </Grid>
          {/* currency */}
          {isArray(userDetails?.country_data?.currency) ? (
            <Grid item xs={6} lg={4} xl={3}>
              <div className="details-text-div">
                <Typography className="cardTitle">Currency</Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "50%",
                  }}
                >
                  <Typography
                    variant="button"
                    className="txtStyle"
                    style={{ width: "100%" }}
                  >
                    Name:
                    {userDetails &&
                      userDetails?.country_data?.currency?.map(
                        (it: any, index: any) => {
                          if (isEmpty(it.name) || isEmpty(it.symbol)) {
                            return null;
                          }
                          return (
                            <Box key={index}>
                              <Typography
                                variant="inherit"
                                sx={{
                                  wordBreak: "break-word",
                                  color: "text.secondary",
                                }}
                                className="txtStyle"
                              >
                                {it?.name || "-"}
                              </Typography>
                            </Box>
                          );
                        }
                      )}
                  </Typography>
                  <Typography
                    variant="button"
                    className="txtStyle"
                    style={{ width: "100%" }}
                  >
                    Symbol:
                    {userDetails &&
                      userDetails?.country_data?.currency?.map(
                        (it: any, index: any) => {
                          if (isEmpty(it.name) || isEmpty(it.symbol)) {
                            return null;
                          }
                          return (
                            <Box key={index}>
                              <Typography
                                variant="inherit"
                                sx={{
                                  wordBreak: "break-word",
                                  color: "text.secondary",
                                }}
                                className="txtStyle"
                              >
                                {it?.symbol || "-"}
                              </Typography>
                            </Box>
                          );
                        }
                      )}
                  </Typography>
                </Box>
              </div>
            </Grid>
          ) : null}
          {/* Causes */}
          {!isEmpty(userDetails?.my_causes) ? (
            <Grid item xs={6} lg={4} xl={3}>
              <div className="details-text-div">
                <Typography className="cardTitle">Causes</Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {/* {userDetails?.my_causes?.map((it: any, index: number) => {
                    return (
                      <Chip
                        sx={{
                          mt: 1,
                          mr:
                            index !== userDetails?.my_causes?.length - 1
                              ? 1
                              : 0,
                        }}
                        className="txtStyle"
                        label={it.charAt(0).toUpperCase() + it.slice(1) || "-"}
                        size="small"
                      />
                    );
                  })} */}
                </Box>
              </div>
            </Grid>
          ) : null}
          {/* Race */}
          {userDetails?.race && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards title="Race" values={userDetails?.race || "-"} />
            </Grid>
          )}
          {/* Religion */}
          {userDetails?.religion && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Religion"
                values={userDetails?.religion || "-"}
              />
            </Grid>
          )}
          {/* Food Type */}
          {/* <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              isChip={true}
              title="Food Type"
              style={{
                color: "#FFF",
                backgroundColor: userDetails?.is_veg
                  ? "#2e7d32" //success
                  : "#d32f2f", //error
              }}
              values={`${userDetails?.is_veg ? "Veg" : "Veg/Non-Veg"}` || "-"}
            />
          </Grid> */}
          {/* Is NGO */}
          {/* <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              isChip={true}
              title="Is NGO?"
              style={{
                color: "#FFF",
                backgroundColor: userDetails?.is_ngo
                  ? "#2e7d32" //success
                  : "#d32f2f", //error
              }}
              values={userDetails?.is_ngo ? "Yes" : "No" || "-"}
            />
          </Grid> */}
          {/* NGO Name */}
          {/* {userDetails && userDetails?.is_ngo && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                isLink={true}
                title="NGO Name"
                values={userDetails?.ngo_data?.ngo_name || "-"}
                onClick={() => {
                  history.push({
                    pathname: `/ngo/${userDetails?.ngo_data?._id}`,
                    state: {
                      id: userDetails?.ngo_data?._id,
                      userId: userDetails?._id,
                      userData: userDetails,
                      from: "user-detail",
                    },
                  });
                }}
              />
            </Grid>
          )} */}
          {/* is_restaurant */}
          {/* <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              isChip={true}
              title="Is Restaurant?"
              style={{
                color: "#FFF",
                backgroundColor: userDetails?.is_restaurant
                  ? "#2e7d32" //success
                  : "#d32f2f", //error
              }}
              values={`${userDetails?.is_restaurant ? "Yes" : "No"}` || "-"}
            />
          </Grid> */}
          {/* restaurant_name */}
          {/* {userDetails?.is_restaurant && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Restaurant Name"
                values={userDetails?.restaurant_name || "-"}
              />
            </Grid>
          )} */}
          {/* User Location */}
          {/* <Grid item xs={12}>
            <BoxCards
              title="User Location"
              values={userDetails?.location?.city || "-"}
            />
          </Grid> */}
          {/* restaurant_location */}
          {/* {userDetails?.is_restaurant && (
            <Grid item xs={12}>
              <BoxCards
                title="Restaurant Location"
                values={userDetails?.restaurant_location?.city || "-"}
              />
            </Grid>
          )} */}
        </Grid>
      </Grow>
    </BodyStyle>
  );
};

export default BasicDetails;
