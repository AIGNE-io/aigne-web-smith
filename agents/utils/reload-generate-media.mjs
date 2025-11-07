import path from "node:path";
import { loadMediaFilesFromAssets } from "../../utils/file-utils.mjs";
import { buildMediaItem } from "../../utils/media-utils.mjs";

export default async function reloadGenerateMedia(input) {
  const { mediaFiles: previousMediaFiles, media, pagesDir } = input;
  const { minImageWidth } = media || { minImageWidth: 800 };

  // Get previous mediaFiles from input
  const mediaFiles = Array.isArray(previousMediaFiles) ? [...previousMediaFiles] : [];

  // Load generated media files from .aigne/web-smith/assets
  const assetsDir = path.join(process.cwd(), ".aigne", "web-smith", "assets");
  const assetMediaFiles = await loadMediaFilesFromAssets(assetsDir);

  // Process asset media files and build media items
  await Promise.all(
    assetMediaFiles.map(async (file) => {
      const mediaItem = await buildMediaItem(file, pagesDir, { minImageWidth });

      // If filtered out (null), skip
      if (!mediaItem) {
        return;
      }

      mediaFiles.push(mediaItem);
    }),
  );

  // Remove duplicates based on path
  const uniqueMediaFiles = [];
  const seenPaths = new Set();

  for (const item of mediaFiles) {
    if (!seenPaths.has(item.path)) {
      seenPaths.add(item.path);
      uniqueMediaFiles.push(item);
    }
  }

  return {
    ...input,
    mediaFiles: uniqueMediaFiles,
  };
}
