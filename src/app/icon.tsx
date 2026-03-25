import { ImageResponse } from "next/og";
import { renderAppIcon } from "./utils/renderAppIcon";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(renderAppIcon(26, "8px"), { ...size });
}
