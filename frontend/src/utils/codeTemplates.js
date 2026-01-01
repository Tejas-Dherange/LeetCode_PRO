/**
 * Utility to split code into visible (user-editable) and hidden (boilerplate) parts
 */

/**
 * Extract the user-editable function from JavaScript code
 */
const extractJavaScriptFunction = (fullCode) => {
  // Pattern: function functionName(...) { ... }
  const functionRegex = /\/\*\*[\s\S]*?\*\/\s*function\s+\w+\([^)]*\)\s*{[\s\S]*?(?=\n\/\/|$)/;
  const match = fullCode.match(functionRegex);
  
  if (match) {
    const functionCode = match[0];
    const codeBeforeFunction = fullCode.substring(0, match.index);
    const codeAfterFunction = fullCode.substring(match.index + functionCode.length);
    
    return {
      visibleCode: functionCode.trim(),
      hiddenPrefix: codeBeforeFunction.trim(),
      hiddenSuffix: codeAfterFunction.trim(),
    };
  }
  
  return { visibleCode: fullCode, hiddenPrefix: '', hiddenSuffix: '' };
};

/**
 * Extract the user-editable function from Python code
 */
const extractPythonFunction = (fullCode) => {
  // Pattern: def functionName(...): ... (including docstring and body)
  const lines = fullCode.split('\n');
  let defLineIndex = -1;
  let lastFunctionLine = -1;
  
  // Find the def line
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('def ') && !lines[i].includes('__main__')) {
      defLineIndex = i;
      break;
    }
  }
  
  if (defLineIndex === -1) {
    return { visibleCode: fullCode, hiddenPrefix: '', hiddenSuffix: '' };
  }
  
  // Find where the function ends (next line that's not indented or start of if __name__)
  for (let i = defLineIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('if __name__') || (line.length > 0 && !line.startsWith(' ') && !line.startsWith('\t'))) {
      lastFunctionLine = i - 1;
      break;
    }
  }
  
  if (lastFunctionLine === -1) {
    lastFunctionLine = lines.length - 1;
  }
  
  // Extract parts
  const beforeFunction = lines.slice(0, defLineIndex).join('\n');
  const functionCode = lines.slice(defLineIndex, lastFunctionLine + 1).join('\n');
  const afterFunction = lines.slice(lastFunctionLine + 1).join('\n');
  
  return {
    visibleCode: functionCode.trim(),
    hiddenPrefix: beforeFunction.trim(),
    hiddenSuffix: afterFunction.trim(),
  };
};

/**
 * Extract the user-editable method from Java code
 */
const extractJavaFunction = (fullCode) => {
  // Pattern: Find the method that's not main and is public/private/protected
  const methodRegex = /\/\*\*[\s\S]*?\*\/\s*(public|private|protected|static)\s+.*?\s+\w+\s*\([^)]*\)\s*{[\s\S]*?(?=\n\s*(public|private|protected|static|\/\*\*|$))/;
  
  // Find all methods
  const methods = [];
  let currentIndex = 0;
  let match;
  
  while ((match = fullCode.substring(currentIndex).match(methodRegex)) !== null) {
    const methodCode = match[0];
    const globalIndex = currentIndex + match.index;
    
    // Skip main method
    if (!methodCode.includes('main(String')) {
      methods.push({
        code: methodCode,
        startIndex: globalIndex,
        endIndex: globalIndex + methodCode.length,
      });
    }
    
    currentIndex = globalIndex + methodCode.length;
  }
  
  if (methods.length > 0) {
    // Use the first non-main method
    const method = methods[0];
    const beforeMethod = fullCode.substring(0, method.startIndex);
    const afterMethod = fullCode.substring(method.endIndex);
    
    return {
      visibleCode: method.code.trim(),
      hiddenPrefix: beforeMethod.trim(),
      hiddenSuffix: afterMethod.trim(),
    };
  }
  
  return { visibleCode: fullCode, hiddenPrefix: '', hiddenSuffix: '' };
};

/**
 * Main function to extract visible code based on language
 */
export const extractVisibleCode = (fullCode, language) => {
  if (!fullCode) {
    return { visibleCode: '', hiddenPrefix: '', hiddenSuffix: '' };
  }
  
  switch (language.toUpperCase()) {
    case 'JAVASCRIPT':
      return extractJavaScriptFunction(fullCode);
    case 'PYTHON':
      return extractPythonFunction(fullCode);
    case 'JAVA':
      return extractJavaFunction(fullCode);
    default:
      return { visibleCode: fullCode, hiddenPrefix: '', hiddenSuffix: '' };
  }
};

/**
 * Merge user code with boilerplate
 */
export const mergeCodeWithBoilerplate = (userCode, hiddenPrefix, hiddenSuffix) => {
  const prefix = hiddenPrefix ? hiddenPrefix + '\n\n' : '';
  const suffix = hiddenSuffix ? '\n\n' + hiddenSuffix : '';
  return prefix + userCode + suffix;
};
