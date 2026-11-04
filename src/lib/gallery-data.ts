export type GalleryCategory = "Library Interior" | "Study Spaces" | "Seating & Facilities" | "Student Environment";

export interface GalleryImage {
  src: string;
  alt: string;
  category: GalleryCategory;
  width: number;
  height: number;
}

// These are the real Study House Library photographs retained in the project assets.
export const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: "/gallery-library-hero.png",
    alt: "Study House Library interior with individual study desks",
    category: "Library Interior",
    width: 1417,
    height: 946,
  },
  {
    src: "/gallery-study-hall-windows.png",
    alt: "Bright study hall with desk partitions and window seating",
    category: "Study Spaces",
    width: 1417,
    height: 946,
  },
  {
    src: "/gallery-study-desk-grey.png",
    alt: "Quiet individual study desks at Study House Library",
    category: "Study Spaces",
    width: 630,
    height: 945,
  },
  {
    src: "/gallery-study-desk-tan.png",
    alt: "Comfortable executive seating in the air-conditioned study hall",
    category: "Seating & Facilities",
    width: 1417,
    height: 946,
  },
  {
    src: "/gallery-study-hall-partitions.png",
    alt: "Organised study partitions and reading desks",
    category: "Library Interior",
    width: 1417,
    height: 946,
  },
  {
    src: "/shl.png",
    alt: "Students focused in the Study House Library reading hall",
    category: "Student Environment",
    width: 1417,
    height: 946,
  },
  {
    src: "/shl2.png",
    alt: "Library study area with individual partitions",
    category: "Student Environment",
    width: 1417,
    height: 946,
  },
];

export const GALLERY_FILTERS = ["All Photos", ...new Set(GALLERY_IMAGES.map((image) => image.category))] as const;
