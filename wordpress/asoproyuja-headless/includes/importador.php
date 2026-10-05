<?php
/**
 * Importador del contenido inicial (Herramientas → Importar contenido Asoproyuja).
 * Lee seed/contenido.json (generado con `npm run exportar-contenido` en la raíz del repo) y crea o actualiza
 * las páginas con sus campos ACF, las noticias, los Ajustes del sitio y los menús. Las imágenes se descargan
 * desde el sitio público (ASOPROYUJA_FRONT_URL). Se puede ejecutar varias veces sin duplicar.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'admin_menu',
	function () {
		add_management_page( 'Importar contenido Asoproyuja', 'Importar contenido Asoproyuja', 'manage_options', 'asoproyuja-importar', 'asoproyuja_pagina_importador' );
	}
);

/** Clave de un campo de primer nivel; replica key() de wordpress/tools/generar-acf-json.py */
function asoproyuja_field_key( $grupo, $nombre ) {
	return 'field_' . substr( md5( $grupo . '/' . $nombre ), 0, 13 );
}

function asoproyuja_pagina_importador() {
	$archivo = ASOPROYUJA_HL_DIR . 'seed/contenido.json';
	echo '<div class="wrap"><h1>Importar contenido inicial</h1>';

	if ( isset( $_POST['asoproyuja_importar'] ) && check_admin_referer( 'asoproyuja_importar' ) ) {
		@set_time_limit( 600 );
		$log = asoproyuja_importar( $archivo, ! empty( $_POST['sobrescribir'] ) );
		echo '<div class="notice notice-success"><p>Importación terminada.</p></div><pre style="background:#fff;padding:12px;max-height:420px;overflow:auto">' . esc_html( implode( "\n", $log ) ) . '</pre>';
	}

	echo '<p>Crea o actualiza las páginas (Inicio, Quiénes somos, Noticias, Contacto, Preguntas frecuentes, Cómo ayudar y Política de datos), las noticias, los Ajustes del sitio y los menús con el contenido aprobado del sitio web.</p>';
	echo '<p>Las imágenes se descargan desde <code>' . esc_html( asoproyuja_front_url() ) . '</code>, por lo que el sitio debe estar publicado en Vercel antes de importar.</p>';
	if ( ! file_exists( $archivo ) ) {
		echo '<div class="notice notice-error"><p>No se encontró <code>seed/contenido.json</code>.</p></div></div>';
		return;
	}
	echo '<form method="post">';
	wp_nonce_field( 'asoproyuja_importar' );
	echo '<p><label><input type="checkbox" name="sobrescribir" value="1"> Sobrescribir el contenido que ya exista (si no se marca, solo se crea lo que falta).</label></p>';
	submit_button( 'Importar contenido', 'primary', 'asoproyuja_importar' );
	echo '</form></div>';
}

/** Descarga un archivo del sitio público a la biblioteca de medios (una sola vez por ruta). */
function asoproyuja_media( $ruta, &$log ) {
	$existente = get_posts(
		array(
			'post_type'   => 'attachment',
			'post_status' => 'inherit',
			'meta_key'    => '_asoproyuja_origen',
			'meta_value'  => $ruta,
			'fields'      => 'ids',
			'numberposts' => 1,
		)
	);
	if ( $existente ) {
		return (int) $existente[0];
	}
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';

	$tmp = download_url( asoproyuja_front_url() . $ruta, 120 );
	if ( is_wp_error( $tmp ) ) {
		$log[] = "  ! No se pudo descargar {$ruta}: " . $tmp->get_error_message();
		return 0;
	}
	$id = media_handle_sideload( array( 'name' => basename( $ruta ), 'tmp_name' => $tmp ), 0 );
	if ( is_wp_error( $id ) ) {
		@unlink( $tmp );
		$log[] = "  ! No se pudo guardar {$ruta}: " . $id->get_error_message();
		return 0;
	}
	update_post_meta( $id, '_asoproyuja_origen', $ruta );
	$log[] = "  + Medio {$ruta}";
	return (int) $id;
}

/** Reemplaza recursivamente rutas /assets/... por IDs de adjuntos (campos imagen). */
function asoproyuja_resolver_medios( $valor, &$log ) {
	if ( is_array( $valor ) ) {
		foreach ( $valor as $k => $v ) {
			$valor[ $k ] = asoproyuja_resolver_medios( $v, $log );
		}
		return $valor;
	}
	if ( is_string( $valor ) && preg_match( '#^/assets/[^\s]+\.(jpe?g|png|webp|svg|gif)$#i', $valor ) ) {
		return asoproyuja_media( $valor, $log ) ?: '';
	}
	return $valor;
}

function asoproyuja_guardar_campos( $grupo, $acf, $post_id, &$log ) {
	if ( ! function_exists( 'update_field' ) ) {
		$log[] = '  ! ACF no está activo: no se guardaron campos.';
		return;
	}
	foreach ( $acf as $nombre => $valor ) {
		update_field( asoproyuja_field_key( $grupo, $nombre ), asoproyuja_resolver_medios( $valor, $log ), $post_id );
	}
}

function asoproyuja_upsert_post( $tipo, $slug, $args, $sobrescribir, &$log ) {
	$existente = get_posts(
		array(
			'post_type'   => $tipo,
			'name'        => $slug,
			'post_status' => 'any',
			'numberposts' => 1,
		)
	);
	if ( 'page' === $tipo && ! $existente ) {
		$p         = get_page_by_path( $slug );
		$existente = $p ? array( $p ) : array();
	}
	if ( $existente && ! $sobrescribir ) {
		$log[] = "= {$tipo} «{$slug}» ya existe (omitido)";
		return 0;
	}
	$datos = array_merge(
		array(
			'post_type'   => $tipo,
			'post_name'   => $slug,
			'post_status' => 'publish',
		),
		$args
	);
	if ( $existente ) {
		$datos['ID'] = $existente[0]->ID;
		$id          = wp_update_post( wp_slash( $datos ), true );
		$log[]       = "~ {$tipo} «{$slug}» actualizado";
	} else {
		$id    = wp_insert_post( wp_slash( $datos ), true );
		$log[] = "+ {$tipo} «{$slug}» creado";
	}
	return is_wp_error( $id ) ? 0 : (int) $id;
}

function asoproyuja_importar( $archivo, $sobrescribir ) {
	$log  = array();
	$data = json_decode( file_get_contents( $archivo ), true );
	if ( ! $data ) {
		return array( 'Archivo JSON inválido.' );
	}

	// Ajustes del sitio
	if ( function_exists( 'update_field' ) ) {
		$ya = get_field( 'telefono_fijo', 'option' );
		if ( ! $ya || $sobrescribir ) {
			asoproyuja_guardar_campos( 'ajustes', $data['ajustes'], 'option', $log );
			$log[] = '~ Ajustes del sitio';
		}
	}

	// Páginas por secciones
	$ids = array();
	foreach ( $data['paginas'] as $p ) {
		$id = asoproyuja_upsert_post( 'page', $p['slug'], array( 'post_title' => $p['titulo'], 'post_content' => '' ), $sobrescribir, $log );
		if ( $id ) {
			update_post_meta( $id, '_wp_page_template', $p['plantilla'] );
			asoproyuja_guardar_campos( $p['grupo'], $p['acf'], $id, $log );
		}
		$pg                = get_page_by_path( $p['slug'] );
		$ids[ $p['slug'] ] = $pg ? $pg->ID : 0;
	}
	if ( ! empty( $ids['inicio'] ) ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $ids['inicio'] );
	}

	// Noticias
	foreach ( $data['noticias'] as $n ) {
		$id = asoproyuja_upsert_post(
			'noticia',
			$n['slug'],
			array(
				'post_title'   => $n['titulo'],
				'post_content' => $n['contenido'],
				'post_date'    => $n['fecha'] . ' 09:00:00',
			),
			$sobrescribir,
			$log
		);
		if ( $id ) {
			$img = asoproyuja_media( $n['imagen'], $log );
			if ( $img ) {
				set_post_thumbnail( $id, $img );
				update_post_meta( $img, '_wp_attachment_image_alt', $n['imagen_alt'] );
			}
			asoproyuja_guardar_campos( 'noticia', $n['acf'], $id, $log );
		}
	}

	// Menús
	if ( ! empty( $data['menus'] ) ) {
		$locs    = get_theme_mod( 'nav_menu_locations', array() );
		$nombres = array(
			'principal' => 'Menú principal',
			'footer'    => 'Pie: Navegación',
			'enlaces'   => 'Pie: Enlaces',
		);
		foreach ( $nombres as $ubic => $nombre ) {
			if ( empty( $data['menus'][ $ubic ] ) ) {
				continue;
			}
			$menu = wp_get_nav_menu_object( $nombre );
			if ( $menu && ! $sobrescribir ) {
				$log[]         = "= menú «{$nombre}» ya existe (omitido)";
				$locs[ $ubic ] = empty( $locs[ $ubic ] ) ? $menu->term_id : $locs[ $ubic ];
				continue;
			}
			if ( $menu ) {
				foreach ( (array) wp_get_nav_menu_items( $menu->term_id ) as $it ) {
					wp_delete_post( $it->ID, true );
				}
				$menu_id = $menu->term_id;
			} else {
				$menu_id = wp_create_nav_menu( $nombre );
			}
			if ( is_wp_error( $menu_id ) ) {
				$log[] = "! No se pudo crear el menú «{$nombre}»";
				continue;
			}
			asoproyuja_importar_items_menu( $menu_id, $data['menus'][ $ubic ], 0 );
			$locs[ $ubic ] = $menu_id;
			$log[]         = "+ menú «{$nombre}»";
		}
		set_theme_mod( 'nav_menu_locations', $locs );
	}

	asoproyuja_revalidar();
	$log[] = 'Listo. Se solicitó la actualización del sitio público.';
	return $log;
}

function asoproyuja_importar_items_menu( $menu_id, $items, $parent ) {
	foreach ( $items as $it ) {
		$id = wp_update_nav_menu_item(
			$menu_id,
			0,
			array(
				'menu-item-title'     => $it['title'],
				'menu-item-url'       => $it['url'],
				'menu-item-type'      => 'custom',
				'menu-item-status'    => 'publish',
				'menu-item-parent-id' => $parent,
				'menu-item-target'    => isset( $it['target'] ) ? $it['target'] : '',
			)
		);
		if ( ! is_wp_error( $id ) && ! empty( $it['children'] ) ) {
			asoproyuja_importar_items_menu( $menu_id, $it['children'], $id );
		}
	}
}
