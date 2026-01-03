/**
 * Utility functions for code template merging (frontend version)
 */

/**
 * Merge student code back into the full template
 * @param {string} studentCode - Code written by student
 * @param {string} fullTemplate - Complete code template with markers
 * @returns {string} - Executable code
 */
export function mergeStudentCodeWithTemplate(studentCode, fullTemplate) {
  if (!fullTemplate) return studentCode;
  if (!studentCode) return fullTemplate;
  
  // Detect language based on markers
  const isPython = fullTemplate.includes('# USER_CODE_START');
  const isJavaJS = fullTemplate.includes('// USER_CODE_START');
  
  // If no markers, return student code as-is (backward compatibility)
  if (!isPython && !isJavaJS) {
    return studentCode;
  }
  
  if (isPython) {
    // Replace USER_CODE section with student's code
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
  
  // If replacement failed, return student code
  return studentCode;
}
