import { ReactNode } from "react";
import { motion } from "framer-motion";

type PageContainerProps = {
  children: ReactNode;
};

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 p-8 bg-[#fafafa] min-h-screen"
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </motion.main>
  );
}
