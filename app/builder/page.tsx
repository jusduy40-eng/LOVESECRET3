'use client'
import { useBuilderStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import MemoryTimeline from '@/components/templates/MemoryTimeline'

export default function BuilderPage() {
  const state = useBuilderStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    for (const file of e.target.files) {
      const path = `${crypto.randomUUID()}-${file.name.replace(/\s/g, '_')}`
      const { error } = await supabase.storage.from('surprise-assets').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('surprise-assets').getPublicUrl(path)
        useBuilderStore.getState().addImage(data.publicUrl)
      }
    }
  }

  const generateLink = async () => {
    setLoading(true)
    const { images, messages, dates, music, theme, template, share } = useBuilderStore.getState()
    const id = uuidv4()

    const { error } = await supabase.from('surprise_pages').insert({
      id, template, images, messages, dates, music, theme,
      share_title: share.title, share_desc: share.desc, share_image: share.image || images[0] || null
    })

    setLoading(false)
    if (!error) {
      router.push(`/preview/${id}`)
    } else {
      alert('Error: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white grid md:grid-cols-2">
      {/* LEFT PANEL */}
      <div className="p-6 space-y-5 border-r border-gray-800 overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-serif">🛠️ Builder</h2>
        
        <label className="block">
          <span className="text-sm text-gray-400">Template</span>
          <select value={state.template} onChange={e => useBuilderStore.getState().setField('template', e.target.value)}
            className="w-full mt-1 bg-gray-900 p-2 rounded border border-gray-700">
            <option value="timeline">Memory Timeline</option>
            <option value="letter">Love Letter</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-gray-400">อัปโหลดภาพ</span>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="mt-1 w-full text-sm" />
        </label>

        <textarea placeholder="พิมพ์ข้อความ (แต่ละบรรทัด = 1 ช่อง)"
          className="w-full bg-gray-900 p-3 rounded border border-gray-700 h-32"
          onChange={e => useBuilderStore.getState().setField('messages', e.target.value.split('\n').filter(Boolean))} />

        <label className="block">
          <span className="text-sm text-gray-400">Music URL (.mp3)</span>
          <input value={state.music} onChange={e => useBuilderStore.getState().setField('music', e.target.value)} 
            placeholder="https://..." className="w-full mt-1 bg-gray-900 p-2 rounded border border-gray-700" />
        </label>

        <div className="p-3 bg-gray-900/50 rounded space-y-2">
          <input placeholder="Share Title" value={state.share.title} 
            onChange={e => useBuilderStore.getState().setField('share', {...state.share, title: e.target.value})} 
            className="w-full bg-[#0d0d0d] p-2 rounded" />
          <input placeholder="Share Description" value={state.share.desc} 
            onChange={e => useBuilderStore.getState().setField('share', {...state.share, desc: e.target.value})} 
            className="w-full bg-[#0d0d0d] p-2 rounded" />
        </div>

        <button disabled={loading} onClick={generateLink}
          className="w-full py-3 bg-gradient-to-r from-rose-500 to-purple-600 rounded font-semibold hover:opacity-90 transition disabled:opacity-50">
          {loading ? 'กำลังสร้าง...' : '✨ Generate Link'}
        </button>
      </div>

      {/* RIGHT PANEL: Live Preview */}
      <div className="bg-black/20 p-6 overflow-y-auto">
        {state.template === 'timeline' && <MemoryTimeline {...state} />}
      </div>
    </div>
  )
}