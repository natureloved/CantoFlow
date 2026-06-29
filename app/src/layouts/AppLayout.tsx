import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { PrivacyBanner } from "../components/PrivacyBanner";
import { PARTIES, CURRENT_ROLE } from "../data/seed";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState(CURRENT_ROLE);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/health");
        if (!res.ok) throw new Error();
        return res.json();
      } catch {
        return null;
      }
    },
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  const setParty = (newRole: string) => {
    setRole(newRole);
    queryClient.invalidateQueries();
    setSidebarOpen(false);
  };

  const party = PARTIES[role] || PARTIES.Supplier;

  return (
    <div className="min-h-screen bg-surface-400 flex">
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-brand-blue/30 overflow-hidden">
          <div className="h-full bg-brand-blue animate-gradient" style={{ width: "30%", animation: "gradient 2s ease infinite" }} />
        </div>
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={role}
        setParty={setParty}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} party={party} onRoleChange={setParty} role={role} />
        <main className="flex-1 bg-surface-400">
          <PrivacyBanner role={role} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
