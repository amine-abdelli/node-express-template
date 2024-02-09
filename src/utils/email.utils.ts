/**
 * Trim an email address like so :
 * " John_Doe@dOmain.Fr   " => "john_doe@domain.fr"
 * @param email john_doe@domain.com
 * @returns A trimmed email address in lowercase
 */
export function formatEmail(email: string) {
  return email.toLowerCase().trim();
}
