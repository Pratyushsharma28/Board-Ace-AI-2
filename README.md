🎓 BoardAce AI
Learn Smarter • Practise Better • Prepare Confidently
An AI-powered study companion for CBSE Class 12 Mathematics, Physics and Chemistry
GitHub Repository · Original Live Deployment
</div>

📖 About BoardAce AI
BoardAce AI is an independent educational web application designed to help CBSE Class 12 students prepare through interactive practice, AI-assisted explanations, and progress-based revision. The project targets the 2026–27 academic session and focuses on Mathematics, Physics, and Chemistry.
The goal is simple: make practice more engaging and help students identify the concepts they need to revise.
Deployment note: The live link above refers to the original deployment. Replace it with the new Render URL after the updated repository is deployed and tested.

✨ Learning Features
BoardAce AI is being developed around these learning experiences. Feature availability may vary by the deployed version; verify each feature in the app before describing it as fully operational.
Feature	Purpose
🤖 AI Quiz Generator	Generate subject- and chapter-based practice questions with explanations.
📝 Exam Simulator	Practise with timed quizzes, question navigation and results.
🧠 Mistake Detective	Review incorrect answers and understand relevant concepts.
🎯 Weak Topic Radar	Identify topics needing more practice using saved results.
📊 Performance Dashboard	Review quiz history, accuracy and progress.
🌐 English / हिन्दी	Learn using English or Hindi where supported.
🌙 Dark / Light Mode	Choose a comfortable reading theme.
🃏 Flashcards & Formula Library	Revise concepts, definitions and formulas.
📅 Study Planner & Daily Practice	Organize revision and build a regular study routine.
📌 Bookmarks & Practice Again	Save questions and revisit mistakes.
💬 AI Doubt Solver	Ask for step-by-step help and follow-up explanations.


🔭 Advanced features under development / verification
The updated project also explores image-based doubt solving, NCERT solution assistance, previous-year-question practice, adaptive practice, numerical practice, global search, exam countdown, subject comparison, and read-aloud support. These features should be listed as available only after their behavior has been tested in the deployed app.
Previous-year questions: Only source-verified questions should be identified as actual CBSE PYQs. AI-created questions should be labelled board-style practice, not official previous-year questions.
🛠️ Technology Stack
Layer	Technology
Frontend	React, TypeScript, Vite
Styling	Tailwind CSS, Lucide React icons, Motion
Backend	Node.js, Express, TypeScript (server.ts)
AI	Google Gemini API via @google/genai
Local development	tsx
Storage	Browser localStorage for supported on-device progress
Version control	Git and GitHub
Hosting	Render (planned for updated repository)


🚀 Run Locally
Requirements
- Node.js and npm installed
- A Gemini API key with access to a compatible model
1. Clone the repository
git clone https://github.com/Pratyushsharma28/Board-Ace-AI-2.git
cd Board-Ace-AI-2
2. Install dependencies
npm install
3. Configure environment variables
Copy the example environment file:
cp .env.example .env
Edit .env and provide your own key:
GEMINI_API_KEY=your_gemini_api_key_here
The example file also documents APP_URL for deployments that need a public application URL. Set it if your environment requires it.
Security: Never commit your .env file or API keys to GitHub. Keep Gemini credentials on the server; do not expose them through client-side VITE_ variables.
4. Start the development server
npm run dev
Open the local URL displayed in your terminal.
5. Build and check the project
npm run build
npm run lint
6. Start the application
npm run start
The commands above match the scripts currently defined in the repository's package.json.
☁️ Deploy on Render
1. Push your latest working changes to the repository's main branch.
2. In Render, create a Web Service and connect Pratyushsharma28/Board-Ace-AI-2.
3. Use the repository's build command: npm run build.
4. Use the repository's start command: npm run start.
5. Add GEMINI_API_KEY under Render Environment; set APP_URL if required by the application.
6. Select a suitable available instance type, deploy, and check the logs.
7. Test quiz generation, bilingual content, doubt solving, and saved progress before sharing the new URL.
Free-tier hosting and Gemini API usage are subject to their respective limits. A successful build does not guarantee that every AI feature is working in production.
📂 Project Structure
Board-Ace-AI-2/
├── src/                         # Frontend application source
├── server.ts                    # Express / TypeScript server
├── index.html                   # Web entry point
├── package.json                 # Dependencies and scripts
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── .env.example                 # Example environment settings
├── test-mistake-detective.ts    # Mistake Detective test file
└── test-validation-engine.ts    # Question validation test file
🔐 Privacy & Responsible AI
- BoardAce AI is intended as a study aid, not a substitute for teachers or official textbooks.
- AI-generated questions and explanations can contain mistakes. Verify important answers with reliable educational sources.
- Progress saved in localStorage is generally specific to the current browser/device and can be lost when browser data is cleared.
- Do not upload sensitive personal information when asking AI questions.
- The project is not officially affiliated with or endorsed by CBSE, NCERT, or Google.
🎯 Project Goals
- Support accessible Class 12 exam preparation in English and Hindi.
- Encourage practice with clear, step-by-step explanations.
- Help students revise topics they find difficult.
- Keep the experience lightweight, responsive and straightforward to use.
- Explore useful educational AI features while minimizing unnecessary API calls.
👨‍💻 Developer
Pratyush Sharma
Computer Science Engineering (AI & ML)
Quad AI School of Technology, Bengaluru
GitHub: @Pratyushsharma28
<div align="center">

Made with ♥ by Pratyush Sharma
BoardAce AI — Learn Smarter. Practise Better. Prepare Confidently.
</div>
