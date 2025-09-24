import tinycolor from "tinycolor2";

export function getContrastText(bgColor) {
  const white = tinycolor.readability(bgColor, "#fff");
  const black = tinycolor.readability(bgColor, "#000");
  return white >= black ? "#fff" : "#000";
}

/**
 * Generates light / main / dark / contrastText colors
 * @param {string} color - Main color (required, accepts Hex/rgba/hsl)
 * @param {Object} options
 * @param {number} [options.lighten=20] - Lightening percentage (0-100)
 * @param {number} [options.darken=20] - Darkening percentage (0-100)
 */
export function augmentColor(color, { lighten = 20, darken = 20 } = {}) {
  if (!color) throw new Error("augmentColor requires a 'color' parameter.");

  const mainColor = tinycolor(color);

  const light = mainColor.clone().lighten(lighten).toHexString();
  const dark = mainColor.clone().darken(darken).toHexString();

  // Automatically select contrast color to ensure readability
  const contrastText = tinycolor
    .mostReadable(mainColor, ["#ffffff", "#000000"], {
      level: "AA", // WCAG 2.0 AA standard
      size: "small",
    })
    .toHexString();

  const main = mainColor.toHexString();

  return {
    light,
    main,
    dark,
    contrastText,
  };
}
