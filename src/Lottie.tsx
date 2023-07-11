import Lottie from "react-lottie";

export default function LottiePlayer({
  animationData,
}: {
  animationData: Record<string, any>;
}) {
  return (
    <div>
      <Lottie
        options={{
          loop: false,
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
