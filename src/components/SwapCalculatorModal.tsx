import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

const SwapCalculatorModal: React.FC = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>Open Swap Calculator</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-[500px]">
          <Dialog.Title className="text-xl font-bold mb-4">Swap Calculator</Dialog.Title>
          <Dialog.Description className="mb-4 text-gray-700">
            Calculate the potential swap value.
          </Dialog.Description>
          <div>
            {/* Swap Calculator content will go here */}
            <p>This is the content of the modal.</p>
          </div>
          <Dialog.Close asChild>
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SwapCalculatorModal;
