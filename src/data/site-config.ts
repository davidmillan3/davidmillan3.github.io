import avatar from '../assets/images/avatar.jpg';
import hero from '../assets/images/hero.jpg';
import type { SiteConfig } from '../types';

const siteConfig: SiteConfig = {
    website: 'https://example.com',
    avatar: {
        src: avatar,
        alt: 'Ethan Donovan'
    },
    title: 'David Felipe Millán Castañeda',
    subtitle: 'Estudiante de Ingeniería de Sistemas',
    description: 'Astro.js and Tailwind CSS theme for blog and portfolio by justgoodui.com',
    image: {
        src: '/dante-preview.jpg',
        alt: 'Dante - Astro.js and Tailwind CSS theme'
    },
    headerNavLinks: [
        {
            text: 'Inicio',
            href: '/'
        },
        {
            text: 'Proyectos',
            href: '/projects'
        },
       {
            text: 'Github',
            href: 'https://github.com/davidmillan3'
        }
    ],
    socialLinks: [
        {
            text: 'Instagram',
            href: 'https://www.instagram.com/davidmillan034/?hl=es'
        },
        {
            text: 'X/Twitter',
            href: 'https://x.com/DavidMillaan034'
        }
    ],
    hero: {
        title: 'Presentación',
        text: "Video sobre mí.",
        image: {
            src: hero,
            alt: 'Mi video de presentación'
        },
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
