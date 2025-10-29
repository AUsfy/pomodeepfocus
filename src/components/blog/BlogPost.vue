<template>
  <section v-if="post" class="blog-post">
    <article>
      <h1 class="post-title">{{ post.title }}</h1>
      <div class="post-content" v-html="renderedContent"></div>
    </article>
  </section>
  <div v-else class="not-found">Blog post not found.</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import blogData from '../../data/blog.json'

// Lightweight markdown rendering
function renderMarkdown(md) {
  return md
    .replace(/^# (.*$)/gim, '<h2>$1</h2>')
    .replace(/^## (.*$)/gim, '<h3>$1</h3>')
    .replace(/^\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

const route = useRoute()
const post = ref(null)
const renderedContent = ref('')

onMounted(() => {
  const slug = route.params.slug
  post.value = blogData.find(p => p.slug === slug)
  if (post.value) {
    renderedContent.value = renderMarkdown(post.value.content)
    // Set SEO meta tags
    if (post.value.meta) {
      document.title = post.value.meta.title
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) metaDesc.setAttribute('content', post.value.meta.description)
      // OG tags
      const ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) ogTitle.setAttribute('content', post.value.meta.ogTitle)
      const ogDesc = document.querySelector('meta[property="og:description"]')
      if (ogDesc) ogDesc.setAttribute('content', post.value.meta.ogDescription)
    }
  }
})
</script>

<style scoped>
.blog-post {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 0;
}
.post-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: var(--primary-color);
}
.post-content {
  color: var(--text-primary);
  font-size: 1.1rem;
  line-height: 1.7;
}
.not-found {
  text-align: center;
  color: var(--error-color);
  margin-top: 3rem;
  font-size: 1.2rem;
}
</style>
