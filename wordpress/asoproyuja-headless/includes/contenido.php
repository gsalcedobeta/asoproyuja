<?php
/**
 * Noticias, plantillas de página, página de opciones, menús y redirección headless.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', 'asoproyuja_registrar_contenido' );

function asoproyuja_registrar_contenido() {
	register_post_type(
		'noticia',
		array(
			'labels'        => array(
				'name'          => 'Noticias',
				'singular_name' => 'Noticia',
				'add_new_item'  => 'Agregar noticia',
				'edit_item'     => 'Editar noticia',
				'all_items'     => 'Todas las noticias',
			),
			'public'        => true,
			'show_in_rest'  => true,
			'rest_base'     => 'noticias',
			'menu_icon'     => 'dashicons-megaphone',
			'menu_position' => 5,
			'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt', 'revisions' ),
			'has_archive'   => false,
			'rewrite'       => array( 'slug' => 'noticias' ),
		)
	);
}

/* -------------------------------------------------------------------------
 * Plantillas de página: cada una activa su grupo de campos ACF
 * ---------------------------------------------------------------------- */
function asoproyuja_plantillas() {
	return array(
		'asoproyuja-inicio'               => 'Asoproyuja: Inicio',
		'asoproyuja-quienes-somos'        => 'Asoproyuja: Quiénes somos',
		'asoproyuja-noticias'             => 'Asoproyuja: Noticias',
		'asoproyuja-contacto'             => 'Asoproyuja: Contacto',
		'asoproyuja-preguntas-frecuentes' => 'Asoproyuja: Preguntas frecuentes',
		'asoproyuja-como-ayudar'          => 'Asoproyuja: Cómo ayudar',
		'asoproyuja-politica-datos'       => 'Asoproyuja: Política de datos',
	);
}

add_filter(
	'theme_page_templates',
	function ( $templates ) {
		return array_merge( $templates, asoproyuja_plantillas() );
	}
);

/* -------------------------------------------------------------------------
 * Página de opciones "Ajustes del sitio" + endpoint REST
 * ---------------------------------------------------------------------- */
add_action(
	'acf/init',
	function () {
		if ( function_exists( 'acf_add_options_page' ) ) {
			acf_add_options_page(
				array(
					'page_title' => 'Ajustes del sitio',
					'menu_title' => 'Ajustes del sitio',
					'menu_slug'  => 'ajustes-del-sitio',
					'capability' => 'edit_pages',
					'icon_url'   => 'dashicons-admin-site-alt3',
					'position'   => 3,
					'redirect'   => false,
				)
			);
		}
	}
);

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'asoproyuja/v1',
			'/ajustes',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => function () {
					if ( ! function_exists( 'get_fields' ) ) {
						return new WP_REST_Response( new stdClass(), 200 );
					}
					$fields = get_fields( 'option' );
					$fields = is_array( $fields ) ? $fields : array();
					unset( $fields['correo_notificaciones'] ); // dato interno
					return new WP_REST_Response( (object) $fields, 200 );
				},
			)
		);
	}
);

/* -------------------------------------------------------------------------
 * Menús: Apariencia → Menús. Tres ubicaciones: principal y las dos columnas del pie
 * ---------------------------------------------------------------------- */
function asoproyuja_ubicaciones_menu() {
	return array(
		'principal' => 'Menú principal (sitio web)',
		'footer'    => 'Pie de página: Navegación (sitio web)',
		'enlaces'   => 'Pie de página: Enlaces (sitio web)',
	);
}

add_action(
	'after_setup_theme',
	function () {
		register_nav_menus( asoproyuja_ubicaciones_menu() );
	},
	20
);

/** Árbol de un menú asignado a una ubicación: [{title, url, target, children}] */
function asoproyuja_menu_arbol( $ubicacion ) {
	$ubicaciones = get_nav_menu_locations();
	if ( empty( $ubicaciones[ $ubicacion ] ) ) {
		return array();
	}
	$items = wp_get_nav_menu_items( $ubicaciones[ $ubicacion ] );
	if ( ! $items ) {
		return array();
	}
	$nodos = array();
	foreach ( $items as $it ) {
		$nodos[ $it->ID ] = array(
			'title'    => $it->title,
			'url'      => $it->url,
			'target'   => $it->target,
			'parent'   => (int) $it->menu_item_parent,
			'children' => array(),
		);
	}
	// Se arma de abajo hacia arriba para soportar varios niveles
	foreach ( array_reverse( array_keys( $nodos ), true ) as $id ) {
		$p = $nodos[ $id ]['parent'];
		if ( $p && isset( $nodos[ $p ] ) ) {
			array_unshift( $nodos[ $p ]['children'], $nodos[ $id ] );
			unset( $nodos[ $id ] );
		}
	}
	$limpiar = function ( $lista ) use ( &$limpiar ) {
		return array_values(
			array_map(
				function ( $n ) use ( $limpiar ) {
					unset( $n['parent'] );
					$n['children'] = $limpiar( $n['children'] );
					return $n;
				},
				$lista
			)
		);
	};
	return $limpiar( $nodos );
}

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'asoproyuja/v1',
			'/menus',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => function () {
					$out = array();
					foreach ( array_keys( asoproyuja_ubicaciones_menu() ) as $ubic ) {
						$out[ $ubic ] = asoproyuja_menu_arbol( $ubic );
					}
					return $out;
				},
			)
		);
	}
);

add_action( 'wp_update_nav_menu', 'asoproyuja_revalidar' );

/* -------------------------------------------------------------------------
 * Headless: el front público de WordPress redirige al sitio en Vercel
 * ---------------------------------------------------------------------- */
add_action(
	'template_redirect',
	function () {
		if ( is_admin() || wp_doing_ajax() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || is_preview() || is_user_logged_in() ) {
			return;
		}
		$path = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '/';
		wp_redirect( asoproyuja_front_url() . $path, 301 );
		exit;
	}
);

/* Enlace "Ver" del administrador → sitio público */
add_filter(
	'post_type_link',
	function ( $link, $post ) {
		if ( 'noticia' === $post->post_type ) {
			return asoproyuja_front_url() . '/noticias/' . $post->post_name;
		}
		return $link;
	},
	10,
	2
);

add_filter(
	'page_link',
	function ( $link, $post_id ) {
		$slug = get_post_field( 'post_name', $post_id );
		if ( (int) get_option( 'page_on_front' ) === (int) $post_id || 'inicio' === $slug ) {
			return asoproyuja_front_url() . '/';
		}
		return $slug ? asoproyuja_front_url() . '/' . $slug : $link;
	},
	10,
	2
);

/* Los textos se muestran exactamente como los escribe el editor (sin comillas tipográficas automáticas) */
add_filter( 'run_wptexturize', '__return_false' );

/* Oculta menús que no aplican al sitio headless */
add_action(
	'admin_menu',
	function () {
		remove_menu_page( 'edit.php' );          // Entradas (se usan "Noticias")
		remove_menu_page( 'edit-comments.php' ); // Comentarios
	}
);
