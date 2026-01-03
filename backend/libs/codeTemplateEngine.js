/**
 * Code Template Engine
 * Processes code snippets with special markers to separate student code from boilerplate
 */

/**
 * Extract visible code for students from full code snippet
 * @param {string} fullCode - Complete code with markers
 * @returns {object} - { studentView: string, fullCode: string }
 */
export function processCodeSnippet(fullCode) {
  if (!fullCode) return { studentView: '', fullCode: '' };
  
  // Detect language based on comment style
  const isPython = fullCode.includes('# USER_CODE_START') || 
                   fullCode.includes('# BOILERPLATE_VISIBLE') ||
                   fullCode.includes('# BOILERPLATE_HIDDEN');
  
  const isJavaOrJS = fullCode.includes('// USER_CODE_START') || 
                     fullCode.includes('// BOILERPLATE_VISIBLE') ||
                     fullCode.includes('// BOILERPLATE_HIDDEN');
  
  // If no markers found, return full code as-is (backward compatibility)
  if (!isPython && !isJavaOrJS) {
    console.log('⚠️ No markers found - returning full code');
    return {
      studentView: fullCode,
      fullCode: fullCode
    };
  }
  
  let studentView = '';
  
  if (isPython) {
    studentView = extractPythonStudentCode(fullCode);
  } else {
    studentView = extractJavaJSStudentCode(fullCode);
  }
  
  console.log('✅ Code processed - Student view length:', studentView.length);
  console.log('✅ Contains markers:', studentView.includes('USER_CODE') || studentView.includes('BOILERPLATE'));
  
  return {
    studentView: studentView.trim() || fullCode,
    fullCode: fullCode
  };
}

/**
 * Extract student-visible code from Python snippets
 * @param {string} code - Full Python code
 * @returns {string} - Student-visible code
 */
function extractPythonStudentCode(code) {
  let result = '';
  
  // Extract BOILERPLATE_VISIBLE sections
  const visibleBoilerplateRegex = /#\s*BOILERPLATE_VISIBLE_START([\s\S]*?)#\s*BOILERPLATE_VISIBLE_END/g;
  let match;
  
  while ((match = visibleBoilerplateRegex.exec(code)) !== null) {
    result += match[1].trim() + '\n\n';
  }
  
  // Extract USER_CODE sections
  const userCodeRegex = /#\s*USER_CODE_START([\s\S]*?)#\s*USER_CODE_END/g;
  
  while ((match = userCodeRegex.exec(code)) !== null) {
    result += match[1].trim() + '\n';
  }
  
  // Remove any remaining marker comments from the result
  result = removeMarkerComments(result, true);
  
  return result;
}

/**
 * Extract student-visible code from JavaScript/Java snippets
 * @param {string} code - Full JS/Java code
 * @returns {string} - Student-visible code
 */
function extractJavaJSStudentCode(code) {
  let result = '';
  
  // Extract BOILERPLATE_VISIBLE sections
  const visibleBoilerplateRegex = /\/\/\s*BOILERPLATE_VISIBLE_START([\s\S]*?)\/\/\s*BOILERPLATE_VISIBLE_END/g;
  let match;
  
  while ((match = visibleBoilerplateRegex.exec(code)) !== null) {
    result += match[1].trim() + '\n\n';
  }
  
  // Extract USER_CODE sections
  const userCodeRegex = /\/\/\s*USER_CODE_START([\s\S]*?)\/\/\s*USER_CODE_END/g;
  
  while ((match = userCodeRegex.exec(code)) !== null) {
    result += match[1].trim() + '\n';
  }
  
  // Remove any remaining marker comments from the result
  result = removeMarkerComments(result, false);
  
  return result;
}

/**
 * Remove marker comment lines from code
 * @param {string} code - Code potentially containing markers
 * @param {boolean} isPython - Whether this is Python code
 * @returns {string} - Code without marker lines
 */
function removeMarkerComments(code, isPython) {
  if (!code) return '';
  
  const lines = code.split('\n');
  const filtered = lines.filter(line => {
    const trimmed = line.trim();
    
    if (isPython) {
      // Remove Python marker lines
      return !trimmed.startsWith('# USER_CODE_START') &&
             !trimmed.startsWith('# USER_CODE_END') &&
             !trimmed.startsWith('# BOILERPLATE_VISIBLE_START') &&
             !trimmed.startsWith('# BOILERPLATE_VISIBLE_END') &&
             !trimmed.startsWith('# BOILERPLATE_HIDDEN_START') &&
             !trimmed.startsWith('# BOILERPLATE_HIDDEN_END');
    } else {
      // Remove JS/Java marker lines
      return !trimmed.startsWith('// USER_CODE_START') &&
             !trimmed.startsWith('// USER_CODE_END') &&
             !trimmed.startsWith('// BOILERPLATE_VISIBLE_START') &&
             !trimmed.startsWith('// BOILERPLATE_VISIBLE_END') &&
             !trimmed.startsWith('// BOILERPLATE_HIDDEN_START') &&
             !trimmed.startsWith('// BOILERPLATE_HIDDEN_END');
    }
  });
  
  return filtered.join('\n');
}

/**
 * Merge student code back into the full template for execution
 * @param {string} fullTemplate - Complete code with markers
 * @param {string} studentCode - Code written by student
 * @returns {string} - Executable code
 */
export function mergeStudentCode(fullTemplate, studentCode) {
  if (!fullTemplate) return studentCode;
  
  // Detect language
  const isPython = fullTemplate.includes('# USER_CODE_START');
  
  if (isPython) {
    // Replace USER_CODE section with student's code in Python
    const userCodeRegex = /#\s*USER_CODE_START[\s\S]*?#\s*USER_CODE_END/;
    
    if (userCodeRegex.test(fullTemplate)) {
      return fullTemplate.replace(userCodeRegex, studentCode);
    }
  } else {
    // Replace USER_CODE section with student's code in JS/Java
    const userCodeRegex = /\/\/\s*USER_CODE_START[\s\S]*?\/\/\s*USER_CODE_END/;
    
    if (userCodeRegex.test(fullTemplate)) {
      return fullTemplate.replace(userCodeRegex, studentCode);
    }
  }
  
  // If no markers found, return student code as-is (backward compatibility)
  return studentCode;
}

/**
 * Remove all marker comments from code
 * Useful for cleaning up code before execution
 * @param {string} code - Code with markers
 * @returns {string} - Code without marker comments
 */
export function removeMarkers(code) {
  if (!code) return '';
  
  // Remove Python markers
  code = code.replace(/#\s*USER_CODE_START\s*/g, '');
  code = code.replace(/#\s*USER_CODE_END\s*/g, '');
  code = code.replace(/#\s*BOILERPLATE_VISIBLE_START\s*/g, '');
  code = code.replace(/#\s*BOILERPLATE_VISIBLE_END\s*/g, '');
  code = code.replace(/#\s*BOILERPLATE_HIDDEN_START\s*/g, '');
  code = code.replace(/#\s*BOILERPLATE_HIDDEN_END\s*/g, '');
  
  // Remove JS/Java markers
  code = code.replace(/\/\/\s*USER_CODE_START\s*/g, '');
  code = code.replace(/\/\/\s*USER_CODE_END\s*/g, '');
  code = code.replace(/\/\/\s*BOILERPLATE_VISIBLE_START\s*/g, '');
  code = code.replace(/\/\/\s*BOILERPLATE_VISIBLE_END\s*/g, '');
  code = code.replace(/\/\/\s*BOILERPLATE_HIDDEN_START\s*/g, '');
  code = code.replace(/\/\/\s*BOILERPLATE_HIDDEN_END\s*/g, '');
  
  return code;
}

/**
 * Check if code contains template markers
 * @param {string} code - Code to check
 * @returns {boolean} - True if markers are present
 */
export function hasMarkers(code) {
  if (!code) return false;
  
  return code.includes('USER_CODE_START') || 
         code.includes('BOILERPLATE_VISIBLE') ||
         code.includes('BOILERPLATE_HIDDEN');
}
