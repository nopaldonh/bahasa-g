<script setup lang="ts">
import { fromBahasaG, toBahasaG } from '~/composables/useBahasaG'

const input = ref('')
const direction = ref<'toG' | 'fromG'>('toG')

const output = computed(() =>
  direction.value === 'toG' ? toBahasaG(input.value) : fromBahasaG(input.value),
)

const directionLabel = computed(() =>
  direction.value === 'toG' ? 'Indonesia → Bahasa G' : 'Bahasa G → Indonesia',
)

function swapDirection() {
  input.value = output.value
  direction.value = direction.value === 'toG' ? 'fromG' : 'toG'
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-4 py-10">
    <div class="mx-auto max-w-3xl">
      <h1 class="text-2xl font-medium text-slate-900 mb-1">
        Bahasa G Terjemahan
      </h1>

      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-slate-600">{{ directionLabel }}</span>
        <button
          class="h-9 w-9 flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-100"
          aria-label="Tukar arah"
          @click="swapDirection"
        >
          ⇄
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <textarea
          v-model="input"
          rows="6"
          placeholder="Ketik kalimat di sini..."
          class="w-full rounded-lg border border-slate-200 bg-white p-3 text-base focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
        <div
          class="rounded-lg bg-white border border-slate-200 p-3 min-h-[144px]"
        >
          <p class="text-base whitespace-pre-wrap text-slate-900">
            {{ output }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
