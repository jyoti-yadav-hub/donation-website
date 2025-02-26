import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import {
  CircularProgress,
  Grid,
  TextField,
  Box,
  Typography,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { AppGridContainer, AppInfoView } from "@crema";
import { styled } from "@mui/material/styles";
import IntlMessages from "@crema/utility/IntlMessages";
import { Fonts } from "shared/constants/AppEnums";
import AppLogo from "@crema/core/AppLayout/components/AppLogo";
import AuthWrapper from "./AuthWrapper";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import getApiData from "../../shared/helpers/apiHelper";
import { useHistory, useParams } from "react-router-dom";

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.light,
}));

const validationSchema = yup.object({
  password: yup
    .string()
    .required("New Password  is required.")
    .min(6, "Password is too short - should be 6 chars minimum.")
    .max(12, "Maximum 12 characters allowed"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm New Password  is required."),
});

const ResetPasswordAwsCognito = () => {
  const history = useHistory();
  const { id }: { id: string } = useParams();
  const [btnLoad, setBtnLoad] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showRetypeNewPassword, setShowRetypeNewPassword] =
    React.useState(false);

  const onShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const onDownNewPassword = (event: any) => {
    event.preventDefault();
  };

  const onShowRetypeNewPassword = () => {
    setShowRetypeNewPassword(!showRetypeNewPassword);
  };

  const onDownRetypeNewPassword = (event: any) => {
    event.preventDefault();
  };

  // API For reset password
  async function submitData(data: any) {
    const cData = { ...data, token: id };
    setBtnLoad(true);
    try {
      const resp = await getApiData("admin/reset-password", cData, "POST");
      if (resp.success) {
        toast.success(resp.message);
        setBtnLoad(false);
        history.replace("/signin");
      } else {
        toast.error(resp.message);
        setBtnLoad(false);
      }
    } catch (error) {
      setBtnLoad(false);
      console.log("error====", error);
      toast.error("Something went wrong");
    }
  }

  return (
    <AuthWrapper>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            mb: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppLogo
            sxStyle={{ height: { xs: 60, sm: 60 }, width: { xs: 60, sm: 60 } }}
          />
        </Box>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            mb: 3,
            color: (theme) => theme.palette.text.primary,
            fontWeight: Fonts.SEMI_BOLD,
            fontSize: { xs: 14, xl: 16 },
          }}
        >
          <IntlMessages id="common.resetPassword" />
        </Typography>

        <Formik
          validateOnChange={true}
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={(data, { setSubmitting }) => {
            setSubmitting(true);
            submitData(data);
            setSubmitting(false);
          }}
        >
          {({
            isSubmitting,
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <AppGridContainer spacing={4}>
                <Grid item xs={12} md={12}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter new password"
                    type={showNewPassword ? "text" : "password"}
                    name="password"
                    label="New Password"
                    variant="outlined"
                    onBlur={handleBlur}
                    value={values.password}
                    onChange={handleChange}
                    inputProps={{ maxLength: 12 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onShowNewPassword}
                            onMouseDown={onDownNewPassword}
                            edge="end"
                          >
                            {showNewPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.password && touched.password && (
                    <ErrorTextStyle>{errors.password}</ErrorTextStyle>
                  )}
                </Grid>

                <Grid item xs={12} md={12}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter new password"
                    type={showRetypeNewPassword ? "text" : "password"}
                    name="confirmPassword"
                    label="Confirm New Password"
                    variant="outlined"
                    onBlur={handleBlur}
                    value={values.confirmPassword}
                    onChange={handleChange}
                    inputProps={{ maxLength: 12 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onShowRetypeNewPassword}
                            onMouseDown={onDownRetypeNewPassword}
                            edge="end"
                          >
                            {showRetypeNewPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <ErrorTextStyle>{errors.confirmPassword}</ErrorTextStyle>
                  )}
                </Grid>

                <Grid item>
                  <Button
                    size="small"
                    sx={{ position: "relative" }}
                    color="primary"
                    variant="contained"
                    disabled={btnLoad}
                    type="submit"
                  >
                    {btnLoad ? (
                      <CircularProgress
                        size={14}
                        color="primary"
                        style={{ margin: "5px 0px" }}
                      />
                    ) : (
                      <IntlMessages id="common.saveChanges" />
                    )}
                  </Button>
                </Grid>
              </AppGridContainer>
            </Form>
          )}
        </Formik>
        <AppInfoView />
      </Box>
    </AuthWrapper>
  );
};

export default ResetPasswordAwsCognito;
