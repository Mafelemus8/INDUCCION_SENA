import React, { useState, useEffect, useRef } from 'react';
import {
  Printer,
  RotateCcw,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Link2,
  Send,
  Lock,
  CloudUpload,
  EyeOff,
  UserCheck,
  GraduationCap,
  ShieldAlert,
  Search,
  Filter,
  Timer,
  Trophy,
  Sparkles,
  Flame,
  Play,
  Award,
  XCircle,
  ArrowRight,
  Download,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  getAccessToken,
  logout
} from '../services/googleAuth';
import {
  SpreadsheetMetadata,
  ApprenticeSheetRow,
  createInductionSpreadsheet,
  getSpreadsheetMetadata,
  fetchRegisteredApprentices,
  batchAppendApprenticeRecords
} from '../services/googleSheetsService';
import {
  REGULATION_QUIZ_SECTIONS,
  REGULATION_QUIZ_QUESTIONS
} from '../data/regulationQuizData';

export type UserRoleMode = 'aprendiz' | 'instructor';

export interface ApprenticeProfile {
  fullName: string;
  fichaNumber: string;
  programName: string;
  regionalCenter: string;
  preferredAlternative: string;
  personalCommitment: string;
}

interface ServerSubmissionRecord extends ApprenticeSheetRow {
  id: string;
  syncedToSheets?: boolean;
}

interface LeaderboardEntry {
  rank: number;
  id: string;
  fullName: string;
  fichaNumber: string;
  programName: string;
  quizCorrectAnswers: number;
  quizTotalQuestions: number;
  quizMistakesCount: number;
  quizElapsedSeconds: number;
  quizScorePoints: number;
  timestamp: string;
}

interface InductionPassportModalProps {
  profile: ApprenticeProfile;
  onUpdateProfile: (updated: Partial<ApprenticeProfile>) => void;
  exploredSymbolsCount: number;
  exploredPhasesCount: number;
  solvedCasesCount: number;
  onUpdateSolvedCasesCount?: (count: number) => void;
  onResetProgress: () => void;
  activeRole: UserRoleMode;
  onSelectRole: (role: UserRoleMode) => void;
  globalCompletionPercentage?: number;
}

const SHEET_ID_STORAGE_KEY = 'sena_induccion_spreadsheet_id_v1';
const QUIZ_SESSION_STORAGE_KEY = 'sena_induccion_quiz_session_v1';
const AUTHORIZED_ADMIN_EMAIL = 'mafe.lecu@gmail.com';

export function formatTimeMMSS(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const InductionPassportSection: React.FC<InductionPassportModalProps> = ({
  profile,
  onUpdateProfile,
  exploredSymbolsCount,
  exploredPhasesCount,
  onUpdateSolvedCasesCount,
  onResetProgress,
  activeRole,
  onSelectRole,
  globalCompletionPercentage
}) => {
  // Gamified Quiz State (25 questions: 5 per section of Acuerdo 0009 de 2024)
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [activeSectionIdx, setActiveSectionIdx] = useState<number>(0);
  const [activeQuestionIdxInSec, setActiveQuestionIdxInSec] =
    useState<number>(0);

  // Track which questions are solved correctly: questionId -> true
  const [correctMap, setCorrectMap] = useState<Record<string, boolean>>({});
  // Track selected option for current feedback display: questionId -> optionId
  const [selectedOptionMap, setSelectedOptionMap] = useState<
    Record<string, string>
  >({});
  // Track total mistakes made across the entire evaluation
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  // Track animation trigger key when user answers
  const [feedbackPulseKey, setFeedbackPulseKey] = useState<number>(0);

  // Stopwatch & Per-Question Speed Bonus State
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [questionStartTimeMs, setQuestionStartTimeMs] = useState<number>(
    Date.now()
  );
  const [accumulatedPoints, setAccumulatedPoints] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  // Public Gamified Ranking State + Ficha Filter in Ranking
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [rankingFichaFilter, setRankingFichaFilter] = useState<string>('');
  const [apprenticeSubTab, setApprenticeSubTab] = useState<
    'evaluacion' | 'ranking' | 'pasaporte'
  >('evaluacion');

  // Apprentice Public Submission State
  const [isSubmittingApprentice, setIsSubmittingApprentice] =
    useState<boolean>(false);
  const [apprenticeReceipt, setApprenticeReceipt] = useState<{
    receiptId: string;
    timestamp: string;
    rankPosition?: number;
  } | null>(null);
  const [apprenticeError, setApprenticeError] = useState<string | null>(null);

  // Google Workspace Instructor/Admin Auth State
  const [user, setUser] = useState<User | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Instructor Filter State
  const [fichaFilter, setFichaFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isAuthorizedAdmin =
    !needsAuth &&
    Boolean(user?.email) &&
    user!.email!.toLowerCase() === AUTHORIZED_ADMIN_EMAIL;

  // Admin Server Submissions & Google Sheets State (Hidden from Apprentices)
  const [serverSubmissions, setServerSubmissions] = useState<
    ServerSubmissionRecord[]
  >([]);
  const [sheetMeta, setSheetMeta] = useState<SpreadsheetMetadata | null>(null);
  const [customSheetTitle, setCustomSheetTitle] = useState<string>(
    'Registro Oficial Inducción SENA 2026'
  );
  const [existingSheetInput, setExistingSheetInput] = useState<string>('');
  const [registeredRows, setRegisteredRows] = useState<ApprenticeSheetRow[]>(
    []
  );
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [pendingConfirmAction, setPendingConfirmAction] = useState<
    'create_sheet' | 'sync_pending' | null
  >(null);

  // Restore persisted quiz attempt from localStorage on mount
  useEffect(() => {
    try {
      const savedQuiz = localStorage.getItem(QUIZ_SESSION_STORAGE_KEY);
      if (savedQuiz) {
        const parsed = JSON.parse(savedQuiz);
        if (typeof parsed.quizStarted === 'boolean') setQuizStarted(parsed.quizStarted);
        if (typeof parsed.quizFinished === 'boolean') setQuizFinished(parsed.quizFinished);
        if (typeof parsed.activeSectionIdx === 'number') setActiveSectionIdx(parsed.activeSectionIdx);
        if (typeof parsed.activeQuestionIdxInSec === 'number') {
          setActiveQuestionIdxInSec(parsed.activeQuestionIdxInSec);
        }
        if (parsed.correctMap && typeof parsed.correctMap === 'object') {
          setCorrectMap(parsed.correctMap);
        }
        if (parsed.selectedOptionMap && typeof parsed.selectedOptionMap === 'object') {
          setSelectedOptionMap(parsed.selectedOptionMap);
        }
        if (typeof parsed.mistakesCount === 'number') setMistakesCount(parsed.mistakesCount);
        if (typeof parsed.currentStreak === 'number') setCurrentStreak(parsed.currentStreak);
        if (typeof parsed.elapsedSeconds === 'number') setElapsedSeconds(parsed.elapsedSeconds);
        if (typeof parsed.accumulatedPoints === 'number') {
          setAccumulatedPoints(parsed.accumulatedPoints);
        }
        if (parsed.apprenticeReceipt) {
          setApprenticeReceipt(parsed.apprenticeReceipt);
        }
      }
    } catch {}
  }, []);

  // Persist quiz attempt to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        QUIZ_SESSION_STORAGE_KEY,
        JSON.stringify({
          quizStarted,
          quizFinished,
          activeSectionIdx,
          activeQuestionIdxInSec,
          correctMap,
          selectedOptionMap,
          mistakesCount,
          currentStreak,
          elapsedSeconds,
          accumulatedPoints,
          apprenticeReceipt
        })
      );
    } catch {}
  }, [
    quizStarted,
    quizFinished,
    activeSectionIdx,
    activeQuestionIdxInSec,
    correctMap,
    selectedOptionMap,
    mistakesCount,
    currentStreak,
    elapsedSeconds,
    accumulatedPoints,
    apprenticeReceipt
  ]);

  const totalCorrectCount = Object.keys(correctMap).length;
  const totalQuestionsCount = REGULATION_QUIZ_QUESTIONS.length; // 25

  const completionPercentage =
    typeof globalCompletionPercentage === 'number'
      ? globalCompletionPercentage
      : Math.min(
          100,
          Math.round(
            ((exploredSymbolsCount + exploredPhasesCount + totalCorrectCount) /
              31) *
              100
          )
        );

  // Final Gamified Score Formula:
  // Base points + accuracy bonus (500 pts if 0 mistakes & 25/25) + speed bonus
  const perfectionBonus =
    totalCorrectCount === 25 && mistakesCount === 0 ? 500 : 0;
  const globalSpeedBonus =
    totalCorrectCount === 25
      ? Math.max(0, Math.round((450 - elapsedSeconds) * 2))
      : 0;
  const totalGamifiedScore = Math.max(
    0,
    accumulatedPoints + perfectionBonus + globalSpeedBonus
  );

  // Validation: prevent dummy or empty names/fichas before starting the clock
  const isValidIdentityForQuiz =
    profile.fullName.trim().length >= 3 &&
    profile.fullName.trim().toLowerCase() !== 'aprendiz en inducción' &&
    profile.fichaNumber.trim().length >= 4;

  // Stopwatch Effect
  useEffect(() => {
    if (quizStarted && !quizFinished) {
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizStarted, quizFinished]);

  const fetchPublicLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.leaderboard)) {
        setLeaderboard(data.leaderboard);
      }
    } catch {}
  };

  const loadAdminBackendData = async (token: string) => {
    try {
      const res = await fetch('/api/admin/submissions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.submissions)) {
        setServerSubmissions(data.submissions);
      }

      const savedSheetId =
        data.linkedSheetMeta?.spreadsheetId ||
        localStorage.getItem(SHEET_ID_STORAGE_KEY);

      if (savedSheetId) {
        try {
          const meta = await getSpreadsheetMetadata(token, savedSheetId);
          setSheetMeta(meta);
          const rows = await fetchRegisteredApprentices(
            token,
            meta.spreadsheetId,
            meta.firstSheetTitle
          );
          setRegisteredRows(rows);
        } catch {}
      }
    } catch {}
  };

  useEffect(() => {
    fetchPublicLeaderboard();
    const unsubscribe = initAuth(
      async (authUser, token) => {
        setUser(authUser);
        setNeedsAuth(false);
        if (authUser.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL && token) {
          await loadAdminBackendData(token);
        }
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Sync solved count upwards for the Hero normative dial
  useEffect(() => {
    if (onUpdateSolvedCasesCount) {
      onUpdateSolvedCasesCount(totalCorrectCount);
    }
  }, [totalCorrectCount]);

  const currentSection = REGULATION_QUIZ_SECTIONS[activeSectionIdx];
  const sectionQuestions = REGULATION_QUIZ_QUESTIONS.filter(
    (q) => q.chapterId === currentSection.chapterId
  );
  const currentQuestion =
    sectionQuestions[activeQuestionIdxInSec] || sectionQuestions[0];
  const selectedOptionId = selectedOptionMap[currentQuestion.id];
  const selectedOption = currentQuestion.options.find(
    (o) => o.id === selectedOptionId
  );
  const isCurrentQuestionSolved = Boolean(correctMap[currentQuestion.id]);

  const handleStartEvaluation = () => {
    setApprenticeError(null);
    if (!isValidIdentityForQuiz) {
      setApprenticeError(
        'Por favor ingresa tu Nombre Completo real (mínimo 3 caracteres) y tu Número de Ficha SOFIA Plus antes de iniciar el cronómetro.'
      );
      return;
    }
    setQuizStarted(true);
    setQuizFinished(false);
    setQuestionStartTimeMs(Date.now());
  };

  const handleSelectQuizOption = (optionId: string) => {
    setApprenticeError(null);
    if (!isValidIdentityForQuiz) {
      setApprenticeError(
        'Para responder y activar el cronómetro, primero escribe tu Nombre Completo y Número de Ficha en el Paso 1.'
      );
      return;
    }

    if (!quizStarted) {
      setQuizStarted(true);
      setQuizFinished(false);
      setQuestionStartTimeMs(Date.now());
    }

    // If already solved correctly, don't re-penalize or double-count points
    if (correctMap[currentQuestion.id]) {
      setSelectedOptionMap((prev) => ({
        ...prev,
        [currentQuestion.id]: optionId
      }));
      return;
    }

    const chosen = currentQuestion.options.find((o) => o.id === optionId);
    if (!chosen) return;

    setSelectedOptionMap((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
    setFeedbackPulseKey((prev) => prev + 1);

    if (chosen.isCorrect) {
      const responseSeconds = Math.max(
        1,
        Math.round((Date.now() - questionStartTimeMs) / 1000)
      );
      // Fast answer bonus: up to +60 pts if answered within 15 seconds
      const speedBonus = Math.max(0, (18 - Math.min(18, responseSeconds)) * 4);
      const streakBonus = currentStreak * 15;
      const questionEarned = 100 + speedBonus + streakBonus;

      setAccumulatedPoints((prev) => prev + questionEarned);
      setCurrentStreak((prev) => prev + 1);

      const updatedCorrect = {
        ...correctMap,
        [currentQuestion.id]: true
      };
      setCorrectMap(updatedCorrect);

      if (Object.keys(updatedCorrect).length === totalQuestionsCount) {
        setQuizFinished(true);
      }
    } else {
      // Mistake penalty: -25 points and reset streak
      setMistakesCount((prev) => prev + 1);
      setCurrentStreak(0);
      setAccumulatedPoints((prev) => Math.max(0, prev - 25));
    }
  };

  const handleNextQuestion = () => {
    setQuestionStartTimeMs(Date.now());
    if (activeQuestionIdxInSec < sectionQuestions.length - 1) {
      setActiveQuestionIdxInSec((prev) => prev + 1);
    } else if (activeSectionIdx < REGULATION_QUIZ_SECTIONS.length - 1) {
      setActiveSectionIdx((prev) => prev + 1);
      setActiveQuestionIdxInSec(0);
    }
  };

  const handleResetQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setElapsedSeconds(0);
    setCorrectMap({});
    setSelectedOptionMap({});
    setMistakesCount(0);
    setCurrentStreak(0);
    setAccumulatedPoints(0);
    setActiveSectionIdx(0);
    setActiveQuestionIdxInSec(0);
    setApprenticeReceipt(null);
    localStorage.removeItem(QUIZ_SESSION_STORAGE_KEY);
  };

  // PUBLIC APPRENTICE ACTION: Submit unified evaluation + profile to backend & ranking
  const handleApprenticeSubmitInduction = async () => {
    setApprenticeError(null);
    if (!isValidIdentityForQuiz) {
      setApprenticeError(
        'Por favor completa tu Nombre Completo real y Número de Ficha para guardar tu puntaje en el Ranking y en el registro oficial.'
      );
      return;
    }

    setIsSubmittingApprentice(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: profile.fullName.trim(),
          fichaNumber: profile.fichaNumber.trim(),
          programName: profile.programName.trim(),
          regionalCenter: profile.regionalCenter.trim(),
          exploredSymbols: `${exploredSymbolsCount}/2`,
          exploredPhases: `${exploredPhasesCount}/4`,
          solvedCases: `${totalCorrectCount}/25`,
          completionPercentage: `${completionPercentage}%`,
          preferredAlternative: profile.preferredAlternative,
          personalCommitment: profile.personalCommitment.trim(),
          quizCorrectAnswers: totalCorrectCount,
          quizTotalQuestions: totalQuestionsCount,
          quizMistakesCount: mistakesCount,
          quizElapsedSeconds: elapsedSeconds,
          quizScorePoints: totalGamifiedScore
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error || 'No se pudo enviar tu registro de evaluación.'
        );
      }

      setQuizFinished(true);
      setApprenticeReceipt({
        receiptId: data.receiptId,
        timestamp: data.timestamp,
        rankPosition: data.rankPosition
      });

      await fetchPublicLeaderboard();

      if (isAuthorizedAdmin) {
        const token = await getAccessToken();
        if (token) {
          await loadAdminBackendData(token);
        }
      }
    } catch (err: any) {
      setApprenticeError(
        err?.message || 'Error al registrar tu evaluación e inducción.'
      );
    } finally {
      setIsSubmittingApprentice(false);
    }
  };

  // Export filtered submissions to CSV for Excel
  const handleExportCSV = () => {
    const rowsToExport =
      filteredSubmissions.length > 0 ? filteredSubmissions : serverSubmissions;
    if (rowsToExport.length === 0) return;

    const headers = [
      'Fecha y Hora',
      'Nombre Completo',
      'N.º de Ficha',
      'Programa de Formación',
      'Regional / Centro',
      'Símbolos Explorados',
      'Fases del Proyecto',
      'Aciertos Reglamento (de 25)',
      'Equivocaciones',
      'Tiempo Empleado (Segundos)',
      'Puntaje Gamificado (Pts)',
      'Avance Global (%)',
      'Alternativa Etapa Productiva',
      'Compromiso Institucional',
      'Sincronizado en Drive'
    ];

    const escapeCsv = (val: string | number | boolean | undefined) => {
      const str = String(val ?? '');
      return `"${str.replace(/"/g, '""')}"`;
    };

    const csvLines = [
      headers.map(escapeCsv).join(','),
      ...rowsToExport.map((r) =>
        [
          r.timestamp,
          r.fullName,
          r.fichaNumber,
          r.programName,
          r.regionalCenter,
          r.exploredSymbols,
          r.exploredPhases,
          r.solvedCases,
          r.quizMistakesCount ?? 0,
          r.quizElapsedSeconds ?? 0,
          r.quizScorePoints ?? 0,
          r.completionPercentage,
          r.preferredAlternative,
          r.personalCommitment,
          r.syncedToSheets ? 'Sí' : 'Pendiente'
        ]
          .map(escapeCsv)
          .join(',')
      )
    ];

    const blob = new Blob(['\uFEFF' + csvLines.join('\n')], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `reporte_induccion_sena_${fichaFilter.trim() || 'todas_las_fichas'}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setStatusMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setNeedsAuth(false);
        if (result.user.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL) {
          await loadAdminBackendData(result.accessToken);
        } else {
          setStatusMessage({
            type: 'error',
            text: `La cuenta ${result.user.email} no corresponde al Instructor Administrador (${AUTHORIZED_ADMIN_EMAIL}). El acceso a la hoja de cálculo está protegido.`
          });
        }
      }
    } catch (error: any) {
      setStatusMessage({
        type: 'error',
        text: error?.message || 'Error al iniciar sesión con Google.'
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logout();
    setUser(null);
    setNeedsAuth(true);
    setStatusMessage(null);
    setSheetMeta(null);
    setRegisteredRows([]);
    setServerSubmissions([]);
  };

  const handleLinkExistingSpreadsheet = async () => {
    if (!existingSheetInput.trim() || !isAuthorizedAdmin) return;
    setIsBusy(true);
    setStatusMessage(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        setNeedsAuth(true);
        return;
      }
      const meta = await getSpreadsheetMetadata(token, existingSheetInput);
      setSheetMeta(meta);
      localStorage.setItem(SHEET_ID_STORAGE_KEY, meta.spreadsheetId);

      await fetch('/api/admin/sheet-config', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meta)
      });

      const rows = await fetchRegisteredApprentices(
        token,
        meta.spreadsheetId,
        meta.firstSheetTitle
      );
      setRegisteredRows(rows);
      setExistingSheetInput('');
      setStatusMessage({
        type: 'success',
        text: `Hoja de cálculo privada "${meta.title}" vinculada correctamente.`
      });
    } catch (error: any) {
      setStatusMessage({
        type: 'error',
        text:
          error?.message ||
          'No se pudo vincular la hoja de cálculo. Verifica la URL o el ID.'
      });
    } finally {
      setIsBusy(false);
    }
  };

  const executeConfirmedCreateSheet = async () => {
    setPendingConfirmAction(null);
    if (!isAuthorizedAdmin) return;
    setIsBusy(true);
    setStatusMessage(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        setNeedsAuth(true);
        return;
      }
      const meta = await createInductionSpreadsheet(token, customSheetTitle);
      setSheetMeta(meta);
      localStorage.setItem(SHEET_ID_STORAGE_KEY, meta.spreadsheetId);

      await fetch('/api/admin/sheet-config', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meta)
      });

      setRegisteredRows([]);
      setStatusMessage({
        type: 'success',
        text: `Se creó el archivo privado "${meta.title}" en tu Google Drive con las 14 columnas oficiales (incluyendo tiempo, errores y puntaje gamificado).`
      });
    } catch (error: any) {
      setStatusMessage({
        type: 'error',
        text: error?.message || 'Error al crear la hoja de cálculo.'
      });
    } finally {
      setIsBusy(false);
    }
  };

  const pendingUnsyncedSubmissions = serverSubmissions.filter(
    (s) => !s.syncedToSheets
  );

  const filteredSubmissions = serverSubmissions.filter((item) => {
    const matchesFicha =
      !fichaFilter.trim() ||
      item.fichaNumber.toLowerCase().includes(fichaFilter.trim().toLowerCase());
    const matchesQuery =
      !searchQuery.trim() ||
      item.fullName.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      item.programName
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase()) ||
      item.regionalCenter
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());
    return matchesFicha && matchesQuery;
  });

  const filteredLeaderboard = leaderboard.filter((entry) => {
    if (!rankingFichaFilter.trim()) return true;
    return entry.fichaNumber
      .toLowerCase()
      .includes(rankingFichaFilter.trim().toLowerCase());
  });

  const uniqueFichas = Array.from(
    new Set(serverSubmissions.map((s) => s.fichaNumber).filter(Boolean))
  );

  const executeConfirmedSyncPendingToSheets = async () => {
    setPendingConfirmAction(null);
    if (!sheetMeta || !isAuthorizedAdmin) return;
    setIsBusy(true);
    setStatusMessage(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        setNeedsAuth(true);
        return;
      }

      const toSync = pendingUnsyncedSubmissions;
      if (toSync.length === 0) {
        setStatusMessage({
          type: 'success',
          text: 'Todos los aprendices registrados ya están sincronizados con tu Google Sheets.'
        });
        setIsBusy(false);
        return;
      }

      await batchAppendApprenticeRecords(
        token,
        sheetMeta.spreadsheetId,
        sheetMeta.firstSheetTitle,
        toSync
      );

      await fetch('/api/admin/mark-synced', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: toSync.map((item) => item.id)
        })
      });

      await loadAdminBackendData(token);
      setStatusMessage({
        type: 'success',
        text: `Se exportaron ${toSync.length} registros de aprendices con su puntaje, tiempo y aciertos a tu hoja "${sheetMeta.title}" en Google Drive.`
      });
    } catch (error: any) {
      setStatusMessage({
        type: 'error',
        text:
          error?.message ||
          'Error al sincronizar los registros con Google Sheets.'
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleRefreshAdminData = async () => {
    if (!isAuthorizedAdmin) return;
    setIsBusy(true);
    setStatusMessage(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        setNeedsAuth(true);
        return;
      }
      await loadAdminBackendData(token);
      await fetchPublicLeaderboard();
      setStatusMessage({
        type: 'success',
        text: 'Bandeja de aprendices, ranking y hoja de cálculo actualizados.'
      });
    } catch (error: any) {
      setStatusMessage({
        type: 'error',
        text: error?.message || 'Error al actualizar los datos.'
      });
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ROLE SELECTOR BAR: APRENDIZ VS INSTRUCTOR */}
      <div className="neu-surface rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div className="space-y-1">
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold">
            Módulo Unificado de Evaluación, Ranking Gamificado y Registro
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
            {activeRole === 'aprendiz'
              ? 'Modo Activo: Rol Aprendiz (Datos, Evaluación de 25 Preguntas, Cronómetro y Ranking)'
              : 'Modo Activo: Rol Instructor / Administrador (Auditoría, CSV y Sincronización con Google Sheets)'}
          </h3>
          <p className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
            {activeRole === 'aprendiz'
              ? 'Ingresa tus datos reales, responde las 5 preguntas de cada uno de los 5 Capítulos del Reglamento SENA en el menor tiempo posible y sin errores para liderar el Ranking.'
              : 'Revisa los puntajes, tiempos y aciertos de los aprendices, descárgalos en CSV/Excel o expórtalos a tu hoja privada en Google Drive.'}
          </p>
        </div>

        <div className="neu-inset p-1.5 rounded-2xl flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onSelectRole('aprendiz')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeRole === 'aprendiz'
                ? 'grad-sena text-white shadow-sm'
                : 'text-[#5A657D] dark:text-[#94A3B8] hover:text-[#1E2433] dark:hover:text-[#F1F5F9]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Rol Aprendiz</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectRole('instructor')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeRole === 'instructor'
                ? 'grad-accent text-white shadow-sm'
                : 'text-[#5A657D] dark:text-[#94A3B8] hover:text-[#1E2433] dark:hover:text-[#F1F5F9]'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Rol Instructor</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* VIEW 1: ROL APRENDIZ (UNIFIED DATA ENTRY + 25-QUESTION QUIZ + RANKING) */}
      {/* ===================================================================== */}
      {activeRole === 'aprendiz' && (
        <div className="space-y-8">
          {/* STEP 1: Apprentice Registration & Live Gamified Telemetry Bar */}
          <div className="neu-surface rounded-3xl p-6 lg:p-8 no-print space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/70 dark:border-slate-700/60 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono-tabular text-[#2A7D00] dark:text-[#4ADE80] font-semibold">
                  <GraduationCap className="w-4 h-4" />
                  <span>PASO 1 · REGISTRO DE IDENTIDAD DEL APRENDIZ</span>
                </div>
                <h3 className="text-xl font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-0.5">
                  Ingresa tus Datos Oficiales para la Prueba y el Ranking
                </h3>
              </div>

              {/* Sub-navigation for Apprentice: Evaluación (25 Preguntas) | Ranking Gamificado | Pasaporte PDF */}
              <div className="flex flex-wrap gap-2 p-1.5 neu-inset rounded-2xl">
                <button
                  type="button"
                  onClick={() => setApprenticeSubTab('evaluacion')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    apprenticeSubTab === 'evaluacion'
                      ? 'grad-accent text-white'
                      : 'text-[#5A657D] dark:text-[#94A3B8] hover:text-[#1E2433] dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Evaluación Reglamento ({totalCorrectCount}/25)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setApprenticeSubTab('ranking');
                    fetchPublicLeaderboard();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    apprenticeSubTab === 'ranking'
                      ? 'grad-sena text-white'
                      : 'text-[#5A657D] dark:text-[#94A3B8] hover:text-[#1E2433] dark:hover:text-white'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Ranking Gamificado ({leaderboard.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setApprenticeSubTab('pasaporte')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    apprenticeSubTab === 'pasaporte'
                      ? 'grad-accent text-white'
                      : 'text-[#5A657D] dark:text-[#94A3B8] hover:text-[#1E2433] dark:hover:text-white'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Constancia / Pasaporte PDF</span>
                </button>
              </div>
            </div>

            {/* Apprentice Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#1E2433] dark:text-[#F1F5F9] mb-1.5">
                  Nombre Completo del Aprendiz *
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) =>
                    onUpdateProfile({ fullName: e.target.value })
                  }
                  placeholder="Escribe tu nombre y apellidos..."
                  className="w-full px-4 py-2.5 text-sm neu-inset rounded-xl text-[#1E2433] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1E2433] dark:text-[#F1F5F9] mb-1.5">
                  N.º de Ficha (SOFIA Plus) *
                </label>
                <input
                  type="text"
                  value={profile.fichaNumber}
                  onChange={(e) =>
                    onUpdateProfile({ fichaNumber: e.target.value })
                  }
                  placeholder="Ej. 2978451"
                  className="w-full px-4 py-2.5 text-sm font-mono-tabular neu-inset rounded-xl text-[#1E2433] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1E2433] dark:text-[#F1F5F9] mb-1.5">
                  Programa de Formación Titulada
                </label>
                <input
                  type="text"
                  value={profile.programName}
                  onChange={(e) =>
                    onUpdateProfile({ programName: e.target.value })
                  }
                  placeholder="Ej. Tecnólogo en ADSO"
                  className="w-full px-4 py-2.5 text-sm neu-inset rounded-xl text-[#1E2433] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1E2433] dark:text-[#F1F5F9] mb-1.5">
                  Regional / Centro de Formación
                </label>
                <input
                  type="text"
                  value={profile.regionalCenter}
                  onChange={(e) =>
                    onUpdateProfile({ regionalCenter: e.target.value })
                  }
                  placeholder="Ej. Distrito Capital"
                  className="w-full px-4 py-2.5 text-sm neu-inset rounded-xl text-[#1E2433] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Personal Commitment & Preferred Productive Stage Field */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-4">
                <label className="block text-xs font-medium text-[#1E2433] dark:text-[#F1F5F9] mb-1.5">
                  Modalidad de Etapa Productiva de Interés
                </label>
                <select
                  value={profile.preferredAlternative}
                  onChange={(e) =>
                    onUpdateProfile({ preferredAlternative: e.target.value })
                  }
                  className="w-full px-4 py-2.5 text-sm neu-inset rounded-xl text-[#1E2433] dark:text-[#F1F5F9] bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Contrato de Aprendizaje">Contrato de Aprendizaje</option>
                  <option value="Proyecto Productivo / Fondo Emprender">
                    Proyecto Productivo / Fondo Emprender
                  </option>
                  <option value="Vínculo Laboral o Contractual">
                    Vínculo Laboral o Contractual
                  </option>
                  <option value="Pasantía / Apoyo a Entidades Estatales o ONG">
                    Pasantía / Apoyo a Entidades Estatales o ONG
                  </option>
                  <option value="Monitoría Académica o Tecnológica">
                    Monitoría Académica o Tecnológica
                  </option>
                </select>
              </div>

              <div className="lg:col-span-8">
                <label className="block text-xs font-medium text-[#1E2433] dark:text-[#F1F5F9] mb-1.5">
                  Mi Compromiso Ético como Aprendiz SENA (Se incluye en tu Pasaporte y Registro)
                </label>
                <input
                  type="text"
                  value={profile.personalCommitment}
                  onChange={(e) =>
                    onUpdateProfile({ personalCommitment: e.target.value })
                  }
                  placeholder="Escribe tu compromiso ético con la formación gratuita del SENA..."
                  className="w-full px-4 py-2.5 text-sm neu-inset rounded-xl text-[#1E2433] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* GAMIFIED STOPWATCH & SCOREBOARD HUD */}
            <div className="p-4 sm:p-5 neu-inset rounded-3xl grid grid-cols-2 sm:grid-cols-5 gap-4 items-center">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    quizStarted && !quizFinished
                      ? 'grad-accent text-white animate-pulse'
                      : 'neu-surface text-purple-600 dark:text-purple-400'
                  }`}
                >
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-[#5A657D] dark:text-[#94A3B8] uppercase font-mono-tabular">
                    Tiempo Empleado
                  </div>
                  <div className="text-xl font-mono-tabular font-bold text-[#1E2433] dark:text-[#F1F5F9]">
                    {formatTimeMMSS(elapsedSeconds)}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#5A657D] dark:text-[#94A3B8] uppercase font-mono-tabular">
                  Puntaje Gamificado
                </div>
                <div className="text-xl font-mono-tabular font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  <span>{totalGamifiedScore} pts</span>
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#5A657D] dark:text-[#94A3B8] uppercase font-mono-tabular">
                  Aciertos / Meta
                </div>
                <div className="text-xl font-mono-tabular font-bold text-[#2A7D00] dark:text-[#4ADE80]">
                  {totalCorrectCount} / 25
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#5A657D] dark:text-[#94A3B8] uppercase font-mono-tabular">
                  Equivocaciones
                </div>
                <div className="text-xl font-mono-tabular font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <span>{mistakesCount}</span>
                  {currentStreak >= 2 && (
                    <span className="text-xs px-2 py-0.5 rounded-full grad-sena text-white flex items-center gap-0.5">
                      <Flame className="w-3 h-3" /> Racha x{currentStreak}
                    </span>
                  )}
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex justify-end">
                {!quizStarted ? (
                  <button
                    type="button"
                    onClick={handleStartEvaluation}
                    className="w-full py-2.5 px-4 grad-sena text-white text-xs font-semibold rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Iniciar Reloj</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleResetQuiz}
                    className="w-full py-2.5 px-3 neu-btn text-xs font-semibold rounded-2xl text-[#5A657D] dark:text-[#94A3B8] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reiniciar Prueba</span>
                  </button>
                )}
              </div>
            </div>

            {apprenticeError && (
              <div className="p-3.5 rounded-2xl neu-inset text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{apprenticeError}</span>
              </div>
            )}
          </div>

          {/* SUB-TAB 1: 25-QUESTION EVALUATION BY CHAPTER WITH ANIMATED REINFORCEMENT */}
          {apprenticeSubTab === 'evaluacion' && (
            <div className="neu-surface rounded-3xl p-6 lg:p-8 no-print space-y-6">
              {/* 5 Sections Selector (5 Questions per Chapter) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#5A657D] dark:text-[#94A3B8]">
                    Selecciona la Sección del Reglamento (5 Preguntas por Capítulo = 25 en Total):
                  </span>
                  <span className="text-xs font-mono-tabular text-purple-600 dark:text-purple-400 font-semibold">
                    Sección activa: {currentSection.chapterId} ({currentSection.articlesRange})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                  {REGULATION_QUIZ_SECTIONS.map((sec, sIdx) => {
                    const secQuestions = REGULATION_QUIZ_QUESTIONS.filter(
                      (q) => q.chapterId === sec.chapterId
                    );
                    const solvedInSec = secQuestions.filter(
                      (q) => correctMap[q.id]
                    ).length;
                    const isCurrentSec = sIdx === activeSectionIdx;

                    return (
                      <button
                        key={sec.chapterId}
                        type="button"
                        onClick={() => {
                          setActiveSectionIdx(sIdx);
                          setActiveQuestionIdxInSec(0);
                          setQuestionStartTimeMs(Date.now());
                        }}
                        className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isCurrentSec
                            ? 'grad-accent text-white shadow-md'
                            : 'neu-btn text-[#1E2433] dark:text-[#F1F5F9]'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`text-[11px] font-mono-tabular font-bold ${
                              isCurrentSec
                                ? 'text-white'
                                : 'text-indigo-600 dark:text-indigo-400'
                            }`}
                          >
                            {sec.chapterId}
                          </span>
                          <span
                            className={`text-[11px] font-mono-tabular px-2 py-0.5 rounded-full font-bold ${
                              solvedInSec === 5
                                ? 'bg-[#39A900] text-white'
                                : isCurrentSec
                                ? 'bg-white/20 text-white'
                                : 'neu-inset text-purple-600 dark:text-purple-400'
                            }`}
                          >
                            {solvedInSec}/5
                          </span>
                        </div>
                        <div className="text-xs font-semibold mt-1.5 line-clamp-1">
                          {sec.shortTitle.split('·')[1]?.trim() ||
                            sec.shortTitle}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5 Question Number Pills inside Current Section */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200/70 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  {sectionQuestions.map((q, qIdx) => {
                    const isSolved = Boolean(correctMap[q.id]);
                    const isCurrent = qIdx === activeQuestionIdxInSec;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          setActiveQuestionIdxInSec(qIdx);
                          setQuestionStartTimeMs(Date.now());
                        }}
                        className={`w-10 h-10 rounded-2xl font-mono-tabular text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                          isCurrent
                            ? 'grad-accent text-white scale-105 shadow-md'
                            : isSolved
                            ? 'grad-sena text-white'
                            : 'neu-btn text-[#1E2433] dark:text-[#F1F5F9]'
                        }`}
                      >
                        {isSolved ? '✓' : qIdx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
                  Pregunta{' '}
                  <strong className="text-[#1E2433] dark:text-[#F1F5F9]">
                    {activeQuestionIdxInSec + 1} de 5
                  </strong>{' '}
                  en {currentSection.chapterId}
                </div>
              </div>

              {/* Question Card + Animated Reinforcement Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="lg:col-span-5 neu-inset rounded-3xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono-tabular font-semibold text-purple-600 dark:text-purple-400">
                      {currentQuestion.articleRef}
                    </span>
                    {isCurrentQuestionSolved && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#39A900]/15 text-[#2A7D00] dark:text-[#4ADE80] text-[11px] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Superada
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-semibold text-[#1E2433] dark:text-[#F1F5F9] leading-snug">
                    {currentQuestion.question}
                  </h4>

                  <div className="p-4 neu-surface rounded-2xl text-xs text-[#5A657D] dark:text-[#94A3B8] space-y-1">
                    <div className="font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
                      Regla de Puntuación Gamificada:
                    </div>
                    <p>
                      • Respuesta correcta al primer intento: <strong>+100 pts</strong> + bono de velocidad (+hasta 60 pts) + bono por racha consecutiva.
                    </p>
                    <p>
                      • Equivocación: <strong>-25 pts</strong> y activación inmediata de diagnóstico pedagógico.
                    </p>
                  </div>
                </motion.div>

                <div className="lg:col-span-7 space-y-4">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    let optionStyle =
                      'neu-btn text-[#1E2433] dark:text-[#F1F5F9]';
                    if (isSelected) {
                      optionStyle = option.isCorrect
                        ? 'grad-sena text-white shadow-md'
                        : 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md';
                    }

                    return (
                      <motion.button
                        key={option.id}
                        type="button"
                        whileTap={{ scale: 0.985 }}
                        onClick={() => handleSelectQuizOption(option.id)}
                        className={`w-full text-left p-4.5 rounded-2xl transition-all cursor-pointer ${optionStyle}`}
                      >
                        <div className="flex items-start gap-3.5">
                          <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-xs font-mono-tabular font-bold shrink-0 mt-0.5 uppercase">
                            {option.id}
                          </span>
                          <span className="text-sm leading-relaxed font-medium">
                            {option.text}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}

                  {/* ANIMATED POSITIVE OR DIAGNOSTIC REINFORCEMENT BOX */}
                  <AnimatePresence mode="wait">
                    {selectedOption && (
                      <motion.div
                        key={`${currentQuestion.id}-${selectedOption.id}-${feedbackPulseKey}`}
                        initial={
                          selectedOption.isCorrect
                            ? { opacity: 0, scale: 0.92, y: 10 }
                            : { opacity: 0, x: -14 }
                        }
                        animate={
                          selectedOption.isCorrect
                            ? { opacity: 1, scale: 1, y: 0 }
                            : {
                                opacity: 1,
                                x: [0, -10, 10, -6, 6, 0]
                              }
                        }
                        transition={{ duration: 0.38 }}
                        className={`p-5 rounded-3xl neu-inset border-l-4 space-y-2.5 ${
                          selectedOption.isCorrect
                            ? 'border-[#39A900]'
                            : 'border-rose-500'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs font-mono-tabular font-bold">
                            {selectedOption.isCorrect ? (
                              <>
                                <motion.div
                                  initial={{ rotate: -25, scale: 0.7 }}
                                  animate={{ rotate: 0, scale: 1.15 }}
                                  transition={{
                                    type: 'spring',
                                    stiffness: 300
                                  }}
                                >
                                  <Sparkles className="w-5 h-5 text-[#2A7D00] dark:text-[#4ADE80]" />
                                </motion.div>
                                <span className="text-[#2A7D00] dark:text-[#4ADE80] uppercase">
                                  ¡Refuerzo Positivo! ·{' '}
                                  {currentQuestion.positiveReinforcementTitle}
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                                <span className="text-rose-600 dark:text-rose-400 uppercase">
                                  Refuerzo Correctivo · Identifica en qué fallaste
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {!selectedOption.isCorrect && (
                          <div className="p-3 rounded-xl bg-rose-500/10 text-xs font-semibold text-rose-700 dark:text-rose-300">
                            {currentQuestion.errorDiagnosticHint}
                          </div>
                        )}

                        <p className="text-sm text-[#1E2433] dark:text-[#F1F5F9] leading-relaxed">
                          {selectedOption.feedback}
                        </p>

                        {selectedOption.isCorrect && (
                          <div className="pt-2 flex items-center justify-between">
                            <span className="text-xs font-mono-tabular text-purple-600 dark:text-purple-400 font-semibold">
                              Avance Total: {totalCorrectCount} de 25 preguntas superadas
                            </span>
                            {(activeQuestionIdxInSec <
                              sectionQuestions.length - 1 ||
                              activeSectionIdx <
                                REGULATION_QUIZ_SECTIONS.length - 1) && (
                              <button
                                type="button"
                                onClick={handleNextQuestion}
                                className="px-4 py-2 grad-accent text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                              >
                                <span>Siguiente Pregunta</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* DIAGNOSTIC BREAKDOWN BY THE 5 CHAPTERS OF ACUERDO 0009 DE 2024 */}
              <div className="pt-4 border-t border-slate-200/70 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1E2433] dark:text-[#F1F5F9] mb-3">
                  <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Desglose de Dominio por Capítulo del Reglamento (Acuerdo 0009 de 2024):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {REGULATION_QUIZ_SECTIONS.map((sec) => {
                    const secQuestions = REGULATION_QUIZ_QUESTIONS.filter(
                      (q) => q.chapterId === sec.chapterId
                    );
                    const solvedInSec = secQuestions.filter(
                      (q) => correctMap[q.id]
                    ).length;
                    const secPercent = Math.round((solvedInSec / 5) * 100);
                    return (
                      <div
                        key={sec.chapterId}
                        className="p-3 rounded-2xl neu-inset space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                            {sec.chapterId}
                          </span>
                          <span className="font-bold text-[#2A7D00] dark:text-[#4ADE80]">
                            {solvedInSec}/5 ({secPercent}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full grad-sena transition-all duration-300"
                            style={{ width: `${secPercent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FINAL SUBMIT BAR TO SAVE DATA & ENTER RANKING */}
              <div className="pt-6 border-t border-slate-200/70 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
                    ¿Listo para registrar tu resultado oficial y entrar al Ranking Gamificado?
                  </div>
                  <p className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
                    Se guardarán tus datos de Ficha, tus {totalCorrectCount}/25 respuestas correctas, tiempo ({formatTimeMMSS(elapsedSeconds)}) y puntaje ({totalGamifiedScore} pts) para el libro de Google Sheets del Instructor.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isSubmittingApprentice}
                  onClick={handleApprenticeSubmitInduction}
                  className="px-6 py-3.5 grad-sena text-white text-xs sm:text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-md hover:opacity-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmittingApprentice
                      ? 'Guardando Evaluación y Puntaje...'
                      : `Guardar Evaluación y Registrar en Ranking (${totalGamifiedScore} pts)`}
                  </span>
                </button>
              </div>

              {apprenticeReceipt && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-3xl neu-inset border border-[#39A900]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#2A7D00] dark:text-[#4ADE80]">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span>
                        ¡Evaluación e Inducción registradas! Posición en el Ranking: #{apprenticeReceipt.rankPosition || 1}
                      </span>
                    </div>
                    <p className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
                      Radicado: <span className="font-mono-tabular">{apprenticeReceipt.receiptId}</span> · Puntaje: <strong>{totalGamifiedScore} pts</strong> · Tiempo: <strong>{formatTimeMMSS(elapsedSeconds)}</strong> · Errores: <strong>{mistakesCount}</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setApprenticeSubTab('ranking')}
                    className="px-4 py-2.5 grad-accent text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Ver Tabla de Ranking</span>
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* SUB-TAB 2: GAMIFIED LEADERBOARD / RANKING OF APPRENTICES */}
          {apprenticeSubTab === 'ranking' && (
            <div className="neu-surface rounded-3xl p-6 lg:p-8 no-print space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/70 dark:border-slate-700/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl grad-sena flex items-center justify-center text-white shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono-tabular uppercase tracking-wider text-[#2A7D00] dark:text-[#4ADE80] font-semibold">
                      CLASIFICACIÓN EN TIEMPO REAL · PRECISIÓN Y VELOCIDAD
                    </div>
                    <h3 className="text-xl font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
                      Ranking Gamificado de Aprendices SENA
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Filter className="w-3.5 h-3.5 text-[#5A657D] dark:text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={rankingFichaFilter}
                      onChange={(e) => setRankingFichaFilter(e.target.value)}
                      placeholder="Filtrar Ranking por Ficha..."
                      className="pl-8 pr-3 py-2 text-xs neu-inset rounded-xl text-[#1E2433] dark:text-[#F1F5F9] focus:outline-none w-48 font-mono-tabular"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={fetchPublicLeaderboard}
                    className="px-4 py-2 neu-btn rounded-xl text-xs font-semibold text-[#1E2433] dark:text-[#F1F5F9] flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Actualizar Ranking</span>
                  </button>
                </div>
              </div>

              {filteredLeaderboard.length === 0 ? (
                <div className="py-10 text-center text-xs text-[#5A657D] dark:text-[#94A3B8]">
                  Aún no hay aprendices registrados en este filtro. ¡Completa las preguntas en la pestaña{' '}
                  <strong>«Evaluación Reglamento»</strong> y sé el primero en inaugurar el podio!
                </div>
              ) : (
                <div className="neu-inset rounded-3xl p-5 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-300/70 dark:border-slate-700/70 text-[#5A657D] dark:text-[#94A3B8]">
                        <th className="py-2.5 px-3 font-semibold">Posición</th>
                        <th className="py-2.5 px-3 font-semibold">Aprendiz</th>
                        <th className="py-2.5 px-3 font-semibold">N.º Ficha</th>
                        <th className="py-2.5 px-3 font-semibold">Programa</th>
                        <th className="py-2.5 px-3 font-semibold text-center">
                          Aciertos
                        </th>
                        <th className="py-2.5 px-3 font-semibold text-center">
                          Errores
                        </th>
                        <th className="py-2.5 px-3 font-semibold text-center">
                          Tiempo
                        </th>
                        <th className="py-2.5 px-3 font-semibold text-right">
                          Puntaje Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/60">
                      {filteredLeaderboard.map((entry, idx) => {
                        const displayRank = rankingFichaFilter.trim()
                          ? idx + 1
                          : entry.rank;
                        return (
                          <tr
                            key={entry.id}
                            className="hover:bg-white/40 dark:hover:bg-slate-800/30"
                          >
                            <td className="py-3 px-3 font-mono-tabular font-bold">
                              {displayRank === 1 ? (
                                <span className="px-2.5 py-1 rounded-full bg-amber-400/25 text-amber-600 dark:text-amber-300">
                                  🥇 #1
                                </span>
                              ) : displayRank === 2 ? (
                                <span className="px-2.5 py-1 rounded-full bg-slate-300/40 text-slate-700 dark:text-slate-200">
                                  🥈 #2
                                </span>
                              ) : displayRank === 3 ? (
                                <span className="px-2.5 py-1 rounded-full bg-orange-400/20 text-orange-700 dark:text-orange-300">
                                  🥉 #3
                                </span>
                              ) : (
                                `#${displayRank}`
                              )}
                            </td>
                            <td className="py-3 px-3 font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
                              {entry.fullName}
                            </td>
                            <td className="py-3 px-3 font-mono-tabular text-purple-600 dark:text-purple-400 font-semibold">
                              {entry.fichaNumber}
                            </td>
                            <td className="py-3 px-3 text-[#5A657D] dark:text-[#94A3B8] max-w-[200px] truncate">
                              {entry.programName}
                            </td>
                            <td className="py-3 px-3 font-mono-tabular text-center font-semibold text-[#2A7D00] dark:text-[#4ADE80]">
                              {entry.quizCorrectAnswers}/25
                            </td>
                            <td className="py-3 px-3 font-mono-tabular text-center text-amber-600 dark:text-amber-400">
                              {entry.quizMistakesCount}
                            </td>
                            <td className="py-3 px-3 font-mono-tabular text-center text-[#1E2433] dark:text-[#F1F5F9]">
                              {formatTimeMMSS(entry.quizElapsedSeconds)}
                            </td>
                            <td className="py-3 px-3 font-mono-tabular font-bold text-right text-purple-600 dark:text-purple-400">
                              {entry.quizScorePoints} pts
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SUB-TAB 3: PRINTABLE PASSPORT CREDENTIAL (WITH FULL COMMITMENT, ALTERNATIVE & RADICADO) */}
          {apprenticeSubTab === 'pasaporte' && (
            <div className="neu-surface rounded-3xl overflow-hidden relative">
              <div className="grad-accent px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 text-white flex items-center justify-center font-display font-bold text-xl shrink-0">
                    S
                  </div>
                  <div>
                    <div className="text-xs font-mono-tabular uppercase tracking-wider text-white/90 font-semibold">
                      Servicio Nacional de Aprendizaje · SENA
                    </div>
                    <h4 className="text-xl font-semibold text-white">
                      Pasaporte Oficial de Apropiación y Evaluación de Inducción
                    </h4>
                  </div>
                </div>

                <div className="text-right font-mono-tabular">
                  <div className="text-[11px] text-white/80">
                    PUNTAJE GAMIFICADO
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {totalGamifiedScore} pts · {completionPercentage}%
                  </div>
                </div>
              </div>

              <div className="p-6 lg:p-8 space-y-5">
                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-5 border-b border-slate-200/70 dark:border-slate-700/60 text-sm">
                  <div>
                    <dt className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
                      Aprendiz en Formación
                    </dt>
                    <dd className="font-semibold text-[#1E2433] dark:text-[#F1F5F9] mt-0.5">
                      {profile.fullName || 'Pendiente de diligenciar'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
                      Ficha de Caracterización
                    </dt>
                    <dd className="font-mono-tabular font-semibold text-purple-700 dark:text-purple-400 mt-0.5">
                      FICHA N.º {profile.fichaNumber || 'Pendiente'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
                      Programa de Formación
                    </dt>
                    <dd className="font-medium text-[#1E2433] dark:text-[#F1F5F9] mt-0.5">
                      {profile.programName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
                      Regional / Centro de Formación
                    </dt>
                    <dd className="font-medium text-[#1E2433] dark:text-[#F1F5F9] mt-0.5">
                      {profile.regionalCenter}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
                      Proyección de Etapa Productiva
                    </dt>
                    <dd className="font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {profile.preferredAlternative}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
                      Resultado Evaluación Reglamento
                    </dt>
                    <dd className="font-mono-tabular font-semibold text-[#2A7D00] dark:text-[#4ADE80] mt-0.5">
                      {totalCorrectCount}/25 aciertos · {formatTimeMMSS(elapsedSeconds)} · {mistakesCount} errores
                    </dd>
                  </div>
                </dl>

                {/* Personal Commitment & Official Radicado Block */}
                <div className="p-5 rounded-2xl neu-inset space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      Compromiso Ético e Institucional del Aprendiz
                    </span>
                    {apprenticeReceipt && (
                      <span className="text-xs font-mono-tabular font-semibold text-[#2A7D00] dark:text-[#4ADE80]">
                        Radicado Oficial: {apprenticeReceipt.receiptId} · Ranking #{apprenticeReceipt.rankPosition || 1}
                      </span>
                    )}
                  </div>
                  <p className="text-sm italic text-[#1E2433] dark:text-[#F1F5F9] leading-relaxed">
                    “{profile.personalCommitment}”
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 no-print">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-5 py-2.5 grad-accent text-white text-xs font-semibold rounded-full flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir / Guardar Constancia en PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleResetQuiz();
                      onResetProgress();
                    }}
                    className="px-4 py-2 text-xs neu-btn rounded-full text-[#5A657D] dark:text-[#94A3B8] flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reiniciar todo el recorrido</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 2: ROL INSTRUCTOR / ADMINISTRADOR (PROTECTED GOOGLE SHEETS SYNC) */}
      {/* ===================================================================== */}
      {activeRole === 'instructor' && (
        <div className="neu-surface rounded-3xl p-6 lg:p-8 no-print border border-purple-500/25 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/70 dark:border-slate-700/60 pb-5">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl grad-accent flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold">
                  <span>PANEL DE CONTROL · ROL INSTRUCTOR / ADMINISTRADOR</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 text-[#2A7D00] dark:text-[#4ADE80]">
                    <EyeOff className="w-3.5 h-3.5" /> Hoja de Cálculo Oculta a Aprendices
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
                  Auditoría de Evaluaciones, Exportación CSV y Google Drive
                </h3>
                <p className="text-xs text-[#5A657D] dark:text-[#94A3B8] mt-0.5">
                  Exclusivo para el Instructor Administrador ({AUTHORIZED_ADMIN_EMAIL}). Audita aciertos (de 25), equivocaciones, tiempos y puntajes gamificados y expórtalos a CSV/Excel o a tu Google Sheets privado.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              {needsAuth ? (
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="neu-btn px-4 py-2.5 rounded-full flex items-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="w-5 h-5 shrink-0 block"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-[#1E2433] dark:text-[#F1F5F9] whitespace-nowrap">
                    {isLoggingIn
                      ? 'Verificando Instructor...'
                      : 'Iniciar Sesión como Instructor'}
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-3 p-2 neu-inset rounded-full px-4">
                  <div className="text-xs flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#2A7D00] dark:text-[#4ADE80]" />
                    <span className="font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
                      {user?.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGoogleLogout}
                    title="Cerrar sesión de Instructor"
                    className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-[#5A657D] dark:text-[#94A3B8] cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {statusMessage && (
            <div
              className={`p-4 rounded-2xl neu-inset flex items-center gap-2.5 text-xs font-medium ${
                statusMessage.type === 'success'
                  ? 'text-[#2A7D00] dark:text-[#4ADE80]'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {isAuthorizedAdmin ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 neu-inset rounded-2xl">
                  <div className="text-[11px] font-mono-tabular text-[#5A657D] dark:text-[#94A3B8] uppercase">
                    Total Aprendices Evaluados
                  </div>
                  <div className="text-2xl font-bold font-mono-tabular text-[#1E2433] dark:text-[#F1F5F9] mt-1">
                    {serverSubmissions.length}
                  </div>
                </div>

                <div className="p-4 neu-inset rounded-2xl">
                  <div className="text-[11px] font-mono-tabular text-[#5A657D] dark:text-[#94A3B8] uppercase">
                    Fichas Activas con Entregas
                  </div>
                  <div className="text-2xl font-bold font-mono-tabular text-purple-600 dark:text-purple-400 mt-1">
                    {uniqueFichas.length}
                  </div>
                </div>

                <div className="p-4 neu-inset rounded-2xl">
                  <div className="text-[11px] font-mono-tabular text-[#5A657D] dark:text-[#94A3B8] uppercase">
                    Pendientes de Exportar a Drive
                  </div>
                  <div className="text-2xl font-bold font-mono-tabular text-[#2A7D00] dark:text-[#4ADE80] mt-1">
                    {pendingUnsyncedSubmissions.length}
                  </div>
                </div>
              </div>

              {/* Create or Link Private Google Sheet */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-6 p-5 neu-inset rounded-3xl space-y-3">
                  <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Opción A · Crear Nueva Hoja Privada en tu Google Drive
                  </div>
                  <p className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
                    Crea un archivo en tu Drive personal ({AUTHORIZED_ADMIN_EMAIL}) con las 14 columnas de evaluación y gamificación.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                    <input
                      type="text"
                      value={customSheetTitle}
                      onChange={(e) => setCustomSheetTitle(e.target.value)}
                      placeholder="Nombre del archivo en Google Sheets"
                      className="flex-1 px-3.5 py-2 text-xs neu-surface rounded-xl text-[#1E2433] dark:text-[#F1F5F9] focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => setPendingConfirmAction('create_sheet')}
                      className="px-4 py-2.5 grad-accent text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Crear Hoja en Drive</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 p-5 neu-inset rounded-3xl space-y-3">
                  <div className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                    Opción B · Vincular Hoja de Cálculo Existente
                  </div>
                  <p className="text-xs text-[#5A657D] dark:text-[#94A3B8]">
                    Pega el enlace o ID de tu hoja privada de Google Sheets para sincronizar allí las respuestas recibidas.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                    <input
                      type="text"
                      value={existingSheetInput}
                      onChange={(e) => setExistingSheetInput(e.target.value)}
                      placeholder="Pega la URL de Google Sheets o ID..."
                      className="flex-1 px-3.5 py-2 text-xs neu-surface rounded-xl text-[#1E2433] dark:text-[#F1F5F9] focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={isBusy || !existingSheetInput.trim()}
                      onClick={handleLinkExistingSpreadsheet}
                      className="px-4 py-2.5 neu-btn text-[#1E2433] dark:text-[#F1F5F9] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer disabled:opacity-50"
                    >
                      <Link2 className="w-4 h-4" />
                      <span>Vincular Hoja</span>
                    </button>
                  </div>
                </div>
              </div>

              {sheetMeta && (
                <div className="p-5 neu-surface rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-purple-500/25">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#2A7D00] dark:text-[#4ADE80] font-semibold">
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>HOJA PRIVADA DEL INSTRUCTOR</span>
                      <span aria-hidden="true">·</span>
                      <span>Pestaña: {sheetMeta.firstSheetTitle}</span>
                    </div>
                    <h4 className="text-base font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
                      {sheetMeta.title}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={
                        isBusy || pendingUnsyncedSubmissions.length === 0
                      }
                      onClick={() => setPendingConfirmAction('sync_pending')}
                      className="px-5 py-2.5 grad-sena text-white text-xs font-semibold rounded-full flex items-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-50"
                    >
                      <CloudUpload className="w-4 h-4" />
                      <span>
                        Sincronizar Pendientes a Google Sheets (
                        {pendingUnsyncedSubmissions.length})
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={handleRefreshAdminData}
                      className="px-3.5 py-2.5 neu-btn text-xs font-semibold rounded-full flex items-center gap-1.5 text-[#1E2433] dark:text-[#F1F5F9] cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${
                          isBusy ? 'animate-spin' : ''
                        }`}
                      />
                      <span>Actualizar</span>
                    </button>

                    <a
                      href={sheetMeta.spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 neu-btn text-xs font-semibold rounded-full flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400"
                    >
                      <span>Abrir Hoja Privada</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Table of Apprentice Submissions */}
              <div className="neu-inset rounded-3xl p-5 space-y-4 overflow-x-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
                      Buzón de Evaluaciones Recibidas ({filteredSubmissions.length})
                    </h5>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="relative">
                      <Filter className="w-3.5 h-3.5 text-[#5A657D] dark:text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={fichaFilter}
                        onChange={(e) => setFichaFilter(e.target.value)}
                        placeholder="Filtrar por N.º Ficha..."
                        className="pl-8 pr-3 py-1.5 text-xs neu-surface rounded-xl text-[#1E2433] dark:text-[#F1F5F9] focus:outline-none w-44 font-mono-tabular"
                      />
                    </div>

                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[#5A657D] dark:text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar aprendiz..."
                        className="pl-8 pr-3 py-1.5 text-xs neu-surface rounded-xl text-[#1E2433] dark:text-[#F1F5F9] focus:outline-none w-48"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={serverSubmissions.length === 0}
                      onClick={handleExportCSV}
                      className="px-3.5 py-1.5 neu-btn rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar CSV / Excel</span>
                    </button>
                  </div>
                </div>

                {filteredSubmissions.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#5A657D] dark:text-[#94A3B8]">
                    Aún no hay evaluaciones registradas que coincidan con el filtro.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-300/70 dark:border-slate-700/70 text-[#5A657D] dark:text-[#94A3B8]">
                        <th className="py-2.5 px-3 font-semibold">Drive</th>
                        <th className="py-2.5 px-3 font-semibold">Aprendiz</th>
                        <th className="py-2.5 px-3 font-semibold">Ficha</th>
                        <th className="py-2.5 px-3 font-semibold text-center">
                          Aciertos (25)
                        </th>
                        <th className="py-2.5 px-3 font-semibold text-center">
                          Errores
                        </th>
                        <th className="py-2.5 px-3 font-semibold text-center">
                          Tiempo (s)
                        </th>
                        <th className="py-2.5 px-3 font-semibold text-right">
                          Puntaje
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/60">
                      {filteredSubmissions.map((row) => (
                        <tr key={row.id}>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            {row.syncedToSheets ? (
                              <span className="text-[#2A7D00] dark:text-[#4ADE80] font-semibold">
                                ✓ Sincronizado
                              </span>
                            ) : (
                              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                                ● Pendiente
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
                            {row.fullName}
                          </td>
                          <td className="py-2.5 px-3 font-mono-tabular text-purple-600 dark:text-purple-400 font-semibold">
                            {row.fichaNumber}
                          </td>
                          <td className="py-2.5 px-3 font-mono-tabular text-center font-semibold text-[#2A7D00] dark:text-[#4ADE80]">
                            {row.solvedCases}
                          </td>
                          <td className="py-2.5 px-3 font-mono-tabular text-center text-amber-600 dark:text-amber-400">
                            {row.quizMistakesCount ?? 0}
                          </td>
                          <td className="py-2.5 px-3 font-mono-tabular text-center">
                            {row.quizElapsedSeconds ?? 0}s
                          </td>
                          <td className="py-2.5 px-3 font-mono-tabular font-bold text-right text-purple-600 dark:text-purple-400">
                            {row.quizScorePoints ?? 0} pts
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 neu-inset rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="text-sm font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
                  Autenticación Requerida para el Rol Instructor ({AUTHORIZED_ADMIN_EMAIL})
                </div>
                <p className="text-xs text-[#5A657D] dark:text-[#94A3B8] max-w-2xl leading-relaxed">
                  Por seguridad de la información, el acceso a la hoja de cálculo en Google Drive requiere iniciar sesión con la cuenta de Google del Instructor Administrador.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectRole('aprendiz')}
                className="px-4 py-2.5 neu-btn rounded-xl text-xs font-semibold text-[#1E2433] dark:text-[#F1F5F9] whitespace-nowrap cursor-pointer"
              >
                Volver a Vista de Aprendiz
              </button>
            </div>
          )}

          {pendingConfirmAction && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="max-w-md w-full neu-surface rounded-3xl p-6 space-y-4">
                <div className="text-xs font-mono-tabular uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold">
                  Confirmación de Instructor · Google Sheets
                </div>
                <h4 className="text-lg font-semibold text-[#1E2433] dark:text-[#F1F5F9]">
                  {pendingConfirmAction === 'create_sheet'
                    ? `¿Crear la hoja privada "${customSheetTitle}" en tu Google Drive?`
                    : `¿Exportar ${pendingUnsyncedSubmissions.length} registros pendientes a "${sheetMeta?.title}"?`}
                </h4>
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/70 dark:border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => setPendingConfirmAction(null)}
                    className="px-4 py-2 neu-btn rounded-xl text-xs font-semibold text-[#5A657D] dark:text-[#94A3B8] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={
                      pendingConfirmAction === 'create_sheet'
                        ? executeConfirmedCreateSheet
                        : executeConfirmedSyncPendingToSheets
                    }
                    className="px-5 py-2 grad-accent text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Confirmar y Guardar en Drive
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
