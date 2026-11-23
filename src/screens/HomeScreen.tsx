import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Aktivnost, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Domov'> & {
  aktivnosti: Aktivnost[];
  onToggle: (id: string) => void;
};

export default function HomeScreen({ navigation, aktivnosti, onToggle }: Props) {
  const opravljene = aktivnosti.filter((a) => a.opravljeno).length;
  const { width } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const jeSirokZaslon = width > 600;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Animated.View
        style={[
          styles.vsebina,
          jeSirokZaslon && styles.sirokZaslon,
          { opacity: fadeAnim },
        ]}
      >
        <View style={styles.povzetek}>
          <Text style={styles.naslov}>Moje šolske aktivnosti</Text>
          <Text style={styles.podnaslov}>
            Opravljeno: {opravljene} / {aktivnosti.length}
          </Text>
        </View>

        {aktivnosti.length === 0 ? (
          <View style={styles.prazno}>
            <Text style={styles.praznoTekst}>
              Trenutno nimaš dodanih aktivnosti.
            </Text>
          </View>
        ) : (
          <FlatList
            data={aktivnosti}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.seznam}
            renderItem={({ item }) => (
              <View style={styles.kartica}>
                <TouchableOpacity
                  style={styles.karticaVsebina}
                  onPress={() =>
                    navigation.navigate('Aktivnost', { aktivnost: item })
                  }
                >
                  <Text
                    style={[
                      styles.karticaNaslov,
                      item.opravljeno && styles.precrtano,
                    ]}
                  >
                    {item.naslov}
                  </Text>
                  <Text style={styles.karticaPredmet}>
                    {item.predmet} {item.rok ? '• Rok: ' + item.rok : ''}
                  </Text>
                  {item.opis ? (
                    <Text style={styles.karticaOpis}>{item.opis}</Text>
                  ) : null}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusGumb,
                    item.opravljeno
                      ? styles.statusOpravljeno
                      : styles.statusOdprto,
                  ]}
                  onPress={() => onToggle(item.id)}
                >
                  <Text style={styles.statusTekst}>
                    {item.opravljeno ? '✓' : '○'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.dodajGumb}
          onPress={() => navigation.navigate('Aktivnost')}
        >
          <Text style={styles.dodajGumbTekst}>+ Nova aktivnost</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 16,
    alignItems: 'center',
  },
  vsebina: {
    flex: 1,
    width: '100%',
  },
  sirokZaslon: {
    maxWidth: 600,
  },
  povzetek: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 14,
  },
  naslov: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  podnaslov: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  prazno: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  praznoTekst: {
    fontSize: 16,
    color: '#64748b',
  },
  seznam: {
    paddingBottom: 16,
  },
  kartica: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  karticaVsebina: {
    flex: 1,
    marginRight: 10,
  },
  karticaNaslov: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  precrtano: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  karticaPredmet: {
    fontSize: 13,
    color: '#3b82f6',
    marginTop: 3,
  },
  karticaOpis: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
  },
  statusGumb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusOpravljeno: {
    backgroundColor: '#22c55e',
  },
  statusOdprto: {
    backgroundColor: '#e2e8f0',
  },
  statusTekst: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dodajGumb: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  dodajGumbTekst: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
