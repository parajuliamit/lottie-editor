import Lottie from "react-lottie";
import { LottieJson } from "./lottie/lottie";
import { Button } from "@mantine/core";
import { useState } from "react";

export default function LottiePlayer({
  animationData,
  paused,
}: {
  animationData: LottieJson;
  paused?: boolean;
}) {
  const [isStopped, setIsStopped] = useState(false);
  return (
    <div>
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
    </div>
  );
}
