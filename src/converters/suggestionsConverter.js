export default function suggestionsConverter(suggestions) {
  console.log("convert suggestions", suggestions);
  const popular = suggestions
    .filter(suggestion => suggestion.name === "popular")
    .map(suggestion => suggestion.elements[0].text);
  const recommended = suggestions
    .filter(suggestion => suggestion.name === "recommended")
    .map(suggestion => suggestion.elements[0].text);
  return {
    popular,
    recommended
  };
}
