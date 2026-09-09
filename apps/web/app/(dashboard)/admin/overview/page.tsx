import { redirect } from "next/navigation";

import { isAdmin } from "@/lib/auth/session";

const AdminOverviewPage = async () => {
  if (!(await isAdmin())) {
    redirect("/todos");
  }

  return (
    <main>
      <h1>Admin Overview Page</h1>
    </main>
  );
};

export default AdminOverviewPage;
