# Mindmap Logic Instructions

Read carefully and follow exactly.  
There must be **three and only three** types of mindmaps.  
Do not change, modify, merge, or invent new levels.  
Do not add ToC anywhere except where instructed.

---

## LEVEL 1 — BOOK LEVEL (Always Available)

**Meaning:** Full book mindmap.

**You must include:**
- All chapters found in the docs folder
- All nested chapters (sub-chapters, sub-sub-chapters, etc.)
- **ToC (headings) from every page**

This level = **complete hierarchical tree of the whole project**.

Example structure logic:

```

Book
├─ Chapter
│   ├─ Sub-Chapter
│   │   ├─ Sub-Sub-Chapter
│   │   │   ├─ Heading from page
│   │   │   └─ Heading from page
│   │   └─ ...
│   └─ ...
└─ Chapter
└─ ...

```

---

## LEVEL 2 — CHAPTER LEVEL (Conditional Availability)

**Meaning:** Mindmap based on *current page’s chapter hierarchy*.

**Important:**  
This level must include **only chapters and nested chapters**, **NO ToC at all**.

The mindmap root is based on the **current URL path**, for example:

| URL | Root Node |
|------|--------------|
| `/chapter` | `chapter` |
| `/chapter/sub` | `sub` |
| `/chapter/sub/sub2` | `sub2` |

You must include **all nested chapters under that root**, but **exclude all headings**.

**If the current URL has no nested chapters, Level 2 must not be shown as selectable.**

---

## LEVEL 3 — PAGE LEVEL (Always Available if page has headings)

**Meaning:** This mindmap is built only from the **ToC headings of the current page**.

You must use the heading hierarchy (H1-H6) from the markdown file.

Example:

```

Page Title
├─ H2 heading
├─ H2 heading
│   └─ H3 heading
└─ H2 heading

```

If the current page has **no headings**, Level 3 must not be shown as an option.

---

## SUMMARY TABLE

| Feature | Level 1 | Level 2 | Level 3 |
|---------|----------|----------|----------|
| Chapters | ✔ | ✔ | ✖ |
| Nested Chapters | ✔ | ✔ | ✖ |
| Page ToC | ✔ | ✖ | ✔ |
| Based on URL | ✖ | ✔ | ✔ |
| Always Available | ✔ | ✖ (only if sub-items) | ✔ (only if headings) |

---

## DO NOT

- ❌ Do not create more than three levels
- ❌ Do not add ToC to Level 2
- ❌ Do not exclude ToC from Level 1
- ❌ Do not include chapters in Level 3
- ❌ Do not guess or assume — follow rules exactly

---

You must now use these rules *every time* you are asked to generate, analyze, or modify a mindmap.
