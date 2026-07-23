<script setup lang="ts">
import {
  ArrowLeftRight,
  ArrowRight,
  Check,
  Copy,
  History,
  House,
  Star,
  Volume2,
  X,
} from '@lucide/vue'

interface HistoryEntry {
  id: string
  input: string
  output: string
  sourceLangId: LangId
  targetLangId: LangId
  timestamp: number
}

const history = useLocalStorage<HistoryEntry[]>('bahasa-g-history', [])

const {
  input,
  output,
  sourceLangId,
  targetLangId,
  sourceLang,
  targetLang,
  swapLanguages,
} = useBahasaG()

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
    sourceLangId: sourceLang.value.id,
    targetLangId: targetLang.value.id,
    timestamp: Date.now(),
  })
  history.value = history.value.slice(0, 50)
}

// Debounce biar gak nyimpen history tiap satu huruf diketik
const debouncedSave = useDebounceFn(saveToHistory, 800)
watch(output, () => debouncedSave())

function loadFromHistory(entry: HistoryEntry) {
  input.value = entry.input
  sourceLangId.value = entry.sourceLangId
  targetLangId.value = entry.targetLangId
}

function clearHistory() {
  history.value = []
}
</script>

<template>
  <div class="min-h-screen bg-background p-4">
    <div class="mx-auto max-w-6xl">
      <header class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-2.5 select-none">
          <NuxtLink
            to="/"
            class="transition-transform duration-200 ease-out hover:-translate-y-1 flex items-center gap-1"
          >
            <Button
              as="span"
              variant="secondary"
              size="icon-lg"
              class="rounded-full"
            >
              <House class="size-5" />
            </Button>
            <span class="text-xl font-medium text-foreground"> Bahasa G </span>
          </NuxtLink>
          <NuxtLink
            to="/translate"
            class="font-medium text-xl text-foreground transition-transform duration-200 ease-out hover:-translate-y-1"
          >
            Terjemahan
          </NuxtLink>
        </div>

        <!-- TODO: Add history toggle functionality -->
        <Button
          variant="ghost"
          size="icon-lg"
          class="rounded-full"
          @click="() => {}"
        >
          <History class="size-5" />
        </Button>
      </header>

      <h1 class="sr-only">Bahasa G Terjemahan</h1>

      <div class="flex items-center mb-1 gap-3">
        <span class="flex-1">
          {{ sourceLang.name }}
        </span>
        <Button
          variant="ghost"
          size="icon"
          class="rounded-full"
          aria-label="Tukar bahasa"
          @click="swapLanguages"
        >
          <ArrowLeftRight />
        </Button>
        <span class="flex-1">
          {{ targetLang.name }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputGroup>
          <InputGroup
            class="dark:bg-transparent has-[[data-slot=input-group-control]:focus-visible]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 border-0 shadow-none"
          >
            <InputGroupTextarea
              v-model="input"
              placeholder="Ketik kalimat di sini..."
              class="min-h-36 md:text-lg py-2"
            />
            <InputGroupAddon
              v-if="input"
              align="inline-end"
              class="h-full items-start"
            >
              <InputGroupButton
                variant="ghost"
                size="icon-sm"
                class="rounded-full"
                aria-label="Hapus teks sumber"
                @click="input = ''"
              >
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroupAddon align="block-end" class="border-t">
            <InputGroupButton
              size="icon-sm"
              class="rounded-full"
              aria-label="Dengarkan"
              @click="speak(input)"
            >
              <Volume2 />
            </InputGroupButton>
            <InputGroupText class="font-medium text-xs ml-auto">
              {{ input.length }} karakter
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>

        <InputGroup class="bg-muted dark:bg-muted">
          <InputGroup class="h-full dark:bg-transparent border-0 shadow-none">
            <div class="w-full flex-1 min-w-0 px-3 py-2 min-h-36">
              <p class="md:text-lg whitespace-pre-wrap break-all">
                {{ output || 'Terjemahan' }}
              </p>
            </div>
            <InputGroupAddon
              v-if="output"
              align="inline-end"
              class="h-full items-start"
            >
              <!-- TODO: implement favorite/save output action -->
              <InputGroupButton
                size="icon-sm"
                variant="ghost"
                @click="() => {}"
              >
                <Star />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroupAddon align="block-end" class="border-t">
            <InputGroupButton
              size="icon-sm"
              class="rounded-full"
              aria-label="Dengarkan"
              @click="speak(output)"
            >
              <Volume2 />
            </InputGroupButton>
            <InputGroupButton
              size="icon-sm"
              class="ml-auto rounded-full"
              aria-label="Salin"
              @click="copy(output)"
            >
              <Check v-if="copied" />
              <Copy v-else />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
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
              class="p-3 gap-3 cursor-pointer text-sm hover:bg-accent"
              @click="loadFromHistory(entry)"
            >
              <div class="flex items-center gap-3">
                <span>{{ getLang(entry.sourceLangId).name }}</span>
                <ArrowRight class="size-4" />
                <span>{{ getLang(entry.targetLangId).name }}</span>
              </div>
              <div>
                <p class="text-foreground">{{ entry.input }}</p>
                <p class="text-muted-foreground">{{ entry.output }}</p>
              </div>
            </Card>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
