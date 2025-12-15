import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface PageProps {
  params: Promise<{
    year: string;
  }>;
}

export default async function Image({ params }: PageProps) {
  const { year } = await params;
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #FF6B6B, #4ECDC4)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px",
        position: "relative",
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)",
        }}
      />

      {/* Content Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "24px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Main Title */}
        <h1
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            margin: "0 0 16px 0",
            color: "white",
            textAlign: "center",
            textShadow: "1px 1px 2px rgba(0,0,0,0.15)",
          }}
        >
          Jagadhatri Puja
        </h1>

        {/* Year */}
        <div
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#FFD700",
            margin: "0 0 24px 0",
            textShadow: "1px 1px 2px rgba(0,0,0,0.15)",
          }}
        >
          {year}
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "32px",
            textAlign: "center",
            margin: 0,
            color: "white",
            opacity: 0.9,
            maxWidth: "80%",
            lineHeight: 1.4,
          }}
        >
          Jubilee • Pre Jubilee List • Schedule
        </p>
      </div>

      {/* Footer Text */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          fontSize: "24px",
          color: "white",
          opacity: 0.8,
        }}
      >
        {process.env.NEXT_PUBLIC_SITE_URL || "Jagadhatri Online"}
      </div>
    </div>,
  );
}
