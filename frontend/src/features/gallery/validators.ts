import * as regexes from './regexes'
import { GalleryFormData } from './types'

export function validateGalleryForm(formData: FormData): RegexResult<GalleryFormData> {
  // validate name
  const name = formData.get('name') as string
  if (!regexes.name.regex.test(name)) {
    return { result: false, reason: regexes.name.condition }
  }

  // validate content
  const content = formData.get('content') as string
  if (!regexes.content.regex.test(content)) {
    return { result: false, reason: regexes.content.condition }
  }

  // validate placeId
  const placeId = formData.get('placeId') as string
  if (!regexes.placeId.regex.test(placeId)) {
    return { result: false, reason: regexes.placeId.condition }
  }

  return { result: true, data: { name, content, placeId: parseInt(placeId) } }
}

export function validateUpdateGalleryForm(formData: FormData): RegexResult<GalleryFormData> {
  // validate name
  const name = formData.get('name') as string
  if (!regexes.name.regex.test(name)) {
    return { result: false, reason: regexes.name.condition }
  }
  formData.delete('name')

  // validate content
  const content = formData.get('content') as string
  if (!regexes.content.regex.test(content)) {
    return { result: false, reason: regexes.content.condition }
  }
  formData.delete('content')

  // validate placeId
  const placeId = formData.get('placeId') as string
  if (!regexes.placeId.regex.test(placeId)) {
    return { result: false, reason: regexes.placeId.condition }
  }
  formData.delete('placeId')

  return { result: true, data: { name, content, placeId: parseInt(placeId) } }
}
