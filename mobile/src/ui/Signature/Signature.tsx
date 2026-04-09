/* istanbul ignore file */
import React, { useRef, useState } from "react";
import { View, LayoutChangeEvent } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import TitleBar from "~/src/ui/TitleBar";
import { Buttons } from "~/src/ui/Buttons";

import type { SignatureProps } from "@shared/types";
export type { SignatureProps };

type SvgPath = { d: string };

const CANVAS_WIDTH = 344;
const CANVAS_HEIGHT = 258;

const Signature: React.FC<SignatureProps> = ({
  language = "en",
  title = "Sign to Approve",
  title_ar = "وقع للموافقة",
  buttonText = "Approve",
  buttonText_ar = "موافق",
  theme = "dark",
  onSubmit = () => {},
}) => {
  const [paths, setPaths] = useState<SvgPath[]>([]);
  const [isSigned, setIsSigned] = useState(false);
  const [canvasSize, setCanvasSize] = useState({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  });
  const currentPathRef = useRef<string>("");

  // Pen color derived from theme — mirrors web's --signature-pen-color CSS variable behaviour
  const penColor = theme === "dark" ? "#FFFFFF" : "#000000";

  const handleCanvasLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setCanvasSize({ width, height });
    }
  };

  const startPath = (x: number, y: number) => {
    const startD = `M${x.toFixed(2)},${y.toFixed(2)}`;
    currentPathRef.current = startD;
    setPaths((prev) => [...prev, { d: startD }]);
  };

  const updatePath = (x: number, y: number) => {
    currentPathRef.current += ` L${x.toFixed(2)},${y.toFixed(2)}`;
    const snapshot = currentPathRef.current;
    setPaths((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[updated.length - 1] = { d: snapshot };
      return updated;
    });
    setIsSigned(true);
  };

  // Use RNGH's GestureDetector so this gesture lives in the same gesture system
  // as Gorhom BottomSheet (RNGH v2). The innermost gesture wins, preventing the
  // sheet from intercepting pan movements and resizing while the user is signing.
  const drawGesture = Gesture.Pan()
    .minDistance(0)
    .onBegin((e) => {
      "worklet";
      runOnJS(startPath)(e.x, e.y);
    })
    .onChange((e) => {
      "worklet";
      runOnJS(updatePath)(e.x, e.y);
    });

  const handleApprove = () => {
    if (paths.length === 0) return;
    /* istanbul ignore next */
    const pathsMarkup = paths
      .map(
        (p) =>
          `<path d="${p.d}" stroke="${penColor}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`
      )
      .join("\n");
    const { width: w, height: h } = canvasSize;
    const svgString = [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"`,
      ` viewBox="0 0 ${w} ${h}">`,
      pathsMarkup,
      "</svg>",
    ].join("");
    const signature = `data:image/svg+xml;base64,${btoa(svgString)}`;
    onSubmit({ signature });
  };

  return (
    <View className="w-full" style={{ flexDirection: "column" }}>
      <TitleBar
        title={title}
        title_ar={title_ar || title}
        showAcronym={false}
        showButton={false}
        language={language}
      />
      <GestureDetector gesture={drawGesture}>
        <View
          className="bg-form-fields-input-form-bg rounded-m my-4 flex items-center justify-center signature-container"
          style={{ overflow: "hidden" }}
          onLayout={handleCanvasLayout}
        >
          <Svg
            width={canvasSize.width}
            height={canvasSize.height}
            style={{ backgroundColor: "transparent" }}
          >
            {paths.map((p, idx) => (
              <Path
                key={idx}
                d={p.d}
                stroke={penColor}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </Svg>
        </View>
      </GestureDetector>
      <View className="flex justify-end gap-4 flex-col mt-6">
        <View className="flex flex-row justify-end">
          <Buttons
            title={buttonText}
            title_ar={buttonText_ar || buttonText}
            type="primary"
            onClick={handleApprove}
            disabled={!isSigned}
            language={language}
          />
        </View>
      </View>
    </View>
  );
};

export default Signature;
