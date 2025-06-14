"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface progressProps {
  id: string;
}

const Progress: React.FC<progressProps> = ({ id }) => {
  const [progress, setProgress] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      const resp = await fetch(`/api/progress/${id}`);
      if (resp.ok) {
        const progress = await resp.json();
        setProgress(Math.floor(progress));
        if (progress === 100) {
          router.push("/panel/complete");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="radial-progress"
      style={
        {
          "--value": progress,
          "--size": "12rem",
          "--thickness": "4px",
        } as React.CSSProperties
      }
      role="progressbar"
    >
      <span className="text-6xl">{progress}%</span>
    </div>
  );
};

export default Progress;
