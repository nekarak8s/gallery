import * as regexes from './regexes'

const reader = new FileReader()

export async function validatePostListForm(formData: FormData): Promise<RegexResult<FormData>> {
  const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp' /* add more as needed */]

  for (let i = 0; i < 10; i++) {
    // validate postId
    const postId = formData.get(`posts[${i}].postId`) as string
    if (!regexes.postId.regex.test(postId)) {
      return { result: false, reason: `${i + 1}번째 게시물: ${regexes.postId.condition}` }
    }

    // validate order
    const order = formData.get(`posts[${i}].order`) as string
    if (!regexes.order.regex.test(order)) {
      return { result: false, reason: `${i + 1}번째 게시물: ${regexes.order.condition}` }
    }

    // validate title
    const title = formData.get(`posts[${i}].title`) as string
    if (!regexes.title.regex.test(title)) {
      return { result: false, reason: `${i + 1}번째 게시물: ${regexes.title.condition}` }
    }

    // validate content
    const content = formData.get(`posts[${i}].content`) as string
    if (!regexes.content.regex.test(content)) {
      return { result: false, reason: `${i + 1}번째 게시물: ${regexes.content.condition}` }
    }

    // validate musicId
    const musicId = formData.get(`posts[${i}].musicId`) as string
    if (musicId && !regexes.musicId.regex.test(musicId)) {
      return { result: false, reason: `${i + 1}번째 게시물: ${regexes.musicId.condition}` }
    }

    // validate isActive
    const isActive = formData.get(`posts[${i}].isActive`) as string
    if (!regexes.isActive.regex.test(isActive)) {
      return { result: false, reason: `${i + 1}번째 게시물: ${regexes.isActive.condition}` }
    }

    // validate image File
    const file = formData.get(`posts[${i}].image`) as File
    if (!file) {
      return { result: false, reason: `${i + 1}번째 게시물: 사진 없음` }
    }
    // replace the image
    formData.delete(`posts[${i}].image`)
    if (imageMimeTypes.includes(file.type)) {
      try {
        const resizedImage = await resizeImage(file, reader)
        formData.append(`posts[${i}].image`, resizedImage)
        console.log(resizedImage, 'resie')
      } catch (e) {
        return { result: false, reason: `${i + 1}번째 게시물: 이미지 변환 실패` }
      }
    }
  }

  return {
    result: true,
    data: formData,
  }
}

async function resizeImage(file: File, reader: FileReader): Promise<File> {
  return new Promise((resolve, reject) => {
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const maxSize = 720
        let width = img.width
        let height = img.height

        // Resize the image while maintaining aspect ratio
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height

        // Crop the image to 720px * 720px
        const offsetX = (width - 720) / 2
        const offsetY = (height - 720) / 2
        ctx.drawImage(img, offsetX, offsetY, 720, 720, 0, 0, 720, 720)

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to resize and crop image.'))
            return
          }
          const resizedFile = new File([blob], file.name, {
            type: 'image/jpeg', // Change the type if necessary
            lastModified: Date.now(),
          })
          resolve(resizedFile)
        }, 'image/jpeg')
      }
      img.src = event.target!.result as string
    }

    reader.onerror = () => {
      reject(new Error('이미지 로딩 실패'))
    }

    reader.readAsDataURL(file)
  })
}
