import { ColorInput } from "@mantine/core";

interface ColorEditorProps {
  rgba: [number, number, number, number] | [number, number, number];

  setColor: (rgba: [number, number, number, number]) => void;
}

export const ColorEditor = ({ setColor, rgba }: ColorEditorProps) => {
  const [r, g, b, a = 1] = rgba;

  return (
    <ColorInput
      variant="unstyled"
      format="rgba"
      value={`rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(
        b * 255
      )},${a})`}
      onChange={(color) => {
        const [r, g, b, a] = color
          .replace("rgba(", "")
          .replace(")", "")
          .split(",");

        setColor([
          Number(r) / 255,
          Number(g) / 255,
          Number(b) / 255,
          Number(a),
        ]);
      }}
    />
  );
};
