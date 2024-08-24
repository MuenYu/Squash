import Logo from "/logo.png";
import { Link } from "react-router-dom";

export default function IntroPage() {
  return (
    <div className="min-h-screen bg-base-300 flex flex-col items-center justify-center text-center">
      <div className="max-w-lg w-full p-6 bg-base-100 rounded-lg shadow-lg">
        {/* Logo */}
        <div className="mb-8">
          <img
            src={Logo} // Replace this with your logo URL
            alt="Site Logo"
            className="w-32 h-32 mx-auto"
          />
        </div>

        {/* Description */}
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

        {/* Button */}
        <Link to='/login' className="btn btn-primary btn-lg">Get Started</Link>
      </div>
    </div>
  );
}
