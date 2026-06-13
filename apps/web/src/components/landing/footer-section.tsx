"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Github, Twitter, Mail } from "lucide-react";

const links = {
  Product: ["Features", "Builder", "Themes", "AI Tools", "Pricing"],
  Community: ["Marketplace", "Templates", "Challenges", "Discord"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy", "Terms", "Cookie Policy"],
};

export function FooterSection() {
  return (
    <footer className="py-32 px-6 border-t-2 border-dashed border-gray-200 bg-[#FCFBF8] relative overflow-hidden">
      <div className="max-w-[1300px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-6 gap-16 mb-20">
          
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6] flex items-center justify-center border-2 border-[#333333] shadow-[2px_2px_0px_#333333] transform -rotate-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-balsamiq text-4xl font-black tracking-tight text-[#333333]">FormForge</span>
            </Link>
            <p className="text-lg text-gray-500 font-comic font-bold mb-8 max-w-sm leading-relaxed">
              Stop building boring forms. Combine drag-and-drop simplicity with AI generation to create stunning experiences.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Mail].map((Icon, i) => (
                <motion.a key={i} href="#" whileHover={{ y: -4, scale: 1.1 }}
                  className="w-12 h-12 rounded-2xl bg-white border-2 border-[#333333] flex items-center justify-center text-gray-500 hover:text-[#8B5CF6] hover:bg-[#E9D5FF] transition-all shadow-[2px_2px_0px_#333333]">
                  <Icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-10">
            {Object.entries(links).map(([title, items]) => (
              <div key={title}>
                <h4 className="font-balsamiq text-2xl font-bold text-[#333333] mb-6 tracking-tight">{title}</h4>
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item}>
                      <a href="#" className="text-base font-comic font-bold text-gray-500 hover:text-[#8B5CF6] transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t-2 border-dashed border-gray-200 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-base font-comic font-bold text-gray-500 tracking-wide">© 2026 FormForge. Crafted with ✨</p>
          <div className="flex items-center gap-3">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-[#333333]"></span>
            </span>
            <span className="font-comic text-xl font-bold text-gray-500">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
