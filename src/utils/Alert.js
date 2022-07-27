import {Alert} from 'react-native';
import {Strings} from '../constants/Strings';

export const showAlert = (title, message, onSuccess) => {
  Alert.alert(title, message, [
    {
      text: Strings.LABELS.NO,
    },
    {
      text: Strings.LABELS.YES,
      onPress: onSuccess,
    },
  ]);
};
