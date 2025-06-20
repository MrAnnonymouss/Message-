import { useEffect, useState, useCallback } from 'react';

interface Particle {
  id: number;
  size: number;
  left: number;
  delay: number;
  duration: number;
  opacity: number;
  animationType: 'float' | 'floatSide' | 'spiral' | 'wave';
  color: string;
}

interface ParticleBackgroundProps {
  type: 'home' | 'message';
  particleCount?: number;
  intensity?: 'low' | 'medium' | 'high';
}

export default function ParticleBackground({ 
  type, 
  particleCount = 50, 
  intensity = 'medium' 
}: ParticleBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Responsive particle count based on device and performance
  const getResponsiveParticleCount = useCallback(() => {
    const baseCount = particleCount;
    const performanceMultiplier = {
      low: 0.5,
      medium: 1,
      high: 1.5
    }[intensity];

    const deviceMultiplier = {
      mobile: 0.4,
      tablet: 0.7,
      desktop: 1
    }[deviceType];

    return Math.floor(baseCount * performanceMultiplier * deviceMultiplier);
  }, [particleCount, intensity, deviceType]);

  // Detect device type and screen size
  useEffect(() => {
    const updateScreenInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    updateScreenInfo();
    window.addEventListener('resize', updateScreenInfo);
    
    return () => window.removeEventListener('resize', updateScreenInfo);
  }, []);

  // Generate particles with responsive properties
  useEffect(() => {
    const generateParticles = () => {
      const count = getResponsiveParticleCount();
      const newParticles: Particle[] = [];
      
      const animationTypes: Particle['animationType'][] = ['float', 'floatSide', 'spiral', 'wave'];
      
      const colors = type === 'home' 
        ? ['rgba(255,255,255,0.8)', 'rgba(200,200,200,0.6)', 'rgba(150,150,150,0.4)']
        : ['rgba(255,255,255,0.9)', 'rgba(255,182,193,0.7)', 'rgba(173,216,230,0.6)', 'rgba(221,160,221,0.8)'];

      for (let i = 0; i < count; i++) {
        const baseSize = deviceType === 'mobile' ? 2 : deviceType === 'tablet' ? 4 : 6;
        const sizeVariation = deviceType === 'mobile' ? 3 : deviceType === 'tablet' ? 4 : 6;
        
        newParticles.push({
          id: i,
          size: Math.random() * sizeVariation + baseSize,
          left: Math.random() * 100,
          delay: Math.random() * 25,
          duration: Math.random() * 15 + 20, // 20-35s for smoother animation
          opacity: Math.random() * 0.6 + 0.3, // 0.3-0.9
          animationType: animationTypes[Math.floor(Math.random() * animationTypes.length)],
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, [type, getResponsiveParticleCount, deviceType]);

  return (
    <div className="particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`particle particle-${particle.animationType} ${type}`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            opacity: particle.opacity,
            background: particle.color,
            boxShadow: type === 'message' 
              ? `0 0 ${particle.size * 2}px ${particle.color}` 
              : `0 0 ${particle.size}px ${particle.color}`
          }}
        />
      ))}
    </div>
  );
}