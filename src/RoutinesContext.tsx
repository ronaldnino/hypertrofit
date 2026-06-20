// Hypertrofit · estado global de rutinas (editables por el usuario), persistido.
// Fuente única: el Plan, el editor y el logger leen de aquí. WEEK_SPLIT (asignación
// semanal de rutinas) sigue siendo constante.
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  Routine,
  Prescription,
  ROUTINES,
  WEEK_SPLIT,
} from './routines';
import {loadJSON, saveJSON, KEYS} from './storage';

const clone = (rs: Routine[]): Routine[] => JSON.parse(JSON.stringify(rs));

type RoutinesCtx = {
  ready: boolean;
  routines: Routine[];
  byId: (id: string) => Routine | undefined;
  todays: () => Routine | undefined;
  updateExercise: (
    routineId: string,
    blockIdx: number,
    itemIdx: number,
    patch: Partial<Prescription>,
  ) => void;
  addExercise: (routineId: string, blockIdx: number, item: Prescription) => void;
  removeExercise: (routineId: string, blockIdx: number, itemIdx: number) => void;
  reset: () => void;
};

const Ctx = createContext<RoutinesCtx | null>(null);

export function RoutinesProvider({children}: {children: React.ReactNode}) {
  const [ready, setReady] = useState(false);
  const [routines, setRoutines] = useState<Routine[]>(() => clone(ROUTINES));

  useEffect(() => {
    let alive = true;
    loadJSON<Routine[] | null>(KEYS.routines, null).then(data => {
      if (alive) {
        if (data && Array.isArray(data) && data.length) setRoutines(data);
        setReady(true);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (ready) saveJSON(KEYS.routines, routines);
  }, [routines, ready]);

  const byId = useCallback(
    (id: string) => routines.find(r => r.id === id),
    [routines],
  );

  const todays = useCallback(() => {
    const idx = (new Date().getDay() + 6) % 7;
    const slot = WEEK_SPLIT[idx];
    return slot?.routineId ? routines.find(r => r.id === slot.routineId) : undefined;
  }, [routines]);

  // Mutación inmutable de un ejercicio dentro de una rutina/bloque.
  const mutate = useCallback(
    (routineId: string, fn: (r: Routine) => Routine) =>
      setRoutines(prev => prev.map(r => (r.id === routineId ? fn(r) : r))),
    [],
  );

  const updateExercise = useCallback(
    (
      routineId: string,
      blockIdx: number,
      itemIdx: number,
      patch: Partial<Prescription>,
    ) =>
      mutate(routineId, r => ({
        ...r,
        blocks: r.blocks.map((b, bi) =>
          bi !== blockIdx
            ? b
            : {
                ...b,
                items: b.items.map((it, ii) =>
                  ii !== itemIdx ? it : {...it, ...patch},
                ),
              },
        ),
      })),
    [mutate],
  );

  const addExercise = useCallback(
    (routineId: string, blockIdx: number, item: Prescription) =>
      mutate(routineId, r => ({
        ...r,
        blocks: r.blocks.map((b, bi) =>
          bi !== blockIdx ? b : {...b, items: [...b.items, item]},
        ),
      })),
    [mutate],
  );

  const removeExercise = useCallback(
    (routineId: string, blockIdx: number, itemIdx: number) =>
      mutate(routineId, r => ({
        ...r,
        blocks: r.blocks.map((b, bi) =>
          bi !== blockIdx
            ? b
            : {...b, items: b.items.filter((_, ii) => ii !== itemIdx)},
        ),
      })),
    [mutate],
  );

  const reset = useCallback(() => setRoutines(clone(ROUTINES)), []);

  return (
    <Ctx.Provider
      value={{
        ready,
        routines,
        byId,
        todays,
        updateExercise,
        addExercise,
        removeExercise,
        reset,
      }}>
      {children}
    </Ctx.Provider>
  );
}

export function useRoutines(): RoutinesCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useRoutines debe usarse dentro de RoutinesProvider');
  return v;
}
