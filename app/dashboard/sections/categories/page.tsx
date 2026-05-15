import { redirect } from "next/navigation";

/** @deprecated Use `/dashboard/sections/explore-by-category` (same CMS data). */
export default function CategoriesRedirectPage() {
  redirect("/dashboard/sections/explore-by-category");
}
