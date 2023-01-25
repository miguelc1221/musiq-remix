import type { AriaDialogProps } from "react-aria";
import React from "react";
import { useDialog } from "react-aria";
import { IoCloseOutline } from "react-icons/io5";

interface DialogProps extends AriaDialogProps {
  children: React.ReactNode;
  title?: string;
  subTitle?: string;
  onClose: () => void;
}

export const Dialog = (props: DialogProps) => {
  let { children, onClose } = props;

  let ref = React.useRef(null);
  let { dialogProps, titleProps } = useDialog(
    {
      ...props,
      role: "dialog",
    },
    ref
  );

  return (
    <div
      {...dialogProps}
      ref={ref}
      className="flex max-h-[calc(100vh_-_150px)] flex-col overflow-hidden outline-none"
    >
      <div className="sticky flex flex-col bg-indigo-600  p-8 text-white">
        <button className="close-button self-end" onClick={onClose}>
          <span className="sr-only">Close</span>
          <IoCloseOutline aria-hidden className="h-5 w-5" />
        </button>
        <h1 {...titleProps} className="text-2xl font-bold">
          {props.title}
        </h1>
        <h2 className="text-lg">{props.subTitle}</h2>
      </div>
      <div className="overflow-y-scroll p-8">{children}</div>
    </div>
  );
};
