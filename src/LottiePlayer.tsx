import Lottie from "react-lottie";
import { LottieJson } from "./lottie/lottie";
import { Box, Button, Grid } from "@mantine/core";
import { useState } from "react";
import { useViewportSize } from "@mantine/hooks";

export default function LottiePlayer({
  animationData,
  selectedJson,
}: {
  animationData: LottieJson;
  selectedJson: LottieJson | null;
}) {
  const [paused, setPaused] = useState(false);
  const { height } = useViewportSize();
  return (
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
      <Box h={height - 80}>
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
            <Lottie
              isPaused={paused}
              options={{
                loop: true,
                autoplay: true,
                animationData: animationData,
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
              height={400}
              width={400}
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
              <Lottie
                isPaused={paused}
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: selectedJson,
                  rendererSettings: {
                    preserveAspectRatio: "xMidYMid slice",
                  },
                }}
                height={400}
                width={400}
              />
            </Box>
          )}
        </Box>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
          }}
          bottom={0}
        >
          <Button
            mt={430}
            onClick={() => {
              setPaused(!paused);
            }}
            color="teal"
          >
            {paused ? "Play" : "Pause"}
          </Button>
        </Box>
      </Box>
    </Grid.Col>
  );
}
