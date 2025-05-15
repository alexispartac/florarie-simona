'use client';

import { IconBrandFacebook, IconBrandInstagram, IconBrandTwitter } from "@tabler/icons-react";
import { motion } from "motion/react";


export const Footer = () => {
    return (
        <footer className="bg-[#b756a64f] text-white py-10 mt-20">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-8 md:px-20">

                {/* Newsletter */}
                <div className="my-10 bg-white/20 backdrop-blur-md rounded-lg py-6 px-6 text-center">
                    <h2 className="text-xl font-bold">Înscrie-te la Newsletter!</h2>
                    <p className="text-sm mt-2">Devino membru și primește cele mai bune oferte săptămânale.</p>
                    <div className="mt-4 flex justify-center">
                        <input type="email" placeholder="Adresa ta de email" className="px-4 py-2 rounded-l-lg border-none"/>
                        <button className="bg-[#b756a64f] cursor-pointer text-white px-4 py-2 rounded-r-lg hover:text-pink-200 hover:bg-white">Înscrie</button>
                    </div>
                </div>

                {/* Logo și descriere */}
                <motion.div
                    className="text-center md:text-left"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
                >
                    <h2 className="text-2xl font-bold">Buchetul Simonei</h2>
                    <p className="text-sm mt-2">Povești scrise în petale, emoții transmise prin flori.</p>
                </motion.div>

                {/* Linkuri principale */}
                <motion.div
                    className="flex space-x-6 mt-6 md:mt-0"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
                >
                    <a href="#" className="hover:text-gray-300">Acasă</a>
                    <a href="#" className="hover:text-gray-300">Despre Noi</a>
                    <a href="#" className="hover:text-gray-300">Contact</a>
                </motion.div>

                {/* Social media */}
                <motion.div
                    className="flex space-x-4 mt-6 md:mt-0"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
                >
                    <a href="#" className="hover:text-gray-300"><IconBrandFacebook /></a>
                    <a href="#" className="hover:text-gray-300"><IconBrandInstagram /></a>
                    <a href="#" className="hover:text-gray-300"><IconBrandTwitter /></a>
                </motion.div>

            </div>

            {/* Linkuri suplimentare */}
            <div className="mt-8 text-center text-sm">
                <a href="#" className="hover:text-gray-300 mx-2">Termeni & Condiții</a>
                <a href="#" className="hover:text-gray-300 mx-2">Politica de cookies</a>
                <a href="#" className="hover:text-gray-300 mx-2">GDPR</a>
                <a href="#" className="hover:text-gray-300 mx-2">Blog</a>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-300 mt-6 pt-4 text-center text-sm opacity-80">
                © 2020-2025 Buchetul Simonei. Toate drepturile rezervate.
            </div>
        </footer>
    );
};
