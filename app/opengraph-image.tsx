import { ImageResponse } from "next/og";

export const alt = "DishaHire: Right talent, right direction.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#103838",
          color: "white",
          fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "-0.03em",
        }}
      >
        <div style={{ display: "flex", fontSize: 44 }}>
          Disha<span style={{ color: "#d9bb73" }}>Hire</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, lineHeight: 1.02 }}>Right talent,</div>
          <div style={{ fontSize: 96, lineHeight: 1.02, color: "#d9bb73" }}>right direction.</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "rgba(255,255,255,.75)", fontFamily: "sans-serif" }}>
          Recruitment consultancy · Rajkot, Gujarat · 15 industries
        </div>
      </div>
    ),
    size,
  );
}
