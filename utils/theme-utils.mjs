import tinycolor from "tinycolor2";

export function getContrastText(bgColor) {
  const white = tinycolor.readability(bgColor, "#fff");
  const black = tinycolor.readability(bgColor, "#000");
  return white >= black ? "#fff" : "#000";
}

/**
 * 生成 light / main / dark / contrastText 颜色
 * @param {Object} options
 * @param {string} options.main - 主色 (必填，Hex/rgba/hsl 都行)
 * @param {number} [options.lighten=20] - 提亮百分比 (0-100)
 * @param {number} [options.darken=20] - 加深百分比 (0-100)
 */
export function augmentColor({ main, lighten = 20, darken = 20 }) {
  if (!main) throw new Error("augmentColor requires a 'main' color.");

  const mainColor = tinycolor(main);

  const light = mainColor.clone().lighten(lighten).toHexString();
  const dark = mainColor.clone().darken(darken).toHexString();

  // 自动挑选对比色，保证可读性
  const contrastText = tinycolor
    .mostReadable(mainColor, ["#ffffff", "#000000"], {
      level: "AA", // WCAG 2.0 AA 标准
      size: "small",
    })
    .toHexString();

  return {
    light,
    main: mainColor.toHexString(),
    dark,
    contrastText,
  };
}
