import Progress from "@/components/Progress";
import Steps from "@/components/Steps";
import { cache } from "@/lib/redis";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

// Path param
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Video Compressing",
  description: "Video is compressing.",
};

const SettingForm: React.FC<PageProps> = async ({ params }) => {
  const { id } = await params;
  // check if the id exist in cache, otherwise, 404
  if (!(await cache.exists(id))) {
    return notFound();
  }

  return (
    <>
      <Steps step={1} />
      <Progress id={id} />
    </>
  );
};

export default SettingForm;
