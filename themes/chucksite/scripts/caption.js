hexo.extend.filter.register('after_post_render', function (data) {
  var className = 'image-caption';
  if (data.layout == 'post' || data.layout == 'project' || data.layout == 'about') {
    data.content = data.content.replace(/(<img [^>]*alt="([^"]+)"[^>]*>)/g, '<figure>' + '$1' + '<span>$2</span></figure>');
  }
  return data;
});