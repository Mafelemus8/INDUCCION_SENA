export interface ApprenticeSheetRow {
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
  quizCorrectAnswers?: number | string;
  quizMistakesCount?: number | string;
  quizElapsedSeconds?: number | string;
  quizScorePoints?: number | string;
}

export interface SpreadsheetMetadata {
  spreadsheetId: string;
  title: string;
  spreadsheetUrl: string;
  firstSheetTitle: string;
}

const SHEET_HEADERS = [
  'Fecha y Hora de Registro',
  'Nombre Completo del Aprendiz',
  'N.º de Ficha (SOFIA Plus)',
  'Programa de Formación Titulada',
  'Centro / Regional SENA',
  'Símbolos Explorados',
  'Fases FPI Exploradas',
  'Preguntas Reglamento Correctas (de 25)',
  'Progreso Global (%)',
  'Alternativa Etapa Productiva',
  'Compromiso Institucional',
  'Equivocaciones en Prueba',
  'Tiempo Empleado (Segundos)',
  'Puntaje Gamificado (Ranking)'
];

/**
 * Extracts a clean spreadsheetId from either a full Google Sheets URL or a raw ID string.
 */
export function parseSpreadsheetId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

/**
 * Fetches spreadsheet metadata (title, URL, and actual first sheet tab name — never hardcode "Sheet1").
 */
export async function getSpreadsheetMetadata(
  accessToken: string,
  spreadsheetId: string
): Promise<SpreadsheetMetadata> {
  const cleanId = parseSpreadsheetId(spreadsheetId);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(cleanId)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(
      errData?.error?.message ||
        'No se pudo acceder a la hoja de cálculo. Verifica el ID o permisos.'
    );
  }

  const data = await res.json();
  const firstSheetTitle =
    data.sheets?.[0]?.properties?.title || 'Registro_Induccion';

  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title || 'Registro de Inducción SENA',
    spreadsheetUrl:
      data.spreadsheetUrl ||
      `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit`,
    firstSheetTitle
  };
}

/**
 * Creates a brand-new Google Spreadsheet in the user's Google Drive with formatted SENA headers (A1:N1).
 */
export async function createInductionSpreadsheet(
  accessToken: string,
  customTitle?: string
): Promise<SpreadsheetMetadata> {
  const title =
    customTitle?.trim() ||
    `Registro Oficial Inducción SENA — ${new Date().getFullYear()}`;
  const sheetTabName = 'Aprendices_Induccion';

  const createRes = await fetch(
    'https://sheets.googleapis.com/v4/spreadsheets',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          title
        },
        sheets: [
          {
            properties: {
              title: sheetTabName,
              gridProperties: {
                frozenRowCount: 1
              }
            }
          }
        ]
      })
    }
  );

  if (!createRes.ok) {
    const errData = await createRes.json().catch(() => ({}));
    throw new Error(
      errData?.error?.message ||
        'Error al crear la hoja de cálculo en tu Google Drive.'
    );
  }

  const createdData = await createRes.json();
  const spreadsheetId = createdData.spreadsheetId;
  const firstSheetTitle =
    createdData.sheets?.[0]?.properties?.title || sheetTabName;

  // Populate the header row in A1:N1
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values/${encodeURIComponent(`${firstSheetTitle}!A1:N1`)}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [SHEET_HEADERS]
      })
    }
  );

  return {
    spreadsheetId,
    title: createdData.properties?.title || title,
    spreadsheetUrl:
      createdData.spreadsheetUrl ||
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    firstSheetTitle
  };
}

/**
 * Reads all apprentice rows registered in the given spreadsheet.
 */
export async function fetchRegisteredApprentices(
  accessToken: string,
  spreadsheetId: string,
  sheetTabName: string
): Promise<ApprenticeSheetRow[]> {
  const cleanId = parseSpreadsheetId(spreadsheetId);
  const range = `${sheetTabName}!A1:N300`;
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      cleanId
    )}/values/${encodeURIComponent(range)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(
      errData?.error?.message ||
        'Error al leer los registros de la hoja de cálculo.'
    );
  }

  const data = await res.json();
  const rows: string[][] = data.values || [];
  if (rows.length <= 1) {
    return [];
  }

  const startIdx =
    rows[0][0]?.toLowerCase().includes('fecha') ||
    rows[0][1]?.toLowerCase().includes('nombre')
      ? 1
      : 0;

  return rows.slice(startIdx).map((r) => ({
    timestamp: r[0] || '',
    fullName: r[1] || '',
    fichaNumber: r[2] || '',
    programName: r[3] || '',
    regionalCenter: r[4] || '',
    exploredSymbols: r[5] || '',
    exploredPhases: r[6] || '',
    solvedCases: r[7] || '',
    completionPercentage: r[8] || '',
    preferredAlternative: r[9] || '',
    personalCommitment: r[10] || '',
    quizMistakesCount: r[11] || '0',
    quizElapsedSeconds: r[12] || '0',
    quizScorePoints: r[13] || '0'
  }));
}

/**
 * Appends multiple apprentice records at once to the linked Google Sheet (Admin batch sync).
 */
export async function batchAppendApprenticeRecords(
  accessToken: string,
  spreadsheetId: string,
  sheetTabName: string,
  records: ApprenticeSheetRow[]
): Promise<void> {
  if (records.length === 0) return;
  const cleanId = parseSpreadsheetId(spreadsheetId);

  const checkRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      cleanId
    )}/values/${encodeURIComponent(`${sheetTabName}!A1:N1`)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (checkRes.ok) {
    const checkData = await checkRes.json();
    if (!checkData.values || checkData.values.length === 0) {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
          cleanId
        )}/values/${encodeURIComponent(`${sheetTabName}!A1:N1`)}?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [SHEET_HEADERS]
          })
        }
      );
    }
  }

  const values = records.map((record) => [
    record.timestamp,
    record.fullName,
    record.fichaNumber,
    record.programName,
    record.regionalCenter,
    record.exploredSymbols,
    record.exploredPhases,
    record.solvedCases,
    record.completionPercentage,
    record.preferredAlternative,
    record.personalCommitment,
    String(record.quizMistakesCount ?? 0),
    String(record.quizElapsedSeconds ?? 0),
    String(record.quizScorePoints ?? 0)
  ]);

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      cleanId
    )}/values/${encodeURIComponent(
      `${sheetTabName}!A:N`
    )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values
      })
    }
  );

  if (!appendRes.ok) {
    const errData = await appendRes.json().catch(() => ({}));
    throw new Error(
      errData?.error?.message ||
        'No se pudieron sincronizar los registros en Google Sheets.'
    );
  }
}
