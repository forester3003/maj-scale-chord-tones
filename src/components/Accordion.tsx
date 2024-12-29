// components/Accordion.tsx
import React, { useState } from 'react';
import { AiOutlineUp, AiOutlineDown } from 'react-icons/ai'; // 上向き矢印アイコンをインポート

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-4 border rounded shadow-md">
      <button
        className="w-full p-4 text-left font-bold flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
        onClick={toggleAccordion}
      >
        {title}
        <span className="ml-2">
          {isOpen ? <AiOutlineUp /> : <AiOutlineDown />} {/* アイコンの表示を修正 */}
        </span>
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
};

export default Accordion;