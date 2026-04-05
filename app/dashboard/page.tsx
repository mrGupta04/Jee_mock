"use client";

import Link from "next/link";
import { useState } from "react";

type Subject = "Physics" | "Chemistry" | "Mathematics";
type MockId = "mock-1" | "mock-2";

type Question = {
  id: number;
  subject: Subject;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
};

type MockTest = {
  id: MockId;
  label: string;
  description: string;
  questionIds: number[];
};

const optionLabels = ["A", "B", "C", "D"] as const;
const subjects: Subject[] = ["Physics", "Chemistry", "Mathematics"];

const formatNumber = (value: number) => {
  if (Number.isInteger(value)) {
    return `${value}`;
  }

  return value.toFixed(2).replace(/\.?0+$/, "");
};

const getThreeUniqueNumbers = (correct: number, seeds: number[]) => {
  const unique: number[] = [];

  for (const seed of seeds) {
    if (seed > 0 && seed !== correct && !unique.includes(seed)) {
      unique.push(seed);
    }
  }

  let fallback = correct + 3;
  while (unique.length < 3) {
    if (!unique.includes(fallback) && fallback !== correct) {
      unique.push(fallback);
    }
    fallback += 1;
  }

  return unique as [number, number, number];
};

const buildNumericOptions = (
  correct: number,
  distractorSeeds: number[],
  correctPosition: number,
  suffix = ""
) => {
  const distractors = getThreeUniqueNumbers(correct, distractorSeeds);
  const ordered = [...distractors];
  ordered.splice(correctPosition, 0, correct);

  return {
    options: ordered.map(
      (value) => `${formatNumber(value)}${suffix}`
    ) as Question["options"],
    correctAnswer: correctPosition,
  };
};

const generatePhysicsQuestions = (count: number) =>
  Array.from({ length: count }, (_, index) => {
    const mass = 2 + (index % 8);
    const acceleration = 1 + (index % 5);
    const force = mass * acceleration;
    const correctPosition = index % 4;
    const { options, correctAnswer } = buildNumericOptions(
      force,
      [force + acceleration, force - mass, force + mass + 1, force + 2],
      correctPosition,
      " N"
    );

    return {
      subject: "Physics" as const,
      question: `A body of mass ${mass} kg accelerates at ${acceleration} m/s^2. What is the force?`,
      options,
      correctAnswer,
    };
  });

const generateChemistryQuestions = (count: number) =>
  Array.from({ length: count }, (_, index) => {
    const correctPosition = (index + 1) % 4;

    if (index % 2 === 0) {
      const exponent = 1 + ((index * 2) % 12);
      const { options, correctAnswer } = buildNumericOptions(
        exponent,
        [exponent - 1, exponent + 1, exponent + 2, exponent + 3],
        correctPosition
      );

      return {
        subject: "Chemistry" as const,
        question: `If [H+] = 10^-${exponent} M at 25 C, what is the pH?`,
        options,
        correctAnswer,
      };
    }

    const molarity = 1 + (index % 4);
    const volumeL = 0.25 * (1 + (index % 4));
    const moles = molarity * volumeL;
    const { options, correctAnswer } = buildNumericOptions(
      moles,
      [moles + 0.25, moles + 0.5, moles - 0.25, moles + 1],
      correctPosition,
      " mol"
    );

    return {
      subject: "Chemistry" as const,
      question: `A solution has molarity ${molarity} M and volume ${formatNumber(
        volumeL
      )} L. Number of moles of solute is:`,
      options,
      correctAnswer,
    };
  });

const generateMathematicsQuestions = (count: number) =>
  Array.from({ length: count }, (_, index) => {
    const correctPosition = (index + 2) % 4;

    if (index % 2 === 0) {
      const power = 2 + (index % 5);
      const derivativeAtTwo = power * 2 ** (power - 1);
      const { options, correctAnswer } = buildNumericOptions(
        derivativeAtTwo,
        [
          derivativeAtTwo - power,
          derivativeAtTwo + power,
          derivativeAtTwo + 2,
          derivativeAtTwo + 4,
        ],
        correctPosition
      );

      return {
        subject: "Mathematics" as const,
        question: `If f(x) = x^${power}, what is f'(2)?`,
        options,
        correctAnswer,
      };
    }

    const coefficient = 2 * (1 + (index % 4));
    const upperLimit = 1 + (index % 5);
    const integralValue = (coefficient * upperLimit * upperLimit) / 2;
    const { options, correctAnswer } = buildNumericOptions(
      integralValue,
      [
        integralValue - upperLimit,
        integralValue + upperLimit,
        integralValue + coefficient,
        integralValue + 2,
      ],
      correctPosition
    );

    return {
      subject: "Mathematics" as const,
      question: `Find integral from 0 to ${upperLimit} of ${coefficient}x dx.`,
      options,
      correctAnswer,
    };
  });

const withIds = (
  drafts: Omit<Question, "id">[],
  startId: number
): Question[] =>
  drafts.map((draft, index) => ({
    ...draft,
    id: startId + index,
  }));

const physicsQuestions = withIds(generatePhysicsQuestions(34), 1);
const chemistryQuestions = withIds(
  generateChemistryQuestions(33),
  physicsQuestions.length + 1
);
const mathematicsQuestions = withIds(
  generateMathematicsQuestions(33),
  physicsQuestions.length + chemistryQuestions.length + 1
);

const questionBank = [
  ...physicsQuestions,
  ...chemistryQuestions,
  ...mathematicsQuestions,
];

const questionsById = questionBank.reduce<Record<number, Question>>(
  (accumulator, question) => {
    accumulator[question.id] = question;
    return accumulator;
  },
  {}
);

const mockTests: MockTest[] = [
  {
    id: "mock-1",
    label: "JEE Mock Test 1",
    description: "50 questions: Physics 17, Chemistry 17, Mathematics 16",
    questionIds: [
      ...physicsQuestions.slice(0, 17).map((question) => question.id),
      ...chemistryQuestions.slice(0, 17).map((question) => question.id),
      ...mathematicsQuestions.slice(0, 16).map((question) => question.id),
    ],
  },
  {
    id: "mock-2",
    label: "JEE Mock Test 2",
    description: "50 questions: Physics 17, Chemistry 16, Mathematics 17",
    questionIds: [
      ...physicsQuestions.slice(17).map((question) => question.id),
      ...chemistryQuestions.slice(17).map((question) => question.id),
      ...mathematicsQuestions.slice(16).map((question) => question.id),
    ],
  },
];

const questionsPerPage = 10;

export default function DashboardPage() {
  const [activeMockId, setActiveMockId] = useState<MockId>("mock-1");
  const [selectedAnswersByMock, setSelectedAnswersByMock] = useState<
    Record<MockId, Record<number, number>>
  >({
    "mock-1": {},
    "mock-2": {},
  });
  const [currentPageByMock, setCurrentPageByMock] = useState<Record<MockId, number>>({
    "mock-1": 1,
    "mock-2": 1,
  });

  const activeMock = mockTests.find((mock) => mock.id === activeMockId) ?? mockTests[0];
  const selectedAnswers = selectedAnswersByMock[activeMock.id];

  const activeQuestions = activeMock.questionIds
    .map((id) => questionsById[id])
    .filter((question): question is Question => Boolean(question));

  const totalPages = Math.ceil(activeQuestions.length / questionsPerPage);
  const activePage = Math.min(currentPageByMock[activeMock.id] ?? 1, totalPages);
  const pageStartIndex = (activePage - 1) * questionsPerPage;
  const pageEndIndex = pageStartIndex + questionsPerPage;
  const paginatedQuestions = activeQuestions.slice(pageStartIndex, pageEndIndex);
  const visibleFrom = activeQuestions.length === 0 ? 0 : pageStartIndex + 1;
  const visibleTo = Math.min(pageEndIndex, activeQuestions.length);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const questionNumberById: Record<number, number> = {};
  activeQuestions.forEach((question, index) => {
    questionNumberById[question.id] = index + 1;
  });

  const attemptedCount = activeQuestions.reduce((count, question) => {
    return selectedAnswers[question.id] !== undefined ? count + 1 : count;
  }, 0);

  const score = activeQuestions.reduce((total, question) => {
    if (selectedAnswers[question.id] === question.correctAnswer) {
      return total + 1;
    }

    return total;
  }, 0);

  const sections = subjects
    .map((subject) => ({
      subject,
      questions: paginatedQuestions.filter((question) => question.subject === subject),
    }))
    .filter((section) => section.questions.length > 0);

  const setActivePage = (nextPage: number) => {
    const clampedPage = Math.max(1, Math.min(nextPage, totalPages));
    setCurrentPageByMock((prev) => ({
      ...prev,
      [activeMock.id]: clampedPage,
    }));
  };

  const handleSelect = (questionId: number, optionIndex: number) => {
    setSelectedAnswersByMock((prev) => ({
      ...prev,
      [activeMock.id]: {
        ...prev[activeMock.id],
        [questionId]: optionIndex,
      },
    }));
  };

  const clearActiveMockAnswers = () => {
    setSelectedAnswersByMock((prev) => ({
      ...prev,
      [activeMock.id]: {},
    }));
    setCurrentPageByMock((prev) => ({
      ...prev,
      [activeMock.id]: 1,
    }));
  };

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-300/30 backdrop-blur sm:p-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-sm font-medium text-orange-700 transition hover:text-orange-500"
            >
              {"<-"} Back to home
            </Link>
            <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              JEE Mock Dashboard
            </h1>
            <p className="mt-2 text-slate-700">
              Pick one option for each question. You&apos;ll see instant
              feedback right away. We now have 100 questions split into Physics,
              Chemistry, and Mathematics across two mock tests.
            </p>
          </div>
          <div className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
            Score: {score}/{activeQuestions.length} | Attempted: {attemptedCount}/
            {activeQuestions.length}
          </div>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {mockTests.map((mock) => {
            const isActive = mock.id === activeMock.id;

            return (
              <button
                key={mock.id}
                type="button"
                onClick={() => setActiveMockId(mock.id)}
                className={[
                  "rounded-2xl border px-5 py-4 text-left transition",
                  isActive
                    ? "border-orange-500 bg-orange-50"
                    : "border-slate-200 bg-slate-50 hover:border-orange-300",
                ].join(" ")}
              >
                <p className="text-base font-bold text-slate-900">{mock.label}</p>
                <p className="mt-1 text-sm text-slate-600">{mock.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-700">
            Total question bank: {questionBank.length} | Active mock:{" "}
            {activeMock.label}
          </p>
          <button
            type="button"
            onClick={clearActiveMockAnswers}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-400 hover:text-orange-700"
          >
            Reset {activeMock.label}
          </button>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-700">
            Showing {visibleFrom}-{visibleTo} of {activeQuestions.length} questions
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActivePage(activePage - 1)}
              disabled={activePage === 1}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-orange-400 hover:text-orange-700"
            >
              Previous
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setActivePage(pageNumber)}
                className={[
                  "rounded-lg border px-3 py-2 text-sm font-semibold transition",
                  activePage === pageNumber
                    ? "border-orange-600 bg-orange-600 text-white"
                    : "border-slate-300 text-slate-700 hover:border-orange-400 hover:text-orange-700",
                ].join(" ")}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setActivePage(activePage + 1)}
              disabled={activePage === totalPages}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-orange-400 hover:text-orange-700"
            >
              Next
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.subject}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900">
                  {section.subject}
                </h2>
                <p className="text-sm text-slate-600">
                  {section.questions.length} questions
                </p>
              </div>

              <div className="space-y-6">
                {section.questions.map((question) => {
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
                          {questionNumberById[question.id]}. {question.question}
                        </legend>
                        <div className="mt-4 grid gap-3">
                          {question.options.map((option, optionIndex) => {
                            const isSelected = selectedOption === optionIndex;
                            const isActualCorrect = optionIndex === question.correctAnswer;
                            const showCorrectStyle = hasAnswered && isActualCorrect;
                            const showWrongStyle =
                              hasAnswered && isSelected && !isActualCorrect;

                            return (
                              <label
                                key={`${question.id}-${optionIndex}`}
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
                                  name={`${activeMock.id}-question-${question.id}`}
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
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setActivePage(activePage - 1)}
            disabled={activePage === 1}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-orange-400 hover:text-orange-700"
          >
            Previous
          </button>
          <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
            Page {activePage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setActivePage(activePage + 1)}
            disabled={activePage === totalPages}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-orange-400 hover:text-orange-700"
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}
