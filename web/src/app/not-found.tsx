import React from "react";
import type { Metadata } from "next";

const title: string = "404";
const description: string = "Oops! The page you're looking for doesn't exist.";

export const metadata: Metadata = {
  title: title,
  description: description,
};

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-5xl font-bold mb-5">{title}</h1>
      <p className="text-xl">
        {description}
      </p>
    </div>
  );
};

export default NotFoundPage;
