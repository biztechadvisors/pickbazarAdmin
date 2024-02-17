// import Image from 'next/image';
// import Link from '@/components/ui/link';
// import cn from 'classnames';
// import { siteSettings } from '@/settings/site.settings';
// import { useSettings } from '@/contexts/settings.context';

// const Logo: React.FC<React.AnchorHTMLAttributes<{}>> = ({
//   className,
//   ...props
// }) => {
//   const { logo, siteTitle } = useSettings();
//   return (
//     <Link
//       href={siteSettings.logo.href}
//       className={cn('inline-flex', className)}
//       {...props}
//     >
//       <span
//         className="relative overflow-hidden"
//         style={{
//           width: siteSettings.logo.width,
//           height: siteSettings.logo.height,
//         }}
//       >
//         <Image
//           src={logo?.original ?? siteSettings.logo.url}
//           alt={siteTitle ?? siteSettings.logo.alt}
//           fill
//           sizes="(max-width: 768px) 100vw"
//           className="object-contain"
//           loading="eager"
//         />
//       </span>
//     </Link>
//   );
// };

// export default Logo;

import cn from 'classnames';
import Link from '@/components/ui/link';
import { logoPlaceholder } from '@/lib/placeholders';
import { useSettings } from '@/framework/rest/settings';
import Image from 'next/image';

const Logo: React.FC<React.AnchorHTMLAttributes<{}>> = ({
  className,
  ...props
}) => {
  const {
    settings: { logo, siteTitle },
  }: any = useSettings();
  return (
    <Link href='/' className={cn('inline-flex', className)} {...props}>
      <span className="relative h-10 w-32 overflow-hidden md:w-40">
        <Image
          src={logo?.original ?? logoPlaceholder}
          alt={siteTitle || 'PickBazar Logo'}
          fill
          sizes="(max-width: 768px) 100vw"
          loading="eager"
          className="object-contain"
        />
      </span>
    </Link>
  );
};

export default Logo;

