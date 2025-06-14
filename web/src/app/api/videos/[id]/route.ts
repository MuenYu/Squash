import { minioClient } from "@/lib/minio";
import { NextRequest } from "next/server";

interface RouteParam {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParam) {
  const { id } = await params;
  const presignedUrl = await minioClient.presignedGetObject(
    "compressed",
    id,
    60
  );
  return new Response(null, {
    status: 302,
    headers: {
      Location: presignedUrl,
    },
  });
}
