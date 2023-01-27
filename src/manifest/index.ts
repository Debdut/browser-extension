import getManifestV2 from "./v2";
import getManifestV3 from "./v3";

export function getManifest(version: 2 | 3, pageDirMap: { [x: string]: any }) {
  if (version === 2) {
    return getManifestV2(pageDirMap);
  } else if (version === 3) {
    return getManifestV3(pageDirMap);
  } else {
    throw new Error("Invalid version");
  }
}
