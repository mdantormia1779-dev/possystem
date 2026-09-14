"use client";

import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';

interface CalculatorPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalculatorPopup({ isOpen, onClose }: CalculatorPopupProps) {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [clearOnNext, setClearOnNext] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (clearOnNext || display === '0') {
      setDisplay(digit);
      setClearOnNext(false);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleOp = (op: string) => {
    setEquation(`${display} ${op} `);
    setClearOnNext(true);
  };

  const handleEqual = () => {
    try {
      const fullExpr = equation + display;
      const sanitized = fullExpr.replace(/x/g, '*').replace(/÷/g, '/');
      // Simple safe math evaluator
      const result = Function(`'use strict'; return (${sanitized})`)();
      setDisplay(String(Number(result.toFixed(4))));
      setEquation('');
      setClearOnNext(true);
    } catch {
      setDisplay('Error');
      setClearOnNext(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setClearOnNext(false);
  };

  const handleClearEntry = () => {
    setDisplay('0');
  };

  const handlePercent = () => {
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 sm:pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in select-none">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Calculator Window matching Screenshot 4 */}
      <div className="relative w-72 bg-[#120e34] border border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-10 flex flex-col text-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between bg-[#0c0827]/90">
          <span className="font-bold text-xs text-slate-200">Calculator</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Display Screen */}
        <div className="p-3 bg-[#08051e] border-b border-white/10">
          <div className="text-[10px] text-slate-500 h-4 text-right overflow-hidden font-mono">
            {equation}
          </div>
          <div className="text-xl font-bold text-white text-right font-mono tracking-wider overflow-x-auto">
            {display}
          </div>
        </div>

        {/* Keypad matching Screenshot 4 layout */}
        <div className="p-3 grid grid-cols-4 gap-2 text-xs font-bold">
          {/* Row 1: AC (red), CE (orange), %, ÷ */}
          <button
            type="button"
            onClick={handleClear}
            className="py-2.5 rounded-xl bg-red-800 hover:bg-red-700 text-white shadow-md active:scale-95 transition-all"
          >
            AC
          </button>
          <button
            type="button"
            onClick={handleClearEntry}
            className="py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-md active:scale-95 transition-all"
          >
            CE
          </button>
          <button
            type="button"
            onClick={handlePercent}
            className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 active:scale-95 transition-all"
          >
            %
          </button>
          <button
            type="button"
            onClick={() => handleOp('÷')}
            className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/10 active:scale-95 transition-all text-sm"
          >
            ÷
          </button>

          {/* Row 2: 7, 8, 9, x */}
          <button
            type="button"
            onClick={() => handleDigit('7')}
            className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white active:scale-95 transition-all"
          >
            7
          </button>
          <button
            type="button"
            onClick={() => handleDigit('8')}
            className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white active:scale-95 transition-all"
          >
            8
          </button>
          <button
            type="button"
            onClick={() => handleDigit('9')}
            className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white active:scale-95 transition-all"
          >
            9
          </button>
          <button
            type="button"
            onClick={() => handleOp('x')}
            className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/10 active:scale-95 transition-all"
          >
            x
          </button>

          {/* Row 3: 4, 5, 6, - */}
          <button
            type="button"
            onClick={() => handleDigit('4')}
            className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white active:scale-95 transition-all"
          >
            4
          </button>
          <button
            type="button"
            onClick={() => handleDigit('5')}
            className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white active:scale-95 transition-all"
          >
            5
          </button>
          <button
            type="button"
            onClick={() => handleDigit('6')}
            className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white active:scale-95 transition-all"
          >
            6
          </button>
          <button
            type="button"
            onClick={() => handleOp('-')}
            className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/10 active:scale-95 transition-all text-sm"
          >
            -
          </button>

          {/* Row 4: 1, 2, 3, + */}
          <button
            type="button"
            onClick={() => handleDigit('1')}
            className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white active:scale-95 transition-all"
          >
            1
          </button>
          <button
            type="button"
            onClick={() => handleDigit('2')}
            className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white active:scale-95 transition-all"
          >
            2
          </button>
          <button
            type="button"
            onClick={() => handleDigit('3')}
            className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white active:scale-95 transition-all"
          >
            3
          </button>
          <button
            type="button"
            onClick={() => handleOp('+')}
            className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/10 active:scale-95 transition-all"
          >
            +
          </button>

          {/* Row 5: 0 (span 2), ., = (green) */}
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="py-2.5 col-span-2 rounded-xl bg-white/10 hover:bg-white/15 text-white active:scale-95 transition-all"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => handleDigit('.')}
            className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white active:scale-95 transition-all"
          >
            .
          </button>
          <button
            type="button"
            onClick={handleEqual}
            className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg shadow-emerald-600/30 active:scale-95 transition-all text-base"
          >
            =
          </button>
        </div>

      </div>
    </div>
  );
}
