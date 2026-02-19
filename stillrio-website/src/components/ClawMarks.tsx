"use client";

type Variant = "light" | "dark";

export default function ClawMarks({
  variant = "dark",
  className = "",
  size = 24,
}: {
  variant?: Variant;
  className?: string;
  size?: number;
}) {
  // light = dark backgrounds → invert to white marks
  // dark = light backgrounds → black marks (transparent bg)
  const isLight = variant === "light";

  return (
    <span
      className={`inline-block animate-claw-float ${className}`}
      style={{
        filter: isLight ? "invert(1)" : undefined,
        lineHeight: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/claw-marks.png"
        alt=""
        width={size}
        height={size}
        aria-hidden
        className="block"
        style={{ maxWidth: `${size}px`, height: "auto", verticalAlign: "middle" }}
      />
    </span>
  );
}
