export interface HistoricalMilestone {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  impactMetric: string;
  documentRef: string;
}

export interface SymbolHotspot {
  id: string;
  name: string;
  sector: string;
  meaning: string;
  institutionalConnection: string;
  valuePrinciple: string;
  coordinates: { x: number; y: number };
}

export interface HymnStanza {
  id: string;
  label: string;
  lines: string[];
  meaning: string;
  keyValue: string;
}

export interface ProjectPhase {
  number: string;
  id: 'analisis' | 'planeacion' | 'ejecucion' | 'evaluacion';
  title: string;
  question: string;
  summary: string;
  deliverables: string[];
  competencies: string[];
  evidenceTypes: {
    conocimiento: string;
    desempeno: string;
    producto: string;
  };
}

export interface DigitalTool {
  id: string;
  name: string;
  category: string;
  purpose: string;
  keyActions: string[];
  accessTip: string;
}

export interface RegulationScenario {
  id: string;
  title: string;
  chapterRef: string;
  context: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    normativeFeedback: string;
    classification: string;
  }[];
}

export interface ProductiveAlternative {
  id: string;
  name: string;
  normativeFrame: string;
  description: string;
  idealProfile: string;
  requirements: string[];
  economicSupport: string;
  supervisionMode: string;
  matchTags: {
    goal: ('empleo' | 'emprendimiento' | 'investigacion' | 'social')[];
    availability: ('tiempo_completo' | 'flexible' | 'vinculado')[];
    interest: ('empresa' | 'innovacion' | 'negocio_propio' | 'comunidad')[];
  };
}

export interface WelfareDimension {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  concreteServices: string[];
  programHighlight: string;
  contactRoute: string;
}

export const HISTORICAL_MILESTONES: HistoricalMilestone[] = [
  {
    year: '1957',
    title: 'Fundación e Impulso Tripartito',
    subtitle: 'Decreto Ley 118 del 21 de junio de 1957',
    description:
      'Impulsado por Rodolfo Martínez Tono bajo una visión tripartita entre trabajadores, empresarios y Estado, nace el SENA para brindar formación profesional integral a la clase trabajadora colombiana.',
    impactMetric: '100% Gratuidad desde su origen constitucional',
    documentRef: 'Decreto Ley 118 / 1957 · Rodolfo Martínez Tono'
  },
  {
    year: '1970',
    title: 'Expansión Regional y Centros de Oficios',
    subtitle: 'Descentralización agropecuaria, industrial y comercial',
    description:
      'El SENA consolida su presencia en las regiones de Colombia mediante centros fijos y programas móviles rurales y urbanos, llevando capacitación técnica a zonas apartadas del país.',
    impactMetric: '33 Regionales articuladas con vocación productiva local',
    documentRef: 'Plan Nacional de Capacitación Técnica'
  },
  {
    year: '1994',
    title: 'Estatuto de la Formación Profesional Integral',
    subtitle: 'Ley 119 de 1994 — Reestructuración Institucional',
    description:
      'Se reafirma la naturaleza pública del SENA como patrimonio de los colombianos, definiendo la Formación Profesional Integral (FPI) como el equilibrio entre el saber, el saber hacer y el saber ser.',
    impactMetric: '117 Centros de Formación en todo el territorio nacional',
    documentRef: 'Ley 119 de 1994 · Congreso de la República'
  },
  {
    year: '2012',
    title: 'Red de Tecnoparques, SENNOVA y Fondo Emprender',
    subtitle: 'Investigación aplicada, innovación y capital semilla',
    description:
      'La institución evoluciona hacia la investigación aplicada y el emprendimiento de alto impacto, permitiendo a los aprendices transformar proyectos formativos en empresas sostenibles y patentes tecnológicas.',
    impactMetric: '+18 Redes de Conocimiento Sectorial',
    documentRef: 'Acuerdo 00016 · Sistema SENNOVA'
  },
  {
    year: '2026',
    title: 'Transformación Digital y Sostenibilidad 4.0',
    subtitle: 'Ecosistema Zajuna, habilidades digitales y transición energética',
    description:
      'Integración de entornos virtuales de aprendizaje de última generación, certificaciones internacionales, bilingüismo e innovación verde para responder a los desafíos globales del trabajo decente.',
    impactMetric: '+7.5 Millones de cupos formativos anuales en Colombia',
    documentRef: 'Plan Estratégico Institucional Vigente'
  }
];

export const SYMBOL_HOTSPOTS: SymbolHotspot[] = [
  {
    id: 'piñon',
    name: 'El Escudo y la Bandera del SENA',
    sector: 'Tres Sectores Económicos · Industria, Comercio y Agro',
    meaning:
      'El escudo y la bandera del SENA integran los tres sectores económicos dentro de los cuales se ubica el accionar de la institución: el piñón (sector industria y construcción), el caduceo (sector de comercio y servicios) y la rama de cafeto (sector primario y extractivo).',
    institutionalConnection:
      'Representa la articulación nacional de los 117 Centros de Formación con todo el aparato productivo colombiano: industrial, tecnológico, comercial, de servicios, agropecuario y ambiental.',
    valuePrinciple: 'Trabajo productivo, unión tripartita y desarrollo integral de Colombia.',
    coordinates: { x: 50, y: 28 }
  },
  {
    id: 'logosimbolo',
    name: 'El Logosímbolo SENA',
    sector: 'El Aprendiz y los Horizontes del Futuro',
    meaning:
      'Muestra de forma simultánea la síntesis gráfica de una persona (el aprendiz) que camina hacia el horizonte con los brazos abiertos al conocimiento y los caminos que se abren hacia el futuro.',
    institutionalConnection:
      'Sintetiza el Modelo Pedagógico SENA: el aprendiz es el centro, protagonista activo y autónomo de su proyecto de vida profesional y ciudadano.',
    valuePrinciple: 'Libertad responsable, dignidad humana y aprendizaje permanente.',
    coordinates: { x: 50, y: 72 }
  }
];

export const HYMN_STANZAS = [
  {
    id: 'coro',
    label: 'Coro Institucional',
    lines: [
      'Estudiantes del SENA, ¡adelante!',
      'Por Colombia luchad con amor,',
      'con el ánimo noble y radiante',
      'transformémosla en mundo mejor.'
    ],
    meaning:
      'El coro convoca a la acción colectiva y optimista. No formamos únicamente operarios o técnicos aislados, sino ciudadanos éticos comprometidos con transformar la realidad social y económica de Colombia.',
    keyValue: 'Compromiso social y transformación positiva del entorno.'
  },
  {
    id: 'estrofa_1',
    label: 'Estrofa I · El Camino del Esfuerzo',
    lines: [
      'De la patria el futuro destino,',
      'en las manos del joven está.',
      'El trabajo es seguro camino,',
      'que el progreso a Colombia dará.'
    ],
    meaning:
      'Reconoce a la juventud y a todo aprendiz como constructores directos del porvenir nacional, dignificando el trabajo honesto y calificado como motor de equidad y paz.',
    keyValue: 'Dignidad del trabajo y liderazgo generacional.'
  },
  {
    id: 'estrofa_2',
    label: 'Estrofa II · Ciencia, Técnica y Moral',
    lines: [
      'En la forja del SENA se forman,',
      'hombres libres que anhelan triunfar.',
      'Con la ciencia y la técnica unidas,',
      'nuevos rumbos de paz trazarán.'
    ],
    meaning:
      'Expresa la esencia de la Formación Profesional Integral: articular el conocimiento científico (Saber) con el dominio práctico (Saber Hacer) dentro de un marco de libertad y paz (Saber Ser).',
    keyValue: 'Integralidad entre ciencia, técnica y ética ciudadana.'
  }
];

export const PROJECT_PHASES: ProjectPhase[] = [
  {
    number: '01',
    id: 'analisis',
    title: 'Fase de Análisis',
    question: '¿Cuál es el problema o necesidad real del entorno productivo?',
    summary:
      'Identificas junto a tu equipo e instructores los requerimientos técnicos, el contexto del sector productivo y el alcance del proyecto formativo.',
    deliverables: [
      'Diagnóstico de necesidades u oportunidades del sector',
      'Especificación de requerimientos técnicos y normativos',
      'Mapa de actores e impacto ambiental / seguridad y salud en el trabajo'
    ],
    competencies: [
      'Comprensión del contexto productivo y social',
      'Levantamiento de información primaria y secundaria',
      'Comunicación asertiva y trabajo colaborativo inicial'
    ],
    evidenceTypes: {
      conocimiento: 'Cuestionario o sustentación sobre fundamentos y normativa del sector.',
      desempeno: 'Observación directa durante entrevistas o levantamiento de información.',
      producto: 'Documento de diagnóstico y especificación de requerimientos del proyecto.'
    }
  },
  {
    number: '02',
    id: 'planeacion',
    title: 'Fase de Planeación',
    question: '¿Cómo, con qué recursos y en qué tiempos construiremos la solución?',
    summary:
      'Diseñas la arquitectura, los planos, protocolos o modelos de la solución, estableciendo el cronograma de trabajo, presupuesto y distribución de responsabilidades.',
    deliverables: [
      'Diseño técnico, prototipo conceptual, planos o arquitectura de solución',
      'Cronograma de actividades y matriz de recursos e insumos',
      'Plan de mitigación de riesgos operativos y ambientales'
    ],
    competencies: [
      'Diseño metodológico y estructuración técnica',
      'Cálculo de costos, tiempos y materiales (Matemáticas y Gestión)',
      'Inglés técnico aplicado a manuales y hojas de datos'
    ],
    evidenceTypes: {
      conocimiento: 'Estudio de casos sobre selección de materiales, herramientas o arquitecturas.',
      desempeno: 'Simulación y sustentación del plan de trabajo ante el equipo de instructores.',
      producto: 'Planos técnicos, maqueta digital, presupuesto y cronograma estructurado.'
    }
  },
  {
    number: '03',
    id: 'ejecucion',
    title: 'Fase de Ejecución',
    question: '¿Cómo materializamos la solución aplicando estándares de calidad?',
    summary:
      'Construyes, programas, produces o implementas la solución en los ambientes reales de aprendizaje, aplicando normas de seguridad industrial, salud ocupacional y buenas prácticas.',
    deliverables: [
      'Prototipo funcional, producto elaborado, servicio o sistema en marcha',
      'Bitácora de producción y registros de control de calidad',
      'Implementación de protocolos de Seguridad y Salud en el Trabajo (SST)'
    ],
    competencies: [
      'Dominio operativo de maquinaria, software o procesos del programa',
      'Resolución de problemas técnicos en tiempo real',
      'Cultura física, ergonomía y hábitos de vida saludable en el trabajo'
    ],
    evidenceTypes: {
      conocimiento: 'Evaluación técnica sobre parámetros de operación y normas de calidad.',
      desempeno: 'Lista de chequeo de ejecución práctica en taller, laboratorio o ambiente.',
      producto: 'Producto físico, sistema de software o servicio completamente desarrollado.'
    }
  },
  {
    number: '04',
    id: 'evaluacion',
    title: 'Fase de Evaluación',
    question: '¿Cumple la solución con los resultados de aprendizaje y genera valor real?',
    summary:
      'Verificas el funcionamiento mediante pruebas técnicas, mides el impacto logrado, documentas manuales de usuario y sustentas el proyecto final previo a tu Etapa Productiva.',
    deliverables: [
      'Informe de pruebas de calidad, rendimiento y validación técnica',
      'Manuales técnicos, de operación o guías de mantenimiento',
      'Sustentación final del proyecto formativo ante jurado o comité'
    ],
    competencies: [
      'Auditoría de calidad y mejora continua',
      'Ética profesional y responsabilidad sobre los resultados',
      'Preparación para la transferencia tecnológica o Etapa Productiva'
    ],
    evidenceTypes: {
      conocimiento: 'Sustentación argumentada de resultados e indicadores técnicos.',
      desempeno: 'Demostración en vivo del funcionamiento del proyecto terminado.',
      producto: 'Proyecto final validado, documentación técnica y portafolio del aprendiz.'
    }
  }
];

export const DIGITAL_TOOLS: DigitalTool[] = [
  {
    id: 'sofia_plus',
    name: 'SOFIA Plus',
    category: 'Gestión Académica y Certificación',
    purpose:
      'Sistema Optimizado para la Formación Integral del Aprendizaje Activo. Es el registro oficial de tu historia académica desde la matrícula hasta la certificación.',
    keyActions: [
      'Consultar tus Juicios Evaluativos (Aprobado / Por Evaluar) por cada Resultado de Aprendizaje',
      'Descargar constancias de estudio, certificados de notas y diplomas digitales',
      'Actualizar datos de contacto e inscribir pruebas o novedades académicas',
      'Registrar la alternativa de Etapa Productiva avalada por coordinación'
    ],
    accessTip: 'Ingresa siempre con tu documento de identidad y mantén actualizado tu correo personal.'
  },
  {
    id: 'zajuna',
    name: 'Zajuna LMS',
    category: 'Ambiente Virtual de Aprendizaje (AVA)',
    purpose:
      'Plataforma virtual oficial de aprendizaje del SENA donde interactúas con tus instructores, consultas guías de aprendizaje y entregas tus evidencias.',
    keyActions: [
      'Descargar las Guías de Aprendizaje y el material de apoyo multimedia de cada fase',
      'Subir las evidencias de conocimiento, desempeño y producto dentro de las fechas pactadas',
      'Participar en foros técnicos, sesiones sincrónicas y anuncios del equipo ejecutor',
      'Revisar la retroalimentación detallada y planes de mejoramiento de tus instructores'
    ],
    accessTip: 'Se accede con las mismas credenciales de SOFIA Plus; organiza tu portafolio digital por carpetas.'
  },
  {
    id: 'correo_sena',
    name: 'Identidad Digital @soy.sena.edu.co',
    category: 'Comunicación y Licencias Oficiales',
    purpose:
      'Tu cuenta institucional que te acredita como aprendiz activo y te brinda acceso a herramientas ofimáticas en la nube, almacenamiento y licencias educativas.',
    keyActions: [
      'Comunicación formal con instructores, voceros, coordinación académica y bienestar',
      'Acceso gratuito a suite ofimática colaborativa, almacenamiento en la nube y videollamadas',
      'Activación de convenios con plataformas tecnológicas aliadas y software especializado',
      'Notificaciones oficiales sobre convocatorias de apoyo de sostenimiento y monitorías'
    ],
    accessTip: 'Úsalo en todas tus gestiones institucionales; incluye tu número de Ficha de Caracterización en el asunto.'
  },
  {
    id: 'biblioteca',
    name: 'Sistema de Bibliotecas SENA',
    category: 'Investigación y Bases de Datos',
    purpose:
      'Red nacional de recursos bibliográficos físicos y digitales con acceso abierto a normas técnicas (ICONTEC), libros especializados, revistas científicas y repositorios.',
    keyActions: [
      'Consultar en línea normas técnicas colombianas (NTC) e internacionales para tu proyecto',
      'Explorar bases de datos especializadas en ingeniería, agroindustria, salud, diseño y código',
      'Acceder al Repositorio Institucional con proyectos destacados de otros aprendices',
      'Solicitar préstamo interbibliotecario y capacitación en citación y derechos de autor'
    ],
    accessTip: 'Autentícate con tu usuario SOFIA Plus para consultar bases de datos suscritas desde cualquier lugar.'
  }
];

export const REGULATION_SCENARIOS: RegulationScenario[] = [
  {
    id: 'inasistencia',
    title: 'Caso 01 · Proceso Formativo, Incumplimientos y Deserción',
    chapterRef: 'Acuerdo 0009 de 2024 · Capítulo IV · Artículos 26º a 31º',
    context:
      'Camilo cursa un programa Tecnólogo presencial. Debido a una calamidad doméstica y médica, presentó incumplimientos en su asistencia durante tres jornadas consecutivas sin haber formalizado aún su excusa ante el instructor.',
    question: 'Según el Capítulo IV (Artículos 26º a 31º) del Acuerdo 0009 de 2024, ¿cuál es el manejo reglamentario entre incumplimientos justificados, injustificados y la causal de deserción?',
    options: [
      {
        id: 'a',
        text: 'Esperar hasta finalizar la etapa lectiva para mencionar verbalmente la ausencia sin aportar soportes.',
        isCorrect: false,
        normativeFeedback:
          'Incorrecto. Los Artículos 26º a 31º diferencian entre incumplimientos justificados e injustificados; no reportar ni soportar oportunamente activa el procedimiento formal por causal de deserción.',
        classification: 'Riesgo de declaratoria formal de deserción (Arts. 26º a 31º)'
      },
      {
        id: 'b',
        text: 'Presentar oportunamente los soportes que acrediten el incumplimiento justificado (médico, laboral, gestación/lactancia Ley 2394 de 2024 o fuerza mayor), garantizando el procedimiento formal.',
        isCorrect: true,
        normativeFeedback:
          'Correcto. Conforme al Capítulo IV (Artículos 26º a 31º) y al Artículo 5º del Acuerdo 0009 de 2024, el aprendiz cuenta con garantía del debido proceso y puede acreditar incumplimientos justificados o tramitar novedades académicas (Aplazamiento, Traslado, Reintegro o Retiro Voluntario, Arts. 16º a 18º).',
        classification: 'Incumplimiento Justificado y Garantía del Debido Proceso'
      },
      {
        id: 'c',
        text: 'Abandonar el grupo sin tramitar Retiro Voluntario ni Aplazamiento en el sistema.',
        isCorrect: false,
        normativeFeedback:
          'Incorrecto. Los Artículos 16º a 18º contemplan las novedades académicas de Traslado, Aplazamiento, Reintegro y Retiro Voluntario precisamente para evitar que el aprendiz incurra en deserción.',
        classification: 'Omisión de Novedades Académicas (Arts. 16º a 18º)'
      }
    ]
  },
  {
    id: 'fraude_evidencia',
    title: 'Caso 02 · Deberes Académicos, Derechos de Autor y Evaluación',
    chapterRef: 'Acuerdo 0009 de 2024 · Capítulo III (Art. 8º) y Capítulo IV (Arts. 32º a 38º)',
    context:
      'Valentina debe entregar una evidencia de producto en Zajuna. Un compañero de otro Grupo (Art. 1º, numeral 5) le ofrece su proyecto terminado para que solo cambie los nombres, o bien pedir revisión y orientación al instructor.',
    question: '¿Qué establecen el Artículo 8º (Deberes) y los Artículos 32º a 38º (Evaluación del Aprendizaje) del Acuerdo 0009 de 2024 frente a esta situación?',
    options: [
      {
        id: 'a',
        text: 'Es deber del aprendiz respetar los derechos de autor y actuar con honestidad académica (Art. 8º); la evaluación cualitativa se rige por los principios de Participación, Validez, Transparencia y Confiabilidad (Arts. 32º a 38º).',
        isCorrect: true,
        normativeFeedback:
          'Correcto. El Artículo 8º exige suscribir el acta de compromiso, presentar evidencias oportunamente y respetar los derechos de autor con honestidad académica. Además, el Artículo 5º garantiza recibir evaluación objetiva e integral y solicitar revisión en caso de inconformidad.',
        classification: 'Honestidad Académica y Principios Evaluativos (Arts. 8º y 32º-38º)'
      },
      {
        id: 'b',
        text: 'Se permite reutilizar evidencias de otro grupo siempre que exista autorización verbal entre aprendices.',
        isCorrect: false,
        normativeFeedback:
          'Incorrecto. Vulnera el deber de honestidad académica y respeto a los derechos de autor (Art. 8º) y los principios de Validez, Transparencia y Confiabilidad de la evaluación (Arts. 32º a 38º).',
        classification: 'Incumplimiento del Artículo 8º y Capítulo V'
      },
      {
        id: 'c',
        text: 'La evaluación en el SENA es puramente cuantitativa de 1 a 5 y no contempla evidencias de conocimiento, desempeño y producto.',
        isCorrect: false,
        normativeFeedback:
          'Incorrecto. Los Artículos 32º a 38º del Acuerdo 0009 de 2024 establecen que la evaluación del aprendizaje es cualitativa y se realiza a través de evidencias de conocimiento, desempeño y producto.',
        classification: 'Desconocimiento del Sistema de Evaluación (Arts. 32º a 38º)'
      }
    ]
  },
  {
    id: 'seguridad_ambiente',
    title: 'Caso 03 · Derechos, Deberes, EPP y Prohibiciones en el Centro',
    chapterRef: 'Acuerdo 0009 de 2024 · Capítulo II (Art. 5º) y Capítulo III (Arts. 8º y 9º)',
    context:
      'En un ambiente práctico del Centro de Formación, un grupo debate sobre el uso de los Elementos de Protección Personal (EPP), el cuidado del mobiliario y la realización de actividades proselitistas o discriminatorias.',
    question: '¿Cómo articula el Acuerdo 0009 de 2024 los Derechos (Art. 5º), Deberes (Art. 8º) y Prohibiciones (Art. 9º) en la convivencia diaria?',
    options: [
      {
        id: 'a',
        text: 'El aprendiz tiene derecho a recibir EPP y ambientes seguros (Art. 5º), el deber de hacer buen uso de ellos y de la infraestructura (Art. 8º), y la prohibición expresa de discriminar, alterar instalaciones o hacer proselitismo (Art. 9º).',
        isCorrect: true,
        normativeFeedback:
          'Correcto. El Acuerdo 0009 de 2024 integra los Principios Orientadores de Dignidad, Inclusión y Enfoque Diferencial (Art. 3º) con la protección frente al acoso (Ley 2365 de 2024), el uso responsable de EPP e infraestructura (Arts. 5º y 8º) y las prohibiciones del Artículo 9º.',
        classification: 'Equilibrio entre Derechos (24), Deberes (24) y Prohibiciones'
      },
      {
        id: 'b',
        text: 'Está permitido escribir o alterar paredes y mobiliario o ingresar por accesos no autorizados si es fuera de horario de clase.',
        isCorrect: false,
        normativeFeedback:
          'Incorrecto. El Artículo 9º prohíbe expresamente ingresar o salir por accesos no autorizados, violentar cerraduras, y escribir, dibujar o alterar paredes, muebles o instalaciones.',
        classification: 'Conducta Prohibida en el Artículo 9º'
      },
      {
        id: 'c',
        text: 'Los principios de inclusión y enfoque diferencial solo aplican a personal administrativo, no entre aprendices.',
        isCorrect: false,
        normativeFeedback:
          'Incorrecto. El Artículo 2º (Alcance), el Artículo 3º (Principios orientadores) y el Artículo 9º prohíben discriminar a cualquier miembro de la comunidad educativa SENA.',
        classification: 'Vulneración de los Principios Orientadores (Art. 3º)'
      }
    ]
  },
  {
    id: 'debido_proceso',
    title: 'Caso 04 · Régimen de Faltas, Medidas Formativas y Debido Proceso',
    chapterRef: 'Acuerdo 0009 de 2024 · Capítulo V (Artículos 39º a 53º) y Capítulo II (Art. 7º)',
    context:
      'Ante una presunta falta en el proceso formativo, se inicia la valoración del caso conforme al Capítulo V del Reglamento. El aprendiz desea conocer cómo se califican las faltas y qué garantías de defensa y representatividad tiene.',
    question: '¿Qué disponen los Artículos 39º a 53º (Capítulo V) y los Artículos 5º a 7º (Capítulo II) del Acuerdo 0009 de 2024?',
    options: [
      {
        id: 'a',
        text: 'Cualquier falta se sanciona de forma inmediata sin tipificación ni oportunidad de ser escuchado.',
        isCorrect: false,
        normativeFeedback:
          'Incorrecto. Tanto el Artículo 5º como los Artículos 39º a 53º garantizan el debido proceso en todos los trámites académicos, administrativos y disciplinarios.',
        classification: 'Vulneración de la Garantía del Debido Proceso'
      },
      {
        id: 'b',
        text: 'Las faltas se tipifican y califican en Leves, Graves o Gravísimas; se aplican medidas formativas o disciplinarias siguiendo el debido proceso y contando con la representatividad estudiantil (voceros y representantes, Art. 7º).',
        isCorrect: true,
        normativeFeedback:
          'Correcto. El Capítulo V (Artículos 39º a 53º) regula la tipificación y calificación de faltas (Leves, Graves, Gravísimas), las medidas formativas, disciplinarias y sancionatorias, garantizando siempre el debido proceso con participación de la comunidad educativa.',
        classification: 'Aplicación Integral del Capítulo V (Arts. 39º a 53º)'
      },
      {
        id: 'c',
        text: 'El Reglamento de 2012 (Acuerdo 07 de 2012) sigue vigente por encima del Acuerdo 0009 de 2024.',
        isCorrect: false,
        normativeFeedback:
          'Incorrecto. El Artículo 3º de la Resolución del Acuerdo 0009 de 2024 derogó en su totalidad los Acuerdos 07 de 2012, 02 de 2014, 06 de 2023 y 02 de 2024.',
        classification: 'Norma Derogada (Ver Art. 3º Vigencia y Derogatorias)'
      }
    ]
  }
];

export const PRODUCTIVE_ALTERNATIVES: ProductiveAlternative[] = [
  {
    id: 'contrato_aprendizaje',
    name: 'Contrato de Aprendizaje',
    normativeFrame: 'Ley 789 de 2002 · Patrocinio Empresarial',
    description:
      'Forma especial dentro del Derecho Laboral mediante la cual una empresa patrocinadora facilita tu formación práctica en un entorno real de trabajo, recibiendo un apoyo de sostenimiento mensual y afiliación a ARL y EPS.',
    idealProfile: 'Aprendices que buscan inmersión directa en el sector empresarial formal con dedicación de tiempo completo durante su etapa práctica.',
    requirements: [
      'Estar registrado y activo en la plataforma Sistema de Gestión Virtual de Aprendices (SGVA / Caprendizaje)',
      'Aprobar el 100% de los Resultados de Aprendizaje de la Etapa Lectiva (para fase práctica)',
      'Cumplir el proceso de selección con la empresa patrocinadora y no haber suscrito contrato de aprendizaje previo en el mismo nivel'
    ],
    economicSupport: 'Apoyo de sostenimiento mensual (50% en etapa lectiva y 75% o 100% de 1 SMMLV en etapa productiva según tasa de desempleo nacional) + EPS + ARL.',
    supervisionMode: 'Bitácoras quincenales y visitas de concertación, seguimiento parcial y cierre con el instructor de seguimiento y el jefe inmediato.',
    matchTags: {
      goal: ['empleo'],
      availability: ['tiempo_completo'],
      interest: ['empresa']
    }
  },
  {
    id: 'vinculo_laboral',
    name: 'Vínculo Laboral o Contractual',
    normativeFrame: 'Desempeño en Empresa donde ya Labora el Aprendiz',
    description:
      'Si ya trabajas o prestas servicios en una empresa y tus funciones actuales están directamente relacionadas con las competencias de tu programa de formación, puedes homologar y desarrollar allí tu Etapa Productiva.',
    idealProfile: 'Aprendices trabajadores o contratistas que desean aplicar los conocimientos del programa directamente en su puesto de trabajo actual.',
    requirements: [
      'Certificación laboral o copia del contrato vigente indicando cargo y funciones específicas',
      'Aval del Coordinador Académico verificando que las funciones corresponden al perfil de egreso del programa',
      'Carta de la empresa autorizando el acompañamiento del instructor de seguimiento SENA'
    ],
    economicSupport: 'Salario u honorarios pactados directamente en tu contrato laboral o de prestación de servicios vigente.',
    supervisionMode: 'Concertación de actividades del programa dentro del puesto de trabajo y entrega de evidencias y bitácoras de seguimiento.',
    matchTags: {
      goal: ['empleo'],
      availability: ['vinculado'],
      interest: ['empresa']
    }
  },
  {
    id: 'proyecto_productivo',
    name: 'Proyecto Productivo / Unidad Productiva Familiar',
    normativeFrame: 'Emprendimiento, Fondo Emprender y Fortalecimiento Empresarial',
    description:
      'Formulación y puesta en marcha de una idea de negocio propia, startup tecnológica o fortalecimiento técnico de una unidad productiva familiar aplicando todas las competencias del programa.',
    idealProfile: 'Aprendices con espíritu emprendedor, vocación de negocio propio o integrantes de empresas familiares rurales o urbanas.',
    requirements: [
      'Formulación del plan de negocio o proyecto técnico acompañado por el Centro de Desarrollo Empresarial SENA (SBDC)',
      'Aprobación técnica del proyecto por parte de la Coordinación Académica del centro',
      'Cumplimiento del plan de trabajo e indicadores de validación comercial o prototipado'
    ],
    economicSupport: 'Posibilidad de postulación a capital semilla condonable del Fondo Emprender y asesoría especializada gratuita.',
    supervisionMode: 'Acompañamiento dual entre el instructor técnico de etapa productiva y el gestor de emprendimiento.',
    matchTags: {
      goal: ['emprendimiento'],
      availability: ['flexible', 'tiempo_completo'],
      interest: ['negocio_propio', 'innovacion']
    }
  },
  {
    id: 'sennova_investigacion',
    name: 'Participación en Proyectos I+D+i (SENNOVA / Tecnoparque)',
    normativeFrame: 'Sistema de Investigación, Desarrollo Tecnológico e Innovación',
    description:
      'Vinculación a un semillero de investigación aplicada, nodo de Tecnoparque o tecnoacademia del SENA para desarrollar prototipos de alta tecnología, publicaciones científicas o soluciones para el sector real.',
    idealProfile: 'Aprendices apasionados por la ciencia, el desarrollo experimental, la robótica, la biotecnología, el software avanzado o la innovación.',
    requirements: [
      'Pertenecer o postularse a un Semillero de Investigación o proyecto activo registrado en SENNOVA',
      'Carta de aceptación del líder de SENNOVA o dinamizador de Tecnoparque del centro de formación',
      'Aprobación de la Coordinación Académica con plan de entregables tecnológicos'
    ],
    economicSupport: 'Acceso a laboratorios especializados, insumos de prototipado y convocatorias de monitorías o apoyos de investigación.',
    supervisionMode: 'Seguimiento por entregas de desarrollo tecnológico, artículos técnicos o prototipos funcionales validados.',
    matchTags: {
      goal: ['investigacion'],
      availability: ['tiempo_completo', 'flexible'],
      interest: ['innovacion']
    }
  },
  {
    id: 'pasantia_monitoria',
    name: 'Pasantía, Apoyo a Entidades Estatales / ONG o Monitoría',
    normativeFrame: 'Proyección Social, Cooperación Institucional y Liderazgo Académico',
    description:
      'Práctica concertada en entidades públicas, alcaldías, hospitales, fundaciones sin ánimo de lucro (ONG) o ejercicio como Monitor SENA apoyando procesos formativos y tecnológicos en tu propio centro.',
    idealProfile: 'Aprendices con vocación de servicio público, impacto comunitario regional o excelencia académica destacada.',
    requirements: [
      'Convenio o carta de intención entre la entidad receptora (estatal / ONG) y el Centro de Formación SENA',
      'Afiliación obligatoria a Riesgos Laborales (ARL) antes de iniciar actividades prácticas',
      'Para Monitoría: excelente rendimiento académico, cero sanciones y superación de convocatoria interna'
    ],
    economicSupport: 'Las monitorías SENA cuentan con estímulo económico mensual según horas dedicadas; en pasantías la ARL es cubierta institucionalmente o por la entidad.',
    supervisionMode: 'Certificación de cumplimiento expedida por el supervisor de la entidad o coordinador y bitácoras quincenales.',
    matchTags: {
      goal: ['social', 'empleo'],
      availability: ['flexible', 'tiempo_completo'],
      interest: ['comunidad', 'empresa']
    }
  }
];

export const WELFARE_DIMENSIONS: WelfareDimension[] = [
  {
    id: 'salud_mental',
    title: 'Orientación Psicológica y Habilidades Socioemocionales',
    subtitle: 'Escucha activa, manejo del estrés y adaptación a la vida formativa',
    description:
      'El equipo de psicólogos y trabajadores sociales de Bienestar al Aprendiz ofrece acompañamiento confidencial para fortalecer tu inteligencia emocional, proyecto de vida y resolución pacífica de conflictos.',
    concreteServices: [
      'Atención y orientación psicológica individual y grupal sin costo',
      'Talleres de manejo de ansiedad, hábitos de estudio y prevención de riesgos psicosociales',
      'Ruta de atención integral frente a violencias basadas en género e inclusión diversa'
    ],
    programHighlight: 'Red de Escucha y Acompañamiento Permanente',
    contactRoute: 'Oficina de Bienestar al Aprendiz de tu Centro o solicitud vía correo institucional'
  },
  {
    id: 'liderazgo',
    title: 'Liderazgo, Voceros y Representación Estudiantil',
    subtitle: 'Democracia participativa y gobernanza dentro del Centro de Formación',
    description:
      'En cada Ficha de Caracterización se elige democráticamente un Vocero y un Suplente, además de los Representantes de Centro (diurno, nocturno, fin de semana y virtual) que llevan la voz de los aprendices ante las directivas.',
    concreteServices: [
      'Elección democrática de Voceros de Ficha desde la etapa de inducción',
      'Participación con voz y voto en el Comité de Evaluación y Seguimiento',
      'Escuelas regionales y nacionales de liderazgo juvenil y ciudadanía activa'
    ],
    programHighlight: 'Sistema Nacional de Liderazgo y Vocería SENA',
    contactRoute: 'Postulación abierta en tu Ficha de Caracterización durante la primera semana'
  },
  {
    id: 'apoyos_socioeconomicos',
    title: 'Apoyos Socioeconómicos, Alimentación y Transporte',
    subtitle: 'Estrategias de permanencia para que ningún aprendiz abandone su sueño',
    description:
      'Conscientes de las realidades socioeconómicas del país, el SENA gestiona convocatorias transparentes de apoyos para garantizar la permanencia de aprendices en condición de vulnerabilidad.',
    concreteServices: [
      'Apoyos de Sostenimiento Regular y FIC (Fondo Nacional de la Industria de la Construcción)',
      'Bono o servicio de apoyo alimentario y auxilio de transporte según disponibilidad presupuestal',
      'Monitorías académicas y tecnológicas remuneradas por horas de apoyo en el centro'
    ],
    programHighlight: 'Programa de Fomento a la Permanencia y Equidad',
    contactRoute: 'Convocatorias trimestrales publicadas en SOFIA Plus y carteleras oficiales del Centro'
  },
  {
    id: 'cultura_deporte',
    title: 'Deporte, Recreación, Arte y Cultura',
    subtitle: 'Salud integral, torneos zonales y muestras folclóricas',
    description:
      'La Formación Profesional Integral cultiva el cuerpo y la sensibilidad artística. Participa en selecciones deportivas, grupos de danza, música, teatro y jornadas de actividad física.',
    concreteServices: [
      'Juegos Deportivos Zonales y Nacionales de Aprendices SENA',
      'Semilleros de danza folclórica, música tradicional, cuentería, teatro y artes visuales',
      'Gimnasios institucionales, pausas activas y torneos inter-fichas'
    ],
    programHighlight: 'Festival Cultural y Juegos Nacionales de Aprendices',
    contactRoute: 'Inscripción directa con los instructores de Cultura Física y Arte de Bienestar'
  }
];
