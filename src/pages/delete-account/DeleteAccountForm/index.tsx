import React, { useEffect, useImperativeHandle, useRef } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { cloneDeep, isArray, isEmpty, size, get } from "lodash";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import SimpleBarReact from "simplebar-react";

const displayRight = { display: "flex", justifyContent: "end" };

const ScrollbarWrapper = styled(SimpleBarReact)(() => {
  return {
    maxHeight: "calc(100vh - 160px)",
  };
});

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const mainSection = {
  margin: "0px",
  alignItems: "flex-start",
  borderRadius: "5px",
};

interface DeleteAccountFormProps {
  setFeilds: (data: any) => void;
  feilds: any;
  btnDisabled: boolean;
  setBtnDisabled: (data: any) => void;
}

const DeleteAccountForm: React.FC<DeleteAccountFormProps> = ({
  setFeilds,
  feilds,
  btnDisabled,
  setBtnDisabled,
}) => {
  const quesData = [];
  const ref = useRef<any>(null);

  useEffect(() => {
    if (!isEmpty(quesData)) {
      const getQ = cloneDeep(quesData);
      setFeilds(getQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feilds]);

  const mainSectionData = {
    title: "",
    this_is_answer: true,
    other: false,
    other_input_data: {
      input_place_holder: "",
      min: 1,
      max: 255,
      is_required: true,
    },
    inputs: [],
    id: v4(),
  };

  const remove = (quesKey, indexes) => {
    let ques: any = isArray(feilds) ? [...feilds] : [];
    const updatedQuesArry = [...ques];
    updatedQuesArry.forEach(function iter(a, index, object) {
      if (a.id === quesKey) {
        object.splice(index, 1);
      }
      Array.isArray(a.inputs) && a.inputs.forEach(iter);
    });
    setFeilds(updatedQuesArry);
  };

  // Add section in Form
  const add = () => {
    let ques = isArray(feilds) ? [...feilds] : [];
    if (!isEmpty(ques)) {
      ques.push(mainSectionData);
    } else {
      ques = [mainSectionData];
    }
    setFeilds(ques);
  };

  // Add input in Form
  const addFormInput = (index, indexes) => {
    let ques = isArray(feilds) ? [...feilds] : [];
    if (isEmpty(ques) || isEmpty(ques[index])) {
      toast.error("Something is missing");
    } else {
      if (!isEmpty(indexes) && indexes.length > 1) {
        let strURL = "";
        // eslint-disable-next-line array-callback-return
        indexes.map((key, ind) => {
          if (ind > 0) {
            strURL += `inputs[${key}]`;
          }
        });
        let uData: any = get(ques[indexes[0]], strURL);
        if (!isEmpty(uData)) {
          uData?.inputs?.push(mainSectionData);
          uData.this_is_answer = false;
          uData.other = false;
        }
      } else {
        ques[index].inputs.push(mainSectionData);
        ques[index].this_is_answer = false;
        ques[index].other = false;
      }
      // setBtnDisabled(true);
      setFeilds(ques);
    }
  };

  // On data change
  const onChangeValue = (
    type: any,
    title: any,
    value: any,
    i1: any,
    indexes: any,
    itemUniqueId: string = ""
  ) => {
    let ques = isArray(feilds) ? [...feilds] : [];

    if (isEmpty(ques) || isEmpty(ques[i1])) {
      toast.error("Something is missing");
      setBtnDisabled(true);
    } else {
      const updatedQuesArry = [...ques];
      setBtnDisabled(false);
      updatedQuesArry.forEach(function iter(a) {
        if (a.id === itemUniqueId) {
          if (title === "this_is_answer" && value === true) {
            a["other"] = false;
            a[title] = value;
            a.inputs = [];
          }
          if (title === "other" && value === true) {
            a[title] = value;
            a.inputs = [];
          } else {
            if (type === "other_input_data") {
              a.other_input_data[title] = value;
            } else {
              a.other_input_data["input_place_holder"] = "";
              a.other_input_data["min"] = 1;
              a.other_input_data["max"] = 255;
              a.other_input_data["is_required"] = true;
              a[title] = value;
            }
          }
        }
        Array.isArray(a.inputs) && a.inputs.forEach(iter);
      });
      setFeilds(updatedQuesArry);
    }
  };

  useImperativeHandle(ref, () => ({
    getQuestionAnswer() {
      return feilds;
    },
  }));

  const optionForm = (k, i, indexes, id) => {
    if (!isEmpty(k)) {
      return (
        <Grid container spacing={2}>
          {/* input_name / title */}
          <Grid item xs={4} xl={2}>
            <TextField
              error={isEmpty(k.input_place_holder) ? true : false}
              label="Input placeholder"
              fullWidth
              size="small"
              defaultValue={k.input_place_holder}
              onChange={(e) => {
                onChangeValue(
                  "other_input_data",
                  "input_place_holder",
                  e.target.value,
                  i,
                  indexes,
                  id
                );
              }}
              helperText={
                isEmpty(k.input_place_holder)
                  ? "Place holder for other input is require"
                  : ""
              }
            />
          </Grid>
          {/* min */}
          <Grid item xs={4} lg={2} xl={2}>
            <TextField
              error={k.is_required && k.min === 0 ? true : false}
              label="Minimun Length"
              type="number"
              onWheel={(e: any) => e.target.blur()}
              size="small"
              onChange={(e) => {
                onChangeValue(
                  "other_input_data",
                  "min",
                  parseInt(e.target.value) || 0,
                  i,
                  indexes,
                  id
                );
              }}
              fullWidth
              defaultValue={k.min}
              helperText={
                k.is_required && k.min === 0
                  ? "Value must be greater than 1"
                  : ""
              }
            />
          </Grid>
          {/* max */}
          <Grid item xs={4} lg={2} xl={2}>
            <TextField
              label="Maximum Length"
              type="number"
              onWheel={(e: any) => e.target.blur()}
              onChange={(e) => {
                onChangeValue(
                  "other_input_data",
                  "max",
                  parseInt(e.target.value),
                  i,
                  indexes,
                  id
                );
              }}
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
                  onChange={(e) => {
                    onChangeValue(
                      "other_input_data",
                      "is_required",
                      e.target.checked,
                      i,
                      indexes,
                      id
                    );
                  }}
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

  const displayForm = (ques: any, i: any, indexes: any) => {
    if (isEmpty(ques.title)) {
      setBtnDisabled(true);
    }
    if (!isEmpty(ques)) {
      indexes.push(i);
      return (
        <Accordion
          sx={{
            mt: 2,
            backgroundColor: "rgba(229, 246, 253, 0.5)",
            borderRadius: "5px",
            borderWidth: "1px",
            borderColor: "rgba(229, 246, 253, 0.5)",
            boxShadow: "-4px 4px 5px -3px rgb(0 0 0 / 20%)",
            overflow: "hidden",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
              {ques.title || `Option ${i + 1}`}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: "0px 15px 0px 0px" }}>
            <Grid container spacing={2} key={ques.id} style={mainSection}>
              {/* Option Title */}
              <Grid item xs={4}>
                <TextField
                  label="Option Title"
                  fullWidth
                  onChange={(e) =>
                    onChangeValue(
                      "main",
                      "title",
                      e.target.value,
                      i,
                      indexes,
                      ques.id
                    )
                  }
                  defaultValue={ques.title}
                  size="small"
                  placeholder="Option title"
                />
                <ErrorTextStyle>
                  {isEmpty(ques.title) ? "Option Title is required" : ""}
                </ErrorTextStyle>
              </Grid>
              {/* this_is_answer */}
              <Grid item xs={2} lg={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) =>
                        onChangeValue(
                          "main",
                          "this_is_answer",
                          e.target.checked,
                          i,
                          indexes,
                          ques.id
                        )
                      }
                      defaultChecked={ques.this_is_answer}
                      checked={ques.this_is_answer}
                      size="small"
                    />
                  }
                  label="This is Answer"
                />
              </Grid>
              {/* Other Option */}
              <Grid item xs={2} lg={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={ques.this_is_answer}
                      onChange={(e) =>
                        onChangeValue(
                          "main",
                          "other",
                          e.target.checked,
                          i,
                          indexes,
                          ques.id
                        )
                      }
                      defaultChecked={ques.other}
                      checked={ques.other}
                      size="small"
                    />
                  }
                  label="Other Option"
                />
              </Grid>
              {/* Add / Remove Input Button */}
              <Grid item xs={4} style={displayRight}>
                <Button
                  variant="contained"
                  sx={{ marginRight: "10px" }}
                  onClick={() => addFormInput(i, indexes)}
                  size="small"
                >
                  <Add /> Add Input
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => remove(ques.id, indexes)}
                >
                  <Remove /> Remove Section
                </Button>
              </Grid>

              {ques?.other && (
                <Grid item xs={12}>
                  {optionForm(ques.other_input_data, i, indexes, ques.id)}
                </Grid>
              )}

              {ques?.inputs && (
                <Grid item xs={12} sx={{ mb: "10px" }}>
                  {ques?.inputs.map((ques1: any, ii: any) => {
                    return displayForm(ques1, ii, indexes);
                  })}
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      );
    } else {
      return;
    }
  };

  return (
    <ScrollbarWrapper>
      <Grid
        sx={{
          ml: 2,
          mt: 2,
          mb: 2,
          "& .Mui-expanded": { mt: 2 },
          "& .MuiAccordionSummary-content.Mui-expanded": { margin: "10px 0px" },
          "& .MuiPaper-root-MuiAccordion-root::before": {
            backgroundColor: "transparent !important",
          },
          "& .MuiButtonBase-root-MuiAccordionSummary-root.Mui-expanded": {
            minHeight: "auto",
          },
          "& .MuiAccordionDetails-root": {
            paddingTop: "10px",
          },
        }}
      >
        <Grid style={displayRight}>
          {!isEmpty(feilds) && size(feilds) >= 10 ? null : (
            <Button variant="contained" onClick={add} size="small">
              <Add /> Add Form
            </Button>
          )}
        </Grid>

        {feilds.map((ques: any, i: any) => {
          return displayForm(ques, i, []);
        })}
      </Grid>
    </ScrollbarWrapper>
  );
};

export default DeleteAccountForm;
