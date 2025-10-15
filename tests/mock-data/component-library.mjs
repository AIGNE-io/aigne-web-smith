export function buildSimpleComponentLibrary() {
  return [
    {
      type: "composite",
      id: "simple-hero-component",
      name: "SimpleHero",
      fieldCombinations: ["title", "subtitle", "optionalTagline"],
      section: {
        id: "simple-hero-template",
        name: "Simple Hero",
        component: "custom-component",
        config: {
          componentId: "hero-blocklet",
        },
      },
      dataSource: {
        "simple-hero-template": {
          properties: {
            headline: {
              value: "<%= title %>",
            },
            subheading: {
              value: "<%= subtitle %>",
            },
            tagline: {
              value: "<%= optionalTagline %>",
            },
          },
        },
      },
    },
  ];
}

export function buildListComponentLibrary() {
  return [
    {
      type: "composite",
      id: "list-layout-component",
      name: "ListLayout",
      fieldCombinations: ["list.0", "list.1", "title"],
      section: {
        id: "list-layout-template",
        name: "List Layout",
        component: "layout-block",
        sections: {
          "slot-0": {
            id: "slot-0",
            name: "{{ list.0 }}",
            component: "layout-block",
            config: {
              paddingX: "none",
              paddingY: "small",
            },
          },
          "slot-1": {
            id: "slot-1",
            name: "{{ list.1 }}",
            component: "layout-block",
            config: {
              paddingX: "none",
              paddingY: "small",
            },
          },
        },
        sectionIds: ["slot-0", "slot-1"],
        config: {
          gridSettings: {
            desktop: {
              "slot-0": {
                id: "slot-0",
                x: 0,
                y: 3,
                w: 12,
                h: 2,
              },
              "slot-1": {
                id: "slot-1",
                x: 0,
                y: 5,
                w: 12,
                h: 2,
              },
            },
          },
        },
      },
      dataSource: {
        "list-layout-template": {
          properties: {
            sectionTitle: {
              value: "<%= title %>",
            },
          },
        },
      },
    },
    {
      type: "composite",
      id: "list-item-component",
      name: "ListItem",
      fieldCombinations: ["itemTitle", "itemDescription"],
      section: {
        id: "list-item-template",
        name: "List Item",
        component: "custom-component",
        config: {
          componentId: "list-item-blocklet",
        },
      },
      dataSource: {
        "list-item-template": {
          properties: {
            headline: {
              value: "<%= itemTitle %>",
            },
            description: {
              value: "<%= itemDescription %>",
            },
          },
        },
      },
    },
  ];
}

export function buildPrunableComponentLibrary() {
  return [
    {
      type: "composite",
      id: "prunable-layout-component",
      name: "PrunableLayout",
      fieldCombinations: ["title", "optionalQuote"],
      section: {
        id: "prunable-layout-template",
        name: "Prunable Layout",
        component: "layout-block",
        sections: {
          "prunable-quote": {
            id: "prunable-quote",
            name: "Quote Block",
            component: "custom-component",
            config: {
              componentId: "quote-blocklet",
            },
          },
        },
        sectionIds: ["prunable-quote"],
        config: {
          gridSettings: {
            desktop: {
              "prunable-quote": {
                id: "prunable-quote",
                x: 0,
                y: 0,
                w: 12,
                h: 3,
              },
            },
          },
        },
      },
      dataSource: {
        "prunable-layout-template": {
          properties: {
            heading: {
              value: "<%= title %>",
            },
          },
        },
        "prunable-quote": {
          properties: {
            quote: {
              value: "<%= optionalQuote %>",
            },
          },
        },
      },
    },
  ];
}

export function buildArrayAndFileComponentLibrary() {
  return [
    {
      type: "composite",
      id: "array-file-component",
      name: "ArrayFile",
      fieldCombinations: ["title", "copyPath", "items", "items.0.label", "items.0.detail"],
      section: {
        id: "array-file-template",
        name: "Array File Component",
        component: "custom-component",
        config: {
          componentId: "array-file-blocklet",
        },
      },
      dataSource: {
        "array-file-template": {
          properties: {
            heading: {
              value: "<%= title %>",
            },
            copy: {
              value: "<%= copyPath %>",
            },
            bulletList: {
              value: [
                {
                  label: "<%= items.0.label %>",
                  detail: "<%= items.0.detail %>",
                },
              ],
            },
          },
        },
      },
    },
  ];
}

export function buildComplexLayoutComponentLibrary() {
  return [
    {
      type: "composite",
      id: "complex-layout-component",
      name: "ComplexLayout",
      fieldCombinations: ["title", "metaInfo.count", "missingFile", "list.0", "list.1", "list.2"],
      section: {
        id: "complex-layout-template",
        name: "Complex Layout",
        component: "layout-block",
        sections: {
          "complex-slot-0": {
            id: "complex-slot-0",
            name: "{{ list.0 }}",
            component: "layout-block",
            config: {
              paddingX: "medium",
              paddingY: "medium",
            },
          },
          "complex-slot-2": {
            id: "complex-slot-2",
            name: "<%= list.2 %>",
            component: "layout-block",
            config: {
              paddingX: "small",
              paddingY: "small",
            },
          },
          "complex-slot-3": {
            id: "complex-slot-3",
            name: "<%= list[3] %>",
            component: "layout-block",
            config: {
              paddingX: "none",
              paddingY: "none",
            },
          },
        },
        sectionIds: ["complex-slot-0", "complex-slot-2", "complex-slot-3"],
        config: {
          sectionIds: ["complex-slot-0", "complex-slot-2", "complex-slot-3"],
          gridSettings: {
            desktop: [
              "complex-slot-0",
              {
                id: "complex-slot-2",
                sectionIds: ["complex-slot-2", "complex-slot-3"],
              },
              {
                sectionIds: ["complex-slot-3"],
              },
            ],
            tablet: {
              "complex-slot-3": {
                id: "complex-slot-3",
                sectionIds: ["complex-slot-3"],
              },
              sections: {
                "complex-slot-3": {
                  nested: true,
                },
              },
              sectionIds: ["complex-slot-3"],
            },
            mobile: "complex-slot-3",
          },
        },
      },
      dataSource: {
        "complex-layout-template": {
          properties: {
            headline: {
              value: "<%= title %>",
            },
            metaSerialized: {
              value: "meta:<%= metaInfo %>",
            },
            missing: {
              value: "<%= missingFile %>",
            },
            staticList: {
              value: ["<%= title %>", "<%= missingFile %>"],
            },
          },
        },
        "ghost-id": {
          properties: {
            orphan: {
              value: "<%= orphanField %>",
            },
          },
        },
      },
    },
    {
      type: "composite",
      id: "complex-item-component",
      name: "ComplexItem",
      fieldCombinations: ["itemTitle", "itemDescription"],
      section: {
        id: "complex-item-template",
        name: "Complex Item",
        component: "custom-component",
        config: {
          componentId: "complex-item-blocklet",
        },
      },
      dataSource: {
        "complex-item-template": {
          properties: {
            headline: {
              value: "<%= itemTitle %>",
            },
            description: {
              value: "<%= itemDescription %>",
            },
          },
        },
      },
    },
  ];
}
