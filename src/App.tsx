import {
  Box,
  Button,
  Flex,
  Grid,
  JsonInput,
  MantineProvider,
  Text,
} from "@mantine/core";
import { useState } from "react";
import LottiePlayer from "./Lottie";
import { LottieEditor } from "./LottieEditor";
import { LottieJson } from "./lottie/lottie";

export default function App() {
  const [value, setValue] = useState("");
  const [selectedJson, setSelectedJson] = useState<LottieJson | null>(null);
  const [animationPaused, setAnimationPaused] = useState(false);

  function setValueFromJson(json: LottieJson) {
    setValue(JSON.stringify(json, null, 2));
  }

  function isValidJson() {
    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return false;
    }
  }

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Box>
        <Box
          p={"xl"}
          style={{
            borderBottom: "1px solid #eee",
          }}
        >
          <Flex align={"center"} justify={"space-between"}>
            <Flex>
              <Text weight={"bold"} size={"2.5rem"}>
                {" "}
                Lottie{" "}
              </Text>
              <Text size={"2.5rem"}> Editor </Text>
            </Flex>
            <Button
              disabled={!isValidJson()}
              color="teal"
              size="lg"
              px={40}
              radius={"lg"}
              style={{ fontWeight: 800 }}
              onClick={() => {
                const a = document.createElement("a");
                a.href =
                  "data:text/json;charset=utf-8," + encodeURIComponent(value);
                a.download = "lottie.json";
                a.click();
              }}
            >
              Export
            </Button>
          </Flex>
        </Box>

        <Box>
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
            {isValidJson() && (
              <LottieEditor
                value={JSON.parse(value) as LottieJson}
                setJson={setValueFromJson}
                setSelectedjson={setSelectedJson}
              />
            )}

            <Grid.Col
              md={5}
              xs={10}
              mx={{ md: "0", base: "auto" }}
              span={12}
              orderMd={2}
              order={1}
              bg={"#eee"}
              style={{ zIndex: 1 }}
              mt={8}
            >
              {isValidJson() && (
                <Box w={400} h={500} mt={20}>
                  <Box pos={"relative"} h={400} w={400}>
                    <Box
                      pos={"absolute"}
                      top={0}
                      left={0}
                      h={"100%"}
                      w={"100%"}
                      style={{
                        opacity: selectedJson ? 0.2 : 1,
                        zIndex: -1,
                      }}
                    >
                      <LottiePlayer
                        paused={animationPaused}
                        animationData={JSON.parse(value) as LottieJson}
                      />
                    </Box>
                    {selectedJson && (
                      <Box
                        pos={"absolute"}
                        top={0}
                        left={0}
                        h={"100%"}
                        w={"100%"}
                        style={{
                          opacity: 1,
                        }}
                      >
                        <LottiePlayer
                          animationData={selectedJson}
                          paused={animationPaused}
                        />
                      </Box>
                    )}
                  </Box>
                  <Button
                    style={{
                      position: "relative",
                    }}
                    onClick={() => {
                      setAnimationPaused(!animationPaused);
                    }}
                  >
                    {animationPaused ? "Play" : "Pause"}
                  </Button>
                </Box>
              )}
            </Grid.Col>
          </Grid>
        </Box>
      </Box>
    </MantineProvider>
  );
}
