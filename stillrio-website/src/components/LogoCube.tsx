"use client";

import Image from "next/image";

const SIZE = 120;
const HALF = SIZE / 2;

const faceBase =
  "absolute left-0 top-0 flex items-center justify-center overflow-hidden bg-black [backface-visibility:visible]";

const solidFaceBase =
  "absolute left-0 top-0 bg-black [backface-visibility:visible]";

export default function LogoCube() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes logo-spin-3d {
              from { transform: rotateY(0deg); }
              to { transform: rotateY(360deg); }
            }
            .cube-inner {
              animation: logo-spin-3d 12s linear infinite;
            }
          `,
        }}
      />
      <div
        className="relative"
        style={{
          width: SIZE,
          height: SIZE,
          perspective: "600px",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="cube-inner absolute left-0 top-0"
          style={{
            width: SIZE,
            height: SIZE,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Front */}
          <div
            className={faceBase}
            style={{
              width: SIZE,
              height: SIZE,
              transform: `translateZ(${HALF}px)`,
            }}
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
            style={{
              width: SIZE,
              height: SIZE,
              transform: `rotateY(180deg) translateZ(${HALF}px)`,
            }}
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
            style={{
              width: SIZE,
              height: SIZE,
              transform: `rotateY(90deg) translateZ(${HALF}px)`,
            }}
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
            style={{
              width: SIZE,
              height: SIZE,
              transform: `rotateY(-90deg) translateZ(${HALF}px)`,
            }}
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
          {/* Top - solid black */}
          <div
            className={`${solidFaceBase}`}
            style={{
              width: SIZE,
              height: SIZE,
              transform: `rotateX(90deg) translateZ(${HALF}px)`,
            }}
          />
          {/* Bottom - solid black */}
          <div
            className={`${solidFaceBase}`}
            style={{
              width: SIZE,
              height: SIZE,
              transform: `rotateX(-90deg) translateZ(${HALF}px)`,
            }}
          />
        </div>
      </div>
    </>
  );
}
