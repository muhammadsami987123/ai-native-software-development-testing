Read carefully and follow exactly.  
There must be **three and only three** types of mindmaps. Sometimes it can be two.
Do not change, modify, merge, or invent new levels.  
Do not add ToC anywhere except where instructed.

Here's the dummy data for better understanding.

Main_Book = [
    {
        "chapter1": {
            1subchapter1:{
                11subsubchapter1:{
                    ToC: [
                        heading1,
                        heading2: {
                            subheading1
                        },
                        heading3
                    ]
                }
            },
            1subchapter2:{
                12subsubchapter1:{
                    ToC: [
                        heading1,
                        heading2
                    ]
                }
            },
            1subchapter3:{
                ToC: [
                    heading1
                ]
            },
        }
    },
    {
        chapter2: {
            2subchapter1: {
                ToC: [
                    heading1,
                    heading2
                ]
            }
        }
    },
    {
        chapter3: {
            ToC: [
                heading1: {
                    subheading1,
                    subheading2
                },
                heading2
            ]
        }
    },
]


## LEVEL 1 — BOOK LEVEL (Always Available)

**Meaning:** Full book mindmap.

**You must include:**
- All chapters found in the docs folder
- All nested chapters (sub-chapters, sub-sub-chapters, ToC[headings, sub headings etc.])
- **ToC (headings) from every page**

This level = **complete hierarchical tree of the whole project**.

Example from dummy data given:
```
Main_Book = [
    {
        "chapter1": {
            1subchapter1:{
                11subsubchapter1:{
                    ToC: [
                        heading1,
                        heading2: {
                            subheading1
                        },
                        heading3
                    ]
                }
            },
            1subchapter2:{
                12subsubchapter1:{
                    ToC: [
                        heading1,
                        heading2
                    ]
                }
            },
            1subchapter3:{
                ToC: [
                    heading1
                ]
            },
        }
    },
    {
        chapter2: {
            2subchapter1: {
                ToC: [
                    heading1,
                    heading2
                ]
            }
        }
    },
    {
        chapter3: {
            ToC: [
                heading1: {
                    subheading1,
                    subheading2
                },
                heading2
            ]
        }
    },
]
```


## LEVEL 2 — CHAPTER LEVEL (Conditional Availability)
**Meaning:** Mindmap based on *current page’s chapter hierarchy*.

**Important:**  
This level must include **only chapters and nested chapters**, **NO ToC at all**.

The mindmap root is based on the **current URL path**

Example from dummy data given:

If user is on the URL https://domain/chapter1/1subchapter1 So the mindmap most parent node should be 1subchapter1 and whatever comed under 1subchapter1 or under under 1subchapter1 would be include in the mindmap. Except table of content.
e.g 1subchapter1 -> 11subsubchapter1

IF user is on the URL https://domain/chapter1/ So the mindmap most parent node should be chapter1 and whatever comed under chapter1 or under under chapter1 would be include in the mindmap.
e.g chapter1 has three child 1subchapter1, 1subchapter2, 1subchapter3. And 1subchapter1 has one child 11subsubchapter1. 1subchapter2 has one child 12subsubchapter1 while 1subchapter3 has no child.

If the user is on the URL https://domain/chapter1/1subchapter1/11subsubchapter1 or https://domain/chapter1/1subchapter2 or https://domain/chapter3/ so the option of Chapter level mindmap must not be shown to the user it means there would be other two option visible. AS you can see in such urls there is no sub chapters.

Note: Here the root node would be the endpoint of the URL.


## LEVEL 3 — PAGE LEVEL (Always Available if page has headings (ToC))

**Meaning:** This mindmap is built only from the **ToC headings of the current page**.

You must use the heading hierarchy (H1-H6) from the markdown file.

Example from dummy data given:

IF the URL is https://domain/chapter1/1subchapter1/11subsubchapter1/ so the ToC of page 11subsubchapter1 mindmap would be generated like in this case the root node would be 11subsubchapter1 having three childs heading1, heading2 and heading3. Where heading2 have child named subheading1 and heading1 and heading3 have no child.


Now considering the docusarus book chapters and data fullfill my req