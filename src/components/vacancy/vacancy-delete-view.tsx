import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteVacancyMutation } from '@/data/vacancies'; // Make sure this hook is defined for deleting vacancies

const VacancyDeleteView = () => {
  const { data } = useModalState(); // Get the vacancy data from the modal state
  const { closeModal } = useModalAction(); // Close the modal action

  const { mutate: deleteVacancy, isLoading: loading } =
    useDeleteVacancyMutation(); // Use the delete mutation hook
  console.log('useModalState = ', data);

  function handleDelete() {
    console.log('handle Delete = ', data);
    deleteVacancy({ id: data });
    closeModal(); // Close the modal after deletion
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default VacancyDeleteView;
