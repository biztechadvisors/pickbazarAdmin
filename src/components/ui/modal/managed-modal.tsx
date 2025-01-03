import StoreNoticeDeleteView from '@/components/store-notice/store-notice-delete-view';
import Modal from '@/components/ui/modal/modal';
import dynamic from 'next/dynamic';
import { MODAL_VIEWS, useModalAction, useModalState } from './modal.context';
import PaymentModal from '@/components/payment/payment-modal';
import GetInspiredDeleteView from '@/components/getInspired/getInspired-delete-view';
import QnaDeleteView from '@/components/qna/qna-delete-view';
import ContactDeleteView from '@/components/contacts/contacts-delete-view';
import CareerDeleteView from '@/components/careers/careers-delete-view';
import VacancyDeleteView from '@/components/vacancy/vacancy-delete-view';
const TagDeleteView = dynamic(() => import('@/components/tag/tag-delete-view'));
const TaxDeleteView = dynamic(() => import('@/components/tax/tax-delete-view'));
const BanCustomerView = dynamic(
  () => import('@/components/user/user-ban-view')
);
const UserWalletPointsAddView = dynamic(
  () => import('@/components/user/user-wallet-points-add-view')
);
const MakeAdminView = dynamic(
  () => import('@/components/user/make-admin-view')
);
const ShippingDeleteView = dynamic(
  () => import('@/components/shipping/shipping-delete-view')
);
const CategoryDeleteView = dynamic(
  () => import('@/components/category/category-delete-view')
);
const EventDeleteView = dynamic(
  () => import('@/components/event/event-delete-view')
);
const SubCategoryDeleteView = dynamic(
  () => import('@/components/subcategory/subcategory-delete-view')
);
const CouponDeleteView = dynamic(
  () => import('@/components/coupon/coupon-delete-view')
);

const ProductDeleteView = dynamic(
  () => import('@/components/product/product-delete-view')
);
const TypeDeleteView = dynamic(
  () => import('@/components/group/group-delete-view')
);
const DealerDeleteView = dynamic(
  () => import('@/components/dealerlist/dealer-delete-view')
);
const AttributeDeleteView = dynamic(
  () => import('@/components/attribute/attribute-delete-view')
);

const BlogDeleteView = dynamic(
  () => import('@/components/blog/blog-delete-view')
);

const ApproveShopView = dynamic(
  () => import('@/components/shop/approve-shop-view')
);
const DisApproveShopView = dynamic(
  () => import('@/components/shop/disapprove-shop-view')
);
const RemoveStaffView = dynamic(
  () => import('@/components/shop/staff-delete-view')
);

const ExportImportView = dynamic(
  () => import('@/components/product/import-export-modal')
);
const ModelImportView = dynamic(
  () => import('@/components/product/modal-import')
);
const AttributeExportImport = dynamic(
  () => import('@/components/attribute/attribute-import-export')
);

const UpdateRefundConfirmationView = dynamic(
  () => import('@/components/refund/refund-confirmation-view')
);
const RefundImageModal = dynamic(
  () => import('@/components/refund/refund-image-modal')
);
const ReviewImageModal = dynamic(
  () => import('@/components/reviews/review-image-modal')
);
const QuestionReplyView = dynamic(
  () => import('@/components/question/question-reply-view')
);

const GateWayControlModal = dynamic(
  () => import('@/components/payment/gateway-control/gateway-modal'),
  { ssr: false }
);
const QuestionDeleteView = dynamic(
  () => import('@/components/question/question-delete-view')
);
const ReviewDeleteView = dynamic(
  () => import('@/components/reviews/review-delete-view')
);

const FaqDeleteView = dynamic(() => import('@/components/faq/faq-delete-view'));

const RegionsDeleteView = dynamic(
  () => import('@/components/regions/regions-delete-view')
);

const AcceptAbuseReportView = dynamic(
  () => import('@/components/reviews/acccpt-report-confirmation')
);

const DeclineAbuseReportView = dynamic(
  () => import('@/components/reviews/decline-report-confirmation')
);

const CreateOrUpdateAddressForm = dynamic(
  () => import('@/components/address/create-or-update')
);
const AddOrUpdateCheckoutContact = dynamic(
  () => import('@/components/checkout/contact/add-or-update')
);
const SelectCustomer = dynamic(
  () => import('@/components/checkout/customer/select-customer')
);

const AuthorDeleteView = dynamic(
  () => import('@/components/author/author-delete-view')
);
const ManufacturerDeleteView = dynamic(
  () => import('@/components/manufacturer/manufacturer-delete-view')
);

const ProductVariation = dynamic(
  () => import('@/components/product/variation/variation')
);
const AbuseReport = dynamic(() => import('@/components/reviews/abuse-report'));
const OpenAiModal = dynamic(() => import('@/components/openAI/openAI.modal'));
const ComposerMessage = dynamic(
  () => import('@/components/message/compose-message')
);

function renderModal(view: MODAL_VIEWS | undefined, data: any) {
  switch (view) {
    case 'DELETE_PRODUCT':
      return <ProductDeleteView />;
    case 'DELETE_TYPE':
      return <TypeDeleteView />;
    case 'DELETE_DEALER':
      return <DealerDeleteView />;
    case 'DELETE_ATTRIBUTE':
      return <AttributeDeleteView />;
    case 'DELETE_BLOG':
      return <BlogDeleteView />;
    case 'DELETE_CATEGORY':
      return <CategoryDeleteView />;
    case 'DELETE_EVENT':
      return <EventDeleteView />;
    case 'DELETE_SUBCATEGORY':
      return <SubCategoryDeleteView />;
    case 'DELETE_COUPON':
      return <CouponDeleteView />;
    case 'DELETE_TAX':
      return <TaxDeleteView />;
    case 'DELETE_STORE_NOTICE':
      return <StoreNoticeDeleteView />;
    case 'DELETE_SHIPPING':
      return <ShippingDeleteView />;
    case 'DELETE_TAG':
      return <TagDeleteView />;
    case 'DELETE_MANUFACTURER':
      return <ManufacturerDeleteView />;
    case 'DELETE_AUTHOR':
      return <AuthorDeleteView />;
    case 'BAN_CUSTOMER':
      return <BanCustomerView />;
    case 'SHOP_APPROVE_VIEW':
      return <ApproveShopView />;
    case 'SHOP_DISAPPROVE_VIEW':
      return <DisApproveShopView />;
    case 'DELETE_STAFF':
      return <RemoveStaffView />;
    case 'UPDATE_REFUND':
      return <UpdateRefundConfirmationView />;
    case 'ADD_OR_UPDATE_ADDRESS':
      return <CreateOrUpdateAddressForm />;
    case 'ADD_OR_UPDATE_CHECKOUT_CONTACT':
      return <AddOrUpdateCheckoutContact />;
    case 'REFUND_IMAGE_POPOVER':
      return <RefundImageModal />;
    case 'MAKE_ADMIN':
      return <MakeAdminView />;
    case 'EXPORT_IMPORT_PRODUCT':
      return <ExportImportView />;
    case 'MODEL_IMPORT':
      return <ModelImportView />;
    case 'EXPORT_IMPORT_ATTRIBUTE':
      return <AttributeExportImport />;
    case 'ADD_WALLET_POINTS':
      return <UserWalletPointsAddView />;
    case 'SELECT_PRODUCT_VARIATION':
      return <ProductVariation productSlug={data} />;
    case 'SELECT_CUSTOMER':
      return <SelectCustomer />;
    case 'REPLY_QUESTION':
      return <QuestionReplyView />;
    case 'DELETE_QUESTION':
      return <QuestionDeleteView />;
    case 'DELETE_REVIEW':
      return <ReviewDeleteView />;
    case 'DELETE_FAQ':
      return <FaqDeleteView />;
    case 'DELETE_VACANCY':
      return <VacancyDeleteView />;
    case 'DELETE_QNA':
      return <QnaDeleteView />;
    case 'DELETE_GET_INSPIRED':
      return <GetInspiredDeleteView />;
    case 'DELETE_CONTACTS':
      return <ContactDeleteView />;
    case 'DELETE_CAREER':
      return <CareerDeleteView />;
    case 'DELETE_REGIONS':
      return <RegionsDeleteView />;
    case 'ACCEPT_ABUSE_REPORT':
      return <AcceptAbuseReportView />;
    case 'DECLINE_ABUSE_REPORT':
      return <DeclineAbuseReportView />;
    case 'REVIEW_IMAGE_POPOVER':
      return <ReviewImageModal />;
    case 'ABUSE_REPORT':
      return <AbuseReport data={data} />;
    case 'GENERATE_DESCRIPTION':
      return <OpenAiModal />;
    case 'COMPOSE_MESSAGE':
      return <ComposerMessage />;
    default:
      return null;
  }
}

const ManagedModal = () => {
  const { isOpen, view, data } = useModalState();
  const { closeModal } = useModalAction();
  if (view === 'PAYMENT_MODAL') {
    return <PaymentModal />;
  }
  return (
    <Modal open={isOpen} onClose={closeModal}>
      {renderModal(view, data)}
      {view === 'GATEWAY_MODAL' && <GateWayControlModal />}
    </Modal>
  );
};

export default ManagedModal;
