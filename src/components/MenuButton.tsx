import React from "react";

interface IMenuButtonProps {
  title: string;
  onClick: () => void;
}

const MenuButton = ({ title, onClick }: IMenuButtonProps): JSX.Element => (
  <button
    className="relative inline-flex w-64 items-center justify-start inline-block px-5 py-3 overflow-hidden font-bold rounded-full group"
    onClick={onClick}
  >
    <span className="absolute top-0 left-0 w-72 h-72 -mt-1 transition-all duration-300 ease-in-out rotate-45 -translate-x-96 -translate-y-24 bg-white opacity-100 group-hover:-translate-x-8"></span>

    <span className="relative w-full text-center text-white transition-colors duration-200 ease-in-out group-hover:text-gray-900">
      {title}
    </span>
    <span className="absolute inset-0 border-2 border-white rounded-full"></span>
  </button>
);

export default MenuButton;
