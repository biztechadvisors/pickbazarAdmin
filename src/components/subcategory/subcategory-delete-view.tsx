import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteSubCategoryMutation } from '@/data/subcategory';

const SubCategoryDeleteView = () => {
  const { mutate: deleteCategory, isLoading: loading } =
    useDeleteSubCategoryMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteCategory({
      id: data,
    });
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

export default SubCategoryDeleteView;
