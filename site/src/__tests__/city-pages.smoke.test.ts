/**
 * City Pages Smoke Test
 * Tests that previously missing city slugs render correctly with homepage components
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { getCityBySlug, cities } from "@/data/cities";
import LocationPage from "@/app/locaties/[location]/page";
import React from "react";

// Mock the dynamic imports for 3D components
vi.mock("next/dynamic", () => ({
  default: (
    _importFn: () => Promise<unknown>,
    options?: { loading?: boolean },
  ) => {
    const MockComponent = () =>
      React.createElement("div", {
        "data-testid": options?.loading ? "loading" : "dynamic-component",
      });
    MockComponent.displayName = "MockDynamicImport";
    return MockComponent;
  },
}));

// Mock the other components
vi.mock("@/components/Breadcrumbs", () => ({
  default: () => React.createElement("div", { "data-testid": "breadcrumbs" }),
}));

vi.mock("@/components/RelatedServices", () => ({
  default: () =>
    React.createElement("div", { "data-testid": "related-services" }),
}));

vi.mock("@/components/ContentSuggestions", () => ({
  default: () =>
    React.createElement("div", { "data-testid": "content-suggestions" }),
}));

vi.mock("@/config/internal-linking.config", () => ({
  services: [
    {
      title: "Website Laten Maken",
      href: "/diensten/website-laten-maken",
      description: "Professional website development",
      targetLocation: ["haarlem", "maastricht"],
    },
  ],
}));

describe("City Pages Smoke Test", () => {
  // Test two previously missing cities to verify restoration
  const testCities = ["haarlem", "maastricht"];

  testCities.forEach((citySlug) => {
    describe(`City: ${citySlug}`, () => {
      it("should render successfully with city data", () => {
        const city = getCityBySlug(citySlug);
        expect(city).toBeDefined();
        expect(city?.name).toBeTruthy();
        expect(city?.slug).toBe(citySlug);
      });

      it("should render with homepage hero section classes", () => {
        const city = getCityBySlug(citySlug);
        if (!city) throw new Error(`City ${citySlug} not found`);

        const { container } = render(
          React.createElement(LocationPage, { params: { location: citySlug } }),
        );

        // Check for homepage hero section classes
        const heroSection = container.querySelector(".homepage-hero");
        expect(heroSection).toBeTruthy();
        expect(heroSection).toHaveClass(
          "relative",
          "min-h-[92vh]",
          "grid",
          "place-items-center",
          "overflow-hidden",
        );

        // Check for homepage-style layout classes
        const mainElement = container.querySelector("main");
        expect(mainElement).toHaveClass(
          "relative",
          "content-safe-top",
          "overflow-hidden",
        );
      });

      it("should have homepage-style CTA buttons", () => {
        render(
          React.createElement(LocationPage, { params: { location: citySlug } }),
        );

        // Check for primary CTA (contact)
        const contactButton = screen.getByRole("link", {
          name: /start uw project/i,
        });
        expect(contactButton).toBeTruthy();
        expect(contactButton.getAttribute("href")).toBe("/contact");

        // Check for secondary CTA (portfolio)
        const portfolioButton = screen.getByRole("link", {
          name: /bekijk portfolio/i,
        });
        expect(portfolioButton).toBeTruthy();
        expect(portfolioButton.getAttribute("href")).toBe("/portfolio");
      });

      it("should have promotional banner content", () => {
        render(
          React.createElement(LocationPage, { params: { location: citySlug } }),
        );

        // Check for promotional content
        expect(screen.getByText("30% KORTING")).toBeTruthy();
      });
    });
  });

  it("should have all 23 cities available for static generation", () => {
    // Verify cities array has all expected cities
    expect(cities).toHaveLength(23);

    // Verify some key cities are present
    const cityNames = cities.map((city) => city.slug);

    // Original cities
    expect(cityNames).toContain("amsterdam");
    expect(cityNames).toContain("rotterdam");
    expect(cityNames).toContain("utrecht");

    // Previously missing cities
    expect(cityNames).toContain("haarlem");
    expect(cityNames).toContain("maastricht");
    expect(cityNames).toContain("venlo");
    expect(cityNames).toContain("zwolle");
    expect(cityNames).toContain("leiden");
  });
});
