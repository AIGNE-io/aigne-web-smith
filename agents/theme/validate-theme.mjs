export default async function validateTheme({ theme }) {
  if (!theme) {
    return {
      isValid: false,
      errors: ["No theme data provided"],
      warnings: [],
    };
  }

  const errors = [];
  const warnings = [];

  // Validate required fields
  const requiredFields = ['name', 'light', 'dark', 'fonts', 'metadata'];
  for (const field of requiredFields) {
    if (!theme[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate color format
  const colorFields = ['primary', 'secondary', 'success', 'error', 'info', 'warning', 'background', 'surface', 'text'];
  const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
  
  for (const mode of ['light', 'dark']) {
    if (theme[mode]) {
      for (const colorField of colorFields) {
        if (theme[mode][colorField]) {
          if (!hexColorRegex.test(theme[mode][colorField])) {
            errors.push(`Invalid color format in ${mode}.${colorField}: ${theme[mode][colorField]}`);
          }
        } else {
          warnings.push(`Missing color field: ${mode}.${colorField}`);
        }
      }
    }
  }

  // Validate fonts
  if (theme.fonts) {
    const fontFields = ['heading', 'body'];
    for (const fontField of fontFields) {
      if (!theme.fonts[fontField] || !theme.fonts[fontField].fontFamily) {
        errors.push(`Missing font family for ${fontField}`);
      }
    }
  }

  // Validate metadata
  if (theme.metadata) {
    if (!theme.metadata.generatedAt) {
      warnings.push("Missing generation timestamp in metadata");
    }
    if (!theme.metadata.version) {
      warnings.push("Missing version in metadata");
    }
    if (!theme.metadata.description) {
      warnings.push("Missing description in metadata");
    }
  }

  // Check for accessibility concerns
  if (theme.light && theme.dark) {
    // Basic contrast check (simplified)
    const lightBg = theme.light.background;
    const lightText = theme.light.text;
    const darkBg = theme.dark.background;
    const darkText = theme.dark.text;
    
    if (lightBg && lightText && lightBg === lightText) {
      warnings.push("Light mode background and text colors are identical");
    }
    if (darkBg && darkText && darkBg === darkText) {
      warnings.push("Dark mode background and text colors are identical");
    }
  }

  const isValid = errors.length === 0;

  if (isValid) {
    console.log("✅ Theme validation passed");
    if (warnings.length > 0) {
      console.log("⚠️  Warnings:");
      warnings.forEach(warning => console.log(`   - ${warning}`));
    }
  } else {
    console.log("❌ Theme validation failed");
    errors.forEach(error => console.log(`   - ${error}`));
  }

  return {
    isValid,
    errors,
    warnings,
    themeName: theme.name,
  };
}

validateTheme.task_render_mode = "hide";
