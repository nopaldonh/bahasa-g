const VOWELS = ['a', 'e', 'i', 'o', 'u']
const DIGRAPHS = ['ng', 'ny', 'kh', 'sy']

function isVowel(ch: string) {
  return VOWELS.includes(ch)
}

interface Syllable {
  onset: string
  vowel: string
  coda: string
}

/**
 * Memecah satu kata jadi array suku kata { onset, vowel, coda }.
 *
 * Aturan:
 * - Onset = konsonan di awal suku kata. Digraf (ng, ny, kh, sy) dianggap satu unit.
 * - Nukleus = satu huruf vokal. Diftong (au, ai, oi) BELUM ditangani sebagai satu unit.
 * - Coda ditentukan dari jumlah konsonan sebelum vokal berikutnya:
 *   - 0 konsonan / akhir kata -> semua sisa konsonan jadi coda suku kata ini
 *   - 1 konsonan -> jadi onset suku kata berikutnya (pola V.CV), coda kosong
 *   - >=2 konsonan (bukan digraf) -> konsonan pertama jadi coda, sisanya onset berikutnya (VC.CV)
 *   - >=2 konsonan diawali digraf -> semua tetap jadi onset suku kata berikutnya
 */
export function syllabify(word: string): Syllable[] {
  const w = word.toLowerCase()
  const syllables: Syllable[] = []
  let i = 0

  while (i < w.length) {
    let onset = ''
    while (i < w.length && !isVowel(w.charAt(i))) {
      const two = w.slice(i, i + 2)
      if (DIGRAPHS.includes(two)) {
        onset += two
        i += 2
      } else {
        onset += w.charAt(i)
        i += 1
      }
    }

    if (i >= w.length) {
      const last = syllables.at(-1)
      if (last) last.coda += onset
      else syllables.push({ onset, vowel: '', coda: '' })
      break
    }

    const vowel = w.charAt(i)
    i += 1

    let j = i
    let consonants = ''
    while (j < w.length && !isVowel(w.charAt(j))) {
      consonants += w.charAt(j)
      j += 1
    }

    let coda = ''
    if (j >= w.length) {
      coda = consonants
      i = j
    } else if (consonants.length <= 1) {
      coda = ''
    } else if (DIGRAPHS.includes(consonants.slice(0, 2))) {
      coda = ''
    } else {
      coda = consonants.charAt(0)
      i += 1
    }

    syllables.push({ onset, vowel, coda })
  }

  return syllables
}

function encodeWord(word: string): string {
  // Pisahkan huruf dari tanda baca/simbol yang mungkin nempel (koma, titik, dst)
  const match = word.match(/^([a-zA-Z]+)(.*)$/)
  if (!match) return word
  const [, core = '', rest = ''] = match
  const syllables = syllabify(core)
  return (
    syllables
      .map((s) =>
        s.vowel ? s.onset + s.vowel + 'g' + s.vowel + s.coda : s.onset + s.coda,
      )
      .join('') + rest
  )
}

/** Indonesia -> Bahasa G */
export function toBahasaG(text: string): string {
  return text
    .split(/(\s+)/) // pertahankan spasi asli
    .map((w) => (/^\s*$/.test(w) ? w : encodeWord(w)))
    .join('')
}

/** Bahasa G -> Indonesia. Tidak butuh syllabifier, cukup cari pola "vokal-g-vokal sama". */
export function fromBahasaG(text: string): string {
  return text.replace(/([aiueoAIUEO])g\1/g, '$1')
}

interface LangItem {
  id: string
  name: string
}

const langs = {
  id: { id: 'id', name: 'Bahasa Indonesia' },
  g: { id: 'g', name: 'Bahasa G' },
} as const satisfies Record<string, LangItem>

export type LangId = keyof typeof langs
type Lang = (typeof langs)[LangId]

export function getLang(id: LangId) {
  return langs[id]
}

interface UseBahasaGOptions {
  sourceLang?: LangId
  targetLang?: LangId
}

interface UseBahasaGRreturn {
  sourceLangId: Ref<LangId>
  targetLangId: Ref<LangId>
  sourceLang: Ref<Lang>
  targetLang: Ref<Lang>
  input: Ref<string>
  output: ComputedRef<string>
  swapLanguages: () => void
}

export function useBahasaG(
  options?: UseBahasaGOptions | undefined,
): UseBahasaGRreturn {
  const sourceLangId = ref<LangId>(options?.sourceLang || 'id')
  const targetLangId = ref<LangId>(options?.targetLang || 'g')

  const input = ref('')
  const output = computed(() => {
    return sourceLangId.value === 'id'
      ? toBahasaG(input.value)
      : fromBahasaG(input.value)
  })

  const sourceLang = computed(() => getLang(sourceLangId.value))
  const targetLang = computed(() => getLang(targetLangId.value))

  function swapLanguages() {
    input.value = output.value
    const sourceLangIdTemp = sourceLangId.value
    sourceLangId.value = targetLangId.value
    targetLangId.value = sourceLangIdTemp
  }

  return {
    sourceLangId,
    targetLangId,
    sourceLang,
    targetLang,
    input,
    output,
    swapLanguages,
  }
}
