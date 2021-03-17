export const GA_TRACKING_ID = 'UA-113056721-2'

export function pageView(url: string) {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

export function logEvent({
  action,
  category,
  label = '',
  value = 0,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}

export function logException({
  description,
  fatal,
}: {
  description?: string
  fatal?: boolean
}) {
  window.gtag('event', 'exception', {
    description,
    fatal,
  })
}
