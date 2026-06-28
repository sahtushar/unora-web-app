import {describe, expect, it} from "vitest";

import {userPhotosToProfilePayload} from "../src/modules/userPhotos/userPhoto.service.js";
import {toDiscoverProfileBasics} from "../src/modules/userProfile/userProfile.service.js";

describe("userPhotosToProfilePayload", () => {
  it("returns photos: [] for an empty list", () => {
    expect(userPhotosToProfilePayload([])).toEqual({photos: []});
  });

  it("defaults alt to empty string and omits blurDataUrl when absent", () => {
    expect(
      userPhotosToProfilePayload([
        {id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", url: "https://example.com/x.jpg"},
      ]),
    ).toEqual({
      photos: [
        {alt: "", id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", url: "https://example.com/x.jpg"},
      ],
    });
  });

  it("preserves alt and blurDataUrl when set", () => {
    expect(
      userPhotosToProfilePayload([
        {
          alt: "Me",
          blurDataUrl: "data:image/png;base64,xxx",
          id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
          url: "https://example.com/y.png",
        },
      ]),
    ).toEqual({
      photos: [
        {
          alt: "Me",
          blurDataUrl: "data:image/png;base64,xxx",
          id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
          url: "https://example.com/y.png",
        },
      ],
    });
  });
});

describe("toDiscoverProfileBasics", () => {
  const base = {
    companyName: "Acme",
    companyNamePublic: true,
    degree: "bachelors" as const,
    degreePublic: true,
    height: 170,
    heightPublic: true,
    hometown: "Indore",
    hometownPublic: true,
    jobTitle: "Engineer",
    jobTitlePublic: true,
    location: "Pune",
    locationPublic: true,
    schoolName: "MIT",
    schoolNamePublic: true,
    userLocation: {
      area: "A",
      city: "Pune",
      country: "IN",
      label: "Pune",
      latitude: 18,
      longitude: 73,
    } as const,
  };

  it("passes through values when all *Public are true", () => {
    expect(toDiscoverProfileBasics(base)).toEqual({
      companyName: "Acme",
      degree: "bachelors",
      height: 170,
      hometown: "Indore",
      jobTitle: "Engineer",
      location: "Pune",
      schoolName: "MIT",
      userLocation: base.userLocation,
    });
  });

  it("nulls fields when corresponding *Public is false", () => {
    expect(
      toDiscoverProfileBasics({
        ...base,
        jobTitlePublic: false,
        locationPublic: false,
      }),
    ).toEqual({
      companyName: "Acme",
      degree: "bachelors",
      height: 170,
      hometown: "Indore",
      jobTitle: null,
      location: null,
      schoolName: "MIT",
      userLocation: null,
    });
  });
});
