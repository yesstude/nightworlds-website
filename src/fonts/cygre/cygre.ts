import localFont from "next/font/local";

const cygre = localFont({
  variable: "--font-cygre",
  src: [
    { path: "./Cygre-Thin.woff2", weight: "100", style: "normal" },
    { path: "./Cygre-Thin-Italics.woff2", weight: "100", style: "italic" },
    { path: "./Cygre-Light.woff2", weight: "300", style: "normal" },
    { path: "./Cygre-Light-Italics.woff2", weight: "300", style: "italic" },
    { path: "./Cygre-Regular.woff2", weight: "400", style: "normal" },
    { path: "./Cygre-Regular-Italics.woff2", weight: "400", style: "italic" },
    { path: "./Cygre-Medium.woff2", weight: "500", style: "normal" },
    { path: "./Cygre-Medium-Italics.woff2", weight: "500", style: "italic" },
    { path: "./Cygre-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./Cygre-SemiBold-Italics.woff2", weight: "600", style: "italic" },
    { path: "./Cygre-Bold.woff2", weight: "700", style: "normal" },
    { path: "./Cygre-Bold-Italics.woff2", weight: "700", style: "italic" },
    { path: "./Cygre-Black.woff2", weight: "800", style: "normal" },
    { path: "./Cygre-Black-Italics.woff2", weight: "800", style: "italic" },
  ],
});

export default cygre;
export const cygre_font = " font-sans " + cygre.variable + " ";
