import { doPost } from "../core/api/api";

export interface CreateClientPost {
  name: string;
  lastName: string;
  email: string;
  identification: string;
  birthdate: string;
  contact: string;
  comment: string;
}
export const createClient = async <T>( values: CreateClientPost ): Promise<void> => {
  console.log('Creating client:', values);
  
  try {
    const response = await doPost<T, typeof values>('/clients', values);
    console.log('POST successful:', response.data);
  } catch (error) {
    console.error('POST failed:', error);
    throw error;
  }
};