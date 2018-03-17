
{% for post in page.posts %}
  {{ post.title }}
  {{ post.categories.data[0].name }}
  {{ post.is_category('blog') }}
{% endfor %}