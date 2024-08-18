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
  wp_enqueue_script('three', get_template_directory_uri() . '/dist/main.js', array(), null, true);
}

add_action('init', 'add_scripts');
