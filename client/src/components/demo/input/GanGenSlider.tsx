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

type GanGenVal = number | string | Array<number | string>;

interface Props {
  attr: string;
  step: number;
  min: number;
  max: number;
  value: GanGenVal;
  setValue: React.Dispatch<React.SetStateAction<GanGenVal>>;
}

const clamp = (val: number, min: number, max: number): number =>
  val < min ? min : val > max ? max : val;

function GanGenSlider(props: Props): JSX.Element {
  const { attr, step, min, max, value, setValue } = props;
  const sliderId = `${attr}_input-slider`;
  const marks = Object.seal([
    { value: min, label: `${min}` },
    { value: max, label: `${max}` },
  ]);

  const handleSliderChange = (_: Event, newValue: GanGenVal): void =>
    setValue(newValue);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void =>
    setValue(event.target.value === "" ? "" : Number(event.target.value));

  const handleBlur = (): void => setValue(clamp(Number(value), min, max));

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
            <Typography id={sliderId} sx={{ width: 100 }}>
              {attr}
            </Typography>
          </Box>
          <Slider
            step={step}
            min={min}
            max={max}
            marks={marks}
            value={typeof value === "number" ? value : min}
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
                step,
                min,
                max,
                type: "number",
                "aria-labelledby": sliderId,
                width: 50,
              }}
              sx={{ width: 60 }}
            />
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}

export default GanGenSlider;
