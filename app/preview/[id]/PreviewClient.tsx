'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import MemoryTimeline from '@/components/templates/MemoryTimeline'
import { MusicPlayer } from '@/components/shared/MusicPlayer'

export default function PreviewClient({ data }: { data: any }) {
  const [opened, setOpened] = useState(false)

  if (!opened) {
    return (
      <div onClick={() => setOpened(true)} className="min-h-screen bg-[#0d0d0d] flex items-center justify-center cursor-pointer">
        <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} 
          className="text-xl text-rose-400 font-serif">
          🤍 แตะเพื่อเปิดความทรงจำ
        </motion.p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white overflow-x-hidden pb-24">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="py-16 text-center px-4">
        <h1 className="text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-400">
          For You
        </h1>
        <p className="mt-2 text-gray-400">{data.share_desc}</p>
      </motion.div>

      <MemoryTimeline images={data.images} messages={data.messages} dates={data.dates} theme={data.theme} />

      <div className="text-center py-20 px-4">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full text-lg font-semibold shadow-lg shadow-rose-500/20">
          Will you stay with me forever? 💍
        </motion.button>
      </div>

      {data.music && <MusicPlayer src={data.music} />}
    </div>
  )
}