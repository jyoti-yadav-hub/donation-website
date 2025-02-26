import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  RadioGroup,
  Radio,
  Select,
  SelectChangeEvent,
  styled,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { cloneDeep, isArray, isEmpty, size } from "lodash";
import { v4 } from "uuid";
import SimpleBarReact from "simplebar-react";
import { arrayMoveImmutable } from "array-move";
import SortableList, {
  OnSortEndHandler,
  SortableItems,
} from "components/Sortable/SortableList";
import {
  EducationNew,
  FundraiserNew,
  HealthNew,
  HungerNew,
  StartFund,
  SaayamDrive,
} from "components/DefaultHealth";
import DialogSlide from "components/DialogSlide";

const style = { width: 500 };
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const displayRight = { display: "flex", justifyContent: "end" };

const ScrollbarWrapper = styled(SimpleBarReact)(() => {
  return { maxHeight: "calc(100vh - 160px)" };
});

interface DynamicFormProps {
  setFeilds: (data: any) => void;
  feilds: any;
  setOuterFeilds?: (data: any) => void;
  outerFeilds?: any;
  btnDisabled: boolean;
  setBtnDisabled: (data: any) => void;
  isEdit?: any;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  setFeilds,
  feilds,
  setOuterFeilds,
  outerFeilds,
  setBtnDisabled,
  btnDisabled,
  isEdit,
}) => {
  const quesData = [];
  const ref = useRef<any>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [indexData, setIndexData] = useState<any>([]);
  const [value, setValue] = React.useState("");
  const [selectIndex, setSelectIndex] = useState<any>(-1);
  const [btnAccordian, setBtnAccordian] = useState<any>("");
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("");

  const [defaultForm, setDefaultForm] = React.useState("");

  const onClose = () => {
    setIndexData([]);
    setBtnAccordian("");
    setOpenModal(false);
    setValue("");
    setSelectIndex(-1);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setDefaultForm(event.target.value as string);
    if (event.target.value === "start-fund") {
      setFeilds(StartFund);
    } else if (event.target.value === "drive") {
      setFeilds(SaayamDrive);
    } else if (event.target.value === "hunger") {
      setFeilds(HungerNew);
    } else if (event.target.value === "fundraiser") {
      setFeilds(FundraiserNew);
    } else if (event.target.value === "education") {
      setFeilds(EducationNew);
    } else if (event.target.value === "health") {
      setFeilds(HealthNew);
    } else if (event.target.value === "none") {
      setFeilds([]);
    }
  };

  // useEffect(() => {
  //   setFeilds(EducationNew);
  // }, []);
  // console.log("feilds", JSON.stringify(feilds, null, 2));

  useEffect(() => {
    if (!isEmpty(quesData)) {
      const getQ = cloneDeep(quesData);
      setFeilds(getQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultFormArr = [
    { id: "none", name: "None" },
    { id: "start-fund", name: "Start Fund" },
    { id: "drive", name: "Saayam Drive" },
    { id: "hunger", name: "Hunger" },
    { id: "fundraiser", name: "Fundraiser" },
    { id: "education", name: "Education" },
    { id: "health", name: "Health" },
  ];

  const mainSectionData = {
    title: "",
    // label_of_count: "",
    is_accordian: true,
    help_title: "",
    inputs: [],
    id: v4(),
    visible: [],
  };

  // Add section in Form
  const add = (btnname, from?: any, position?: any) => {
    let ques = isArray(feilds) ? [...feilds] : [];
    // if (!isEmpty(ques)) {
    if (btnname === "is_accordian") {
      // ques.push({ ...mainSectionData, is_accordian: true });
      if (from === "modal" && position > -1 && !isEmpty(value)) {
        ques.splice(value === "below" ? position + 1 : position, 0, {
          ...mainSectionData,
          is_accordian: true,
        });
      } else {
        ques.push({ ...mainSectionData, is_accordian: true });
      }
    } else {
      if (from === "modal" && position > -1 && !isEmpty(value)) {
        ques.splice(value === "below" ? position + 1 : position, 0, {
          ...mainSectionData,
          is_accordian: false,
        });
      } else {
        ques.push({ ...mainSectionData, is_accordian: false });
      }
    }
    // }
    setFeilds(ques);
  };

  useImperativeHandle(ref, () => ({
    getQuestionAnswer() {
      return feilds;
    },
  }));

  const sortHandler = (
    ancestorIndex: number[],
    item: SortableItems,
    oldIndex: number,
    newIndex: number
  ): SortableItems => {
    if (ancestorIndex.length === 0)
      return arrayMoveImmutable(item, oldIndex, newIndex);

    let newItem = cloneDeep(item);
    const rightest = ancestorIndex[0];
    const rest = ancestorIndex.slice(1);

    if (rest.length === 0) {
      newItem[rightest].inputs!.items = arrayMoveImmutable(
        newItem[rightest].inputs!.items,
        oldIndex,
        newIndex
      );
    } else {
      newItem[rightest].inputs!.items = sortHandler(
        rest,
        newItem[rightest].inputs!.items,
        oldIndex,
        newIndex
      );
    }

    return newItem;
  };

  const onSortEnd: OnSortEndHandler =
    (parentIdx) =>
    ({ oldIndex, newIndex }) => {
      setFeilds((prev) => sortHandler(parentIdx, prev, oldIndex, newIndex));
    };

  return (
    <ScrollbarWrapper>
      <Grid
        sx={{
          m: 2,
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
            <>
              <FormControl size="small" sx={{ width: 250, mr: 2 }}>
                <InputLabel id="demo-select-small">
                  Select default form
                </InputLabel>
                <Select
                  MenuProps={{ style: { zIndex: 1000002 } }}
                  label="Select default form"
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={defaultForm}
                  onChange={handleChange}
                >
                  {defaultFormArr.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={() => {
                  if (!isEmpty(feilds)) {
                    setBtnAccordian("not_accordian");
                    setIndexData(feilds);
                    setOpenModal(true);
                  } else {
                    add("not_accordian");
                  }
                }}
                size="small"
                sx={{ mr: 2 }}
              >
                <Add /> Add Outer Input
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  if (!isEmpty(feilds)) {
                    setBtnAccordian("is_accordian");
                    setIndexData(feilds);
                    setOpenModal(true);
                  } else {
                    add("is_accordian");
                  }
                }}
                size="small"
              >
                <Add /> Add Form
              </Button>
            </>
          )}
        </Grid>

        <SortableList
          items={feilds}
          onSortEnd={onSortEnd([])}
          useDragHandle
          parentIndex={[]}
          sortEndHandler={onSortEnd}
          setFeilds={setFeilds}
          btnDisabled={btnDisabled}
          setBtnDisabled={setBtnDisabled}
          isEdit={isEdit}
        />
      </Grid>
      <DialogSlide
        open={openModal}
        onDeny={onClose}
        onClose={onClose}
        dialogTitle={"Add New Form"}
      >
        <Box sx={style}>
          <Box sx={{ mb: { xs: 3, xl: 4 } }}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small">
                Select where to add new form
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
                label={"Select where to add new form"}
                value={selectIndex}
                onChange={(event: any) => setSelectIndex(event.target.value)}
              >
                {indexData &&
                  !isEmpty(indexData) &&
                  indexData?.map((sFA: any, index: number) => {
                    console.log(
                      "🚀 ~ file: index.tsx:361 ~ indexData.inputs?.map ~ sFA:",
                      index
                    );
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
                  onChange={handleRadioChange}
                >
                  <FormControlLabel
                    value="up"
                    control={<Radio />}
                    label={`Add form above selected form`}
                  />
                  <FormControlLabel
                    value="below"
                    control={<Radio />}
                    label={`Add form below selected form`}
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
                  add(btnAccordian, "modal", selectIndex);
                }
              }}
            >
              Add
            </Button>
          </Box>
        </Box>
      </DialogSlide>
    </ScrollbarWrapper>
  );
};

export default DynamicForm;
