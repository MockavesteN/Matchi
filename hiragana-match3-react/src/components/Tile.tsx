import { Tile as TileType } from "../types";
import { motion } from "framer-motion";

interface Props {
  tile: TileType;
  onClick: () => void;
  selected: boolean;
}

export default function Tile({ tile, onClick, selected }: Props) {
  return (
    <motion.div
      onClick={onClick}

      initial={tile.isNew ? { y: -40, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`tile w-12 h-12 m-0.5 bg-white hover:bg-yellow-100 transition ${selected ? "ring-4 ring-blue-400" : ""}`}
    >
      {tile.kana}
    </motion.div>
  );
}
