import React, { useState } from "react";
import { Grid } from "@mui/material";
import MediaViewer from "@crema/core/AppMedialViewer";
import NGOSliderWrap from "./NGOSliderWrap";
import SliderImageComponent from "./SliderImageComponent";

interface NGOImageSliderProps {
  ngoDetail: any;
}

const NGOImageSlider: React.FC<NGOImageSliderProps> = ({ ngoDetail }) => {
  const [filesData, setFilesData] = useState<any>([]);
  const [itemIndex, setIndex] = useState<any>(-1);

  const onClose = () => {
    setFilesData([]);
    setIndex(-1);
  };
  let coverExt = ngoDetail?.ngo_cover_image?.split(".").pop() || "";
  let certiExt = ngoDetail?.ngo_certificate?.split(".").pop() || "";
  let deedExt = ngoDetail?.ngo_deed?.split(".").pop() || "";

  return (
    <NGOSliderWrap>
      <Grid container spacing={4} xs={12} style={{ margin: 0 }}>
        {/* ngo_cover_image Image Slider */}
        <Grid
          item
          xs={12}
          md={ngoDetail?.updated_data ? 6 : 4}
          lg={ngoDetail?.updated_data ? 6 : 4}
          xl={ngoDetail?.updated_data ? 6 : 3}
        >
          <SliderImageComponent
            file={ngoDetail?.ngo_cover_image}
            ext={coverExt}
            title="NGO Logo"
            setFilesData={setFilesData}
            setIndex={setIndex}
          />
        </Grid>

        {/* ngo_certificate Image Slider */}
        <Grid
          item
          xs={12}
          md={ngoDetail?.updated_data ? 6 : 4}
          lg={ngoDetail?.updated_data ? 6 : 4}
          xl={ngoDetail?.updated_data ? 6 : 3}
        >
          <SliderImageComponent
            file={ngoDetail?.ngo_certificate}
            ext={certiExt}
            title="NGO Certificate"
            setFilesData={setFilesData}
            setIndex={setIndex}
          />
        </Grid>

        {/* ngo_deed Image Slider */}
        <Grid
          item
          xs={12}
          md={ngoDetail?.updated_data ? 6 : 4}
          lg={ngoDetail?.updated_data ? 6 : 4}
          xl={ngoDetail?.updated_data ? 6 : 3}
        >
          <SliderImageComponent
            file={ngoDetail?.ngo_deed}
            ext={deedExt}
            title="NGO Deed Image"
            setFilesData={setFilesData}
            setIndex={setIndex}
          />
        </Grid>
      </Grid>

      <MediaViewer
        index={itemIndex}
        medias={[filesData]?.map((data: any) => {
          return {
            url: data,
            mime_type: "image/*",
          };
        })}
        onClose={onClose}
      />
    </NGOSliderWrap>
  );
};

export default NGOImageSlider;
