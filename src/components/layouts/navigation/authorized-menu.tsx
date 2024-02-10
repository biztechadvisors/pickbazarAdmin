import cn from 'classnames';
import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Avatar from '@/components/common/avatar';
import Link from '@/components/ui/link';
import { siteSettings } from '@/settings/site.settings';
import { useTranslation } from 'next-i18next';
import { useMeQuery } from '@/data/user';
import ToggleSwitch from './ToggleSwitch';
import { useAtom } from 'jotai';
import { toggleAtom } from '../../../utils/atoms';

export default function AuthorizedMenu() {
  const { data } = useMeQuery();
  const { t } = useTranslation('common');

  console.log('data', data);

  const [isChecked, setIsChecked] = useAtom(toggleAtom);

  const handleToggle = () => {
    setIsChecked((prevIsChecked) => !prevIsChecked);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center focus:outline-none">
        <Avatar
          src={
            data?.profile?.avatar?.thumbnail ??
            siteSettings?.avatar?.placeholder
          }
          alt="avatar"
        />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          as="ul"
          className="absolute mt-1 w-48 rounded bg-white shadow-md end-0 origin-top-end focus:outline-none"
        >
          <Menu.Item key={data?.email}>
            <li
              className="flex w-full flex-col space-y-1 rounded-t
             bg-[#00b791] px-4 py-3 text-sm text-white"
            >
              <span className="font-semibold capitalize">{data?.name}</span>
              <span className="text-xs">{data?.email}</span>
            </li>
          </Menu.Item>

          <li className="pl-3">
            {data?.dealer?.id && (
              <ToggleSwitch isChecked={isChecked} handleToggle={handleToggle} />
            )}
          </li>

          {siteSettings.authorizedLinks.map(({ href, labelTransKey }) => (
            <Menu.Item key={`${href}${labelTransKey}`}>
              {({ active }) => (
                <li className="cursor-pointer border-b border-gray-100 last:border-0">
                  <Link
                    href={href}
                    className={cn(
                      'block px-4 py-3 text-sm font-semibold capitalize transition duration-200 hover:text-accent',
                      active ? 'text-accent' : 'text-heading'
                    )}
                  >
                    {t(labelTransKey)}
                  </Link>
                </li>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
