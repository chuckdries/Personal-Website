hexo.extend.filter.register('after_post_render', function (data) {
  var className = 'image-caption';
  console.log(data.layout)
  if (data.layout == 'post' || data.layout == 'project' || data.layout == 'about') {
    data.content = data.content.replace(/(<img [^>]*alt="([^"]+)"[^>]*>)/g, '$1' + '<span class="' + className + '">$2</span>');
  }
  return data;
});