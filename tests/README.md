# AI Student Helpdesk Chatbot

A responsive, web-based chatbot that gives students instant answers about **courses, internships, deadlines and certificates**, built for the Skillinf Artificial Intelligence internship (Week 1 project).

The chatbot uses predefined responses with keyword matching, so it runs entirely in the browser with no server and no API key.

## Screenshots

| Home screen | Conversation |
| --- | --- |
| ![Home screen](screenshots/home.png) | ![Conversation](screenshots/conversation.png) |

## Features

- Chat window with a scrollable message history, text input and send button
- Answers for four categories: **Courses, Internships, Deadlines, Certificates**
- Quick-reply chips and topic cards that send a question with one click
- Fallback message when the bot does not understand the question
- Typing indicator and a 300-character counter
- Chat history kept for the session
- Tolerates short and misspelled questions (for example, "certifcate download")
- Light and dark mode, with a manual toggle
- Responsive layout that works on phones and desktops

## Tech stack

| Part | Technology |
| --- | --- |
| Structure | HTML5 |
| Styling | Tailwind CSS (CDN) and custom CSS |
| Logic | Vanilla JavaScript |
| Chatbot approach | Predefined responses with keyword matching |

## Project structure

```
student-helpdesk-chatbot/
├── README.md
├── .gitignore
├── frontend/
│   ├── index.html        # Chat interface
│   ├── style.css         # Colour tokens and component styles
│   └── script.js         # Chat logic, sample data and keyword matching
├── tests/
│   └── test_questions.md # Test cases and results
└── screenshots/
    ├── home.png
    └── conversation.png
```

## How to run

1. Download or clone this repository.
2. Open `frontend/index.html` in any modern browser.

An internet connection is needed the first time, because Tailwind CSS and the fonts load from a CDN.

Optional: run a local server instead.

```bash
cd frontend
python -m http.server 8000
# then open http://localhost:8000
```

## How it works

1. The student types a question or clicks a chip or topic card.
2. `detectIntent()` in `script.js` lowercases the text and scores it against keyword lists for each category. Keywords match as word prefixes, so `certif` also catches "certificate" and the misspelling "certifcate".
3. `respond()` returns a structured reply (text, list items, steps and follow-up chips) for the best-matching category.
4. If nothing matches, the bot returns the fallback message: *"I'm sorry, I can only help with student courses, internships, deadlines, and certificates. Please contact the helpdesk."*

## Customizing the data

All course, internship, deadline and certificate details are at the top of `frontend/script.js` (`COURSES`, `INTERNSHIPS`, `DEADLINES`, `CERT_STEPS`). The values are sample data, so replace them with your real details. To make the bot understand more wording, add keywords to the `INTENTS` list.

## Testing

Test questions and results are recorded in [`tests/test_questions.md`](tests/test_questions.md).

## Possible improvements

- Move the data into JSON files (`faq.json`, `college_info.json`)
- Add a Python or Node.js backend with a `/chat` endpoint
- Hybrid mode: predefined answers for common questions and an AI API (Claude, OpenAI or Gemini) for everything else, with the API key stored in a `.env` file

## Author

Your Name · Skillinf AI Internship
