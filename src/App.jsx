import { useCallback, useEffect, useState } from "react";
import Loader from "./Components/Loader";
import Desktop from "./Components/Desktop";
import MobileOS from "./Components/MobileOS/MobileOS";
import useIsMobile from "./hooks/useIsMobile";
import { LanguageProvider } from "./contexts/LanguageContext";

const BOOT_MS = 2000;
const DESKTOP_PREMOUNT_MS = 1000;
const LOADER_FADE_MS = 400;

function App() {
  const [loading, setLoading] = useState(true);
  const [showDesktop, setShowDesktop] = useState(false);
  const [loaderMounted, setLoaderMounted] = useState(true);
  const isMobile = useIsMobile();

  const finishBoot = useCallback(() => {
    setShowDesktop(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    const preMount = setTimeout(() => setShowDesktop(true), DESKTOP_PREMOUNT_MS);
    const endLoader = setTimeout(finishBoot, BOOT_MS);
    return () => {
      clearTimeout(preMount);
      clearTimeout(endLoader);
    };
  }, [finishBoot]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setLoaderMounted(false), LOADER_FADE_MS);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <LanguageProvider>
      {!isMobile && showDesktop && <Desktop />}
      {isMobile && !loading && <MobileOS />}
      {loaderMounted && <Loader isVisible={loading} onSkip={finishBoot} />}
    </LanguageProvider>
  );
}

export default App;
