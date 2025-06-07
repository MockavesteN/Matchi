import { motion } from "framer-motion";

export default function KanjiPop({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.3, 1], opacity: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute text-[72px] font-bold text-black stroke-white stroke-[6px] pointer-events-none"
      style={{
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000
      }}
    >
      {text}
    </motion.div>
  );
}