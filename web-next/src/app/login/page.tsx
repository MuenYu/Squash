import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "@/auth";

export const metadata: Metadata = {
  title: "Login",
  description: "Squash Login Page",
};

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="bg-base-100 p-8 rounded-lg shadow-md w-96">
        <Link href="/">
          <div className="flex justify-center items-center mb-4">
            <Image src="/logo.png" width={100} height={100} alt="Logo" />
            <h2 className="text-2xl font-bold text-center">Login to Squash</h2>
          </div>
        </Link>
        <form
          action={async () => {
            "use server";
            await signIn("google", {redirectTo: "/panel"});
          }}
        >
          <div className="form-control mt-6 flex justify-center">
            <button className="btn btn-primary" type="submit">
              Signin with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
