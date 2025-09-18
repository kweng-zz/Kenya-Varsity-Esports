export type AppwriteProfile = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $collectionId: string;
  $permissions: string[];
  fullname: string;
  email: string;
  university?: string;
  student_id?: string;
  phone_number?: string;
  isAdmin?: boolean;
};
