import { describe, expect, test } from "bun:test";
import {
  canAutoFixErrors,
  extractComponentName,
  extractSectionPath,
  getRequiredFieldsByComponentName,
  getSectionByPath,
  groupErrorsBySection,
  replaceSectionByPath,
  sectionToYaml,
  tryAutoFixSection,
  validateFixedSection,
} from "../../utils/section-fix-utils.mjs";

const sampleComponentLibrary = [
  {
    type: "composite",
    name: "hero",
    fieldCombinations: ["heroTitle", "heroDescription"],
  },
  {
    type: "composite",
    name: "heroCta",
    fieldCombinations: ["heroTitle", "heroDescription", "heroCta.text", "heroCta.link"],
  },
  {
    type: "composite",
    name: "listComponent",
    fieldCombinations: ["title", "list.0.name", "list.1.name", "list.2.name"],
  },
  {
    type: "composite",
    name: "splitHero",
    fieldCombinations: [
      "title",
      "splitHeroWithBgColorActions.0.text",
      "splitHeroWithBgColorActions.0.link",
    ],
  },
];

describe("extractComponentName", () => {
  test("extracts componentName from section if present", () => {
    const section = { componentName: "hero", heroTitle: "Title" };
    const errors = [];
    expect(extractComponentName(section, errors)).toBe("hero");
  });

  test("extracts from error details suggestedComponents if no componentName in section", () => {
    const section = { heroTitle: "Title" };
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          suggestedComponents: ["hero", "heroCta"],
        },
      },
    ];
    expect(extractComponentName(section, errors)).toBe("hero");
  });

  test("returns null if no componentName and no UNKNOWN_FIELD_COMBINATION error", () => {
    const section = { heroTitle: "Title" };
    const errors = [{ code: "OTHER_ERROR" }];
    expect(extractComponentName(section, errors)).toBeNull();
  });

  test("returns null if no componentName and empty suggestedComponents", () => {
    const section = { heroTitle: "Title" };
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          suggestedComponents: [],
        },
      },
    ];
    expect(extractComponentName(section, errors)).toBeNull();
  });

  test("returns null if no componentName and no details", () => {
    const section = { heroTitle: "Title" };
    const errors = [{ code: "UNKNOWN_FIELD_COMBINATION" }];
    expect(extractComponentName(section, errors)).toBeNull();
  });
});

describe("canAutoFixErrors", () => {
  test("returns true if only UNKNOWN_FIELD_COMBINATION errors with extra fields", () => {
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: ["field1", "field2"],
          missingFields: [],
        },
      },
    ];
    expect(canAutoFixErrors(errors)).toBe(true);
  });

  test("returns true if only UNKNOWN_FIELD_COMBINATION errors with missing fields", () => {
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: [],
          missingFields: ["requiredField"],
        },
      },
    ];
    expect(canAutoFixErrors(errors)).toBe(true);
  });

  test("returns false if UNKNOWN_FIELD_COMBINATION has both extra and missing fields", () => {
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: ["field1"],
          missingFields: ["requiredField"],
        },
      },
    ];
    expect(canAutoFixErrors(errors)).toBe(false);
  });

  test("returns false if UNKNOWN_FIELD_COMBINATION has no extra fields", () => {
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: [],
          missingFields: [],
        },
      },
    ];
    expect(canAutoFixErrors(errors)).toBe(false);
  });

  test("returns false if there are INVALID_INTERNAL_LINK errors", () => {
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: ["field1"],
          missingFields: [],
        },
      },
      {
        code: "INVALID_INTERNAL_LINK",
        details: {
          invalidLink: "/bad-link",
        },
      },
    ];
    expect(canAutoFixErrors(errors)).toBe(false);
  });

  test("returns false if there are INVALID_MEDIA_RESOURCE errors", () => {
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: ["field1"],
          missingFields: [],
        },
      },
      {
        code: "INVALID_MEDIA_RESOURCE",
        details: {
          invalidMedia: "bad.jpg",
        },
      },
    ];
    expect(canAutoFixErrors(errors)).toBe(false);
  });

  test("returns true with multiple UNKNOWN_FIELD_COMBINATION errors with only extra fields", () => {
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: ["field1"],
          missingFields: [],
        },
      },
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: ["field2"],
          missingFields: [],
        },
      },
    ];
    expect(canAutoFixErrors(errors)).toBe(true);
  });

  test("returns false for empty errors array", () => {
    expect(canAutoFixErrors([])).toBe(false);
  });
});

describe("getRequiredFieldsByComponentName", () => {
  test("returns field combinations for valid component", () => {
    const result = getRequiredFieldsByComponentName(sampleComponentLibrary, "hero");
    expect(result).toEqual(["heroTitle", "heroDescription"]);
  });

  test("returns null if componentName is null", () => {
    expect(getRequiredFieldsByComponentName(sampleComponentLibrary, null)).toBeNull();
  });

  test("returns null if no matching component", () => {
    expect(getRequiredFieldsByComponentName(sampleComponentLibrary, "nonexistent")).toBeNull();
  });

  test("returns field combinations for nested fields", () => {
    const result = getRequiredFieldsByComponentName(sampleComponentLibrary, "heroCta");
    expect(result).toEqual(["heroTitle", "heroDescription", "heroCta.text", "heroCta.link"]);
  });
});

describe("tryAutoFixSection - simple object fields", () => {
  test("removes simple extra field from section", () => {
    const section = {
      componentName: "hero",
      heroTitle: "Title",
      heroDescription: "Description",
      extraField: "Extra",
    };
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: ["extraField"],
          missingFields: [],
        },
      },
    ];

    const result = tryAutoFixSection(section, errors, "sections.0", sampleComponentLibrary);

    expect(result).not.toBeNull();
    expect(result.fixed).toBe(true);
    expect(result.section.extraField).toBeUndefined();
    expect(result.section.heroTitle).toBe("Title");
    expect(result.section.heroDescription).toBe("Description");
  });

  test("removes multiple simple extra fields", () => {
    const section = {
      componentName: "hero",
      heroTitle: "Title",
      heroDescription: "Description",
      extraField1: "Extra1",
      extraField2: "Extra2",
    };
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: ["extraField1", "extraField2"],
          missingFields: [],
        },
      },
    ];

    const result = tryAutoFixSection(section, errors, "sections.0", sampleComponentLibrary);

    expect(result).not.toBeNull();
    expect(result.fixed).toBe(true);
    expect(result.section.extraField1).toBeUndefined();
    expect(result.section.extraField2).toBeUndefined();
    expect(result.section.heroTitle).toBe("Title");
    expect(result.section.heroDescription).toBe("Description");
  });

  test("adds missing fields with empty values", () => {
    const section = {
      componentName: "hero",
    };
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: [],
          missingFields: ["heroTitle", "heroDescription"],
        },
      },
    ];

    const result = tryAutoFixSection(section, errors, "sections.0", sampleComponentLibrary);

    expect(result).not.toBeNull();
    expect(result.fixed).toBe(true);
    expect(result.section.heroTitle).toBe("");
    expect(result.section.heroDescription).toBe("");
    expect(result.section.componentName).toBe("hero");
    expect(result.action).toContain("Added missing fields");
  });

  test("returns null when has both extra and missing fields (needs AI)", () => {
    const section = {
      componentName: "hero",
      extraField: "Extra",
    };
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: ["extraField"],
          missingFields: ["heroTitle", "heroDescription"],
        },
      },
    ];

    const result = tryAutoFixSection(section, errors, "sections.0", sampleComponentLibrary);

    // Cannot auto-fix when both extra and missing fields exist
    // This likely means the component is completely wrong and needs AI to fix
    expect(result).toBeNull();
  });
});

describe("tryAutoFixSection - nested object fields", () => {
  test("removes nested field from object", () => {
    const section = {
      componentName: "heroCta",
      heroTitle: "Title",
      heroDescription: "Description",
      heroCta: {
        text: "Click",
        link: "/link",
        extraNested: "Remove this",
      },
    };
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: ["heroCta.extraNested"],
          missingFields: [],
        },
      },
    ];

    const result = tryAutoFixSection(section, errors, "sections.0", sampleComponentLibrary);

    expect(result).not.toBeNull();
    expect(result.fixed).toBe(true);
    expect(result.section.heroCta.extraNested).toBeUndefined();
    expect(result.section.heroCta.text).toBe("Click");
    expect(result.section.heroCta.link).toBe("/link");
  });

  test("removes multiple nested fields", () => {
    const section = {
      componentName: "heroCta",
      heroTitle: "Title",
      heroDescription: "Description",
      heroCta: {
        text: "Click",
        link: "/link",
        extra1: "Remove",
        extra2: "Remove",
      },
    };
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: ["heroCta.extra1", "heroCta.extra2"],
          missingFields: [],
        },
      },
    ];

    const result = tryAutoFixSection(section, errors, "sections.0", sampleComponentLibrary);

    expect(result).not.toBeNull();
    expect(result.fixed).toBe(true);
    expect(result.section.heroCta.extra1).toBeUndefined();
    expect(result.section.heroCta.extra2).toBeUndefined();
    expect(result.section.heroCta.text).toBe("Click");
  });
});

describe("tryAutoFixSection - array fields", () => {
  test("removes whole extra field that happens to be an array", () => {
    const section = {
      componentName: "hero",
      heroTitle: "Title",
      heroDescription: "Description",
      extraField: "value",
    };
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: ["extraField"],
          missingFields: [],
        },
      },
    ];

    const result = tryAutoFixSection(section, errors, "sections.0", sampleComponentLibrary);

    expect(result).not.toBeNull();
    expect(result.fixed).toBe(true);
    expect(result.section.extraField).toBeUndefined();
    expect(result.section.heroTitle).toBe("Title");
    expect(result.section.heroDescription).toBe("Description");
  });
});

describe("tryAutoFixSection - complex nested array fields", () => {
  test("removes nested property from array item object", () => {
    const section = {
      componentName: "splitHero",
      title: "Split Hero",
      splitHeroWithBgColorActions: [
        {
          text: "Action 1",
          link: "/link1",
          link2: "Remove this extra link",
        },
      ],
    };
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: ["splitHeroWithBgColorActions.0.link2"],
          missingFields: [],
        },
      },
    ];

    const result = tryAutoFixSection(section, errors, "sections.0", sampleComponentLibrary);

    expect(result).not.toBeNull();
    expect(result.fixed).toBe(true);
    expect(result.section.splitHeroWithBgColorActions[0].text).toBe("Action 1");
    expect(result.section.splitHeroWithBgColorActions[0].link).toBe("/link1");
    expect(result.section.splitHeroWithBgColorActions[0].link2).toBeUndefined();
  });

  test("removes nested property from single array item", () => {
    const section = {
      componentName: "splitHero",
      title: "Split Hero",
      splitHeroWithBgColorActions: [
        {
          text: "Action 1",
          link: "/link1",
          extraField1: "Remove",
        },
      ],
    };
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: ["splitHeroWithBgColorActions.0.extraField1"],
          missingFields: [],
        },
      },
    ];

    const result = tryAutoFixSection(section, errors, "sections.0", sampleComponentLibrary);

    expect(result).not.toBeNull();
    expect(result.fixed).toBe(true);
    expect(result.section.splitHeroWithBgColorActions[0].text).toBe("Action 1");
    expect(result.section.splitHeroWithBgColorActions[0].link).toBe("/link1");
    expect(result.section.splitHeroWithBgColorActions[0].extraField1).toBeUndefined();
  });

  test("handles mix of whole item removal and property removal", () => {
    const section = {
      componentName: "splitHero",
      title: "Split Hero",
      splitHeroWithBgColorActions: [
        {
          text: "Action 1",
          link: "/link1",
          extraProp: "Remove this property",
        },
        {
          text: "Action 2 - Remove entire item",
          link: "/link2",
        },
      ],
    };
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: ["splitHeroWithBgColorActions.0.extraProp", "splitHeroWithBgColorActions.1"],
          missingFields: [],
        },
      },
    ];

    const result = tryAutoFixSection(section, errors, "sections.0", sampleComponentLibrary);

    expect(result).not.toBeNull();
    expect(result.fixed).toBe(true);
    expect(result.section.splitHeroWithBgColorActions).toHaveLength(1);
    expect(result.section.splitHeroWithBgColorActions[0].text).toBe("Action 1");
    expect(result.section.splitHeroWithBgColorActions[0].link).toBe("/link1");
    expect(result.section.splitHeroWithBgColorActions[0].extraProp).toBeUndefined();
  });
});

describe("tryAutoFixSection - missing fields", () => {
  test("adds simple missing fields", () => {
    const section = {
      componentName: "hero",
      heroTitle: "Title",
    };
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: [],
          missingFields: ["heroDescription"],
        },
      },
    ];

    const result = tryAutoFixSection(section, errors, "sections.0", sampleComponentLibrary);

    expect(result).not.toBeNull();
    expect(result.fixed).toBe(true);
    expect(result.section.heroTitle).toBe("Title");
    expect(result.section.heroDescription).toBe("");
  });

  test("adds nested missing fields", () => {
    const section = {
      componentName: "heroCta",
      heroTitle: "Title",
      heroDescription: "Description",
    };
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: [],
          missingFields: ["heroCta.text", "heroCta.link"],
        },
      },
    ];

    const result = tryAutoFixSection(section, errors, "sections.0", sampleComponentLibrary);

    expect(result).not.toBeNull();
    expect(result.fixed).toBe(true);
    expect(result.section.heroCta).toBeDefined();
    expect(result.section.heroCta.text).toBe("");
    expect(result.section.heroCta.link).toBe("");
  });

  test("adds missing fields with both simple and nested paths", () => {
    const section = {
      componentName: "heroCta",
      heroTitle: "Title",
    };
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: [],
          missingFields: ["heroDescription", "heroCta.text", "heroCta.link"],
        },
      },
    ];

    const result = tryAutoFixSection(section, errors, "sections.0", sampleComponentLibrary);

    expect(result).not.toBeNull();
    expect(result.fixed).toBe(true);
    expect(result.section.heroTitle).toBe("Title");
    expect(result.section.heroDescription).toBe("");
    expect(result.section.heroCta).toBeDefined();
    expect(result.section.heroCta.text).toBe("");
    expect(result.section.heroCta.link).toBe("");
  });
});

describe("tryAutoFixSection - edge cases", () => {
  test("returns null for non-auto-fixable errors", () => {
    const section = {
      componentName: "hero",
      heroTitle: "Title",
    };
    const errors = [
      {
        code: "INVALID_INTERNAL_LINK",
        details: {
          invalidLink: "/bad-link",
        },
      },
    ];

    const result = tryAutoFixSection(section, errors, "sections.0", sampleComponentLibrary);

    expect(result).toBeNull();
  });

  test("returns null if validation fails after removal", () => {
    const section = {
      componentName: "hero",
      heroTitle: "Title",
      heroDescription: "Description",
      invalidField: "Invalid",
    };
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: ["heroDescription"], // Removing this will make it invalid
          missingFields: [],
        },
      },
    ];

    const result = tryAutoFixSection(section, errors, "sections.0", sampleComponentLibrary);

    // After removing heroDescription, the section will be invalid because
    // hero component requires both heroTitle and heroDescription
    expect(result).toBeNull();
  });

  test("returns null for empty extraFields array", () => {
    const section = {
      componentName: "hero",
      heroTitle: "Title",
    };
    const errors = [
      {
        code: "UNKNOWN_FIELD_COMBINATION",
        details: {
          extraFields: [],
          missingFields: [],
        },
      },
    ];

    const result = tryAutoFixSection(section, errors, "sections.0", sampleComponentLibrary);

    expect(result).toBeNull();
  });
});

describe("extractSectionPath", () => {
  test("extracts section path from error path", () => {
    expect(extractSectionPath("sections.0.heroTitle")).toBe("sections.0");
    expect(extractSectionPath("sections.1.heroCta.text")).toBe("sections.1");
    expect(extractSectionPath("sections.10.list.0.name")).toBe("sections.10");
  });

  test("returns section path for simple section error", () => {
    expect(extractSectionPath("sections.0")).toBe("sections.0");
  });

  test("returns null for special paths without error and parsedData", () => {
    expect(extractSectionPath("internal_links")).toBeNull();
    expect(extractSectionPath("media_resources")).toBeNull();
  });

  test("finds section path for internal_links error", () => {
    const parsedData = {
      sections: [
        { heroTitle: "Hero", link: "link://about" },
        { title: "Section 2", cta: { href: "link://contact" } },
      ],
    };
    const error = {
      path: "internal_links",
      code: "INVALID_INTERNAL_LINK",
      details: { invalidLink: "link://contact" },
    };

    expect(extractSectionPath("internal_links", error, parsedData)).toBe("sections.1");
  });

  test("finds section path for media_resources error", () => {
    const parsedData = {
      sections: [
        { heroTitle: "Hero", image: "mediakit://hero.jpg" },
        { title: "Section 2", background: "mediakit://bg.png" },
      ],
    };
    const error = {
      path: "media_resources",
      code: "INVALID_MEDIA_RESOURCE",
      details: { invalidMedia: "mediakit://bg.png" },
    };

    expect(extractSectionPath("media_resources", error, parsedData)).toBe("sections.1");
  });

  test("returns null if resource not found in any section", () => {
    const parsedData = {
      sections: [{ heroTitle: "Hero" }, { title: "Section 2" }],
    };
    const error = {
      path: "internal_links",
      code: "INVALID_INTERNAL_LINK",
      details: { invalidLink: "link://notfound" },
    };

    expect(extractSectionPath("internal_links", error, parsedData)).toBeNull();
  });

  test("returns null for non-section paths", () => {
    expect(extractSectionPath("title")).toBeNull();
    expect(extractSectionPath("description")).toBeNull();
    expect(extractSectionPath("")).toBeNull();
  });

  test("returns null for invalid inputs", () => {
    expect(extractSectionPath(null)).toBeNull();
    expect(extractSectionPath(undefined)).toBeNull();
    expect(extractSectionPath(123)).toBeNull();
  });
});

describe("groupErrorsBySection", () => {
  test("groups errors by section path", () => {
    const errors = [
      { path: "sections.0.heroTitle", message: "Error 1", code: "ERROR_1" },
      { path: "sections.0.heroDescription", message: "Error 2", code: "ERROR_2" },
      { path: "sections.1.title", message: "Error 3", code: "ERROR_3" },
    ];

    const { grouped, globalErrors } = groupErrorsBySection(errors, {});

    expect(grouped.size).toBe(2);
    expect(grouped.get("sections.0")).toHaveLength(2);
    expect(grouped.get("sections.1")).toHaveLength(1);
    expect(globalErrors).toHaveLength(0);
  });

  test("separates global errors from section errors", () => {
    const errors = [
      { path: "sections.0.heroTitle", message: "Section error", code: "ERROR_1" },
      { path: "internal_links", message: "Global error 1", code: "ERROR_2" },
      { path: "media_resources", message: "Global error 2", code: "ERROR_3" },
      { path: "title", message: "Global error 3", code: "ERROR_4" },
    ];

    const { grouped, globalErrors } = groupErrorsBySection(errors, {});

    expect(grouped.size).toBe(1);
    expect(grouped.get("sections.0")).toHaveLength(1);
    expect(globalErrors).toHaveLength(3);
  });

  test("groups internal_links errors to correct section", () => {
    const parsedData = {
      sections: [
        { heroTitle: "Hero", link: "link://about" },
        { title: "Section 2", cta: { href: "link://invalid" } },
      ],
    };
    const errors = [
      { path: "sections.0.heroTitle", message: "Error 1", code: "ERROR_1" },
      {
        path: "internal_links",
        message: "Invalid link",
        code: "INVALID_INTERNAL_LINK",
        details: { invalidLink: "link://invalid" },
      },
    ];

    const { grouped, globalErrors } = groupErrorsBySection(errors, parsedData);

    expect(grouped.size).toBe(2);
    expect(grouped.get("sections.0")).toHaveLength(1);
    expect(grouped.get("sections.1")).toHaveLength(1);
    expect(grouped.get("sections.1")[0].code).toBe("INVALID_INTERNAL_LINK");
    expect(globalErrors).toHaveLength(0);
  });

  test("groups media_resources errors to correct section", () => {
    const parsedData = {
      sections: [
        { heroTitle: "Hero", image: "mediakit://hero.jpg" },
        { title: "Section 2", background: "mediakit://invalid.png" },
      ],
    };
    const errors = [
      {
        path: "media_resources",
        message: "Invalid media",
        code: "INVALID_MEDIA_RESOURCE",
        details: { invalidMedia: "mediakit://invalid.png" },
      },
    ];

    const { grouped, globalErrors } = groupErrorsBySection(errors, parsedData);

    expect(grouped.size).toBe(1);
    expect(grouped.get("sections.1")).toHaveLength(1);
    expect(grouped.get("sections.1")[0].code).toBe("INVALID_MEDIA_RESOURCE");
    expect(globalErrors).toHaveLength(0);
  });

  test("handles empty errors array", () => {
    const { grouped, globalErrors } = groupErrorsBySection([], {});

    expect(grouped.size).toBe(0);
    expect(globalErrors).toHaveLength(0);
  });

  test("groups multiple errors for same section", () => {
    const errors = [
      { path: "sections.2.field1", message: "Error 1", code: "ERROR_1" },
      { path: "sections.2.field2", message: "Error 2", code: "ERROR_2" },
      { path: "sections.2.field3", message: "Error 3", code: "ERROR_3" },
    ];

    const { grouped, globalErrors } = groupErrorsBySection(errors, {});

    expect(grouped.size).toBe(1);
    expect(grouped.get("sections.2")).toHaveLength(3);
    expect(globalErrors).toHaveLength(0);
  });
});

describe("getSectionByPath", () => {
  const parsedData = {
    title: "Page Title",
    sections: [
      { componentName: "hero", heroTitle: "Hero 1" },
      { componentName: "heroCta", heroTitle: "Hero 2", heroCta: { text: "Click", link: "/link" } },
    ],
  };

  test("gets section by path", () => {
    const section = getSectionByPath(parsedData, "sections.0");
    expect(section).toEqual({ componentName: "hero", heroTitle: "Hero 1" });
  });

  test("gets second section by path", () => {
    const section = getSectionByPath(parsedData, "sections.1");
    expect(section).toEqual({
      componentName: "heroCta",
      heroTitle: "Hero 2",
      heroCta: { text: "Click", link: "/link" },
    });
  });

  test("gets nested property by path", () => {
    const cta = getSectionByPath(parsedData, "sections.1.heroCta");
    expect(cta).toEqual({ text: "Click", link: "/link" });
  });

  test("returns null or undefined for invalid path", () => {
    expect(getSectionByPath(parsedData, "sections.10")).toBeUndefined();
    expect(getSectionByPath(parsedData, "sections.0.nonexistent")).toBeUndefined();
  });

  test("returns null for null inputs", () => {
    expect(getSectionByPath(null, "sections.0")).toBeNull();
    expect(getSectionByPath(parsedData, null)).toBeNull();
    expect(getSectionByPath(null, null)).toBeNull();
  });
});

describe("replaceSectionByPath", () => {
  test("replaces section at specified path", () => {
    const parsedData = {
      sections: [
        { componentName: "hero", heroTitle: "Old Title" },
        { componentName: "heroCta", heroTitle: "Second" },
      ],
    };

    const newSectionYaml = "componentName: hero\nheroTitle: New Title\nheroDescription: New Description";

    const result = replaceSectionByPath(parsedData, "sections.0", newSectionYaml);

    expect(result.sections[0].heroTitle).toBe("New Title");
    expect(result.sections[0].heroDescription).toBe("New Description");
    expect(result.sections[1].heroTitle).toBe("Second");
  });

  test("replaces second section", () => {
    const parsedData = {
      sections: [
        { componentName: "hero", heroTitle: "First" },
        { componentName: "heroCta", heroTitle: "Old" },
      ],
    };

    const newSectionYaml = "componentName: hero\nheroTitle: Replaced";

    const result = replaceSectionByPath(parsedData, "sections.1", newSectionYaml);

    expect(result.sections[0].heroTitle).toBe("First");
    expect(result.sections[1].heroTitle).toBe("Replaced");
    expect(result.sections[1].componentName).toBe("hero");
  });

  test("returns original data if path is null", () => {
    const parsedData = { sections: [{ title: "Test" }] };
    const result = replaceSectionByPath(parsedData, null, "title: New");
    expect(result).toEqual(parsedData);
  });

  test("returns original data if newSectionYaml is null", () => {
    const parsedData = { sections: [{ title: "Test" }] };
    const result = replaceSectionByPath(parsedData, "sections.0", null);
    expect(result).toEqual(parsedData);
  });

  test("returns original data if parsedData is null", () => {
    const result = replaceSectionByPath(null, "sections.0", "title: New");
    expect(result).toBeNull();
  });
});

describe("sectionToYaml", () => {
  test("converts simple section to YAML", () => {
    const section = {
      componentName: "hero",
      heroTitle: "Title",
      heroDescription: "Description",
    };

    const yaml = sectionToYaml(section);

    expect(yaml).toContain("componentName: hero");
    expect(yaml).toContain("heroTitle: Title");
    expect(yaml).toContain("heroDescription: Description");
  });

  test("converts section with nested object to YAML", () => {
    const section = {
      componentName: "heroCta",
      heroTitle: "Title",
      heroCta: {
        text: "Click me",
        link: "/page",
      },
    };

    const yaml = sectionToYaml(section);

    expect(yaml).toContain("componentName: heroCta");
    expect(yaml).toContain("heroCta:");
    expect(yaml).toContain("text: Click me");
    expect(yaml).toContain("link: /page");
  });

  test("converts section with array to YAML", () => {
    const section = {
      componentName: "list",
      list: [{ name: "Item 1" }, { name: "Item 2" }],
    };

    const yaml = sectionToYaml(section);

    expect(yaml).toContain("list:");
    expect(yaml).toContain("- name: Item 1");
    expect(yaml).toContain("- name: Item 2");
  });

  test("returns empty string for null section", () => {
    expect(sectionToYaml(null)).toBe("");
    expect(sectionToYaml(undefined)).toBe("");
  });
});

describe("validateFixedSection", () => {
  test("validates valid section YAML", () => {
    const sectionYaml = `componentName: hero
heroTitle: Title
heroDescription: Description`;

    const result = validateFixedSection(sectionYaml, "sections.0", sampleComponentLibrary);

    expect(result.isValid).toBe(true);
  });

  test("returns invalid for section with errors", () => {
    const sectionYaml = `componentName: hero
heroTitle: Title
extraField: Extra`;

    const result = validateFixedSection(sectionYaml, "sections.0", sampleComponentLibrary);

    expect(result.isValid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test("returns invalid for malformed YAML", () => {
    const sectionYaml = "this is: not: valid: yaml: at: all";

    const result = validateFixedSection(sectionYaml, "sections.0", sampleComponentLibrary);

    expect(result.isValid).toBe(false);
    expect(result.validationFeedback).toContain("Failed to parse section YAML");
    expect(result.errors).toBeDefined();
    expect(result.errors[0].code).toBe("YAML_PARSE_ERROR");
  });

  test("validates section with nested fields", () => {
    const sectionYaml = `componentName: heroCta
heroTitle: Title
heroDescription: Description
heroCta:
  text: Click
  link: /link`;

    const result = validateFixedSection(sectionYaml, "sections.0", sampleComponentLibrary);

    expect(result.isValid).toBe(true);
  });
});
