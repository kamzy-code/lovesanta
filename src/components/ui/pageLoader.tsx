"use client";
import { useEffect, useState } from "react";
import { Center, Container } from "@chakra-ui/react";
import { useColorModeValue } from "./color-mode";

export function PageLoader() {
  const [mounted, setMounted] = useState(false);
  const theme = useColorModeValue("light", "dark");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : true;
  const bgColor = isDark ? "#ffffff" : "#000000";

  return (
    <Container h={"vh"}>
      <Center h="100vh" flexDirection={"column"} gap={4}>
        <div className="relative flex flex-col items-center justify-center gap-4">
          <div className="dots flex flex-row gap-12" aria-hidden="true">
            <div className={`dot h-4 w-4 rounded-full`}></div>
            <div className={`dot h-4 w-4 rounded-full`}></div>
            <div className={`dot h-4 w-4 rounded-full`}></div>
          </div>
        </div>
        <style>{`
         .dots { display: flex; align-items: center; gap: 1rem; }
         .dot {
           width: 1rem; height: 1rem; border-radius: 9999px;
           background-color: ${bgColor};
           animation: dotPulse 900ms infinite ease-in-out;
         }
         .dot:nth-child(1){ animation-delay: 0ms; }
         .dot:nth-child(2){ animation-delay: 150ms; }
         .dot:nth-child(3){ animation-delay: 300ms; }
         @keyframes dotPulse {
           0%, 80%, 100% { transform: scale(1); background-color: ${bgColor}; }
           40% { transform: scale(1.35); } 
         }
       `}</style>
      </Center>
    </Container>
  );
}

// { <div className="h-screen flex items-center justify-center w-full bg-green-400">
//       <div className="relative flex flex-col items-center justify-center gap-4 bg-green-400">
//               <div className="dots flex flex-row gap-4" aria-hidden="true">
//                 <div className="gradient-background dot h-4 w-4 rounded-full"></div>
//                 <div className="gradient-background dot h-4 w-4 rounded-full"></div>
//                 <div className="gradient-background dot h-4 w-4 rounded-full"></div>
//               </div>
//               <p className="px-4 text-center">Loading...</p>
//             </div>
//             <style>{`
//         .dots { display: flex; align-items: center; }
//         .dot {
//           width: 1rem; height: 1rem; border-radius: 9999px;
//           background-color: #4b5563; /* tailwind bg-gray-600 */
//           animation: dotPulse 900ms infinite ease-in-out;
//         }
//         .dot:nth-child(1){ animation-delay: 0ms; }
//         .dot:nth-child(2){ animation-delay: 150ms; }
//         .dot:nth-child(3){ animation-delay: 300ms; }
//         @keyframes dotPulse {
//           0%, 80%, 100% { transform: scale(1); background-color: #4b5563; }
//           40% { transform: scale(1.35); background-color: #01516E; }
//         }
//       `}</style>
//     </div> }
