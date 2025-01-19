import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex flex-col mt-20 items-center justify-between">
        <p className="text-lg">Please{' '} 
          <a 
          href="/login" 
          className="text-black dark:text-white lg:text-lg font-medium truncate transition duration-200 hover:text-[#ADB8C8] dark:hover:text-[#ADB8C8] cursor-pointer">
            login
          </a>{' '}
          to continue.
        </p>
      </div>
    );
  }

  return <AdminClient />;
}
