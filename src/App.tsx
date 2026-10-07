/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  HISTORICAL_MILESTONES,
  HYMN_STANZAS,
  WELFARE_DIMENSIONS
} from './data/senaContent';
import { SenaShieldInteractive } from './components/SenaShieldInteractive';
import { PedagogicalSimulator } from './components/PedagogicalSimulator';
import { RegulationCaseLab } from './components/RegulationCaseLab';
import { ProductiveStageAdvisor } from './components/ProductiveStageAdvisor';
import {
  InductionPassportSection,
  ApprenticeProfile,
  UserRoleMode
} from './components/InductionPassportSection';
import {
  Compass,
  Heart,
  CheckCircle2,
  ArrowRight,
  Music,
  Landmark,
  Moon,
  Sun,
  GraduationCap,
  ShieldAlert,
  Play,
  Square,
  Volume2
} from 'lucide-react';

const STORAGE_KEY = 'sena_induccion_progress_v1';
const THEME_STORAGE_KEY = 'sena_induccion_theme_v1';

// Melodía marcial inspirada en la cadencia del Himno del SENA para acompañamiento con Web Audio API
const HYMN_MELODY_NOTES: { freq: number; duration: number }[] = [
  { freq: 261.63, duration: 0.45 }, // C4
  { freq: 329.63, duration: 0.45 }, // E4
  { freq: 392.0, duration: 0.55 },  // G4
  { freq: 523.25, duration: 0.7 },  // C5
  { freq: 493.88, duration: 0.4 },  // B4
  { freq: 440.0, duration: 0.45 },  // A4
  { freq: 392.0, duration: 0.65 },  // G4
  { freq: 349.23, duration: 0.45 }, // F4
  { freq: 329.63, duration: 0.45 }, // E4
  { freq: 293.66, duration: 0.55 }, // D4
  { freq: 392.0, duration: 0.6 },   // G4
  { freq: 523.25, duration: 0.85 }  // C5
];

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isBlurTransitioning, setIsBlurTransitioning] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<UserRoleMode>('aprendiz');

  const [selectedSymbolId, setSelectedSymbolId] = useState<string>('logosimbolo');
  const [exploredSymbols, setExploredSymbols] = useState<string[]>(['logosimbolo']);
  const [exploredPhases, setExploredPhases] = useState<string[]>(['analisis']);
  const [exploredMilestones, setExploredMilestones] = useState<string[]>(['1957']);
  const [exploredHymnStanzas, setExploredHymnStanzas] = useState<string[]>(['coro']);
  const [exploredWelfareDims, setExploredWelfareDims] = useState<string[]>([
    WELFARE_DIMENSIONS[0].id
  ]);
  const [exploredProductive, setExploredProductive] = useState<boolean>(false);

  const [solvedQuestionsCount, setSolvedQuestionsCount] = useState<number>(0);
  const [activeMilestoneYear, setActiveMilestoneYear] = useState<string>('1957');
  const [activeHymnStanzaId, setActiveHymnStanzaId] = useState<string>('coro');
  const [activeWelfareId, setActiveWelfareId] = useState<string>(
    WELFARE_DIMENSIONS[0].id
  );

  // Interactive Hymn Audio & Karaoke Sync State
  const [isPlayingHymn, setIsPlayingHymn] = useState<boolean>(false);
  const [activeHymnLineIdx, setActiveHymnLineIdx] = useState<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const hymnTimeoutsRef = useRef<number[]>([]);

  const [profile, setProfile] = useState<ApprenticeProfile>({
    fullName: '',
    fichaNumber: '',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software',
    regionalCenter: 'Centro de Servicios Financieros · Distrito Capital',
    preferredAlternative: 'Contrato de Aprendizaje',
    personalCommitment:
      'Me comprometo a honrar la gratuidad de la formación pública del SENA con excelencia técnica, ética ciudadana y aporte al desarrollo productivo de Colombia.'
  });

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'dark') {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.exploredSymbols)) {
          setExploredSymbols(
            parsed.exploredSymbols.filter(
              (id: string) => id === 'piñon' || id === 'logosimbolo'
            )
          );
        }
        if (Array.isArray(parsed.exploredPhases)) {
          setExploredPhases(parsed.exploredPhases);
        }
        if (Array.isArray(parsed.exploredMilestones)) {
          setExploredMilestones(parsed.exploredMilestones);
        }
        if (Array.isArray(parsed.exploredHymnStanzas)) {
          setExploredHymnStanzas(parsed.exploredHymnStanzas);
        }
        if (Array.isArray(parsed.exploredWelfareDims)) {
          setExploredWelfareDims(parsed.exploredWelfareDims);
        }
        if (typeof parsed.exploredProductive === 'boolean') {
          setExploredProductive(parsed.exploredProductive);
        }
        if (typeof parsed.solvedQuestionsCount === 'number') {
          setSolvedQuestionsCount(parsed.solvedQuestionsCount);
        }
        if (parsed.profile) {
          setProfile((prev) => ({
            ...prev,
            ...parsed.profile,
            fullName:
              parsed.profile.fullName === 'Aprendiz en Inducción'
                ? ''
                : parsed.profile.fullName || '',
            fichaNumber:
              parsed.profile.fichaNumber === '2978451'
                ? ''
                : parsed.profile.fichaNumber || ''
          }));
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          exploredSymbols,
          exploredPhases,
          exploredMilestones,
          exploredHymnStanzas,
          exploredWelfareDims,
          exploredProductive,
          solvedQuestionsCount,
          profile
        })
      );
    } catch {}
  }, [
    exploredSymbols,
    exploredPhases,
    exploredMilestones,
    exploredHymnStanzas,
    exploredWelfareDims,
    exploredProductive,
    solvedQuestionsCount,
    profile
  ]);

  // Cleanup Web Audio on unmount
  useEffect(() => {
    return () => {
      stopHymnPlayback();
    };
  }, []);

  const stopHymnPlayback = () => {
    hymnTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
    hymnTimeoutsRef.current = [];
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
    setIsPlayingHymn(false);
    setActiveHymnLineIdx(null);
  };

  const handleTogglePlayHymn = () => {
    if (isPlayingHymn) {
      stopHymnPlayback();
      return;
    }

    const currentStanza =
      HYMN_STANZAS.find((h) => h.id === activeHymnStanzaId) || HYMN_STANZAS[0];

    // Mark current stanza as explored
    setExploredHymnStanzas((prev) =>
      prev.includes(currentStanza.id) ? prev : [...prev, currentStanza.id]
    );

    try {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      setIsPlayingHymn(true);
      setActiveHymnLineIdx(0);

      let elapsedSec = 0.05;
      HYMN_MELODY_NOTES.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime + elapsedSec);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + elapsedSec);
        gain.gain.exponentialRampToValueAtTime(
          0.16,
          ctx.currentTime + elapsedSec + 0.06
        );
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + elapsedSec + note.duration - 0.04
        );

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + elapsedSec);
        osc.stop(ctx.currentTime + elapsedSec + note.duration);
        elapsedSec += note.duration;
      });

      const totalMs = elapsedSec * 1000;
      const lineDurationMs = totalMs / currentStanza.lines.length;

      currentStanza.lines.forEach((_, idx) => {
        const tId = window.setTimeout(() => {
          setActiveHymnLineIdx(idx);
        }, idx * lineDurationMs);
        hymnTimeoutsRef.current.push(tId);
      });

      const endId = window.setTimeout(() => {
        stopHymnPlayback();
      }, totalMs + 150);
      hymnTimeoutsRef.current.push(endId);
    } catch {
      setIsPlayingHymn(false);
    }
  };

  const handleToggleThemeWithBlur = () => {
    setIsBlurTransitioning(true);
    setTimeout(() => {
      setIsDark((prev) => {
        const next = !prev;
        if (next) {
          document.documentElement.classList.add('dark');
          try {
            localStorage.setItem(THEME_STORAGE_KEY, 'dark');
          } catch {}
        } else {
          document.documentElement.classList.remove('dark');
          try {
            localStorage.setItem(THEME_STORAGE_KEY, 'light');
          } catch {}
        }
        return next;
      });
    }, 110);

    setTimeout(() => {
      setIsBlurTransitioning(false);
    }, 340);
  };

  const handleSelectSymbol = (id: string) => {
    setSelectedSymbolId(id);
    setExploredSymbols((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleExplorePhase = (phaseId: string) => {
    setExploredPhases((prev) =>
      prev.includes(phaseId) ? prev : [...prev, phaseId]
    );
  };

  const handleSelectMilestone = (year: string) => {
    setActiveMilestoneYear(year);
    setExploredMilestones((prev) =>
      prev.includes(year) ? prev : [...prev, year]
    );
  };

  const handleSelectHymnStanza = (stanzaId: string) => {
    if (isPlayingHymn) stopHymnPlayback();
    setActiveHymnStanzaId(stanzaId);
    setExploredHymnStanzas((prev) =>
      prev.includes(stanzaId) ? prev : [...prev, stanzaId]
    );
  };

  const handleSelectWelfareDim = (dimId: string) => {
    setActiveWelfareId(dimId);
    setExploredWelfareDims((prev) =>
      prev.includes(dimId) ? prev : [...prev, dimId]
    );
  };

  const handleUpdateProfile = (updated: Partial<ApprenticeProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleResetProgress = () => {
    stopHymnPlayback();
    setExploredSymbols(['logosimbolo']);
    setExploredPhases(['analisis']);
    setExploredMilestones(['1957']);
    setExploredHymnStanzas(['coro']);
    setExploredWelfareDims([WELFARE_DIMENSIONS[0].id]);
    setExploredProductive(false);
    setSolvedQuestionsCount(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Total Milestones across all 5 Stations + Evaluation = 46:
  // 2 Symbols + 5 Historical Milestones + 5 Hymn Stanzas + 4 Project Phases + 4 Welfare Dimensions + 1 Productive Choice + 25 Regulation Questions
  const totalMilestonesGoal = 46;
  const totalCompleted =
    exploredSymbols.length +
    exploredMilestones.length +
    exploredHymnStanzas.length +
    exploredPhases.length +
    exploredWelfareDims.length +
    (exploredProductive ? 1 : 0) +
    solvedQuestionsCount;

  const progressPercent = Math.min(
    100,
    Math.round((totalCompleted / totalMilestonesGoal) * 100)
  );
  const normativePercent = Math.min(
    100,
    Math.round((solvedQuestionsCount / 25) * 100)
  );

  // Station completion badges for the Hero quick bar (01 - 05)
  const isStation01Done =
    exploredSymbols.length >= 2 &&
    exploredMilestones.length >= 3 &&
    exploredHymnStanzas.length >= 2;
  const isStation02Done = exploredPhases.length >= 4;
  const isStation03Done = solvedQuestionsCount >= 25;
  const isStation04Done = exploredWelfareDims.length >= 4;
  const isStation05Done = exploredProductive;

  const currentMilestone =
    HISTORICAL_MILESTONES.find((m) => m.year === activeMilestoneYear) ||
    HISTORICAL_MILESTONES[0];
  const currentHymn =
    HYMN_STANZAS.find((h) => h.id === activeHymnStanzaId) || HYMN_STANZAS[0];
  const currentWelfare =
    WELFARE_DIMENSIONS.find((w) => w.id === activeWelfareId) ||
    WELFARE_DIMENSIONS[0];

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const globalStrokeDashoffset =
    circumference - (progressPercent / 100) * circumference;
  const normativeStrokeDashoffset =
    circumference - (normativePercent / 100) * circumference;

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF1F6] dark:bg-[#0E1520] text-[#1E2433] dark:text-[#F1F5F9] transition-colors duration-250">
      {/* Top Bar Contract with Neumorphic Soft-UI Bar & Role Switcher */}
      <header className="sticky top-0 z-30 bg-[#EEF1F6]/90 dark:bg-[#0E1520]/90 backdrop-blur-md border-b border-white/60 dark:border-slate-800 px-6 py-3.5 no-print transition-colors">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark with Official 63px SENA Logo */}
          <a
            href="#inicio"
            className="flex items-center gap-3 text-lg font-display font-bold tracking-tight text-[#1E2433] dark:text-[#F1F5F9] whitespace-nowrap shrink-0"
          >
            <svg
              viewBox="0 0 1000 1000"
              className="w-[63px] h-[63px] fill-[#39A900] dark:fill-[#4ADE80] shrink-0 drop-shadow-xs"
              aria-hidden="true"
            >
              <path d="M504.2,20.5c-58.3,0.1-105.6,47.4-105.5,105.8c0.1,58.3,47.4,105.6,105.7,105.6 c58.3,0,105.6-47.3,105.6-105.7V126C609.9,67.6,562.6,20.4,504.2,20.5z M155.6,264.6c-18.6,0.1-37.5,1.1-55.2,5.6 c-11.7,3-23,7.8-30.3,15.4c-9.2,9.5-10.4,22.3-5.9,33.3c4,9.7,14.8,16.9,26.8,21.1c25.9,8.9,54.6,10.7,81.8,16.3 c5,1.2,10.6,2.6,13.7,6c3.2,4.1,1.3,9.7-4,12.2c-8.8,4.5-20.1,4.5-30.4,4.4c-9.4-0.4-19.7-1.2-27.2-5.9c-5.5-3.4-6.5-9.1-5.2-14.1 l-60.6,0c-0.2,9.2,1.6,18.9,8.4,26.8c5.6,6.8,14.8,11.5,24.6,14.4c15.7,4.6,32.7,6,49.4,6.4c22.7,0.4,45.8-0.3,67.6-5.4 c13-3.2,25.8-8.3,34.1-16.6c14.8-14.8,11.3-38.3-8.3-49.8c-9.8-5.7-21.5-9.2-33.4-11.5c-17.5-3.6-35.3-6.3-52.9-9.2 c-6.2-1.2-12.8-2.3-18-5.2c-5.5-2.9-5.9-9.8-0.3-12.9c7.2-4.1,16.8-4,25.4-4c9.1,0.2,19,0.7,26.5,5c4.2,2.3,5.9,6.3,5.9,10.1 l57.6-0.1c-0.2-7.3-1.6-14.9-6.9-21.2c-6.2-7.8-17.1-12.7-28.3-15.5C192.8,265.6,174.1,264.7,155.6,264.6L155.6,264.6z M280.6,268.9 l0,137.7l168.1,0l0-30H342.3v-26.7h94.9v-29.3h-94.9l0-21.9l102.6,0l-0.1-29.7L280.6,268.9z M557.5,269c0,0-51.9,0-77.9,0l0,137.7 l59,0l0-92.7l80.8,92.6l81,0.1l0-137.7l-59.1,0l0.1,92L557.5,269z M805.6,269.2c0,0-63.6,91.9-95.6,137.7l61.9,0l14.9-24.8h95.7 l13.9,24.9l68.8,0L874,269.2L805.6,269.2z M836.6,302.1l29.4,49.9l-60.7,0.1L836.6,302.1z M10.6,445.6l0.5,75l280.1-1 c14.3,3.1,22.6,12.4,19.7,33.5L138.6,854.7l56.1,52.5l266.9-461.6L10.6,445.6z M545.2,446.2l262.4,459.6l58-52.1L691.3,552.9 c-2.9-21.2,5.4-30.6,19.7-33.7l280.2,1l-0.1-73.7L545.2,446.2z M500.9,522.3L254.8,944.7l65.4,31.9L484.4,699 c5.7-4.6,11.4-7.1,17.1-7.3c6-0.2,12.2,2,18.3,6.8l163.8,278.4l67.4-35.2L500.9,522.3z" />
            </svg>
            <span>Inducción</span>
          </a>

          {/* Zone 2: 5 clean text navigation links */}
          <nav
            aria-label="Navegación de módulos de inducción"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[#5A657D] dark:text-[#94A3B8]"
          >
            <a
              href="#identidad"
              className="hover:text-purple-600 dark:hover:text-purple-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Identidad
            </a>
            <a
              href="#pedagogia"
              className="hover:text-purple-600 dark:hover:text-purple-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Formación
            </a>
            <a
              href="#reglamento"
              className="hover:text-purple-600 dark:hover:text-purple-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Reglamento
            </a>
            <a
              href="#bienestar"
              className="hover:text-purple-600 dark:hover:text-purple-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Bienestar
            </a>
            <a
              href="#productiva"
              className="hover:text-purple-600 dark:hover:text-purple-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Etapa Productiva
            </a>
          </nav>

          {/* Zone 3: Role Switcher (Aprendiz / Instructor) + Primary Action + Neumorphic Toggle Switch */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              role="group"
              aria-label="Seleccionar rol de usuario"
              className="neu-inset p-1 rounded-full flex items-center gap-1"
            >
              <button
                type="button"
                onClick={() => setActiveRole('aprendiz')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeRole === 'aprendiz'
                    ? 'grad-sena text-white shadow-xs'
                    : 'text-[#5A657D] dark:text-[#94A3B8] hover:text-[#1E2433] dark:hover:text-[#F1F5F9]'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Aprendiz</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveRole('instructor');
                  const el = document.getElementById('pasaporte');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeRole === 'instructor'
                    ? 'grad-accent text-white shadow-xs'
                    : 'text-[#5A657D] dark:text-[#94A3B8] hover:text-[#1E2433] dark:hover:text-[#F1F5F9]'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Instructor</span>
              </button>
            </div>

            <a
              href="#pasaporte"
              className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-white grad-accent rounded-full transition-transform hover:scale-[1.02] whitespace-nowrap"
            >
              Evaluación y Pasaporte ({progressPercent}%)
            </a>

            <button
              type="button"
              onClick={handleToggleThemeWithBlur}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className={`px-3 py-1.5 rounded-full flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
                isDark ? 'grad-accent text-white' : 'neu-inset text-[#1E2433]'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 shadow-md ${
                  isDark
                    ? 'bg-white text-purple-700 translate-x-0.5'
                    : 'grad-accent text-white'
                }`}
              >
                {isDark ? (
                  <Sun className="w-3.5 h-3.5" />
                ) : (
                  <Moon className="w-3.5 h-3.5" />
                )}
              </span>
              <span className="hidden lg:inline text-xs font-semibold pr-1">
                {isDark ? 'Modo Claro' : 'Modo Oscuro'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main
        id="inicio"
        className={`flex-1 max-w-[1280px] w-full mx-auto px-6 py-10 space-y-20 theme-transition-stage ${
          isBlurTransitioning ? 'theme-blur-active' : ''
        }`}
      >
        {/* HERO SECTION WITH NEUMORPHIC CIRCULAR PROGRESS GAUGES & ACTION BAR */}
        <section className="no-print">
          {/* Operational Utility Strip (Cleaned of developer color inspector) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-8 border-b border-slate-300/70 dark:border-slate-800 text-xs text-[#5A657D] dark:text-[#94A3B8]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                Servicio Nacional de Aprendizaje · Colombia
              </span>
              <span aria-hidden="true">·</span>
              <span>Fundado el 21 de junio de 1957</span>
              <span aria-hidden="true">·</span>
              <span>Ley 119 de 1994 · Acuerdo 0009 de 2024</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono-tabular text-[#2A7D00] dark:text-[#4ADE80] font-semibold">
                33 Regionales · 117 Centros · 100% Gratuito
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-mono-tabular uppercase tracking-widest text-purple-600 dark:text-purple-400 font-semibold">
                Ruta Interactiva de Acogida e Integración Institucional
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-display font-semibold text-[#1E2433] dark:text-[#F1F5F9] leading-[1.15]">
                Descubre el valor de formarte en la institución más querida por los colombianos.
              </h1>

              <p className="text-base text-[#5A657D] dark:text-[#94A3B8] leading-relaxed">
                La inducción es el punto de partida de tu proyecto de vida en el SENA. Aquí no solo adquieres competencias técnicas para un oficio: te integras a una comunidad nacional que une la ciencia, el trabajo productivo y la ética ciudadana para transformar a Colombia.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#identidad"
                  className="px-6 py-3.5 grad-accent text-white text-sm font-semibold rounded-full transition-transform hover:scale-[1.02] flex items-center gap-2.5 whitespace-nowrap"
                >
                  <span>Iniciar Recorrido de Inducción</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#pasaporte"
                  className="px-6 py-3.5 neu-btn text-sm font-semibold text-[#1E2433] dark:text-[#F1F5F9] rounded-full whitespace-nowrap"
                >
                  Ir a Evaluación y Ranking
                </a>
              </div>
            </div>

            {/* Right Hero Panel: Dual Neumorphic Circular Progress Dials + Quick Station Bar */}
            <div className="lg:col-span-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Dial 1: Global Appropriation */}
                <div className="neu-surface rounded-3xl p-6 flex flex-col items-center justify-center">
                  <div className="relative w-36 h-36 rounded-full neu-inset flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                      <defs>
                        <linearGradient id="dialGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2563EB" />
                          <stop offset="55%" stopColor="#7C3AED" />
                          <stop offset="100%" stopColor="#EC4899" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        className="text-slate-200/70 dark:text-slate-800"
                        strokeWidth="14"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        fill="none"
                        stroke="url(#dialGrad1)"
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={globalStrokeDashoffset}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute w-20 h-20 rounded-full neu-surface flex flex-col items-center justify-center">
                      <span className="text-xl font-mono-tabular font-bold text-[#1E2433] dark:text-[#F1F5F9]">
                        {progressPercent}%
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-3 text-center">
                    Apropiación Global
                  </div>
                  <div className="text-[11px] text-[#5A657D] dark:text-[#94A3B8] font-mono-tabular">
                    {totalCompleted} de {totalMilestonesGoal} hitos
                  </div>
                </div>

                {/* Dial 2: Normative Evaluation */}
                <div className="neu-surface rounded-3xl p-6 flex flex-col items-center justify-center">
                  <div className="relative w-36 h-36 rounded-full neu-inset flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                      <defs>
                        <linearGradient id="dialGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2563EB" />
                          <stop offset="50%" stopColor="#9333EA" />
                          <stop offset="100%" stopColor="#39A900" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        className="text-slate-200/70 dark:text-slate-800"
                        strokeWidth="6"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        fill="none"
                        stroke="url(#dialGrad2)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={normativeStrokeDashoffset}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute w-22 h-22 rounded-full neu-surface flex flex-col items-center justify-center">
                      <span className="text-xl font-mono-tabular font-bold text-[#1E2433] dark:text-[#F1F5F9]">
                        {normativePercent}%
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-3 text-center">
                    Dominio Normativo
                  </div>
                  <div className="text-[11px] text-[#5A657D] dark:text-[#94A3B8] font-mono-tabular">
                    {solvedQuestionsCount} de 25 preguntas
                  </div>
                </div>
              </div>

              {/* Recessed Horizontal Station Bar with Live Completion Indicators */}
              <div className="neu-inset rounded-3xl p-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {[
                    { num: '01', href: '#identidad', label: 'Identidad e Himno', done: isStation01Done },
                    { num: '02', href: '#pedagogia', label: 'Fases del Proyecto', done: isStation02Done },
                    { num: '03', href: '#reglamento', label: 'Reglamento SENA', done: isStation03Done },
                    { num: '04', href: '#bienestar', label: 'Bienestar al Aprendiz', done: isStation04Done },
                    { num: '05', href: '#productiva', label: 'Etapa Productiva', done: isStation05Done }
                  ].map((station) => (
                    <a
                      key={station.num}
                      href={station.href}
                      title={`${station.label} (${station.done ? 'Completada' : 'En curso'})`}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-mono-tabular font-bold transition-transform hover:scale-105 ${
                        station.done
                          ? 'grad-sena text-white shadow-xs'
                          : 'neu-surface border-2 border-purple-500/60 text-indigo-600 dark:text-indigo-300'
                      }`}
                    >
                      {station.done ? '✓' : station.num}
                    </a>
                  ))}
                </div>

                <a
                  href="#pasaporte"
                  className="px-4 py-2.5 rounded-xl grad-accent text-xs font-semibold tracking-wider uppercase text-white whitespace-nowrap"
                >
                  Presentar Prueba
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* MODULE 01: PATRIMONIO, MISIÓN Y SÍMBOLOS INSTITUCIONALES */}
        <section id="identidad" className="scroll-mt-20 space-y-10 no-print">
          <div className="border-b border-slate-300/70 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono-tabular text-purple-600 dark:text-purple-400 font-semibold">
                ESTACIÓN 01 · PATRIMONIO Y SENTIDO DE PERTENENCIA
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-1">
                Nuestra Identidad: Historia, Misión y Símbolos del SENA
              </h2>
            </div>
            <p className="text-xs text-[#5A657D] dark:text-[#94A3B8] max-w-md">
              Comprender de dónde venimos y qué representan nuestros símbolos te conecta con millones de egresados que impulsan el desarrollo nacional.
            </p>
          </div>

          {/* Mission & Vision Split Soft-UI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="neu-surface rounded-3xl p-6 lg:p-7">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <Landmark className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Misión Institucional (Ley 119 de 1994)</span>
              </div>
              <p className="text-sm text-[#1E2433] dark:text-[#F1F5F9] leading-relaxed mt-3 first-letter:text-3xl first-letter:font-display first-letter:font-bold first-letter:text-purple-600 dark:first-letter:text-purple-400 first-letter:mr-1.5">
                El SENA está encargado de cumplir la función que le corresponde al Estado de invertir en el desarrollo social y técnico de los trabajadores colombianos, ofreciendo y ejecutando la formación profesional integral, para la incorporación y el desarrollo de las personas en actividades productivas que contribuyan al desarrollo social, económico y tecnológico del país.
              </p>
            </div>

            <div className="neu-surface rounded-3xl p-6 lg:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2A7D00] dark:text-[#4ADE80]">
                  <Compass className="w-4 h-4" />
                  <span>El Valor de la Naturaleza Tripartita y Gratuita</span>
                </div>
                <p className="text-sm text-[#1E2433] dark:text-[#F1F5F9] leading-relaxed mt-3">
                  El SENA funciona gracias a la alianza entre el <strong>Estado</strong>, los <strong>Trabajadores</strong> y los <strong>Empleadores</strong> (quienes aportan recursos parafiscales). Por ello, cada cupo formativo es una inversión directa de la sociedad colombiana en tu talento: ningún trámite ni programa en el SENA tiene costo ni requiere intermediarios.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-700/60 text-xs text-[#5A657D] dark:text-[#94A3B8] flex items-center justify-between">
                <span>Principio rector: Equidad social y trabajo decente</span>
                <span className="font-mono-tabular font-semibold text-purple-600 dark:text-purple-400">
                  #SENAEsColombia
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Historical Timeline */}
          <div className="neu-surface rounded-3xl p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 dark:border-slate-700/60 pb-4">
              <div>
                <p className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
                  Línea de Tiempo Interactiva · Selecciona cada hito histórico ({exploredMilestones.length}/5 explorados)
                </p>
                <h3 className="text-xl font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-0.5">
                  De 1957 al Presente: Evolución del SENA
                </h3>
              </div>
              <span className="px-3.5 py-1.5 rounded-xl neu-inset text-xs font-mono-tabular font-semibold text-purple-600 dark:text-purple-400">
                Hito activo: {currentMilestone.year}
              </span>
            </div>

            <div className="neu-inset rounded-2xl p-2 grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6">
              {HISTORICAL_MILESTONES.map((item) => {
                const isSelected = item.year === activeMilestoneYear;
                const isExplored = exploredMilestones.includes(item.year);
                return (
                  <button
                    key={item.year}
                    type="button"
                    onClick={() => handleSelectMilestone(item.year)}
                    className={`p-3 rounded-xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'grad-accent text-white shadow-md'
                        : 'hover:bg-white/50 dark:hover:bg-slate-800/50 text-[#1E2433] dark:text-[#F1F5F9]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-base font-mono-tabular font-bold ${
                          isSelected ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'
                        }`}
                      >
                        {item.year}
                      </span>
                      {isExplored && (
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${
                            isSelected ? 'text-white' : 'text-[#2A7D00] dark:text-[#4ADE80]'
                          }`}
                        />
                      )}
                    </div>
                    <div className="text-xs font-medium mt-0.5 line-clamp-1">
                      {item.title}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-6 neu-inset rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8">
                <div className="text-xs font-mono-tabular font-semibold text-purple-600 dark:text-purple-400">
                  {currentMilestone.subtitle}
                </div>
                <h4 className="text-lg font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-1">
                  {currentMilestone.year} — {currentMilestone.title}
                </h4>
                <p className="text-sm text-[#5A657D] dark:text-[#94A3B8] leading-relaxed mt-2">
                  {currentMilestone.description}
                </p>
              </div>
              <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-300/60 dark:border-slate-700/60 pt-4 lg:pt-0 lg:pl-6">
                <div className="text-xs text-[#5A657D] dark:text-[#94A3B8]">Dato de Impacto Institucional</div>
                <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                  {currentMilestone.impactMetric}
                </div>
                <div className="text-xs font-mono-tabular text-[#5A657D] dark:text-[#94A3B8] mt-2">
                  Ref: {currentMilestone.documentRef}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive SVG Shield & Logosymbol Inspector */}
          <SenaShieldInteractive
            selectedSymbolId={selectedSymbolId}
            onSelectSymbol={handleSelectSymbol}
            exploredSymbols={exploredSymbols}
            isDark={isDark}
          />

          {/* Interactive Hymn Stanza Explorer with Web Audio Synthesizer & Line Highlighting */}
          <div className="neu-surface rounded-3xl p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-700/60 pb-4">
              <div>
                <p className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
                  Reflexión Ética · Letra: Luis Alfredo Sarmiento · Música: Daniel Marlés ({exploredHymnStanzas.length}/5 estrofas exploradas)
                </p>
                <h3 className="text-xl font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-0.5">
                  Himno del SENA: Mensaje y Entonación Interactiva
                </h3>
              </div>

              <button
                type="button"
                onClick={handleTogglePlayHymn}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto ${
                  isPlayingHymn
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'grad-sena text-white shadow-sm'
                }`}
              >
                {isPlayingHymn ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Detener Melodía</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Entonar Melodía de la Estrofa</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-center">
              <div className="lg:col-span-5 space-y-3">
                {HYMN_STANZAS.map((stanza) => {
                  const isActive = stanza.id === activeHymnStanzaId;
                  const isExplored = exploredHymnStanzas.includes(stanza.id);
                  return (
                    <button
                      key={stanza.id}
                      type="button"
                      onClick={() => handleSelectHymnStanza(stanza.id)}
                      className={`w-full text-left p-4 rounded-2xl transition-all cursor-pointer ${
                        isActive
                          ? 'grad-accent text-white'
                          : 'neu-btn text-[#1E2433] dark:text-[#F1F5F9]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{stanza.label}</span>
                        {isExplored && (
                          <CheckCircle2
                            className={`w-4 h-4 ${
                              isActive ? 'text-white' : 'text-[#2A7D00] dark:text-[#4ADE80]'
                            }`}
                          />
                        )}
                      </div>
                      <div
                        className={`text-xs mt-0.5 truncate ${
                          isActive ? 'text-white/85' : 'text-[#5A657D] dark:text-[#94A3B8]'
                        }`}
                      >
                        “{stanza.lines[0]}”
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-7 neu-inset rounded-3xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono-tabular uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5" />
                    <span>{currentHymn.label}</span>
                  </span>
                  {isPlayingHymn && (
                    <span className="text-[11px] font-mono-tabular text-[#2A7D00] dark:text-[#4ADE80] font-semibold animate-pulse">
                      ♪ Reproduciendo cadencia...
                    </span>
                  )}
                </div>

                <blockquote className="border-l-3 border-purple-600 pl-4 space-y-1.5 font-display italic text-lg text-[#1E2433] dark:text-[#F1F5F9]">
                  {currentHymn.lines.map((line, i) => {
                    const isHighlighted = activeHymnLineIdx === i;
                    return (
                      <p
                        key={i}
                        className={`transition-all duration-200 rounded-lg px-2 py-0.5 ${
                          isHighlighted
                            ? 'grad-sena text-white font-semibold not-italic scale-[1.01] shadow-xs'
                            : ''
                        }`}
                      >
                        {line}
                      </p>
                    );
                  })}
                </blockquote>

                <div className="mt-5 pt-4 border-t border-slate-300/60 dark:border-slate-700/60">
                  <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Interpretación Formativa:
                  </div>
                  <p className="text-sm text-[#5A657D] dark:text-[#94A3B8] leading-relaxed mt-1">
                    {currentHymn.meaning}
                  </p>
                  <div className="mt-3 text-xs font-semibold text-purple-600 dark:text-purple-400">
                    Principio destacado: {currentHymn.keyValue}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MODULE 02: FORMACIÓN PROFESIONAL INTEGRAL Y ECOSISTEMA DIGITAL */}
        <section id="pedagogia" className="scroll-mt-20 space-y-8 no-print">
          <div className="border-b border-slate-300/70 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono-tabular text-purple-600 dark:text-purple-400 font-semibold">
                ESTACIÓN 02 · MODELO PEDAGÓGICO Y PLATAFORMAS
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-1">
                Formación Profesional Integral y Aprendizaje por Proyectos
              </h2>
            </div>
            <p className="text-xs text-[#5A657D] dark:text-[#94A3B8] max-w-md">
              Comprende cómo se estructura tu proceso formativo en Etapa Lectiva, cómo se evalúan tus Resultados de Aprendizaje y qué herramientas digitales tienes a tu disposición.
            </p>
          </div>

          <PedagogicalSimulator
            exploredPhases={exploredPhases}
            onExplorePhase={handleExplorePhase}
          />
        </section>

        {/* MODULE 03: REGLAMENTO DEL APRENDIZ Y DEBIDO PROCESO */}
        <section id="reglamento" className="scroll-mt-20 space-y-8 no-print">
          <div className="border-b border-slate-300/70 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono-tabular text-purple-600 dark:text-purple-400 font-semibold">
                ESTACIÓN 03 · CONVIVENCIA, DERECHOS Y DEBERES
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-1">
                Reglamento del Aprendiz en Acción
              </h2>
            </div>
            <p className="text-xs text-[#5A657D] dark:text-[#94A3B8] max-w-md">
              Más que una lista de normas, el Reglamento protege tu derecho a una formación de calidad, establece estímulos a la excelencia y garantiza el debido proceso.
            </p>
          </div>

          <RegulationCaseLab />
        </section>

        {/* MODULE 04: BIENESTAR AL APRENDIZ, LIDERAZGO Y APOYOS */}
        <section id="bienestar" className="scroll-mt-20 space-y-8 no-print">
          <div className="border-b border-slate-300/70 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono-tabular text-purple-600 dark:text-purple-400 font-semibold">
                ESTACIÓN 04 · ACOMPAÑAMIENTO INTEGRAL Y PERMANENCIA ({exploredWelfareDims.length}/4 dimensiones exploradas)
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-1">
                Bienestar al Aprendiz, Vocería y Apoyos Socioeconómicos
              </h2>
            </div>
            <p className="text-xs text-[#5A657D] dark:text-[#94A3B8] max-w-md">
              No estás solo en tu formación: conoce los servicios gratuitos de apoyo psicosocial, deporte, cultura, representación estudiantil y fomento a la permanencia.
            </p>
          </div>

          <div className="neu-surface rounded-3xl p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {WELFARE_DIMENSIONS.map((dim) => {
                const isSelected = dim.id === activeWelfareId;
                const isExplored = exploredWelfareDims.includes(dim.id);
                return (
                  <button
                    key={dim.id}
                    type="button"
                    onClick={() => handleSelectWelfareDim(dim.id)}
                    className={`p-4 rounded-2xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'grad-accent text-white'
                        : 'neu-btn text-[#1E2433] dark:text-[#F1F5F9]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Heart
                        className={`w-4 h-4 ${
                          isSelected ? 'text-white' : 'text-purple-600 dark:text-purple-400'
                        }`}
                      />
                      {isExplored && (
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            isSelected ? 'text-white' : 'text-[#2A7D00] dark:text-[#4ADE80]'
                          }`}
                        />
                      )}
                    </div>
                    <div className="text-sm font-semibold mt-2 line-clamp-2">
                      {dim.title}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-6 neu-inset rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-3">
                <div className="text-xs font-mono-tabular text-purple-600 dark:text-purple-400 font-semibold">
                  {currentWelfare.programHighlight}
                </div>
                <h3 className="text-xl font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
                  {currentWelfare.title}
                </h3>
                <p className="text-sm text-[#5A657D] dark:text-[#94A3B8] leading-relaxed">
                  {currentWelfare.description}
                </p>
                <div className="pt-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  ¿Cómo acceder?: {currentWelfare.contactRoute}
                </div>
              </div>

              <div className="lg:col-span-5 neu-surface rounded-2xl p-5">
                <h4 className="text-xs font-semibold text-[#1E2433] dark:text-[#F1F5F9] mb-3">
                  Beneficios y Acciones para tu Ficha:
                </h4>
                <ul className="space-y-2.5">
                  {currentWelfare.concreteServices.map((srv, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-[#1E2433] dark:text-[#F1F5F9] leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                      <span>{srv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* MODULE 05: ORIENTADOR DE ETAPA PRODUCTIVA */}
        <section id="productiva" className="scroll-mt-20 space-y-8 no-print">
          <div className="border-b border-slate-300/70 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono-tabular text-purple-600 dark:text-purple-400 font-semibold">
                ESTACIÓN 05 · APLICACIÓN REAL E INSERCIÓN PRODUCTIVA
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-1">
                Tu Ruta hacia la Etapa Productiva y Certificación
              </h2>
            </div>
            <p className="text-xs text-[#5A657D] dark:text-[#94A3B8] max-w-md">
              Todo programa titulado consta de Etapa Lectiva y Etapa Productiva. Conoce desde hoy las 5 alternativas oficiales para proyectar tu futuro profesional.
            </p>
          </div>

          <ProductiveStageAdvisor
            selectedFavorite={profile.preferredAlternative}
            onSelectFavoriteAlternative={(altName) => {
              setExploredProductive(true);
              handleUpdateProfile({ preferredAlternative: altName });
            }}
          />
        </section>

        {/* MODULE 06: EVALUACIÓN GAMIFICADA, RANKING Y PASAPORTE */}
        <section id="pasaporte" className="scroll-mt-20 space-y-8">
          <div className="border-b border-slate-300/70 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 no-print">
            <div>
              <div className="text-xs font-mono-tabular text-purple-600 dark:text-purple-400 font-semibold">
                SÍNTESIS FINAL · EVALUACIÓN UNIFICADA (25 PREGUNTAS), RANKING Y REGISTRO
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-1">
                Evaluación Gamificada del Reglamento, Ranking y Pasaporte SENA
              </h2>
            </div>
            <p className="text-xs text-[#5A657D] dark:text-[#94A3B8] max-w-md">
              Ingresa tus datos reales, responde las 5 preguntas de cada uno de los 5 Capítulos del Acuerdo 0009 de 2024 con cronómetro en vivo y guarda tu puntaje en el Ranking y en la hoja de cálculo.
            </p>
          </div>

          <InductionPassportSection
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            exploredSymbolsCount={exploredSymbols.length}
            exploredPhasesCount={exploredPhases.length}
            solvedCasesCount={solvedQuestionsCount}
            onUpdateSolvedCasesCount={setSolvedQuestionsCount}
            onResetProgress={handleResetProgress}
            activeRole={activeRole}
            onSelectRole={setActiveRole}
            globalCompletionPercentage={progressPercent}
          />
        </section>
      </main>

      {/* Quiet Institutional Footer */}
      <footer className="border-t border-white/60 dark:border-slate-800 neu-surface py-8 px-6 mt-16 no-print">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5A657D] dark:text-[#94A3B8]">
          <div>
            Servicio Nacional de Aprendizaje (SENA) · Guía Interactiva de Inducción y Valor Institucional
          </div>
          <div className="flex items-center gap-3">
            <span>Formación Gratuita y Pública</span>
            <span aria-hidden="true">·</span>
            <span>Ley 119 de 1994 · Acuerdo 0009 de 2024</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
