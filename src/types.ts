// src/types.ts

export type PartStatus = "Approved" | "In review" | "Phase-out";

export type Part = {
  id: string;
  name: string;
  family: string;
  engine: string;
  material: string;
  standard: string | null;
  purchasingCategory: string;
  status: PartStatus;
  plant: string;
  supplier: string;
  priceEUR: number;
  /** Demo: frequently bought together / accessories */
  recommendedIds?: string[];
  imageUrl?: string;        // фото / рендер
  previewVideoUrl?: string; // специфичное видео для этой детали (например demo2.mp4)
  has3d?: boolean;          // есть ли 3D / видео превью
};

export type AdvState = {
  itemName: string;
  purchaser: string;
  businessArea: string;
  agreement: string;
  designGroup: string;
  drawing: string;
  vendorId: string;
  purchCat: string;
  sapGroup: string;
  material: string;
  docs: string[];
  excludeNon: boolean;
  productFamily: boolean;
  rfq: boolean;
  poExists: boolean;
  shouldCost: boolean;
};

export type News = {
  id: number;
  type: "Feature" | "Notification";
  date: string;
  title: string;
  body: string;
};

export type Chip = { id: string; title: string; sub: string; query: string };

export type ConceptTag = "SEE" | "UNDERSTAND" | "USE" | "ENGAGE";

export type ConceptDemo =
  | "highlight"
  | "tour"
  | "preset"
  | "video"
  | "palette"
  | "digest"
  | "compare"
  | "bulk"   // NEW: bulk upload & export
  | "howto" // NEW: how to test all features
  | "viewer3d"; // NEW: 3D / Photo viewer concept

export type Concept = {
  id: string;
  title: string;
  desc: string;
  tag: ConceptTag;
  demo: ConceptDemo;
};
