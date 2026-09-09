import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth/session";

export default async function AdminRootPage() {
  if (!(await isAdmin())) {
    redirect("/todos");
  }

  redirect("/admin/overview");
}
