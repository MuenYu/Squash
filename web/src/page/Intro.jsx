import Logo from "/logo.png";
import { Link } from "react-router-dom";

export default function IntroPage() {
  return (
    <div className="min-h-screen bg-base-300 flex flex-col lg:flex-row justify-center items-center gap-10">
      <img
        src={Logo} // Replace this with your logo URL
        alt="Site Logo"
        className="w-96 h-96"
      />
      <div className="px-6 max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">
          Squash Makes Your Video Compression Easy
        </h1>
        <p className="text-lg mb-8">
          your go-to platform for effortless video compression. With Squash, you
          can easily compress videos to different levels, balancing quality and
          file size to suit your needs. Plus, we keep your compression history,
          allowing you to download previous versions anytime. Simplify video
          management with Squash!
        </p>

        <Link to="/login" className="btn btn-primary btn-lg">
          Get Started
        </Link>
      </div>
    </div>
  );
}
