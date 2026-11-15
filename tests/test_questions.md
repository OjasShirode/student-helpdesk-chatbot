# Test Questions and Results

Each question was run through the chatbot's matching logic (`detectIntent()` and `respond()` in `frontend/script.js`) and the reply was compared with the expected result.

## Round 1: first version

| # | Question | Expected | Actual | Result |
| --- | --- | --- | --- | --- |
| 1 | Hi | Friendly greeting with topic chips | Greeting with chips | Pass |
| 2 | What courses are available? | Course list | List of 5 courses | Pass |
| 3 | Do you offer machine learning? | Course list | List of 5 courses | Pass |
| 4 | Tell me about internships | Internship list | List of 4 internships | Pass |
| 5 | internship deadline? | Internship deadlines | 2 internship deadlines | Pass |
| 6 | When is the internship application deadline? | Internship deadlines | 2 internship deadlines | Pass |
| 7 | When is the January batch enrollment deadline? | Course deadlines | Course list | **Fail** |
| 8 | Upcoming deadlines | All deadlines, soonest first | 5 deadlines | Pass |
| 9 | How do I get my certificate? | Certificate process steps | 5 steps | Pass |
| 10 | certifcate download (misspelled) | Certificate process steps | 5 steps | Pass |
| 11 | What is the certificate deadline? | Certificate deadline | 1 deadline | Pass |
| 12 | What's the weather? | Polite fallback message | Fallback message | Pass |
| 13 | Tell me a joke | Polite fallback message | Fallback message | Pass |
| 14 | Thanks | Polite reply | "You're welcome" reply | Pass |

**Result: 13 of 14 passed.**

### Problem found

Question 7 returned the course list. The words "enrollment" and "batch" both matched the Courses keywords (2 points), while "deadline" matched the Deadlines keywords only once (1 point), so Courses won.

### Fix

In `detectIntent()`, words that clearly ask about a date (deadline, last date, due, closing, closes, cutoff, submit by) now add 2 extra points to the Deadlines category.

## Round 2: after the fix

| # | Question | Expected | Actual | Result |
| --- | --- | --- | --- | --- |
| 1 | Hi | Friendly greeting with topic chips | Greeting with chips | Pass |
| 2 | What courses are available? | Course list | List of 5 courses | Pass |
| 3 | Do you offer machine learning? | Course list | List of 5 courses | Pass |
| 4 | Tell me about internships | Internship list | List of 4 internships | Pass |
| 5 | internship deadline? | Internship deadlines | 2 internship deadlines | Pass |
| 6 | When is the internship application deadline? | Internship deadlines | 2 internship deadlines | Pass |
| 7 | When is the January batch enrollment deadline? | Course deadlines | 2 course deadlines (final project, January enrollment) | Pass |
| 8 | Upcoming deadlines | All deadlines, soonest first | 5 deadlines | Pass |
| 9 | How do I get my certificate? | Certificate process steps | 5 steps | Pass |
| 10 | certifcate download (misspelled) | Certificate process steps | 5 steps | Pass |
| 11 | What is the certificate deadline? | Certificate deadline | 1 deadline | Pass |
| 12 | What's the weather? | Polite fallback message | Fallback message | Pass |
| 13 | Tell me a joke | Polite fallback message | Fallback message | Pass |
| 14 | Thanks | Polite reply | "You're welcome" reply | Pass |

**Result: 14 of 14 passed.**

## Notes

- Answers use sample data. Replace the data at the top of `frontend/script.js` with real details before final submission.
- Add your own questions to this table as you test, and record any failures and fixes the same way.