import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return response;
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: items => {
        items.forEach(({name,value}) => request.cookies.set(name,value));
        response = NextResponse.next({request});
        items.forEach(({name,value,options}) => response.cookies.set(name,value,options));
      }
    }
  });
  const { data: { user } } = await supabase.auth.getUser();
  const pathname=request.nextUrl.pathname;
  const open=pathname==="/login" || pathname.startsWith("/auth") || pathname.startsWith("/_next");
  if(!user && !open && pathname!=="/") {
    const target=request.nextUrl.clone(); target.pathname="/login"; target.searchParams.set("next",pathname);
    return NextResponse.redirect(target);
  }
  return response;
}
export const config={matcher:["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]};