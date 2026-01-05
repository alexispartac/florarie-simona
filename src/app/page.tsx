'use client';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Button from "../components/ui/Button";
import Particles from "../components/ui/animations/Particles";
import type { Variants } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';


// Dynamically import TextGlowEffect with SSR disabled
const TextGlowEffect = dynamic(
  () => import('../components/ui/animations/TextGlowEffect'),
  { ssr: false }
);

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useLanguage();
  
  return (
    <div className="relative min-h-screen w-full">
      <Particles color={theme.theme} />
      <div className="relative z-10 h-screen w-full flex items-center justify-center">
        <motion.section 
          className="text-center w-full max-w-4xl px-4"
          initial="hidden"
          animate="show"
          variants={container}
        >
          <motion.div 
            className="text-4xl md:text-5xl font-bold mb-6" 
            variants={item}
          >
            <TextGlowEffect 
              text={t('homepage.heroTitle')}
              className="text-4xl md:text-6xl font-bold text-primary"
            />
            <br />
            <TextGlowEffect 
              text={t('homepage.heroSubtitle')}
              className="text-4xl md:text-6xl !important-text-[var(--color-primary)] font-bold"
            />
          </motion.div>

          <motion.p className="text-md md:text-2xl mb-8 text-gray-500" variants={item}>
            {t('homepage.banner')}
          </motion.p>

          <motion.div variants={item}>
            <Button 
              variant="primary" 
              withHeartbeat 
              size="lg" 
              className='cursor-pointer'
              onClick={() => router.push('/shop')}
            >{t('homepage.shopNow')}</Button>
          </motion.div>

          <motion.div variants={item}>
            <Button 
              variant="link" 
              size="lg" 
              className='cursor-pointer mt-4'
              onClick={() => router.push('/collections')}
            >{t('homepage.exploreColl')}</Button>
          </motion.div>
          
          <motion.div 
            className="mt-12 p-4 bg-white/10 backdrop-blur-sm rounded-lg inline-block relative"
            variants={item}
          >
            <div className="text-center text-sm md:text-md text-gray-500 flex items-center gap-2">
              <span>{t('homepage.themeSwitch')}</span>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}