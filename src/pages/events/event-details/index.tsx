import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Grid,
  IconButton,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { Fonts } from "shared/constants/AppEnums";
import { AppLoader, AppScrollbar } from "@crema";
import InfiniteList from "react-infinite-scroll-list";
import { toast } from "react-toastify";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { isEmpty, flattenDeep } from "lodash";
import nodata from "@crema/Lotties/nodata.json";
import Lottie from "lottie-react";
import getApiData from "../../../shared/helpers/apiHelper";
import IntlMessages from "@crema/utility/IntlMessages";
import EventData from "components/EventDetails/EventData";
import BasicDetails from "components/EventDetails/BasicDetails";
import EventReport from "pages/report/eventReport";
import { AccountBalanceOutlined, Block, Delete } from "@mui/icons-material";
import AppsContent from "@crema/core/AppsContainer/AppsContent";
import AppsHeader from "@crema/core/AppsContainer/AppsHeader";
import AppTooltip from "@crema/core/AppTooltip";
import DialogSlide from "components/DialogSlide";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import BankDetailModal from "components/Food/BankDetailModal";
import moment from "moment";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";

const BodyStyle = styled(Box)(({ theme }) => ({
  zIndex: 1000002,
  "& .topDiv": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    top: "60px",
    // backgroundColor: "#f4f7fe",
    zIndex: 1000002,
  },
  "& .stickyClass": {
    // backgroundColor: "#f4f7fe",
    zIndex: 10,
    paddingBottom: "10px",
  },
  "& .apps-header": {
    position: "sticky",
    padding: "0px 10px",
    top: "0px",
    backgroundColor: "#fff",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  "& .bottomSpace": { marginBottom: 50 },
  "& .linkClass": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const ErrorTextStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.dark,
}));

const EventDetails = (props) => {
  const history = useHistory();
  const { id }: { id: string } = useParams();
  const [eventDetail, setEventDetail] = useState<any>({});
  const [commentList, setCommentList] = useState<any>({});

  const [likesTotal, setLikesTotal] = React.useState<any>(0);
  const [viewReply, setViewReply] = React.useState<any>("");
  const [comntPage, setComntPage] = React.useState(1);
  const [comntNextPage, setComntNextPage] = React.useState(false);
  const [comntNextLoading, setComntNextLoading] = React.useState(false);

  const [loader, setLoader] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const eventLikeBlock = {
    display: "block",
    height: "35px",
  };
  //API For get ngo details
  async function getEventDetail() {
    setLoader(true);
    try {
      let eventId = "";

      eventId = id;

      const res = await getApiData(`event/detail/${eventId}`, {}, "GET");
      if (res.success) {
        setEventDetail(res && res.data ? res.data : {});
      } else {
        setEventDetail({});
        toast.error(res.message);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      setEventDetail({});
      toast.error("Something went wrong");
    }
  }

  // API to get comments
  async function getComments(currentPage = comntPage, noload?: any, cID?: any) {
    setLoader(true);
    try {
      let data = { page: currentPage };
      if (noload) {
        setLoader(false);
      } else {
        setLoader(true);
      }

      const res = await getApiData(`comments/comment-detail/${cID}`, {}, "GET");
      if (res.success) {
        let tempPArr = res.data;
        if (data.page > 1) {
          tempPArr = flattenDeep([commentList, res?.data]);
        }
        if (res?.next_enable === 1) {
          setComntNextPage(true);
        } else {
          setComntNextPage(false);
        }
        setComntNextLoading(false);
        setCommentList(tempPArr);
        setLoader(false);
        setLikesTotal(res.total_count);
      } else {
        setCommentList({});
        toast.error(res.message);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      setCommentList({});
      toast.error("Something went wrong");
    }
  }

  const onCmntEndReached = () => {
    const tempPage = comntPage + 1;
    setComntNextLoading(true);
    setComntPage(tempPage);
    getComments(tempPage, false, id);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await getEventDetail();
        await getComments(1, true, id);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <AppsContent isDetailView>
      <BodyStyle>
        <AppsHeader>
          <div style={{ display: "flex", alignItems: "center" }}>
            <AppTooltip title={<IntlMessages id="common.back" />}>
              <IconButton
                sx={{
                  color: (theme) => theme.palette.text.disabled,
                }}
                onClick={() => history.goBack()}
              >
                <KeyboardBackspaceIcon />
              </IconButton>
            </AppTooltip>
            <Breadcrumbs aria-label="breadcrumb" sx={{ ml: 2 }}>
              <Link className="linkClass" to={{ pathname: "/dashboard" }}>
                Dashboards
              </Link>

              <Link className="linkClass" to={{ pathname: "/events" }}>
                Event
              </Link>
            </Breadcrumbs>
          </div>
          {
            <EventReport
              eventDetails={eventDetail}
              reports={eventDetail?.reports ? eventDetail?.reports : []}
            />
          }
        </AppsHeader>
        {loader ? (
          <AppLoader />
        ) : (
          <>
            <Grid
              container
              spacing={4}
              xs={12}
              style={{ margin: 0 }}
              className="topDiv"
            >
              {loader ? (
                <AppLoader />
              ) : (
                <>
                  {eventDetail && Object.keys(eventDetail).length > 0 ? (
                    <>
                      {/* Event And Basic Deatils View */}
                      <Grid item xs={12} sm={6} lg={9} xl={9}>
                        <BasicDetails
                          eventDetails={eventDetail}
                          // commentLists={commentList}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={3} xl={3}>
                        {/* {eventDetail} */}
                        <div style={eventLikeBlock}>
                          <span>{eventDetail.likeCount} Likes</span>{" "}
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <span>{eventDetail.dislikeCount} Dislikes</span>
                        </div>
                        <AppScrollbar
                          sx={{
                            height: `calc(100vh - 190px)`,
                            p: "0 10px 10px 10px",
                            borderRadius: "10px 15px",
                            backgroundColor: "#fff",
                          }}
                        >
                          <InfiniteList
                            root="container|viewport"
                            dataLength={likesTotal}
                            hasMore={true}
                            isLoading={comntNextLoading}
                            isEndReached={!comntNextPage}
                            // onReachThreshold={() => onLikeEndReached()}
                            containerClassName="custom-container-class-name"
                            sentinelClassName="custom-sentinel-class-name"
                            containerTagName="div"
                            sentinelTagName="div"
                            threshold={0.8}
                          >
                            <Box
                              sx={{
                                minHeight: { xs: 40, sm: 50 },
                                position: "sticky",
                                top: 0,
                                borderBottom: "1px solid #b0a9a957",
                                background: "white",
                                zIndex: 1,
                                padding: "0px 15px",
                                display: "flex",
                                alignItems: "center",
                                mb: "15px",
                              }}
                            >
                              <Typography
                                component="h3"
                                sx={{
                                  textAlign: "center",
                                  width: "100%",
                                  fontSize: { lg: 14, xl: 16 },
                                  color: "text.primary",
                                  fontWeight: Fonts.SEMI_BOLD,
                                }}
                              >
                                Comments
                              </Typography>
                            </Box>
                            {loader && !comntNextPage ? (
                              <Box
                                sx={{
                                  alignItems: "center",
                                  justifyContent: "center",
                                  height: "calc(50vh)",
                                }}
                              >
                                <AppLoader />
                              </Box>
                            ) : (
                              !isEmpty(commentList) &&
                              commentList?.map((item?: any) => {
                                return (
                                  <Box sx={{ py: 1.5 }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                      }}
                                    >
                                      <Avatar
                                        sx={{ width: 30, height: 30 }}
                                        src={item?.user_image || ""}
                                      />
                                      <Box sx={{ ml: 2, width: "100%" }}>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              width: "100%",
                                              fontWeight: Fonts.MEDIUM,
                                              fontSize: { lg: 10, xl: 12 },
                                            }}
                                          >
                                            {item?.user_name || "-"}{" "}
                                            {/* {item?.last_name || "-"} */}
                                          </Box>
                                          <Box
                                            sx={{
                                              textAlign: "end",
                                              fontSize: { lg: 10, xl: 12 },
                                              ml: 3,
                                              color: "#9b9696",
                                              width: "100%",
                                            }}
                                          >
                                            {item?.createdAt
                                              ? moment(item?.createdAt).format(
                                                  "DD MMM hh:mm A"
                                                )
                                              : "-"}
                                          </Box>
                                        </Box>
                                        <Box>
                                          <Typography
                                            variant="subtitle1"
                                            sx={{
                                              fontSize: 12,
                                              color: "#9b9696",
                                            }}
                                          >
                                            {item?.comment_text || ""}
                                          </Typography>
                                        </Box>
                                        <Divider sx={{ my: 2 }} />
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            px: 2,
                                          }}
                                        >
                                          <FavoriteBorderOutlinedIcon
                                            sx={{
                                              fontSize: { lg: 12, xl: 15 },
                                              mr: 1,
                                            }}
                                          />
                                          {item?.dislikes}
                                          {item?.dislikes > 1
                                            ? " Dislikes"
                                            : " DisLike"}{" "}
                                          {item?.likes}
                                          {item?.likes > 1
                                            ? " Likes"
                                            : " Like"}{" "}
                                          <ChatOutlinedIcon
                                            sx={{
                                              fontSize: { lg: 12, xl: 15 },
                                              mr: 1,
                                            }}
                                          />
                                          {item?.replies_count}
                                          {item?.replies_count > 1
                                            ? " Replies"
                                            : " Reply"}
                                        </Box>
                                        {item?.replies_count > 0 ? (
                                          <>
                                            <Button
                                              size="small"
                                              variant="text"
                                              onClick={() => {
                                                if (item?._id === viewReply) {
                                                  setViewReply("");
                                                } else {
                                                  setViewReply(item?._id);
                                                }
                                              }}
                                              sx={{ fontSize: 11 }}
                                            >
                                              {item?._id === viewReply
                                                ? `---Hide replies (${item?.replies_count})`
                                                : `---View replies (${item?.replies_count})`}
                                            </Button>
                                            {viewReply &&
                                            item?._id === viewReply
                                              ? item?.replies?.map(
                                                  (sItem?: any) => {
                                                    return (
                                                      <Box>
                                                        <Box
                                                          sx={{
                                                            display: "flex",
                                                            alignItems:
                                                              "flex-start",
                                                          }}
                                                        >
                                                          <Avatar
                                                            sx={{
                                                              width: 30,
                                                              height: 30,
                                                            }}
                                                            src={
                                                              sItem?.user_image ||
                                                              ""
                                                            }
                                                          />
                                                          <Box
                                                            sx={{
                                                              ml: 2,
                                                              width: "100%",
                                                            }}
                                                          >
                                                            <Box
                                                              sx={{
                                                                display: "flex",
                                                                alignItems:
                                                                  "center",
                                                              }}
                                                            >
                                                              <Box
                                                                sx={{
                                                                  width: "100%",
                                                                  fontWeight:
                                                                    Fonts.MEDIUM,
                                                                  fontSize: {
                                                                    lg: 10,
                                                                    xl: 12,
                                                                  },
                                                                }}
                                                              >
                                                                {sItem?.first_name ||
                                                                  ""}{" "}
                                                                {sItem?.last_name ||
                                                                  ""}
                                                              </Box>
                                                              <Box
                                                                sx={{
                                                                  textAlign:
                                                                    "end",
                                                                  fontSize: {
                                                                    lg: 10,
                                                                    xl: 12,
                                                                  },
                                                                  ml: 3,
                                                                  color:
                                                                    "#9b9696",
                                                                  width: "100%",
                                                                }}
                                                              >
                                                                {moment(
                                                                  sItem?.createdAt
                                                                ).format(
                                                                  "DD MMM hh:mm A"
                                                                )}
                                                              </Box>
                                                            </Box>
                                                            <Box>
                                                              <Typography
                                                                variant="subtitle1"
                                                                sx={{
                                                                  fontSize: 12,
                                                                  color:
                                                                    "#9b9696",
                                                                }}
                                                              >
                                                                {sItem?.comment_text ||
                                                                  ""}
                                                              </Typography>
                                                            </Box>
                                                          </Box>
                                                        </Box>
                                                      </Box>
                                                    );
                                                  }
                                                )
                                              : null}
                                          </>
                                        ) : null}
                                      </Box>
                                    </Box>
                                  </Box>
                                );
                              })
                            )}
                            {comntNextPage ? (
                              <LoadingButton
                                variant="outlined"
                                color="secondary"
                                size="small"
                                fullWidth
                                loading={comntNextLoading}
                                disabled={comntNextLoading}
                                loadingPosition="start"
                                onClick={() => onCmntEndReached()}
                              >
                                Load More
                              </LoadingButton>
                            ) : null}
                          </InfiniteList>
                        </AppScrollbar>
                      </Grid>
                    </>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <Lottie
                        loop={true}
                        autoPlay={true}
                        animationData={nodata}
                        style={{ width: 300, height: 300 }}
                      />
                    </Box>
                  )}
                </>
              )}
            </Grid>
          </>
        )}
      </BodyStyle>
    </AppsContent>
  );
};
export default EventDetails;
