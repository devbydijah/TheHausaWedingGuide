import { motion } from "framer-motion";

/**
 * GradientHeader - Animated header with brand gradients and decorative elements
 *
 * @param {object} props
 * @param {React.ReactNode} props.icon - Phosphor icon component
 * @param {string} props.title - Header title
 * @param {string} props.subtitle - Header subtitle
 * @param {string} props.gradientFrom - Starting gradient color (default: #740015)
 * @param {string} props.gradientTo - Ending gradient color (default: #531946)
 * @param {number} props.iconSize - Icon size in pixels
 */
export default function GradientHeader({
  icon: Icon,
  title,
  subtitle,
  gradientFrom = "#740015",
  gradientTo = "#531946",
  iconSize = 48,
}) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
      }}
    >
      {/* Animated Decorative Circles */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"
      />

      {/* Content */}
      <div className="relative z-10">
        {Icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm"
          >
            <Icon size={iconSize} weight="bold" />
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-inter text-lg sm:text-xl opacity-90"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
