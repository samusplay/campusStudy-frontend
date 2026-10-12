"use server";

import { deleteAuthCookie } from "@/src/utils/auth-cookie";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await deleteAuthCookie();
  redirect("/login");
}