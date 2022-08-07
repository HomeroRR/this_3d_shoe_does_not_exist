import { Box, Typography } from "@mui/material";

function MainBanner(): JSX.Element {
  return (
    <Box my={5}>
      <Typography variant="h4" component="h1" style={{ textAlign: "center" }}>
        GAN-generated 3D shoes
      </Typography>
    </Box>
  );
}

export default MainBanner;
