import { useState, useEffect, useRef } from "react";
import Display from "./Display";
import GanGenSlider from "./input/GanGenSlider";

type GanGenVal = number | string | Array<number | string>;

const DEFAULT_LEVEL = 0.04;
const DEFAULT_WEIRDNESS = 1;
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
      <button onClick={() => shapeGenDisplay.generateShape()}>Generate Shape</button>
      <button onClick={() => shapeGenDisplay.currentShape?.saveSTLFile()}>
        Generate Shape
      </button>
      <div>{progress}</div>
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
      <canvas
        ref={canvasRef}
        style={{ width: "100vw", height: "calc(100vh - 200px)" }}
        id="container"
      />
    </>
  );
}

export default MainDemo;
