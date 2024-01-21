import * as bcrypt from 'bcrypt';

export const comparePassword = async ({
  loginPassword,
  userPassword,
}: {
  loginPassword: string;
  userPassword: any;
}): Promise<any> => {
  const isMatch = await bcrypt.compare(loginPassword, userPassword);

  return isMatch;
};

export const encryptPassword = async ({
  valueToEncrypt,
}: {
  valueToEncrypt: string;
}): Promise<any> => {
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(valueToEncrypt, saltOrRounds);

  return hash;
};
