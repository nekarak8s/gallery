import * as regexes from './regexes'
import { GalleryFormData } from './types'

export function validateGalleryForm(formData: FormData): RegexResult<GalleryFormData> {
  // validate name
  const name = formData.get('name') as string
  if (!regexes.name.reg.test(name)) {
    return { result: false, reason: regexes.name.con }
  }

  // validate content
  const content = formData.get('content') as string
  if (!regexes.content.reg.test(content)) {
    return { result: false, reason: regexes.content.con }
  }

  // validate placeId
  const placeId = formData.get('placeId') as string
  if (!regexes.placeId.reg.test(placeId)) {
    return { result: false, reason: regexes.placeId.con }
  }

  return { result: true, data: { name, content, placeId: parseInt(placeId) } }
}
