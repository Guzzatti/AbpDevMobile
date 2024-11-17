export type Event = {
  id: string;
  title: string;
  description: string;
  date: string; // Formato de data
  time: string; // Formato de hora
  latitude: number;
  longitude: number;
  isPublic: boolean;
  user: string; // ID do usuário que criou o evento
  images?: string[]; // Array de URLs de imagens
};

export type LocationType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type UserType = {
  id: string;
  username: string;
  email: string;
  profileImageUrl: string;
  following: string[]; // Array de IDs dos usuários seguidos
  followers: string[]; // Array de IDs dos seguidores
  recentSearches: string[]; // Array de IDs dos usuários pesquisados recentemente
};

export type RootStackParamList = {
  AddEventModal: undefined;
  CreateAccountScreen: undefined;
  EditProfileScreen: undefined;
  FeedScreen: undefined;
  LoginScreen: undefined;
  MapScreen: undefined;
  MyProfileScreen: undefined;
  SearchScreen: undefined;
  EventModal: { event: Event };
  SelectedUserProfile: { id: string; username: string; email: string; profileImageUrl: string };
  MenuScreen: undefined;
};
