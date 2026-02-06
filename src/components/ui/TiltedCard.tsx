import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './TiltedCard.css';

interface TiltedCardProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  containerHeight?: React.CSSProperties['height'];
  containerWidth?: React.CSSProperties['width'];
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
}

const springValues = {
  damping: 40,
  stiffness: 80,
  mass: 2
};

export default function TiltedCard({
  children,
  title = '',
  description = '',
  containerHeight = '300px',
  containerWidth = '100%',
  scaleOnHover = 1.05,
  rotateAmplitude = 12,
  showMobileWarning = false,
  showTooltip = false,
  overlayContent = null,
  displayOverlayContent = false
}: TiltedCardProps) {
  const ref = useRef<HTMLElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });

  const [lastY, setLastY] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current || isMobile) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    // Normalize to -1 to 1 range and reduce sensitivity
    const normalizedX = Math.max(-1, Math.min(1, offsetX / (rect.width / 2)));
    const normalizedY = Math.max(-1, Math.min(1, offsetY / (rect.height / 2)));

    // Apply reduced amplitude and smooth the center area
    const sensitivity = 0.5; // Reduce sensitivity by 50%
    const rotationX = normalizedY * -rotateAmplitude * sensitivity;
    const rotationY = normalizedX * rotateAmplitude * sensitivity;

    // Smooth transition near center to prevent glitches
    const centerThreshold = 0.1;
    const smoothFactor = Math.abs(normalizedX) < centerThreshold && Math.abs(normalizedY) < centerThreshold 
      ? 0.3 
      : 1;

    rotateX.set(rotationX * smoothFactor);
    rotateY.set(rotationY * smoothFactor);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    if (isMobile) return;
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    if (isMobile) return;
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
    setLastY(0);
  }

  return (
    <figure
      ref={ref}
      className="tilted-card-figure"
      style={{
        height: containerHeight,
        width: containerWidth
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="tilted-card-mobile-alert">This effect is not optimized for mobile. Check on desktop.</div>
      )}

      <motion.div
        className="tilted-card-inner"
        style={{
          width: '100%',
          height: '100%',
          rotateX,
          rotateY,
          scale
        }}
      >
        <div className="tilted-card-content">
          {children || (
            <>
              {title && <h3 className="tilted-card-title">{title}</h3>}
              {description && <p className="tilted-card-description">{description}</p>}
            </>
          )}

          {displayOverlayContent && overlayContent && (
            <motion.div className="tilted-card-overlay">{overlayContent}</motion.div>
          )}
        </div>
      </motion.div>

      {showTooltip && (
        <motion.figcaption
          className="tilted-card-caption"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption
          }}
        >
          {title || 'Card'}
        </motion.figcaption>
      )}
    </figure>
  );
}
