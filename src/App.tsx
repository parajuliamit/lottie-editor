import {
  MantineProvider,
  JsonInput,
  Box,
  ColorInput,
  Accordion,
  Grid,
  Text,
} from "@mantine/core";
import { useState } from "react";
import LottiePlayer from "./Lottie";
import { LottieJson } from "./lottie/lottie";

export default function App() {
  const [value, setValue] = useState("");
  function isValidJson() {
    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return false;
    }
  }

  function getColors() {
    if (!isValidJson()) {
      return [];
    }
    const json = JSON.parse(value) as LottieJson;
    const colors = new Array<number[]>();
    json.layers.forEach((layer) => {
      layer?.shapes?.forEach((shape) => {
        shape?.it?.forEach((item) => {
          if (item.c) {
            let already = false;
            colors.map((v) => {
              if (JSON.stringify(v) == JSON.stringify(item.c.k)) {
                already = true;
                return;
              }
            });
            if (!already) {
              colors.push(item.c.k);
            }
          }
        });
      });
    });
    json.assets.forEach((asset) => {
      asset?.layers?.forEach((layer) => {
        layer?.shapes?.forEach((shape) => {
          shape?.it?.forEach((item) => {
            if (item.c) {
              let already = false;
              colors.map((v) => {
                if (JSON.stringify(v) == JSON.stringify(item.c.k)) {
                  already = true;
                  return;
                }
              });
              if (!already) {
                colors.push(item.c.k);
              }
            }
          });
        });
      });
    });
    return Array.from(colors);
  }

  function changeColor(oldColor: number[], newColor: number[]) {
    if (!isValidJson()) {
      return;
    }
    const json = JSON.parse(value) as LottieJson;
    json.layers.forEach((layer, layerIndex) => {
      layer?.shapes?.forEach((shape, shapeIndex) => {
        shape.it.forEach((item, itemIndex) => {
          if (JSON.stringify(item?.c?.k) == JSON.stringify(oldColor)) {
            json.layers[layerIndex].shapes[shapeIndex].it[itemIndex].c!.k =
              newColor.map((v) => v / 255);
          }
        });
      });
    });
    json.assets.forEach((asset, assetIndex) => {
      asset?.layers?.forEach((layer, layerIndex) => {
        layer?.shapes?.forEach((shape, shapeIndex) => {
          shape?.it?.forEach((item, itemIndex) => {
            if (JSON.stringify(item?.c?.k) == JSON.stringify(oldColor)) {
              json.assets[assetIndex].layers[layerIndex].shapes[shapeIndex].it[
                itemIndex
              ].c!.k = newColor.map((v) => v / 255);
            }
          });
        });
      });
    });
    setValue(JSON.stringify(json, null, 2));
  }

  function getAssetId(id: string | undefined) {
    if (!isValidJson()) {
      return;
    }
    const json = JSON.parse(value) as LottieJson;
    for (let i = 0; i < json.assets.length; i++) {
      if (json.assets[i].id == id) {
        return i;
      }
    }
    return;
  }

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Box m={"xl"}>
        <JsonInput
          label="Enter your Lottie JSON here"
          placeholder="Enter your Lottie JSON here"
          validationError="Invalid JSON"
          minRows={4}
          value={value}
          onChange={setValue}
          mb={"lg"}
          p={"lg"}
        />
        <Grid w={"100%"}>
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
            order={1}
          >
            <Accordion
              variant="contained"
              chevronPosition="left"
              defaultValue="customization"
            >
              {isValidJson() &&
                (JSON.parse(value) as LottieJson).layers.map(
                  (layer, layerIndex) => {
                    return (
                      <Accordion.Item value={layerIndex.toString()}>
                        <Accordion.Control>{layer.nm}</Accordion.Control>
                        <Accordion.Panel>
                          <Accordion
                            variant="contained"
                            chevronPosition="left"
                            defaultValue="customization"
                          >
                            {getAssetId(layer.refId) &&
                              (JSON.parse(value) as LottieJson).assets[
                                getAssetId(layer.refId)
                              ]?.layers.map((assetLayer, assetLayerIndex) => {
                                return (
                                  <Accordion.Item
                                    value={assetLayerIndex.toString()}
                                  >
                                    <Accordion.Control>
                                      {assetLayer.nm}
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                      {assetLayer?.shapes?.map(
                                        (assetShape, assetShapeIndex) => {
                                          return (
                                            <Box>
                                              {assetShape?.it.map(
                                                (assetItem, assetItemIndex) => {
                                                  const color = assetItem.c?.k;
                                                  if (color) {
                                                    return (
                                                      <ColorInput
                                                        defaultValue="rgba(1,1,1,1)"
                                                        format="rgba"
                                                        value={`rgba(${Math.round(
                                                          color[0] * 255
                                                        )},${Math.round(
                                                          color[1] * 255
                                                        )},${Math.round(
                                                          color[2] * 255
                                                        )},${color[3] ?? 1})`}
                                                        onChange={(color) => {
                                                          const rgba = color
                                                            .replace(
                                                              "rgba(",
                                                              ""
                                                            )
                                                            .replace(")", "")
                                                            .split(",")
                                                            .map((v) =>
                                                              parseFloat(v)
                                                            );
                                                          const json =
                                                            JSON.parse(
                                                              value
                                                            ) as LottieJson;
                                                          rgba[3] =
                                                            rgba[3] * 255;
                                                          json.assets[
                                                            getAssetId(
                                                              layer.refId
                                                            )
                                                          ].layers[
                                                            assetLayerIndex
                                                          ].shapes[
                                                            assetShapeIndex
                                                          ].it[
                                                            assetItemIndex
                                                          ].c!.k = rgba.map(
                                                            (v) => v / 255
                                                          );
                                                          setValue(
                                                            JSON.stringify(
                                                              json,
                                                              null,
                                                              2
                                                            )
                                                          );
                                                        }}
                                                      />
                                                    );
                                                  }
                                                  return (
                                                    <Box>
                                                      {assetItem.nm}
                                                      {assetItem.c && (
                                                        <Box>
                                                          Color: {assetItem.c.k}
                                                        </Box>
                                                      )}
                                                    </Box>
                                                  );
                                                }
                                              )}
                                            </Box>
                                          );
                                        }
                                      )}
                                    </Accordion.Panel>
                                  </Accordion.Item>
                                );
                              })}
                          </Accordion>
                          {layer?.shapes?.map((shape, shapeIndex) => {
                            return (
                              <Box>
                                {shape?.it.map((item, itemIndex) => {
                                  const color = item.c?.k;
                                  if (color) {
                                    return (
                                      <ColorInput
                                        defaultValue="rgba(1,1,1,1)"
                                        format="rgba"
                                        value={`rgba(${color[0] * 255},${
                                          color[1] * 255
                                        },${color[2] * 255},${color[3] ?? 1})`}
                                        onChange={(color) => {
                                          const rgba = color
                                            .replace("rgba(", "")
                                            .replace(")", "")
                                            .split(",")
                                            .map((v) => parseFloat(v));
                                          const json = JSON.parse(
                                            value
                                          ) as LottieJson;
                                          rgba[3] = rgba[3] * 255;
                                          json.layers[layerIndex].shapes[
                                            shapeIndex
                                          ].it[itemIndex].c!.k = rgba.map(
                                            (v) => v / 255
                                          );
                                          setValue(
                                            JSON.stringify(json, null, 2)
                                          );
                                        }}
                                      />
                                    );
                                  }
                                  return (
                                    <Box>
                                      {item.nm}
                                      {item.c && <Box>Color: {item.c.k}</Box>}
                                    </Box>
                                  );
                                })}
                              </Box>
                            );
                          })}
                        </Accordion.Panel>
                      </Accordion.Item>
                    );
                  }
                )}
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
            order={2}
          >
            <Text>All Colors</Text>
            {isValidJson() &&
              getColors().map((color) => {
                return (
                  <ColorInput
                    defaultValue="rgba(1,1,1,1)"
                    format="rgba"
                    value={`rgba(${Math.round(color[0] * 255)},${Math.round(
                      color[1] * 255
                    )},${Math.round(color[2] * 255)},${color[3] ?? 1})`}
                    onChange={(newColor) => {
                      const rgba = newColor
                        .replace("rgba(", "")
                        .replace(")", "")
                        .split(",")
                        .map((v) => parseFloat(v));
                      rgba[3] = rgba[3] * 255;
                      changeColor(color, rgba);
                    }}
                  />
                );
              })}
          </Grid.Col>
          <Grid.Col
            md={4}
            xs={10}
            mx={{ md: "0", base: "auto" }}
            span={12}
            orderMd={3}
            order={3}
          >
            <Box w={400} h={400} mt={20}>
              {isValidJson() && (
                <LottiePlayer
                  animationData={JSON.parse(value) as Record<string, any>}
                />
              )}
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </MantineProvider>
  );
}
