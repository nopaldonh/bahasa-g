<script setup lang="ts">
import { ArrowLeftRight, Check, Copy, Volume2 } from '@lucide/vue'
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

const sourceLang = computed(() =>
  direction.value === 'toG' ? 'Indonesia' : 'Bahasa G',
)
const targetLang = computed(() =>
  direction.value === 'toG' ? 'Bahasa G' : 'Indonesia',
)

function swapDirection() {
  input.value = output.value
  direction.value = direction.value === 'toG' ? 'fromG' : 'toG'
}

const { copy, copied } = useClipboard()

function speak(text: string) {
  if (!text.trim() || !('speechSynthesis' in window)) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'id-ID'
  speechSynthesis.speak(utterance)
}

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
  <div class="min-h-screen bg-background px-4 py-10">
    <div class="mx-auto max-w-3xl">
      <h1 class="text-2xl font-medium text-foreground mb-1">
        Bahasa G Terjemahan
      </h1>

      <div class="flex items-center mb-1 gap-3">
        <span class="flex-1">
          {{ sourceLang }}
        </span>
        <Button
          variant="ghost"
          size="icon"
          class="rounded-full"
          aria-label="Tukar bahasa"
          @click="swapDirection"
        >
          <ArrowLeftRight />
        </Button>
        <span class="flex-1">
          {{ targetLang }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Textarea
          v-model="input"
          rows="6"
          placeholder="Ketik kalimat di sini..."
          class="text-base"
        />
        <Card class="relative min-h-36">
          <CardContent class="p-3">
            <p class="text-base whitespace-pre-wrap text-foreground">
              {{ output }}
            </p>
            <div class="absolute top-2 right-2 flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                aria-label="Salin"
                @click="copy(output)"
              >
                <Check v-if="copied" class="size-4" />
                <Copy v-else class="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                aria-label="Dengarkan"
                @click="speak(output)"
              >
                <Volume2 class="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div v-if="history.length" class="mt-10">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-sm font-medium text-foreground">Riwayat</h2>
          <Button
            variant="link"
            size="sm"
            class="h-auto p-0 text-muted-foreground"
            @click="clearHistory"
          >
            Hapus semua
          </Button>
        </div>
        <ul class="space-y-2">
          <li v-for="entry in history" :key="entry.id">
            <Card
              class="cursor-pointer p-3 text-sm hover:border-foreground/20"
              @click="loadFromHistory(entry)"
            >
              <p class="text-muted-foreground">{{ entry.input }}</p>
              <p class="text-foreground">{{ entry.output }}</p>
            </Card>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
