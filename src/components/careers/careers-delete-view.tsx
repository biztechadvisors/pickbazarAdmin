import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteCareerMutation } from '@/data/careers'; // Assuming you have a mutation for deleting careers

const CareerDeleteView = () => {
  const { mutate: deleteCareer, isLoading: loading } =
    useDeleteCareerMutation(); // Use the delete mutation for careers

  const { data } = useModalState(); // This retrieves the id or data related to the career being deleted
  const { closeModal } = useModalAction();
  console.log('useModalState = ', data);

  function handleDelete() {
    console.log('handle Delete = ', data);
    deleteCareer({ id: data }); // Pass the id of the career to be deleted
    closeModal();
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading} // Show loading state if the delete is in progress
    />
  );
};

export default CareerDeleteView;
