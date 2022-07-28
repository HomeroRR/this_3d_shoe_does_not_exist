import { useState } from "react";
import {
  Box,
  Typography,
  Slider,
  Input,
  Container,
  Stack,
} from "@mui/material";
import type { ChangeEvent } from "react";
import { minWidth } from "@mui/system";

type GanGenVal = number | string | Array<number | string>;

const DEFAULT_LABEL = "Property";
const DEFAULT_VALUE = 0;
const DEFAULT_STEP = 1;
const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;

const clamp = (val: number, min: number, max: number): number =>
  val < min ? min : val > max ? max : val;

function GanGenSlider(): JSX.Element {
  const sliderId = `${DEFAULT_LABEL}_input-slider`;
  const [value, setValue] = useState<GanGenVal>(DEFAULT_VALUE);

  const handleSliderChange = (_: Event, newValue: GanGenVal): void =>
    setValue(newValue);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void =>
    setValue(event.target.value === "" ? "" : Number(event.target.value));

  const handleBlur = (): void =>
    setValue(clamp(Number(value), DEFAULT_MIN, DEFAULT_MAX));

  return (
    <Container maxWidth="sm">
      <Box sx={{ width: "90%" }}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Box mx={1}>
            <Typography id={sliderId}>{DEFAULT_LABEL}</Typography>
          </Box>
          <Slider
            value={typeof value === "number" ? value : DEFAULT_MIN}
            onChange={handleSliderChange}
            aria-labelledby={sliderId}
          />
          <Box mx={1}>
            <Input
              value={value}
              size="small"
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step: DEFAULT_STEP,
                min: DEFAULT_MIN,
                max: DEFAULT_MAX,
                type: "number",
                "aria-labelledby": sliderId,
              }}
              sx={{ minWidth: 30 }}
            />
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}

export default GanGenSlider;
