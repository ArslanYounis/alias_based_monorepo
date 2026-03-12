import React, { useRef, useState } from "react";
import { View, PanResponder, GestureResponderEvent } from "react-native";
import Svg, { Path } from "react-native-svg";
import TitleBar from "~/src/components/TitleBar";
import { Buttons } from "~/src/ui/Buttons";

export interface SignatureProps {
  language?: "en" | "ar";
  title?: string;
  title_ar?: string;
  buttonText?: string;
  buttonText_ar?: string;
  theme?: "light" | "dark";
  onSubmit?: (val: { signature: string }) => void;
}

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
  const currentPathRef = useRef<string>("");

  // Pen color derived from theme — mirrors web's --signature-pen-color CSS variable behaviour
  const penColor = theme === "dark" ? "#FFFFFF" : "#000000";

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e: GestureResponderEvent) => {
        const { locationX, locationY } = e.nativeEvent;
        const startD = `M${locationX.toFixed(2)},${locationY.toFixed(2)}`;
        currentPathRef.current = startD;
        setPaths((prev) => [...prev, { d: startD }]);
      },
      onPanResponderMove: (e: GestureResponderEvent) => {
        const { locationX, locationY } = e.nativeEvent;
        currentPathRef.current += ` L${locationX.toFixed(
          2
        )},${locationY.toFixed(2)}`;
        const snapshot = currentPathRef.current;
        setPaths((prev) => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          updated[updated.length - 1] = { d: snapshot };
          return updated;
        });
        setIsSigned(true);
      },
    })
  ).current;

  const handleApprove = () => {
    if (paths.length === 0) return;
    const pathsMarkup = paths
      .map(
        (p) =>
          `<path d="${p.d}" stroke="${penColor}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`
      )
      .join("\n");
    const svgString = [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"`,
      ` viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}">`,
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
      <View
        className="bg-form-fields-input-form-bg rounded-m my-4 flex items-center justify-center signature-container"
        style={{ overflow: "hidden" }}
        {...panResponder.panHandlers}
      >
        <Svg
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
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
