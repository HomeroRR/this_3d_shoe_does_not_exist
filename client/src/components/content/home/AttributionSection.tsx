import { Box, Grid, Link, Typography } from "@mui/material";

function AttributionSection(): JSX.Element {
  return (
    <Box component="section" my={5} p={5}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <Typography>
            This project was inspired on the work of &nbsp;
            <Link color="inherit"  href="https://marian42.de/">
              Marian Kleineberg
            </Link>
            &nbsp;
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AttributionSection;
