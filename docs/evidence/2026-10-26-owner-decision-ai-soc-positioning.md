# Owner decision 2026-10-26: AI SOC positioning line

Evidence for claims register row A8. This repository is public; this note holds no personal data.

- **Decision maker:** Mitch, owner of Direwolf Cybersecurity.
- **Date:** 2026-10-26.
- **Decision:** from the proposed wordings that name Direwolf's AI agents as AI, the owner chose
  option 1, verbatim, for the website:

  > A next-gen AI SOC: AI security analysts, engineers and responders work every alert around
  > the clock, overseen by our team of security professionals.

- **Owner direction the same day (context for the line):** Direwolf builds AI agents that fill
  the analyst, detection-engineer, incident-responder and security-advisor roles in its AI SOC,
  each with defined tools and guardrails, and the website wording must make clear that these
  analysts, engineers and responders are AI. With the standing rules (owner direction
  2026-10-24, register rule 8 and row A2), that means: never imply they are people, never claim
  24/7 human staffing, and keep "monitored by" or "overseen by our team of security
  professionals" for the human side.

## State of the agents on 2026-10-26

| Role in the line | State                                                                                                                                                                                                                                                                                                             | Register status                                                |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| AI analysts      | Built in the platform's code: the triage pipeline enriches, investigates and judges each alert (platform ADRs 0011 and 0018). Tested only against recorded model responses; not in service.                                                                                                                       | `planned`                                                      |
| AI responders    | Built in the platform's code: the automated response stage, in which the AI's verdict passes a deterministic policy gate that decides containment under the customer's guardrails, with one-click undo and an audit record (platform ADRs 0005 and 0012). Tested only against recorded responses; not in service. | `planned`                                                      |
| AI engineers     | Not built, and not yet in the platform's PLAN.md or backlog: owner direction only, to be designed in the AI SOC autonomy plan.                                                                                                                                                                                    | `owner intent` (shown on the Home hero only, by this decision) |
| AI advisors      | Not in the line. Owner direction only, like the engineers.                                                                                                                                                                                                                                                        | `owner intent` (not shown on the site)                         |

## Consequences recorded elsewhere

- Claims register row A8 (approved forms, status, gate) and the `owner intent` status value.
- Launch runbook gate G20: before `PLATFORM_LIVE` is set to `true`, the engineer agent is in
  service or "engineers" comes off the Home hero; `npm run links` enforces it.
- The platform repository's working queue (`docs/dev/overnight-plan.md`, entries of 2026-10-26)
  holds the same decision; this note is the permanent record the register cites.
