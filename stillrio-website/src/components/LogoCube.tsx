"use client";

import Image from "next/image";
import { useState } from "react";

const SIZE = 120;
const HALF = SIZE / 2;

const faceBase =
  "absolute left-0 top-0 flex items-center justify-center overflow-hidden bg-black [backface-visibility:visible]";
const solidFaceBase = "absolute left-0 top-0 bg-black [backface-visibility:visible]";

export default function LogoCube() {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes logo-float {
              0%, 100% { transform: translateY(0px); }
              50%       { transform: translateY(-2px); }
            }
            .logo-float {
              animation: logo-float 7s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
            .cube-rotate {
              transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);
            }
            @media (prefers-reduced-motion: reduce) {
              .logo-float  { animation: none !important; }
              .cube-rotate { transition: none !important; }
            }
          `,
        }}
      />

      {/* Floating wrapper */}
      <div className="logo-float" style={{ display: "inline-block" }}>
        {/* Hover detection + perspective */}
        <div
          style={{
            position: "relative",
            width: `${SIZE}px`,
            height: `${SIZE}px`,
            perspective: "600px",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Rotating cube */}
          <div
            className="cube-rotate"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: `${SIZE}px`,
              height: `${SIZE}px`,
              transformStyle: "preserve-3d",
              transform: hovered ? "rotateY(12deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front */}
            <div
              className={faceBase}
              style={{ width: `${SIZE}px`, height: `${SIZE}px`, transform: `translateZ(${HALF}px)` }}
            >
              <Image
                src="/logo.png"
                alt="StillRio"
                width={SIZE}
                height={SIZE}
                className="object-contain drop-shadow-[0_0_24px_rgba(255,255,255,0.4)]"
              />
            </div>
            {/* Back */}
            <div
              className={faceBase}
              style={{ width: `${SIZE}px`, height: `${SIZE}px`, transform: `rotateY(180deg) translateZ(${HALF}px)` }}
            >
              <div style={{ transform: "rotateY(180deg)" }}>
                <Image
                  src="/logo.png"
                  alt=""
                  width={SIZE}
                  height={SIZE}
                  aria-hidden
                  className="object-contain drop-shadow-[0_0_24px_rgba(255,255,255,0.4)]"
                />
              </div>
            </div>
            {/* Right */}
            <div
              className={faceBase}
              style={{ width: `${SIZE}px`, height: `${SIZE}px`, transform: `rotateY(90deg) translateZ(${HALF}px)` }}
            >
              <Image
                src="/logo.png"
                alt=""
                width={SIZE}
                height={SIZE}
                aria-hidden
                className="object-contain drop-shadow-[0_0_24px_rgba(255,255,255,0.4)]"
              />
            </div>
            {/* Left */}
            <div
              className={faceBase}
              style={{ width: `${SIZE}px`, height: `${SIZE}px`, transform: `rotateY(-90deg) translateZ(${HALF}px)` }}
            >
              <Image
                src="/logo.png"
                alt=""
                width={SIZE}
                height={SIZE}
                aria-hidden
                className="object-contain drop-shadow-[0_0_24px_rgba(255,255,255,0.4)]"
              />
            </div>
            {/* Top — solid */}
            <div
              className={solidFaceBase}
              style={{ width: `${SIZE}px`, height: `${SIZE}px`, transform: `rotateX(90deg) translateZ(${HALF}px)` }}
            />
            {/* Bottom — solid */}
            <div
              className={solidFaceBase}
              style={{ width: `${SIZE}px`, height: `${SIZE}px`, transform: `rotateX(-90deg) translateZ(${HALF}px)` }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
