import React from 'react';
import { SYMBOL_HOTSPOTS, SymbolHotspot } from '../data/senaContent';
import { CheckCircle2, Compass } from 'lucide-react';

interface SenaShieldInteractiveProps {
  selectedSymbolId: string;
  onSelectSymbol: (id: string) => void;
  exploredSymbols: string[];
  isDark?: boolean;
}

export const SenaShieldInteractive: React.FC<SenaShieldInteractiveProps> = ({
  selectedSymbolId,
  onSelectSymbol,
  exploredSymbols,
  isDark = false
}) => {
  const activeSymbol: SymbolHotspot =
    SYMBOL_HOTSPOTS.find((s) => s.id === selectedSymbolId) || SYMBOL_HOTSPOTS[0];

  const gridStroke = isDark ? '#223548' : '#CBD5E1';
  const shieldFill = isDark ? '#141E2D' : '#F8FAFD';
  const shieldStroke = isDark ? '#818CF8' : '#4F46E5';
  const nodeBaseFill = isDark ? '#1A2639' : '#EEF1F6';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start neu-surface rounded-3xl p-6 lg:p-8 transition-all">
      {/* Left Column: Interactive SVG Diagram with only Escudo and Logo SENA */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full flex items-center justify-between border-b border-slate-200/70 dark:border-slate-700/60 pb-4 mb-6">
          <div>
            <p className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
              Laboratorio Simbólico · Haz clic en el Escudo o en el Logosímbolo SENA
            </p>
            <h3 className="text-xl font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-0.5">
              Anatomía de los Símbolos Institucionales
            </h3>
          </div>
          <div className="text-xs font-mono-tabular font-semibold text-indigo-600 dark:text-indigo-400">
            {exploredSymbols.length} / {SYMBOL_HOTSPOTS.length} explorados
          </div>
        </div>

        {/* Recessed Neumorphic Stage Canvas */}
        <div className="relative w-full max-w-[460px] aspect-square neu-inset rounded-3xl p-6 flex items-center justify-center transition-colors">
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full select-none"
            role="img"
            aria-label="Diagrama interactivo del Escudo y Logosímbolo del SENA"
          >
            <defs>
              <linearGradient id="symbolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="55%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#C026D3" />
              </linearGradient>
            </defs>

            {/* Subtle Coordinate Grid Lines */}
            <circle
              cx="200"
              cy="200"
              r="168"
              fill="none"
              stroke={gridStroke}
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <circle
              cx="200"
              cy="200"
              r="125"
              fill="none"
              stroke={gridStroke}
              strokeWidth="1"
            />
            <line x1="200" y1="20" x2="200" y2="380" stroke={gridStroke} strokeWidth="1" />
            <line x1="20" y1="200" x2="380" y2="200" stroke={gridStroke} strokeWidth="1" />

            {/* Outer Heraldic Shield Contour */}
            <path
              d="M200 32 L335 82 V205 C335 288 275 346 200 374 C125 346 65 288 65 205 V82 Z"
              fill={shieldFill}
              stroke="url(#symbolGrad)"
              strokeWidth="3"
            />

            {/* Horizontal Divider Line inside Shield */}
            <line x1="72" y1="200" x2="328" y2="200" stroke={gridStroke} strokeWidth="1.5" />

            {/* 1. EL ESCUDO SENA */}
            <g
              onClick={() => onSelectSymbol('piñon')}
              className="cursor-pointer transition-opacity duration-150"
              role="button"
              tabIndex={0}
              aria-label="Seleccionar El Escudo del SENA"
              onKeyDown={(e) => e.key === 'Enter' && onSelectSymbol('piñon')}
            >
              <circle
                cx="200"
                cy="118"
                r="46.4"
                fill={selectedSymbolId === 'piñon' ? 'url(#symbolGrad)' : nodeBaseFill}
                fillOpacity={selectedSymbolId === 'piñon' ? '0.2' : '1'}
                stroke={selectedSymbolId === 'piñon' ? 'url(#symbolGrad)' : shieldStroke}
                strokeWidth={selectedSymbolId === 'piñon' ? '3' : '1.5'}
              />
              <image
                href="https://www.sena.edu.co/assets/escudo-CKAC4aSg.png"
                x="161.6"
                y="79.6"
                width="76.8"
                height="76.8"
                preserveAspectRatio="xMidYMid meet"
              />
              <text
                x="200"
                y="58"
                textAnchor="middle"
                fill={shieldStroke}
                className="text-[8.8px] font-semibold"
              >
                01. ESCUDO SENA
              </text>
            </g>

            {/* 2. EL LOGOSÍMBOLO SENA */}
            <g
              onClick={() => onSelectSymbol('logosimbolo')}
              className="cursor-pointer transition-opacity duration-150"
              role="button"
              tabIndex={0}
              aria-label="Seleccionar El Logosímbolo SENA"
              onKeyDown={(e) => e.key === 'Enter' && onSelectSymbol('logosimbolo')}
            >
              <circle
                cx="200"
                cy="276"
                r="44.8"
                fill={selectedSymbolId === 'logosimbolo' ? 'url(#symbolGrad)' : shieldFill}
                stroke="url(#symbolGrad)"
                strokeWidth="3"
              />
              {/* Official SENA Logosímbolo Vector */}
              <svg
                x="168"
                y="244"
                width="64"
                height="64"
                viewBox="0 0 1000 1000"
              >
                <path
                  fill={selectedSymbolId === 'logosimbolo' ? '#FFFFFF' : '#39a900'}
                  d="M504.2,20.5c-58.3,0.1-105.6,47.4-105.5,105.8c0.1,58.3,47.4,105.6,105.7,105.6 c58.3,0,105.6-47.3,105.6-105.7V126C609.9,67.6,562.6,20.4,504.2,20.5z M155.6,264.6c-18.6,0.1-37.5,1.1-55.2,5.6 c-11.7,3-23,7.8-30.3,15.4c-9.2,9.5-10.4,22.3-5.9,33.3c4,9.7,14.8,16.9,26.8,21.1c25.9,8.9,54.6,10.7,81.8,16.3 c5,1.2,10.6,2.6,13.7,6c3.2,4.1,1.3,9.7-4,12.2c-8.8,4.5-20.1,4.5-30.4,4.4c-9.4-0.4-19.7-1.2-27.2-5.9c-5.5-3.4-6.5-9.1-5.2-14.1 l-60.6,0c-0.2,9.2,1.6,18.9,8.4,26.8c5.6,6.8,14.8,11.5,24.6,14.4c15.7,4.6,32.7,6,49.4,6.4c22.7,0.4,45.8-0.3,67.6-5.4 c13-3.2,25.8-8.3,34.1-16.6c14.8-14.8,11.3-38.3-8.3-49.8c-9.8-5.7-21.5-9.2-33.4-11.5c-17.5-3.6-35.3-6.3-52.9-9.2 c-6.2-1.2-12.8-2.3-18-5.2c-5.5-2.9-5.9-9.8-0.3-12.9c7.2-4.1,16.8-4,25.4-4c9.1,0.2,19,0.7,26.5,5c4.2,2.3,5.9,6.3,5.9,10.1 l57.6-0.1c-0.2-7.3-1.6-14.9-6.9-21.2c-6.2-7.8-17.1-12.7-28.3-15.5C192.8,265.6,174.1,264.7,155.6,264.6L155.6,264.6z M280.6,268.9 l0,137.7l168.1,0l0-30H342.3v-26.7h94.9v-29.3h-94.9l0-21.9l102.6,0l-0.1-29.7L280.6,268.9z M557.5,269c0,0-51.9,0-77.9,0l0,137.7 l59,0l0-92.7l80.8,92.6l81,0.1l0-137.7l-59.1,0l0.1,92L557.5,269z M805.6,269.2c0,0-63.6,91.9-95.6,137.7l61.9,0l14.9-24.8h95.7 l13.9,24.9l68.8,0L874,269.2L805.6,269.2z M836.6,302.1l29.4,49.9l-60.7,0.1L836.6,302.1z M10.6,445.6l0.5,75l280.1-1 c14.3,3.1,22.6,12.4,19.7,33.5L138.6,854.7l56.1,52.5l266.9-461.6L10.6,445.6z M545.2,446.2l262.4,459.6l58-52.1L691.3,552.9 c-2.9-21.2,5.4-30.6,19.7-33.7l280.2,1l-0.1-73.7L545.2,446.2z M500.9,522.3L254.8,944.7l65.4,31.9L484.4,699 c5.7-4.6,11.4-7.1,17.1-7.3c6-0.2,12.2,2,18.3,6.8l163.8,278.4l67.4-35.2L500.9,522.3z"
                />
              </svg>
              <text
                x="200"
                y="336"
                textAnchor="middle"
                fill={shieldStroke}
                className="text-[8.8px] font-semibold"
              >
                02. LOGOSÍMBOLO SENA
              </text>
            </g>
          </svg>
        </div>

        {/* 2 Tactile Selector Buttons Below Diagram */}
        <div className="grid grid-cols-2 gap-4 w-full mt-6">
          {SYMBOL_HOTSPOTS.map((item, idx) => {
            const isSelected = item.id === selectedSymbolId;
            const isDone = exploredSymbols.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSymbol(item.id)}
                className={`px-4 py-3.5 rounded-2xl text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'grad-accent text-white'
                    : 'neu-btn text-[#1E2433] dark:text-[#F1F5F9]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-mono-tabular opacity-80">
                    0{idx + 1}
                  </span>
                  {isDone && (
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        isSelected ? 'text-white' : 'text-purple-600 dark:text-purple-400'
                      }`}
                    />
                  )}
                </div>
                <span className="text-xs sm:text-sm font-semibold mt-1.5 truncate w-full">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Option-Card Style Symbol Inspector */}
      <div className="lg:col-span-5 flex flex-col justify-between h-full">
        <div className="neu-surface rounded-3xl overflow-hidden">
          <div className="grad-accent px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
              <Compass className="w-4 h-4 shrink-0" />
              <span>{activeSymbol.sector}</span>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <h4 className="text-2xl font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
              {activeSymbol.name}
            </h4>

            <div>
              <h5 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                Significado Heráldico e Institucional
              </h5>
              <p className="text-sm text-[#1E2433] dark:text-[#F1F5F9] leading-relaxed mt-1.5">
                {activeSymbol.meaning}
              </p>
            </div>

            <div className="border-t border-slate-200/70 dark:border-slate-700/60 pt-4">
              <h5 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                Articulación con Centros y Programas SENA
              </h5>
              <p className="text-sm text-[#1E2433] dark:text-[#F1F5F9] leading-relaxed mt-1.5">
                {activeSymbol.institutionalConnection}
              </p>
            </div>

            <div className="neu-inset rounded-2xl p-4">
              <h5 className="text-xs font-semibold text-[#5A657D] dark:text-[#94A3B8]">
                Valor en el Proyecto de Vida del Aprendiz
              </h5>
              <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mt-1">
                “{activeSymbol.valuePrinciple}”
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 px-2 flex items-center justify-between text-xs text-[#5A657D] dark:text-[#94A3B8]">
          <span>Bandera SENA: Fondo blanco de paz con el escudo en el centro</span>
          <span className="font-mono-tabular text-[#39A900] dark:text-[#4ADE80] font-semibold">
            #39A900
          </span>
        </div>
      </div>
    </div>
  );
};
