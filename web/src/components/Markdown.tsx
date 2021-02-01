/** @jsx jsx */
import { jsx } from '@emotion/core'
import ReactMarkdown from 'react-markdown'
import { Text } from './Text'

const renderers = {
  heading: ({ level, children }: { level: number; children: string }) => {
    if (level === 1) {
      return <Text type="display">{children}</Text>
    } else if (level === 2) {
      return <Text type="header">{children}</Text>
    } else if (level === 3) {
      return <Text type="bold">{children}</Text>
    }

    return <Text type="paragraph">{children}</Text>
  },
  paragraph: ({ children }: { children: string }) => {
    return <Text type="paragraph">{children}</Text>
  },
  listItem: ({ children }: { children: string }) => {
    return (
      <li>
        <Text type="paragraph">{children}</Text>
      </li>
    )
  },
  thematicBreak: () => {
    return (
      <div
        css={{
          width: '100%',
          padding: '12px 0',
        }}
      />
    )
  },
}

export function Markdown({
  className,
  raw,
}: {
  className?: string
  raw: string
}) {
  return (
    <ReactMarkdown className={className} renderers={renderers}>
      {raw}
    </ReactMarkdown>
  )
}
