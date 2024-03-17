// import Link from '@/components/ui/link';
// import { getIcon } from '@/utils/get-icon';
// import * as sidebarIcons from '@/components/icons/sidebar';
// import { useUI } from '@/contexts/ui.context';

// const SidebarItem = ({ href, icon, label }: any) => {
//   console.log("label", label)

//   const { closeSidebar } = useUI();
//   return (
//     <Link
//       href={href}
//       className="flex w-full items-center text-base text-body-dark text-start focus:text-accent"
//     >
//       {getIcon({
//         iconList: sidebarIcons,
//         iconName: icon,
//         className: 'w-5 h-5 me-4',
//       })}
//       <span onClick={() => closeSidebar()}>{label}</span>
//     </Link>
//   );
// };

// export default SidebarItem;

import Link from '@/components/ui/link';
import { getIcon } from '@/utils/get-icon';
import * as sidebarIcons from '@/components/icons/sidebar';
import { useUI } from '@/contexts/ui.context';
import Dropdown from './Dropdown';
// Import your Dropdown component here

const SidebarItem = ({ href, icon, label }: any) => {
  const { closeSidebar } = useUI();

  // Check if the label is "Orders" and render the Dropdown component if true
  if (label === 'Orders') {
    return (
      <div className="flex w-full items-center text-base text-body-dark text-start focus:text-accent">
        {getIcon({
          iconList: sidebarIcons,
          iconName: icon,
          className: 'w-5 h-5 me-4',
        })}
        <Dropdown />
      </div>
    );
  }

  // Render the regular sidebar item if the label is not "Orders"
  return (
    <Link
      href={href}
      className="flex w-full items-center text-base text-body-dark text-start focus:text-accent"
    >
      {getIcon({
        iconList: sidebarIcons,
        iconName: icon,
        className: 'w-5 h-5 me-4',
      })}
      <span onClick={() => closeSidebar()}>{label}</span>
    </Link>
  );
};

export default SidebarItem;
