import React from "react";
import { Box } from "@mui/material";
import { AppCard } from "@crema";
import { isEmpty } from "lodash";
import NGOSliderWrap from "./NGOSliderWrap";
import Slider from "react-slick";
import "react-image-lightbox/style.css";
import ImageCardSlideWrapper from "pages/dashboards/Widgets/CityInfo/ImageCardSlideWrapper";
import SlideContentWrapper from "pages/dashboards/Widgets/CityInfo/SlideContentWrapper";
import { Fonts } from "shared/constants/AppEnums";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

interface SliderImageProps {
  file?: any;
  ext?: any;
  title?: any;
  setFilesData?: any;
  setIndex?: any;
}

const SliderImageComponent: React.FC<SliderImageProps> = ({
  file,
  ext,
  title,
  setFilesData,
  setIndex,
}) => {
  let FileURLdata = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG", "svg", "SVG"];

  return (
    <NGOSliderWrap>
      <AppCard
        sxStyle={{ height: 1 }}
        contentStyle={{ p: 0, pb: "0px !important" }}
      >
        <ImageCardSlideWrapper>
          <Slider className="imageCardSlide" {...settings}>
            <Box
              key={"index"}
              sx={{
                position: "relative",
                textAlign: "center",
                fontSize: { xs: 20, xl: 24 },
                height: { lg: "calc(40vh)", xl: "calc(30vh)" },
              }}
              onClick={() => {
                if (!isEmpty(file)) {
                  setFilesData(file);
                  setIndex(0);
                }
              }}
            >
              <Box
                sx={{
                  "& .imageSlideFull": {
                    position: "absolute",
                    left: 0,
                    top: 0,
                    zIndex: -1,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  },
                }}
              >
                <img
                  src={
                    isEmpty(file)
                      ? "/assets/images/defaultimage.png"
                      : FileURLdata.includes(ext)
                      ? file
                      : "/assets/images/doc_icon.png"
                  }
                  alt={"title"}
                  className="imageSlideFull"
                />
              </Box>
              <SlideContentWrapper>
                <Box
                  component="h3"
                  sx={{ mb: 4, fontWeight: Fonts.BOLD, fontSize: 16 }}
                >
                  {title}
                </Box>
              </SlideContentWrapper>
            </Box>
          </Slider>
        </ImageCardSlideWrapper>
      </AppCard>
    </NGOSliderWrap>
  );
};

export default SliderImageComponent;
