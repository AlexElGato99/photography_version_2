import type { TitleHeadingV1 } from "@/lib/site/title-heading";
import { normalizeTitleHeading, renderTitleHeadingNodes } from "@/lib/site/title-heading";

export function SectionHeading({
  heading,
  className = "cn-section-title",
}: {
  heading: TitleHeadingV1 | null | undefined;
  className?: string;
}) {
  const h = normalizeTitleHeading(heading);
  return <h2 className={className}>{renderTitleHeadingNodes(h)}</h2>;
}
