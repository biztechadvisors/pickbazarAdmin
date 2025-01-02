import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteGetInspiredMutation } from '@/data/get-inspired'; // Import the mutation for deleting "Get Inspired"

const GetInspiredDeleteView = () => {
  const { mutate: deleteGetInspired, isLoading: loading } =
    useDeleteGetInspiredMutation(); // Use the correct mutation for deleting "Get Inspired"

  const { data } = useModalState(); // Get the data passed to the modal, usually the ID of the item
  const { closeModal } = useModalAction(); // Use modal actions to close the modal

  function handleDelete() {
    deleteGetInspired({ id: data }); // Call the delete mutation with the ID
    closeModal(); // Close the modal after deletion
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading} // Pass loading state to the button
    />
  );
};

export default GetInspiredDeleteView;
