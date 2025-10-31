import {
  defaultSketch,
  type Setup,
  type Draw,
} from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";

const setup: Setup = () => {};

const draw: Draw = () => {};

const sketch = defaultSketch({ setup, draw });

export function ElectricalPotential() {
  return (
    <div>
      <StyledP5Container sketch={sketch} />
    </div>
  );
}
