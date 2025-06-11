import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404",
  description: "Oops! The page you're looking for doesn't exist.",
};

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-5xl font-bold mb-5">404</h1>
      <p className="text-xl">
        Oops! The page you're looking for doesn't exist.
      </p>
    </div>
  );
};

export default NotFoundPage;
