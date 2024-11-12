import { View, Text, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import uuid from 'react-native-uuid';
import useAppSelector from './useAppSelector';

export default function useSocket() {

    const [socket,setSocket] = useState<WebSocket | null >(null);
    const wsURL = process.env.EXPO_PUBLIC_WS_URL;
    const token = useAppSelector(state=>state.auth.token);

    useEffect(()=>{
        if(!wsURL) {
            console.log("invalid ws url");
            return ;
        }
        
        const ws = new WebSocket(`${wsURL}?token=${token}`)

        ws.onopen = ()=>{
            // console.log("connected");
            setSocket(ws);
        }

        ws.onerror = (err)=>{
            console.log(err)
        }

        ws.onclose = ()=>{
            setSocket(null);
        }

        return ()=>{
            ws.close();
        }

    },[])

  return socket;
}