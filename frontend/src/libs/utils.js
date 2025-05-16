const getLaguageId = (language) => {
  const languageMap = {
    "JAVASCRIPT": 63,
    "C++": 53,
    "JAVA": 62,
    "PYTHON": 71,
    "C": 50,
  };

  console.log(language.toUpperCase());
  
  return languageMap[language.toUpperCase()];
};

export {
    getLaguageId
}