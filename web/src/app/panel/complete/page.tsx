import Steps from "@/components/Steps";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Compression Complete",
  description: "The video compression is complete.",
};

const Result: React.FC = () => {
  return (
    <>
      <Steps step={2} />
      <h1 className="font-medium text-2xl mb-6">
        Compression complete! The video is ready in the compressed video list
        below
      </h1>
      <Link href="/panel" className="btn btn-primary">
        Try another one?
      </Link>
    </>
  );
};

export default Result;
