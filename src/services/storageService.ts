import { supabase } from '@/lib/supabase'
import { updateProfile } from './profileService'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function compressImage(file: File, maxWidth = 512, maxHeight = 512, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(file)
        return
      }

      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            resolve(file)
          }
        },
        'image/webp',
        quality
      )
    }
    img.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์รูปภาพได้'))
  })
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  if (!file) {
    throw new Error('กรุณาเลือกไฟล์รูปภาพ')
  }

  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error('รองรับเฉพาะไฟล์รูปภาพประเภท JPG, PNG และ WebP เท่านั้น')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('ขนาดไฟล์ต้องไม่เกิน 2 MB')
  }

  // Compress image before upload
  const compressedBlob = await compressImage(file)
  const fileExt = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const filePath = `${userId}/avatar.${fileExt}`

  // Upload to Supabase Storage bucket "avatars"
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, compressedBlob, {
      contentType: file.type,
      upsert: true,
    })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    throw new Error(`ไม่สามารถอัปโหลดรูปภาพได้: ${uploadError.message}`)
  }

  // Get Public URL
  const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
  const avatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}` // append cache-busting timestamp

  // Update profiles table
  await updateProfile(userId, { avatar: avatarUrl })

  return avatarUrl
}
