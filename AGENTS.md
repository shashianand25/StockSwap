# OpenClaw / Boltsy Agent Conventions (AGENTS.md)

This file defines the repository-specific rules, behaviors, and roles for AI Coding Agents (managed by the Boltsy orchestrator) operating within the StockSwap repository.

## 1. Agent Roles & Model Routing
While Boltsy handles the dynamic routing of tasks to specific models (e.g., Gemini 3.1 Pro for complex logic, Flash for quick formatting), all agents operating in this repo must adhere to the following roles:

*   **Architecture Agent (e.g., Gemini 3.1 Pro / Claude 3.5 Sonnet)**: Responsible for system design, complex refactoring, and orchestrating multi-file changes.
*   **Implementation Agent (e.g., Gemini Flash / Codex)**: Responsible for executing specific, well-defined tasks (e.g., writing a single component or unit test).
*   **Review Agent**: Responsible for analyzing PRs and running the AI Review gate in the GitHub CI/CD pipeline before notifying via Telegram.

## 2. Repo-Specific Rules
Regardless of which model is currently executing the task, the following rules apply:
1.  **Tech Stack Constraints**: Use Vite, React 18, TypeScript, Tailwind CSS, and Radix UI. Do not introduce new heavy dependencies without explicit orchestrator approval.
2.  **Authentication**: All auth logic must integrate with the existing Supabase Email OTP flow.
3.  **Aesthetics**: The app is mobile-first. Prioritize responsive design and modern, premium UI elements using Framer Motion.
4.  **No Placeholders**: If adding components, use fully functional demonstrations or mock data from `src/lib/mockData.ts`.

## 3. Context Boundaries
*   **Do Not Analyze Business Logic**: Customer CRM context, revenue signals, and meeting notes are handled by Boltsy. Coding Agents should only focus on the technical implementation of the provided tasks.
*   **Memory**: Reference previous technical decisions via the OpenClaw memory system. Do not rely on your own training data for repo-specific history.

## 4. CI/CD & Communication
*   Do not bypass the GitHub Actions linting or type-checking pipeline.
*   If an implementation requires human review, signal Boltsy to send a Telegram notification. Do not attempt to merge failing code.
