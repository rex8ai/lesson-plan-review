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

export type LessonResponseRow = {
  id: string;
  name: string;
  payload: LessonPlan | LessonPlan[];
  created_at?: string;
  updated_at?: string;
};

export type SectionFeedbackRow = {
  id: string;
  response_id: string;
  section_key: string;
  section_title: string | null;
  feedback: string;
  updated_at: string;
};
