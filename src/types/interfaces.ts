
export interface AwardsCategory {
  id?: number;
  category: string;
  positions: AwardsPosition[] | null;
};

export interface AwardsPosition {
  id?: number;
  position: string;
  pujas?: Puja[] | null;
};

export interface SharedAchievement {
  id?: number;
  year: number;
  title: string;
  details: string;
};

export interface SharedLink {
  id?: number;
  title: string;
  url: string;
  target: "_self" | "_blank";
  alt?: string;
};

export interface SharedSchedule {
  id?: number;
  date: Date | string;
  event: string;
  description: string;
  timings?: string;
};

export interface SharedVideo {
  id?: number;
  title: string;
  video?: any;
  description: string;
};

export interface Artist {
  id?: number;
  documentId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  publishedAt?: Date | string;
  locale?: string | null;
  name: string;
  type: "idol" | "decoration" | "light" | "theme";
  businessName?: string;
  contact?: string;
  email?: string;
  pujas?: Puja[] | null;
};

export interface Award {
  id?: number;
  documentId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  publishedAt?: Date | string;
  locale?: string | null;
  year: number;
  categories?: AwardsCategory[] | null;
  description: string;
};

export interface Contact {
  id?: number;
  documentId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  publishedAt?: Date | string;
  locale?: string | null;
  name: string;
  location: any;
  contact: string;
};

export interface Global {
  id?: number;
  documentId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  publishedAt?: Date | string;
  locale?: string | null;
  processionListPublished?: boolean;
  schedules?: SharedSchedule[] | null;
  videos?: SharedVideo[] | null;
  achievements: SharedAchievement[] | null;
};

export interface Image {
  id?: number;
  documentId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  publishedAt?: Date | string;
  locale?: string | null;
  puja?: Puja | null;
  category: "puja" | "preparation" | "banner" | "events" | "idolmaking" | "eyecreation" | "procession" | "immersion" | "lighting" | "pandal" | "kathamo-puja";
  name: string;
  year: number;
  uploadedBy?: string;
  hash?: string;
};

export interface Partnership {
  id?: number;
  documentId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  publishedAt?: Date | string;
  locale?: string | null;
  puja?: Puja | null;
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
  fullPaid?: boolean;
};

export interface Procession {
  id?: number;
  documentId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  publishedAt?: Date | string;
  locale?: string | null;
  title?: string;
  puja?: Puja | null;
  zone: "A" | "B" | "C" | "D";
  truckCount: number;
  sortOrder: number;
};

export interface Puja {
  id?: number;
  documentId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  publishedAt?: Date | string;
  locale?: string | null;
  name: string;
  zone: "chandannagar" | "bhadreswar";
  estd: number;
  tags?: any;
  info?: string;
  location?: any;
  artists?: Artist[] | null;
  theme?: string;
  procession?: Procession | null;
  images?: Image[] | null;
  links?: SharedLink[] | null;
  virtualTours?: VirtualTour[] | null;
  slug: string;
  sortOrder: number;
  referenceId: string;
  partnerships?: Partnership[] | null;
};

export interface VirtualTour {
  id?: number;
  documentId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  publishedAt?: Date | string;
  locale?: string | null;
  puja?: Puja | null;
  year: number;
  name?: string;
};

export interface Media {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: { thumbnail: MediaFormat; small: MediaFormat; medium: MediaFormat; large: MediaFormat; };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path: string;
  url: string;
}

export interface User {
  id?: number;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  role: Role | null | number;
};

export interface Role {
  id?: number;
  documentId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  name: string;
  description: string;
  type: string;
};

export interface FindOne<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    }
  };
};

export interface FindMany<T> {
  data: T[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    }
  };
};
