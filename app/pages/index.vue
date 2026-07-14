<script setup lang="ts">
useHead({
  title: 'Bahasa G — Bahasa Sandi/Gaul Rahasia Anak 90-an',
  meta: [
    {
      name: 'description',
      content:
        'Bahasa G adalah bahasa sandi yang populer di kalangan anak-anak dan remaja era 90-an. Kenali asal-usul, aturan, dan coba terjemahkan sendiri.',
    },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-4 py-16">
    <div class="mx-auto max-w-2xl text-center">
      <h1 class="text-3xl sm:text-4xl font-semibold text-slate-900 mb-3">
        Bahasa G
      </h1>
      <p class="text-slate-600 mb-2">
        Bahasa sandi yang populer di kalangan anak-anak dan remaja pada era
        90-an. Setiap suku kata disisipi huruf "g" dan vokal pengikutnya, jadi
        kode rahasia yang bikin orang lain gak ngerti isi percakapan.
      </p>
      <p class="text-slate-600 mb-8">
        Masih dipakai buat bernostalgia sampai sekarang, atau sekadar iseng
        ngobrol pakai kode rahasia ala anak lama.
      </p>

      <NuxtLink
        to="/translate"
        class="inline-flex items-center justify-center rounded-lg bg-slate-900 text-white px-6 py-3 text-sm font-medium hover:bg-slate-800"
      >
        Coba Terjemahkan →
      </NuxtLink>

      <div
        class="mt-16 text-left bg-white border border-slate-200 rounded-lg p-6"
      >
        <h2 class="text-sm font-medium text-slate-700 mb-3">Contoh</h2>
        <ul class="space-y-2 text-sm text-slate-600">
          <li>
            <span class="text-slate-400">saya</span> →
            <span class="text-slate-900">sagayaga</span>
          </li>
          <li>
            <span class="text-slate-400">kamu</span> →
            <span class="text-slate-900">kagamugu</span>
          </li>
          <li>
            <span class="text-slate-400">makan</span> →
            <span class="text-slate-900">magakagan</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
