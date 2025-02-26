import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add,
  Remove,
  Cancel,
  CreateOutlined,
  DoneOutlined,
} from "@mui/icons-material";
import { cloneDeep, isArray, isEmpty, size, includes } from "lodash";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";
import InputAdornment from "@mui/material/InputAdornment";
import { v4 } from "uuid";
import SimpleBarReact from "simplebar-react";
import { getInputSlug } from "shared/helpers/utility";
import { IndiaBankForm, USAForm } from "components/DefaultHealth";
import DialogSlide from "components/DialogSlide";

const displayRight = { display: "flex", justifyContent: "end" };
const removeBtn = { display: "flex", justifyContent: "end", height: "40px" };
const style = { width: 500 };
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

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

const subSection = {
  margin: "10px 0",
  width: "100%",
  padding: 10,
  alignItems: "flex-start",
  border: "1px solid #bdbdbd",
  borderRadius: "5px",
  "& :last-child": { marginBottom: 0 },
};

interface BankDynamicFormProps {
  setFeilds: (data: any) => void;
  feilds: any;
  btnDisabled: boolean;
  setBtnDisabled: (data: any) => void;
}

const BankDynamicForm: React.FC<BankDynamicFormProps> = ({
  setFeilds,
  feilds,
  btnDisabled,
  setBtnDisabled,
}) => {
  const quesData = [];
  const ref = useRef<any>(null);
  const [values, setValues] = useState<boolean>(false);
  const [defaultForm, setDefaultForm] = React.useState("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [indexData, setIndexData] = useState<any>([]);
  const [selectIndex, setSelectIndex] = useState<any>(-1);
  const [error, setError] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [helperText, setHelperText] = React.useState("");

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setDefaultForm(event.target.value as string);
    if (event.target.value === "india") {
      setFeilds(IndiaBankForm);
    } else if (event.target.value === "usa") {
      setFeilds(USAForm);
    } else if (event.target.value === "none") {
      setFeilds([]);
    }
  };

  useEffect(() => {
    if (!isEmpty(quesData)) {
      const getQ = cloneDeep(quesData);
      setFeilds(getQ);
    }
  }, []);

  // console.log("feilds", JSON.stringify(feilds, null, 2));

  useEffect(() => {
    // console.log('feilds', JSON.stringify(feilds, null, 2))
  }, [feilds]);

  const defaultFormArr = [
    { id: "none", name: "None" },
    { id: "india", name: "India" },
    { id: "usa", name: "USA" },
  ];

  const mainSectionData = {
    title: "",
    help_title: "",
    inputs: [],
    id: v4(),
    visible: [],
  };

  const subSectionData = {
    title: "",
    other_inputs: [],
    input_type: "",
    input_slug: null,
    is_required: true,
    is_disabled: false,
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
  };

  const otherSubSectionData = {
    other_title: "",
    other_input_type: "",
    other_min: 0,
    other_is_required: true,
    other_max: 0,
  };

  const typeDropArr = [
    { id: "string", name: "String" },
    { id: "number", name: "Number" },
    { id: "date", name: "Date" },
    { id: "location", name: "Location" },
    { id: "password", name: "Password" },
    { id: "email", name: "Email" },
    { id: "textarea", name: "Text area" },
    { id: "radio", name: "Radio" },
    { id: "checkbox", name: "Checkbox" },
    { id: "select", name: "Dropdown" },
    { id: "file", name: "File" },
  ];

  const fileTypeArr = [
    { id: "photo", name: "Photo" },
    { id: "pdf", name: "PDF" },
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

  // const accessTypeArr = [
  //   { id: "allFiles", name: "All Files" },
  //   { id: "csv", name: "CSV" },
  //   { id: "doc", name: "DOC" },
  //   { id: "docx", name: "DOCx" },
  //   { id: "images", name: "Images" },
  //   { id: "pdf", name: "PDF" },
  //   { id: "plainText", name: "Plain Text" },
  //   { id: "ppt", name: "PPT" },
  //   { id: "pptx", name: "PPTx" },
  // ];

  const fileTagArr = [
    { id: "front", name: "Front" },
    { id: "back", name: "Back" },
  ];

  const otherInputtypeArr = [
    { id: "string", name: "String" },
    { id: "textarea", name: "Text area" },
    { id: "number", name: "Number" },
  ];

  const remove = (type, quesKey, ansKey = 0) => {
    let newArry = [];
    if (type === "que") {
      newArry = feilds.filter((i) => i.id !== quesKey);
    }
    setFeilds(newArry);
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
  const addFormInput = (index: any, from: any, position: any) => {
    let ques = isArray(feilds) ? [...feilds] : [];
    if (isEmpty(ques) || isEmpty(ques[index])) {
      toast.error("Something is missing");
    } else {
      if (from === "modal" && position > -1 && !isEmpty(value)) {
        ques[index].inputs.splice(
          value === "below" ? position + 1 : position,
          0,
          subSectionData
        );
      } else {
        ques[index].inputs.push(subSectionData);
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
        if (title === "file_type") {
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
        } else {
          ques[i1].inputs[i2][title] = value;
        }
      } else if (type === "subSub") {
        ques[i1].inputs[i2][title][i3] = value;
      } else if (type === "otherSubInputs") {
        ques[i1].inputs[i2].other_inputs[i3][title] = value;
      } else if (type === "sub_input_slug") {
        const newVal = getInputSlug(value);
        ques[i1].inputs[i2].input_slug = newVal;
        ques[i1].inputs[i2][title] = value;
      } else if (type === "edited_input_slug") {
        const newVal = value ? getInputSlug(value) : "";
        ques[i1].inputs[i2].input_slug = newVal;
        ques[i1].inputs[i2][title] = value;
      }

      if (type === "sub" || type === "sub_input_slug") {
        isDisable = isEmpty(
          ques[i1].inputs.filter((it) =>
            includes(
              ["string", "number", "email", "textarea", "file"],
              it.input_type
            )
              ? isEmpty(it.title) ||
                isEmpty(it.input_type) ||
                (it.min === 0 && it.is_required)
              : isEmpty(it.title) || isEmpty(it.input_type)
          )
        );
        setBtnDisabled(isDisable ? false : true);
      }
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

  useImperativeHandle(ref, () => ({
    getQuestionAnswer() {
      return feilds;
    },
  }));

  const handleClickShow = (i, index) => {
    let ques = isArray(feilds) ? [...feilds] : [];
    setValues(!values && ques[i].inputs[index].id);
  };

  const answerForm = (inputs, i) => {
    if (!isEmpty(inputs)) {
      return inputs.map((k: any, index: number) => {
        if (isEmpty(k.input_type) || isEmpty(k.title)) {
          btnDisabled = true;
        } else {
          btnDisabled = false;
        }

        let editedSlug =
          k && k.input_slug
            ? getInputSlug(feilds[i].inputs[index].input_slug)
            : "";
        return (
          <Grid container spacing={2} style={subSection} key={k.id}>
            {/* input_type */}
            <Grid item xs={5} xl={3}>
              <FormControl
                fullWidth
                size="small"
                error={isEmpty(k.input_type) ? true : false}
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
                  {isEmpty(k.input_type) ? "Please Select Input Type" : ""}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* input_name / title */}
            <Grid item xs={5} xl={3}>
              <TextField
                error={isEmpty(k.title) ? true : false}
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
                helperText={isEmpty(k.title) ? "Title is require" : ""}
              />
            </Grid>
            {/* remove button */}
            <Grid item xs={2} xl={6} style={removeBtn}>
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
            <Grid item xs={6} lg={2}>
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
                    error={k.is_required && k.min === 0 ? true : false}
                    label="Minimun Length"
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
                            ["string", "number", "email", "textarea", "file"],
                            it.input_type
                          )
                            ? it.min === 0 && it.is_required
                            : null
                        )
                      );
                      setBtnDisabled(isDis ? false : true);
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
                <Grid item xs={6} lg={2}>
                  <TextField
                    label="Maximum Length"
                    type="number"
                    onWheel={(e: any) => e.target.blur()}
                    onChange={(e) =>
                      onChangeValue(
                        "sub",
                        "max",
                        parseInt(e.target.value),
                        i,
                        index
                      )
                    }
                    size="small"
                    fullWidth
                    defaultValue={k.max}
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
                      label="Select file type"
                      labelId="demo-select-small"
                      id="demo-select-small"
                      defaultValue={k.file_type}
                      onChange={(e) => {
                        onChangeValue(
                          "sub",
                          "file_type",
                          e.target.value,
                          i,
                          index
                        );
                      }}
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
                          <MenuItem value={item?.id} key={item?.id}>
                            {item?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {/* Select file tag */}
                <Grid item xs={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-select-small">
                      Select file tag
                    </InputLabel>
                    <Select
                      MenuProps={{ style: { zIndex: 1000002 } }}
                      label="Select file tag"
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
          </Grid>
        );
      });
    } else {
      return;
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
          {other_inputs.map((itm, indx) => {
            return (
              <Grid container spacing={2} sx={{ m: 0, width: "100%" }} xs={12}>
                {/* Other Select input type */}
                <Grid item xs={6} lg={2.5} xl={2.5}>
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
                <Grid item xs={6} lg={2.5} xl={2.5}>
                  <TextField
                    label="Input name"
                    fullWidth
                    size="small"
                    defaultValue={itm.other_title}
                    onChange={(e) =>
                      onChangeValue(
                        "otherSubInputs", //other_sub_input_slug => change when other input slug implemented
                        "other_title",
                        e.target.value,
                        i,
                        index,
                        indx
                      )
                    }
                  />
                </Grid>

                {/* is_required */}
                <Grid item xs={2} lg={2} xl={2}>
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

                {/* Other min & Max */}
                {includes(
                  ["number", "string", "textarea"],
                  itm.other_input_type
                ) && (
                  <>
                    <Grid item xs={2} lg={1.5} xl={2}>
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
                        fullWidth
                        defaultValue={itm.other_min}
                      />
                    </Grid>
                    <Grid item xs={2} lg={1.5} xl={2}>
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
                        size="small"
                        fullWidth
                        defaultValue={itm.other_max}
                      />
                    </Grid>
                  </>
                )}

                <Grid
                  item
                  xs={2}
                  lg={2}
                  xl={1}
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
              </Grid>
            );
          })}
        </>
      );
    }
    return;
  };

  const onClose = () => {
    setIndexData([]);
    setOpenModal(false);
    setSelectIndex(-1);
    setValue("");
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
          <FormControl size="small" sx={{ width: 250, mr: 2 }}>
            <InputLabel id="demo-select-small">Select default form</InputLabel>
            <Select
              MenuProps={{ style: { zIndex: 1000002 } }}
              label="Select default form"
              labelId="demo-select-small"
              id="demo-select-small"
              value={defaultForm}
              onChange={handleChange}
            >
              {defaultFormArr?.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {!isEmpty(feilds) && size(feilds) >= 10 ? null : (
            <>
              <Button variant="contained" onClick={add} size="small">
                <Add /> Add Form
              </Button>
            </>
          )}
        </Grid>

        {feilds.map((ques: any, i: any) => {
          return (
            <Accordion
              sx={{
                mt: 2,
                mb: "30px !important",
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
                  {ques.title || `Title ${i + 1}`}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: "0px 15px 0px 0px" }}>
                <Grid container spacing={2} key={ques.id} style={mainSection}>
                  <Grid item xs={3}>
                    <TextField
                      label="Section Title"
                      fullWidth
                      onChange={(e) =>
                        onChangeValue("main", "title", e.target.value, i, 0, 0)
                      }
                      defaultValue={ques.title}
                      size="small"
                      placeholder="Fundraiser Details / Documnets"
                    />
                    <ErrorTextStyle>
                      {isEmpty(ques.title) ? "Section Title is required" : ""}
                    </ErrorTextStyle>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Help Title"
                      fullWidth
                      onChange={(e) =>
                        onChangeValue(
                          "main",
                          "help_title",
                          e.target.value,
                          i,
                          0,
                          0
                        )
                      }
                      defaultValue={ques.help_title}
                      size="small"
                      placeholder="Help The Elderly"
                    />
                    <ErrorTextStyle>
                      {isEmpty(ques.help_title) ? "Help Title is required" : ""}
                    </ErrorTextStyle>
                  </Grid>
                  <Grid item xs={6} style={displayRight}>
                    <Button
                      variant="contained"
                      sx={{ marginRight: "10px" }}
                      onClick={() => {
                        if (!isEmpty(ques?.inputs)) {
                          setIndexData(ques);
                          setOpenModal(true);
                        } else {
                          addFormInput(i, "", null);
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
                      onClick={() => remove("que", ques.id)}
                    >
                      <Remove /> Remove Section
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    {!isEmpty(ques.inputs) ? answerForm(ques.inputs, i) : null}
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
                              if (isEmpty(sFA?.title)) {
                                return;
                              }
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
                            onChange={handleValueChange}
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
                            addFormInput(i, "modal", selectIndex);
                          }
                        }}
                      >
                        Add
                      </Button>
                    </Box>
                  </Box>
                </DialogSlide>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Grid>
    </ScrollbarWrapper>
  );
};

export default BankDynamicForm;
