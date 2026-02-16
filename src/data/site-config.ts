import avatar from '../assets/images/MillonariosLogo.jpg';
import hero from '../assets/images/VideoPresentacionBases.mp4';
import type { SiteConfig } from '../types';

const siteConfig: SiteConfig = {
    website: 'https://example.com',
    avatar: {
        src: avatar,
        alt: 'Avatar David Millán'
    },
    title: 'David Felipe Millán Castañeda',
    subtitle: 'Estudiante de Ingeniería de Sistemas',
    description: 'Perfil básico.',
    image: {
        src: '/dante-preview.jpg',
        alt: 'Avatar David Millán'
    },
    headerNavLinks: [
        {
            text: 'Inicio',
            href: '/'
        },
        {
            text: 'Evidencias',
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
    projectsPerPage: 4
};

export default siteConfig;
