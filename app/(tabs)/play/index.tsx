import PrimaryButton from "@/components/buttons/PrimaryButton";
import { black500 } from "@/utils/colors";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
// import * as AuthSession from 'expo-auth-session';
import { setAuth } from "@/features/authSlice";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";

export default function index() {
  const [loginModal, setLoginModal] = useState(false);
  const backendURL = process.env.EXPO_PUBLIC_BACKEND_URL;
  const dipatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const startGame = () => {
    if (token) {
      router.push({
        pathname: "/[gameId]",
        params: {
          gameId: "start",
        },
      });
    } else {
      setLoginModal(true);
    }
  };

  const checkGame = async ()=>{
    const gameId = await AsyncStorage.getItem("gameId");
    if(gameId) {
      router.push({
        pathname: "/[gameId]",
        params: {
          gameId,
        },
      });
    }
  }

  // useEffect(()=>{
  //   checkGame();
  // },[])

  useEffect(() => {
    Linking.addEventListener("url", (event) => {
      const parsedUrl = Linking.parse(event.url);
      if (!parsedUrl) {
        return;
      }
      if (parsedUrl.queryParams?.user) {
        try {
          const user = JSON.parse(
            parsedUrl.queryParams.user as string
          );
          dipatch(setAuth(user));
          AsyncStorage.setItem('user',JSON.stringify(user));
          router.push({
            pathname: "/[gameId]",
            params: {
              gameId: "start",
            },
          });
        } catch (error) {
          console.error("Failed to parse user info:", error);
        }
      }
    });
  }, []);

  const handleModalClose = () => {
    setLoginModal(false);
  };

  const signInWithGoogle = async () => {
    if(Platform.OS === "web"){
      Linking.openURL(`${backendURL}/auth/google?platform=web`);
    } else {
      Linking.openURL(`${backendURL}/auth/google?platform=mobile`);
    }
    handleModalClose();
  };

  return (
    <SafeAreaView style={{ backgroundColor: black500, height: "100%" }}>
      <View style={{ padding: 0 }}>
        <PrimaryButton
          label="Start Game"
          onClick={() => {
            startGame();
          }}
        />
      </View>
      {/* <CustomModal
        visible={loginModal}
        onClose={handleModalClose}
        hasClose={true}
        makeItemsCenter={true}
      >
        <TouchableOpacity onPress={signInWithGoogle}>
          <Text>Sign in with Google</Text>
        </TouchableOpacity>
      </CustomModal> */}
    </SafeAreaView>
  );
}
