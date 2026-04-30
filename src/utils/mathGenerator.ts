
export interface MathProblem {
  id: number;
  operand1: number;
  operand2: number;
  operator: '+' | '-' | '×' | '÷';
  answer: number;
  options?: number[];
}

export interface MathConfig {
  maxNumber: 5 | 10 | 20 | 50 | 100;
  questionCount: 5 | 10 | 20 | 50;
  operators: ('+' | '-' | '×' | '÷')[];
}

const generateNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateOptions = (answer: number, maxNumber: number): number[] => {
  const options = new Set<number>();
  options.add(answer);
  
  const range = Math.max(5, Math.ceil(maxNumber * 0.3));
  
  while (options.size < 4) {
    let wrongAnswer = answer + generateNumber(-range, range);
    if (wrongAnswer > 0 && wrongAnswer !== answer) {
      options.add(wrongAnswer);
    }
  }
  
  return Array.from(options).sort(() => Math.random() - 0.5);
};

export const generateAddition = (maxNumber: number): MathProblem => {
  const operand1 = generateNumber(1, maxNumber);
  const operand2 = generateNumber(1, maxNumber);
  const answer = operand1 + operand2;
  
  return {
    id: Date.now() + Math.random(),
    operand1,
    operand2,
    operator: '+',
    answer,
    options: generateOptions(answer, maxNumber)
  };
};

export const generateSubtraction = (maxNumber: number): MathProblem => {
  const operand1 = generateNumber(2, maxNumber);
  const operand2 = generateNumber(1, operand1);
  const answer = operand1 - operand2;
  
  return {
    id: Date.now() + Math.random(),
    operand1,
    operand2,
    operator: '-',
    answer,
    options: generateOptions(answer, maxNumber)
  };
};

export const generateMultiplication = (maxNumber: number): MathProblem => {
  const tableMax = Math.min(10, maxNumber);
  const operand1 = generateNumber(1, tableMax);
  const operand2 = generateNumber(1, tableMax);
  const answer = operand1 * operand2;
  
  return {
    id: Date.now() + Math.random(),
    operand1,
    operand2,
    operator: '×',
    answer,
    options: generateOptions(answer, maxNumber * 10)
  };
};

export const generateDivision = (maxNumber: number): MathProblem => {
  const tableMax = Math.min(10, maxNumber);
  const operand2 = generateNumber(1, tableMax);
  const answer = generateNumber(1, tableMax);
  const operand1 = operand2 * answer;
  
  return {
    id: Date.now() + Math.random(),
    operand1,
    operand2,
    operator: '÷',
    answer,
    options: generateOptions(answer, maxNumber)
  };
};

export const generateMathProblem = (maxNumber: number, operator?: '+' | '-' | '×' | '÷'): MathProblem => {
  const operators: ('+' | '-' | '×' | '÷')[] = operator ? [operator] : ['+', '-'];
  const selectedOperator = operator || operators[Math.floor(Math.random() * operators.length)];
  
  switch (selectedOperator) {
    case '+':
      return generateAddition(maxNumber);
    case '-':
      return generateSubtraction(maxNumber);
    case '×':
      return generateMultiplication(maxNumber);
    case '÷':
      return generateDivision(maxNumber);
    default:
      return generateAddition(maxNumber);
  }
};

export const generateMathExercise = (config: MathConfig): MathProblem[] => {
  const problems: MathProblem[] = [];
  const { maxNumber, questionCount, operators } = config;
  
  for (let i = 0; i < questionCount; i++) {
    const operator = operators[Math.floor(Math.random() * operators.length)];
    problems.push(generateMathProblem(maxNumber, operator));
  }
  
  return problems;
};

export const formatProblem = (problem: MathProblem): string => {
  return `${problem.operand1} ${problem.operator} ${problem.operand2} = ?`;
};

export const checkAnswer = (problem: MathProblem, userAnswer: number): boolean => {
  return problem.answer === userAnswer;
};
