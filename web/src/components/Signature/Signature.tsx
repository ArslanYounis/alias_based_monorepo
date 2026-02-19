import type { SignatureProps } from "@shared/types";
import React, { useRef, useState } from "react";
import { Buttons } from "../../ui/Buttons";

export type { SignatureProps };

export const Signature: React.FC<SignatureProps> = ({
  title = "Sign to Approve",
  title_ar,
  theme = "dark",
  onSubmit,
  language = "en",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    }
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    onSubmit?.({ signature: dataUrl } as Parameters<NonNullable<SignatureProps["onSubmit"]>>[0]);
  };

  return (
    <div
      className={`w-full rounded-lg p-4 ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"}`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <h2 className="text-lg font-bold text-text-default mb-4">
        {language === "ar" ? title_ar ?? title : title}
      </h2>
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="w-full max-w-[400px] h-[200px] border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-900 touch-none cursor-crosshair"
        onMouseDown={() => setHasDrawn(true)}
        onTouchStart={() => setHasDrawn(true)}
      />
      <div className="flex gap-2 mt-4">
        <Buttons
          type="secondary"
          size="m"
          title={language === "ar" ? "مسح" : "Clear"}
          onClick={handleClear}
          language={language}
        />
        <Buttons
          type="primary"
          size="m"
          title={language === "ar" ? "موافق" : "Approve"}
          onClick={handleSubmit}
          disabled={!hasDrawn}
          language={language}
        />
      </div>
    </div>
  );
};
