import * as React from "react";
import { Link } from "gatsby";

const NotFoundPage = () => {
  return (
    <main>
      <h3>Page Not Found</h3>
      <Link to="/">Go home</Link>.
    </main>
  );
};

export default NotFoundPage;
