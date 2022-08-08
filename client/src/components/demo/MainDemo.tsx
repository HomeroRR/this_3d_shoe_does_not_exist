import { Box, Button, Grid, Stack } from "@mui/material";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import Progress from "./output/Progress";
import { useState, useEffect, useRef } from "react";
import Display from "../../services/shapeGeneration/Display";
import GanGenSlider from "./input/GanGenSlider";

type GanGenVal = number | string | Array<number | string>;

const DEFAULT_LEVEL = 0.008;
const DEFAULT_WEIRDNESS = 1.9;
const DEFAULT_RESOLUTION = 24;
const DEFAULT_PROGRESS = 0;

const shapeGenDisplay = new Display();

function MainDemo(): JSX.Element {
  const [level, setLevel] = useState<GanGenVal>(DEFAULT_LEVEL);
  const [weirdness, setWeirdness] = useState<GanGenVal>(DEFAULT_WEIRDNESS);
  const [resolution, setResolution] = useState<GanGenVal>(DEFAULT_RESOLUTION);
  const [progress, setProgress] = useState<number>(DEFAULT_PROGRESS);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    function keepProgress(event: Event): void {
      const progress: number = (event as CustomEvent).detail.progress;
      setProgress(progress);
    }
    Display.eventBus.on("progress", keepProgress);
    return () => Display.eventBus.off("progress", keepProgress);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      shapeGenDisplay.canvas = canvas;
    }
  }, []);

  useEffect(() => {
    shapeGenDisplay.parameters.level = Number(level);
    shapeGenDisplay.currentShape?.updateSurfaceLevel(Number(level));
  }, [level]);

  useEffect(() => {
    shapeGenDisplay.parameters.latentCodeScalingFactor = Number(weirdness);
    if (shapeGenDisplay.parameters.seed) shapeGenDisplay.updateShape();
  }, [weirdness]);

  useEffect(() => {
    shapeGenDisplay.parameters.resolution = Number(resolution);
    if (shapeGenDisplay.parameters.seed) shapeGenDisplay.updateShape();
  }, [resolution]);

  return (
    <>
      <Box component="section" position="relative">
        <Grid container justifyContent="center" alignItems="center">
          <Grid item>
            <Box my={5}>
              <canvas
                ref={canvasRef}
                style={{
                  width: "90vw",
                  height: "90vh",
                  border: "1px solid black",
                }}
                id="container"
              />
            </Box>
          </Grid>
        </Grid>
        {progress < 100 && (
          <Box position="absolute" top="50%" left="50%">
            <Progress value={progress} />
          </Box>
        )}
      </Box>
      <Stack
        justifyContent="space-evenly"
        alignItems="space-evenly"
        spacing={4}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Button
            variant="contained"
            startIcon={<ViewInArIcon />}
            onClick={() => shapeGenDisplay.generateShape()}
          >
            Generate
          </Button>
          <Button
            variant="outlined"
            endIcon={<SaveAltIcon />}
            onClick={() => shapeGenDisplay.currentShape?.saveSTLFile()}
          >
            Save
          </Button>
        </Stack>
        <Stack justifyContent="center" alignItems="center" spacing={1}>
          <GanGenSlider
            attr="level"
            step={0.002}
            min={0}
            max={0.1}
            value={level}
            setValue={setLevel}
          />
          <GanGenSlider
            attr="weirdness"
            step={0.02}
            min={0}
            max={2.5}
            value={weirdness}
            setValue={setWeirdness}
          />
          <GanGenSlider
            attr="resolution"
            step={2}
            min={4}
            max={128}
            value={resolution}
            setValue={setResolution}
          />
        </Stack>
      </Stack>
    </>
  );
}

export default MainDemo;
