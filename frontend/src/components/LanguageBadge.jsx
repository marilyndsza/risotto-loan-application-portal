const languageClass = {
  Hindi: 'language-hindi',
  Tamil: 'language-tamil',
  Telugu: 'language-telugu',
  Marathi: 'language-marathi',
  English: 'language-english'
};

export default function LanguageBadge({ language }) {
  return <span className={`badge ${languageClass[language] || 'language-english'}`}>{language}</span>;
}
