import { BrowserRouter, Routes, Route } from "react-router-dom";

const pages = require.context("./pages", true, /index\.js$/);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {pages.keys().map((key) => {
          const Component = pages(key).default;

          const routePath = key
            .replace("./", "")
            .replace("/index.js", "")
            .toLowerCase();

          return (
            <Route
              key={routePath}
              path={routePath === "home" ? "/" : `/${routePath}`}
              element={<Component />}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
