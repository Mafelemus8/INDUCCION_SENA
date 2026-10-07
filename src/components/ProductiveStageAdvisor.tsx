import React, { useState } from 'react';
import { PRODUCTIVE_ALTERNATIVES, ProductiveAlternative } from '../data/senaContent';
import { Compass, CheckCircle2, Briefcase, ChevronRight } from 'lucide-react';

interface ProductiveStageAdvisorProps {
  onSelectFavoriteAlternative: (altName: string) => void;
  selectedFavorite: string;
}

export const ProductiveStageAdvisor: React.FC<ProductiveStageAdvisorProps> = ({
  onSelectFavoriteAlternative,
  selectedFavorite
}) => {
  const [goal, setGoal] = useState<'empleo' | 'emprendimiento' | 'investigacion' | 'social'>('empleo');
  const [availability, setAvailability] = useState<'tiempo_completo' | 'flexible' | 'vinculado'>('tiempo_completo');
  const [inspectedAltId, setInspectedAltId] = useState<string>(PRODUCTIVE_ALTERNATIVES[0].id);

  const scoredAlternatives = PRODUCTIVE_ALTERNATIVES.map((alt) => {
    let score = 0;
    if (alt.matchTags.goal.includes(goal)) score += 2;
    if (alt.matchTags.availability.includes(availability)) score += 1;
    return { alt, score };
  }).sort((a, b) => b.score - a.score);

  const recommendedAlt = scoredAlternatives[0].alt;
  const activeAlt: ProductiveAlternative =
    PRODUCTIVE_ALTERNATIVES.find((a) => a.id === inspectedAltId) || recommendedAlt;

  const handleApplyFilter = (
    newGoal: 'empleo' | 'emprendimiento' | 'investigacion' | 'social',
    newAvail: 'tiempo_completo' | 'flexible' | 'vinculado'
  ) => {
    setGoal(newGoal);
    setAvailability(newAvail);
    const best = PRODUCTIVE_ALTERNATIVES.find(
      (a) => a.matchTags.goal.includes(newGoal) && a.matchTags.availability.includes(newAvail)
    ) || PRODUCTIVE_ALTERNATIVES.find((a) => a.matchTags.goal.includes(newGoal));
    if (best) {
      setInspectedAltId(best.id);
    }
  };

  return (
    <div className="neu-surface rounded-3xl p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/70 dark:border-slate-700/60 pb-5">
        <div>
          <p className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
            Proyección al Egreso · De la Etapa Lectiva al Mundo Real
          </p>
          <h3 className="text-2xl font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-1">
            Orientador Interactivo de Alternativas de Etapa Productiva
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
          <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>5 Modalidades Oficiales Certificables</span>
        </div>
      </div>

      {/* Interactive Filter Controls in Recessed Soft-UI Track */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-5 neu-inset rounded-3xl">
        <div>
          <label className="block text-xs font-semibold text-[#1E2433] dark:text-[#F1F5F9] mb-2.5">
            1. ¿Cuál es tu meta principal al iniciar tu Etapa Productiva?
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {(
              [
                { id: 'empleo', label: 'Inmersión en Empresa' },
                { id: 'emprendimiento', label: 'Crear Negocio Propio' },
                { id: 'investigacion', label: 'Innovación / SENNOVA' },
                { id: 'social', label: 'Impacto Social / Monitoría' }
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleApplyFilter(item.id, availability)}
                className={`px-3.5 py-2.5 text-xs font-semibold rounded-xl text-left transition-all whitespace-nowrap truncate cursor-pointer ${
                  goal === item.id
                    ? 'grad-accent text-white'
                    : 'neu-btn text-[#1E2433] dark:text-[#F1F5F9]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1E2433] dark:text-[#F1F5F9] mb-2.5">
            2. ¿Cuál es tu situación o disponibilidad actual de tiempo?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {(
              [
                { id: 'tiempo_completo', label: 'Tiempo Completo' },
                { id: 'vinculado', label: 'Ya Trabajo en el Área' },
                { id: 'flexible', label: 'Autogestión / Turnos' }
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleApplyFilter(goal, item.id)}
                className={`px-3.5 py-2.5 text-xs font-semibold rounded-xl text-left transition-all whitespace-nowrap truncate cursor-pointer ${
                  availability === item.id
                    ? 'grad-sena text-white'
                    : 'neu-btn text-[#1E2433] dark:text-[#F1F5F9]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Comparison & Detail Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left List of 5 Alternatives styled like soft tactile buttons on right column of reference image */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-[#5A657D] dark:text-[#94A3B8] mb-2">
            Explora todas las modalidades reglamentarias:
          </div>
          {scoredAlternatives.map(({ alt, score }) => {
            const isSelected = alt.id === activeAlt.id;
            const isTopMatch = score >= 2;
            const isChosenForPassport = selectedFavorite === alt.name;
            return (
              <button
                key={alt.id}
                type="button"
                onClick={() => setInspectedAltId(alt.id)}
                className={`w-full text-left px-5 py-4 rounded-2xl transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'grad-accent text-white'
                    : 'neu-btn text-[#1E2433] dark:text-[#F1F5F9]'
                }`}
              >
                <div className="pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{alt.name}</span>
                    {isChosenForPassport && (
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? 'text-white' : 'text-[#2A7D00] dark:text-[#4ADE80]'
                        }`}
                      />
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-2 text-xs mt-1 ${
                      isSelected ? 'text-white/85' : 'text-[#5A657D] dark:text-[#94A3B8]'
                    }`}
                  >
                    <span>{alt.normativeFrame}</span>
                    {isTopMatch && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span
                          className={`font-semibold ${
                            isSelected ? 'text-white' : 'text-purple-600 dark:text-purple-400'
                          }`}
                        >
                          Alta afinidad
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-[#5A657D]'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Detailed Specification Card with Option-Header Cap */}
        <div className="lg:col-span-7 neu-surface rounded-3xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="grad-accent px-6 py-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono-tabular text-white/85">
                  {activeAlt.normativeFrame}
                </div>
                <h4 className="text-xl font-semibold text-white mt-0.5">
                  {activeAlt.name}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => onSelectFavoriteAlternative(activeAlt.name)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  selectedFavorite === activeAlt.name
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'bg-black/25 hover:bg-black/40 text-white border border-white/30'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                {selectedFavorite === activeAlt.name
                  ? 'Seleccionada en tu Pasaporte'
                  : 'Elegir como mi Proyección'}
              </button>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-sm text-[#1E2433] dark:text-[#F1F5F9] leading-relaxed">
                {activeAlt.description}
              </p>

              <div>
                <h5 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  Perfil Ideal del Aprendiz
                </h5>
                <p className="text-xs text-[#5A657D] dark:text-[#94A3B8] leading-relaxed mt-1">
                  {activeAlt.idealProfile}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  Requisitos y Gestión Académica
                </h5>
                <ul className="mt-2 space-y-1.5">
                  {activeAlt.requirements.map((req, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-[#1E2433] dark:text-[#F1F5F9]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200/70 dark:border-slate-700/60">
                <div className="neu-inset rounded-2xl p-4">
                  <h5 className="text-xs font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
                    Apoyo y Beneficios
                  </h5>
                  <p className="text-xs text-[#5A657D] dark:text-[#94A3B8] mt-1 leading-relaxed">
                    {activeAlt.economicSupport}
                  </p>
                </div>
                <div className="neu-inset rounded-2xl p-4">
                  <h5 className="text-xs font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
                    Seguimiento y Evaluación
                  </h5>
                  <p className="text-xs text-[#5A657D] dark:text-[#94A3B8] mt-1 leading-relaxed">
                    {activeAlt.supervisionMode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs text-[#5A657D] dark:text-[#94A3B8]">
            <span>Recuerda registrar tu alternativa con aval del Coordinador Académico</span>
            <span className="font-mono-tabular text-indigo-600 dark:text-indigo-400 font-semibold">
              Duración típica: 6 meses (864 horas)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
