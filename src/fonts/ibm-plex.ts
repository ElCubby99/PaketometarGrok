import localFont from "next/font/local";

/**
 * Vendored IBM Plex (OFL, see ./OFL.txt).
 * next/font/local reads these files from disk. The production build does not
 * call fonts.googleapis.com or fonts.gstatic.com.
 * Files are the complete woff2 cuts, which include Latin Extended (č, ć, đ, š, ž).
 */
export const plexSans = localFont({
  src: [
    { path: "./IBMPlexSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./IBMPlexSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "./IBMPlexSans-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./IBMPlexSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-plex-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const plexMono = localFont({
  src: [
    { path: "./IBMPlexMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "./IBMPlexMono-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
  adjustFontFallback: false,
});
