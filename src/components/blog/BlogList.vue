<template>
  <section class="blog-list">
    <h1 class="blog-title">Blog</h1>
    <ul class="blog-posts">
      <li v-for="post in posts" :key="post.slug" class="blog-post-item">
        <router-link :to="`/blog/${post.slug}`" class="blog-post-link">
          <h2 class="post-title">{{ post.title }}</h2>
        </router-link>
        <p class="post-excerpt">{{ post.excerpt }}</p>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import blogData from '../../data/blog.json'

const posts = ref([])

onMounted(() => {
  posts.value = blogData
})
</script>

<style scoped>
.blog-list {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 0;
  text-align: left;
}
.blog-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: var(--primary-color);
  text-align: left;
}
.blog-posts {
  list-style: none;
  padding: 0;
  margin: 0;
}
.blog-post-item {
  margin-bottom: 2.5rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 1.5rem;
  text-align: left;
}
.blog-post-link {
  text-decoration: none;
  color: var(--text-primary);
  display: block;
}
.blog-post-link:hover .post-title {
  color: var(--primary-color);
  text-decoration: underline;
}
.post-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-align: left;
}
.post-excerpt {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
  text-align: left;
  line-height: 1.6;
}
</style>
