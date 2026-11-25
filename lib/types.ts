export type LessonResource = {
  label?: string;
  resourceUrl?: string;
  type?: string;
};

export type LessonSection = {
  localSectionKey?: string;
  title?: string;
  description?: string | string[];
  order?: number;
  sectionResources?: LessonResource[];
  sectionContents?: unknown[];
  sectionPresentations?: unknown[];
  sectionArtifacts?: unknown[];
};

export type LessonPlan = {
  id?: string;
  title?: string;
  description?: string;
  ageStart?: number;
  ageEnd?: number;
  status?: string;
  sections?: LessonSection[];
  schedules?: Array<{
    unit?: number;
    week?: number;
    day?: number;
    index?: number | null;
    term?: string | null;
  }>;
  resources?: LessonResource[];
};

/** A named batch of responses that the team reviews together. */
export type VersionRow = {
  id: string;
  ordinal: number;
  name: string;
  description: string;
  created_at: string;
  response_count: number;
};

/** Lightweight row used for lists / dropdowns (no payload). */
export type ResponseSummary = {
  id: string;
  name: string;
  version_id: string;
  created_at: string;
  updated_at: string;
  comment_count: number;
};

/** Full row including the stored API payload. */
export type LessonResponseRow = {
  id: string;
  name: string;
  version_id: string;
  payload: LessonPlan | LessonPlan[];
  created_at: string;
  updated_at: string;
};

export type CommentRow = {
  id: string;
  response_id: string;
  section_key: string;
  section_title: string | null;
  author: string;
  body: string;
  created_at: string;
};

export const COMMENT_LIMITS = { body: 5000, author: 60 } as const;
export const VERSION_LIMITS = { name: 60, description: 500 } as const;
