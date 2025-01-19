"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Wrench, ShieldCheck, LogOut } from "lucide-react";
import SettingsDialog from "../../components/SettingsDialog";
import { cn } from "@/lib/utils";

export default function AdminClient() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ShieldCheck />
            <h1 className="text-3xl font-medium p-2">Admin Dashboard</h1>
          </div>
        </div>
        <hr className="border-t border-[#2B2C2C] my-4 w-full" />
      </div>

      {/* Main Content */}
      <main className="flex flex-col items-center px-4 lg:px-8 py-4 lg:py-8 space-y-4">
        <button
            onClick={() => setIsSettingsOpen(true)}
            className={cn(
            "flex items-center justify-center p-2 rounded-lg hover:bg-black/10",
            "dark:hover:bg-white/10 transition duration-150",
            "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
            )}
            aria-label="Settings"
        >
            <Wrench className="w-6 h-6 mr-2 text-md" />
            Configure API keys, LLM and Embedding models
        </button>

        {/* Settings Dialog */}
        <SettingsDialog isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />

        {/* Log Out Button */}
        <button
            onClick={handleLogout}
            className={cn(
              "flex items-center justify-center p-2 rounded-lg hover:bg-black/10",
              "hover:bg-black/10 dark:hover:bg-white/10 transition duration-150",
              "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
            )}
            aria-label="Log out"
          >
            <LogOut className="w-6 h-6 mr-2 text-md"/>
            Log Out
          </button>
      </main>
    </div>
  );
}


// "use client";

// import { useState } from "react";
// import { Wrench, ShieldCheck } from "lucide-react";
// import SettingsDialog from "../../components/SettingsDialog";
// import { cn } from "@/lib/utils";

// export default function AdminClient() {
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);

//   return (
//     <div>
//       <div className="flex flex-col pt-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <ShieldCheck />
//             <h1 className="text-3xl font-medium p-2">Admin Dashboard</h1>
//           </div>
//         </div>
//         <hr className="border-t border-[#2B2C2C] my-4 w-full" />
//       </div>

    //   <main className="flex flex-col items-center px-4 lg:px-8 py-4 lg:py-8 space-y-4">
    //     <button
    //         onClick={() => setIsSettingsOpen(true)}
    //         className={cn(
    //         "flex items-center justify-center p-2 rounded-lg hover:bg-black/10",
    //         "dark:hover:bg-white/10 transition duration-150",
    //         "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
    //         )}
    //         aria-label="Settings"
    //     >
    //         <Wrench className="w-6 h-6 mr-2 text-md" />
    //         Configure API keys, LLM and Embedding models
    //     </button>

    //     {/* Settings Dialog */}
    //     <SettingsDialog isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />
    //   </main>
//     </div>
//   );
// }
