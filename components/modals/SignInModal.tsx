import { View, Text } from 'react-native'
import React from 'react'

interface SignInModalProps{
    isOpen:boolean;
    onClose:()=>void;
}

export default function SignInModal() {
  return (
    <View>
      <Text>SignInModal</Text>
    </View>
  )
}