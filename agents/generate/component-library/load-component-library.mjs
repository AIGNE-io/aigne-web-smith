import { getComponentLibraryData } from "../../../utils/generate-helper.mjs";

export default async function loadComponentLibrary(input) {
  const { tmpDir } = input;

  try {
    const componentLibraryData = getComponentLibraryData(tmpDir);

    return {
      componentLibraryData,
      componentLibrary: componentLibraryData?.componentLibrary || [],
    };
  } catch (error) {
    throw new Error(`Failed to load all page content files: ${error.message}`);
  }
}

loadComponentLibrary.taskTitle = "Load component library";
