<template>
  <section v-if="post" class="blog-post">
    <router-link to="/blog" class="back-link">← Back to Blog</router-link>
    <article>
      <h1 class="post-title">{{ post.title }}</h1>
      <div class="post-content" v-html="renderedContent"></div>
    </article>
  </section>
  <div v-else class="not-found">
    <p>Blog post not found.</p>
    <router-link to="/blog" class="back-link">← Back to Blog</router-link>
  </div>
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
  text-align: left;
}
.back-link {
  display: inline-flex;
  align-items: center;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  transition: color 0.2s ease;
}
.back-link:hover {
  color: var(--primary-color);
  text-decoration: underline;
}
.post-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: var(--primary-color);
  text-align: left;
  line-height: 1.2;
}
.post-content {
  color: var(--text-primary);
  font-size: 1.1rem;
  line-height: 1.7;
  text-align: left;
}
.post-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 2rem 0 1rem 0;
  color: var(--text-primary);
  text-align: left;
}
.post-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.5rem 0;
  color: var(--text-primary);
  text-align: left;
}
.post-content p {
  margin-bottom: 1rem;
  text-align: left;
}
.post-content ul,
.post-content ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  text-align: left;
}
.post-content li {
  margin-bottom: 0.25rem;
  text-align: left;
}
.post-content strong {
  font-weight: 600;
  color: var(--text-primary);
}
.post-content em {
  font-style: italic;
}
.not-found {
  text-align: center;
  color: var(--error-color);
  margin-top: 3rem;
  font-size: 1.2rem;
}
</style>
