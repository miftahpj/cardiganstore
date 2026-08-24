<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'map-pin'">
      <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </template>

    <template v-else-if="name === 'chat'">
      <path d="M4 5h16v11H9l-4 4V16H4z" />
    </template>

    <template v-else-if="name === 'camera'">
      <path d="M4 8.2A1.8 1.8 0 0 1 5.8 6.4h1.4l1.2-1.7c.3-.4.8-.7 1.4-.7h4.4c.6 0 1.1.3 1.4.7l1.2 1.7h1.4A1.8 1.8 0 0 1 20 8.2V18a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 18V8.2z" />
      <circle cx="12" cy="13" r="3.4" />
    </template>

    <template v-else-if="name === 'truck'">
      <path d="M3 7h10v8H3z" />
      <path d="M13 10h4l3.5 3.2V15H13z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </template>

    <template v-else-if="name === 'heart'">
      <path d="M12 20.2s-7.3-4.4-9.6-8.9C1.2 8.3 2.6 5 6 5c1.9 0 3.3 1 4.2 2.4C11.1 6 12.5 5 14.4 5c3.4 0 4.8 3.3 3.6 6.3-2.3 4.5-6 8.9-6 8.9z" />
    </template>

    <template v-else-if="name === 'check-circle'">
      <circle cx="12" cy="12" r="8.4" />
      <path d="M8.2 12.4l2.6 2.6 5-5.4" />
    </template>

    <template v-else-if="name === 'chart-bar'">
      <path d="M4 20V11" />
      <path d="M10.5 20V6" />
      <path d="M17 20v-8" />
      <path d="M3 20h18" />
    </template>

    <template v-else-if="name === 'hanger'">
      <path d="M12 4a1.8 1.8 0 1 1 1.5 2.8L12 8v1.1" />
      <path d="M12 9.1l8 5c.9.6 1.4 1.5 1.4 2.5H2.6c0-1 .5-1.9 1.4-2.5l8-5z" />
      <path d="M4.5 18.6h15" />
    </template>

    <template v-else-if="name === 'package'">
      <path d="M12 3.5l8 4.4v8.2l-8 4.4-8-4.4V7.9z" />
      <path d="M4 7.9L12 12l8-4.1" />
      <path d="M12 12v8.5" />
    </template>

    <template v-else-if="name === 'settings'">
      <circle cx="12" cy="12" r="2.8" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z" />
    </template>

    <template v-else-if="name === 'sparkle'">
      <path
        d="M12 3l1.6 4.9L18.5 9l-4.9 1.6L12 15.5l-1.6-4.9L5.5 9l4.9-1.6L12 3z"
        fill="currentColor"
        stroke="none"
      />
    </template>

    <template v-else-if="name === 'arrow-left'">
      <path d="M19 12H5" />
      <path d="M11 6l-6 6 6 6" />
    </template>

    <template v-else-if="name === 'arrow-right'">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </template>

    <template v-else-if="name === 'pencil'">
      <path d="M4 20l.9-4 10.6-10.6a2 2 0 0 1 2.8 0l.3.3a2 2 0 0 1 0 2.8L8 19l-4 1z" />
      <path d="M13.5 6.5l4 4" />
    </template>

    <template v-else-if="name === 'trash'">
      <path d="M5 7h14" />
      <path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2" />
      <path d="M7 7l1 12.5A1.8 1.8 0 0 0 9.8 21h4.4a1.8 1.8 0 0 0 1.8-1.5L17 7" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </template>

    <template v-else-if="name === 'tag'">
      <path d="M12.6 3.4H6.6a2 2 0 0 0-2 2v6l9.9 9.9a2 2 0 0 0 2.8 0l5.2-5.2a2 2 0 0 0 0-2.8l-9.9-9.9z" />
      <circle cx="8.4" cy="8.4" r="1.4" fill="currentColor" stroke="none" />
    </template>

    <template v-else-if="name === 'x'">
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </template>

    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4.3-4.3" />
    </template>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ name: string }>()
</script>
