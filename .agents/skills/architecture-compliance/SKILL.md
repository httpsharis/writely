# Architecture Compliance

## Purpose

The purpose of this document is to describe, at a high level, the the organisation's approach to architecture compliance.

Architecture compliance is the activity that confirms that systems or capabilities realised during project and programme activity reflect the architecture that was agreed with the business (and will therefore deliver the expected benefits). In most cases within Scottish Government the compliance assessment will be undertaken through independent, expert review. The sections below outline the default compliance review procedure.

## Contents

<!--TOC max3-->

## Revision History

| Version | Issued     | Comments                                         |
| ------- | ---------- | ------------------------------------------------ |
| 0.1     | 31-01-2017 | First draft with basic outline of the procedure. |

## Distribution List

| Role | RACI |
| ---- | ---- |
| …   | …   |

## Review

| Review frequency | Next review due |
| ---------------- | --------------- |
| ?                | ?               |

## Procedure

Most projects that execute within the Scottish Government would be considered as "smaller-scale" from the perspective of TOGAF. As such, the compliance procedure will typically take the form of a series of questions that will be evaluated by technical architects using an appropriate checklist. Selection of a checklist and the questions therein would be agreed between the project's technical architect(s) and the TDA. Similarly, the output of the compliance review is a report (using this template) that will be presented to the TDA for review.

By default, the following steps should be undertaken to complete an architecture compliance assessment:

| Step       | Actor               | Actions                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initiation | TDA                 | The TDA identifies the need to review the compliance of a project's architecture, normally as a result of the previous review having expired (see timing above). An agenda item is added for the TDA to scope a new compliance review.                                                                  |
| Scoping    | TDA                 | The TDA discusses and agrees the objectives and audience for the compliance review as well as the checklist to be used. The technical architect who will undertake the review is identified and the scope is finalised.                                                                                 |
| Assessment | Technical Architect | The technical architect interviews relevant members of the project team and, if necessary, performs further analyses to determine the compliance of the architecture against the agreed checklist.                                                                                                      |
| Report     | Technical Architect | Based on the analysis undertaken the technical architect prepares a report to summarise their findings.                                                                                                                                                                                                 |
| Review     | TDA                 | The completed compliance report is presented to the TDA membership and reviewed. The conclusions of the report are noted and dispensations are recorded for areas of the architecture for which full compliance was not achieved. The report is recorded in the architecture repository governance log. |

## Timing

Using a typical TOGAF ADM it's recommended that compliance reviews should be undertaken at appropriate project / programme milestones (e.g. project initiation, initial design, etc). This recommendation relates to a waterfall "world view" and is less appropriate for agile project delivery, especially a continuous delivery model. Under an agile approach architecture compliance reviews should be held at regular intervals, consuming proportionate effort and become a part of the overall cadence of the delivery approach. This schedule should follow the TOGAF advice that compliance reviews should occur when a substantive body of work has been completed, but, when there is still time to correct significant issues.

For typical Scottish Government agile delivery projects compliance reviews should be run every quarter and should be time boxed to 2 days effort.

## Terminology

By default architecture compliance reports will follow TOGAF 9.1 terminology, as follows:

| Term              | Definition                                                                                                                                                                                                                                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Irrelevant        | The implementation has no features in common with the architecture specification (so the question of conformance does not arise).                                                                                                                                                                                                      |
| Consistent        | The implementation has some features in common with the architecture specification, and those common features are implemented in accordance with the specification. However, some features in the architecture specification are not implemented, and the implementation has other features that are not covered by the specification. |
| Compliant         | Some features in the architecture specification are not implemented, but all features implemented are covered by the specification, and in accordance with it.                                                                                                                                                                         |
| Conformant        | All the features in the architecture specification are implemented in accordance with the specification, but some more features are implemented that are not in accordance with it.                                                                                                                                                    |
| Fully  Conformant | There is full correspondence between architecture specification and implementation. All specified features are implemented in accordance with the specification, and there are no features implemented that are not covered by the specification.                                                                                      |
| Non-conformant    | Any of the above in which some features in the architecture specification are implemented not in accordance with the specification.                                                                                                                                                                                                    |

The phrase "in accordance with" means:

- Supports the stated strategy and future directions;
- Adheres to the stated standards (including syntax and semantic rules specified) Provides the stated functionality;
- Adheres to the stated principles; for example:
  - Open wherever possible and appropriate;
  - Re-use of component building blocks wherever possible and appropriate.

## References

- [TOGAF, v9.1, §48: Architecture Compliance](http://pubs.opengroup.org/architecture/togaf9-doc/arch/chap48.html).
