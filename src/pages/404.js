import * as React from "react";
import { Link } from "gatsby";

const NotFoundPage = () => {
  return (
    <main className="bg-gray-800 px-8 text-gray-200 font-serif flex flex-col h-screen justify-center align-middle">
      <title className="text-4xl font-black">Not found</title>
      <h1>Page not found</h1>
      <p>
        Sorry{" "}
        <span aria-label="Pensive emoji" role="img">
          😔
        </span>{" "}
        we couldn’t find what you were looking for.
        <br />
        <Link className="text-blue-400" to="/">
          Go home
        </Link>
        .
      </p>
    </main>
  );
};

export default NotFoundPage;
