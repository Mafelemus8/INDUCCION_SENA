import React, { useState } from 'react';
import {
  PROJECT_PHASES,
  DIGITAL_TOOLS,
  ProjectPhase
} from '../data/senaContent';
import {
  CheckCircle2,
  Sliders,
  Layers,
  Laptop,
  ArrowRight,
  BookOpen,
  Wrench,
  HeartHandshake,
  ChevronDown
} from 'lucide-react';

interface PedagogicalSimulatorProps {
  exploredPhases: string[];
  onExplorePhase: (phaseId: string) => void;
}

export const PedagogicalSimulator: React.FC<PedagogicalSimulatorProps> = ({
  exploredPhases,
  onExplorePhase
}) => {
  const [activePhaseId, setActivePhaseId] = useState<ProjectPhase['id']>('analisis');
  const [selectedToolId, setSelectedToolId] = useState<string>(DIGITAL_TOOLS[0].id);

  // Interactive Balance Simulator for "Saber, Saber Hacer, Saber Ser"
  const [programFocus, setProgramFocus] = useState<'industrial' | 'software' | 'agro' | 'servicios'>('software');
  const [saberWeight, setSaberWeight] = useState<number>(30);
  const [hacerWeight, setHacerWeight] = useState<number>(45);
  const [serWeight, setSerWeight] = useState<number>(25);

  const activePhase =
    PROJECT_PHASES.find((p) => p.id === activePhaseId) || PROJECT_PHASES[0];
  const activeTool =
    DIGITAL_TOOLS.find((t) => t.id === selectedToolId) || DIGITAL_TOOLS[0];

  const handlePhaseSelect = (phaseId: ProjectPhase['id']) => {
    setActivePhaseId(phaseId);
    onExplorePhase(phaseId);
  };

  const applyPresetFocus = (preset: 'industrial' | 'software' | 'agro' | 'servicios') => {
    setProgramFocus(preset);
    if (preset === 'industrial') {
      setSaberWeight(30);
      setHacerWeight(45);
      setSerWeight(25);
    } else if (preset === 'software') {
      setSaberWeight(35);
      setHacerWeight(40);
      setSerWeight(25);
    } else if (preset === 'agro') {
      setSaberWeight(25);
      setHacerWeight(45);
      setSerWeight(30);
    } else {
      setSaberWeight(30);
      setHacerWeight(35);
      setSerWeight(35);
    }
  };

  const totalPoints = saberWeight + hacerWeight + serWeight;
  const minDimension = Math.min(saberWeight, hacerWeight, serWeight);
  const isIntegralBalanced = minDimension >= 20 && totalPoints >= 90 && totalPoints <= 110;

  return (
    <div className="space-y-12">
      {/* PART 1: Interactive 4-Phase Project Learning Stepper */}
      <div className="neu-surface rounded-3xl p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/70 dark:border-slate-700/60 pb-5">
          <div>
            <p className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
              Metodología SENA · Aprender Haciendo mediante Proyectos Formativos
            </p>
            <h3 className="text-2xl font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-1">
              Las 4 Fases de tu Proyecto Formativo
            </h3>
          </div>
          <div className="text-xs font-mono-tabular font-semibold text-indigo-600 dark:text-indigo-400">
            {exploredPhases.length} / 4 fases inspeccionadas
          </div>
        </div>

        {/* Phase Stepper Buttons + Vertical Gradient Bars inspired by top-right chart in image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {PROJECT_PHASES.map((phase) => {
            const isActive = phase.id === activePhaseId;
            const isVisited = exploredPhases.includes(phase.id);
            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => handlePhaseSelect(phase.id)}
                className={`p-5 rounded-3xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'grad-accent text-white'
                    : 'neu-btn text-[#1E2433] dark:text-[#F1F5F9]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-mono-tabular font-semibold ${
                      isActive ? 'text-white/90' : 'text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    FASE {phase.number}
                  </span>
                  {isVisited && (
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : 'text-purple-600 dark:text-purple-400'
                      }`}
                    />
                  )}
                </div>
                <div className="text-base font-semibold mt-2 whitespace-nowrap truncate">
                  {phase.title}
                </div>
                <p
                  className={`text-xs mt-1.5 line-clamp-2 ${
                    isActive ? 'text-white/85' : 'text-[#5A657D] dark:text-[#94A3B8]'
                  }`}
                >
                  {phase.question}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Phase Detail Deck */}
        <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-slate-700/60 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="text-xs font-mono-tabular font-semibold text-purple-600 dark:text-purple-400">
                FASE {activePhase.number} · PREGUNTA ORIENTADORA
              </div>
              <h4 className="text-xl font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-1">
                {activePhase.question}
              </h4>
              <p className="text-sm text-[#5A657D] dark:text-[#94A3B8] leading-relaxed mt-2">
                {activePhase.summary}
              </p>
            </div>

            <div>
              <h5 className="text-xs font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
                Entregables Típicos en tu Portafolio del Aprendiz
              </h5>
              <ul className="mt-2.5 space-y-2">
                {activePhase.deliverables.map((deliv, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-[#1E2433] dark:text-[#F1F5F9]"
                  >
                    <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
                Competencias Técnicas y Transversales Integradas
              </h5>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5A657D] dark:text-[#94A3B8]">
                {activePhase.competencies.map((comp, idx) => (
                  <React.Fragment key={idx}>
                    <span>{comp}</span>
                    {idx < activePhase.competencies.length - 1 && (
                      <span aria-hidden="true">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Evidence Types Breakdown in Recessed Soft-UI Panel */}
          <div className="lg:col-span-6 neu-inset rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-300/60 dark:border-slate-700/60 pb-3">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  Matriz de Evaluación por Evidencias (Juicio: Aprobado / Deficiente)
                </span>
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>

              <p className="text-xs text-[#5A657D] dark:text-[#94A3B8] mt-3 leading-relaxed">
                En el SENA no recibes calificaciones numéricas de 1.0 a 5.0. Tus instructores evalúan tus Resultados de Aprendizaje mediante tres tipos de evidencias complementarias:
              </p>

              <div className="mt-4 space-y-3.5">
                <div className="border-l-3 border-blue-600 pl-3.5">
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    1. Evidencia de Conocimiento (El Saber)
                  </div>
                  <p className="text-xs text-[#1E2433] dark:text-[#F1F5F9] mt-0.5">
                    {activePhase.evidenceTypes.conocimiento}
                  </p>
                </div>

                <div className="border-l-3 border-purple-600 pl-3.5">
                  <div className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                    2. Evidencia de Desempeño (El Saber Hacer)
                  </div>
                  <p className="text-xs text-[#1E2433] dark:text-[#F1F5F9] mt-0.5">
                    {activePhase.evidenceTypes.desempeno}
                  </p>
                </div>

                <div className="border-l-3 border-fuchsia-600 pl-3.5">
                  <div className="text-xs font-semibold text-fuchsia-600 dark:text-fuchsia-400">
                    3. Evidencia de Producto (Resultado Tangible)
                  </div>
                  <p className="text-xs text-[#1E2433] dark:text-[#F1F5F9] mt-0.5">
                    {activePhase.evidenceTypes.producto}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-300/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-[#5A657D] dark:text-[#94A3B8]">
              <span>Registro oficial en SOFIA Plus:</span>
              <span className="font-mono-tabular font-semibold text-[#2A7D00] dark:text-[#4ADE80]">
                ● JUICIO EVALUATIVO: APROBADO (A)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PART 2: Interactive Simulator of the 3 Dimensions of FPI with Neumorphic Sliders & Wave Curve */}
      <div className="neu-surface rounded-3xl p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
                  Simulador de Equilibrio Pedagógico · Ley 119 de 1994
                </p>
                <h3 className="text-xl font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-0.5">
                  Las 3 Dimensiones de la Formación Profesional Integral
                </h3>
              </div>
              <Sliders className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>

            <p className="text-sm text-[#5A657D] dark:text-[#94A3B8] leading-relaxed">
              Desliza los controles táctiles o selecciona una vocación productiva para experimentar el equilibrio entre ciencia teórica, destreza práctica y calidad humana:
            </p>

            {/* Recessed Segmented Control inspired by reference image */}
            <div className="flex flex-wrap gap-2 p-2 neu-inset rounded-2xl w-fit">
              {(
                [
                  { id: 'software', label: 'TIC y Software' },
                  { id: 'industrial', label: 'Industria y Mecatrónica' },
                  { id: 'agro', label: 'Agroindustria y Ambiente' },
                  { id: 'servicios', label: 'Comercio y Salud' }
                ] as const
              ).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPresetFocus(preset.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    programFocus === preset.id
                      ? 'grad-accent text-white'
                      : 'text-[#5A657D] dark:text-[#94A3B8] hover:text-[#1E2433] dark:hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Tactile Sliders with Explicit Labels & Units */}
            <div className="space-y-5 pt-2">
              <div>
                <div className="flex justify-between text-xs font-medium mb-2">
                  <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    Dimensión del SABER (Conceptos, Ciencia e Investigación)
                  </span>
                  <span className="font-mono-tabular font-semibold text-blue-600 dark:text-blue-400">
                    Dedicatoria: {saberWeight}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  value={saberWeight}
                  onChange={(e) => setSaberWeight(Number(e.target.value))}
                  aria-label="Dimensión del Saber"
                  className="w-full neu-range"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-2">
                  <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                    <Wrench className="w-3.5 h-3.5" />
                    Dimensión del SABER HACER (Práctica en Taller, Laboratorio y Proyecto)
                  </span>
                  <span className="font-mono-tabular font-semibold text-purple-600 dark:text-purple-400">
                    Dedicatoria: {hacerWeight}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  value={hacerWeight}
                  onChange={(e) => setHacerWeight(Number(e.target.value))}
                  aria-label="Dimensión del Saber Hacer"
                  className="w-full neu-range"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-2">
                  <span className="flex items-center gap-1.5 text-fuchsia-600 dark:text-fuchsia-400">
                    <HeartHandshake className="w-3.5 h-3.5" />
                    Dimensión del SABER SER (Ética, Convivencia, Trabajo en Equipo y SST)
                  </span>
                  <span className="font-mono-tabular font-semibold text-fuchsia-600 dark:text-fuchsia-400">
                    Dedicatoria: {serWeight}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  value={serWeight}
                  onChange={(e) => setSerWeight(Number(e.target.value))}
                  aria-label="Dimensión del Saber Ser"
                  className="w-full neu-range"
                />
              </div>
            </div>
          </div>

          {/* Live Wave Graph & Bar Visualizer (Inspired by the smooth gradient wave chart & vertical bars in image) */}
          <div className="lg:col-span-5 neu-inset rounded-3xl p-6">
            <div className="flex items-center justify-between border-b border-slate-300/60 dark:border-slate-700/60 pb-3">
              <span className="text-xs font-semibold text-[#5A657D] dark:text-[#94A3B8]">
                Curva de Integralidad Curricular
              </span>
              <span
                className={`text-xs font-mono-tabular font-semibold ${
                  isIntegralBalanced
                    ? 'text-[#2A7D00] dark:text-[#4ADE80]'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {isIntegralBalanced ? '● EQUILIBRIO INTEGRAL' : '▲ AJUSTAR DIMENSIONES'}
              </span>
            </div>

            {/* Smooth Gradient Area Wave Chart inspired by center-left widget in reference image */}
            <div className="mt-4 h-36 w-full relative">
              <svg viewBox="0 0 300 110" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="waveAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#C026D3" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="25" x2="300" y2="25" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="0.7" />
                <line x1="0" y1="55" x2="300" y2="55" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="0.7" />
                <line x1="0" y1="85" x2="300" y2="85" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="0.7" />

                <path
                  d={`M 0 100 Q 45 ${105 - saberWeight * 1.4} 90 65 T 180 ${105 - hacerWeight * 1.4} T 270 ${105 - serWeight * 1.4} L 300 75 L 300 100 Z`}
                  fill="url(#waveAreaGrad)"
                />
                <path
                  d={`M 0 100 Q 45 ${105 - saberWeight * 1.4} 90 65 T 180 ${105 - hacerWeight * 1.4} T 270 ${105 - serWeight * 1.4} L 300 75`}
                  fill="none"
                  stroke="#9333EA"
                  strokeWidth="2.5"
                />
                <circle
                  cx="180"
                  cy={105 - hacerWeight * 1.4}
                  r="5"
                  fill="#FFFFFF"
                  stroke="#7C3AED"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            <div className="flex justify-between text-[11px] font-mono-tabular font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-2">
              <span>Saber: {Math.round((saberWeight / totalPoints) * 100)}%</span>
              <span>Hacer: {Math.round((hacerWeight / totalPoints) * 100)}%</span>
              <span>Ser: {Math.round((serWeight / totalPoints) * 100)}%</span>
            </div>

            <p className="text-xs text-[#5A657D] dark:text-[#94A3B8] leading-relaxed mt-3">
              {minDimension < 20
                ? 'Atención: Si descuidas una de las tres dimensiones por debajo del 20%, la formación pierde su carácter integral.'
                : 'Óptimo: Este balance refleja el Modelo Pedagógico del SENA entre competencias técnicas, pensamiento crítico y ética ciudadana.'}
            </p>
          </div>
        </div>
      </div>

      {/* PART 3: Digital Ecosystem Explorer (Inspired by stacked purple gradient accordion bars in reference image) */}
      <div className="neu-surface rounded-3xl p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/70 dark:border-slate-700/60 pb-4">
          <div>
            <p className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
              Plataformas Oficiales · Herramientas para tu Gestión Diaria
            </p>
            <h3 className="text-xl font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-0.5">
              Ecosistema Digital del Aprendiz SENA
            </h3>
          </div>
          <Laptop className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-start">
          {/* Stacked Gradient Accordion Bars inspired by top-center component in reference image */}
          <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-md divide-y divide-white/25">
            {DIGITAL_TOOLS.map((tool) => {
              const isSelected = tool.id === selectedToolId;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setSelectedToolId(tool.id)}
                  className={`w-full text-left px-5 py-4 transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'grad-accent text-white font-semibold'
                      : 'bg-gradient-to-r from-indigo-500/85 via-purple-500/85 to-fuchsia-500/85 text-white/90 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold">{tool.name}</div>
                    <div className="text-[11px] text-white/80 mt-0.5">
                      {tool.category}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-white transition-transform duration-150 ${
                      isSelected ? 'rotate-180 scale-110' : ''
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7 neu-inset rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                {activeTool.category}
              </div>
              <h4 className="text-xl font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-1">
                {activeTool.name}
              </h4>
              <p className="text-sm text-[#5A657D] dark:text-[#94A3B8] leading-relaxed mt-2">
                {activeTool.purpose}
              </p>

              <h5 className="text-xs font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-5">
                Gestiones Clave que Realizarás en esta Plataforma:
              </h5>
              <ul className="mt-2.5 space-y-2">
                {activeTool.keyActions.map((act, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#1E2433] dark:text-[#F1F5F9]">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-300/60 dark:border-slate-700/60 text-xs text-indigo-700 dark:text-indigo-300 font-medium">
              Recomendación de acceso: {activeTool.accessTip}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
