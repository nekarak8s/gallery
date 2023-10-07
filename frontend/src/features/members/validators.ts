import { nickname } from './regexes'

export function validateProfileForm(formData: FormData): ValidateOutput {
  const nick = formData.get('nickname') as string
  if (!nickname.reg.test(nick)) {
    return { result: false, reason: nickname.con }
  }

  return { result: true, data: { nickname } }
}
