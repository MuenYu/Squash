import Image from "next/image";
import Link from 'next/link';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intro",
  description: "Introduction of Squash.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-base-300 flex flex-col lg:flex-row justify-center items-center gap-10">
      <figure className="relative h-96 w-96">
        <Image
          src="/logo.png"
          alt="Site Logo"
          className="object-cover"
          fill
        />
      </figure>
      <div className="px-6 max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">
          Squash Makes Your Video Compression Easy
        </h1>
        <p className="text-lg mb-8">
          Your go-to platform for effortless video compression. With Squash, you
          can easily compress videos to different levels, balancing quality and
          file size to suit your needs. Plus, we keep your compression history,
          allowing you to download previous versions anytime. Simplify video
          management with Squash!
        </p>

        <Link href="/login" className="btn btn-primary btn-lg">
          Get Started
        </Link>
      </div>
    </div>
  );
}
