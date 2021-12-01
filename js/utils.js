// fonction qui capitalize la première lettre dans les rendus des listes
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}