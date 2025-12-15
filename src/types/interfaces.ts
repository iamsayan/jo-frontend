// Base Strapi Types
export interface Document {
  documentId: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
export interface ResponseMeta {
  pagination?: Pagination;
}
export interface DocumentResponse<T extends Document = Document> {
  data: T;
  meta: ResponseMeta;
}
export interface DocumentResponseCollection<T extends Document = Document> {
  data: T[];
  meta: ResponseMeta;
}

// Image format keys - generated from upload plugin config
export type StrapiImageFormatKey = "thumbnail";

export interface StrapiImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

export interface StrapiBaseFile extends Document {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiFile extends StrapiBaseFile {
  width: null;
  height: null;
  formats: null;
}

export interface StrapiImage extends StrapiBaseFile {
  width: number;
  height: number;
  formats: Partial<Record<StrapiImageFormatKey, StrapiImageFormat>>;
  provider_metadata: unknown | null;
}

export interface StrapiUser extends Document {
  id: number;
  username: string | null;
  email: string | null;
  provider: string | null;
  confirmed: boolean | null;
  blocked: boolean | null;
  role: StrapiRole | null;
}

export interface StrapiRole extends Document {
  id: number;
  name: string | null;
  description: string | null;
  type: string | null;
}

export type StrapiMarkdownField = string;

// Rich Text Blocks Types
export interface StrapiRichTextBlocksText {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export interface StrapiRichTextBlocksLink {
  type: "link";
  url: string;
  children: StrapiRichTextBlocksNode[];
}

export interface StrapiRichTextBlocksImage {
  type: "image";
  image: StrapiImage;
  children: StrapiRichTextBlocksNode[];
}

export interface StrapiRichTextBlocksParagraph {
  type: "paragraph";
  children: StrapiRichTextBlocksNode[];
}

export interface StrapiRichTextBlocksHeading {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: StrapiRichTextBlocksNode[];
}

export interface StrapiRichTextBlocksList {
  type: "list";
  format: "ordered" | "unordered";
  children: StrapiRichTextBlocksListItem[];
}

export interface StrapiRichTextBlocksListItem {
  type: "list-item";
  children: StrapiRichTextBlocksNode[];
}

export interface StrapiRichTextBlocksQuote {
  type: "quote";
  children: StrapiRichTextBlocksNode[];
}

export interface StrapiRichTextBlocksCode {
  type: "code";
  language?: string;
  children: StrapiRichTextBlocksNode[];
}

export type StrapiRichTextBlocksNode =
  | StrapiRichTextBlocksText
  | StrapiRichTextBlocksLink
  | StrapiRichTextBlocksImage
  | StrapiRichTextBlocksParagraph
  | StrapiRichTextBlocksHeading
  | StrapiRichTextBlocksList
  | StrapiRichTextBlocksListItem
  | StrapiRichTextBlocksQuote
  | StrapiRichTextBlocksCode;

export interface VideoFieldType {
  provider: string;
  providerUid: string;
  url: string;
}

export interface LocationPickerFieldType {
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  geohash?: string;
}

export interface AwardsCategory {
  __component: "awards.category";
  id: number;
  category: string;
  positions: AwardsPosition[] | null;
}

export interface AwardsPosition {
  __component: "awards.position";
  id: number;
  position: string;
  pujas?: Puja[];
  artist?: Artist;
}

export interface SharedAchievement {
  __component: "shared.achievement";
  id: number;
  year: number;
  title: string;
  details: StrapiMarkdownField | string;
}

export interface SharedAshsParticipant {
  __component: "shared.ashs-participant";
  id: number;
  title: string;
  puja?: Puja;
  details: Record<string, any>;
  voteCount: number;
  voteDetails: Record<string, any>;
}

export interface SharedLink {
  __component: "shared.link";
  id: number;
  title: string;
  url: string;
  target: "_self" | "_blank";
  alt?: string;
}

export interface SharedSchedule {
  __component: "shared.schedule";
  id: number;
  date: string;
  event: string;
  description: string;
  timings?: string;
}

export interface SharedVideo {
  __component: "shared.video";
  id: number;
  title: string;
  video?: VideoFieldType;
  description: string;
}

export interface Artist extends Document {
  id: number;
  name: string;
  type: "idol" | "decoration" | "light" | "theme";
  businessName?: string;
  contact?: string;
  email?: string;
  pujas?: Puja[];
}

export interface AshsEntry extends Document {
  id: number;
  year: number;
  entries?: SharedAshsParticipant[];
}

export interface Award extends Document {
  id: number;
  year: number;
  categories?: AwardsCategory[];
  description: string;
}

export interface Contact extends Document {
  id: number;
  name: string;
  location: LocationPickerFieldType | null;
  contact: string;
}

export interface GlobalSite extends Document {
  id: number;
  processionListPublished?: boolean;
  schedules?: SharedSchedule[];
  videos?: SharedVideo[];
  achievements: SharedAchievement[] | null;
}

export interface Image extends Document {
  id: number;
  puja?: Puja;
  category:
    | "puja"
    | "preparation"
    | "banner"
    | "events"
    | "idolmaking"
    | "eyecreation"
    | "procession"
    | "immersion"
    | "lighting"
    | "pandal"
    | "kathamo-puja";
  name: string;
  year: number;
  uploadedBy?: string;
  hash?: string;
}

export interface Partnership extends Document {
  id: number;
  puja?: Puja;
  year: number;
  amount: number;
  email: string;
  name: string;
  orderId?: string;
  paymentId?: string;
  phone: string;
  planName: string;
  planValue: number;
  addons?: Record<string, any>;
  note?: string;
  fullPaid: boolean;
}

export interface Procession extends Document {
  id: number;
  title?: string;
  puja?: Puja;
  zone: "A" | "B" | "C" | "D";
  truckCount: number;
  sortOrder: number;
}

export interface Puja extends Document {
  id: number;
  name: string;
  zone: "chandannagar" | "bhadreswar";
  estd: number;
  tags: string[];
  info?: StrapiMarkdownField | string;
  location?: LocationPickerFieldType;
  artists?: Artist[];
  theme?: string;
  procession?: Procession;
  images?: Image[];
  links?: SharedLink[];
  virtualTours?: VirtualTour[];
  slug: string;
  sortOrder: number;
  referenceId: string;
  partnerships?: Partnership[];
}

export interface VirtualTour extends Document {
  id: number;
  puja?: Puja;
  year: number;
  name?: string;
}
