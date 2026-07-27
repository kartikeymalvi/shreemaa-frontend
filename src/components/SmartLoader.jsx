// import React, { useState, useEffect } from "react";

// // 🚀 ERP & Business Related Custom Quotes
// const businessQuotes = [
//   "Optimizing supply chain routes...",
//   "Fetching real-time warehouse insights...",
//   "Reconciling GRPOs and Invoices...",
//   "Securing Shree Maa Group's data blocks...",
//   "Crunching numbers for better efficiency...",
//   "Syncing master inventory records...",
//   "Almost there, preparing your workspace...",
// ];

// export default function SmartLoader() {
//   const [quoteIndex, setQuoteIndex] = useState(0);
//   const [fade, setFade] = useState(true);

//   // Quote cycling logic (changes every 2.5 seconds with fade effect)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setFade(false); // Start fade out
//       setTimeout(() => {
//         setQuoteIndex((prev) => (prev + 1) % businessQuotes.length);
//         setFade(true); // Fade back in with new quote
//       }, 300); // 300ms transition gap
//     }, 2500); // Change quote every 2.5 seconds

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] p-8 bg-white/40 backdrop-blur-sm rounded-2xl">
//       {/* 📦 Smooth Animated Box/Logistics Icon */}
//       <div className="relative flex items-center justify-center w-20 h-20 mb-6">
//         {/* Outer rotating dashed ring */}
//         <div className="absolute inset-0 border-4 border-dashed border-blue-200 rounded-full animate-[spin_4s_linear_infinite]"></div>

//         {/* Inner pulsing solid ring */}
//         <div className="absolute inset-2 border-4 border-orange-100 rounded-full animate-ping opacity-75"></div>

//         {/* Core ERP Icon (Box/Database) */}
//         <div className="relative z-10 bg-white p-3 rounded-full shadow-md border border-gray-50 text-[#e67e22] animate-bounce">
//           <svg
//             className="w-8 h-8"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="1.5"
//               d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
//             ></path>
//           </svg>
//         </div>
//       </div>

//       {/* 💬 Dynamic Fading Quotes */}
//       <div className="h-8 flex items-center justify-center">
//         <p
//           className={`text-sm font-bold tracking-wide text-slate-600 transition-opacity duration-300 ease-in-out ${
//             fade ? "opacity-100" : "opacity-0"
//           }`}
//         >
//           {businessQuotes[quoteIndex]}
//         </p>
//       </div>

//       {/* Loading Progress Bar Illusion */}
//       <div className="w-48 h-1.5 mt-5 bg-gray-100 rounded-full overflow-hidden">
//         <div className="h-full bg-gradient-to-r from-[#e67e22] to-blue-500 rounded-full animate-[shimmer_1.5s_infinite] w-[40%] shadow-sm"></div>
//       </div>

//       <style>{`
//         @keyframes shimmer {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(300%); }
//         }
//       `}</style>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
// 🔥 Apna naya loader import kar lijiye
import myLoaderGif from "../assets/loader-2.gif";

const businessQuotes = [
  "Hold on, fetching real-time warehouse insights...",
  "Reconciling GRPOs and Invoices...",
  "Securing Shree Maa Group's data blocks...",
  "Almost there, preparing your workspace...",
];

export default function SmartLoader() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % businessQuotes.length);
        setFade(true);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full flex-1 py-10">
      {/* 🔮 UNIVERSAL BLEND WRAPPER */}
      <div className="relative flex items-center justify-center mb-2">
        {/* 🔥 Container ka size bada kiya (w-[300px] h-[300px]) aur scale-[1.4] se zoom kiya 🔥 */}
        <div className="relative w-[250px] h-[250px] flex items-center justify-center">
          <img
            src={myLoaderGif}
            alt="Loading Animation"
            className="w-full h-full object-contain mix-blend-multiply scale-[2.5]"
          />
        </div>
      </div>

      {/* 💬 Dynamic Fading Quotes */}
      <div className="h-6 flex items-center justify-center">
        <p
          className={`text-[13px] font-bold tracking-wide text-slate-500 transition-opacity duration-300 ease-in-out ${fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
        >
          {businessQuotes[quoteIndex]}
        </p>
      </div>
    </div>
  );
}