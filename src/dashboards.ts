// Hypertrofit · datos de los paneles de seguimiento por rol (entrenador / gym)
// para las pantallas Hoy, Entrenar y Progreso. El atleta usa sus propias vistas.
import {AccentKey} from './theme';
import {Role} from './roles';

export type Kpi = {label: string; val: string; unit?: string; delta?: string; up?: boolean};

export type FeedItem = {
  id: string;
  initials: string;
  accent: AccentKey;
  title: string;
  sub: string;
  right: string;
  rightLabel?: string;
  live?: boolean;
};

export type FeedSectionData = {title: string; note?: string; items: FeedItem[]};

export type DashboardData = {
  eyebrow: string;
  title: string;
  kpis: Kpi[];
  sections: FeedSectionData[];
};

// ───────────────────────── HOY ─────────────────────────
export const TODAY_DASH: Partial<Record<Role, DashboardData>> = {
  coach: {
    eyebrow: 'PANEL',
    title: 'HOY',
    kpis: [
      {label: 'ATLETAS HOY', val: '12'},
      {label: 'EN VIVO', val: '3'},
      {label: 'POR REVISAR', val: '4'},
    ],
    sections: [
      {
        title: 'EN VIVO · AHORA',
        note: '3 ACTIVOS',
        items: [
          {id: 't1', initials: 'AT', accent: 'cyan', live: true, title: 'A. Torres', sub: 'Press de Banca · Serie 3/4', right: '40%', rightLabel: 'SESIÓN'},
          {id: 't2', initials: 'LV', accent: 'cyan', live: true, title: 'L. Vega', sub: 'Sentadilla · Serie 5/6', right: '70%', rightLabel: 'SESIÓN'},
          {id: 't3', initials: 'CM', accent: 'cyan', live: true, title: 'C. Mora', sub: 'Deadlift · Serie 1/5', right: '25%', rightLabel: 'SESIÓN'},
        ],
      },
      {
        title: 'ALERTAS',
        note: '2 SEÑALES',
        items: [
          {id: 'al1', initials: 'JS', accent: 'danger', title: 'J. Solís', sub: 'Adherencia baja · 64%', right: '−3', rightLabel: 'SESIONES'},
          {id: 'al2', initials: 'MR', accent: 'warn', title: 'M. Reyes', sub: 'RPE alto sostenido · fatiga', right: '9.2', rightLabel: 'RPE PROM'},
        ],
      },
      {
        title: 'POR · REVISAR',
        note: '4 PENDIENTES',
        items: [
          {id: 'rv1', initials: 'LV', accent: 'mint', title: 'L. Vega', sub: 'Día de Pierna · completada', right: '✓', rightLabel: 'AYER'},
          {id: 'rv2', initials: 'CM', accent: 'mint', title: 'C. Mora', sub: 'Día de Empuje · completada', right: '✓', rightLabel: 'AYER'},
        ],
      },
    ],
  },
  gym: {
    eyebrow: 'CENTRO',
    title: 'HOY',
    kpis: [
      {label: 'SESIONES ACTIVAS', val: '18'},
      {label: 'ATLETAS HOY', val: '64'},
      {label: 'OCUPACIÓN', val: '72', unit: '%'},
    ],
    sections: [
      {
        title: 'ENTRENADORES · ACTIVOS',
        note: '4 EN TURNO',
        items: [
          {id: 'g1', initials: 'DO', accent: 'cyan', live: true, title: 'D. Ortega', sub: 'Fuerza · Hipertrofia', right: '3', rightLabel: 'EN VIVO'},
          {id: 'g2', initials: 'SL', accent: 'cyan', live: true, title: 'S. Lima', sub: 'Powerlifting', right: '2', rightLabel: 'EN VIVO'},
          {id: 'g3', initials: 'VC', accent: 'cyan', live: true, title: 'V. Castro', sub: 'Acondicionamiento', right: '1', rightLabel: 'EN VIVO'},
        ],
      },
      {
        title: 'ALERTAS · CENTRO',
        note: '2 SEÑALES',
        items: [
          {id: 'ga1', initials: 'SL', accent: 'warn', title: 'Equipo S. Lima', sub: 'Adherencia equipo · 71%', right: '−4%', rightLabel: 'SEMANA'},
          {id: 'ga2', initials: '18', accent: 'warn', title: 'Pico de aforo', sub: 'Sala principal · 18:00', right: '92%', rightLabel: 'CAPACIDAD'},
        ],
      },
    ],
  },
};

// ───────────────────────── ENTRENAR ─────────────────────────
export const TRAIN_DASH: Partial<Record<Role, DashboardData>> = {
  coach: {
    eyebrow: 'SEGUIMIENTO · SESIONES',
    title: 'ENTRENAR',
    kpis: [
      {label: 'EN VIVO', val: '3'},
      {label: 'PROGRAMADAS', val: '9'},
      {label: 'COMPLETADAS', val: '6'},
    ],
    sections: [
      {
        title: 'EN VIVO · AHORA',
        note: 'TOCA PARA VER',
        items: [
          {id: 'l1', initials: 'AT', accent: 'cyan', live: true, title: 'A. Torres', sub: 'Press de Banca · 142.5 kg', right: '40%', rightLabel: 'SESIÓN'},
          {id: 'l2', initials: 'LV', accent: 'cyan', live: true, title: 'L. Vega', sub: 'Sentadilla · 95 kg', right: '70%', rightLabel: 'SESIÓN'},
          {id: 'l3', initials: 'CM', accent: 'cyan', live: true, title: 'C. Mora', sub: 'Deadlift · 160 kg', right: '25%', rightLabel: 'SESIÓN'},
        ],
      },
      {
        title: 'PROGRAMADAS · HOY',
        note: '9 RESTANTES',
        items: [
          {id: 'p1', initials: 'MR', accent: 'fg3', title: 'M. Reyes', sub: 'Día de Tirón · 17:00', right: '6', rightLabel: 'EJ'},
          {id: 'p2', initials: 'JS', accent: 'fg3', title: 'J. Solís', sub: 'Día de Pierna · 18:30', right: '7', rightLabel: 'EJ'},
        ],
      },
      {
        title: 'COMPLETADAS',
        note: 'HOY',
        items: [
          {id: 'd1', initials: 'LV', accent: 'mint', title: 'L. Vega', sub: 'Día de Empuje · 58 min', right: '✓', rightLabel: 'HECHA'},
        ],
      },
    ],
  },
  gym: {
    eyebrow: 'ACTIVIDAD · EN VIVO',
    title: 'ENTRENAR',
    kpis: [
      {label: 'EN VIVO', val: '18'},
      {label: 'SALAS', val: '4'},
      {label: 'PICO', val: '18:00'},
    ],
    sections: [
      {
        title: 'EN VIVO · POR ENTRENADOR',
        note: '6 ENTRENADORES',
        items: [
          {id: 'gl1', initials: 'DO', accent: 'cyan', live: true, title: 'D. Ortega', sub: 'Sala 1 · Fuerza', right: '3', rightLabel: 'SESIONES'},
          {id: 'gl2', initials: 'SL', accent: 'cyan', live: true, title: 'S. Lima', sub: 'Sala 2 · Powerlifting', right: '2', rightLabel: 'SESIONES'},
          {id: 'gl3', initials: 'VC', accent: 'cyan', live: true, title: 'V. Castro', sub: 'Sala 3 · Cardio', right: '1', rightLabel: 'SESIONES'},
        ],
      },
      {
        title: 'SESIONES · RECIENTES',
        note: 'ÚLTIMA HORA',
        items: [
          {id: 'gr1', initials: 'AT', accent: 'mint', title: 'A. Torres', sub: 'D. Ortega · Empuje', right: '✓', rightLabel: 'HECHA'},
          {id: 'gr2', initials: 'RB', accent: 'mint', title: 'P. Díaz', sub: 'R. Bravo · Movilidad', right: '✓', rightLabel: 'HECHA'},
        ],
      },
    ],
  },
};

// ───────────────────────── PROGRESO ─────────────────────────
export type StatsTile = {label: string; val: string; unit?: string; delta: string; deltaColor: AccentKey};
export type StatsData = {
  eyebrow: string;
  title: string;
  tiles: StatsTile[];
  chartTitle: string;
  chartNote: string;
  chartColor: AccentKey;
  bars: {label: string; value: number}[];
  sections: FeedSectionData[];
};

export const STATS_DASH: Partial<Record<Role, StatsData>> = {
  coach: {
    eyebrow: 'EQUIPO · INTELIGENCIA',
    title: 'PROGRESO',
    tiles: [
      {label: 'ADHERENCIA EQUIPO', val: '86', unit: '%', delta: '+3% vs SEM ANT', deltaColor: 'mint'},
      {label: 'ATLETAS ACTIVOS', val: '12', unit: '/14', delta: '2 INACTIVOS', deltaColor: 'warn'},
      {label: 'PRs ESTE MES', val: '7', delta: '+2 vs MES ANT', deltaColor: 'mint'},
      {label: 'VOLUMEN EQUIPO', val: '142', unit: 'T', delta: '+8T vs MES ANT', deltaColor: 'mint'},
    ],
    chartTitle: 'ADHERENCIA · 8 SEMANAS',
    chartNote: '▲ tendencia al alza',
    chartColor: 'cyan',
    bars: [
      {label: 'S1', value: 74},
      {label: 'S2', value: 78},
      {label: 'S3', value: 71},
      {label: 'S4', value: 82},
      {label: 'S5', value: 80},
      {label: 'S6', value: 85},
      {label: 'S7', value: 84},
      {label: 'S8', value: 86},
    ],
    sections: [
      {
        title: 'DESTACADOS',
        note: 'MAYOR PROGRESO',
        items: [
          {id: 'top1', initials: 'LV', accent: 'mint', title: 'L. Vega', sub: 'Recomp · +4.2% e1RM', right: '95%', rightLabel: 'ADHERENCIA'},
          {id: 'top2', initials: 'AT', accent: 'mint', title: 'A. Torres', sub: 'Hipertrofia · PR banca', right: '92%', rightLabel: 'ADHERENCIA'},
        ],
      },
      {
        title: 'EN · RIESGO',
        note: 'REQUIERE ATENCIÓN',
        items: [
          {id: 'risk1', initials: 'JS', accent: 'danger', title: 'J. Solís', sub: '3 sesiones perdidas', right: '64%', rightLabel: 'ADHERENCIA'},
          {id: 'risk2', initials: 'MR', accent: 'warn', title: 'M. Reyes', sub: 'Fatiga · RPE 9.2', right: '78%', rightLabel: 'ADHERENCIA'},
        ],
      },
    ],
  },
  gym: {
    eyebrow: 'CENTRO · INTELIGENCIA',
    title: 'PROGRESO',
    tiles: [
      {label: 'ADHERENCIA GLOBAL', val: '88', unit: '%', delta: '+2% vs MES ANT', deltaColor: 'mint'},
      {label: 'RETENCIÓN', val: '94', unit: '%', delta: '+1% vs MES ANT', deltaColor: 'mint'},
      {label: 'ATLETAS', val: '142', delta: '+9 ESTE MES', deltaColor: 'mint'},
      {label: 'VOLUMEN CENTRO', val: '1.8', unit: 'kT', delta: '+6% vs MES ANT', deltaColor: 'mint'},
    ],
    chartTitle: 'ATLETAS ACTIVOS · 8 SEMANAS',
    chartNote: '▲ crecimiento sostenido',
    chartColor: 'mint',
    bars: [
      {label: 'S1', value: 118},
      {label: 'S2', value: 122},
      {label: 'S3', value: 124},
      {label: 'S4', value: 128},
      {label: 'S5', value: 131},
      {label: 'S6', value: 135},
      {label: 'S7', value: 138},
      {label: 'S8', value: 142},
    ],
    sections: [
      {
        title: 'RANKING · ENTRENADORES',
        note: 'POR ADHERENCIA',
        items: [
          {id: 'rk1', initials: 'DO', accent: 'mint', title: 'D. Ortega', sub: '14 atletas · Fuerza', right: '91%', rightLabel: 'ADHERENCIA'},
          {id: 'rk2', initials: 'VC', accent: 'mint', title: 'V. Castro', sub: '7 atletas · Cardio', right: '89%', rightLabel: 'ADHERENCIA'},
          {id: 'rk3', initials: 'RB', accent: 'cyan', title: 'R. Bravo', sub: '5 atletas · Rehab', right: '83%', rightLabel: 'ADHERENCIA'},
          {id: 'rk4', initials: 'SL', accent: 'warn', title: 'S. Lima', sub: '9 atletas · Powerlifting', right: '71%', rightLabel: 'ADHERENCIA'},
        ],
      },
    ],
  },
};
