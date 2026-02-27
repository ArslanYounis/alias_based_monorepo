import React, { useRef, useState, useEffect } from "react";
import TitleBar from "@/components/TitleBar";
import { Buttons } from "@/ui/Buttons";

export interface SignatureProps {
  language?: "en" | "ar";
  title?: string;
  title_ar?: string;
  buttonText?: string;
  buttonText_ar?: string;
  theme?: "light" | "dark";
  onSubmit?: (val: { signature: string }) => void;
}

const Signature: React.FC<SignatureProps> = ({
  language = "en",
  title = "Sign to Approve",
  title_ar = "وقع للموافقة",
  buttonText = "Approve",
  buttonText_ar = "موافق",
  theme = "dark",
  onSubmit = () => {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [penColor, setPenColor] = useState("black");
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Get pen color from CSS custom properties
  useEffect(() => {
    const getPenColor = () => {
      const root = document.documentElement;
      const computedColor = getComputedStyle(root)
        .getPropertyValue("--signature-pen-color")
        .trim();
      return computedColor || "black";
    };

    setPenColor(getPenColor());

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      setPenColor(getPenColor());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const getPos = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const pos = getPos(e);
    if (!pos) return;
    setIsDrawing(true);
    lastPos.current = pos;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    if (!pos || !lastPos.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = penColor;
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
    setIsSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const handleApprove = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signature = canvas.toDataURL("image/png");
    onSubmit({ signature });
  };

  return (
    <div className="w-full" dir={language === "ar" ? "rtl" : "ltr"}>
      <TitleBar
        title={title}
        title_ar={title_ar || title}
        showAcronym={false}
        showButton={false}
        theme={theme}
        language={language}
      />
      <div
        className={`bg-form-fields-input-form-bg rounded-m my-4 flex items-center justify-center signature-container`}
      >
        <canvas
          ref={canvasRef}
          width={544}
          height={408}
          className="sigCanvas !bg-transparent"
          style={{ backgroundColor: "transparent" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="flex justify-end gap-4 flex-col mt-6">
        <div className="flex justify-end">
          <Buttons
            title={buttonText}
            title_ar={buttonText_ar || buttonText}
            type="primary"
            onClick={handleApprove}
            disabled={!isSigned}
            language={language}
          />
        </div>
      </div>
    </div>
  );
};

export default Signature;
