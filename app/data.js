// Japan in Numbers — the data behind the site.
//
// Every figure below was taken from a public source and is labelled with it.
// Main source: World Bank, World Development Indicators (WDI), Japan series,
// retrieved 26 November 2026 (API vintage 11 November 2026). Other sources
// are named on the indicator they feed. Nothing here is estimated by us:
// a year with no published value is null and the site says so.

export const COUNTRY = {
  name: 'Japan',
  nameJa: '日本',
  capital: 'Tokyo',
  landAreaKm2: 377915,
  landAreaSource: 'CIA World Factbook, 2024',
  currency: 'Japanese yen (JPY)',
  populationRank: 12,
};

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// values are keyed by year; null means the source publishes no value that year.
export const SERIES = [
  {
    id: 'population',
    name: 'Total population',
    unit: 'people',
    decimals: 0,
    source: 'World Bank, World Development Indicators (SP.POP.TOTL)',
    note: 'Midyear estimates, de facto population (all residents). Japan peaked at about 128.1 million in 2008 and has shrunk every year since.',
    values: { 2015: 127141000, 2016: 127076000, 2017: 126972000, 2018: 126811000, 2019: 126633000, 2020: 126261000, 2021: 125681593, 2022: 125124989, 2023: 124516650, 2024: 123975371 },
  },
  {
    id: 'gdp',
    name: 'GDP, current US dollars',
    unit: 'US$ billion',
    decimals: 1,
    source: 'World Bank, World Development Indicators (NY.GDP.MKTP.CD)',
    note: 'Nominal GDP. In yen terms the economy kept growing; the dollar figure falls after 2021 mainly because the yen weakened.',
    values: { 2015: 4534.4, 2016: 5110.4, 2017: 5038.2, 2018: 5154.3, 2019: 5245.8, 2020: 5189.2, 2021: 5225.9, 2022: 4448.0, 2023: 4384.9, 2024: 4190.0 },
  },
  {
    id: 'gdpPerCapita',
    name: 'GDP per capita, current US dollars',
    unit: 'US$',
    decimals: 0,
    source: 'World Bank, World Development Indicators (NY.GDP.MKTP.CD / SP.POP.TOTL)',
    note: 'Nominal GDP divided by total population. Japan was the world’s 4th-largest economy in 2024.',
    values: { 2015: 35663, 2016: 40215, 2017: 39680, 2018: 40645, 2019: 41427, 2020: 41100, 2021: 41583, 2022: 35549, 2023: 35216, 2024: 33797 },
  },
  {
    id: 'gdpGrowth',
    name: 'GDP growth, annual',
    unit: '%',
    decimals: 2,
    source: 'World Bank, World Development Indicators (NY.GDP.MKTP.KD.ZG)',
    note: 'Real (inflation-adjusted) growth. The 2020 drop of 4.3% is the COVID-19 recession; 2021 rebounded 3.6%.',
    values: { 2015: 1.8, 2016: 0.7, 2017: 1.62, 2018: 0.83, 2019: -0.31, 2020: -4.28, 2021: 3.56, 2022: 1.33, 2023: 0.72, 2024: -0.24 },
  },
  {
    id: 'inflation',
    name: 'Inflation, consumer prices',
    unit: '% per year',
    decimals: 2,
    source: 'World Bank, World Development Indicators (FP.CPI.TOTL.ZG)',
    note: 'Annual consumer-price inflation. After decades near zero, prices rose 2.5% in 2022 and 3.3% in 2023.',
    values: { 2015: 0.8, 2016: -0.13, 2017: 0.48, 2018: 0.99, 2019: 0.47, 2020: -0.02, 2021: -0.23, 2022: 2.5, 2023: 3.27, 2024: 2.74 },
  },
  {
    id: 'unemployment',
    name: 'Unemployment, total',
    unit: '% of labour force',
    decimals: 2,
    source: 'World Bank, World Development Indicators (SL.UEM.TOTL.ZS); ILO modelled estimate',
    note: 'Share of the labour force without work but available for and seeking employment. Japan’s rate has stayed under 3.5% for the whole decade.',
    values: { 2015: 3.39, 2016: 3.13, 2017: 2.82, 2018: 2.47, 2019: 2.35, 2020: 2.81, 2021: 2.81, 2022: 2.61, 2023: 2.6, 2024: 2.5 },
  },
  {
    id: 'exports',
    name: 'Exports of goods and services',
    unit: '% of GDP',
    decimals: 2,
    source: 'World Bank, World Development Indicators (NE.EXP.GNFS.ZS)',
    note: 'Exports as a share of GDP. The share passed 20% for the first time in the series in 2022.',
    values: { 2015: 17.09, 2016: 15.72, 2017: 17.22, 2018: 17.91, 2019: 17.04, 2020: 15.13, 2021: 17.46, 2022: 20.65, 2023: 21.06, 2024: 21.98 },
  },
  {
    id: 'lifeExpectancy',
    name: 'Life expectancy at birth',
    unit: 'years',
    decimals: 2,
    source: 'World Bank, World Development Indicators (SP.DYN.LE00.IN)',
    note: 'Years a newborn would live if current mortality patterns stayed the same. Japan has one of the longest life expectancies in the world; women 87.1 years and men 81.1 years in 2024.',
    values: { 2015: 83.79, 2016: 83.98, 2017: 84.1, 2018: 84.21, 2019: 84.36, 2020: 84.56, 2021: 84.45, 2022: 84.0, 2023: 84.04, 2024: 84.04 },
  },
  {
    id: 'fertility',
    name: 'Fertility rate',
    unit: 'births per woman',
    decimals: 2,
    source: 'World Bank, World Development Indicators (SP.DYN.TFRT.IN)',
    note: 'Children a woman would have if she lived through her childbearing years at current age-specific rates. Replacement level is about 2.1; Japan has been below it since the 1970s.',
    values: { 2015: 1.45, 2016: 1.44, 2017: 1.43, 2018: 1.42, 2019: 1.36, 2020: 1.33, 2021: 1.3, 2022: 1.26, 2023: 1.2, 2024: 1.15 },
  },
  {
    id: 'age65',
    name: 'Population aged 65 and over',
    unit: '% of total population',
    decimals: 2,
    source: 'World Bank, World Development Indicators (SP.POP.65UP.TO.ZS)',
    note: 'Japan has the oldest population of any large country: nearly 3 in 10 residents were 65 or older in 2024.',
    values: { 2015: 26.92, 2016: 27.51, 2017: 27.98, 2018: 28.35, 2019: 28.63, 2020: 28.92, 2021: 29.22, 2022: 29.4, 2023: 29.56, 2024: 29.78 },
  },
  {
    id: 'age014',
    name: 'Population aged 0–14',
    unit: '% of total population',
    decimals: 2,
    source: 'World Bank, World Development Indicators (SP.POP.0014.TO.ZS)',
    note: 'The child share has fallen every year of the decade, from 12.8% in 2015 to 11.4% in 2024.',
    values: { 2015: 12.84, 2016: 12.72, 2017: 12.61, 2018: 12.49, 2019: 12.37, 2020: 12.22, 2021: 12.05, 2022: 11.86, 2023: 11.65, 2024: 11.44 },
  },
  {
    id: 'urban',
    name: 'Urban population',
    unit: '% of total population',
    decimals: 2,
    source: 'World Bank, World Development Indicators (SP.URB.TOTL.IN.ZS)',
    note: 'Share of people living in areas defined as urban. More than 9 in 10 Japanese residents live in urban areas.',
    values: { 2015: 91.35, 2016: 91.45, 2017: 91.55, 2018: 91.64, 2019: 91.72, 2020: 91.78, 2021: 91.87, 2022: 91.98, 2023: 92.08, 2024: 92.19 },
  },
  {
    id: 'infantMortality',
    name: 'Infant mortality rate',
    unit: 'deaths per 1,000 live births',
    decimals: 1,
    source: 'World Bank, World Development Indicators (SP.DYN.IMRT.IN)',
    note: 'Deaths before age one per 1,000 live births. Japan’s rate of 1.8 is among the lowest in the world.',
    values: { 2015: 2.0, 2016: 2.0, 2017: 1.9, 2018: 1.9, 2019: 1.8, 2020: 1.8, 2021: 1.8, 2022: 1.8, 2023: 1.8, 2024: 1.8 },
  },
  {
    id: 'healthSpend',
    name: 'Current health expenditure',
    unit: '% of GDP',
    decimals: 2,
    source: 'World Bank, World Development Indicators (SH.XPD.CHEX.GD.ZS)',
    note: 'All spending on health goods and services (public and private) as a share of GDP. Latest published year is 2023.',
    values: { 2015: 10.75, 2016: 10.66, 2017: 10.66, 2018: 10.74, 2019: 10.97, 2020: 11.45, 2021: 12.08, 2022: 12.32, 2023: 10.74, 2024: null },
  },
  {
    id: 'eduSpend',
    name: 'Government expenditure on education',
    unit: '% of GDP',
    decimals: 2,
    source: 'World Bank, World Development Indicators (SE.XPD.TOTL.GD.ZS)',
    note: 'Public spending on education as a share of GDP. The World Bank publishes no value for Japan for 2022 or 2023 yet, so those years are blank.',
    values: { 2015: 3.31, 2016: 3.15, 2017: 3.13, 2018: 3.08, 2019: 3.16, 2020: 3.31, 2021: 3.34, 2022: null, 2023: null, 2024: null },
  },
];

// Age structure in 2024, from the 0–14 and 65+ shares above (WDI).
export const AGE_STRUCTURE_2024 = [
  { label: 'Aged 0–14', value: 11.44, color: '#2f6fb2' },
  { label: 'Aged 15–64', value: 58.78, color: '#7fb069' },
  { label: 'Aged 65 and over', value: 29.78, color: '#c0392b' },
];

// PISA 2022, 15-year-olds. Source: OECD, PISA 2022 (via Japan NIER summary).
export const PISA_2022 = [
  { subject: 'Mathematics', japan: 536, oecd: 472, japanRank: '5th of 81 systems' },
  { subject: 'Reading', japan: 516, oecd: 476, japanRank: '3rd of 81 systems' },
  { subject: 'Science', japan: 547, oecd: 485, japanRank: '2nd of 81 systems' },
];

// CO2 from fossil fuels and industry, million tonnes. Source: Global Carbon
// Budget / Our World in Data. 1990 shown for context.
export const CO2 = [
  { year: 1990, value: 1154.9 },
  { year: 2022, value: 1029.6 },
  { year: 2023, value: 986.9 },
  { year: 2024, value: 961.9 },
];
export const CO2_PER_PERSON_2024 = 7.77; // tonnes, Global Carbon Budget / OWID

// Electricity generation mix, 2024, % of domestic generation.
// Source: Ember, via Our World in Data.
export const ELECTRICITY_MIX_2024 = [
  { label: 'Gas', value: 34.07, color: '#8e6cc8' },
  { label: 'Coal', value: 32.19, color: '#4a4a4a' },
  { label: 'Solar', value: 9.51, color: '#e9a319' },
  { label: 'Nuclear', value: 8.35, color: '#2f6fb2' },
  { label: 'Hydropower', value: 7.82, color: '#4aa3c7' },
  { label: 'Bioenergy', value: 4.47, color: '#7fb069' },
  { label: 'Oil', value: 2.46, color: '#b07a3f' },
  { label: 'Wind', value: 1.14, color: '#9db8d2' },
];

// Renewable share of electricity generation. Source: Ember via Our World in Data.
export const RENEWABLE_SHARE = [
  { year: 2023, value: 22.14 },
  { year: 2024, value: 22.94 },
];

// Facts that are single numbers, each with its own source.
export const FACTS = {
  births2024: { value: 720988, label: 'Births in 2024', source: 'Ministry of Health, Labour and Welfare, Japan, 2024' },
  deaths2024: { value: 1618684, label: 'Deaths in 2024', source: 'Ministry of Health, Labour and Welfare, Japan, 2024' },
  medianAge2024: { value: 49.9, label: 'Median age, 2024 (years)', source: 'UN World Population Prospects 2024' },
  density2023: { value: 342, label: 'People per km², 2023', source: 'World Bank WDI' },
  ghgFy2023: { value: 1071, label: 'Greenhouse-gas emissions, FY2023 (MtCO₂e)', source: 'Ministry of the Environment, Japan' },
  ghgCutVs2013: { value: -23.3, label: 'GHG change vs FY2013 (%)', source: 'Ministry of the Environment, Japan' },
};

export const SOURCES = [
  { name: 'World Bank, World Development Indicators', what: 'Population, GDP, growth, inflation, unemployment, trade, life expectancy, fertility, age structure, urban share, infant mortality, health and education spending (2015–2024, latest published year per indicator).' },
  { name: 'OECD, PISA 2022', what: 'Mathematics, reading and science scores for 15-year-olds; Japan and OECD averages.' },
  { name: 'Global Carbon Budget / Our World in Data', what: 'CO₂ emissions from fossil fuels and industry, total and per person.' },
  { name: 'Ember, via Our World in Data', what: 'Electricity generation mix and renewable share, 2023–2024.' },
  { name: 'Ministry of Health, Labour and Welfare, Japan', what: 'Births and deaths in 2024.' },
  { name: 'Ministry of the Environment, Japan', what: 'Greenhouse-gas emissions, fiscal 2023.' },
  { name: 'Statistics Bureau of Japan / e-Stat', what: 'National statistics portal; cross-checks for population and prices.' },
  { name: 'CIA World Factbook', what: 'Land area 377,915 km²; capital Tokyo.' },
];

export function seriesById(id) {
  return SERIES.find((s) => s.id === id);
}

export function latestValue(series) {
  for (let i = YEARS.length - 1; i >= 0; i--) {
    const v = series.values[YEARS[i]];
    if (v !== null && v !== undefined) return { year: YEARS[i], value: v };
  }
  return null;
}

export function formatValue(series, value) {
  if (value === null || value === undefined) return '—';
  if (series.id === 'population') return (value / 1e6).toFixed(1) + ' million';
  if (series.id === 'gdp') return '$' + (value / 1000).toFixed(2) + ' trillion';
  if (series.unit === 'US$') return '$' + value.toLocaleString('en-US');
  return value.toLocaleString('en-US', { maximumFractionDigits: series.decimals }) + (series.unit.startsWith('%') ? '%' : ' ' + series.unit);
}
