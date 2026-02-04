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
│       ├── kommasetzung.json           # Comma rules (30 items)
│       ├── wortstellung.json           # Word order (30 items)
│       └── adjektivendungen.json       # Adjective endings (30 items)
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
- `ks` - Kommasetzung
- `ws` - Wortstellung
- `ae` - Adjektivendungen

### Important Notes

- Use single quotes (`'`) in JSON strings, not German quotation marks (`„"`)
- Sentences should end with proper punctuation
- The `highlight` array helps the UI show which words differ between correct/incorrect
- Keep explanations concise but informative

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
    'adjektivendungen'
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
   const CACHE_NAME = 'minimal-pairs-v2';  // Bump version
   ```

---

## Grammar Categories

### Current Categories

| Category | Focus | Example Error |
|----------|-------|---------------|
| **Wechselpräpositionen** | Akkusativ (movement) vs. Dativ (location) | "auf den Tisch" vs. "auf dem Tisch" |
| **Dativ-Verben** | Verbs requiring dative case | "Ich helfe ihm" vs. "Ich helfe ihn" |
| **Kommasetzung** | Comma placement in German | ", dass" vs. " dass" |
| **Wortstellung** | Verb position in clauses | "...dass er kommt" vs. "...dass er kommt morgen" |
| **Adjektivendungen** | Adjective declension | "der große Mann" vs. "der großer Mann" |

### Potential Future Categories

- **Konjunktiv II** - Subjunctive mood
- **Relativpronomen** - Relative pronouns (der/die/das/dessen/deren)
- **Passiv** - Passive voice formation
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
