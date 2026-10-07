export interface Acuerdo009Definicion {
  numeral: number;
  termino: string;
  concepto: string;
}

export interface Acuerdo009Articulo {
  articulo: string;
  nombre?: string;
  contenido?: string;
  definiciones?: Acuerdo009Definicion[];
  principios?: string[];
  numerales_totales?: number;
  resumen_derechos?: string[];
  resumen_deberes?: string[];
  resumen_prohibiciones?: string[];
  etapas_ingreso?: string[];
  novedades_academicas?: string[];
  certificacion_y_reingreso?: string[];
  proceso_formativo_y_desercion?: string[];
  evaluacion_del_aprendizaje?: string[];
  resumen_disciplinario?: string[];
}

export interface Acuerdo009Capitulo {
  capitulo: string;
  titulo: string;
  articulos: Acuerdo009Articulo[];
}

export interface Acuerdo009Document {
  titulo: string;
  subtitulo: string;
  emisor: string;
  considerando: string[];
  resolucion: {
    articulo: string;
    nombre: string;
    contenido: string;
  }[];
  reglamento_anexo: {
    titulo: string;
    lugar_fecha: string;
    capitulos: Acuerdo009Capitulo[];
  };
}

export const ACUERDO_009_2024_DATA: Acuerdo009Document = {
  titulo: "ACUERDO No. 0009 DE 2024",
  subtitulo:
    "Por medio del cual se adopta el Reglamento del Aprendiz SENA y se derogan los Acuerdos 07 de 2012, 02 de 2014, 06 de 2023 y 02 de 2024",
  emisor:
    "EL CONSEJO DIRECTIVO NACIONAL DEL SERVICIO NACIONAL DE APRENDIZAJE - SENA",
  considerando: [
    "Que la Constitución Política señala en el artículo 54º que es 'obligación del Estado y de los empleadores ofrecer formación y habilitación profesional y técnica a quienes lo requieran...'",
    "Que la Constitución Política establece en el artículo 67º que la 'educación es un derecho de la persona y un servicio público que tiene una función social...'",
    "Que la Ley 30 de 1992, 'por la cual se organiza el servicio público de la Educación Superior', establece en su artículo 7º los campos de acción...",
    "Que la Ley 30 de 1992 establece en su artículo 137º que el SENA continuará adscrito a las entidades respectivas y ajustará su régimen académico conforme a la ley...",
    "Que la Ley 115 de 1994, 'por la cual se expide la ley general de educación', dispone en el artículo 1º que la educación es un proceso de formación permanente...",
    "Que la Ley 119 de 1994, 'por la cual se reestructura el Servicio Nacional de Aprendizaje - SENA', establece la misión y objetivos de la entidad...",
    "Que la Ley 361 de 1997 establece mecanismos de integración social para personas en situación de discapacidad...",
    "Que la Ley 2394 de 2024 garantiza la protección de derechos de estudiantes gestantes, en periodo de lactancia y licencias de paternidad...",
    "Que el Decreto 249 de 2004 señala como función del Consejo Directivo Nacional expedir el reglamento al que deben someterse los aprendices...",
    "Que la Ley 2365 de 2024 adopta medidas de prevención, protección y atención de acoso sexual en el ámbito laboral y de educación superior..."
  ],
  resolucion: [
    {
      articulo: "ARTÍCULO 1º",
      nombre: "ADOPCIÓN DEL REGLAMENTO",
      contenido:
        "Adoptar el Reglamento del Aprendiz SENA, mediante el documento anexo que forma parte integral de este Acuerdo, que se aplica a todas las personas matriculadas en los programas de formación profesional del SENA en sus diferentes modalidades..."
    },
    {
      articulo: "ARTÍCULO 2º",
      nombre: "ÁMBITO DE APLICACIÓN Y TRANSICIÓN",
      contenido:
        "El reglamento que se adopta con este Acuerdo será aplicable a todos los(as)(es) aprendices que se matriculen en programas de formación del SENA, a partir de la fecha de su publicación..."
    },
    {
      articulo: "ARTÍCULO 3º",
      nombre: "VIGENCIA Y DEROGATORIAS",
      contenido:
        "El presente Acuerdo rige a partir de la fecha de su publicación en el Diario Oficial y deroga en su totalidad los Acuerdos 7 de 2012, 2 de 2014, 6 de 2023 y 2 de 2024, y las disposiciones que le sean contrarias."
    },
    {
      articulo: "ARTÍCULO 4º",
      nombre: "DIVULGACIÓN",
      contenido:
        "Para efectos del artículo 8º (numeral 8) de la Ley 1437 de 2011, se ordena la publicación de este Acuerdo y del Reglamento en la página web del SENA."
    }
  ],
  reglamento_anexo: {
    titulo:
      "REGLAMENTO DEL APRENDIZ DEL SERVICIO NACIONAL DE APRENDIZAJE - SENA",
    lugar_fecha: "Bogotá, D.C. - 2024",
    capitulos: [
      {
        capitulo: "CAPÍTULO I",
        titulo: "DEFINICIONES Y PRINCIPIOS ORIENTADORES",
        articulos: [
          {
            articulo: "Artículo 1º",
            nombre: "Definiciones",
            definiciones: [
              {
                numeral: 1,
                termino: "Formación profesional integral",
                concepto:
                  "Es un proceso educativo teórico-práctico de carácter integral, orientado al desarrollo de conocimientos técnicos, tecnológicos, humanistas y al desarrollo de actitudes, valores y habilidades socioemocionales..."
              },
              {
                numeral: 2,
                termino: "Comunidad educativa SENA",
                concepto:
                  "Hacen parte de la comunidad educativa del SENA: los aprendices, los instructores, el personal administrativo y de apoyo, los directivos, egresados, empresarios, etc."
              },
              {
                numeral: 3,
                termino: "Aspirante",
                concepto:
                  "Toda persona que se encuentra participando del proceso de ingreso para matricularse en un programa de formación."
              },
              {
                numeral: 4,
                termino: "Aprendiz",
                concepto:
                  "Persona matriculada en los programas de formación profesional del SENA en sus diferentes modalidades."
              },
              {
                numeral: 5,
                termino: "Grupo",
                concepto:
                  "Conjunto de aprendices matriculados en un determinado Centro de Formación, programa, jornada, identificados con un número en el sistema..."
              }
            ]
          },
          {
            articulo: "Artículo 2º",
            nombre: "Alcance del reglamento",
            contenido:
              "Este reglamento aplica para el aspirante en lo referente al proceso de ingreso y para el aprendiz del SENA durante todo su proceso formativo y certificación en todas las sedes, jornadas, niveles y modalidades."
          },
          {
            articulo: "Artículo 3º",
            nombre: "Principios orientadores",
            principios: [
              "1. Autonomía",
              "2. Dignidad",
              "3. Inclusión",
              "4. Enfoque diferencial",
              "5. Enfoque territorial",
              "6. Participación",
              "7. Desarrollo sostenible",
              "8. Solidaridad"
            ]
          },
          {
            articulo: "Artículo 4º",
            nombre: "Centro de Convivencia",
            contenido:
              "Es una atención complementaria del proceso formativo a través del cual se brinda alojamiento y alimentación para aprendices seleccionados."
          }
        ]
      },
      {
        capitulo: "CAPÍTULO II",
        titulo: "DERECHOS DEL APRENDIZ SENA",
        articulos: [
          {
            articulo: "Artículo 5º",
            nombre: "Derechos del aprendiz SENA",
            numerales_totales: 24,
            resumen_derechos: [
              "Recibir inducción y formación profesional integral de calidad.",
              "Ser acreditado como aprendiz y disponer de la infraestructura y recursos del Centro de Formación.",
              "Recibir elementos de protección personal (EPP) y beneficios del Plan Nacional Integral de Bienestar al Aprendiz.",
              "Garantía del debido proceso en trámites académicos, administrativos y disciplinarios.",
              "Recibir evaluación objetiva e integral y solicitar revisión en caso de inconformidad.",
              "Participar en el proceso de elección de representantes y voceros."
            ]
          },
          {
            articulo: "Artículo 6º",
            nombre: "Reconocimientos formativos",
            contenido:
              "Beneficios que se otorgan a los aprendices para promover su permanencia o valorar actuaciones meritorias (menciones de honor, representación institucional, monitorías, etc.)."
          },
          {
            articulo: "Artículo 7º",
            nombre: "Representatividad de los aprendices",
            contenido:
              "Mecanismos de participación democrática mediante la elección de representantes por jornada/modalidad y voceros de grupo o enfoque diferencial."
          }
        ]
      },
      {
        capitulo: "CAPÍTULO III",
        titulo: "DEBERES DEL APRENDIZ SENA",
        articulos: [
          {
            articulo: "Artículo 8º",
            nombre: "Deberes del aprendiz SENA",
            numerales_totales: 24,
            resumen_deberes: [
              "Suscribir el acta de compromiso y cumplir con el reglamento institucional.",
              "Asistir con puntualidad y presentar las evidencias de aprendizaje oportunamente.",
              "Hacer buen uso de la infraestructura, equipos, ambientes de formación y elementos de protección personal.",
              "Respetar los derechos de autor y actuar con honestidad académica."
            ]
          },
          {
            articulo: "Artículo 9º",
            nombre: "Prohibiciones",
            resumen_prohibiciones: [
              "Realizar acciones proselitistas políticas o religiosas dentro de las instalaciones del SENA.",
              "Ingresar o salir por accesos no autorizados o violentar cerraduras.",
              "Escribir, dibujar o alterar paredes, muebles o instalaciones.",
              "Discriminar a cualquier miembro de la comunidad educativa."
            ]
          }
        ]
      },
      {
        capitulo: "CAPÍTULO IV",
        titulo: "INGRESO, PERMANENCIA Y CERTIFICACIÓN",
        articulos: [
          {
            articulo: "Artículo 10º a 15º",
            nombre: "Etapas de Ingreso",
            etapas_ingreso: [
              "Etapa de Registro",
              "Etapa de Inscripción",
              "Etapa de Selección (Pruebas Fase I y II)",
              "Etapa de Matrícula"
            ]
          },
          {
            articulo: "Artículo 16º a 18º",
            nombre: "Novedades Académicas",
            novedades_academicas: [
              "Traslado",
              "Aplazamiento",
              "Reintegro",
              "Retiro Voluntario"
            ]
          },
          {
            articulo: "Artículo 19º a 25º",
            nombre: "Certificación y Reingreso",
            certificacion_y_reingreso: [
              "Requisitos de certificación y expedición de documentos digitales.",
              "Procedimiento para trámites de reingreso al SENA."
            ]
          },
          {
            articulo: "Artículo 26º a 31º",
            nombre: "Proceso Formativo y Deserción",
            proceso_formativo_y_desercion: [
              "Etapa lectiva y etapa productiva (alternativas de formación).",
              "Incumplimientos justificados e injustificados.",
              "Causales y procedimiento formal en caso de deserción."
            ]
          },
          {
            articulo: "Artículo 32º a 38º",
            nombre: "Evaluación del Aprendizaje",
            evaluacion_del_aprendizaje: [
              "Evaluación cualitativa, evidencias de aprendizaje (conocimiento, desempeño, producto).",
              "Principios evaluativos: Participación, Validez, Transparencia y Confiabilidad."
            ]
          }
        ]
      },
      {
        capitulo: "CAPÍTULO V",
        titulo:
          "RÉGIMEN DE FALTAS, MEDIDAS FORMATIVAS, DISCIPLINARIAS Y SANCIONATORIAS",
        articulos: [
          {
            articulo: "Artículo 39º a 53º",
            nombre: "Régimen Disciplinario y Sancionatorio",
            resumen_disciplinario: [
              "Tipificación y calificación de faltas (Leves, Graves, Gravísimas).",
              "Medidas formativas y disciplinarias.",
              "Procedimiento para la aplicación de sanciones y debido proceso."
            ]
          }
        ]
      }
    ]
  }
};
