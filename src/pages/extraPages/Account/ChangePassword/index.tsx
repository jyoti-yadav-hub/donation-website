import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import ChangePasswordForm from "./ChangePasswordForm";
import getApiData from "../../../../shared/helpers/apiHelper";
import IntlMessages from "@crema/utility/IntlMessages";
import { useHistory } from "react-router-dom";
import { Fonts } from "shared/constants/AppEnums";

const validationSchema = yup.object({
  oldPassword: yup
    .string()
    .required("Old Password is required.")
    .min(6, "Old Password is too short - should be 6 chars minimum.")
    .max(12, "Maximum 12 characters allowed"),
  // .matches(
  //   /[a-zA-Z0-9]/,
  //   "Old Password can only contain letters and digits."
  // ),
  newPassword: yup
    .string()
    .required("New Password  is required.")
    .min(6, "Password is too short - should be 6 chars minimum.")
    .max(12, "Maximum 12 characters allowed"),
  // .matches(/[a-zA-Z0-9]/, "Password can only contain letters and digits."),
  retypeNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm New Password  is required."),
});

const ChangePassword = () => {
  const [btnLoad, setBtnLoad] = useState(false);
  const history = useHistory();

  async function submitData(data: any) {
    setBtnLoad(true);
    try {
      const resp = await getApiData("admin/change-password", data, "POST");
      if (resp.success) {
        toast.success(resp.message);
        setBtnLoad(false);
        history.replace("/dashboard");
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
    <Box sx={{ position: "relative", maxWidth: 550 }}>
      <Typography
        component="h3"
        sx={{
          fontSize: 16,
          fontWeight: Fonts.BOLD,
          mb: { xs: 3, lg: 5 },
        }}
      >
        <IntlMessages id="common.changePassword" />
      </Typography>
      <Formik
        validateOnChange={true}
        initialValues={{
          oldPassword: "",
          newPassword: "",
          retypeNewPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(data, { setSubmitting }) => {
          setSubmitting(true);
          submitData(data);
          setSubmitting(false);
        }}
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => {
          return (
            <ChangePasswordForm
              values={values}
              touched={touched}
              errors={errors}
              handleChange={handleChange}
              handleBlur={handleBlur}
              btnLoad={btnLoad}
              handleSubmit={handleSubmit}
            />
          );
        }}
      </Formik>
    </Box>
  );
};

export default ChangePassword;

ChangePassword.propTypes = {
  setFieldValue: PropTypes.func,
  values: PropTypes.string,
};
