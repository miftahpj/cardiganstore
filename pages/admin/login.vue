<template>
  <div class="flex min-h-screen items-center justify-center bg-cream px-4 py-10">
    <div class="w-full max-w-sm rounded-2xl bg-white p-8 shadow-soft">
      <div class="text-center">
        <span class="font-script text-3xl italic text-primary-700">WOOMAN</span>
        <p class="mt-1 text-xs font-semibold uppercase tracking-widest text-primary-400">Admin Login</p>
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="text-xs font-semibold text-primary-500">Username</label>
          <input
            v-model="username"
            type="text"
            autocomplete="username"
            required
            class="mt-1 w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none"
          />
        </div>
        <div>
          <label class="text-xs font-semibold text-primary-500">Password</label>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            class="mt-1 w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none"
          />
        </div>

        <p v-if="errorMessage" class="text-xs font-medium text-red-500">{{ errorMessage }}</p>

        <button type="submit" class="btn-primary w-full justify-center" :disabled="loading">
          {{ loading ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>

      <NuxtLink to="/" class="mt-6 block text-center text-xs text-primary-400 hover:text-primary-600">
        ← Kembali ke Website
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

useHead({ title: 'Admin Login | WOOMAN by Khania' })

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  loading.value = true
  errorMessage.value = ''
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })
    await navigateTo('/admin')
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage || 'Username atau password salah.'
  } finally {
    loading.value = false
  }
}
</script>
