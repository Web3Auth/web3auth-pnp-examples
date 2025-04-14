import { useRouter } from "next/navigation";

import { handleSignOut } from "@/actions";

export default function SignOut() {
  const router = useRouter();

  const handleClick = async () => {
    await handleSignOut();
    router.push("/");
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
    >
      Sign Out
    </button>
  );
}
