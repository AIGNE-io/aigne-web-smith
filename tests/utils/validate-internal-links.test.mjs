import { describe, expect, it } from "bun:test";
import { LINK_PROTOCOL } from "../../utils/constants.mjs";
import { scanForProtocolUrls, validateInternalLinks } from "../../utils/protocol-utils.mjs";

describe("scanForProtocolUrls", () => {
  it("should find protocol URLs in strings", () => {
    const foundUrls = new Set();
    scanForProtocolUrls("link://page1", foundUrls, LINK_PROTOCOL);
    expect(foundUrls.has("link://page1")).toBe(true);
  });

  it("should find protocol URLs in arrays", () => {
    const foundUrls = new Set();
    const data = ["link://page1", "https://example.com", "link://page2"];
    scanForProtocolUrls(data, foundUrls, LINK_PROTOCOL);
    expect(foundUrls.size).toBe(2);
    expect(foundUrls.has("link://page1")).toBe(true);
    expect(foundUrls.has("link://page2")).toBe(true);
  });

  it("should find protocol URLs in nested objects", () => {
    const foundUrls = new Set();
    const data = {
      title: "Test",
      button: {
        href: "link://about",
        text: "Learn More",
      },
      sections: [
        {
          link: "link://contact",
        },
      ],
    };
    scanForProtocolUrls(data, foundUrls, LINK_PROTOCOL);
    expect(foundUrls.size).toBe(2);
    expect(foundUrls.has("link://about")).toBe(true);
    expect(foundUrls.has("link://contact")).toBe(true);
  });

  it("should not find URLs with different protocols", () => {
    const foundUrls = new Set();
    const data = {
      link1: "https://example.com",
      link2: "mediakit://image.png",
      link3: "link://valid",
    };
    scanForProtocolUrls(data, foundUrls, LINK_PROTOCOL);
    expect(foundUrls.size).toBe(1);
    expect(foundUrls.has("link://valid")).toBe(true);
  });
});

describe("validateInternalLinks", () => {
  it("should pass when all links are in allowed list", () => {
    const pageData = {
      sections: [
        {
          button: {
            href: "link://about",
          },
        },
      ],
    };
    const allowedLinks = new Set(["link://about", "link://contact"]);
    const errors = validateInternalLinks(pageData, allowedLinks, LINK_PROTOCOL);
    expect(errors.length).toBe(0);
  });

  it("should return errors for invalid links", () => {
    const pageData = {
      sections: [
        {
          button: {
            href: "link://invalid-page",
          },
        },
      ],
    };
    const allowedLinks = new Set(["link://about", "link://contact"]);
    const errors = validateInternalLinks(pageData, allowedLinks, LINK_PROTOCOL);
    expect(errors.length).toBe(1);
    expect(errors[0].code).toBe("INVALID_INTERNAL_LINK");
    expect(errors[0].message).toContain("link://invalid-page");
  });

  it("should return multiple errors for multiple invalid links", () => {
    const pageData = {
      sections: [
        {
          button1: {
            href: "link://invalid1",
          },
          button2: {
            href: "link://invalid2",
          },
        },
      ],
    };
    const allowedLinks = new Set(["link://about"]);
    const errors = validateInternalLinks(pageData, allowedLinks, LINK_PROTOCOL);
    expect(errors.length).toBe(2);
  });

  it("should handle empty page data", () => {
    const pageData = {};
    const allowedLinks = new Set(["link://about"]);
    const errors = validateInternalLinks(pageData, allowedLinks, LINK_PROTOCOL);
    expect(errors.length).toBe(0);
  });
});
