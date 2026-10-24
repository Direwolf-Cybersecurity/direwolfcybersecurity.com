/**
 * Third-party statistics, exactly as registered in docs/claims-register.md (rows S-STAT-1 to
 * S-STAT-6, wording rule 13; research and caveats in docs/threat-stats.md). Each figure is shown
 * with its source (publisher, publication and year) beside it and a link to the publisher. They
 * are other organizations' findings, never Direwolf results: do not reword a label so it claims
 * more, drop a qualifier, or combine two sources in one sentence. Re-check a row when its
 * publisher releases a new edition.
 */

export type StatId = 'S-STAT-1' | 'S-STAT-2' | 'S-STAT-3' | 'S-STAT-4' | 'S-STAT-5' | 'S-STAT-6';

export interface ThreatStat {
  id: StatId;
  /** The figure as displayed (the register's band form). */
  figure: string;
  /** Whether the figure animates from zero (a single number with a prefix or suffix). */
  countUp: boolean;
  /** Label under the figure (the register's band form, or a paraphrase claiming less). */
  label: string;
  /** Source line: publisher, publication and year. */
  source: string;
  url: string;
}

export const threatStats: Record<StatId, ThreatStat> = {
  'S-STAT-1': {
    id: 'S-STAT-1',
    figure: '$1.93M',
    countUp: true,
    label: 'lower breach costs with extensive security AI and automation',
    source: 'IBM, Cost of a Data Breach Report 2026',
    url: 'https://www.ibm.com/reports/data-breach',
  },
  'S-STAT-2': {
    id: 'S-STAT-2',
    figure: '48%',
    countUp: true,
    label: 'of breaches involved ransomware',
    source: 'Verizon, 2026 Data Breach Investigations Report',
    url: 'https://www.verizon.com/business/resources/executivebriefs/2026-dbir-executive-summary.pdf',
  },
  'S-STAT-3': {
    id: 'S-STAT-3',
    figure: '7%+',
    countUp: true,
    label: 'of annual revenue lost by small businesses in the worst breaches',
    source: 'Verizon, 2026 Breach Impact Study',
    url: 'https://www.verizon.com/business/resources/reports/2026-breach-impact-study-dbir.pdf',
  },
  'S-STAT-4': {
    id: 'S-STAT-4',
    figure: '34%',
    countUp: true,
    label: 'of organizations with 100 to 250 employees stopped ransomware before encryption',
    source: 'Sophos, The State of Ransomware 2026',
    url: 'https://assets.sophos.com/X24WTUEQ/at/jbww7pmb8n3gp99wr6hfq4/sophos-state-ransomware-report-2026.pdf',
  },
  'S-STAT-5': {
    id: 'S-STAT-5',
    figure: '1 in 2',
    countUp: false,
    label: 'ransomware attacks started with email or phishing',
    source: 'Sophos, The State of Ransomware 2026',
    url: 'https://assets.sophos.com/X24WTUEQ/at/jbww7pmb8n3gp99wr6hfq4/sophos-state-ransomware-report-2026.pdf',
  },
  'S-STAT-6': {
    id: 'S-STAT-6',
    figure: '$3B+',
    countUp: true,
    label: 'lost to business email compromise in 2025',
    source: 'FBI IC3, 2025 Internet Crime Report',
    url: 'https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf',
  },
};

/**
 * The Home statistics band, in order, under the neutral heading "The threat, by the numbers":
 * three figures about the threat itself, each readable without re-parsing. S-STAT-1 (a saving
 * from security AI) is left off the Home band, which sells AI-driven detection, so it cannot read
 * as a Direwolf result (rule 13); S-STAT-4 is left off because its label needs re-reading.
 */
export const homeStats: ThreatStat[] = [
  threatStats['S-STAT-3'],
  threatStats['S-STAT-2'],
  threatStats['S-STAT-6'],
];

/** The note shown with every third-party figure (Home band, Services). */
export const statsNote =
  'Figures are published by the organizations named; they are not Direwolf results.';
