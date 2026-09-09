"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { KeyRound, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { authClient } from "@/lib/auth/auth-client";
import { changePasswordSchema } from "@/schema/auth";

export default function ChangePasswordForm() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
      revokeOtherSessions,
    });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid input.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await authClient.changePassword({
      currentPassword: result.data.currentPassword,
      newPassword: result.data.newPassword,
      revokeOtherSessions: result.data.revokeOtherSessions,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error(error.message ?? "Could not change password.");
      return;
    }

    toast.success("Password changed successfully!");
    router.push("/profile");
  };

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <KeyRound className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Security Settings
            </span>
          </div>
          <CardTitle className="text-2xl">Change Password</CardTitle>
          <CardDescription>
            Update your account password to maintain maximum security.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleChangePassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="•••••••• (min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="revokeSessions"
                checked={revokeOtherSessions}
                onCheckedChange={(checked) =>
                  setRevokeOtherSessions(checked === true)
                }
              />
              <Label
                htmlFor="revokeSessions"
                className="text-xs text-muted-foreground cursor-pointer"
              >
                Log out from all other active browser sessions
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 mt-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Updating Password..." : "Update Password"}
            </Button>
            <Button variant="ghost" asChild className="w-full text-xs">
              <Link href="/profile">
                <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Profile
              </Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
