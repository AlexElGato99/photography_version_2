import { redirect } from "next/navigation";

// /admin → /dashboard alias
export default function AdminPage() {
  redirect("/dashboard");
}
