import type { Metadata } from "next";
import ChangePasswordForm from "./_components/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Change Password | Todo App",
  description: "Update your account password",
};

const ChangePasswordPage = () => {
  return <ChangePasswordForm />;
};

export default ChangePasswordPage;
