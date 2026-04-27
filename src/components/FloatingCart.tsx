"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface FloatingCartProps {
    isOpen: boolean;
    onClose: () => void;
}

const FloatingCart: React.FC<FloatingCartProps> = ({ isOpen, onClose }) => {
    const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();

    return (
        <div
            className={`absolute right-0 top-full w-[400px] bg-white shadow-lg rounded-sm border border-gray-200 z-50 transition-all duration-300 ease-in-out transform origin-top-right
        ${isOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the cart
        >
            {/* Cart Items */}
            <div className={`overflow-y-auto p-4 space-y-4 custom-scrollbar ${cartItems.length > 2 ? 'max-h-[240px]' : 'max-h-none'}`}>
                {cartItems.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">Your cart is empty.</div>
                ) : (
                    cartItems.map(item => (
                        <div key={item.id} className="flex items-start gap-3 border-b border-gray-100 pb-4 last:border-b-0">
                            <div className="relative w-16 h-16 shrink-0 border border-gray-200 rounded-sm overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-contain p-1"
                                    sizes="64px"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">{item.brand}</p>
                                <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</h3>
                                <p className="text-sm font-semibold text-[#004a99] mt-1">${item.price.toFixed(2)}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center border border-gray-300 rounded-sm">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="w-6 h-6 flex items-center justify-center cursor-pointer text-gray-600 hover:bg-gray-50"
                                        >
                                            <Minus size={12} />
                                        </button>
                                        <span className="px-1 text-xs font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="w-6 h-6 cursor-pointer flex items-center justify-center text-gray-600 hover:bg-gray-50"
                                        >
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-xs cursor-pointer font-semibold text-red-500 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Cart Footer */}
            <div className="p-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-base font-semibold text-gray-800">Subtotal</span>
                    <span className="text-base font-bold text-[#004a99]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex space-x-4 items-center">
                    <Link href="/cart" passHref className='block w-full'>
                        <button
                            onClick={onClose}
                            className="w-full py-2.5 px-4 bg-[#004a99] cursor-pointer text-white font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                            View cart
                        </button>
                    </Link>
                    <Link href="/checkout" passHref className='block w-full'>
                        <button
                            onClick={onClose}
                            className="w-full py-2.5 px-4 bg-[#cc0000] cursor-pointer text-white font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                            Checkout
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FloatingCart;
