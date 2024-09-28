export type TestType = {
  id: number,
  name: string,
  questions: Array<QuestionType>
}
export type QuestionType = {
  id: number,
  question: string,
  answers: Array<AnswerType>
}

export type AnswerType = {
  correct?: boolean;
  id: number,
  answer: string
}
