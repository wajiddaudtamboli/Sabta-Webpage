import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-(--brand-accent)">404</h1>
      <p className="text-xl mt-4 font-semibold">Page Not Found</p>
      <p className="text-gray-600 mt-2 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-6 bg-(--brand-bg) text-(--brand-accent) px-6 py-3 rounded-full font-semibold shadow hover:scale-105 transition"
      >
        Go Back Home →
      </Link>
    </div>
  );
};

export default NotFound;
