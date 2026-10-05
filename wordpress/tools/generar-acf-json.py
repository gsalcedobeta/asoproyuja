"""
Genera los grupos de campos ACF (formato JSON "local") del plugin Asoproyuja Headless.
Compatibles con Secure Custom Fields (gratuito) y ACF PRO.

Los nombres de campo coinciden 1:1 con lib/types.ts. Si agrega o cambia un campo,
edite este archivo, ejecute:  python wordpress/tools/generar-acf-json.py
y en WordPress vaya a ACF → Grupos de campos → "Sincronización disponible".
"""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "wordpress" / "asoproyuja-headless" / "acf-json"
ICON_FILE = ROOT / "components" / "Icon.tsx"


def key(prefix: str, path: str) -> str:
    return f"{prefix}_" + hashlib.md5(path.encode()).hexdigest()[:13]


# ---------- iconos disponibles (se leen de Icon.tsx) ----------
_icon_src = ICON_FILE.read_text(encoding="utf-8")
_icon_block = _icon_src.split("const paths = {", 1)[1].split("} satisfies", 1)[0]
ICONOS = re.findall(r"^  ([a-z_]+):", _icon_block, re.M)
ICONOS_OCULTOS = {"youtube", "facebook", "instagram", "corazon_lleno", "chevron"}
ICON_CHOICES = {i: i.replace("_", " ").capitalize() for i in ICONOS if i not in ICONOS_OCULTOS}
COLOR_CHOICES = {"verde": "Verde", "amarillo": "Amarillo (icono terracota)"}


# ---------- constructores de campos ----------
def base(label, name, ftype, **kw):
    f = {
        "label": label,
        "name": name,
        "type": ftype,
        "instructions": kw.pop("instructions", ""),
        "required": kw.pop("required", 0),
        "conditional_logic": 0,
        "wrapper": {"width": str(kw.pop("width", "")), "class": "", "id": ""},
    }
    f.update(kw)
    return f


def text(label, name, **kw):
    return base(label, name, "text", **kw)


def area(label, name, rows=3, **kw):
    return base(label, name, "textarea", rows=rows, new_lines="", **kw)


def wysiwyg(label, name, **kw):
    return base(label, name, "wysiwyg", tabs="all", toolbar="full", media_upload=1, delay=0, **kw)


def image(label, name, **kw):
    return base(label, name, "image", return_format="url", preview_size="medium", library="all", **kw)


def link(label, name, **kw):
    return base(label, name, "link", return_format="array", **kw)


def number(label, name, **kw):
    return base(label, name, "number", **kw)


def date(label, name, **kw):
    return base(label, name, "date_picker", display_format="d/m/Y", return_format="Y-m-d", first_day=1, **kw)


def select(label, name, choices, **kw):
    return base(label, name, "select", choices=choices, return_format="value", ui=1, allow_null=0, multiple=0, **kw)


def icono(name="icono", **kw):
    return select("Icono", name, ICON_CHOICES, default_value="corazon", **kw)


def color(name="color", **kw):
    return select("Color del icono", name, COLOR_CHOICES, default_value="verde", **kw)


def group(label, name, subs, **kw):
    return base(label, name, "group", layout="block", sub_fields=subs, **kw)


def repeater(label, name, subs, boton="Agregar", layout="block", **kw):
    return base(label, name, "repeater", layout=layout, button_label=boton, min=0, max=0, sub_fields=subs, **kw)


def textos(label, name, boton="Agregar ítem", **kw):
    return repeater(label, name, [text("Texto", "texto")], boton=boton, layout="table", **kw)


def tab(label):
    return {"label": label, "name": "", "type": "tab", "placement": "top", "endpoint": 0}


def encabezado(con_texto=True):
    fs = [text("Antetítulo (eyebrow)", "eyebrow", width=35), text("Título", "titulo", width=65)]
    if con_texto:
        fs.append(area("Texto", "texto", rows=2))
    return fs


def hero():
    return group("Encabezado de la página (franja verde)", "hero", encabezado())


def cta():
    return group(
        "Llamado a la acción (panel naranja)",
        "cta",
        [text("Antetítulo", "eyebrow", width=35), text("Título", "titulo", width=65), area("Texto", "texto", rows=2), link("Botón", "boton")],
    )


def proximamente():
    return group(
        "Bloque «Muy pronto»",
        "proximamente",
        [
            text("Antetítulo", "eyebrow", width=35),
            text("Título", "titulo", width=65),
            area("Texto", "texto", rows=3),
            link("Botón", "boton", width=50),
            image("Imagen (mascota)", "imagen", width=50),
        ],
    )


def add_keys(fields, prefix):
    for f in fields:
        path = prefix + "/" + (f.get("name") or f["label"])
        f["key"] = key("field", path)
        if "sub_fields" in f:
            add_keys(f["sub_fields"], path)
    return fields


def grupo(slug, titulo, fields, location, orden=0, ocultar_editor=True, descripcion=""):
    g = {
        "key": key("group", slug),
        "title": titulo,
        "fields": add_keys(fields, slug),
        "location": location,
        "menu_order": orden,
        "position": "acf_after_title",
        "style": "default",
        "label_placement": "top",
        "instruction_placement": "label",
        "hide_on_screen": ["the_content", "excerpt", "discussion", "comments", "slug", "author", "format", "send-trackbacks"]
        if ocultar_editor
        else [],
        "active": True,
        "description": descripcion,
        "show_in_rest": 1,
    }
    (OUT / f"{g['key']}.json").write_text(json.dumps(g, ensure_ascii=False, indent=2), encoding="utf-8")
    return g


def plantilla(tpl):
    return [[{"param": "page_template", "operator": "==", "value": tpl}]]


# ======================================================================
OUT.mkdir(parents=True, exist_ok=True)
for old in OUT.glob("*.json"):
    old.unlink()

grupo(
    "ajustes",
    "Ajustes del sitio",
    [
        tab("Contacto"),
        area("Dirección", "direccion", rows=2, instructions="Cada línea se muestra en un renglón (pie de página y Contacto)."),
        text("Teléfono fijo", "telefono_fijo", width=33),
        text("Celular", "celular", width=33),
        text("Sitio web (texto del pie)", "sitio_web", width=34),
        text("Correo de contacto (público)", "correo", width=50, instructions="Se muestra en Contacto y en el pie. Vacío = no se muestra."),
        text("Correo que recibe los mensajes del formulario", "correo_notificaciones", width=50,
             instructions="No se publica. Si se deja vacío se usa el correo de contacto o, en su defecto, el del administrador."),
        area("Horario de atención", "horario", rows=2, instructions="Vacío = no se muestra."),
        text("URL del mapa (Google Maps → Compartir → Insertar un mapa → copiar solo el src)", "mapa_url",
             instructions="Vacío = la página de Contacto no muestra mapa."),
        tab("Redes y pie"),
        text("YouTube (URL)", "youtube", width=33),
        text("Facebook (URL)", "facebook", width=33),
        text("Instagram (URL)", "instagram", width=34),
        area("Descripción bajo el logo (pie)", "descripcion_pie", rows=2),
        text("Texto de copyright", "texto_copyright", width=50),
        text("Créditos (texto)", "texto_creditos", width=50),
        link("Créditos (enlace)", "creditos_enlace", width=50),
        link("Botón flotante «Donar ahora»", "boton_flotante", width=50),
    ],
    [[{"param": "options_page", "operator": "==", "value": "ajustes-del-sitio"}]],
)

grupo(
    "inicio",
    "Página: Inicio",
    [
        tab("1. Slider"),
        repeater(
            "Diapositivas",
            "slides",
            [
                text("Antetítulo (amarillo)", "eyebrow", width=35),
                text("Título", "titulo", width=65, instructions="Si pasa de 55 caracteres se muestra un poco más pequeño."),
                area("Texto", "texto", rows=2),
                image("Foto (horizontal 4:3)", "imagen", width=50),
                text("Texto alternativo de la foto", "imagen_alt", width=50),
                repeater(
                    "Botones",
                    "botones",
                    [link("Botón", "boton", width=60), select("Estilo", "estilo", {"primario": "Naranja", "contorno": "Contorno blanco"}, width=40)],
                    boton="Agregar botón",
                    layout="table",
                ),
            ],
            boton="Agregar diapositiva",
        ),
        tab("2. Bienvenida"),
        group("Bienvenida", "bienvenida", [
            image("Imagen", "imagen", width=50),
            text("Texto alternativo", "imagen_alt", width=50),
            text("Sello: número", "sello_numero", width=35, instructions="Ej.: + de 28 años"),
            text("Sello: texto", "sello_texto", width=65),
            text("Antetítulo", "eyebrow", width=35),
            text("Título", "titulo", width=65),
            area("Texto", "texto", rows=3),
            link("Botón", "boton"),
        ]),
        tab("3. Accesos rápidos"),
        repeater("Accesos rápidos (tarjetas)", "accesos", [
            icono(width=34), color(width=33), link("Enlace", "enlace", width=33),
            text("Título", "titulo", width=40), text("Texto", "texto", width=60),
        ], boton="Agregar acceso"),
        tab("4. Noticias"),
        group("Noticias", "noticias", encabezado() + [
            number("Cantidad de noticias a mostrar", "cantidad", default_value=3, min=1, max=9),
        ], instructions="Las tarjetas son las noticias más recientes (menú Noticias)."),
        tab("5. Reels de Instagram"),
        group("Reels de Instagram", "reels", encabezado() + [
            repeater("Reels", "items", [
                image("Portada (vertical 9:16)", "portada", width=30),
                text("URL del reel en Instagram", "url", width=70, instructions="Ej.: https://www.instagram.com/asoproyuja/reel/…/"),
                area("Descripción corta o título del video", "titulo", rows=2),
            ], boton="Agregar reel", instructions="Sin reels, la sección no se muestra. El carrusel avanza solo y se puede mover con las flechas."),
            link("Enlace bajo el carrusel (perfil de Instagram)", "enlace"),
        ]),
        tab("6. Aliados"),
        group("Aliados", "aliados", encabezado() + [
            repeater("Logos", "logos", [
                image("Logo (PNG con fondo transparente)", "logo", width=34),
                text("Nombre de la organización", "nombre", width=33),
                text("Sitio web (opcional)", "url", width=33),
            ], boton="Agregar logo", layout="table", instructions="Sin logos, la sección no se muestra."),
            text("Frase final", "texto_cta", width=60),
            link("Enlace de la frase", "enlace_cta", width=40),
        ]),
        tab("7. Newsletter"),
        group("Newsletter", "newsletter", [
            text("Antetítulo", "eyebrow", width=35), text("Título", "titulo", width=65),
            area("Texto", "texto", rows=2),
            text("Texto de ejemplo del campo", "placeholder", width=33),
            text("Texto del botón", "boton", width=33),
            text("Mensaje al suscribirse", "mensaje_exito", width=34),
            text("Nota bajo el formulario", "nota"),
        ], instructions="Los correos quedan en el menú Suscriptores (exportable a CSV)."),
        tab("8. Apóyanos"),
        group("Apóyanos", "apoyo", [
            text("Antetítulo", "eyebrow", width=35), text("Título", "titulo", width=65),
            area("Texto", "texto", rows=2),
            link("Botón", "boton", width=50), image("Mascota", "mascota", width=50),
        ]),
    ],
    plantilla("asoproyuja-inicio"),
)

grupo(
    "quienes-somos",
    "Página: Quiénes somos",
    [
        tab("Encabezado"),
        group("Encabezado de la página (franja verde)", "hero", encabezado() + [
            wysiwyg("Quiénes somos (texto bajo el título)", "contenido"),
        ]),
        tab("Misión y visión"),
        group("Misión y visión", "mision_vision", encabezado() + [wysiwyg("Misión", "mision"), wysiwyg("Visión", "vision")]),
        tab("Áreas de intervención"),
        group("Áreas de intervención", "lineas", encabezado() + [
            repeater("Áreas", "items", [
                icono(width=34), color(width=33), text("Título", "titulo", width=33),
                textos("Ítems", "items"),
            ], boton="Agregar área"),
        ]),
        tab("Valores"),
        group("Valores", "valores", encabezado() + [
            repeater("Valores", "items", [
                icono(width=34), color(width=33), text("Título", "titulo", width=33),
                area("Texto", "texto", rows=2),
            ], boton="Agregar valor"),
        ]),
        tab("Organigrama"),
        group("Organigrama", "organigrama", encabezado() + [
            textos("Niveles superiores (de arriba hacia abajo)", "niveles", "Agregar nivel"),
            repeater("Direcciones", "direcciones", [
                text("Nombre de la dirección", "titulo"),
                repeater("Áreas", "areas", [
                    text("Título del área (opcional)", "titulo"),
                    textos("Cargos", "cargos", "Agregar cargo"),
                ], boton="Agregar área"),
            ], boton="Agregar dirección"),
        ]),
        tab("Llamado a la acción"), cta(),
    ],
    plantilla("asoproyuja-quienes-somos"),
)

grupo(
    "noticias-pagina",
    "Página: Noticias",
    [
        tab("Encabezado"), hero(),
        tab("Listado"),
        number("Noticias por página", "por_pagina", default_value=9, min=3, max=30),
        text("Mensaje cuando no hay noticias", "mensaje_vacio"),
        tab("Llamado a la acción"), cta(),
    ],
    plantilla("asoproyuja-noticias"),
    descripcion="Las noticias se crean en el menú Noticias.",
)

grupo(
    "contacto",
    "Página: Contacto (atención al ciudadano)",
    [
        tab("Encabezado"), hero(),
        tab("Canales de atención"),
        group("Canales de atención", "canales", encabezado(),
              instructions="Dirección, teléfonos, correo, horario y redes se editan en Ajustes del sitio."),
        tab("Formulario"),
        group("Formulario", "formulario", encabezado() + [textos("Opciones de «Asunto»", "asuntos", "Agregar opción")],
              instructions="Los mensajes llegan al menú Mensajes y al correo configurado en Ajustes del sitio."),
        tab("Mapa"),
        group("Mapa", "mapa", encabezado(), instructions="La URL del mapa se configura en Ajustes del sitio."),
    ],
    plantilla("asoproyuja-contacto"),
)

grupo(
    "preguntas-frecuentes",
    "Página: Preguntas frecuentes",
    [
        tab("Encabezado"), hero(),
        tab("Muy pronto"), proximamente(),
        tab("Preguntas"),
        group("Introducción", "intro", encabezado()),
        repeater("Preguntas", "preguntas", [text("Pregunta", "pregunta"), wysiwyg("Respuesta", "respuesta")],
                 boton="Agregar pregunta", instructions="Mientras no haya preguntas, la página muestra el bloque «Muy pronto»."),
        tab("Llamado a la acción"), cta(),
    ],
    plantilla("asoproyuja-preguntas-frecuentes"),
)

grupo(
    "como-ayudar",
    "Página: Cómo ayudar",
    [
        tab("Encabezado"), hero(),
        tab("Muy pronto"), proximamente(),
        tab("Formas de ayudar"),
        group("Introducción", "intro", encabezado()),
        repeater("Formas de ayudar", "formas", [
            icono(width=34), color(width=33), link("Enlace (opcional)", "enlace", width=33),
            text("Título", "titulo"), area("Texto", "texto", rows=2),
        ], boton="Agregar forma de ayudar",
            instructions="Mientras no haya formas de ayudar ni datos para donar, la página muestra el bloque «Muy pronto»."),
        tab("Donaciones"),
        group("Datos para donar", "donaciones", encabezado() + [wysiwyg("Contenido (cuentas, Nequi, etc.)", "contenido")]),
        tab("Llamado a la acción"), cta(),
    ],
    plantilla("asoproyuja-como-ayudar"),
)

grupo(
    "politica-datos",
    "Página: Política de datos",
    [
        tab("Encabezado"), hero(),
        tab("Contenido"),
        date("Última actualización", "actualizado"),
        wysiwyg("Texto de la política", "contenido"),
    ],
    plantilla("asoproyuja-politica-datos"),
)

grupo(
    "noticia",
    "Noticia",
    [area("Resumen de la tarjeta", "extracto", rows=2, instructions="Texto corto bajo el título en las tarjetas de noticias.")],
    [[{"param": "post_type", "operator": "==", "value": "noticia"}]],
    ocultar_editor=False,
    descripcion="La foto es la «Imagen destacada» y el cuerpo se escribe en el editor.",
)

print(f"Grupos generados en {OUT}")
