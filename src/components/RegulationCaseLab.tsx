import React, { useState } from 'react';
import { ACUERDO_009_2024_DATA } from '../data/acuerdo009_2024';
import {
  CheckCircle2,
  BookOpen,
  FileText,
  ChevronDown,
  Gavel,
  Trophy,
  ArrowRight
} from 'lucide-react';

export const RegulationCaseLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'capitulos' | 'fundamentos'>(
    'capitulos'
  );
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);

  const currentChapter =
    ACUERDO_009_2024_DATA.reglamento_anexo.capitulos[activeChapterIdx] ||
    ACUERDO_009_2024_DATA.reglamento_anexo.capitulos[0];

  return (
    <div className="space-y-8">
      {/* Top Banner: Official Title & Subtitle of Acuerdo No. 0009 de 2024 */}
      <div className="neu-surface rounded-3xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200/70 dark:border-slate-700/60 pb-6">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular font-semibold text-purple-600 dark:text-purple-400">
              <span>{ACUERDO_009_2024_DATA.titulo}</span>
              <span aria-hidden="true">·</span>
              <span>{ACUERDO_009_2024_DATA.reglamento_anexo.lugar_fecha}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
              {ACUERDO_009_2024_DATA.reglamento_anexo.titulo}
            </h3>
            <p className="text-xs text-[#5A657D] dark:text-[#94A3B8] leading-relaxed">
              {ACUERDO_009_2024_DATA.subtitulo} — Estudia aquí los 5 capítulos antes de presentar la Evaluación Gamificada unificada al final del recorrido.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-2 neu-inset rounded-2xl shrink-0 self-start">
            <button
              type="button"
              onClick={() => setActiveTab('capitulos')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'capitulos'
                  ? 'grad-accent text-white'
                  : 'text-[#5A657D] dark:text-[#94A3B8] hover:text-[#1E2433] dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Capítulos I a V (Arts. 1º–53º)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('fundamentos')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'fundamentos'
                  ? 'grad-accent text-white'
                  : 'text-[#5A657D] dark:text-[#94A3B8] hover:text-[#1E2433] dark:hover:text-white'
              }`}
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>Considerandos y Resolución</span>
            </button>

            <a
              href="#pasaporte"
              className="px-4 py-2 text-xs font-semibold rounded-xl grad-sena text-white flex items-center gap-1.5 whitespace-nowrap shadow-xs"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Ir a Evaluación (25 Preguntas)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {activeTab === 'capitulos' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-3">
              <div className="text-xs font-semibold text-[#5A657D] dark:text-[#94A3B8] mb-2">
                Estructura Oficial del Reglamento Anexo (5 Secciones Evaluables):
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md divide-y divide-white/25">
                {ACUERDO_009_2024_DATA.reglamento_anexo.capitulos.map(
                  (cap, idx) => {
                    const isSelected = idx === activeChapterIdx;
                    return (
                      <button
                        key={cap.capitulo}
                        type="button"
                        onClick={() => setActiveChapterIdx(idx)}
                        className={`w-full text-left px-5 py-4 transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'grad-accent text-white'
                            : 'bg-gradient-to-r from-indigo-500/85 via-purple-500/85 to-fuchsia-500/85 text-white/90 hover:text-white'
                        }`}
                      >
                        <div className="pr-2">
                          <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-white/80">
                            {cap.capitulo} · 5 Preguntas en Evaluación
                          </div>
                          <div className="text-sm font-semibold mt-0.5 line-clamp-2">
                            {cap.titulo}
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-white shrink-0 transition-transform duration-150 ${
                            isSelected ? 'rotate-180 scale-110' : ''
                          }`}
                        />
                      </button>
                    );
                  }
                )}
              </div>

              <div className="p-4 neu-inset rounded-2xl text-xs text-[#5A657D] dark:text-[#94A3B8] leading-relaxed">
                <strong className="text-[#1E2433] dark:text-[#F1F5F9]">
                  Vigencia:
                </strong>{' '}
                Deroga los Acuerdos 07 de 2012, 02 de 2014, 06 de 2023 y 02 de
                2024 (Art. 3º).
              </div>
            </div>

            <div className="lg:col-span-8 neu-inset rounded-3xl p-6 space-y-5">
              <div className="border-b border-slate-300/60 dark:border-slate-700/60 pb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono-tabular font-semibold text-purple-600 dark:text-purple-400">
                    {currentChapter.capitulo}
                  </span>
                  <h4 className="text-xl font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-0.5">
                    {currentChapter.titulo}
                  </h4>
                </div>
                <span className="text-xs font-mono-tabular text-indigo-600 dark:text-indigo-400 font-semibold">
                  {currentChapter.articulos.length}{' '}
                  {currentChapter.articulos.length === 1
                    ? 'bloque normativo'
                    : 'bloques de artículos'}
                </span>
              </div>

              <div className="space-y-4">
                {currentChapter.articulos.map((art, i) => (
                  <div
                    key={i}
                    className="neu-surface rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-mono-tabular font-bold text-indigo-600 dark:text-indigo-400">
                        {art.articulo}
                        {art.nombre ? ` · ${art.nombre}` : ''}
                      </span>
                      {art.numerales_totales && (
                        <span className="text-xs font-mono-tabular text-purple-600 dark:text-purple-400 font-semibold">
                          Total en el Acuerdo: {art.numerales_totales} numerales
                        </span>
                      )}
                    </div>

                    {art.contenido && (
                      <p className="text-sm text-[#1E2433] dark:text-[#F1F5F9] leading-relaxed">
                        {art.contenido}
                      </p>
                    )}

                    {art.definiciones && (
                      <div className="grid grid-cols-1 gap-3 pt-1">
                        {art.definiciones.map((def) => (
                          <div
                            key={def.numeral}
                            className="p-3.5 neu-inset rounded-xl"
                          >
                            <div className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                              {def.numeral}. {def.termino}
                            </div>
                            <p className="text-xs text-[#5A657D] dark:text-[#94A3B8] leading-relaxed mt-1">
                              {def.concepto}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {art.principios && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                        {art.principios.map((principio, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 neu-inset rounded-xl text-xs font-semibold text-[#1E2433] dark:text-[#F1F5F9]"
                          >
                            {principio}
                          </div>
                        ))}
                      </div>
                    )}

                    {(art.resumen_derechos ||
                      art.resumen_deberes ||
                      art.resumen_prohibiciones ||
                      art.etapas_ingreso ||
                      art.novedades_academicas ||
                      art.certificacion_y_reingreso ||
                      art.proceso_formativo_y_desercion ||
                      art.evaluacion_del_aprendizaje ||
                      art.resumen_disciplinario) && (
                      <ul className="space-y-2 pt-1">
                        {(
                          art.resumen_derechos ||
                          art.resumen_deberes ||
                          art.resumen_prohibiciones ||
                          art.etapas_ingreso ||
                          art.novedades_academicas ||
                          art.certificacion_y_reingreso ||
                          art.proceso_formativo_y_desercion ||
                          art.evaluacion_del_aprendizaje ||
                          art.resumen_disciplinario ||
                          []
                        ).map((bullet, bIdx) => (
                          <li
                            key={bIdx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1E2433] dark:text-[#F1F5F9]"
                          >
                            <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fundamentos' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>
                  Resolución del Consejo Directivo Nacional (Artículos 1º a 4º)
                </span>
              </div>

              <div className="space-y-3.5">
                {ACUERDO_009_2024_DATA.resolucion.map((res) => (
                  <div
                    key={res.articulo}
                    className="p-4.5 neu-inset rounded-2xl"
                  >
                    <div className="text-xs font-mono-tabular font-bold text-purple-600 dark:text-purple-400">
                      {res.articulo} · {res.nombre}
                    </div>
                    <p className="text-xs sm:text-sm text-[#1E2433] dark:text-[#F1F5F9] leading-relaxed mt-1.5">
                      {res.contenido}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 neu-inset rounded-3xl p-6 space-y-4">
              <div>
                <div className="text-xs font-mono-tabular font-semibold text-purple-600 dark:text-purple-400">
                  MARCO CONSTITUCIONAL Y LEGAL
                </div>
                <h4 className="text-lg font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-0.5">
                  10 Considerandos del Acuerdo No. 0009 de 2024
                </h4>
              </div>

              <ul className="space-y-2.5">
                {ACUERDO_009_2024_DATA.considerando.map((item, index) => (
                  <li
                    key={index}
                    className="p-3 neu-surface rounded-xl text-xs text-[#1E2433] dark:text-[#F1F5F9] leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="font-mono-tabular font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                      {String(index + 1).padStart(2, '0')}.
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
