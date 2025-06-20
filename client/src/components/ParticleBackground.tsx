import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  size: number;
  left: number;
  delay: number;
  duration: number;
}

interface ParticleBackgroundProps {
  type: 'home' | 'message';
  particleCount?: number;
}

export default function ParticleBackground({ type, particleCount = 50 }: ParticleBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          size: Math.random() * 6 + 2, // 2-8px
          left: Math.random() * 100, // 0-100%
          delay: Math.random() * 20, // 0-20s delay
          duration: Math.random() * 10 + 15, // 15-25s duration
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, [particleCount]);

  return (
    <div className="particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`particle ${type}`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}