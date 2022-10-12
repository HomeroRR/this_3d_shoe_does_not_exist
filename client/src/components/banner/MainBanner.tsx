import Image from "next/image";
import { Box, Grid, Stack, Typography } from "@mui/material";
import logoImg from "../../../public/img/logo.svg";

function MainBanner(): JSX.Element {
  return (
    <Box py={5} sx={{ bgcolor: "primary.dark" }}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <Image
            src={logoImg}
            width={100}
            height={100}
            alt="This 3d shoe doesn't exist logo: Calligraphy S in the form of a shoe."
          />
        </Grid>
        <Grid item>
          <Stack>
            <Typography
              variant="h4"
              component="h1"
              style={{ textAlign: "center", color: "white" }}
            >
              This 3D shoe doesn&apos;t exist
            </Typography>
            <Typography
              variant="h5"
              component="h1"
              style={{ textAlign: "center", color: "white" }}
            >
              GAN-generated 3D shoes
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MainBanner;
