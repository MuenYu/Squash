import Logo from "/logo.png";
import { useNavigate } from "react-router-dom";
import { login } from "../api/requests";

const LoginPage = () => {
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    login(formData)
      .then(() => {
        navigate("/panel");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="bg-base-100 p-8 rounded-lg shadow-md w-96">
        <div className=" flex justify-center items-center mb-4">
          <img src={Logo} width={100} height={100} />
          <h2 className="text-2xl font-bold text-center">Login to Squash</h2>
        </div>
        <form onSubmit={onSubmit} method="post">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              className="input input-bordered"
            />
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="input input-bordered"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-6">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
