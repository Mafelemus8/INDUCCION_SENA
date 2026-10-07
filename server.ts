import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE_PATH = path.resolve(__dirname, 'data-submissions.json');

export interface SubmissionRecord {
  id: string;
  timestamp: string;
  fullName: string;
  fichaNumber: string;
  programName: string;
  regionalCenter: string;
  exploredSymbols: string;
  exploredPhases: string;
  solvedCases: string;
  completionPercentage: string;
  preferredAlternative: string;
  personalCommitment: string;
  // Gamified Regulation Evaluation Metrics (25 questions across 5 sections)
  quizCorrectAnswers: number;
  quizTotalQuestions: number;
  quizMistakesCount: number;
  quizElapsedSeconds: number;
  quizScorePoints: number;
  syncedToSheets?: boolean;
}

interface ServerStore {
  submissions: SubmissionRecord[];
  linkedSheetMeta: {
    spreadsheetId: string;
    title: string;
    spreadsheetUrl: string;
    firstSheetTitle: string;
  } | null;
}

function readStore(): ServerStore {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        submissions: Array.isArray(parsed.submissions) ? parsed.submissions : [],
        linkedSheetMeta: parsed.linkedSheetMeta || null
      };
    }
  } catch (err) {
    console.error('Error reading submissions store:', err);
  }
  return { submissions: [], linkedSheetMeta: null };
}

function writeStore(store: ServerStore): void {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing submissions store:', err);
  }
}

const ADMIN_EMAILS = ['mafe.lecu@gmail.com'];

async function verifyAdminToken(authHeader?: string): Promise<{ email: string } | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice(7).trim();
  if (!token) return null;

  try {
    const res = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) {
      return null;
    }

    const info = await res.json();
    const email = (info.email || '').toLowerCase();
    if (info.email_verified && ADMIN_EMAILS.includes(email)) {
      return { email };
    }
    return null;
  } catch {
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '1mb' }));

  // 1. PUBLIC WRITE-ONLY ENDPOINT FOR APPRENTICES
  app.post('/api/submissions', (req, res) => {
    try {
      const body = req.body || {};
      const fullName = String(body.fullName || '').trim().slice(0, 120);
      const fichaNumber = String(body.fichaNumber || '').trim().slice(0, 40);
      const programName = String(body.programName || '').trim().slice(0, 180);
      const regionalCenter = String(body.regionalCenter || '').trim().slice(0, 180);

      if (!fullName || !fichaNumber) {
        return res.status(400).json({
          error: 'Por favor ingresa tu nombre completo y número de Ficha antes de enviar.'
        });
      }

      const quizCorrectAnswers = Math.max(0, Math.min(25, Number(body.quizCorrectAnswers) || 0));
      const quizTotalQuestions = Math.max(1, Math.min(25, Number(body.quizTotalQuestions) || 25));
      const quizMistakesCount = Math.max(0, Number(body.quizMistakesCount) || 0);
      const quizElapsedSeconds = Math.max(0, Number(body.quizElapsedSeconds) || 0);
      const quizScorePoints = Math.max(0, Number(body.quizScorePoints) || 0);

      const newSubmission: SubmissionRecord = {
        id: `sena-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toLocaleString('es-CO', {
          timeZone: 'America/Bogota'
        }),
        fullName,
        fichaNumber,
        programName: programName || 'Sin especificar',
        regionalCenter: regionalCenter || 'Sin especificar',
        exploredSymbols: String(body.exploredSymbols || '0/4').slice(0, 20),
        exploredPhases: String(body.exploredPhases || '0/4').slice(0, 20),
        solvedCases: String(body.solvedCases || `${quizCorrectAnswers}/25`).slice(0, 25),
        completionPercentage: String(body.completionPercentage || '0%').slice(0, 10),
        preferredAlternative: String(body.preferredAlternative || 'Contrato de Aprendizaje').slice(0, 100),
        personalCommitment: String(body.personalCommitment || '').slice(0, 500),
        quizCorrectAnswers,
        quizTotalQuestions,
        quizMistakesCount,
        quizElapsedSeconds,
        quizScorePoints,
        syncedToSheets: false
      };

      const store = readStore();
      store.submissions.unshift(newSubmission);
      writeStore(store);

      // Compute rank position for this apprentice
      const sortedByScore = [...store.submissions].sort((a, b) => {
        if ((b.quizScorePoints || 0) !== (a.quizScorePoints || 0)) {
          return (b.quizScorePoints || 0) - (a.quizScorePoints || 0);
        }
        return (a.quizElapsedSeconds || 9999) - (b.quizElapsedSeconds || 9999);
      });
      const rankPosition = sortedByScore.findIndex((s) => s.id === newSubmission.id) + 1;

      return res.status(201).json({
        success: true,
        receiptId: newSubmission.id,
        timestamp: newSubmission.timestamp,
        rankPosition,
        totalParticipants: store.submissions.length
      });
    } catch (error) {
      console.error('Error saving apprentice submission:', error);
      return res.status(500).json({
        error: 'No se pudo procesar el envío de tu evaluación e inducción.'
      });
    }
  });

  // 2. PUBLIC GAMIFIED LEADERBOARD ENDPOINT (Privacy-safe: Never exposes Google Sheet URL, emails, or personal commitments)
  app.get('/api/leaderboard', (_req, res) => {
    const store = readStore();
    const sorted = [...store.submissions]
      .sort((a, b) => {
        if ((b.quizScorePoints || 0) !== (a.quizScorePoints || 0)) {
          return (b.quizScorePoints || 0) - (a.quizScorePoints || 0);
        }
        if ((a.quizMistakesCount || 0) !== (b.quizMistakesCount || 0)) {
          return (a.quizMistakesCount || 0) - (b.quizMistakesCount || 0);
        }
        return (a.quizElapsedSeconds || 9999) - (b.quizElapsedSeconds || 9999);
      })
      .slice(0, 50)
      .map((item, idx) => ({
        rank: idx + 1,
        id: item.id,
        fullName: item.fullName,
        fichaNumber: item.fichaNumber,
        programName: item.programName,
        quizCorrectAnswers: item.quizCorrectAnswers ?? 0,
        quizTotalQuestions: item.quizTotalQuestions ?? 25,
        quizMistakesCount: item.quizMistakesCount ?? 0,
        quizElapsedSeconds: item.quizElapsedSeconds ?? 0,
        quizScorePoints: item.quizScorePoints ?? 0,
        timestamp: item.timestamp
      }));

    return res.json({
      leaderboard: sorted
    });
  });

  // 3. ADMIN-ONLY ENDPOINT: Read all apprentice submissions & linked Google Sheet metadata
  app.get('/api/admin/submissions', async (req, res) => {
    const admin = await verifyAdminToken(req.headers.authorization);
    if (!admin) {
      return res.status(403).json({
        error: 'Acceso restringido exclusivamente al administrador autorizado (mafe.lecu@gmail.com).'
      });
    }

    const store = readStore();
    return res.json({
      adminEmail: admin.email,
      submissions: store.submissions,
      linkedSheetMeta: store.linkedSheetMeta
    });
  });

  // 4. ADMIN-ONLY ENDPOINT: Save linked Google Sheet metadata on server
  app.post('/api/admin/sheet-config', async (req, res) => {
    const admin = await verifyAdminToken(req.headers.authorization);
    if (!admin) {
      return res.status(403).json({
        error: 'Acceso restringido al administrador.'
      });
    }

    const { spreadsheetId, title, spreadsheetUrl, firstSheetTitle } = req.body || {};
    if (!spreadsheetId) {
      return res.status(400).json({ error: 'Falta spreadsheetId' });
    }

    const store = readStore();
    store.linkedSheetMeta = {
      spreadsheetId: String(spreadsheetId),
      title: String(title || 'Registro Oficial Inducción SENA'),
      spreadsheetUrl: String(spreadsheetUrl || ''),
      firstSheetTitle: String(firstSheetTitle || 'Aprendices_Induccion')
    };
    writeStore(store);

    return res.json({
      success: true,
      linkedSheetMeta: store.linkedSheetMeta
    });
  });

  // 5. ADMIN-ONLY ENDPOINT: Mark submissions as synced to Google Sheets
  app.post('/api/admin/mark-synced', async (req, res) => {
    const admin = await verifyAdminToken(req.headers.authorization);
    if (!admin) {
      return res.status(403).json({
        error: 'Acceso restringido al administrador.'
      });
    }

    const { ids } = req.body || {};
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'Se esperaba lista de IDs' });
    }

    const idSet = new Set(ids);
    const store = readStore();
    store.submissions = store.submissions.map((sub) =>
      idSet.has(sub.id) ? { ...sub, syncedToSheets: true } : sub
    );
    writeStore(store);

    return res.json({
      success: true,
      submissions: store.submissions
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
