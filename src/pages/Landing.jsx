import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Maitri Healthcare Portal</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
Please Login to view the Details via Dashboard      </p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default Landing;
