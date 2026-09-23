import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { HiOutlineShieldCheck, HiOutlineTag, HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { getBrandLogo } from '../../../../assets/logos';
import styles from './AboutSection.module.css';

const values = [
  {
    icon: HiOutlineShieldCheck,
    name: 'Autenticidad',
    text: 'Trabajamos exclusivamente con fragancias originales de marcas reconocidas en la industria árabe y de diseñador.',
  },
  {
    icon: HiOutlineTag,
    name: 'Precio justo',
    text: 'Buscamos hacer accesibles perfumes de calidad sin sacrificar la experiencia olfativa.',
  },
  {
    icon: HiOutlineChatBubbleLeftRight,
    name: 'Atención personalizada',
    text: 'Cada consulta es única. Te ayudamos a elegir según tu estilo, ocasión y presupuesto.',
  },
];

const brands = ['Lattafa', 'Armaf', 'Rasasi', 'Maison Alhambra', 'Afnan', 'Al Haramain', 'Bharara', 'French Avenue', 'Versace', 'Sabrina Carpenter'];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function AboutSection() {
  return (
    <motion.section
      className={styles.section}
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.1 }}
    >
      {/* <motion.span className={styles.badge} variants={fadeUp} transition={{ duration: 0.35 }}>
        Perfumería Árabe
      </motion.span> */}

      <motion.h1 className={styles.title} variants={fadeUp} transition={{ duration: 0.35, delay: 0.05 }}>
        Acerca de <span>Koda Fragancias</span>
      </motion.h1>

      <motion.p className={styles.lead} variants={fadeUp} transition={{ duration: 0.35, delay: 0.1 }}>
        Soy Eze, la persona detrás de Koda Fragancias.
        En nuestra web vas a encontrar perfumes árabes y de diseñador, con información para ayudarte a elegir. <br /> Y si entre tantas notas y nombres no sabés por dónde empezar, podés escribirme: contame cuáles te gustan, para qué ocasión lo buscás y qué presupuesto tenés. Desde ahí vemos las opciones juntos.<br /><br />
        Gracias por acompañar este emprendimiento y confiar en Koda para elegir algo tan personal como tu perfume.
      </motion.p>

      <motion.div className={styles.values} variants={fadeUp} transition={{ duration: 0.35, delay: 0.15 }}>
        {values.map((v) => (
          <div className={styles.value} key={v.name}>
            <div className={styles.valueIcon}>
              <v.icon />
            </div>
            <p className={styles.valueName}>{v.name}</p>
            <p className={styles.valueText}>{v.text}</p>
          </div>
        ))}
      </motion.div>

      <motion.div className={styles.brandsSection} variants={fadeUp} transition={{ duration: 0.35, delay: 0.2 }}>
        <p className={styles.brandsTitle}>Marcas disponibles</p>
        <div className={styles.brands}>
          {brands.map((b) => {
            const logo = getBrandLogo(b);
            return (
              <div key={b} className={styles.brandItem}>
                {logo && <img src={logo} alt={b} className={styles.brandLogo} />}
                {/* <span className={styles.brandName}>{b}</span> */}
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div className={styles.cta} variants={fadeUp} transition={{ duration: 0.35, delay: 0.25 }}>
        <a
          href="https://wa.me/5491156009539?text=Hola%20Koda%20Fragancias!"
          target="_blank"
          rel="noreferrer"
          className={styles.waBtn}
          aria-label="Contactar Koda Fragancias por WhatsApp"
        >
          <MessageCircle size={16} />
          Escribinos por WhatsApp
        </a>
        <a
          href="https://www.instagram.com/kodafragancias/"
          target="_blank"
          rel="noreferrer"
          className={styles.igBtn}
          aria-label="Instagram de Koda Fragancias"
        >
          @kodafragancias
        </a>
      </motion.div>
    </motion.section>
 );
}