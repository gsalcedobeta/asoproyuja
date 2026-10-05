<?php
/**
 * Publicación instantánea: al guardar contenido, avisa a Vercel para regenerar el sitio.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function asoproyuja_revalidar() {
	static $hecho = false; // una sola llamada por petición
	if ( $hecho || ! defined( 'ASOPROYUJA_REVALIDATE_SECRET' ) ) {
		return;
	}
	$hecho = true;
	wp_remote_post(
		asoproyuja_front_url() . '/api/revalidate',
		array(
			'timeout'  => 5,
			'blocking' => false,
			'headers'  => array( 'x-revalidate-secret' => ASOPROYUJA_REVALIDATE_SECRET ),
		)
	);
}

add_action(
	'save_post',
	function ( $post_id, $post ) {
		if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
			return;
		}
		if ( in_array( $post->post_type, array( 'page', 'noticia' ), true ) ) {
			asoproyuja_revalidar();
		}
	},
	99,
	2
);

// ACF guarda sus campos después de save_post (también la página de opciones)
add_action(
	'acf/save_post',
	function ( $post_id ) {
		$tipo = is_numeric( $post_id ) ? get_post_type( (int) $post_id ) : '';
		if ( in_array( $tipo, array( 'mensaje', 'suscriptor' ), true ) ) {
			return;
		}
		asoproyuja_revalidar();
	},
	20
);

add_action(
	'deleted_post',
	function ( $post_id ) {
		if ( ! in_array( get_post_type( $post_id ), array( 'mensaje', 'suscriptor' ), true ) ) {
			asoproyuja_revalidar();
		}
	}
);
add_action(
	'trashed_post',
	function ( $post_id ) {
		if ( ! in_array( get_post_type( $post_id ), array( 'mensaje', 'suscriptor' ), true ) ) {
			asoproyuja_revalidar();
		}
	}
);

/* Botón manual en la barra superior del administrador */
add_action(
	'admin_bar_menu',
	function ( $bar ) {
		if ( ! current_user_can( 'edit_pages' ) ) {
			return;
		}
		$bar->add_node(
			array(
				'id'    => 'asoproyuja-publicar',
				'title' => '↻ Actualizar sitio',
				'href'  => wp_nonce_url( admin_url( 'admin-post.php?action=asoproyuja_publicar' ), 'asoproyuja_publicar' ),
			)
		);
		$bar->add_node(
			array(
				'id'    => 'asoproyuja-ver-sitio',
				'title' => 'Ver sitio público',
				'href'  => asoproyuja_front_url(),
				'meta'  => array( 'target' => '_blank' ),
			)
		);
	},
	100
);

add_action(
	'admin_post_asoproyuja_publicar',
	function () {
		check_admin_referer( 'asoproyuja_publicar' );
		if ( current_user_can( 'edit_pages' ) ) {
			asoproyuja_revalidar();
		}
		wp_safe_redirect( wp_get_referer() ?: admin_url() );
		exit;
	}
);
