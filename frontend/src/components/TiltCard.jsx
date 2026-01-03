import { useState, useRef, useCallback } from 'react';

/**
 * TiltCard Component - Premium 3D hover tilt effect
 * Follows mouse position for dynamic tilt on desktop
 * Disabled on touch devices for better UX
 */
const TiltCard = ({ children, className = '', intensity = 15, scale = 1.02, glare = true }) => {
    const cardRef = useRef(null);
    const [transform, setTransform] = useState('');
    const [glareStyle, setGlareStyle] = useState({});
    const [isHovering, setIsHovering] = useState(false);

    // Check if device is touch-based
    const isTouchDevice = () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };

    const handleMouseMove = useCallback((e) => {
        if (isTouchDevice() || !cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        
        // Calculate mouse position relative to card center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Calculate rotation (inverted for natural feel)
        const rotateX = (mouseY / (rect.height / 2)) * -intensity;
        const rotateY = (mouseX / (rect.width / 2)) * intensity;
        
        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`);
        
        // Glare effect position
        if (glare) {
            const glareX = ((e.clientX - rect.left) / rect.width) * 100;
            const glareY = ((e.clientY - rect.top) / rect.height) * 100;
            setGlareStyle({
                background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
                opacity: 1
            });
        }
    }, [intensity, scale, glare]);

    const handleMouseEnter = useCallback(() => {
        if (isTouchDevice()) return;
        setIsHovering(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (isTouchDevice()) return;
        setIsHovering(false);
        setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
        setGlareStyle({ opacity: 0 });
    }, []);

    return (
        <div
            ref={cardRef}
            className={`tilt-card ${className}`}
            style={{
                transform: transform || 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
                transformStyle: 'preserve-3d',
                transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
                willChange: 'transform'
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            
            {/* Glare overlay */}
            {glare && (
                <div 
                    className="absolute inset-0 rounded-2xl pointer-events-none z-10 transition-opacity duration-300"
                    style={glareStyle}
                />
            )}
        </div>
    );
};

export default TiltCard;
