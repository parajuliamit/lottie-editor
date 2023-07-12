import {
  Anchor,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  MantineProvider,
  Modal,
  Text,
} from "@mantine/core";
import { useState } from "react";
import LottiePlayer from "./LottiePlayer";
import { LottieEditor } from "./LottieEditor";
import { LottieJson, dummy } from "./lottie/lottie";
import { FiUpload } from "react-icons/fi";
import FileUpload from "./FileUpload";
import { useDisclosure } from "@mantine/hooks";

export default function App() {
  const [value, setValue] = useState("");
  const [selectedJson, setSelectedJson] = useState<LottieJson | null>(null);
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
          <FileUpload
            value={value}
            setValue={setValue}
            onClose={close}
            setSelectedJson={setSelectedJson}
          />
        </Modal>
        <Box
          px={"xl"}
          py={"sm"}
          style={{
            borderBottom: "1px solid #eee",
          }}
          h={80}
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
          <>
            <FileUpload
              value={value}
              setValue={setValue}
              setSelectedJson={setSelectedJson}
            />
            <Center>
              <Text size="sm" color="dimmed">
                OR
              </Text>
            </Center>
            <Center>
              <Button
                mt={"lg"}
                color="teal"
                size="md"
                px={40}
                radius={"md"}
                style={{ fontWeight: 700 }}
                onClick={() => {
                  setValueFromJson(dummy);
                }}
              >
                Try Demo
              </Button>
            </Center>
          </>
        ) : (
          <Box>
            <Grid w={"100%"} h={"100%"} mt={0}>
              <LottieEditor
                value={JSON.parse(value) as LottieJson}
                setJson={setValueFromJson}
                setSelectedjson={setSelectedJson}
              />

              <LottiePlayer
                animationData={JSON.parse(value) as LottieJson}
                selectedJson={selectedJson}
              />
            </Grid>
          </Box>
        )}
      </Box>
    </MantineProvider>
  );
}
