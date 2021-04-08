import Image from 'next/image'

import { belowBreakpoint } from '../theme'
import { Avatar } from './types'

type Props = {
  name: string
  text: string
  avatar: Avatar
}

export function TextNotification({ name, text, avatar }: Props) {
  return (
    <div
      css={{
        width: '350px',
        height: '74px',
        padding: '15px',
        backgroundColor: 'rgba(158, 158, 158, 0.3)',
        borderRadius: '10px',
        border: '1px solid #C4C4C4',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.25)',
        marginBottom: '25px',
        [belowBreakpoint.sm]: {
          width: '90%',
        },
      }}
    >
      <div
        css={{
          height: '70px',
          flex: '0 0 70px',
          borderRadius: '50%',
          backgroundColor: avatar.color,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image height={'60px'} width={'60px'} src={avatar.source} />
      </div>
      <div
        css={{
          marginLeft: '15px',
          display: 'flex',
          flexDirection: 'column',
          fontSize: '16px',
        }}
      >
        <div
          css={{
            marginBottom: '4px',
            fontWeight: 'bold',
            display: 'flex',
          }}
        >
          {name}
        </div>
        <div
          css={{
            maxHeight: '65px',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
        >
          {text}
        </div>
      </div>
    </div>
  )
}
