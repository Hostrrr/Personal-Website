import { useEffect, useState } from "react";
import "./Loader.css";
import AsciiLogo from "../assets/LogoAscii.txt?raw";

function Loader({ isVisible, onFinish }) {
  const [dashes, setDashes] = useState("");

  const maxLength = 64; // длина полоски

  useEffect(() => {
    const interval = setInterval(() => {
      setDashes(prev => {
        if (prev.length >= maxLength) {
          clearInterval(interval);
          setTimeout(() => {
            if (onFinish) onFinish();
          }, 300);
          return prev;
        }
        return prev + "~";
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`loader-wrapper ${!isVisible ? "fade-out" : ""}`}>
      <pre className="ascii-logo">{AsciiLogo}</pre>
      <pre className="ascii-progress">{dashes}</pre>
    </div>
  );
}

export default Loader;