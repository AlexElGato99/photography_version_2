import type { TitleHeadingV1 } from "@/lib/site/title-heading";
import {
  normalizeTitleHeading,
  titleHeadingFromLegacyHtml,
} from "@/lib/site/title-heading";
import type {
  SectionAbout,
  SectionContact,
  SectionHero,
  SectionInstagram,
  SectionMeta,
  SectionPortfolioMeta,
  SectionProcess,
  SectionStats,
} from "@/lib/types/site";

function sectionHeadingFromRow(row: Record<string, unknown>): TitleHeadingV1 {
  const parsed = normalizeTitleHeading(row.title_heading);
  const has =
    parsed.line1 ||
    parsed.mid ||
    parsed.em ||
    parsed.tail ||
    parsed.line2 ||
    parsed.breakAfterLine1;
  if (has) return parsed;
  const legacy = row.title_html;
  if (typeof legacy === "string" && legacy.trim()) {
    return titleHeadingFromLegacyHtml(legacy);
  }
  return parsed;
}

export function normalizeSectionMetaRow(row: Record<string, unknown>, fallback: SectionMeta): SectionMeta {
  const { title_html: _t, ...rest } = row;
  return {
    ...fallback,
    ...rest,
    title_heading: sectionHeadingFromRow(row),
  } as SectionMeta;
}

export function normalizePortfolioMetaRow(
  row: Record<string, unknown>,
  fallback: SectionPortfolioMeta
): SectionPortfolioMeta {
  const { title_html: _t, ...rest } = row;
  return {
    ...fallback,
    ...rest,
    title_heading: sectionHeadingFromRow(row),
  } as SectionPortfolioMeta;
}

export function normalizeAboutRow(row: Record<string, unknown>, fallback: SectionAbout): SectionAbout {
  const { title_html: _t, ...rest } = row;
  return {
    ...fallback,
    ...rest,
    title_heading: sectionHeadingFromRow(row),
  } as SectionAbout;
}

export function normalizeInstagramRow(
  row: Record<string, unknown>,
  fallback: SectionInstagram
): SectionInstagram {
  const { title_html: _t, ...rest } = row;
  return {
    ...fallback,
    ...rest,
    title_heading: sectionHeadingFromRow(row),
  } as SectionInstagram;
}

export function normalizeContactRow(row: Record<string, unknown>, fallback: SectionContact): SectionContact {
  const { title_html: _t, ...rest } = row;
  return {
    ...fallback,
    ...rest,
    title_heading: sectionHeadingFromRow(row),
  } as SectionContact;
}

export function normalizeStatsRow(row: Record<string, unknown>, fallback: SectionStats): SectionStats {
  const { title_html: _t, ...rest } = row;
  return {
    ...fallback,
    ...rest,
    title_heading: sectionHeadingFromRow(row),
  } as SectionStats;
}

export function normalizeProcessRow(row: Record<string, unknown>, fallback: SectionProcess): SectionProcess {
  const { title_html: _t, ...rest } = row;
  return {
    ...fallback,
    ...rest,
    title_heading: sectionHeadingFromRow(row),
  } as SectionProcess;
}

function stripTags(s: string) {
  return s.replace(/<[^>]*>/g, "").trim();
}

export function normalizeHeroRow(row: Record<string, unknown>, fallback: SectionHero): SectionHero {
  const merged = { ...fallback, ...row } as Record<string, unknown>;
  const { line_2, ...rest } = merged;

  if (typeof line_2 === "string" && line_2.includes("<")) {
    const m = line_2.match(/^([\s\S]*?)<em>([^<]*)<\/em>([\s\S]*)$/i);
    if (m) {
      return {
        ...fallback,
        ...rest,
        line_2_prefix: stripTags(m[1] ?? ""),
        line_2_em: (m[2] ?? "").trim(),
        line_2_suffix: stripTags(m[3] ?? ""),
      } as SectionHero;
    }
    return {
      ...fallback,
      ...rest,
      line_2_prefix: stripTags(line_2),
      line_2_em: "",
      line_2_suffix: "",
    } as SectionHero;
  }

  return { ...fallback, ...rest } as SectionHero;
}
