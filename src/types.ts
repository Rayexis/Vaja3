export type Aktivnost = {
  id: string;
  naslov: string;
  predmet: string;
  rok: string;
  opis: string;
  opravljeno: boolean;
};

export type RootStackParamList = {
  Domov: undefined;
  Aktivnost: { aktivnost?: Aktivnost } | undefined;
};
