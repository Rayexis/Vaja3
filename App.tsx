import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';
import AktivnostScreen from './src/screens/AktivnostScreen';
import { Aktivnost, RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const STORAGE_KEY = 'solsko_delo_aktivnosti';

export default function App() {
  const [aktivnosti, setAktivnosti] = useState<Aktivnost[]>([]);
  const [nalozeno, setNalozeno] = useState(false);

  useEffect(() => {
    naloziPodatke();
  }, []);

  useEffect(() => {
    if (nalozeno) {
      shraniPodatke(aktivnosti);
    }
  }, [aktivnosti, nalozeno]);

  async function naloziPodatke() {
    try {
      const shranjeno = await AsyncStorage.getItem(STORAGE_KEY);
      if (shranjeno !== null) {
        setAktivnosti(JSON.parse(shranjeno));
      } else {
        setAktivnosti([
          {
            id: '1',
            naslov: 'Vaja 3 - React Native',
            predmet: 'O-IMA',
            rok: '29. 9. 2026',
            opis: 'Naredi aplikacijo z dvema zaslonoma v Expo.',
            opravljeno: false,
          },
        ]);
      }
    } catch (e) {
      console.log('Napaka pri branju:', e);
    } finally {
      setNalozeno(true);
    }
  }

  async function shraniPodatke(seznam: Aktivnost[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seznam));
    } catch (e) {
      console.log('Napaka pri shranjevanju:', e);
    }
  }

  function shraniAktivnost(nova: Aktivnost) {
    setAktivnosti((prej) => {
      const obstaja = prej.some((a) => a.id === nova.id);
      if (obstaja) {
        return prej.map((a) => (a.id === nova.id ? nova : a));
      }
      return [nova, ...prej];
    });
  }

  function izbrisiAktivnost(id: string) {
    setAktivnosti((prej) => prej.filter((a) => a.id !== id));
  }

  function preklopiOpravljeno(id: string) {
    setAktivnosti((prej) =>
      prej.map((a) => (a.id === id ? { ...a, opravljeno: !a.opravljeno } : a))
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#2563eb' },
          headerTintColor: '#ffffff',
        }}
      >
        <Stack.Screen name="Domov" options={{ title: 'Šolsko delo' }}>
          {(props) => (
            <HomeScreen
              {...props}
              aktivnosti={aktivnosti}
              onToggle={preklopiOpravljeno}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Aktivnost" options={{ title: 'Aktivnost' }}>
          {(props) => (
            <AktivnostScreen
              {...props}
              onSave={shraniAktivnost}
              onDelete={izbrisiAktivnost}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
