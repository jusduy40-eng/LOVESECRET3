import { supabase } from '@/lib/supabase'
import PreviewClient from './PreviewClient'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data } = await supabase.from('surprise_pages').select('*').eq('id', params.id).single()
  if (!data) return { title: 'Not Found' }

  return {
    title: data.share_title || '💌 A Surprise For You',
    description: data.share_desc || 'Someone made something special just for you.',
    openGraph: { 
      title: data.share_title, 
      description: data.share_desc, 
      images: [{ url: data.share_image || '', width: 1200, height: 630 }] 
    },
    twitter: { 
      card: 'summary_large_image', 
      title: data.share_title, 
      description: data.share_desc, 
      images: [data.share_image || ''] 
    }
  }
}

export default async function PreviewPage({ params }: { params: { id: string } }) {
  const { data, error } = await supabase.from('surprise_pages').select('*').eq('id', params.id).single()
  if (error || !data) return <div className="text-center py-32 text-gray-400">❌ ไม่พบหน้านี้</div>

  return <PreviewClient data={data} />
}