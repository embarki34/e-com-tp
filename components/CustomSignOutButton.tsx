import { SignOutButton } from "@clerk/nextjs";
import { FiLogOut } from "react-icons/fi"; // Import the logout icon from react-icons

export default function CustomSignOutButton() {
  return (
    <div className="flex justify-end p-2"> {/* Reduced padding for the container */}
      <SignOutButton>
        <button
          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-red-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <FiLogOut className="text-base" /> {/* Reduced icon size */}
          Sign Out
        </button>
      </SignOutButton>
    </div>
  );
}
