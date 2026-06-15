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
    <footer className="py-20 px-6 border-t border-gray-200 bg-gray-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute bottom-[-20%] left-[-20%] w-[50%] h-[50%] bg-pink-200/30 rounded-full blur-3xl mix-blend-multiply"></div>
      </div>
      <div className="max-w-[1300px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-6 gap-16 mb-20">
          
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6] flex items-center justify-center border-2 border-[#333333] shadow-[2px_2px_0px_#333333] transform -rotate-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-balsamiq text-2xl font-black tracking-tight text-gray-800">FormForge</span>
            </Link>
            <p className="text-lg text-gray-600 font-sans leading-relaxed mb-8 max-w-sm">
              Stop building boring forms. Combine drag-and-drop simplicity with AI generation to create stunning experiences.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Mail].map((Icon, i) => (
                <motion.a key={i} href="#" whileHover={{ y: -4, scale: 1.1 }}
                  className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all shadow-sm">
                  <Icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-10">
            {Object.entries(links).map(([title, items]) => (
              <div key={title}>
                <h4 className="font-sans text-sm font-bold text-gray-800 mb-6 tracking-tight uppercase">{title}</h4>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm font-sans text-gray-600 hover:text-gray-900 transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-sans text-gray-500 tracking-wide">© 2026 FormForge. Crafted with care.</p>
          <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 bg-white shadow-sm rounded-lg">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-white"></span>
            </span>
            <span className="font-sans font-medium text-sm text-gray-600">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
