import {
  collection,
  onSnapshot,
  query,
  Query,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  DocumentData,
  Firestore,
} from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { useFirestore } from './provider';

// A utility to stabilize the query object reference.
const useMemoizedQuery = (query: Query | null) => {
  return useMemo(() => query, [query?.path, query?.where, query?.orderBy, query?.limit]);
};

export function useCollection<T>(path: string) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const q = useMemoizedQuery(query(collection(firestore, path)));

  useEffect(() => {
    if (!q) {
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as T)
        );
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [q]);

  return { data, loading, error };
}

export const createDocument = <T extends DocumentData>(
  firestore: Firestore,
  path: string,
  data: T
) => {
  return addDoc(collection(firestore, path), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateDocument = <T extends DocumentData>(
  firestore: Firestore,
  path: string,
  id: string,
  data: T
) => {
  return updateDoc(doc(firestore, path, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteDocument = (firestore: Firestore, path: string, id: string) => {
  return deleteDoc(doc(firestore, path, id));
};
