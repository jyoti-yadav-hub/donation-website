import React, { useState } from "react";
import { Form, Formik } from "formik";
import AppLoader from "@crema/core/AppLoader";
import * as yup from "yup";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IntlMessages from "@crema/utility/IntlMessages";
import AppTextField from "@crema/core/AppFormComponents/AppTextField";
import { Fonts } from "../../../shared/constants/AppEnums";
import AppLogo from "../../../@crema/core/AppLayout/components/AppLogo";
import CSS from "csstype";
import { toast } from "react-toastify";
import { Card, Grid, useTheme } from "@mui/material";
import { AppAnimate } from "@crema";
import getApiData from "../../../shared/helpers/apiHelper";
import { ReactComponent as Logo } from "../../../assets/user/forgot-password.svg";
import { LoadingButton } from "@mui/lab";

const glassmorphism: CSS.Properties = {
  backgroundColor: "rgb(255 255 255 / 59%)",
  borderRadius: "10px",
  boxShadow: "rgb(221 221 221 / 37%) 0px 8px 32px 0px",
  borderWidth: "1px",
  borderColor: "rgba( 255, 255, 255, 0.18 )",
  backdropFilter: "blur( 5px )",
};
const validationSchema = yup.object({
  email: yup
    .string()
    .email("The Email you entered is not a valid format!")
    .required("Email is required"),
});

const ForgetPasswordJwtAuth = () => {
  const theme = useTheme();
  const [btnLoad, setBtnLoad] = useState<boolean>(false);

  const signInWithEmailAndPassword = async (data) => {
    setBtnLoad(true);
    try {
      const resp = await getApiData("admin/forget-password", data, "POST");
      if (resp.success) {
        toast.success(resp.message);
      } else {
        toast.error(resp.message || "Something went wrong");
      }
      setBtnLoad(false);
    } catch (error) {
      setBtnLoad(false);
      console.log("error", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <AppAnimate animation="transition.slideUpIn" delay={200}>
      <Box
        sx={{
          pb: 6,
          py: { xl: 8 },
          display: "flex",
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          style={glassmorphism}
          sx={{
            maxWidth: 1024,
            width: "100%",
            padding: 8,
            paddingLeft: { xs: 8, md: 2 },
            textAlign: "center",
            overflow: "hidden",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Grid container spacing={5} sx={{ alignItems: "center" }}>
            <Grid item xs={12} lg={6}>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  textAlign: "center",
                  "& svg": {
                    width: "100%",
                    height: "350px",
                    display: "inline-block",
                    paddingRight: { xs: 0, lg: 2.5 },
                  },
                }}
              >
                <Logo fill={theme.palette.primary.main} />
              </Box>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                <AppLogo
                  sxStyle={{
                    height: { xs: 80, sm: 80 },
                    width: { xs: 80, sm: 80 },
                  }}
                />
              </Box>
              <Box
                sx={{
                  mb: { xs: 4, xl: 8 },
                  fontWeight: Fonts.BOLD,
                  fontSize: 20,
                }}
              >
                <IntlMessages id="common.forgetPassword" />
              </Box>
              <Box sx={{ mb: 5, fontSize: 14 }}>
                <Typography component="p">
                  <IntlMessages id="common.forgetPasswordTextOne" />
                </Typography>
                <Typography component="p">
                  <IntlMessages id="common.forgetPasswordTextTwo" />
                </Typography>
              </Box>

              <Formik
                validateOnChange={true}
                initialValues={{ email: "" }}
                validationSchema={validationSchema}
                onSubmit={(data, { setSubmitting, resetForm }) => {
                  setSubmitting(true);
                  signInWithEmailAndPassword(data);
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting }) => (
                  <Form noValidate autoComplete="off" style={{ width: "100%" }}>
                    <Grid container spacing={3} sx={{ m: 0, width: "100%" }}>
                      <Grid item xs={12}>
                        <AppTextField
                          fullWidth
                          size="small"
                          variant="filled"
                          placeholder="Email"
                          name="email"
                          label={<IntlMessages id="common.emailAddress" />}
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ textAlign: "right" }}>
                        <Typography sx={{ fontSize: 15, color: "#000" }}>
                          <span style={{ marginRight: 4, opacity: 0.5 }}>
                            <IntlMessages id="common.alreadyHavePassword" />
                          </span>
                          <Box
                            component="span"
                            sx={{
                              fontWeight: Fonts.MEDIUM,
                              "& a": {
                                color: "#000",
                                textDecoration: "none",
                              },
                            }}
                          >
                            <Link to="/signin">
                              <IntlMessages id="common.signIn" />
                            </Link>
                          </Box>
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LoadingButton
                          size="small"
                          variant="contained"
                          color="primary"
                          type="submit"
                          loading={btnLoad}
                          disabled={btnLoad || isSubmitting}
                          sx={{
                            fontWeight: Fonts.REGULAR,
                            textTransform: "capitalize",
                            fontSize: 16,
                            width: "100%",
                          }}
                        >
                          <IntlMessages id="common.sendNewPassword" />
                        </LoadingButton>
                      </Grid>
                    </Grid>

                    {isSubmitting && <AppLoader />}
                  </Form>
                )}
              </Formik>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </AppAnimate>
  );
};

export default ForgetPasswordJwtAuth;
