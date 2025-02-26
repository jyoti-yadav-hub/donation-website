import React, { useImperativeHandle, useRef, useState, useEffect } from "react";
import { isArray, isEmpty, includes } from "lodash";
import {
  Add,
  Cancel,
  ControlPointOutlined,
  CreateOutlined,
  DoneOutlined,
  // DragHandleOutlined,
  Remove,
  RemoveCircleOutlineOutlined,
} from "@mui/icons-material";
import {
  Grid,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  styled,
  Typography,
  Button,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  // SortableContainer,
  SortableElement,
  SortableElementProps,
  // SortableHandle,
} from "react-sortable-hoc";
import { OnSortEndHandler, subItemProps } from "./SortableList";
import { getInputSlug } from "shared/helpers/utility";
import { v4 } from "uuid";
import DialogSlide from "components/DialogSlide";
import IntlMessages from "@crema/utility/IntlMessages";
import { Field } from "formik";
import DateTimePicker from "@mui/lab/DateTimePicker";
import DatePicker from "@mui/lab/DatePicker";

import moment from "moment";
import { AppConfirmDialog, AppGrid, AppLoader } from "@crema";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const style = { width: 500 };

type OwnProps = {
  item: any;
  inputs?: subItemProps | any;
  parantIndex: number[];
  currentIndex: number;
  sortEndHandler: OnSortEndHandler;
  i?: any;
  feilds?: any;
  setFeilds?: any;
  setBtnDisabled?: any;
  btnDisabled?: boolean;
  isEdit?: any;
};

type Props = OwnProps & Partial<SortableElementProps>;

// const DragHandler = SortableHandle(() => (
//   <DragHandleOutlined sx={{ zIndex: 1000002, fontSize: "20px" }} />
// ));

const mainSection = {
  margin: "0px",
  alignItems: "flex-start",
  borderRadius: "5px",
};

const subSection = {
  margin: "10px 0",
  width: "100%",
  padding: 10,
  alignItems: "flex-start",
  border: "1px solid #bdbdbd",
  borderRadius: "5px",
  "& :last-child": { marginBottom: 0 },
};

const displayRight = { display: "flex", justifyContent: "end" };
const removeBtn = { display: "flex", justifyContent: "end", height: "40px" };

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const SortableItem: React.FC<Props> = ({
  item,
  inputs,
  parantIndex,
  currentIndex,
  sortEndHandler,
  feilds,
  setFeilds,
  setBtnDisabled,
  btnDisabled,
  i,
  isEdit,
}) => {
  let ques = item;
  const ref = useRef<any>(null);
  const [openId, setOpenID] = useState<any>("");
  const [values, setValues] = useState<boolean>(false);
  const [otherValues, setOtherValues] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectIndex, setSelectIndex] = useState<any>(-1);
  const [indexData, setIndexData] = useState<any>([]);
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("");
  const [isRevertedDate, setIsRevertedDate] = React.useState(false);
  const [dltLoad, setDltLoad] = React.useState<any>(false);
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    if (isEmpty(ques.title) || isEmpty(ques?.help_title)) {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feilds, inputs]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  useImperativeHandle(ref, () => ({
    getQuestionAnswer() {
      return feilds;
    },
  }));

  const handleClickShow = (i, index) => {
    let ques = isArray(feilds) ? [...feilds] : [];
    setValues(!values && ques[i].inputs[index].id);
  };

  const openResetDateValidation = () => {
    setOpen(true);
  };
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const closeDatePicker = () => {
    setDatePickerOpen(false);
  };
  const handleOtherClickShow = (i, index, indx) => {
    let ques = isArray(feilds) ? [...feilds] : [];
    setOtherValues(!otherValues && ques[i]?.inputs[index]?.other_inputs[indx]);
  };

  const subSectionData = {
    title: "",
    other_inputs: [],
    input_type: "",
    input_slug: null,
    is_required: true,
    add_suffix: false,
    is_disabled: false,
    is_other_dependant: false,
    is_other_lable: false,
    is_beside_main_title: false,
    other_label_value: "",
    display_joint_name: false,
    merge_string: "",
    string_to_be_replace: "",
    second_merge_string: "",
    dependant_type: "",
    is_date_greater: "",
    greater_than_date: "",
    other_dependant_type: "",
    dependant_value: "",
    other_dependant_value: "",
    is_accordian: true,
    is_display: false,
    is_mobile: false,
    is_inline: false,
    other_input: false,
    min: 0,
    max: 0,
    options: [""],
    file_type: "",
    file_size: 0,
    video_duration: 0,
    file_access_type: [],
    file_tag: "",
    num_of_row: 0,
    multiselect: false,
    id: v4(),
    prefix: "",
    suffix: "",
    key: "",
    clear_input: false,
    clear_input_on: "",
  };

  const otherSubSectionData = {
    other_title: "",
    other_input_slug: null,
    other_input_type: "",
    other_min: 0,
    other_is_required: true,
    other_max: 0,
  };

  const typeDropArr = [
    { id: "string", name: "String" },
    { id: "level", name: "Level" },
    { id: "number", name: "Number" },
    { id: "label", name: "Label" },
    { id: "date", name: "Date" },
    { id: "dateTime", name: "Date-Time" },
    { id: "location", name: "Location" },
    { id: "password", name: "Password" },
    { id: "email", name: "Email" },
    { id: "textarea", name: "Text area" },
    { id: "radio", name: "Radio" },
    { id: "checkbox", name: "Checkbox" },
    { id: "select", name: "Dropdown" },
    { id: "file", name: "File" },
  ];

  const positionArr = [
    { id: "above", name: "Above the title" },
    { id: "below", name: "Below the title" },
    { id: "left", name: "To left side of title" },
    { id: "right", name: "To right side of title" },
  ];

  const fileTypeArr = [
    { id: "photo", name: "Photo" },
    { id: "pdf", name: "PDF" },
    { id: "video", name: "Video" },
  ];

  const accessTypeArr = [
    { id: "*/*", name: "All Files" },
    { id: "text/csv", name: "CSV" },
    { id: "application/msword", name: "DOC" },
    {
      id: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "DOCx",
    },
    { id: "image/*", name: "Images" },
    { id: "application/pdf", name: "PDF" },
    { id: "text/plain", name: "Plain Text" },
    { id: "application/vnd.ms-powerpoint", name: "PPT" },
    {
      id: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      name: "PPTx",
    },
  ];

  const fileTagArr = [
    { id: "front", name: "Front" },
    { id: "back", name: "Back" },
  ];

  const otherInputtypeArr = [
    { id: "string", name: "String" },
    { id: "textarea", name: "Text area" },
    { id: "number", name: "Number" },
    { id: "checkbox", name: "Checkbox" },
    { id: "location", name: "Location" },
  ];

  // On data change
  const onChangeValue = (type, title, value, i1, i2 = 0, i3 = 0) => {
    let ques = isArray(feilds) ? [...feilds] : [];
    if (isEmpty(ques) || isEmpty(ques[i1])) {
      toast.error("Something is missing");
    } else {
      let isDisable = true;
      if (type === "main") {
        ques[i1][title] = value;
      } else if (type === "sub") {
        if (title === "is_other_lable" && value === false) {
          ques[i1].inputs[i2]["is_beside_main_title"] = false;
          ques[i1].inputs[i2]["other_label_value"] = "";
          ques[i1].inputs[i2]["is_other_lable"] = false;
        } else if (title === "file_type") {
          if (value === "video") {
            ques[i1].inputs[i2]["file_access_type"] = [];
            ques[i1].inputs[i2]["file_tag"] = "";
            ques[i1].inputs[i2][title] = value;
          } else if (value === "pdf") {
            ques[i1].inputs[i2]["video_duration"] = 0;
            ques[i1].inputs[i2]["file_tag"] = "";
            ques[i1].inputs[i2][title] = value;
          } else {
            ques[i1].inputs[i2]["video_duration"] = 0;
            ques[i1].inputs[i2]["file_access_type"] = [];
            ques[i1].inputs[i2][title] = value;
          }
        } else if (title === "input_type" && value !== "dateTime") {
          ques[i1].inputs[i2]["is_date_greater"] = false;
          ques[i1].inputs[i2]["greater_than_date"] = "";
          ques[i1].inputs[i2]["less_than_date"] = "";
          ques[i1].inputs[i2][title] = value;
          ques[i1].inputs[i2][title] = value;
        } else if (title === "is_date_greater" && value === false) {
          ques[i1].inputs[i2]["greater_than_date"] = "";
          ques[i1].inputs[i2]["less_than_date"] = "";
          ques[i1].inputs[i2][title] = value;
        } else {
          ques[i1].inputs[i2][title] = value;
          if (isRevertedDate === true) {
            if (title === "maxDate") {
              ques[i1].inputs[i2]["minDate"] = "";
              setIsRevertedDate(false);
            }
          }
        }
      } else if (type === "subSub") {
        ques[i1].inputs[i2][title][i3] = value;
      } else if (type === "otherSubInputs") {
        ques[i1].inputs[i2].other_inputs[i3][title] = value;
      } else if (type === "other_sub_input_slug") {
        const newVal = getInputSlug(value);
        ques[i1].inputs[i2].other_inputs[i3].other_input_slug = newVal;
        ques[i1].inputs[i2].other_inputs[i3][title] = value;
      } else if (type === "sub_input_slug") {
        const newVal = getInputSlug(value);
        ques[i1].inputs[i2].input_slug = newVal;
        ques[i1].inputs[i2][title] = value;
      } else if (type === "edited_input_slug") {
        const newVal = value ? getInputSlug(value) : "";
        ques[i1].inputs[i2].input_slug = newVal;
        ques[i1].inputs[i2][title] = value;
      } else if (type === "other_edited_input_slug") {
        const newVal = getInputSlug(value);
        ques[i1].inputs[i2].other_inputs[i3].other_input_slug = newVal;
        ques[i1].inputs[i2].other_inputs[i3][title] = value;
      }
      // else if (type === "other_sub_input_slug") {
      //   const newVal = getInputSlug(value);
      //   ques[i1].inputs[i2].other_inputs[i3].other_input_slug = newVal;
      //   ques[i1].inputs[i2].other_inputs[i3][title] = value;
      // } else if (type === "other_edited_input_slug") {
      //   const newVal = getInputSlug(value);
      //   ques[i1].inputs[i2].other_inputs[i3].other_input_slug = newVal;
      //   ques[i1].inputs[i2].other_inputs[i3][title] = value;
      // }

      if (type === "sub" || type === "sub_input_slug") {
        isDisable = isEmpty(
          ques[i1].inputs.filter((it) =>
            includes(
              ["string", "number", "email", "textarea", "file"],
              it.input_type
            )
              ? isEmpty(it.title) ||
                isEmpty(it.input_type) ||
                (it.min < 1 && it.is_required)
              : isEmpty(it.title) || isEmpty(it.input_type)
          )
        );
        setBtnDisabled(isDisable ? false : true);
      }
      setFeilds(ques);
    }
  };

  // Add input in Form
  const addFormInput = (
    index: any,
    is_accordian: any,
    from: any,
    position: any
  ) => {
    let ques = isArray(feilds) ? [...feilds] : [];
    if (isEmpty(ques) || isEmpty(ques[index])) {
      toast.error("Something is missing");
    } else {
      if (is_accordian) {
        if (from === "modal" && position > -1 && !isEmpty(value)) {
          ques[index].inputs.splice(
            value === "below" ? position + 1 : position,
            0,
            {
              ...subSectionData,
              is_accordian: true,
              is_required: true,
            }
          );
        } else {
          ques[index].inputs.push({
            ...subSectionData,
            is_accordian: true,
            is_required: true,
          });
        }
      } else {
        if (from === "modal" && position > -1 && !isEmpty(value)) {
          ques[index].inputs.splice(
            value === "below" ? position + 1 : position,
            0,
            {
              ...subSectionData,
              is_accordian: false,
              is_required: false,
            }
          );
        } else {
          ques[index].inputs.push({
            ...subSectionData,
            is_accordian: false,
            is_required: false,
          });
        }
      }
      const isDisable = isEmpty(
        ques[index].inputs.filter(
          (it) => isEmpty(it.input_type) || isEmpty(it.title)
        )
      );
      setBtnDisabled(isDisable ? false : true);
      setFeilds(ques);
    }
  };

  // Remove input in Form
  const removeFormInput = (index, inputId) => {
    let ques = isArray(feilds) ? [...feilds] : [];
    let newArry = ques;
    if (
      isEmpty(ques) ||
      isEmpty(ques[index]) ||
      isEmpty(ques[index].inputs) ||
      // eslint-disable-next-line eqeqeq
      ques[index].inputs["id"] == inputId
    ) {
      toast.error("Something is missing");
    } else {
      newArry[index].inputs = ques[index].inputs.filter(
        (i) => i.id !== inputId
      );
      setFeilds(newArry);
    }
  };

  // Remove option in list
  const removeOtherInputs = (i1, i2, i3, value) => {
    let ques = isArray(feilds) ? [...feilds] : [];
    let newArry = ques;

    if (isEmpty(ques) || isEmpty(ques[i1])) {
      toast.error("Something is missing");
    } else {
      newArry[i1].inputs[i2].other_inputs = ques[i1].inputs[
        i2
      ].other_inputs.filter((_, i) => i !== i3);
      setFeilds(newArry);
    }
  };

  // Add option in list
  const addMoreOtherInput = (k, i, index) => {
    let ques = isArray(feilds) ? [...feilds] : [];
    if (isEmpty(ques) || isEmpty(ques[i])) {
      toast.error("Something is missing");
    } else {
      ques[i]?.inputs[index]?.other_inputs?.push(otherSubSectionData);
      setFeilds(ques);
    }
  };

  // Add option in list
  const addOption = (i1, i2) => {
    let ques = isArray(feilds) ? [...feilds] : [];
    if (isEmpty(feilds) || isEmpty(feilds[i1])) {
      toast.error("Something is missing");
    } else {
      ques[i1].inputs[i2].options.push("");
      setFeilds(ques);
    }
  };

  // Remove option in list
  const removeOption = (i1, i2, i3, value) => {
    let ques = isArray(feilds) ? [...feilds] : [];
    let newArry = ques;
    if (isEmpty(ques) || isEmpty(ques[i1])) {
      toast.error("Something is missing");
    } else {
      newArry[i1].inputs[i2].options = ques[i1].inputs[i2].options.filter(
        (_, i) => i !== i3
      );
      setFeilds(newArry);
    }
  };

  const displayOption = (data, options, i, index) => {
    if (!isEmpty(options)) {
      return (
        <Grid container style={{ padding: "0 10px" }} spacing={2}>
          {options.map((optionValue, optionIndex) => {
            return (
              <Grid item xs={3} sx={{ mt: 1.5 }}>
                <TextField
                  label={"Option " + (optionIndex + 1)}
                  fullWidth
                  size="small"
                  defaultValue={optionValue}
                  onChange={(e) =>
                    onChangeValue(
                      "subSub",
                      "options",
                      e.target.value,
                      i,
                      index,
                      optionIndex
                    )
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <InputAdornment position="end">
                          {data.suffix ? data.suffix : ""}
                        </InputAdornment>
                        <Cancel
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            removeOption(i, index, optionIndex, optionValue)
                          }
                        />
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">
                        {data.prefix ? data.prefix : ""}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      );
    }
    return;
  };

  const displayOtherInputs = (data, other_inputs, i, index) => {
    if (!isEmpty(other_inputs)) {
      return (
        <>
          {other_inputs?.map((itm, indx) => {
            let otherEditedSlug =
              itm && itm.other_input_slug
                ? getInputSlug(itm.other_input_slug)
                : "";
            return (
              <Grid container spacing={2} sx={{ m: 0, width: "100%" }} xs={12}>
                {/* Other Select input type */}
                <Grid item xs={6} lg={3} xl={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-select-small">
                      Select input type
                    </InputLabel>
                    <Select
                      MenuProps={{ style: { zIndex: 1000002 } }}
                      label="Select input type"
                      labelId="demo-select-small"
                      id="demo-select-small"
                      defaultValue={itm.other_input_type}
                      onChange={(e) => {
                        onChangeValue(
                          "otherSubInputs",
                          "other_input_type",
                          e.target.value,
                          i,
                          index,
                          indx
                        );
                      }}
                    >
                      {otherInputtypeArr.map((item) => (
                        <MenuItem value={item.id} key={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Other Input name */}
                <Grid item xs={6} lg={3} xl={3}>
                  <TextField
                    label="Input name"
                    fullWidth
                    size="small"
                    defaultValue={itm.other_title}
                    onChange={(e) =>
                      onChangeValue(
                        "other_sub_input_slug", //other_sub_input_slug => change when other input slug implemented
                        "other_title",
                        e.target.value,
                        i,
                        index,
                        indx
                      )
                    }
                  />
                </Grid>

                {/* other_input_slug */}
                <Grid item xs={6} lg={3} xl={3}>
                  <FormControl size="small" variant="outlined" fullWidth>
                    <OutlinedInput
                      disabled={
                        otherValues !==
                        feilds[i]?.inputs[index]?.other_inputs[indx]
                      }
                      fullWidth
                      value={itm.other_input_slug}
                      onChange={(e) => {
                        if (otherValues) {
                          onChangeValue(
                            "other_edited_input_slug",
                            "other_input_slug",
                            e.target.value,
                            i,
                            index,
                            indx
                          );
                        } else {
                          onChangeValue(
                            "otherSubInputs",
                            "other_input_slug",
                            e.target.value,
                            i,
                            index,
                            indx
                          );
                        }
                      }}
                      placeholder={"Other Input slug"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              onChangeValue(
                                "other_edited_input_slug",
                                "other_input_slug",
                                otherEditedSlug,
                                i,
                                index,
                                indx
                              );
                              handleOtherClickShow(i, index, indx);
                            }}
                            edge="end"
                          >
                            {otherValues ===
                            feilds[i]?.inputs[index]?.other_inputs[indx] ? (
                              <DoneOutlined sx={{ fontSize: 15 }} />
                            ) : (
                              <CreateOutlined sx={{ fontSize: 15 }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  {otherValues ===
                    feilds[i]?.inputs[index]?.other_inputs[indx] && (
                    <Grid item xs={12}>
                      <Typography
                        sx={{ margin: "0px 5px 15px", fontWeight: 500 }}
                        variant="body2"
                      >
                        Edited slug: {otherEditedSlug}
                      </Typography>
                    </Grid>
                  )}
                </Grid>

                {/* Remove Button */}
                <Grid
                  item
                  xs={2}
                  lg={3}
                  xl={3}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    color="error"
                    size="small"
                    variant="outlined"
                    style={{ minWidth: 30 }}
                    onClick={() => removeOtherInputs(i, index, indx, itm)}
                  >
                    <Remove />
                  </Button>
                </Grid>

                {/* is_required */}
                <Grid item xs={2} lg={3} xl={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => {
                          onChangeValue(
                            "otherSubInputs",
                            "other_is_required",
                            e.target.checked,
                            i,
                            index,
                            indx
                          );
                        }}
                        defaultChecked={itm.other_is_required}
                        size="small"
                      />
                    }
                    label="Is Required"
                  />
                </Grid>

                {/* is_other_dependant */}
                <Grid item xs={3} lg={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => {
                          onChangeValue(
                            "otherSubInputs",
                            "is_other_dependant",
                            e.target.checked,
                            i,
                            index,
                            indx
                          );
                        }}
                        defaultChecked={itm.is_other_dependant}
                        size="small"
                      />
                    }
                    label="Display this input when"
                  />
                </Grid>

                {/* select depends on */}
                <Grid item xs={3} lg={3}>
                  {itm.is_other_dependant && (
                    <FormControl fullWidth size="small">
                      <InputLabel htmlFor="grouped-select">
                        Select depends on
                      </InputLabel>
                      <Select
                        MenuProps={{
                          style: {
                            zIndex: 1000002,
                            maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
                          },
                        }}
                        label="Select depends on"
                        id="grouped-select"
                        defaultValue={itm.other_dependant_type}
                        onChange={(e) => {
                          onChangeValue(
                            "otherSubInputs",
                            "other_dependant_type",
                            e.target.value,
                            i,
                            index,
                            indx
                          );
                        }}
                      >
                        {/* {outerFeilds?.map((it: any) => (
                        <MenuItem value={it.input_slug} key={it.id}>
                          {it.title}
                        </MenuItem>
                      ))} */}
                        {data?.options?.map((it: any) => {
                          return (
                            <MenuItem value={it} key={it}>
                              {it}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                </Grid>
                {/* select type on */}
                <Grid item xs={3} lg={3}>
                  {itm.is_other_dependant && (
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-select-small">
                        Select type
                      </InputLabel>
                      <Select
                        MenuProps={{ style: { zIndex: 1000002 } }}
                        label="Select type"
                        labelId="demo-select-small"
                        id="demo-select-small"
                        defaultValue={itm.other_dependant_value}
                        onChange={(e) => {
                          onChangeValue(
                            "otherSubInputs",
                            "other_dependant_value",
                            e.target.value,
                            i,
                            index,
                            indx
                          );
                        }}
                      >
                        <MenuItem value={"true"}>Checked / Not Null</MenuItem>
                        <MenuItem value={"false"}>Unchecked / Null</MenuItem>
                        <MenuItem value={"Yes"}>If Yes</MenuItem>
                        <MenuItem value={"No"}>If No</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Grid>

                {/* Other min & Max */}
                {includes(
                  ["number", "string", "textarea", "location"],
                  itm.other_input_type
                ) && (
                  <>
                    <Grid item xs={2} lg={3} xl={3}>
                      <TextField
                        label="Minimun Length"
                        type="number"
                        onWheel={(e: any) => e.target.blur()}
                        size="small"
                        onChange={(e) =>
                          onChangeValue(
                            "otherSubInputs",
                            "other_min",
                            parseInt(e.target.value),
                            i,
                            index,
                            indx
                          )
                        }
                        error={
                          itm.other_is_required && itm.other_min < 1
                            ? true
                            : false
                        }
                        helperText={
                          itm.other_is_required && itm.other_min < 1
                            ? "Value must be greater than 0"
                            : ""
                        }
                        fullWidth
                        defaultValue={itm.other_min}
                      />
                    </Grid>
                    <Grid item xs={2} lg={3} xl={3}>
                      <TextField
                        label="Maximum Length"
                        type="number"
                        onWheel={(e: any) => e.target.blur()}
                        onChange={(e) =>
                          onChangeValue(
                            "otherSubInputs",
                            "other_max",
                            parseInt(e.target.value),
                            i,
                            index,
                            indx
                          )
                        }
                        error={
                          itm.other_is_required && itm.other_max < 0
                            ? true
                            : false
                        }
                        helperText={
                          itm.other_is_required && itm.other_max < 0
                            ? "Value must be positive"
                            : ""
                        }
                        size="small"
                        fullWidth
                        defaultValue={itm.other_max}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            );
          })}
        </>
      );
    }
    return;
  };

  const answerForm = (inputs, i) => {
    if (!isEmpty(inputs)) {
      return inputs.map((k: any, index: number) => {
        if (isEmpty(k.input_type) || isEmpty(k.title)) {
          setBtnDisabled(true);
        } else {
          setBtnDisabled(false);
        }
        if (
          includes(
            ["number", "string", "email", "file", "textarea"],
            k.input_type
          ) &&
          k.min < 1 &&
          k.is_required
        ) {
          setBtnDisabled(true);
        } else {
          setBtnDisabled(false);
        }
        let editedSlug =
          k && k.input_slug
            ? getInputSlug(feilds[i].inputs[index].input_slug)
            : "";

        return (
          <Grid container spacing={2} style={subSection} key={k.id}>
            {/* input_type */}
            <Grid item xs={3}>
              <FormControl
                fullWidth
                size="small"
                error={isEmpty(k.input_type) && k.haveError ? true : false}
              >
                <InputLabel id="demo-select-small">
                  Select input type
                </InputLabel>
                <Select
                  MenuProps={{ style: { zIndex: 1000002 } }}
                  label="Select input type"
                  labelId="demo-select-small"
                  id="demo-select-small"
                  defaultValue={k.input_type}
                  onChange={(e) => {
                    onChangeValue(
                      "sub",
                      "input_type",
                      e.target.value,
                      i,
                      index
                    );
                  }}
                >
                  {typeDropArr.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {isEmpty(k.input_type) && k.haveError
                    ? "Please Select Input Type"
                    : ""}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* title */}
            <Grid item xs={3}>
              <TextField
                key={k?.input_type}
                error={isEmpty(k.title) && k.haveError ? true : false}
                label="Input name"
                fullWidth
                size="small"
                defaultValue={k.title}
                onChange={(e) => {
                  onChangeValue(
                    "sub_input_slug",
                    "title",
                    e.target.value,
                    i,
                    index
                  );
                }}
                helperText={
                  isEmpty(k.title) && k.haveError ? "Title is require" : ""
                }
              />
            </Grid>
            {/* add_suffix */}
            <Grid item xs={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => {
                      onChangeValue(
                        "sub",
                        "add_suffix",
                        e.target.checked,
                        i,
                        index
                      );
                    }}
                    defaultChecked={k.add_suffix}
                    size="small"
                  />
                }
                label="Add suffix value"
              />
            </Grid>
            {/* remove button */}
            <Grid item xs={3} style={removeBtn}>
              <Button
                color="error"
                size="small"
                variant="outlined"
                style={{ minWidth: 40 }}
                onClick={() => removeFormInput(i, k.id)}
              >
                <Remove />
              </Button>
            </Grid>
            {/* input_slug */}
            {!k.is_accordian && (
              <Grid item xs={6} lg={3} xl={3}>
                <FormControl fullWidth size="small" variant="outlined">
                  <OutlinedInput
                    disabled={values !== feilds[i].inputs[index].id}
                    fullWidth
                    value={k.input_slug}
                    onChange={(e) => {
                      if (values) {
                        onChangeValue(
                          "edited_input_slug",
                          "input_slug",
                          e.target.value,
                          i,
                          index
                        );
                      } else {
                        onChangeValue(
                          "sub",
                          "input_slug",
                          e.target.value,
                          i,
                          index
                        );
                      }
                    }}
                    placeholder={"Input slug"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            onChangeValue(
                              "edited_input_slug",
                              "input_slug",
                              editedSlug,
                              i,
                              index
                            );
                            handleClickShow(i, index);
                          }}
                          edge="end"
                        >
                          {values === feilds[i].inputs[index].id ? (
                            <DoneOutlined sx={{ fontSize: 15 }} />
                          ) : (
                            <CreateOutlined sx={{ fontSize: 15 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {/* edited_input_slug */}
                {values === feilds[i].inputs[index].id && (
                  <Grid item xs={12}>
                    <Typography
                      sx={{ margin: "0px 5px 15px", fontWeight: 500 }}
                      variant="body2"
                    >
                      Edited slug: {editedSlug}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            )}
            {/* display_joint_name */}
            {k.is_accordian && (
              <Grid item xs={3} lg={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => {
                        onChangeValue(
                          "sub",
                          "display_joint_name",
                          e.target.checked,
                          i,
                          index
                        );
                      }}
                      defaultChecked={k.display_joint_name}
                      size="small"
                    />
                  }
                  label="Have to add title"
                />
              </Grid>
            )}
            {/* Enter string_to_be_replace */}
            <Grid item xs={3} lg={3}>
              {k.display_joint_name && (
                <TextField
                  error={isEmpty(k.string_to_be_replace) ? true : false}
                  label="Enter string to be replace"
                  fullWidth
                  size="small"
                  defaultValue={k.string_to_be_replace}
                  onChange={(e) => {
                    onChangeValue(
                      "sub",
                      "string_to_be_replace",
                      e.target.value,
                      i,
                      index
                    );
                  }}
                  helperText={
                    isEmpty(k.string_to_be_replace) ? "Title is require" : ""
                  }
                />
              )}
            </Grid>
            {/* select slug1 */}
            <Grid item xs={3} lg={3}>
              {k.display_joint_name && (
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-select-small">
                    Select slug to change with
                  </InputLabel>
                  <Select
                    MenuProps={{ style: { zIndex: 1000002 } }}
                    label="Select string to merge with"
                    labelId="demo-select-small"
                    id="demo-select-small"
                    defaultValue={k.merge_string}
                    onChange={(e) => {
                      onChangeValue(
                        "sub",
                        "merge_string",
                        e.target.value,
                        i,
                        index
                      );
                    }}
                  >
                    {feilds?.map((it: any) =>
                      it?.inputs ? (
                        it.inputs.map((subIt: any) => (
                          <MenuItem value={subIt.input_slug} key={subIt.id}>
                            {subIt.input_slug}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value={it.input_slug} key={it.id}>
                          {it.input_slug}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              )}
            </Grid>
            {/* select second slug */}
            <Grid item xs={3} lg={3}>
              {k.display_joint_name && (
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-select-small">
                    Select second slug to change with
                  </InputLabel>
                  <Select
                    MenuProps={{ style: { zIndex: 1000002 } }}
                    label="Select secind slug to change with"
                    labelId="demo-select-small"
                    id="demo-select-small"
                    defaultValue={k.second_merge_string}
                    onChange={(e) => {
                      onChangeValue(
                        "sub",
                        "second_merge_string",
                        e.target.value,
                        i,
                        index
                      );
                    }}
                  >
                    {feilds?.map((it: any) =>
                      it?.inputs ? (
                        it.inputs.map((subIt: any) => (
                          <MenuItem value={subIt.input_slug} key={subIt.id}>
                            {subIt.input_slug}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value={it.input_slug} key={it.id}>
                          {it.input_slug}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              )}
            </Grid>
            {/* other_input */}
            {!k.is_accordian && (
              <Grid container spacing={2} sx={{ padding: "0px 0px 0px 10px" }}>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => {
                          onChangeValue(
                            "sub",
                            "other_input",
                            e.target.checked,
                            i,
                            index
                          );
                        }}
                        defaultChecked={k.other_input}
                        size="small"
                      />
                    }
                    label="Other Input (Optional)"
                  />
                  {k.other_input && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => addMoreOtherInput(k, i, index)}
                    >
                      <Add />
                      Add more other input
                    </Button>
                  )}
                </Grid>

                {k.other_input && (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* options */}
                    {displayOtherInputs(k, k.other_inputs, i, index)}
                  </Grid>
                )}
              </Grid>
            )}
            {/* is_dependant */}
            {k.is_accordian && (
              <Grid item xs={3} lg={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => {
                        onChangeValue(
                          "sub",
                          "is_dependant",
                          e.target.checked,
                          i,
                          index
                        );
                      }}
                      defaultChecked={k.is_dependant}
                      size="small"
                    />
                  }
                  label="Display this input when"
                />
              </Grid>
            )}
            {/* select depends on */}
            <Grid item xs={3} lg={3}>
              {k.is_dependant && (
                <FormControl fullWidth size="small">
                  <InputLabel htmlFor="grouped-select">
                    Select depends on
                  </InputLabel>
                  <Select
                    MenuProps={{
                      style: {
                        zIndex: 1000002,
                        maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
                      },
                    }}
                    label="Select depends on"
                    id="grouped-select"
                    defaultValue={k.dependant_type}
                    onChange={(e) => {
                      onChangeValue(
                        "sub",
                        "dependant_type",
                        e.target.value,
                        i,
                        index
                      );
                    }}
                  >
                    {/* {outerFeilds?.map((it: any) => (
                        <MenuItem value={it.input_slug} key={it.id}>
                          {it.title}
                        </MenuItem>
                      ))} */}
                    {feilds?.map((it: any) =>
                      it?.inputs ? (
                        it.inputs.map((subIt: any) => (
                          <MenuItem value={subIt.input_slug} key={subIt.id}>
                            {subIt.title}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value={it.input_slug} key={it.id}>
                          {it.title}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              )}
            </Grid>
            {/* select type on */}
            <Grid item xs={3} lg={3}>
              {k.is_dependant && (
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-select-small">Select type</InputLabel>
                  <Select
                    MenuProps={{ style: { zIndex: 1000002 } }}
                    label="Select type"
                    labelId="demo-select-small"
                    id="demo-select-small"
                    defaultValue={k.dependant_value}
                    onChange={(e) => {
                      onChangeValue(
                        "sub",
                        "dependant_value",
                        e.target.value,
                        i,
                        index
                      );
                    }}
                  >
                    {/* {k?.options?.map((subIt: any) => {
                      console.log(
                        "🚀 ~ file: SortableItem.tsx:1334 ~ {k?.options?.map ~ subIt:",
                        subIt
                      );
                      return (
                        <MenuItem value={subIt} key={subIt}>
                          {subIt}
                        </MenuItem>
                      );
                    })}
                    <MenuItem value={"true"}>Checked / Not Null</MenuItem>
                    <MenuItem value={"false"}>Unchecked / Null</MenuItem>
                    <MenuItem value={"Yes"}>If Yes</MenuItem>
                    <MenuItem value={"No"}>If No</MenuItem> */}

                    {feilds?.map(
                      (it: any) =>
                        it?.inputs &&
                        it.inputs.map((subIt: any) =>
                          subIt?.options &&
                          subIt?.input_slug === k?.dependant_type &&
                          subIt?.input_type === "radio"
                            ? subIt?.options?.map((sIt: any) => (
                                <MenuItem value={sIt} key={sIt}>
                                  {sIt}
                                </MenuItem>
                              ))
                            : null
                        )
                    )}
                    <MenuItem value={"true"}>Checked / Not Null</MenuItem>
                    <MenuItem value={"false"}>Unchecked / Null</MenuItem>
                    <MenuItem value={"Yes"}>If Yes</MenuItem>
                    <MenuItem value={"No"}>If No</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Grid>
            {/* is_hidden */}
            <Grid item xs={6} lg={3}></Grid>
            {k.is_accordian && (
              <>
                {k?.input_type === "dateTime" || k?.input_type === "date" ? (
                  <>
                    {/* is_date_greater */}
                    <Grid item xs={3} lg={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={(e) => {
                              onChangeValue(
                                "sub",
                                "is_date_greater",
                                e.target.checked,
                                i,
                                index
                              );
                            }}
                            defaultChecked={k.is_date_greater}
                            size="small"
                          />
                        }
                        label="Date must be greater than"
                      />
                    </Grid>
                    {/* select value for date greater than */}
                    <Grid item xs={3} lg={3}>
                      <span>
                        <div
                          style={{
                            marginLeft: "10px",
                            display: "flex",
                            width: "100%",
                          }}
                        >
                          {k.is_date_greater && (
                            <FormControl fullWidth size="small">
                              <InputLabel htmlFor="grouped-select">
                                Select value
                              </InputLabel>
                              <Select
                                MenuProps={{
                                  style: {
                                    zIndex: 1000002,
                                    maxHeight:
                                      ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
                                  },
                                }}
                                label="Select depends on"
                                id="grouped-select"
                                defaultValue={k.greater_than_date}
                                onChange={(e) => {
                                  onChangeValue(
                                    "sub",
                                    "greater_than_date",
                                    e.target.value,
                                    i,
                                    index
                                  );
                                }}
                              >
                                <MenuItem value={"custom"} key={"default"}>
                                  Custom
                                </MenuItem>
                                {feilds?.map((it: any) =>
                                  it?.inputs ? (
                                    it.inputs.map((subIt: any) => (
                                      <MenuItem
                                        value={subIt.input_slug}
                                        key={subIt.id}
                                      >
                                        {subIt.title}
                                      </MenuItem>
                                    ))
                                  ) : (
                                    <MenuItem value={it.input_slug} key={it.id}>
                                      {it.title}
                                    </MenuItem>
                                  )
                                )}
                              </Select>
                            </FormControl>
                          )}
                        </div>
                        <div style={{ marginLeft: "10px" }}>
                          {k.greater_than_date === "custom" &&
                            k?.input_type === "dateTime" && (
                              <Field
                                open={isDatePickerOpen}
                                onClose={closeDatePicker}
                                minDate={moment().toDate()}
                                component={DateTimePicker}
                                sx={{
                                  width: "80%",
                                  mb: { xs: 2, xl: 3 },
                                }}
                                format="MM/DD/YYYY HH:mm"
                                variant="outlined"
                                inputVariant="outlined"
                                label={
                                  <IntlMessages
                                    id={
                                      k.maxDate
                                        ? moment(new Date(k.maxDate)).format(
                                            "DD/MM/YYYY HH:mm"
                                          )
                                        : `custom_date_picker`
                                    }
                                  />
                                }
                                name={`custom_date_picker_${i}_${index}`} // Unique name for the field
                                value={
                                  values[`custom_date_picker_${i}_${index}`] ||
                                  null
                                } // Bind to form value
                                onChange={(value) => {
                                  onChangeValue(
                                    "sub",
                                    "maxDate",
                                    value,
                                    i,
                                    index
                                  );
                                }}
                                renderInput={(params: any) => (
                                  <TextField
                                    {...params}
                                    onClick={() => {
                                      if (
                                        k?.less_than_date === "custom" &&
                                        k.minDate != undefined &&
                                        k.minDate != ""
                                      ) {
                                        openResetDateValidation();
                                        return false;
                                      } else {
                                        setDatePickerOpen(true);
                                      }
                                    }}
                                  />
                                )}
                              />
                            )}
                          {k.greater_than_date === "custom" &&
                            k?.input_type === "date" && (
                              <Field
                                open={isDatePickerOpen}
                                onClose={closeDatePicker}
                                minDate={moment().toDate()}
                                component={DatePicker}
                                sx={{
                                  width: "80%",
                                  mb: { xs: 2, xl: 3 },
                                }}
                                format="MM/DD/YYYY"
                                variant="outlined"
                                inputVariant="outlined"
                                label={
                                  <IntlMessages
                                    id={
                                      k.maxDate
                                        ? moment(new Date(k.maxDate)).format(
                                            "DD/MM/YYYY"
                                          )
                                        : `custom_date_picker`
                                    }
                                  />
                                }
                                name={`custom_date_picker_${i}_${index}`} // Unique name for the field
                                value={
                                  values[`custom_date_picker_${i}_${index}`] ||
                                  null
                                } // Bind to form value
                                onChange={(value) => {
                                  onChangeValue(
                                    "sub",
                                    "maxDate",
                                    value,
                                    i,
                                    index
                                  );
                                }}
                                renderInput={(params: any) => (
                                  <TextField
                                    {...params}
                                    onClick={() => {
                                      if (
                                        k?.less_than_date === "custom" &&
                                        k.minDate != ""
                                      ) {
                                        openResetDateValidation();
                                        return false;
                                      } else {
                                        setDatePickerOpen(true);
                                      }
                                    }}
                                  />
                                )}
                              />
                            )}
                        </div>
                      </span>
                    </Grid>
                    <Grid item xs={6} lg={6}></Grid>
                    {/* is_date_less than */}
                    <Grid item xs={3} lg={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={(e) => {
                              onChangeValue(
                                "sub",
                                "is_date_less",
                                e.target.checked,
                                i,
                                index
                              );
                            }}
                            defaultChecked={k.is_date_less}
                            size="small"
                          />
                        }
                        label="Date must be less than"
                      />
                    </Grid>
                    {/* select value for date less than */}
                    <Grid item xs={3} lg={3}>
                      <span>
                        <div
                          style={{
                            marginLeft: "10px",
                            display: "flex",
                            width: "100%",
                          }}
                        >
                          {k.is_date_less && (
                            <FormControl fullWidth size="small">
                              <InputLabel htmlFor="grouped-select">
                                Select value
                              </InputLabel>
                              <Select
                                MenuProps={{
                                  style: {
                                    zIndex: 1000002,
                                    maxHeight:
                                      ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
                                  },
                                }}
                                label="Select depends on"
                                id="grouped-select"
                                defaultValue={k.less_than_date}
                                onChange={(e) => {
                                  onChangeValue(
                                    "sub",
                                    "less_than_date",
                                    e.target.value,
                                    i,
                                    index
                                  );
                                }}
                              >
                                <MenuItem value={"custom"} key={"default"}>
                                  Custom
                                </MenuItem>
                                {feilds?.map((it: any) =>
                                  it?.inputs ? (
                                    it.inputs.map((subIt: any) => (
                                      <MenuItem
                                        value={subIt.input_slug}
                                        key={subIt.id}
                                      >
                                        {subIt.title}
                                      </MenuItem>
                                    ))
                                  ) : (
                                    <MenuItem value={it.input_slug} key={it.id}>
                                      {it.title}
                                    </MenuItem>
                                  )
                                )}
                              </Select>
                            </FormControl>
                          )}
                        </div>
                        <div style={{ marginLeft: "10px" }}>
                          {k.less_than_date === "custom" &&
                            k?.input_type === "dateTime" && (
                              <Field
                                minDate={
                                  k.greater_than_date === "custom"
                                    ? moment(k.maxDate).toDate()
                                    : ""
                                }
                                minTime={
                                  k.greater_than_date === "custom" &&
                                  moment(k.maxDate).format("DD-MM-YYYY") ==
                                    moment(k.minDate).format("DD-MM-YYYY")
                                    ? moment(
                                        moment(k.maxDate).format("HH:mm"),
                                        "HH:mm"
                                      ).toDate()
                                    : ""
                                }
                                component={DateTimePicker}
                                sx={{
                                  width: "80%",
                                  mb: { xs: 2, xl: 3 },
                                }}
                                format="MM/DD/YYYY HH:mm"
                                variant="outlined"
                                inputVariant="outlined"
                                label={
                                  <IntlMessages
                                    id={
                                      k.minDate
                                        ? moment(new Date(k.minDate)).format(
                                            "DD/MM/YYYY HH:mm"
                                          )
                                        : `custom_date_picker`
                                    }
                                  />
                                }
                                name={`custom_date_picker_${i}_${index}`} // Unique name for the field
                                value={
                                  values[`custom_date_picker_${i}_${index}`] ||
                                  null
                                } // Bind to form value
                                onChange={(value) => {
                                  onChangeValue(
                                    "sub",
                                    "minDate",
                                    value,
                                    i,
                                    index
                                  );
                                }}
                                renderInput={(params: any) => (
                                  <TextField {...params} />
                                )}
                              />
                            )}
                          {k.less_than_date === "custom" &&
                            k?.input_type === "date" && (
                              <Field
                                minDate={
                                  k.greater_than_date === "custom"
                                    ? moment(k.maxDate).toDate()
                                    : ""
                                }
                                component={DatePicker}
                                sx={{
                                  width: "80%",
                                  mb: { xs: 2, xl: 3 },
                                }}
                                format="MM/DD/YYYY"
                                variant="outlined"
                                inputVariant="outlined"
                                label={
                                  <IntlMessages
                                    id={
                                      k.minDate
                                        ? moment(new Date(k.minDate)).format(
                                            "DD/MM/YYYY"
                                          )
                                        : `custom_date_picker`
                                    }
                                  />
                                }
                                name={`custom_date_picker_${i}_${index}`} // Unique name for the field
                                value={
                                  values[`custom_date_picker_${i}_${index}`] ||
                                  null
                                } // Bind to form value
                                onChange={(value) => {
                                  onChangeValue(
                                    "sub",
                                    "minDate",
                                    value,
                                    i,
                                    index
                                  );
                                }}
                                renderInput={(params: any) => (
                                  <TextField {...params} />
                                )}
                              />
                            )}
                        </div>
                      </span>
                    </Grid>
                    <Grid item xs={6} lg={6}></Grid>
                  </>
                ) : null}
                {/* is_other_lable */}
                <Grid item xs={3} lg={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => {
                          onChangeValue(
                            "sub",
                            "is_other_lable",
                            e.target.checked,
                            i,
                            index
                          );
                        }}
                        defaultChecked={k.is_other_lable}
                        size="small"
                      />
                    }
                    label="Add other lable"
                  />
                </Grid>
                {/* other_label_value */}
                <Grid item xs={6} lg={6}>
                  {k?.is_other_lable && (
                    <TextField
                      error={isEmpty(k.other_label_value) ? true : false}
                      label="Label value"
                      fullWidth
                      size="small"
                      defaultValue={k.other_label_value}
                      onChange={(e) => {
                        onChangeValue(
                          "sub",
                          "other_label_value",
                          e.target.value,
                          i,
                          index
                        );
                      }}
                      helperText={
                        isEmpty(k.other_label_value)
                          ? "label value is require"
                          : ""
                      }
                    />
                  )}
                </Grid>
                {/* is_beside_main_title */}
                <Grid item xs={3} lg={3}>
                  {k?.is_other_lable && (
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-select-small">
                        Select where to display
                      </InputLabel>
                      <Select
                        MenuProps={{ style: { zIndex: 1000002 } }}
                        label="Select where to display"
                        labelId="demo-select-small"
                        id="demo-select-small"
                        defaultValue={k.is_beside_main_title}
                        onChange={(e) => {
                          onChangeValue(
                            "sub",
                            "is_beside_main_title",
                            e.target.value,
                            i,
                            index
                          );
                        }}
                      >
                        {positionArr.map((item) => (
                          <MenuItem value={item.id} key={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>
                {/* clear_input */}
                <Grid item xs={3} lg={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => {
                          onChangeValue(
                            "sub",
                            "clear_input",
                            e.target.checked,
                            i,
                            index
                          );
                        }}
                        defaultChecked={k.clear_input}
                        size="small"
                      />
                    }
                    label="Clear this input when"
                  />
                </Grid>
                {/* clear_input_on */}
                <Grid style={{ padding: 10 }} xs={9} lg={9}>
                  <Grid item xs={3} lg={3}>
                    {k.clear_input && (
                      <FormControl fullWidth size="small">
                        <InputLabel htmlFor="grouped-select">
                          Select responsible input
                        </InputLabel>
                        <Select
                          MenuProps={{
                            style: {
                              zIndex: 1000002,
                              maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
                            },
                          }}
                          label="Select responsible input"
                          id="grouped-select"
                          defaultValue={k.clear_input_on}
                          onChange={(e) => {
                            onChangeValue(
                              "sub",
                              "clear_input_on",
                              e.target.value,
                              i,
                              index
                            );
                          }}
                        >
                          {feilds?.map((it: any) =>
                            it?.inputs ? (
                              it.inputs.map((subIt: any) => (
                                <MenuItem
                                  value={subIt.input_slug}
                                  key={subIt.id}
                                >
                                  {subIt.title}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem value={it.input_slug} key={it.id}>
                                {it.title}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
                    )}
                  </Grid>
                </Grid>

                {/* is_required */}
                <Grid item xs={3} lg={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => {
                          onChangeValue(
                            "sub",
                            "is_required",
                            e.target.checked,
                            i,
                            index
                          );
                        }}
                        defaultChecked={k.is_required}
                        size="small"
                      />
                    }
                    label="Is Required"
                  />
                </Grid>
                {/* is_disabled */}
                <Grid item xs={3} lg={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => {
                          onChangeValue(
                            "sub",
                            "is_disabled",
                            e.target.checked,
                            i,
                            index
                          );
                        }}
                        defaultChecked={k.is_disabled}
                        size="small"
                      />
                    }
                    label="Is disabled"
                  />
                </Grid>
                {/* is_display */}
                <Grid item xs={3} lg={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => {
                          onChangeValue(
                            "sub",
                            "is_display",
                            e.target.checked,
                            i,
                            index
                          );
                        }}
                        defaultChecked={k.is_display}
                        size="small"
                      />
                    }
                    label="Is display"
                  />
                </Grid>
                {/* is_inline */}
                <Grid item xs={3} lg={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => {
                          onChangeValue(
                            "sub",
                            "is_inline",
                            e.target.checked,
                            i,
                            index
                          );
                        }}
                        defaultChecked={k.is_inline}
                        size="small"
                      />
                    }
                    label="Is Inline"
                  />
                </Grid>
                {/* is_mobile */}
                <Grid item xs={3} lg={2}>
                  {k.input_type === "string" && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) => {
                            onChangeValue(
                              "sub",
                              "is_mobile",
                              e.target.checked,
                              i,
                              index
                            );
                          }}
                          defaultChecked={k.is_mobile}
                          size="small"
                        />
                      }
                      label="Is mobile?"
                    />
                  )}
                </Grid>
                <Grid item xs={3} lg={2}></Grid>
                {/* input_slug */}
                <Grid item xs={6} lg={2} xl={2}>
                  <FormControl fullWidth size="small" variant="outlined">
                    <OutlinedInput
                      disabled={values !== feilds[i].inputs[index].id}
                      fullWidth
                      value={k.input_slug}
                      onChange={(e) => {
                        if (values) {
                          onChangeValue(
                            "edited_input_slug",
                            "input_slug",
                            e.target.value,
                            i,
                            index
                          );
                        } else {
                          onChangeValue(
                            "sub",
                            "input_slug",
                            e.target.value,
                            i,
                            index
                          );
                        }
                      }}
                      placeholder={"Input slug"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              onChangeValue(
                                "edited_input_slug",
                                "input_slug",
                                editedSlug,
                                i,
                                index
                              );
                              handleClickShow(i, index);
                            }}
                            edge="end"
                          >
                            {values === feilds[i].inputs[index].id ? (
                              <DoneOutlined sx={{ fontSize: 15 }} />
                            ) : (
                              <CreateOutlined sx={{ fontSize: 15 }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  {/* edited_input_slug */}
                  {values === feilds[i].inputs[index].id && (
                    <Grid item xs={12}>
                      <Typography
                        sx={{ margin: "0px 5px 15px", fontWeight: 500 }}
                        variant="body2"
                      >
                        Edited slug: {editedSlug}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
                {/* min & Max */}
                {includes(
                  ["number", "string", "email", "file", "textarea"],
                  k.input_type
                ) && (
                  <>
                    {/* min */}
                    <Grid item xs={6} lg={2}>
                      <TextField
                        error={k.is_required && k.min < 1 ? true : false}
                        label="Min Length"
                        type="number"
                        onWheel={(e: any) => e.target.blur()}
                        size="small"
                        onChange={(e) => {
                          onChangeValue(
                            "sub",
                            "min",
                            parseInt(e.target.value) || 0,
                            i,
                            index
                          );
                          const isDis = isEmpty(
                            feilds[i].inputs.filter((it) =>
                              includes(
                                [
                                  "string",
                                  "number",
                                  "email",
                                  "textarea",
                                  "file",
                                ],
                                it.input_type
                              )
                                ? it.min < 1 && it.is_required
                                : null
                            )
                          );
                          setBtnDisabled(isDis ? false : true);
                        }}
                        fullWidth
                        defaultValue={k.min}
                        helperText={
                          k.is_required && k.min < 1
                            ? "Value must be greater than 0"
                            : ""
                        }
                      />
                    </Grid>
                    {/* max */}
                    <Grid item xs={6} lg={2}>
                      <TextField
                        error={k.is_required && k.max < 0 ? true : false}
                        label="Max Length"
                        type="number"
                        onWheel={(e: any) => e.target.blur()}
                        onChange={(e) => {
                          onChangeValue(
                            "sub",
                            "max",
                            parseInt(e.target.value),
                            i,
                            index
                          );
                          const isDis = isEmpty(
                            feilds[i].inputs.filter((it) =>
                              includes(
                                [
                                  "string",
                                  "number",
                                  "email",
                                  "textarea",
                                  "file",
                                ],
                                it.input_type
                              )
                                ? k.max < 0
                                : null
                            )
                          );
                          setBtnDisabled(isDis ? false : true);
                        }}
                        size="small"
                        fullWidth
                        defaultValue={k.max}
                        helperText={
                          k.is_required && k.max < 0
                            ? "Value must be positive"
                            : ""
                        }
                      />
                    </Grid>
                  </>
                )}
                {/* File Type */}
                {k.input_type === "file" && (
                  <>
                    {/* Select file type */}
                    <Grid item xs={2}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-select-small">
                          Select file type
                        </InputLabel>
                        <Select
                          MenuProps={{ style: { zIndex: 1000002 } }}
                          size="small"
                          fullWidth
                          labelId="demo-select-small"
                          label="Select file type"
                          onChange={(e) => {
                            onChangeValue(
                              "sub",
                              "file_type",
                              e.target.value,
                              i,
                              index
                            );
                          }}
                          defaultValue={k?.file_type || ""}
                        >
                          {fileTypeArr.map((item) => (
                            <MenuItem value={item.id} key={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    {/* file_size */}
                    <Grid item xs={2} lg={2}>
                      <TextField
                        label="File size"
                        type="number"
                        onWheel={(e: any) => e.target.blur()}
                        size="small"
                        onChange={(e) => {
                          onChangeValue(
                            "sub",
                            "file_size",
                            parseInt(e.target.value) || 0,
                            i,
                            index
                          );
                        }}
                        fullWidth
                        defaultValue={k.file_size}
                      />
                    </Grid>
                    {/* video_duration */}
                    {k?.file_type === "video" && (
                      <Grid item xs={2} lg={2}>
                        <TextField
                          label="Video duration in seconds"
                          type="number"
                          onWheel={(e: any) => e.target.blur()}
                          size="small"
                          onChange={(e) => {
                            onChangeValue(
                              "sub",
                              "video_duration",
                              parseInt(e.target.value) || 0,
                              i,
                              index
                            );
                          }}
                          fullWidth
                          defaultValue={k.video_duration}
                        />
                      </Grid>
                    )}
                    {/* access_file_type */}
                    {k?.file_type === "pdf" && (
                      <Grid item xs={2}>
                        <FormControl fullWidth size="small">
                          <InputLabel id="demo-select-small">
                            File access type
                          </InputLabel>
                          <Select
                            MenuProps={{ style: { zIndex: 1000002 } }}
                            size="small"
                            fullWidth
                            multiple
                            labelId="demo-select-small"
                            label="File access type"
                            onChange={(e) => {
                              onChangeValue(
                                "sub",
                                "file_access_type",
                                e.target.value,
                                i,
                                index
                              );
                            }}
                            defaultValue={k?.file_access_type || []}
                          >
                            {accessTypeArr.map((item) => (
                              <MenuItem value={item.id} key={item.id}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                    {/* Select file tag */}
                    {k?.file_type === "photo" && (
                      <Grid item xs={2}>
                        <FormControl fullWidth size="small">
                          <InputLabel id="demo-select-small">
                            Select file tag (Optional)
                          </InputLabel>
                          <Select
                            MenuProps={{ style: { zIndex: 1000002 } }}
                            label="Select file tag (Optional)"
                            labelId="demo-select-small"
                            id="demo-select-small"
                            defaultValue={k.file_tag}
                            onChange={(e) => {
                              onChangeValue(
                                "sub",
                                "file_tag",
                                e.target.value,
                                i,
                                index
                              );
                            }}
                          >
                            {fileTagArr.map((item) => (
                              <MenuItem value={item.id} key={item.id}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                  </>
                )}
                {/* num_of_row */}
                {k.input_type === "textarea" && (
                  <Grid item xs={2}>
                    <TextField
                      label="Number of rows"
                      type="number"
                      onWheel={(e: any) => e.target.blur()}
                      onChange={(e) =>
                        onChangeValue(
                          "sub",
                          "num_of_row",
                          parseInt(e.target.value),
                          i,
                          index
                        )
                      }
                      size="small"
                      fullWidth
                      defaultValue={k.num_of_row}
                    />
                  </Grid>
                )}
                {/* multiselect & options */}
                {includes(["radio", "checkbox", "select"], k.input_type) && (
                  <>
                    <Grid
                      item
                      xs={2.5}
                      lg={3}
                      xl={2.5}
                      sx={{ padding: "5px 0px 10px 0px" }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={(e) => {
                              onChangeValue(
                                "sub",
                                "multiselect",
                                e.target.checked,
                                i,
                                index,
                                k.input_type
                              );
                            }}
                            size="small"
                            defaultChecked={k.multiselect}
                          />
                        }
                        label="Multiple Selection"
                      />
                    </Grid>
                    <Grid item xs={2} sx={{ padding: "5px 0px 10px 0px" }}>
                      <TextField
                        label={"Add Prefix"}
                        fullWidth
                        size="small"
                        defaultValue={k.prefix}
                        onChange={(e) =>
                          onChangeValue(
                            "sub",
                            "prefix",
                            e.target.value,
                            i,
                            index,
                            k.input_type
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={2} sx={{ padding: "5px 0px 10px 0px" }}>
                      <TextField
                        label={"Add Suffix"}
                        fullWidth
                        size="small"
                        defaultValue={k.suffix}
                        onChange={(e) =>
                          onChangeValue(
                            "sub",
                            "suffix",
                            e.target.value,
                            i,
                            index,
                            k.input_type
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => addOption(i, index)}
                      >
                        <Add /> Add Option
                      </Button>
                    </Grid>

                    {/* options */}
                    <Grid xs={12}>{displayOption(k, k.options, i, index)}</Grid>
                    {/* other_input */}
                    <Grid
                      container
                      spacing={2}
                      sx={{ padding: "0px 0px 0px 10px" }}
                    >
                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={(e) => {
                                onChangeValue(
                                  "sub",
                                  "other_input",
                                  e.target.checked,
                                  i,
                                  index
                                );
                              }}
                              defaultChecked={k.other_input}
                              size="small"
                            />
                          }
                          label="Other Input (Optional)"
                        />
                        {k.other_input && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => addMoreOtherInput(k, i, index)}
                          >
                            <Add />
                            Add more other input
                          </Button>
                        )}
                      </Grid>

                      {k.other_input && (
                        <Grid
                          item
                          xs={12}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* options */}
                          {displayOtherInputs(k, k.other_inputs, i, index)}
                        </Grid>
                      )}
                    </Grid>
                  </>
                )}
              </>
            )}
          </Grid>
        );
      });
    } else {
      return;
    }
  };

  const remove = (type, quesKey, ansKey = 0) => {
    let newArry = [];
    if (type === "que") {
      newArry = feilds.filter((i) => i.id !== quesKey);
    }
    setFeilds(newArry);
  };

  const onClose = () => {
    setIndexData([]);
    setOpenModal(false);
    setValue("");
    setSelectIndex(-1);
  };

  return (
    <Box
      sx={{
        zIndex: 1000002,
        mt: 2,
        pt: !ques?.is_accordian ? 2 : 0,
        width: "100%",
        backgroundColor: "rgba(229, 246, 253, 0.5)",
        borderRadius: "5px",
        borderWidth: "1px",
        borderColor: "rgba(229, 246, 253, 0.5)",
        boxShadow: "-4px 4px 5px -3px rgb(0 0 0 / 20%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          pt: ques?.is_accordian ? 3 : 0,
          pb: ques?.is_accordian ? 3 : 0,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ width: "100%", ml: 1.5 }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
            {ques?.is_accordian ? ques.title || `Title ${i + 1}` : null}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {ques?.is_accordian &&
            (openId === ques.id ? (
              <RemoveCircleOutlineOutlined
                sx={{ mr: 1.5, zIndex: 1000002, cursor: "pointer" }}
                onClick={() => setOpenID("")}
              />
            ) : (
              <ControlPointOutlined
                sx={{ mr: 1.5, zIndex: 1000002, cursor: "pointer" }}
                onClick={() => setOpenID(ques.id)}
              />
            ))}
          {/* <Button variant="text" color="inherit" size="small">
            {ques?.is_accordian && <DragHandler />}
          </Button> */}
        </Box>
      </Box>
      {inputs && (openId === ques.id || !ques?.is_accordian) ? (
        <Box sx={{ p: "0px 15px 0px 0px" }}>
          <Grid container spacing={2} key={ques?.id} style={mainSection}>
            {/* Section Title */}
            <Grid item xs={3}>
              <TextField
                error={isEmpty(ques?.title) && ques?.haveError ? true : false}
                label="Section Title"
                fullWidth
                onChange={(e) =>
                  onChangeValue("main", "title", e.target.value, i, 0, 0)
                }
                defaultValue={ques?.title}
                size="small"
                placeholder="Fundraiser Details / Documnets"
              />
              <ErrorTextStyle>
                {isEmpty(ques?.title) && ques?.haveError
                  ? "Section Title is required"
                  : ""}
              </ErrorTextStyle>
            </Grid>
            {/* Help Title */}
            <Grid item xs={2}>
              <TextField
                error={
                  isEmpty(ques?.help_title) && ques?.haveError ? true : false
                }
                label="Help Title"
                fullWidth
                onChange={(e) =>
                  onChangeValue("main", "help_title", e.target.value, i, 0, 0)
                }
                defaultValue={ques?.help_title}
                size="small"
                placeholder="Help The Elderly"
              />
              <ErrorTextStyle>
                {isEmpty(ques?.help_title) && ques?.haveError
                  ? "Help Title is required"
                  : ""}
              </ErrorTextStyle>
            </Grid>
            {/* Visible for
            <Grid item xs={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-select-small">Visible for</InputLabel>
                <Select
                  MenuProps={{ style: { zIndex: 1000002 } }}
                  size="small"
                  fullWidth
                  multiple
                  labelId="create-request"
                  label="Visible for"
                  onChange={(e) =>
                    onChangeValue("main", "visible", e.target.value, i, 0, 0)
                  }
                  defaultValue={ques?.visible || []}
                >
                  <MenuItem value="guest">Guest</MenuItem>
                  <MenuItem value="user">Beneficiary</MenuItem>
                  <MenuItem value="donor">Donor</MenuItem>
                  <MenuItem value="volunteer">Volunteer</MenuItem>
                  <MenuItem value="ngo">NGO</MenuItem>
                  <MenuItem value="corporate">Corporate</MenuItem>
                </Select>
              </FormControl>
            </Grid> */}
            {/* Add / Remove Input Button */}
            <Grid item xs={7} style={displayRight}>
              <Button
                variant="contained"
                sx={{ marginRight: "10px" }}
                onClick={() => {
                  if (!isEmpty(ques?.inputs)) {
                    setIndexData(item);
                    setOpenModal(true);
                  } else {
                    addFormInput(i, ques?.is_accordian, "", null);
                  }
                }}
                size="small"
              >
                <Add /> Add Input
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => remove("que", ques?.id)}
              >
                <Remove /> Remove Section
              </Button>
              {/* <Button variant="text" color="inherit" size="small">
                {!ques?.is_accordian && <DragHandler />}
              </Button> */}
            </Grid>
            <Grid item xs={12} sx={{ zIndex: 1000002 }}>
              {!isEmpty(inputs) ? answerForm(inputs, i) : null}
            </Grid>
          </Grid>
          <DialogSlide
            open={openModal}
            onDeny={onClose}
            onClose={onClose}
            dialogTitle={"Add New Input"}
          >
            <Box sx={style}>
              <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-select-small">
                    Select where to add input
                  </InputLabel>
                  <Select
                    MenuProps={{
                      style: {
                        zIndex: 1000002,
                        maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
                      },
                    }}
                    size="small"
                    fullWidth
                    labelId="demo-select-small"
                    label={"Select where to add input"}
                    value={selectIndex}
                    onChange={(event: any) =>
                      setSelectIndex(event.target.value)
                    }
                  >
                    {indexData &&
                      !isEmpty(indexData) &&
                      indexData.inputs?.map((sFA: any, index: number) => {
                        return (
                          <MenuItem value={index} key={sFA?.id}>
                            {sFA?.title}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Box>
              {selectIndex > -1 ? (
                <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                  <FormControl error={error}>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Select position
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={value}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="up"
                        control={<Radio />}
                        label={`Add input above selected input`}
                      />
                      <FormControlLabel
                        value="below"
                        control={<Radio />}
                        label={`Add input below selected input`}
                      />
                      <FormHelperText>{helperText}</FormHelperText>
                    </RadioGroup>
                  </FormControl>
                </Box>
              ) : null}
              <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                <Button
                  size="small"
                  color="success"
                  variant="outlined"
                  onClick={() => {
                    if (value === "" && selectIndex > -1) {
                      setHelperText("Please select an option.");
                      setError(true);
                    } else {
                      setHelperText("");
                      setError(false);
                      onClose();
                      addFormInput(i, ques?.is_accordian, "modal", selectIndex);
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
            </Box>
          </DialogSlide>
          <AppConfirmDialog
            open={open}
            disabled={dltLoad}
            loading={dltLoad}
            onDeny={() => {
              setDatePickerOpen(false);
              setDltLoad(false);
              setOpen(false);
            }}
            onConfirm={() => {
              setIsRevertedDate(true);
              setDatePickerOpen(true);
              setDltLoad(false);
              setOpen(false);
            }}
            title="Changing the date will reset the 'Date must be less than' setting. Are you sure you want to proceed?"
            dialogTitle="Confirm Date Change"
          />
        </Box>
      ) : null}
    </Box>
  );
};

export default SortableElement(SortableItem);
