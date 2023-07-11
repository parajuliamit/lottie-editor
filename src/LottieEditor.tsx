import { Accordion, Grid, Text } from "@mantine/core";
import { ColorEditor } from "./ColorEditor";
import { LottieJson } from "./lottie/lottie";
import { useEffect, useState } from "react";

type LottieColor = [number, number, number, number] | [number, number, number];

interface LottieEditorProps {
  setJson: (val: LottieJson) => void;
  value: LottieJson;
  setSelectedjson: (val: LottieJson | null) => void;
}

type ColorDetails = {
  assetLayerIndex?: number;
  assetIndex?: number;
  layerIndex: number;
  shapeIndex: number;
  itemIndex: number;
  rgba: LottieColor;
};

function getLayerColors(
  layer: LottieJson["layers"][0] | LottieJson["assets"][0]["layers"][0],
  layerIndex: number,
  assetIndex?: number,
  assetLayerIndex?: number
) {
  const shapes = layer.shapes;
  if (shapes) {
    return shapes
      .flatMap((shape, shapeIndex) => {
        return shape.it.map((item, itemIndex) => {
          if (item.c) {
            return {
              assetLayerIndex,
              assetIndex,
              layerIndex,
              shapeIndex,
              itemIndex,
              rgba: item.c.k as LottieColor,
            };
          }
        });
      })
      .filter(Boolean) as ColorDetails[];
  }
  return [];
}

const getColorDetailsFromLottie = (lottie: LottieJson): ColorDetails[] => {
  const colorDetails: ColorDetails[] = [];

  lottie.layers.forEach((layer, layerIndex) => {
    const assetRef = layer.refId;
    const assetIndex = lottie.assets.findIndex(
      (asset) => asset.id === assetRef
    );
    if (assetIndex !== -1) {
      const asset = lottie.assets[assetIndex];
      asset.layers.forEach((assetLayer, assetLayerIndex) => {
        colorDetails.push(
          ...getLayerColors(assetLayer, layerIndex, assetIndex, assetLayerIndex)
        );
      });
    }
    colorDetails.push(...getLayerColors(layer, layerIndex));
  });

  return colorDetails;
};

export const LottieEditor = ({
  setJson,
  value,
  setSelectedjson,
}: LottieEditorProps) => {
  const [accordianValue, setAccordianValue] = useState<string | null>(null);

  const layers = value.layers;
  const colorDetails = getColorDetailsFromLottie(value);

  function updateSelectedObject() {
    if (!accordianValue) {
      setSelectedjson(null);
    } else {
      const newJson = Object.assign({}, value);
      const newLayers: LottieJson["layers"] = [];
      const index = parseInt(accordianValue);
      newLayers.push(newJson.layers[index]);
      const parent = newJson.layers.find(
        (v) => v.ind === newJson.layers[index].parent
      );
      if (parent) newLayers.push(parent);
      newJson.layers = newLayers;
      setSelectedjson(newJson);
    }
  }

  useEffect(() => {
    updateSelectedObject();
  }, [accordianValue]);

  function updateColor(colorDetails: ColorDetails, rgba: LottieColor) {
    const { layerIndex, shapeIndex, itemIndex } = colorDetails;
    const newJson = { ...value };

    if (colorDetails.assetIndex !== undefined) {
      const assetIndex = colorDetails.assetIndex;
      const assetLayerIndex = colorDetails.assetLayerIndex!;
      const asset = newJson.assets[assetIndex];
      const assetLayer = asset.layers[assetLayerIndex];
      const assetShape = assetLayer.shapes[shapeIndex];
      const assetItem = assetShape.it[itemIndex];
      assetItem.c!.k = rgba;
    } else {
      const layer = newJson.layers[layerIndex];
      const shape = layer.shapes![shapeIndex];
      const item = shape.it[itemIndex];
      item.c!.k = rgba;
    }
    setJson(newJson);
    updateSelectedObject();
  }

  const objects = layers
    .map((layer, layerIndex) => {
      const shapes = colorDetails.filter((colorDetail) => {
        if (colorDetail.assetLayerIndex == undefined) {
          if (colorDetail.layerIndex === layerIndex) {
            return true;
          }
        }
        return false;
      });
      const assets = colorDetails.filter((colorDetail) => {
        if (colorDetail.assetLayerIndex !== undefined) {
          if (colorDetail.layerIndex === layerIndex) {
            return true;
          }
        }
      });

      if (!shapes.length && !assets.length) {
        return null;
      }
      return {
        layer,
        shapes,
        assets,
      };
    })
    .map((layer, index) => {
      if (!layer) {
        return null;
      }

      const layerAssets =
        layer.assets.length > 0
          ? layer.assets.reduce((acc, curr) => {
              const assetIndex = curr.assetIndex!;
              const assetName = value.assets[assetIndex].nm;

              if (!acc[assetName]) acc[assetName] = [curr];
              else acc[assetName].push(curr);
              return acc;
            }, {} as Record<string, ColorDetails[]>)
          : null;
      return (
        <Accordion.Item value={index.toString()} key={layer.layer.ind}>
          <Accordion.Control>{layer.layer.nm}</Accordion.Control>
          <Accordion.Panel>
            {layer.shapes && (
              <>
                {layer.shapes.map((shape, index) => {
                  return (
                    <ColorEditor
                      rgba={shape.rgba}
                      setColor={(val) => {
                        updateColor(shape, val);
                      }}
                      key={index}
                    />
                  );
                })}
              </>
            )}
            {layerAssets && (
              <>
                {Object.entries(layerAssets).map(
                  ([assetName, assetColors], j) => {
                    return (
                      <Accordion key={"asset" + j.toString()}>
                        <Accordion.Item value={j.toString()}>
                          <Accordion.Control>{assetName}</Accordion.Control>
                          <Accordion.Panel>
                            {assetColors.map((color, k) => {
                              return (
                                <ColorEditor
                                  rgba={color.rgba}
                                  setColor={(val) => {
                                    updateColor(color, val);
                                  }}
                                  key={
                                    "asset" +
                                    j.toString() +
                                    "color" +
                                    k.toString()
                                  }
                                />
                              );
                            })}
                          </Accordion.Panel>
                        </Accordion.Item>
                      </Accordion>
                    );
                  }
                )}
              </>
            )}
          </Accordion.Panel>
        </Accordion.Item>
      );
    });

  const commonColors = colorDetails.reduce((acc, curr) => {
    const rgba = curr.rgba.join(",");
    if (!acc[rgba]) acc[rgba] = [curr];
    else acc[rgba].push(curr);
    return acc;
  }, {} as Record<string, ColorDetails[]>);

  const commonColorItems = Object.entries(commonColors).map(
    ([_, colors], index) => {
      return (
        <ColorEditor
          rgba={colors[0].rgba}
          setColor={(val) => {
            colors.forEach((color) => {
              updateColor(color, val);
            });
          }}
          key={"common" + index.toString()}
        />
      );
    }
  );

  return (
    <>
      <Grid.Col
        md={4}
        xs={10}
        mx={{ md: "0", base: "auto" }}
        span={12}
        sx={(theme) => ({
          [theme.fn.largerThan("md")]: { borderRight: "1px solid #E5E5E5" },
          [theme.fn.smallerThan("md")]: { border: "none" },
        })}
        orderMd={1}
        order={2}
      >
        <Accordion
          variant="contained"
          chevronPosition="left"
          value={accordianValue}
          onChange={setAccordianValue}
        >
          {objects}
        </Accordion>
      </Grid.Col>
      <Grid.Col
        md={4}
        xs={10}
        mx={{ md: "0", base: "auto" }}
        span={12}
        sx={(theme) => ({
          [theme.fn.largerThan("md")]: { borderRight: "1px solid #E5E5E5" },
          [theme.fn.smallerThan("md")]: { border: "none" },
        })}
        orderMd={2}
        order={3}
      >
        <Text mb={"sm"} weight={"bold"} size={"lg"}>
          All Colors
        </Text>
        {commonColorItems}
      </Grid.Col>
    </>
  );
};
