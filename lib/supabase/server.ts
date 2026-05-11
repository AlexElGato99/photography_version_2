import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          // `cookies().set` throws inside React Server Components.
          // It only works in Route Handlers / Server Actions, which is
          // exactly when we need to refresh the session.
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Called from an RSC — ignore. Session refresh is handled by middleware.
          }
        },
        remove(name: string, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // RSC — ignore.
          }
        },
      },
    }
  );
}
