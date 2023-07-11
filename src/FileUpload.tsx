import {
  Group,
  Text,
  useMantineTheme,
  rem,
  JsonInput,
  Center,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { FiUpload } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { BsFiletypeJson } from "react-icons/bs";

export default function FileUpload({
  value,
  setValue,
  onClose,
}: {
  value: string;
  setValue: (value: string) => void;
  onClose?: () => void;
}) {
  const theme = useMantineTheme();
  return (
    <>
      <Dropzone
        onDrop={(file) =>
          file.forEach((f) => {
            console.log(f);
            f.text()
              .then((text) => {
                setValue(text);
                if (onClose) onClose();
              })
              .catch((err) => {
                console.log(err);
                alert("Invalid JSON");
              });
          })
        }
        onReject={(files) => {
          alert("Invalid file" + files[0].errors[0].message);
        }}
        maxSize={5 * 1024 ** 2}
        accept={["application/json"]}
        m={"lg"}
        multiple={false}
      >
        <Group
          position="center"
          spacing="xl"
          style={{ minHeight: rem(220), pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <FiUpload
              size="3.2rem"
              stroke={1.5}
              color={
                theme.colors[theme.primaryColor][
                  theme.colorScheme === "dark" ? 4 : 6
                ]
              }
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <AiOutlineClose
              size="3.2rem"
              stroke={1.5}
              color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <BsFiletypeJson size="3.2rem" stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="lg" inline>
              Drag and drop your animation to upload
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              Maximum file size: 5 MB
            </Text>
          </div>
        </Group>
      </Dropzone>
      <Center>
        <Text size="sm" color="dimmed">
          OR
        </Text>
      </Center>

      <JsonInput
        label="Enter your Lottie JSON here"
        placeholder="Enter your Lottie JSON here"
        validationError="Invalid JSON"
        minRows={6}
        value={value}
        onChange={setValue}
        p={"lg"}
      />
    </>
  );
}
