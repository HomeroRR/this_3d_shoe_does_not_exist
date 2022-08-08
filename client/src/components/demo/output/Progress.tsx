import { Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  value: number;
}

function Progress(props: Props): JSX.Element {
  const { value } = props;
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        size={100}
        thickness={8}
        value={value}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
          style={{fontSize: "1.5em"}}
        >{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default Progress;
