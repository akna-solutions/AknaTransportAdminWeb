import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  const location = useLocation();
  const [pageExists, setPageExists] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPageExists();
  }, [location.pathname]);

  const checkPageExists = async () => {
    try {
      setLoading(true);

      // Ana sayfa (/) için özel kontrol
      if (location.pathname === "/" || location.pathname === "/dashboard") {
        setPageExists(true);
        setLoading(false);
        return;
      }

      // Path'i temizle ve sayfa adını al
      const pathSegments = location.pathname.split("/").filter(Boolean);
      const pageName = pathSegments[0]; // İlk segment'i al

      if (!pageName) {
        setPageExists(true);
        setLoading(false);
        return;
      }

      // pages klasöründe sayfa var mı kontrol et
      const pages = require.context("../../pages", true, /index\.js$/);
      const pageKeys = pages.keys();

      // Sayfa path'ini oluştur
      const expectedPagePath = `./${pageName}/index.js`;
      const pageExists = pageKeys.includes(expectedPagePath);

      console.log("Checking page:", pageName);
      console.log("Expected path:", expectedPagePath);
      console.log("Available pages:", pageKeys);
      console.log("Page exists:", pageExists);

      setPageExists(pageExists);
    } catch (error) {
      console.error("Error checking page existence:", error);
      // Hata durumunda sayfa var kabul et
      setPageExists(true);
    } finally {
      setLoading(false);
    }
  };

  // Token yoksa login'e yönlendir
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Sayfa kontrolü yükleniyorsa loading göster
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  // Sayfa yoksa dashboard'a yönlendir
  if (!pageExists) {
    console.log("Page doesn't exist, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
