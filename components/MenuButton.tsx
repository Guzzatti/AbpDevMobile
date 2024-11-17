import Feather from '@expo/vector-icons/Feather';

import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'types';

function MenuButton() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View>
      <TouchableOpacity
        style={{ padding: 10 }}
        onPress={() => {
          navigation.navigate('MenuScreen');
        }}>
        <Feather name="menu" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

export default MenuButton;
