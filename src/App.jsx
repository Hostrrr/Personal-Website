import { useCallback, useEffect, useState } from "react";
import Loader from "./Components/Loader";
import Desktop from "./Components/Desktop";
import MobileOS from "./Components/MobileOS/MobileOS";
import useIsMobile from "./hooks/useIsMobile";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const isMobile = useIsMobile();

  const finishBoot = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(finishBoot, 2000);
    return () => clearTimeout(timer);
  }, [finishBoot]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowLoader(false), 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <LanguageProvider>
      {showLoader && <Loader isVisible={loading} onSkip={finishBoot} />}
      {!showLoader && (isMobile ? <MobileOS /> : <Desktop />)}
    </LanguageProvider>
  );
}

export default App;
