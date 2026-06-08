/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // e.g. "rgba(16, 185, 129, 0.15)"
  tiltAmount?: number; // degree of tilt, e.g. 10
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = "",
  glowColor = "rgba(16, 185, 129, 0.25)",
  tiltAmount = 8,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Reset initial styles
    gsap.set(card, {
      transformPerspective: 1000,
      transformOrigin: "center center",
    });

    const onMouseEnter = () => {
      // Glow and shine opacity show up
      gsap.to(glowRef.current, { opacity: 1, duration: 0.3 });
      gsap.to(shineRef.current, { opacity: 0.4, duration: 0.3 });
      // Scale and lift card
      gsap.to(card, {
        scale: 1.05,
        y: -8,
        z: 15,
        boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px ${glowColor}`,
        borderColor: "rgba(16, 185, 129, 0.4)",
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top;  // y position within element

      // Calculate percentage positions
      const posX = x / rect.width;
      const posY = y / rect.height;

      // Card tilting calculation
      // Rotate around X (vertical tilt) and Y (horizontal tilt)
      const rotateX = (posY - 0.5) * -tiltAmount;
      const rotateY = (posX - 0.5) * tiltAmount;

      // Animate card tilt
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.2,
        ease: "power1.out",
      });

      // Update glow circle position
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x: x - 150, // centering 300px glow
          y: y - 150,
          duration: 0.1,
        });
      }

      // Update shine gradient angle/opacity
      if (shineRef.current) {
        const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2) * (180 / Math.PI);
        gsap.to(shineRef.current, {
          background: `linear-gradient(${angle}deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 80%)`,
          duration: 0.1,
        });
      }
    };

    const onMouseLeave = () => {
      // Reset card appearance
      gsap.to(card, {
        scale: 1,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        borderColor: "rgba(255, 255, 255, 0.08)",
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(glowRef.current, { opacity: 0, duration: 0.4 });
      gsap.to(shineRef.current, { opacity: 0, duration: 0.4 });
    };

    card.addEventListener("mouseenter", onMouseEnter);
    card.addEventListener("mousemove", onMouseMove);
    card.addEventListener("mouseleave", onMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", onMouseEnter);
      card.removeEventListener("mousemove", onMouseMove);
      card.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [glowColor, tiltAmount]);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden transition-colors duration-300 ${className}`}
      {...props}
    >
      {/* Background Glow Circle */}
      <div
        ref={glowRef}
        className="absolute rounded-full pointer-events-none opacity-0 blur-3xl"
        style={{
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          left: 0,
          top: 0,
          zIndex: 1,
        }}
      />
      {/* Reflection shine overlay */}
      <div
        ref={shineRef}
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
        style={{
          zIndex: 2,
        }}
      />
      {/* Visual border pulse/glow */}
      <div className="absolute inset-0 border border-transparent rounded-2xl pointer-events-none group-hover:border-emerald-500/10 transition-colors duration-300 z-10" />
      
      {/* Content wrapper */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
};
