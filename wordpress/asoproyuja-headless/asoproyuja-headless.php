<?php
/**
 * Plugin Name: Asoproyuja Headless
 * Description: Convierte WordPress en el administrador de contenido del sitio asoproyuja.org (Next.js en Vercel): noticias, campos ACF por secciones, menús, mensajes de contacto, suscriptores del newsletter, publicación instantánea e importación del contenido inicial.
 * Version:     1.1.0
 * Author:      WeDoo.digital
 * Requires PHP: 7.4
 * Text Domain: asoproyuja-headless
 *
 * Configuración en wp-config.php:
 *   define( 'ASOPROYUJA_FRONT_URL', 'https://asoproyuja.org' );
 *   define( 'ASOPROYUJA_REVALIDATE_SECRET', '...' ); // igual a REVALIDATE_SECRET en Vercel
 *   define( 'ASOPROYUJA_FORM_SECRET', '...' );       // igual a FORM_SECRET en Vercel
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'ASOPROYUJA_HL_DIR', plugin_dir_path( __FILE__ ) );

function asoproyuja_front_url() {
	return untrailingslashit( defined( 'ASOPROYUJA_FRONT_URL' ) ? ASOPROYUJA_FRONT_URL : 'https://asoproyuja.org' );
}

require_once ASOPROYUJA_HL_DIR . 'includes/contenido.php';
require_once ASOPROYUJA_HL_DIR . 'includes/formularios.php';
require_once ASOPROYUJA_HL_DIR . 'includes/publicacion.php';
require_once ASOPROYUJA_HL_DIR . 'includes/importador.php';
require_once ASOPROYUJA_HL_DIR . 'includes/seguridad.php';

/* -------------------------------------------------------------------------
 * ACF: carga y guarda los grupos de campos en /acf-json del plugin
 * ---------------------------------------------------------------------- */
add_filter(
	'acf/settings/load_json',
	function ( $paths ) {
		$paths[] = ASOPROYUJA_HL_DIR . 'acf-json';
		return $paths;
	}
);

add_filter(
	'acf/settings/save_json',
	function ( $path ) {
		return ASOPROYUJA_HL_DIR . 'acf-json';
	}
);

add_action(
	'admin_notices',
	function () {
		if ( ! function_exists( 'acf_add_options_page' ) ) {
			echo '<div class="notice notice-error"><p><strong>Asoproyuja Headless:</strong> instale y active <em>Secure Custom Fields</em> (gratuito) o <em>ACF PRO</em>. Se necesitan campos repetidores y página de opciones.</p></div>';
		}
		if ( ! defined( 'ASOPROYUJA_REVALIDATE_SECRET' ) || ! defined( 'ASOPROYUJA_FORM_SECRET' ) ) {
			echo '<div class="notice notice-warning"><p><strong>Asoproyuja Headless:</strong> faltan las constantes <code>ASOPROYUJA_REVALIDATE_SECRET</code> y/o <code>ASOPROYUJA_FORM_SECRET</code> en wp-config.php.</p></div>';
		}
	}
);
