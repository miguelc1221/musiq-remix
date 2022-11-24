import React, { useState } from "react";
import type { AriaModalOverlayProps } from "@react-aria/overlays";
import { Overlay, useModalOverlay, useOverlay } from "@react-aria/overlays";
import { CSSTransition } from "react-transition-group";
import type { OverlayTriggerState } from "react-stately";

interface ModalProps extends AriaModalOverlayProps {
  children: React.ReactNode;
  state: OverlayTriggerState;
}

export function Modal(props: ModalProps) {
  let { children, state } = props;

  let ref = React.useRef(null);
  let { modalProps, underlayProps } = useModalOverlay(props, state, ref);
  let [exited, setExited] = useState(!state.isOpen);
  let { overlayProps } = useOverlay(
    {
      onClose: state.close,
      isOpen: state.isOpen,
      isDismissable: true,
    },
    ref
  );

  // Don't render anything if the modal is not open and we're not animating out.
  if (!(state.isOpen || !exited)) {
    return null;
  }

  return (
    // Animate opacity and backdrop blur of underlay
    <Overlay {...overlayProps}>
      <CSSTransition
        in={state.isOpen}
        appear
        onEntered={() => setExited(false)}
        onExited={() => setExited(true)}
        timeout={{ enter: 0, exit: 250 }}
        classNames={{
          enter: "opacity-0",
          enterDone: "opacity-1 transition ease-in",
          exit: "opacity-0 backdrop-blur-none transition ease-out",
        }}
      >
        <div
          className="fixed inset-0 z-[9999] flex justify-center bg-slate-400/50"
          {...underlayProps}
        >
          {/* Animate modal slightly upward when entering, and downward when exiting. */}
          <CSSTransition
            in={state.isOpen}
            appear
            nodeRef={ref}
            timeout={{ enter: 0, exit: 250 }}
            classNames={{
              appear: "translate-y-2",
              appearDone: "translate-y-0 transition ease-in",
              exit: "translate-y-2 transition ease-out",
            }}
          >
            <div
              {...modalProps}
              ref={ref}
              className="z-1 relative top-[10%] h-fit max-h-[80vh] max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl focus:outline-none"
            >
              {children}
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
    </Overlay>
  );
}
