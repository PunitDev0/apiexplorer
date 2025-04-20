import { useState, useEffect } from "react";

export default function CursorFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[1000] rounded-full  transition-transform bg-[#E65D00] duration-150 ease-out"
      style={{
        height: "15px",
        width: "15px",
        backgroundColor: "#E65D00", // Tumhara requested color
        opacity: 1, // Thodi transparency ke liye
        transform: `translate(${position.x - 15}px, ${position.y - 15}px)`, // Center karne ke liye
      }}
    />
  );
}