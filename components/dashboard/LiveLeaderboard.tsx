"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Award, Zap } from "lucide-react";

type Leader = {
  id: string;
  user_id: string;
  legal_iq: number;
  current_streak: number;
};

export function LiveLeaderboard({ initialLeaders }: { initialLeaders: Leader[] }) {
  const [leaders, setLeaders] = useState<Leader[]>(initialLeaders);
  const [lastUpdatedId, setLastUpdatedId] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to any updates on the user_progress table
    const channel = supabase
      .channel("leaderboard-updates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "user_progress" },
        (payload) => {
          const updatedUser = payload.new as Leader;
          
          setLeaders((currentLeaders) => {
            // Check if the user is already in the list
            const userExists = currentLeaders.some((l) => l.user_id === updatedUser.user_id);
            let newList = [...currentLeaders];

            if (userExists) {
              // Update existing user
              newList = newList.map((l) => (l.user_id === updatedUser.user_id ? updatedUser : l));
            } else {
              // Add new user to the mix
              newList.push(updatedUser);
            }

            // Re-sort the list by highest Legal IQ and take the top 10
            newList.sort((a, b) => b.legal_iq - a.legal_iq);
            return newList.slice(0, 10);
          });

          // Trigger a quick highlight animation for the person who just scored
          setLastUpdatedId(updatedUser.user_id);
          setTimeout(() => setLastUpdatedId(null), 2000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* AnimatePresence handles elements entering and leaving the DOM */}
      <AnimatePresence>
        {leaders.map((user, index) => (
          <motion.div
            key={user.user_id} // Crucial for Framer Motion to track elements
            layout // This single prop makes them glide smoothly when sorting changes!
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
              lastUpdatedId === user.user_id 
                ? "bg-primary/20 border-primary" // Highlight green/blue if they just scored
                : "bg-background border-border"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 font-bold text-lg">
                {index === 0 ? <Trophy className="text-yellow-500 h-6 w-6" /> : 
                 index === 1 ? <Medal className="text-gray-400 h-6 w-6" /> : 
                 index === 2 ? <Award className="text-amber-600 h-6 w-6" /> : 
                 <span className="text-muted-foreground">#{index + 1}</span>}
              </div>
              <div>
                <p className="font-semibold text-foreground flex items-center gap-2">
                  Citizen-{user.user_id.slice(-5)}
                  {lastUpdatedId === user.user_id && <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />}
                </p>
                <p className="text-xs text-muted-foreground">Streak: {user.current_streak} Days</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl text-primary">{user.legal_iq} XP</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}