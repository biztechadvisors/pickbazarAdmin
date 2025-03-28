
import { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import { ClipboardIcon } from '@/components/icons/clipboard';
import { PayPalIcon } from '@/components/icons/payment-gateways/paypal';
import { RazorPayIcon } from '@/components/icons/payment-gateways/razorpay';
import { StripeIcon } from '@/components/icons/payment-gateways/stripe';
import Badge from '@/components/ui/badge/badge';

interface WebHookURLProps {
  gateway: GatewayType;
}

type GatewayType = {
  name: string;
  title: string;
  options: {
    client_id: string;
    client_secret: string;
    url: string;
  }
};

interface WebHookURLProps {
  gateway: GatewayType;
  onChange?: (updatedGateway: GatewayType) => void; // Make it optional
}

const WebHookURL = ({ gateway, onChange }: WebHookURLProps) => {
  const [_, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setCopied] = useState(false);

  const handleChange = (field: keyof typeof gateway.options, value: string) => {
    const updatedGateway = {
      ...gateway,
      options: {
        ...gateway.options,
        [field]: value
      }
    };
    // Only call onChange if it exists
    onChange?.(updatedGateway);
  };

  const icon: Record<string, JSX.Element> = {
    stripe: <StripeIcon className="h-5 w-auto" />,
    paypal: <PayPalIcon className="h-5 w-auto" />,
    razorpay: <RazorPayIcon className="h-5 w-auto" />,
  };

  useEffect(() => {
    const timer = setTimeout(() => setCopied(false), 5000);
    return () => clearTimeout(timer);
  }, [isCopied]);

  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-md">
      <div className="flex items-center gap-3 pb-4">
        {icon[gateway.name]}
        <h3 className="text-lg font-semibold">{gateway.title}</h3>
      </div>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Field</th>
            <th className="border border-gray-300 p-2 text-left">Value</th>
          </tr>
        </thead>
        <tbody>
          {/* Webhook URL */}
          <tr>
            <td className="border border-gray-300 p-2">Webhook URL</td>
            <td className="border border-gray-300 p-2 flex items-center gap-2">
              <input
                type="text"
                value={gateway.options.url}
                onChange={(e) => handleChange('url', e.target.value)}
                className="w-full px-2 py-1 border rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  copyToClipboard(gateway.options.url);
                  setCopied(true);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                <ClipboardIcon />
              </button>
              {isCopied && <Badge text="Copied!" className="ml-2" />}
            </td>
          </tr>

          {/* Client ID */}
          <tr>
            <td className="border border-gray-300 p-2">Client ID</td>
            <td className="border border-gray-300 p-2">
              <input
                type="text"
                value={gateway.options.client_id}
                onChange={(e) => handleChange('client_id', e.target.value)}
                className="w-full px-2 py-1 border rounded-md"
              />
            </td>
          </tr>

          {/* Client Secret */}
          <tr>
            <td className="border border-gray-300 p-2">Client Secret</td>
            <td className="border border-gray-300 p-2">
              <input
                type="text"
                value={gateway.options.client_secret}
                onChange={(e) => handleChange('client_secret', e.target.value)}
                className="w-full px-2 py-1 border rounded-md"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WebHookURL;

