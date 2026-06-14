"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { X, Download, Copy, ExternalLink, Link2, Settings2 } from "lucide-react";
import { toast } from "sonner";

interface QRShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export function QRShareModal({ isOpen, onClose, url }: QRShareModalProps) {
  const [fgColor, setFgColor] = useState("#333333");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [includeMargin, setIncludeMargin] = useState(false);
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("Q");
  const qrRef = useRef<SVGSVGElement>(null);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      
      const downloadLink = document.createElement("a");
      downloadLink.download = "formforge-qr.png";
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl border-4 border-[#333333] shadow-[8px_8px_0px_#333333] max-w-2xl w-full flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b-2 border-[#333333] flex items-center justify-between bg-gray-50">
              <div>
                <h2 className="text-2xl font-bold font-balsamiq text-[#333333]">Share Form</h2>
                <p className="text-gray-500 font-comic text-sm mt-1">Scan the QR code or copy the link to share.</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-xl transition-colors border-2 border-transparent hover:border-[#333333]"
              >
                <X className="w-6 h-6 text-[#333333]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col md:flex-row gap-8 bg-[#FCFBF8]">
              {/* Left: QR Display */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="bg-white p-4 rounded-2xl border-4 border-[#333333] shadow-[4px_4px_0px_#333333] mb-6">
                  <QRCodeSVG
                    value={url}
                    size={200}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level={level}
                    includeMargin={includeMargin}
                    ref={qrRef}
                  />
                </div>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-[#8B5CF6] text-white font-bold font-balsamiq rounded-xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#333333] transition-all"
                >
                  <Download className="w-5 h-5" /> Download QR
                </button>
              </div>

              {/* Right: Customization & Link */}
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="font-balsamiq font-bold text-[#333333] mb-3 flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-[#8B5CF6]" /> Customization
                  </h3>
                  
                  <div className="space-y-4 font-comic">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">QR Color</label>
                      <div className="flex gap-2">
                        {["#333333", "#8B5CF6", "#EF4444", "#3B82F6", "#10B981"].map((color) => (
                          <button
                            key={color}
                            onClick={() => setFgColor(color)}
                            className={`w-8 h-8 rounded-full border-2 ${fgColor === color ? 'border-[#333333] scale-110' : 'border-transparent hover:scale-105'} transition-transform shadow-sm`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Background</label>
                      <div className="flex gap-2">
                        {["#FFFFFF", "#F9FAFB", "#FEF3C7", "#E0E7FF", "#D1FAE5"].map((color) => (
                          <button
                            key={color}
                            onClick={() => setBgColor(color)}
                            className={`w-8 h-8 rounded-full border-2 ${bgColor === color ? 'border-[#333333] scale-110' : 'border-gray-200 hover:scale-105'} transition-transform shadow-sm`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Padding</label>
                        <button
                          onClick={() => setIncludeMargin(!includeMargin)}
                          className={`w-full py-2 px-3 rounded-xl border-2 font-bold text-sm transition-all ${includeMargin ? 'bg-[#333333] text-white border-[#333333]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                        >
                          {includeMargin ? "Margin Enabled" : "No Margin"}
                        </button>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Density (Error Level)</label>
                        <div className="flex bg-gray-100 rounded-xl p-1 border-2 border-transparent">
                          {(["L", "M", "Q", "H"] as const).map((l) => (
                            <button
                              key={l}
                              onClick={() => setLevel(l)}
                              className={`flex-1 py-1 text-sm font-bold rounded-lg transition-all ${level === l ? 'bg-white shadow-sm text-[#333333]' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-gray-200">
                  <h3 className="font-balsamiq font-bold text-[#333333] mb-3 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-[#8B5CF6]" /> Direct Link
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={url}
                      className="flex-1 bg-white border-2 border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 font-comic focus:outline-none"
                    />
                    <button
                      onClick={handleCopyUrl}
                      className="p-2.5 bg-gray-100 hover:bg-gray-200 border-2 border-transparent hover:border-[#333333] rounded-xl transition-all"
                      title="Copy Link"
                    >
                      <Copy className="w-4 h-4 text-[#333333]" />
                    </button>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-[#E9D5FF] hover:bg-[#C4B5FD] text-[#8B5CF6] hover:text-[#5B21B6] border-2 border-transparent hover:border-[#5B21B6] rounded-xl transition-all"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
