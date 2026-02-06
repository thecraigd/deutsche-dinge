# Deutsche Dinge - German Grammar Minimal Pairs App

## Project Overview

A mobile-friendly web app for B2/C1 German learners that uses **minimal pairs** (correct vs. incorrect sentences differing by one grammatical feature) combined with **spaced repetition** (Leitner system) to build grammatical intuition.

**Live URL:** https://thecraigd.github.io/deutsche-dinge/

**Repository:** https://github.com/thecraigd/deutsche-dinge

### Key Pedagogical Principles

1. **Minimal pair training** - Contrasting correct/incorrect sentences sharpens grammatical intuition
2. **Spaced repetition (Leitner system)** - Up to 200% better retention vs. massed practice
3. **Interleaved practice** - Questions from different categories are mixed for better long-term retention
4. **Multiple examples per rule** - Prevents memorization, promotes pattern learning
5. **German-only explanations** - Full immersion for B2/C1 level learners

---

## Architecture

### Tech Stack

- **Frontend:** Vanilla JavaScript + HTML + CSS (no framework dependencies)
- **Hosting:** GitHub Pages (static site)
- **Data:** JSON files (no backend required)
- **Storage:** localStorage for progress/spaced repetition state
- **PWA:** Service worker for offline functionality

### File Structure

```
deutsche-dinge/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment workflow
├── minimal-pairs/
│   ├── index.html              # Main HTML structure
│   ├── style.css               # Mobile-first responsive styles
│   ├── app.js                  # Core application logic
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service worker for offline support
│   └── data/
│       ├── wechselpraepositionen.json  # Two-way prepositions (30 items)
│       ├── dativ-verben.json           # Dative verbs & prepositions (30 items)
│       ├── kasus.json                  # All four cases (30 items)
│       ├── kommasetzung.json           # Comma rules (30 items)
│       ├── wortstellung.json           # Word order (30 items)
│       ├── adjektivendungen.json       # Adjective endings (30 items)
│       ├── konjunktiv-ii.json          # Subjunctive II (126 items)
│       ├── vergleiche.json             # Comparisons (126 items)
│       ├── passiv.json                 # Passive voice (126 items)
│       └── relativpronomen.json        # Relative pronouns (126 items)
└── CLAUDE.md                   # This documentation file
```

---

## Data Format

Each grammar category is stored as a JSON file in `minimal-pairs/data/`.

### Category File Structure

```json
{
  "category": "category-slug",
  "displayName": "Display Name",
  "description": "Brief description of the grammar rule",
  "items": [
    {
      "id": "unique-id",
      "correct": "The grammatically correct sentence.",
      "incorrect": "The grammatically incorrect sentence.",
      "highlight": ["correct-word", "incorrect-word"],
      "explanation": "German explanation of why the correct answer is correct.",
      "difficulty": 1
    }
  ]
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `category` | string | URL-safe slug matching the filename (without .json) |
| `displayName` | string | Human-readable category name (German) |
| `description` | string | Brief description of the grammar rule (German) |
| `items` | array | Array of minimal pair objects |
| `items[].id` | string | Unique identifier (format: 2-letter prefix + 3-digit number, e.g., "wp001") |
| `items[].correct` | string | The grammatically correct sentence |
| `items[].incorrect` | string | The grammatically incorrect sentence (differs by one feature) |
| `items[].highlight` | array | Two strings: [correct-form, incorrect-form] to highlight the difference |
| `items[].explanation` | string | German explanation of the grammar rule |
| `items[].difficulty` | number | 1 (easy), 2 (medium), or 3 (hard) - currently for future use |

### ID Prefixes by Category

- `wp` - Wechselpräpositionen
- `dv` - Dativ-Verben
- `ka` - Kasus (Fälle)
- `ks` - Kommasetzung
- `ws` - Wortstellung
- `ae` - Adjektivendungen
- `kz` - Konjunktiv II
- `vg` - Vergleiche
- `pv` - Passiv
- `rp` - Relativpronomen

### Important Notes

- Use single quotes (`'`) in JSON strings, not German quotation marks (`„"`)
- Sentences should end with proper punctuation
- The `highlight` array helps the UI show which words differ between correct/incorrect
- Keep explanations concise but informative

---

## Data Creation Methodology

This section documents how the minimal pair data was created, enabling future sessions to generate additional high-quality content.

### Core Principles

1. **True minimal pairs:** Sentences must differ by exactly ONE grammatical feature
2. **Natural language:** Use realistic, everyday sentences a B2/C1 learner would encounter
3. **Clear contrast:** The error should be a common learner mistake, not an obscure edge case
4. **Unambiguous correctness:** There should be no debate about which sentence is correct
5. **Consistent difficulty:** Within each category, vary sentence complexity but keep the grammatical focus consistent

### Creation Process

#### Step 1: Identify the Grammar Rule
For each category, clearly define the rule being tested:
- **Wechselpräpositionen:** Akkusativ for movement (wohin?), Dativ for location (wo?)
- **Dativ-Verben:** Specific verbs that require dative case
- **Kommasetzung:** Comma required before subordinating conjunctions and relative pronouns
- **Wortstellung:** Verb-final in subordinate clauses, V2 in main clauses after fronted elements
- **Adjektivendungen:** Adjective endings based on article type, case, gender, and number

#### Step 2: Create Systematic Variations
For each rule, create pairs that vary:
- **Nouns:** Different genders (der/die/das) to test case recognition
- **Verbs:** Different verbs that follow the same pattern
- **Contexts:** Different but realistic scenarios
- **Sentence structures:** Simple and complex sentences

#### Step 3: Write the Correct Sentence First
Always start with a natural, grammatically correct German sentence. Then create the incorrect version by changing only the target feature.

#### Step 4: Verify the Highlight Words
The `highlight` array must contain exactly the words that differ:
- First element: the word/phrase as it appears in the CORRECT sentence
- Second element: the word/phrase as it appears in the INCORRECT sentence

### Category-Specific Guidelines

#### Wechselpräpositionen (Two-way Prepositions)

**Pattern:** Create pairs using the same preposition, contrasting movement vs. location verbs.

| Movement Verbs (Akkusativ) | Location Verbs (Dativ) |
|---------------------------|------------------------|
| legen (to lay) | liegen (to lie) |
| stellen (to place standing) | stehen (to stand) |
| setzen (to set/seat) | sitzen (to sit) |
| hängen (transitive) | hängen (intransitive) |
| gehen, laufen, fahren | sein, bleiben, wohnen |

**Example creation:**
```
Correct (movement): "Ich lege das Buch auf den Tisch."
Incorrect: "Ich lege das Buch auf dem Tisch."
Highlight: ["den", "dem"]
Explanation: "Bei Bewegung (wohin?) verwendet man Akkusativ. 'legen' zeigt eine Bewegung an."
```

**Then create the location counterpart:**
```
Correct (location): "Das Buch liegt auf dem Tisch."
Incorrect: "Das Buch liegt auf den Tisch."
Highlight: ["dem", "den"]
Explanation: "Bei einem Ort (wo?) verwendet man Dativ. 'liegen' beschreibt einen Zustand."
```

**Prepositions to use:** an, auf, hinter, in, neben, über, unter, vor, zwischen

**Vary the nouns by gender:**
- Masculine: Tisch, Schrank, Stuhl, Haken, Bahnhof
- Feminine: Wand, Küche, Garage, Tasche
- Neuter: Bett, Fenster, Buch, Haus

#### Dativ-Verben (Dative Verbs)

**Two sub-categories:**

1. **Verbs requiring dative object:**
   - helfen, danken, gefallen, gehören, schmecken, passen, folgen, glauben, antworten, vertrauen, gratulieren, widersprechen, begegnen, fehlen, ähneln, raten, gelingen, schaden, nützen

2. **Prepositions always requiring dative:**
   - mit, bei, aus, seit, nach, zu, von, gegenüber

**Example creation (dative verb):**
```
Correct: "Ich helfe meinem Freund."
Incorrect: "Ich helfe meinen Freund."
Highlight: ["meinem", "meinen"]
Explanation: "'helfen' verlangt den Dativ."
```

**Example creation (dative preposition):**
```
Correct: "Ich fahre mit dem Auto."
Incorrect: "Ich fahre mit das Auto."
Highlight: ["dem", "das"]
Explanation: "'mit' ist eine Präposition, die den Dativ verlangt."
```

**Vary the pronouns/articles:** mir/mich, dir/dich, ihm/ihn, ihr/sie, meinem/meinen, dem/den, der/die

#### Kasus (Cases)

**Focus:** Direct practice of all four German cases in various contexts.

**The four cases:**

| Case | Question | Function | Article (m/f/n/pl) |
|------|----------|----------|-------------------|
| Nominativ | Wer? Was? | Subject | der/die/das/die |
| Akkusativ | Wen? Was? | Direct object | den/die/das/die |
| Dativ | Wem? | Indirect object | dem/der/dem/den |
| Genitiv | Wessen? | Possession | des/der/des/der |

**Personal pronouns by case:**

| Person | Nom | Akk | Dat |
|--------|-----|-----|-----|
| 1st sg | ich | mich | mir |
| 2nd sg | du | dich | dir |
| 3rd sg m | er | ihn | ihm |
| 3rd sg f | sie | sie | ihr |
| 3rd sg n | es | es | ihm |
| 1st pl | wir | uns | uns |
| 2nd pl | ihr | euch | euch |
| 3rd pl | sie | sie | ihnen |

**Sub-categories to cover:**

1. **Akkusativ vs. Nominativ:** Direct object recognition
   ```
   Correct: "Ich sehe den Mann."
   Incorrect: "Ich sehe der Mann."
   Explanation: "Das direkte Objekt steht im Akkusativ. Maskulin: der → den."
   ```

2. **Dativ vs. Akkusativ:** Indirect object and dative verbs
   ```
   Correct: "Ich gebe dem Kind ein Geschenk."
   Incorrect: "Ich gebe das Kind ein Geschenk."
   Explanation: "Das indirekte Objekt (wem?) steht im Dativ. Neutrum: das → dem."
   ```

3. **Genitiv:** Possession and genitive prepositions
   ```
   Correct: "Das ist das Auto meines Vaters."
   Incorrect: "Das ist das Auto meinem Vater."
   Explanation: "Besitz wird mit Genitiv ausgedrückt. Maskulin: mein → meines + Vater → Vaters."
   ```

4. **Genitive prepositions:** wegen, trotz, während, innerhalb, außerhalb, anstatt
   ```
   Correct: "Wegen des Regens bleibe ich zu Hause."
   Incorrect: "Wegen dem Regen bleibe ich zu Hause."
   Explanation: "'wegen' verlangt den Genitiv. Maskulin: der → des + Regen → Regens."
   ```

**Key verbs for case practice:**
- Akkusativ: sehen, hören, fragen, lieben, kennen, haben, brauchen, rufen
- Dativ: helfen, danken, gefallen, gehören, schmecken, vertrauen, folgen, antworten, geben, zeigen, erklären

**Note on Genitiv:** Remember to add -s or -es to masculine and neuter nouns (des Mannes, des Kindes, des Buches).

#### Kommasetzung (Comma Rules)

**Focus areas:**

1. **Before subordinating conjunctions:** dass, weil, wenn, ob, obwohl, als, nachdem, bevor, während, seitdem, sobald, falls, damit
2. **Around relative clauses:** der, die, das, welcher, welche, welches
3. **Before infinitive clauses with zu:** especially with um...zu, ohne...zu, anstatt...zu
4. **After fronted subordinate clauses**

**Example creation (conjunction):**
```
Correct: "Ich weiß, dass er morgen kommt."
Incorrect: "Ich weiß dass er morgen kommt."
Highlight: [", dass", " dass"]
Explanation: "Vor der Konjunktion 'dass' steht immer ein Komma."
```

**Example creation (fronted clause):**
```
Correct: "Wenn es regnet, bleibe ich zu Hause."
Incorrect: "Wenn es regnet bleibe ich zu Hause."
Highlight: ["regnet,", "regnet "]
Explanation: "Nach einem vorangestellten Nebensatz mit 'wenn' steht ein Komma."
```

**Note:** The highlight includes the space or comma+space to show the exact difference.

#### Wortstellung (Word Order)

**Focus areas:**

1. **Verb-final in subordinate clauses:** dass, weil, wenn, ob, als, etc.
2. **V2 after fronted elements:** time expressions, adverbs, subordinate clauses
3. **Position of infinitives and participles**
4. **Indirect questions**

**Example creation (subordinate clause):**
```
Correct: "Ich weiß, dass er morgen kommt."
Incorrect: "Ich weiß, dass er kommt morgen."
Highlight: ["kommt.", "kommt morgen."]
Explanation: "Im Nebensatz steht das konjugierte Verb am Ende."
```

**Example creation (inversion after fronted element):**
```
Correct: "Morgen gehe ich ins Kino."
Incorrect: "Morgen ich gehe ins Kino."
Highlight: ["gehe ich", "ich gehe"]
Explanation: "Nach einem vorangestellten Satzglied (hier: 'Morgen') folgt das Verb vor dem Subjekt."
```

**Fronted elements to use:** Morgen, Gestern, Heute, Leider, Hoffentlich, Deshalb, Trotzdem, Im Sommer, Dort drüben

#### Adjektivendungen (Adjective Endings)

**Three declension patterns:**

1. **After definite article (der/die/das):** weak endings (-e or -en)
2. **After indefinite article (ein/eine/ein):** mixed endings
3. **No article:** strong endings (adjective shows gender/case)

**Quick reference for common cases:**

| Case | Definite (m/f/n/pl) | Indefinite (m/f/n) | No article (m/f/n) |
|------|---------------------|--------------------|--------------------|
| Nom | -e/-e/-e/-en | -er/-e/-es | -er/-e/-es |
| Akk | -en/-e/-e/-en | -en/-e/-es | -en/-e/-es |
| Dat | -en/-en/-en/-en | -en/-en/-en | -em/-er/-em |

**Example creation (definite article):**
```
Correct: "Der große Mann steht dort."
Incorrect: "Der großer Mann steht dort."
Highlight: ["große", "großer"]
Explanation: "Nach bestimmtem Artikel im Nominativ maskulin: -e"
```

**Example creation (indefinite article):**
```
Correct: "Ein großer Mann steht dort."
Incorrect: "Ein große Mann steht dort."
Highlight: ["großer", "große"]
Explanation: "Nach unbestimmtem Artikel im Nominativ maskulin: -er (das Adjektiv übernimmt die Endung)"
```

**Also include:** possessive articles (mein, dein, sein), kein, dieser, jeder, welcher

### Quality Checklist

Before adding new items, verify:

- [ ] The correct sentence is grammatically perfect
- [ ] The incorrect sentence contains exactly ONE error
- [ ] The error is a realistic learner mistake
- [ ] The highlight array correctly identifies the differing words
- [ ] The explanation is in German and clearly states the rule
- [ ] The ID follows the convention (prefix + 3-digit number)
- [ ] The JSON is valid (no trailing commas, proper quotes)
- [ ] The sentence uses natural, everyday vocabulary

### Common Pitfalls to Avoid

1. **Multiple errors:** Don't create sentences where the incorrect version has more than one mistake
2. **Ambiguous cases:** Avoid sentences where context could make either version acceptable
3. **Overly complex sentences:** Keep sentences readable; the focus is grammar, not vocabulary
4. **Rare vocabulary:** Use common words that B2/C1 learners know
5. **German quotation marks:** Use `'single quotes'` in JSON, never `„German quotes"`
6. **Inconsistent highlights:** Ensure highlights match exactly what appears in the sentences
7. **Missing punctuation:** Both sentences should have proper ending punctuation

### Generating at Scale

To efficiently create many items:

1. **Use templates:** Create sentence templates with slots for nouns/verbs
2. **Systematic variation:** For each template, vary gender, number, and person
3. **Pair creation:** For Wechselpräpositionen, always create movement AND location pairs
4. **Batch validation:** After creating a batch, validate JSON and spot-check 10-20% of items
5. **Difficulty progression:** Create some simple (difficulty: 1), medium (2), and complex (3) examples

### Example Batch Creation (Wechselpräpositionen)

Template: `[Subject] [verb] [object] [preposition] [article] [location].`

Generate pairs for "auf" with masculine noun "Tisch":
```json
{"id": "wp001", "correct": "Ich lege das Buch auf den Tisch.", "incorrect": "Ich lege das Buch auf dem Tisch.", ...},
{"id": "wp002", "correct": "Das Buch liegt auf dem Tisch.", "incorrect": "Das Buch liegt auf den Tisch.", ...}
```

Then repeat with feminine "Tasche", neuter "Bett", and other prepositions (in, an, unter, etc.).

---

## Leitner Spaced Repetition System

### Box System

The app uses a 5-box Leitner system:

| Box | Name | Review Interval |
|-----|------|-----------------|
| 1 | Neu | Every session |
| 2 | Lernen | Every 2 sessions |
| 3 | Üben | Every 4 sessions |
| 4 | Festigen | Every 8 sessions |
| 5 | Gemeistert | Every 16 sessions |

### Algorithm

1. **Correct answer:** Item moves up one box (max box 5)
2. **Incorrect answer:** Item returns to box 1
3. **Session queue priority:**
   - First: Items due for review (sorted by box number, lowest first)
   - Then: New items (shuffled)

### State Storage

Progress is stored in localStorage under the key `minimalPairs_v1`:

```javascript
{
  stats: {
    totalCorrect: number,
    totalAnswered: number,
    streak: number,
    maxStreak: number,
    categoryStats: {
      [category]: { correct: number, total: number }
    }
  },
  leitner: {
    [itemId]: { box: 1-5, lastReview: sessionNumber }
  },
  activeCategories: string[],
  sessionNumber: number
}
```

---

## Application Logic (app.js)

### Key Functions

| Function | Purpose |
|----------|---------|
| `init()` | Initializes app, loads data, sets up event listeners |
| `loadData()` | Fetches all JSON data files |
| `loadState()` / `saveState()` | localStorage persistence |
| `buildSessionQueue()` | Builds queue of items to review based on Leitner intervals |
| `getNextItem()` | Returns next item from queue |
| `showNextQuestion()` | Displays a question with randomized option positions |
| `handleAnswer(index)` | Processes answer, updates stats, promotes/demotes item |
| `highlightDifference()` | Wraps highlight words in `<span class="highlight">` |
| `updateStatsDisplay()` | Updates stats in menu panel |
| `updateLeitnerDisplay()` | Updates box counts in menu panel |

### Configuration

```javascript
const CONFIG = {
  categories: [
    'wechselpraepositionen',
    'dativ-verben',
    'kommasetzung',
    'wortstellung',
    'adjektivendungen',
    'konjunktiv-ii',
    'vergleiche',
    'passiv',
    'relativpronomen'
  ],
  leitnerBoxes: 5,
  reviewIntervals: [1, 2, 4, 8, 16],  // Sessions between reviews per box
  storageKey: 'minimalPairs_v1'
};
```

---

## Styling (style.css)

### Design Principles

- **Mobile-first:** Base styles for mobile, media queries for larger screens
- **Dark theme default:** With automatic light theme via `prefers-color-scheme`
- **Minimal and clean:** Focus on content, no distractions
- **Touch-friendly:** Large tap targets (minimum 44px)

### CSS Custom Properties

```css
:root {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --bg-card: #0f3460;
  --text-primary: #eaeaea;
  --text-secondary: #a0a0a0;
  --accent: #e94560;
  --success: #4ade80;
  --error: #f87171;
  --warning: #fbbf24;
  /* ... spacing, radius, shadows, transitions */
}
```

### Key Classes

| Class | Purpose |
|-------|---------|
| `.option` | Answer button styling |
| `.option.correct` | Green highlight for correct answer |
| `.option.incorrect` | Red highlight for incorrect answer |
| `.highlight` | Highlights the differing word in sentences |
| `.leitnerBox` | Leitner box display in menu |
| `.categoryFilter` | Category checkbox styling |

---

## Adding New Content

### Adding Items to Existing Category

1. Open the relevant JSON file in `minimal-pairs/data/`
2. Add new item objects to the `items` array
3. Follow the ID convention (e.g., `wp031` for 31st Wechselpräpositionen item)
4. Validate JSON syntax before committing
5. Update service worker cache version if needed

### Adding a New Category

1. **Create JSON file:** `minimal-pairs/data/new-category.json`
   ```json
   {
     "category": "new-category",
     "displayName": "Neue Kategorie",
     "description": "Beschreibung der Grammatikregel",
     "items": [...]
   }
   ```

2. **Update app.js CONFIG:**
   ```javascript
   const CONFIG = {
     categories: [
       // ... existing categories
       'new-category'
     ],
     // ...
   };
   ```

3. **Update index.html:** Add checkbox in `#categoryFilters`:
   ```html
   <label class="categoryFilter">
     <input type="checkbox" value="new-category" checked>
     <span>Neue Kategorie</span>
     <span class="categoryAccuracy" data-category="new-category"></span>
   </label>
   ```

4. **Update app.js `getCategoryDisplayName()`:**
   ```javascript
   const names = {
     // ... existing names
     'new-category': 'Neue Kategorie'
   };
   ```

5. **Update sw.js cache list:**
   ```javascript
   const ASSETS_TO_CACHE = [
     // ... existing assets
     './data/new-category.json'
   ];
   ```

6. **Increment cache version in sw.js:**
   ```javascript
   const CACHE_NAME = 'minimal-pairs-v3';  // Bump version
   ```

---

## Grammar Categories

### Current Categories

| Category | Focus | Example Error |
|----------|-------|---------------|
| **Wechselpräpositionen** | Akkusativ (movement) vs. Dativ (location) | "auf den Tisch" vs. "auf dem Tisch" |
| **Dativ-Verben** | Verbs requiring dative case | "Ich helfe ihm" vs. "Ich helfe ihn" |
| **Kasus (Fälle)** | All four cases: Nom/Akk/Dat/Gen | "Ich sehe den Mann" vs. "Ich sehe der Mann" |
| **Kommasetzung** | Comma placement in German | ", dass" vs. " dass" |
| **Wortstellung** | Verb position in clauses | "...dass er kommt" vs. "...dass er kommt morgen" |
| **Adjektivendungen** | Adjective declension | "der große Mann" vs. "der großer Mann" |
| **Konjunktiv II** | Subjunctive II for unreal situations, wishes, polite requests | "Wenn ich Zeit hätte" vs. "Wenn ich Zeit habe" |
| **Vergleiche** | Comparative, superlative, and comparison structures | "größer als" vs. "größer wie" |
| **Passiv** | Process passive, state passive, passive constructions | "ist gemacht worden" vs. "ist gemacht geworden" |
| **Relativpronomen** | Relative pronouns in correct case, gender, number | "Der Mann, den ich kenne" vs. "Der Mann, der ich kenne" |

### Potential Future Categories

- **Reflexive Verben** - Reflexive pronoun case (sich/mir/mich)
- **Präpositionen mit Genitiv** - Genitive prepositions (trotz, während, wegen)
- **Substantivierte Adjektive** - Nominalized adjectives

---

## Deployment

### GitHub Pages

The site deploys automatically via GitHub Actions on push to `main`.

**Workflow file:** `.github/workflows/deploy.yml`

The workflow:
1. Checks out code
2. Uploads `minimal-pairs/` directory as artifact
3. Deploys to GitHub Pages

### Manual Deployment

If you need to trigger a manual deployment:
```bash
gh workflow run deploy.yml
```

### Local Testing

```bash
cd minimal-pairs
python3 -m http.server 8000
# Open http://localhost:8000
```

---

## PWA Features

### Service Worker (sw.js)

- Caches all static assets on install
- Serves cached content when offline
- Falls back to network for uncached requests
- Cache versioning for updates (`CACHE_NAME`)

### Manifest (manifest.json)

- Enables "Add to Home Screen" on mobile
- Sets app name, theme color, display mode
- Portrait orientation preferred

### Updating the PWA

When making changes:
1. Update files as needed
2. Increment `CACHE_NAME` version in `sw.js`
3. Commit and push

Users will get the new version on next visit (service worker updates in background).

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1` or `↑` | Select first option |
| `2` or `↓` | Select second option |
| `Enter` or `Space` | Continue to next question (after answering) |
| `Escape` | Close menu panel |

---

## Future Enhancement Ideas

### Content
- [ ] Expand each category to 50-100 items
- [ ] Add difficulty progression (show easier items first)
- [ ] Generate variations using templates
- [ ] Import from MERLIN/Falko corpus
- [ ] Add audio pronunciation

### Features
- [ ] Daily practice goals/streaks
- [ ] Detailed statistics page
- [ ] Export/import progress
- [ ] Multiple user profiles
- [ ] Timed challenge mode
- [ ] Explanation pop-ups with grammar tables

### Technical
- [ ] Add unit tests for Leitner logic
- [ ] Validate JSON files in CI
- [ ] Add LanguageTool validation for new content
- [ ] Consider IndexedDB for larger datasets
