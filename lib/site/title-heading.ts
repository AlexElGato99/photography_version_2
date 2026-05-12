import { createElement, Fragment, type ReactNode } from "react";

/** Structured section / category title (no raw HTML for admins). */
export type TitleHeadingV1 = {
  v: 1;
  /** First line or text before a line break / before mid+em on one line */
  line1: string;
  /** Plain text between line break and <em>, or between line1 and <em> when inline */
  mid: string;
  /** Italic emphasis segment */
  em: string;
  /** Plain text after </em> on the same line as the emphasis */
  tail: string;
  /** Insert <br /> after line1 */
  breakAfterLine1: boolean;
  /** Optional second row (plain), shown after a <br /> following the first block */
  line2: string;
};

export function emptyTitleHeading(): TitleHeadingV1 {
  return {
    v: 1,
    line1: "",
    mid: "",
    em: "",
    tail: "",
    breakAfterLine1: false,
    line2: "",
  };
}

export function normalizeTitleHeading(input: unknown): TitleHeadingV1 {
  const e = emptyTitleHeading();
  if (!input || typeof input !== "object") return e;
  const o = input as Record<string, unknown>;
  return {
    v: 1,
    line1: String(o.line1 ?? ""),
    mid: String(o.mid ?? ""),
    em: String(o.em ?? ""),
    tail: String(o.tail ?? ""),
    breakAfterLine1: Boolean(o.breakAfterLine1),
    line2: String(o.line2 ?? ""),
  };
}

/** Best-effort parse of legacy `...<em>x</em>...` / `<br>` titles into structured form. */
export function titleHeadingFromLegacyHtml(html: string): TitleHeadingV1 {
  const h = (html ?? "").trim();
  if (!h) return emptyTitleHeading();

  const segments = h.split(/<br\s*\/?>/i);
  const firstSeg = (segments[0] ?? "").trim();
  const afterBr = segments.slice(1).join(" ").trim();

  const parseEm = (segment: string) => {
    const m = segment.match(/^([\s\S]*?)<em>([^<]*)<\/em>([\s\S]*)$/i);
    if (!m) {
      return {
        before: segment.replace(/<[^>]+>/g, "").trim(),
        mid: "",
        em: "",
        tail: "",
      };
    }
    return {
      before: (m[1] ?? "").replace(/<[^>]+>/g, "").trim(),
      mid: "",
      em: (m[2] ?? "").trim(),
      tail: (m[3] ?? "").replace(/<[^>]+>/g, "").trim(),
    };
  };

  if (afterBr) {
    const head = parseEm(firstSeg);
    const tailSeg = parseEm(afterBr);
    if (tailSeg.em) {
      return {
        v: 1,
        line1: head.before,
        mid: tailSeg.before,
        em: tailSeg.em,
        tail: tailSeg.tail,
        breakAfterLine1: true,
        line2: "",
      };
    }
    if (head.em) {
      return {
        v: 1,
        line1: head.before,
        mid: "",
        em: head.em,
        tail: head.tail,
        breakAfterLine1: false,
        line2: afterBr.replace(/<[^>]+>/g, "").trim(),
      };
    }
    return {
      v: 1,
      line1: firstSeg.replace(/<[^>]+>/g, "").trim(),
      mid: "",
      em: "",
      tail: "",
      breakAfterLine1: true,
      line2: afterBr.replace(/<[^>]+>/g, "").trim(),
    };
  }

  const head = parseEm(firstSeg);
  if (!head.em) {
    return {
      v: 1,
      line1: head.before,
      mid: "",
      em: "",
      tail: "",
      breakAfterLine1: false,
      line2: "",
    };
  }
  return {
    v: 1,
    line1: head.before,
    mid: "",
    em: head.em,
    tail: head.tail,
    breakAfterLine1: false,
    line2: "",
  };
}

export function renderTitleHeadingNodes(h: TitleHeadingV1): ReactNode {
  const t = normalizeTitleHeading(h);
  const hasEm = Boolean(t.em?.trim());
  const firstBlock = createElement(
    Fragment,
    null,
    t.line1,
    t.breakAfterLine1 && (hasEm || t.mid || t.tail || t.line2) ? createElement("br") : null,
    t.mid,
    hasEm ? createElement("em", null, t.em) : null,
    t.tail
  );

  if (!t.line2?.trim()) return firstBlock;

  return createElement(Fragment, null, firstBlock, createElement("br"), t.line2);
}
