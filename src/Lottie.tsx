import Lottie from "react-lottie";
import { LottieJson } from "./lottie/lottie";

export default function LottiePlayer({
  animationData,
  paused,
}: {
  animationData: LottieJson;
  paused?: boolean;
}) {
  return (
    <div>
      <Lottie
        isPaused={paused}
        options={{
          loop: true,
          autoplay: paused ? false : true,
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
