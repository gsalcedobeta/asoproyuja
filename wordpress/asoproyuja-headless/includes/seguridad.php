<?php
/**
 * cms.asoproyuja.org solo es el administrador: no se indexa, no expone datos de usuarios
 * y todo lo público redirige al sitio (ver la redirección en includes/contenido.php).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* -------------------------------------------------------------------------
 * Sin indexación en buscadores
 * ---------------------------------------------------------------------- */

// Equivale a Ajustes → Lectura → "Disuadir a los motores de búsqueda", siempre activo.
add_filter( 'pre_option_blog_public', '__return_zero' );

// robots.txt del CMS: bloquea todo (el del sitio público lo genera Next.js).
add_filter(
	'robots_txt',
	function () {
		return "User-agent: *\nDisallow: /\n";
	},
	99
);

// Cabecera noindex en todas las respuestas del CMS: páginas, administrador, login y API.
function asoproyuja_cabecera_noindex() {
	if ( ! headers_sent() ) {
		header( 'X-Robots-Tag: noindex, nofollow', true );
	}
}
add_action( 'send_headers', 'asoproyuja_cabecera_noindex' );
add_action( 'login_init', 'asoproyuja_cabecera_noindex' );
add_action( 'admin_init', 'asoproyuja_cabecera_noindex' );
add_filter(
	'rest_post_dispatch',
	function ( $respuesta ) {
		if ( $respuesta instanceof WP_REST_Response ) {
			$respuesta->header( 'X-Robots-Tag', 'noindex, nofollow' );
		}
		return $respuesta;
	}
);

// Sin el sitemap propio de WordPress (el sitemap del sitio es asoproyuja.org/sitemap.xml).
add_filter( 'wp_sitemaps_enabled', '__return_false' );

/* -------------------------------------------------------------------------
 * Superficie de ataque mínima
 * ---------------------------------------------------------------------- */

// XML-RPC no se usa (pingbacks, apps antiguas): se desactiva.
add_filter( 'xmlrpc_enabled', '__return_false' );
add_filter( 'xmlrpc_methods', '__return_empty_array' );
add_filter(
	'wp_headers',
	function ( $headers ) {
		unset( $headers['X-Pingback'] );
		return $headers;
	}
);

// La lista de usuarios de la API solo la ve quien inició sesión (evita enumerar usuarios para ataques de contraseña).
add_filter(
	'rest_request_before_callbacks',
	function ( $respuesta, $handler, $request ) {
		if ( 0 === strpos( $request->get_route(), '/wp/v2/users' ) && ! is_user_logged_in() ) {
			return new WP_Error( 'rest_forbidden', 'No autorizado.', array( 'status' => 401 ) );
		}
		return $respuesta;
	},
	10,
	3
);

// Tampoco por la URL ?author=N
add_action(
	'parse_request',
	function ( $wp ) {
		if ( ! is_admin() && ! is_user_logged_in() && isset( $wp->query_vars['author'] ) ) {
			wp_safe_redirect( asoproyuja_front_url() . '/', 301 );
			exit;
		}
	}
);

// Mensaje genérico al fallar el login (no revela si el usuario existe).
add_filter(
	'login_errors',
	function () {
		return 'Usuario o contraseña incorrectos.';
	}
);

/* -------------------------------------------------------------------------
 * Imágenes: WordPress reduce automáticamente las fotos de más de 1920 px
 * (por defecto son 2560) para que el sitio cargue rápido aunque se suban fotos muy grandes.
 * ---------------------------------------------------------------------- */
add_filter(
	'big_image_size_threshold',
	function () {
		return 1920;
	}
);
