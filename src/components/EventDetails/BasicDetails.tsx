import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Grow,
  Modal,
  Stack,
  Typography,
  Link,
} from "@mui/material";
import { isEmpty, isArray, size } from "lodash";
import { styled } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { initialTimeFormat } from "shared/constants/AppConst";
import BoxCards from "components/Food/BoxCard";
import DialogSlide from "components/DialogSlide";
import { Fonts } from "shared/constants/AppEnums";
import { AppLoader, AppScrollbar } from "@crema";
import InfiniteList from "react-infinite-scroll-list";
import { LoadingButton } from "@mui/lab";
import EventReport from "pages/report/eventReport";
import JudgeReport from "pages/report/judgeReport";
import ParticipantReport from "pages/report/participantReport";
const { flag } = require("country-emoji");
let reportData = false;
let levelId: any;

const BodyStyle = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  borderRadius: "10px !important",
  padding: "10px 10px 10px 0px",
  "& .eventDetails": {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  "& .commentLists": {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    // justifyContent: "",
    marginTop: 20,
  },
  "& .details-text-div": {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 10,
    backgroundColor: "rgb(244, 247, 254)",
    borderRadius: 5,
    margin: 5,
    flexWrap: "wrap",
  },
  "& .txtStyle": {
    fontSize: "14px",
    fontWeight: "500",
    wordBreak: "break-word",
    [theme.breakpoints.down("xl")]: { fontSize: "13px" },
  },
  "& .chipsStyle": {
    fontSize: "13px",
    color: "#FFF",
    marginTop: "5px",
    [theme.breakpoints.down("xl")]: { fontSize: "12px" },
  },
  "& .cardTitle": {
    [theme.breakpoints.down("xl")]: { fontSize: "12px" },
  },
}));

interface BasicDetailsProps {
  eventDetails: any;
  commentLists?: any;
}
const BasicDetails: React.FC<BasicDetailsProps> = ({
  eventDetails,
  commentLists,
}) => {
  const history = useHistory();
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const handleAccordionClick = (index) => {
    setExpandedAccordion(index === expandedAccordion ? null : index);
  };
  const [seeMore, setSeeMore] = React.useState<any>("");
  const [textShown, setTextShown] = React.useState<any>(false);
  // to open modal dialog

  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const [isModalOpen, setModalOpen] = useState(false);

  const [selectedCriterionIndex, setSelectedCriterionIndex] = useState<
    any | null
  >(null);
  const [modelData, setModelData] = useState<string | null>(null);
  const [disModalOpen, descriptionModalOpen] = useState(false);
  const judgementCriteriaArray = Array.isArray(
    eventDetails?.form_data?.judgement_criteria
  )
    ? eventDetails.form_data.judgement_criteria
    : [];

  const marksScoreArray = Array.isArray(
    eventDetails?.form_data?.marks_and_scores
  )
    ? eventDetails.form_data.marks_and_scores
    : [];

  const avArray = Array.isArray(eventDetails.form_data?.a_and_v_requirements)
    ? eventDetails.form_data.a_and_v_requirements
    : [];
  const awardsPricesArray = Array.isArray(
    eventDetails.form_data?.awards_and_prices
  )
    ? eventDetails.form_data.awards_and_prices
    : [];
  const rulesRegulationsArray = Array.isArray(
    eventDetails.form_data?.rules_and_regulations
  )
    ? eventDetails.form_data.rules_and_regulations
    : [];
  const termsConditionsArray = Array.isArray(
    eventDetails.form_data?.terms_and_conditions
  )
    ? eventDetails.form_data.rules_and_regulations
    : [];
  const privacyPolicyArray = Array.isArray(
    eventDetails.form_data?.privacy_and_policies
  )
    ? eventDetails.form_data.privacy_and_policies
    : [];
  const handleButtonClick = (data: any) => {
    setModalOpen(true);
    setModelData(data);
  };

  const handleCloseModal = () => {
    setSelectedCriterionIndex(null);
    setModalOpen(false);
    descriptionModalOpen(false);
  };
  const DialogWrapper = styled(Box)(({ theme }) => ({
    "& .datePicker": {
      "& input": { padding: "8px 14px !important" },
      // "& .MuiInputLabel-root": { top: "-8px" },
    },
    "& .MuiButtonBase-root": { fontSize: "12px !important" },
    width: 500,
    height: 250,
  }));

  // const handleButtonClick = (criteria) => {
  //   setSelectedCriteria(criteria);
  //   setIsModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  // };

  return (
    <BodyStyle>
      <Grid container spacing={2} sx={{ m: 0, width: "100%" }}>
        <Grid item className="eventDetails" xl={12}>
          {/* Event Titel */}
          {eventDetails?.form_data?.what_s_your_event && (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                title="Title"
                values={eventDetails?.form_data?.what_s_your_event || "-"}
                // values={eventDetails?.user_name || "-"}
              />
            </Grid>
          )}

          {/* User Type */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Status"
              isStack={true}
              renderStack={() => {
                return (
                  // <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  //   {eventDetails?.is_donor ? (
                  //     <Chip
                  //       className="chipsStyle"
                  //       style={{ backgroundColor: "#2e7d32" }}
                  //       label="Donor"
                  //       size="small"
                  //     />
                  //   ) : null}

                  //   {eventDetails?.is_ngo ? (
                  //     <Chip
                  //       className="chipsStyle"
                  //       style={{ backgroundColor: "#ed6c02" }}
                  //       label="NGO"
                  //       size="small"
                  //     />
                  //   ) : null}

                  //   {eventDetails?.is_user ? (
                  //     <Chip
                  //       className="chipsStyle"
                  //       style={{ backgroundColor: "#1976d2" }}
                  //       label="Beneficiary"
                  //       size="small"
                  //     />
                  //   ) : null}

                  //   {eventDetails?.is_volunteer ? (
                  //     <Chip
                  //       className="chipsStyle"
                  //       style={{ backgroundColor: "#9c27b0" }}
                  //       label="Volunteer"
                  //       size="small"
                  //     />
                  //   ) : null}
                  // </Stack>

                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    {eventDetails?.status === "scheduled" ? (
                      <Chip
                        className="chipsStyle"
                        style={{ backgroundColor: "#1976d2" }}
                        label="Scheduled"
                        size="small"
                      />
                    ) : null}
                    {eventDetails?.status === "live" ? (
                      <Chip
                        className="chipsStyle"
                        style={{ backgroundColor: "#2e7d32" }}
                        label="Live"
                        size="small"
                      />
                    ) : null}
                    {eventDetails?.status === "past" ? (
                      <Chip
                        className="chipsStyle"
                        style={{ backgroundColor: "#d32f2f" }}
                        label="Past"
                        size="small"
                      />
                    ) : null}
                    {eventDetails?.status === "draft" ? (
                      <Chip
                        className="chipsStyle"
                        style={{ backgroundColor: "#F1C40F" }}
                        label="Draft"
                        size="small"
                      />
                    ) : null}
                  </Stack>
                );
              }}
            />
          </Grid>
          {/* Created By */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Created By"
              values={eventDetails.userName ? eventDetails.userName : "-"}
            />
          </Grid>
          {/* Created At */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Created At"
              values={
                moment(eventDetails?.createdAt).format(initialTimeFormat) || "-"
              }
            />
          </Grid>

          {/* Email */}
          {eventDetails?.email ? (
            <Grid item xs={6} lg={4} xl={3}>
              <BoxCards title="Email" values={eventDetails?.email || "-"} />
            </Grid>
          ) : null}
          {/* Event Description */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Event Description"
              values={
                eventDetails.form_data.describe_your_event ? (
                  <>
                    <Typography
                      sx={{
                        fontSize: { lg: 10, xl: 12 },
                        mt: 2,
                        px: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: textShown ? undefined : 2,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {eventDetails.form_data.describe_your_event}
                    </Typography>
                    {size(eventDetails?.form_data.describe_your_event) >
                      100 && (
                      <Link
                        underline="none"
                        sx={{
                          cursor: "pointer",
                          ml: 1,
                          fontSize: { lg: 10, xl: 12 },
                        }}
                        onClick={() => {
                          setTextShown(!textShown);
                        }}
                      >
                        {textShown ? "Read less" : "Read more"}
                      </Link>
                    )}
                    {/* <button onClick={() => descriptionModalOpen(true)}>
                          Read More
                        </button> */}
                  </>
                ) : (
                  <Typography>-</Typography>
                )
              }
            />

            {/* Modal */}
            <DialogSlide
              open={disModalOpen}
              onDeny={handleCloseModal}
              onClose={handleCloseModal}
              dialogTitle={""}
              dialogContentStyle={{
                "& .MuiDialog-paper": { maxWidth: "calc(100vh + 300px)" },
              }}
            >
              <DialogWrapper>
                <Typography variant="h6">Event Description</Typography>
                <Typography>
                  {eventDetails.form_data.describe_your_event}
                </Typography>
              </DialogWrapper>
            </DialogSlide>
          </Grid>
          {/* Event type(category) */}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Event Type"
              values={
                eventDetails?.form_data?.event_type
                  ? eventDetails.form_data.event_type.name
                  : "-"
              }
            />
          </Grid>

          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Event Category"
              values={
                isArray(eventDetails.form_data.event_category) &&
                eventDetails.form_data.event_category.length > 0 ? (
                  <div>
                    <Button
                      size="small"
                      onClick={() => handleButtonClick("eventCategory")}
                      variant="outlined"
                      style={{ marginTop: 5 }}
                    >
                      View Details
                    </Button>
                    {/* <button onClick={() => handleButtonClick("eventCategory")}>
                      View Details
                    </button> */}
                  </div>
                ) : (
                  <Typography>No Event Category available</Typography>
                )
              }
            />
          </Grid>
          <Grid item xs={12} lg={12} xl={12}>
            <Accordion
              sx={{
                mt: 2,
                backgroundColor: "rgba(229, 246, 253, 0.5)",
                borderRadius: "5px",
                borderWidth: "1px",
                borderColor: "rgba(229, 246, 253, 0.5)",
                boxShadow: "-4px 4px 5px -3px rgb(0 0 0 / 20%)",
                overflow: "hidden",
                ml: 1,
              }}
            >
              <AccordionSummary>Organizers</AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {eventDetails.organizers &&
                  eventDetails.organizers != null ? (
                    eventDetails.organizers.map((item, index) => (
                      <Grid item xs={4} key={index}>
                        <div style={{ wordWrap: "break-word" }}>
                          <p>Name: {item.user_name ? item.user_name : "-"}</p>
                          <p>
                            Phone:{" "}
                            {item.phone
                              ? item.phone_code + " " + item.phone
                              : "-"}
                          </p>
                          <p>Email: {item.email ? item.email : "-"}</p>
                        </div>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      {"-"}
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {!isEmpty(eventDetails?.levelsData) &&
            eventDetails.levelsData.map((level, index) => (
              <Grid item key={index} xs={12} lg={12} xl={12}>
                <Accordion
                  sx={{
                    mt: 2,
                    backgroundColor: "rgba(229, 246, 253, 0.5)",
                    borderRadius: "5px",
                    borderWidth: "1px",
                    borderColor: "rgba(229, 246, 253, 0.5)",
                    boxShadow: "-4px 4px 5px -3px rgb(0 0 0 / 20%)",
                    overflow: "hidden",
                    mb: 2,
                    ml: 1,
                  }}
                >
                  <AccordionSummary>Level {index + 1}</AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <div style={{ wordWrap: "break-word" }}>
                          <p>
                            Description:{" "}
                            {level.description ? level.description : "-"}
                          </p>
                          <p>Selected: {level.is_selected ? "Yes" : "No"}</p>
                        </div>
                      </Grid>
                      <Grid item xs={4} style={{ textAlign: "center" }}>
                        <p>Participants:</p>
                        {Array.isArray(level.participants) &&
                          level.participants.map((participant, i) => (
                            <p key={i}>
                              {participant.user_name}
                              {`${
                                participant.user_type != undefined &&
                                participant.user_type != ""
                                  ? "-" + participant.user_type
                                  : ""
                              }`}
                            </p>
                          ))}
                        {/* {isArray(level.participants) &&
                        level.participants.length
                          ? level.participants.map((participant, i) =>
                              isArray(participant.reports) &&
                              participant.reports.length
                                ? participant.reports.map((item, j) => (
                                    <>
                                      {
                                        ((reportData = true),
                                        (levelId = participant.level_id))
                                      }
                                    </>
                                  ))
                                : null
                            )
                          : null} */}
                        {isArray(level.participants) &&
                        level.participants.length ? (
                          level.participants.map((participant, i) =>
                            participant.hasReports
                              ? isArray(participant.reportsData) &&
                                participant.reportsData.length
                                ? participant.reportsData.map((item, j) => (
                                    <>
                                      {
                                        ((reportData = true),
                                        (levelId = item.level_id))
                                      }
                                    </>
                                  ))
                                : null
                              : null
                          )
                        ) : (
                          <Grid item xs={12} style={{ textAlign: "center" }}>
                            {"-"}
                          </Grid>
                        )}

                        {reportData ? (
                          <div>
                            <ParticipantReport
                              eventDetails={eventDetails}
                              levelId={levelId}
                            />
                          </div>
                        ) : null}
                      </Grid>
                      <Grid item xs={4} style={{ textAlign: "center" }}>
                        <p>Judge:</p>
                        {Array.isArray(level.judges) &&
                          level.judges.map((judge, i) => (
                            <p key={i}>
                              {judge.user_name
                                ? judge.user_name +
                                  (judge.user_type != undefined &&
                                  judge.user_type != ""
                                    ? "-" + judge.user_type
                                    : "")
                                : "-"}
                            </p>
                          ))}
                        {isArray(level.judges) && level.judges.length
                          ? level.judges.map((judge, i) =>
                              judge?.hasReports
                                ? isArray(judge?.reportsData) &&
                                  judge?.reportsData.length > 0
                                  ? judge?.reportsData.map((item, j) => (
                                      <>
                                        {
                                          ((reportData = true),
                                          (levelId = item.level_id))
                                        }
                                      </>
                                    ))
                                  : null
                                : null
                            )
                          : "-"}
                        {reportData ? (
                          <div>
                            <JudgeReport
                              eventDetails={eventDetails}
                              levelId={levelId}
                            />
                          </div>
                        ) : null}

                        {/* {
      <JudgeReport
        eventDetails={level.reports}
      />
    } */}
                        {/* <BoxCards
      title="Reports"
      values={
        isArray(level.reports) &&
        level.reports.length > 0 ? (
          <div>
            <button
              onClick={() =>
                handleButtonClick("judgeReport")
              }
            >
              View Details
            </button>
          </div>
        ) : (
          <Typography>No Report available</Typography>
        )
      }
    /> */}
                      </Grid>

                      <Grid item xs={4}>
                        <p>Location:</p>
                        {level.location && (
                          <>
                            <p>Lat: {level.location.lat}</p>
                            <p>Lng: {level.location.lng}</p>
                            <p>Country: {level.location.country}</p>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Judgement Criteria"
              values={
                isArray(eventDetails.form_data.judgement_criteria) &&
                eventDetails.form_data.judgement_criteria.length > 0 ? (
                  <div>
                    <Button
                      size="small"
                      onClick={() => handleButtonClick("judgmentCriteria")}
                      variant="outlined"
                      style={{ marginTop: 5 }}
                    >
                      View Details
                    </Button>
                    {/* <button
                      onClick={() => handleButtonClick("judgmentCriteria")}
                    >
                      View Details
                    </button> */}
                  </div>
                ) : (
                  <Typography>No awards and prices available</Typography>
                )
              }
            />
          </Grid>
          <DialogSlide
            open={isModalOpen}
            onDeny={handleCloseModal}
            onClose={handleCloseModal}
            dialogTitle={""}
            dialogContentStyle={{
              "& .MuiDialog-paper": { maxWidth: "calc(100vh + 300px)" },
            }}
          >
            <DialogWrapper>
              {modelData === "judgmentCriteria" ? (
                <>
                  <Typography variant="h6">
                    Judgement Criteria Details
                  </Typography>
                  {judgementCriteriaArray && judgementCriteriaArray != null
                    ? judgementCriteriaArray?.map((item, index) => {
                        return (
                          <>
                            <Typography>
                              <b>Criteria </b>
                              {index + 1}
                            </Typography>
                            <Typography>
                              <b>Description: </b>
                              {item.description}
                            </Typography>
                            <Typography>Manual: {item.manual}</Typography>{" "}
                          </>
                        );
                      })
                    : ""}
                </>
              ) : modelData === "marksScore" ? (
                <>
                  <Typography variant="h6">Marks And Score Details</Typography>
                  {marksScoreArray && marksScoreArray != null
                    ? marksScoreArray.map((item, index) => {
                        return (
                          <>
                            <Typography>
                              <b>Marks And Score </b>
                              {index + 1}
                            </Typography>
                            <Typography>
                              <b>Description: </b>
                              {item.description}
                            </Typography>
                            <Typography>Manual: {item.manual}</Typography>{" "}
                          </>
                        );
                      })
                    : ""}
                </>
              ) : modelData === "avRequirements" ? (
                <>
                  <Typography variant="h6">
                    A & V Requirements Details
                  </Typography>
                  {avArray && avArray != null
                    ? avArray?.map((item, index) => {
                        return (
                          <>
                            <Typography>
                              <b>A & V Requirements </b>
                              {index + 1}
                            </Typography>
                            <Typography>
                              <b>Description: </b>
                              {item.description}
                            </Typography>
                            <Typography>Manual: {item.manual}</Typography>{" "}
                          </>
                        );
                      })
                    : ""}
                </>
              ) : modelData === "awardsPrices" ? (
                <>
                  <Typography variant="h6">
                    Awards And Prices Details
                  </Typography>

                  {awardsPricesArray && awardsPricesArray != null
                    ? awardsPricesArray?.map((item, index) => {
                        return (
                          <>
                            <Typography>
                              <b>Awards And Prices </b>
                              {index + 1}
                            </Typography>
                            <Typography>
                              <b>Description: </b>
                              {item.description}
                            </Typography>
                            <Typography>Manual: {item.manual}</Typography>{" "}
                          </>
                        );
                      })
                    : ""}
                </>
              ) : modelData === "rulesRegulations" ? (
                <>
                  <Typography variant="h6">
                    Awards And Prices Details
                  </Typography>

                  {awardsPricesArray && awardsPricesArray != null
                    ? awardsPricesArray?.map((item, index) => {
                        return (
                          <>
                            <Typography>
                              <b>Awards And Prices </b>
                              {index + 1}
                            </Typography>
                            <Typography>
                              <b>Description: </b>
                              {item.description}
                            </Typography>
                            <Typography>Manual: {item.manual}</Typography>{" "}
                          </>
                        );
                      })
                    : ""}
                </>
              ) : modelData === "termsConditions" ? (
                <>
                  <Typography variant="h6">
                    Terms And Conditions Details
                  </Typography>

                  {termsConditionsArray && termsConditionsArray != null
                    ? termsConditionsArray?.map((item, index) => {
                        return (
                          <>
                            <Typography>
                              <b>Terms And Conditions </b>
                              {index + 1}
                            </Typography>
                            <Typography>
                              <b>Description: </b>
                              {item.description}
                            </Typography>
                            <Typography>Manual: {item.manual}</Typography>{" "}
                          </>
                        );
                      })
                    : ""}
                </>
              ) : modelData === "privacyPolicy" ? (
                <>
                  <Typography variant="h6">Privacy Policy Details</Typography>

                  {privacyPolicyArray && privacyPolicyArray != null
                    ? privacyPolicyArray?.map((item, index) => {
                        return (
                          <>
                            <Typography>
                              <b>Privacy Policy </b>
                              {index + 1}
                            </Typography>
                            <Typography>
                              <b>Description: </b>
                              {item.description}
                            </Typography>
                            <Typography>Manual: {item.manual}</Typography>{" "}
                          </>
                        );
                      })
                    : ""}
                </>
              ) : modelData === "eventCategory" ? (
                <>
                  <Typography variant="h6">Event Category</Typography>

                  {eventDetails.form_data.event_category?.map((item, index) => {
                    return (
                      <>
                        <Typography>
                          <b>Event Category </b>
                          {index + 1}
                        </Typography>
                        <Typography>
                          <b>Name: </b>
                          {item.name}
                        </Typography>{" "}
                      </>
                    );
                  })}
                </>
              ) : modelData === "judgeReport" ? (
                <>
                  <Typography variant="h6">Event Category</Typography>

                  {eventDetails.form_data.event_category?.map((item, index) => {
                    return (
                      <>
                        <Typography>
                          <b>Event Category </b>
                          {index + 1}
                        </Typography>
                        <Typography>
                          <b>Name: </b>
                          {item.name}
                        </Typography>{" "}
                      </>
                    );
                  })}
                </>
              ) : null}
              {/* Add a message if no criterion is selected */}
              {/* {!selectedCriterionIndex && (
                  <Typography>No criterion selected.</Typography>
                )} */}
              {/* <button onClick={handleCloseModal}>Close</button> */}
            </DialogWrapper>
          </DialogSlide>
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Marks And Scores"
              values={
                isArray(eventDetails.form_data.marks_and_scores) &&
                eventDetails.form_data.marks_and_scores.length > 0 ? (
                  <div>
                    <Button
                      size="small"
                      onClick={() => handleButtonClick("marksScore")}
                      variant="outlined"
                      style={{ marginTop: 5 }}
                    >
                      View Details
                    </Button>
                    {/* <button onClick={() => handleButtonClick("marksScore")}>
                      View Details
                    </button> */}
                  </div>
                ) : (
                  <Typography>No awards and prices available</Typography>
                )
              }
            />
          </Grid>
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="A & V Requirements"
              values={
                isArray(eventDetails.form_data.a_and_v_requirements) &&
                eventDetails.form_data.a_and_v_requirements.length > 0 ? (
                  <div>
                    <Button
                      size="small"
                      onClick={() => handleButtonClick("avRequirements")}
                      variant="outlined"
                      style={{ marginTop: 5 }}
                    >
                      View Details
                    </Button>
                    {/* <button onClick={() => handleButtonClick("avRequirements")}>
                      View Details
                    </button> */}
                  </div>
                ) : (
                  <Typography>No awards and prices available</Typography>
                )
              }
            />
          </Grid>
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Awards And Prices"
              values={
                isArray(eventDetails.form_data.awards_and_prices) &&
                eventDetails.form_data.awards_and_prices.length > 0 ? (
                  <div>
                    <Button
                      size="small"
                      onClick={() => handleButtonClick("awardsPrices")}
                      variant="outlined"
                      style={{ marginTop: 5 }}
                    >
                      View Details
                    </Button>
                    {/* <button onClick={() => handleButtonClick("awardsPrices")}>
                      View Details
                    </button> */}
                  </div>
                ) : (
                  <Typography>No awards and prices available</Typography>
                )
              }
            />
          </Grid>
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Rules And Regulations"
              values={
                isArray(eventDetails.form_data.rules_and_regulations) &&
                eventDetails.form_data.rules_and_regulations.length > 0 ? (
                  <div>
                    <Button
                      size="small"
                      onClick={() => handleButtonClick("rulesRegulations")}
                      variant="outlined"
                      style={{ marginTop: 5 }}
                    >
                      View Details
                    </Button>
                    {/* <button
                      onClick={() => handleButtonClick("rulesRegulations")}
                    >
                      View Details
                    </button> */}
                  </div>
                ) : (
                  <Typography>No Rules And Regulations available</Typography>
                )
              }
            />
          </Grid>
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Terms And Conditions"
              values={
                isArray(eventDetails.form_data.terms_and_conditions) &&
                eventDetails.form_data.terms_and_conditions.length > 0 ? (
                  <div>
                    <Button
                      size="small"
                      onClick={() => handleButtonClick("termsConditions")}
                      variant="outlined"
                      style={{ marginTop: 5 }}
                    >
                      View Details
                    </Button>
                    {/* <button
                      onClick={() => handleButtonClick("termsConditions")}
                    >
                      View Details
                    </button> */}
                  </div>
                ) : (
                  <Typography>No Terms And Conditions available</Typography>
                )
              }
            />
          </Grid>
          <Grid item xs={6} lg={4} xl={3}>
            <BoxCards
              title="Privacy Policy"
              values={
                isArray(eventDetails.form_data.privacy_and_policies) &&
                eventDetails.form_data.privacy_and_policies.length > 0 ? (
                  <div>
                    <Button
                      size="small"
                      onClick={() => handleButtonClick("privacyPolicy")}
                      variant="outlined"
                      style={{ marginTop: 5 }}
                    >
                      View Details
                    </Button>
                    {/* <button onClick={() => handleButtonClick("privacyPolicy")}>
                      View Details
                    </button> */}
                  </div>
                ) : (
                  <Typography>No Privacy Policy available</Typography>
                )
              }
            />
          </Grid>
          {/* currency */}
          {isArray(eventDetails?.country_data?.currency) ? (
            <Grid item xs={6} lg={4} xl={3}>
              <div className="details-text-div">
                <Typography className="cardTitle">Currency</Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "50%",
                  }}
                >
                  <Typography
                    variant="button"
                    className="txtStyle"
                    style={{ width: "100%" }}
                  >
                    Name:
                    {eventDetails &&
                      eventDetails?.country_data?.currency?.map(
                        (it: any, index: any) => {
                          if (isEmpty(it.name) || isEmpty(it.symbol)) {
                            return null;
                          }
                          return (
                            <Box key={index}>
                              <Typography
                                variant="inherit"
                                sx={{
                                  wordBreak: "break-word",
                                  color: "text.secondary",
                                }}
                                className="txtStyle"
                              >
                                {it?.name || "-"}
                              </Typography>
                            </Box>
                          );
                        }
                      )}
                  </Typography>
                  <Typography
                    variant="button"
                    className="txtStyle"
                    style={{ width: "100%" }}
                  >
                    Symbol:
                    {eventDetails &&
                      eventDetails?.country_data?.currency?.map(
                        (it: any, index: any) => {
                          if (isEmpty(it.name) || isEmpty(it.symbol)) {
                            return null;
                          }
                          return (
                            <Box key={index}>
                              <Typography
                                variant="inherit"
                                sx={{
                                  wordBreak: "break-word",
                                  color: "text.secondary",
                                }}
                                className="txtStyle"
                              >
                                {it?.symbol || "-"}
                              </Typography>
                            </Box>
                          );
                        }
                      )}
                  </Typography>
                </Box>
              </div>
            </Grid>
          ) : null}
          {/* Causes */}
          {!isEmpty(eventDetails?.my_causes) ? (
            <Grid item xs={6} lg={4} xl={3}>
              <div className="details-text-div">
                <Typography className="cardTitle">Causes</Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {/* {eventDetails?.my_causes?.map((it: any, index: number) => {
                      return (
                        <Chip
                          sx={{
                            mt: 1,
                            mr:
                              index !== eventDetails?.my_causes?.length - 1
                                ? 1
                                : 0,
                          }}
                          className="txtStyle"
                          label={it.charAt(0).toUpperCase() + it.slice(1) || "-"}
                          size="small"
                        />
                      );
                    })} */}
                </Box>
              </div>
            </Grid>
          ) : null}
          {/* Food Type */}
          {/* <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                isChip={true}
                title="Food Type"
                style={{
                  color: "#FFF",
                  backgroundColor: eventDetails?.is_veg
                    ? "#2e7d32" //success
                    : "#d32f2f", //error
                }}
                values={`${eventDetails?.is_veg ? "Veg" : "Veg/Non-Veg"}` || "-"}
              />
            </Grid> */}
          {/* Is NGO */}
          {/* <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                isChip={true}
                title="Is NGO?"
                style={{
                  color: "#FFF",
                  backgroundColor: eventDetails?.is_ngo
                    ? "#2e7d32" //success
                    : "#d32f2f", //error
                }}
                values={eventDetails?.is_ngo ? "Yes" : "No" || "-"}
              />
            </Grid> */}
          {/* NGO Name */}
          {/* {eventDetails && eventDetails?.is_ngo && (
              <Grid item xs={6} lg={4} xl={3}>
                <BoxCards
                  isLink={true}
                  title="NGO Name"
                  values={eventDetails?.ngo_data?.ngo_name || "-"}
                  onClick={() => {
                    history.push({
                      pathname: `/ngo/${eventDetails?.ngo_data?._id}`,
                      state: {
                        id: eventDetails?.ngo_data?._id,
                        userId: eventDetails?._id,
                        userData: eventDetails,
                        from: "user-detail",
                      },
                    });
                  }}
                />
              </Grid>
            )} */}
          {/* is_restaurant */}
          {/* <Grid item xs={6} lg={4} xl={3}>
              <BoxCards
                isChip={true}
                title="Is Restaurant?"
                style={{
                  color: "#FFF",
                  backgroundColor: eventDetails?.is_restaurant
                    ? "#2e7d32" //success
                    : "#d32f2f", //error
                }}
                values={`${eventDetails?.is_restaurant ? "Yes" : "No"}` || "-"}
              />
            </Grid> */}
          {/* restaurant_name */}
          {/* {eventDetails?.is_restaurant && (
              <Grid item xs={6} lg={4} xl={3}>
                <BoxCards
                  title="Restaurant Name"
                  values={eventDetails?.restaurant_name || "-"}
                />
              </Grid>
            )} */}
          {/* User Location */}
          {/* <Grid item xs={12}>
              <BoxCards
                title="User Location"
                values={eventDetails?.location?.city || "-"}
              />
            </Grid> */}
          {/* restaurant_location */}
          {/* {eventDetails?.is_restaurant && (
              <Grid item xs={12}>
                <BoxCards
                  title="Restaurant Location"
                  values={eventDetails?.restaurant_location?.city || "-"}
                />
              </Grid>
            )} */}
        </Grid>
      </Grid>
    </BodyStyle>
  );
};

export default BasicDetails;
