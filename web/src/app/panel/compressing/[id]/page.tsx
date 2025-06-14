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
      <div className="flex justify-center mb-6">
        <Steps step={1} />
      </div>
      <div className="mb-6 flex flex-col items-center">
        <Progress id={id} />
      </div>
    </>
  );
};

export default SettingForm;
