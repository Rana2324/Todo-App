"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ModeToggle } from "./ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { authClient, signOut } from "@/lib/auth/auth-client";

const Navbar = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session;
  const isAdmin = session?.user.role === "admin";

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <Link href="/" className="font-bold">
          MyTodo
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/">Home</Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link href={isAdmin ? "/admin/overview" : "/profile"}>
                Dashboard
              </Link>

              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/login">Login</Link>

              <Link href="/registration">Register</Link>
            </div>
          )}

          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
