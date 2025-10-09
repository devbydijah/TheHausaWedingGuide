import { motion } from "framer-motion";

/**
 * AnimatedCard - Reusable card with entrance animations
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.delay - Animation delay in seconds
 * @param {string} props.variant - Animation variant: "fade" | "slide" | "scale"
 * @param {function} props.onClick - Optional click handler
 * @param {boolean} props.hoverable - Enable hover effects
 */
export default function AnimatedCard({
  children,
  className = "",
  delay = 0,
  variant = "fade",
  onClick,
  hoverable = true,
  ...props
}) {
  const variants = {
    fade: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    slide: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 30 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },
  };

  const hoverEffects = hoverable
    ? {
        whileHover: { scale: 1.02, y: -2 },
        whileTap: { scale: 0.98 },
      }
    : {};

  return (
    <motion.div
      initial={variants[variant].initial}
      animate={variants[variant].animate}
      exit={variants[variant].exit}
      transition={{
        duration: 0.4,
        delay,
        ease: "easeOut",
      }}
      {...hoverEffects}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
