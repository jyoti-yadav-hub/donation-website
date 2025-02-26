import React, { useEffect, useState } from "react";
import { Add, DeleteOutline, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  Breadcrumbs,
  Drawer,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { GridExpandMoreIcon } from "@mui/x-data-grid-pro";
import { Form, Formik } from "formik";
import { styled } from "@mui/material/styles";
import IntlMessages from "@crema/utility/IntlMessages";
import { isEmpty } from "lodash";
import { toast } from "react-toastify";
import getApiData from "../../../shared/helpers/apiHelper";
import { Link, useLocation } from "react-router-dom";
import AppsContainer from "@crema/core/AppsContainer";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import { AppConfirmDialog, AppLoader } from "@crema";
import ReportDynamicForm from "../report-form-dynamic";
import { LoadingButton } from "@mui/lab";

const mainSection = {
  margin: "0px",
  alignItems: "flex-start",
  borderRadius: "5px",
  marginBottom: "5px",
};

const BreadWrapper = styled(Box)(({ theme }) => ({
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
}));

const ReportForm = () => {
  const location = useLocation();
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [btnLoad, setBtnLoad] = useState(false);
  const [formList, setFormList] = React.useState<any>({
    lists: [],
    listsLoad: true,
  });
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
  const [feilds, setFeilds] = useState<any>([]);

  const formData =
    formList?.lists && !isEmpty(formList?.lists) ? formList?.lists : [];

  function NewBar() {
    return (
      <Box>
        <Button
          size="small"
          onClick={() => {
            if (!isEmpty(formList?.lists)) {
              setSelectedItem(formList?.lists[0]);
              setFeilds(
                formList?.lists && formList?.lists[0]?.form_data
                  ? JSON.parse(formList?.lists[0]?.form_data)
                  : []
              );
            }
            setType(isEmpty(formList?.lists) ? "new" : "edit");
            setOpenModal(true);
          }}
          variant="outlined"
          startIcon={isEmpty(formList?.lists) ? <Add /> : <Edit />}
          style={{ margin: "10px" }}
        >
          <IntlMessages
            id={isEmpty(formList?.lists) ? "scrumboard.addNew" : "Edit"}
          />
        </Button>
        {!isEmpty(formList?.lists) && (
          <Button
            size="small"
            onClick={() => {
              setSelectedItem(formList?.lists[0]);
              setOpen(true);
            }}
            variant="outlined"
            startIcon={<DeleteOutline />}
            style={{ margin: "10px" }}
          >
            <IntlMessages id={"Delete"} />
          </Button>
        )}
      </Box>
    );
  }

  //API For get report form list
  async function getFormList(nData) {
    setFormList((e) => ({ ...e, listsLoad: true }));
    try {
      nData.type =
        location?.pathname === "/event-report-form"
          ? "event"
          : location?.pathname === "/judge-report-form"
          ? "judge"
          : location?.pathname === "/organizer-report-form"
          ? "organizer"
          : location?.pathname === "/audience-report-form"
          ? "audience"
          : "participant";
      const res = await getApiData(`report-form/list`, nData);
      if (res.success) {
        setFormList({
          lists: res.data[0].form_data?.length > 0 ? res.data : [],
          listsLoad: false,
        });
      } else {
        setFormList({ lists: [], listsLoad: false });
        toast.error(res.message);
      }
    } catch (error) {
      setFormList({ lists: [], listsLoad: false });
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getFormList({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //API For delete report form
  async function deleteList(item: any) {
    setDltLoad(true);
    try {
      const id = item;
      const res = await getApiData(`report-form/delete/${id}`, "", "DELETE");
      if (res.success) {
        setOpen(false);
        getFormList({ page: 1 });
        setSelectedItem({});
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setDltLoad(false);
    } catch (error) {
      setDltLoad(false);
      console.log("delete error", error);
      toast.error("Something went wrong");
    }
  }

  //API For create/update report form
  async function submitData(data: any) {
    if (isEmpty(feilds)) {
      toast.error("Please add form details");
    } else {
      const fData = {
        ...data,
        type:
          location?.pathname === "/event-report-form"
            ? "event"
            : location?.pathname === "/judge-report-form"
            ? "judge"
            : location?.pathname === "/organizer-report-form"
            ? "organizer"
            : location?.pathname === "/audience-report-form"
            ? "audience"
            : "participant",
        form_data: JSON.stringify(feilds),
      };
      setBtnLoad(true);
      const id = selectedItem?._id;
      let url = "";
      if (type === "edit") {
        url = `report-form/update/${id}`;
      } else {
        url = `report-form/create`;
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
          getFormList({ page: 1 });
          setFeilds([]);
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
  }

  const handleClose = () => {
    setOpenModal(false);
    setType("");
    setSelectedItem({});
    setFeilds([]);
  };

  const optionForm = (k) => {
    if (!isEmpty(k)) {
      return (
        <Grid container spacing={2}>
          {/* input_name / title */}
          <Grid item xs={4} xl={2}>
            <TextField
              disabled
              label="Input placeholder"
              fullWidth
              size="small"
              defaultValue={k.input_place_holder}
            />
          </Grid>
          {/* min */}
          <Grid item xs={4} lg={2} xl={2}>
            <TextField
              disabled
              label="Minimun Length"
              size="small"
              fullWidth
              defaultValue={k.min}
            />
          </Grid>
          {/* max */}
          <Grid item xs={4} lg={2} xl={2}>
            <TextField
              disabled
              label="Maximum Length"
              type="number"
              onWheel={(e: any) => e.target.blur()}
              size="small"
              fullWidth
              defaultValue={k.max}
            />
          </Grid>
          {/* is_required */}
          <Grid item xs={4} lg={2}>
            <FormControlLabel
              control={
                <Checkbox
                  disabled
                  defaultChecked={k.is_required}
                  size="small"
                />
              }
              label="Is required"
            />
          </Grid>
        </Grid>
      );
    } else {
      return;
    }
  };

  const displayForm = (ques: any, i: any) => {
    if (!isEmpty(ques)) {
      return (
        <Accordion
          sx={{
            mb: 3,
            backgroundColor: "rgba(229, 246, 253, 0.5)",
            borderRadius: "5px",
            borderWidth: "1px",
            borderColor: "rgba(229, 246, 253, 0.5)",
            boxShadow: "none",
            overflow: "hidden",
            pb: 0,
          }}
        >
          <AccordionSummary
            expandIcon={<GridExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography sx={{ fontWeight: "400", fontSize: "14px" }}>
              {ques.title || `Title ${i + 1}`}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: "0px 15px 0px 0px" }}>
            <Grid container spacing={2} key={ques.id} style={mainSection}>
              <Grid item xs={4}>
                <TextField
                  disabled
                  label="Option Title"
                  fullWidth
                  defaultValue={ques.title}
                  size="small"
                />
              </Grid>
              {/* this_is_answer */}
              <Grid item xs={2} lg={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled
                      defaultChecked={ques.this_is_answer}
                      checked={ques.this_is_answer}
                      size="small"
                    />
                  }
                  label="This is Answer"
                />
              </Grid>
              <Grid item xs={2} lg={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled
                      defaultChecked={ques.other}
                      checked={ques.other}
                      size="small"
                    />
                  }
                  label="Other Option"
                />
              </Grid>

              {ques.other && (
                <Grid item xs={12}>
                  {optionForm(ques.other_input_data)}
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      );
    }
  };

  return (
    <AppsContainer
      title={
        location?.pathname === "/event-report-form"
          ? "Event Form"
          : location?.pathname === "/judge-report-form"
          ? "Judge Form"
          : location?.pathname === "/organizer-report-form"
          ? "Organizer Form"
          : location?.pathname === "/audience-report-form"
          ? "Audience Form"
          : "Participant Form"
      }
      fullView
      sxStyle={{ margin: 0, padding: "10px 0px 10px 10px" }}
    >
      <AppsHeader>
        <div style={{ display: "flex", alignItems: "center" }}>
          <BreadWrapper>
            <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "20px 0px" }}>
              <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                Dashboards
              </Link>
              <Typography color="text.primary">
                {location?.pathname === "/event-report-form"
                  ? "Event Forms"
                  : location?.pathname === "/judge-report-form"
                  ? "Judge Forms"
                  : location?.pathname === "/organizer-report-form"
                  ? "Organizer Forms"
                  : location?.pathname === "/audience-report-form"
                  ? "Audience Forms"
                  : "Participant Forms"}
              </Typography>
            </Breadcrumbs>
          </BreadWrapper>
        </div>
      </AppsHeader>
      {formList?.listsLoad ? null : NewBar()}

      <Box sx={{ mr: 3, ml: 3, overflowX: "hidden", overflowY: "auto" }}>
        {formList?.listsLoad ? (
          <AppLoader />
        ) : formData && !isEmpty(formData) ? (
          <>
            {formData?.map((item: any, index: number) => {
              if (index >= 1) {
                return null;
              }

              return JSON.parse(item.form_data)?.map((ques: any, i: any) => {
                return displayForm(ques, i);
              });
            })}
          </>
        ) : (
          <Box sx={{ textAlign: "center", m: 5 }}>No Data</Box>
        )}
      </Box>

      <Drawer
        sx={{
          zIndex: 1000002,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: { lg: "calc(100vw - 10%)", xl: "calc(100vw - 30%)" },
            boxSizing: "border-box",
          },
        }}
        anchor="right"
        open={openModal}
        onClose={handleClose}
      >
        <DialogTitle sx={{ fontSize: "18px" }}>
          <Typography variant="h4">
            {type === "edit" ? "Update Form" : "Add Form"}
          </Typography>
        </DialogTitle>
        <Formik
          validateOnChange={true}
          initialValues={{
            form_data: selectedItem?.row?.form_data || "",
          }}
          onSubmit={(values) => submitData(values)}
        >
          {(props) => {
            const { handleSubmit } = props;
            return (
              <Form
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
                style={{ height: "100%" }}
              >
                <DialogContent sx={{ pb: "10px" }}>
                  <ReportDynamicForm
                    btnDisabled={btnDisabled}
                    setBtnDisabled={setBtnDisabled}
                    setFeilds={setFeilds}
                    feilds={feilds}
                  />
                </DialogContent>
                <DialogActions
                  sx={{
                    padding: "16px",
                    width: { lg: "calc(100vw - 10%)", xl: "calc(100vw - 30%)" },
                    position: "fixed",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "white",
                    zIndex: 10,
                  }}
                >
                  <LoadingButton
                    size="small"
                    variant="outlined"
                    color="success"
                    type="submit"
                    disabled={btnLoad || btnDisabled}
                    loading={btnLoad}
                  >
                    <IntlMessages
                      id={type === "edit" ? "common.update" : "Create"}
                    />
                  </LoadingButton>
                  <Button size="small" variant="outlined" onClick={handleClose}>
                    Cancel
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </Drawer>

      <AppConfirmDialog
        open={open}
        disabled={dltLoad}
        loading={dltLoad}
        onDeny={() => {
          setDltLoad(false);
          setSelectedItem({});
          setOpen(false);
        }}
        onConfirm={() => deleteList(selectedItem?._id)}
        title="Are you sure you want to delete this form?"
        dialogTitle="Delete Form"
      />
    </AppsContainer>
  );
};

export default ReportForm;
