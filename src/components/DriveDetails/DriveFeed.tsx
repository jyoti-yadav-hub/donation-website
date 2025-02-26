import * as React from "react";
import { Divider, Avatar, Box, Typography, Link, Button } from "@mui/material";
import { AppCard, AppLoader, AppScrollbar } from "@crema";
import { isEmpty, flattenDeep, size } from "lodash";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import moment from "moment";
import Lottie from "lottie-react";
import { toast } from "react-toastify";
import { Fonts } from "shared/constants/AppEnums";
import { LoadingButton } from "@mui/lab";
import empty from "@crema/Lotties/empty.json";
import InfiniteList from "react-infinite-scroll-list";
import AppDialog from "@crema/core/AppDialog";
import MediaViewer from "@crema/core/AppMedialViewer";
import getApiData from "../../shared/helpers/apiHelper";
import Slider from "react-slick";
import "react-image-lightbox/style.css";
import ImageCardSlideWrapper from "pages/dashboards/Widgets/CityInfo/ImageCardSlideWrapper";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default function DriveFeed(props?: any) {
  const { feedData, nextLoading, nextPage, loading, onEndReached } = props;
  const [modalType, setModalType] = React.useState<any>("");
  const [seeMore, setSeeMore] = React.useState<any>("");
  const [textShown, setTextShown] = React.useState<any>(false);
  const [fileType, setFileType] = React.useState<any>("");
  const [filesData, setFilesData] = React.useState<any>([]);
  const [itemIndex, setIndex] = React.useState<any>(-1);
  let FileURLdata = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG", "svg", "SVG"];

  const [likePage, setLikePage] = React.useState(1);
  const [likeNextPage, setLikeNextPage] = React.useState(false);
  const [likeNextLoading, setLikeNextLoading] = React.useState(false);

  const [likesList, setLikesList] = React.useState<any>({
    lists: [],
    listsLoad: false,
    total: 0,
  });

  const [comntPage, setComntPage] = React.useState(1);
  const [comntNextPage, setComntNextPage] = React.useState(false);
  const [comntNextLoading, setComntNextLoading] = React.useState(false);

  const [comntList, setComntList] = React.useState<any>({
    lists: [],
    listsLoad: false,
    total: 0,
  });

  const [viewReply, setViewReply] = React.useState<any>("");

  const onClose = () => {
    setFilesData([]);
    setIndex(-1);
  };

  //API For get likes users lists
  async function getLikesList(
    currentPage = likePage,
    noload?: any,
    feedID?: any
  ) {
    let data = { page: currentPage };
    if (noload) {
      setLikesList((e) => ({ ...e, listsLoad: false }));
    } else {
      setLikesList((e) => ({ ...e, listsLoad: true }));
    }
    try {
      const res = await getApiData(
        `drive/admin/post-like-list/${feedID}?page=${data.page}`,
        {},
        "GET"
      );
      if (res.success) {
        let tempPArr = res.data;
        if (data.page > 1) {
          tempPArr = flattenDeep([likesList.lists, res?.data]);
        }
        if (res?.next_enable === 1) {
          setLikeNextPage(true);
        } else {
          setLikeNextPage(false);
        }
        setLikeNextLoading(false);
        setLikesList({
          lists: tempPArr || [],
          listsLoad: false,
          total: res.total_count,
        });
      } else {
        setLikesList({ lists: [], listsLoad: false, total: 0 });
        toast.error(res.message);
      }
    } catch (error) {
      setLikesList({ lists: [], listsLoad: false, total: 0 });
      toast.error("Something went wrong");
    }
  }

  //API For get comments lists
  async function getCommentsList(
    currentPage = comntPage,
    noload?: any,
    feedID?: any
  ) {
    let data = { page: currentPage };
    if (noload) {
      setComntList((e) => ({ ...e, listsLoad: false }));
    } else {
      setComntList((e) => ({ ...e, listsLoad: true }));
    }
    try {
      const res = await getApiData(
        `drive/admin/comment-list/${feedID}?page=${data.page}`,
        {},
        "GET"
      );
      if (res.success) {
        let tempPArr = res.data;
        if (data.page > 1) {
          tempPArr = flattenDeep([comntList.lists, res?.data]);
        }
        if (res?.next_enable === 1) {
          setComntNextPage(true);
        } else {
          setComntNextPage(false);
        }
        setComntNextLoading(false);
        setComntList({
          lists: tempPArr || [],
          listsLoad: false,
          total: res.total_count,
        });
      } else {
        setComntList({ lists: [], listsLoad: false, total: 0 });
        toast.error(res.message);
      }
    } catch (error) {
      setComntList({ lists: [], listsLoad: false, total: 0 });
      toast.error("Something went wrong");
    }
  }

  const onLikeEndReached = () => {
    const tempPage = likePage + 1;
    setLikeNextLoading(true);
    setLikePage(tempPage);
    getLikesList(tempPage);
  };

  const onCmntEndReached = () => {
    const tempPage = comntPage + 1;
    setComntNextLoading(true);
    setComntPage(tempPage);
    getCommentsList(tempPage);
  };

  return (
    <>
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
          dataLength={feedData?.total}
          hasMore={true}
          isLoading={nextLoading}
          isEndReached={!nextPage}
          // onReachThreshold={() => onEndReached()}
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
              Drive Feed
            </Typography>
          </Box>
          {loading && !nextPage ? (
            <AppLoader />
          ) : feedData?.lists && !isEmpty(feedData?.lists) ? (
            feedData?.lists?.map((item?: any) => {
              return (
                <AppCard
                  sxStyle={{
                    height: 1,
                    display: "flex",
                    flexDirection: "column",
                    mb: "15px",
                    backgroundColor: "rgb(244, 247, 254)",
                    boxShadow: "none !important",
                    p: "0px 5px",
                  }}
                  contentStyle={{
                    padding: 0,
                    paddingBottom: "10px !important",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{ width: 30, height: 30 }}
                        src={item?.user_image}
                      />
                      <Box
                        sx={{
                          fontWeight: Fonts.MEDIUM,
                          fontSize: { lg: 10, xl: 12 },
                          ml: 2,
                        }}
                      >
                        {item?.user_name || ""}
                      </Box>
                    </Box>
                    <Box sx={{ fontSize: { lg: 10, xl: 12 } }}>
                      {moment(item?.createdAt).format("ddd, DD MMM hh:mm A")}
                    </Box>
                  </Box>
                  <AppCard
                    sxStyle={{ height: 1 }}
                    contentStyle={{ p: 0, pb: "0px !important" }}
                  >
                    <ImageCardSlideWrapper>
                      <Slider className="imageCardSlide" {...settings}>
                        {item?.photos?.map((slide: any, index: number) => {
                          let extension = slide.split(".").pop();
                          let fullUrl = slide;
                          return (
                            <Box
                              key={index}
                              sx={{
                                position: "relative",
                                textAlign: "center",
                                fontSize: { xs: 20, xl: 24 },
                                height: { lg: "calc(40vh)", xl: "calc(30vh)" },
                              }}
                              onClick={() => {
                                if (extension === "mp4") {
                                  return;
                                } else {
                                  setFilesData(item?.photos);
                                  setIndex(index);
                                  setFileType(extension);
                                }
                              }}
                            >
                              <Box
                                sx={{
                                  "& .imageSlideFull": {
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    zIndex: extension === "mp4" ? 10 : -1,
                                    width: "100%",
                                    height: "calc(100% + 5px)",
                                    objectFit: "cover",
                                  },
                                }}
                              >
                                {extension === "mp4" ? (
                                  <video
                                    src={fullUrl}
                                    className="imageSlideFull"
                                    controls={true}
                                  />
                                ) : (
                                  <img
                                    src={
                                      FileURLdata.includes(extension)
                                        ? fullUrl
                                        : "/assets/images/doc_icon.png"
                                    }
                                    alt={"title"}
                                    className={
                                      FileURLdata.includes(extension)
                                        ? "imageSlideFull"
                                        : "extImage"
                                    }
                                  />
                                )}
                                {FileURLdata.includes(extension) ||
                                extension === "mp4" ? null : (
                                  <Typography
                                    variant="body2"
                                    className="extTextStyle"
                                  >
                                    {extension.toUpperCase() || ""}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          );
                        })}
                      </Slider>
                    </ImageCardSlideWrapper>
                  </AppCard>

                  <Box>
                    <Box component="h4">
                      <Typography
                        sx={{
                          fontSize: { lg: 10, xl: 12 },
                          mt: 2,
                          px: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitLineClamp:
                            textShown && item?._id === seeMore ? undefined : 2,
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {item?.description || ""}
                      </Typography>
                      {size(item?.description) > 100 && (
                        <Link
                          underline="none"
                          sx={{
                            cursor: "pointer",
                            ml: 1,
                            fontSize: { lg: 10, xl: 12 },
                          }}
                          onClick={() => {
                            if (item?._id === seeMore) {
                              setTextShown(!textShown);
                            }
                            setSeeMore(item?._id);
                          }}
                        >
                          {textShown && item?._id === seeMore
                            ? "Read less"
                            : "Read more"}
                        </Link>
                      )}
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
                      <Link
                        underline="none"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          lineHeight: 0,
                          fontSize: { lg: 10, xl: 12 },
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          if (item?.likes_count) {
                            getLikesList(1, false, item?._id);
                            setModalType("likes");
                          }
                        }}
                      >
                        <FavoriteBorderOutlinedIcon
                          sx={{ fontSize: { lg: 12, xl: 15 }, mr: 1 }}
                        />
                        {item?.likes_count || 0} Likes
                      </Link>
                      <Link
                        underline="none"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          lineHeight: 0,
                          fontSize: { lg: 10, xl: 12 },
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          if (item?.comments_count) {
                            setModalType("comments");
                            getCommentsList(1, false, item?._id);
                          }
                        }}
                      >
                        <ChatOutlinedIcon
                          sx={{ fontSize: { lg: 12, xl: 15 }, mr: 1 }}
                        />
                        {item?.comments_count || 0} Comments
                      </Link>
                    </Box>
                  </Box>
                </AppCard>
              );
            })
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
                animationData={empty}
                style={{ width: 300, height: 300 }}
              />
              <Box
                component="h4"
                sx={{
                  fontSize: { lg: 14, xl: 16 },
                  color: "text.primary",
                  fontWeight: Fonts.SEMI_BOLD,
                }}
              >
                No Drive Feed Found
              </Box>
            </Box>
          )}
          {nextPage ? (
            <LoadingButton
              variant="outlined"
              color="secondary"
              size="small"
              fullWidth
              loading={nextLoading}
              disabled={nextLoading}
              loadingPosition="start"
              onClick={onEndReached}
            >
              Load More
            </LoadingButton>
          ) : null}
        </InfiniteList>
      </AppScrollbar>
      {/* Modal for likes/comments lists */}
      <AppDialog
        open={modalType}
        fullHeight
        maxWidth={modalType === "likes" ? "xs" : "md"}
        onClose={() => {
          setModalType(false);
          setViewReply("");
        }}
        dividers
        title={modalType === "likes" ? "Likes" : "Comments"}
        contentStyle={{ pt: 0 }}
      >
        <AppScrollbar sx={{ backgroundColor: "#fff" }}>
          <InfiniteList
            root="container|viewport"
            dataLength={likesList?.total}
            hasMore={true}
            isLoading={
              modalType === "likes" ? likeNextLoading : comntNextLoading
            }
            isEndReached={
              modalType === "likes" ? !likeNextPage : !comntNextPage
            }
            // onReachThreshold={() => onLikeEndReached()}
            containerClassName="custom-container-class-name"
            sentinelClassName="custom-sentinel-class-name"
            containerTagName="div"
            sentinelTagName="div"
            threshold={0.8}
          >
            {(likesList.listsLoad && !likeNextPage) ||
            (comntList.listsLoad && !comntNextPage) ? (
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
              <>
                {modalType === "likes"
                  ? likesList?.lists?.map((item?: any) => {
                      return (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            py: 1.5,
                            justifyContent: "space-between",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{ width: 30, height: 30 }}
                              src={item?.user_image || ""}
                            />
                            <Box
                              sx={{
                                fontWeight: Fonts.MEDIUM,
                                fontSize: { lg: 10, xl: 12 },
                                ml: 2,
                              }}
                            >
                              {" "}
                              {item?.user_name || ""}
                            </Box>
                          </Box>
                          <Box sx={{ fontSize: { lg: 10, xl: 12 } }}>
                            {moment(item?.createdAt).format(
                              "ddd, DD MMM hh:mm A"
                            )}
                          </Box>
                        </Box>
                      );
                    })
                  : comntList?.lists?.map((item?: any) => {
                      return (
                        <Box sx={{ py: 1.5 }}>
                          <Box
                            sx={{ display: "flex", alignItems: "flex-start" }}
                          >
                            <Avatar
                              sx={{ width: 30, height: 30 }}
                              src={item?.user_image || ""}
                            />
                            <Box sx={{ ml: 2, width: "100%" }}>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Box
                                  sx={{
                                    width: "100%",
                                    fontWeight: Fonts.MEDIUM,
                                    fontSize: { lg: 10, xl: 12 },
                                  }}
                                >
                                  {item?.first_name || ""}{" "}
                                  {item?.last_name || ""}
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
                                  {moment(item?.created_at).format(
                                    "DD MMM hh:mm A"
                                  )}
                                </Box>
                              </Box>
                              <Box>
                                <Typography
                                  variant="subtitle1"
                                  sx={{ fontSize: 12, color: "#9b9696" }}
                                >
                                  {item?.comment || ""}
                                </Typography>
                              </Box>
                              {item?.total_reply_count > 0 ? (
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
                                      ? `---Hide replies (${item?.total_reply_count})`
                                      : `---View replies (${item?.total_reply_count})`}
                                  </Button>
                                  {viewReply && item?._id === viewReply
                                    ? item?.total_reply?.map((sItem?: any) => {
                                        return (
                                          <Box>
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                              }}
                                            >
                                              <Avatar
                                                sx={{ width: 30, height: 30 }}
                                                src={sItem?.user_image || ""}
                                              />
                                              <Box
                                                sx={{ ml: 2, width: "100%" }}
                                              >
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
                                                      fontSize: {
                                                        lg: 10,
                                                        xl: 12,
                                                      },
                                                    }}
                                                  >
                                                    {sItem?.first_name || ""}{" "}
                                                    {sItem?.last_name || ""}
                                                  </Box>
                                                  <Box
                                                    sx={{
                                                      textAlign: "end",
                                                      fontSize: {
                                                        lg: 10,
                                                        xl: 12,
                                                      },
                                                      ml: 3,
                                                      color: "#9b9696",
                                                      width: "100%",
                                                    }}
                                                  >
                                                    {moment(
                                                      sItem?.created_at
                                                    ).format("DD MMM hh:mm A")}
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
                                                    {sItem?.comment || ""}
                                                  </Typography>
                                                </Box>
                                              </Box>
                                            </Box>
                                          </Box>
                                        );
                                      })
                                    : null}
                                </>
                              ) : null}
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
              </>
            )}
            {likeNextPage || comntNextPage ? (
              <LoadingButton
                variant="outlined"
                color="secondary"
                size="small"
                fullWidth
                loading={
                  modalType === "likes" ? likeNextLoading : comntNextLoading
                }
                disabled={
                  modalType === "likes" ? likeNextLoading : comntNextLoading
                }
                loadingPosition="start"
                onClick={() =>
                  modalType === "likes"
                    ? onLikeEndReached()
                    : onCmntEndReached()
                }
              >
                Load More
              </LoadingButton>
            ) : null}
          </InfiniteList>
        </AppScrollbar>
      </AppDialog>
      <MediaViewer
        index={itemIndex}
        medias={filesData?.map((data: any) => {
          let extension = data?.split(".").pop();
          return {
            url: data,
            mime_type:
              // eslint-disable-next-line eqeqeq
              extension == "mp4"
                ? "video"
                : FileURLdata.includes(fileType)
                ? "image/*"
                : "video" || "image/*",
          };
        })}
        onClose={onClose}
      />
    </>
  );
}
