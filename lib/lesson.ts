import type { LessonPlan, LessonSection } from '@/lib/types';

/** Normalize stored payload into a single lesson plan object. */
export function normalizePlan(payload: unknown): LessonPlan | null {
  if (payload == null) return null;

  let value: unknown = payload;

  // Handle accidental double-encoded JSON strings
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      return null;
    }
  }

  if (Array.isArray(value)) {
    const first = value[0];
    if (first == null) return null;
    if (typeof first === 'string') {
      try {
        return JSON.parse(first) as LessonPlan;
      } catch {
        return null;
      }
    }
    return first as LessonPlan;
  }

  if (typeof value === 'object') {
    return value as LessonPlan;
  }

  return null;
}

export function sortedSections(plan: LessonPlan | null): LessonSection[] {
  const list = [...(plan?.sections || [])];
  list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return list;
}

export function parseDescription(value: LessonSection['description']): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (value == null || value === '') return [];
  if (typeof value !== 'string') return [String(value)];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String);
    if (parsed == null) return [];
    return [String(parsed)];
  } catch {
    return value
      .split(/\r?\n/)
      .map((x) => x.trim())
      .filter(Boolean);
  }
}

export function sectionKeyOf(section: LessonSection, index: number) {
  return section.localSectionKey || `section-${section.order ?? index + 1}`;
}

/** Reserved feedback key for whole-lesson comments (stored like section feedback). */
export const OVERALL_FEEDBACK_KEY = '__overall__';
