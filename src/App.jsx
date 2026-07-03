import { useCallback, useEffect, useState } from "react";
import Loader from "./Components/Loader";
import Desktop from "./Components/Desktop";
import MobileOS from "./Components/MobileOS/MobileOS";
import useIsMobile from "./hooks/useIsMobile";
import { LanguageProvider } from "./contexts/LanguageContext";

const LOADER_FADE_MS = 500;

function App() {
  const [loading, setLoading] = useState(true);
  const [loaderMounted, setLoaderMounted] = useState(true);
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
      const timer = setTimeout(() => setLoaderMounted(false), LOADER_FADE_MS);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <LanguageProvider>
      {!isMobile && !loading && <Desktop />}
      {isMobile && !loading && <MobileOS />}
      {loaderMounted && <Loader isVisible={loading} onSkip={finishBoot} />}
    </LanguageProvider>
  );
}

export default App;
