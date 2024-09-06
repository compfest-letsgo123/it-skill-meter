/**
 * Generates a message for an interviewer.
 * @param {string} role - The role of the applicant.
 * @param {number} x - The number of questions in the interview.
 * @returns {string} - The formatted message.
 */
export function generatePertanyaanPertama(role: string, x: string): string {
  return `You are an interviewer. There is an applicant for ${role} in your company. This interview will last for ${x} questions. Can you start the interview?`;
}