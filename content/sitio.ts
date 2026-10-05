// Contenido local de respaldo: textos aprobados por el cliente.
// Se usa cuando WordPress no está configurado, no responde o un campo está vacío.
// Si se cambia algo aquí, ejecute `npm run exportar-contenido` para actualizar el importador.
import type {
  Ajustes,
  ComoAyudar,
  Contacto,
  Inicio,
  NoticiasPagina,
  PoliticaDatos,
  PreguntasFrecuentes,
  QuienesSomos,
} from "@/lib/types";

export const ajustes: Ajustes = {
  direccion: "Calle 9 N. 19-42, Los Almendros\nSanta Marta, Colombia",
  telefono_fijo: "(605) 422 9570",
  celular: "311 213 4787",
  correo: "",
  sitio_web: "asoproyuja.org",
  horario: "",
  mapa_url: "https://www.google.com/maps?q=Calle+9+%2319-42,+Los+Almendros,+Santa+Marta,+Colombia&output=embed",
  youtube: "https://www.youtube.com/@asoproyuja",
  facebook: "https://www.facebook.com/asociacion.asoneshca",
  instagram: "https://www.instagram.com/asoproyuja",
  descripcion_pie: "Asociación Agropecuaria Campesina Nacional. Sembrando oportunidades para el campo y su gente.",
  texto_copyright: "© 2026 Asoproyuja · NIT 825.001.418-2",
  texto_creditos: "Todos los derechos reservados · Web realizada por",
  creditos_enlace: { title: "Wedoo.digital", url: "https://wedoo.digital", target: "_blank" },
  boton_flotante: { title: "Donar ahora", url: "/como-ayudar" },
};

const ctaApoyo = {
  eyebrow: "Apóyanos",
  titulo: "¿Quieres sumarte a nuestro trabajo?",
  texto: "Cada alianza, aporte o hora de voluntariado impulsa nuestros programas para la niñez y las familias.",
  boton: { title: "Cómo ayudar", url: "/como-ayudar" },
};

export const inicio: Inicio = {
  slides: [
    {
      eyebrow: "Institucional",
      titulo: "Sembrando esperanza a la niñez en Colombia",
      texto: "Trabajamos por el fortalecimiento y bienestar de las familias en Colombia.",
      imagen: "/assets/img/hero-comunidad.jpg",
      imagen_alt: "Comunidad Asoproyuja",
      botones: [
        { boton: { title: "Conócenos", url: "/quienes-somos" }, estilo: "primario" },
        { boton: { title: "Contáctanos", url: "/contacto" }, estilo: "contorno" },
      ],
    },
    {
      eyebrow: "Equipo logístico",
      titulo: "Promover la buena alimentación en las familias y la niñez colombiana",
      texto: "Somos una red de apoyo en los distintos programas para la niñez en la región Caribe.",
      imagen: "/assets/img/hero-equipo-logistico.jpg",
      imagen_alt: "Jornada social comunitaria",
      botones: [{ boton: { title: "Más información", url: "/quienes-somos" }, estilo: "primario" }],
    },
    {
      eyebrow: "Sostenibilidad",
      titulo: "Trabajamos en distintos programas para la formación y bienestar de la primera infancia",
      texto: "Crecimiento saludable de niñas y niños en nuestro territorio.",
      imagen: "/assets/img/hero-dia-de-la-ninez.jpg",
      imagen_alt: "Día de la niñez",
      botones: [{ boton: { title: "Ver programas", url: "/noticias" }, estilo: "primario" }],
    },
  ],
  bienvenida: {
    imagen: "/assets/img/bienvenida.jpg",
    imagen_alt: "Niñas y niños de Asoproyuja",
    sello_numero: "+ de 28 años",
    sello_texto: "Trabajando por la niñez y su bienestar",
    eyebrow: "Bienvenidos",
    titulo: "Niñez y comunidad",
    texto:
      "Somos una asociación agropecuaria campesina que trabaja de la mano de las comunidades rurales de Santa Marta, promoviendo la producción sostenible de alimentos y acompañando el desarrollo de la primera infancia.",
    boton: { title: "Conoce quiénes somos →", url: "/quienes-somos" },
  },
  accesos: [
    {
      icono: "mensaje",
      color: "verde",
      titulo: "Atención al ciudadano",
      texto: "Canales de contacto y radicación de solicitudes.",
      enlace: { title: "Atención al ciudadano", url: "/contacto" },
    },
    {
      icono: "pregunta",
      color: "amarillo",
      titulo: "Preguntas frecuentes",
      texto: "Resuelve dudas sobre nuestros programas.",
      enlace: { title: "Preguntas frecuentes", url: "/preguntas-frecuentes" },
    },
    {
      icono: "corazon",
      color: "amarillo",
      titulo: "Cómo ayudar",
      texto: "Voluntariado, alianzas y donaciones.",
      enlace: { title: "Cómo ayudar", url: "/como-ayudar" },
    },
  ],
  noticias: {
    eyebrow: "Noticias",
    titulo: "Lo último de nuestra comunidad",
    texto: "Historias y novedades del trabajo con las familias campesinas.",
    cantidad: 3,
  },
  aliados: {
    eyebrow: "Aliados",
    titulo: "Organizaciones que caminan con nosotros",
    texto: "Entidades y empresas que hacen posible nuestro trabajo con la niñez y las familias.",
    logos: [
      { nombre: "Instituto Colombiano de Bienestar Familiar", logo: "/assets/img/aliados/icbf-bienestar-familiar.png" },
      { nombre: "Provisiones El Pilar S.A.S.", logo: "/assets/img/aliados/el-pilar.png" },
      { nombre: "Super Grano El Sembrador", logo: "/assets/img/aliados/el-sembrador.png" },
      { nombre: "Escala Gráfica", logo: "/assets/img/aliados/escala-grafica.png" },
      { nombre: "Distribuciones Marquesote S.A.S.", logo: "/assets/img/aliados/marquesote.png" },
      { nombre: "Comercializadora Mortines S.A.S.", logo: "/assets/img/aliados/mortines.png" },
      { nombre: "Fenoco, Ferrocarriles del Norte de Colombia S.A.", logo: "/assets/img/aliados/fenoco.png" },
    ],
    texto_cta: "¿Tu organización quiere aliarse con Asoproyuja?",
    enlace_cta: { title: "Escríbenos", url: "/contacto" },
  },
  newsletter: {
    eyebrow: "Newsletter",
    titulo: "Recibe novedades de Asoproyuja",
    texto: "Historias del territorio, convocatorias y jornadas próximas directo a tu correo.",
    placeholder: "tu@correo.com",
    boton: "Suscribirme",
    mensaje_exito: "¡Gracias por suscribirte!",
    nota: "Sin spam. Puedes darte de baja cuando quieras.",
  },
  apoyo: {
    eyebrow: "Apóyanos",
    titulo: "Ayuda a sembrar más oportunidades",
    texto: "Cada aporte impulsa nuestros programas de agricultura sostenible y primera infancia.",
    boton: { title: "Quiero apoyar", url: "/como-ayudar" },
    mascota: "/assets/img/mascota.png",
  },
};

export const quienesSomos: QuienesSomos = {
  hero: {
    eyebrow: "Nosotros",
    titulo: "Quiénes somos",
    texto: "Trabajamos por la niñez, las familias y las comunidades de Colombia con programas de intervención social.",
    contenido:
      "<p>Somos una entidad que se especializa en programas de intervención social que promueven la inclusión, educación y protección de comunidades vulnerables.</p><p>A través de distintos proyectos contribuimos a mejorar la calidad de vida de la primera infancia, familias, adultos mayores y comunidades con enfoques diferenciales.</p>",
  },
  mision_vision: {
    eyebrow: "Nuestro propósito",
    titulo: "Misión y visión",
    mision:
      "<p>En <strong>ASOPROYUJA</strong> trabajamos por el fortalecimiento del campo mediante la producción sostenible de alimentos, la siembra y el desarrollo agropecuario, promoviendo la <strong>seguridad alimentaria</strong> y el bienestar integral de las comunidades. Asimismo, contribuimos al <strong>trabajo social y formativo en la primera infancia</strong>, impulsando iniciativas que favorezcan el crecimiento saludable, la educación en valores, el cuidado del medio ambiente y una mejor calidad de vida para la niñez y las familias colombianas.</p>",
    vision:
      "<p>Ser una asociación agropecuaria líder a nivel nacional, reconocida por transformar vidas a través de la producción agrícola sostenible, la protección de la niñez y el fortalecimiento de las comunidades. En el año 2035, <strong>ASOPROYUJA</strong> aspira a consolidarse como un referente de <strong>desarrollo rural, seguridad alimentaria, trabajo social en primera infancia e impacto comunitario</strong>, sembrando oportunidades, esperanza y bienestar para las futuras generaciones.</p>",
  },
  lineas: {
    eyebrow: "Lo que hacemos",
    titulo: "Áreas de intervención",
    texto: "Asesoramos y ejecutamos proyectos que contribuyen a mejorar la calidad de vida de la población.",
    items: [
      {
        icono: "hoja",
        color: "verde",
        titulo: "Ambiental",
        items: [{ texto: "Protección del medio ambiente y preservación de los recursos naturales" }],
      },
      {
        icono: "construccion",
        color: "amarillo",
        titulo: "Económica",
        items: [
          { texto: "Infraestructura" },
          { texto: "Logística" },
          { texto: "Construcción" },
          { texto: "Orientación y promoción de emprendimientos" },
        ],
      },
      { icono: "libro", color: "verde", titulo: "Social", items: [{ texto: "Educación inicial" }] },
      { icono: "salud", color: "amarillo", titulo: "Salud", items: [{ texto: "Apoyo psicosocial y nutricional" }] },
      {
        icono: "personas",
        color: "verde",
        titulo: "Atención a población vulnerable",
        items: [{ texto: "Primera infancia" }, { texto: "Adulto mayor" }, { texto: "Grupos étnicos" }, { texto: "Enfoque diferencial" }],
      },
    ],
  },
  valores: {
    eyebrow: "Nuestros valores",
    titulo: "Construimos una sociedad más justa",
    texto:
      "Lo hacemos teniendo siempre presente la responsabilidad de cada una de las acciones de nuestros profesionales, la importancia de quienes nos apoyan y, sobre todo, el compromiso con las comunidades en la ejecución de nuestros proyectos.",
    items: [
      {
        icono: "colaboracion",
        color: "verde",
        titulo: "Colaboración",
        texto: "Trabajamos con aliados estratégicos para potenciar fortalezas y generar cambios en la población.",
      },
      {
        icono: "integridad",
        color: "amarillo",
        titulo: "Integridad",
        texto: "Aspiramos al más alto nivel de compromiso y a actuar siempre en el interés de la población en las distintas regiones de Colombia.",
      },
      {
        icono: "web",
        color: "verde",
        titulo: "Responsabilidad",
        texto: "Rendimos cuentas frente a nuestros aliados estratégicos, nuestros profesionales de apoyo y, sobre todo, frente a la comunidad.",
      },
      {
        icono: "creatividad",
        color: "amarillo",
        titulo: "Creatividad",
        texto:
          "Tenemos un equipo en constante innovación en todos los procesos de nuestros proyectos. Estamos abiertos a nuevas ideas, acogemos el cambio y asumimos riesgos controlados.",
      },
    ],
  },
  organigrama: {
    eyebrow: "Organigrama",
    titulo: "Organigrama institucional",
    texto: "Así se organiza nuestro equipo para llevar cada proyecto a las comunidades.",
    niveles: [{ texto: "Junta directiva" }, { texto: "Representante legal" }, { texto: "Revisor fiscal" }],
    direcciones: [
      {
        titulo: "Dirección logística",
        areas: [{ titulo: "", cargos: [{ texto: "Auxiliares administrativos" }, { texto: "Bodegueros" }, { texto: "Transporte y reparto" }] }],
      },
      {
        titulo: "Dirección operativa",
        areas: [
          {
            titulo: "Coordinación de programas",
            cargos: [
              { texto: "Coordinadores" },
              { texto: "Docentes" },
              { texto: "Auxiliares pedagógicos" },
              { texto: "Psicosociales" },
              { texto: "Nutricionistas" },
            ],
          },
          {
            titulo: "Ejecución de proyectos",
            cargos: [{ texto: "Ingenieros de sistemas" }, { texto: "Área de comunicaciones" }, { texto: "Sistema de gestión de calidad" }],
          },
        ],
      },
      {
        titulo: "Dirección administrativa y financiera",
        areas: [
          { titulo: "Jefe de talento humano", cargos: [] },
          {
            titulo: "",
            cargos: [{ texto: "Contador" }, { texto: "Auxiliar contable" }, { texto: "Gestión de seguridad y salud en el trabajo" }],
          },
          { titulo: "", cargos: [{ texto: "Recepcionista" }, { texto: "Mensajero" }, { texto: "Auxiliar de servicios generales" }] },
        ],
      },
    ],
  },
  cta: {
    eyebrow: "Trabajemos juntos",
    titulo: "¿Tu organización quiere aliarse con Asoproyuja?",
    texto: "Sumemos esfuerzos por la niñez, las familias y las comunidades del territorio.",
    boton: { title: "Escríbenos", url: "/contacto" },
  },
};

export const noticiasPagina: NoticiasPagina = {
  hero: {
    eyebrow: "Noticias",
    titulo: "Lo último de nuestra comunidad",
    texto: "Historias y novedades del trabajo con las familias, la niñez y las comunidades del territorio.",
  },
  por_pagina: 9,
  mensaje_vacio: "Aún no hay noticias publicadas. Vuelve pronto.",
  cta: ctaApoyo,
};

export const contacto: Contacto = {
  hero: {
    eyebrow: "Atención al ciudadano",
    titulo: "Contacto",
    texto: "Escríbenos o visítanos. Con gusto resolvemos tus dudas sobre nuestros programas, alianzas y formas de apoyo.",
  },
  canales: {
    eyebrow: "Canales de atención",
    titulo: "Estamos para escucharte",
    texto: "Comunícate con nosotros por cualquiera de estos canales.",
  },
  formulario: {
    eyebrow: "Escríbenos",
    titulo: "Envíanos un mensaje",
    texto: "Te responderemos al correo o teléfono que nos indiques.",
    asuntos: [
      { texto: "Información general" },
      { texto: "Programas para la niñez y las familias" },
      { texto: "Alianzas y cooperación" },
      { texto: "Voluntariado y donaciones" },
      { texto: "Otro" },
    ],
  },
  mapa: { eyebrow: "Ubicación", titulo: "Visítanos en Los Almendros", texto: "" },
};

export const preguntasFrecuentes: PreguntasFrecuentes = {
  hero: {
    eyebrow: "Preguntas frecuentes",
    titulo: "Resolvemos tus dudas",
    texto: "Información sobre nuestros programas, inscripciones y formas de participar.",
  },
  proximamente: {
    eyebrow: "Muy pronto",
    titulo: "Estamos preparando esta sección",
    texto:
      "Muy pronto encontrarás aquí las respuestas a las preguntas más comunes sobre nuestros programas. Mientras tanto, escríbenos y con gusto te ayudamos.",
    boton: { title: "Escríbenos", url: "/contacto" },
    imagen: "/assets/img/mascota.png",
  },
  intro: { eyebrow: "Preguntas frecuentes", titulo: "Lo que más nos preguntan", texto: "" },
  preguntas: [],
  cta: {
    eyebrow: "¿Tienes otra pregunta?",
    titulo: "Escríbenos y te ayudamos",
    texto: "Nuestro equipo te responderá lo antes posible.",
    boton: { title: "Ir a contacto", url: "/contacto" },
  },
};

export const comoAyudar: ComoAyudar = {
  hero: {
    eyebrow: "Cómo ayudar",
    titulo: "Ayuda a sembrar más oportunidades",
    texto: "Voluntariado, alianzas y donaciones para la niñez y las familias.",
  },
  proximamente: {
    eyebrow: "Muy pronto",
    titulo: "Muy pronto podrás sumarte a nuestra siembra",
    texto:
      "Estamos preparando los canales para que puedas apoyar a la niñez y las familias con voluntariado, alianzas y donaciones. Si quieres ayudar desde ya, escríbenos y te contamos cómo.",
    boton: { title: "Quiero apoyar", url: "/contacto" },
    imagen: "/assets/img/mascota.png",
  },
  intro: { eyebrow: "Formas de ayudar", titulo: "Súmate a nuestro trabajo", texto: "" },
  formas: [],
  donaciones: { eyebrow: "Donaciones", titulo: "Datos para donar", texto: "", contenido: "" },
  cta: {
    eyebrow: "Hablemos",
    titulo: "¿Tienes otra idea para ayudar?",
    texto: "Escríbenos y encontremos juntos la mejor forma de sumar.",
    boton: { title: "Escríbenos", url: "/contacto" },
  },
};

export const politicaDatos: PoliticaDatos = {
  hero: {
    eyebrow: "Ley 1581 de 2012",
    titulo: "Política de tratamiento de datos personales",
    texto: "Cómo recolectamos, usamos y protegemos tu información.",
  },
  actualizado: "2026-10-05",
  contenido: `<h2>1. Responsable del tratamiento</h2>
<p><strong>ASOPROYUJA, Asociación Agropecuaria Campesina Nacional</strong>, identificada con NIT 825.001.418-2, con domicilio en la Calle 9 N. 19-42, barrio Los Almendros, Santa Marta, Colombia. Teléfonos: (605) 422 9570 y 311 213 4787. Sitio web: asoproyuja.org.</p>
<h2>2. Marco legal</h2>
<p>Esta política se adopta en cumplimiento de la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015) y demás normas que las modifiquen o complementen.</p>
<h2>3. Datos que recolectamos</h2>
<p>A través de este sitio web recolectamos únicamente los datos que nos entregas de forma voluntaria:</p>
<ul>
<li><strong>Formulario de contacto:</strong> nombre, correo electrónico, teléfono, asunto y mensaje.</li>
<li><strong>Newsletter:</strong> correo electrónico.</li>
</ul>
<p>No solicitamos datos sensibles ni datos de niñas, niños o adolescentes por este medio.</p>
<h2>4. Finalidades</h2>
<ul>
<li>Responder tus mensajes, solicitudes y consultas.</li>
<li>Enviarte información sobre nuestros programas, jornadas, convocatorias y novedades, cuando te suscribas al newsletter.</li>
<li>Gestionar alianzas, voluntariado y donaciones que nos propongas.</li>
<li>Cumplir obligaciones legales.</li>
</ul>
<h2>5. Derechos del titular</h2>
<p>Como titular de los datos puedes, en cualquier momento:</p>
<ul>
<li>Conocer, actualizar y rectificar tus datos personales.</li>
<li>Solicitar prueba de la autorización otorgada.</li>
<li>Ser informado sobre el uso que se ha dado a tus datos.</li>
<li>Revocar la autorización o solicitar la supresión de tus datos cuando no se respeten los principios, derechos y garantías legales.</li>
<li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
<li>Acceder de forma gratuita a tus datos personales.</li>
</ul>
<h2>6. Cómo ejercer tus derechos</h2>
<p>Puedes enviar tu consulta o reclamo a través del <a href="/contacto">formulario de contacto</a>, por los teléfonos indicados o en nuestra sede. Las consultas se atienden en un plazo máximo de diez (10) días hábiles y los reclamos en un máximo de quince (15) días hábiles, conforme a los artículos 14 y 15 de la Ley 1581 de 2012.</p>
<p>Para darte de baja del newsletter basta con que nos lo solicites por cualquiera de estos canales.</p>
<h2>7. Seguridad de la información</h2>
<p>Adoptamos medidas técnicas, humanas y administrativas razonables para proteger tus datos contra pérdida, consulta, uso o acceso no autorizado.</p>
<h2>8. Vigencia</h2>
<p>Esta política rige desde su publicación. Los datos se conservarán mientras sean necesarios para las finalidades descritas o mientras exista una obligación legal de conservarlos.</p>`,
};
