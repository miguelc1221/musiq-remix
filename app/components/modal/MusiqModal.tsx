import { Modal } from "./modal";
import { Dialog } from "./dialog";
import type { OverlayTriggerState } from "react-stately";

interface MusiqModalProps {
  children: React.ReactNode;
  title?: string;
  subTitle?: string;
  state: OverlayTriggerState;
}
export const MusiqModal = ({
  state,
  children,
  title,
  subTitle,
}: MusiqModalProps) => {
  return (
    <Modal state={state}>
      <Dialog title={title} subTitle={subTitle} onClose={state.close}>
        {children}
      </Dialog>
    </Modal>
  );
};
