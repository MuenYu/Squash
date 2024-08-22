import { useEffect } from "react";
import Logo from "/logo.png";
import { Form, useActionData } from "react-router-dom";

const LoginPage = () => {
  const actionData = useActionData();

  useEffect(() => {
    if (actionData?.error) {
      alert(actionData.error);
    }
  }, [actionData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="bg-base-100 p-8 rounded-lg shadow-md w-96">
        <div className=" flex justify-center items-center mb-4">
          <img src={Logo} width={100} height={100} />
          <h2 className="text-2xl font-bold text-center">Login to Squash</h2>
        </div>
        <Form method="post">
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
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
