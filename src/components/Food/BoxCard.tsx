import React from "react";
import { Box, Button, Chip, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import AppTooltip from "@crema/core/AppTooltip";

const BodyStyle = styled(Box)(({ theme }) => ({
  "& .details-text-div": {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
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
  "& .cardTitle": {
    [theme.breakpoints.down("xl")]: { fontSize: "12px" },
  },
  "& .centerItem": { display: "flex", alignItems: "center" },
}));

interface BoxCardsProps {
  title?: any;
  values?: any;
  isLink?: any;
  onClick?: any;
  isChip?: any;
  style?: any;
  isStack?: any;
  renderStack?: any;
  loginType?: any;
  renderLoginType?: any;
  backgroundColor?: any;
  isAvatr?: any;
  renderAvatr?: any;
  isNumber?: any;
  isBtn?: boolean;
  onBtnClick?: any;
}

const BoxCards: React.FC<BoxCardsProps> = ({
  title,
  values,
  isLink,
  onClick,
  isChip,
  style,
  isStack,
  renderStack,
  loginType,
  renderLoginType,
  backgroundColor,
  isAvatr,
  renderAvatr,
  isNumber,
  isBtn,
  onBtnClick,
}) => {
  return (
    <BodyStyle>
      <div className="details-text-div">
        {isAvatr ? <Box>{renderAvatr()}</Box> : null}
        <Box sx={{ ml: isAvatr ? 2 : 0 }}>
          <Typography className="cardTitle">{title || "-"}</Typography>
          {isLink ? (
            <Link
              component="button"
              variant="body1"
              className="txtStyle"
              onClick={onClick}
            >
              {values || 0}
            </Link>
          ) : isBtn ? (
            <Button
              size="small"
              role="link"
              variant="text"
              className="txtStyle"
              type="button"
              onClick={onBtnClick}
            >
              {values || 0}
            </Button>
          ) : isChip ? (
            <Chip
              style={style}
              label={values}
              className="txtStyle"
              size="small"
            />
          ) : isStack ? (
            renderStack()
          ) : loginType ? (
            <div className="centerItem">
              {renderLoginType()}
              <Typography variant="subtitle1" className="txtStyle">
                {values || "-"}
              </Typography>
            </div>
          ) : isNumber ? (
            <Typography
              variant="subtitle1"
              className="txtStyle"
              style={{ backgroundColor: backgroundColor }}
            >
              {values || 0}
            </Typography>
          ) : (
            <AppTooltip
              title={values?.length >= 70 ? values : "" || ""}
              placement={"bottom"}
            >
              <Typography
                variant="subtitle1"
                className="txtStyle"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  WebkitLineClamp: 2,
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                }}
                style={{ backgroundColor: backgroundColor }}
              >
                {/* Testing purposeTesting purposeTesting purposeTesting
                purposeTesting purpose */}
                {values || "-"}
              </Typography>
            </AppTooltip>
          )}
        </Box>
      </div>
    </BodyStyle>
  );
};

export default BoxCards;
