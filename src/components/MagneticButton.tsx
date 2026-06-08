/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number; // strength of magnetic pull, default 0.35
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = "",
  magneticStrength = 0.35,
  onClick,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const btnX = rect.left + rect.width / 2;
      const btnY = rect.top + rect.height / 2;
      
      // Distance from mouse to center
      const distX = e.clientX - btnX;
      const distY = e.clientY - btnY;

      // Animate button towards cursor
      gsap.to(btn, {
        x: distX * magneticStrength,
        y: distY * magneticStrength,
        duration: 0.3,
        ease: "power2.out",
      });

      // Animate text with slightly less magnitude for luxury layered feedback
      if (textRef.current) {
        gsap.to(textRef.current, {
          x: distX * (magneticStrength * 0.4),
          y: distY * (magneticStrength * 0.4),
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const onMouseLeave = () => {
      // Return everything to center
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1.1, 0.4)",
      });

      if (textRef.current) {
        gsap.to(textRef.current, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1.1, 0.4)",
        });
      }
    };

    btn.addEventListener("mousemove", onMouseMove);
    btn.addEventListener("mouseleave", onMouseLeave);

    return () => {
      btn.removeEventListener("mousemove", onMouseMove);
      btn.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [magneticStrength]);

  const handlePointerDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rippleId = Date.now();
    setRipples(prev => [...prev, { id: rippleId, x, y }]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 1000);

    // Call user defined click callback
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      ref={btnRef}
      onMouseDown={handlePointerDown}
      className={`relative overflow-hidden cursor-pointer select-none outline-none group transition-all duration-300 ${className}`}
      {...props}
    >
      {/* Ripple elements */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/20 rounded-full animate-ripple pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '200px',
            height: '200px',
          }}
        />
      ))}

      {/* Button content container */}
      <span ref={textRef} className="relative z-10 flex items-center justify-center space-x-2 pointer-events-none">
        {children}
      </span>
    </button>
  );
};
