import { AppBar, Grid, Link, Toolbar, Typography } from "@mui/material";

function CopyrightArea(): JSX.Element {
  const currentYear: number = new Date().getFullYear();
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item>
        <Link
          color="inherit"
          underline="hover"
          href="https://www.frederickroman.com/"
        >
          <Typography variant="body1" color="white" sx={{ mx: 1 }}>
            &copy; Frederick Roman {currentYear}
          </Typography>
        </Link>
      </Grid>
      <Grid item>
        <Link color="inherit" underline="hover" href="https://homeroroman.com/">
          <Typography variant="body1" color="white" sx={{ mx: 1 }}>
            &copy; Homero Roman {currentYear}
          </Typography>
        </Link>
      </Grid>
    </Grid>
  );
}

function MainFooter(): JSX.Element {
  return (
    <AppBar position="static" sx={{ py: 2 }}>
      <Toolbar>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item>
            <CopyrightArea />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default MainFooter;
