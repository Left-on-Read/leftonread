/** @jsx jsx */
import { jsx } from '@emotion/core'

type Props = {
  name: String
  text: String
}

export function TextNotification({ name, text }: Props) {
  return (
    <div
      css={{
        width: '350px',
        height: '70px',
        padding: '15px',
        backgroundColor: 'rgba(158, 158, 158, 0.3)',
        borderRadius: '10px',
        border: '1px solid #C4C4C4',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.25)',
        marginBottom: '25px',
      }}
    >
      <div
        css={{
          height: '70px',
          flex: '0 0 70px',
          borderRadius: '50%',
          backgroundColor: 'black',
        }}
      />
      <div
        css={{
          marginLeft: '15px',
          display: 'flex',
          flexDirection: 'column',
          fontSize: '16px',
        }}
      >
        <div css={{ marginBottom: '4px', fontWeight: 'bold' }}>{name}</div>
        <div>{text}</div>
      </div>
    </div>
  )
}
