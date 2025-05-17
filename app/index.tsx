import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import * as SplashScreen from 'expo-splash-screen';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';

SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  useFrameworkReady();
  const router = useRouter();
  
  const [fontsLoaded, fontError] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/3184419/pexels-photo-3184419.jpeg?auto=compress&cs=tinysrgb&w=1600' }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={['transparent', Colors.light.overlay]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>SkillSwap</Text>
            <Text style={styles.tagline}>Échangez vos compétences</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Je propose"
              onPress={() => router.push('/(tabs)/creation-annonce')}
              type="primary"
              style={styles.button}
            />
            
            <Button
              title="Je cherche"
              onPress={() => router.push('/(tabs)/liste-services')}
              type="secondary"
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: Platform.OS === 'web' ? 100 : 60,
    paddingBottom: Platform.OS === 'web' ? 40 : 24,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    fontFamily: 'Roboto_700Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 12,
    fontFamily: 'Roboto_400Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  button: {
    marginBottom: 16,
    height: 56,
    borderRadius: 16,
  },
});