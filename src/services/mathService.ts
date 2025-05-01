export interface EquationStep {
  equation: string;
  explanation: string;
}

export interface EquationSolution {
  steps: EquationStep[];
  result: string;
  error?: string;
}

const parseLinearEquation = (equation: string): EquationSolution => {
  const steps: EquationStep[] = [];
  let error = '';
  let result = '';

  try {
    const formattedEq = equation.replace(/\s+/g, '');
    steps.push({ equation: formattedEq, explanation: "Équation originale" });

    const [leftSide, rightSide] = formattedEq.split('=');
    if (leftSide === undefined || rightSide === undefined) {
      throw new Error("Format d'équation invalide");
    }

    const rhs = rightSide !== '0' ? `-(${rightSide})` : '0';
    steps.push({
      equation: `${leftSide} ${rhs !== '0' ? `+ ${rhs}` : ''} = 0`,
      explanation: "Soustraire le terme de droite des deux côtés"
    });

    const rhsInverted = rightSide.replace(/([+-]?)(\d+)/g, (_, sign, num) =>
      sign === '+' ? `-${num}` : `+${num}`
    );

    const allTerms = `${leftSide}${rhsInverted}`.split(/(?=[+-])/);
    let xCoeff = 0;
    let constant = 0;

    for (let term of allTerms) {
      term = term.trim();
      if (!term) continue;
      if (term.includes('x')) {
        const coeff = term.replace('x', '');
        xCoeff += coeff === '' || coeff === '+' ? 1 : coeff === '-' ? -1 : parseFloat(coeff);
      } else {
        const val = parseFloat(term);
        if (!isNaN(val)) constant += val;
      }
    }

    steps.push({
      equation: `${xCoeff}x ${constant >= 0 ? '+' : '-'} ${Math.abs(constant)} = 0`,
      explanation: "Simplification des termes"
    });

    if (xCoeff === 0) {
      throw new Error(constant === 0 ? "Infinité de solutions" : "Pas de solution");
    }

    const solution = -constant / xCoeff;
    result = `x = ${solution.toFixed(2)}`;

    steps.push({
      equation: result,
      explanation: `Diviser les deux côtés par ${xCoeff}`
    });

  } catch (err) {
    error = err instanceof Error ? err.message : "Erreur inconnue";
  }

  return { steps, result, error };
};

const solveQuadraticEquation = (equation: string): EquationSolution => {
  const steps: EquationStep[] = [];
  let error = '';
  let result = '';

  try {
    const formattedEq = equation.replace(/\s+/g, '');
    steps.push({ equation: formattedEq, explanation: "Équation originale" });

    const [leftSide, rightSide] = formattedEq.split('=');
    if (leftSide === undefined || rightSide === undefined) {
      throw new Error("Format d'équation invalide");
    }

    const leftTerms = leftSide.split(/(?=[+-])/);
    let a = 0, b = 0, c = 0;

    for (const termRaw of leftTerms) {
      const term = termRaw.trim();
      if (term.includes('x^2')) {
        const coeff = term.replace('x^2', '');
        a += coeff === '' || coeff === '+' ? 1 : coeff === '-' ? -1 : parseFloat(coeff);
      } else if (term.includes('x')) {
        const coeff = term.replace('x', '');
        b += coeff === '' || coeff === '+' ? 1 : coeff === '-' ? -1 : parseFloat(coeff);
      } else {
        const val = parseFloat(term);
        if (!isNaN(val)) c += val;
      }
    }

    if (rightSide && rightSide !== '0') {
      const rightValue = parseFloat(rightSide);
      if (!isNaN(rightValue)) c -= rightValue;
    }

    steps.push({
      equation: `${a}x² + ${b}x + ${c} = 0`,
      explanation: "Forme standard de l'équation quadratique"
    });

    if (a === 0) {
      return parseLinearEquation(`${b}x + ${c} = 0`);
    }

    const discriminant = b * b - 4 * a * c;
    steps.push({
      equation: `Δ = ${b}² - 4×${a}×${c} = ${discriminant}`,
      explanation: "Calcul du discriminant"
    });

    if (discriminant < 0) {
      throw new Error("Pas de solution réelle (discriminant négatif)");
    }

    if (discriminant === 0) {
      const sol = (-b / (2 * a)).toFixed(2);
      result = `x = ${sol} (solution double)`;
      steps.push({
        equation: result,
        explanation: "Solution unique (discriminant nul)"
      });
    } else {
      const sqrtD = Math.sqrt(discriminant);
      const x1 = (-b + sqrtD) / (2 * a);
      const x2 = (-b - sqrtD) / (2 * a);
      result = `x₁ = ${x1.toFixed(2)}, x₂ = ${x2.toFixed(2)}`;
      steps.push({
        equation: `x = [-${b} ± √${discriminant}] / (2×${a})`,
        explanation: "Formule quadratique"
      });
    }

  } catch (err) {
    error = err instanceof Error ? err.message : "Erreur inconnue";
  }

  return { steps, result, error };
};

export const solveEquation = (input: string | string[]): EquationSolution => {
  try {
    if (Array.isArray(input)) {
      if (input.length !== 2) {
        throw new Error("Seuls les systèmes 2x2 sont supportés");
      }

      return {
        steps: [{
          equation: input.join('\n'),
          explanation: "Système d'équations"
        }],
        result: "x = 1, y = 1",
        error: "La résolution des systèmes n'est pas encore implémentée"
      };
    }

    const equation = input.replace(/\s+/g, '');

    if (/^x\s*=\s*-?\d+(\.\d+)?$/.test(equation)) {
      return {
        steps: [{ equation, explanation: "L'équation est déjà résolue pour x" }],
        result: equation
      };
    }

    if (equation.includes('x^2')) {
      return solveQuadraticEquation(equation);
    }

    if (equation.includes('x')) {
      return parseLinearEquation(equation);
    }

    throw new Error("Type d'équation non reconnu");

  } catch (err) {
    return {
      steps: [],
      result: '',
      error: err instanceof Error ? err.message : "Erreur inconnue"
    };
  }
};