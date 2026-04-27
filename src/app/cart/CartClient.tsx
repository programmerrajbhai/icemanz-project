'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ChevronDown, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CartClient = () => {
    const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();
    const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Header />

            <main className="container mx-auto px-4 pt-40 pb-20">
                <h1 className="text-3xl font-bold text-gray-900 mb-10">My cart</h1>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Cart Items Table */}
                    <div className="flex-1">
                        {cartItems.length === 0 ? (
                            <div className="bg-white p-10 rounded-sm border border-gray-200 text-center">
                                <p className="text-black text-lg mb-6">Your cart is currently empty.</p>
                                <Link href="/walk-in-cooler-freezer">
                                    <button className="bg-primary text-white px-8 text-lg py-3   cursor-pointer  tracking-wider hover:bg-blue-800 transition-colors">
                                        Continue Shopping
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
                                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 text-xs font-semibold  text-black  tracking-wider">
                                    <div className="col-span-7">Product</div>
                                    <div className="col-span-3 text-center">Quantity</div>
                                    <div className="col-span-2 text-right">Total</div>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="grid grid-cols-12 gap-4 p-6 items-center">
                                            {/* Product Info */}
                                            <div className="col-span-7 flex gap-6 items-center">
                                                <div className="relative w-24 h-24 shrink-0  rounded-sm overflow-hidden">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-contain p-2"
                                                        sizes="96px"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.brand}</span>
                                                    <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{item.name}</h3>
                                                    <p className="text-sm font-bold text-[#004a99] mt-1">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                                </div>
                                            </div>

                                            {/* Quantity */}
                                            <div className="col-span-3 flex flex-col items-center gap-2">
                                                <div className="flex items-center border border-gray-300 rounded-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="w-10 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-xs font-semibold text-gray-500 hover:text-red-600 underline underline-offset-2 cursor-pointer"
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            {/* Total */}
                                            <div className="col-span-2 text-right">
                                                <span className="text-sm font-bold text-gray-900">
                                                    ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:w-96">
                        <div className="bg-white p-8 rounded-sm border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-lg font-bold text-gray-900">Subtotal</span>
                                <span className="text-xl font-bold text-gray-900">
                                    ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            {/* Order Instructions Accordion */}
                            <div className="border-t border-gray-100 py-4">
                                <button
                                    onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
                                    className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer"
                                >
                                    Order instructions
                                    <ChevronDown size={18} className={`transition-transform duration-300 ${isInstructionsOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isInstructionsOpen && (
                                    <textarea
                                        className="w-full mt-4 p-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-primary min-h-[100px]"
                                        placeholder="Add special instructions for your order..."
                                    ></textarea>
                                )}
                            </div>

                            <p className="text-xs text-gray-500 mt-6 mb-8">
                                Taxes and <span className="text-blue-500 underline cursor-pointer">shipping</span> calculated at checkout
                            </p>

                            <Link href="/checkout">
                                <button className="w-full bg-primary hover:bg-blue-800 text-white py-4 rounded-sm font-bold text-base cursor-pointer transition-colors shadow-sm active:scale-[0.98]">
                                    Checkout
                                </button>
                            </Link>
                        </div>


                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CartClient;
