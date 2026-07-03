import { useEffect, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import "./Loader.css";
import AsciiLogo from "../assets/LogoAscii.txt?raw";

function Loader({ isVisible, onSkip }) {
  const { t } = useLanguage();
  const [dashes, setDashes] = useState("");

  const maxLength = 64;

  useEffect(() => {
    const interval = setInterval(() => {
      setDashes((prev) => {
        if (prev.length >= maxLength) {
          clearInterval(interval);
          return prev;
        }
        return prev + "~";
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`loader-wrapper ${!isVisible ? "fade-out" : ""}`}>
      <span className="loader-boot-label te-label te-label--accent">boot sequence</span>
      <pre className="ascii-logo">{AsciiLogo}</pre>
      <pre className="ascii-progress">{dashes}</pre>
      {onSkip && (
        <button type="button" className="loader-skip-btn" onClick={onSkip} aria-label={t.loader.skipAria}>
          {t.loader.skip}
        </button>
      )}
    </div>
  );
}

export default Loader;
