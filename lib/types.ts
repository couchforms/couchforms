import { Prisma } from "@prisma/client";

export type Survey = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  finishedOnboarding: boolean;
  published: boolean;
  colorPrimary: string;
  owner: string;
  elements: [Element];
  elementsDraft: [Element];
};

export type Element = MultipleChoiceElement | OpenElement | InstructionsElement;

export type MultipleChoiceElement = {
  id: string;
  type: "multipleChoice";
  data: {
    question: string;
    description: string;
    options: string[];
    multipleChoice: boolean;
    randomize: boolean;
  };
};

export type OpenElement = {
  id: string;
  type: "open";
  data: {
    question: string;
    description: string;
  };
};

export type InstructionsElement = {
  id: string;
  type: "instructions";
  data: {
    title: string;
    description: string;
    body: string;
  };
};

export type AnswerSession = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  answers: Answer[];
};

export type Answer = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  elementId: string;
  data: AnswerData;
};

export type AnswerData = {
  value: string | string[];
};

export type AnswersByElementId = {
  [elementId: string]: Answer[];
};
