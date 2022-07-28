import GanGenSlider from "./input/GanGenSlider";

function MainDemo(): JSX.Element {
  return (
    <div>
      <GanGenSlider attr="Resolution" step={2} min={4} max={128} />
    </div>
  );
}

export default MainDemo;
