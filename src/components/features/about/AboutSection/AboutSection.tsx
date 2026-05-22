import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import styles from './AboutSection.module.css';

const values = [
  {
    icon: '✦',
    name: 'Autenticidad',
    text: 'Trabajamos exclusivamente con fragancias originales de marcas reconocidas en la industria árabe y de diseñador.',
  },
  {
    icon: '◆',
    name: 'Precio justo',
    text: 'Buscamos hacer accesibles perfumes de calidad sin sacrificar la experiencia olfativa.',
  },
  {
    icon: '❋',
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
      <motion.span className={styles.badge} variants={fadeUp} transition={{ duration: 0.35 }}>
        Perfumería Árabe
      </motion.span>

      <motion.h1 className={styles.title} variants={fadeUp} transition={{ duration: 0.35, delay: 0.05 }}>
        Acerca de Koda Fragancias
      </motion.h1>

      <motion.p className={styles.lead} variants={fadeUp} transition={{ duration: 0.35, delay: 0.1 }}>
        Koda Fragancias nació de la pasión por los perfumes árabes y la búsqueda de fragancias de
        alta calidad a precios accesibles. Somos un emprendimiento argentino que selecciona y ofrece
        lo mejor de la perfumería árabe y de diseñador, con atención personalizada por WhatsApp.
      </motion.p>

      <motion.div className={styles.values} variants={fadeUp} transition={{ duration: 0.35, delay: 0.15 }}>
        {values.map((v) => (
          <div className={styles.value} key={v.name}>
            <div className={styles.valueIcon}>{v.icon}</div>
            <p className={styles.valueName}>{v.name}</p>
            <p className={styles.valueText}>{v.text}</p>
          </div>
        ))}
      </motion.div>

      <motion.div className={styles.brandsSection} variants={fadeUp} transition={{ duration: 0.35, delay: 0.2 }}>
        <p className={styles.brandsTitle}>Marcas disponibles</p>
        <div className={styles.brands}>
          {brands.map((b) => (
            <span key={b} className={styles.brandChip}>{b}</span>
          ))}
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
