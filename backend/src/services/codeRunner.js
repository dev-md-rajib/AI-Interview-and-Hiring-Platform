const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const TIMEOUT_MS = 10000; // 10 seconds per test case

/**
 * Run code against a single test case input, return { passed, actual, executionTime, error }
 */
function runCode(code, language, input, expectedOutput) {
  const start = Date.now();
  const tmpDir = os.tmpdir();
  let filePath = null;
  let command = '';

  try {
    const sanitizedInput = (input || '').trim();
    const sanitizedExpected = (expectedOutput || '').trim();

    if (language === 'javascript') {
      // Wrap code to inject stdin as a string array + run
      const wrapped = `
const lines = ${JSON.stringify(sanitizedInput ? sanitizedInput.split('\\n') : [])};
let _lineIndex = 0;
const readline = () => lines[_lineIndex++] || '';
const input = () => readline();
${code}
`;
      filePath = path.join(tmpDir, `code_${Date.now()}.js`);
      fs.writeFileSync(filePath, wrapped);
      command = `node "${filePath}"`;

    } else if (language === 'python') {
      const wrapped = `
import sys
_input_lines = ${JSON.stringify(sanitizedInput ? sanitizedInput.split('\\n') : [])}
_line_index = 0
def input():
    global _line_index
    line = _input_lines[_line_index] if _line_index < len(_input_lines) else ''
    _line_index += 1
    return line

${code}
`;
      filePath = path.join(tmpDir, `code_${Date.now()}.py`);
      fs.writeFileSync(filePath, wrapped);
      command = `py "${filePath}"`;

    } else {
      return { passed: false, actual: '', executionTime: 0, error: `Language '${language}' not supported` };
    }

    const actual = execSync(command, {
      timeout: TIMEOUT_MS,
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf8',
    }).trim();

    const passed = actual === sanitizedExpected;
    const executionTime = Date.now() - start;

    return { passed, actual, executionTime, error: null };

  } catch (err) {
    const executionTime = Date.now() - start;
    let errorMsg = err.message || 'Runtime error';
    if (err.killed || err.signal === 'SIGTERM') errorMsg = 'Time Limit Exceeded';
    if (err.status && err.stderr) errorMsg = err.stderr.toString().split('\\n').slice(0, 3).join(' ');
    return { passed: false, actual: '', executionTime, error: errorMsg };
  } finally {
    try { if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (_) {}
  }
}

/**
 * Run code against all test cases for a coding question
 * Returns array of test results + whether all passed
 */
function runAllTestCases(code, language, testCases) {
  const results = testCases.map(tc => {
    const result = runCode(code, language, tc.input, tc.expectedOutput);
    return {
      input: tc.hidden ? '(hidden)' : tc.input,
      expected: tc.hidden ? '(hidden)' : tc.expectedOutput,
      actual: result.error ? `Error: ${result.error}` : result.actual,
      passed: result.passed,
      executionTime: result.executionTime,
    };
  });

  const allPassed = results.every(r => r.passed);
  return { results, allPassed };
}

module.exports = { runCode, runAllTestCases };
