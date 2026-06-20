// Hypertrofit · estado global de entrenamientos registrados, persistido en AsyncStorage.
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {CompletedSession} from './workout';
import {loadJSON, saveJSON, KEYS} from './storage';

type WorkoutCtx = {
  ready: boolean;
  sessions: CompletedSession[];
  addSession: (s: CompletedSession) => void;
  clearSessions: () => void;
};

const Ctx = createContext<WorkoutCtx | null>(null);

export function WorkoutProvider({children}: {children: React.ReactNode}) {
  const [ready, setReady] = useState(false);
  const [sessions, setSessions] = useState<CompletedSession[]>([]);

  // Carga inicial desde disco.
  useEffect(() => {
    let alive = true;
    loadJSON<CompletedSession[]>(KEYS.sessions, []).then(data => {
      if (alive) {
        setSessions(data);
        setReady(true);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  // Persistir cada cambio (tras la carga inicial).
  useEffect(() => {
    if (ready) saveJSON(KEYS.sessions, sessions);
  }, [sessions, ready]);

  const addSession = useCallback((s: CompletedSession) => {
    setSessions(prev => [s, ...prev]);
  }, []);

  const clearSessions = useCallback(() => setSessions([]), []);

  return (
    <Ctx.Provider value={{ready, sessions, addSession, clearSessions}}>
      {children}
    </Ctx.Provider>
  );
}

export function useWorkouts(): WorkoutCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useWorkouts debe usarse dentro de WorkoutProvider');
  return v;
}
