import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteQnaMutation } from '@/data/qna'; // Make sure this hook is defined for deleting QnA

const QnaDeleteView = () => {
  const { data } = useModalState();
  const { closeModal } = useModalAction();

  const { mutate: deleteQna, isLoading: loading } = useDeleteQnaMutation();

  function handleDelete() {
    deleteQna(data); // Assuming data contains the ID of the QnA to delete
    closeModal();
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default QnaDeleteView;
