import {useEffect, useRef} from 'react';
import database from '@react-native-firebase/database';

export const useFirebaseDb = groupId => {
  const ref = useRef(null);
  useEffect(() => {
    database().setPersistenceEnabled(true);
    ref.current = database().ref(`/group/${groupId}`);
  }, [groupId]);

  return {db: ref.current};
};
