"use client";

import Link from "next/link";
import { useState } from "react";

import { ModeToggle } from "./ThemeSwitcher";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <Link href="/" className="font-bold">
          MyTodo
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/">Home</Link>

          {isLoggedIn ? (
            <Link href={isAdmin ? "/admin/overview" : "/user/profile"}>
              Dashboard
            </Link>
          ) : (
            <div className="flex gap-4">
              <Link href="/auth/login">Login</Link>

              <Link href="/auth/registration">Register</Link>
            </div>
          )}

          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
