import { useEffect, useState } from "react";
import './App.css'
import Loader from "./Components/Loader";
import Desktop from "./Components/Desktop";
import MobileOS from "./Components/MobileOS/MobileOS";
import useIsMobile from "./hooks/useIsMobile";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setShowLoader(false);
      }, 500);
    }
  }, [loading]);

  return (
    <LanguageProvider>
      {showLoader && <Loader isVisible={loading} />}
      {!showLoader && (isMobile ? <MobileOS /> : <Desktop />)}
    </LanguageProvider>
  );
}

export default App;