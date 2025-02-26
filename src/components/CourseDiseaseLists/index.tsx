import React, { useState } from "react";
import DialogSlide from "components/DialogSlide";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { Box, TextField, Typography } from "@mui/material";
import getApiData from "../../shared/helpers/apiHelper";
import IntlMessages from "@crema/utility/IntlMessages";
import { LoadingButton } from "@mui/lab";

const style = { width: 500 };
const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name should be 3 chars minimum.")
    .max(50, "Maximum 50 characters allowed"),
});

interface BasicDetailsProps {
  openModal: any;
  handleClose: any;
  type: any;
  selectedItem: any;
  setOpenModal: any;
  setType: any;
  getLists: any;
  setSelectedItem: any;
  from: any;
}

const CourseDisease: React.FC<BasicDetailsProps> = ({
  openModal,
  handleClose,
  type,
  selectedItem,
  setOpenModal,
  setType,
  getLists,
  setSelectedItem,
  from,
}) => {
  const [btnLoad, setBtnLoad] = useState(false);

  //API For create/update Course / Disease
  async function submitData(data: any) {
    const fData = {
      ...data,
      type: from === "course" ? "Course" : "Disease",
    };
    setBtnLoad(true);
    const id = selectedItem?.id;
    let url = "";
    if (type === "edit") {
      url = `course-disease/update/${id}`;
    } else {
      url = `course-disease/create`;
    }
    try {
      const resp = await getApiData(
        url,
        fData,
        type === "edit" ? "PUT" : "POST"
      );
      if (resp.success) {
        toast.success(resp.message);
        setOpenModal(false);
        setType("");
        setSelectedItem({});
        getLists({ page: 1 });
        setBtnLoad(false);
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

  let title = "";
  if (from === "course") {
    if (type === "edit") {
      title = "Update Course";
    } else {
      title = "Add Course";
    }
  } else {
    if (type === "edit") {
      title = "Update Disease";
    } else {
      title = "Add Disease";
    }
  }

  return (
    <DialogSlide
      open={openModal}
      onDeny={handleClose}
      onClose={handleClose}
      dialogTitle={title}
    >
      <Box sx={style}>
        <Formik
          validateOnChange={true}
          initialValues={{
            name: selectedItem?.row?.name || "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => submitData(values)}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            } = props;
            return (
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Enter Name"
                    name="name"
                    label="Enter Name"
                    variant="outlined"
                    onBlur={(event: any) => {
                      setFieldValue("name", values.name.trim());
                      handleBlur(event);
                    }}
                    value={values.name}
                    onChange={(event) => {
                      handleChange(event);
                      setFieldValue(
                        "name",
                        event.target.value.replace(/  +/g, " ")
                      );
                    }}
                  />
                  {errors.name && touched.name && (
                    <ErrorTextStyle>{errors.name}</ErrorTextStyle>
                  )}
                </Box>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <LoadingButton
                    size="small"
                    variant="outlined"
                    color="success"
                    type="submit"
                    disabled={btnLoad}
                    loading={btnLoad}
                  >
                    <IntlMessages id={type === "edit" ? "Update" : "Add"} />
                  </LoadingButton>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </DialogSlide>
  );
};

export default CourseDisease;
