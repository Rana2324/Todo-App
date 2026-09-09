import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail, Shield, KeyRound, CheckCircle2, ListTodo, ShieldAlert } from "lucide-react";

import { requireSession } from "@/lib/auth/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Profile | Todo App",
  description: "User profile and account settings",
};

export default async function ProfilePage() {
  let sessionData;
  try {
    sessionData = await requireSession();
  } catch {
    redirect("/login");
  }

  const { user, session } = sessionData;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 py-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal information, session state, and security settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* User Identity Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
                {user.name ? user.name[0]?.toUpperCase() : "U"}
              </div>
              <div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 text-sm bg-muted/20">
              <div>
                <span className="text-xs text-muted-foreground block">User ID</span>
                <span className="font-mono text-xs truncate block" title={user.id}>
                  {user.id}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Assigned Role</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary capitalize mt-0.5">
                  <Shield className="h-3 w-3" />
                  {user.role ?? "user"}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Account Status</span>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Active
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Session Expires</span>
                <span className="text-xs font-medium mt-0.5 block">
                  {new Date(session.expiresAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Security and navigation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" asChild className="w-full justify-start text-sm">
              <Link href="/todos">
                <ListTodo className="mr-2 h-4 w-4 text-primary" />
                Go to My Todos
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start text-sm">
              <Link href="/change-password">
                <KeyRound className="mr-2 h-4 w-4 text-amber-500" />
                Change Password
              </Link>
            </Button>
            {user.role === "admin" && (
              <Button variant="outline" asChild className="w-full justify-start text-sm border-purple-500/30 text-purple-600 dark:text-purple-400">
                <Link href="/admin/overview">
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
