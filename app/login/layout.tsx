import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Sign in — Admin",
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
