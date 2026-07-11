import { describe, expect, it } from 'vitest'
import {
  fromBahasaG,
  syllabify,
  toBahasaG,
} from '../../app/composables/useBahasaG'

describe('syllabify', () => {
  it('memecah suku kata sederhana berakhiran vokal', () => {
    expect(syllabify('saya')).toEqual([
      { onset: 's', vowel: 'a', coda: '' },
      { onset: 'y', vowel: 'a', coda: '' },
    ])
  })

  it('memecah suku kata dengan coda konsonan tunggal di akhir kata', () => {
    expect(syllabify('makan')).toEqual([
      { onset: 'm', vowel: 'a', coda: '' },
      { onset: 'k', vowel: 'a', coda: 'n' },
    ])
  })

  it('menjaga digraf (ng, ny, kh, sy) tetap satu unit onset', () => {
    expect(syllabify('bangun')).toEqual([
      { onset: 'b', vowel: 'a', coda: '' },
      { onset: 'ng', vowel: 'u', coda: 'n' },
    ])
  })

  it.todo(
    'diftong (au, ai, oi) seharusnya jadi satu nukleus suku kata — BELUM diimplementasikan. ' +
      'Saat ini tiap vokal diproses terpisah, contoh: "bermain" -> {b,e,""}, {r,m? }... ' +
      'lihat catatan batasan di planning notes.',
  )
})

describe('toBahasaG (encode)', () => {
  it.each([
    ['saya', 'sagayaga'],
    ['kamu', 'kagamugu'],
    ['makan', 'magakagan'],
  ])('mengubah "%s" menjadi "%s"', (input, expected) => {
    expect(toBahasaG(input)).toBe(expected)
  })

  it('mempertahankan spasi antar kata', () => {
    expect(toBahasaG('saya makan')).toBe('sagayaga magakagan')
  })
})

describe('fromBahasaG (decode)', () => {
  it.each([
    ['sagayaga', 'saya'],
    ['kagamugu', 'kamu'],
    ['magakagan', 'makan'],
  ])('mengubah "%s" kembali menjadi "%s"', (input, expected) => {
    expect(fromBahasaG(input)).toBe(expected)
  })
})

describe('round-trip encode -> decode', () => {
  it.each(['saya', 'kamu', 'makan', 'bermain', 'sekolah', 'bangun'])(
    'kata "%s" harus kembali ke bentuk semula setelah encode lalu decode',
    (word) => {
      expect(fromBahasaG(toBahasaG(word))).toBe(word)
    },
  )
})
