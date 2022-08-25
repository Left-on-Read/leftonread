import { Text } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'

const renderers = {
  heading: ({ level, children }: { level: number; children: string }) => {
    if (level === 1) {
      return <Text fontSize="3xl">{children}</Text>
    } else if (level === 2) {
      return <Text fontSize="xl">{children}</Text>
    } else if (level === 3) {
      return <Text fontSize="lg">{children}</Text>
    }

    return <Text fontSize="md">{children}</Text>
  },
  paragraph: ({ children }: { children: string }) => {
    return <Text fontSize="md">{children}</Text>
  },
  listItem: ({ children }: { children: string }) => {
    return (
      <li>
        <Text fontSize="md">{children}</Text>
      </li>
    )
  },
  thematicBreak: () => {
    return (
      <div
        style={{
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
