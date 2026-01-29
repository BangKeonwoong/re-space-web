import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MoveUpRight } from 'lucide-react';

const TiltCard = ({ children, className, title, subtitle, image, video }) => {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className={`relative rounded-3xl overflow-hidden bg-gray-50 border border-white/50 shadow-sm group ${className}`}
        >
            <div
                style={{
                    transform: "translateZ(75px)",
                    transformStyle: "preserve-3d",
                }}
                className="absolute inset-0 z-0 bg-gray-100"
            >
                {image && (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
            </div>

            <div
                style={{ transform: "translateZ(50px)" }}
                className="relative z-10 h-full flex flex-col justify-end p-8 text-white"
            >
                <motion.h3
                    className="text-2xl font-bold mb-1 font-heading"
                >
                    {title}
                </motion.h3>
                <motion.p
                    className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    {subtitle}
                </motion.p>

                <button className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors border border-white/20">
                    <MoveUpRight size={18} />
                </button>
            </div>
            {children}
        </motion.div>
    );
};

export default TiltCard;
