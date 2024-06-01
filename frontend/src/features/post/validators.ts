import * as regexes from './regexes'

export async function validatePostListForm(formData: FormData): Promise<RegexResult<FormData>> {
  const imageMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp' /* add more as needed */]
  const reader = new FileReader()

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
    if (imageMimeTypes.includes(file.type)) {
      try {
        const resizedImage = await resizeImage(file, reader)
        formData.delete(`posts[${i}].image`)
        formData.append(`posts[${i}].image`, resizedImage)
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
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image()
      img.src = event.target?.result as string

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        const width = 800
        const height = 800

        const distance = img.width < img.height ? img.width : img.height

        canvas.width = width
        canvas.height = height

        ctx?.drawImage(
          img,
          img.width / 2 - distance / 2,
          img.height / 2 - distance / 2,
          img.width / 2 + distance / 2,
          img.height / 2 + distance / 2,
          0,
          0,
          width,
          height
        )

        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, { type: file.type })
            resolve(resizedFile)
          } else {
            reject(new Error('이미지 변환 실패'))
          }
        }, file.type)
      }
    }

    reader.onerror = () => {
      reject(new Error('이미지 로딩 실패'))
    }

    reader.readAsDataURL(file)
  })
}
