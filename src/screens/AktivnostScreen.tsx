import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Aktivnost, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Aktivnost'> & {
  onSave: (aktivnost: Aktivnost) => void;
  onDelete: (id: string) => void;
};

export default function AktivnostScreen({
  navigation,
  route,
  onSave,
  onDelete,
}: Props) {
  const obstojeca = route.params?.aktivnost;
  const { width } = useWindowDimensions();

  const [naslov, setNaslov] = useState(obstojeca ? obstojeca.naslov : '');
  const [predmet, setPredmet] = useState(obstojeca ? obstojeca.predmet : '');
  const [rok, setRok] = useState(obstojeca ? obstojeca.rok : '');
  const [opis, setOpis] = useState(obstojeca ? obstojeca.opis : '');
  const [napaka, setNapaka] = useState('');

  function shrani() {
    if (naslov.trim().length < 2) {
      setNapaka('Naslov mora imeti vsaj 2 znaka.');
      return;
    }
    if (predmet.trim() === '') {
      setNapaka('Vnesi ime predmeta.');
      return;
    }

    setNapaka('');

    const novaAktivnost: Aktivnost = {
      id: obstojeca ? obstojeca.id : Date.now().toString(),
      naslov: naslov.trim(),
      predmet: predmet.trim(),
      rok: rok.trim(),
      opis: opis.trim(),
      opravljeno: obstojeca ? obstojeca.opravljeno : false,
    };

    onSave(novaAktivnost);
    navigation.goBack();
  }

  function potrdiBrisanje() {
    if (!obstojeca) return;
    Alert.alert(
      'Izbriši aktivnost',
      'Ali res želiš izbrisati to aktivnost?',
      [
        { text: 'Prekliči', style: 'cancel' },
        {
          text: 'Izbriši',
          style: 'destructive',
          onPress: () => {
            onDelete(obstojeca.id);
            navigation.goBack();
          },
        },
      ]
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.vsebina,
        width > 600 && styles.sirokZaslon,
      ]}
    >
      <Text style={styles.oznaka}>Naslov *</Text>
      <TextInput
        style={styles.vnos}
        placeholder="npr. Domača naloga iz matematike"
        value={naslov}
        onChangeText={setNaslov}
      />

      <Text style={styles.oznaka}>Predmet *</Text>
      <TextInput
        style={styles.vnos}
        placeholder="npr. Matematika"
        value={predmet}
        onChangeText={setPredmet}
      />

      <Text style={styles.oznaka}>Rok oddaje</Text>
      <TextInput
        style={styles.vnos}
        placeholder="npr. 28. 11. 2026"
        value={rok}
        onChangeText={setRok}
      />

      <Text style={styles.oznaka}>Opis</Text>
      <TextInput
        style={[styles.vnos, styles.vecVrstic]}
        placeholder="Dodatne opombe..."
        value={opis}
        onChangeText={setOpis}
        multiline
      />

      {napaka ? <Text style={styles.napaka}>{napaka}</Text> : null}

      <TouchableOpacity style={styles.shraniGumb} onPress={shrani}>
        <Text style={styles.gumbTekst}>
          {obstojeca ? 'Shrani spremembe' : 'Dodaj aktivnost'}
        </Text>
      </TouchableOpacity>

      {obstojeca ? (
        <TouchableOpacity style={styles.izbrisiGumb} onPress={potrdiBrisanje}>
          <Text style={styles.gumbTekst}>Izbriši aktivnost</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  vsebina: {
    padding: 16,
    width: '100%',
    alignSelf: 'center',
  },
  sirokZaslon: {
    maxWidth: 600,
  },
  oznaka: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  vnos: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  vecVrstic: {
    height: 90,
    textAlignVertical: 'top',
  },
  napaka: {
    color: '#dc2626',
    fontSize: 14,
    marginTop: 10,
    fontWeight: '500',
  },
  shraniGumb: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  izbrisiGumb: {
    backgroundColor: '#dc2626',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  gumbTekst: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
