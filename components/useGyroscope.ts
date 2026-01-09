
import { useState, useEffect, useCallback } from 'react';

export const useGyroscope = (damping = 0.1) => {
    const [orientation, setOrientation] = useState({ x: 0, y: 0 });
    const [permissionGranted, setPermissionGranted] = useState(false);

    const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
        if (!event.gamma || !event.beta) return;
        
        // Gamma: Left/Right tilt (-90 to 90)
        // Beta: Front/Back tilt (-180 to 180)
        const x = Math.min(Math.max(event.gamma, -45), 45) / 45; // Normalize -1 to 1
        const y = Math.min(Math.max(event.beta, -45), 45) / 45;

        setOrientation(prev => ({
            x: prev.x + (x - prev.x) * damping,
            y: prev.y + (y - prev.y) * damping
        }));
    }, [damping]);

    const requestPermission = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const response = await (DeviceOrientationEvent as any).requestPermission();
                if (response === 'granted') {
                    setPermissionGranted(true);
                    window.addEventListener('deviceorientation', handleOrientation);
                }
            } catch (e) {
                console.error(e);
            }
        } else {
            // Non-iOS devices usually don't need permission
            setPermissionGranted(true);
            window.addEventListener('deviceorientation', handleOrientation);
        }
    };

    useEffect(() => {
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [handleOrientation]);

    return { orientation, requestPermission, permissionGranted };
};
