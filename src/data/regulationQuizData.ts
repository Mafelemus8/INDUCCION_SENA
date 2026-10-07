export interface RegulationQuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  /** Explicación detallada que recibe el aprendiz si acierta (refuerzo positivo) o si falla (diagnóstico exacto de por qué esa opción es incorrecta y cuál es la norma aplicable). */
  feedback: string;
}

export interface RegulationQuizQuestion {
  id: string;
  chapterId: string;
  chapterTitle: string;
  articleRef: string;
  questionNumberInSection: number;
  question: string;
  positiveReinforcementTitle: string;
  errorDiagnosticHint: string;
  options: RegulationQuizOption[];
}

export interface RegulationQuizSection {
  chapterId: string;
  shortTitle: string;
  fullTitle: string;
  articlesRange: string;
}

export const REGULATION_QUIZ_SECTIONS: RegulationQuizSection[] = [
  {
    chapterId: 'CAPÍTULO I',
    shortTitle: 'Cap. I · Definiciones y Principios',
    fullTitle: 'CAPÍTULO I · Definiciones y Principios Orientadores',
    articlesRange: 'Artículos 1º a 4º'
  },
  {
    chapterId: 'CAPÍTULO II',
    shortTitle: 'Cap. II · Derechos y Vocería',
    fullTitle: 'CAPÍTULO II · Derechos, Reconocimientos y Representatividad',
    articlesRange: 'Artículos 5º a 7º'
  },
  {
    chapterId: 'CAPÍTULO III',
    shortTitle: 'Cap. III · Deberes y Prohibiciones',
    fullTitle: 'CAPÍTULO III · Deberes y Prohibiciones del Aprendiz SENA',
    articlesRange: 'Artículos 8º y 9º'
  },
  {
    chapterId: 'CAPÍTULO IV',
    shortTitle: 'Cap. IV · Ingreso, Evaluación y Deserción',
    fullTitle: 'CAPÍTULO IV · Ingreso, Permanencia, Evaluación y Certificación',
    articlesRange: 'Artículos 10º a 38º'
  },
  {
    chapterId: 'CAPÍTULO V',
    shortTitle: 'Cap. V · Régimen Disciplinario',
    fullTitle: 'CAPÍTULO V · Régimen de Faltas, Medidas y Sanciones',
    articlesRange: 'Artículos 39º a 53º'
  }
];

export const REGULATION_QUIZ_QUESTIONS: RegulationQuizQuestion[] = [
  // =========================================================================
  // CAPÍTULO I: DEFINICIONES Y PRINCIPIOS ORIENTADORES (5 PREGUNTAS)
  // =========================================================================
  {
    id: 'cap1-q1',
    chapterId: 'CAPÍTULO I',
    chapterTitle: 'Definiciones y Principios Orientadores',
    articleRef: 'Acuerdo 0009 de 2024 · Artículo 1º (Numeral 1)',
    questionNumberInSection: 1,
    question:
      'Según el Artículo 1º del Acuerdo 0009 de 2024, ¿qué caracteriza esencialmente a la Formación Profesional Integral (FPI) del SENA?',
    positiveReinforcementTitle:
      '¡Excelente dominio conceptual! Comprendes la integralidad del modelo SENA.',
    errorDiagnosticHint:
      'Identifica el fallo: La Formación Profesional Integral no es solo adiestramiento técnico ni exclusivamente teórica; une el Saber, el Hacer y el Ser.',
    options: [
      {
        id: 'a',
        text: 'Es un proceso educativo teórico-práctico integral que desarrolla conocimientos técnicos, tecnológicos, humanistas, actitudes, valores y habilidades socioemocionales.',
        isCorrect: true,
        feedback:
          '¡Correcto! El Artículo 1º (numeral 1) define la FPI como un proceso teórico-práctico integral que articula competencias técnicas con valores éticos y habilidades socioemocionales.'
      },
      {
        id: 'b',
        text: 'Es un entrenamiento exclusivamente operativo en máquinas industriales sin componentes humanistas ni socioemocionales.',
        isCorrect: false,
        feedback:
          'Fallaste porque redujiste la formación a lo operativo. El Artículo 1º establece expresamente que la FPI incluye formación humanista, valores y habilidades socioemocionales.'
      },
      {
        id: 'c',
        text: 'Es un curso libre de asistencia opcional que no conduce a ninguna certificación formal.',
        isCorrect: false,
        feedback:
          'Fallaste porque la FPI es un proceso estructurado por competencias y Resultados de Aprendizaje que conduce a certificación oficial del SENA.'
      }
    ]
  },
  {
    id: 'cap1-q2',
    chapterId: 'CAPÍTULO I',
    chapterTitle: 'Definiciones y Principios Orientadores',
    articleRef: 'Acuerdo 0009 de 2024 · Artículo 1º (Numerales 3 y 4)',
    questionNumberInSection: 2,
    question:
      '¿Cuál es la diferencia normativa entre un «Aspirante» y un «Aprendiz» según el Artículo 1º del Reglamento?',
    positiveReinforcementTitle:
      '¡Muy bien! Distingues con precisión el estatus jurídico dentro del proceso SENA.',
    errorDiagnosticHint:
      'Identifica el fallo: Confundiste la etapa de inscripción/selección con el acto formal de matrícula vigente.',
    options: [
      {
        id: 'a',
        text: 'El Aspirante participa en el proceso de ingreso para matricularse, mientras que el Aprendiz ya tiene matrícula formal vigente en un programa de formación.',
        isCorrect: true,
        feedback:
          '¡Acierto total! Los numerales 3 y 4 del Artículo 1º precisan que la condición de Aprendiz se adquiere formalmente con la matrícula en el programa.'
      },
      {
        id: 'b',
        text: 'Son sinónimos exactos; cualquier persona que visite la página de SOFIA Plus ya es legalmente Aprendiz SENA.',
        isCorrect: false,
        feedback:
          'Fallaste porque visitar la plataforma o inscribirse te otorga calidad de Aspirante (numeral 3), pero solo el matriculado es Aprendiz (numeral 4).'
      },
      {
        id: 'c',
        text: 'El Aspirante estudia en modalidad virtual y el Aprendiz únicamente en modalidad presencial.',
        isCorrect: false,
        feedback:
          'Fallaste porque la modalidad (presencial, virtual o a distancia) no distingue al aspirante del aprendiz; todo matriculado en cualquier modalidad es Aprendiz SENA.'
      }
    ]
  },
  {
    id: 'cap1-q3',
    chapterId: 'CAPÍTULO I',
    chapterTitle: 'Definiciones y Principios Orientadores',
    articleRef: 'Acuerdo 0009 de 2024 · Artículo 2º',
    questionNumberInSection: 3,
    question:
      'De acuerdo con el Artículo 2º (Alcance del Reglamento), ¿a quiénes y en qué modalidades aplica el Acuerdo 0009 de 2024?',
    positiveReinforcementTitle:
      '¡Respuesta impecable! Tienes claro el alcance universal del Reglamento en todo el país.',
    errorDiagnosticHint:
      'Identifica el fallo: El Reglamento no excluye modalidades virtuales ni etapas productivas; rige todo el ciclo formativo.',
    options: [
      {
        id: 'a',
        text: 'Aplica únicamente a los aprendices presenciales durante la etapa lectiva dentro del Centro de Formación.',
        isCorrect: false,
        feedback:
          'Fallaste porque excluiste la modalidad virtual/a distancia y la etapa productiva. El Artículo 2º cubre todas las sedes, jornadas, niveles y modalidades.'
      },
      {
        id: 'b',
        text: 'Aplica al aspirante durante el proceso de ingreso y al aprendiz durante todo su proceso formativo y certificación en todas las sedes, jornadas, niveles y modalidades.',
        isCorrect: true,
        feedback:
          '¡Exacto! El Artículo 2º establece que el Reglamento rige desde el proceso de ingreso del aspirante hasta la certificación del aprendiz en cualquier modalidad.'
      },
      {
        id: 'c',
        text: 'Aplica exclusivamente a programas de nivel Tecnólogo y excluye a los programas Técnicos y Complementarios.',
        isCorrect: false,
        feedback:
          'Fallaste porque el Artículo 2º incluye explícitamente todos los niveles y modalidades de formación del SENA.'
      }
    ]
  },
  {
    id: 'cap1-q4',
    chapterId: 'CAPÍTULO I',
    chapterTitle: 'Definiciones y Principios Orientadores',
    articleRef: 'Acuerdo 0009 de 2024 · Artículo 3º',
    questionNumberInSection: 4,
    question:
      '¿Cuáles de los siguientes hacen parte de los 8 Principios Orientadores consagrados en el Artículo 3º del Reglamento del Aprendiz?',
    positiveReinforcementTitle:
      '¡Gran acierto! Reconoces los pilares éticos y constitucionales de la convivencia SENA.',
    errorDiagnosticHint:
      'Identifica el fallo: Revisa los 8 principios del Artículo 3º (Autonomía, Dignidad, Inclusión, Enfoque diferencial, Enfoque territorial, Participación, Desarrollo sostenible y Solidaridad).',
    options: [
      {
        id: 'a',
        text: 'Competencia individualista, cobro de matrículas, exclusión territorial y jerarquía rígida.',
        isCorrect: false,
        feedback:
          'Fallaste porque estos conceptos contradicen directamente la gratuidad y el espíritu solidario e inclusivo del SENA.'
      },
      {
        id: 'b',
        text: 'Autonomía, Dignidad, Inclusión, Enfoque diferencial, Enfoque territorial, Participación, Desarrollo sostenible y Solidaridad.',
        isCorrect: true,
        feedback:
          '¡Correcto! Esos son exactamente los 8 principios orientadores listados en el Artículo 3º del Acuerdo 0009 de 2024.'
      },
      {
        id: 'c',
        text: 'Lucro privado, tercerización académica y evaluación cuantitativa de 1 a 10.',
        isCorrect: false,
        feedback:
          'Fallaste porque el SENA es público, gratuito y su evaluación es cualitativa (Aprobado / No Aprobado).'
      }
    ]
  },
  {
    id: 'cap1-q5',
    chapterId: 'CAPÍTULO I',
    chapterTitle: 'Definiciones y Principios Orientadores',
    articleRef: 'Acuerdo 0009 de 2024 · Artículo 4º',
    questionNumberInSection: 5,
    question:
      'Según el Artículo 4º del Reglamento, ¿qué son los Centros de Convivencia del SENA?',
    positiveReinforcementTitle:
      '¡Excelente! Completaste el Capítulo I con pleno conocimiento institucional.',
    errorDiagnosticHint:
      'Identifica el fallo: Los Centros de Convivencia no son centros de sanción disciplinaria, sino espacios de bienestar con alojamiento y alimentación.',
    options: [
      {
        id: 'a',
        text: 'Son una atención complementaria del proceso formativo mediante la cual se brinda alojamiento y alimentación a aprendices seleccionados.',
        isCorrect: true,
        feedback:
          '¡Muy bien! El Artículo 4º define el Centro de Convivencia como el servicio complementario de alojamiento y alimentación para apoyar la permanencia de aprendices seleccionados.'
      },
      {
        id: 'b',
        text: 'Son oficinas jurídicas donde se redactan las cancelaciones de matrícula de los aprendices.',
        isCorrect: false,
        feedback:
          'Fallaste porque confundiste un programa de apoyo socioeconómico (alojamiento y alimentación) con una instancia disciplinaria.'
      },
      {
        id: 'c',
        text: 'Son empresas privadas externas donde el aprendiz debe pagar arriendo mensual obligatorio.',
        isCorrect: false,
        feedback:
          'Fallaste porque los Centros de Convivencia son una atención institucional gratuita del SENA para aprendices beneficiarios.'
      }
    ]
  },

  // =========================================================================
  // CAPÍTULO II: DERECHOS DEL APRENDIZ SENA (5 PREGUNTAS)
  // =========================================================================
  {
    id: 'cap2-q1',
    chapterId: 'CAPÍTULO II',
    chapterTitle: 'Derechos del Aprendiz SENA',
    articleRef: 'Acuerdo 0009 de 2024 · Artículo 5º',
    questionNumberInSection: 1,
    question:
      'De acuerdo con el Artículo 5º (Derechos del Aprendiz), ¿cuál de las siguientes garantías tiene todo aprendiz desde el inicio de su formación?',
    positiveReinforcementTitle:
      '¡Correcto! Conoces tus derechos fundamentales como integrante de la comunidad SENA.',
    errorDiagnosticHint:
      'Identifica el fallo: Todo aprendiz tiene derecho a recibir inducción, formación integral gratuita, acreditación y Elementos de Protección Personal (EPP).',
    options: [
      {
        id: 'a',
        text: 'Recibir inducción, formación profesional integral de calidad, ser acreditado como aprendiz y recibir los Elementos de Protección Personal (EPP) según su programa.',
        isCorrect: true,
        feedback:
          '¡Excelente! El Artículo 5º consagra en sus primeros numerales el derecho a la inducción, a disponer de infraestructura, acreditación y elementos de protección personal.'
      },
      {
        id: 'b',
        text: 'Exigir el título profesional sin presentar evidencias ni cursar la Etapa Productiva.',
        isCorrect: false,
        feedback:
          'Fallaste porque la certificación exige aprobar el 100% de los Resultados de Aprendizaje de la etapa lectiva y productiva.'
      },
      {
        id: 'c',
        text: 'Ceder su cupo y carné institucional a un familiar cuando no pueda asistir a clase.',
        isCorrect: false,
        feedback:
          'Fallaste porque la matrícula y la acreditación como aprendiz son personales e intransferibles.'
      }
    ]
  },
  {
    id: 'cap2-q2',
    chapterId: 'CAPÍTULO II',
    chapterTitle: 'Derechos del Aprendiz SENA',
    articleRef: 'Acuerdo 0009 de 2024 · Artículo 5º',
    questionNumberInSection: 2,
    question:
      'Si un aprendiz no está de acuerdo con la calificación emitida por su instructor en una evidencia de aprendizaje, ¿qué derecho le otorga el Artículo 5º?',
    positiveReinforcementTitle:
      '¡Muy bien! Sabes cómo ejercer tu derecho a una evaluación objetiva y al debido proceso.',
    errorDiagnosticHint:
      'Identifica el fallo: El aprendiz no está obligado a guardar silencio ni a acudir a vías de hecho; tiene derecho a solicitar la revisión formal de su evaluación.',
    options: [
      {
        id: 'a',
        text: 'Ninguno, ya que las calificaciones en SOFIA Plus son inmodificables e inapelables desde el primer instante.',
        isCorrect: false,
        feedback:
          'Fallaste porque el Artículo 5º garantiza expresamente el derecho a recibir evaluación objetiva y a solicitar revisión cuando exista inconformidad sustentada.'
      },
      {
        id: 'b',
        text: 'Recibir una evaluación objetiva e integral y solicitar de manera respetuosa y dentro de los plazos reglamentarios la revisión de los resultados.',
        isCorrect: true,
        feedback:
          '¡Acierto total! El Artículo 5º protege el derecho al debido proceso evaluativo y a la solicitud formal de revisión.'
      },
      {
        id: 'c',
        text: 'Bloquear el acceso al ambiente de formación hasta que el instructor cambie la nota.',
        isCorrect: false,
        feedback:
          'Fallaste porque las vías de hecho vulneran la convivencia; el canal legítimo es la solicitud de revisión académica regulada en el Acuerdo 0009 de 2024.'
      }
    ]
  },
  {
    id: 'cap2-q3',
    chapterId: 'CAPÍTULO II',
    chapterTitle: 'Derechos del Aprendiz SENA',
    articleRef: 'Acuerdo 0009 de 2024 · Artículo 6º',
    questionNumberInSection: 3,
    question:
      '¿Qué propósito tienen los «Reconocimientos Formativos» establecidos en el Artículo 6º del Acuerdo 0009 de 2024?',
    positiveReinforcementTitle:
      '¡Brillante! Identificas cómo el SENA exalta la excelencia, la investigación y el liderazgo.',
    errorDiagnosticHint:
      'Identifica el fallo: Los reconocimientos formativos buscan promover la permanencia y valorar actuaciones meritorias (menciones, monitorías, representación).',
    options: [
      {
        id: 'a',
        text: 'Eximir al aprendiz de presentar su proyecto formativo a cambio de un pago económico al Centro.',
        isCorrect: false,
        feedback:
          'Fallaste porque en el SENA todos los trámites son gratuitos y ningún estímulo consiste en comprar calificaciones.'
      },
      {
        id: 'b',
        text: 'Promover la permanencia y valorar actuaciones meritorias mediante menciones de honor, representación institucional, monitorías o intercambios.',
        isCorrect: true,
        feedback:
          '¡Correcto! El Artículo 6º define los reconocimientos formativos como estímulos al mérito académico, investigativo, deportivo, cultural o comunitario.'
      },
      {
        id: 'c',
        text: 'Aumentar el número de horas sancionatorias de los aprendices con bajo rendimiento.',
        isCorrect: false,
        feedback:
          'Fallaste porque los reconocimientos formativos del Artículo 6º son estímulos positivos a la excelencia, no sanciones.'
      }
    ]
  },
  {
    id: 'cap2-q4',
    chapterId: 'CAPÍTULO II',
    chapterTitle: 'Derechos del Aprendiz SENA',
    articleRef: 'Acuerdo 0009 de 2024 · Artículo 7º',
    questionNumberInSection: 4,
    question:
      'Según el Artículo 7º (Representatividad de los aprendices), ¿cómo ejercen los aprendices su participación democrática en el Centro de Formación?',
    positiveReinforcementTitle:
      '¡Excelente respuesta! Conoces las figuras de Vocería de Ficha y Representación de Centro.',
    errorDiagnosticHint:
      'Identifica el fallo: El Artículo 7º garantiza la elección democrática de voceros de grupo/ficha, voceros de enfoque diferencial y representantes de Centro.',
    options: [
      {
        id: 'a',
        text: 'Mediante la elección democrática de representantes de aprendices por jornada/modalidad y voceros de grupo o de enfoque diferencial.',
        isCorrect: true,
        feedback:
          '¡Exacto! El Artículo 7º consolida la participación democrática a través de voceros de grupo, voceros de enfoque diferencial y representantes elegidos por votación.'
      },
      {
        id: 'b',
        text: 'Únicamente el Subdirector de Centro puede hablar en nombre de los aprendices, pues no existen voceros estudiantiles.',
        isCorrect: false,
        feedback:
          'Fallaste porque el SENA promueve activamente el liderazgo estudiantil mediante voceros y representantes elegidos por los propios aprendices.'
      },
      {
        id: 'c',
        text: 'Asignando como vocero vitalicio a quien pague una cuota sindical obligatoria.',
        isCorrect: false,
        feedback:
          'Fallaste porque la vocería y representación en el SENA son gratuitas, pedagógicas y elegidas democráticamente.'
      }
    ]
  },
  {
    id: 'cap2-q5',
    chapterId: 'CAPÍTULO II',
    chapterTitle: 'Derechos del Aprendiz SENA',
    articleRef: 'Acuerdo 0009 de 2024 · Considerandos y Artículo 5º',
    questionNumberInSection: 5,
    question:
      '¿Qué protección especial incorpora el Acuerdo 0009 de 2024 en armonía con la Ley 2394 de 2024 y el enfoque diferencial?',
    positiveReinforcementTitle:
      '¡Dominio sobresaliente del Capítulo II! Reconoces el enfoque humano e inclusivo del nuevo Reglamento.',
    errorDiagnosticHint:
      'Identifica el fallo: El Acuerdo 0009 de 2024 integra la Ley 2394 de 2024 para proteger los derechos de aprendices gestantes, en lactancia y licencias de paternidad.',
    options: [
      {
        id: 'a',
        text: 'La cancelación automática de la matrícula cuando una aprendiz informa que se encuentra en estado de embarazo.',
        isCorrect: false,
        feedback:
          'Fallaste porque retirar a una aprendiz por gestación sería una grave vulneración constitucional. El Acuerdo protege su continuidad académica.'
      },
      {
        id: 'b',
        text: 'La garantía y protección de los derechos de aprendices gestantes, en periodo de lactancia y licencias de paternidad, asegurando ajustes para su permanencia formativa.',
        isCorrect: true,
        feedback:
          '¡Muy bien! El Acuerdo 0009 de 2024 incorpora expresamente la Ley 2394 de 2024 para proteger la maternidad, lactancia y paternidad en el ámbito formativo.'
      },
      {
        id: 'c',
        text: 'El cobro de un seguro adicional para personas en situación de discapacidad.',
        isCorrect: false,
        feedback:
          'Fallaste porque la Ley 361 de 1997 y el principio de inclusión garantizan apoyos y ajustes razonables sin ningún cobro.'
      }
    ]
  },

  // =========================================================================
  // CAPÍTULO III: DEBERES Y PROHIBICIONES DEL APRENDIZ SENA (5 PREGUNTAS)
  // =========================================================================
  {
    id: 'cap3-q1',
    chapterId: 'CAPÍTULO III',
    chapterTitle: 'Deberes y Prohibiciones del Aprendiz SENA',
    articleRef: 'Acuerdo 0009 de 2024 · Artículo 8º',
    questionNumberInSection: 1,
    question:
      'Según el Artículo 8º (Deberes del Aprendiz SENA), ¿cuál es una obligación fundamental respecto a las actividades de aprendizaje y la honestidad académica?',
    positiveReinforcementTitle:
      '¡Muy bien! La integridad académica y la autoría propia son sellos del aprendiz SENA.',
    errorDiagnosticHint:
      'Identifica el fallo: El Artículo 8º exige asistir con puntualidad, presentar evidencias oportunamente y respetar los derechos de autor sin plagio ni fraude.',
    options: [
      {
        id: 'a',
        text: 'Asistir con puntualidad, presentar oportunamente las evidencias de aprendizaje y respetar los derechos de autor actuando con honestidad académica.',
        isCorrect: true,
        feedback:
          '¡Correcto! El Artículo 8º establece como deber ineludible la puntualidad, la entrega oportuna de evidencias y el respeto estricto a la propiedad intelectual.'
      },
      {
        id: 'b',
        text: 'Descargar proyectos de internet y presentarlos como propios siempre que funcionen correctamente.',
        isCorrect: false,
        feedback:
          'Fallaste porque presentar trabajos ajenos como propios constituye plagio/fraude y vulnera el deber de honestidad académica del Artículo 8º.'
      },
      {
        id: 'c',
        text: 'Asistir únicamente el último día del trimestre para firmar la planilla general.',
        isCorrect: false,
        feedback:
          'Fallaste porque la formación profesional integral requiere participación continua y cumplimiento de los horarios programados.'
      }
    ]
  },
  {
    id: 'cap3-q2',
    chapterId: 'CAPÍTULO III',
    chapterTitle: 'Deberes y Prohibiciones del Aprendiz SENA',
    articleRef: 'Acuerdo 0009 de 2024 · Artículo 8º',
    questionNumberInSection: 2,
    question:
      '¿Qué establece el Artículo 8º frente al uso de la infraestructura, equipos, herramientas y Elementos de Protección Personal (EPP)?',
    positiveReinforcementTitle:
      '¡Excelente! Cuidar los ambientes públicos de aprendizaje beneficia a miles de colombianos.',
    errorDiagnosticHint:
      'Identifica el fallo: Los equipos y ambientes del SENA son bienes públicos y el uso de EPP es obligatorio para proteger tu vida y salud.',
    options: [
      {
        id: 'a',
        text: 'El uso de los Elementos de Protección Personal (EPP) es opcional si el aprendiz considera que tiene suficiente experiencia práctica.',
        isCorrect: false,
        feedback:
          'Fallaste porque el Artículo 8º obliga a portar y usar adecuadamente los EPP conforme a las normas de seguridad y salud en el trabajo.'
      },
      {
        id: 'b',
        text: 'Es deber del aprendiz hacer buen uso de la infraestructura, equipos y ambientes de formación, así como utilizar adecuadamente los Elementos de Protección Personal.',
        isCorrect: true,
        feedback:
          '¡Acierto total! El Artículo 8º exige preservar los bienes públicos del Centro y cumplir rigurosamente los protocolos de bioseguridad y seguridad industrial.'
      },
      {
        id: 'c',
        text: 'Los aprendices pueden retirar herramientas del taller a su casa sin autorización escrita.',
        isCorrect: false,
        feedback:
          'Fallaste porque retirar bienes o elementos del SENA sin autorización vulnera los deberes y prohibiciones del Reglamento.'
      }
    ]
  },
  {
    id: 'cap3-q3',
    chapterId: 'CAPÍTULO III',
    chapterTitle: 'Deberes y Prohibiciones del Aprendiz SENA',
    articleRef: 'Acuerdo 0009 de 2024 · Artículo 9º',
    questionNumberInSection: 3,
    question:
      'De acuerdo con el Artículo 9º (Prohibiciones), ¿cuál de las siguientes conductas está expresamente prohibida dentro de las instalaciones o entornos del SENA?',
    positiveReinforcementTitle:
      '¡Correcto! Identificas claramente las conductas prohibidas que afectan el carácter pluralista del SENA.',
    errorDiagnosticHint:
      'Identifica el fallo: El Artículo 9º prohíbe realizar acciones proselitistas de carácter político o religioso dentro de las instalaciones o ambientes formativos.',
    options: [
      {
        id: 'a',
        text: 'Participar en semilleros de investigación de SENNOVA o actividades culturales de Bienestar.',
        isCorrect: false,
        feedback:
          'Fallaste porque participar en investigación y cultura es un derecho y un estímulo formativo, no una prohibición.'
      },
      {
        id: 'b',
        text: 'Realizar acciones proselitistas de carácter político o religioso dentro de las instalaciones del SENA o en sus ambientes virtuales.',
        isCorrect: true,
        feedback:
          '¡Muy bien! El Artículo 9º prohíbe expresamente el proselitismo político o religioso para garantizar el respeto y la neutralidad institucional.'
      },
      {
        id: 'c',
        text: 'Solicitar préstamo de libros técnicos en el Sistema Nacional de Bibliotecas SBS.',
        isCorrect: false,
        feedback:
          'Fallaste porque el uso de la biblioteca es un servicio gratuito y un derecho de todo aprendiz.'
      }
    ]
  },
  {
    id: 'cap3-q4',
    chapterId: 'CAPÍTULO III',
    chapterTitle: 'Deberes y Prohibiciones del Aprendiz SENA',
    articleRef: 'Acuerdo 0009 de 2024 · Artículo 9º',
    questionNumberInSection: 4,
    question:
      '¿Qué dispone el Artículo 9º respecto a los accesos físicos, cerraduras, paredes y mobiliario de los Centros de Formación?',
    positiveReinforcementTitle:
      '¡Impecable! Respetar las normas de seguridad física y la planta física es fundamental.',
    errorDiagnosticHint:
      'Identifica el fallo: Está prohibido ingresar o salir por accesos no autorizados, violentar cerraduras o rayar/alterar bienes e instalaciones.',
    options: [
      {
        id: 'a',
        text: 'Está prohibido ingresar o salir por accesos no autorizados, violentar cerraduras, y escribir, dibujar o alterar paredes, muebles o instalaciones.',
        isCorrect: true,
        feedback:
          '¡Exacto! El Artículo 9º tipifica como prohibiciones expresas vulnerar los controles de acceso y deteriorar o rayar la infraestructura institucional.'
      },
      {
        id: 'b',
        text: 'Se permite ingresar saltando las mallas perimetrales cuando el aprendiz llega tarde a su jornada.',
        isCorrect: false,
        feedback:
          'Fallaste porque ingresar por lugares no autorizados pone en riesgo tu integridad y constituye una prohibición expresa del Artículo 9º.'
      },
      {
        id: 'c',
        text: 'Los aprendices pueden modificar las cerraduras de los laboratorios para dejar sus maletas bajo llave personal.',
        isCorrect: false,
        feedback:
          'Fallaste porque alterar o violentar cerraduras institucionales está estrictamente prohibido en el Artículo 9º.'
      }
    ]
  },
  {
    id: 'cap3-q5',
    chapterId: 'CAPÍTULO III',
    chapterTitle: 'Deberes y Prohibiciones del Aprendiz SENA',
    articleRef: 'Acuerdo 0009 de 2024 · Artículo 9º y Ley 2365 de 2024',
    questionNumberInSection: 5,
    question:
      'En relación con la convivencia y el respeto a la dignidad humana, ¿qué prohíbe tajantemente el Artículo 9º del Reglamento?',
    positiveReinforcementTitle:
      '¡Excelente cierre del Capítulo III! La dignidad y la no discriminación son innegociables.',
    errorDiagnosticHint:
      'Identifica el fallo: El Artículo 9º prohíbe toda forma de discriminación, matoneo, acoso o maltrato hacia cualquier integrante de la comunidad educativa.',
    options: [
      {
        id: 'a',
        text: 'Conformar equipos de trabajo interdisciplinarios con aprendices de diferentes regiones.',
        isCorrect: false,
        feedback:
          'Fallaste porque el trabajo colaborativo e intercultural es promovido por los principios de solidaridad y enfoque territorial.'
      },
      {
        id: 'b',
        text: 'Discriminar, acosar o vulnerar la dignidad de cualquier miembro de la comunidad educativa por razones de género, etnia, orientación, discapacidad o condición social.',
        isCorrect: true,
        feedback:
          '¡Correcto! El Artículo 9º y la Ley 2365 de 2024 prohíben y sancionan cualquier acto de discriminación, violencia o acoso en entornos formativos.'
      },
      {
        id: 'c',
        text: 'Expresar opiniones técnicas respetuosas durante los debates académicos del proyecto formativo.',
        isCorrect: false,
        feedback:
          'Fallaste porque el debate académico respetuoso hace parte del principio de participación y autonomía.'
      }
    ]
  },

  // =========================================================================
  // CAPÍTULO IV: INGRESO, PERMANENCIA Y CERTIFICACIÓN (5 PREGUNTAS)
  // =========================================================================
  {
    id: 'cap4-q1',
    chapterId: 'CAPÍTULO IV',
    chapterTitle: 'Ingreso, Permanencia y Certificación',
    articleRef: 'Acuerdo 0009 de 2024 · Artículos 10º a 15º',
    questionNumberInSection: 1,
    question:
      'Según los Artículos 10º a 15º del Capítulo IV, ¿cuál es el orden correcto de las 4 etapas oficiales para ingresar a un programa de formación del SENA?',
    positiveReinforcementTitle:
      '¡Perfecto! Conoces la ruta transparente y meritocrática de ingreso al SENA.',
    errorDiagnosticHint:
      'Identifica el fallo: Recuerda la secuencia en SOFIA Plus: primero te registras como usuario, luego te inscribes a la oferta, presentas pruebas de selección y finalmente legalizas matrícula.',
    options: [
      {
        id: 'a',
        text: '1. Registro · 2. Inscripción · 3. Selección (Pruebas Fase I y II) · 4. Matrícula.',
        isCorrect: true,
        feedback:
          '¡Acierto total! Los Artículos 10º a 15º estructuran el ingreso gratuito y por mérito en esas 4 etapas secuenciales.'
      },
      {
        id: 'b',
        text: '1. Pago de pin bancario · 2. Entrevista con intermediario · 3. Certificación · 4. Inscripción.',
        isCorrect: false,
        feedback:
          'Fallaste porque en el SENA no existen pines bancarios ni intermediarios; todos los procesos son 100% gratuitos.'
      },
      {
        id: 'c',
        text: '1. Matrícula directa sin pruebas · 2. Etapa Productiva · 3. Selección · 4. Registro.',
        isCorrect: false,
        feedback:
          'Fallaste porque nadie puede matricularse en formación titulada sin haber superado previamente el Registro, la Inscripción y las Pruebas de Selección.'
      }
    ]
  },
  {
    id: 'cap4-q2',
    chapterId: 'CAPÍTULO IV',
    chapterTitle: 'Ingreso, Permanencia y Certificación',
    articleRef: 'Acuerdo 0009 de 2024 · Artículos 16º a 18º',
    questionNumberInSection: 2,
    question:
      'Si un aprendiz enfrenta una calamidad doméstica o incapacidad médica prolongada que le impide continuar temporalmente, ¿qué Novedad Académica del Artículo 16º a 18º debe tramitar para no caer en deserción?',
    positiveReinforcementTitle:
      '¡Gran decisión! Tramitar novedades académicas a tiempo protege tu cupo y tu historial en el SENA.',
    errorDiagnosticHint:
      'Identifica el fallo: Dejar de asistir sin avisar genera declaratoria de deserción. La figura correcta para pausar temporalmente con soporte es el Aplazamiento.',
    options: [
      {
        id: 'a',
        text: 'Dejar de asistir en silencio durante dos meses y esperar a que el sistema congele el cupo automáticamente.',
        isCorrect: false,
        feedback:
          'Fallaste porque ausentarse sin justificación ni trámite formal activa el proceso de declaratoria de deserción (Arts. 26º a 31º).'
      },
      {
        id: 'b',
        text: 'Solicitar formalmente un Aplazamiento de la formación (o Traslado, Reintegro o Retiro Voluntario según el caso) adjuntando los soportes respectivos.',
        isCorrect: true,
        feedback:
          '¡Correcto! Los Artículos 16º a 18º contemplan el Traslado, Aplazamiento, Reintegro y Retiro Voluntario como novedades académicas formales.'
      },
      {
        id: 'c',
        text: 'Enviar a un amigo a responder los exámenes presenciales mientras dura la incapacidad.',
        isCorrect: false,
        feedback:
          'Fallaste porque la suplantación de identidad es una falta gravísima que acarrea cancelación de matrícula.'
      }
    ]
  },
  {
    id: 'cap4-q3',
    chapterId: 'CAPÍTULO IV',
    chapterTitle: 'Ingreso, Permanencia y Certificación',
    articleRef: 'Acuerdo 0009 de 2024 · Artículos 26º a 31º',
    questionNumberInSection: 3,
    question:
      'De acuerdo con los Artículos 26º a 31º (Proceso Formativo y Deserción), ¿qué ocurre antes de que el Subdirector de Centro declare formalmente la deserción de un aprendiz por inasistencias injustificadas?',
    positiveReinforcementTitle:
      '¡Muy bien! Tienes claro el procedimiento de verificación y el derecho a presentar soportes.',
    errorDiagnosticHint:
      'Identifica el fallo: La deserción no se decreta sin agotar el procedimiento de reporte del instructor y el plazo para que el aprendiz justifique su incumplimiento.',
    options: [
      {
        id: 'a',
        text: 'Se garantiza el debido proceso: el instructor reporta el incumplimiento y el aprendiz cuenta con la oportunidad reglamentaria para presentar las justificaciones y soportes válidos.',
        isCorrect: true,
        feedback:
          '¡Exacto! Los Artículos 26º a 31º diferencian entre incumplimientos justificados e injustificados y exigen agotar el procedimiento formal antes de declarar la deserción.'
      },
      {
        id: 'b',
        text: 'El guarda de seguridad de la portería anula el carné al segundo día de retardo sin informar al instructor.',
        isCorrect: false,
        feedback:
          'Fallaste porque la declaratoria de deserción es un acto académico-administrativo reglado que exige reporte del instructor y decisión motivada.'
      },
      {
        id: 'c',
        text: 'Se le cobra una multa en dinero por cada hora de inasistencia para evitar la deserción.',
        isCorrect: false,
        feedback:
          'Fallaste porque en el SENA no existen multas monetarias académicas.'
      }
    ]
  },
  {
    id: 'cap4-q4',
    chapterId: 'CAPÍTULO IV',
    chapterTitle: 'Ingreso, Permanencia y Certificación',
    articleRef: 'Acuerdo 0009 de 2024 · Artículos 32º a 38º',
    questionNumberInSection: 4,
    question:
      'Según los Artículos 32º a 38º (Evaluación del Aprendizaje), ¿cuáles son los 3 tipos de evidencias y cuáles son los juicios de evaluación cualitativa en el SENA?',
    positiveReinforcementTitle:
      '¡Respuesta brillante! Dominas el sistema de evaluación por competencias del SENA.',
    errorDiagnosticHint:
      'Identifica el fallo: En el SENA no se califica con notas numéricas de 1.0 a 5.0; se evalúan evidencias de Conocimiento, Desempeño y Producto con juicio Aprobado (A) o No Aprobado (D).',
    options: [
      {
        id: 'a',
        text: 'Evidencias únicamente de memoria escrita, calificadas numéricamente de 1.0 a 5.0.',
        isCorrect: false,
        feedback:
          'Fallaste porque la evaluación en el SENA es cualitativa e integral, no únicamente memorística ni numérica.'
      },
      {
        id: 'b',
        text: 'Evidencias de Conocimiento, de Desempeño y de Producto, valoradas mediante evaluación cualitativa bajo los principios de Participación, Validez, Transparencia y Confiabilidad.',
        isCorrect: true,
        feedback:
          '¡Correcto! Los Artículos 32º a 38º establecen las evidencias de conocimiento (Saber), desempeño (Hacer) y producto, regidas por esos 4 principios evaluativos.'
      },
      {
        id: 'c',
        text: 'Evidencias opcionales que solo se presentan si el aprendiz reprueba la etapa productiva.',
        isCorrect: false,
        feedback:
          'Fallaste porque todo Resultado de Aprendizaje requiere evidencias obligatorias tanto en etapa lectiva como productiva.'
      }
    ]
  },
  {
    id: 'cap4-q5',
    chapterId: 'CAPÍTULO IV',
    chapterTitle: 'Ingreso, Permanencia y Certificación',
    articleRef: 'Acuerdo 0009 de 2024 · Artículos 19º a 25º',
    questionNumberInSection: 5,
    question:
      'Conforme a los Artículos 19º a 25º, ¿cuándo obtiene el aprendiz su Certificación y expedición de título o certificado digital en el SENA?',
    positiveReinforcementTitle:
      '¡Excelente cierre del Capítulo IV! Tienes clara la meta de certificación integral.',
    errorDiagnosticHint:
      'Identifica el fallo: Para certificarse no basta con terminar las clases lectivas; es requisito aprobar el 100% de la Etapa Lectiva, la Etapa Productiva y los requisitos legales.',
    options: [
      {
        id: 'a',
        text: 'Al aprobar la totalidad de los Resultados de Aprendizaje de la Etapa Lectiva y de la Etapa Productiva y cumplir los requisitos académicos y administrativos del programa.',
        isCorrect: true,
        feedback:
          '¡Muy bien! Los Artículos 19º a 25º disponen que la certificación se expide una vez aprobados todos los Resultados de Aprendizaje de ambas etapas.'
      },
      {
        id: 'b',
        text: 'Tan pronto finaliza la primera semana de inducción institucional.',
        isCorrect: false,
        feedback:
          'Fallaste porque la inducción es solo el primer resultado de aprendizaje al iniciar el programa formativo.'
      },
      {
        id: 'c',
        text: 'Únicamente cursando la Etapa Lectiva, ya que la Etapa Productiva es voluntaria en programas Tecnólogos.',
        isCorrect: false,
        feedback:
          'Fallaste porque la Etapa Productiva es un requisito obligatorio e indispensable para optar al título o certificado en formación titulada.'
      }
    ]
  },

  // =========================================================================
  // CAPÍTULO V: RÉGIMEN DE FALTAS, MEDIDAS Y SANCIONES (5 PREGUNTAS)
  // =========================================================================
  {
    id: 'cap5-q1',
    chapterId: 'CAPÍTULO V',
    chapterTitle: 'Régimen de Faltas, Medidas Formativas y Sancionatorias',
    articleRef: 'Acuerdo 0009 de 2024 · Artículos 39º a 42º',
    questionNumberInSection: 1,
    question:
      'Según el Capítulo V del Acuerdo 0009 de 2024, ¿cómo se clasifican y califican las faltas en las que puede incurrir un aprendiz?',
    positiveReinforcementTitle:
      '¡Exacto! Reconoces la tipología y graduación de las faltas en el régimen del aprendiz.',
    errorDiagnosticHint:
      'Identifica el fallo: El Reglamento tipifica faltas académicas y disciplinarias, y las califica según su gravedad en Leves, Graves o Gravísimas.',
    options: [
      {
        id: 'a',
        text: 'Se tipifican en faltas académicas y disciplinarias, y se califican como Leves, Graves o Gravísimas según los criterios del Reglamento.',
        isCorrect: true,
        feedback:
          '¡Correcto! Los Artículos 39º a 53º establecen la distinción entre faltas académicas y disciplinarias y su graduación en Leves, Graves y Gravísimas.'
      },
      {
        id: 'b',
        text: 'Todas las faltas son consideradas Gravísimas automáticamente sin importar el contexto ni los antecedentes.',
        isCorrect: false,
        feedback:
          'Fallaste porque el Acuerdo 0009 de 2024 aplica criterios de proporcionalidad y graduación (Leves, Graves y Gravísimas).'
      },
      {
        id: 'c',
        text: 'Solo existen faltas deportivas y culturales.',
        isCorrect: false,
        feedback:
          'Fallaste porque las faltas que afectan el proceso formativo o la convivencia son de naturaleza académica o disciplinaria.'
      }
    ]
  },
  {
    id: 'cap5-q2',
    chapterId: 'CAPÍTULO V',
    chapterTitle: 'Régimen de Faltas, Medidas Formativas y Sancionatorias',
    articleRef: 'Acuerdo 0009 de 2024 · Artículos 43º a 45º',
    questionNumberInSection: 2,
    question:
      '¿Cuál es la diferencia fundamental entre una «Medida Formativa» (ej. llamado de atención verbal o Plan de Mejoramiento) y una «Sanción Disciplinaria»?',
    positiveReinforcementTitle:
      '¡Muy bien! Distingues el enfoque pedagógico preventivo del régimen sancionatorio.',
    errorDiagnosticHint:
      'Identifica el fallo: Las medidas formativas tienen carácter pedagógico para corregir y superar dificultades, mientras que las sanciones son consecuencias formales ante faltas graves o gravísimas.',
    options: [
      {
        id: 'a',
        text: 'La Medida Formativa es pedagógica y busca prevenir o corregir desempeños/conductas (como el Plan de Mejoramiento), mientras que la Sanción se impone tras un proceso formal ante faltas graves o gravísimas.',
        isCorrect: true,
        feedback:
          '¡Acierto total! El SENA prioriza el acompañamiento mediante medidas formativas antes de llegar a instancias sancionatorias.'
      },
      {
        id: 'b',
        text: 'El Plan de Mejoramiento Académico implica la expulsión inmediata del aprendiz del Centro de Formación.',
        isCorrect: false,
        feedback:
          'Fallaste porque el Plan de Mejoramiento es una oportunidad pedagógica concertada con el instructor para alcanzar los Resultados de Aprendizaje pendientes.'
      },
      {
        id: 'c',
        text: 'No existe ninguna diferencia; cualquier observación en clase cancela la matrícula de inmediato.',
        isCorrect: false,
        feedback:
          'Fallaste porque el Reglamento distingue claramente las medidas formativas pedagógicas de las sanciones.'
      }
    ]
  },
  {
    id: 'cap5-q3',
    chapterId: 'CAPÍTULO V',
    chapterTitle: 'Régimen de Faltas, Medidas Formativas y Sancionatorias',
    articleRef: 'Acuerdo 0009 de 2024 · Artículos 46º a 50º',
    questionNumberInSection: 3,
    question:
      '¿Qué órgano colegiado evalúa los casos académicos o disciplinarios graves/gravísimos y emite la recomendación al Subdirector de Centro?',
    positiveReinforcementTitle:
      '¡Excelente! Conoces el rol del Comité de Evaluación y Seguimiento.',
    errorDiagnosticHint:
      'Identifica el fallo: Ningún instructor puede expulsar por su cuenta a un aprendiz; el caso debe ser analizado por el Comité de Evaluación y Seguimiento.',
    options: [
      {
        id: 'a',
        text: 'El Comité de Evaluación y Seguimiento del Centro de Formación, donde participan instructor, coordinación académica, Bienestar y representante/vocero de aprendices.',
        isCorrect: true,
        feedback:
          '¡Exacto! El Comité de Evaluación y Seguimiento es la instancia colegiada que analiza las pruebas, escucha al aprendiz y recomienda la medida al Subdirector.'
      },
      {
        id: 'b',
        text: 'Un solo instructor de manera unilateral y verbal en el pasillo del Centro.',
        isCorrect: false,
        feedback:
          'Fallaste porque las sanciones de condicionamiento o cancelación de matrícula nunca pueden ser impuestas unilateralmente por un instructor.'
      },
      {
        id: 'c',
        text: 'La empresa patrocinadora sin intervención del SENA.',
        isCorrect: false,
        feedback:
          'Fallaste porque la potestad académica y disciplinaria sobre la matrícula recae exclusivamente en las instancias oficiales del SENA.'
      }
    ]
  },
  {
    id: 'cap5-q4',
    chapterId: 'CAPÍTULO V',
    chapterTitle: 'Régimen de Faltas, Medidas Formativas y Sancionatorias',
    articleRef: 'Acuerdo 0009 de 2024 · Artículos 48º a 52º',
    questionNumberInSection: 4,
    question:
      'Durante un procedimiento ante el Comité de Evaluación y Seguimiento, ¿qué garantías integran el derecho fundamental al Debido Proceso del aprendiz?',
    positiveReinforcementTitle:
      '¡Impecable! Conoces tus garantías constitucionales de defensa y contradicción.',
    errorDiagnosticHint:
      'Identifica el fallo: El debido proceso exige citación previa con cargos claros, acceso a las pruebas, derecho a presentar descargos y a interponer recurso de reposición.',
    options: [
      {
        id: 'a',
        text: 'Ser citado previamente por escrito conociendo el informe y las pruebas, ser escuchado en descargos, estar acompañado por el vocero y poder interponer recurso de reposición contra el acto sancionatorio.',
        isCorrect: true,
        feedback:
          '¡Correcto! El Capítulo V garantiza la presunción de inocencia, notificación previa, defensa técnica/descargos y el recurso de reposición.'
      },
      {
        id: 'b',
        text: 'Ser sancionado en secreto y enterarse únicamente cuando intente descargar el certificado final.',
        isCorrect: false,
        feedback:
          'Fallaste porque toda actuación disciplinaria o académica sancionatoria requiere notificación formal y garantía de defensa.'
      },
      {
        id: 'c',
        text: 'No tener derecho a presentar pruebas ni testigos a su favor.',
        isCorrect: false,
        feedback:
          'Fallaste porque el derecho a controvertir pruebas y aportar elementos de juicio es pilar del debido proceso en el Acuerdo 0009 de 2024.'
      }
    ]
  },
  {
    id: 'cap5-q5',
    chapterId: 'CAPÍTULO V',
    chapterTitle: 'Régimen de Faltas, Medidas Formativas y Sancionatorias',
    articleRef: 'Acuerdo 0009 de 2024 · Artículos 45º a 53º',
    questionNumberInSection: 5,
    question:
      '¿Qué implica la sanción de «Condicionamiento de la Matrícula» frente a la «Cancelación de la Matrícula» en el Capítulo V?',
    positiveReinforcementTitle:
      '¡Felicitaciones! Has completado las 25 preguntas de los 5 Capítulos del Reglamento del Aprendiz SENA.',
    errorDiagnosticHint:
      'Identifica el fallo: El Condicionamiento mantiene al aprendiz en formación sujeto a un compromiso y Plan de Mejoramiento; la Cancelación retira definitivamente la calidad de aprendiz.',
    options: [
      {
        id: 'a',
        text: 'El Condicionamiento permite continuar en formación suscribiendo un compromiso y Plan de Mejoramiento (pero pierde estímulos/representación), mientras que la Cancelación termina el vínculo formativo e impone inhabilidad temporal para reingresar.',
        isCorrect: true,
        feedback:
          '¡Excelente dominio normativo! El Condicionamiento es una última oportunidad bajo seguimiento estricto, mientras la Cancelación extingue la matrícula.'
      },
      {
        id: 'b',
        text: 'Ambas sanciones significan exactamente lo mismo: la expulsión vitalicia de cualquier entidad pública.',
        isCorrect: false,
        feedback:
          'Fallaste porque el Condicionamiento no retira al aprendiz del SENA, y la Cancelación tiene un periodo determinado de vigencia sancionatoria, no vitalicio.'
      },
      {
        id: 'c',
        text: 'El Condicionamiento otorga automáticamente una mención de honor al aprendiz.',
        isCorrect: false,
        feedback:
          'Fallaste porque el Condicionamiento de Matrícula es una sanción que de hecho conlleva la pérdida de estímulos y cargos de vocería.'
      }
    ]
  }
];
