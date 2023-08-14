import { styled } from 'nativewind'
import { ImageBackground, Text } from 'react-native'
import blurBg from '../src/assets/bg-blur.png'
import StripesSvg from '../src/assets/stripes.svg'
import {
    useFonts, 
    Roboto_400Regular, 
    Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { BaiJamjuree_700Bold} from '@expo-google-fonts/bai-jamjuree'
 

import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'


const StyledStripes = styled(StripesSvg)


export default function Layout() {

    const [isUserAuthenticated, setIsUserAuthenticated ] = useState<null | boolean> (null)

    const [hasLoadedFonts] = useFonts({
        Roboto_400Regular, 
        Roboto_700Bold,
        BaiJamjuree_700Bold,
    })
    
    useEffect(() => {
        SecureStore.getItemAsync('token').then(token => {
            //console.log(!!token)
            setIsUserAuthenticated(!!token)
        })

    }, [])



    if(!hasLoadedFonts){
        return <SplashScreen />
    }
    

    return (
        <ImageBackground source={blurBg} className="relative flex-1 bg-gray-900" imageStyle={{position: 'absolute', left: '-100%'}}>
            <StyledStripes className='absolute left-2'/>
            <StatusBar style="light" translucent />

            <Stack  screenOptions={{ 
                headerShown: false, 
                animation: 'flip',
                contentStyle: { backgroundColor: 'transparent' }
            }} >

                <Stack.Screen name="index" redirect={isUserAuthenticated}/>

                <Stack.Screen name="memories" />

                <Stack.Screen name="new" />
            </Stack>



        </ImageBackground>
    )
}