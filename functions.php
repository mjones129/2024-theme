<?php

// Allow SVG file uploads
function add_svg_support($mimes)
{
  $mimes['svg'] = 'image/svg+xml';
  return $mimes;
}
add_filter('upload_mimes', 'add_svg_support');

// Sanitize SVG files
function sanitize_svg($file)
{
  if ($file['type'] == 'image/svg+xml') {
    $file['ext'] = 'svg';
    $file['type'] = 'image/svg+xml';
  }
  return $file;
}
add_filter('wp_check_filetype_and_ext', 'sanitize_svg', 10, 4);


function add_scripts()
{
  wp_enqueue_style('style', get_template_directory_uri() . '/style.css', array(), false, 'all');
  if (is_page('10')) { //homepage
    wp_enqueue_script('three', get_template_directory_uri() . '/dist/main.js', array(), '1.0.1', true);
  }
}

add_action('wp_enqueue_scripts', 'add_scripts');

/**
 * Enqueue content assets but only in the Editor.
 */
function editor_styles()
{
  if (is_admin()) {
    wp_enqueue_style(
      'editor-styles',
      get_template_directory_uri() . '/editor.css'
    );
  }
}
add_action('enqueue_block_assets', 'editor_styles');
