import { Turnstile } from '@marsidev/react-turnstile'

interface TurnstileCaptchaProps {
  onVerify: (token: string) => void
  onError?: () => void
  onExpire?: () => void
}

export function TurnstileCaptcha({ onVerify, onError, onExpire }: TurnstileCaptchaProps) {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

  if (!siteKey) {
    console.error('❌ Turnstile site key is missing!')
    return null
  }

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onVerify}
      onError={onError}
      onExpire={onExpire}
      options={{
        theme: 'auto', // light / dark / auto
        size: 'normal', // normal / compact
      }}
    />
  )
}