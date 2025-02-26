import React from "react";
import { Button, TextField, Typography } from "@mui/material";
import { Form } from "formik";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import IntlMessages from "../../../../@crema/utility/IntlMessages";
import { AppGridContainer } from "@crema";

interface ChangePasswordFormProps {
  values: any;
  touched: any;
  errors: any;
  handleChange: any;
  handleBlur: any;
  btnLoad: boolean;
  handleSubmit: any;
}

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.light,
}));

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  btnLoad,
  handleSubmit,
}) => {
  // const [btnLoad, setBtnLoad] = useState(false);

  const [showPassword, setShowPassword] = React.useState(false);

  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showRetypeNewPassword, setShowRetypeNewPassword] =
    React.useState(false);

  const onShowOldPassword = () => {
    setShowPassword(!showPassword);
  };

  const onDownOldPassword = (event: any) => {
    event.preventDefault();
  };

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

  return (
    <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
      <AppGridContainer spacing={4}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter old password"
            type={showPassword ? "text" : "password"}
            name="oldPassword"
            label="Old Password"
            variant="outlined"
            onBlur={handleBlur}
            value={values.oldPassword}
            onChange={handleChange}
            inputProps={{ maxLength: 12 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onShowOldPassword}
                    onMouseDown={onDownOldPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {errors.oldPassword && touched.oldPassword && (
            <ErrorTextStyle>{errors.oldPassword}</ErrorTextStyle>
          )}
        </Grid>
        <Grid item xs={12} md={6} sx={{ p: "0 !important" }} />
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter new password"
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            label="New Password"
            variant="outlined"
            onBlur={handleBlur}
            value={values.newPassword}
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
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {errors.newPassword && touched.newPassword && (
            <ErrorTextStyle>{errors.newPassword}</ErrorTextStyle>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter new password"
            type={showRetypeNewPassword ? "text" : "password"}
            name="retypeNewPassword"
            label="Confirm New Password"
            variant="outlined"
            onBlur={handleBlur}
            value={values.retypeNewPassword}
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
                    {showRetypeNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {errors.retypeNewPassword && touched.retypeNewPassword && (
            <ErrorTextStyle>{errors.retypeNewPassword}</ErrorTextStyle>
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
  );
};

export default ChangePasswordForm;
