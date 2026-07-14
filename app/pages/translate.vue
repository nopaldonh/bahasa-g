<script setup lang="ts">
import { fromBahasaG, toBahasaG } from '~/composables/useBahasaG'

interface HistoryEntry {
  id: string
  input: string
  output: string
  direction: 'toG' | 'fromG'
  timestamp: number
}

const input = ref('')
const direction = ref<'toG' | 'fromG'>('toG')
const history = useLocalStorage<HistoryEntry[]>('bahasa-g-history', [])

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

const { copy, copied } = useClipboard()

function saveToHistory() {
  if (!input.value.trim()) return
  history.value.unshift({
    id: crypto.randomUUID(),
    input: input.value,
    output: output.value,
    direction: direction.value,
    timestamp: Date.now(),
  })
  history.value = history.value.slice(0, 50)
}

// Debounce biar gak nyimpen history tiap satu huruf diketik
const debouncedSave = useDebounceFn(saveToHistory, 800)
watch(output, () => debouncedSave())

function loadFromHistory(entry: HistoryEntry) {
  input.value = entry.input
  direction.value = entry.direction
}

function clearHistory() {
  history.value = []
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
          class="relative rounded-lg bg-white border border-slate-200 p-3 min-h-[144px]"
        >
          <p class="text-base whitespace-pre-wrap text-slate-900">
            {{ output }}
          </p>
          <button
            class="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100"
            aria-label="Salin"
            @click="copy(output)"
          >
            {{ copied ? '✓' : '⧉' }}
          </button>
        </div>
      </div>

      <div v-if="history.length" class="mt-10">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-sm font-medium text-slate-700">Riwayat</h2>
          <button
            class="text-xs text-slate-400 hover:text-slate-600"
            @click="clearHistory"
          >
            Hapus semua
          </button>
        </div>
        <ul class="space-y-2">
          <li
            v-for="entry in history"
            :key="entry.id"
            class="rounded-md border border-slate-200 bg-white p-3 text-sm cursor-pointer hover:border-slate-300"
            @click="loadFromHistory(entry)"
          >
            <p class="text-slate-500">{{ entry.input }}</p>
            <p class="text-slate-900">{{ entry.output }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
