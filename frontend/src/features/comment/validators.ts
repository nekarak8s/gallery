import * as regexes from './regexes'
import { CommentCreateFormData } from './types'

export function validateCommentCreateForm(formData: FormData): RegexResult<CommentCreateFormData> {
  // validate content
  const content = formData.get('name') as string
  if (!regexes.content.regex.test(content)) {
    return { result: false, reason: regexes.content.condition }
  }

  const postId = formData.get('postId') as string
  if (!regexes.postId.regex.test(postId)) {
    return { result: false, reason: regexes.postId.condition }
  }

  return { result: true, data: { content, postId: parseInt(postId) } }
}
