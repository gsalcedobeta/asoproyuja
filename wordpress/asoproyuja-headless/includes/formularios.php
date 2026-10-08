<?php
/**
 * Formularios del sitio (llamadas servidor a servidor desde Next.js, protegidas con ASOPROYUJA_FORM_SECRET):
 *   POST /asoproyuja/v1/mensajes      formulario de contacto → tipo privado "mensaje" + correo de aviso
 *   POST /asoproyuja/v1/suscriptores  newsletter del Inicio  → tipo privado "suscriptor" (exportable a CSV)
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'init',
	function () {
		$comun = array(
			'public'          => false,
			'show_ui'         => true,
			'show_in_rest'    => false,
			'supports'        => array( 'title' ),
			'capability_type' => 'post',
			'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
			'map_meta_cap'    => true,
		);
		register_post_type(
			'mensaje',
			array_merge(
				$comun,
				array(
					'labels'        => array(
						'name'          => 'Mensajes de contacto',
						'menu_name'     => 'Mensajes',
						'singular_name' => 'Mensaje',
						'edit_item'     => 'Ver mensaje',
						'all_items'     => 'Todos los mensajes',
					),
					'menu_icon'     => 'dashicons-email-alt',
					'menu_position' => 4,
				)
			)
		);
		register_post_type(
			'suscriptor',
			array_merge(
				$comun,
				array(
					'labels'        => array(
						'name'          => 'Suscriptores del newsletter',
						'menu_name'     => 'Suscriptores',
						'singular_name' => 'Suscriptor',
						'edit_item'     => 'Ver suscriptor',
						'all_items'     => 'Todos los suscriptores',
					),
					'menu_icon'     => 'dashicons-groups',
					'menu_position' => 4,
				)
			)
		);
	}
);

/* =========================================================================
 * Utilidades
 * ====================================================================== */

function asoproyuja_secreto_ok( WP_REST_Request $req ) {
	$secret = defined( 'ASOPROYUJA_FORM_SECRET' ) ? ASOPROYUJA_FORM_SECRET : '';
	return '' !== $secret && hash_equals( $secret, (string) $req->get_header( 'x-asoproyuja-secret' ) );
}

/** Límite simple de envíos por clave (correo) en una ventana de tiempo. */
function asoproyuja_limite( $clave, $max, $ventana ) {
	$k = 'asoproyuja_rl_' . md5( $clave );
	$n = (int) get_transient( $k );
	if ( $n >= $max ) {
		return false;
	}
	set_transient( $k, $n + 1, $ventana );
	return true;
}

function asoproyuja_error( $mensaje, $status = 400, $codigo = 'error' ) {
	return new WP_Error( $codigo, $mensaje, array( 'status' => $status ) );
}

function asoproyuja_meta( $id, $k ) {
	return (string) get_post_meta( $id, '_asoproyuja_' . $k, true );
}

function asoproyuja_correo_destino() {
	$c = function_exists( 'get_field' ) ? ( get_field( 'correo_notificaciones', 'option' ) ?: get_field( 'correo', 'option' ) ) : '';
	return $c ?: get_option( 'admin_email' );
}

/** Correo HTML con los colores del sitio. */
function asoproyuja_correo_html( $titulo, $cuerpo_html, $boton_texto = '', $boton_url = '' ) {
	$boton = '';
	if ( $boton_texto && $boton_url ) {
		$boton = '<p style="margin:28px 0 8px;text-align:center"><a href="' . esc_url( $boton_url ) . '" style="display:inline-block;background:#C1502E;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 26px;border-radius:999px;font-size:15px">' . esc_html( $boton_texto ) . '</a></p>';
	}
	$tel = function_exists( 'get_field' ) ? (string) get_field( 'telefono_fijo', 'option' ) : '';
	$pie = 'ASOPROYUJA · Asociación Agropecuaria Campesina Nacional' . ( $tel ? ' · ' . esc_html( $tel ) : '' );
	return '<!doctype html><html lang="es"><body style="margin:0;background:#F7F4EC;font-family:\'Segoe UI\',Arial,Helvetica,sans-serif;color:#26301F">'
		. '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F4EC;padding:28px 12px"><tr><td align="center">'
		. '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e9e4d6">'
		. '<tr><td style="background:#1F4430;padding:20px 28px;border-bottom:4px solid #F2B035"><span style="color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:.5px">ASOPROYUJA</span></td></tr>'
		. '<tr><td style="padding:30px 28px 10px"><h1 style="color:#1F4430;font-size:22px;margin:0 0 16px">' . esc_html( $titulo ) . '</h1>'
		. '<div style="font-size:15px;line-height:1.6;color:#4a5440">' . $cuerpo_html . '</div>' . $boton . '</td></tr>'
		. '<tr><td style="padding:18px 28px 26px;font-size:12px;color:#65705A;border-top:1px solid #efeadc">' . $pie . '</td></tr>'
		. '</table></td></tr></table></body></html>';
}

function asoproyuja_enviar( $para, $asunto, $html, $reply_to = '' ) {
	$headers = array( 'Content-Type: text/html; charset=UTF-8' );
	if ( $reply_to && is_email( $reply_to ) ) {
		$headers[] = 'Reply-To: ' . $reply_to;
	}
	return wp_mail( $para, $asunto, $html, $headers );
}

/* =========================================================================
 * Endpoints
 * ====================================================================== */

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'asoproyuja/v1',
			'/mensajes',
			array(
				'methods'             => 'POST',
				'callback'            => 'asoproyuja_crear_mensaje',
				'permission_callback' => 'asoproyuja_secreto_ok',
			)
		);
		register_rest_route(
			'asoproyuja/v1',
			'/suscriptores',
			array(
				'methods'             => 'POST',
				'callback'            => 'asoproyuja_crear_suscriptor',
				'permission_callback' => 'asoproyuja_secreto_ok',
			)
		);
	}
);

function asoproyuja_crear_mensaje( WP_REST_Request $req ) {
	$d = array();
	foreach ( array( 'nombre', 'correo', 'telefono', 'asunto', 'mensaje', 'autorizacion' ) as $c ) {
		$v       = (string) $req->get_param( $c );
		$d[ $c ] = 'mensaje' === $c ? sanitize_textarea_field( $v ) : sanitize_text_field( $v );
	}
	$d['correo'] = sanitize_email( $d['correo'] );

	if ( '' === $d['nombre'] || '' === $d['mensaje'] || ! is_email( $d['correo'] ) ) {
		return asoproyuja_error( 'Faltan datos obligatorios.', 422 );
	}
	if ( 'si' !== $d['autorizacion'] ) {
		return asoproyuja_error( 'Se requiere la autorización de tratamiento de datos.', 422 );
	}
	if ( ! asoproyuja_limite( 'mensaje|' . strtolower( $d['correo'] ), 5, HOUR_IN_SECONDS ) ) {
		return asoproyuja_error( 'Recibimos varios mensajes seguidos desde este correo. Intenta de nuevo más tarde.', 429, 'limite' );
	}

	$post_id = wp_insert_post(
		array(
			'post_type'   => 'mensaje',
			'post_status' => 'private',
			'post_title'  => ( $d['asunto'] ? $d['asunto'] . ' · ' : '' ) . $d['nombre'],
		),
		true
	);
	if ( is_wp_error( $post_id ) ) {
		return asoproyuja_error( 'No fue posible registrar el mensaje.', 500 );
	}
	unset( $d['autorizacion'] );
	foreach ( $d as $k => $v ) {
		update_post_meta( $post_id, '_asoproyuja_' . $k, $v );
	}
	// Prueba de la autorización (Ley 1581 de 2012, art. 9): fecha y hora en que se otorgó
	update_post_meta( $post_id, '_asoproyuja_autorizacion_datos', current_time( 'mysql' ) );

	$filas = '';
	foreach ( array( 'Nombre' => $d['nombre'], 'Correo' => $d['correo'], 'Teléfono' => $d['telefono'], 'Asunto' => $d['asunto'] ) as $k => $v ) {
		if ( '' !== $v ) {
			$filas .= '<tr><td style="padding:4px 12px 4px 0;color:#65705A">' . esc_html( $k ) . '</td><td><strong>' . esc_html( $v ) . '</strong></td></tr>';
		}
	}
	// El mensaje ya quedó guardado; el correo es solo un aviso. Se registra si salió (útil para revisar el SMTP).
	$enviado = asoproyuja_enviar(
		asoproyuja_correo_destino(),
		'Nuevo mensaje desde asoproyuja.org' . ( $d['asunto'] ? ': ' . $d['asunto'] : '' ),
		asoproyuja_correo_html(
			'Nuevo mensaje de contacto',
			'<table style="font-size:14px;margin-bottom:14px">' . $filas . '</table>' . wpautop( esc_html( $d['mensaje'] ) )
			. '<p style="font-size:13px;color:#65705A">Puede responder directamente a este correo.</p>',
			'Ver en WordPress',
			admin_url( 'post.php?post=' . $post_id . '&action=edit' )
		),
		$d['correo']
	);
	update_post_meta( $post_id, '_asoproyuja_aviso', $enviado ? 'Enviado' : 'Falló el envío' );

	return new WP_REST_Response( array( 'ok' => true ), 201 );
}

function asoproyuja_crear_suscriptor( WP_REST_Request $req ) {
	$correo = strtolower( sanitize_email( (string) $req->get_param( 'correo' ) ) );
	if ( ! is_email( $correo ) ) {
		return asoproyuja_error( 'Correo inválido.', 422 );
	}
	if ( ! asoproyuja_limite( 'suscriptor|' . $correo, 5, HOUR_IN_SECONDS ) ) {
		return asoproyuja_error( 'Intenta de nuevo más tarde.', 429, 'limite' );
	}
	$existente = get_posts(
		array(
			'post_type'   => 'suscriptor',
			'post_status' => 'any',
			'title'       => $correo,
			'fields'      => 'ids',
			'numberposts' => 1,
		)
	);
	if ( $existente ) {
		return new WP_REST_Response( array( 'ok' => true, 'existente' => true ), 200 );
	}
	$post_id = wp_insert_post(
		array(
			'post_type'   => 'suscriptor',
			'post_status' => 'private',
			'post_title'  => $correo,
		),
		true
	);
	if ( is_wp_error( $post_id ) ) {
		return asoproyuja_error( 'No fue posible registrar el correo.', 500 );
	}
	update_post_meta( $post_id, '_asoproyuja_correo', $correo );
	update_post_meta( $post_id, '_asoproyuja_origen', 'Newsletter del Inicio' );
	return new WP_REST_Response( array( 'ok' => true ), 201 );
}

/* =========================================================================
 * Administrador: columnas, detalle y exportación
 * ====================================================================== */

add_filter(
	'manage_mensaje_posts_columns',
	function () {
		return array(
			'cb'       => '<input type="checkbox" />',
			'title'    => 'Mensaje',
			'correo'   => 'Correo',
			'telefono' => 'Teléfono',
			'aviso'    => 'Correo de aviso',
			'date'     => 'Fecha',
		);
	}
);

add_action(
	'manage_mensaje_posts_custom_column',
	function ( $col, $post_id ) {
		if ( in_array( $col, array( 'correo', 'telefono' ), true ) ) {
			echo esc_html( asoproyuja_meta( $post_id, $col ) );
		}
		if ( 'aviso' === $col ) {
			$v = asoproyuja_meta( $post_id, 'aviso' );
			$color = 'Enviado' === $v ? '#2e7d32' : ( $v ? '#c62828' : '#787c82' );
			echo '<span style="color:' . esc_attr( $color ) . '">' . esc_html( $v ?: '—' ) . '</span>';
		}
	},
	10,
	2
);

add_action(
	'add_meta_boxes_mensaje',
	function () {
		add_meta_box( 'asoproyuja_mensaje', 'Detalle del mensaje', 'asoproyuja_metabox_mensaje', 'mensaje', 'normal', 'high' );
	}
);

function asoproyuja_metabox_mensaje( $post ) {
	$etiquetas = array(
		'nombre'             => 'Nombre',
		'correo'             => 'Correo',
		'telefono'           => 'Teléfono',
		'asunto'             => 'Asunto',
		'autorizacion_datos' => 'Autorizó tratamiento de datos',
		'aviso'              => 'Correo de aviso',
	);
	echo '<table class="widefat striped" style="margin-bottom:16px"><tbody>';
	foreach ( $etiquetas as $k => $label ) {
		$v = asoproyuja_meta( $post->ID, $k );
		if ( '' === $v ) {
			continue;
		}
		if ( 'correo' === $k ) {
			$v = '<a href="mailto:' . esc_attr( $v ) . '">' . esc_html( $v ) . '</a>';
		} else {
			$v = esc_html( $v );
		}
		echo '<tr><th style="width:220px">' . esc_html( $label ) . '</th><td>' . $v . '</td></tr>'; // phpcs:ignore WordPress.Security.EscapeOutput
	}
	echo '</tbody></table>';
	echo '<h3>Mensaje</h3><div style="background:#fff;border:1px solid #dcdcde;padding:12px 16px;border-radius:4px">' . wp_kses_post( wpautop( esc_html( asoproyuja_meta( $post->ID, 'mensaje' ) ) ) ) . '</div>';
}

add_filter(
	'manage_suscriptor_posts_columns',
	function () {
		return array(
			'cb'    => '<input type="checkbox" />',
			'title' => 'Correo',
			'date'  => 'Fecha de suscripción',
		);
	}
);

/* Botón "Exportar CSV" en el listado de mensajes */
add_action(
	'admin_notices',
	function () {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( ! $screen || 'edit-mensaje' !== $screen->id ) {
			return;
		}
		$url = wp_nonce_url( admin_url( 'admin-post.php?action=asoproyuja_exportar_mensajes' ), 'asoproyuja_exportar' );
		echo '<div class="notice notice-info"><p>Cada envío del formulario de Contacto queda guardado aquí, aunque el correo de aviso falle. <a class="button button-primary" style="margin-left:8px" href="' . esc_url( $url ) . '">Exportar CSV</a></p></div>';
	}
);

add_action(
	'admin_post_asoproyuja_exportar_mensajes',
	function () {
		check_admin_referer( 'asoproyuja_exportar' );
		if ( ! current_user_can( 'edit_pages' ) ) {
			wp_die( 'No autorizado' );
		}
		$ids = get_posts(
			array(
				'post_type'   => 'mensaje',
				'post_status' => 'any',
				'numberposts' => -1,
				'fields'      => 'ids',
				'orderby'     => 'date',
				'order'       => 'DESC',
			)
		);
		nocache_headers();
		header( 'Content-Type: text/csv; charset=UTF-8' );
		header( 'Content-Disposition: attachment; filename=mensajes-contacto-asoproyuja-' . gmdate( 'Y-m-d' ) . '.csv' );
		$out = fopen( 'php://output', 'w' );
		fwrite( $out, "\xEF\xBB\xBF" ); // BOM para que Excel lea las tildes
		fputcsv( $out, array( 'fecha', 'nombre', 'correo', 'telefono', 'asunto', 'mensaje', 'autorizacion_datos', 'correo_de_aviso' ) );
		foreach ( $ids as $id ) {
			fputcsv(
				$out,
				array(
					get_the_date( 'Y-m-d H:i', $id ),
					asoproyuja_meta( $id, 'nombre' ),
					asoproyuja_meta( $id, 'correo' ),
					asoproyuja_meta( $id, 'telefono' ),
					asoproyuja_meta( $id, 'asunto' ),
					asoproyuja_meta( $id, 'mensaje' ),
					asoproyuja_meta( $id, 'autorizacion_datos' ),
					asoproyuja_meta( $id, 'aviso' ),
				)
			);
		}
		fclose( $out );
		exit;
	}
);

/* Botón "Exportar CSV" en el listado de suscriptores */
add_action(
	'admin_notices',
	function () {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( ! $screen || 'edit-suscriptor' !== $screen->id ) {
			return;
		}
		$url = wp_nonce_url( admin_url( 'admin-post.php?action=asoproyuja_exportar_suscriptores' ), 'asoproyuja_exportar' );
		echo '<div class="notice notice-info"><p>Los correos se registran desde el formulario de Newsletter del Inicio. <a class="button button-primary" style="margin-left:8px" href="' . esc_url( $url ) . '">Exportar CSV</a></p></div>';
	}
);

add_action(
	'admin_post_asoproyuja_exportar_suscriptores',
	function () {
		check_admin_referer( 'asoproyuja_exportar' );
		if ( ! current_user_can( 'edit_pages' ) ) {
			wp_die( 'No autorizado' );
		}
		$ids = get_posts(
			array(
				'post_type'   => 'suscriptor',
				'post_status' => 'any',
				'numberposts' => -1,
				'fields'      => 'ids',
				'orderby'     => 'date',
				'order'       => 'ASC',
			)
		);
		nocache_headers();
		header( 'Content-Type: text/csv; charset=UTF-8' );
		header( 'Content-Disposition: attachment; filename=suscriptores-asoproyuja-' . gmdate( 'Y-m-d' ) . '.csv' );
		$out = fopen( 'php://output', 'w' );
		fwrite( $out, "\xEF\xBB\xBF" ); // BOM para que Excel lea las tildes
		fputcsv( $out, array( 'correo', 'fecha', 'origen' ) );
		foreach ( $ids as $id ) {
			fputcsv( $out, array( get_the_title( $id ), get_the_date( 'Y-m-d H:i', $id ), asoproyuja_meta( $id, 'origen' ) ) );
		}
		fclose( $out );
		exit;
	}
);
