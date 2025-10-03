import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteBlogMutation } from '@/data/blog';

const BlogDeleteView = () => {
  const { mutate: deleteBlogByID, isLoading: loading } =
  useDeleteBlogMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  async function handleDelete() {
    deleteBlogByID({
      id: data,
    });
    closeModal();
  }


  console.log("data++++++++++++++++++++++++++++++++++++++++++++++++++++++++", data)

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default BlogDeleteView;
