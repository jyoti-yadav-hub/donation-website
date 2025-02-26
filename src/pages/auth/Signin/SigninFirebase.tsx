import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { isEmpty } from "lodash";
import AppLoader from "@crema/core/AppLoader";
import * as yup from "yup";
import { useHistory, Redirect, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import LoadingButton from "@mui/lab/LoadingButton";
import IntlMessages from "../../../@crema/utility/IntlMessages";
import Box from "@mui/material/Box";
import AppTextField from "../../../@crema/core/AppFormComponents/AppTextField";
import { Fonts } from "../../../shared/constants/AppEnums";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/store";
import { LOGIN_REQUEST } from "types/actions/Auth.actions";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import { Grid, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("The Email you entered is not a valid format!")
    .required("Please enter Email Address!"),
  password: yup.string().required("Please enter password!"),
});

const SigninFirebase = () => {
  const { messages } = useIntl();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const [loginLoad, setLoginLoad] = useState<boolean>(false);

  const { idToken } = useSelector<AppState, AppState["AuthData"]>(
    ({ AuthData }) => AuthData
  );

  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);
  const [showRetypeNewPassword, setShowRetypeNewPassword] =
    React.useState(false);

  const onGoToForgetPassword = () => {
    history.push("/forget-password", { tab: "firebase" });
  };

  useEffect(() => {
    if (!isEmpty(idToken)) {
      setRedirectToReferrer(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (redirectToReferrer) {
    return (
      <Redirect to={{ pathname: "/dashboards", state: location.state }} push />
    );
  }

  const signInWithEmailAndPassword = async (data) => {
    setLoginLoad(true);
    try {
      const resp = await getApiData("admin/login", data, "POST");
      if (resp.success) {
        localStorage.setItem("uToken", resp.data.token);
        localStorage.setItem("uData", JSON.stringify(resp.data.user));
        history.replace("/dashboard");
        dispatch({
          type: LOGIN_REQUEST,
          token: resp.data.token,
          user: resp.data.user,
        });
        toast.success(resp.message);
      } else {
        toast.error(resp.message || "Something went wrong");
      }
      setLoginLoad(false);
    } catch (error) {
      setLoginLoad(false);
      console.log("error", error);
      toast.error("Something went wrong");
    }
  };

  const onShowRetypeNewPassword = () => {
    setShowRetypeNewPassword(!showRetypeNewPassword);
  };

  const inputStyle = { WebkitBoxShadow: "0 0 0 1000px #E7F0FE inset" };

  return (
    <Formik
      validateOnChange={true}
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(data) => signInWithEmailAndPassword(data)}
    >
      <Form noValidate autoComplete="off" style={{ width: "100%" }}>
        <Grid container spacing={3} sx={{ m: 0, width: "100%" }}>
          <Grid item xs={12}>
            <AppTextField
              fullWidth
              size="small"
              variant="filled"
              placeholder={messages["common.email"] as string}
              name="email"
              label={<IntlMessages id="common.email" />}
              InputProps={{ style: inputStyle }}
            />
          </Grid>
          <Grid item xs={12}>
            <AppTextField
              fullWidth
              size="small"
              variant="filled"
              type={showRetypeNewPassword ? "text" : "password"}
              placeholder={messages["common.password"] as string}
              label={<IntlMessages id="common.password" />}
              name="password"
              autoComplete="off"
              InputProps={{
                style: inputStyle,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={onShowRetypeNewPassword}
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
          </Grid>

          <Grid item xs={12}>
            <Box
              component="span"
              sx={{
                color: "#000",
                fontWeight: Fonts.MEDIUM,
                cursor: "pointer",
                display: "block",
                textAlign: "right",
              }}
              onClick={onGoToForgetPassword}
            >
              <IntlMessages id="common.forgetPassword" />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <LoadingButton
              size="small"
              id="Login_Btn"
              variant="contained"
              color="primary"
              type="submit"
              loading={loginLoad}
              disabled={loginLoad}
              loadingIndicator="Logging in..."
              sx={{
                width: "100%",
                fontWeight: Fonts.REGULAR,
                fontSize: 16,
                textTransform: "capitalize",
              }}
            >
              <IntlMessages id="common.login" />
            </LoadingButton>
          </Grid>
        </Grid>

        {loginLoad && <AppLoader />}
      </Form>
    </Formik>
  );
};

export default SigninFirebase;
