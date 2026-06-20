// Hypertrofit · contexto del tipo de usuario activo (atleta / entrenador / gym).
import React, {createContext, useContext, useState} from 'react';
import {Role} from './roles';

type RoleCtx = {role: Role; setRole: (r: Role) => void};

const Ctx = createContext<RoleCtx>({role: 'athlete', setRole: () => {}});

export function RoleProvider({children}: {children: React.ReactNode}) {
  const [role, setRole] = useState<Role>('athlete');
  return <Ctx.Provider value={{role, setRole}}>{children}</Ctx.Provider>;
}

export const useRole = () => useContext(Ctx);
