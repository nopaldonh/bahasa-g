<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'

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
  <div class="min-h-screen bg-background px-4 py-16">
    <div class="mx-auto max-w-2xl text-center">
      <h1 class="text-3xl sm:text-4xl font-semibold text-foreground mb-3">
        Bahasa G
      </h1>
      <p class="text-muted-foreground mb-2">
        Bahasa sandi yang populer di kalangan anak-anak dan remaja pada era
        90-an. Setiap suku kata disisipi huruf "g" dan vokal pengikutnya, jadi
        kode rahasia yang bikin orang lain gak ngerti isi percakapan.
      </p>
      <p class="text-muted-foreground mb-8">
        Masih dipakai buat bernostalgia sampai sekarang, atau sekadar iseng
        ngobrol pakai kode rahasia ala anak lama.
      </p>

      <Button as-child>
        <NuxtLink to="/translate">
          <span>Coba Terjemahkan</span>
          <ArrowRight />
        </NuxtLink>
      </Button>

      <Card class="mt-16 text-left">
        <CardHeader>
          <CardTitle class="text-sm font-medium">Contoh</CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li class="flex gap-2 items-center">
              <span class="text-muted-foreground/70">saya</span>
              <ArrowRight class="size-4" />
              <span class="text-foreground">sagayaga</span>
            </li>
            <li class="flex gap-2 items-center">
              <span class="text-muted-foreground/70">kamu</span>
              <ArrowRight class="size-4" />
              <span class="text-foreground">kagamugu</span>
            </li>
            <li class="flex gap-2 items-center">
              <span class="text-muted-foreground/70">makan</span>
              <ArrowRight class="size-4" />
              <span class="text-foreground">magakagan</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
