import {
  UserGroupIcon,
  MapIcon,
  ListBulletIcon,
  EnvelopeIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  PhotoIcon,
  StarIcon,
  ClipboardDocumentIcon,
  PhoneArrowUpRightIcon,
  DocumentTextIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const SidebarConfig = [
  {
    name: 'Booking',
    icon: <DocumentTextIcon className='h-6 w-6' />,
    href: '/',
  },
  {
    name: 'Set Menu',
    icon: <MapIcon className='h-6 w-6' />,
    href: '/menu-list',
  },
  {
    name: 'Ala Cart',
    icon: <DocumentTextIcon className='h-6 w-6' />,
    href: '/alacarte-list',
  },
  {
    name: 'Party Bookings',
    icon: <CalendarIcon className='h-6 w-6' />,
    href: '/party-list',
  },
  {
    name: 'Table List ',
    icon: <ListBulletIcon className='h-6 w-6' />,
    href: '/room-list',
  },
  // {
  //   name: 'Table Order',
  //   icon: <UserGroupIcon className='h-6 w-6' />,
  //   href: '/employees',
  // },

  {
    name: 'Contact Form',
    icon: <EnvelopeIcon className='h-6 w-6' />,
    href: '/contact-form',
  },

  // {
  //   name: 'User Info',
  //   icon: <UserCircleIcon className='h-6 w-6' />,
  //   href: '/user-list',
  // },

  {
    name: 'Event List',
    icon: <StarIcon className='h-6 w-6' />,
    href: '/event-list',
  },
  {
    name: 'Upcoming Event List',
    icon: <CalendarDaysIcon className='h-6 w-6' />,
    href: '/upcoming-event',
  },
  {
    name: 'Event Enquiry List',
    icon: <PhoneArrowUpRightIcon className='h-6 w-6' />,
    href: '/event-enquiry',
  },
  {
    name: 'Gallery List',
    icon: <PhotoIcon className='h-6 w-6' />,
    href: '/gallery-list',
  },
  {
    name: 'Testimonial List',
    icon: <UserGroupIcon className='h-6 w-6' />,
    href: '/testimonial-list',
  },
  {
    name: 'CMS List',
    icon: <ClipboardDocumentIcon className='h-6 w-6' />,
    href: '/cms-list',
  },
];

export default SidebarConfig;
