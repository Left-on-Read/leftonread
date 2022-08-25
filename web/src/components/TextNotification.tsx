import { Text } from '@chakra-ui/react'
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
      style={{
        width: '350px',
        height: '110px',
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
        style={{
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
        style={{
          marginLeft: '15px',
          display: 'flex',
          flexDirection: 'column',
          fontSize: '16px',
        }}
      >
        <div
          style={{
            marginBottom: '4px',
            fontWeight: 'bold',
            display: 'flex',
          }}
        >
          {name}
        </div>
        <div
          style={{
            maxHeight: '65px',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
        >
          <Text style={{ lineHeight: 1.2 }}>{text}</Text>
        </div>
      </div>
    </div>
  )
}
