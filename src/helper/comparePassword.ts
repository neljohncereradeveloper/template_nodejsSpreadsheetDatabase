import bcrypt from 'bcryptjs';

/**
 * Password Validation using brcypt.compare.
 *
 * @param {Request body, password} string password from client.
 * @param {Request body, hash} string password from database.
 * @return {Boolean} true / false.
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    // Compare password
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.log(error);
  }

  return false;
};
