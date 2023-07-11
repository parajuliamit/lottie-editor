import {
  Anchor,
  Box,
  Button,
  Flex,
  Grid,
  MantineProvider,
  Modal,
  Text,
} from "@mantine/core";
import { useState } from "react";
import LottiePlayer from "./Lottie";
import { LottieEditor } from "./LottieEditor";
import { LottieJson } from "./lottie/lottie";
import { FiUpload } from "react-icons/fi";
import FileUpload from "./FileUpload";
import { useDisclosure } from "@mantine/hooks";

export default function App() {
  const [value, setValue] = useState("");
  const [selectedJson, setSelectedJson] = useState<LottieJson | null>(null);
  const [animationPaused, setAnimationPaused] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  function setValueFromJson(json: LottieJson) {
    setValue(JSON.stringify(json, null, 2));
  }

  function isValidJson() {
    try {
      JSON.parse(value) as LottieJson;
      return true;
    } catch (e) {
      return false;
    }
  }

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Box>
        <Modal opened={opened} onClose={close} withCloseButton={false}>
          <FileUpload value={value} setValue={setValue} onClose={close} />
        </Modal>
        <Box
          px={"xl"}
          py={"sm"}
          style={{
            borderBottom: "1px solid #eee",
          }}
        >
          <Flex align={"center"} justify={"space-between"}>
            <Flex>
              <Text weight={"bold"} size={"2rem"}>
                {" "}
                Lottie{" "}
              </Text>
              <Text size={"2rem"}> Editor </Text>
            </Flex>

            <Flex align={"center"}>
              <Anchor mr={"xl"} c={"teal"} onClick={open}>
                <FiUpload size={"1.5rem"} />
              </Anchor>
              <Button
                disabled={!isValidJson()}
                color="teal"
                size="md"
                px={40}
                radius={"md"}
                style={{ fontWeight: 700 }}
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
          </Flex>
        </Box>
        {!isValidJson() ? (
          <FileUpload value={value} setValue={setValue} />
        ) : (
          <Box>
            <Grid w={"100%"} h={"100%"} mt={0}>
              <LottieEditor
                value={JSON.parse(value) as LottieJson}
                setJson={setValueFromJson}
                setSelectedjson={setSelectedJson}
              />

              <Grid.Col
                md={6}
                xs={10}
                mx={0}
                span={12}
                orderMd={2}
                order={1}
                bg={"#f9f9f9"}
                style={{ zIndex: 1 }}
                p={0}
                sx={(theme) => ({
                  [theme.fn.largerThan("md")]: {
                    borderRight: "1px solid #E5E5E5",
                  },
                  [theme.fn.smallerThan("md")]: { border: "none" },
                })}
              >
                <Box>
                  <Box pos={"relative"}>
                    <Box
                      pos={"absolute"}
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
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      mt={430}
                      onClick={() => {
                        setAnimationPaused(!animationPaused);
                      }}
                      color="teal"
                    >
                      {animationPaused ? "Play" : "Pause"}
                    </Button>
                  </Box>
                </Box>
              </Grid.Col>
            </Grid>
          </Box>
        )}
      </Box>
    </MantineProvider>
  );
}
