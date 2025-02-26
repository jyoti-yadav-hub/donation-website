import React, { useState } from "react";
import { Grid } from "@mui/material";
import MediaViewer from "@crema/core/AppMedialViewer";
import NGOSliderWrap from "./NGOSliderWrap";
import SliderImageComponent from "./SliderImageComponent";
interface UpdateNGOImageSliderProps {
  ngoDetail: any;
}

const UpdateNGOImageSlider: React.FC<UpdateNGOImageSliderProps> = ({
  ngoDetail,
}) => {
  const [filesData, setFilesData] = useState<any>([]);
  const [itemIndex, setIndex] = useState<any>(-1);

  const onClose = () => {
    setFilesData([]);
    setIndex(-1);
  };

  let coverExt =
    ngoDetail?.updated_data?.ngo_cover_image?.split(".").pop() || "";
  let certiExt =
    ngoDetail?.updated_data?.ngo_certificate?.split(".").pop() || "";
  let deedExt = ngoDetail?.updated_data?.ngo_deed?.split(".").pop() || "";

  return (
    <NGOSliderWrap>
      <Grid container spacing={4} xs={12} sx={{ m: 0, width: "100%" }}>
        {/* ngo_cover_image Image Slider */}
        <Grid item xs={6} md={6} lg={6} xl={6}>
          <SliderImageComponent
            file={ngoDetail?.updated_data?.ngo_cover_image}
            ext={coverExt}
            title="NGO Logo"
            setFilesData={setFilesData}
            setIndex={setIndex}
          />
        </Grid>

        {/* ngo_certificate Image Slider */}
        <Grid item xs={6} md={6} lg={6} xl={6}>
          <SliderImageComponent
            file={ngoDetail?.updated_data?.ngo_certificate}
            ext={certiExt}
            title="NGO Certificate"
            setFilesData={setFilesData}
            setIndex={setIndex}
          />
        </Grid>

        {/* ngo_deed Image Slider */}
        <Grid item xs={6} md={6} lg={6} xl={6}>
          <SliderImageComponent
            file={ngoDetail?.updated_data?.ngo_deed}
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

export default UpdateNGOImageSlider;
