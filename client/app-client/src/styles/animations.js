import { motion } from 'framer-motion';

export const variants = {
   hidden: (i) => ({
      opacity: 0,
      y: i * 25 - 100,
   }),
   visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
         delay: i * 0.04, //0.1,
         type: 'spring',
      },
   }),
   hide: { opacity: 0 },
};
