/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Slider from "react-slick";
import "react-image-lightbox/style.css";
import { AppCard } from "@crema";
import MediaViewer from "@crema/core/AppMedialViewer";
import { isEmpty } from "@firebase/util";
import ImageCardSlideWrapper from "pages/dashboards/Widgets/CityInfo/ImageCardSlideWrapper";
import SlideContentWrapper from "pages/dashboards/Widgets/CityInfo/SlideContentWrapper";
import { Fonts } from "shared/constants/AppEnums";

const BodyStyle = styled(Box)(({ theme }) => ({
  width: "100%",
  "& .noData": {
    boxShadow: "rgba(0, 0, 0, 0.04) 0px 10px 10px 4px",
    backgroundColor: "rgb(255, 255, 255)",
    padding: 15,
    borderRadius: "10px !important",
  },
  "& .textCenter": {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  "& .slick-slider": {
    display: "grid",
    width: "100%",
    alignItems: "center",
    borderRadius: "10px",
  },
  "& .slideImage": {
    width: "100% !important",
    objectFit: "contain",
  },
  "& .extImage": {
    width: "100% !important",
    objectFit: "contain",
    maxHeight: "calc(20vh) !important",
  },
  "& .imgBox": {
    width: "auto",
    display: "flex !important",
    overflow: "hidden",
    alignItems: "center !important",
    justifyContent: "center !important",
  },
  "& .extTextStyle": {
    fontSize: 20,
    [theme.breakpoints.down("xl")]: { fontSize: 20 },
    textAlign: "center",
    color: "rgb(107, 114, 128)",
  },
}));

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

interface ImageSliderProps {
  foodDetails: any;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ foodDetails }) => {
  const [fileType, setFileType] = useState<any>("");
  const [filesData, setFilesData] = useState<any>([]);
  const [itemIndex, setIndex] = useState<any>(-1);
  let fileData = (foodDetails && foodDetails?.form_data?.files) || [];
  let FileURLdata = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG", "svg", "SVG"];

  const onClose = () => {
    setFilesData([]);
    setIndex(-1);
  };

  const sliderComponent = (title?: any, filesArr?: any) => {
    return filesArr && !isEmpty(filesArr) ? (
      <AppCard
        sxStyle={{ height: 1 }}
        contentStyle={{ p: 0, pb: "0px !important" }}
      >
        <ImageCardSlideWrapper>
          <Slider className="imageCardSlide" {...settings}>
            {filesArr?.map((slide: any, index: number) => {
              let extension = slide.split(".").pop();
              let fullUrl = foodDetails.image_url + slide;
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
                    if (title === "Video") {
                      return;
                    } else {
                      setFilesData(filesArr);
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
                        zIndex: title === "Video" ? 10 : -1,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      },
                    }}
                  >
                    {title === "Video" ? (
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
                    title === "Video" ? null : (
                      <Typography variant="body2" className="extTextStyle">
                        {extension.toUpperCase() || ""}
                      </Typography>
                    )}
                  </Box>
                  <SlideContentWrapper>
                    <Box
                      component="h3"
                      sx={{
                        mb: 4,
                        fontWeight: Fonts.BOLD,
                        fontSize: 16,
                        zIndex: 10,
                      }}
                    >
                      {title}
                    </Box>
                  </SlideContentWrapper>
                </Box>
              );
            })}
          </Slider>
        </ImageCardSlideWrapper>
      </AppCard>
    ) : null;
  };

  return (
    <BodyStyle>
      {fileData ? (
        <Grid container spacing={3} sx={{ margin: 0, width: "100%" }}>
          {/* Documents For Fundraiser */}
          {fileData?.common_documents ? (
            foodDetails?.category_slug === "health" ? (
              <Grid item xs={12} md={4} lg={4} xl={3}>
                {sliderComponent(
                  "Medical Estimate",
                  fileData?.common_documents
                )}
              </Grid>
            ) : (
              <Grid item xs={12} md={4} lg={4} xl={3}>
                {sliderComponent(
                  "Documents For Fundraiser",
                  fileData?.common_documents
                )}
              </Grid>
            )
          ) : null}

          {/* college_school_course_quotation */}
          {foodDetails && fileData?.college_school_course_quotation ? (
            <Grid item xs={12} md={4} lg={4} xl={3}>
              {" "}
              {sliderComponent(
                "Course Quotation",
                fileData?.college_school_course_quotation
              )}
            </Grid>
          ) : null}

          {/* upload_your_qualification_result */}
          {foodDetails && fileData?.upload_your_qualification_result ? (
            <Grid item xs={12} md={4} lg={4} xl={3}>
              {sliderComponent(
                "Qualification Result",
                fileData?.upload_your_qualification_result
              )}
            </Grid>
          ) : null}

          {/* add_government_id__front_and_back_ */}
          {foodDetails && fileData?.add_government_id__front_and_back_ ? (
            <Grid item xs={12} md={4} lg={4} xl={3}>
              {sliderComponent(
                "Government Id",
                fileData?.add_government_id__front_and_back_
              )}
            </Grid>
          ) : null}

          {/* consent_letter_from_patient */}
          {foodDetails && fileData?.consent_letter_from_patient ? (
            <Grid item xs={12} md={4} lg={4} xl={3}>
              {sliderComponent(
                "Consent Letter",
                fileData?.consent_letter_from_patient
              )}
            </Grid>
          ) : null}

          {/* medical_reports */}
          {foodDetails && fileData?.medical_reports ? (
            <Grid item xs={12} md={4} lg={4} xl={3}>
              {sliderComponent("Medical Reports", fileData?.medical_reports)}
            </Grid>
          ) : null}

          {/* Photos */}
          {foodDetails && fileData?.photos ? (
            <Grid item xs={12} md={4} lg={4} xl={3}>
              {sliderComponent("Photos", fileData?.photos)}
            </Grid>
          ) : null}

          {/* Proof Of Income */}
          {foodDetails && fileData?.proof_of_income ? (
            <Grid item xs={12} md={4} lg={4} xl={3}>
              {sliderComponent("Proof Of Income", fileData?.proof_of_income)}
            </Grid>
          ) : null}

          {/* Cover Photo */}
          {foodDetails &&
          foodDetails?.category_slug !== "hunger" &&
          fileData?.upload_cover_photo ? (
            <Grid item xs={12} md={4} lg={4} xl={3}>
              {sliderComponent("Cover Photo", fileData?.upload_cover_photo)}
            </Grid>
          ) : null}

          {/* admission_and_fee */}
          {foodDetails && fileData?.admission_and_fee ? (
            <Grid item xs={12} md={4} lg={4} xl={3}>
              {sliderComponent(
                "Admission and Fees",
                fileData?.admission_and_fee
              )}
            </Grid>
          ) : null}

          {/* Governtment Documents */}
          {foodDetails && fileData?.upload_govt_documents ? (
            <Grid item xs={12} md={4} lg={4} xl={3}>
              {sliderComponent(
                "Governtment Documents",
                fileData?.upload_govt_documents
              )}
            </Grid>
          ) : null}

          {/* Other documanets */}
          {fileData?.other_document ? (
            <Grid item xs={12} md={4} lg={4} xl={3}>
              {sliderComponent("Other Documents", fileData?.other_document)}
            </Grid>
          ) : null}

          {/* Video */}
          {fileData?.video ? (
            <Grid item xs={12} md={4} lg={4} xl={3}>
              {sliderComponent("Video", fileData?.video)}
            </Grid>
          ) : null}
        </Grid>
      ) : (
        <Grid container spacing={2} sx={{ margin: 0 }}>
          <Grid item xs={12}>
            <Box className="noData">
              <div className="textCenter">
                <Typography
                  variant="subtitle1"
                  sx={{ fontSize: "18px", fontWeight: "500" }}
                >
                  No Data
                </Typography>
              </div>
            </Box>
          </Grid>
        </Grid>
      )}

      <MediaViewer
        index={itemIndex}
        medias={filesData?.map((data: any) => {
          return {
            url: foodDetails?.image_url + data,
            mime_type: FileURLdata.includes(fileType)
              ? "image/*"
              : "docs" || "image/*",
          };
        })}
        onClose={onClose}
      />
    </BodyStyle>
  );
};

export default ImageSlider;
