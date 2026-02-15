import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./common/components/ProtectedRoute";

const pages = require.context("./pages", true, /index\.js$/);

function App() {
  const accessToken = localStorage.getItem("accessToken");

  return (
    <BrowserRouter>
      <Routes>
        {/* Login route - redirect to dashboard if already logged in */}
        <Route
          path="/login"
          element={
            accessToken ? (
              <Navigate to="/dashboard" replace />
            ) : (
              (() => {
                const LoginComponent =
                  require("./pages/login/index.js").default;
                return <LoginComponent />;
              })()
            )
          }
        />

        {/* Protected routes */}
        {pages.keys().map((key) => {
          const Component = pages(key).default;

          const routePath = key
            .replace("./", "")
            .replace("/index.js", "")
            .toLowerCase();

          // Skip login page as it's handled above
          if (routePath === "login") {
            return null;
          }

          return (
            <Route
              key={routePath}
              path={routePath === "home" ? "/dashboard" : `/${routePath}`}
              element={
                <ProtectedRoute>
                  <Component />
                </ProtectedRoute>
              }
            />
          );
        })}

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
