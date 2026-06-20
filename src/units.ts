// Hypertrofit · unidades de peso. Internamente TODO se guarda en kg; estas utilidades
// convierten para mostrar/introducir en la unidad elegida por el usuario.
export type Units = 'kg' | 'lb';

export const KG_PER_LB = 0.45359237;

// Valor en kg → valor en la unidad de display.
export const fromKg = (kg: number, units: Units): number =>
  units === 'lb' ? kg / KG_PER_LB : kg;

// Valor introducido en la unidad de display → kg para guardar.
export const toKg = (val: number, units: Units): number =>
  units === 'lb' ? val * KG_PER_LB : val;

export const unitLabel = (units: Units): string => (units === 'lb' ? 'LB' : 'KG');

// Incremento del stepper de carga según la unidad.
export const stepFor = (units: Units): number => (units === 'lb' ? 5 : 2.5);

// Redondea al múltiplo del incremento (para precargas convertidas).
export const roundToStep = (val: number, units: Units): number => {
  const s = stepFor(units);
  return Math.round(val / s) * s;
};
