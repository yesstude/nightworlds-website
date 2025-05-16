import { useEffect, useState } from "react";
import { Banner, renderBannerFace } from "mcbanners";

export function useFlagFace(flagString: string, scale = 1) {
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    (async () => {
      const banner = Banner.fromString(flagString);
      const buf = await renderBannerFace(banner, scale, {
        overrideLoadAssetFunction: async (name) => {
          return `/mcbanners/${name?.split(":")[1] ?? "base"}.png`;
        },
      });
      const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
      setSrc(dataUrl);
    })();
  }, [flagString, scale]);

  return src;
}
