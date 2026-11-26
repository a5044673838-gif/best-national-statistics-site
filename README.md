# best-national-statistics-site

[![make.fun competition](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![make.fun rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/a5044673838-gif/best-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![make.fun reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/a5044673838-gif/best-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

**Japan in Numbers** — a national statistics site for Japan: population, economy, health, education and environment, 2015–2024, with every figure sourced and every year shown.

The site covers Japan's shrinking and ageing population (124.0 million people in 2024, 29.8% aged 65+), its $4.19 trillion economy, the world's longest life expectancy (84.0 years), PISA 2022 results (5th in mathematics, 3rd in reading, 2nd in science), and falling CO₂ emissions (961.9 million tonnes in 2024). It has an overview dashboard, a section per topic, and a data explorer where any two indicators can be compared on an indexed scale and the whole dataset downloaded as CSV. Charts are hand-drawn SVG; every control works — chart type and year-range toggles, sortable tables, search, comparison selects, CSV download.

## Data sources

- World Bank, World Development Indicators — population, GDP, growth, inflation, unemployment, trade, life expectancy, fertility, age structure, urban share, infant mortality, health and education spending.
- OECD, PISA 2022 — mathematics, reading and science scores for 15-year-olds.
- Global Carbon Budget / Our World in Data — CO₂ emissions.
- Ember — electricity generation mix and renewable share.
- Ministry of Health, Labour and Welfare, Japan — births and deaths, 2024.
- Ministry of the Environment, Japan — greenhouse-gas emissions, fiscal 2023.

Figures are shown exactly as published; years with no published value are blank, never estimated. Sources and method notes appear on every page of the site.

## Run it

Serve the site locally:

```sh
node serve.ts
```

Then open <http://localhost:8080>.

Build the submission output (copies `app/` and `screenshots/` and writes `dossier.json`):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` is a Node 22 program using only the standard library, plus the vendored `vendor/makefun-frontend.ts` from the make.fun kit (unchanged). The site itself is plain static files under `app/` with no build step and no network requests at runtime.

## Layout

- `app/index.html` — page shell, header, navigation, footer
- `app/main.js` — hash router and control wiring
- `app/views.js` — one view per section (overview, population, economy, health, education, environment)
- `app/explorer.js` — data explorer: search, indexed comparison, CSV download
- `app/charts.js` — hand-rolled SVG line, bar, donut and paired-bar charts
- `app/data.js` — every figure, with its source
- `app/style.css` — the site's design
- `screenshots/` — screenshots of the site running
- `shots.json` — what each screenshot shows
