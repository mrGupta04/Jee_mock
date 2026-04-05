"use client";

import Link from "next/link";
import { useState } from "react";

type Question = {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
};

const mockQuestions: Question[] = [
  {
    id: 1,
    question: "What is the SI unit of electric charge?",
    options: ["Ohm", "Ampere", "Coulomb", "Volt"],
    correctAnswer: 2,
  },
  {
    id: 2,
    question: "Which element has atomic number 11?",
    options: ["Magnesium", "Sodium", "Aluminum", "Potassium"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "If f(x) = x², then f'(3) equals:",
    options: ["3", "6", "9", "12"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "The derivative of sin(x) with respect to x is:",
    options: ["cos(x)", "-cos(x)", "tan(x)", "-sin(x)"],
    correctAnswer: 0,
  },
  {
    id: 5,
    question: "What is the pH of a neutral solution at 25°C?",
    options: ["1", "5", "7", "14"],
    correctAnswer: 2,
  },
];

const optionLabels = ["A", "B", "C", "D"];

export default function DashboardPage() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(
    {}
  );

  const attemptedCount = Object.keys(selectedAnswers).length;
  const score = mockQuestions.reduce((total, question) => {
    if (selectedAnswers[question.id] === question.correctAnswer) {
      return total + 1;
    }

    return total;
  }, 0);

  const handleSelect = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <section className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-300/30 backdrop-blur sm:p-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-sm font-medium text-orange-700 transition hover:text-orange-500"
            >
              ← Back to home
            </Link>
            <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              JEE Mock Dashboard
            </h1>
            <p className="mt-2 text-slate-700">
              Pick one option for each question. You&apos;ll see instant
              feedback right away.
            </p>
          </div>
          <div className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
            Score: {score}/{mockQuestions.length} • Attempted: {attemptedCount}/
            {mockQuestions.length}
          </div>
        </div>

        <div className="space-y-6">
          {mockQuestions.map((question, questionIndex) => {
            const selectedOption = selectedAnswers[question.id];
            const hasAnswered = selectedOption !== undefined;
            const isCorrect = selectedOption === question.correctAnswer;

            return (
              <article
                key={question.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5"
              >
                <fieldset>
                  <legend className="text-lg font-semibold text-slate-900">
                    {questionIndex + 1}. {question.question}
                  </legend>
                  <div className="mt-4 grid gap-3">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selectedOption === optionIndex;
                      const isActualCorrect = optionIndex === question.correctAnswer;
                      const showCorrectStyle = hasAnswered && isActualCorrect;
                      const showWrongStyle = hasAnswered && isSelected && !isActualCorrect;

                      return (
                        <label
                          key={option}
                          className={[
                            "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition",
                            showCorrectStyle
                              ? "border-emerald-500 bg-emerald-50"
                              : "",
                            showWrongStyle ? "border-rose-500 bg-rose-50" : "",
                            !showCorrectStyle && !showWrongStyle
                              ? "border-slate-200 bg-white hover:border-orange-400"
                              : "",
                          ].join(" ")}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={isSelected}
                            onChange={() => handleSelect(question.id, optionIndex)}
                            className="h-4 w-4 accent-orange-600"
                          />
                          <span className="font-semibold text-slate-700">
                            {optionLabels[optionIndex]}.
                          </span>
                          <span className="text-slate-900">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {hasAnswered ? (
                  <p
                    className={`mt-4 text-sm font-semibold ${
                      isCorrect ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {isCorrect
                      ? "Correct answer!"
                      : `Incorrect. Correct answer: ${
                          optionLabels[question.correctAnswer]
                        }. ${question.options[question.correctAnswer]}`}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
